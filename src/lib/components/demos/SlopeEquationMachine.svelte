<script lang="ts">
	import { onMount } from 'svelte';
	import Katex from '$lib/components/Katex.svelte';

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
	let dSlider = $state(42);

	let a = $derived(curve.xRange[0] + (pointSlider / 1000) * (curve.xRange[1] - curve.xRange[0]));
	let rangeX = $derived(4 / zoom);
	let xMin = $derived(a - rangeX);
	let xMax = $derived(a + rangeX);

	let dRaw = $derived((dSlider / 100) * rangeX * 0.9);
	let xShifted = $derived(clamp(a + dRaw, xMin, xMax));
	let d = $derived(xShifted - a);

	let fA = $derived(curve.fn(a));
	let fShifted = $derived(curve.fn(xShifted));
	let slopeA = $derived(curve.dfn(a));
	let predicted = $derived(fA + slopeA * d);
	let actualChange = $derived(fShifted - fA);
	let linearChange = $derived(slopeA * d);
	let deviation = $derived(fShifted - predicted);

	let leftValue = $derived(num(fShifted));
	let rightValue = $derived(num(predicted));
	let devAbsValue = $derived(num(Math.abs(deviation), 7));
	let dValue = $derived(num(d));
	let changeValue = $derived(num(actualChange));
	let linearValue = $derived(num(linearChange));

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
		ctx.fillStyle = '#FDFBF7';
		ctx.fillRect(0, 0, w, h);

		ctx.strokeStyle = '#f0ece4';
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
			ctx.strokeStyle = '#d4d0c8';
			ctx.lineWidth = 1 * dpr;
			ctx.beginPath();
			ctx.moveTo(toX(0), 0);
			ctx.lineTo(toX(0), h);
			ctx.stroke();
		}
		if (yMin <= 0 && yMax >= 0) {
			ctx.strokeStyle = '#d4d0c8';
			ctx.lineWidth = 1 * dpr;
			ctx.beginPath();
			ctx.moveTo(0, toY(0));
			ctx.lineTo(w, toY(0));
			ctx.stroke();
		}

		ctx.strokeStyle = '#7c3aed';
		ctx.lineWidth = 2.6 * dpr;
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
		ctx.strokeStyle = '#f97316';
		ctx.lineWidth = 2.1 * dpr;
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

		ctx.fillStyle = '#2563eb';
		ctx.fillRect(x2 - 1.8 * dpr, connTop, 3.6 * dpr, connHeight);

		ctx.beginPath();
		ctx.fillStyle = '#2563eb';
		ctx.arc(x2, yActual, 5.7 * dpr, 0, Math.PI * 2);
		ctx.fill();

		const yDim = Math.min(h - 24 * dpr, Math.max(toY(0) + 18 * dpr, h * 0.78));
		const xA = toX(a);
		ctx.strokeStyle = '#64748b';
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

		ctx.fillStyle = '#64748b';
		ctx.font = `${13 * dpr}px var(--font-serif)`;
		ctx.textAlign = 'center';
		ctx.fillText('a', xA, yDim + 20 * dpr);
		ctx.fillText('a+d', x2, yDim + 20 * dpr);
		ctx.fillText('d', (xA + x2) / 2, yDim - 8 * dpr);
	}

	onMount(() => {
		canvasNode = document.getElementById(canvasId) as HTMLCanvasElement | null;
		wrapperNode = canvasNode?.parentElement as HTMLDivElement | null;
		if (!canvasNode || !wrapperNode) return;

		resizeObserver = new ResizeObserver(() => requestDraw());
		resizeObserver.observe(wrapperNode);
		requestDraw();

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
				resizeObserver = null;
			}
			canvasNode = null;
			wrapperNode = null;
		};
	});
</script>

<div class="demo-container content-width">
	<div class="demo-label">Explore local linearization on a strongly curved smooth function</div>

	<div class="equation-block">
		<div class="equation-main"><Katex math="f(a+d)=f(a)+f'(a)d" /></div>
		<div class="equation-sub"><Katex math={"f(x)=" + curve.tex} /></div>
	</div>

	<div class="verify-row" aria-live="polite">
		<div class="verify-cell">
			<span class="verify-label">f(a+d)</span>
			<span class="verify-value">{leftValue}</span>
		</div>
		<div class="verify-cell">
			<span class="verify-label">f(a)+f'(a)d</span>
			<span class="verify-value">{rightValue}</span>
		</div>
		<div class="verify-cell">
			<span class="verify-label">abs deviation</span>
			<span class="verify-value">{devAbsValue}</span>
		</div>
	</div>

	<div class="canvas-wrapper">
		<canvas id={canvasId}></canvas>
	</div>

	<div class="stats-row" aria-live="polite">
		<div class="stat-cell"><span>d</span><strong>{dValue}</strong></div>
		<div class="stat-cell"><span>f(a+d)-f(a)</span><strong>{changeValue}</strong></div>
		<div class="stat-cell"><span>f'(a)d</span><strong>{linearValue}</strong></div>
	</div>

	<div class="toolbar">
		<span class="toolbar-lbl">Zoom</span>
		<input
			type="range"
			min="0"
			max="100"
			step="0.5"
			bind:value={zoomSlider}
			oninput={requestDraw}
			class="toolbar-slider"
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
			class="toolbar-slider"
		/>
		<span class="toolbar-val">{a.toFixed(3)}</span>
	</div>

	<div class="toolbar">
		<span class="toolbar-lbl">d</span>
		<input
			type="range"
			min="-180"
			max="180"
			step="1"
			bind:value={dSlider}
			oninput={requestDraw}
			class="toolbar-slider"
		/>
		<span class="toolbar-val">{dValue}</span>
	</div>
</div>

<style>
	.demo-label {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		margin-bottom: 0.6rem;
	}

	.equation-block {
		display: grid;
		gap: 0.35rem;
		justify-items: center;
		margin-bottom: 0.55rem;
	}

	.equation-main :global(.katex) {
		font-size: 1.3em;
		color: var(--color-d);
	}

	.equation-sub :global(.katex) {
		font-size: 1.05em;
		color: var(--color-ink-light);
	}

	.verify-row,
	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		margin-bottom: 0.6rem;
	}

	.verify-cell,
	.stat-cell {
		display: grid;
		gap: 0.18rem;
		align-items: center;
		justify-items: center;
		padding: 0.55rem 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.55rem;
		background: #faf8ff;
	}

	.verify-label,
	.stat-cell span {
		font-family: var(--font-sans);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.verify-value,
	.stat-cell strong {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	.toolbar {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.33rem 0;
	}

	.toolbar-lbl {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
		min-width: 2rem;
	}

	.toolbar-slider {
		flex: 1;
		accent-color: var(--color-d);
		cursor: pointer;
		height: 4px;
	}

	.toolbar-val {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-d);
		min-width: 5.3em;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.canvas-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
		position: relative;
		margin: 0.3rem 0 0.65rem;
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	@media (max-width: 760px) {
		.verify-row,
		.stats-row {
			grid-template-columns: 1fr;
		}

		.verify-value,
		.stat-cell strong {
			font-size: 0.84rem;
		}
	}
</style>
