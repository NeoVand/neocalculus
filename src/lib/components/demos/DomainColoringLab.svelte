<script lang="ts">
	import { untrack } from 'svelte';
	import SliderField from './SliderField.svelte';
	type Kind = 'identity' | 'polynomial' | 'rational' | 'exponential' | 'sine' | 'constellation';
	type SpecialPoint = { re: number; im: number; type: 'zero' | 'pole' };
	let kind = $state<Kind>('polynomial'),
		extent = $state(2.6),
		enhanced = $state(true);
	let renderFrame: (() => void) | undefined,
		pendingFrame = 0;
	const kindIndex: Record<Kind, number> = {
		identity: 0,
		polynomial: 1,
		rational: 2,
		exponential: 3,
		sine: 4,
		constellation: 5
	};
	const vertexShader = `#version 300 es
		in vec2 aPosition;
		void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
	`;
	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform float uExtent;
		uniform int uKind;
		uniform int uEnhanced;
		out vec4 outColor;
		const float TAU = 6.283185307179586;

		vec2 cmul(vec2 a, vec2 b) {
			return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
		}
		vec2 cdiv(vec2 a, vec2 b) {
			float d = max(dot(b,b), 1e-18);
			return vec2(a.x*b.x+a.y*b.y, a.y*b.x-a.x*b.y)/d;
		}
		vec2 complexValue(vec2 z) {
			vec2 z2 = cmul(z,z);
			if (uKind == 0) return z;
			if (uKind == 1) return z2-vec2(1.0,0.0);
			if (uKind == 2) return cdiv(vec2(1.0,0.0),z2+vec2(1.0,0.0));
			if (uKind == 3) {
				float m = exp(z.x);
				return m*vec2(cos(z.y),sin(z.y));
			}
			if (uKind == 4) {
				float sh = 0.5*(exp(z.y)-exp(-z.y));
				float ch = 0.5*(exp(z.y)+exp(-z.y));
				return vec2(sin(z.x)*ch,cos(z.x)*sh);
			}
			vec2 z3 = cmul(z2,z);
			return cdiv(z3-vec2(1.0,0.0),z2+vec2(0.35,0.0));
		}
		vec3 hsv2rgb(vec3 c) {
			vec3 p = abs(fract(c.xxx+vec3(0.0,2.0/3.0,1.0/3.0))*6.0-3.0);
			return c.z*mix(vec3(1.0),clamp(p-1.0,0.0,1.0),c.y);
		}
		void main() {
			vec2 centered = gl_FragCoord.xy/uResolution-0.5;
			vec2 z = vec2(centered.x*2.0*uExtent*(uResolution.x/uResolution.y), centered.y*2.0*uExtent);
			vec2 w = complexValue(z);
			float magnitude = length(w);
			float phase = atan(w.y,w.x)/TAU;
			float hue = fract(phase+1.0);
			float saturation = 0.78;
			float value = 0.68+0.28*(1.0-exp(-0.5*min(magnitude,40.0)));

			if (uEnhanced == 1) {
				float logMagnitude = log2(max(magnitude,1e-9));
				float modulusDistance = abs(fract(logMagnitude)-0.5);
				float modulusPixels = modulusDistance/max(fwidth(logMagnitude),1e-5);
				float modulusLine = 1.0-smoothstep(0.65,1.45,modulusPixels);
				float phaseCoordinate = phase*12.0;
				float phaseDistance = abs(fract(phaseCoordinate)-0.5);
				float phasePixels = phaseDistance/max(fwidth(phaseCoordinate),1e-5);
				float phaseLine = 1.0-smoothstep(0.65,1.35,phasePixels);
				float octaveShading = 0.965+0.035*cos(TAU*fract(logMagnitude));
				value *= octaveShading*(1.0-0.34*modulusLine)*(1.0-0.18*phaseLine);
				saturation = 0.84;
			}
			value *= mix(0.12,1.0,smoothstep(0.0,0.04,magnitude));
			float pole = smoothstep(65.0,120.0,magnitude);
			saturation = mix(saturation,0.18,pole);
			value = mix(value,0.98,pole);
			outColor = vec4(hsv2rgb(vec3(hue,saturation,value)),1.0);
		}
	`;
	const label = $derived(
		kind === 'identity'
			? 'f(z)=z'
			: kind === 'polynomial'
				? 'f(z)=z²−1'
				: kind === 'rational'
					? 'f(z)=1/(z²+1)'
					: kind === 'exponential'
						? 'f(z)=eᶻ'
						: kind === 'sine'
							? 'f(z)=sin z'
							: 'f(z)=(z³−1)/(z²+0.35)'
	);
	function specialPoints(): SpecialPoint[] {
		if (kind === 'identity') return [{ re: 0, im: 0, type: 'zero' }];
		if (kind === 'polynomial')
			return [
				{ re: -1, im: 0, type: 'zero' },
				{ re: 1, im: 0, type: 'zero' }
			];
		if (kind === 'rational')
			return [
				{ re: 0, im: -1, type: 'pole' },
				{ re: 0, im: 1, type: 'pole' }
			];
		if (kind === 'sine') return [-Math.PI, 0, Math.PI].map((re) => ({ re, im: 0, type: 'zero' }));
		if (kind === 'constellation')
			return [
				{ re: 1, im: 0, type: 'zero' },
				{ re: -0.5, im: 0.866, type: 'zero' },
				{ re: -0.5, im: -0.866, type: 'zero' },
				{ re: 0, im: 0.592, type: 'pole' },
				{ re: 0, im: -0.592, type: 'pole' }
			];
		return [];
	}
	const markers = $derived(specialPoints());
	const markerScale = $derived(170 / extent);
	function compile(gl: WebGL2RenderingContext, type: number, source: string) {
		const shader = gl.createShader(type);
		if (!shader) throw new Error('Unable to create phase portrait shader');
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error';
			gl.deleteShader(shader);
			throw new Error(message);
		}
		return shader;
	}
	function scheduleDraw() {
		if (pendingFrame) return;
		pendingFrame = requestAnimationFrame(() => {
			pendingFrame = 0;
			renderFrame?.();
		});
	}
	function choose(next: Kind) {
		kind = next;
		scheduleDraw();
	}
	function toggleBands() {
		enhanced = !enhanced;
		scheduleDraw();
	}
	function attachCanvas(node: HTMLCanvasElement) {
		const gl = node.getContext('webgl2', {
			antialias: false,
			alpha: false,
			powerPreference: 'high-performance'
		});
		if (!gl) return;
		const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader),
			fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader),
			program = gl.createProgram();
		if (!program) throw new Error('Unable to create phase portrait program');
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS))
			throw new Error(gl.getProgramInfoLog(program) ?? 'Unable to link phase portrait program');
		gl.useProgram(program);
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, 'aPosition');
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const resolutionLocation = gl.getUniformLocation(program, 'uResolution'),
			extentLocation = gl.getUniformLocation(program, 'uExtent'),
			kindLocation = gl.getUniformLocation(program, 'uKind'),
			enhancedLocation = gl.getUniformLocation(program, 'uEnhanced');
		const render = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, 2.5),
				width = Math.max(1, Math.round(node.clientWidth * ratio)),
				height = Math.max(1, Math.round(node.clientHeight * ratio));
			if (node.width !== width || node.height !== height) {
				node.width = width;
				node.height = height;
			}
			gl.viewport(0, 0, width, height);
			gl.uniform2f(resolutionLocation, width, height);
			gl.uniform1f(extentLocation, extent);
			gl.uniform1i(kindLocation, kindIndex[kind]);
			gl.uniform1i(enhancedLocation, enhanced ? 1 : 0);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};
		renderFrame = render;
		const observer = new ResizeObserver(scheduleDraw);
		observer.observe(node);
		untrack(render);
		return () => {
			observer.disconnect();
			if (pendingFrame) cancelAnimationFrame(pendingFrame);
			pendingFrame = 0;
			if (renderFrame === render) renderFrame = undefined;
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
			gl.deleteShader(vertex);
			gl.deleteShader(fragment);
		};
	}
</script>

<div class="domain-lab">
	<div class="heading">
		<div>
			<span>Four dimensions, compressed into color</span>
			<h4>Read a complex function as a phase portrait</h4>
		</div>
		<p>
			Hue records the argument of f(z). Brightness bands record its modulus. Zeros gather every hue;
			poles reverse the pattern.
		</p>
	</div>
	<div class="functions">
		<button class:active={kind === 'identity'} onclick={() => choose('identity')}>z</button><button
			class:active={kind === 'polynomial'}
			onclick={() => choose('polynomial')}>z² − 1</button
		><button class:active={kind === 'rational'} onclick={() => choose('rational')}
			>1/(z² + 1)</button
		><button class:active={kind === 'exponential'} onclick={() => choose('exponential')}>eᶻ</button
		><button class:active={kind === 'sine'} onclick={() => choose('sine')}>sin z</button><button
			class:active={kind === 'constellation'}
			onclick={() => choose('constellation')}>zeros + poles</button
		>
	</div>
	<div class="stage">
		<canvas
			{@attach attachCanvas}
			width="560"
			height="340"
			aria-label="Domain coloring phase portrait for {label}"
		></canvas>
		<svg class="markers" viewBox="0 0 560 340" aria-hidden="true">
			{#each markers as point (`${point.type}-${point.re}-${point.im}`)}
				{@const x = 280 + markerScale * point.re}
				{@const y = 170 - markerScale * point.im}
				{#if x > 9 && x < 551 && y > 9 && y < 331}
					<circle class="marker-halo" cx={x} cy={y} r={point.type === 'pole' ? 8 : 7} />
					<circle class="marker-ring" cx={x} cy={y} r={point.type === 'pole' ? 6 : 5} />
					{#if point.type === 'pole'}
						<path
							class="marker-cross"
							d={`M ${x - 4} ${y - 4} L ${x + 4} ${y + 4} M ${x + 4} ${y - 4} L ${x - 4} ${y + 4}`}
						/>
					{/if}
				{/if}
			{/each}
		</svg>
		<div class="overlay"><span>Im z</span><span>{label}</span><span>Re z</span></div>
	</div>
	<div class="legend">
		<div class="wheel" aria-hidden="true"></div>
		<div>
			<strong>hue = arg f(z)</strong><span
				>one turn around the color wheel means one turn of the output direction</span
			>
		</div>
		<div class="bands"></div>
		<div>
			<strong>bands = |f(z)|</strong><span
				>crisp curves mark equal steps on a logarithmic magnitude scale</span
			>
		</div>
	</div>
	<div class="controls">
		<SliderField
			label="View scale · R"
			min={1.4}
			max={5}
			step={0.1}
			decimals={1}
			tone="violet"
			bind:value={extent}
			oninput={scheduleDraw}
		/><button class:active={enhanced} onclick={toggleBands}
			>{enhanced ? 'Contour bands on' : 'Contour bands off'}</button
		>
	</div>
</div>

<style>
	.domain-lab {
		width: 100%;
		box-sizing: border-box;
		color: var(--color-ink);
	}
	.heading {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(15rem, 0.85fr);
		align-items: end;
		gap: 1.4rem;
		margin-bottom: 1rem;
	}
	.heading span {
		color: var(--plot-teal);
		font: 800 0.7rem/1.2 var(--font-sans);
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}
	.heading h4 {
		margin: 0.15rem 0 0;
		font-family: var(--font-serif);
		font-size: clamp(1.35rem, 3vw, 1.85rem);
		font-weight: 600;
	}
	.heading p {
		margin: 0;
		color: var(--color-ink-light);
		font-size: 0.91rem;
		line-height: 1.5;
	}
	.functions {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.4rem;
		margin-bottom: 0.7rem;
	}
	.functions button,
	.controls button {
		border: 1px solid var(--color-border-light);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
		color: var(--color-ink);
		padding: 0.55rem 0.4rem;
		font: 700 0.72rem/1.1 var(--font-sans);
		cursor: pointer;
	}
	.functions button.active,
	.functions button:hover,
	.functions button:focus-visible,
	.controls button.active,
	.controls button:hover,
	.controls button:focus-visible {
		border-color: var(--plot-teal);
		background: color-mix(in srgb, var(--plot-teal) 9%, var(--color-surface-raised));
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
		height: auto;
		aspect-ratio: 28/17;
	}
	.markers {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.marker-halo,
	.marker-ring {
		fill: none;
	}
	.marker-halo {
		stroke: rgba(0, 0, 0, 0.52);
		stroke-width: 4;
	}
	.marker-ring,
	.marker-cross {
		stroke: white;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.marker-cross {
		fill: none;
	}
	.overlay {
		position: absolute;
		inset: 0.8rem 1rem auto;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		color: white;
		font: 800 0.65rem/1 var(--font-sans);
		letter-spacing: 0.08em;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
		pointer-events: none;
	}
	.overlay span:nth-child(2) {
		justify-self: center;
	}
	.overlay span:last-child {
		justify-self: end;
	}
	.legend {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr;
		align-items: center;
		gap: 0.65rem 1rem;
		padding: 0.8rem 0.25rem;
	}
	.legend strong,
	.legend span {
		display: block;
		font-family: var(--font-sans);
	}
	.legend strong {
		font-size: 0.76rem;
	}
	.legend span {
		margin-top: 0.12rem;
		color: var(--color-ink-light);
		font-size: 0.68rem;
		line-height: 1.35;
	}
	.wheel {
		width: 2.6rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: conic-gradient(#f66, #ff6, #6f6, #6ff, #66f, #f6f, #f66);
		box-shadow: inset 0 0 0 0.55rem color-mix(in srgb, var(--color-surface) 60%, transparent);
	}
	.bands {
		width: 2.6rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: repeating-radial-gradient(
			circle,
			var(--plot-ink) 0 2px,
			var(--plot-muted) 3px 6px,
			var(--plot-background) 7px 10px
		);
	}
	.controls {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 1rem;
		padding: 0.7rem 0.2rem 0;
		border-top: 1px solid var(--color-border-light);
	}
	.controls button {
		min-width: 9.5rem;
		margin-bottom: 0.1rem;
	}
	@media (max-width: 640px) {
		.heading {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.functions {
			grid-template-columns: repeat(3, 1fr);
		}
		.legend {
			grid-template-columns: auto 1fr;
		}
		.controls {
			grid-template-columns: 1fr;
		}
		.controls button {
			width: 100%;
		}
	}
</style>
