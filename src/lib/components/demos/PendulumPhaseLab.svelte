<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';

	type PhasePoint = { theta: number; omega: number };

	const width = 700;
	const height = 390;
	const tau = Math.PI * 2;
	const physical = { pivotX: 176, pivotY: 102, length: 138 };
	const phase = { left: 372, right: 666, top: 54, bottom: 352 };

	let theta = $state(1.05);
	let omega = $state(0);
	let damping = $state(0.06);
	let running = $state(true);
	let trail = $state<PhasePoint[]>([]);
	let dragging = false;
	let lastDragTheta = 0;
	let lastDragTime = 0;

	const wrappedTheta = $derived(Math.atan2(Math.sin(theta), Math.cos(theta)));
	const bobX = $derived(physical.pivotX + physical.length * Math.sin(wrappedTheta));
	const bobY = $derived(physical.pivotY + physical.length * Math.cos(wrappedTheta));
	const kinetic = $derived(0.5 * omega * omega);
	const potential = $derived(1 - Math.cos(wrappedTheta));
	const totalEnergy = $derived(kinetic + potential);
	const energyFraction = $derived(totalEnergy > 0 ? kinetic / totalEnergy : 0);

	function px(angle: number) {
		return phase.left + ((angle + Math.PI) / tau) * (phase.right - phase.left);
	}

	function py(rate: number) {
		const clamped = Math.max(-3.2, Math.min(3.2, rate));
		return phase.bottom - ((clamped + 3.2) / 6.4) * (phase.bottom - phase.top);
	}

	function energyContour(energy: number, sign: number) {
		let path = '';
		let drawing = false;
		for (let index = 0; index <= 150; index += 1) {
			const angle = -Math.PI + (tau * index) / 150;
			const available = 2 * (energy - 1 + Math.cos(angle));
			if (available < 0) {
				drawing = false;
				continue;
			}
			const rate = sign * Math.sqrt(available);
			path += (drawing ? ' L ' : ' M ') + px(angle).toFixed(2) + ' ' + py(rate).toFixed(2);
			drawing = true;
		}
		return path;
	}

	const contours = [0.28, 0.8, 1.4, 2, 2.4, 3.2].flatMap((energy) => [
		{ key: energy + '-plus', path: energyContour(energy, 1), separatrix: energy === 2 },
		{ key: energy + '-minus', path: energyContour(energy, -1), separatrix: energy === 2 }
	]);

	const phaseArrows = $derived.by(() => {
		const result = [];
		for (let row = 0; row < 7; row += 1) {
			const rate = -2.7 + row * 0.9;
			for (let column = 0; column < 9; column += 1) {
				const angle = -2.8 + column * 0.7;
				const dx = rate;
				const dy = -Math.sin(angle) - damping * rate;
				const magnitude = Math.hypot(dx, dy);
				const ux = magnitude < 0.001 ? 1 : dx / magnitude;
				const uy = magnitude < 0.001 ? 0 : dy / magnitude;
				const cx = px(angle);
				const cy = py(rate);
				const length = 11;
				result.push({
					key: row + '-' + column,
					x1: cx - ux * length * 0.42,
					y1: cy + uy * length * 0.42,
					x2: cx + ux * length * 0.58,
					y2: cy - uy * length * 0.58
				});
			}
		}
		return result;
	});

	const trailPath = $derived.by(() => {
		let path = '';
		let previous: PhasePoint | null = null;
		for (const point of trail) {
			const wrapped = Math.atan2(Math.sin(point.theta), Math.cos(point.theta));
			const jump = previous && Math.abs(wrapped - previous.theta) > Math.PI;
			path +=
				(previous && !jump ? ' L ' : ' M ') +
				px(wrapped).toFixed(2) +
				' ' +
				py(point.omega).toFixed(2);
			previous = { theta: wrapped, omega: point.omega };
		}
		return path;
	});

	function acceleration(angle: number, rate: number) {
		return -Math.sin(angle) - damping * rate;
	}

	function step(dt: number) {
		const k1Theta = omega;
		const k1Omega = acceleration(theta, omega);
		const k2Theta = omega + 0.5 * dt * k1Omega;
		const k2Omega = acceleration(theta + 0.5 * dt * k1Theta, omega + 0.5 * dt * k1Omega);
		const k3Theta = omega + 0.5 * dt * k2Omega;
		const k3Omega = acceleration(theta + 0.5 * dt * k2Theta, omega + 0.5 * dt * k2Omega);
		const k4Theta = omega + dt * k3Omega;
		const k4Omega = acceleration(theta + dt * k3Theta, omega + dt * k3Omega);
		theta += (dt / 6) * (k1Theta + 2 * k2Theta + 2 * k3Theta + k4Theta);
		omega += (dt / 6) * (k1Omega + 2 * k2Omega + 2 * k3Omega + k4Omega);
	}

	function setPreset(kind: 'gentle' | 'edge' | 'rotation' | 'damped') {
		if (kind === 'gentle') {
			theta = 0.72;
			omega = 0;
			damping = 0.03;
		} else if (kind === 'edge') {
			theta = 2.88;
			omega = 0;
			damping = 0;
		} else if (kind === 'rotation') {
			theta = 0;
			omega = 2.55;
			damping = 0.02;
		} else {
			theta = 1.9;
			omega = 0;
			damping = 0.28;
		}
		trail = [];
		running = true;
	}

	function reset() {
		theta = 1.05;
		omega = 0;
		damping = 0.06;
		trail = [];
		running = false;
	}

	function pointerAngle(event: PointerEvent) {
		const target = event.currentTarget as SVGCircleElement;
		const svg = target.ownerSVGElement;
		if (!svg) return wrappedTheta;
		const rect = svg.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * width;
		const y = ((event.clientY - rect.top) / rect.height) * height;
		return Math.atan2(x - physical.pivotX, y - physical.pivotY);
	}

	function startDrag(event: PointerEvent) {
		const target = event.currentTarget as SVGCircleElement;
		target.setPointerCapture(event.pointerId);
		dragging = true;
		running = false;
		lastDragTheta = pointerAngle(event);
		lastDragTime = event.timeStamp;
		trail = [];
	}

	function continueDrag(event: PointerEvent) {
		if (!dragging) return;
		const nextTheta = pointerAngle(event);
		const elapsed = Math.max(0.008, (event.timeStamp - lastDragTime) / 1000);
		let delta = nextTheta - lastDragTheta;
		if (delta > Math.PI) delta -= tau;
		if (delta < -Math.PI) delta += tau;
		omega = Math.max(-3.4, Math.min(3.4, delta / elapsed));
		theta = nextTheta;
		lastDragTheta = nextTheta;
		lastDragTime = event.timeStamp;
	}

	function stopDrag(event: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		const target = event.currentTarget as SVGCircleElement;
		if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
		running = true;
	}

	function nudge(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') theta -= 0.08;
		else if (event.key === 'ArrowRight') theta += 0.08;
		else if (event.key === 'ArrowDown') omega -= 0.12;
		else if (event.key === 'ArrowUp') omega += 0.12;
		else return;
		trail = [];
		event.preventDefault();
	}

	function format(value: number) {
		const clean = Math.abs(value) < 0.005 ? 0 : value;
		return clean.toFixed(2);
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			running = false;
			return;
		}

		let frame = 0;
		let previous = performance.now();
		let trailClock = 0;
		const animate = (now: number) => {
			const elapsed = Math.min(0.035, (now - previous) / 1000);
			previous = now;
			if (running && !dragging) {
				const duration = elapsed * 1.35;
				const pieces = Math.max(1, Math.ceil(duration / 0.01));
				for (let index = 0; index < pieces; index += 1) step(duration / pieces);
				trailClock += elapsed;
				if (trailClock > 0.035) {
					trailClock = 0;
					trail = [...trail.slice(-149), { theta, omega }];
				}
			}
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="pendulum-lab">
	<div class="lab-heading">
		<div>
			<span class="eyebrow">One motion, two worlds</span>
			<h4>Release the pendulum and follow its state</h4>
		</div>
		<p>
			Drag the bob and throw it. The point on the right records angle and angular velocity together.
		</p>
	</div>

	<div class="preset-row" aria-label="Pendulum starting conditions">
		<button onclick={() => setPreset('gentle')}>Gentle swing</button>
		<button onclick={() => setPreset('edge')}>Near the top</button>
		<button onclick={() => setPreset('rotation')}>Full rotation</button>
		<button onclick={() => setPreset('damped')}>Damped return</button>
	</div>

	<div class="stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="A physical pendulum linked to its phase portrait"
		>
			<defs>
				<marker
					id="phase-arrow"
					markerWidth="6"
					markerHeight="6"
					refX="5"
					refY="3"
					orient="auto"
					markerUnits="userSpaceOnUse"
				>
					<path d="M 0 0 L 6 3 L 0 6 Z" />
				</marker>
				<linearGradient id="bob-fill" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="var(--plot-violet)" />
					<stop offset="1" stop-color="var(--plot-blue)" />
				</linearGradient>
			</defs>

			<rect class="panel-bg" x="24" y="30" width="306" height="344" rx="18" />
			<rect class="panel-bg" x="354" y="30" width="326" height="344" rx="18" />
			<text class="panel-title" x="44" y="58">PHYSICAL MOTION</text>
			<text class="panel-title" x="374" y="58">STATE SPACE · (θ, ω)</text>

			<line class="support" x1="96" x2="256" y1={physical.pivotY - 14} y2={physical.pivotY - 14} />
			<circle class="pivot" cx={physical.pivotX} cy={physical.pivotY} r="5" />
			<line
				class="equilibrium"
				x1={physical.pivotX}
				x2={physical.pivotX}
				y1={physical.pivotY}
				y2={physical.pivotY + physical.length + 54}
			/>
			<path
				class="angle-arc"
				d={'M ' +
					physical.pivotX +
					' ' +
					(physical.pivotY + 42) +
					' A 42 42 0 0 ' +
					(wrappedTheta >= 0 ? 0 : 1) +
					' ' +
					(physical.pivotX + 42 * Math.sin(wrappedTheta)) +
					' ' +
					(physical.pivotY + 42 * Math.cos(wrappedTheta))}
			/>
			<line class="rod" x1={physical.pivotX} y1={physical.pivotY} x2={bobX} y2={bobY} />
			<circle class="bob" cx={bobX} cy={bobY} r="19" />
			<circle class="bob-shine" cx={bobX - 6} cy={bobY - 7} r="4" />
			<circle
				class="bob-handle"
				role="button"
				aria-label="Pendulum bob. Drag to choose angle and angular velocity; use arrow keys for fine adjustment."
				tabindex="0"
				cx={bobX}
				cy={bobY}
				r="27"
				onpointerdown={startDrag}
				onpointermove={continueDrag}
				onpointerup={stopDrag}
				onpointercancel={stopDrag}
				onkeydown={nudge}
			/>
			<text
				class="theta-label"
				x={physical.pivotX + 50 * Math.sin(wrappedTheta / 2)}
				y={physical.pivotY + 50 * Math.cos(wrappedTheta / 2)}>θ</text
			>
			<text class="instruction" x={physical.pivotX} y="345" text-anchor="middle"
				>drag · throw · release</text
			>

			{#each [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI] as angle (angle)}
				<line class="phase-grid" x1={px(angle)} x2={px(angle)} y1={phase.top} y2={phase.bottom} />
			{/each}
			{#each [-2, -1, 0, 1, 2] as rate (rate)}
				<line
					class="phase-grid"
					class:major={rate === 0}
					x1={phase.left}
					x2={phase.right}
					y1={py(rate)}
					y2={py(rate)}
				/>
			{/each}

			{#each contours as contour (contour.key)}
				<path class:separatrix={contour.separatrix} class="energy-contour" d={contour.path} />
			{/each}
			{#each phaseArrows as arrow (arrow.key)}
				<line
					class="phase-arrow"
					x1={arrow.x1}
					y1={arrow.y1}
					x2={arrow.x2}
					y2={arrow.y2}
					marker-end="url(#phase-arrow)"
				/>
			{/each}
			<path class="phase-trail" d={trailPath} />
			<circle class="phase-halo" cx={px(wrappedTheta)} cy={py(omega)} r="10" />
			<circle class="phase-point" cx={px(wrappedTheta)} cy={py(omega)} r="5.5" />
			<text class="axis-label" x={phase.right - 8} y={py(0) - 9}>θ</text>
			<text class="axis-label" x={px(0) + 9} y={phase.top + 14}>ω</text>
			<text class="tick-label" x={phase.left + 4} y={phase.bottom + 16}>−π</text>
			<text class="tick-label" x={phase.right - 4} y={phase.bottom + 16} text-anchor="end">π</text>
			<text class="contour-label" x={phase.right - 10} y={phase.top + 26} text-anchor="end"
				>energy contours</text
			>
		</svg>
	</div>

	<div class="state-rail">
		<div><small>angle θ</small><strong>{format(wrappedTheta)} rad</strong></div>
		<div><small>angular velocity ω</small><strong>{format(omega)} rad/s</strong></div>
		<div class="energy-readout">
			<small>energy · kinetic / potential</small>
			<div class="energy-bar"><span style:width={energyFraction * 100 + '%'}></span></div>
			<strong>{format(totalEnergy)}</strong>
		</div>
	</div>

	<div class="controls">
		<SliderField
			label="Damping b"
			min={0}
			max={0.65}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={damping}
		/>
		<SliderField
			label="Angular velocity ω"
			min={-3.2}
			max={3.2}
			step={0.05}
			decimals={2}
			tone="blue"
			bind:value={omega}
			oninput={() => {
				running = false;
				trail = [];
			}}
		/>
	</div>

	<div class="transport">
		<button class="play" onclick={() => (running = !running)}
			>{running ? 'Pause motion' : 'Continue motion'}</button
		>
		<button onclick={reset}>Reset</button>
		<span>θ′ = ω · ω′ = −sin θ − bω</span>
	</div>
</div>

<style>
	.pendulum-lab {
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
		color: var(--plot-violet);
		font: 800 0.7rem/1.2 var(--font-sans);
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	.preset-row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.45rem;
		margin-bottom: 0.7rem;
	}

	.preset-row button,
	.transport button {
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
	.transport button:hover,
	.transport button:focus-visible {
		border-color: color-mix(in srgb, var(--plot-violet) 64%, var(--color-border-light));
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

	.panel-bg {
		fill: var(--plot-background);
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.panel-title,
	.axis-label,
	.tick-label,
	.contour-label,
	.instruction,
	.theta-label {
		font-family: var(--font-sans);
		pointer-events: none;
	}

	.panel-title {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.09em;
	}

	.support {
		stroke: var(--plot-axis);
		stroke-width: 5;
		stroke-linecap: round;
	}

	.pivot {
		fill: var(--plot-ink);
	}

	.equilibrium {
		stroke: var(--plot-grid);
		stroke-width: 1;
		stroke-dasharray: 3 5;
	}

	.angle-arc {
		fill: none;
		stroke: var(--plot-amber);
		stroke-width: 1.6;
	}

	.rod {
		stroke: var(--plot-ink);
		stroke-width: 2.2;
		stroke-linecap: round;
	}

	.bob {
		fill: url(#bob-fill);
		stroke: var(--plot-outline);
		stroke-width: 2;
	}

	.bob-shine {
		fill: color-mix(in srgb, var(--plot-outline) 70%, transparent);
		pointer-events: none;
	}

	.bob-handle {
		fill: transparent;
		stroke: transparent;
		outline: none;
		touch-action: none;
		cursor: grab;
	}

	.bob-handle:active {
		cursor: grabbing;
	}

	.bob-handle:focus-visible {
		stroke: var(--plot-amber);
		stroke-width: 2;
	}

	.theta-label {
		fill: var(--plot-amber);
		font-size: 15px;
		font-weight: 700;
	}

	.instruction {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
	}

	.phase-grid {
		stroke: var(--plot-grid);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.phase-grid.major {
		stroke: var(--plot-axis);
	}

	.energy-contour {
		fill: none;
		stroke: color-mix(in srgb, var(--plot-teal) 28%, transparent);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.energy-contour.separatrix {
		stroke: color-mix(in srgb, var(--plot-amber) 56%, transparent);
		stroke-width: 1.4;
	}

	#phase-arrow path {
		fill: var(--plot-blue);
	}

	.phase-arrow {
		stroke: var(--plot-blue);
		stroke-width: 1.15;
		stroke-linecap: round;
		opacity: 0.42;
		vector-effect: non-scaling-stroke;
	}

	.phase-trail {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.phase-halo {
		fill: color-mix(in srgb, var(--plot-violet) 18%, transparent);
	}

	.phase-point {
		fill: var(--plot-violet);
		stroke: var(--plot-outline);
		stroke-width: 1.8;
		vector-effect: non-scaling-stroke;
	}

	.axis-label {
		fill: var(--plot-ink);
		font-size: 13px;
		font-weight: 700;
	}

	.tick-label,
	.contour-label {
		fill: var(--plot-muted);
		font-size: 10px;
		font-weight: 650;
	}

	.state-rail {
		display: grid;
		grid-template-columns: 0.8fr 1.1fr 1.5fr;
		margin-top: 0.7rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 14px;
		background: color-mix(in srgb, var(--color-surface-raised) 74%, transparent);
	}

	.state-rail > div {
		display: grid;
		align-content: center;
		gap: 0.18rem;
		padding: 0.72rem 0.85rem;
		border-right: 1px solid var(--color-border-light);
	}

	.state-rail > div:last-child {
		border-right: 0;
	}

	.state-rail small {
		color: var(--color-ink-faint);
		font: 700 0.63rem/1.2 var(--font-sans);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.state-rail strong {
		color: var(--color-ink);
		font: 700 0.9rem/1.2 var(--font-mono);
	}

	.energy-readout {
		grid-template-columns: 1fr auto;
	}

	.energy-readout small {
		grid-column: 1 / -1;
	}

	.energy-bar {
		align-self: center;
		height: 0.35rem;
		overflow: hidden;
		border-radius: 999px;
		background: color-mix(in srgb, var(--plot-teal) 22%, var(--plot-grid));
	}

	.energy-bar span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--plot-violet), var(--plot-blue));
	}

	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 0.72rem;
		padding: 0 0.15rem;
	}

	.transport {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		margin-top: 0.35rem;
	}

	.transport .play {
		border-color: color-mix(in srgb, var(--plot-violet) 65%, var(--color-border-light));
		background: color-mix(in srgb, var(--plot-violet) 10%, var(--color-surface-raised));
	}

	.transport span {
		margin-left: auto;
		color: var(--color-ink-faint);
		font: 600 0.72rem/1.35 var(--font-mono);
	}

	@media (max-width: 680px) {
		.lab-heading {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.preset-row {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.preset-row button {
			min-height: 2.5rem;
		}

		.stage {
			border-radius: 14px;
		}

		.panel-title,
		.instruction,
		.tick-label,
		.contour-label {
			font-size: 21px;
		}

		.axis-label,
		.theta-label {
			font-size: 22px;
		}

		.state-rail {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.state-rail > div:nth-child(2) {
			border-right: 0;
		}

		.energy-readout {
			grid-column: 1 / -1;
			border-top: 1px solid var(--color-border-light);
		}

		.controls {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}

		.transport {
			flex-wrap: wrap;
		}

		.transport span {
			width: 100%;
			margin: 0.25rem 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preset-row button,
		.transport button {
			transition: none;
		}
	}
</style>
