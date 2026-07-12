<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';

	const width = 760,
		height = 430,
		naturalFrequency = 1,
		force = 0.32;
	const plot = { left: 414, right: 730, top: 64, bottom: 222 };
	const traces = { left: 42, right: 730, top: 290, bottom: 400 };
	let driveFrequency = $state(0.82),
		damping = $state(0.1),
		running = $state(true),
		clock = $state(0);

	function response(frequency = driveFrequency) {
		const gap = naturalFrequency ** 2 - frequency ** 2;
		const loss = 2 * damping * naturalFrequency * frequency;
		return { amplitude: force / Math.hypot(gap, loss), phase: Math.atan2(loss, gap) };
	}

	const current = $derived(response());
	const displacement = $derived(
		current.amplitude * Math.cos(driveFrequency * clock - current.phase)
	);
	const appliedForce = $derived(force * Math.cos(driveFrequency * clock));
	const massX = $derived(210 + 46 * Math.tanh(displacement / 0.75));
	const visualForce = $derived(18 * Math.cos(driveFrequency * clock));
	const frequencyX = (value: number) =>
		plot.left + ((value - 0.18) / 1.72) * (plot.right - plot.left);
	const amplitudeY = (value: number) =>
		plot.bottom - (Math.min(2.25, value) / 2.25) * (plot.bottom - plot.top);
	const traceX = (index: number, count: number) =>
		traces.left + (index / count) * (traces.right - traces.left);
	function traceY(value: number, scale: number) {
		return (traces.top + traces.bottom) / 2 - Math.tanh(value / scale) * 39;
	}

	const responsePath = $derived.by(() => {
		let path = '';
		for (let index = 0; index <= 220; index += 1) {
			const frequency = 0.18 + (1.72 * index) / 220;
			path += `${index ? 'L' : 'M'} ${frequencyX(frequency).toFixed(2)} ${amplitudeY(response(frequency).amplitude).toFixed(2)} `;
		}
		return path;
	});

	function signalPath(kind: 'force' | 'response') {
		let path = '';
		const samples = 170;
		for (let index = 0; index <= samples; index += 1) {
			const time = clock - ((samples - index) / samples) * 15;
			const value =
				kind === 'force'
					? force * Math.cos(driveFrequency * time)
					: current.amplitude * Math.cos(driveFrequency * time - current.phase);
			path += `${index ? 'L' : 'M'} ${traceX(index, samples).toFixed(2)} ${traceY(value, kind === 'force' ? 0.48 : 1.45).toFixed(2)} `;
		}
		return path;
	}
	const forcePath = $derived(signalPath('force'));
	const displacementPath = $derived(signalPath('response'));

	function springPath(start: number, end: number, y: number) {
		const lead = 12,
			turns = 9,
			usable = end - start - lead * 2;
		let path = `M ${start} ${y} L ${start + lead} ${y}`;
		for (let index = 0; index <= turns * 2; index += 1) {
			const x = start + lead + (usable * index) / (turns * 2);
			const offset = index === 0 || index === turns * 2 ? 0 : index % 2 ? 10 : -10;
			path += ` L ${x.toFixed(2)} ${(y + offset).toFixed(2)}`;
		}
		return `${path} L ${end} ${y}`;
	}

	function setPreset(kind: 'below' | 'resonance' | 'above') {
		driveFrequency = kind === 'below' ? 0.55 : kind === 'resonance' ? 0.99 : 1.48;
		damping = kind === 'resonance' ? 0.1 : 0.12;
		clock = 0;
		running = true;
	}
	const phaseLabel = (value: number) => `${Math.round((value * 180) / Math.PI)}°`;

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			running = false;
			return;
		}
		let frame = 0,
			previous = performance.now();
		const animate = (now: number) => {
			const elapsed = Math.min(0.04, (now - previous) / 1000);
			previous = now;
			if (running) clock += elapsed * 2.1;
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="resonance-lab">
	<div class="lab-heading">
		<div>
			<span class="eyebrow">A push has a rhythm</span>
			<h4>Find the frequency the oscillator cannot ignore</h4>
		</div>
		<p>
			Compare the amber forcing signal with the blue response. Near resonance, energy arrives at
			just the right moments.
		</p>
	</div>
	<div class="preset-row" aria-label="Resonance presets">
		<button class:active={driveFrequency < 0.75} onclick={() => setPreset('below')}
			>Below resonance</button
		>
		<button
			class:active={driveFrequency >= 0.75 && driveFrequency <= 1.18}
			onclick={() => setPreset('resonance')}>Near resonance</button
		>
		<button class:active={driveFrequency > 1.18} onclick={() => setPreset('above')}
			>Above resonance</button
		>
	</div>
	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="A driven mass and spring synchronized with time signals and a frequency response curve"
		>
			<defs>
				<linearGradient id="resonance-mass" x1="0" y1="0" x2="1" y2="1"
					><stop offset="0" stop-color="var(--plot-blue)" /><stop
						offset="1"
						stop-color="var(--plot-violet)"
					/></linearGradient
				>
				<marker
					id="force-arrow"
					markerWidth="8"
					markerHeight="8"
					refX="7"
					refY="4"
					orient="auto"
					markerUnits="userSpaceOnUse"><path d="M 0 0 L 8 4 L 0 8 Z" /></marker
				>
			</defs>
			<rect class="panel" x="24" y="30" width="352" height="208" rx="18" /><rect
				class="panel"
				x="394"
				y="30"
				width="342"
				height="208"
				rx="18"
			/><rect class="panel" x="24" y="258" width="712" height="154" rx="18" />
			<text class="panel-title" x="44" y="58">DRIVEN OSCILLATOR</text><text
				class="panel-title"
				x="414"
				y="58">FREQUENCY RESPONSE</text
			><text class="panel-title" x="44" y="284">THE LAST 15 SECONDS</text>
			<line class="floor" x1="48" x2="350" y1="193" y2="193" /><path
				class="wall"
				d="M60 82V193 M48 92L60 82 M48 112L60 102 M48 132L60 122 M48 152L60 142 M48 172L60 162 M48 192L60 182"
			/>
			<path class="spring" d={springPath(60, massX - 27, 133)} /><line
				class="damper"
				x1="60"
				x2={massX - 35}
				y1="169"
				y2="169"
			/><rect
				class="damper-body"
				x="118"
				y="158"
				width={Math.max(22, massX - 153)}
				height="22"
				rx="3"
			/>
			<rect class="mass" x={massX - 27} y="108" width="54" height="76" rx="10" /><circle
				class="wheel"
				cx={massX - 16}
				cy="190"
				r="6"
			/><circle class="wheel" cx={massX + 16} cy="190" r="6" />
			<line
				class="force-arrow"
				x1={massX + 35}
				x2={massX + 35 + visualForce}
				y1="133"
				y2="133"
				marker-end="url(#force-arrow)"
			/><text class="force-label" x={massX + 43} y="119">F cos(Ωt)</text><text
				class="equation"
				x="200"
				y="220"
				text-anchor="middle">x″ + 2ζx′ + x = F cos(Ωt)</text
			>
			{#each [0.5, 1, 1.5] as tick (tick)}<line
					class="grid"
					x1={frequencyX(tick)}
					x2={frequencyX(tick)}
					y1={plot.top}
					y2={plot.bottom}
				/><text class="tick" x={frequencyX(tick)} y={plot.bottom + 17} text-anchor="middle"
					>{tick.toFixed(1)}</text
				>{/each}
			{#each [0.5, 1, 1.5, 2] as tick (tick)}<line
					class="grid"
					x1={plot.left}
					x2={plot.right}
					y1={amplitudeY(tick)}
					y2={amplitudeY(tick)}
				/>{/each}
			<path class="response-curve" d={responsePath} /><line
				class="probe"
				x1={frequencyX(driveFrequency)}
				x2={frequencyX(driveFrequency)}
				y1={plot.top}
				y2={plot.bottom}
			/><circle
				class="response-point-halo"
				cx={frequencyX(driveFrequency)}
				cy={amplitudeY(current.amplitude)}
				r="10"
			/><circle
				class="response-point"
				cx={frequencyX(driveFrequency)}
				cy={amplitudeY(current.amplitude)}
				r="5"
			/>
			<text class="axis-label" x={plot.right - 6} y={plot.top + 13} text-anchor="end">Ω / ω₀</text
			><text class="axis-label" x={plot.left + 7} y={plot.top + 13}>amplitude A</text>
			<line
				class="trace-zero"
				x1={traces.left}
				x2={traces.right}
				y1={(traces.top + traces.bottom) / 2}
				y2={(traces.top + traces.bottom) / 2}
			/><path class="force-trace" d={forcePath} /><path
				class="displacement-trace"
				d={displacementPath}
			/>
			<circle class="force-dot" cx={traces.right} cy={traceY(appliedForce, 0.48)} r="4" /><circle
				class="displacement-dot"
				cx={traces.right}
				cy={traceY(displacement, 1.45)}
				r="4.5"
			/>
			<g class="legend" transform="translate(472 277)"
				><line class="force-trace" x1="0" x2="20" /><text x="27" y="4">driving force</text><line
					class="displacement-trace"
					x1="113"
					x2="133"
				/><text x="140" y="4">displacement</text></g
			>
		</svg>
	</div>
	<div class="readout" aria-live="polite">
		<div><small>frequency ratio</small><strong>Ω / ω₀ = {driveFrequency.toFixed(2)}</strong></div>
		<div><small>steady amplitude</small><strong>A = {current.amplitude.toFixed(2)}</strong></div>
		<div><small>response delay</small><strong>φ = {phaseLabel(current.phase)}</strong></div>
		<button onclick={() => (running = !running)}>{running ? 'Pause' : 'Continue'}</button>
	</div>
	<div class="controls">
		<SliderField
			label="Driving frequency Ω"
			min={0.18}
			max={1.9}
			step={0.01}
			decimals={2}
			tone="amber"
			bind:value={driveFrequency}
		/><SliderField
			label="Damping ζ"
			min={0.04}
			max={0.35}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={damping}
		/>
	</div>
</div>

<style>
	.resonance-lab {
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
		color: var(--plot-amber);
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
		transition:
			border-color 160ms ease,
			background 160ms ease,
			transform 160ms ease;
	}
	.preset-row button:hover,
	.preset-row button:focus-visible,
	.preset-row button.active,
	.readout button:hover,
	.readout button:focus-visible {
		border-color: color-mix(in srgb, var(--plot-amber) 70%, var(--color-border-light));
		background: color-mix(in srgb, var(--plot-amber) 9%, var(--color-surface-raised));
		transform: translateY(-1px);
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
		user-select: none;
	}
	.panel {
		fill: var(--plot-background);
		stroke: var(--color-border-light);
	}
	.panel-title,
	.tick,
	.axis-label,
	.force-label,
	.equation,
	.legend {
		font-family: var(--font-sans);
		pointer-events: none;
	}
	.panel-title {
		fill: var(--plot-muted);
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.1em;
	}
	.floor,
	.wall {
		stroke: var(--plot-axis);
		stroke-width: 2;
		fill: none;
		stroke-linecap: round;
	}
	.spring {
		stroke: var(--plot-violet);
		stroke-width: 2.4;
		fill: none;
		stroke-linejoin: round;
	}
	.damper {
		stroke: var(--plot-muted);
		stroke-width: 2;
	}
	.damper-body {
		fill: var(--plot-background);
		stroke: var(--plot-muted);
		stroke-width: 2;
	}
	.mass {
		fill: url(#resonance-mass);
		stroke: var(--plot-blue);
		stroke-width: 1.5;
	}
	.wheel {
		fill: var(--plot-background);
		stroke: var(--plot-axis);
		stroke-width: 1.6;
	}
	.force-arrow {
		stroke: var(--plot-amber);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.force-arrow + text {
		fill: var(--plot-amber);
	}
	:global(#force-arrow path) {
		fill: var(--plot-amber);
	}
	.force-label {
		fill: var(--plot-amber);
		font-size: 10px;
		font-weight: 750;
	}
	.equation {
		fill: var(--plot-muted);
		font-size: 12px;
		font-weight: 650;
	}
	.grid {
		stroke: var(--plot-grid);
	}
	.tick,
	.axis-label {
		fill: var(--plot-muted);
		font-size: 9px;
		font-weight: 650;
	}
	.response-curve {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.probe {
		stroke: var(--plot-amber);
		stroke-width: 1.5;
		stroke-dasharray: 4 5;
	}
	.response-point-halo {
		fill: color-mix(in srgb, var(--plot-amber) 18%, transparent);
	}
	.response-point,
	.force-dot {
		fill: var(--plot-amber);
	}
	.response-point {
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.trace-zero {
		stroke: var(--plot-grid);
	}
	.force-trace {
		fill: none;
		stroke: var(--plot-amber);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.displacement-trace {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.displacement-dot {
		fill: var(--plot-blue);
	}
	.legend {
		fill: var(--plot-muted);
		font-size: 9px;
		font-weight: 700;
	}
	.readout {
		display: grid;
		grid-template-columns: repeat(3, 1fr) auto;
		align-items: center;
		gap: 0.8rem;
		padding: 0.8rem 0.25rem 0.4rem;
	}
	.readout small {
		display: block;
		color: var(--color-ink-light);
		font: 650 0.7rem/1.25 var(--font-sans);
	}
	.readout strong {
		display: block;
		margin-top: 0.13rem;
		font: 750 0.88rem/1.25 var(--font-sans);
		font-variant-numeric: tabular-nums;
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
		.stage svg {
			width: 100%;
		}
		.readout {
			grid-template-columns: repeat(3, 1fr);
			gap: 0.5rem;
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
		.equation {
			font-size: 15px;
		}
		.tick,
		.axis-label,
		.force-label,
		.legend {
			font-size: 13px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.preset-row button,
		.readout button {
			transition: none;
		}
	}
</style>
