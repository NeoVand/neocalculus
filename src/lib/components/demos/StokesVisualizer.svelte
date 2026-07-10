<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import ToggleField from '$lib/components/demos/ToggleField.svelte';

	const left = 48;
	const top = 36;
	const size = 392;

	let n = $state(4);
	let showInterior = $state(true);

	const cells = $derived(
		Array.from({ length: n * n }, (_, index) => ({ i: index % n, j: Math.floor(index / n) }))
	);
	const cellSize = $derived(size / n);
	const interiorSharedEdges = $derived(2 * n * (n - 1));
	const boundaryEdges = $derived(4 * n);
	const selectedI = $derived(Math.max(0, Math.floor(n / 2) - 1));
	const selectedJ = $derived(Math.floor((n - 1) / 2));
	const selectedX = $derived(left + (selectedI + 1) * cellSize);
	const selectedY = $derived(top + selectedJ * cellSize);
</script>

<div class="stokes-explorer">
	<DemoHeader title="Explore why interior boundaries cancel" />

	<DemoCard title="Refine a finite cell decomposition">
		<div class="control-grid">
			<SliderField
				label="Cells along each side"
				min={2}
				max={7}
				step={1}
				decimals={0}
				bind:value={n}
				hint="The outer boundary stays fixed while the interior decomposition changes."
			/>
			<ToggleField
				label="Show every interior pair"
				hint="Each shared edge appears once from each neighboring cell."
				bind:checked={showInterior}
			/>
		</div>
	</DemoCard>

	<div class="visual-grid">
		<div class="plot-shell">
			<svg viewBox="0 0 488 474" role="img" aria-label="Oriented cell boundaries cancelling on shared edges while the outside boundary survives">
				<defs>
					<marker id="cell-arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="#a8a3ae" />
					</marker>
					<marker id="cell-arrow-blue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
						<path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" />
					</marker>
					<marker id="cell-arrow-orange" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
						<path d="M0,0 L7,3.5 L0,7 Z" fill="#d97706" />
					</marker>
					<marker id="boundary-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
						<path d="M0,0 L7,3.5 L0,7 Z" fill="#a855f7" />
					</marker>
				</defs>

				<rect class="region-fill" x={left} y={top} width={size} height={size} rx="4" />

				{#each cells as cell (`${cell.i}-${cell.j}`)}
					{@const x = left + cell.i * cellSize}
					{@const y = top + cell.j * cellSize}
					<rect class="cell" {x} {y} width={cellSize} height={cellSize} />
					{#if showInterior}
						{#if cell.j > 0}
							<line class="cell-arrow" x1={x + cellSize * 0.72} y1={y + 4} x2={x + cellSize * 0.28} y2={y + 4} marker-end="url(#cell-arrow-gray)" />
						{/if}
						{#if cell.i < n - 1}
							<line class="cell-arrow" x1={x + cellSize - 4} y1={y + cellSize * 0.72} x2={x + cellSize - 4} y2={y + cellSize * 0.28} marker-end="url(#cell-arrow-gray)" />
						{/if}
						{#if cell.j < n - 1}
							<line class="cell-arrow" x1={x + cellSize * 0.28} y1={y + cellSize - 4} x2={x + cellSize * 0.72} y2={y + cellSize - 4} marker-end="url(#cell-arrow-gray)" />
						{/if}
						{#if cell.i > 0}
							<line class="cell-arrow" x1={x + 4} y1={y + cellSize * 0.28} x2={x + 4} y2={y + cellSize * 0.72} marker-end="url(#cell-arrow-gray)" />
						{/if}
					{/if}
				{/each}

				<rect class="selected-edge" x={selectedX - 10} y={selectedY + 8} width="20" height={Math.max(18, cellSize - 16)} rx="8" />
				<line
					class="selected-blue"
					x1={selectedX - 5}
					y1={selectedY + cellSize * 0.74}
					x2={selectedX - 5}
					y2={selectedY + cellSize * 0.28}
					marker-end="url(#cell-arrow-blue)"
				/>
				<line
					class="selected-orange"
					x1={selectedX + 5}
					y1={selectedY + cellSize * 0.28}
					x2={selectedX + 5}
					y2={selectedY + cellSize * 0.74}
					marker-end="url(#cell-arrow-orange)"
				/>

				<line class="boundary" x1={left + size} y1={top} x2={left} y2={top} marker-end="url(#boundary-arrow)" />
				<line class="boundary" x1={left} y1={top} x2={left} y2={top + size} marker-end="url(#boundary-arrow)" />
				<line class="boundary" x1={left} y1={top + size} x2={left + size} y2={top + size} marker-end="url(#boundary-arrow)" />
				<line class="boundary" x1={left + size} y1={top + size} x2={left + size} y2={top} marker-end="url(#boundary-arrow)" />

				<text class="boundary-label" x="244" y="462" text-anchor="middle">outer boundary survives · counterclockwise orientation</text>
			</svg>
		</div>

		<div class="explanation-column">
			<EquationPanel title="One highlighted shared edge">
				<div class="pair-key"><span class="blue-line"></span><Katex math={String.raw`+\int_e\omega`} /></div>
				<div class="pair-key"><span class="orange-line"></span><Katex math={String.raw`-\int_e\omega`} /></div>
				<Katex math={String.raw`\int_e\omega-\int_e\omega=0`} display />
				<p class="reading">The two cells induce opposite directions on the same geometric edge.</p>
			</EquationPanel>

			<div class="counts" aria-label="Edge counts">
				<div><span>{interiorSharedEdges}</span> shared edges cancel</div>
				<div><span>{boundaryEdges}</span> boundary pieces remain</div>
			</div>
		</div>
	</div>
</div>

<style>
	.stokes-explorer {
		font-family: var(--font-sans);
	}

	.control-grid,
	.visual-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.85rem 1rem;
	}

	.visual-grid {
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.65fr);
		align-items: start;
		margin-top: 0.8rem;
	}

	.plot-shell {
		padding: 0.4rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: #fff;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.region-fill {
		fill: rgb(168 85 247 / 5%);
		stroke: none;
	}

	.cell {
		fill: none;
		stroke: var(--color-border-light);
		stroke-width: 1.1;
	}

	.cell-arrow {
		stroke: #aaa5b0;
		stroke-width: 1.15;
	}

	.selected-edge {
		fill: rgb(168 85 247 / 12%);
	}

	.selected-blue,
	.selected-orange {
		stroke-width: 2.5;
		stroke-linecap: round;
	}

	.selected-blue {
		stroke: #2563eb;
	}

	.selected-orange {
		stroke: #d97706;
	}

	.boundary {
		stroke: var(--color-d);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.boundary-label {
		fill: var(--color-ink-light);
		font-family: var(--font-sans);
		font-size: 12px;
	}

	.explanation-column {
		display: grid;
		gap: 0.75rem;
	}

	.pair-key {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		margin: 0.4rem 0;
	}

	.blue-line,
	.orange-line {
		display: inline-block;
		width: 1.5rem;
		border-top: 3px solid;
	}

	.blue-line {
		border-color: #2563eb;
	}

	.orange-line {
		border-color: #d97706;
	}

	.reading {
		margin: 0.55rem 0 0;
		font-size: 0.8rem;
		line-height: 1.45;
		text-align: center;
		color: var(--color-ink-light);
	}

	.counts {
		display: grid;
		gap: 0.45rem;
		font-size: 0.76rem;
		color: var(--color-ink-light);
	}

	.counts div {
		padding: 0.55rem 0.65rem;
		border-left: 3px solid var(--color-d);
		background: var(--color-surface-soft);
	}

	.counts span {
		font-weight: 800;
		color: var(--color-ink);
	}

	@media (max-width: 760px) {
		.visual-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.control-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
