<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';

	const r = String.raw;

	function setupMicrostraightnessBridge(_JXG: any, board: any) {
		// Quadratic on purpose: residual is visually clear and exactly second-order.
		const f = (x: number) => 0.36 * x + 0.22 * (x - 1.8) ** 2 + 0.38;
		const fp = (x: number) => 0.36 + 0.44 * (x - 1.8);

		const a = 1.35;
		const deltaX = 1.5;
		const x1 = a;
		const x2 = a + deltaX;

		const y1 = f(x1);
		const y2 = f(x2);
		const slope = fp(a);
		const yLinear = y1 + slope * deltaX;

		const yAxis = 0.64;
		const yLow = Math.min(y2, yLinear);
		const yHigh = Math.max(y2, yLinear);
		const xGap = x2 + 0.33;

		// Base axis
		board.create(
			'segment',
			[
				[0.52, yAxis],
				[3.92, yAxis]
			],
			{ strokeColor: 'var(--plot-axis)', strokeWidth: 1.15, highlight: false }
		);

		// Curve and tangent
		board.create('functiongraph', [f, 0.58, 3.9], {
			strokeColor: 'var(--plot-curve)',
			strokeWidth: 2.2,
			highlight: false
		});

		const t1 = a - 0.55;
		const t2 = a + 1.95;
		board.create(
			'segment',
			[
				[t1, y1 + slope * (t1 - a)],
				[t2, y1 + slope * (t2 - a)]
			],
			{
				strokeColor: 'var(--plot-tangent)',
				strokeWidth: 1.8,
				dash: 2,
				highlight: false
			}
		);

		// Vertical guides
		board.create(
			'segment',
			[
				[x1, yAxis],
				[x1, y1]
			],
			{
				strokeColor: 'var(--plot-grid)',
				strokeWidth: 1,
				dash: 2,
				highlight: false
			}
		);
		board.create(
			'segment',
			[
				[x2, yAxis],
				[x2, yHigh + 0.02]
			],
			{
				strokeColor: 'var(--plot-grid)',
				strokeWidth: 1,
				dash: 2,
				highlight: false
			}
		);

		// True values
		board.create('point', [x1, y1], {
			name: '',
			size: 3.3,
			fillColor: 'var(--plot-curve)',
			strokeColor: 'var(--plot-curve)',
			fixed: true,
			highlight: false
		});
		board.create('point', [x2, y2], {
			name: '',
			size: 3.3,
			fillColor: 'var(--plot-curve)',
			strokeColor: 'var(--plot-curve)',
			fixed: true,
			highlight: false
		});

		// Linear prediction at a + d
		board.create('point', [x2, yLinear], {
			name: '',
			size: 3.6,
			face: 'o',
			fillColor: 'var(--plot-background)',
			strokeColor: 'var(--plot-tangent)',
			strokeWidth: 2,
			fixed: true,
			highlight: false
		});

		// Bracket for the ordinary finite step
		board.create(
			'segment',
			[
				[x1, 0.47],
				[x2, 0.47]
			],
			{
				strokeColor: 'var(--plot-tangent)',
				strokeWidth: 2.2,
				highlight: false
			}
		);
		board.create(
			'segment',
			[
				[x1, 0.43],
				[x1, 0.51]
			],
			{
				strokeColor: 'var(--plot-tangent)',
				strokeWidth: 1.6,
				highlight: false
			}
		);
		board.create(
			'segment',
			[
				[x2, 0.43],
				[x2, 0.51]
			],
			{
				strokeColor: 'var(--plot-tangent)',
				strokeWidth: 1.6,
				highlight: false
			}
		);

		// Finite gap between the curve and the local line
		board.create(
			'segment',
			[
				[xGap, yLow],
				[xGap, yHigh]
			],
			{
				strokeColor: 'var(--plot-error)',
				strokeWidth: 1.9,
				highlight: false
			}
		);
		board.create(
			'segment',
			[
				[xGap - 0.03, yLow],
				[xGap + 0.03, yLow]
			],
			{
				strokeColor: 'var(--plot-error)',
				strokeWidth: 1.6,
				highlight: false
			}
		);
		board.create(
			'segment',
			[
				[xGap - 0.03, yHigh],
				[xGap + 0.03, yHigh]
			],
			{
				strokeColor: 'var(--plot-error)',
				strokeWidth: 1.6,
				highlight: false
			}
		);

		// Axis labels
		board.create('text', [x1, 0.37, 'a'], {
			fontSize: 16,
			anchorX: 'middle',
			color: 'var(--plot-ink)',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [x2, 0.37, 'a+Δx'], {
			fontSize: 16,
			anchorX: 'middle',
			color: 'var(--plot-ink)',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [(x1 + x2) / 2, 0.57, 'Δx'], {
			fontSize: 15,
			anchorX: 'middle',
			color: 'var(--plot-tangent)',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [xGap + 0.12, (yLow + yHigh) / 2 + 0.02, 'gap'], {
			fontSize: 12.5,
			anchorX: 'left',
			color: 'var(--plot-error)',
			highlight: false
		});
	}
</script>

<div
	class="micro-bridge"
	role="img"
	aria-label="Comparison of an ordinary finite step with the exact first-order linear form"
>
	<section class="geometry-block">
		<h4>Ordinary finite step: the curve and local line separate</h4>
		<JSXGraphBoard
			setup={setupMicrostraightnessBridge}
			boundingbox={[0.35, 2.85, 4.1, 0.25]}
			aspectRatio={(4.1 - 0.35) / (2.85 - 0.25)}
			axes={false}
			embedded
		/>
		<div class="legend-bar" aria-label="Plot legend">
			<div class="legend-row"><span class="legend-chip curve"></span><span class="legend-text"><Katex math={r`f(a+\Delta x)`} /> curve value</span></div>
			<div class="legend-row"><span class="legend-chip linear"></span><span class="legend-text"><Katex math={r`f(a)+m\Delta x`} /> local-line value</span></div>
			<div class="legend-row"><span class="legend-chip residual"></span><span class="legend-text">finite gap</span></div>
		</div>
	</section>

	<section class="algebra-block">
		<div class="algebra-heading">
			<h4>First-order view</h4>
			<div class="rule"><Katex math={r`d^2=0`} /></div>
		</div>
		<div class="result"><Katex math={r`f(a+d)=f(a)+md`} display /></div>
		<p class="summary">The second-order gap vanishes; the unique coefficient <Katex math="m" /> records the shared local direction.</p>
	</section>
</div>

<style>
	.micro-bridge {
		display: grid;
		gap: 1rem;
	}

	.geometry-block :global(.neo-figure) {
		margin: 0;
	}

	.geometry-block :global(figcaption) {
		display: none;
	}

	.geometry-block :global(.jsx-board-wrapper) {
		border-radius: 0.74rem;
		border-color: var(--color-border-light);
	}

	.geometry-block :global(.jxgbox) {
		border: none !important;
	}

	h4 {
		margin: 0 0 0.72rem;
		font-family: var(--font-sans);
		font-size: 0.94rem;
		font-weight: 650;
		letter-spacing: 0.03em;
		color: var(--color-ink-light);
	}

	.algebra-block {
		padding: 0.85rem 1rem 0.75rem;
		border-left: 3px solid var(--color-d);
		border-radius: 0 0.65rem 0.65rem 0;
		background: linear-gradient(135deg, var(--color-d-glow), var(--color-d-soft));
	}

	.algebra-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.algebra-heading h4 {
		margin: 0;
	}

	.rule {
		font-family: var(--font-serif);
		color: var(--color-d);
	}

	.rule :global(.katex) {
		color: var(--color-d);
		font-weight: 600;
		font-size: 1em;
	}

	.result {
		margin-top: 0.15rem;
		text-align: center;
	}

	.result :global(.katex-display) {
		margin: 0.15rem 0 !important;
	}

	.summary {
		margin: 0.2rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--color-ink-light);
		line-height: 1.5;
		text-align: center;
	}

	.legend-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		margin-top: 0.65rem;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend-chip {
		width: 0.95rem;
		height: 0.45rem;
		flex: 0 0 auto;
		border-radius: 999px;
	}

	.legend-chip.curve {
		background: var(--plot-curve);
	}

	.legend-chip.linear {
		background: transparent;
		border: 2px solid var(--plot-tangent);
	}

	.legend-chip.residual {
		background: var(--plot-error);
	}

	.legend-text {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--color-ink-light);
		line-height: 1.35;
	}

	.legend-text :global(.katex) {
		font-size: 0.9em;
	}

	@media (max-width: 540px) {
		.algebra-heading {
			align-items: flex-start;
		}
	}
</style>
