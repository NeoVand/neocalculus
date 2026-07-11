<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';

	type Scenario = {
		inputMath: string;
		outputMath: string;
		integrand: (x: number) => number;
		domain: [number, number];
		range: [number, number];
		travel: [number, number];
	};

	const scenarios: Scenario[] = [
		{
			inputMath: '1',
			outputMath: String.raw`x`,
			integrand: () => 1,
			domain: [-2.5, 2.5],
			range: [-3, 3],
			travel: [-2.25, 2.25]
		},
		{
			inputMath: String.raw`2x`,
			outputMath: String.raw`x^2`,
			integrand: (x) => 2 * x,
			domain: [-2.2, 2.2],
			range: [-4.8, 4.8],
			travel: [-1.9, 1.9]
		},
		{
			inputMath: String.raw`\cos x`,
			outputMath: String.raw`\sin x`,
			integrand: Math.cos,
			domain: [-Math.PI, Math.PI],
			range: [-1.45, 1.45],
			travel: [-2.65, 2.65]
		},
		{
			inputMath: String.raw`-\sin x`,
			outputMath: String.raw`\cos x`,
			integrand: (x) => -Math.sin(x),
			domain: [-Math.PI, Math.PI],
			range: [-1.45, 1.45],
			travel: [-2.65, 2.65]
		},
		{
			inputMath: String.raw`e^x`,
			outputMath: String.raw`e^x`,
			integrand: Math.exp,
			domain: [-2.2, 2],
			range: [-0.4, 7],
			travel: [-1.85, 1.75]
		},
		{
			inputMath: String.raw`\frac{1}{x}`,
			outputMath: String.raw`\ln x`,
			integrand: (x) => 1 / x,
			domain: [0, 5],
			range: [-1.6, 3.6],
			travel: [0.3, 4.6]
		}
	];

	const scenarioDuration = 6.6;
	const fullCycleDuration = scenarioDuration * scenarios.length;
	const VW = 560;
	const VH = 200;
	const bodyLeft = 150;
	const bodyRight = 410;
	const bodyTop = 8;
	const bodyBottom = 192;
	const bodyMid = (bodyTop + bodyBottom) / 2;
	const funnelLength = 50;
	const slotHeight = 44;
	const mouthHeight = 88;
	const funnelLeft = bodyLeft - funnelLength;
	const funnelRight = bodyRight + funnelLength;
	const pillGap = 15;
	const labelOffset = 34;
	const labelLeft = `${((funnelLeft - labelOffset) / VW) * 100}%`;
	const labelRight = `${((VW - (funnelRight + labelOffset)) / VW) * 100}%`;
	const inputRestRight = `${((VW - (funnelLeft - pillGap)) / VW) * 100}%`;
	const inputHiddenRight = `${((VW - (bodyLeft + 22)) / VW) * 100}%`;
	const outputRestLeft = `${((funnelRight + pillGap) / VW) * 100}%`;
	const outputHiddenLeft = `${((bodyRight - 22) / VW) * 100}%`;

	const plotLeft = 174;
	const plotRight = 386;
	const plotTop = 38;
	const plotBottom = 170;
	const plotWidth = plotRight - plotLeft;
	const plotHeight = plotBottom - plotTop;

	function mapPoint(x: number, y: number, scenario: Scenario) {
		const [xMin, xMax] = scenario.domain;
		const [yMin, yMax] = scenario.range;
		return {
			x: plotLeft + ((x - xMin) / (xMax - xMin)) * plotWidth,
			y: plotBottom - ((y - yMin) / (yMax - yMin)) * plotHeight
		};
	}

	function makeCurvePath(scenario: Scenario, fn: (x: number) => number) {
		const points: string[] = [];
		const [travelMin, travelMax] = scenario.travel;
		for (let i = 0; i <= 140; i += 1) {
			const x = travelMin + ((travelMax - travelMin) * i) / 140;
			const point = mapPoint(x, fn(x), scenario);
			points.push(`${i === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
		}
		return points.join(' ');
	}

	function makeAreaPath(scenario: Scenario) {
		const points: string[] = [];
		const [travelMin, travelMax] = scenario.travel;
		const axisY = mapPoint(0, 0, scenario).y;
		for (let i = 0; i <= 140; i += 1) {
			const x = travelMin + ((travelMax - travelMin) * i) / 140;
			const point = mapPoint(x, scenario.integrand(x), scenario);
			points.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
		}
		const first = mapPoint(travelMin, 0, scenario);
		const last = mapPoint(travelMax, 0, scenario);
		return `M ${first.x.toFixed(2)} ${axisY.toFixed(2)} ${points.join(' ')} L ${last.x.toFixed(2)} ${axisY.toFixed(2)} Z`;
	}

	const preparedScenarios = scenarios.map((scenario, index) => ({
		...scenario,
		index,
		integrandPath: makeCurvePath(scenario, scenario.integrand),
		areaPath: makeAreaPath(scenario),
		axisX: mapPoint(0, 0, scenario).x,
		axisY: mapPoint(0, 0, scenario).y,
		delay: `${index * scenarioDuration}s`
	}));

	function makeMachinePath(inputSpread = 0, outputSpread = 0) {
		const radius = 15;
		const leftMouth = mouthHeight + inputSpread * 3;
		const rightMouth = mouthHeight + Math.max(outputSpread, 0) * 3;
		const leftEdge = funnelLeft - inputSpread;
		const rightEdge = funnelRight + outputSpread;

		return [
			`M ${bodyLeft + radius},${bodyTop}`,
			`L ${bodyRight - radius},${bodyTop}`,
			`Q ${bodyRight},${bodyTop} ${bodyRight},${bodyTop + radius}`,
			`L ${bodyRight},${bodyMid - slotHeight / 2}`,
			`L ${rightEdge},${bodyMid - rightMouth / 2}`,
			`L ${rightEdge},${bodyMid + rightMouth / 2}`,
			`L ${bodyRight},${bodyMid + slotHeight / 2}`,
			`L ${bodyRight},${bodyBottom - radius}`,
			`Q ${bodyRight},${bodyBottom} ${bodyRight - radius},${bodyBottom}`,
			`L ${bodyLeft + radius},${bodyBottom}`,
			`Q ${bodyLeft},${bodyBottom} ${bodyLeft},${bodyBottom - radius}`,
			`L ${bodyLeft},${bodyMid + slotHeight / 2}`,
			`L ${leftEdge},${bodyMid + leftMouth / 2}`,
			`L ${leftEdge},${bodyMid - leftMouth / 2}`,
			`L ${bodyLeft},${bodyMid - slotHeight / 2}`,
			`L ${bodyLeft},${bodyTop + radius}`,
			`Q ${bodyLeft},${bodyTop} ${bodyLeft + radius},${bodyTop}`,
			'Z'
		].join(' ');
	}

	const machinePath = makeMachinePath();
	const intakePath = makeMachinePath(4, 0);
	const pinchedReleasePath = makeMachinePath(0, -2);
	const releasePath = makeMachinePath(0, 3);
	const machinePathAnimation = [
		machinePath,
		machinePath,
		intakePath,
		intakePath,
		machinePath,
		machinePath,
		pinchedReleasePath,
		releasePath,
		releasePath,
		machinePath,
		machinePath
	].join(';');
	const machinePathKeyTimes = '0;0.12;0.14;0.18;0.22;0.65;0.66;0.675;0.705;0.735;1';
</script>

<div
	id="integral-machine"
	class="integral-machine"
	style:--label-left={labelLeft}
	style:--label-right={labelRight}
	style:--input-rest-right={inputRestRight}
	style:--input-hidden-right={inputHiddenRight}
	style:--output-rest-left={outputRestLeft}
	style:--output-hidden-left={outputHiddenLeft}
	style:--full-cycle-duration={`${fullCycleDuration}s`}
	aria-label="An animated antiderivative machine. An integrand enters, the area under its curve fills from left to right, and one antiderivative emerges."
>
	<div class="machine-stage">
		<div class="side-label side-label-left"><Katex math="f(x)" /></div>
		<div class="side-label side-label-right"><Katex math={String.raw`\int f(x)\,dx`} /></div>
		<div class="machine-title">Antiderivative</div>

		{#each preparedScenarios as scenario (scenario.index)}
			<div
				class="pill-scenario scenario-layer scenario-{scenario.index}"
				style:--scenario-delay={scenario.delay}
			>
				<div class="function-pill function-pill-input">
					<Katex math={scenario.inputMath} />
				</div>
				<div class="function-pill function-pill-output">
					<Katex math={scenario.outputMath} />
				</div>
			</div>
		{/each}

		<svg
			class="machine-svg"
			viewBox={`0 0 ${VW} ${VH}`}
			role="img"
			aria-label="A blue integrand curve with its area filling from left to right"
		>
			<defs>
				<linearGradient id="integralMachineBody" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-surface-raised)"></stop>
					<stop
						offset="50%"
						stop-color="color-mix(in srgb, var(--color-surface) 84%, var(--color-d) 16%)"
					></stop>
					<stop offset="100%" stop-color="var(--color-surface-raised)"></stop>
				</linearGradient>
				<radialGradient id="integralMachineGlow" cx="50%" cy="50%" r="60%">
					<stop offset="0%" stop-color="var(--color-d)" stop-opacity="0.2"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0"></stop>
				</radialGradient>
				<radialGradient
					id="integralTravelHalo"
					cx={funnelLeft}
					cy={bodyMid}
					r="122"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0%" stop-color="var(--color-d)" stop-opacity="0.3"></stop>
					<stop offset="48%" stop-color="var(--color-d)" stop-opacity="0.11"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0"></stop>
					<animate
						attributeName="cx"
						dur={`${scenarioDuration}s`}
						repeatCount="indefinite"
						calcMode="linear"
						keyTimes="0;0.22;0.66;1"
						values={`${funnelLeft};${funnelLeft};${funnelRight};${funnelRight}`}
					></animate>
				</radialGradient>
				<clipPath id="integralPlotClip">
					<rect x={plotLeft} y={plotTop} width={plotWidth} height={plotHeight} rx="11"></rect>
				</clipPath>
				<clipPath id="integralAreaReveal">
					<rect x={plotLeft} y={plotTop - 14} width="0" height={plotHeight + 28}>
						<animate
							attributeName="width"
							dur={`${scenarioDuration}s`}
							repeatCount="indefinite"
							calcMode="linear"
							keyTimes="0;0.22;0.66;1"
							values={`0;0;${plotWidth};${plotWidth}`}
						></animate>
					</rect>
				</clipPath>
			</defs>

			<path
				d={machinePath}
				fill="url(#integralMachineBody)"
				stroke="var(--color-d)"
				stroke-width="1.8"
				stroke-linejoin="round"
			>
				<animate
					attributeName="d"
					dur={`${scenarioDuration}s`}
					repeatCount="indefinite"
					calcMode="linear"
					keyTimes={machinePathKeyTimes}
					values={machinePathAnimation}
				></animate>
			</path>
			<path d={machinePath} fill="url(#integralMachineGlow)" stroke="none" class="machine-glow">
				<animate
					attributeName="d"
					dur={`${scenarioDuration}s`}
					repeatCount="indefinite"
					calcMode="linear"
					keyTimes={machinePathKeyTimes}
					values={machinePathAnimation}
				></animate>
			</path>
			<path
				d={machinePath}
				fill="url(#integralTravelHalo)"
				stroke="none"
				opacity="0"
				class="travel-halo"
			>
				<animate
					attributeName="opacity"
					dur={`${scenarioDuration}s`}
					repeatCount="indefinite"
					calcMode="linear"
					keyTimes="0;0.18;0.22;0.66;0.70;1"
					values="0;0;1;1;0;0"
				></animate>
				<animate
					attributeName="d"
					dur={`${scenarioDuration}s`}
					repeatCount="indefinite"
					calcMode="linear"
					keyTimes={machinePathKeyTimes}
					values={machinePathAnimation}
				></animate>
			</path>

			<rect
				x={plotLeft - 9}
				y={plotTop - 9}
				width={plotWidth + 18}
				height={plotHeight + 18}
				rx="14"
				fill="var(--plot-background)"
				fill-opacity="0.72"
			></rect>

			<g clip-path="url(#integralPlotClip)">
				{#each preparedScenarios as scenario (scenario.index)}
					<g
						class="plot-scenario scenario-layer scenario-{scenario.index}"
						style:--scenario-delay={scenario.delay}
					>
						<line
							x1={plotLeft}
							y1={scenario.axisY}
							x2={plotRight}
							y2={scenario.axisY}
							stroke="var(--plot-axis)"
							stroke-width="0.8"
						></line>
						<line
							x1={scenario.axisX}
							y1={plotTop}
							x2={scenario.axisX}
							y2={plotBottom}
							stroke="var(--plot-axis)"
							stroke-width="0.8"
						></line>
						<g class="area-reveal" clip-path="url(#integralAreaReveal)">
							<path d={scenario.areaPath} fill="var(--color-d)" opacity="0.24"></path>
						</g>
						<path
							d={scenario.integrandPath}
							fill="none"
							stroke="var(--plot-curve)"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</g>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.integral-machine {
		display: flex;
		justify-content: center;
		width: 100%;
		padding: 0.5rem 0 1.15rem;
	}

	.machine-stage {
		position: relative;
		width: 100%;
		max-width: 610px;
		aspect-ratio: 560 / 200;
	}

	.machine-svg {
		position: absolute;
		inset: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.machine-title {
		position: absolute;
		top: 7.1%;
		left: 50%;
		z-index: 4;
		transform: translateX(-50%);
		color: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1;
		pointer-events: none;
	}

	.machine-glow {
		opacity: 0.18;
		animation: machine-breathe 6.6s ease-in-out infinite;
	}

	.side-label {
		position: absolute;
		top: 13%;
		z-index: 4;
		color: var(--color-ink-faint);
		pointer-events: none;
	}

	.side-label-left {
		left: var(--label-left);
		transform: translateX(-50%);
	}

	.side-label-right {
		right: var(--label-right);
		transform: translateX(50%);
	}

	.side-label :global(.katex) {
		font-size: 1em;
		color: var(--color-ink-faint);
	}

	.scenario-layer {
		opacity: 0;
		animation: scenario-window var(--full-cycle-duration) linear var(--scenario-delay) infinite;
	}

	.pill-scenario {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.function-pill {
		position: absolute;
		top: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 3.25rem;
		min-height: 2.35rem;
		padding: 0.28rem 0.65rem;
		border: 1.8px solid var(--color-d);
		border-radius: 999px;
		background: radial-gradient(
			circle at 40% 40%,
			var(--color-surface-raised),
			color-mix(in srgb, var(--color-surface) 82%, var(--color-d) 18%)
		);
		white-space: nowrap;
		opacity: 0;
	}

	.function-pill :global(.katex) {
		font-size: 1em;
		color: var(--color-d);
	}

	.function-pill-input {
		right: var(--input-rest-right);
		transform: translateY(-50%);
		animation: input-cycle 6.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	.function-pill-output {
		left: var(--output-hidden-left);
		transform: translateY(-50%);
		animation: output-cycle 6.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
	}

	@keyframes scenario-window {
		0% {
			opacity: 0;
		}
		0.9%,
		16.667% {
			opacity: 1;
		}
		17.57%,
		100% {
			opacity: 0;
		}
	}

	@keyframes input-cycle {
		0%,
		2% {
			right: var(--input-rest-right);
			opacity: 0;
		}
		5%,
		13% {
			right: var(--input-rest-right);
			opacity: 1;
		}
		22%,
		100% {
			right: var(--input-hidden-right);
			opacity: 0;
		}
	}

	@keyframes output-cycle {
		0%,
		66% {
			left: var(--output-hidden-left);
			opacity: 0;
		}
		72%,
		88% {
			left: var(--output-rest-left);
			opacity: 1;
		}
		96%,
		100% {
			left: var(--output-rest-left);
			opacity: 0;
		}
	}

	@keyframes machine-breathe {
		0%,
		100% {
			opacity: 0.12;
		}
		38%,
		72% {
			opacity: 0.32;
		}
	}

	@media (max-width: 520px) {
		.machine-stage {
			max-width: 390px;
		}

		.machine-title {
			top: 6.2%;
			font-size: 0.58rem;
			letter-spacing: 0.055em;
		}

		.function-pill {
			min-width: 2.35rem;
			min-height: 1.9rem;
			padding: 0.2rem 0.38rem;
		}

		.function-pill :global(.katex),
		.side-label :global(.katex) {
			font-size: 0.74em;
		}

		.function-pill-input {
			padding-inline: 0.28rem;
		}

		.function-pill-input :global(.katex) {
			font-size: 0.7em;
		}

		.function-pill-output {
			min-width: 2.1rem;
			padding-inline: 0.13rem;
		}

		.function-pill-output :global(.katex) {
			font-size: 0.62em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.machine-glow,
		.scenario-layer,
		.function-pill {
			animation: none;
		}

		.scenario-layer.scenario-0 {
			opacity: 1;
		}

		.scenario-layer:not(.scenario-0) {
			display: none;
		}

		.function-pill-input {
			right: var(--input-rest-right);
			opacity: 1;
		}

		.function-pill-output {
			left: var(--output-rest-left);
			opacity: 1;
		}

		.travel-halo {
			display: none;
		}

		.area-reveal {
			clip-path: none;
		}
	}
</style>
