<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import ToggleField from '$lib/components/demos/ToggleField.svelte';

	const center = { x: 280, y: 250 };
	const scale = 68;
	const domain = [-2.5, -1.67, -0.83, 0, 0.83, 1.67, 2.5];

	let radius = $state(1.65);
	let positive = $state(true);

	const circulation = $derived((positive ? 1 : -1) * 2 * Math.PI);
	const fieldMagnitude = $derived(1 / radius);
	const circumference = $derived(2 * Math.PI * radius);
	const fieldSamples = domain.flatMap((x) =>
		domain
			.filter((y) => Math.hypot(x, y) > 0.55 && Math.hypot(x, y) < 3.2)
			.map((y) => {
				const r = Math.hypot(x, y);
				const arrowLength = Math.min(0.38, 0.34 / Math.sqrt(r));
				return {
					x,
					y,
					dx: (-y / r) * arrowLength,
					dy: (x / r) * arrowLength
				};
			})
	);
	const px = (x: number) => center.x + x * scale;
	const py = (y: number) => center.y - y * scale;
	const loopRadius = $derived(radius * scale);
	const loopPath = $derived(
		positive
			? `M ${center.x + loopRadius},${center.y} A ${loopRadius},${loopRadius} 0 1 0 ${center.x - loopRadius},${center.y} A ${loopRadius},${loopRadius} 0 1 0 ${center.x + loopRadius},${center.y}`
			: `M ${center.x + loopRadius},${center.y} A ${loopRadius},${loopRadius} 0 1 1 ${center.x - loopRadius},${center.y} A ${loopRadius},${loopRadius} 0 1 1 ${center.x + loopRadius},${center.y}`
	);
</script>

<div class="topology-explorer">
	<DemoHeader title="Explore circulation around a hole" />

	<DemoCard title="Choose a loop">
		<div class="control-grid">
			<SliderField
				label="Loop radius r"
				min={0.7}
				max={2.35}
				step={0.05}
				decimals={2}
				bind:value={radius}
				hint="The loop may move, but it must continue to enclose the missing origin."
				tone="violet"
			/>
			<ToggleField
				label="Counterclockwise orientation"
				hint="Reversing orientation reverses the sign of the integral."
				bind:checked={positive}
			/>
		</div>
	</DemoCard>

	<div class="visual-grid">
		<div class="plot-shell">
			<svg viewBox="0 0 560 500" role="img" aria-label="Circular vector field on a punctured plane with an adjustable oriented loop">
				<defs>
					<radialGradient id="hole-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0" stop-color="#fb7185" stop-opacity="0.28" />
						<stop offset="1" stop-color="#fb7185" stop-opacity="0" />
					</radialGradient>
					<marker id="topology-field-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="#2563eb" />
					</marker>
					<marker id="topology-loop-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" />
					</marker>
				</defs>

				{#each [-3, -2, -1, 0, 1, 2, 3] as value (value)}
					<line class="grid-line" x1={px(value)} y1="28" x2={px(value)} y2="472" />
					<line class="grid-line" x1="38" y1={py(value)} x2="522" y2={py(value)} />
				{/each}
				<line class="axis" x1="38" y1={center.y} x2="522" y2={center.y} />
				<line class="axis" x1={center.x} y1="28" x2={center.x} y2="472" />

				{#each fieldSamples as arrow (`${arrow.x}-${arrow.y}`)}
					<line
						class="field-arrow"
						x1={px(arrow.x - arrow.dx / 2)}
						y1={py(arrow.y - arrow.dy / 2)}
						x2={px(arrow.x + arrow.dx / 2)}
						y2={py(arrow.y + arrow.dy / 2)}
						marker-end="url(#topology-field-arrow)"
					/>
				{/each}

				<circle class="hole-glow" cx={center.x} cy={center.y} r="44" />
				<circle class="hole" cx={center.x} cy={center.y} r="12" />
				<text class="hole-label" x={center.x} y={center.y + 34} text-anchor="middle">origin removed</text>

				<path class="loop" d={loopPath} marker-mid="url(#topology-loop-arrow)" marker-end="url(#topology-loop-arrow)" />
				<circle class="sample-point" cx={center.x + loopRadius} cy={center.y} r="5" />
				<line
					class="tangent-sample"
					x1={center.x + loopRadius}
					y1={center.y}
					x2={center.x + loopRadius}
					y2={center.y - (positive ? 48 : -48)}
					marker-end="url(#topology-loop-arrow)"
				/>
				<text class="loop-label" x={center.x + loopRadius + 12} y={center.y - (positive ? 68 : -82)}>field tangent</text>
			</svg>
		</div>

		<EquationPanel title="Why the total stays constant">
			<Katex math={String.raw`\left\lVert\mathbf F\right\rVert=\frac1r=${fieldMagnitude.toFixed(3)}`} display />
			<Katex math={String.raw`\begin{aligned}\operatorname{length}(C_r)&=2\pi r\\&=${circumference.toFixed(3)}\end{aligned}`} display />
			<Katex math={String.raw`\oint_{C_r}\omega=${positive ? '' : '-'}2\pi=${circulation.toFixed(3)}`} display />
			<p class="reading">
				The field is tangent to the circle. Its magnitude falls like <Katex math={String.raw`1/r`} />, while the
				circumference grows like <Katex math="r" />.
			</p>
		</EquationPanel>
	</div>
</div>

<style>
	.topology-explorer {
		font-family: var(--font-sans);
	}

	.control-grid,
	.visual-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.85rem 1rem;
	}

	.visual-grid {
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
		align-items: stretch;
		margin-top: 0.8rem;
	}

	.plot-shell {
		padding: 0.4rem;
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
		stroke-width: 1.1;
	}

	.field-arrow {
		stroke: #2563eb;
		stroke-width: 1.55;
		stroke-linecap: round;
	}

	.hole-glow {
		fill: url(#hole-glow);
	}

	.hole {
		fill: #fff;
		stroke: #e11d48;
		stroke-width: 3;
	}

	.hole-label,
	.loop-label {
		font-family: var(--font-sans);
		font-size: 12px;
	}

	.hole-label {
		fill: #be123c;
		font-weight: 650;
	}

	.loop {
		fill: none;
		stroke: var(--color-d);
		stroke-width: 3.4;
		stroke-linecap: round;
	}

	.sample-point {
		fill: var(--color-ink);
		stroke: #fff;
		stroke-width: 2;
	}

	.tangent-sample {
		stroke: var(--color-d);
		stroke-width: 2.5;
	}

	.loop-label {
		fill: var(--color-d);
		font-weight: 650;
	}

	.reading {
		margin: 0.65rem 0 0;
		font-size: 0.8rem;
		line-height: 1.5;
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
