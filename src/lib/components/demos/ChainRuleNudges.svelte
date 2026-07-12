<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	type FunctionKey = 'scale' | 'square' | 'sine';
	type FunctionSpec = {
		key: FunctionKey;
		name: string;
		apply: (value: number) => number;
		derivative: (value: number) => number;
		expressionText: (variable: string) => string;
		expressionMath: (variable: string) => string;
		derivativeText: (variable: string) => string;
		derivativeMath: (variable: string) => string;
	};

	const functions: Record<FunctionKey, FunctionSpec> = {
		scale: {
			key: 'scale',
			name: 'Scale by 2',
			apply: (value) => 2 * value,
			derivative: () => 2,
			expressionText: (variable) => `2${variable}`,
			expressionMath: (variable) => `2${variable}`,
			derivativeText: () => '2',
			derivativeMath: () => '2'
		},
		square: {
			key: 'square',
			name: 'Square',
			apply: (value) => value * value,
			derivative: (value) => 2 * value,
			expressionText: (variable) => `${variable}²`,
			expressionMath: (variable) => `(${variable})^2`,
			derivativeText: (variable) => `2${variable}`,
			derivativeMath: (variable) => `2${variable}`
		},
		sine: {
			key: 'sine',
			name: 'Sine',
			apply: Math.sin,
			derivative: Math.cos,
			expressionText: (variable) => `sin ${variable}`,
			expressionMath: (variable) => `\\sin(${variable})`,
			derivativeText: (variable) => `cos ${variable}`,
			derivativeMath: (variable) => `\\cos(${variable})`
		}
	};

	const functionChoices = Object.values(functions);
	const d = 0.1;
	const xMin = 0.3;
	const xMax = 1.15;
	const lineLeft = 126;
	const lineRight = 824;
	const laneX = 76;
	const laneU = 188;
	const laneY = 300;

	let x = $state(0.76);
	let innerKey = $state<FunctionKey>('scale');
	let outerKey = $state<FunctionKey>('square');
	let innerFunction = $derived(functions[innerKey]);
	let outerFunction = $derived(functions[outerKey]);
	let u = $derived(innerFunction.apply(x));
	let y = $derived(outerFunction.apply(u));
	let innerSlope = $derived(innerFunction.derivative(x));
	let outerSlope = $derived(outerFunction.derivative(u));
	let du = $derived(innerSlope * d);
	let dy = $derived(outerSlope * du);
	let innerExpressionText = $derived(innerFunction.expressionText('x'));
	let outerExpressionText = $derived(outerFunction.expressionText('u'));
	let innerDerivativeText = $derived(innerFunction.derivativeText('x'));
	let outerDerivativeText = $derived(outerFunction.derivativeText('u'));
	let innerDerivativeMath = $derived(innerFunction.derivativeMath('x'));
	let outerDerivativeMath = $derived(outerFunction.derivativeMath('u'));
	let innerNudgeMath = $derived(`${innerDerivativeMath}\\,d`);
	let outputNudgeMath = $derived(`(${outerDerivativeMath})(${innerDerivativeMath})\\,d`);
	let compositionMath = $derived(outerFunction.expressionMath(innerFunction.expressionMath('x')));

	function makeDomain(inner: FunctionSpec, outer: FunctionSpec) {
		const values = [0];
		for (let index = 0; index <= 80; index += 1) {
			const input = xMin + ((xMax - xMin) * index) / 80;
			const middle = inner.apply(input);
			const innerChange = inner.derivative(input) * d;
			const output = outer.apply(middle);
			const outerChange = outer.derivative(middle) * innerChange;
			values.push(input, input + d, middle, middle + innerChange, output, output + outerChange);
		}
		const minimum = Math.min(...values);
		const maximum = Math.max(...values);
		const span = Math.max(1.35, maximum - minimum);
		return {
			min: minimum - span * 0.09,
			max: maximum + span * 0.13
		};
	}

	let domain = $derived(makeDomain(innerFunction, outerFunction));
	let tickStep = $derived(domain.max - domain.min > 2.8 ? 1 : 0.5);
	let ticks = $derived(
		Array.from({ length: Math.floor(domain.max / tickStep) + 1 }, (_, index) => index * tickStep)
	);

	function scale(value: number) {
		return lineLeft + ((value - domain.min) / (domain.max - domain.min)) * (lineRight - lineLeft);
	}

	function swapFunctions() {
		const previousInner = innerKey;
		innerKey = outerKey;
		outerKey = previousInner;
	}

	let x0 = $derived(scale(x));
	let x1 = $derived(scale(x + d));
	let u0 = $derived(scale(u));
	let u1 = $derived(scale(u + du));
	let y0 = $derived(scale(y));
	let y1 = $derived(scale(y + dy));

	let innerRibbon = $derived(
		`M ${x0} ${laneX} L ${x1} ${laneX} L ${u1} ${laneU} L ${u0} ${laneU} Z`
	);
	let outerRibbon = $derived(
		`M ${u0} ${laneU} L ${u1} ${laneU} L ${y1} ${laneY} L ${y0} ${laneY} Z`
	);
	let fullDerivative = $derived(innerSlope * outerSlope);
</script>

<div id="chain-rule-nudges" class="chain-rule-nudges">
	<DemoHeader title="Explore: follow one nudge through a composition" />

	<div class="function-composer" aria-label="Choose the two functions in the composition">
		<div class="composer-stage">
			<label for="chain-inner-function">Inner function</label>
			<select id="chain-inner-function" bind:value={innerKey}>
				{#each functionChoices as choice (choice.key)}
					<option value={choice.key}>{choice.name}</option>
				{/each}
			</select>
		</div>

		<button
			class="swap-button"
			type="button"
			onclick={swapFunctions}
			aria-label="Swap the inner and outer functions"
			title="Swap the order"
		>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3"></path>
			</svg>
		</button>

		<div class="composer-stage">
			<label for="chain-outer-function">Outer function</label>
			<select id="chain-outer-function" bind:value={outerKey}>
				{#each functionChoices as choice (choice.key)}
					<option value={choice.key}>{choice.name}</option>
				{/each}
			</select>
		</div>

		<div class="composition-readout">
			<span>composition</span>
			<Katex math={`y=${compositionMath}`} />
		</div>
	</div>

	<div class="visual-shell">
		<svg
			class="nudge-diagram"
			viewBox="0 0 920 374"
			role="img"
			aria-label="Three linked number lines show one small input nudge passing through the selected inner and outer functions."
		>
			<defs>
				<linearGradient id="chainInnerRibbon" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-result)" stop-opacity="0.2"></stop>
					<stop offset="100%" stop-color="var(--color-success)" stop-opacity="0.1"></stop>
				</linearGradient>
				<linearGradient id="chainOuterRibbon" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-success)" stop-opacity="0.18"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0.1"></stop>
				</linearGradient>
				<filter id="chainNudgeGlow" x="-60%" y="-100%" width="220%" height="300%">
					<feGaussianBlur stdDeviation="5" result="blur"></feGaussianBlur>
					<feMerge>
						<feMergeNode in="blur"></feMergeNode>
						<feMergeNode in="SourceGraphic"></feMergeNode>
					</feMerge>
				</filter>
				<marker
					id="chainArrowBlue"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="4.25"
					markerHeight="4.25"
					orient="auto"
				>
					<path d="M0 0 L8 4 L0 8 Z" fill="var(--color-result)"></path>
				</marker>
				<marker
					id="chainArrowGreen"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="4.25"
					markerHeight="4.25"
					orient="auto"
				>
					<path d="M0 0 L8 4 L0 8 Z" fill="var(--color-success)"></path>
				</marker>
				<marker
					id="chainArrowViolet"
					viewBox="0 0 8 8"
					refX="7"
					refY="4"
					markerWidth="4.25"
					markerHeight="4.25"
					orient="auto"
				>
					<path d="M0 0 L8 4 L0 8 Z" fill="var(--color-d)"></path>
				</marker>
			</defs>

			<path class="ribbon ribbon-inner" d={innerRibbon} fill="url(#chainInnerRibbon)"></path>
			<path class="ribbon ribbon-outer" d={outerRibbon} fill="url(#chainOuterRibbon)"></path>

			{#each [laneX, laneU, laneY] as lane (lane)}
				<line class="number-line" x1={lineLeft} x2={lineRight} y1={lane} y2={lane}></line>
				{#each ticks as tick (tick)}
					<line class="number-tick" x1={scale(tick)} x2={scale(tick)} y1={lane - 4} y2={lane + 4}
					></line>
				{/each}
			{/each}

			<text class="lane-kicker" x="34" y={laneX - 16}>INPUT</text>
			<text class="lane-label" x="34" y={laneX + 8}>x</text>
			<text class="lane-kicker" x="34" y={laneU - 16}>INNER</text>
			<text class="lane-label" x="34" y={laneU + 8}>u = {innerExpressionText}</text>
			<text class="lane-kicker" x="34" y={laneY - 16}>OUTER</text>
			<text class="lane-label" x="34" y={laneY + 8}>y = {outerExpressionText}</text>

			<text class="nudge-name nudge-name-blue" x="884" y={laneX - 13} text-anchor="end">d</text>
			<text class="nudge-name nudge-name-green" x="884" y={laneU - 13} text-anchor="end">
				du = {innerDerivativeText}·d
			</text>
			<text class="nudge-name nudge-name-violet" x="884" y={laneY - 13} text-anchor="end">
				dy = {outerDerivativeText}·du
			</text>

			<g class="nudge nudge-input">
				<line class="nudge-glow nudge-glow-blue" x1={x0} x2={x1} y1={laneX} y2={laneX}></line>
				<line
					class="nudge-arrow nudge-arrow-blue"
					x1={x0}
					x2={x1}
					y1={laneX}
					y2={laneX}
					marker-end="url(#chainArrowBlue)"
				></line>
				<circle class="base-point base-point-blue" cx={x0} cy={laneX} r="6"></circle>
				<circle class="signal-halo signal-halo-blue" cx={x1} cy={laneX} r="12"></circle>
			</g>

			<g class="nudge nudge-inner">
				<line class="nudge-glow nudge-glow-green" x1={u0} x2={u1} y1={laneU} y2={laneU}></line>
				<line
					class="nudge-arrow nudge-arrow-green"
					x1={u0}
					x2={u1}
					y1={laneU}
					y2={laneU}
					marker-end="url(#chainArrowGreen)"
				></line>
				<circle class="base-point base-point-green" cx={u0} cy={laneU} r="6"></circle>
				<circle class="signal-halo signal-halo-green" cx={u1} cy={laneU} r="12"></circle>
			</g>

			<g class="nudge nudge-output">
				<line class="nudge-glow nudge-glow-violet" x1={y0} x2={y1} y1={laneY} y2={laneY}></line>
				<line
					class="nudge-arrow nudge-arrow-violet"
					x1={y0}
					x2={y1}
					y1={laneY}
					y2={laneY}
					marker-end="url(#chainArrowViolet)"
				></line>
				<circle class="base-point base-point-violet" cx={y0} cy={laneY} r="6"></circle>
				<circle class="signal-halo signal-halo-violet" cx={y1} cy={laneY} r="12"></circle>
			</g>

			<g class="stage-label stage-label-inner">
				<text x="846" y="131" text-anchor="end">
					stretch by {innerDerivativeText} = {innerSlope.toFixed(2)}
				</text>
			</g>
			<g class="stage-label stage-label-outer">
				<text x="846" y="243" text-anchor="end">
					stretch by {outerDerivativeText} = {outerSlope.toFixed(2)}
				</text>
			</g>

			<text class="point-value" x={x0} y={laneX + 28} text-anchor="middle">
				x = {x.toFixed(2)}
			</text>
			<text class="point-value" x={u0} y={laneU + 28} text-anchor="middle">
				u = {u.toFixed(2)}
			</text>
			<text class="point-value" x={y0} y={laneY + 28} text-anchor="middle">
				y = {y.toFixed(2)}
			</text>
		</svg>

		<div class="equation-flow" aria-live="polite">
			<div class="flow-step flow-input"><Katex math="d" /></div>
			<div class="flow-operator">
				<span>inner stretch</span>
				<Katex math={`\\times\\,${innerDerivativeMath}`} />
			</div>
			<div class="flow-step flow-inner"><Katex math={innerNudgeMath} /></div>
			<div class="flow-operator">
				<span>outer stretch</span>
				<Katex math={`\\times\\,${outerDerivativeMath}`} />
			</div>
			<div class="flow-step flow-output">
				<Katex math={outputNudgeMath} />
			</div>
		</div>

		<div class="live-conclusion">
			<span>overall local stretch</span>
			<Katex
				math={`\\dfrac{dy}{dx}=(${outerDerivativeMath})(${innerDerivativeMath})\\approx ${fullDerivative.toFixed(2)}`}
			/>
		</div>
	</div>

	<div class="control-row">
		<SliderField
			label="Move the starting input x"
			min={xMin}
			max={xMax}
			step={0.01}
			decimals={2}
			tone="blue"
			bind:value={x}
			hint="The same small d passes through both local stretches."
		/>
	</div>
</div>

<style>
	.chain-rule-nudges {
		width: 100%;
	}

	.function-composer {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) minmax(9.5rem, auto);
		align-items: end;
		gap: 0.7rem;
		margin-bottom: 0.78rem;
		padding: 0.15rem 0.12rem 0.72rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.composer-stage {
		display: grid;
		gap: 0.3rem;
		min-width: 0;
	}

	.composer-stage label,
	.composition-readout span {
		font-family: var(--font-sans);
		font-size: 0.63rem;
		font-weight: 700;
		letter-spacing: 0.085em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.composer-stage select {
		width: 100%;
		min-height: 2.15rem;
		padding: 0.34rem 1.8rem 0.34rem 0.62rem;
		border: 1px solid var(--color-border);
		border-radius: 9px;
		background: var(--color-surface-raised);
		color: var(--color-ink);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
	}

	.composer-stage select:focus-visible,
	.swap-button:focus-visible {
		outline: 2px solid var(--color-d);
		outline-offset: 2px;
	}

	.swap-button {
		display: grid;
		place-items: center;
		width: 2.15rem;
		height: 2.15rem;
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: 50%;
		background: transparent;
		color: var(--color-ink-light);
		cursor: pointer;
		transition:
			color 160ms ease,
			border-color 160ms ease,
			background 160ms ease;
	}

	.swap-button:hover {
		border-color: var(--color-d);
		background: var(--color-d-soft);
		color: var(--color-d);
	}

	.swap-button svg {
		width: 1.05rem;
		height: 1.05rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.composition-readout {
		display: grid;
		justify-items: end;
		gap: 0.28rem;
		min-width: 0;
		padding-bottom: 0.34rem;
		color: var(--color-d);
		white-space: nowrap;
	}

	.composition-readout :global(.katex) {
		font-size: 0.92em;
	}

	.visual-shell {
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 16px;
		background:
			radial-gradient(circle at 52% 46%, var(--color-d-soft), transparent 44%),
			linear-gradient(180deg, var(--color-surface-raised), var(--color-surface));
	}

	.nudge-diagram {
		display: block;
		width: 100%;
		height: auto;
	}

	.number-line {
		stroke: var(--color-border);
		stroke-width: 2;
		stroke-linecap: round;
	}

	.number-tick {
		stroke: var(--color-ink-faint);
		stroke-width: 1;
		opacity: 0.38;
	}

	.ribbon {
		stroke-width: 1;
		stroke-linejoin: round;
	}

	.ribbon-inner {
		stroke: color-mix(in srgb, var(--color-success) 30%, transparent);
		animation: ribbon-inner-pulse 6s ease-in-out infinite;
	}

	.ribbon-outer {
		stroke: color-mix(in srgb, var(--color-d) 30%, transparent);
		animation: ribbon-outer-pulse 6s ease-in-out infinite;
	}

	.lane-kicker {
		fill: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.13em;
	}

	.lane-label {
		fill: var(--color-ink);
		font-family: var(--font-serif);
		font-size: 25px;
		font-style: italic;
	}

	.nudge-name {
		font-family: var(--font-serif);
		font-size: 22px;
		font-style: italic;
	}

	.nudge-name-blue {
		fill: var(--color-result);
	}

	.nudge-name-green {
		fill: var(--color-success);
	}

	.nudge-name-violet {
		fill: var(--color-d);
	}

	.nudge-glow {
		stroke-width: 10;
		stroke-linecap: round;
		opacity: 0.18;
		filter: url(#chainNudgeGlow);
	}

	.nudge-glow-blue {
		stroke: var(--color-result);
	}

	.nudge-glow-green {
		stroke: var(--color-success);
	}

	.nudge-glow-violet {
		stroke: var(--color-d);
	}

	.nudge-arrow {
		stroke-width: 3.2;
		stroke-linecap: round;
	}

	.nudge-arrow-blue {
		stroke: var(--color-result);
	}

	.nudge-arrow-green {
		stroke: var(--color-success);
	}

	.nudge-arrow-violet {
		stroke: var(--color-d);
	}

	.base-point {
		stroke: var(--color-surface-raised);
		stroke-width: 3;
	}

	.base-point-blue {
		fill: var(--color-result);
	}

	.base-point-green {
		fill: var(--color-success);
	}

	.base-point-violet {
		fill: var(--color-d);
	}

	.signal-halo {
		stroke: none;
		transform-box: fill-box;
		transform-origin: center;
	}

	.signal-halo-blue {
		fill: var(--color-result);
		animation: pulse-input 6s ease-in-out infinite;
	}

	.signal-halo-green {
		fill: var(--color-success);
		animation: pulse-inner 6s ease-in-out infinite;
	}

	.signal-halo-violet {
		fill: var(--color-d);
		animation: pulse-output 6s ease-in-out infinite;
	}

	.stage-label text {
		fill: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 17px;
		font-weight: 600;
		letter-spacing: 0.015em;
	}

	.point-value {
		fill: var(--color-ink-light);
		font-family: var(--font-mono);
		font-size: 16px;
	}

	.equation-flow {
		display: grid;
		grid-template-columns: minmax(64px, auto) 1fr minmax(82px, auto) 1fr minmax(150px, auto);
		align-items: center;
		gap: 0.55rem;
		padding: 0.9rem 1.15rem;
		border-top: 1px solid var(--color-border-light);
	}

	.flow-step {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 2.3rem;
		border-radius: 999px;
		font-size: 0.9rem;
	}

	.flow-input {
		color: var(--color-result);
		background: color-mix(in srgb, var(--color-result) 10%, transparent);
	}

	.flow-inner {
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
	}

	.flow-output {
		color: var(--color-d);
		background: var(--color-d-soft);
	}

	.flow-operator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.42rem;
		color: var(--color-ink-light);
		font-size: 0.78rem;
	}

	.flow-operator span {
		font-family: var(--font-sans);
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.live-conclusion {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.7rem;
		padding: 0.74rem 1rem 0.86rem;
		border-top: 1px solid var(--color-border-light);
		color: var(--color-d);
	}

	.live-conclusion span {
		font-family: var(--font-sans);
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.control-row {
		max-width: 34rem;
		margin: 0.9rem auto 0;
	}

	@keyframes ribbon-inner-pulse {
		0%,
		18%,
		100% {
			opacity: 0.38;
		}
		28%,
		43% {
			opacity: 1;
		}
		55% {
			opacity: 0.52;
		}
	}

	@keyframes ribbon-outer-pulse {
		0%,
		42%,
		100% {
			opacity: 0.34;
		}
		55%,
		72% {
			opacity: 1;
		}
		82% {
			opacity: 0.48;
		}
	}

	@keyframes pulse-input {
		0%,
		4%,
		30%,
		100% {
			opacity: 0;
			transform: scale(0.6);
		}
		10%,
		22% {
			opacity: 0.22;
			transform: scale(1.35);
		}
	}

	@keyframes pulse-inner {
		0%,
		28%,
		54%,
		100% {
			opacity: 0;
			transform: scale(0.6);
		}
		36%,
		47% {
			opacity: 0.22;
			transform: scale(1.35);
		}
	}

	@keyframes pulse-output {
		0%,
		53%,
		82%,
		100% {
			opacity: 0;
			transform: scale(0.6);
		}
		62%,
		75% {
			opacity: 0.24;
			transform: scale(1.35);
		}
	}

	@media (max-width: 700px) {
		.function-composer {
			grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
			gap: 0.55rem;
		}

		.composition-readout {
			grid-column: 1 / -1;
			justify-items: center;
			padding: 0.15rem 0 0;
		}

		.visual-shell {
			border-radius: 13px;
		}

		.nudge-diagram {
			width: 100%;
			margin-left: 0;
		}

		.lane-kicker,
		.nudge-name,
		.stage-label {
			display: none;
		}

		.lane-label {
			font-size: 34px;
		}

		.point-value {
			font-size: 28px;
		}

		.equation-flow {
			grid-template-columns: 1fr auto 1fr;
			gap: 0.45rem;
			padding: 0.8rem;
		}

		.flow-operator {
			gap: 0.2rem;
		}

		.flow-operator span {
			display: none;
		}

		.flow-output {
			grid-column: 1 / -1;
			justify-self: center;
			min-width: min(100%, 15rem);
		}

		.live-conclusion {
			flex-direction: column;
			gap: 0.3rem;
		}
	}

	@media (max-width: 480px) {
		.equation-flow {
			font-size: 0.82rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ribbon,
		.signal-halo {
			animation: none;
		}

		.signal-halo {
			opacity: 0.14;
		}
	}
</style>
