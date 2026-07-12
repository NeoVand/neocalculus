<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';

	type Kind = 'quadratic' | 'cubic' | 'rational';
	type C = { re: number; im: number };
	type Special = C & { type: 'zero' | 'pole' };

	const center = 180,
		inputScale = 82,
		sampleCount = 320;
	let kind = $state<Kind>('quadratic'),
		radius = $state(1.25),
		progress = $state(0),
		running = $state(true);

	const add = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
	const mul = (a: C, b: C): C => ({
		re: a.re * b.re - a.im * b.im,
		im: a.re * b.im + a.im * b.re
	});
	const divide = (a: C, b: C): C => {
		const d = b.re * b.re + b.im * b.im;
		return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
	};
	function value(z: C): C {
		const z2 = mul(z, z);
		if (kind === 'quadratic') return add(z2, { re: -1, im: 0 });
		if (kind === 'cubic') return add(mul(z2, z), { re: -1, im: 0 });
		return divide(add(z2, { re: -1, im: 0 }), add(z, { re: -0.35, im: 0 }));
	}
	const specials = $derived.by<Special[]>(() => {
		if (kind === 'cubic')
			return [
				{ re: 1, im: 0, type: 'zero' },
				{ re: -0.5, im: Math.sqrt(3) / 2, type: 'zero' },
				{ re: -0.5, im: -Math.sqrt(3) / 2, type: 'zero' }
			];
		const points: Special[] = [
			{ re: -1, im: 0, type: 'zero' },
			{ re: 1, im: 0, type: 'zero' }
		];
		if (kind === 'rational') points.push({ re: 0.35, im: 0, type: 'pole' });
		return points;
	});
	const singularOnContour = $derived(
		specials.some((point) => Math.abs(Math.hypot(point.re, point.im) - radius) < 0.012)
	);
	const samples = $derived.by(() => {
		const points: { z: C; w: C; angle: number }[] = [];
		for (let i = 0; i <= sampleCount; i += 1) {
			const angle = (2 * Math.PI * i) / sampleCount,
				z = { re: radius * Math.cos(angle), im: radius * Math.sin(angle) };
			points.push({ z, w: value(z), angle });
		}
		return points;
	});
	const counts = $derived.by(() => {
		let zeros = 0,
			poles = 0;
		for (const point of specials) {
			if (Math.hypot(point.re, point.im) < radius) {
				if (point.type === 'zero') zeros += 1;
				else poles += 1;
			}
		}
		return { zeros, poles, winding: zeros - poles };
	});
	const measuredWinding = $derived.by(() => {
		if (singularOnContour) return null;
		let total = 0,
			previous = Math.atan2(samples[0].w.im, samples[0].w.re);
		for (const point of samples.slice(1)) {
			const next = Math.atan2(point.w.im, point.w.re);
			let change = next - previous;
			while (change > Math.PI) change -= 2 * Math.PI;
			while (change < -Math.PI) change += 2 * Math.PI;
			total += change;
			previous = next;
		}
		return Math.round(total / (2 * Math.PI));
	});
	const outputScale = $derived.by(() => {
		let maximum = 1;
		for (const point of samples)
			maximum = Math.max(maximum, Math.abs(point.w.re), Math.abs(point.w.im));
		return 108 / maximum;
	});
	const inputPath = $derived(
		samples
			.map(
				(point, index) =>
					`${index ? 'L' : 'M'} ${(center + inputScale * point.z.re).toFixed(1)} ${(center - inputScale * point.z.im).toFixed(1)}`
			)
			.join(' ')
	);
	const outputPath = $derived(
		samples
			.map(
				(point, index) =>
					`${index ? 'L' : 'M'} ${(center + outputScale * point.w.re).toFixed(1)} ${(center - outputScale * point.w.im).toFixed(1)}`
			)
			.join(' ')
	);
	const currentIndex = $derived(Math.min(sampleCount, Math.floor(progress * sampleCount)));
	const current = $derived(
		samples[currentIndex] ?? samples[0] ?? { z: { re: 0, im: 0 }, w: { re: 0, im: 0 }, angle: 0 }
	);
	const functionLabel = $derived(
		kind === 'quadratic'
			? 'f(z) = z² − 1'
			: kind === 'cubic'
				? 'f(z) = z³ − 1'
				: 'f(z) = (z² − 1)/(z − 0.35)'
	);
	function choose(next: Kind) {
		kind = next;
		progress = 0;
		running = true;
	}

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
			if (running) progress = (progress + 0.075 * dt) % 1;
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="argument-lab">
	<div class="heading">
		<div>
			<span>THE ARGUMENT PRINCIPLE</span>
			<h4>Let the boundary count what lies inside</h4>
		</div>
		<p>
			As z travels once around C, its image f(z) winds around 0 once for each zero and backward once
			for each pole.
		</p>
	</div>
	<div class="functions">
		<button class:active={kind === 'quadratic'} onclick={() => choose('quadratic')}>z² − 1</button>
		<button class:active={kind === 'cubic'} onclick={() => choose('cubic')}>z³ − 1</button>
		<button class:active={kind === 'rational'} onclick={() => choose('rational')}
			>(z² − 1)/(z − 0.35)</button
		>
	</div>
	<div class="planes">
		<div class="plane">
			<div class="plane-label"><strong>INPUT CONTOUR C</strong><span>z-plane</span></div>
			<svg
				viewBox="0 0 360 320"
				role="img"
				aria-label="Input contour containing marked zeros and poles"
			>
				<defs
					><marker
						id="argument-arrow-input"
						markerWidth="7"
						markerHeight="7"
						refX="6"
						refY="3.5"
						orient="auto"><path d="M0 0L7 3.5L0 7Z" /></marker
					></defs
				>
				<line class="axis" x1="34" x2="326" y1={center} y2={center} />
				<line class="axis" x1={center} x2={center} y1="34" y2="306" />
				<path class="input-curve" d={inputPath} />
				<path
					class="direction"
					d={`M ${center + inputScale * radius * Math.cos(0.4)} ${center - inputScale * radius * Math.sin(0.4)} A ${inputScale * radius} ${inputScale * radius} 0 0 0 ${center + inputScale * radius * Math.cos(0.82)} ${center - inputScale * radius * Math.sin(0.82)}`}
					marker-end="url(#argument-arrow-input)"
				/>
				{#each specials as point (`${point.type}-${point.re}-${point.im}`)}
					{#if point.type === 'zero'}
						<circle
							class="zero-halo"
							cx={center + inputScale * point.re}
							cy={center - inputScale * point.im}
							r="11"
						/>
						<circle
							class="zero"
							cx={center + inputScale * point.re}
							cy={center - inputScale * point.im}
							r="5"
						/>
					{:else}
						<circle
							class="pole-halo"
							cx={center + inputScale * point.re}
							cy={center - inputScale * point.im}
							r="12"
						/>
						<path
							class="pole"
							d={`M ${center + inputScale * point.re - 5} ${center - inputScale * point.im - 5} l 10 10 M ${center + inputScale * point.re + 5} ${center - inputScale * point.im - 5} l -10 10`}
						/>
					{/if}
				{/each}
				<circle
					class="tracer-halo"
					cx={center + inputScale * current.z.re}
					cy={center - inputScale * current.z.im}
					r="10"
				/>
				<circle
					class="tracer"
					cx={center + inputScale * current.z.re}
					cy={center - inputScale * current.z.im}
					r="4.5"
				/>
				<text class="symbol-label" x="319" y={center - 10}>Re</text><text
					class="symbol-label"
					x={center + 9}
					y="43">Im</text
				>
			</svg>
			<div class="key">
				<span><i class="zero-key"></i>zero</span><span><i class="pole-key">×</i>pole</span>
			</div>
		</div>
		<div class="plane">
			<div class="plane-label"><strong>IMAGE CURVE f(C)</strong><span>w-plane</span></div>
			<svg viewBox="0 0 360 320" role="img" aria-label="Image curve winding around the origin">
				<line class="axis" x1="34" x2="326" y1={center} y2={center} />
				<line class="axis" x1={center} x2={center} y1="34" y2="306" />
				<circle class="origin-halo" cx={center} cy={center} r="11" />
				<circle class="origin" cx={center} cy={center} r="4.5" />
				<path class="output-curve" d={outputPath} />
				<circle
					class="image-halo"
					cx={center + outputScale * current.w.re}
					cy={center - outputScale * current.w.im}
					r="10"
				/>
				<circle
					class="image"
					cx={center + outputScale * current.w.re}
					cy={center - outputScale * current.w.im}
					r="4.5"
				/>
				<text class="symbol-label" x="319" y={center - 10}>Re</text><text
					class="symbol-label"
					x={center + 9}
					y="43">Im</text
				>
				<text class="origin-label" x={center + 12} y={center + 17}>0</text>
			</svg>
			<div class="winding-label">
				{singularOnContour
					? 'f(C) passes through 0 · winding undefined'
					: `${measuredWinding} turn${Math.abs(measuredWinding ?? 0) === 1 ? '' : 's'} around 0`}
			</div>
		</div>
	</div>
	<div class="identity" class:undefined={singularOnContour}>
		<span>{functionLabel}</span>
		<strong
			>{singularOnContour
				? 'C crosses a zero or pole'
				: `${counts.zeros} zero${counts.zeros === 1 ? '' : 's'} − ${counts.poles} pole${counts.poles === 1 ? '' : 's'} = ${counts.winding} winding${Math.abs(counts.winding) === 1 ? '' : 's'}`}</strong
		>
	</div>
	<div class="controls">
		<SliderField
			label="Contour radius R"
			min={0.55}
			max={1.55}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={radius}
		/>
		<button onclick={() => (running = !running)}
			>{running ? 'Pause tracer' : 'Continue tracer'}</button
		>
	</div>
</div>

<style>
	.argument-lab {
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}
	.heading {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(15rem, 0.9fr);
		align-items: end;
		gap: 1.4rem;
		margin-bottom: 1rem;
	}
	.heading span {
		color: var(--plot-violet);
		font: 800 0.7rem/1.2 var(--font-sans);
		letter-spacing: 0.13em;
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
	.controls button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.58rem 0.7rem;
		font: 700 0.76rem/1.15 var(--font-sans);
		cursor: pointer;
	}
	.functions button.active,
	.functions button:hover,
	.functions button:focus-visible,
	.controls button:hover,
	.controls button:focus-visible {
		border-color: var(--plot-violet);
		background: color-mix(in srgb, var(--plot-violet) 9%, var(--color-surface-raised));
	}
	.planes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
	}
	.plane {
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 18px;
		background: color-mix(in srgb, var(--plot-background) 92%, var(--color-surface-raised));
	}
	.plane-label {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 1rem 0;
		font: 700 0.67rem/1 var(--font-sans);
		letter-spacing: 0.09em;
		color: var(--color-ink-light);
	}
	.plane-label span {
		letter-spacing: 0;
		text-transform: none;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.axis {
		stroke: var(--plot-grid);
		stroke-width: 1;
	}
	.input-curve {
		fill: color-mix(in srgb, var(--plot-violet) 8%, transparent);
		stroke: var(--plot-violet);
		stroke-width: 2.4;
	}
	.direction {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 2.4;
	}
	.direction :global(path),
	:global(#argument-arrow-input path) {
		fill: var(--plot-violet);
	}
	.output-curve {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 2.6;
		stroke-linejoin: round;
	}
	.zero-halo,
	.origin-halo {
		fill: color-mix(in srgb, var(--plot-teal) 18%, transparent);
	}
	.zero,
	.origin {
		fill: var(--plot-teal);
		stroke: var(--plot-background);
		stroke-width: 1.5;
	}
	.pole-halo {
		fill: color-mix(in srgb, var(--plot-coral) 17%, transparent);
	}
	.pole {
		fill: none;
		stroke: var(--plot-coral);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.tracer-halo {
		fill: color-mix(in srgb, var(--plot-violet) 20%, transparent);
	}
	.tracer {
		fill: var(--plot-violet);
	}
	.image-halo {
		fill: color-mix(in srgb, var(--plot-blue) 20%, transparent);
	}
	.image {
		fill: var(--plot-blue);
	}
	.symbol-label,
	.origin-label {
		fill: var(--color-ink-light);
		font: 700 10px/1 var(--font-sans);
	}
	.key {
		display: flex;
		justify-content: center;
		gap: 1rem;
		min-height: 1.2rem;
		padding: 0 1rem 0.8rem;
		color: var(--color-ink-light);
		font: 700 0.7rem/1 var(--font-sans);
	}
	.key span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.zero-key {
		width: 0.48rem;
		height: 0.48rem;
		border-radius: 50%;
		background: var(--plot-teal);
	}
	.pole-key {
		color: var(--plot-coral);
		font-style: normal;
		font-size: 1rem;
	}
	.winding-label {
		min-height: 1.2rem;
		padding: 0 1rem 0.8rem;
		text-align: center;
		color: var(--plot-blue);
		font: 800 0.72rem/1 var(--font-sans);
	}
	.identity {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin: 0.7rem 0;
		padding: 0.72rem 1rem;
		border-left: 3px solid var(--plot-teal);
		background: color-mix(in srgb, var(--plot-teal) 7%, transparent);
		font: 700 0.78rem/1.3 var(--font-sans);
	}
	.identity span {
		color: var(--color-ink-light);
	}
	.identity.undefined {
		border-color: var(--plot-coral);
		background: color-mix(in srgb, var(--plot-coral) 7%, transparent);
	}
	.controls {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 1rem;
	}
	.controls button {
		min-width: 8.5rem;
	}
	@media (max-width: 680px) {
		.heading {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}
		.functions {
			grid-template-columns: 1fr;
		}
		.planes {
			grid-template-columns: 1fr;
		}
		.identity {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.3rem;
		}
		.controls {
			grid-template-columns: 1fr;
		}
		.controls button {
			width: 100%;
		}
	}
</style>
