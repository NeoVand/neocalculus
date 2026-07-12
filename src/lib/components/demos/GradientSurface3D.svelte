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
		const float BOWL_RADIUS=2.45;
		const float MISS=1e4;

		float validBowlRoot(vec3 ro,vec3 rd,float t) {
			if(t<=0.0) return MISS;
			vec3 hit=ro+rd*t;
			return length(hit.xy)<=BOWL_RADIUS?t:MISS;
		}

		float bowlHit(vec3 ro,vec3 rd) {
			float a=HEIGHT_SCALE*dot(rd.xy,rd.xy);
			float b=2.0*HEIGHT_SCALE*dot(ro.xy,rd.xy)-rd.z;
			float c=HEIGHT_SCALE*dot(ro.xy,ro.xy)-ro.z;
			if(abs(a)<0.00001) {
				if(abs(b)<0.00001) return MISS;
				return validBowlRoot(ro,rd,-c/b);
			}
			float discriminant=b*b-4.0*a*c;
			if(discriminant<0.0) return MISS;
			float root=sqrt(discriminant);
			float t1=(-b-root)/(2.0*a);
			float t2=(-b+root)/(2.0*a);
			return min(validBowlRoot(ro,rd,t1),validBowlRoot(ro,rd,t2));
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
				float radius=length(p.xy);
				float angle=atan(p.y,p.x);
				float ringDistance=abs(fract(radius/0.34+0.5)-0.5)*0.34;
				float rings=lineMask(ringDistance,0.010);
				float meridianDistance=abs(sin(6.0*angle))*radius;
				float meridians=lineMask(meridianDistance,0.014);
				float polarNet=max(rings,meridians);
				color=mix(color,uGrid,0.44*polarNet);

				float selectedRadius=length(uPoint);
				float levelCircle=lineMask(abs(radius-selectedRadius),0.026);
				color=mix(color,uBlue,0.9*levelCircle);

				vec2 delta=p.xy-uPoint;
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
	aria-label="A directly rotatable paraboloid with circular level curves, radial meridians, a tangent plane, and a chosen tangent direction"
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
