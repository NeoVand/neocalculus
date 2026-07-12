<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';
	type Kind = 'identity' | 'reciprocal' | 'shifted';
	type C = { re: number; im: number };
	const width = 760,
		height = 350,
		left = { cx: 190, cy: 186, s: 82 },
		right = { cx: 570, cy: 186, s: 9.2 };
	let kind = $state<Kind>('reciprocal'),
		radius = $state(1.25),
		pole = $state(0.45),
		winding = $state(1),
		progress = $state(0),
		running = $state(true);
	const add = (a: C, b: C) => ({ re: a.re + b.re, im: a.im + b.im }),
		mul = (a: C, b: C) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
	function value(z: C): C | null {
		if (kind === 'identity') return z;
		const shift = kind === 'shifted' ? pole : 0,
			d = (z.re - shift) ** 2 + z.im ** 2;
		if (d < 1e-8) return null;
		return { re: (z.re - shift) / d, im: -z.im / d };
	}
	const poleOnContour = $derived(kind === 'shifted' && Math.abs(Math.abs(pole) - radius) < 0.026);
	const samples = $derived.by(() => {
		const points: { z: C; sum: C }[] = [];
		let sum: C = { re: 0, im: 0 };
		const n = 240;
		for (let i = 0; i <= n; i += 1) {
			const t = (2 * Math.PI * winding * i) / n,
				z = { re: radius * Math.cos(t), im: radius * Math.sin(t) };
			if (i > 0) {
				const t0 = (2 * Math.PI * winding * (i - 1)) / n,
					z0 = { re: radius * Math.cos(t0), im: radius * Math.sin(t0) },
					dz = { re: z.re - z0.re, im: z.im - z0.im },
					mid = { re: (z.re + z0.re) / 2, im: (z.im + z0.im) / 2 };
				const f = value(mid);
				if (f && !poleOnContour) sum = add(sum, mul(f, dz));
			}
			points.push({ z, sum });
		}
		return points;
	});
	const currentIndex = $derived(
			Math.min(samples.length - 1, Math.floor(progress * (samples.length - 1)))
		),
		current = $derived(
			samples[currentIndex] ?? samples[0] ?? { z: { re: 0, im: 0 }, sum: { re: 0, im: 0 } }
		),
		total = $derived(samples[samples.length - 1]?.sum ?? { re: 0, im: 0 });
	const sx = (p: typeof left, v: number) => p.cx + p.s * v,
		sy = (p: typeof left, v: number) => p.cy - p.s * v;
	const contourPath = $derived(
		samples
			.map(
				(p, i) => `${i ? 'L' : 'M'} ${sx(left, p.z.re).toFixed(1)} ${sy(left, p.z.im).toFixed(1)}`
			)
			.join(' ')
	);
	const accumulationPath = $derived(
		samples
			.slice(0, currentIndex + 1)
			.map(
				(p, i) =>
					`${i ? 'L' : 'M'} ${sx(right, p.sum.re).toFixed(1)} ${sy(right, p.sum.im).toFixed(1)}`
			)
			.join(' ')
	);
	const contribution = $derived.by(() => {
		const z = current.z,
			f = value(z) ?? { re: 0, im: 0 },
			tangent = { re: -z.im, im: z.re },
			v = mul(f, tangent),
			m = Math.hypot(v.re, v.im) || 1;
		return { re: v.re / m, im: v.im / m };
	});
	const inside = $derived(kind !== 'shifted' || Math.abs(pole) < radius);
	const arrowFrom = $derived(winding < 0 ? 1 : 0.55),
		arrowTo = $derived(winding < 0 ? 0.55 : 1);
	function choose(next: Kind) {
		kind = next;
		progress = 0;
		running = true;
	}
	const totalText = $derived(
		poleOnContour
			? 'undefined · pole on C'
			: `${total.re.toFixed(2)} ${total.im < 0 ? '−' : '+'} ${Math.abs(total.im).toFixed(2)}i`
	);
	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			running = false;
			return;
		}
		let frame = 0,
			previous = performance.now();
		const animate = (now: number) => {
			const dt = Math.min(0.04, (now - previous) / 1000);
			previous = now;
			if (running) progress = (progress + dt * 0.075) % 1;
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="contour-lab">
	<div class="heading">
		<div>
			<span>Integration along a curve</span>
			<h4>Watch tiny complex contributions assemble</h4>
		</div>
		<p>
			The left point walks around C. On the right, each product f(z)dz is attached to the sum
			already accumulated.
		</p>
	</div>
	<div class="functions">
		<button class:active={kind === 'identity'} onclick={() => choose('identity')}>f(z) = z</button
		><button class:active={kind === 'reciprocal'} onclick={() => choose('reciprocal')}
			>f(z) = 1/z</button
		><button class:active={kind === 'shifted'} onclick={() => choose('shifted')}
			>f(z) = 1/(z − a)</button
		>
	</div>
	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="A contour integral shown as a moving contribution and its accumulated complex sum"
		>
			<defs
				><marker
					id="contour-arrow"
					markerWidth="7"
					markerHeight="7"
					refX="6"
					refY="3.5"
					orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker
				><marker
					id="vector-arrow"
					markerWidth="7"
					markerHeight="7"
					refX="6"
					refY="3.5"
					orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker
				></defs
			>
			<rect class="panel" x="26" y="28" width="328" height="294" rx="18" /><rect
				class="panel"
				x="406"
				y="28"
				width="328"
				height="294"
				rx="18"
			/><text class="title" x="46" y="56">CONTOUR C IN THE z-PLANE</text><text
				class="title"
				x="426"
				y="56">RUNNING SUM ∫ f(z) dz</text
			>
			<line class="axis" x1="53" x2="327" y1={left.cy} y2={left.cy} /><line
				class="axis"
				x1={left.cx}
				x2={left.cx}
				y1="70"
				y2="302"
			/><line class="axis" x1="430" x2="710" y1={right.cy} y2={right.cy} /><line
				class="axis"
				x1={right.cx}
				x2={right.cx}
				y1="70"
				y2="302"
			/>
			<path class="contour" d={contourPath} /><path
				class="direction"
				d={`M ${sx(left, radius * Math.cos(arrowFrom))} ${sy(left, radius * Math.sin(arrowFrom))} A ${radius * left.s} ${radius * left.s} 0 0 ${winding < 0 ? 1 : 0} ${sx(left, radius * Math.cos(arrowTo))} ${sy(left, radius * Math.sin(arrowTo))}`}
				marker-end="url(#contour-arrow)"
			/>
			{#if kind !== 'identity'}<circle
					class="pole-halo"
					cx={sx(left, kind === 'shifted' ? pole : 0)}
					cy={left.cy}
					r="12"
				/><circle
					class="pole"
					cx={sx(left, kind === 'shifted' ? pole : 0)}
					cy={left.cy}
					r="5"
				/><text class="pole-label" x={sx(left, kind === 'shifted' ? pole : 0) + 10} y={left.cy - 12}
					>pole</text
				>{/if}
			<circle
				class="walker-halo"
				cx={sx(left, current.z.re)}
				cy={sy(left, current.z.im)}
				r="11"
			/><circle class="walker" cx={sx(left, current.z.re)} cy={sy(left, current.z.im)} r="5" /><line
				class="contribution"
				x1={sx(left, current.z.re)}
				y1={sy(left, current.z.im)}
				x2={sx(left, current.z.re) + 34 * contribution.re}
				y2={sy(left, current.z.im) - 34 * contribution.im}
				marker-end="url(#vector-arrow)"
			/><text class="vector-label" x="50" y="304">instantaneous direction of f(z)dz</text>
			<path class="sum-path" d={accumulationPath} /><circle
				class="sum-halo"
				cx={sx(right, current.sum.re)}
				cy={sy(right, current.sum.im)}
				r="11"
			/><circle
				class="sum-point"
				cx={sx(right, current.sum.re)}
				cy={sy(right, current.sum.im)}
				r="5"
			/><text class="axis-label" x="706" y={right.cy - 9} text-anchor="end">Re</text><text
				class="axis-label"
				x={right.cx + 9}
				y="78">Im</text
			>
			<text class="verdict" x="570" y="302" text-anchor="middle"
				>{poleOnContour
					? 'pole on C → integral undefined'
					: kind === 'identity'
						? 'cancellation returns the sum to 0'
						: inside
							? `${winding} winding${Math.abs(winding) === 1 ? '' : 's'} → ${winding === 1 ? '2πi' : `${winding} · 2πi`}`
							: 'no enclosed pole → 0'}</text
			>
		</svg>
	</div>
	<div class="readout">
		<span
			>partial sum = {current.sum.re.toFixed(2)}
			{current.sum.im < 0 ? '−' : '+'}
			{Math.abs(current.sum.im).toFixed(2)}i</span
		><span>full loop ≈ {totalText}</span><button onclick={() => (running = !running)}
			>{running ? 'Pause' : 'Continue'}</button
		>
	</div>
	<div class="controls">
		<SliderField
			label="Winding number n"
			min={-2}
			max={2}
			step={1}
			decimals={0}
			tone="blue"
			bind:value={winding}
		/>
		<SliderField
			label="Contour radius R"
			min={0.55}
			max={1.65}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={radius}
		/>{#if kind === 'shifted'}<SliderField
				label="Pole position a"
				min={-1.8}
				max={1.8}
				step={0.02}
				decimals={2}
				tone="amber"
				bind:value={pole}
			/>{/if}
	</div>
</div>

<style>
	.contour-lab {
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
		color: var(--plot-teal);
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.45rem;
		margin-bottom: 0.7rem;
	}
	.functions button,
	.readout button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.56rem 0.6rem;
		font: 700 0.76rem/1.1 var(--font-sans);
		cursor: pointer;
	}
	.functions button.active,
	.functions button:hover,
	.functions button:focus-visible,
	.readout button:hover,
	.readout button:focus-visible {
		border-color: var(--plot-teal);
		background: color-mix(in srgb, var(--plot-teal) 9%, var(--color-surface-raised));
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
	.pole-label,
	.vector-label,
	.axis-label,
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
	.contour {
		fill: color-mix(in srgb, var(--plot-violet) 7%, transparent);
		stroke: var(--plot-violet);
		stroke-width: 2.4;
	}
	.direction {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 2.4;
	}
	:global(#contour-arrow path) {
		fill: var(--plot-violet);
	}
	:global(#vector-arrow path) {
		fill: var(--plot-amber);
	}
	.pole-halo {
		fill: color-mix(in srgb, var(--plot-rose) 18%, transparent);
	}
	.pole {
		fill: var(--plot-rose);
	}
	.pole-label {
		fill: var(--plot-rose);
		font-size: 10px;
		font-weight: 750;
	}
	.walker-halo {
		fill: color-mix(in srgb, var(--plot-amber) 18%, transparent);
	}
	.walker {
		fill: var(--plot-amber);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.contribution {
		stroke: var(--plot-amber);
		stroke-width: 2.3;
	}
	.vector-label,
	.axis-label {
		fill: var(--plot-muted);
		font-size: 9px;
		font-weight: 650;
	}
	.sum-path {
		fill: none;
		stroke: var(--plot-teal);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.sum-halo {
		fill: color-mix(in srgb, var(--plot-teal) 18%, transparent);
	}
	.sum-point {
		fill: var(--plot-teal);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.verdict {
		fill: var(--color-ink);
		font-size: 11px;
		font-weight: 750;
	}
	.readout {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		align-items: center;
		gap: 0.8rem;
		padding: 0.75rem 0.25rem;
		font: 750 0.78rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.readout span:nth-child(2) {
		text-align: center;
	}
	.readout button {
		min-width: 5.4rem;
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
		.title,
		.pole-label,
		.vector-label,
		.axis-label,
		.verdict {
			font-size: 14px;
		}
		.readout {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}
		.readout span:nth-child(2) {
			text-align: left;
		}
		.readout button {
			width: 100%;
		}
		.controls {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
	}
</style>
