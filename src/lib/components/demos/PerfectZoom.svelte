<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let mounted = $state(false);

	const curves = {
		parabola: {
			fn: (x: number) => x * x,
			dfn: (x: number) => 2 * x,
			label: 'x²',
			cx: 1
		},
		sine: {
			fn: (x: number) => Math.sin(x),
			dfn: (x: number) => Math.cos(x),
			label: 'sin(x)',
			cx: Math.PI / 4
		},
		cubic: {
			fn: (x: number) => x * x * x - x,
			dfn: (x: number) => 3 * x * x - 1,
			label: 'x³ − x',
			cx: 0.8
		},
		sqrt: {
			fn: (x: number) => Math.sqrt(Math.max(x, 0.001)),
			dfn: (x: number) => 1 / (2 * Math.sqrt(Math.max(x, 0.001))),
			label: '√x',
			cx: 1
		}
	} as const;

	let zoomSlider = $state(0);
	let zoom = $derived(Math.pow(10, (zoomSlider / 100) * 3));
	let showTangent = $state(true);
	let selectedCurve = $state<keyof typeof curves>('parabola');
	let centerX = $derived(curves[selectedCurve].cx);

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

		const curve = curves[selectedCurve];
		const cx = centerX;
		const cy = curve.fn(cx);

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

		// Tangent line (drawn first, below curve)
		if (showTangent) {
			const slope = curve.dfn(cx);
			const tangentY = (x: number) => cy + slope * (x - cx);
			ctx.beginPath();
			ctx.strokeStyle = zoom >= 80 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(168, 85, 247, 0.45)';
			ctx.lineWidth = (zoom >= 80 ? 3 : 2) * dpr;
			ctx.setLineDash(zoom >= 80 ? [] : [8 * dpr, 6 * dpr]);
			ctx.moveTo(toX(xMin), toY(tangentY(xMin)));
			ctx.lineTo(toX(xMax), toY(tangentY(xMax)));
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Curve
		const isConverged = zoom >= 80;
		ctx.beginPath();
		ctx.strokeStyle = isConverged ? '#a855f7' : '#1a1a2e';
		ctx.lineWidth = 2.5 * dpr;
		const steps = 600;
		for (let i = 0; i <= steps; i++) {
			const x = xMin + ((xMax - xMin) * i) / steps;
			const y = curve.fn(x);
			if (i === 0) ctx.moveTo(toX(x), toY(y));
			else ctx.lineTo(toX(x), toY(y));
		}
		ctx.stroke();

		// Center point
		ctx.beginPath();
		ctx.fillStyle = '#a855f7';
		ctx.arc(toX(cx), toY(cy), 5 * dpr, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = 'white';
		ctx.arc(toX(cx), toY(cy), 2.5 * dpr, 0, Math.PI * 2);
		ctx.fill();

		// Zoom label
		ctx.fillStyle = '#94919b';
		ctx.font = `${12 * dpr}px Inter, system-ui, sans-serif`;
		ctx.textAlign = 'left';
		ctx.fillText(`${zoom.toFixed(zoom < 10 ? 1 : 0)}× zoom`, 12 * dpr, 20 * dpr);

		const windowSize = (rangeX * 2).toExponential(1);
		ctx.fillText(`window: ${windowSize}`, 12 * dpr, 36 * dpr);
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
		// Re-draw when reactive dependencies change
		selectedCurve;
		zoomSlider;
		showTangent;
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

<div class="demo-container wide-width">
	<div class="demo-label">Interactive — The Perfect Zoom</div>

	<div class="flex flex-wrap gap-2 mb-4" role="tablist">
		{#each Object.entries(curves) as [key, c]}
			<button
				role="tab"
				aria-selected={selectedCurve === key}
				class="curve-tab"
				class:active={selectedCurve === key}
				onclick={() => {
					selectedCurve = key as keyof typeof curves;
					zoomSlider = 0;
				}}
			>
				{c.label}
			</button>
		{/each}
	</div>

	<div bind:this={container} class="canvas-wrapper">
		<canvas bind:this={canvas}></canvas>
	</div>

	<div class="controls">
		<div class="zoom-control">
			<label for="zoom-slider" class="control-label">
				<span>Zoom</span>
				<span class="zoom-value">{zoom.toFixed(zoom < 10 ? 1 : 0)}×</span>
			</label>
			<input
				id="zoom-slider"
				type="range"
				min="0"
				max="100"
				step="0.5"
				bind:value={zoomSlider}
				class="zoom-slider"
			/>
			<div class="zoom-labels">
				<span>1×</span>
				<span>the everyday scale</span>
				<span>1000×</span>
			</div>
		</div>

		<label class="tangent-toggle">
			<input type="checkbox" bind:checked={showTangent} />
			<span>Show tangent line</span>
		</label>
	</div>

	{#if zoom >= 80 && zoom < 400}
		<div class="zoom-message converging">
			The curve and its tangent line are becoming indistinguishable.
		</div>
	{/if}

	{#if zoom >= 400}
		<div class="zoom-message converged">
			At this scale, the curve <strong>is</strong> its tangent. This is <em>microstraightness</em>
			— the foundational truth of Neocalculus.
		</div>
	{/if}
</div>

<style>
	.canvas-wrapper {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border-light);
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.controls {
		margin-top: 1.25rem;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 1.5rem;
	}

	.zoom-control {
		flex: 1;
		min-width: 250px;
	}

	.control-label {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-ink-light);
		margin-bottom: 0.4rem;
	}

	.zoom-value {
		color: var(--color-d);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	.zoom-slider {
		width: 100%;
		accent-color: var(--color-d);
		height: 6px;
		border-radius: 3px;
		cursor: pointer;
	}

	.zoom-labels {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--color-ink-faint);
		margin-top: 0.25rem;
	}

	.tangent-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--color-ink-light);
		cursor: pointer;
		margin-top: 0.25rem;
	}

	.tangent-toggle input {
		accent-color: var(--color-d);
	}

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
