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
		}
	];

	const CYCLE_MS = 6600;
	const VW = 560;
	const VH = 220;
	const bodyLeft = 145;
	const bodyRight = 415;
	const bodyTop = 10;
	const bodyBottom = 210;
	const bodyMid = (bodyTop + bodyBottom) / 2;
	const funnelLength = 54;
	const slotHeight = 48;
	const mouthHeight = 98;
	const funnelLeft = bodyLeft - funnelLength;
	const funnelRight = bodyRight + funnelLength;
	const pillMargin = 34;
	const restLeft = `${((funnelLeft - pillMargin) / VW) * 100}%`;
	const restRight = `${((VW - (funnelRight + pillMargin)) / VW) * 100}%`;
	const swallowedLeft = `${((bodyLeft + 22) / VW) * 100}%`;
	const hiddenRight = `${((VW - (bodyRight - 22)) / VW) * 100}%`;

	const plotLeft = 174;
	const plotRight = 386;
	const plotTop = 36;
	const plotBottom = 184;
	const plotWidth = plotRight - plotLeft;
	const plotHeight = plotBottom - plotTop;

	let elapsed = $state(0);

	let cycleIndex = $derived(Math.floor(elapsed / CYCLE_MS));
	let localTime = $derived(elapsed % CYCLE_MS);
	let scenario = $derived(scenarios[cycleIndex % scenarios.length]);

	function clamp(value: number, min = 0, max = 1) {
		return Math.min(max, Math.max(min, value));
	}

	function smoothstep(value: number) {
		const t = clamp(value);
		return t * t * (3 - 2 * t);
	}

	function mapPoint(x: number, y: number, current: Scenario) {
		const [xMin, xMax] = current.domain;
		const [yMin, yMax] = current.range;
		return {
			x: plotLeft + ((x - xMin) / (xMax - xMin)) * plotWidth,
			y: plotBottom - ((y - yMin) / (yMax - yMin)) * plotHeight
		};
	}

	function makeCurve(current: Scenario) {
		const points: string[] = [];
		const [xMin, xMax] = current.domain;
		for (let i = 0; i <= 120; i += 1) {
			const x = xMin + ((xMax - xMin) * i) / 120;
			const point = mapPoint(x, current.fn(x), current);
			points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
		}
		return points.join(' ');
	}

	function tangentSegment(current: Scenario, x0: number) {
		const [xMin, xMax] = current.domain;
		const [yMin, yMax] = current.range;
		const y0 = current.fn(x0);
		const slope = current.derivative(x0);
		const candidates: { x: number; y: number }[] = [];
		const addCandidate = (x: number, y: number) => {
			if (x >= xMin - 1e-6 && x <= xMax + 1e-6 && y >= yMin - 1e-6 && y <= yMax + 1e-6) {
				candidates.push({ x, y });
			}
		};

		addCandidate(xMin, y0 + slope * (xMin - x0));
		addCandidate(xMax, y0 + slope * (xMax - x0));
		if (Math.abs(slope) > 1e-7) {
			addCandidate(x0 + (yMin - y0) / slope, yMin);
			addCandidate(x0 + (yMax - y0) / slope, yMax);
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
			start: mapPoint(first.x, first.y, current),
			end: mapPoint(second.x, second.y, current)
		};
	}

	let travelProgress = $derived(smoothstep((localTime - 1550) / 2650));
	let movingX = $derived(
		scenario.travel[0] + (scenario.travel[1] - scenario.travel[0]) * travelProgress
	);
	let movingPoint = $derived(mapPoint(movingX, scenario.fn(movingX), scenario));
	let tangent = $derived(tangentSegment(scenario, movingX));
	let curvePoints = $derived(makeCurve(scenario));
	let curveOpacity = $derived(
		smoothstep(localTime / 420) * (1 - smoothstep((localTime - 5900) / 520))
	);
	let tangentOpacity = $derived(
		smoothstep((localTime - 1300) / 280) * (1 - smoothstep((localTime - 5450) / 420))
	);
	let axisX = $derived(mapPoint(0, 0, scenario).x);
	let axisY = $derived(mapPoint(0, 0, scenario).y);
	let inputVisible = $derived(localTime >= 180 && localTime < 1450);
	let inputSwallowing = $derived(localTime >= 820 && localTime < 1450);
	let outputVisible = $derived(localTime >= 4250 && localTime < 6150);
	let outputFading = $derived(localTime >= 5850 && localTime < 6300);
	let machineActive = $derived(localTime >= 1050 && localTime < 4650);

	let machinePath = $derived.by(() => {
		const inputSpread = inputSwallowing ? 4 : 0;
		const outputSpread = outputVisible ? 3 : 0;
		const leftFunnel = funnelLeft - inputSpread;
		const rightFunnel = funnelRight + outputSpread;
		const inputMouth = mouthHeight + inputSpread * 3;
		const outputMouth = mouthHeight + outputSpread * 3;
		const radius = 15;
		return [
			`M ${bodyLeft + radius},${bodyTop}`,
			`L ${bodyRight - radius},${bodyTop}`,
			`Q ${bodyRight},${bodyTop} ${bodyRight},${bodyTop + radius}`,
			`L ${bodyRight},${bodyMid - slotHeight / 2}`,
			`L ${rightFunnel},${bodyMid - outputMouth / 2}`,
			`L ${rightFunnel},${bodyMid + outputMouth / 2}`,
			`L ${bodyRight},${bodyMid + slotHeight / 2}`,
			`L ${bodyRight},${bodyBottom - radius}`,
			`Q ${bodyRight},${bodyBottom} ${bodyRight - radius},${bodyBottom}`,
			`L ${bodyLeft + radius},${bodyBottom}`,
			`Q ${bodyLeft},${bodyBottom} ${bodyLeft},${bodyBottom - radius}`,
			`L ${bodyLeft},${bodyMid + slotHeight / 2}`,
			`L ${leftFunnel},${bodyMid + inputMouth / 2}`,
			`L ${leftFunnel},${bodyMid - inputMouth / 2}`,
			`L ${bodyLeft},${bodyMid - slotHeight / 2}`,
			`L ${bodyLeft},${bodyTop + radius}`,
			`Q ${bodyLeft},${bodyTop} ${bodyLeft + radius},${bodyTop}`,
			'Z'
		].join(' ');
	});

	function animateMachine(node: HTMLDivElement) {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			elapsed = 5000;
			return;
		}

		let frame = 0;
		let previous = performance.now();
		let visible = true;
		let pageVisible = document.visibilityState === 'visible';

		const observer = new IntersectionObserver(
			(entries) => {
				visible = entries[0]?.isIntersecting ?? false;
				previous = performance.now();
			},
			{ threshold: 0.08 }
		);
		observer.observe(node);

		const handleVisibility = () => {
			pageVisible = document.visibilityState === 'visible';
			previous = performance.now();
		};
		document.addEventListener('visibilitychange', handleVisibility);

		const tick = (now: number) => {
			if (visible && pageVisible) {
				elapsed += Math.min(now - previous, 50);
			}
			previous = now;
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			document.removeEventListener('visibilitychange', handleVisibility);
		};
	}
</script>

<div
	class="derivative-machine"
	{@attach animateMachine}
	style:--rest-left={restLeft}
	style:--rest-right={restRight}
	style:--swallowed-left={swallowedLeft}
	style:--hidden-right={hiddenRight}
	aria-label="An animated derivative machine. A function enters, a tangent moves along its graph, and the derivative function emerges."
>
	<div class="machine-stage">
		<div class="side-label side-label-left"><Katex math="f(x)" /></div>
		<div class="side-label side-label-right"><Katex math="f'(x)" /></div>

		<div
			class="function-pill function-pill-input"
			class:visible={inputVisible}
			class:swallowing={inputSwallowing}
		>
			<Katex math={scenario.inputMath} />
		</div>

		<svg
			class="machine-svg"
			viewBox={`0 0 ${VW} ${VH}`}
			role="img"
			aria-label={`The graph of ${scenario.name} with a tangent moving along it`}
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
				class="machine-body"
			></path>
			<path
				d={machinePath}
				fill="url(#derivativeMachineGlow)"
				stroke="none"
				class:active={machineActive}
				class="machine-glow"
			></path>

			<rect
				x={plotLeft - 9}
				y={plotTop - 9}
				width={plotWidth + 18}
				height={plotHeight + 18}
				rx="14"
				fill="var(--plot-background)"
				fill-opacity="0.72"
			></rect>

			<g clip-path="url(#derivativePlotClip)" opacity={curveOpacity}>
				<line
					x1={plotLeft}
					y1={axisY}
					x2={plotRight}
					y2={axisY}
					stroke="var(--plot-axis)"
					stroke-width="0.8"
				></line>
				<line
					x1={axisX}
					y1={plotTop}
					x2={axisX}
					y2={plotBottom}
					stroke="var(--plot-axis)"
					stroke-width="0.8"
				></line>
				<polyline
					points={curvePoints}
					fill="none"
					stroke="var(--plot-curve)"
					stroke-width="2.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></polyline>
				<g opacity={tangentOpacity}>
					<line
						x1={tangent.start.x}
						y1={tangent.start.y}
						x2={tangent.end.x}
						y2={tangent.end.y}
						stroke="var(--plot-tangent)"
						stroke-width="1.8"
						stroke-linecap="round"
					></line>
					<circle
						cx={movingPoint.x}
						cy={movingPoint.y}
						r="5"
						fill="var(--plot-point)"
						stroke="var(--plot-outline)"
						stroke-width="1.5"
					></circle>
				</g>
			</g>
		</svg>

		<div
			class="function-pill function-pill-output"
			class:visible={outputVisible}
			class:fading={outputFading}
		>
			<Katex math={scenario.outputMath} />
		</div>
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
		aspect-ratio: 560 / 220;
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

	.machine-body {
		transition: d 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.machine-glow {
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.machine-glow.active {
		opacity: 1;
	}

	.side-label {
		position: absolute;
		top: 13%;
		z-index: 3;
		color: var(--color-ink-faint);
		pointer-events: none;
	}

	.side-label-left {
		left: var(--rest-left);
		transform: translateX(-50%);
	}

	.side-label-right {
		right: var(--rest-right);
		transform: translateX(50%);
	}

	.side-label :global(.katex) {
		font-size: 1.04em;
		color: var(--color-ink-faint);
	}

	.function-pill {
		position: absolute;
		top: 50%;
		z-index: 1;
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
		left: var(--rest-left);
		transform: translate(-50%, -50%);
		transition:
			left 0.56s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.35s ease;
	}

	.function-pill-input.visible {
		opacity: 1;
	}

	.function-pill-input.swallowing {
		left: var(--swallowed-left);
		opacity: 0;
		transition:
			left 0.56s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.18s 0.38s ease;
	}

	.function-pill-output {
		right: var(--hidden-right);
		transform: translate(50%, -50%);
		transition:
			right 0.58s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.34s ease;
	}

	.function-pill-output.visible {
		right: var(--rest-right);
		opacity: 1;
	}

	.function-pill-output.fading {
		opacity: 0;
		transition: opacity 0.42s ease;
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
	}

	@media (prefers-reduced-motion: reduce) {
		.machine-body,
		.machine-glow,
		.function-pill {
			transition: none;
		}
	}
</style>
