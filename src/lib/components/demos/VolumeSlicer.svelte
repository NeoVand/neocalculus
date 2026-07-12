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
	let viewAngle = $state(42);
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;

	const radius = $derived(Math.sqrt(x));
	const area = $derived(Math.PI * x);
	const volume = $derived((Math.PI * x * x) / 2);

	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform float uSlice;
		uniform float uYaw;
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
		vec3 shade(vec3 p,vec3 n,vec3 base) {
			vec3 light=normalize(vec3(-0.6,0.85,0.45));
			float diffuse=0.34+0.66*max(dot(n,light),0.0);
			float rim=pow(1.0-max(dot(n,normalize(vec3(0.3,0.2,1.0))),0.0),2.0);
			return base*diffuse+0.16*rim*uTeal;
		}
		void main() {
			vec2 uv=(gl_FragCoord.xy-0.5*uResolution)/uResolution.y;
			vec3 target=vec3(2.0,0.0,0.0);
			vec3 ro=target+vec3(cos(uYaw)*6.4,3.25,sin(uYaw)*6.4);
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
				base=mix(base,uTeal,0.13*sectionLine*(1.0-cap));
				color=shade(p,n,base);
				float edge=pow(1.0-abs(dot(n,rd)),2.4);
				color=mix(color,uInk,0.22*edge);
			} else {
				float ghost=traceSolid(ro,rd,4.0);
				if(ghost<18.0) {
					vec3 p=ro+rd*ghost;
					vec3 n=normalAt(p,4.0);
					float silhouette=pow(1.0-abs(dot(n,rd)),2.0);
					color=mix(color,uBlue,0.055+0.22*silhouette);
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
			gl.uniform1f(renderer?.uniform('uYaw') ?? null, (viewAngle * Math.PI) / 180);
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
</script>

<div class="volume-lab">
	<DemoHeader title="Explore: one moving disk builds a volume" />
	<div class="stage">
		<canvas
			{@attach attachCanvas}
			aria-label="A rotatable three-dimensional solid of revolution clipped at x equals {x.toFixed(
				2
			)}"
		></canvas>
		<div class="stage-label">
			<span>accumulated solid · 0 ≤ t ≤ {x.toFixed(2)}</span><strong>disk area · πx</strong>
		</div>
		<div class="stage-key">
			<span><i class="solid-key"></i>accumulated volume</span>
			<span><i class="disk-key"></i>moving disk</span>
			<span><i class="ghost-key"></i>remaining solid</span>
		</div>
	</div>
	<div class="controls">
		<SliderField
			id="volume-slice-x"
			label="Slice position x"
			hint="Move the circular cross-section through y = √x"
			min={0.25}
			max={4}
			step={0.01}
			decimals={2}
			tone="violet"
			bind:value={x}
			oninput={redraw}
		/>
		<SliderField
			id="volume-view-angle"
			label="View angle"
			min={20}
			max={160}
			step={1}
			decimals={0}
			tone="blue"
			bind:value={viewAngle}
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
		aspect-ratio: 16/9;
	}
	.stage-label {
		position: absolute;
		inset: 0.8rem 0.9rem auto;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		color: var(--color-ink-light);
		font: 750 0.67rem/1.2 var(--font-sans);
		letter-spacing: 0.07em;
		text-transform: uppercase;
		pointer-events: none;
	}
	.stage-label strong {
		color: var(--plot-violet);
	}
	.stage-key {
		position: absolute;
		inset: auto 0.9rem 0.75rem;
		display: flex;
		justify-content: center;
		gap: 0.9rem;
		color: var(--color-ink-light);
		font: 700 0.61rem/1.2 var(--font-sans);
		pointer-events: none;
	}
	.stage-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.stage-key i {
		width: 0.75rem;
		height: 0.18rem;
		border-radius: 999px;
	}
	.solid-key {
		background: var(--plot-blue);
	}
	.disk-key {
		background: var(--plot-violet);
	}
	.ghost-key {
		border: 1px solid color-mix(in srgb, var(--plot-blue) 45%, transparent);
	}
	.controls {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		padding: 0.85rem 0.15rem 0.25rem;
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
	@media (max-width: 620px) {
		.stage-label {
			font-size: 0.57rem;
		}
		.stage-key {
			gap: 0.55rem;
			font-size: 0.55rem;
		}
		.controls {
			grid-template-columns: 1fr;
			gap: 0.55rem;
		}
		.readout {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
