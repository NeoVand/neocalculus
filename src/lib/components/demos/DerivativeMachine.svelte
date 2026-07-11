<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';

	type Scenario = {
		inputMath: string;
		outputMath: string;
		name: string;
		fn: (x: number) => number;
		derivative: (x: number) => number;
		domain: [number, number];
		range: [number, number];
		travel: [number, number];
	};

	const scenarios: Scenario[] = [
		{
			inputMath: String.raw`\sin x`,
			outputMath: String.raw`\cos x`,
			name: 'sine',
			fn: Math.sin,
			derivative: Math.cos,
			domain: [-Math.PI, Math.PI],
			range: [-1.35, 1.35],
			travel: [-2.55, 2.55]
		},
		{
			inputMath: String.raw`\cos x`,
			outputMath: String.raw`-\sin x`,
			name: 'cosine',
			fn: Math.cos,
			derivative: (x) => -Math.sin(x),
			domain: [-Math.PI, Math.PI],
			range: [-1.35, 1.35],
			travel: [-2.55, 2.55]
		},
		{
			inputMath: String.raw`x^2`,
			outputMath: String.raw`2x`,
			name: 'the squaring function',
			fn: (x) => x * x,
			derivative: (x) => 2 * x,
			domain: [-2.2, 2.2],
			range: [-0.55, 5.1],
			travel: [-1.75, 1.75]
		},
		{
			inputMath: String.raw`x^3`,
			outputMath: String.raw`3x^2`,
			name: 'the cubing function',
			fn: (x) => x * x * x,
			derivative: (x) => 3 * x * x,
			domain: [-1.8, 1.8],
			range: [-4.8, 4.8],
			travel: [-1.55, 1.55]
		},
		{
			inputMath: String.raw`e^x`,
			outputMath: String.raw`e^x`,
			name: 'the exponential function',
			fn: Math.exp,
			derivative: Math.exp,
			domain: [-2.2, 2.2],
			range: [-0.5, 8],
			travel: [-1.8, 1.8]
		},
		{
			inputMath: String.raw`\ln x`,
			outputMath: String.raw`\frac{1}{x}`,
			name: 'the natural logarithm',
			fn: Math.log,
			derivative: (x) => 1 / x,
			domain: [0, 5],
			range: [-2, 1.8],
			travel: [0.22, 4.65]
		},
		{
			inputMath: String.raw`\frac{1}{x}`,
			outputMath: String.raw`-\frac{1}{x^2}`,
			name: 'the reciprocal function',
			fn: (x) => 1 / x,
			derivative: (x) => -1 / (x * x),
			domain: [0, 5],
			range: [-0.2, 3.7],
			travel: [0.32, 4.6]
		},
		{
			inputMath: String.raw`\tan x`,
			outputMath: String.raw`\sec^2 x`,
			name: 'the tangent function',
			fn: Math.tan,
			derivative: (x) => 1 / Math.cos(x) ** 2,
			domain: [-1.2, 1.2],
			range: [-2.65, 2.65],
			travel: [-1.08, 1.08]
		}
	];

	const scenarioDuration = 6.6;
	const fullCycleDuration = scenarioDuration * scenarios.length;
	const VW = 560;
	const VH = 200;
	const bodyLeft = 145;
	const bodyRight = 415;
	const bodyTop = 8;
	const bodyBottom = 192;
	const bodyMid = (bodyTop + bodyBottom) / 2;
	const funnelLength = 54;
	const slotHeight = 44;
	const mouthHeight = 88;
	const funnelLeft = bodyLeft - funnelLength;
	const funnelRight = bodyRight + funnelLength;
	const pillGap = 13;
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

	function makeCurvePath(scenario: Scenario) {
		const points: string[] = [];
		const [travelMin, travelMax] = scenario.travel;
		for (let i = 0; i <= 140; i += 1) {
			const x = travelMin + ((travelMax - travelMin) * i) / 140;
			const point = mapPoint(x, scenario.fn(x), scenario);
			points.push(`${i === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`);
		}
		return points.join(' ');
	}

	function tangentSegment(scenario: Scenario, x0: number) {
		const [xMin, xMax] = scenario.domain;
		const [yMin, yMax] = scenario.range;
		const y0 = scenario.fn(x0);
		const slope = scenario.derivative(x0);
		const candidates: { x: number; y: number }[] = [];
		const add = (x: number, y: number) => {
			if (x >= xMin - 1e-6 && x <= xMax + 1e-6 && y >= yMin - 1e-6 && y <= yMax + 1e-6) {
				candidates.push({ x, y });
			}
		};

		add(xMin, y0 + slope * (xMin - x0));
		add(xMax, y0 + slope * (xMax - x0));
		if (Math.abs(slope) > 1e-7) {
			add(x0 + (yMin - y0) / slope, yMin);
			add(x0 + (yMax - y0) / slope, yMax);
		}

		let first = candidates[0] ?? { x: xMin, y: y0 };
		let second = candidates[1] ?? { x: xMax, y: y0 };
		let greatestDistance = -1;
		for (let i = 0; i < candidates.length; i += 1) {
			for (let j = i + 1; j < candidates.length; j += 1) {
				const distance =
					(candidates[i].x - candidates[j].x) ** 2 + (candidates[i].y - candidates[j].y) ** 2;
				if (distance > greatestDistance) {
					greatestDistance = distance;
					first = candidates[i];
					second = candidates[j];
				}
			}
		}

		return {
			start: mapPoint(first.x, first.y, scenario),
			end: mapPoint(second.x, second.y, scenario),
			point: mapPoint(x0, y0, scenario)
		};
	}

	const preparedScenarios = scenarios.map((scenario, index) => ({
		...scenario,
		index,
		pathId: `derivative-path-${index}`,
		path: makeCurvePath(scenario),
		axisX: mapPoint(0, 0, scenario).x,
		axisY: mapPoint(0, 0, scenario).y,
		staticTangent: tangentSegment(scenario, 0),
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
	id="derivative-machine"
	class="derivative-machine"
	style:--label-left={labelLeft}
	style:--label-right={labelRight}
	style:--input-rest-right={inputRestRight}
	style:--input-hidden-right={inputHiddenRight}
	style:--output-rest-left={outputRestLeft}
	style:--output-hidden-left={outputHiddenLeft}
	style:--full-cycle-duration={`${fullCycleDuration}s`}
	aria-label="An animated derivative machine. A function enters, a tangent moves along its graph, and the derivative function emerges."
>
	<div class="machine-stage">
		<div class="side-label side-label-left"><Katex math="f(x)" /></div>
		<div class="side-label side-label-right"><Katex math="f'(x)" /></div>
		<div class="machine-title">Derivative</div>

		{#each preparedScenarios as scenario (scenario.pathId)}
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
			aria-label="A point and tangent moving together along three function graphs"
		>
			<defs>
				<linearGradient id="derivativeMachineBody" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-surface-raised)"></stop>
					<stop
						offset="50%"
						stop-color="color-mix(in srgb, var(--color-surface) 84%, var(--color-d) 16%)"
					></stop>
					<stop offset="100%" stop-color="var(--color-surface-raised)"></stop>
				</linearGradient>
				<radialGradient id="derivativeMachineGlow" cx="50%" cy="50%" r="60%">
					<stop offset="0%" stop-color="var(--color-d)" stop-opacity="0.2"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0"></stop>
				</radialGradient>
				<radialGradient
					id="derivativeTravelHalo"
					cx={funnelLeft}
					cy={bodyMid}
					r="126"
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
				<clipPath id="derivativePlotClip">
					<rect x={plotLeft} y={plotTop} width={plotWidth} height={plotHeight} rx="11"></rect>
				</clipPath>
			</defs>

			<path
				d={machinePath}
				fill="url(#derivativeMachineBody)"
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
			<path d={machinePath} fill="url(#derivativeMachineGlow)" stroke="none" class="machine-glow">
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
				fill="url(#derivativeTravelHalo)"
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

			<g clip-path="url(#derivativePlotClip)">
				{#each preparedScenarios as scenario (scenario.pathId)}
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
						<path
							id={scenario.pathId}
							d={scenario.path}
							fill="none"
							stroke="var(--plot-curve)"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>

						<g class="moving-tangent" opacity="0">
							<line
								x1="-82"
								y1="0"
								x2="82"
								y2="0"
								stroke="var(--plot-tangent)"
								stroke-width="1.8"
								stroke-linecap="round"
							></line>
							<circle
								cx="0"
								cy="0"
								r="5"
								fill="var(--plot-point)"
								stroke="var(--plot-outline)"
								stroke-width="1.5"
							></circle>
							<animate
								attributeName="opacity"
								dur={`${scenarioDuration}s`}
								repeatCount="indefinite"
								calcMode="linear"
								keyTimes="0;0.22;0.24;0.66;0.70;1"
								values="0;0;1;1;0;0"
							></animate>
							<animateMotion
								dur={`${scenarioDuration}s`}
								repeatCount="indefinite"
								rotate="auto"
								calcMode="linear"
								keyPoints="0;0;1;1"
								keyTimes="0;0.22;0.66;1"
							>
								<mpath href={`#${scenario.pathId}`}></mpath>
							</animateMotion>
						</g>

						<g class="static-tangent">
							<line
								x1={scenario.staticTangent.start.x}
								y1={scenario.staticTangent.start.y}
								x2={scenario.staticTangent.end.x}
								y2={scenario.staticTangent.end.y}
								stroke="var(--plot-tangent)"
								stroke-width="1.8"
								stroke-linecap="round"
							></line>
							<circle
								cx={scenario.staticTangent.point.x}
								cy={scenario.staticTangent.point.y}
								r="5"
								fill="var(--plot-point)"
								stroke="var(--plot-outline)"
								stroke-width="1.5"
							></circle>
						</g>
					</g>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.derivative-machine {
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
		font-size: 1.04em;
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
		padding: 0.28rem 0.7rem;
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
		font-size: 1.04em;
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

	.plot-scenario {
		transform-box: fill-box;
	}

	.static-tangent {
		display: none;
	}

	@keyframes scenario-window {
		0% {
			opacity: 0;
		}
		0.7%,
		12.5% {
			opacity: 1;
		}
		13.2%,
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

		.function-pill {
			min-width: 2.5rem;
			min-height: 1.9rem;
			padding: 0.2rem 0.48rem;
		}

		.function-pill :global(.katex),
		.side-label :global(.katex) {
			font-size: 0.78em;
		}

		.function-pill-input {
			padding-inline: 0.4rem;
		}

		.function-pill-output {
			min-width: 2.25rem;
			padding-inline: 0.18rem;
		}

		.function-pill-output :global(.katex) {
			font-size: 0.74em;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.machine-glow,
		.scenario-layer,
		.function-pill,
		.moving-tangent {
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

		.moving-tangent {
			display: none;
		}

		.travel-halo {
			display: none;
		}

		.static-tangent {
			display: block;
		}
	}
</style>
