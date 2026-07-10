<script lang="ts">
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import Katex from '$lib/components/Katex.svelte';
	import { getPlotTheme, THEME_CHANGE_EVENT } from '$lib/utils/theme';

	let canvas: HTMLCanvasElement | undefined;

	let x0 = $state(0.7);
	let y0 = $state(0.8);

	const a = 0.34;
	const b = 0.22;
	const f = (x: number, y: number) => a * x * x + b * y * y;

	const z0 = $derived(f(x0, y0));
	const fx = $derived(2 * a * x0);
	const fy = $derived(2 * b * y0);

	function project(x: number, y: number, z: number, W: number, H: number) {
		const sx = x * 72 + y * 34;
		const sy = -z * 94 + y * 18 - x * 22;
		return { x: W * 0.5 + sx, y: H * 0.66 + sy };
	}

	function drawArrow(
		ctx: CanvasRenderingContext2D,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
		lineWidth = 2
	) {
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		const ang = Math.atan2(y2 - y1, x2 - x1);
		const size = 7;
		ctx.beginPath();
		ctx.moveTo(x2, y2);
		ctx.lineTo(x2 - size * Math.cos(ang - 0.42), y2 - size * Math.sin(ang - 0.42));
		ctx.lineTo(x2 - size * Math.cos(ang + 0.42), y2 - size * Math.sin(ang + 0.42));
		ctx.closePath();
		ctx.fill();
	}

	function draw() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const theme = getPlotTheme();

		const dpr = window.devicePixelRatio || 1;
		const rect = canvas.getBoundingClientRect();
		const W = rect.width * dpr;
		const H = rect.height * dpr;
		canvas.width = W;
		canvas.height = H;

		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = theme.background;
		ctx.fillRect(0, 0, W, H);

		ctx.strokeStyle = theme.grid;
		ctx.lineWidth = 1.2;
		for (let xv = -2.2; xv <= 2.2; xv += 0.4) {
			ctx.beginPath();
			for (let yi = -2.2; yi <= 2.2; yi += 0.08) {
				const p = project(xv, yi, f(xv, yi), W, H);
				if (yi === -2.2) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
			}
			ctx.stroke();
		}
		for (let yv = -2.2; yv <= 2.2; yv += 0.4) {
			ctx.beginPath();
			for (let xi = -2.2; xi <= 2.2; xi += 0.08) {
				const p = project(xi, yv, f(xi, yv), W, H);
				if (xi === -2.2) ctx.moveTo(p.x, p.y);
				else ctx.lineTo(p.x, p.y);
			}
			ctx.stroke();
		}

		const patch: [number, number, number][] = [
			[x0 - 0.75, y0 - 0.75, z0 - fx * 0.75 - fy * 0.75],
			[x0 + 0.75, y0 - 0.75, z0 + fx * 0.75 - fy * 0.75],
			[x0 + 0.75, y0 + 0.75, z0 + fx * 0.75 + fy * 0.75],
			[x0 - 0.75, y0 + 0.75, z0 - fx * 0.75 + fy * 0.75]
		];

		ctx.beginPath();
		for (let i = 0; i < patch.length; i += 1) {
			const p = project(patch[i][0], patch[i][1], patch[i][2], W, H);
			if (i === 0) ctx.moveTo(p.x, p.y);
			else ctx.lineTo(p.x, p.y);
		}
		ctx.closePath();
		ctx.fillStyle = theme.violet;
		ctx.globalAlpha = 0.18;
		ctx.fill();
		ctx.globalAlpha = 0.78;
		ctx.strokeStyle = theme.violet;
		ctx.lineWidth = 1.4;
		ctx.stroke();
		ctx.globalAlpha = 1;

		const p0 = project(x0, y0, z0, W, H);
		ctx.fillStyle = theme.ink;
		ctx.beginPath();
		ctx.arc(p0.x, p0.y, 4.2, 0, Math.PI * 2);
		ctx.fill();

		const gradMag = Math.hypot(fx, fy) || 1;
		const gx = (fx / gradMag) * 0.95;
		const gy = (fy / gradMag) * 0.95;
		const gradEnd = project(x0 + gx, y0 + gy, z0 + fx * gx + fy * gy, W, H);
		drawArrow(ctx, p0.x, p0.y, gradEnd.x, gradEnd.y, theme.blue, 2.2);

		const nx = -fx;
		const ny = -fy;
		const nz = 1;
		const nmag = Math.hypot(nx, ny, nz);
		const normalEnd = project(x0 + (nx / nmag) * 0.9, y0 + (ny / nmag) * 0.9, z0 + (nz / nmag) * 0.9, W, H);
		drawArrow(ctx, p0.x, p0.y, normalEnd.x, normalEnd.y, theme.rose, 2.1);

		ctx.font = `${11 * dpr}px Inter, system-ui, sans-serif`;
		ctx.fillStyle = theme.blue;
		ctx.fillText('gradient direction', gradEnd.x + 6, gradEnd.y - 4);
		ctx.fillStyle = theme.rose;
		ctx.fillText('surface normal', normalEnd.x + 6, normalEnd.y - 4);
		ctx.fillStyle = theme.muted;
		ctx.fillText('purple patch: tangent plane', W * 0.05, H * 0.08);
	}

	function attachCanvas(node: HTMLCanvasElement) {
		canvas = node;
		requestAnimationFrame(draw);
		return () => {
			if (canvas === node) canvas = undefined;
		};
	}

	function scheduleDraw() {
		requestAnimationFrame(draw);
	}

	function observeSurface(node: HTMLDivElement) {
		const ro = new ResizeObserver(draw);
		ro.observe(node);
		window.addEventListener(THEME_CHANGE_EVENT, draw);
		requestAnimationFrame(draw);
		return () => {
			ro.disconnect();
			window.removeEventListener(THEME_CHANGE_EVENT, draw);
		};
	}

</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: 3D surface and tangent plane" />

	<DemoCard title="Point selection">
		<div class="demo-controls-grid">
			<SliderField
				id="surf3d-x0"
				label="x0"
				hint="Move the tangent point in x"
				min={-1.8}
				max={1.8}
				step={0.01}
				decimals={2}
				oninput={scheduleDraw}
				bind:value={x0}
			/>
			<SliderField
				id="surf3d-y0"
				label="y0"
				hint="Move the tangent point in y"
				min={-1.8}
				max={1.8}
				step={0.01}
				decimals={2}
				oninput={scheduleDraw}
				bind:value={y0}
			/>
		</div>
	</DemoCard>

	<DemoCard title="Surface z = 0.34x² + 0.22y²">
		<div class="surface-wrap" {@attach observeSurface}>
			<canvas {@attach attachCanvas}></canvas>
		</div>
	</DemoCard>

	<EquationPanel title="Local model at (x0,y0)">
		<Katex math={String.raw`z=f(x,y)=0.34x^2+0.22y^2`} display />
		<Katex math={String.raw`f_x(x_0,y_0)=${fx.toFixed(3)},\quad f_y(x_0,y_0)=${fy.toFixed(3)}`} display />
		<Katex math={String.raw`z\approx f(x_0,y_0)+f_x(x_0,y_0)(x-x_0)+f_y(x_0,y_0)(y-y_0)`} display />
	</EquationPanel>
</div>

<style>
	.surface-wrap {
		width: 100%;
		aspect-ratio: 16 / 10;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	canvas {
		width: 100%;
		height: 100%;
		display: block;
		background: var(--color-surface);
	}
</style>
