<script lang="ts">
	import { onMount } from 'svelte';
	import DemoHeader from './DemoHeader.svelte';
	import SliderField from './SliderField.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';
	import {
		createFullscreenShader,
		createRenderScheduler,
		cssColorToRgb,
		type FullscreenShader,
		type RenderScheduler
	} from '$lib/utils/webgl';

	let time = $state(0);
	let playing = $state(true);
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;

	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform float uTime;
		uniform vec3 uBackground;
		uniform vec3 uGrid;
		uniform vec3 uInk;
		uniform vec3 uBlue;
		uniform vec3 uViolet;
		uniform vec3 uRose;
		uniform vec3 uTeal;
		out vec4 outColor;

		float curveMask(float y,float curve,float width) {
			return 1.0-smoothstep(width,width+fwidth(y-curve)*1.5,abs(y-curve));
		}

		void main() {
			vec2 frag=gl_FragCoord.xy/uResolution;
			bool heatPanel=frag.x<0.495;
			bool wavePanel=frag.x>0.505;
			if(!heatPanel&&!wavePanel) {
				outColor=vec4(mix(uGrid,uBackground,0.45),1.0);
				return;
			}
			float localX=heatPanel?frag.x/0.495:(frag.x-0.505)/0.495;
			vec2 p=vec2(localX,frag.y);
			vec3 color=mix(uGrid,uBackground,0.92);
			float edgeFade=smoothstep(0.0,0.08,p.x)*smoothstep(1.0,0.92,p.x);
			float axis=1.0-smoothstep(0.002,0.006,abs(p.y-0.5));
			color=mix(color,uGrid,0.65*axis);

			float low=0.27*sin(3.14159265*p.x);
			float high=0.12*sin(9.42477796*p.x);
			float value;
			if(heatPanel) {
				value=low*exp(-0.48*uTime)+high*exp(-4.32*uTime);
				float band=exp(-38.0*pow(p.y-(0.5+value),2.0))*edgeFade;
				color=mix(color,uRose,0.10*band);
				float fill=step(0.5,p.y)*step(p.y,0.5+value)+step(0.5+value,p.y)*step(p.y,0.5);
				color=mix(color,uRose,0.075*fill*edgeFade);
			} else {
				value=low*cos(1.55*uTime)+high*cos(4.65*uTime);
				float echo=curveMask(p.y,0.5+low*cos(1.55*uTime),0.0035)*edgeFade;
				color=mix(color,uViolet,0.22*echo);
			}
			float curve=curveMask(p.y,0.5+value,0.0055)*edgeFade;
			float glow=curveMask(p.y,0.5+value,0.022)*edgeFade;
			vec3 activeColor=heatPanel?uRose:uBlue;
			color=mix(color,activeColor,0.18*glow);
			color=mix(color,activeColor,curve);
			float endpoint=(1.0-smoothstep(0.012,0.026,min(p.x,1.0-p.x)))*(1.0-smoothstep(0.012,0.025,abs(p.y-0.5)));
			color=mix(color,uInk,endpoint);
			outColor=vec4(color,1.0);
		}
	`;

	function draw() {
		if (!renderer) return;
		const theme = getPlotTheme();
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(renderer?.uniform(name) ?? null, cssColorToRgb(value));
		renderer.draw((gl) => {
			gl.uniform1f(renderer?.uniform('uTime') ?? null, time);
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uBlue', theme.blue);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uRose', theme.rose);
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

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			playing = false;
			return;
		}
		let frame = 0;
		let previous = performance.now();
		const animate = (now: number) => {
			const elapsed = Math.min(40, now - previous);
			previous = now;
			if (playing) {
				time = (time + elapsed * 0.00034) % 4;
				redraw();
			}
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="pde-lab">
	<DemoHeader title="Explore: heat forgets while waves remember" />
	<div class="stage">
		<div class="panel-headings" aria-hidden="true">
			<span><b>Heat equation</b><small>high frequencies fade first</small></span>
			<span><b>Wave equation</b><small>modes keep oscillating</small></span>
		</div>
		<canvas
			id="heat-wave-shader"
			{@attach attachCanvas}
			aria-label="The same two-mode initial shape evolving under the heat equation and the wave equation"
		></canvas>
	</div>
	<div class="controls">
		<SliderField
			label="Time t"
			min={0}
			max={4}
			step={0.01}
			decimals={2}
			tone="blue"
			bind:value={time}
			oninput={redraw}
		/>
		<button type="button" class="transport" onclick={() => (playing = !playing)}>
			{playing ? 'Pause' : 'Play'}
		</button>
	</div>
	<p class="reading">
		Both begin with the same two sine modes. Diffusion multiplies the third harmonic by
		<strong>e<sup>−9kt</sup></strong>; the wave equation only changes its phase.
	</p>
</div>

<style>
	.pde-lab {
		width: 100%;
	}
	.stage {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 0.85rem;
		background: var(--plot-background);
	}
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 2.2 / 1;
	}
	.panel-headings {
		position: absolute;
		inset: 0.7rem 0.8rem auto;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		text-align: center;
		pointer-events: none;
	}
	.panel-headings span {
		display: grid;
		gap: 0.12rem;
	}
	.panel-headings b {
		color: var(--color-ink);
		font: 750 0.69rem/1.2 var(--font-sans);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.panel-headings small {
		color: var(--color-ink-faint);
		font: 650 0.6rem/1.2 var(--font-sans);
	}
	.controls {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 0.75rem;
		padding: 0.7rem 0.1rem 0;
	}
	.transport {
		min-width: 4.5rem;
		margin-bottom: 0.34rem;
		padding: 0.52rem 0.8rem;
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: transparent;
		color: var(--color-ink);
		font: 750 0.72rem/1 var(--font-sans);
		cursor: pointer;
	}
	.reading {
		margin: 0.55rem 0 0;
		color: var(--color-ink-light);
		font-size: 0.78rem;
		line-height: 1.5;
	}
	@media (max-width: 560px) {
		canvas {
			aspect-ratio: 1.35 / 1;
		}
		.controls {
			grid-template-columns: 1fr;
		}
		.transport {
			justify-self: start;
		}
	}
</style>
