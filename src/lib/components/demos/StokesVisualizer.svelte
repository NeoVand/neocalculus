<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import ToggleField from '$lib/components/demos/ToggleField.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import LegendList from '$lib/components/demos/LegendList.svelte';

	let n = $state(4);
	let showInterior = $state(true);

	const cells = $derived([...Array(n)].flatMap((_, i) => [...Array(n)].map((__, j) => ({ i, j }))));
	const interiorSharedEdges = $derived(2 * n * (n - 1));
	const boundaryEdges = $derived(4 * n);
</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: Stokes interior cancellation" />

	<DemoCard title="Controls">
		<div class="stok-controls-grid">
			<SliderField
				id="stokes-grid-size"
				label="Grid size"
				hint="How many micro-cells in each direction"
				min={2}
				max={7}
				step={1}
				decimals={0}
				bind:value={n}
			/>
			<ToggleField label="Show interior edge pairs" hint="Toggle cancellation arrows inside the region" bind:checked={showInterior} />
		</div>
	</DemoCard>

	<DemoCard title="Cell-wise cancellation picture">
		<svg viewBox="0 0 460 360" role="img" aria-label="Grid with boundary and interior edge orientations">
			<defs>
				<marker id="arrowPurple" markerWidth="6" markerHeight="6" refX="5.2" refY="3" orient="auto">
					<path d="M0,0 L6,3 L0,6 Z" fill="#a855f7" />
				</marker>
				<marker id="arrowGray" markerWidth="6" markerHeight="6" refX="5.2" refY="3" orient="auto">
					<path d="M0,0 L6,3 L0,6 Z" fill="#b9b4c0" />
				</marker>
			</defs>

			<rect x="40" y="28" width="380" height="304" fill="white" stroke="#ece8e0" />

			{#each cells as cell}
				{@const x = 40 + (380 / n) * cell.i}
				{@const y = 28 + (304 / n) * cell.j}
				{@const w = 380 / n}
				{@const h = 304 / n}
				<rect {x} {y} width={w} height={h} fill="none" stroke="#e7e1da" />
				{#if showInterior}
					{#if cell.i < n - 1}
						<line
							x1={x + w}
							y1={y + h * 0.72}
							x2={x + w}
							y2={y + h * 0.28}
							stroke="#c3bfca"
							stroke-width="1.05"
							marker-end="url(#arrowGray)"
						/>
					{/if}
					{#if cell.j < n - 1}
						<line
							x1={x + w * 0.28}
							y1={y + h}
							x2={x + w * 0.72}
							y2={y + h}
							stroke="#c3bfca"
							stroke-width="1.05"
							marker-end="url(#arrowGray)"
						/>
					{/if}
				{/if}
			{/each}

			<line x1="40" y1="28" x2="420" y2="28" stroke="#a855f7" stroke-width="2.2" marker-end="url(#arrowPurple)" />
			<line x1="420" y1="28" x2="420" y2="332" stroke="#a855f7" stroke-width="2.2" marker-end="url(#arrowPurple)" />
			<line x1="420" y1="332" x2="40" y2="332" stroke="#a855f7" stroke-width="2.2" marker-end="url(#arrowPurple)" />
			<line x1="40" y1="332" x2="40" y2="28" stroke="#a855f7" stroke-width="2.2" marker-end="url(#arrowPurple)" />

			<text x="50" y="48" fill="#a855f7" font-size="12" font-family="var(--font-sans)">boundary survives in the sum</text>
			<text x="50" y="66" fill="#9d98a8" font-size="11" font-family="var(--font-sans)">interior edges come in opposite-oriented pairs</text>
		</svg>

		<LegendList
			items={[
				{ label: 'purple arrows: boundary orientation', color: '#a855f7' },
				{ label: 'gray arrows: interior contributions', color: '#9d98a8' }
			]}
		/>

		<div class="stok-metrics">
			<div>Boundary-oriented edges: <strong>{boundaryEdges}</strong></div>
			<div>Interior paired edges: <strong>{interiorSharedEdges}</strong> (cancel)</div>
		</div>
	</DemoCard>

	<EquationPanel title="Global statement">
		<Katex math={String.raw`\int_{\partial \Omega}\omega=\int_{\Omega} d\omega`} display />
		<Katex math={String.raw`\text{Cell-wise sum: interior cancels, boundary remains}`} display />
	</EquationPanel>
</div>

<style>
	.stok-controls-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem 1rem;
	}

	svg {
		width: 100%;
		height: auto;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: white;
		margin-bottom: 0.6rem;
	}

	.stok-metrics {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		font-family: var(--font-sans);
		font-size: 0.76rem;
		color: var(--color-ink-light);
	}

	@media (max-width: 900px) {
		.stok-controls-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
