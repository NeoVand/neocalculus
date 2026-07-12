<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from './DemoHeader.svelte';
	import EquationPanel from './EquationPanel.svelte';
	import SliderField from './SliderField.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';
	import {
		createFullscreenShader,
		createRenderScheduler,
		cssColorToRgb,
		type FullscreenShader,
		type RenderScheduler
	} from '$lib/utils/webgl';

	let x = $state(2.4);
	let yaw = $state(1.28);
	let pitch = $state(0.42);
	let dragging = $state(false);
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;
	let dragPointer = -1;
	let dragX = 0;
	let dragY = 0;

	const radius = $derived(Math.sqrt(x));
	const area = $derived(Math.PI * x);
	const volume = $derived((Math.PI * x * x) / 2);
	const overlayWidth = 1000;
	const overlayHeight = 722;

	const profileWidth = 360;
	const profileHeight = 260;
	const plotLeft = 42;
	const plotRight = 334;
	const plotMid = 132;
	const radiusScale = 48;
	const profileX = (value: number) => plotLeft + (value / 4) * (plotRight - plotLeft);
	const profileY = (value: number) => plotMid - value * radiusScale;

	function curvePath(sign: 1 | -1, end = 4) {
		const points: string[] = [];
		const count = Math.max(2, Math.ceil(end * 30));
		for (let index = 0; index <= count; index += 1) {
			const value = (end * index) / count;
			points.push(
				`${index === 0 ? 'M' : 'L'} ${profileX(value)} ${profileY(sign * Math.sqrt(value))}`
			);
		}
		return points.join(' ');
	}

	function accumulatedPath() {
		const upper = curvePath(1, x);
		const lowerPoints: string[] = [];
		const count = Math.max(2, Math.ceil(x * 30));
		for (let index = count; index >= 0; index -= 1) {
			const value = (x * index) / count;
			lowerPoints.push(`L ${profileX(value)} ${profileY(-Math.sqrt(value))}`);
		}
		return `${upper} ${lowerPoints.join(' ')} Z`;
	}

	function normalize(vector: [number, number, number]): [number, number, number] {
		const length = Math.hypot(...vector) || 1;
		return [vector[0] / length, vector[1] / length, vector[2] / length];
	}

	function cross(
		a: [number, number, number],
		b: [number, number, number]
	): [number, number, number] {
		return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	}

	function dot(a: [number, number, number], b: [number, number, number]) {
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	function projectPoint(point: [number, number, number]) {
		const target: [number, number, number] = [2, 0, 0];
		const orbit: [number, number, number] = [
			Math.cos(pitch) * Math.cos(yaw),
			Math.sin(pitch),
			Math.cos(pitch) * Math.sin(yaw)
		];
		const eye: [number, number, number] = [
			target[0] + orbit[0] * 7.2,
			target[1] + orbit[1] * 7.2,
			target[2] + orbit[2] * 7.2
		];
		const forward = normalize([target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]]);
		const right = normalize(cross(forward, [0, 1, 0]));
		const up = cross(right, forward);
		const relative: [number, number, number] = [
			point[0] - eye[0],
			point[1] - eye[1],
			point[2] - eye[2]
		];
		const depth = Math.max(0.1, dot(relative, forward));
		const horizontal = dot(relative, right) / (depth * 0.78);
		const vertical = dot(relative, up) / (depth * 0.78);
		return {
			x: overlayWidth / 2 + horizontal * overlayHeight,
			y: overlayHeight / 2 - vertical * overlayHeight
		};
	}

	const projectedRadius = $derived.by(() => {
		const center = projectPoint([x, 0, 0]);
		const end = projectPoint([x, radius * 0.78, radius * 0.626]);
		return { center, end };
	});

	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform float uSlice;
		uniform float uYaw;
		uniform float uPitch;
		uniform vec3 uBackground;
		uniform vec3 uGrid;
		uniform vec3 uInk;
		uniform vec3 uBlue;
		uniform vec3 uViolet;
		uniform vec3 uTeal;
		out vec4 outColor;

		float solid(vec3 p,float cap) {
			float radial=length(p.yz)-sqrt(max(p.x,0.0));
			float bounds=max(-p.x,p.x-cap);
			return max(radial,bounds);
		}
		float traceSolid(vec3 ro,vec3 rd,float cap) {
			float t=0.0;
			for(int i=0;i<112;i++) {
				vec3 p=ro+rd*t;
				float d=solid(p,cap);
				if(d<0.0015) return t;
				t+=max(d*0.72,0.006);
				if(t>18.0) break;
			}
			return 20.0;
		}
		vec3 normalAt(vec3 p,float cap) {
			vec2 e=vec2(0.002,0.0);
			return normalize(vec3(
				solid(p+e.xyy,cap)-solid(p-e.xyy,cap),
				solid(p+e.yxy,cap)-solid(p-e.yxy,cap),
				solid(p+e.yyx,cap)-solid(p-e.yyx,cap)
			));
		}
		vec3 shade(vec3 p,vec3 n,vec3 base,vec3 eye) {
			vec3 light=normalize(vec3(-0.6,0.85,0.45));
			float diffuse=0.34+0.66*max(dot(n,light),0.0);
			float rim=pow(1.0-max(dot(n,normalize(eye-p)),0.0),2.0);
			return base*diffuse+0.16*rim*uTeal;
		}
		void main() {
			vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
			vec3 target=vec3(2.0,0.0,0.0);
			vec3 orbit=vec3(cos(uPitch)*cos(uYaw),sin(uPitch),cos(uPitch)*sin(uYaw));
			vec3 ro=target+orbit*7.2;
			vec3 forward=normalize(target-ro);
			vec3 right=normalize(cross(forward,vec3(0.0,1.0,0.0)));
			vec3 up=cross(right,forward);
			vec3 rd=normalize(forward+0.78*uv.x*right+0.78*uv.y*up);
			float vignette=smoothstep(0.92,0.15,length(uv));
			vec3 color=mix(uGrid,uBackground,0.78+0.22*vignette);

			float t=traceSolid(ro,rd,uSlice);
			if(t<18.0) {
				vec3 p=ro+rd*t;
				vec3 n=normalAt(p,uSlice);
				float cap=1.0-smoothstep(0.012,0.055,abs(p.x-uSlice));
				float sectionLine=1.0-smoothstep(0.035,0.075,abs(fract(p.x*2.0)-0.5));
				vec3 base=mix(uBlue,uViolet,cap);
				base=mix(base,uTeal,0.12*sectionLine*(1.0-cap));
				color=shade(p,n,base,ro);
				float edge=pow(1.0-abs(dot(n,rd)),2.4);
				color=mix(color,uInk,0.22*edge);
			} else {
				float ghost=traceSolid(ro,rd,4.0);
				if(ghost<18.0) {
					vec3 p=ro+rd*ghost;
					vec3 n=normalAt(p,4.0);
					float silhouette=pow(1.0-abs(dot(n,rd)),2.0);
					color=mix(color,uBlue,0.045+0.19*silhouette);
				}
			}
			outColor=vec4(color,1.0);
		}
	`;

	function draw() {
		if (!renderer) return;
		const theme = getPlotTheme();
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(renderer?.uniform(name) ?? null, cssColorToRgb(value));
		renderer.draw((gl) => {
			gl.uniform1f(renderer?.uniform('uSlice') ?? null, x);
			gl.uniform1f(renderer?.uniform('uYaw') ?? null, yaw);
			gl.uniform1f(renderer?.uniform('uPitch') ?? null, pitch);
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uBlue', theme.blue);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uTeal', theme.teal);
		});
	}

	function redraw() {
		scheduler?.request();
	}

	function attachCanvas(node: HTMLCanvasElement) {
		const created = createFullscreenShader(node, fragmentShader, { pixelRatioCap: 2 });
		if (!created) return;
		renderer = created;
		scheduler = createRenderScheduler(node, draw);
		window.addEventListener(THEME_CHANGE_EVENT, redraw);
		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, redraw);
			scheduler?.destroy();
			created.destroy();
			if (renderer === created) renderer = undefined;
			scheduler = undefined;
		};
	}

	function startDrag(event: PointerEvent) {
		if (event.button !== 0) return;
		dragPointer = event.pointerId;
		dragX = event.clientX;
		dragY = event.clientY;
		dragging = true;
		(event.currentTarget as HTMLCanvasElement).setPointerCapture(event.pointerId);
	}

	function moveDrag(event: PointerEvent) {
		if (event.pointerId !== dragPointer) return;
		const dx = event.clientX - dragX;
		const dy = event.clientY - dragY;
		dragX = event.clientX;
		dragY = event.clientY;
		yaw -= dx * 0.008;
		pitch = Math.max(-0.2, Math.min(1.15, pitch + dy * 0.006));
		redraw();
	}

	function endDrag(event: PointerEvent) {
		if (event.pointerId !== dragPointer) return;
		dragPointer = -1;
		dragging = false;
	}
</script>

<div class="volume-lab">
	<DemoHeader title="Explore: one moving disk builds a volume" />
	<div class="construction">
		<section class="profile-panel" aria-label="The generating curve y equals square root of x">
			<header><span>1 · the blueprint</span><strong>y = ±√x</strong></header>
			<svg
				viewBox="0 0 {profileWidth} {profileHeight}"
				role="img"
				aria-label="Side profile of the solid"
			>
				<line class="axis" x1={plotLeft - 12} y1={plotMid} x2={plotRight + 10} y2={plotMid} />
				<path class="accumulated" d={accumulatedPath()} />
				<path class="curve upper" d={curvePath(1)} />
				<path class="curve lower" d={curvePath(-1)} />
				<line
					class="slice-diameter"
					x1={profileX(x)}
					y1={profileY(radius)}
					x2={profileX(x)}
					y2={profileY(-radius)}
				/>
				<line class="radius" x1={profileX(x)} y1={plotMid} x2={profileX(x)} y2={profileY(radius)} />
				<circle class="center" cx={profileX(x)} cy={plotMid} r="3.5" />
				<text class="curve-label" x="246" y="35">y = √x</text>
				<text class="radius-label" x={profileX(x) - 8} y={(plotMid + profileY(radius)) / 2}
					>r = √x</text
				>
				<text class="tick" x={plotLeft} y={plotMid + 20}>0</text>
				<text class="tick active" x={profileX(x)} y={plotMid + 20}>x</text>
				<text class="tick end" x={plotRight} y={plotMid + 20}>4</text>
			</svg>
			<p>Rotate this profile around the horizontal axis.</p>
		</section>

		<section class="solid-panel" aria-label="The solid generated by rotating the profile">
			<header><span>2 · the solid</span><strong>drag to rotate</strong></header>
			<div class:dragging class="canvas-wrap">
				<canvas
					{@attach attachCanvas}
					onpointerdown={startDrag}
					onpointermove={moveDrag}
					onpointerup={endDrag}
					onpointercancel={endDrag}
					aria-label="A directly rotatable three-dimensional solid clipped at x equals {x.toFixed(
						2
					)}"
				></canvas>
				<svg class="radius-overlay" viewBox="0 0 {overlayWidth} {overlayHeight}" aria-hidden="true">
					<line
						x1={projectedRadius.center.x}
						y1={projectedRadius.center.y}
						x2={projectedRadius.end.x}
						y2={projectedRadius.end.y}
					/>
					<circle cx={projectedRadius.center.x} cy={projectedRadius.center.y} r="7" />
					<text x={projectedRadius.end.x + 15} y={projectedRadius.end.y - 12}>r = √x</text>
				</svg>
				<div class="solid-key" aria-hidden="true">
					<span><i class="built"></i>volume built</span>
					<span><i class="disk"></i>moving disk</span>
				</div>
			</div>
			<p>The violet face is the same radius, swept into a disk.</p>
		</section>
	</div>

	<div class="single-control">
		<SliderField
			id="volume-slice-x"
			label="Move the disk through the solid"
			hint="Only the slice position is a slider; rotate the solid itself by dragging it"
			min={0.25}
			max={4}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={x}
			oninput={redraw}
		/>
	</div>
	<div class="readout" aria-live="polite">
		<span><small>position</small>x = {x.toFixed(2)}</span>
		<span><small>radius</small>√x = {radius.toFixed(2)}</span>
		<span><small>disk area</small>πx = {area.toFixed(2)}</span>
		<span><small>volume so far</small>πx²/2 = {volume.toFixed(2)}</span>
	</div>
	<EquationPanel title="Cross-section and accumulated volume">
		<Katex math={String.raw`A(x)=\pi(\sqrt{x})^2=\pi x\approx ${area.toFixed(2)}`} display />
		<Katex
			math={String.raw`V(x)=\int_0^x \pi t\,dt=\frac{\pi x^2}{2}\approx ${volume.toFixed(2)}`}
			display
		/>
	</EquationPanel>
</div>

<style>
	.volume-lab {
		width: 100%;
		box-sizing: border-box;
	}
	.construction {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 0.7rem;
	}
	.profile-panel,
	.solid-panel {
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 16px;
		background: var(--plot-background);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.72rem 0.8rem 0;
		color: var(--color-ink-faint);
		font: 750 0.61rem/1.2 var(--font-sans);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}
	header strong {
		color: var(--plot-violet);
		font-weight: 800;
	}
	.profile-panel svg {
		display: block;
		width: 100%;
		aspect-ratio: 360 / 260;
	}
	.axis {
		stroke: var(--plot-muted);
		stroke-width: 1.2;
	}
	.accumulated {
		fill: color-mix(in srgb, var(--plot-blue) 16%, transparent);
	}
	.curve {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.lower {
		opacity: 0.72;
	}
	.slice-diameter {
		stroke: color-mix(in srgb, var(--plot-violet) 45%, transparent);
		stroke-width: 1.4;
		stroke-dasharray: 3 4;
	}
	.radius {
		stroke: var(--plot-violet);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.center {
		fill: var(--plot-violet);
		stroke: var(--plot-background);
		stroke-width: 2;
	}
	.profile-panel text {
		font-family: var(--font-sans);
		paint-order: stroke;
		stroke: var(--plot-background);
		stroke-width: 4px;
		stroke-linejoin: round;
	}
	.curve-label {
		fill: var(--plot-blue);
		font-size: 13px;
		font-weight: 750;
	}
	.radius-label {
		fill: var(--plot-violet);
		font-size: 12px;
		font-weight: 800;
		text-anchor: end;
		dominant-baseline: middle;
	}
	.tick {
		fill: var(--plot-muted);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.tick.active {
		fill: var(--plot-violet);
	}
	.tick.end {
		text-anchor: end;
	}
	.profile-panel p,
	.solid-panel p {
		margin: -0.15rem 0.8rem 0.75rem;
		color: var(--color-ink-light);
		font: 650 0.67rem/1.35 var(--font-sans);
	}
	.canvas-wrap {
		position: relative;
		cursor: grab;
	}
	.canvas-wrap.dragging {
		cursor: grabbing;
	}
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 360 / 260;
		touch-action: none;
	}
	.radius-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.radius-overlay line {
		stroke: var(--plot-violet);
		stroke-width: 7;
		stroke-linecap: round;
	}
	.radius-overlay circle {
		fill: var(--plot-violet);
		stroke: var(--plot-background);
		stroke-width: 4;
	}
	.radius-overlay text {
		fill: var(--plot-violet);
		font: 800 24px/1 var(--font-sans);
		paint-order: stroke;
		stroke: var(--plot-background);
		stroke-width: 8px;
		stroke-linejoin: round;
	}
	.solid-key {
		position: absolute;
		inset: auto 0.65rem 0.45rem;
		display: flex;
		justify-content: center;
		gap: 0.8rem;
		color: var(--color-ink-faint);
		font: 700 0.55rem/1.2 var(--font-sans);
		pointer-events: none;
	}
	.solid-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
	.solid-key i {
		width: 0.7rem;
		height: 0.18rem;
		border-radius: 999px;
	}
	.solid-key .built {
		background: var(--plot-blue);
	}
	.solid-key .disk {
		background: var(--plot-violet);
	}
	.single-control {
		padding: 0.85rem 0.15rem 0.2rem;
	}
	.readout {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.65rem;
		margin: 0.5rem 0 1rem;
		padding: 0.72rem 0.9rem;
		border-left: 3px solid var(--plot-violet);
		background: color-mix(in srgb, var(--plot-violet) 6%, transparent);
		color: var(--color-ink);
		font: 750 0.76rem/1.2 var(--font-sans);
		font-variant-numeric: tabular-nums;
	}
	.readout span {
		display: grid;
		gap: 0.15rem;
	}
	.readout small {
		color: var(--color-ink-faint);
		font-size: 0.61rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}
	@media (max-width: 680px) {
		.construction {
			grid-template-columns: 1fr;
		}
		.profile-panel svg,
		canvas {
			aspect-ratio: 16 / 10;
		}
		.readout {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
