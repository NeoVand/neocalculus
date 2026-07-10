<script lang="ts">
	import { onMount } from 'svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';

	let canvasSin: HTMLCanvasElement | undefined;
	let canvasCos: HTMLCanvasElement | undefined;

	const D_MIN = 0.005;
	const D_MAX = 1.2;

	let angleSlider = $state(70);
	// Map slider: 100 → 1.2 rad (big), 0 → 0.005 rad (tiny). Logarithmic.
	let angle = $derived(D_MIN * Math.pow(D_MAX / D_MIN, angleSlider / 100));
	let sineRatio = $derived(Math.sin(angle) / angle);
	let cosineRatio = $derived((1 - Math.cos(angle)) / angle);

	function redraw() {
		drawSine();
		drawCosine();
	}

	function attachCanvasSin(node: HTMLCanvasElement) {
		canvasSin = node;
		requestAnimationFrame(redraw);
		return () => {
			if (canvasSin === node) canvasSin = undefined;
		};
	}

	function attachCanvasCos(node: HTMLCanvasElement) {
		canvasCos = node;
		requestAnimationFrame(redraw);
		return () => {
			if (canvasCos === node) canvasCos = undefined;
		};
	}

	function observeResize(node: HTMLDivElement) {
		const observer = new ResizeObserver(redraw);
		observer.observe(node);
		requestAnimationFrame(redraw);
		return () => observer.disconnect();
	}

	function drawSine() {
		if (!canvasSin) return;
		const ctx = canvasSin.getContext('2d')!;
		const theme = getPlotTheme();
		const dpr = window.devicePixelRatio || 1;
		const rect = canvasSin.getBoundingClientRect();
		const W = rect.width * dpr;
		const H = rect.height * dpr;
		canvasSin.width = W;
		canvasSin.height = H;

		const theta = angle;
		const sinTheta = Math.sin(theta);
		const cosTheta = Math.cos(theta);

		// Arc-focused camera:
		// large d => near full-circle view; tiny d => zoom into the short arc near x = 1.
		const tLarge = (Math.log(theta) - Math.log(D_MIN)) / (Math.log(D_MAX) - Math.log(D_MIN));
		const clampedLarge = Math.max(0, Math.min(1, tLarge));
		const tinyProgress = 1 - clampedLarge; // 0 at large d, 1 at infinitesimal d

		const fullRange = 2.6;
		const zoomPow = 0.88;
		const zoomFactor = Math.pow(D_MAX / theta, zoomPow);
		const vRange = Math.max(0.03, fullRange / zoomFactor);

		// Focus around the arc midpoint, with smooth center shift.
		const mid = theta / 2;
		const arcFocusX = (1 + Math.cos(mid)) / 2;
		const arcFocusY = Math.sin(mid) * 0.55;
		// Shift center toward the arc early enough so the arc never leaves frame.
		const centerBlend = Math.pow(tinyProgress, 0.25);
		let viewCx = arcFocusX * centerBlend;
		let viewCy = arcFocusY * centerBlend;

		// Hard-constraint: keep the whole highlighted arc segment inside the viewport.
		const xArcMin = Math.min(cosTheta, 1);
		const xArcMax = 1;
		const yArcMin = 0;
		const yArcMax = sinTheta;
		const pad = Math.max(0.018, vRange * 0.12);

		const minCx = xArcMax + pad - vRange / 2;
		const maxCx = xArcMin - pad + vRange / 2;
		if (minCx <= maxCx) {
			viewCx = Math.min(maxCx, Math.max(minCx, viewCx));
		} else {
			viewCx = (xArcMin + xArcMax) / 2;
		}

		const minCy = yArcMax + pad - vRange / 2;
		const maxCy = yArcMin - pad + vRange / 2;
		if (minCy <= maxCy) {
			viewCy = Math.min(maxCy, Math.max(minCy, viewCy));
		} else {
			viewCy = (yArcMin + yArcMax) / 2;
		}
		const vxMin = viewCx - vRange / 2;
		const vxMax = viewCx + vRange / 2;
		const vyMin = viewCy - vRange / 2;
		const vyMax = viewCy + vRange / 2;

		const toX = (x: number) => ((x - vxMin) / (vxMax - vxMin)) * W;
		const toY = (y: number) => H - ((y - vyMin) / (vyMax - vyMin)) * H;

		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = theme.background;
		ctx.fillRect(0, 0, W, H);

		// x-axis
		ctx.strokeStyle = theme.axis;
		ctx.lineWidth = 1 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(vxMin), toY(0));
		ctx.lineTo(toX(vxMax), toY(0));
		ctx.stroke();

		// Full unit circle (thin, as context)
		const cx = toX(0),
			cy = toY(0);
		const rPx = toX(1) - toX(0);
		ctx.strokeStyle = theme.axis;
		ctx.lineWidth = 1.35 * dpr;
		ctx.beginPath();
		ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
		ctx.stroke();

		// Radius line from origin to point on circle
		ctx.strokeStyle = theme.muted;
		ctx.lineWidth = 1.2 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(0), toY(0));
		ctx.lineTo(toX(cosTheta), toY(sinTheta));
		ctx.stroke();

		// The highlighted arc from (1,0) to (cos d, sin d) — PURPLE
		ctx.strokeStyle = theme.violet;
		ctx.lineWidth = (2.8 + 0.8 * tinyProgress) * dpr;
		ctx.beginPath();
		ctx.arc(cx, cy, rPx, -theta, 0);
		ctx.stroke();

		// The sin(d) vertical line: from (cos d, 0) to (cos d, sin d) — RED
		ctx.strokeStyle = theme.rose;
		ctx.lineWidth = 3 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(cosTheta), toY(0));
		ctx.lineTo(toX(cosTheta), toY(sinTheta));
		ctx.stroke();

		// Points
		ctx.fillStyle = theme.ink;
		ctx.beginPath();
		ctx.arc(toX(1), toY(0), 3 * dpr, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = theme.violet;
		ctx.beginPath();
		ctx.arc(toX(cosTheta), toY(sinTheta), 4 * dpr, 0, Math.PI * 2);
		ctx.fill();

		// Labels — sin d on the LEFT of the red line, arc label on the RIGHT
		ctx.font = `600 ${11 * dpr}px Inter, system-ui, sans-serif`;

		// "sin d" label — to the LEFT of the vertical red line
		ctx.fillStyle = theme.rose;
		ctx.textAlign = 'right';
		ctx.fillText('sin θ', toX(cosTheta) - 6 * dpr, toY(sinTheta / 2));

		// "arc = d" label — to the RIGHT of the arc
		ctx.fillStyle = theme.violet;
		ctx.textAlign = 'center';
		const midAngle = theta / 2;
		const labelR = 1 + vRange * 0.05;
		const arcLabelX = Math.min(W - 38 * dpr, Math.max(38 * dpr, toX(Math.cos(midAngle) * labelR)));
		const arcLabelY = Math.max(24 * dpr, toY(Math.sin(midAngle) * labelR) - 6 * dpr);
		ctx.fillText('arc = θ', arcLabelX, arcLabelY);

		// Difference percentage
		const diff = Math.abs(theta - sinTheta);
		const pct = theta > 0 ? (diff / theta) * 100 : 0;
		ctx.fillStyle = theme.muted;
		ctx.font = `${10 * dpr}px Inter, system-ui, sans-serif`;
		ctx.textAlign = 'right';
		ctx.fillText(`diff: ${pct.toFixed(pct < 0.1 ? 3 : 1)}%`, W - 6 * dpr, 14 * dpr);

		// Zoom badge to make scale changes explicit.
		const visibleZoom = fullRange / vRange;
		ctx.textAlign = 'left';
		ctx.fillStyle = theme.muted;
		ctx.fillText(
			`zoom ×${visibleZoom >= 10 ? visibleZoom.toFixed(0) : visibleZoom.toFixed(1)}`,
			6 * dpr,
			14 * dpr
		);
	}

	function drawCosine() {
		if (!canvasCos) return;
		const ctx = canvasCos.getContext('2d')!;
		const theme = getPlotTheme();
		const dpr = window.devicePixelRatio || 1;
		const rect = canvasCos.getBoundingClientRect();
		const W = rect.width * dpr;
		const H = rect.height * dpr;
		canvasCos.width = W;
		canvasCos.height = H;

		const theta = angle;
		const cosTheta = Math.cos(theta);
		const sinTheta = Math.sin(theta);

		// Fixed view: show the full unit circle, no zoom.
		const pad = 0.35;
		const vMin = -1 - pad;
		const vMax = 1 + pad;
		const vRange = vMax - vMin;

		const toX = (x: number) => ((x - vMin) / vRange) * W;
		const toY = (y: number) => H - ((y - vMin) / vRange) * H;

		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = theme.background;
		ctx.fillRect(0, 0, W, H);

		// Axes
		ctx.strokeStyle = theme.axis;
		ctx.lineWidth = 1 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(vMin), toY(0));
		ctx.lineTo(toX(vMax), toY(0));
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(toX(0), toY(vMin));
		ctx.lineTo(toX(0), toY(vMax));
		ctx.stroke();

		// Full unit circle
		const cx = toX(0),
			cy = toY(0);
		const rPx = toX(1) - toX(0);
		ctx.strokeStyle = theme.axis;
		ctx.lineWidth = 1.8 * dpr;
		ctx.beginPath();
		ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
		ctx.stroke();

		// Radius line from origin to point on circle (thin)
		ctx.strokeStyle = theme.muted;
		ctx.lineWidth = 1.2 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(0), toY(0));
		ctx.lineTo(toX(cosTheta), toY(sinTheta));
		ctx.stroke();

		// cos(d) horizontal segment: from origin to (cos d, 0) — BLUE, thick
		ctx.strokeStyle = theme.blue;
		ctx.lineWidth = 3.5 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(0), toY(0));
		ctx.lineTo(toX(cosTheta), toY(0));
		ctx.stroke();

		// Dashed vertical from (cos d, 0) up to (cos d, sin d)
		ctx.strokeStyle = theme.muted;
		ctx.lineWidth = 1 * dpr;
		ctx.setLineDash([4 * dpr, 3 * dpr]);
		ctx.beginPath();
		ctx.moveTo(toX(cosTheta), toY(0));
		ctx.lineTo(toX(cosTheta), toY(sinTheta));
		ctx.stroke();
		ctx.setLineDash([]);

		// Tick mark at x = 1 on the axis
		ctx.strokeStyle = theme.muted;
		ctx.lineWidth = 1 * dpr;
		ctx.beginPath();
		ctx.moveTo(toX(1), toY(0) - 4 * dpr);
		ctx.lineTo(toX(1), toY(0) + 4 * dpr);
		ctx.stroke();

		// Points
		ctx.fillStyle = theme.blue;
		ctx.beginPath();
		ctx.arc(toX(cosTheta), toY(0), 4 * dpr, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = theme.violet;
		ctx.beginPath();
		ctx.arc(toX(cosTheta), toY(sinTheta), 4 * dpr, 0, Math.PI * 2);
		ctx.fill();

		// Labels
		ctx.font = `600 ${11 * dpr}px Inter, system-ui, sans-serif`;

		// "cos d" below the blue segment
		ctx.fillStyle = theme.blue;
		ctx.textAlign = 'center';
		ctx.fillText('cos θ', toX(cosTheta / 2), toY(0) + 18 * dpr);

		// "1" at the tick mark
		ctx.fillStyle = theme.muted;
		ctx.font = `${10 * dpr}px Inter, system-ui, sans-serif`;
		ctx.textAlign = 'center';
		ctx.fillText('1', toX(1), toY(0) + 18 * dpr);

		// cos(d) value in top corner
		ctx.font = `${10 * dpr}px Inter, system-ui, sans-serif`;
		ctx.textAlign = 'right';
		ctx.fillStyle = theme.muted;
		ctx.fillText(`cos θ = ${cosTheta.toFixed(4)}`, W - 6 * dpr, 14 * dpr);
	}

	onMount(() => {
		window.addEventListener(THEME_CHANGE_EVENT, redraw);
		return () => window.removeEventListener(THEME_CHANGE_EVENT, redraw);
	});
</script>

<div class="demo-container content-width">
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
		Explore: finite angles approaching first order
	</div>

	<div class="slider-row" style="margin-bottom: 1rem;">
		<label class="slider-label" for="infinitesimal-trig-angle">
			<span>Angle <strong style="color: var(--color-d)">θ</strong></span>
			<span class="slider-value"
				>{angle < 0.01 ? angle.toExponential(1) : angle.toFixed(3)} rad</span
			>
		</label>
		<input
			id="infinitesimal-trig-angle"
			type="range"
			min="0"
			max="100"
			step="0.5"
			bind:value={angleSlider}
			oninput={redraw}
			class="slider demo-slider tone-violet"
			style={`--slider-progress: ${angleSlider}%`}
			aria-label="Finite angle theta"
		/>
		<div class="slider-labels">
			<span>← near zero</span>
			<span>large →</span>
		</div>
	</div>

	<div class="ratio-strip" aria-live="polite">
		<div>
			<span class="ratio-name">first-order ratio</span>
			<span class="ratio-math">sin θ / θ</span>
			<strong>{sineRatio.toFixed(5)}</strong>
			<small>tends to 1</small>
		</div>
		<div>
			<span class="ratio-name">discarded ratio</span>
			<span class="ratio-math">(1 − cos θ) / θ</span>
			<strong>{cosineRatio.toFixed(5)}</strong>
			<small>tends to 0</small>
		</div>
	</div>

	<div class="panels">
		<div class="panel">
			<div class="panel-title">sin(θ) versus arc length θ</div>
			<div {@attach observeResize} class="canvas-wrap">
				<canvas
					{@attach attachCanvasSin}
					aria-label="Unit-circle arc theta compared with the vertical coordinate sine theta"
				></canvas>
			</div>
			<p class="panel-subtitle">
				The <strong style="color:var(--plot-rose)">red line</strong> (sin θ) and the
				<strong style="color:var(--plot-violet)">purple arc</strong> (length θ) approach one another as θ shrinks.
			</p>
		</div>
		<div class="panel">
			<div class="panel-title">cos(θ) versus 1</div>
			<div {@attach observeResize} class="canvas-wrap">
				<canvas
					{@attach attachCanvasCos}
					aria-label="Unit-circle horizontal coordinate cosine theta compared with one"
				></canvas>
			</div>
			<p class="panel-subtitle">
				The <strong style="color:var(--plot-blue)">blue gap</strong> (1 − cos θ) shrinks faster than θ. The first-order
				model discards this gap.
			</p>
		</div>
	</div>
</div>

<style>
	.panels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.panel {
		min-width: 0;
	}

	.panel-title {
		font-family: var(--font-sans);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--color-ink-light);
		text-align: center;
		margin-bottom: 0.4rem;
	}

	.canvas-wrap {
		aspect-ratio: 1;
		border: 1px solid var(--color-border-light);
		border-radius: 0.8rem;
		overflow: hidden;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.panel-subtitle {
		font-family: var(--font-sans);
		font-size: 0.76rem;
		color: var(--color-ink-faint);
		text-align: center;
		margin-top: 0.4rem;
		line-height: 1.45;
	}

	.slider-row {
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.slider-label {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-sans);
		font-size: 0.82rem;
		color: var(--color-ink-light);
		margin-bottom: 0.25rem;
	}

	.slider-value {
		color: var(--color-d);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		font-family: var(--font-mono);
		font-size: 0.78rem;
	}

	.slider {
		width: 100%;
	}

	.ratio-strip {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.7rem;
		margin: -0.2rem 0 1rem;
		padding: 0.68rem 0;
		border-bottom: 1px solid var(--color-border-light);
	}

	.ratio-strip > div {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: 0.08rem 0.5rem;
		min-width: 0;
	}

	.ratio-name,
	.ratio-strip small {
		font-family: var(--font-sans);
		font-size: 0.62rem;
		color: var(--color-ink-faint);
	}

	.ratio-name {
		text-transform: uppercase;
		letter-spacing: 0.09em;
	}

	.ratio-math {
		font-family: var(--font-serif);
		font-size: 0.88rem;
		color: var(--color-ink-light);
	}

	.ratio-strip strong {
		grid-row: 1 / 3;
		grid-column: 2;
		font-family: var(--font-mono);
		font-size: 0.88rem;
		color: var(--color-d);
		font-variant-numeric: tabular-nums;
	}

	.ratio-strip small {
		grid-column: 1;
	}

	.slider-labels {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-sans);
		font-size: 0.68rem;
		color: var(--color-ink-faint);
		margin-top: 0.1rem;
	}

	@media (max-width: 540px) {
		.panels {
			grid-template-columns: 1fr;
		}

		.ratio-strip {
			grid-template-columns: 1fr;
			gap: 0.45rem;
		}
	}
</style>
