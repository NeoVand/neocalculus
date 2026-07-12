<script lang="ts">
	import { onMount } from 'svelte';
	import SliderField from './SliderField.svelte';

	type Vector = { x: number; y: number };
	type FieldKey = 'mixed' | 'rotation' | 'expansion' | 'saddle';
	type FieldSpec = {
		key: FieldKey;
		name: string;
		formula: string;
		note: string;
		vector: (x: number, y: number) => Vector;
		divergence: (x: number, y: number) => number;
		curl: (x: number, y: number) => number;
	};

	const width = 700;
	const height = 444;
	const plot = { left: 46, right: 654, top: 42, bottom: 414 };
	const xMin = -2.4;
	const xMax = 2.4;
	const yMin = -1.6;
	const yMax = 1.6;
	const fieldSpecs: FieldSpec[] = [
		{
			key: 'mixed',
			name: 'Sources + swirls',
			formula: 'F = (0.28x² − 0.50y, 0.50x + 0.18x² + 0.28y²)',
			note: 'Both readings vary as the probe moves.',
			vector: (x, y) => ({
				x: 0.28 * x * x - 0.5 * y,
				y: 0.5 * x + 0.18 * x * x + 0.28 * y * y
			}),
			divergence: (x, y) => 0.56 * (x + y),
			curl: (x) => 1 + 0.36 * x
		},
		{
			key: 'rotation',
			name: 'Rigid rotation',
			formula: 'F = (−0.60y, 0.60x)',
			note: 'The wheel turns, but the ring keeps its area.',
			vector: (x, y) => ({ x: -0.6 * y, y: 0.6 * x }),
			divergence: () => 0,
			curl: () => 1.2
		},
		{
			key: 'expansion',
			name: 'Uniform expansion',
			formula: 'F = (0.55x, 0.55y)',
			note: 'The ring expands, but the wheel does not turn.',
			vector: (x, y) => ({ x: 0.55 * x, y: 0.55 * y }),
			divergence: () => 1.1,
			curl: () => 0
		},
		{
			key: 'saddle',
			name: 'Saddle flow',
			formula: 'F = (0.55x, −0.55y)',
			note: 'A small circle stretches, yet both readings are zero.',
			vector: (x, y) => ({ x: 0.55 * x, y: -0.55 * y }),
			divergence: () => 0,
			curl: () => 0
		}
	];

	let selectedKey = $state<FieldKey>('mixed');
	let probeX = $state(0.55);
	let probeY = $state(-0.25);
	let wheelAngle = $state(0);
	let pulse = $state(0.5);
	let dragging = false;

	const selected = $derived(fieldSpecs.find((field) => field.key === selectedKey) ?? fieldSpecs[0]);
	const divergenceValue = $derived(selected.divergence(probeX, probeY));
	const curlValue = $derived(selected.curl(probeX, probeY));
	const ringRadius = $derived(35 + 8 * Math.tanh(divergenceValue) * pulse);

	function sx(x: number) {
		return plot.left + ((x - xMin) / (xMax - xMin)) * (plot.right - plot.left);
	}

	function sy(y: number) {
		return plot.bottom - ((y - yMin) / (yMax - yMin)) * (plot.bottom - plot.top);
	}

	const gridXs = Array.from({ length: 11 }, (_, index) => -2.2 + index * 0.44);
	const gridYs = Array.from({ length: 7 }, (_, index) => -1.4 + index * (2.8 / 6));
	const axisXs = [-2, -1, 0, 1, 2];
	const axisYs = [-1, 0, 1];

	const fieldArrows = $derived.by(() => {
		return gridYs.flatMap((y, row) =>
			gridXs.map((x, column) => {
				const vector = selected.vector(x, y);
				const magnitude = Math.hypot(vector.x, vector.y);
				const length = 13 + 12 * Math.min(1, magnitude / 1.8);
				const ux = magnitude < 0.001 ? 1 : vector.x / magnitude;
				const uy = magnitude < 0.001 ? 0 : vector.y / magnitude;
				const centerX = sx(x);
				const centerY = sy(y);
				return {
					key: row + '-' + column,
					x1: centerX - ux * length * 0.38,
					y1: centerY + uy * length * 0.38,
					x2: centerX + ux * length * 0.62,
					y2: centerY - uy * length * 0.62,
					opacity: 0.34 + 0.48 * Math.min(1, magnitude / 1.5)
				};
			})
		);
	});

	const radialArrows = $derived.by(() => {
		if (Math.abs(divergenceValue) < 0.04) return [];
		const outward = divergenceValue > 0;
		return [0, 90, 180, 270].map((angle) => {
			const radians = (angle * Math.PI) / 180;
			const inner = outward ? 41 : 54;
			const outer = outward ? 54 : 41;
			return {
				angle,
				x1: Math.cos(radians) * inner,
				y1: Math.sin(radians) * inner,
				x2: Math.cos(radians) * outer,
				y2: Math.sin(radians) * outer
			};
		});
	});

	function selectField(key: FieldKey) {
		selectedKey = key;
		wheelAngle = 0;
	}

	function pointerToField(event: PointerEvent) {
		const target = event.currentTarget as SVGCircleElement;
		const svg = target.ownerSVGElement;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const px = ((event.clientX - rect.left) / rect.width) * width;
		const py = ((event.clientY - rect.top) / rect.height) * height;
		probeX = Math.max(
			xMin,
			Math.min(xMax, xMin + ((px - plot.left) / (plot.right - plot.left)) * (xMax - xMin))
		);
		probeY = Math.max(
			yMin,
			Math.min(yMax, yMax - ((py - plot.top) / (plot.bottom - plot.top)) * (yMax - yMin))
		);
	}

	function startDrag(event: PointerEvent) {
		const target = event.currentTarget as SVGCircleElement;
		target.setPointerCapture(event.pointerId);
		dragging = true;
		pointerToField(event);
	}

	function continueDrag(event: PointerEvent) {
		if (dragging) pointerToField(event);
	}

	function stopDrag(event: PointerEvent) {
		dragging = false;
		const target = event.currentTarget as SVGCircleElement;
		if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
	}

	function moveProbeKeyboard(event: KeyboardEvent) {
		const step = event.shiftKey ? 0.25 : 0.1;
		if (event.key === 'ArrowLeft') probeX = Math.max(xMin, probeX - step);
		else if (event.key === 'ArrowRight') probeX = Math.min(xMax, probeX + step);
		else if (event.key === 'ArrowDown') probeY = Math.max(yMin, probeY - step);
		else if (event.key === 'ArrowUp') probeY = Math.min(yMax, probeY + step);
		else return;
		event.preventDefault();
	}

	function format(value: number) {
		const clean = Math.abs(value) < 0.005 ? 0 : value;
		return clean.toFixed(2);
	}

	function divergenceReading(value: number) {
		if (value > 0.04) return 'local area expands';
		if (value < -0.04) return 'local area contracts';
		return 'no first-order area change';
	}

	function curlReading(value: number) {
		if (value > 0.04) return 'counterclockwise tendency';
		if (value < -0.04) return 'clockwise tendency';
		return 'no local turning tendency';
	}

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) {
			pulse = 1;
			return;
		}

		let frame = 0;
		let previous = performance.now();
		const animate = (now: number) => {
			const elapsed = Math.min(40, now - previous);
			previous = now;
			wheelAngle = (wheelAngle + curlValue * elapsed * 0.04) % 360;
			pulse = (1 - Math.cos(now * 0.0032)) / 2;
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="field-lab">
	<div class="lab-heading">
		<div>
			<span class="eyebrow">A field under the microscope</span>
			<h4>Two local questions, one moving probe</h4>
		</div>
		<p>Drag the circular probe. Its ring tests expansion; its paddlewheel tests turning.</p>
	</div>

	<div class="preset-row" aria-label="Vector field examples">
		{#each fieldSpecs as field (field.key)}
			<button class:active={selectedKey === field.key} onclick={() => selectField(field.key)}>
				<span>{field.name}</span>
			</button>
		{/each}
	</div>

	<div class="field-stage">
		<svg
			viewBox="0 0 {width} {height}"
			role="img"
			aria-label="Vector field with a draggable curl and divergence probe"
		>
			<defs>
				<marker
					id="field-arrow"
					markerWidth="7"
					markerHeight="7"
					refX="5.5"
					refY="3.5"
					orient="auto"
					markerUnits="userSpaceOnUse"
				>
					<path d="M 0 0 L 7 3.5 L 0 7 Z" />
				</marker>
				<marker
					id="probe-arrow"
					markerWidth="6"
					markerHeight="6"
					refX="5"
					refY="3"
					orient="auto"
					markerUnits="userSpaceOnUse"
				>
					<path d="M 0 0 L 6 3 L 0 6 Z" />
				</marker>
				<linearGradient id="stage-wash" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="var(--plot-blue)" stop-opacity="0.06" />
					<stop offset="0.55" stop-color="var(--plot-violet)" stop-opacity="0.025" />
					<stop offset="1" stop-color="var(--plot-teal)" stop-opacity="0.06" />
				</linearGradient>
			</defs>

			<rect
				class="stage-bg"
				x={plot.left}
				y={plot.top}
				width={plot.right - plot.left}
				height={plot.bottom - plot.top}
				rx="18"
			/>
			<rect
				class="stage-wash"
				x={plot.left}
				y={plot.top}
				width={plot.right - plot.left}
				height={plot.bottom - plot.top}
				rx="18"
			/>

			{#each axisXs as x (x)}
				<line
					class:major={x === 0}
					class="grid-line"
					x1={sx(x)}
					x2={sx(x)}
					y1={plot.top}
					y2={plot.bottom}
				/>
			{/each}
			{#each axisYs as y (y)}
				<line
					class:major={y === 0}
					class="grid-line"
					x1={plot.left}
					x2={plot.right}
					y1={sy(y)}
					y2={sy(y)}
				/>
			{/each}

			{#each fieldArrows as arrow (arrow.key)}
				<line
					class="field-arrow"
					x1={arrow.x1}
					y1={arrow.y1}
					x2={arrow.x2}
					y2={arrow.y2}
					opacity={arrow.opacity}
					marker-end="url(#field-arrow)"
				/>
			{/each}

			<g transform="translate({sx(probeX)} {sy(probeY)})">
				<circle class="probe-mask" r="61" />
				<circle class="rest-ring" r="35" />
				<circle class="breathing-ring" r={ringRadius} />

				{#each radialArrows as arrow (arrow.angle)}
					<line
						class="radial-arrow"
						x1={arrow.x1}
						y1={arrow.y1}
						x2={arrow.x2}
						y2={arrow.y2}
						marker-end="url(#probe-arrow)"
					/>
				{/each}

				<g class="wheel" transform="rotate({wheelAngle})">
					<circle class="wheel-hub-ring" r="22" />
					{#each [0, 60, 120, 180, 240, 300] as angle (angle)}
						<path
							class="wheel-blade"
							d="M -3 -3 L 20 -2 L 16 6 L 2 4 Z"
							transform="rotate({angle})"
						/>
					{/each}
					<circle class="wheel-hub" r="5" />
				</g>
			</g>

			<circle
				class="probe-handle"
				role="button"
				aria-label={'Field probe at x ' +
					format(probeX) +
					', y ' +
					format(probeY) +
					'. Use arrow keys to move it.'}
				tabindex="0"
				cx={sx(probeX)}
				cy={sy(probeY)}
				r="61"
				onpointerdown={startDrag}
				onpointermove={continueDrag}
				onpointerup={stopDrag}
				onpointercancel={stopDrag}
				onkeydown={moveProbeKeyboard}
				onpointerleave={(event) => {
					if (dragging && event.buttons === 0) stopDrag(event);
				}}
			/>

			<text class="axis-label" x={plot.right - 12} y={sy(0) - 10}>x</text>
			<text class="axis-label" x={sx(0) + 10} y={plot.top + 18}>y</text>
		</svg>
	</div>

	<div class="reading-rail">
		<div class="reading divergence">
			<span class="reading-symbol">∇ · F</span>
			<div>
				<strong>{format(divergenceValue)}</strong>
				<small>{divergenceReading(divergenceValue)}</small>
			</div>
		</div>
		<div class="reading curl">
			<span class="reading-symbol">curl F</span>
			<div>
				<strong>{format(curlValue)}</strong>
				<small>{curlReading(curlValue)}</small>
			</div>
		</div>
	</div>

	<div class="field-note">
		<strong>{selected.formula}</strong>
		<span>{selected.note}</span>
	</div>

	<div class="probe-controls">
		<SliderField
			label="Probe x"
			min={xMin}
			max={xMax}
			step={0.05}
			decimals={2}
			tone="blue"
			bind:value={probeX}
		/>
		<SliderField
			label="Probe y"
			min={yMin}
			max={yMax}
			step={0.05}
			decimals={2}
			tone="teal"
			bind:value={probeY}
		/>
	</div>
</div>

<style>
	.field-lab {
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}

	.lab-heading {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(15rem, 0.75fr);
		align-items: end;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.lab-heading h4 {
		margin: 0.16rem 0 0;
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

	.preset-row button {
		display: grid;
		place-items: center;
		min-width: 0;
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink-light);
		padding: 0.58rem 0.68rem;
		text-align: center;
		cursor: pointer;
		transition:
			border-color 160ms ease,
			background 160ms ease,
			transform 160ms ease;
	}

	.preset-row button:hover,
	.preset-row button:focus-visible {
		border-color: color-mix(in srgb, var(--plot-violet) 62%, var(--color-border-light));
		transform: translateY(-1px);
	}

	.preset-row button.active {
		border-color: color-mix(in srgb, var(--plot-violet) 72%, var(--color-border-light));
		background: color-mix(in srgb, var(--plot-violet) 10%, var(--color-surface-raised));
	}

	.preset-row span {
		color: var(--color-ink);
		font: 720 0.75rem/1.15 var(--font-sans);
	}

	.field-stage {
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

	.stage-bg {
		fill: var(--plot-background);
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.stage-wash {
		fill: url(#stage-wash);
	}

	.grid-line {
		stroke: var(--plot-grid);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.grid-line.major {
		stroke: var(--plot-axis);
		stroke-width: 1.15;
	}

	#field-arrow path {
		fill: var(--plot-blue);
	}

	#probe-arrow path {
		fill: var(--plot-teal);
	}

	.field-arrow {
		stroke: var(--plot-blue);
		stroke-width: 1.55;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	.probe-mask {
		fill: color-mix(in srgb, var(--plot-background) 90%, transparent);
		stroke: color-mix(in srgb, var(--plot-violet) 40%, var(--plot-axis));
		stroke-width: 1.2;
		vector-effect: non-scaling-stroke;
	}

	.rest-ring {
		fill: none;
		stroke: color-mix(in srgb, var(--plot-teal) 36%, var(--plot-axis));
		stroke-width: 1;
		stroke-dasharray: 3 4;
		vector-effect: non-scaling-stroke;
	}

	.breathing-ring {
		fill: color-mix(in srgb, var(--plot-teal) 7%, transparent);
		stroke: var(--plot-teal);
		stroke-width: 2.2;
		vector-effect: non-scaling-stroke;
	}

	.radial-arrow {
		stroke: var(--plot-teal);
		stroke-width: 1.8;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	.wheel-hub-ring {
		fill: color-mix(in srgb, var(--plot-violet) 8%, var(--plot-background));
		stroke: color-mix(in srgb, var(--plot-violet) 58%, var(--plot-axis));
		stroke-width: 1.2;
		vector-effect: non-scaling-stroke;
	}

	.wheel-blade {
		fill: color-mix(in srgb, var(--plot-violet) 72%, transparent);
		stroke: var(--plot-violet);
		stroke-width: 0.8;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.wheel-hub {
		fill: var(--plot-violet);
	}

	.probe-handle {
		fill: transparent;
		stroke: transparent;
		touch-action: none;
		cursor: grab;
	}

	.probe-handle:active {
		cursor: grabbing;
	}

	.probe-handle:focus-visible {
		stroke: var(--plot-amber);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}

	text {
		font-family: var(--font-sans);
		pointer-events: none;
	}

	.axis-label {
		fill: var(--plot-muted);
		font-size: 12px;
		font-weight: 700;
	}

	.reading-rail {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 0.72rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 14px;
		background: color-mix(in srgb, var(--color-surface-raised) 74%, transparent);
	}

	.reading {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.85rem;
		padding: 0.86rem 1rem;
	}

	.reading + .reading {
		border-left: 1px solid var(--color-border-light);
	}

	.reading-symbol {
		min-width: 4.2rem;
		font: 700 1rem/1 var(--font-serif);
	}

	.reading > div {
		display: grid;
		gap: 0.1rem;
	}

	.reading strong {
		font: 740 1.18rem/1.1 var(--font-mono);
	}

	.reading small {
		color: var(--color-ink-faint);
		font: 650 0.68rem/1.35 var(--font-sans);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.divergence .reading-symbol,
	.divergence strong {
		color: var(--plot-teal);
	}

	.curl .reading-symbol,
	.curl strong {
		color: var(--plot-violet);
	}

	.field-note {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.68rem 0.15rem 0;
		color: var(--color-ink-light);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	.field-note strong {
		color: var(--color-ink);
		font-family: var(--font-mono);
		font-size: 0.67rem;
	}

	.probe-controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
		margin-top: 0.65rem;
		padding: 0 0.15rem;
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
			min-height: 2.55rem;
		}

		.field-stage {
			border-radius: 14px;
		}

		.reading {
			grid-template-columns: 1fr;
			gap: 0.35rem;
			padding: 0.78rem;
		}

		.reading-symbol {
			min-width: 0;
		}

		.field-note {
			display: grid;
			gap: 0.28rem;
		}

		.field-note strong {
			overflow-wrap: anywhere;
		}

		.probe-controls {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}

		.axis-label {
			font-size: 17px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preset-row button {
			transition: none;
		}
	}
</style>
