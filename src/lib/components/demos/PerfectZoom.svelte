<script lang="ts">
	import { onMount } from 'svelte';
	import katex from 'katex';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let mounted = $state(false);

	// Each curve: fn, dfn, tex (KaTeX), cx (default x), xRange [min, max] for point slider
	type Curve = {
		fn: (x: number) => number;
		dfn: (x: number) => number;
		tex: string;
		cx: number;
		xRange: [number, number];
	};

	const curves: Record<string, Curve> = {
		// ── Polynomials ──
		parabola:  { fn: x => x*x,                       dfn: x => 2*x,                          tex: 'x^2',              cx: 1,        xRange: [-3, 3] },
		cubic:     { fn: x => x*x*x - x,                 dfn: x => 3*x*x - 1,                    tex: 'x^3 - x',          cx: 0.8,      xRange: [-2, 2] },
		quartic:   { fn: x => x*x*x*x - 2*x*x,           dfn: x => 4*x*x*x - 4*x,                tex: 'x^4 - 2x^2',      cx: 1.2,      xRange: [-2, 2] },
		// ── Powers & roots ──
		sqrt:      { fn: x => Math.sqrt(x),              dfn: x => x <= 0 ? Infinity : 1/(2*Math.sqrt(x)), tex: '\\sqrt{x}',  cx: 1,        xRange: [0, 5] },
		cbrt:      { fn: x => Math.cbrt(x),              dfn: x => { const ax = Math.abs(x); return ax < 1e-10 ? 1e10 : 1/(3*Math.cbrt(x*x)); }, tex: '\\sqrt[3]{x}', cx: 1, xRange: [-3, 4] },
		oneover:   { fn: x => x === 0 ? Infinity : 1/x,  dfn: x => x === 0 ? -Infinity : -1/(x*x), tex: '1/x',              cx: 1.5,      xRange: [-3, 3] },
		// ── Exponential & log ──
		exp:       { fn: x => Math.exp(x),               dfn: x => Math.exp(x),                  tex: 'e^x',               cx: 0.5,      xRange: [-2, 3] },
		ln:        { fn: x => Math.log(x),               dfn: x => 1/x,                          tex: '\\ln x',            cx: 1.5,      xRange: [0.01, 5] },
		// ── Trigonometric ──
		sine:      { fn: x => Math.sin(x),               dfn: x => Math.cos(x),                  tex: '\\sin x',           cx: 1,        xRange: [-4, 4] },
		cosine:    { fn: x => Math.cos(x),               dfn: x => -Math.sin(x),                 tex: '\\cos x',           cx: 1,        xRange: [-4, 4] },
		tangent:   { fn: x => Math.tan(x),               dfn: x => 1/(Math.cos(x)**2),            tex: '\\tan x',           cx: 0.5,      xRange: [-1.4, 1.4] },
		arctan:    { fn: x => Math.atan(x),              dfn: x => 1/(1+x*x),                    tex: '\\arctan x',        cx: 1,        xRange: [-4, 4] },
		sinc:      { fn: x => Math.abs(x) < 1e-10 ? 1 : Math.sin(x)/x, dfn: x => Math.abs(x) < 1e-10 ? 0 : (Math.cos(x)*x - Math.sin(x))/(x*x), tex: '\\sin x / x', cx: 1.5, xRange: [-8, 8] },
		// ── Hyperbolic ──
		cosh:      { fn: x => Math.cosh(x),              dfn: x => Math.sinh(x),                 tex: '\\cosh x',          cx: 0.8,      xRange: [-3, 3] },
		sinh:      { fn: x => Math.sinh(x),              dfn: x => Math.cosh(x),                 tex: '\\sinh x',          cx: 0.8,      xRange: [-3, 3] },
		tanh:      { fn: x => Math.tanh(x),              dfn: x => 1-Math.tanh(x)**2,            tex: '\\tanh x',          cx: 0.5,      xRange: [-3, 3] },
		// ── Special ──
		sigmoid:   { fn: x => 1/(1+Math.exp(-x)),        dfn: x => { const s=1/(1+Math.exp(-x)); return s*(1-s); }, tex: '\\sigma(x)', cx: 0, xRange: [-5, 5] },
		gaussian:  { fn: x => Math.exp(-x*x),            dfn: x => -2*x*Math.exp(-x*x),          tex: 'e^{-x^2}',          cx: 0.5,      xRange: [-3, 3] },
	};

	function renderTex(tex: string): string {
		return katex.renderToString(tex, { throwOnError: false, displayMode: false });
	}

	let zoomSlider = $state(0);
	let zoom = $derived(Math.pow(10, (zoomSlider / 100) * 3));
	let showTangent = $state(true);
	let selectedCurve = $state('parabola');
	// Initial slider position: map default cx of 'parabola' (cx=1, range=[-3,3]) → (1-(-3))/(3-(-3))*1000 = 667
	let pointSlider = $state(667);

	let curveData = $derived(curves[selectedCurve]);
	let centerX = $derived.by(() => {
		const [lo, hi] = curveData.xRange;
		const x = lo + (pointSlider / 1000) * (hi - lo);
		// Snap to clean zero when very close
		if (Math.abs(x) < (hi - lo) * 0.002) return 0;
		return x;
	});

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		const w = rect.width * dpr;
		const h = rect.height * dpr;
		canvas.width = w;
		canvas.height = h;

		const curve = curveData;
		const cx = centerX;
		const cy = curve.fn(cx);

		// Guard: center is valid if the function value itself is finite
		// (derivative can be infinite — that means a vertical tangent, which we handle)
		const validCenter = isFinite(cy);

		const rangeX = 4 / zoom;
		const rangeY = rangeX * (h / w);
		const xMin = cx - rangeX;
		const xMax = cx + rangeX;
		const yMin = cy - rangeY;
		const yMax = cy + rangeY;

		const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
		const toY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

		// Clear
		ctx.clearRect(0, 0, w, h);

		// Background
		ctx.fillStyle = '#FDFBF7';
		ctx.fillRect(0, 0, w, h);

		// Grid
		ctx.strokeStyle = '#eee9e0';
		ctx.lineWidth = 1 * dpr;
		const gridStep = getGridStep(rangeX * 2);
		const gridXStart = Math.floor(xMin / gridStep) * gridStep;
		const gridYStart = Math.floor(yMin / gridStep) * gridStep;

		for (let gx = gridXStart; gx <= xMax; gx += gridStep) {
			ctx.beginPath();
			ctx.moveTo(toX(gx), 0);
			ctx.lineTo(toX(gx), h);
			ctx.stroke();
		}
		for (let gy = gridYStart; gy <= yMax; gy += gridStep) {
			ctx.beginPath();
			ctx.moveTo(0, toY(gy));
			ctx.lineTo(w, toY(gy));
			ctx.stroke();
		}

		// Axes
		if (xMin <= 0 && xMax >= 0) {
			ctx.strokeStyle = '#ccc8bf';
			ctx.lineWidth = 1.5 * dpr;
			ctx.beginPath();
			ctx.moveTo(toX(0), 0);
			ctx.lineTo(toX(0), h);
			ctx.stroke();
		}
		if (yMin <= 0 && yMax >= 0) {
			ctx.strokeStyle = '#ccc8bf';
			ctx.lineWidth = 1.5 * dpr;
			ctx.beginPath();
			ctx.moveTo(0, toY(0));
			ctx.lineTo(w, toY(0));
			ctx.stroke();
		}

		// Curve (drawn first, below tangent) — skip NaN/Infinity points
		const isConverged = zoom >= 80;
		ctx.strokeStyle = isConverged ? '#a855f7' : '#1a1a2e';
		ctx.lineWidth = 2.5 * dpr;
		const steps = 600;
		let penDown = false;
		ctx.beginPath();
		for (let i = 0; i <= steps; i++) {
			const x = xMin + ((xMax - xMin) * i) / steps;
			const y = curve.fn(x);
			const sx = toX(x), sy = toY(y);
			if (!isFinite(y) || sy < -h || sy > 2 * h) {
				penDown = false;
				continue;
			}
			if (!penDown) { ctx.moveTo(sx, sy); penDown = true; }
			else ctx.lineTo(sx, sy);
		}
		ctx.stroke();

		// Tangent line (drawn ON TOP of curve) — only if center is valid
		if (showTangent && validCenter) {
			const slope = curve.dfn(cx);
			ctx.beginPath();
			ctx.strokeStyle = zoom >= 80 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(168, 85, 247, 0.5)';
			ctx.lineWidth = (zoom >= 80 ? 3 : 2) * dpr;
			ctx.setLineDash(zoom >= 80 ? [] : [8 * dpr, 6 * dpr]);
			if (!isFinite(slope) || Math.abs(slope) > 1000) {
				// Vertical tangent line
				ctx.moveTo(toX(cx), 0);
				ctx.lineTo(toX(cx), h);
			} else {
				const tangentY = (x: number) => cy + slope * (x - cx);
				ctx.moveTo(toX(xMin), toY(tangentY(xMin)));
				ctx.lineTo(toX(xMax), toY(tangentY(xMax)));
			}
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Center point — only if valid
		if (validCenter) {
			ctx.beginPath();
			ctx.fillStyle = '#a855f7';
			ctx.arc(toX(cx), toY(cy), 5 * dpr, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = 'white';
			ctx.arc(toX(cx), toY(cy), 2.5 * dpr, 0, Math.PI * 2);
			ctx.fill();
		}

	}

	function getGridStep(range: number): number {
		const raw = range / 6;
		const mag = Math.pow(10, Math.floor(Math.log10(raw)));
		const norm = raw / mag;
		if (norm < 1.5) return mag;
		if (norm < 3.5) return 2 * mag;
		if (norm < 7.5) return 5 * mag;
		return 10 * mag;
	}

	$effect(() => {
		// Touch all reactive deps
		selectedCurve; zoomSlider; showTangent; pointSlider; centerX; curveData;
		if (mounted) draw();
	});

	onMount(() => {
		mounted = true;
		draw();

		const ro = new ResizeObserver(() => draw());
		ro.observe(container);
		return () => ro.disconnect();
	});
</script>

<div class="demo-container content-width">
	<!-- Friendly label with hand icon -->
	<div class="demo-label">
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 0 1 2 2v7.4a4 4 0 0 1-.6 2.1L17.5 22H8.8a2 2 0 0 1-1.7-1l-3.5-6A2 2 0 0 1 6 12h0"/></svg>
		Explore: zoom into any curve
	</div>

	<!-- Function picker: bento grid with KaTeX labels -->
	<div class="fn-grid">
		{#each Object.entries(curves) as [key, c]}
			<button
				class="fn-cell"
				class:active={selectedCurve === key}
				onclick={() => {
					selectedCurve = key;
					zoomSlider = 0;
					const cv = curves[key];
					pointSlider = Math.round(((cv.cx - cv.xRange[0]) / (cv.xRange[1] - cv.xRange[0])) * 1000);
				}}
			>{@html renderTex(c.tex)}</button>
		{/each}
	</div>

	<!-- Zoom control -->
	<div class="toolbar">
		<span class="toolbar-lbl">Zoom</span>
		<input type="range" min="0" max="100" step="0.5" bind:value={zoomSlider} class="toolbar-slider" />
		<span class="toolbar-val">{zoom.toFixed(zoom < 10 ? 1 : 0)}×</span>
	</div>

	<!-- Canvas -->
	<div bind:this={container} class="canvas-wrapper">
		<canvas bind:this={canvas}></canvas>
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

	<!-- Point + tangent controls -->
	<div class="toolbar">
		<span class="toolbar-lbl">Point <em>x</em> =</span>
		<input type="range" min="0" max="1000" step="1" bind:value={pointSlider} class="toolbar-slider" />
		<span class="toolbar-val">{centerX.toFixed(2)}</span>
		<button class="tangent-btn" class:active={showTangent} onclick={() => showTangent = !showTangent}>
			Tangent {showTangent ? 'on' : 'off'}
		</button>
	</div>
</div>

<style>
	/* ── Bento function grid ── */
	.fn-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
		gap: 0.3rem;
		margin-bottom: 0.6rem;
	}

	.fn-cell {
		padding: 0.32rem 0.2rem;
		border-radius: 0.4rem;
		border: 1px solid var(--color-border-light);
		background: var(--color-paper);
		color: var(--color-ink-light);
		cursor: pointer;
		transition: all 0.1s ease;
		text-align: center;
		line-height: 1.2;
	}

	.fn-cell :global(.katex) {
		font-size: 0.85em;
	}

	.fn-cell:hover {
		border-color: var(--color-d);
		color: var(--color-d);
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
		margin-bottom: 0.6rem;
	}

	.toolbar-lbl {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
	}

	.toolbar-slider {
		flex: 1;
		accent-color: var(--color-d);
		cursor: pointer;
	}

	.toolbar-val {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--color-d);
		min-width: 3.5em;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.tangent-btn {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 500;
		padding: 0.25rem 0.55rem;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: white;
		color: var(--color-ink-faint);
		cursor: pointer;
		transition: all 0.12s ease;
		white-space: nowrap;
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
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		position: relative;
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
		background: rgba(253, 251, 247, 0.88);
		padding: 0.3rem 0.6rem;
		border-radius: 0.35rem;
		backdrop-filter: blur(4px);
		pointer-events: none;
		animation: float-down 0.3s var(--ease-out-expo);
	}

	.canvas-overlay.converged {
		color: var(--color-d);
		font-weight: 600;
		background: rgba(250, 245, 255, 0.9);
	}

	/* old tab style kept for compat but unused */
	.curve-tab {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: white;
		color: var(--color-ink-light);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.curve-tab:hover {
		border-color: var(--color-d);
		color: var(--color-d);
	}

	.curve-tab.active {
		background: var(--color-d);
		color: white;
		border-color: var(--color-d);
	}

	.zoom-message {
		font-family: var(--font-sans);
		font-size: 0.85rem;
		margin-top: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		animation: float-down 0.4s var(--ease-out-expo);
	}

	.zoom-message.converging {
		background: rgba(168, 85, 247, 0.06);
		color: var(--color-ink-light);
		border: 1px solid rgba(168, 85, 247, 0.15);
	}

	.zoom-message.converged {
		background: rgba(168, 85, 247, 0.1);
		color: var(--color-d);
		border: 1px solid rgba(168, 85, 247, 0.25);
		font-weight: 500;
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
</style>
