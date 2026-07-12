<script lang="ts">
	import SliderField from './SliderField.svelte';
	type Kind = 'square' | 'exponential' | 'conjugate' | 'stretch';
	type C = { re: number; im: number };
	const width = 760,
		height = 385,
		domain = { cx: 190, cy: 205 },
		image = { cx: 570, cy: 205 };
	let kind = $state<Kind>('square'),
		x = $state(0.72),
		y = $state(0.38),
		epsilon = $state(0.34);
	const add = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im }),
		sub = (a: C, b: C): C => ({ re: a.re - b.re, im: a.im - b.im }),
		mul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
	const divide = (a: C, b: C): C => {
		const d = b.re * b.re + b.im * b.im;
		return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
	};
	function f(z: C): C {
		if (kind === 'square') return mul(z, z);
		if (kind === 'exponential') {
			const m = Math.exp(z.re);
			return { re: m * Math.cos(z.im), im: m * Math.sin(z.im) };
		}
		if (kind === 'conjugate') return { re: z.re, im: -z.im };
		return { re: 1.55 * z.re, im: 0.45 * z.im };
	}
	const z = $derived({ re: x, im: y }),
		fz = $derived(f(z));
	const qx = $derived(divide(sub(f(add(z, { re: epsilon, im: 0 })), fz), { re: epsilon, im: 0 }));
	const qy = $derived(divide(sub(f(add(z, { re: 0, im: epsilon })), fz), { re: 0, im: epsilon }));
	const mismatch = $derived(Math.hypot(qx.re - qy.re, qx.im - qy.im));
	const holomorphic = $derived(kind === 'square' || kind === 'exponential');
	const exactDerivative = $derived(
		kind === 'square' ? { re: 2 * x, im: 2 * y } : kind === 'exponential' ? fz : null
	);
	const scale = $derived.by(() => {
		let max = epsilon;
		for (let i = 0; i < 80; i += 1) {
			const t = (2 * Math.PI * i) / 80,
				h = { re: epsilon * Math.cos(t), im: epsilon * Math.sin(t) },
				d = sub(f(add(z, h)), fz);
			max = Math.max(max, Math.hypot(d.re, d.im));
		}
		return 86 / max;
	});
	const circlePath = $derived.by(() => {
		let p = '';
		for (let i = 0; i <= 120; i += 1) {
			const t = (2 * Math.PI * i) / 120,
				h = { re: epsilon * Math.cos(t), im: epsilon * Math.sin(t) },
				d = sub(f(add(z, h)), fz);
			p += `${i ? 'L' : 'M'} ${(image.cx + scale * d.re).toFixed(2)} ${(image.cy - scale * d.im).toFixed(2)} `;
		}
		return p;
	});
	const predictedPath = $derived.by(() => {
		if (!exactDerivative) return '';
		let p = '';
		for (let i = 0; i <= 100; i += 1) {
			const t = (2 * Math.PI * i) / 100,
				h = { re: epsilon * Math.cos(t), im: epsilon * Math.sin(t) },
				d = mul(exactDerivative, h);
			p += `${i ? 'L' : 'M'} ${(image.cx + scale * d.re).toFixed(2)} ${(image.cy - scale * d.im).toFixed(2)} `;
		}
		return p;
	});
	function mappedVector(h: C) {
		const d = sub(f(add(z, h)), fz);
		return { x: image.cx + scale * d.re, y: image.cy - scale * d.im };
	}
	const outX = $derived(mappedVector({ re: epsilon, im: 0 })),
		outY = $derived(mappedVector({ re: 0, im: epsilon }));
	const label = $derived(
		kind === 'square'
			? 'f(z)=z²'
			: kind === 'exponential'
				? 'f(z)=eᶻ'
				: kind === 'conjugate'
					? 'f(z)=z̄'
					: 'f(z)=z+0.55z̄'
	);
	const verdict = $derived(
		holomorphic
			? epsilon < 0.12
				? 'the two quotients nearly agree'
				: 'shrink ε: the quotients converge'
			: kind === 'conjugate'
				? 'reflection reverses orientation'
				: 'unequal stretching turns circles into ellipses'
	);
	const format = (v: C) =>
		`${v.re.toFixed(2)} ${v.im < 0 ? '−' : '+'} ${Math.abs(v.im).toFixed(2)}i`;
</script>

<div class="conformal-lab">
	<div class="heading">
		<div>
			<span>Needham’s amplitwist, made visible</span>
			<h4>Shrink a neighborhood until one multiplier remains</h4>
		</div>
		<p>
			The blue and amber directions approach the same complex quotient only when a true complex
			derivative exists.
		</p>
	</div>
	<div class="functions">
		<button class:active={kind === 'square'} onclick={() => (kind = 'square')}>f(z) = z²</button
		><button class:active={kind === 'exponential'} onclick={() => (kind = 'exponential')}
			>f(z) = eᶻ</button
		><button class:active={kind === 'conjugate'} onclick={() => (kind = 'conjugate')}
			>reflection z̄</button
		><button class:active={kind === 'stretch'} onclick={() => (kind = 'stretch')}
			>unequal stretch</button
		>
	</div>
	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="A shrinking circular neighborhood and two perpendicular directions mapped by a complex function"
		>
			<defs
				><marker id="local-blue" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"
					><path d="M0 0L7 3.5L0 7Z" /></marker
				><marker id="local-amber" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"
					><path d="M0 0L7 3.5L0 7Z" /></marker
				></defs
			>
			<rect class="panel" x="26" y="28" width="328" height="320" rx="18" /><rect
				class="panel"
				x="406"
				y="28"
				width="328"
				height="320"
				rx="18"
			/><text class="title" x="46" y="56">NEIGHBORHOOD OF z</text><text class="title" x="426" y="56"
				>CENTERED IMAGE · f(z+h)−f(z)</text
			>
			<line class="axis" x1="52" x2="328" y1={domain.cy} y2={domain.cy} /><line
				class="axis"
				x1={domain.cx}
				x2={domain.cx}
				y1="72"
				y2="324"
			/><circle class="domain-circle" cx={domain.cx} cy={domain.cy} r="88" /><line
				class="input-x"
				x1={domain.cx}
				y1={domain.cy}
				x2={domain.cx + 88}
				y2={domain.cy}
				marker-end="url(#local-blue)"
			/><line
				class="input-y"
				x1={domain.cx}
				y1={domain.cy}
				x2={domain.cx}
				y2={domain.cy - 88}
				marker-end="url(#local-amber)"
			/><circle class="center" cx={domain.cx} cy={domain.cy} r="5" /><text
				class="epsilon"
				x={domain.cx + 50}
				y={domain.cy - 10}>ε</text
			>
			<line class="axis" x1="432" x2="708" y1={image.cy} y2={image.cy} /><line
				class="axis"
				x1={image.cx}
				x2={image.cx}
				y1="72"
				y2="324"
			/>{#if predictedPath}<path class="prediction" d={predictedPath} />{/if}<path
				class="image-circle"
				d={circlePath}
			/><line
				class="output-x"
				x1={image.cx}
				y1={image.cy}
				x2={outX.x}
				y2={outX.y}
				marker-end="url(#local-blue)"
			/><line
				class="output-y"
				x1={image.cx}
				y1={image.cy}
				x2={outY.x}
				y2={outY.y}
				marker-end="url(#local-amber)"
			/><circle class="center" cx={image.cx} cy={image.cy} r="5" /><text
				class="function-label"
				x="380"
				y="189"
				text-anchor="middle">{label}</text
			><text class="arrow" x="380" y="211" text-anchor="middle">→</text>
			<text
				class:good={holomorphic && epsilon < 0.12}
				class="verdict"
				x="570"
				y="331"
				text-anchor="middle">{verdict}</text
			>
		</svg>
	</div>
	<div class="quotients">
		<div><i class="blue-dot"></i><small>approach along ε</small><strong>{format(qx)}</strong></div>
		<div>
			<i class="amber-dot"></i><small>approach along iε</small><strong>{format(qy)}</strong>
		</div>
		<div class:good={mismatch < 0.08}>
			<small>disagreement</small><strong>{mismatch.toFixed(3)}</strong>
		</div>
	</div>
	<div class="controls">
		<SliderField
			label="Neighborhood radius ε"
			min={0.04}
			max={0.7}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={epsilon}
		/><SliderField
			label="Point · real part x"
			min={-1.2}
			max={1.2}
			step={0.02}
			decimals={2}
			tone="blue"
			bind:value={x}
		/><SliderField
			label="Point · imaginary part y"
			min={-1.2}
			max={1.2}
			step={0.02}
			decimals={2}
			tone="amber"
			bind:value={y}
		/>
	</div>
</div>

<style>
	.conformal-lab {
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
	.epsilon,
	.function-label,
	.arrow,
	.verdict {
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
		stroke: var(--plot-grid);
	}
	.domain-circle {
		fill: color-mix(in srgb, var(--plot-violet) 7%, transparent);
		stroke: var(--plot-violet);
		stroke-width: 2;
		stroke-dasharray: 4 5;
	}
	.image-circle {
		fill: color-mix(in srgb, var(--plot-teal) 8%, transparent);
		stroke: var(--plot-teal);
		stroke-width: 3;
	}
	.prediction {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 1.6;
		stroke-dasharray: 5 5;
	}
	.input-x,
	.output-x {
		stroke: var(--plot-blue);
		stroke-width: 3;
	}
	.input-y,
	.output-y {
		stroke: var(--plot-amber);
		stroke-width: 3;
	}
	:global(#local-blue path) {
		fill: var(--plot-blue);
	}
	:global(#local-amber path) {
		fill: var(--plot-amber);
	}
	.center {
		fill: var(--plot-ink);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.epsilon,
	.function-label {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 750;
	}
	.arrow {
		fill: var(--plot-violet);
		font-size: 24px;
	}
	.verdict {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 700;
	}
	.verdict.good {
		fill: var(--plot-teal);
	}
	.quotients {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.8rem;
		padding: 0.8rem 0.25rem;
	}
	.quotients div {
		min-width: 0;
	}
	.quotients small {
		display: block;
		color: var(--color-ink-light);
		font: 650 0.7rem/1.25 var(--font-sans);
	}
	.quotients strong {
		display: block;
		margin-top: 0.12rem;
		font: 750 0.86rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.quotients i {
		display: inline-block;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		margin-right: 0.35rem;
	}
	.blue-dot {
		background: var(--plot-blue);
	}
	.amber-dot {
		background: var(--plot-amber);
	}
	.quotients .good strong {
		color: var(--plot-teal);
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
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
		.epsilon,
		.function-label,
		.verdict {
			font-size: 15px;
		}
		.quotients {
			grid-template-columns: 1fr 1fr;
			gap: 0.55rem;
		}
		.quotients div:last-child {
			grid-column: 1/-1;
		}
		.controls {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
	}
</style>
