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
	const ymax = 5.2;

	const f = (x: number) => 0.08 * x * x + 0.55 * x + 0.7;
	const fp = (x: number) => 0.16 * x + 0.55;

	let x0 = $state(3.1);
	let d = $state(0.28);

	const plotW = W - margin.l - margin.r;
	const plotH = H - margin.t - margin.b;
	const sx = (u: number) => margin.l + ((u - xmin) / (xmax - xmin)) * plotW;
	const sy = (v: number) => margin.t + plotH - ((v - ymin) / (ymax - ymin)) * plotH;

	const stripHeight = $derived(f(x0));
	const x1 = $derived(Math.min(x0 + d, xmax));
	const stripWidthPx = $derived(Math.max(1, sx(x1) - sx(x0)));
	const triangleHeight = $derived(Math.max(0, f(x1) - f(x0)));

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
	<DemoHeader title="Explore: infinitesimal strip and FTC" />

	<DemoCard title="Inputs">
		<div class="demo-controls-grid">
			<SliderField
				id="strip-x0"
				label="Start point x0"
				hint="Where the area function is currently evaluated"
				min={0.6}
				max={5.2}
				step={0.01}
				decimals={2}
				bind:value={x0}
			/>
			<SliderField
				id="strip-d"
				label="Infinitesimal width d"
				hint="Thickness of the added strip"
				min={0.1}
				max={0.55}
				step={0.01}
				decimals={2}
				bind:value={d}
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

			<line x1={sx(x0)} y1={sy(0) + 12} x2={sx(x1)} y2={sy(0) + 12} stroke="#a855f7" stroke-width="2" />
			<text x={(sx(x0) + sx(x1)) / 2} y={sy(0) + 28} text-anchor="middle" fill="#a855f7" font-size="11" font-family="var(--font-sans)">d</text>

			<text x={sx(x0) + 8} y={sy(stripHeight) - 8} fill="#059669" font-size="11" font-family="var(--font-sans)">
				rectangle: f(x0)·d
			</text>
			<text
				x={Math.min(sx(x1) + 8, sx(xmax) - 140)}
				y={sy(stripHeight + triangleHeight / 2)}
				fill="#ef4444"
				font-size="11"
				font-family="var(--font-sans)"
			>
				triangle: ~ f'(x0)d²
			</text>
		</svg>

		<LegendList
			items={[
				{ label: 'blue: accumulated area A(x0)', color: '#3b82f6' },
				{ label: 'green strip: first-order gain f(x0)d', color: '#059669' },
				{ label: 'red triangle: second-order term ~ d²', color: '#ef4444' }
			]}
		/>
	</DemoCard>

	<EquationPanel title="First-order conclusion">
		<Katex math={String.raw`A(x_0+d)-A(x_0)=f(x_0)\,d+\frac12 f'(x_0)d^2`} display />
		<Katex math={String.raw`d^2=0 \;\Rightarrow\; A'(x_0)=f(x_0)`} display />
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
</style>
