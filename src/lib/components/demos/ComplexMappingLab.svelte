<script lang="ts">
	import SliderField from './SliderField.svelte';
	type FunctionName = 'square' | 'exponential' | 'reciprocal' | 'sine';
	type Complex = { re: number; im: number };
	const width = 760,
		height = 365,
		left = { cx: 190, cy: 185, s: 68 },
		right = { cx: 570, cy: 185, s: 40 };
	let fn = $state<FunctionName>('square'),
		x = $state(0.72),
		y = $state(0.46);
	const z = $derived({ re: x, im: y }),
		w = $derived(apply(z));
	function apply(p: Complex): Complex {
		if (fn === 'square') return { re: (p.re * p.re - p.im * p.im) / 2, im: p.re * p.im };
		if (fn === 'exponential') {
			const m = Math.exp(p.re) / 2;
			return { re: m * Math.cos(p.im), im: m * Math.sin(p.im) };
		}
		if (fn === 'reciprocal') {
			const d = p.re * p.re + p.im * p.im + 0.035;
			return { re: p.re / d, im: -p.im / d };
		}
		return {
			re: (Math.sin(p.re) * Math.cosh(p.im)) / 1.8,
			im: (Math.cos(p.re) * Math.sinh(p.im)) / 1.8
		};
	}
	const label = $derived(
		fn === 'square'
			? 'f(z)=z²'
			: fn === 'exponential'
				? 'f(z)=eᶻ'
				: fn === 'reciprocal'
					? 'f(z)=1/z'
					: 'f(z)=sin z'
	);
	function sx(panel: typeof left, value: number) {
		return panel.cx + panel.s * value;
	}
	function sy(panel: typeof left, value: number) {
		return panel.cy - panel.s * value;
	}
	function mappedLine(vertical: boolean, value: number) {
		let path = '';
		let drawing = false;
		for (let i = 0; i <= 90; i += 1) {
			const t = -2.15 + (4.3 * i) / 90;
			const p = apply(vertical ? { re: value, im: t } : { re: t, im: value });
			const visible = Math.abs(p.re) <= 2.55 && Math.abs(p.im) <= 2.55;
			if (!visible) {
				drawing = false;
				continue;
			}
			path += `${drawing ? 'L' : 'M'} ${sx(right, p.re).toFixed(1)} ${sy(right, p.im).toFixed(1)} `;
			drawing = true;
		}
		return path;
	}
	const gridValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
</script>

<div class="mapping-lab">
	<div class="heading">
		<div>
			<span>Complex functions reshape a plane</span>
			<h4>Send a whole grid through one formula</h4>
		</div>
		<p>
			Follow one point, then look beyond it: every horizontal and vertical line is transformed at
			once.
		</p>
	</div>
	<div class="functions" aria-label="Complex function">
		<button class:active={fn === 'square'} onclick={() => (fn = 'square')}>f(z) = z²</button><button
			class:active={fn === 'exponential'}
			onclick={() => (fn = 'exponential')}>f(z) = eᶻ</button
		><button class:active={fn === 'reciprocal'} onclick={() => (fn = 'reciprocal')}
			>f(z) = 1/z</button
		><button class:active={fn === 'sine'} onclick={() => (fn = 'sine')}>f(z) = sin z</button>
	</div>
	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="A Cartesian grid in the complex z plane mapped through a function into the w plane"
		>
			<defs
				><marker id="map-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"
					><path d="M0 0L8 4L0 8Z" /></marker
				></defs
			>
			<rect class="panel" x="26" y="28" width="328" height="308" rx="18" /><rect
				class="panel"
				x="406"
				y="28"
				width="328"
				height="308"
				rx="18"
			/>
			<text class="title" x="46" y="55">INPUT PLANE · z = x + iy</text><text
				class="title"
				x="426"
				y="55">OUTPUT PLANE · w = f(z)</text
			>
			{#each gridValues as value (value)}<line
					class="input-grid vertical"
					class:major={value === 0}
					x1={sx(left, value)}
					x2={sx(left, value)}
					y1={sy(left, 2.15)}
					y2={sy(left, -2.15)}
				/><line
					class="input-grid horizontal"
					class:major={value === 0}
					x1={sx(left, -2.15)}
					x2={sx(left, 2.15)}
					y1={sy(left, value)}
					y2={sy(left, value)}
				/><path
					class="mapped vertical"
					class:major={value === 0}
					d={mappedLine(true, value)}
				/><path
					class="mapped horizontal"
					class:major={value === 0}
					d={mappedLine(false, value)}
				/>{/each}
			<circle class="input-halo" cx={sx(left, x)} cy={sy(left, y)} r="11" /><circle
				class="input-point"
				cx={sx(left, x)}
				cy={sy(left, y)}
				r="5"
			/><circle class="output-halo" cx={sx(right, w.re)} cy={sy(right, w.im)} r="11" /><circle
				class="output-point"
				cx={sx(right, w.re)}
				cy={sy(right, w.im)}
				r="5"
			/>
			<path class="mapping-arrow" d="M363 183H397" marker-end="url(#map-arrow)" /><text
				class="formula"
				x="380"
				y="168"
				text-anchor="middle">{label}</text
			>
			<text class="axis" x="338" y={sy(left, 0) - 8} text-anchor="end">Re z</text><text
				class="axis"
				x={sx(left, 0) + 8}
				y="72">Im z</text
			><text class="axis" x="718" y={sy(right, 0) - 8} text-anchor="end">Re w</text><text
				class="axis"
				x={sx(right, 0) + 8}
				y="72">Im w</text
			>
		</svg>
	</div>
	<div class="readout">
		<span>z = {x.toFixed(2)} {y < 0 ? '−' : '+'} {Math.abs(y).toFixed(2)}i</span><span
			>f(z) = {w.re.toFixed(2)} {w.im < 0 ? '−' : '+'} {Math.abs(w.im).toFixed(2)}i</span
		>
	</div>
	<div class="controls">
		<SliderField
			label="Real part x"
			min={-1.8}
			max={1.8}
			step={0.02}
			decimals={2}
			tone="blue"
			bind:value={x}
		/><SliderField
			label="Imaginary part y"
			min={-1.8}
			max={1.8}
			step={0.02}
			decimals={2}
			tone="amber"
			bind:value={y}
		/>
	</div>
</div>

<style>
	.mapping-lab {
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}
	.heading {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(15rem, 0.85fr);
		align-items: end;
		gap: 1.4rem;
		margin-bottom: 1rem;
	}
	.heading span {
		color: var(--plot-violet);
		font: 800 0.7rem/1.2 var(--font-sans);
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	.heading h4 {
		margin: 0.15rem 0 0;
		font-family: var(--font-serif);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 600;
	}
	.heading p {
		margin: 0;
		color: var(--color-ink-light);
		font-size: 0.91rem;
		line-height: 1.5;
	}
	.functions {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.45rem;
		margin-bottom: 0.7rem;
	}
	.functions button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.56rem 0.5rem;
		font: 700 0.76rem/1.1 var(--font-sans);
		cursor: pointer;
	}
	.functions button.active,
	.functions button:hover,
	.functions button:focus-visible {
		border-color: var(--plot-violet);
		background: color-mix(in srgb, var(--plot-violet) 9%, var(--color-surface-raised));
	}
	.stage {
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 18px;
		background: color-mix(in srgb, var(--color-surface-raised) 84%, var(--plot-background));
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.panel {
		fill: var(--plot-background);
		stroke: var(--color-border-light);
	}
	.title,
	.axis,
	.formula {
		font-family: var(--font-sans);
		pointer-events: none;
	}
	.title {
		fill: var(--plot-muted);
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.09em;
	}
	.axis {
		fill: var(--plot-muted);
		font-size: 10px;
		font-weight: 650;
	}
	.input-grid,
	.mapped {
		fill: none;
		stroke-width: 1.2;
	}
	.input-grid.vertical,
	.mapped.vertical {
		stroke: var(--plot-blue);
	}
	.input-grid.horizontal,
	.mapped.horizontal {
		stroke: var(--plot-amber);
	}
	.input-grid {
		opacity: 0.42;
	}
	.mapped {
		opacity: 0.7;
	}
	.input-grid.major,
	.mapped.major {
		stroke-width: 2;
		opacity: 0.95;
	}
	.input-halo,
	.output-halo {
		fill: color-mix(in srgb, var(--plot-violet) 18%, transparent);
	}
	.input-point {
		fill: var(--plot-violet);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.output-point {
		fill: var(--plot-teal);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.mapping-arrow {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 2;
	}
	.mapping-arrow + text {
		fill: var(--color-ink);
	}
	:global(#map-arrow path) {
		fill: var(--plot-violet);
	}
	.formula {
		fill: var(--color-ink);
		font-size: 10px;
		font-weight: 750;
	}
	.readout {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		padding: 0.75rem 0.25rem;
		font: 750 0.84rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.readout span:last-child {
		text-align: right;
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
		padding: 0.7rem 0.2rem 0;
		border-top: 1px solid var(--color-border-light);
	}
	@media (max-width: 640px) {
		.heading {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.functions {
			grid-template-columns: repeat(2, 1fr);
		}
		.title,
		.axis,
		.formula {
			font-size: 15px;
		}
		.readout {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}
		.readout span:last-child {
			text-align: left;
		}
		.controls {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
	}
</style>
