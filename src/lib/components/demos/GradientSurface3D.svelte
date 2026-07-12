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
		x: number;
		y: number;
		directionAngle: number;
	}

	let { x, y, directionAngle }: Props = $props();
	let yaw = $state(0.82);
	let pitch = $state(0.48);
	let dragging = $state(false);
	let activePointer: number | null = null;
	let previousX = 0;
	let previousY = 0;
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;

	const fragmentShader = `#version 300 es
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
			vec3 target=vec3(0.0,0.0,1.35);
			vec3 orbit=vec3(cos(uView.y)*cos(uView.x),cos(uView.y)*sin(uView.x),sin(uView.y));
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
				vec3 viewDirection=normalize(ro-p);
				if(dot(normal,viewDirection)<0.0) normal=-normal;
				vec3 light=normalize(vec3(-0.5,0.7,0.9));
				float lambert=max(dot(normal,light),0.0);
				float facing=clamp(dot(normal,viewDirection),0.0,1.0);
				float rim=pow(1.0-facing,1.65);
				vec3 surfaceTint=mix(uTeal,uBlue,0.12+0.16*lambert);
				float opacity=0.38+0.17*rim;
				color=mix(color,surfaceTint,opacity);
				color=mix(color,uInk,0.055*rim);
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

	function draw() {
		if (!renderer) return;
		const theme = getPlotTheme();
		const radians = (directionAngle * Math.PI) / 180;
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(renderer?.uniform(name) ?? null, cssColorToRgb(value));
		renderer.draw((gl) => {
			gl.uniform2f(renderer?.uniform('uPoint') ?? null, x, y);
			gl.uniform2f(renderer?.uniform('uDirection') ?? null, Math.cos(radians), Math.sin(radians));
			gl.uniform2f(renderer?.uniform('uView') ?? null, yaw, pitch);
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uBlue', theme.blue);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uRose', theme.rose);
			color(gl, 'uTeal', theme.teal);
		});
	}

	export function redraw() {
		scheduler?.request();
	}

	function attachCanvas(node: HTMLCanvasElement) {
		const created = createFullscreenShader(node, fragmentShader, { pixelRatioCap: 1.8 });
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

	function beginDrag(event: PointerEvent) {
		if (!event.isPrimary || event.button !== 0 || activePointer !== null) return;
		event.preventDefault();
		event.stopPropagation();
		activePointer = event.pointerId;
		previousX = event.clientX;
		previousY = event.clientY;
		dragging = true;
		(event.currentTarget as HTMLCanvasElement).setPointerCapture(event.pointerId);
	}

	function continueDrag(event: PointerEvent) {
		if (event.pointerId !== activePointer) return;
		event.preventDefault();
		event.stopPropagation();
		const deltaX = event.clientX - previousX;
		const deltaY = event.clientY - previousY;
		previousX = event.clientX;
		previousY = event.clientY;
		if (deltaX === 0 && deltaY === 0) return;
		yaw -= deltaX * 0.008;
		pitch = Math.max(0.12, Math.min(1.15, pitch + deltaY * 0.006));
		redraw();
	}

	function finishDrag(event: PointerEvent) {
		if (event.pointerId !== activePointer) return;
		event.preventDefault();
		event.stopPropagation();
		const node = event.currentTarget as HTMLCanvasElement;
		if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
		activePointer = null;
		dragging = false;
	}

	function loseCapture() {
		activePointer = null;
		dragging = false;
	}
</script>

<canvas
	id="gradient-surface-3d"
	class:dragging
	{@attach attachCanvas}
	onpointerdown={beginDrag}
	onpointermove={continueDrag}
	onpointerup={finishDrag}
	onpointercancel={finishDrag}
	onlostpointercapture={loseCapture}
	data-yaw={yaw.toFixed(4)}
	data-pitch={pitch.toFixed(4)}
	aria-label="A directly rotatable three-dimensional paraboloid with a tangent plane, vertical slice, and tangent line"
></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
		aspect-ratio: 460 / 350;
		border-radius: 0.45rem;
		cursor: grab;
		touch-action: none;
		user-select: none;
		-webkit-user-select: none;
	}

	canvas.dragging {
		cursor: grabbing;
	}
</style>
