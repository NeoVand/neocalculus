<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	const width = 760;
	const height = 520;
	const margin = { top: 24, bottom: 52 };
	const plotSize = height - margin.top - margin.bottom;
	const plotLeft = (width - plotSize) / 2;
	const plotWidth = plotSize;
	const plotHeight = plotSize;
	const domainMin = -3;
	const domainMax = 3;

	let x0 = $state(1.1);
	let y0 = $state(0.8);
	let angle = $state(30);

	const radians = $derived((angle * Math.PI) / 180);
	const vx = $derived(Math.cos(radians));
	const vy = $derived(Math.sin(radians));
	const gradX = $derived(2 * x0);
	const gradY = $derived(2 * y0);
	const gradMagnitude = $derived(Math.hypot(gradX, gradY));
	const gradUnitX = $derived(gradMagnitude === 0 ? 0 : gradX / gradMagnitude);
	const gradUnitY = $derived(gradMagnitude === 0 ? 0 : gradY / gradMagnitude);
	const directionalDerivative = $derived(gradX * vx + gradY * vy);
	const selectedRadius = $derived(Math.hypot(x0, y0));
	const behavior = $derived(
		directionalDerivative > 0.02
			? 'increases'
			: directionalDerivative < -0.02
				? 'decreases'
				: 'is nearly unchanged'
	);

	const sx = (x: number) => plotLeft + ((x - domainMin) / (domainMax - domainMin)) * plotWidth;
	const sy = (y: number) => margin.top + plotHeight - ((y - domainMin) / (domainMax - domainMin)) * plotHeight;
	const scaleX = plotWidth / (domainMax - domainMin);
	const scaleY = plotHeight / (domainMax - domainMin);
</script>

<div class="gradient-explorer">
	<DemoHeader title="Explore direction and gradient" />

	<div class="demo-layout">
		<DemoCard title="Choose a point and direction">
			<SliderField
				label="Point coordinate x₀"
				min={-1.5}
				max={1.5}
				step={0.1}
				decimals={1}
				bind:value={x0}
			/>
			<SliderField
				label="Point coordinate y₀"
				min={-1.5}
				max={1.5}
				step={0.1}
				decimals={1}
				bind:value={y0}
			/>
			<SliderField
				label="Direction angle θ"
				min={-180}
				max={180}
				step={5}
				decimals={0}
				bind:value={angle}
				hint="Rotate the blue unit vector while the point stays fixed."
			/>
		</DemoCard>

		<EquationPanel title="Current directional rate">
			<Katex
				math={String.raw`\begin{aligned}\nabla f(x_0,y_0)&=(2x_0,2y_0)\\&=(${gradX.toFixed(2)},${gradY.toFixed(2)})\end{aligned}`}
				display
			/>
			<Katex
				math={String.raw`\begin{aligned}\mathbf v&=(\cos\theta,\sin\theta)\\&=(${vx.toFixed(2)},${vy.toFixed(2)})\end{aligned}`}
				display
			/>
			<Katex
				math={String.raw`D_{\mathbf v}f=\nabla f\cdot\mathbf v=${directionalDerivative.toFixed(3)}`}
				display
			/>
			<p class="reading">
				Moving in the blue direction, <Katex math="f" /> <strong>{behavior}</strong> at the
				selected point.
			</p>
		</EquationPanel>
	</div>

	<div class="legend" aria-label="Plot legend">
		<span><i class="swatch contour"></i>level curves of <Katex math={String.raw`f=x^2+y^2`} /></span>
		<span><i class="swatch gradient"></i>gradient</span>
		<span><i class="swatch direction"></i>chosen direction</span>
	</div>

	<div class="plot-shell">
		<svg
			viewBox={`0 0 ${width} ${height}`}
			role="img"
			aria-label="Circular level curves with the gradient and a chosen direction at a selected point"
		>
			<defs>
				<clipPath id="gradient-direction-clip">
					<rect x={plotLeft} y={margin.top} width={plotWidth} height={plotHeight} />
				</clipPath>
				<marker id="gradient-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
					<path d="M0,0 L8,4 L0,8 Z" fill="var(--color-d)" />
				</marker>
				<marker id="direction-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
					<path d="M0,0 L8,4 L0,8 Z" fill="#2563eb" />
				</marker>
			</defs>

			{#each [-3, -2, -1, 0, 1, 2, 3] as value (value)}
				<line class="grid" x1={sx(value)} y1={margin.top} x2={sx(value)} y2={margin.top + plotHeight} />
				<line class="grid" x1={plotLeft} y1={sy(value)} x2={plotLeft + plotWidth} y2={sy(value)} />
				<text class="tick" x={sx(value)} y={height - 21} text-anchor="middle">{value}</text>
				{#if value !== 0}
					<text class="tick" x={plotLeft - 12} y={sy(value) + 4} text-anchor="end">{value}</text>
				{/if}
			{/each}

			<line class="axis" x1={plotLeft} y1={sy(0)} x2={plotLeft + plotWidth} y2={sy(0)} />
			<line class="axis" x1={sx(0)} y1={margin.top} x2={sx(0)} y2={margin.top + plotHeight} />
			<text class="axis-label" x={plotLeft + plotWidth + 16} y={sy(0) + 5}>x</text>
			<text class="axis-label" x={plotLeft - 4} y={15}>y</text>

			<g clip-path="url(#gradient-direction-clip)">
				{#each [0.75, 1.5, 2.25] as radius (radius)}
					<ellipse
						class="contour-line"
						cx={sx(0)}
						cy={sy(0)}
						rx={radius * scaleX}
						ry={radius * scaleY}
					/>
				{/each}
				<ellipse
					class="selected-contour"
					cx={sx(0)}
					cy={sy(0)}
					rx={selectedRadius * scaleX}
					ry={selectedRadius * scaleY}
				/>

				<line
					class="gradient-vector"
					x1={sx(x0)}
					y1={sy(y0)}
					x2={sx(x0 + 1.15 * gradUnitX)}
					y2={sy(y0 + 1.15 * gradUnitY)}
					marker-end="url(#gradient-arrow)"
				/>
				<line
					class="direction-vector"
					x1={sx(x0)}
					y1={sy(y0)}
					x2={sx(x0 + 1.15 * vx)}
					y2={sy(y0 + 1.15 * vy)}
					marker-end="url(#direction-arrow)"
				/>
				<circle class="point" cx={sx(x0)} cy={sy(y0)} r="5" />
			</g>
		</svg>
	</div>
</div>

<style>
	.gradient-explorer {
		font-family: var(--font-sans);
	}

	.demo-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
		margin-bottom: 0.8rem;
	}

	.reading {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-ink-light);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem 1.2rem;
		margin: 0.35rem 0 0.8rem;
		font-size: 0.84rem;
		color: var(--color-ink-light);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		display: inline-block;
		width: 1.4rem;
		height: 0;
		border-top: 3px solid;
	}

	.swatch.contour {
		border-color: #9ca3af;
	}

	.swatch.gradient {
		border-color: var(--color-d);
	}

	.swatch.direction {
		border-color: #2563eb;
	}

	.plot-shell {
		padding: 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: #fff;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.grid {
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--color-ink-faint);
		stroke-width: 1.4;
	}

	.tick,
	.axis-label {
		fill: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 13px;
	}

	.axis-label {
		font-size: 15px;
		font-style: italic;
	}

	.contour-line {
		fill: none;
		stroke: #d1d5db;
		stroke-width: 1.4;
	}

	.selected-contour {
		fill: none;
		stroke: #93c5fd;
		stroke-width: 3;
	}

	.gradient-vector,
	.direction-vector {
		stroke-width: 3.5;
		stroke-linecap: round;
	}

	.gradient-vector {
		stroke: var(--color-d);
	}

	.direction-vector {
		stroke: #2563eb;
	}

	.point {
		fill: var(--color-ink);
		stroke: #fff;
		stroke-width: 2;
	}

	@media (max-width: 700px) {
		.demo-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
