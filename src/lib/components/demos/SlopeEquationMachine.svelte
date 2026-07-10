<script lang="ts">
	import { onMount } from 'svelte';
	import Katex from '$lib/components/Katex.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';

	const canvasId = 'slope-equation-canvas';
	let canvasNode: HTMLCanvasElement | null = null;
	let wrapperNode: HTMLDivElement | null = null;
	let resizeObserver: ResizeObserver | null = null;
	let rafScheduled = false;

	const curve = {
		fn: (x: number) => Math.sqrt(x * x + 0.04),
		dfn: (x: number) => x / Math.sqrt(x * x + 0.04),
		tex: '\\sqrt{x^2+0.04}',
		xRange: [-2, 2] as [number, number],
		cx: 0.22
	};

	function clamp(value: number, min: number, max: number): number {
		return Math.min(max, Math.max(min, value));
	}

	function num(value: number, digits = 5): string {
		if (!Number.isFinite(value)) return '0'.padEnd(digits + 2, '0');
		const safe = Math.abs(value) < 1e-12 ? 0 : value;
		return safe.toFixed(digits);
	}

	let zoomSlider = $state(0);
	let zoom = $derived(Math.pow(10, (zoomSlider / 100) * 3));

	let pointSlider = $state(
		Math.round(((curve.cx - curve.xRange[0]) / (curve.xRange[1] - curve.xRange[0])) * 1000)
	);
	let deltaSlider = $state(42);

	let a = $derived(curve.xRange[0] + (pointSlider / 1000) * (curve.xRange[1] - curve.xRange[0]));
	let rangeX = $derived(4 / zoom);
	let xMin = $derived(a - rangeX);
	let xMax = $derived(a + rangeX);

	let deltaRaw = $derived((deltaSlider / 100) * rangeX * 0.9);
	let xShifted = $derived(clamp(a + deltaRaw, xMin, xMax));
	let deltaX = $derived(xShifted - a);

	let fA = $derived(curve.fn(a));
	let fShifted = $derived(curve.fn(xShifted));
	let slopeA = $derived(curve.dfn(a));
	let predicted = $derived(fA + slopeA * deltaX);
	let deviation = $derived(fShifted - predicted);

	let leftValue = $derived(num(fShifted));
	let rightValue = $derived(num(predicted));
	let devAbsValue = $derived(num(Math.abs(deviation), 7));
	let deltaValue = $derived(num(deltaX));

	function getGridStep(range: number): number {
		const raw = range / 6;
		const mag = Math.pow(10, Math.floor(Math.log10(raw)));
		const norm = raw / mag;
		if (norm < 1.5) return mag;
		if (norm < 3.5) return 2 * mag;
		if (norm < 7.5) return 5 * mag;
		return 10 * mag;
	}

	function requestDraw() {
		if (!canvasNode || rafScheduled) return;
		rafScheduled = true;
		requestAnimationFrame(() => {
			rafScheduled = false;
			if (canvasNode) draw(canvasNode);
		});
	}

	function draw(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const theme = getPlotTheme();

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		const w = rect.width * dpr;
		const h = rect.height * dpr;
		canvas.width = w;
		canvas.height = h;

		const yA = fA;
		const rangeY = rangeX * (h / w);
		const yMin = yA - rangeY;
		const yMax = yA + rangeY;

		const toX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
		const toY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = theme.background;
		ctx.fillRect(0, 0, w, h);

		ctx.strokeStyle = theme.grid;
		ctx.lineWidth = 0.5 * dpr;
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

		if (xMin <= 0 && xMax >= 0) {
			ctx.strokeStyle = theme.axis;
			ctx.lineWidth = 1 * dpr;
			ctx.beginPath();
			ctx.moveTo(toX(0), 0);
			ctx.lineTo(toX(0), h);
			ctx.stroke();
		}
		if (yMin <= 0 && yMax >= 0) {
			ctx.strokeStyle = theme.axis;
			ctx.lineWidth = 1 * dpr;
			ctx.beginPath();
			ctx.moveTo(0, toY(0));
			ctx.lineTo(w, toY(0));
			ctx.stroke();
		}

		ctx.strokeStyle = theme.blue;
		ctx.lineWidth = 2.2 * dpr;
		ctx.beginPath();
		let penDown = false;
		for (let i = 0; i <= 700; i += 1) {
			const x = xMin + ((xMax - xMin) * i) / 700;
			const y = curve.fn(x);
			const sx = toX(x);
			const sy = toY(y);
			if (!Number.isFinite(y) || sy < -h || sy > 2 * h) {
				penDown = false;
				continue;
			}
			if (!penDown) {
				ctx.moveTo(sx, sy);
				penDown = true;
			} else {
				ctx.lineTo(sx, sy);
			}
		}
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = theme.violet;
		ctx.lineWidth = 1.8 * dpr;
		ctx.setLineDash([8 * dpr, 6 * dpr]);
		const yLeft = yA + slopeA * (xMin - a);
		const yRight = yA + slopeA * (xMax - a);
		ctx.moveTo(toX(xMin), toY(yLeft));
		ctx.lineTo(toX(xMax), toY(yRight));
		ctx.stroke();
		ctx.setLineDash([]);

		const x2 = toX(xShifted);
		const yActual = toY(fShifted);
		const yPred = toY(predicted);
		const connTop = Math.min(yActual, yPred);
		const connHeight = Math.abs(yActual - yPred);

		ctx.fillStyle = theme.rose;
		ctx.fillRect(x2 - 1.8 * dpr, connTop, 3.6 * dpr, connHeight);

		ctx.beginPath();
		ctx.fillStyle = theme.amber;
		ctx.arc(x2, yActual, 5.7 * dpr, 0, Math.PI * 2);
		ctx.fill();

		const yDim = Math.min(h - 24 * dpr, Math.max(toY(0) + 18 * dpr, h * 0.78));
		const xA = toX(a);
		ctx.strokeStyle = theme.muted;
		ctx.lineWidth = 1.7 * dpr;
		ctx.beginPath();
		ctx.moveTo(xA, yDim);
		ctx.lineTo(x2, yDim);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(xA, yDim - 5 * dpr);
		ctx.lineTo(xA, yDim + 5 * dpr);
		ctx.moveTo(x2, yDim - 5 * dpr);
		ctx.lineTo(x2, yDim + 5 * dpr);
		ctx.stroke();

		ctx.fillStyle = theme.muted;
		ctx.font = `${13 * dpr}px var(--font-serif)`;
		ctx.textAlign = 'center';
		ctx.fillText('a', xA, yDim + 20 * dpr);
		ctx.fillText('a+Δx', x2, yDim + 20 * dpr);
		ctx.fillText('Δx', (xA + x2) / 2, yDim - 8 * dpr);
	}

	onMount(() => {
		canvasNode = document.getElementById(canvasId) as HTMLCanvasElement | null;
		wrapperNode = canvasNode?.parentElement as HTMLDivElement | null;
		if (!canvasNode || !wrapperNode) return;

		resizeObserver = new ResizeObserver(() => requestDraw());
		resizeObserver.observe(wrapperNode);
		window.addEventListener(THEME_CHANGE_EVENT, requestDraw);
		requestDraw();

		return () => {
			window.removeEventListener(THEME_CHANGE_EVENT, requestDraw);
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
			canvasNode = null;
			wrapperNode = null;
		};
	});
</script>

<div class="demo-container slope-shell">
	<div class="equation-row">
		<div class="equation-main"><Katex math={String.raw`f(a+\Delta x)\approx f(a)+f'(a)\Delta x`} /></div>
		<div class="equation-sub"><Katex math={'f(x)=' + curve.tex} /></div>
	</div>

	<div class="plot-key" aria-label="Plot key">
		<span><i class="key-line curve"></i>curve</span>
		<span><i class="key-line tangent"></i>local line</span>
		<span><i class="key-line point"></i>exact value</span>
		<span><i class="key-line gap"></i>deviation</span>
	</div>

	<div class="canvas-wrapper">
		<canvas
			id={canvasId}
			aria-label="The curve, its local line at a, and the deviation at a plus delta x"
		></canvas>
	</div>

	<div class="reading-row" aria-live="polite">
		<div class="reading"><span>Exact <Katex math={String.raw`f(a+\Delta x)`} /></span><strong>{leftValue}</strong></div>
		<div class="reading"><span>Local line <Katex math={String.raw`f(a)+f'(a)\Delta x`} /></span><strong>{rightValue}</strong></div>
		<div class="reading deviation"><span>Absolute deviation</span><strong>{devAbsValue}</strong></div>
	</div>

	<div class="controls-panel">
		<div class="toolbar">
			<span class="toolbar-lbl">Zoom</span>
			<input
				type="range"
				min="0"
				max="100"
				step="0.5"
				bind:value={zoomSlider}
				oninput={requestDraw}
				class="toolbar-slider demo-slider tone-violet"
				style={`--slider-progress: ${zoomSlider}%`}
				aria-label="Zoom level"
			/>
			<span class="toolbar-val">{zoom.toFixed(zoom < 10 ? 1 : 0)}x</span>
		</div>

		<div class="toolbar">
			<span class="toolbar-lbl">a</span>
			<input
				type="range"
				min="0"
				max="1000"
				step="1"
				bind:value={pointSlider}
				oninput={requestDraw}
				class="toolbar-slider demo-slider tone-blue"
				style={`--slider-progress: ${pointSlider / 10}%`}
				aria-label="Base point a"
			/>
			<span class="toolbar-val">{a.toFixed(3)}</span>
		</div>

		<div class="toolbar">
			<span class="toolbar-lbl">Δx</span>
			<input
				type="range"
				min="-180"
				max="180"
				step="1"
				bind:value={deltaSlider}
				oninput={requestDraw}
				class="toolbar-slider demo-slider tone-amber"
				style={`--slider-progress: ${(deltaSlider + 180) / 3.6}%`}
				aria-label="Finite input step delta x"
			/>
			<span class="toolbar-val">{deltaValue}</span>
		</div>
	</div>
</div>

<style>
	.slope-shell {
		font-family: var(--font-sans);
		margin-block: var(--space-lg);
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		box-shadow: none;
	}

	.equation-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 0 0.15rem 0.65rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.equation-main :global(.katex) {
		font-size: clamp(0.95em, 2.5vw, 1.22em);
		color: var(--color-d);
		white-space: nowrap;
	}

	.equation-sub :global(.katex) {
		font-size: 0.92em;
		color: var(--color-ink-light);
		white-space: nowrap;
	}

	.reading-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin: 0.72rem 0 0.55rem;
		border-block: 1px solid var(--color-border-light);
	}

	.reading {
		display: grid;
		gap: 0.12rem;
		padding: 0.55rem 0.7rem;
		text-align: center;
		border-right: 1px solid var(--color-border-light);
	}

	.reading:last-child {
		border-right: 0;
	}

	.reading span {
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}

	.reading strong {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	.reading.deviation strong {
		color: var(--plot-error);
	}

	.plot-key {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.45rem 1rem;
		margin: 0.55rem 0 0.4rem;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--color-ink-faint);
	}

	.plot-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.36rem;
	}

	.plot-key :global(.katex) {
		font-size: 0.96em;
	}

	.key-line {
		display: inline-block;
		width: 1.3rem;
		height: 0.18rem;
		border-radius: 999px;
	}

	.key-line.curve {
		background: var(--plot-curve);
	}

	.key-line.tangent {
		background: var(--plot-tangent);
	}

	.key-line.point {
		width: 0.48rem;
		height: 0.48rem;
		background: var(--plot-point);
	}

	.key-line.gap {
		background: var(--plot-error);
	}

	.canvas-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		position: relative;
		margin: 0.35rem 0 0.72rem;
		background: var(--plot-background);
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.controls-panel {
		display: grid;
		gap: 0.12rem;
		padding: 0.25rem 0.15rem 0;
	}

	.toolbar {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.7rem;
		padding: 0.28rem 0;
	}

	.toolbar-lbl {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		color: var(--color-ink-light);
		white-space: nowrap;
		min-width: 2rem;
	}

	.toolbar-slider {
		min-width: 0;
	}

	.toolbar-val {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-d);
		min-width: 6.2em;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 760px) {
		.equation-row {
			align-items: center;
			flex-direction: column;
			gap: 0.2rem;
		}

		.reading-row {
			grid-template-columns: 1fr;
		}

		.reading {
			grid-template-columns: 1fr auto;
			align-items: baseline;
			text-align: left;
			border-right: 0;
			border-bottom: 1px solid var(--color-border-light);
		}

		.reading:last-child {
			border-bottom: 0;
		}

		.toolbar-val {
			min-width: 5.2em;
		}
	}
</style>
