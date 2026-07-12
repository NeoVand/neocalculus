<script lang="ts">
	import SliderField from './SliderField.svelte';
	type Kind = 'identity' | 'polynomial' | 'rational' | 'exponential' | 'sine' | 'constellation';
	type C = { re: number; im: number };
	let kind = $state<Kind>('polynomial'),
		extent = $state(2.6),
		enhanced = $state(true);
	let canvas: HTMLCanvasElement | undefined;
	const mul = (a: C, b: C): C => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
	const add = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
	const divide = (a: C, b: C): C => {
		const d = b.re * b.re + b.im * b.im;
		return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
	};
	function f(z: C): C {
		if (kind === 'identity') return z;
		if (kind === 'polynomial') return add(mul(z, z), { re: -1, im: 0 });
		if (kind === 'rational') return divide({ re: 1, im: 0 }, add(mul(z, z), { re: 1, im: 0 }));
		if (kind === 'exponential') {
			const m = Math.exp(z.re);
			return { re: m * Math.cos(z.im), im: m * Math.sin(z.im) };
		}
		if (kind === 'sine')
			return { re: Math.sin(z.re) * Math.cosh(z.im), im: Math.cos(z.re) * Math.sinh(z.im) };
		const z2 = mul(z, z),
			z3 = mul(z2, z);
		return divide(add(z3, { re: -1, im: 0 }), add(z2, { re: 0.35, im: 0 }));
	}
	function hsv(h: number, s: number, v: number) {
		const i = Math.floor(h * 6),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);
		const sector = i % 6;
		const rgb =
			sector === 0
				? [v, t, p]
				: sector === 1
					? [q, v, p]
					: sector === 2
						? [p, v, t]
						: sector === 3
							? [p, q, v]
							: sector === 4
								? [t, p, v]
								: [v, p, q];
		return rgb.map((n) => Math.round(255 * n));
	}
	const label = $derived(
		kind === 'identity'
			? 'f(z)=z'
			: kind === 'polynomial'
				? 'f(z)=z²−1'
				: kind === 'rational'
					? 'f(z)=1/(z²+1)'
					: kind === 'exponential'
						? 'f(z)=eᶻ'
						: kind === 'sine'
							? 'f(z)=sin z'
							: 'f(z)=(z³−1)/(z²+0.35)'
	);
	function specialPoints() {
		if (kind === 'identity') return [{ re: 0, im: 0, type: 'zero' }];
		if (kind === 'polynomial')
			return [
				{ re: -1, im: 0, type: 'zero' },
				{ re: 1, im: 0, type: 'zero' }
			];
		if (kind === 'rational')
			return [
				{ re: 0, im: -1, type: 'pole' },
				{ re: 0, im: 1, type: 'pole' }
			];
		if (kind === 'sine') return [-Math.PI, 0, Math.PI].map((re) => ({ re, im: 0, type: 'zero' }));
		if (kind === 'constellation')
			return [
				{ re: 1, im: 0, type: 'zero' },
				{ re: -0.5, im: 0.866, type: 'zero' },
				{ re: -0.5, im: -0.866, type: 'zero' },
				{ re: 0, im: 0.592, type: 'pole' },
				{ re: 0, im: -0.592, type: 'pole' }
			];
		return [];
	}
	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const W = canvas.width,
			H = canvas.height,
			data = ctx.createImageData(W, H);
		for (let py = 0; py < H; py += 1) {
			const im = extent - (2 * extent * py) / (H - 1);
			for (let px = 0; px < W; px += 1) {
				const re = -extent + (2 * extent * px) / (W - 1),
					w = f({ re, im }),
					mag = Math.hypot(w.re, w.im),
					arg = Math.atan2(w.im, w.re),
					h = (arg / (Math.PI * 2) + 1) % 1;
				let saturation = 0.76,
					value = 0.9;
				if (enhanced) {
					const log = Math.log2(Math.max(mag, 1e-12)),
						modDistance = Math.abs(log - Math.floor(log) - 0.5),
						phaseDistance = Math.abs(((h * 12) % 1) - 0.5);
					const modulusInk = Math.exp(-70 * modDistance * modDistance),
						phaseInk = Math.exp(-90 * phaseDistance * phaseDistance);
					value =
						(0.6 + 0.32 * (1 - Math.exp(-0.55 * mag))) *
						(1 - 0.24 * modulusInk) *
						(1 - 0.16 * phaseInk);
					saturation = 0.82;
				} else value = 0.68 + 0.27 * (1 - Math.exp(-0.45 * mag));
				if (mag < 0.025) value = Math.min(value, 0.12 + mag * 3);
				if (mag > 80) {
					saturation *= 0.25;
					value = 0.98;
				}
				const [red, green, blue] = hsv(h, saturation, value),
					index = 4 * (py * W + px);
				data.data[index] = red;
				data.data[index + 1] = green;
				data.data[index + 2] = blue;
				data.data[index + 3] = 255;
			}
		}
		ctx.putImageData(data, 0, 0);
		const styles = getComputedStyle(canvas),
			ink = styles.getPropertyValue('--plot-ink').trim() || '#fff';
		ctx.lineWidth = 2;
		for (const point of specialPoints()) {
			if (Math.abs(point.re) > extent || Math.abs(point.im) > extent) continue;
			const px = ((point.re + extent) / (2 * extent)) * W,
				py = ((extent - point.im) / (2 * extent)) * H;
			ctx.beginPath();
			ctx.arc(px, py, point.type === 'pole' ? 7 : 5, 0, Math.PI * 2);
			ctx.strokeStyle = ink;
			ctx.stroke();
			if (point.type === 'pole') {
				ctx.beginPath();
				ctx.moveTo(px - 4, py - 4);
				ctx.lineTo(px + 4, py + 4);
				ctx.moveTo(px + 4, py - 4);
				ctx.lineTo(px - 4, py + 4);
				ctx.stroke();
			}
		}
	}
	function scheduleDraw() {
		requestAnimationFrame(draw);
	}
	function choose(next: Kind) {
		kind = next;
		scheduleDraw();
	}
	function toggleBands() {
		enhanced = !enhanced;
		scheduleDraw();
	}
	function attachCanvas(node: HTMLCanvasElement) {
		canvas = node;
		draw();
		return () => {
			if (canvas === node) canvas = undefined;
		};
	}
</script>

<div class="domain-lab">
	<div class="heading">
		<div>
			<span>Four dimensions, compressed into color</span>
			<h4>Read a complex function as a phase portrait</h4>
		</div>
		<p>
			Hue records the argument of f(z). Brightness bands record its modulus. Zeros gather every hue;
			poles reverse the pattern.
		</p>
	</div>
	<div class="functions">
		<button class:active={kind === 'identity'} onclick={() => choose('identity')}>z</button><button
			class:active={kind === 'polynomial'}
			onclick={() => choose('polynomial')}>z² − 1</button
		><button class:active={kind === 'rational'} onclick={() => choose('rational')}
			>1/(z² + 1)</button
		><button class:active={kind === 'exponential'} onclick={() => choose('exponential')}>eᶻ</button
		><button class:active={kind === 'sine'} onclick={() => choose('sine')}>sin z</button><button
			class:active={kind === 'constellation'}
			onclick={() => choose('constellation')}>zeros + poles</button
		>
	</div>
	<div class="stage">
		<canvas
			{@attach attachCanvas}
			width="560"
			height="340"
			aria-label="Domain coloring phase portrait for {label}"
		></canvas>
		<div class="overlay"><span>Im z</span><span>{label}</span><span>Re z</span></div>
	</div>
	<div class="legend">
		<div class="wheel" aria-hidden="true"></div>
		<div>
			<strong>hue = arg f(z)</strong><span
				>one turn around the color wheel means one turn of the output direction</span
			>
		</div>
		<div class="bands"></div>
		<div>
			<strong>bands = |f(z)|</strong><span
				>dark rings are equally spaced on a logarithmic magnitude scale</span
			>
		</div>
	</div>
	<div class="controls">
		<SliderField
			label="Window · ±R"
			min={1.4}
			max={5}
			step={0.1}
			decimals={1}
			tone="violet"
			bind:value={extent}
			oninput={scheduleDraw}
		/><button class:active={enhanced} onclick={toggleBands}
			>{enhanced ? 'Contour bands on' : 'Contour bands off'}</button
		>
	</div>
</div>

<style>
	.domain-lab {
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
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.4rem;
		margin-bottom: 0.7rem;
	}
	.functions button,
	.controls button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.55rem 0.4rem;
		font: 700 0.72rem/1.1 var(--font-sans);
		cursor: pointer;
	}
	.functions button.active,
	.functions button:hover,
	.functions button:focus-visible,
	.controls button.active,
	.controls button:hover,
	.controls button:focus-visible {
		border-color: var(--plot-teal);
		background: color-mix(in srgb, var(--plot-teal) 9%, var(--color-surface-raised));
	}
	.stage {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 18px;
		background: var(--plot-background);
	}
	canvas {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 28/17;
	}
	.overlay {
		position: absolute;
		inset: 0.8rem 1rem auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		color: white;
		font: 800 0.65rem/1 var(--font-sans);
		letter-spacing: 0.08em;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
		pointer-events: none;
	}
	.overlay span:nth-child(2) {
		justify-self: center;
	}
	.overlay span:last-child {
		justify-self: end;
	}
	.legend {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		align-items: center;
		gap: 0.65rem 1rem;
		padding: 0.8rem 0.25rem;
	}
	.legend strong,
	.legend span {
		display: block;
		font-family: var(--font-sans);
	}
	.legend strong {
		font-size: 0.76rem;
	}
	.legend span {
		margin-top: 0.12rem;
		color: var(--color-ink-light);
		font-size: 0.68rem;
		line-height: 1.35;
	}
	.wheel {
		width: 2.6rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: conic-gradient(#f66, #ff6, #6f6, #6ff, #66f, #f6f, #f66);
		box-shadow: inset 0 0 0 0.55rem color-mix(in srgb, var(--color-surface) 60%, transparent);
	}
	.bands {
		width: 2.6rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: repeating-radial-gradient(
			circle,
			var(--plot-ink) 0 2px,
			var(--plot-muted) 3px 6px,
			var(--plot-background) 7px 10px
		);
	}
	.controls {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 1rem;
		padding: 0.7rem 0.2rem 0;
		border-top: 1px solid var(--color-border-light);
	}
	.controls button {
		min-width: 9.5rem;
		margin-bottom: 0.1rem;
	}
	@media (max-width: 640px) {
		.heading {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.functions {
			grid-template-columns: repeat(3, 1fr);
		}
		.legend {
			grid-template-columns: auto 1fr;
		}
		.controls {
			grid-template-columns: 1fr;
		}
		.controls button {
			width: 100%;
		}
	}
</style>
