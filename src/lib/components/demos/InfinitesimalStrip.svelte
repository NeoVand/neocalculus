<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import LegendList from '$lib/components/demos/LegendList.svelte';

	const W = 760;
	const H = 320;
	const margin = { l: 56, r: 18, t: 18, b: 46 };
	const xmin = 0;
	const xmax = 6;
	const ymin = 0;
	const ymax = 7.2;

	const f = (x: number) => 0.08 * x * x + 0.55 * x + 0.7;
	const fp = (x: number) => 0.16 * x + 0.55;
	const antiderivative = (x: number) => (0.08 / 3) * x * x * x + 0.275 * x * x + 0.7 * x;

	let x0 = $state(3.1);
	let h = $state(0.28);

	const plotW = W - margin.l - margin.r;
	const plotH = H - margin.t - margin.b;
	const sx = (u: number) => margin.l + ((u - xmin) / (xmax - xmin)) * plotW;
	const sy = (v: number) => margin.t + plotH - ((v - ymin) / (ymax - ymin)) * plotH;

	const stripHeight = $derived(f(x0));
	const x1 = $derived(Math.min(x0 + h, xmax));
	const stripWidthPx = $derived(Math.max(1, sx(x1) - sx(x0)));
	const triangleHeight = $derived(Math.max(0, f(x1) - f(x0)));
	const exactGain = $derived(antiderivative(x1) - antiderivative(x0));
	const linearGain = $derived(f(x0) * (x1 - x0));
	const correction = $derived(exactGain - linearGain);
	const correctionShare = $derived(exactGain === 0 ? 0 : (correction / exactGain) * 100);

	const curvePath = $derived.by(() => {
		let p = '';
		const n = 220;
		for (let i = 0; i <= n; i += 1) {
			const xi = xmin + (i / n) * (xmax - xmin);
			p += `${i === 0 ? 'M' : 'L'} ${sx(xi)} ${sy(f(xi))} `;
		}
		return p.trim();
	});

	const areaPath = $derived.by(() => {
		const n = 140;
		let p = `M ${sx(xmin)} ${sy(0)} L ${sx(xmin)} ${sy(f(xmin))} `;
		for (let i = 1; i <= n; i += 1) {
			const xi = xmin + (i / n) * (x0 - xmin);
			p += `L ${sx(xi)} ${sy(f(xi))} `;
		}
		p += `L ${sx(x0)} ${sy(0)} Z`;
		return p;
	});
</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: a thin ordinary strip" />

	<DemoCard title="Inputs">
		<div class="demo-controls-grid">
			<SliderField
				id="strip-x0"
				label="Start point x₀"
				hint="Where the area function is currently evaluated"
				min={0.6}
				max={5.2}
				step={0.01}
				decimals={2}
				bind:value={x0}
				tone="blue"
			/>
			<SliderField
				id="strip-h"
				label="Ordinary width h"
				hint="Shrink this finite width and watch the correction fade"
				min={0.1}
				max={0.55}
				step={0.01}
				decimals={2}
				bind:value={h}
				tone="teal"
			/>
		</div>
	</DemoCard>

	<DemoCard title="Geometry">
		<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Area accumulation and infinitesimal strip">
			<defs>
				<linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="rgba(59,130,246,0.28)" />
					<stop offset="100%" stop-color="rgba(59,130,246,0.08)" />
				</linearGradient>
				<linearGradient id="stripGrad" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="rgba(16,185,129,0.34)" />
					<stop offset="100%" stop-color="rgba(16,185,129,0.12)" />
				</linearGradient>
			</defs>

			<line x1={sx(xmin)} y1={sy(0)} x2={sx(xmax)} y2={sy(0)} stroke="#d4d0c8" stroke-width="1.2" />
			<line x1={sx(xmin)} y1={sy(ymin)} x2={sx(xmin)} y2={sy(ymax)} stroke="#d4d0c8" stroke-width="1.2" />

			<path d={areaPath} fill="url(#areaGrad)" />
			<path d={curvePath} fill="none" stroke="#1a1a2e" stroke-width="2.4" />

			<rect
				x={sx(x0)}
				y={sy(stripHeight)}
				width={stripWidthPx}
				height={sy(0) - sy(stripHeight)}
				fill="url(#stripGrad)"
				stroke="#059669"
				stroke-width="1.3"
			/>

			<polygon
				points={`${sx(x0)},${sy(stripHeight)} ${sx(x1)},${sy(stripHeight)} ${sx(x1)},${sy(
					stripHeight + triangleHeight
				)}`}
				fill="rgba(239,68,68,0.22)"
				stroke="#ef4444"
				stroke-width="1"
			/>

			<line x1={sx(x0)} y1={sy(0) + 12} x2={sx(x1)} y2={sy(0) + 12} stroke="#059669" stroke-width="2" />
			<text x={(sx(x0) + sx(x1)) / 2} y={sy(0) + 28} text-anchor="middle" fill="#059669" font-size="11" font-family="var(--font-sans)">h</text>
		</svg>

		<div class="measure-row" aria-live="polite">
			<div>
				<span>exact finite gain</span>
				<strong>{exactGain.toFixed(5)}</strong>
			</div>
			<div>
				<span>rectangle f(x₀)h</span>
				<strong>{linearGain.toFixed(5)}</strong>
			</div>
			<div class="correction">
				<span>curvature remainder</span>
				<strong>{correction.toFixed(5)}</strong>
				<small>{correctionShare.toFixed(2)}% of the gain</small>
			</div>
		</div>

		<LegendList
			items={[
				{ label: 'blue: accumulated area A(x0)', color: '#3b82f6' },
				{ label: 'green rectangle: leading gain f(x0)h', color: '#059669' },
				{ label: 'red region: correction of order h²', color: '#ef4444' }
			]}
		/>
	</DemoCard>

	<EquationPanel title="From the finite picture to the first-order equation">
		<Katex math={String.raw`A(x_0+h)-A(x_0)\approx f(x_0)\,h\quad\text{for small ordinary }h`} display />
		<Katex math={String.raw`A(x_0+d)-A(x_0)=f(x_0)\,d\quad(d^2=0)`} display />
	</EquationPanel>
</div>

<style>
	svg {
		width: 100%;
		height: auto;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: white;
	}

	.measure-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		margin-top: 0.65rem;
	}

	.measure-row > div {
		display: grid;
		gap: 0.08rem;
		padding: 0.55rem 0.6rem;
		border-top: 2px solid var(--color-result);
		background: rgba(37, 99, 235, 0.035);
	}

	.measure-row > div:nth-child(2) {
		border-top-color: var(--color-success);
		background: rgba(5, 150, 105, 0.035);
	}

	.measure-row > div.correction {
		border-top-color: var(--color-vanish);
		background: rgba(239, 68, 68, 0.035);
	}

	.measure-row span,
	.measure-row small {
		font-family: var(--font-sans);
		font-size: 0.61rem;
		color: var(--color-ink-faint);
	}

	.measure-row span {
		font-weight: 650;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.measure-row strong {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 520px) {
		.measure-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}

		.measure-row > div {
			grid-template-columns: 1fr auto;
			align-items: baseline;
		}

		.measure-row small {
			grid-column: 1 / -1;
		}
	}
</style>
