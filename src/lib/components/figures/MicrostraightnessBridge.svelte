<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';

	const r = String.raw;

	function setupMicrostraightnessBridge(_JXG: any, board: any) {
		// Quadratic on purpose: residual is visually clear and exactly second-order.
		const f = (x: number) => 0.36 * x + 0.22 * (x - 1.8) ** 2 + 0.38;
		const fp = (x: number) => 0.36 + 0.44 * (x - 1.8);

		const a = 1.35;
		const d = 1.5;
		const x1 = a;
		const x2 = a + d;

		const y1 = f(x1);
		const y2 = f(x2);
		const slope = fp(a);
		const yLinear = y1 + slope * d;

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
			{ strokeColor: '#cdc7be', strokeWidth: 1.15, highlight: false }
		);

		// Curve and tangent
		board.create('functiongraph', [f, 0.58, 3.9], {
			strokeColor: '#1a1a2e',
			strokeWidth: 2.8,
			highlight: false
		});

		const t1 = a - 0.55;
		const t2 = a + 1.95;
		board.create('segment', [[t1, y1 + slope * (t1 - a)], [t2, y1 + slope * (t2 - a)]], {
			strokeColor: '#7c3aed',
			strokeWidth: 2,
			dash: 2,
			highlight: false
		});

		// Vertical guides
		board.create('segment', [[x1, yAxis], [x1, y1]], {
			strokeColor: '#dfd9ea',
			strokeWidth: 1,
			dash: 2,
			highlight: false
		});
		board.create('segment', [[x2, yAxis], [x2, yHigh + 0.02]], {
			strokeColor: '#dfd9ea',
			strokeWidth: 1,
			dash: 2,
			highlight: false
		});

		// True values
		board.create('point', [x1, y1], {
			name: '',
			size: 3.3,
			fillColor: '#1a1a2e',
			strokeColor: '#1a1a2e',
			fixed: true,
			highlight: false
		});
		board.create('point', [x2, y2], {
			name: '',
			size: 3.3,
			fillColor: '#1a1a2e',
			strokeColor: '#1a1a2e',
			fixed: true,
			highlight: false
		});

		// Linear prediction at a + d
		board.create('point', [x2, yLinear], {
			name: '',
			size: 3.6,
			face: 'o',
			fillColor: 'white',
			strokeColor: '#7c3aed',
			strokeWidth: 2,
			fixed: true,
			highlight: false
		});

		// Bracket for d
		board.create('segment', [[x1, 0.47], [x2, 0.47]], {
			strokeColor: '#7c3aed',
			strokeWidth: 2.2,
			highlight: false
		});
		board.create('segment', [[x1, 0.43], [x1, 0.51]], {
			strokeColor: '#7c3aed',
			strokeWidth: 1.6,
			highlight: false
		});
		board.create('segment', [[x2, 0.43], [x2, 0.51]], {
			strokeColor: '#7c3aed',
			strokeWidth: 1.6,
			highlight: false
		});

		// Residual bracket
		board.create('segment', [[xGap, yLow], [xGap, yHigh]], {
			strokeColor: '#dc2626',
			strokeWidth: 1.9,
			highlight: false
		});
		board.create('segment', [[xGap - 0.03, yLow], [xGap + 0.03, yLow]], {
			strokeColor: '#dc2626',
			strokeWidth: 1.6,
			highlight: false
		});
		board.create('segment', [[xGap - 0.03, yHigh], [xGap + 0.03, yHigh]], {
			strokeColor: '#dc2626',
			strokeWidth: 1.6,
			highlight: false
		});

		// Axis labels
		board.create('text', [x1, 0.37, 'a'], {
			fontSize: 16,
			anchorX: 'middle',
			color: '#1a1a2e',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [x2, 0.37, 'a+d'], {
			fontSize: 16,
			anchorX: 'middle',
			color: '#1a1a2e',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [(x1 + x2) / 2, 0.57, 'd'], {
			fontSize: 15,
			anchorX: 'middle',
			color: '#7c3aed',
			fontStyle: 'italic',
			highlight: false
		});
		board.create('text', [xGap + 0.12, (yLow + yHigh) / 2 + 0.02, 'r(d)'], {
			fontSize: 12.5,
			anchorX: 'left',
			color: '#dc2626',
			highlight: false
		});
	}
</script>

<div
	class="micro-bridge"
	role="img"
	aria-label="Microstraightness figure: curve and tangent agree to first order over an infinitesimal step"
>
	<section class="geometry-block">
		<h4>Geometry</h4>
		<JSXGraphBoard
			setup={setupMicrostraightnessBridge}
			boundingbox={[0.35, 2.85, 4.1, 0.25]}
			aspectRatio={(4.1 - 0.35) / (2.85 - 0.25)}
			axes={false}
		/>
		<div class="legend-row">
			<span class="legend-chip curve"></span>
			<span class="legend-text"><Katex math={r`f(a+d)`} /> true value</span>
		</div>
		<div class="legend-row">
			<span class="legend-chip linear"></span>
			<span class="legend-text"><Katex math={r`f(a)+f'(a)d`} /> tangent value</span>
		</div>
		<div class="legend-row">
			<span class="legend-chip residual"></span>
			<span class="legend-text"><Katex math={r`r(d)\sim d^2`} /> residual</span>
		</div>
	</section>

	<section class="algebra-block">
		<h4>Algebraic Translation</h4>
		<div class="algebra-card">
			<div class="chain">
				<div class="line"><Katex math={r`f(a+d)=f(a)+f'(a)d+r(d)`} display /></div>
				<div class="line"><Katex math={r`r(d)=d^2 g(d)`} display /></div>
				<div class="rule"><Katex math={r`d^2=0\ \text{for}\ d\in D`} display /></div>
				<div class="line result"><Katex math={r`\therefore\ f(a+d)=f(a)+f'(a)d`} display /></div>
			</div>
		</div>
		<p class="summary">So on <Katex math="D" />, only first-order change survives.</p>
	</section>
</div>

<style>
	.micro-bridge {
		display: grid;
		grid-template-columns: minmax(0, 1.24fr) minmax(0, 1fr);
		gap: 1.5rem;
		padding: 1.5rem 1.6rem;
		border: 1px solid var(--color-border-light);
		border-radius: 1.02rem;
		background: white;
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

	.geometry-block {
		padding-right: 0.95rem;
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
		padding-left: 0.45rem;
	}

	.algebra-card {
		padding: 0.95rem 1rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.72rem;
		background: #fff;
	}

	.chain {
		display: grid;
		gap: 0.34rem;
	}

	.algebra-block :global(.katex) {
		font-size: 0.8em;
	}

	.line :global(.katex-display) {
		margin: 0.08rem 0 !important;
		text-align: center;
	}

	.rule {
		margin: 0.24rem 0 0.2rem;
		padding: 0.36rem 0.56rem;
		border-radius: 0.5rem;
		border: 1px solid #e6d9ff;
		background: #f8f3ff;
	}

	.rule :global(.katex) {
		color: #7c3aed;
		font-weight: 600;
		font-size: 0.92em;
	}

	.result {
		padding-top: 0.34rem;
		border-top: 1px solid #ece5fa;
	}

	.summary {
		margin: 0.7rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--color-ink-light);
		line-height: 1.5;
		text-align: center;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: 0.48rem;
	}

	.legend-chip {
		width: 0.95rem;
		height: 0.45rem;
		flex: 0 0 auto;
		border-radius: 999px;
	}

	.legend-chip.curve {
		background: #1a1a2e;
	}

	.legend-chip.linear {
		background: transparent;
		border: 2px solid #7c3aed;
	}

	.legend-chip.residual {
		background: #dc2626;
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

	@media (max-width: 920px) {
		.micro-bridge {
			grid-template-columns: 1fr;
		}

		.geometry-block {
			border-right: none;
			padding-right: 0;
			padding-bottom: 0.72rem;
			border-bottom: 1px solid var(--color-border-light);
		}

		.algebra-block {
			padding-left: 0;
		}
	}
</style>
