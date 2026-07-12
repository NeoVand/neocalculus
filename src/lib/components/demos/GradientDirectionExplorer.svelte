<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';
	import {
		createFullscreenShader,
		createRenderScheduler,
		cssColorToRgb,
		type FullscreenShader,
		type RenderScheduler
	} from '$lib/utils/webgl';

	const width = 500;
	const height = 500;
	const margin = { top: 24, bottom: 52 };
	const plotSize = height - margin.top - margin.bottom;
	const plotLeft = (width - plotSize) / 2;
	const plotWidth = plotSize;
	const plotHeight = plotSize;
	const domainMin = -3;
	const domainMax = 3;

	let x0 = $state(1.1);
	let y0 = $state(0.8);
	let angle = $state(30);
	let viewYaw = $state(0.82);
	let viewPitch = $state(0.48);
	let rotating = $state(false);
	let lastPointerX = 0;
	let lastPointerY = 0;
	let surfaceRenderer: FullscreenShader | undefined;
	let surfaceScheduler: RenderScheduler | undefined;

	const radians = $derived((angle * Math.PI) / 180);
	const vx = $derived(Math.cos(radians));
	const vy = $derived(Math.sin(radians));
	const gradX = $derived(2 * x0);
	const gradY = $derived(2 * y0);
	const gradMagnitude = $derived(Math.hypot(gradX, gradY));
	const gradUnitX = $derived(gradMagnitude === 0 ? 0 : gradX / gradMagnitude);
	const gradUnitY = $derived(gradMagnitude === 0 ? 0 : gradY / gradMagnitude);
	const directionalDerivative = $derived(gradX * vx + gradY * vy);
	const alignment = $derived(gradMagnitude === 0 ? 0 : directionalDerivative / gradMagnitude);
	const alignmentAngle = $derived(
		(Math.acos(Math.min(1, Math.max(-1, alignment))) * 180) / Math.PI
	);
	const signedAlignmentAngle = $derived(
		(gradUnitX * vy - gradUnitY * vx < 0 ? -1 : 1) * alignmentAngle
	);
	const alignmentRay = $derived({
		x: 42 + 30 * Math.cos((signedAlignmentAngle * Math.PI) / 180),
		y: 42 - 30 * Math.sin((signedAlignmentAngle * Math.PI) / 180)
	});
	const selectedRadius = $derived(Math.hypot(x0, y0));
	const behavior = $derived(
		directionalDerivative > 0.02
			? 'increases'
			: directionalDerivative < -0.02
				? 'decreases'
				: 'is nearly unchanged'
	);

	const sx = (x: number) => plotLeft + ((x - domainMin) / (domainMax - domainMin)) * plotWidth;
	const sy = (y: number) =>
		margin.top + plotHeight - ((y - domainMin) / (domainMax - domainMin)) * plotHeight;
	const scaleX = plotWidth / (domainMax - domainMin);
	const scaleY = plotHeight / (domainMax - domainMin);

	const surfaceFragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform vec2 uPoint;
		uniform vec2 uDirection;
		uniform vec2 uView;
		uniform vec3 uBackground;
		uniform vec3 uGrid;
		uniform vec3 uInk;
		uniform vec3 uBlue;
		uniform vec3 uViolet;
		uniform vec3 uRose;
		uniform vec3 uTeal;
		out vec4 outColor;

		const float HEIGHT_SCALE=0.58;

		float bowlHit(vec3 ro,vec3 rd) {
			float a=HEIGHT_SCALE*dot(rd.xy,rd.xy);
			float b=2.0*HEIGHT_SCALE*dot(ro.xy,rd.xy)-rd.z;
			float c=HEIGHT_SCALE*dot(ro.xy,ro.xy)-ro.z;
			float discriminant=b*b-4.0*a*c;
			if(discriminant<0.0) return 1e4;
			float root=sqrt(discriminant);
			float t1=(-b-root)/(2.0*a);
			float t2=(-b+root)/(2.0*a);
			float t=t1>0.0?t1:t2;
			if(t<=0.0||length((ro+rd*t).xy)>2.45) return 1e4;
			return t;
		}

		float lineMask(float distance,float width) {
			return 1.0-smoothstep(width,width+fwidth(distance)*1.5,distance);
		}

		void main() {
			vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
			float yaw=uView.x;
			float pitch=uView.y;
			vec3 target=vec3(0.0,0.0,1.35);
			vec3 orbit=vec3(cos(pitch)*cos(yaw),cos(pitch)*sin(yaw),sin(pitch));
			vec3 ro=target+orbit*7.2;
			vec3 forward=normalize(target-ro);
			vec3 right=normalize(cross(forward,vec3(0.0,0.0,1.0)));
			vec3 up=cross(right,forward);
			vec3 rd=normalize(forward+0.8*uv.x*right+0.8*uv.y*up);
			vec3 color=mix(uGrid,uBackground,0.86+0.12*smoothstep(0.8,0.15,length(uv)));
			float nearest=1e4;

			float surfaceT=bowlHit(ro,rd);
			if(surfaceT<1e3) {
				nearest=surfaceT;
				vec3 p=ro+rd*surfaceT;
				vec3 normal=normalize(vec3(-2.0*HEIGHT_SCALE*p.x,-2.0*HEIGHT_SCALE*p.y,1.0));
				vec3 light=normalize(vec3(-0.5,0.7,0.9));
				float diffuse=0.38+0.62*max(dot(normal,light),0.0);
				float rim=pow(1.0-max(dot(normal,normalize(ro-p)),0.0),2.0);
				color=uTeal*(0.12+0.15*diffuse)+uBackground*(0.67-0.12*diffuse)+uBlue*0.08*rim;
				vec2 cells=abs(fract((p.xy+0.25)/0.5)-0.5);
				float gridMask=smoothstep(0.47,0.49,max(cells.x,cells.y));
				float contour=lineMask(abs(fract(p.z/0.46)-0.5),0.035);
				color=mix(color,uGrid,0.52*gridMask);
				color=mix(color,uBlue,0.22*contour);

				vec2 delta=p.xy-uPoint;
				float along=dot(delta,uDirection);
				float across=abs(dot(delta,vec2(-uDirection.y,uDirection.x)));
				float crossSection=lineMask(across,0.025)*step(abs(along),1.1);
				color=mix(color,uBlue,crossSection);
				float pointMask=1.0-smoothstep(0.045,0.075,length(delta));
				color=mix(color,uInk,pointMask);
			}

			vec3 basePoint=vec3(uPoint,HEIGHT_SCALE*dot(uPoint,uPoint));
			vec2 gradient=2.0*HEIGHT_SCALE*uPoint;
			vec3 tangentNormal=normalize(vec3(-gradient,1.0));
			float tangentDenom=dot(tangentNormal,rd);
			if(abs(tangentDenom)>0.0001) {
				float tangentT=dot(tangentNormal,basePoint-ro)/tangentDenom;
				vec3 q=ro+rd*tangentT;
				vec2 local=q.xy-uPoint;
				if(tangentT>0.0&&tangentT<nearest&&max(abs(local.x),abs(local.y))<0.62) {
					float tangentAlong=dot(local,uDirection);
					float tangentAcross=abs(dot(local,vec2(-uDirection.y,uDirection.x)));
					float tangentLine=lineMask(tangentAcross,0.025)*step(abs(tangentAlong),0.78);
					color=mix(color,uViolet,0.34);
					color=mix(color,uRose,tangentLine);
					nearest=tangentT;
				}
			}

			vec2 sliceNormal=vec2(-uDirection.y,uDirection.x);
			float sliceDenom=dot(sliceNormal,rd.xy);
			if(abs(sliceDenom)>0.0001) {
				float sliceT=dot(sliceNormal,uPoint-ro.xy)/sliceDenom;
				vec3 q=ro+rd*sliceT;
				float along=dot(q.xy-uPoint,uDirection);
				float bowlHeight=HEIGHT_SCALE*dot(q.xy,q.xy);
				if(sliceT>0.0&&sliceT<nearest&&abs(along)<1.1&&q.z>bowlHeight-0.48&&q.z<bowlHeight+0.62) {
					color=mix(color,uBlue,0.18);
				}
			}

			outColor=vec4(color,1.0);
		}
	`;

	function drawSurface() {
		if (!surfaceRenderer) return;
		const theme = getPlotTheme();
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(surfaceRenderer?.uniform(name) ?? null, cssColorToRgb(value));
		surfaceRenderer.draw((gl) => {
			gl.uniform2f(surfaceRenderer?.uniform('uPoint') ?? null, x0, y0);
			gl.uniform2f(surfaceRenderer?.uniform('uDirection') ?? null, vx, vy);
			gl.uniform2f(surfaceRenderer?.uniform('uView') ?? null, viewYaw, viewPitch);
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uBlue', theme.blue);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uRose', theme.rose);
			color(gl, 'uTeal', theme.teal);
		});
	}

	function redrawSurface() {
		surfaceScheduler?.request();
	}

	function attachSurface(node: HTMLCanvasElement) {
		const created = createFullscreenShader(node, surfaceFragmentShader, { pixelRatioCap: 1.8 });
		if (!created) return;
		surfaceRenderer = created;
		surfaceScheduler = createRenderScheduler(node, drawSurface);
		window.addEventListener(THEME_CHANGE_EVENT, redrawSurface);
		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, redrawSurface);
			surfaceScheduler?.destroy();
			created.destroy();
			if (surfaceRenderer === created) surfaceRenderer = undefined;
			surfaceScheduler = undefined;
		};
	}

	function beginRotation(event: PointerEvent) {
		rotating = true;
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
		redrawSurface();
		(event.currentTarget as HTMLButtonElement).setPointerCapture(event.pointerId);
	}

	function rotateView(event: PointerEvent) {
		if (!rotating) return;
		viewYaw -= (event.clientX - lastPointerX) * 0.008;
		viewPitch = Math.min(1.15, Math.max(0.12, viewPitch + (event.clientY - lastPointerY) * 0.006));
		lastPointerX = event.clientX;
		lastPointerY = event.clientY;
	}

	function endRotation() {
		rotating = false;
	}

	function rotateWithKeyboard(event: KeyboardEvent) {
		if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
		event.preventDefault();
		if (event.key === 'ArrowLeft') viewYaw -= 0.08;
		if (event.key === 'ArrowRight') viewYaw += 0.08;
		if (event.key === 'ArrowUp') viewPitch = Math.min(1.15, viewPitch + 0.05);
		if (event.key === 'ArrowDown') viewPitch = Math.max(0.12, viewPitch - 0.05);
		redrawSurface();
	}
</script>

<div class="gradient-explorer">
	<DemoHeader title="Explore direction and gradient" />

	<div class="demo-layout">
		<DemoCard class="matched-panel" title="Choose a point and direction">
			<SliderField
				label="Point coordinate x₀"
				min={-1.1}
				max={1.1}
				step={0.1}
				decimals={1}
				bind:value={x0}
				tone="violet"
				oninput={redrawSurface}
			/>
			<SliderField
				label="Point coordinate y₀"
				min={-1.1}
				max={1.1}
				step={0.1}
				decimals={1}
				bind:value={y0}
				tone="teal"
				oninput={redrawSurface}
			/>
			<SliderField
				label="Direction angle θ"
				min={-180}
				max={180}
				step={5}
				decimals={0}
				bind:value={angle}
				hint="Rotate the blue unit vector while the point stays fixed."
				tone="blue"
				oninput={redrawSurface}
			/>
		</DemoCard>

		<EquationPanel class="matched-panel compact-equations" title="Current directional rate">
			<Katex
				math={String.raw`\begin{aligned}\nabla f&=(${gradX.toFixed(2)},${gradY.toFixed(2)})\\\mathbf v&=(${vx.toFixed(2)},${vy.toFixed(2)})\\D_{\mathbf v}f&=\nabla f\cdot\mathbf v=${directionalDerivative.toFixed(3)}\end{aligned}`}
				display
			/>
			<p class="reading">
				Moving in the blue direction, <Katex math="f" /> <strong>{behavior}</strong> at the selected point.
			</p>
		</EquationPanel>
	</div>

	<div class="legend" aria-label="Plot legend">
		<span><i class="swatch contour"></i>level curves of <Katex math={String.raw`f=x^2+y^2`} /></span
		>
		<span><i class="swatch gradient"></i>gradient</span>
		<span><i class="swatch direction"></i>chosen direction</span>
	</div>
	<div class="alignment-readout" aria-live="polite">
		<svg class="angle-glyph" viewBox="0 0 84 58" aria-hidden="true">
			<path
				class="angle-arc"
				d={`M 61 42 A 19 19 0 0 ${Math.abs(signedAlignmentAngle) > 180 ? 1 : 0} ${42 + 19 * Math.cos((signedAlignmentAngle * Math.PI) / 180)} ${42 - 19 * Math.sin((signedAlignmentAngle * Math.PI) / 180)}`}
			/>
			<line class="gradient-ray" x1="42" y1="42" x2="74" y2="42" />
			<line class="direction-ray" x1="42" y1="42" x2={alignmentRay.x} y2={alignmentRay.y} />
			<circle cx="42" cy="42" r="2.5" />
		</svg>
		<div>
			<span>Angle from the gradient</span>
			<strong>φ = {alignmentAngle.toFixed(1)}° · cos φ = {alignment.toFixed(3)}</strong>
		</div>
	</div>

	<div class="plots-grid">
		<section class="plot-panel" aria-labelledby="contour-title">
			<div class="plot-title" id="contour-title">Contour map · view from above</div>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label="Circular level curves with the gradient and a chosen direction at a selected point"
			>
				<defs>
					<clipPath id="gradient-direction-clip">
						<rect x={plotLeft} y={margin.top} width={plotWidth} height={plotHeight} />
					</clipPath>
					<marker
						id="gradient-arrow"
						markerWidth="8"
						markerHeight="8"
						refX="7"
						refY="4"
						orient="auto"
					>
						<path d="M0,0 L8,4 L0,8 Z" fill="var(--color-d)" />
					</marker>
					<marker
						id="direction-arrow"
						markerWidth="8"
						markerHeight="8"
						refX="7"
						refY="4"
						orient="auto"
					>
						<path d="M0,0 L8,4 L0,8 Z" fill="var(--plot-curve)" />
					</marker>
				</defs>

				{#each [-3, -2, -1, 0, 1, 2, 3] as value (value)}
					<line
						class="grid"
						x1={sx(value)}
						y1={margin.top}
						x2={sx(value)}
						y2={margin.top + plotHeight}
					/>
					<line
						class="grid"
						x1={plotLeft}
						y1={sy(value)}
						x2={plotLeft + plotWidth}
						y2={sy(value)}
					/>
					<text class="tick" x={sx(value)} y={height - 21} text-anchor="middle">{value}</text>
					{#if value !== 0}
						<text class="tick" x={plotLeft - 12} y={sy(value) + 4} text-anchor="end">{value}</text>
					{/if}
				{/each}

				<line class="axis" x1={plotLeft} y1={sy(0)} x2={plotLeft + plotWidth} y2={sy(0)} />
				<line class="axis" x1={sx(0)} y1={margin.top} x2={sx(0)} y2={margin.top + plotHeight} />
				<text class="axis-label" x={plotLeft + plotWidth + 16} y={sy(0) + 5}>x</text>
				<text class="axis-label" x={plotLeft - 4} y={15}>y</text>

				<g clip-path="url(#gradient-direction-clip)">
					{#each [0.75, 1.5, 2.25] as radius (radius)}
						<ellipse
							class="contour-line"
							cx={sx(0)}
							cy={sy(0)}
							rx={radius * scaleX}
							ry={radius * scaleY}
						/>
					{/each}
					<ellipse
						class="selected-contour"
						cx={sx(0)}
						cy={sy(0)}
						rx={selectedRadius * scaleX}
						ry={selectedRadius * scaleY}
					/>

					<line
						class="gradient-vector"
						x1={sx(x0)}
						y1={sy(y0)}
						x2={sx(x0 + 1.15 * gradUnitX)}
						y2={sy(y0 + 1.15 * gradUnitY)}
						marker-end="url(#gradient-arrow)"
					/>
					<line
						class="direction-vector"
						x1={sx(x0)}
						y1={sy(y0)}
						x2={sx(x0 + 1.15 * vx)}
						y2={sy(y0 + 1.15 * vy)}
						marker-end="url(#direction-arrow)"
					/>
					<circle class="point" cx={sx(x0)} cy={sy(y0)} r="5" />
				</g>
			</svg>
		</section>

		<section class="plot-panel surface-panel" aria-labelledby="surface-title">
			<div class="plot-title" id="surface-title">Surface · drag to rotate</div>
			<button
				type="button"
				class:rotating
				class="surface-viewport"
				aria-label="Rotate the three-dimensional paraboloid. Drag, or use the arrow keys."
				onpointerdown={beginRotation}
				onpointermove={rotateView}
				onpointerup={endRotation}
				onpointercancel={endRotation}
				onkeydown={rotateWithKeyboard}
			>
				<canvas
					class="surface-canvas"
					{@attach attachSurface}
					aria-label="A GPU-rendered paraboloid with a tangent plane, a vertical directional slice, and their tangent line"
				></canvas>
			</button>
			<div class="surface-key">
				<span><i class="patch-key"></i>tangent plane</span>
				<span><i class="slice-key"></i>vertical slice</span>
				<span><i class="curve-key"></i>cross-section</span>
			</div>
		</section>
	</div>
</div>

<style>
	.gradient-explorer {
		font-family: var(--font-sans);
	}

	.demo-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 1rem;
		margin-bottom: 0.8rem;
	}

	.demo-layout :global(.matched-panel) {
		height: 100%;
		box-sizing: border-box;
		margin-top: 0;
	}

	.demo-layout :global(.compact-equations .katex-display) {
		margin: 0.3rem 0;
		font-size: 0.93em;
	}

	.reading {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--color-ink-light);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem 1.2rem;
		margin: 0.35rem 0 0.8rem;
		font-size: 0.84rem;
		color: var(--color-ink-light);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		display: inline-block;
		width: 1.4rem;
		height: 0;
		border-top: 3px solid;
	}

	.swatch.contour {
		border-color: var(--plot-muted);
	}

	.swatch.gradient {
		border-color: var(--color-d);
	}

	.swatch.direction {
		border-color: var(--plot-curve);
	}

	.alignment-readout {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin: -0.2rem 0 0.8rem;
		color: var(--color-ink-light);
	}

	.alignment-readout > div {
		display: grid;
		gap: 0.08rem;
		font-size: 0.72rem;
	}

	.alignment-readout strong {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	.angle-glyph {
		width: 3.5rem;
		height: 2.45rem;
		flex: 0 0 auto;
		overflow: visible;
	}

	.angle-glyph circle {
		fill: var(--color-ink);
	}

	.angle-arc {
		fill: none;
		stroke: var(--plot-axis);
		stroke-width: 1.5;
	}

	.gradient-ray,
	.direction-ray {
		stroke-width: 3;
		stroke-linecap: round;
	}

	.gradient-ray {
		stroke: var(--plot-tangent);
	}

	.direction-ray {
		stroke: var(--plot-curve);
	}

	.plots-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.plot-panel {
		padding: 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--color-surface);
	}

	.surface-viewport {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: grab;
		touch-action: none;
	}

	.surface-viewport.rotating {
		cursor: grabbing;
	}

	.surface-viewport:focus-visible {
		outline: 2px solid var(--color-d);
		outline-offset: 2px;
	}

	.plot-title {
		margin: 0.1rem 0 0.35rem;
		font-size: 0.73rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-align: center;
		text-transform: uppercase;
		color: var(--color-ink-light);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.grid {
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.axis {
		stroke: var(--color-ink-faint);
		stroke-width: 1.4;
	}

	.tick,
	.axis-label {
		fill: var(--color-ink-faint);
		font-family: var(--font-sans);
		font-size: 13px;
	}

	.axis-label {
		font-size: 15px;
		font-style: italic;
	}

	.contour-line {
		fill: none;
		stroke: var(--plot-grid);
		stroke-width: 1.4;
	}

	.selected-contour {
		fill: none;
		stroke: var(--plot-curve);
		stroke-width: 3;
	}

	.gradient-vector,
	.direction-vector {
		stroke-width: 3.5;
		stroke-linecap: round;
	}

	.gradient-vector {
		stroke: var(--color-d);
	}

	.direction-vector {
		stroke: var(--plot-curve);
	}

	.point {
		fill: var(--color-ink);
		stroke: var(--plot-outline);
		stroke-width: 2;
	}

	.surface-canvas {
		display: block;
		width: 100%;
		aspect-ratio: 460 / 350;
		border-radius: 0.45rem;
	}

	.surface-key {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem 0.75rem;
		margin: 0.15rem 0 0.1rem;
		font-size: 0.7rem;
		color: var(--color-ink-light);
	}

	.surface-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}

	.surface-key i {
		display: inline-block;
		width: 1rem;
		height: 0.45rem;
	}

	.patch-key {
		background: color-mix(in srgb, var(--plot-tangent) 22%, transparent);
		border: 1px solid var(--color-d);
	}

	.slice-key {
		background: color-mix(in srgb, var(--plot-curve) 10%, transparent);
		border: 1px solid var(--plot-curve);
	}

	.curve-key {
		border-top: 3px solid var(--plot-curve);
	}

	@media (max-width: 700px) {
		.demo-layout {
			grid-template-columns: 1fr;
		}

		.plots-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
