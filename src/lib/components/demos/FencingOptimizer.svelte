<script lang="ts">
	let width = $state(18);
	let height = $derived(50 - width);
	let area = $derived(width * height);
	let rectangleWidth = $derived(width * 3.2);
	let rectangleHeight = $derived(height * 3.2);
	let rectangleX = $derived(165 - rectangleWidth / 2);
	let rectangleY = $derived(135 - rectangleHeight / 2);
	let plotX = $derived(350 + (width / 50) * 260);
	let plotY = $derived(240 - (area / 625) * 190);
	let feedback = $derived(
		Math.abs(width - 25) < 0.25
			? 'You found the largest area.'
			: width < 25
				? 'A slightly wider rectangle would enclose more area.'
				: 'A slightly narrower rectangle would enclose more area.'
	);

	const areaPath = Array.from({ length: 101 }, (_, index) => {
		const x = index / 2;
		const a = x * (50 - x);
		return `${350 + (x / 50) * 260},${240 - (a / 625) * 190}`;
	}).join(' ');
</script>

<div class="optimizer">
	<div class="optimizer-heading">
		<div>
			<span class="eyebrow">100 metres of fencing</span>
			<strong>Build the largest rectangle you can</strong>
		</div>
		<div class="area-readout" aria-live="polite">
			<span>Area</span>
			<strong>{area.toFixed(1)} m²</strong>
		</div>
	</div>

	<svg
		class="optimizer-graphic"
		viewBox="0 0 640 280"
		role="img"
		aria-labelledby="fence-title fence-description"
	>
		<title id="fence-title">A rectangle and its area graph</title>
		<desc id="fence-description">
			The rectangle has side lengths {width.toFixed(1)} metres and {height.toFixed(1)} metres.
			Its area is {area.toFixed(1)} square metres. A point marks this value on the graph of area
			against width.
		</desc>

		<g class="rectangle-panel">
			<text x="165" y="24" text-anchor="middle" class="panel-title">Your rectangle</text>
			<rect
				x={rectangleX}
				y={rectangleY}
				width={rectangleWidth}
				height={rectangleHeight}
				rx="3"
				class="fenced-area"
			/>
			<text x="165" y={Math.min(258, rectangleY + rectangleHeight + 22)} text-anchor="middle" class="dimension">
				x = {width.toFixed(1)} m
			</text>
			<text
				x={Math.min(320, rectangleX + rectangleWidth + 10)}
				y={rectangleY + rectangleHeight / 2}
				class="dimension"
				dominant-baseline="middle"
			>
				{height.toFixed(1)} m
			</text>
		</g>

		<g class="graph-panel">
			<text x="480" y="24" text-anchor="middle" class="panel-title">Area as x changes</text>
			<line x1="350" y1="240" x2="616" y2="240" class="axis" />
			<line x1="350" y1="244" x2="350" y2="42" class="axis" />
			<polyline points={areaPath} class="area-curve" />
			<line x1={plotX} y1={plotY} x2={plotX} y2="240" class="guide" />
			<circle cx={plotX} cy={plotY} r="6" class="area-point" />
			<text x="350" y="258" text-anchor="middle" class="tick">0</text>
			<text x="480" y="258" text-anchor="middle" class="tick">25</text>
			<text x="610" y="258" text-anchor="middle" class="tick">50</text>
			<text x="480" y="276" text-anchor="middle" class="axis-label">side x (m)</text>
			<text x="342" y="54" text-anchor="end" class="tick">625</text>
		</g>
	</svg>

	<label class="slider-row">
		<span>Choose the side <i>x</i></span>
		<input type="range" min="0" max="50" step="0.5" bind:value={width} />
		<output>{width.toFixed(1)} m</output>
	</label>
	<p class:found={Math.abs(width - 25) < 0.25} class="feedback">{feedback}</p>
</div>

<style>
	.optimizer {
		border: 1px solid var(--color-border-light);
		border-radius: 0.8rem;
		background: linear-gradient(145deg, #ffffff, #faf8ff);
		padding: 1.1rem;
		font-family: var(--font-sans);
	}

	.optimizer-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	.optimizer-heading strong {
		display: block;
		color: var(--color-ink);
		font-size: 1rem;
	}

	.eyebrow {
		display: block;
		margin-bottom: 0.15rem;
		color: var(--color-d);
		font-size: 0.7rem;
		font-weight: 750;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.area-readout {
		min-width: 7.5rem;
		text-align: right;
	}

	.area-readout span {
		display: block;
		color: var(--color-ink-faint);
		font-size: 0.72rem;
		text-transform: uppercase;
	}

	.area-readout strong {
		color: var(--color-d);
		font-size: 1.12rem;
		font-variant-numeric: tabular-nums;
	}

	.optimizer-graphic {
		display: block;
		width: 100%;
		height: auto;
		margin: 0.65rem 0;
	}

	.panel-title,
	.dimension,
	.tick,
	.axis-label {
		font-family: var(--font-sans);
		fill: var(--color-ink-light);
	}

	.panel-title {
		font-size: 12px;
		font-weight: 700;
	}

	.dimension,
	.tick {
		font-size: 10px;
		font-variant-numeric: tabular-nums;
	}

	.axis-label {
		font-size: 10px;
		font-style: italic;
	}

	.fenced-area {
		fill: rgba(168, 85, 247, 0.12);
		stroke: var(--color-d);
		stroke-width: 3;
	}

	.axis {
		stroke: #b9b4c0;
		stroke-width: 1.2;
	}

	.area-curve {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.guide {
		stroke: var(--color-d);
		stroke-width: 1.2;
		stroke-dasharray: 4 4;
	}

	.area-point {
		fill: var(--color-d);
		stroke: white;
		stroke-width: 2;
	}

	.slider-row {
		display: grid;
		grid-template-columns: auto 1fr 4.7rem;
		align-items: center;
		gap: 0.8rem;
		color: var(--color-ink-light);
		font-size: 0.86rem;
		font-weight: 650;
	}

	.slider-row input {
		width: 100%;
		accent-color: var(--color-d);
	}

	.slider-row output {
		font-variant-numeric: tabular-nums;
		text-align: right;
	}

	.feedback {
		margin: 0.8rem 0 0;
		color: var(--color-ink-light);
		font-family: var(--font-serif);
		font-size: 0.96rem;
		text-align: center;
	}

	.feedback.found {
		color: #047857;
		font-weight: 650;
	}

	@media (max-width: 600px) {
		.optimizer {
			padding: 0.85rem;
		}

		.optimizer-heading {
			align-items: flex-end;
		}

		.optimizer-graphic {
			margin: 0.4rem 0;
		}

		.slider-row {
			grid-template-columns: 1fr 4.5rem;
		}

		.slider-row span {
			grid-column: 1 / -1;
		}
	}
</style>
