<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';
	import {
		createFullscreenShader,
		createRenderScheduler,
		cssColorToRgb,
		type FullscreenShader,
		type RenderScheduler
	} from '$lib/utils/webgl';

	type Curve = {
		fn: (x: number) => number;
		dfn: (x: number) => number;
		tex: string;
		cx: number;
		xRange: [number, number];
		shader: number;
	};

	const curves: Record<string, Curve> = {
		parabola: {
			fn: (x) => x * x,
			dfn: (x) => 2 * x,
			tex: 'x^2',
			cx: 1,
			xRange: [-3, 3],
			shader: 0
		},
		cubic: {
			fn: (x) => x ** 3 - x,
			dfn: (x) => 3 * x * x - 1,
			tex: 'x^3-x',
			cx: 0.8,
			xRange: [-2, 2],
			shader: 1
		},
		quartic: {
			fn: (x) => x ** 4 - 2 * x * x,
			dfn: (x) => 4 * x ** 3 - 4 * x,
			tex: 'x^4-2x^2',
			cx: 1.2,
			xRange: [-2, 2],
			shader: 2
		},
		sqrt: {
			fn: Math.sqrt,
			dfn: (x) => (x <= 0 ? Infinity : 1 / (2 * Math.sqrt(x))),
			tex: '\\sqrt{x}',
			cx: 1,
			xRange: [0, 5],
			shader: 3
		},
		cbrt: {
			fn: Math.cbrt,
			dfn: (x) => (Math.abs(x) < 1e-10 ? 1e10 : 1 / (3 * Math.cbrt(x * x))),
			tex: '\\sqrt[3]{x}',
			cx: 1,
			xRange: [-3, 4],
			shader: 4
		},
		oneover: {
			fn: (x) => (x === 0 ? Infinity : 1 / x),
			dfn: (x) => (x === 0 ? -Infinity : -1 / (x * x)),
			tex: '1/x',
			cx: 1.5,
			xRange: [0.25, 4],
			shader: 5
		},
		exp: { fn: Math.exp, dfn: Math.exp, tex: 'e^x', cx: 0.5, xRange: [-2, 3], shader: 6 },
		ln: { fn: Math.log, dfn: (x) => 1 / x, tex: '\\ln x', cx: 1.5, xRange: [0.01, 5], shader: 7 },
		sine: { fn: Math.sin, dfn: Math.cos, tex: '\\sin x', cx: 1, xRange: [-4, 4], shader: 8 },
		cosine: {
			fn: Math.cos,
			dfn: (x) => -Math.sin(x),
			tex: '\\cos x',
			cx: 1,
			xRange: [-4, 4],
			shader: 9
		},
		tangent: {
			fn: Math.tan,
			dfn: (x) => 1 / Math.cos(x) ** 2,
			tex: '\\tan x',
			cx: 0.5,
			xRange: [-1.4, 1.4],
			shader: 10
		},
		arctan: {
			fn: Math.atan,
			dfn: (x) => 1 / (1 + x * x),
			tex: '\\arctan x',
			cx: 1,
			xRange: [-4, 4],
			shader: 11
		},
		sinc: {
			fn: (x) => (Math.abs(x) < 1e-10 ? 1 : Math.sin(x) / x),
			dfn: (x) => (Math.abs(x) < 1e-10 ? 0 : (x * Math.cos(x) - Math.sin(x)) / (x * x)),
			tex: '\\sin x/x',
			cx: 1.5,
			xRange: [-8, 8],
			shader: 12
		},
		cosh: { fn: Math.cosh, dfn: Math.sinh, tex: '\\cosh x', cx: 0.8, xRange: [-3, 3], shader: 13 },
		sinh: { fn: Math.sinh, dfn: Math.cosh, tex: '\\sinh x', cx: 0.8, xRange: [-3, 3], shader: 14 },
		tanh: {
			fn: Math.tanh,
			dfn: (x) => 1 - Math.tanh(x) ** 2,
			tex: '\\tanh x',
			cx: 0.5,
			xRange: [-3, 3],
			shader: 15
		},
		sigmoid: {
			fn: (x) => 1 / (1 + Math.exp(-x)),
			dfn: (x) => {
				const s = 1 / (1 + Math.exp(-x));
				return s * (1 - s);
			},
			tex: '\\sigma(x)',
			cx: 0,
			xRange: [-5, 5],
			shader: 16
		},
		gaussian: {
			fn: (x) => Math.exp(-x * x),
			dfn: (x) => -2 * x * Math.exp(-x * x),
			tex: 'e^{-x^2}',
			cx: 0.5,
			xRange: [-3, 3],
			shader: 17
		}
	};

	const fragmentShader = `#version 300 es
		precision highp float;
		uniform vec2 uResolution;
		uniform vec2 uCenter;
		uniform float uRangeX;
		uniform float uSlope;
		uniform float uGridStep;
		uniform float uShowTangent;
		uniform float uConvergence;
		uniform int uCurve;
		uniform vec3 uBackground;
		uniform vec3 uGrid;
		uniform vec3 uAxis;
		uniform vec3 uInk;
		uniform vec3 uOutline;
		uniform vec3 uViolet;
		uniform vec3 uAmber;
		out vec4 outColor;

		float sh(float x) { return 0.5*(exp(x)-exp(-x)); }
		float ch(float x) { return 0.5*(exp(x)+exp(-x)); }
		float curve(float x) {
			if (uCurve == 0) return x*x;
			if (uCurve == 1) return x*x*x-x;
			if (uCurve == 2) return x*x*x*x-2.0*x*x;
			if (uCurve == 3) return x < 0.0 ? 1e12 : sqrt(x);
			if (uCurve == 4) return sign(x)*pow(abs(x),1.0/3.0);
			if (uCurve == 5) return abs(x) < 1e-7 ? 1e12 : 1.0/x;
			if (uCurve == 6) return exp(x);
			if (uCurve == 7) return x <= 0.0 ? 1e12 : log(x);
			if (uCurve == 8) return sin(x);
			if (uCurve == 9) return cos(x);
			if (uCurve == 10) return abs(cos(x)) < 1e-5 ? 1e12 : tan(x);
			if (uCurve == 11) return atan(x);
			if (uCurve == 12) return abs(x) < 1e-4 ? 1.0-x*x/6.0 : sin(x)/x;
			if (uCurve == 13) return ch(x);
			if (uCurve == 14) return sh(x);
			if (uCurve == 15) return sh(x)/ch(x);
			if (uCurve == 16) return 1.0/(1.0+exp(-x));
			return exp(-x*x);
		}
		float derivative(float x) {
			if (uCurve == 0) return 2.0*x;
			if (uCurve == 1) return 3.0*x*x-1.0;
			if (uCurve == 2) return 4.0*x*x*x-4.0*x;
			if (uCurve == 3) return x <= 1e-8 ? 1e6 : 0.5/sqrt(x);
			if (uCurve == 4) return abs(x) < 1e-7 ? 1e6 : 1.0/(3.0*pow(abs(x),2.0/3.0));
			if (uCurve == 5) return abs(x) < 1e-7 ? -1e6 : -1.0/(x*x);
			if (uCurve == 6) return exp(x);
			if (uCurve == 7) return x <= 0.0 ? 1e6 : 1.0/x;
			if (uCurve == 8) return cos(x);
			if (uCurve == 9) return -sin(x);
			if (uCurve == 10) { float c=cos(x); return abs(c)<1e-5 ? 1e6 : 1.0/(c*c); }
			if (uCurve == 11) return 1.0/(1.0+x*x);
			if (uCurve == 12) return abs(x)<1e-4 ? -x/3.0 : (x*cos(x)-sin(x))/(x*x);
			if (uCurve == 13) return sh(x);
			if (uCurve == 14) return ch(x);
			if (uCurve == 15) { float t=sh(x)/ch(x); return 1.0-t*t; }
			if (uCurve == 16) { float s=1.0/(1.0+exp(-x)); return s*(1.0-s); }
			return -2.0*x*exp(-x*x);
		}
		float lineMask(float distancePixels, float inner, float outer) {
			return 1.0-smoothstep(inner,outer,distancePixels);
		}
		void main() {
			float aspect=uResolution.x/uResolution.y;
			vec2 unit=gl_FragCoord.xy/uResolution-0.5;
			vec2 world=uCenter+vec2(unit.x*2.0*uRangeX,unit.y*2.0*uRangeX/aspect);
			float pixelsPerUnit=uResolution.x/(2.0*uRangeX);
			vec3 color=uBackground;

			vec2 gridDistance=abs(fract(world/uGridStep+0.5)-0.5)*uGridStep*pixelsPerUnit;
			float gridLine=lineMask(min(gridDistance.x,gridDistance.y),0.35,1.05);
			color=mix(color,uGrid,0.78*gridLine);
			float axisLine=lineMask(min(abs(world.x),abs(world.y))*pixelsPerUnit,0.45,1.2);
			color=mix(color,uAxis,axisLine);

			float yCurve=curve(world.x);
			float slope=derivative(world.x);
			float valid=1.0-step(1e8,abs(yCurve));
			float curvePixels=abs(world.y-yCurve)*pixelsPerUnit/sqrt(1.0+min(slope*slope,1e12));
			float curveLine=lineMask(curvePixels,1.05,2.15)*valid;

			float tangentY=uCenter.y+uSlope*(world.x-uCenter.x);
			float finiteTangent=1.0-step(1e5,abs(uSlope));
			float tangentPixels=mix(abs(world.x-uCenter.x),abs(world.y-tangentY)/sqrt(1.0+uSlope*uSlope),finiteTangent)*pixelsPerUnit;
			float between=step(min(yCurve,tangentY),world.y)*step(world.y,max(yCurve,tangentY))*valid*finiteTangent;
			float remainderFade=exp(-0.011*abs(world.x-uCenter.x)*pixelsPerUnit);
			color=mix(color,uAmber,0.09*between*remainderFade*uShowTangent);

			vec3 curveColor=mix(uInk,uViolet,smoothstep(0.35,0.92,uConvergence));
			color=mix(color,curveColor,curveLine);
			float dash=step(5.5,mod(abs(world.x-uCenter.x)*pixelsPerUnit,13.5));
			dash=mix(dash,1.0,smoothstep(0.2,0.72,uConvergence));
			float tangentLine=lineMask(tangentPixels,0.9,1.85)*dash*uShowTangent;
			color=mix(color,uViolet,tangentLine*mix(0.62,0.98,uConvergence));

			float pointDistance=length(gl_FragCoord.xy-0.5*uResolution);
			float halo=lineMask(pointDistance,8.5,10.5);
			float point=lineMask(pointDistance,3.5,5.0);
			float centerDot=lineMask(pointDistance,1.4,2.3);
			color=mix(color,uViolet,0.2*halo+point);
			color=mix(color,uOutline,centerDot);
			outColor=vec4(color,1.0);
		}
	`;

	let zoomSlider = $state(0);
	let showTangent = $state(true);
	let selectedCurve = $state('parabola');
	let pointSlider = $state(667);
	let renderer: FullscreenShader | undefined;
	let scheduler: RenderScheduler | undefined;

	const zoom = $derived(10 ** ((zoomSlider / 100) * 3));
	const curveData = $derived(curves[selectedCurve]);
	const centerX = $derived.by(() => {
		const [lo, hi] = curveData.xRange;
		const x = lo + (pointSlider / 1000) * (hi - lo);
		return Math.abs(x) < (hi - lo) * 0.002 ? 0 : x;
	});
	const centerY = $derived.by(() => {
		const value = curveData.fn(centerX);
		if (Number.isFinite(value)) return value;
		const right = curveData.fn(centerX + 0.001);
		if (Number.isFinite(right)) return right;
		const left = curveData.fn(centerX - 0.001);
		return Number.isFinite(left) ? left : 0;
	});
	const slope = $derived(curveData.dfn(centerX));
	const rangeX = $derived(4 / zoom);
	const convergence = $derived(Math.max(0, Math.min(1, (Math.log10(zoom) - 1.55) / 1.05)));
	const edgeResidual = $derived.by(() => {
		const h = rangeX * 0.64;
		const value = curveData.fn(centerX + h);
		const tangent = centerY + slope * h;
		return Number.isFinite(value) && Number.isFinite(tangent)
			? Math.abs(value - tangent)
			: Infinity;
	});
	const residualText = $derived(
		Number.isFinite(edgeResidual)
			? edgeResidual < 0.001
				? edgeResidual.toExponential(1)
				: edgeResidual.toFixed(edgeResidual < 0.1 ? 3 : 2)
			: 'undefined'
	);

	function getGridStep(range: number) {
		const raw = range / 6;
		const magnitude = 10 ** Math.floor(Math.log10(raw));
		const normalized = raw / magnitude;
		if (normalized < 1.5) return magnitude;
		if (normalized < 3.5) return 2 * magnitude;
		if (normalized < 7.5) return 5 * magnitude;
		return 10 * magnitude;
	}

	function draw() {
		if (!renderer) return;
		const theme = getPlotTheme();
		const color = (gl: WebGL2RenderingContext, name: string, value: string) =>
			gl.uniform3fv(renderer?.uniform(name) ?? null, cssColorToRgb(value));
		renderer.draw((gl) => {
			gl.uniform2f(renderer?.uniform('uCenter') ?? null, centerX, centerY);
			gl.uniform1f(renderer?.uniform('uRangeX') ?? null, rangeX);
			gl.uniform1f(
				renderer?.uniform('uSlope') ?? null,
				Number.isFinite(slope) ? slope : Math.sign(slope || 1) * 1e6
			);
			gl.uniform1f(renderer?.uniform('uGridStep') ?? null, getGridStep(rangeX * 2));
			gl.uniform1f(renderer?.uniform('uShowTangent') ?? null, showTangent ? 1 : 0);
			gl.uniform1f(renderer?.uniform('uConvergence') ?? null, convergence);
			gl.uniform1i(renderer?.uniform('uCurve') ?? null, curveData.shader);
			color(gl, 'uBackground', theme.background);
			color(gl, 'uGrid', theme.grid);
			color(gl, 'uAxis', theme.axis);
			color(gl, 'uInk', theme.ink);
			color(gl, 'uOutline', theme.outline);
			color(gl, 'uViolet', theme.violet);
			color(gl, 'uAmber', theme.amber);
		});
	}

	function redrawNext() {
		scheduler?.request();
	}

	function attachCanvas(node: HTMLCanvasElement) {
		const created = createFullscreenShader(node, fragmentShader);
		if (!created) return;
		renderer = created;
		scheduler = createRenderScheduler(node, draw);
		window.addEventListener(THEME_CHANGE_EVENT, redrawNext);
		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, redrawNext);
			scheduler?.destroy();
			created.destroy();
			if (renderer === created) renderer = undefined;
			scheduler = undefined;
		};
	}
</script>

<div class="demo-container">
	<!-- Friendly label with hand icon -->
	<div class="demo-label">
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path
				d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"
			/><path
				d="M18 8a2 2 0 0 1 2 2v7.4a4 4 0 0 1-.6 2.1L17.5 22H8.8a2 2 0 0 1-1.7-1l-3.5-6A2 2 0 0 1 6 12h0"
			/></svg
		>
		Explore: zoom into any curve
	</div>

	<!-- Function picker: bento grid with KaTeX labels -->
	<div class="fn-grid">
		{#each Object.entries(curves) as [key, c] (key)}
			<button
				class="fn-cell"
				class:active={selectedCurve === key}
				onclick={() => {
					selectedCurve = key;
					zoomSlider = 0;
					const cv = curves[key];
					pointSlider = Math.round(((cv.cx - cv.xRange[0]) / (cv.xRange[1] - cv.xRange[0])) * 1000);
					redrawNext();
				}}><Katex math={c.tex} /></button
			>
		{/each}
	</div>

	<!-- Zoom control -->
	<div class="toolbar">
		<span class="toolbar-lbl">Zoom</span>
		<input
			type="range"
			min="0"
			max="100"
			step="0.5"
			bind:value={zoomSlider}
			oninput={redrawNext}
			class="toolbar-slider demo-slider"
			style={`--slider-progress: ${zoomSlider}%;`}
			aria-label="Zoom level"
		/>
		<span class="toolbar-val">{zoom.toFixed(zoom < 10 ? 1 : 0)}×</span>
	</div>

	<!-- Canvas -->
	<div class="canvas-wrapper">
		<canvas
			{@attach attachCanvas}
			aria-label="A GPU-rendered microscope view of {selectedCurve}, its tangent, and their nonlinear remainder"
		></canvas>
		{#if zoom >= 80}
			<div class="canvas-overlay" class:converged={zoom >= 400}>
				{#if zoom < 400}
					Converging...
				{:else}
					<em>Microstraightness.</em>
				{/if}
			</div>
		{/if}
	</div>
	<div class="microscope-legend" aria-live="polite">
		<span><i class="curve-swatch"></i>curve</span>
		<span><i class="tangent-swatch"></i>tangent</span>
		<span
			><i class="remainder-swatch"></i>nonlinear remainder at the view edge ≈ {residualText}</span
		>
	</div>

	<!-- Point + tangent controls -->
	<div class="toolbar">
		<span class="toolbar-lbl"><em>x</em> =</span>
		<input
			type="range"
			min="0"
			max="1000"
			step="1"
			bind:value={pointSlider}
			oninput={redrawNext}
			class="toolbar-slider demo-slider tone-blue"
			style={`--slider-progress: ${pointSlider / 10}%;`}
			aria-label="Point coordinate"
		/>
		<span class="toolbar-val">{centerX.toFixed(2)}</span>
		<button
			class="tangent-btn"
			class:active={showTangent}
			onclick={() => {
				showTangent = !showTangent;
				redrawNext();
			}}
		>
			Tangent {showTangent ? 'on' : 'off'}
		</button>
	</div>
</div>

<style>
	/* ── Bento function grid ── */
	.fn-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5.8rem, 1fr));
		gap: 0.35rem;
		margin-bottom: 1rem;
	}

	.fn-cell {
		padding: 0.38rem 0.3rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-border-light);
		background: var(--color-surface);
		color: var(--color-ink-light);
		cursor: pointer;
		transition: all 0.12s ease;
		text-align: center;
		line-height: 1.2;
	}

	.fn-cell :global(.katex) {
		font-size: 0.85em;
	}

	.fn-cell:hover {
		border-color: var(--color-d);
		color: var(--color-d);
		background: var(--color-d-soft);
	}

	.fn-cell.active {
		background: var(--color-d);
		color: white;
		border-color: var(--color-d);
	}

	.fn-cell.active :global(.katex *) {
		color: white !important;
	}

	/* ── Toolbar ── */
	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0;
	}

	.toolbar-lbl {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
	}

	.toolbar-slider {
		flex: 1;
		min-width: 0;
	}

	.toolbar-val {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-d);
		min-width: 3.2em;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.tangent-btn {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 500;
		padding: 0.28rem 0.65rem;
		border-radius: 999px;
		border: 1.5px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-ink-faint);
		cursor: pointer;
		transition: all 0.12s ease;
		white-space: nowrap;
	}

	.tangent-btn:hover {
		border-color: var(--color-d);
		color: var(--color-d);
	}

	.tangent-btn.active {
		background: var(--color-d);
		color: white;
		border-color: var(--color-d);
	}

	/* ── Canvas ── */
	.canvas-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		position: relative;
		margin: 0.3rem 0;
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.canvas-overlay {
		position: absolute;
		bottom: 0.6rem;
		left: 0.6rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-light);
		background: color-mix(in srgb, var(--color-surface-raised) 88%, transparent);
		padding: 0.3rem 0.6rem;
		border-radius: 0.35rem;
		pointer-events: none;
		animation: float-down 0.3s var(--ease-out-expo);
	}

	.canvas-overlay.converged {
		color: var(--color-d);
		font-weight: 600;
		background: color-mix(in srgb, var(--color-d-soft) 90%, var(--color-surface-raised));
	}

	.microscope-legend {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.85rem;
		min-height: 1.35rem;
		color: var(--color-ink-faint);
		font: 600 0.67rem/1.25 var(--font-sans);
	}

	.microscope-legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
	}

	.microscope-legend i {
		display: inline-block;
		width: 0.95rem;
		height: 0.18rem;
		border-radius: 999px;
	}

	.curve-swatch {
		background: var(--plot-ink);
	}

	.tangent-swatch {
		background: var(--plot-violet);
	}

	.remainder-swatch {
		background: color-mix(in srgb, var(--plot-amber) 58%, transparent);
	}

	@keyframes float-down {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 600px) {
		.microscope-legend {
			justify-content: flex-start;
			flex-wrap: wrap;
			gap: 0.35rem 0.75rem;
		}
	}
</style>
