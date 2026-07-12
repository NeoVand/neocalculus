<script lang="ts">
	import SliderField from './SliderField.svelte';

	type Preset = 'wave' | 'hill' | 'ripples' | 'zero';
	type Lane = { top: number; bottom: number; min: number; max: number };

	const width = 700;
	const height = 620;
	const left = 64;
	const right = 678;
	const xMin = -3;
	const xMax = 3;
	const count = 121;
	const dx = (xMax - xMin) / (count - 1);
	const topLane: Lane = { top: 44, bottom: 194, min: -1.5, max: 1.5 };
	const derivativeLane: Lane = { top: 238, bottom: 388, min: -2.5, max: 2.5 };
	const accumulationLane: Lane = { top: 432, bottom: 582, min: -2.5, max: 2.5 };
	const xs = Array.from({ length: count }, (_, index) => xMin + index * dx);

	let values = $state(xs.map((x) => 0.88 * Math.sin(x)));
	let probe = $state(0.6);
	let selectedPreset = $state<Preset | null>('wave');
	let drawing = false;
	let previousIndex = -1;
	let previousValue = 0;

	const derivative = $derived.by(() => {
		return values.map((_, index) => {
			if (index === 0) return (values[1] - values[0]) / dx;
			if (index === count - 1) return (values[count - 1] - values[count - 2]) / dx;
			return (values[index + 1] - values[index - 1]) / (2 * dx);
		});
	});

	const accumulation = $derived.by(() => {
		const result = Array(count).fill(0);
		for (let index = 1; index < count; index += 1) {
			result[index] = result[index - 1] + 0.5 * (values[index - 1] + values[index]) * dx;
		}
		return result;
	});

	const probeIndex = $derived(
		Math.max(0, Math.min(count - 1, Math.round(((probe - xMin) / (xMax - xMin)) * (count - 1))))
	);
	const probeX = $derived(xs[probeIndex]);
	const functionValue = $derived(values[probeIndex]);
	const derivativeValue = $derived(derivative[probeIndex]);
	const accumulationValue = $derived(accumulation[probeIndex]);

	function sx(x: number) {
		return left + ((x - xMin) / (xMax - xMin)) * (right - left);
	}

	function sy(value: number, lane: Lane) {
		const clamped = Math.max(lane.min, Math.min(lane.max, value));
		return lane.bottom - ((clamped - lane.min) / (lane.max - lane.min)) * (lane.bottom - lane.top);
	}

	function linePath(data: number[], lane: Lane) {
		return data
			.map(
				(value, index) =>
					(index === 0 ? 'M ' : 'L ') + sx(xs[index]).toFixed(2) + ' ' + sy(value, lane).toFixed(2)
			)
			.join(' ');
	}

	function areaPath(data: number[], stop: number) {
		const axis = sy(0, topLane).toFixed(2);
		let path = 'M ' + sx(xs[0]).toFixed(2) + ' ' + axis;
		for (let index = 0; index <= stop; index += 1) {
			path += ' L ' + sx(xs[index]).toFixed(2) + ' ' + sy(data[index], topLane).toFixed(2);
		}
		path += ' L ' + sx(xs[stop]).toFixed(2) + ' ' + axis + ' Z';
		return path;
	}

	function tangentPath() {
		const slope = functionValue;
		const x1 = Math.max(xMin, probeX - 0.7);
		const x2 = Math.min(xMax, probeX + 0.7);
		const y1 = accumulationValue + slope * (x1 - probeX);
		const y2 = accumulationValue + slope * (x2 - probeX);
		return (
			'M ' +
			sx(x1).toFixed(2) +
			' ' +
			sy(y1, accumulationLane).toFixed(2) +
			' L ' +
			sx(x2).toFixed(2) +
			' ' +
			sy(y2, accumulationLane).toFixed(2)
		);
	}

	function applyPreset(preset: Preset) {
		selectedPreset = preset;
		values = xs.map((x) => {
			if (preset === 'wave') return 0.88 * Math.sin(x);
			if (preset === 'hill') return 1.18 * Math.exp(-0.72 * x * x) - 0.28;
			if (preset === 'ripples') return 0.68 * Math.sin(1.35 * x) + 0.24 * Math.sin(2.7 * x);
			return 0;
		});
	}

	function graphPoint(event: PointerEvent) {
		const target = event.currentTarget as SVGRectElement;
		const svg = target.ownerSVGElement;
		if (!svg) return { index: 0, value: 0 };
		const rect = svg.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * width;
		const y = ((event.clientY - rect.top) / rect.height) * height;
		const index = Math.max(
			0,
			Math.min(count - 1, Math.round(((x - left) / (right - left)) * (count - 1)))
		);
		const raw =
			topLane.max -
			((y - topLane.top) / (topLane.bottom - topLane.top)) * (topLane.max - topLane.min);
		return { index, value: Math.max(topLane.min, Math.min(topLane.max, raw)) };
	}

	function paint(index: number, value: number) {
		const next = [...values];
		const start = previousIndex < 0 ? index : previousIndex;
		const distance = Math.max(1, Math.abs(index - start));
		const direction = index >= start ? 1 : -1;
		for (let step = 0; step <= distance; step += 1) {
			const center = start + direction * step;
			const mix = step / distance;
			const target = previousIndex < 0 ? value : previousValue + (value - previousValue) * mix;
			for (let offset = -4; offset <= 4; offset += 1) {
				const sample = center + offset;
				if (sample < 0 || sample >= count) continue;
				const weight = Math.exp(-(offset * offset) / 5.5) * 0.62;
				next[sample] = next[sample] * (1 - weight) + target * weight;
			}
		}
		values = next;
		selectedPreset = null;
		previousIndex = index;
		previousValue = value;
	}

	function startDrawing(event: PointerEvent) {
		const target = event.currentTarget as SVGRectElement;
		target.setPointerCapture(event.pointerId);
		drawing = true;
		previousIndex = -1;
		const point = graphPoint(event);
		paint(point.index, point.value);
	}

	function continueDrawing(event: PointerEvent) {
		if (!drawing) return;
		const point = graphPoint(event);
		paint(point.index, point.value);
	}

	function stopDrawing(event: PointerEvent) {
		drawing = false;
		previousIndex = -1;
		const target = event.currentTarget as SVGRectElement;
		if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
	}

	function format(value: number) {
		const clean = Math.abs(value) < 0.005 ? 0 : value;
		return clean.toFixed(2);
	}

	const gridXs = [-2, -1, 0, 1, 2];
</script>

<div class="calculus-lab">
	<div class="lab-heading">
		<div>
			<span class="eyebrow">Draw one curve</span>
			<h4>Watch calculus answer twice</h4>
		</div>
		<p>Drag across the blue lane. The derivative and running accumulation respond immediately.</p>
	</div>

	<div class="preset-row" aria-label="Example functions">
		<button class:active={selectedPreset === 'wave'} onclick={() => applyPreset('wave')}
			>Sine wave</button
		>
		<button class:active={selectedPreset === 'hill'} onclick={() => applyPreset('hill')}
			>Gaussian hill</button
		>
		<button class:active={selectedPreset === 'ripples'} onclick={() => applyPreset('ripples')}
			>Two waves</button
		>
		<button class:active={selectedPreset === 'zero'} onclick={() => applyPreset('zero')}
			>Clear canvas</button
		>
	</div>

	<div class="plot-shell">
		<svg
			viewBox="0 0 {width} {height}"
			role="application"
			aria-label="Editable function with its derivative and running accumulation. Drag in the top blue graph to redraw the function."
		>
			<defs>
				<linearGradient id="signed-area" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stop-color="var(--calc-green)" stop-opacity="0.34" />
					<stop offset="1" stop-color="var(--calc-green)" stop-opacity="0.08" />
				</linearGradient>
				<filter id="point-glow" x="-100%" y="-100%" width="300%" height="300%">
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
				</filter>
			</defs>

			{#each [topLane, derivativeLane, accumulationLane] as lane (lane.top)}
				<rect
					class="lane-bg"
					x={left}
					y={lane.top}
					width={right - left}
					height={lane.bottom - lane.top}
					rx="12"
				/>
				{#each gridXs as tick (tick)}
					<line class="grid-line" x1={sx(tick)} x2={sx(tick)} y1={lane.top} y2={lane.bottom} />
				{/each}
				<line class="axis" x1={left} x2={right} y1={sy(0, lane)} y2={sy(0, lane)} />
			{/each}

			<path class="area" d={areaPath(values, probeIndex)} />
			<path class="function-curve" d={linePath(values, topLane)} />
			<path class="derivative-curve" d={linePath(derivative, derivativeLane)} />
			<path class="accumulation-curve" d={linePath(accumulation, accumulationLane)} />
			<path class="accumulation-tangent" d={tangentPath()} />

			<line
				class="probe-line"
				x1={sx(probeX)}
				x2={sx(probeX)}
				y1={topLane.top}
				y2={accumulationLane.bottom}
			/>
			<circle
				class="point function-point"
				cx={sx(probeX)}
				cy={sy(functionValue, topLane)}
				r="5.5"
			/>
			<circle
				class="point derivative-point"
				cx={sx(probeX)}
				cy={sy(derivativeValue, derivativeLane)}
				r="5.5"
			/>
			<circle
				class="point accumulation-point"
				cx={sx(probeX)}
				cy={sy(accumulationValue, accumulationLane)}
				r="5.5"
			/>

			<text class="lane-label function-label" x="20" y={topLane.top + 19}>f</text>
			<text class="lane-title" x={left + 14} y={topLane.top + 23}>your function</text>
			<text class="draw-hint" x={right - 16} y={topLane.top + 23} text-anchor="end"
				>drag here to draw</text
			>
			<text class="lane-label derivative-label" x="20" y={derivativeLane.top + 19}>f′</text>
			<text class="lane-title" x={left + 14} y={derivativeLane.top + 23}>slope at every point</text>
			<text class="lane-label accumulation-label" x="14" y={accumulationLane.top + 19}>A</text>
			<text class="lane-title" x={left + 14} y={accumulationLane.top + 23}
				>signed area gathered from the left</text
			>
			<text class="tangent-note" x={right - 16} y={accumulationLane.top + 23} text-anchor="end"
				>blue tangent: slope = f(x)</text
			>
			<rect
				class="draw-surface"
				role="application"
				aria-label="Draw the blue function by dragging across this lane"
				x={left}
				y={topLane.top}
				width={right - left}
				height={topLane.bottom - topLane.top}
				rx="12"
				onpointerdown={startDrawing}
				onpointermove={continueDrawing}
				onpointerup={stopDrawing}
				onpointercancel={stopDrawing}
				onpointerleave={(event) => {
					if (drawing && event.buttons === 0) stopDrawing(event);
				}}
			/>
		</svg>
	</div>

	<div class="identity-strip">
		<div>
			<span class="dot blue"></span><small>input</small><strong
				>f({format(probeX)}) = {format(functionValue)}</strong
			>
		</div>
		<div>
			<span class="dot violet"></span><small>local change</small><strong
				>f′({format(probeX)}) = {format(derivativeValue)}</strong
			>
		</div>
		<div>
			<span class="dot green"></span><small>running total</small><strong
				>A({format(probeX)}) = {format(accumulationValue)}</strong
			>
		</div>
		<div class="reversal"><small>fundamental theorem</small><strong>A′(x) = f(x)</strong></div>
	</div>

	<div class="probe-control">
		<SliderField
			label="Move the shared probe"
			min={xMin}
			max={xMax}
			step={dx}
			decimals={2}
			tone="teal"
			bind:value={probe}
		/>
	</div>
</div>

<style>
	.calculus-lab {
		--calc-blue: var(--plot-blue);
		--calc-violet: var(--plot-violet);
		--calc-green: var(--plot-teal);
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}

	.lab-heading {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.8fr);
		align-items: end;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.lab-heading h4 {
		margin: 0.16rem 0 0;
		font-family: var(--font-display);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 500;
	}

	.lab-heading p {
		margin: 0;
		color: var(--color-ink-light);
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.eyebrow {
		color: var(--calc-violet);
		font-family: var(--font-sans);
		font-size: 0.71rem;
		font-weight: 800;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.preset-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-bottom: 0.75rem;
	}

	.preset-row button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 76%, transparent);
		color: var(--color-ink-light);
		padding: 0.48rem 0.8rem;
		font: 650 0.76rem/1 var(--font-sans);
		cursor: pointer;
		transition:
			border-color 160ms ease,
			background 160ms ease,
			color 160ms ease,
			transform 160ms ease;
	}

	.preset-row button:hover,
	.preset-row button:focus-visible {
		border-color: color-mix(in srgb, var(--calc-blue) 62%, var(--color-border-light));
		color: var(--color-ink);
		transform: translateY(-1px);
	}

	.preset-row button.active {
		border-color: color-mix(in srgb, var(--calc-blue) 70%, var(--color-border-light));
		background: color-mix(in srgb, var(--calc-blue) 13%, var(--color-surface-raised));
		color: var(--color-ink);
	}

	.plot-shell {
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 18px;
		background:
			radial-gradient(
				circle at 82% 15%,
				color-mix(in srgb, var(--calc-violet) 8%, transparent),
				transparent 34%
			),
			color-mix(in srgb, var(--color-surface-raised) 82%, var(--plot-background));
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 41rem;
		user-select: none;
	}

	.draw-surface {
		fill: transparent;
		touch-action: none;
		cursor: crosshair;
	}

	.lane-bg {
		fill: color-mix(in srgb, var(--plot-background) 90%, transparent);
		stroke: color-mix(in srgb, var(--color-border-light) 78%, transparent);
		stroke-width: 1;
	}

	.grid-line,
	.axis {
		vector-effect: non-scaling-stroke;
	}

	.grid-line {
		stroke: color-mix(in srgb, var(--color-ink-faint) 15%, transparent);
		stroke-width: 1;
	}

	.axis {
		stroke: color-mix(in srgb, var(--color-ink-faint) 38%, transparent);
		stroke-width: 1.15;
	}

	.area {
		fill: url(#signed-area);
		stroke: none;
	}

	.function-curve,
	.derivative-curve,
	.accumulation-curve,
	.accumulation-tangent {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.function-curve {
		stroke: var(--calc-blue);
		stroke-width: 3;
	}

	.derivative-curve {
		stroke: var(--calc-violet);
		stroke-width: 2.65;
	}

	.accumulation-curve {
		stroke: var(--calc-green);
		stroke-width: 2.65;
	}

	.accumulation-tangent {
		stroke: var(--calc-blue);
		stroke-width: 2;
		stroke-dasharray: 5 4;
	}

	.probe-line {
		stroke: color-mix(in srgb, var(--color-ink) 42%, transparent);
		stroke-width: 1.25;
		stroke-dasharray: 3 6;
		vector-effect: non-scaling-stroke;
	}

	.point {
		stroke: var(--plot-background);
		stroke-width: 2.2;
		filter: url(#point-glow);
		vector-effect: non-scaling-stroke;
	}

	.function-point {
		fill: var(--calc-blue);
	}
	.derivative-point {
		fill: var(--calc-violet);
	}
	.accumulation-point {
		fill: var(--calc-green);
	}

	text {
		font-family: var(--font-sans);
		pointer-events: none;
	}

	.lane-label {
		font-size: 25px;
		font-weight: 760;
		font-style: italic;
	}

	.function-label {
		fill: var(--calc-blue);
	}
	.derivative-label {
		fill: var(--calc-violet);
	}
	.accumulation-label {
		fill: var(--calc-green);
	}

	.lane-title {
		fill: var(--plot-muted);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.04em;
	}

	.draw-hint {
		fill: var(--calc-blue);
		font-size: 11px;
		font-weight: 700;
	}

	.tangent-note {
		fill: var(--calc-blue);
		font-size: 11px;
		font-weight: 700;
	}

	.identity-strip {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0;
		margin-top: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 14px;
		background: color-mix(in srgb, var(--color-surface-raised) 74%, transparent);
	}

	.identity-strip > div {
		position: relative;
		display: grid;
		gap: 0.16rem;
		min-width: 0;
		padding: 0.78rem 0.85rem 0.74rem 1.12rem;
		border-right: 1px solid var(--color-border-light);
	}

	.identity-strip > div:last-child {
		border-right: 0;
	}

	.identity-strip small {
		color: var(--color-ink-faint);
		font: 700 0.63rem/1.2 var(--font-sans);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.identity-strip strong {
		overflow: hidden;
		color: var(--color-ink);
		font: 650 0.84rem/1.35 var(--font-sans);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dot {
		position: absolute;
		top: 1.03rem;
		left: 0.56rem;
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 50%;
	}

	.dot.blue {
		background: var(--calc-blue);
	}
	.dot.violet {
		background: var(--calc-violet);
	}
	.dot.green {
		background: var(--calc-green);
	}

	.identity-strip .reversal {
		place-content: center;
		padding-left: 0.85rem;
		text-align: center;
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--calc-green) 10%, transparent),
			color-mix(in srgb, var(--calc-blue) 9%, transparent)
		);
	}

	.probe-control {
		margin-top: 0.85rem;
		padding: 0 0.15rem;
	}

	@media (max-width: 680px) {
		.lab-heading {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}

		.preset-row {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
		}

		.preset-row button {
			min-height: 2.35rem;
		}

		.plot-shell {
			border-radius: 14px;
		}

		.identity-strip {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.identity-strip > div:nth-child(2) {
			border-right: 0;
		}

		.identity-strip > div:nth-child(-n + 2) {
			border-bottom: 1px solid var(--color-border-light);
		}

		.lane-title,
		.draw-hint,
		.tangent-note {
			font-size: 20px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preset-row button {
			transition: none;
		}
	}
</style>
