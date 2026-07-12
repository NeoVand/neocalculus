<script lang="ts">
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';
	import {
		createFullscreenShader,
		createRenderScheduler,
		cssColorToRgb,
		type FullscreenShader,
		type RenderScheduler
	} from '$lib/utils/webgl';

	interface Props {
		u: number;
		v: number;
		radius: number;
	}

	let { u, v, radius }: Props = $props();
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;

	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform vec2 uBase;
		uniform float uRadius;
		uniform float uOutputRange;
		uniform vec3 uBackground;
		uniform vec3 uGrid;
		uniform vec3 uInk;
		uniform vec3 uBlue;
		uniform vec3 uViolet;
		uniform vec3 uAmber;
		out vec4 outColor;

		float lineMask(float distance,float width) {
			return 1.0-smoothstep(width,width+fwidth(distance)*1.4,distance);
		}

		float segmentDistance(vec2 p,vec2 a,vec2 b) {
			vec2 pa=p-a;
			vec2 ba=b-a;
			float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
			return length(pa-ba*h);
		}

		vec2 complexSquare(vec2 z) {
			return vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y);
		}

		vec2 nearestSquareRoot(vec2 w,vec2 base) {
			float magnitude=length(w);
			vec2 root=vec2(
				sqrt(max(0.0,0.5*(magnitude+w.x))),
				sign(w.y)*sqrt(max(0.0,0.5*(magnitude-w.x)))
			);
			return distance(root,base)<=distance(-root,base)?root:-root;
		}

		void main() {
			vec2 frag=gl_FragCoord.xy/uResolution;
			bool left=frag.x<0.495;
			bool right=frag.x>0.505;
			vec3 color=uBackground;
			if(!left&&!right) {
				outColor=vec4(mix(uGrid,uBackground,0.45),1.0);
				return;
			}

			float panelCenter=left?0.2475:0.7525;
			float scale=min(uResolution.x*0.43,uResolution.y*0.82);
			vec2 panel=(gl_FragCoord.xy-vec2(panelCenter*uResolution.x,0.5*uResolution.y))/scale;
			color=mix(uGrid,uBackground,0.9+0.08*smoothstep(1.15,0.2,length(panel)));

			if(left) {
				vec2 delta=panel*uRadius*1.55;
				vec2 cell=abs(fract((delta/uRadius+0.25)*2.0)-0.5);
				float gridLine=smoothstep(0.46,0.49,max(cell.x,cell.y));
				color=mix(color,uGrid,0.55*gridLine);
				float square=max(abs(delta.x),abs(delta.y))-uRadius;
				float inside=1.0-smoothstep(-0.015,0.015,square);
				float boundary=lineMask(abs(square),0.012*uRadius);
				color=mix(color,uInk,0.075*inside);
				color=mix(color,uInk,boundary);
				float uRay=lineMask(segmentDistance(delta,vec2(0.0),vec2(uRadius,0.0)),0.018*uRadius);
				float vRay=lineMask(segmentDistance(delta,vec2(0.0),vec2(0.0,uRadius)),0.018*uRadius);
				color=mix(color,uBlue,uRay);
				color=mix(color,uAmber,vRay);
				color=mix(color,uInk,1.0-smoothstep(0.025*uRadius,0.05*uRadius,length(delta)));
			} else {
				vec2 baseImage=complexSquare(uBase);
				vec2 outputDelta=panel*uOutputRange;
				vec2 outputPoint=baseImage+outputDelta;
				vec2 sourceDelta=nearestSquareRoot(outputPoint,uBase)-uBase;
				float actual=max(abs(sourceDelta.x),abs(sourceDelta.y))-uRadius;

				float determinant=4.0*dot(uBase,uBase);
				vec2 linearDelta=vec2(1e3);
				if(determinant>0.0001) {
					linearDelta=vec2(
						(2.0*uBase.x*outputDelta.x+2.0*uBase.y*outputDelta.y)/determinant,
						(-2.0*uBase.y*outputDelta.x+2.0*uBase.x*outputDelta.y)/determinant
					);
				}
				float linear=max(abs(linearDelta.x),abs(linearDelta.y))-uRadius;
				float actualInside=1.0-smoothstep(-0.012,0.012,actual);
				float linearInside=1.0-smoothstep(-0.012,0.012,linear);
				float actualBoundary=lineMask(abs(actual),0.011*uRadius);
				float linearBoundary=lineMask(abs(linear),0.011*uRadius);

				vec2 warpedCell=abs(fract((sourceDelta/uRadius+0.25)*2.0)-0.5);
				float warpedGrid=smoothstep(0.465,0.49,max(warpedCell.x,warpedCell.y));
				color=mix(color,uGrid,0.45*warpedGrid);
				color=mix(color,uBlue,0.15*actualInside);
				color=mix(color,uViolet,0.13*linearInside);
				color=mix(color,uBlue,actualBoundary);
				color=mix(color,uViolet,linearBoundary);

				vec2 imageU=vec2(2.0*uBase.x,2.0*uBase.y)*uRadius;
				vec2 imageV=vec2(-2.0*uBase.y,2.0*uBase.x)*uRadius;
				float uRay=lineMask(segmentDistance(outputDelta,vec2(0.0),imageU),0.014*uOutputRange);
				float vRay=lineMask(segmentDistance(outputDelta,vec2(0.0),imageV),0.014*uOutputRange);
				color=mix(color,uBlue,uRay);
				color=mix(color,uAmber,vRay);
				color=mix(color,uInk,1.0-smoothstep(0.018*uOutputRange,0.036*uOutputRange,length(outputDelta)));
			}

			outColor=vec4(color,1.0);
		}
	`;

	function outputRange() {
		const magnitude = Math.hypot(u, v);
		return Math.max(0.22, 2 * magnitude * radius + 2 * radius * radius) * 1.28;
	}

	function draw() {
		if (!renderer) return;
		const theme = getPlotTheme();
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(renderer?.uniform(name) ?? null, cssColorToRgb(value));
		renderer.draw((gl) => {
			gl.uniform2f(renderer?.uniform('uBase') ?? null, u, v);
			gl.uniform1f(renderer?.uniform('uRadius') ?? null, radius);
			gl.uniform1f(renderer?.uniform('uOutputRange') ?? null, outputRange());
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uBlue', theme.blue);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uAmber', theme.amber);
		});
	}

	export function redraw() {
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

<div class="map-stage">
	<div class="panel-titles" aria-hidden="true">
		<span>input neighborhood</span><i>F(u,v)</i><span>output neighborhood</span>
	</div>
	<canvas
		id="jacobian-map-shader"
		{@attach attachCanvas}
		aria-label="A square neighborhood mapped by z squared, showing its curved image against the Jacobian parallelogram"
	></canvas>
	<div class="axis-labels" aria-hidden="true">
		<span>Δu, Δv</span><span>ΔP, ΔQ</span>
	</div>
</div>

<div class="legend" aria-label="Jacobian explorer legend">
	<span><i class="actual"></i>actual curved image</span>
	<span><i class="linear"></i>Jacobian parallelogram</span>
	<span><i class="u-direction"></i>first coordinate direction</span>
	<span><i class="v-direction"></i>second coordinate direction</span>
</div>

<style>
	.map-stage {
		position: relative;
		margin-top: 0.8rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--plot-background);
	}
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 2 / 1;
	}
	.panel-titles,
	.axis-labels {
		position: absolute;
		inset: 0.65rem 0.8rem auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 0.7rem;
		color: var(--color-ink-light);
		font: 700 0.62rem/1.2 var(--font-sans);
		letter-spacing: 0.07em;
		text-align: center;
		text-transform: uppercase;
		pointer-events: none;
	}
	.panel-titles i {
		color: var(--color-ink-faint);
		font-family: var(--font-serif);
		font-size: 0.72rem;
		letter-spacing: 0;
		text-transform: none;
	}
	.axis-labels {
		inset: auto 11% 0.55rem;
		grid-template-columns: 1fr 1fr;
		color: var(--color-ink-faint);
		font-size: 0.58rem;
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem 1rem;
		margin: 0.5rem 0 0.8rem;
		color: var(--color-ink-light);
		font-size: 0.75rem;
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}
	.legend i {
		display: inline-block;
		width: 1.15rem;
		height: 0.45rem;
	}
	.actual {
		background: color-mix(in srgb, var(--plot-blue) 16%, transparent);
		border: 2px solid var(--plot-blue);
	}
	.linear {
		background: color-mix(in srgb, var(--plot-violet) 16%, transparent);
		border: 2px solid var(--plot-violet);
	}
	.u-direction {
		border-top: 3px solid var(--plot-blue);
	}
	.v-direction {
		border-top: 3px solid var(--plot-amber);
	}
	@media (max-width: 560px) {
		canvas {
			aspect-ratio: 1.25 / 1;
		}
		.panel-titles {
			font-size: 0.52rem;
		}
	}
</style>
