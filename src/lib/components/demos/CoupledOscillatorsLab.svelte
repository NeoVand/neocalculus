<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';

	const width = 760,
		height = 350;
	let x1 = $state(0.85),
		x2 = $state(0),
		v1 = $state(0),
		v2 = $state(0);
	let coupling = $state(0.36),
		damping = $state(0.015),
		running = $state(true);
	let history = $state<{ qPlus: number; qMinus: number }[]>([]);
	const scale = 62,
		base1 = 275,
		base2 = 485;
	const mass1 = $derived(base1 + scale * x1),
		mass2 = $derived(base2 + scale * x2);
	const qPlus = $derived((x1 + x2) / Math.SQRT2),
		qMinus = $derived((x1 - x2) / Math.SQRT2);
	const energy = $derived(
		0.5 * (v1 ** 2 + v2 ** 2 + x1 ** 2 + x2 ** 2 + coupling * (x2 - x1) ** 2)
	);

	function acceleration(a: number, b: number, velocity: number) {
		return -a + coupling * (b - a) - damping * velocity;
	}
	function step(dt: number) {
		const a11 = acceleration(x1, x2, v1),
			a21 = acceleration(x2, x1, v2);
		const x1m = x1 + (v1 * dt) / 2,
			x2m = x2 + (v2 * dt) / 2;
		const v1m = v1 + (a11 * dt) / 2,
			v2m = v2 + (a21 * dt) / 2;
		const a12 = acceleration(x1m, x2m, v1m),
			a22 = acceleration(x2m, x1m, v2m);
		const x1m2 = x1 + (v1m * dt) / 2,
			x2m2 = x2 + (v2m * dt) / 2;
		const v1m2 = v1 + (a12 * dt) / 2,
			v2m2 = v2 + (a22 * dt) / 2;
		const a13 = acceleration(x1m2, x2m2, v1m2),
			a23 = acceleration(x2m2, x1m2, v2m2);
		const x1e = x1 + v1m2 * dt,
			x2e = x2 + v2m2 * dt;
		const v1e = v1 + a13 * dt,
			v2e = v2 + a23 * dt;
		const a14 = acceleration(x1e, x2e, v1e),
			a24 = acceleration(x2e, x1e, v2e);
		x1 += (dt * (v1 + 2 * v1m + 2 * v1m2 + v1e)) / 6;
		x2 += (dt * (v2 + 2 * v2m + 2 * v2m2 + v2e)) / 6;
		v1 += (dt * (a11 + 2 * a12 + 2 * a13 + a14)) / 6;
		v2 += (dt * (a21 + 2 * a22 + 2 * a23 + a24)) / 6;
	}

	function springPath(start: number, end: number, y: number, turns = 8) {
		const lead = 10,
			usable = end - start - lead * 2;
		let path = `M${start} ${y}L${start + lead} ${y}`;
		for (let i = 0; i <= turns * 2; i += 1) {
			const px = start + lead + (usable * i) / (turns * 2);
			const py = y + (i === 0 || i === turns * 2 ? 0 : i % 2 ? 9 : -9);
			path += `L${px.toFixed(1)} ${py}`;
		}
		return path + `L${end} ${y}`;
	}

	function setMode(mode: 'together' | 'opposite' | 'exchange') {
		if (mode === 'together') {
			x1 = 0.72;
			x2 = 0.72;
		} else if (mode === 'opposite') {
			x1 = 0.72;
			x2 = -0.72;
		} else {
			x1 = 0.9;
			x2 = 0;
		}
		v1 = 0;
		v2 = 0;
		history = [];
		running = true;
	}
	function pathFor(mode: 'plus' | 'minus') {
		const middle = mode === 'plus' ? 266 : 312;
		return history
			.map(
				(p, i) =>
					`${i ? 'L' : 'M'} ${(150 + i * 3.6).toFixed(1)} ${(middle - 23 * (mode === 'plus' ? p.qPlus : p.qMinus)).toFixed(1)}`
			)
			.join(' ');
	}

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			running = false;
			return;
		}
		let frame = 0,
			previous = performance.now(),
			sampleClock = 0;
		const animate = (now: number) => {
			const elapsed = Math.min(0.035, (now - previous) / 1000);
			previous = now;
			if (running) {
				const dt = elapsed * 1.6,
					pieces = Math.max(1, Math.ceil(dt / 0.012));
				for (let i = 0; i < pieces; i += 1) step(dt / pieces);
				sampleClock += elapsed;
				if (sampleClock > 0.045) {
					sampleClock = 0;
					history = [...history.slice(-149), { qPlus, qMinus }];
				}
			}
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="coupled-lab">
	<div class="lab-heading">
		<div>
			<span class="eyebrow">Two bodies, two shared rhythms</span>
			<h4>Untangle the motion into normal modes</h4>
		</div>
		<p>
			The masses may look complicated, but their sum and difference each oscillate with a single
			rhythm.
		</p>
	</div>
	<div class="preset-row">
		<button onclick={() => setMode('together')}>Move together</button><button
			onclick={() => setMode('opposite')}>Move oppositely</button
		><button onclick={() => setMode('exchange')}>Watch energy migrate</button>
	</div>
	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="Two coupled masses decomposed into symmetric and antisymmetric normal modes"
		>
			<defs
				><linearGradient id="mass-one" x1="0" y1="0" x2="1" y2="1"
					><stop stop-color="var(--plot-blue)" /><stop
						offset="1"
						stop-color="var(--plot-violet)"
					/></linearGradient
				><linearGradient id="mass-two" x1="0" y1="0" x2="1" y2="1"
					><stop stop-color="var(--plot-amber)" /><stop
						offset="1"
						stop-color="var(--plot-violet)"
					/></linearGradient
				></defs
			>
			<rect class="panel" x="24" y="28" width="712" height="194" rx="18" /><rect
				class="panel"
				x="24"
				y="238"
				width="712"
				height="94"
				rx="18"
			/>
			<text class="panel-title" x="44" y="56">COUPLED MOTION</text><text
				class="panel-title"
				x="44"
				y="261">NORMAL COORDINATES</text
			>
			<path
				class="wall"
				d="M55 78V189 M43 88L55 78 M43 108L55 98 M43 128L55 118 M43 148L55 138 M43 168L55 158 M43 188L55 178 M705 78V189 M705 78L717 88 M705 98L717 108 M705 118L717 128 M705 138L717 148 M705 158L717 168 M705 178L717 188"
			/>
			<line class="floor" x1="55" x2="705" y1="189" y2="189" /><path
				class="spring edge"
				d={springPath(55, mass1 - 30, 132, 10)}
			/><path class="spring coupling" d={springPath(mass1 + 30, mass2 - 30, 132, 8)} /><path
				class="spring edge"
				d={springPath(mass2 + 30, 705, 132, 10)}
			/>
			<line class="equilibrium" x1={base1} x2={base1} y1="74" y2="190" /><line
				class="equilibrium"
				x1={base2}
				x2={base2}
				y1="74"
				y2="190"
			/>
			<rect class="mass one" x={mass1 - 30} y="103" width="60" height="70" rx="10" /><rect
				class="mass two"
				x={mass2 - 30}
				y="103"
				width="60"
				height="70"
				rx="10"
			/>
			<circle class="wheel" cx={mass1 - 17} cy="181" r="6" /><circle
				class="wheel"
				cx={mass1 + 17}
				cy="181"
				r="6"
			/><circle class="wheel" cx={mass2 - 17} cy="181" r="6" /><circle
				class="wheel"
				cx={mass2 + 17}
				cy="181"
				r="6"
			/>
			<text class="mass-label" x={mass1} y="143" text-anchor="middle">x₁</text><text
				class="mass-label"
				x={mass2}
				y="143"
				text-anchor="middle">x₂</text
			><text class="coupling-label" x={(mass1 + mass2) / 2} y="92" text-anchor="middle"
				>coupling kᶜ</text
			>
			<line class="mode-zero" x1="150" x2="704" y1="266" y2="266" /><line
				class="mode-zero"
				x1="150"
				x2="704"
				y1="312"
				y2="312"
			/><path class="plus-trace" d={pathFor('plus')} /><path
				class="minus-trace"
				d={pathFor('minus')}
			/>
			<text class="mode-name plus" x="45" y="273">q₊ = (x₁+x₂)/√2</text><text
				class="mode-name minus"
				x="45"
				y="319">q₋ = (x₁−x₂)/√2</text
			><text class="mode-frequency" x="704" y="253" text-anchor="end">ω₊ = 1 · ω₋ = √(1+2kᶜ)</text>
		</svg>
	</div>
	<div class="readout">
		<span><i class="one-dot"></i>x₁ = {x1.toFixed(2)}</span><span
			><i class="two-dot"></i>x₂ = {x2.toFixed(2)}</span
		><span>energy E = {energy.toFixed(2)}</span><button onclick={() => (running = !running)}
			>{running ? 'Pause' : 'Continue'}</button
		>
	</div>
	<div class="controls">
		<SliderField
			label="Coupling strength kᶜ"
			min={0}
			max={1.1}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={coupling}
		/><SliderField
			label="Damping b"
			min={0}
			max={0.2}
			step={0.005}
			decimals={3}
			tone="blue"
			bind:value={damping}
		/>
	</div>
</div>

<style>
	.coupled-lab {
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}
	.lab-heading {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(15rem, 0.8fr);
		align-items: end;
		gap: 1.4rem;
		margin-bottom: 1rem;
	}
	.lab-heading h4 {
		margin: 0.15rem 0 0;
		font-family: var(--font-serif);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 600;
	}
	.lab-heading p {
		margin: 0;
		color: var(--color-ink-light);
		font-size: 0.91rem;
		line-height: 1.5;
	}
	.eyebrow {
		color: var(--plot-blue);
		font: 800 0.7rem/1.2 var(--font-sans);
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	.preset-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.45rem;
		margin-bottom: 0.7rem;
	}
	.preset-row button,
	.readout button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.56rem 0.7rem;
		font: 700 0.75rem/1.1 var(--font-sans);
		cursor: pointer;
	}
	.preset-row button:hover,
	.preset-row button:focus-visible,
	.readout button:hover,
	.readout button:focus-visible {
		border-color: var(--plot-blue);
		background: color-mix(in srgb, var(--plot-blue) 8%, var(--color-surface-raised));
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
	.panel-title,
	.mass-label,
	.coupling-label,
	.mode-name,
	.mode-frequency {
		font-family: var(--font-sans);
		pointer-events: none;
	}
	.panel-title {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.1em;
	}
	.wall,
	.floor {
		fill: none;
		stroke: var(--plot-axis);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.spring {
		fill: none;
		stroke-width: 2.3;
		stroke-linejoin: round;
	}
	.spring.edge {
		stroke: var(--plot-muted);
	}
	.spring.coupling {
		stroke: var(--plot-violet);
	}
	.equilibrium {
		stroke: var(--plot-grid);
		stroke-dasharray: 3 5;
	}
	.mass {
		stroke-width: 1.5;
	}
	.mass.one {
		fill: url(#mass-one);
		stroke: var(--plot-blue);
	}
	.mass.two {
		fill: url(#mass-two);
		stroke: var(--plot-amber);
	}
	.wheel {
		fill: var(--plot-background);
		stroke: var(--plot-axis);
		stroke-width: 1.5;
	}
	.mass-label {
		fill: var(--plot-background);
		font-size: 15px;
		font-weight: 800;
	}
	.coupling-label,
	.mode-frequency {
		fill: var(--plot-muted);
		font-size: 12px;
		font-weight: 650;
	}
	.mode-zero {
		stroke: var(--plot-grid);
	}
	.plus-trace,
	.minus-trace {
		fill: none;
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.plus-trace {
		stroke: var(--plot-blue);
	}
	.minus-trace {
		stroke: var(--plot-amber);
	}
	.mode-name {
		font-size: 12px;
		font-weight: 750;
	}
	.mode-name.plus {
		fill: var(--plot-blue);
	}
	.mode-name.minus {
		fill: var(--plot-amber);
	}
	.readout {
		display: grid;
		grid-template-columns: repeat(3, 1fr) auto;
		align-items: center;
		gap: 0.8rem;
		padding: 0.8rem 0.25rem 0.5rem;
		font: 700 0.78rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.readout i {
		display: inline-block;
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		margin-right: 0.35rem;
	}
	.one-dot {
		background: var(--plot-blue);
	}
	.two-dot {
		background: var(--plot-amber);
	}
	.readout button {
		min-width: 5.3rem;
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
		padding: 0.7rem 0.2rem 0;
		border-top: 1px solid var(--color-border-light);
	}
	@media (max-width: 640px) {
		.lab-heading {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}
		.readout {
			grid-template-columns: repeat(3, 1fr);
			font-size: 0.7rem;
			gap: 0.3rem;
		}
		.readout button {
			grid-column: 1/-1;
			width: 100%;
		}
		.controls {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
		.panel-title,
		.coupling-label,
		.mode-name,
		.mode-frequency {
			font-size: 15px;
		}
		.preset-row button {
			font-size: 0.7rem;
		}
		.stage svg {
			width: 100%;
		}
	}
</style>
