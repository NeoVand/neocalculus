<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	const r = String.raw;
	const width = 760;
	const height = 390;
	const margin = { top: 22, right: 28, bottom: 48, left: 58 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const tMax = 5;
	const yMax = 8;

	let k = $state(0.3);
	let y0 = $state(1.5);

	const sx = (t: number) => margin.left + (t / tMax) * plotWidth;
	const sy = (y: number) => margin.top + plotHeight - (y / yMax) * plotHeight;

	const field = $derived.by(() => {
		const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
		const halfLength = 10;
		for (let t = 0.25; t < tMax; t += 0.5) {
			for (let y = 0.75; y < yMax; y += 1.5) {
				const pixelSlope = -(k * y) * (plotHeight / yMax) / (plotWidth / tMax);
				const angle = Math.atan(pixelSlope);
				const dx = halfLength * Math.cos(angle);
				const dy = halfLength * Math.sin(angle);
				segments.push({ x1: sx(t) - dx, y1: sy(y) - dy, x2: sx(t) + dx, y2: sy(y) + dy });
			}
		}
		return segments;
	});

	const solutionPath = $derived.by(() => {
		const points: string[] = [];
		for (let i = 0; i <= 180; i += 1) {
			const t = (i / 180) * tMax;
			const y = y0 * Math.exp(k * t);
			if (y > yMax) break;
			points.push(`${points.length === 0 ? 'M' : 'L'} ${sx(t).toFixed(2)} ${sy(y).toFixed(2)}`);
		}
		return points.join(' ');
	});

	const endpoint = $derived(y0 * Math.exp(k * tMax));
	const behavior = $derived(k > 0.001 ? 'growth' : k < -0.001 ? 'decay' : 'no change');
</script>

<div class="differential-explorer">
	<DemoHeader title="Explore the local law" />

	<div class="demo-layout">
		<DemoCard class="matched-panel" title="Choose the law and the starting value">
			<SliderField
				label="Rate constant k"
				min={-0.6}
				max={0.6}
				step={0.05}
				decimals={2}
				bind:value={k}
				hint="Positive means growth; negative means decay."
				tone="violet"
			/>
			<SliderField
				label="Initial value y₀"
				min={0.5}
				max={4}
				step={0.25}
				decimals={2}
				bind:value={y0}
				hint="This chooses one curve from the family."
				tone="blue"
			/>
		</DemoCard>

		<EquationPanel class="matched-panel" title="What the settings mean">
			<Katex math={r`y'(t)=k\,y(t),\qquad y(0)=y_0`} display />
			<Katex math={r`y(t)=y_0e^{kt}`} display />
			<p class="reading">
				The current model shows <strong>{behavior}</strong>. At <Katex math="t=5" />, the
				model predicts <Katex math={r`y(5)\approx ${endpoint.toFixed(2)}`} />.
			</p>
		</EquationPanel>
	</div>

	<div class="plot-shell">
		<div class="plot-key" aria-label="Plot key">
			<span><i class="field-swatch"></i>local slope field</span>
			<span><i class="solution-swatch"></i>selected solution</span>
			<span><i class="start-swatch"></i>initial condition</span>
		</div>
		<svg
			viewBox={`0 0 ${width} ${height}`}
			role="img"
			aria-label="A slope field for y prime equals k times y, with the solution curve through the selected initial value"
		>
			<defs>
				<clipPath id="differential-plot-clip">
					<rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />
				</clipPath>
			</defs>

			{#each [0, 1, 2, 3, 4, 5] as t (t)}
				<text class="tick" x={sx(t)} y={height - 20} text-anchor="middle">{t}</text>
			{/each}
			{#each [0, 2, 4, 6, 8] as y (y)}
				<text class="tick" x={margin.left - 13} y={sy(y) + 4} text-anchor="end">{y}</text>
			{/each}

			<line class="axis" x1={margin.left} y1={sy(0)} x2={margin.left + plotWidth} y2={sy(0)} />
			<line class="axis" x1={margin.left} y1={margin.top} x2={margin.left} y2={sy(0)} />
			<text class="axis-label" x={width - 16} y={height - 18}>t</text>
			<text class="axis-label" x={margin.left - 4} y={14}>y</text>

			<g clip-path="url(#differential-plot-clip)">
				{#each field as segment (`${segment.x1}-${segment.y1}`)}
					<line class="field-mark" {...segment} />
				{/each}
				<path class="solution" d={solutionPath} />
			</g>
			<circle class="initial-point" cx={sx(0)} cy={sy(y0)} r="5" />
			<text class="initial-label" x={sx(0) + 12} y={sy(y0) - 10}>y(0) = {y0.toFixed(2)}</text>
			{#if endpoint <= yMax}
				<circle class="endpoint" cx={sx(tMax)} cy={sy(endpoint)} r="4" />
				<text class="endpoint-label" x={sx(tMax) - 10} y={sy(endpoint) - 11} text-anchor="end">
					y(5) = {endpoint.toFixed(2)}
				</text>
			{/if}
		</svg>
	</div>
</div>

<style>
	.differential-explorer {
		font-family: var(--font-sans);
	}

	.demo-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.demo-layout :global(.matched-panel) {
		height: 100%;
		box-sizing: border-box;
		margin-top: 0;
	}

	.reading {
		margin: 0.65rem 0 0;
		color: var(--color-ink-light);
		font-size: 0.92rem;
		line-height: 1.55;
	}

	.plot-shell {
		padding: 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--plot-background);
	}

	.plot-key {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		padding: 0.18rem 0 0.42rem;
		font-size: 0.66rem;
		color: var(--color-ink-faint);
	}

	.plot-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
	}

	.plot-key i {
		display: inline-block;
		width: 1.2rem;
		height: 0.16rem;
		border-radius: 999px;
	}

	.plot-key .field-swatch {
		background: color-mix(in srgb, var(--plot-tangent) 68%, var(--plot-axis));
	}

	.plot-key .solution-swatch {
		background: var(--plot-curve);
	}

	.plot-key .start-swatch {
		width: 0.48rem;
		height: 0.48rem;
		background: var(--plot-point);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.axis {
		stroke: var(--color-ink-faint);
		stroke-width: 1.4;
	}

	.tick,
	.axis-label,
	.initial-label,
	.endpoint-label {
		fill: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 13px;
	}

	.axis-label {
		font-size: 15px;
		font-style: italic;
	}

	.field-mark {
		stroke: color-mix(in srgb, var(--plot-tangent) 68%, var(--plot-axis));
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	.solution {
		fill: none;
		stroke: var(--plot-curve);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.initial-point {
		fill: var(--plot-point);
		stroke: var(--plot-background);
		stroke-width: 2;
	}

	.initial-label {
		font-size: 12px;
		font-weight: 600;
	}

	.endpoint {
		fill: var(--plot-curve);
		stroke: var(--plot-background);
		stroke-width: 2;
	}

	.endpoint-label {
		font-size: 12px;
		font-weight: 650;
		fill: var(--plot-curve);
	}

	@media (max-width: 700px) {
		.demo-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
