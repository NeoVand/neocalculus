<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	const origin = { x: 320, y: 200 };
	// A fixed camera scale fits the largest possible vector sum in every direction.
	const scale = 34;

	let angleV = $state(15);
	let angleW = $state(105);
	let lengthV = $state(2.2);
	let lengthW = $state(1.7);

	const radiansV = $derived((angleV * Math.PI) / 180);
	const radiansW = $derived((angleW * Math.PI) / 180);
	const vx = $derived(lengthV * Math.cos(radiansV));
	const vy = $derived(lengthV * Math.sin(radiansV));
	const wx = $derived(lengthW * Math.cos(radiansW));
	const wy = $derived(lengthW * Math.sin(radiansW));
	const signedArea = $derived(vx * wy - vy * wx);
	const orientation = $derived(
		signedArea > 0.02 ? 'counterclockwise · positive' : signedArea < -0.02 ? 'clockwise · negative' : 'parallel · zero area'
	);
	const px = (x: number) => origin.x + x * scale;
	const py = (y: number) => origin.y - y * scale;
	const parallelogram = $derived(
		[
			[0, 0],
			[vx, vy],
			[vx + wx, vy + wy],
			[wx, wy]
		]
			.map(([x, y]) => `${px(x)},${py(y)}`)
			.join(' ')
	);
</script>

<div class="orientation-explorer">
	<DemoHeader title="Explore oriented area" />

	<DemoCard title="Choose two ordered vectors">
		<div class="control-grid">
			<SliderField label="Direction α of v" min={-180} max={180} step={5} decimals={0} bind:value={angleV} tone="blue" />
			<SliderField label="Direction β of w" min={-180} max={180} step={5} decimals={0} bind:value={angleW} tone="amber" />
			<SliderField label="Length of v" min={0.4} max={2.5} step={0.1} decimals={1} bind:value={lengthV} tone="blue" />
			<SliderField label="Length of w" min={0.4} max={2.5} step={0.1} decimals={1} bind:value={lengthW} tone="amber" />
		</div>
	</DemoCard>

	<div class="visual-grid">
		<div class="plot-shell">
			<svg viewBox="0 0 640 400" role="img" aria-label="Two ordered vectors spanning a signed parallelogram">
				<defs>
					<linearGradient id="oriented-area-fill" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stop-color="var(--plot-blue)" stop-opacity="0.22" />
						<stop offset="1" stop-color="var(--plot-violet)" stop-opacity="0.28" />
					</linearGradient>
					<marker id="vector-v-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M0,0 L8,4 L0,8 Z" fill="var(--plot-blue)" />
					</marker>
					<marker id="vector-w-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M0,0 L8,4 L0,8 Z" fill="var(--plot-amber)" />
					</marker>
				</defs>

				{#each [-3, -2, -1, 0, 1, 2, 3] as value (value)}
					<line class="grid-line" x1={px(value)} y1="28" x2={px(value)} y2="372" />
					<line class="grid-line" x1="44" y1={py(value)} x2="596" y2={py(value)} />
				{/each}
				<line class="axis" x1="44" y1={origin.y} x2="596" y2={origin.y} />
				<line class="axis" x1={origin.x} y1="28" x2={origin.x} y2="372" />

				<polygon
					class:negative={signedArea < -0.02}
					class:degenerate={Math.abs(signedArea) <= 0.02}
					class="area-shape"
					points={parallelogram}
				/>
				<line class="translated v-copy" x1={px(wx)} y1={py(wy)} x2={px(vx + wx)} y2={py(vy + wy)} />
				<line class="translated w-copy" x1={px(vx)} y1={py(vy)} x2={px(vx + wx)} y2={py(vy + wy)} />

				<line
					class="vector-v"
					x1={origin.x}
					y1={origin.y}
					x2={px(vx)}
					y2={py(vy)}
					marker-end="url(#vector-v-arrow)"
				/>
				<line
					class="vector-w"
					x1={origin.x}
					y1={origin.y}
					x2={px(wx)}
					y2={py(wy)}
					marker-end="url(#vector-w-arrow)"
				/>
				<circle class="origin-point" cx={origin.x} cy={origin.y} r="4" />
			</svg>
			<div class="vector-legend" aria-label="Vector color key">
				<span><i class="v-swatch"></i><Katex math="\mathbf v" /> first</span>
				<span><i class="w-swatch"></i><Katex math="\mathbf w" /> second</span>
			</div>
		</div>

		<EquationPanel title="Oriented measurement">
			<Katex
				math={String.raw`\begin{aligned}\mathbf v&=(${vx.toFixed(2)},${vy.toFixed(2)})\\\mathbf w&=(${wx.toFixed(2)},${wy.toFixed(2)})\end{aligned}`}
				display
			/>
			<Katex
				math={String.raw`v_1w_2-v_2w_1=${signedArea.toFixed(2)}`}
				display
			/>
			<div class:zero={Math.abs(signedArea) <= 0.02} class="orientation-reading">{orientation}</div>
			<p class="swap-reading">
				Reversing the order would give <Katex math={String.raw`${(-signedArea).toFixed(2)}`} />.
			</p>
		</EquationPanel>
	</div>
</div>

<style>
	.orientation-explorer {
		font-family: var(--font-sans);
	}

	.control-grid,
	.visual-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem 1rem;
	}

	.visual-grid {
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.85fr);
		align-items: stretch;
		margin-top: 0.8rem;
	}

	.plot-shell {
		padding: 0.45rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--color-surface);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.grid-line {
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--color-ink-faint);
		stroke-width: 1.2;
	}

	.area-shape {
		fill: url(#oriented-area-fill);
		stroke: var(--color-d);
		stroke-width: 2;
	}

	.area-shape.negative {
		fill: color-mix(in srgb, var(--plot-error) 14%, transparent);
		stroke: var(--plot-error);
	}

	.area-shape.degenerate {
		fill: none;
		stroke: var(--color-ink-faint);
	}

	.translated {
		stroke-width: 1.5;
		stroke-dasharray: 6 4;
	}

	.v-copy {
		stroke: var(--plot-blue);
	}

	.w-copy {
		stroke: var(--plot-amber);
	}

	.vector-v,
	.vector-w {
		stroke-width: 3.2;
		stroke-linecap: round;
	}

	.vector-v {
		stroke: var(--plot-blue);
	}

	.vector-w {
		stroke: var(--plot-amber);
	}

	.origin-point {
		fill: var(--color-ink);
		stroke: var(--plot-background);
		stroke-width: 2;
	}

	.vector-legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem 1rem;
		margin: 0.15rem 0 0.1rem;
		font-size: 0.72rem;
		color: var(--color-ink-light);
	}

	.vector-legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.vector-legend i {
		display: inline-block;
		width: 1.2rem;
		border-top: 3px solid;
	}

	.v-swatch {
		border-color: var(--plot-blue);
	}

	.w-swatch {
		border-color: var(--plot-amber);
	}

	.orientation-reading {
		margin: 0.45rem auto 0;
		padding: 0.5rem 0.7rem;
		border-radius: 999px;
		background: var(--color-d-glow);
		font-size: 0.78rem;
		font-weight: 700;
		text-align: center;
		color: var(--color-ink);
	}

	.orientation-reading.zero {
		background: var(--color-surface-soft);
	}

	.swap-reading {
		margin: 0.7rem 0 0;
		font-size: 0.82rem;
		text-align: center;
		color: var(--color-ink-light);
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
