<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	const d = 0.1;
	const lineLeft = 126;
	const lineRight = 824;
	const domainMin = -0.15;
	const domainMax = 1.75;
	const laneX = 76;
	const laneU = 188;
	const laneY = 300;
	const ticks = [0, 0.5, 1, 1.5];

	let x = $state(0.76);
	let u = $derived(x * x);
	let y = $derived(Math.sin(u));
	let innerSlope = $derived(2 * x);
	let outerSlope = $derived(Math.cos(u));
	let du = $derived(innerSlope * d);
	let dy = $derived(outerSlope * du);

	function scale(value: number) {
		return lineLeft + ((value - domainMin) / (domainMax - domainMin)) * (lineRight - lineLeft);
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

	<div class="visual-shell">
		<svg
			class="nudge-diagram"
			viewBox="0 0 920 374"
			role="img"
			aria-label="Three linked number lines show an input nudge d becoming 2x d under the square function, then cos of u times 2x d under the sine function."
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
			<text class="lane-label" x="34" y={laneU + 8}>u = x²</text>
			<text class="lane-kicker" x="34" y={laneY - 16}>OUTER</text>
			<text class="lane-label" x="34" y={laneY + 8}>y = sin u</text>

			<text class="nudge-name nudge-name-blue" x="884" y={laneX - 13} text-anchor="end">d</text>
			<text class="nudge-name nudge-name-green" x="884" y={laneU - 13} text-anchor="end">
				du = 2x·d
			</text>
			<text class="nudge-name nudge-name-violet" x="884" y={laneY - 13} text-anchor="end">
				dy = cos(u)·du
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
				<text x="846" y="131" text-anchor="end">stretch by 2x = {innerSlope.toFixed(2)}</text>
			</g>
			<g class="stage-label stage-label-outer">
				<text x="846" y="243" text-anchor="end">
					stretch by cos(u) = {outerSlope.toFixed(2)}
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
				<Katex math={String.raw`\times,2x`} />
			</div>
			<div class="flow-step flow-inner"><Katex math={String.raw`2x\,d`} /></div>
			<div class="flow-operator">
				<span>outer stretch</span>
				<Katex math={String.raw`\times,\cos(x^2)`} />
			</div>
			<div class="flow-step flow-output">
				<Katex math={String.raw`\cos(x^2)\,2x\,d`} />
			</div>
		</div>

		<div class="live-conclusion">
			<span>overall local stretch</span>
			<Katex
				math={String.raw`\dfrac{dy}{dx}=\cos(x^2)\cdot 2x\approx ${fullDerivative.toFixed(2)}`}
			/>
		</div>
	</div>

	<div class="control-row">
		<SliderField
			label="Move the starting input x"
			min={0.3}
			max={1.15}
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
