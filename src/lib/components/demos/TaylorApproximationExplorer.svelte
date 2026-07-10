<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	const width = 760;
	const height = 390;
	const margin = { top: 22, right: 28, bottom: 48, left: 58 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const xMin = -2.5;
	const xMax = 2.5;
	const yMin = -0.5;
	const yMax = 10;

	let degree = $state(2);
	let sampleX = $state(1);

	function factorial(n: number) {
		let value = 1;
		for (let k = 2; k <= n; k += 1) value *= k;
		return value;
	}

	function taylor(x: number, n: number) {
		let sum = 0;
		for (let k = 0; k <= n; k += 1) sum += x ** k / factorial(k);
		return sum;
	}

	function polynomialLatex(n: number) {
		const terms = ['1'];
		if (n >= 1) terms.push('x');
		for (let k = 2; k <= n; k += 1) terms.push(String.raw`\frac{x^{${k}}}{${factorial(k)}}`);
		return `T_{${n}}(x)=${terms.join('+')}`;
	}

	const sx = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
	const sy = (y: number) => margin.top + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;

	function makePath(fn: (x: number) => number) {
		const points: string[] = [];
		let drawing = false;
		for (let i = 0; i <= 260; i += 1) {
			const x = xMin + ((xMax - xMin) * i) / 260;
			const y = fn(x);
			if (y < yMin || y > yMax) {
				drawing = false;
				continue;
			}
			points.push(`${drawing ? 'L' : 'M'} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`);
			drawing = true;
		}
		return points.join(' ');
	}

	const exponentialPath = makePath(Math.exp);
	const polynomialPath = $derived(makePath((x) => taylor(x, degree)));
	const polynomialFormula = $derived(polynomialLatex(degree));
	const trueValue = $derived(Math.exp(sampleX));
	const approximateValue = $derived(taylor(sampleX, degree));
	const actualError = $derived(Math.abs(trueValue - approximateValue));
	const baselineError = $derived(Math.abs(trueValue - 1));
	const errorPercent = $derived(
		baselineError < 1e-12 ? 0 : Math.min(100, (actualError / baselineError) * 100)
	);
	const remainderBound = $derived(
		Math.exp(Math.max(0, sampleX)) * Math.abs(sampleX) ** (degree + 1) / factorial(degree + 1)
	);
</script>

<div class="taylor-explorer">
	<DemoHeader title="Explore a Taylor polynomial" />

	<div class="demo-layout">
		<DemoCard title="Choose the approximation">
			<SliderField
				label="Polynomial degree"
				min={0}
				max={8}
				step={1}
				decimals={0}
				bind:value={degree}
				hint="Each step adds one derivative at the center x = 0."
				tone="violet"
			/>
			<SliderField
				label="Evaluation point x"
				min={-1.5}
				max={1.5}
				step={0.1}
				decimals={1}
				bind:value={sampleX}
				hint="Move away from the center and watch the error change."
				tone="blue"
			/>
		</DemoCard>

		<EquationPanel title="Current approximation">
			<Katex math={polynomialFormula} display />
			<p class="reading">
				At <Katex math={`x=${sampleX.toFixed(1)}`} />,
				<Katex math={`e^x=${trueValue.toFixed(6)}`} /> and
				<Katex math={`T_${degree}(x)=${approximateValue.toFixed(6)}`} />.
			</p>
			<p class="reading">
				Actual error: <strong>{actualError.toExponential(2)}</strong>. Taylor’s bound here is
				<strong>{remainderBound.toExponential(2)}</strong>.
			</p>
		</EquationPanel>
	</div>

	<div class="legend" aria-label="Plot legend">
		<span><i class="swatch function"></i><Katex math="e^x" /></span>
		<span><i class="swatch polynomial"></i><Katex math={`T_${degree}(x)`} /></span>
		<span><i class="swatch error"></i>error at the selected input</span>
	</div>
	<div class="error-meter" aria-live="polite">
		<div class="meter-label">
			<span>error remaining relative to the degree-0 approximation</span>
			<strong>{errorPercent.toFixed(2)}%</strong>
		</div>
		<div class="meter-track" aria-hidden="true">
			<i style={`width: ${errorPercent}%`}></i>
		</div>
	</div>

	<div class="plot-shell">
		<svg
			viewBox={`0 0 ${width} ${height}`}
			role="img"
			aria-label={`The exponential function and its degree ${degree} Taylor polynomial centered at zero`}
		>
			<defs>
				<clipPath id="taylor-plot-clip">
					<rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />
				</clipPath>
			</defs>

			{#each [-2, -1, 0, 1, 2] as x (x)}
				<line class="grid" x1={sx(x)} y1={margin.top} x2={sx(x)} y2={margin.top + plotHeight} />
				<text class="tick" x={sx(x)} y={height - 20} text-anchor="middle">{x}</text>
			{/each}
			{#each [0, 2, 4, 6, 8, 10] as y (y)}
				<line class="grid" x1={margin.left} y1={sy(y)} x2={margin.left + plotWidth} y2={sy(y)} />
				<text class="tick" x={margin.left - 13} y={sy(y) + 4} text-anchor="end">{y}</text>
			{/each}

			<line class="axis" x1={margin.left} y1={sy(0)} x2={margin.left + plotWidth} y2={sy(0)} />
			<line class="axis" x1={sx(0)} y1={margin.top} x2={sx(0)} y2={margin.top + plotHeight} />
			<text class="axis-label" x={width - 16} y={height - 18}>x</text>
			<text class="axis-label" x={margin.left - 4} y={14}>y</text>

			<g clip-path="url(#taylor-plot-clip)">
				<path class="function-curve" d={exponentialPath} />
				<path class="polynomial-curve" d={polynomialPath} />
				<line
					class="error-line"
					x1={sx(sampleX)}
					y1={sy(trueValue)}
					x2={sx(sampleX)}
					y2={sy(approximateValue)}
				/>
				<circle class="function-point" cx={sx(sampleX)} cy={sy(trueValue)} r="5" />
				<circle class="polynomial-point" cx={sx(sampleX)} cy={sy(approximateValue)} r="5" />
				<text
					class="error-label"
					x={sampleX > 0.9 ? sx(sampleX) - 12 : sx(sampleX) + 12}
					y={Math.max(margin.top + 15, (sy(trueValue) + sy(approximateValue)) / 2 - 9)}
					text-anchor={sampleX > 0.9 ? 'end' : 'start'}
				>
					Δ = {actualError.toExponential(2)}
				</text>
			</g>
		</svg>
	</div>
</div>

<style>
	.taylor-explorer {
		font-family: var(--font-sans);
	}

	.demo-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
		margin-bottom: 0.8rem;
	}

	.reading {
		margin: 0.55rem 0 0;
		color: var(--color-ink-light);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem 1.2rem;
		margin: 0.4rem 0 0.8rem;
		color: var(--color-ink-light);
		font-size: 0.85rem;
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

	.swatch.function {
		border-color: var(--color-ink);
	}

	.swatch.polynomial {
		border-color: var(--color-d);
		border-top-style: dashed;
	}

	.swatch.error {
		border-color: #f97316;
	}

	.error-meter {
		margin: -0.18rem 0 0.78rem;
	}

	.meter-label {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		margin-bottom: 0.24rem;
		font-size: 0.66rem;
		color: var(--color-ink-faint);
	}

	.meter-label strong {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--plot-amber);
		font-variant-numeric: tabular-nums;
	}

	.meter-track {
		height: 0.32rem;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-border-light);
	}

	.meter-track i {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #f97316, #fb7185);
		transition: width 180ms ease-out;
	}

	.plot-shell {
		padding: 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--color-surface);
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

	.function-curve,
	.polynomial-curve {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.function-curve {
		stroke: var(--color-ink);
		stroke-width: 3.2;
	}

	.polynomial-curve {
		stroke: var(--color-d);
		stroke-width: 3.2;
		stroke-dasharray: 10 7;
	}

	.error-line {
		stroke: #f97316;
		stroke-width: 3;
	}

	.function-point {
		fill: var(--color-ink);
		stroke: #fff;
		stroke-width: 2;
	}

	.polynomial-point {
		fill: var(--color-d);
		stroke: #fff;
		stroke-width: 2;
	}

	.error-label {
		fill: var(--plot-amber);
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 650;
	}

	@media (max-width: 700px) {
		.demo-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
