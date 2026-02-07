<script lang="ts">
	import { onMount } from 'svelte';
	import katex from 'katex';

	interface Scenario {
		inputMath: string;
		fnMath: string;
		outputMath: string;
		inputColor: string;
		outputColor: string;
		plot: [number, number][];
		plotDot: [number, number];
		axisX: number | null;
		axisY: number | null;
	}

	const N_PTS = 60; // all plots must have this many segments

	function makePlotData(fn: (x: number) => number, xMin: number, xMax: number) {
		const pts: [number, number][] = [];
		let yMin = Infinity, yMax = -Infinity;
		const raw: { x: number; y: number }[] = [];
		for (let i = 0; i <= N_PTS; i++) {
			const x = xMin + (xMax - xMin) * i / N_PTS;
			const y = fn(x);
			if (!isFinite(y)) { raw.push({ x, y: 0 }); continue; }
			raw.push({ x, y });
			yMin = Math.min(yMin, y);
			yMax = Math.max(yMax, y);
		}
		const yPad = (yMax - yMin) * 0.08 || 0.5;
		yMin -= yPad; yMax += yPad;
		for (const p of raw) {
			pts.push([(p.x - xMin) / (xMax - xMin), 1 - (p.y - yMin) / (yMax - yMin)]);
		}
		const axisX = (xMin <= 0 && xMax >= 0) ? (0 - xMin) / (xMax - xMin) : null;
		const axisY = (yMin <= 0 && yMax >= 0) ? 1 - (0 - yMin) / (yMax - yMin) : null;
		return { pts, axisX, axisY };
	}

	function findDot(fn: (x: number) => number, xVal: number, xMin: number, xMax: number, data: { pts: [number, number][] }): [number, number] {
		const nx = (xVal - xMin) / (xMax - xMin);
		let best = 0, bestD = Infinity;
		for (let i = 0; i < data.pts.length; i++) {
			const d = Math.abs(data.pts[i][0] - nx);
			if (d < bestD) { bestD = d; best = i; }
		}
		return data.pts[best];
	}

	const sqD   = makePlotData(x => x*x, -3, 3);
	const sinD  = makePlotData(Math.sin, -Math.PI, Math.PI);
	const absD  = makePlotData(Math.abs, -3, 3);
	const sqrtD = makePlotData(x => Math.sqrt(Math.max(x,0)), 0, 6);
	const expD  = makePlotData(Math.exp, -2, 2.5);
	const cosD  = makePlotData(Math.cos, -Math.PI, Math.PI);
	const cubeD = makePlotData(x => x*x*x, -2, 2);
	const recipD = makePlotData(x => 1/x, 0.3, 5);

	// Floor function — staircase. Resampled to N_PTS+1 points for morph,
	// but with extra points clustered at integer boundaries so vertical
	// steps look truly vertical, not slanted.
	function makeFloorPlot(xMin: number, xMax: number) {
		const range = xMax - xMin;
		// Compute y bounds
		let yMin = Math.floor(xMin), yMax = Math.floor(xMax);
		const yPad = (yMax - yMin) * 0.08 || 0.5;
		yMin -= yPad; yMax += yPad;
		const ny = (y: number) => 1 - (y - yMin) / (yMax - yMin);
		const nx = (x: number) => (x - xMin) / range;

		// Build points: for each of N_PTS+1 slots, pick x values that
		// cluster tightly around integer boundaries.
		const pts: [number, number][] = [];
		const eps = 0.0005; // tiny offset to make vertical lines nearly vertical

		// Collect critical x values: just before and after each integer
		const criticals: number[] = [];
		for (let k = Math.ceil(xMin); k <= Math.floor(xMax); k++) {
			if (k > xMin) { criticals.push(k - eps); criticals.push(k); }
		}

		// Distribute N_PTS+1 points: place critical points first, fill rest evenly
		const allX = new Set<number>();
		for (const cx of criticals) allX.add(cx);
		// Fill remaining slots with evenly spaced points
		const remaining = N_PTS + 1 - allX.size;
		for (let i = 0; i < remaining; i++) {
			allX.add(xMin + (i / (remaining - 1)) * range);
		}
		// Sort and take exactly N_PTS+1
		const sorted = [...allX].sort((a, b) => a - b).slice(0, N_PTS + 1);
		// Pad or trim to exactly N_PTS+1
		while (sorted.length < N_PTS + 1) sorted.push(xMax);

		for (const x of sorted) {
			pts.push([nx(x), ny(Math.floor(x))]);
		}

		const axisX = (xMin <= 0 && xMax >= 0) ? nx(0) : null;
		const axisY = (yMin <= 0 && yMax >= 0) ? ny(0) : null;
		return { pts, axisX, axisY };
	}

	const floorD = makeFloorPlot(-1.5, 3.5);

	const scenarios: Scenario[] = [
		{ inputMath: '-1', fnMath: 'f(x) = x^2', outputMath: '1', inputColor: '#3b82f6', outputColor: '#059669', plot: sqD.pts, plotDot: findDot(x=>x*x, -1, -3, 3, sqD), axisX: sqD.axisX, axisY: sqD.axisY },
		{ inputMath: '\\pi/6', fnMath: '\\sin(x)', outputMath: '1/2', inputColor: '#f59e0b', outputColor: '#059669', plot: sinD.pts, plotDot: findDot(Math.sin, Math.PI/6, -Math.PI, Math.PI, sinD), axisX: sinD.axisX, axisY: sinD.axisY },
		{ inputMath: '-2', fnMath: '|x|', outputMath: '2', inputColor: '#8b5cf6', outputColor: '#059669', plot: absD.pts, plotDot: findDot(Math.abs, -2, -3, 3, absD), axisX: absD.axisX, axisY: absD.axisY },
		{ inputMath: '4', fnMath: '\\sqrt{x}', outputMath: '2', inputColor: '#3b82f6', outputColor: '#059669', plot: sqrtD.pts, plotDot: findDot(x=>Math.sqrt(x), 4, 0, 6, sqrtD), axisX: sqrtD.axisX, axisY: sqrtD.axisY },
		{ inputMath: '1', fnMath: 'e^x', outputMath: 'e', inputColor: '#06b6d4', outputColor: '#059669', plot: expD.pts, plotDot: findDot(Math.exp, 1, -2, 2.5, expD), axisX: expD.axisX, axisY: expD.axisY },
		{ inputMath: '\\pi/3', fnMath: '\\cos(x)', outputMath: '1/2', inputColor: '#f59e0b', outputColor: '#059669', plot: cosD.pts, plotDot: findDot(Math.cos, Math.PI/3, -Math.PI, Math.PI, cosD), axisX: cosD.axisX, axisY: cosD.axisY },
		{ inputMath: '-1', fnMath: 'x^3', outputMath: '-1', inputColor: '#3b82f6', outputColor: '#ef4444', plot: cubeD.pts, plotDot: findDot(x=>x*x*x, -1, -2, 2, cubeD), axisX: cubeD.axisX, axisY: cubeD.axisY },
		{ inputMath: '2.7', fnMath: '\\lfloor x \\rfloor', outputMath: '2', inputColor: '#ec4899', outputColor: '#059669', plot: floorD.pts, plotDot: findDot(Math.floor, 2.7, -1.5, 3.5, floorD), axisX: floorD.axisX, axisY: floorD.axisY },
		{ inputMath: '2', fnMath: '1/x', outputMath: '1/2', inputColor: '#8b5cf6', outputColor: '#059669', plot: recipD.pts, plotDot: findDot(x=>1/x, 2, 0.3, 5, recipD), axisX: recipD.axisX, axisY: recipD.axisY },
	];

	let idx = $state(0);
	let phase = $state<'appear' | 'swallow' | 'digest' | 'spit' | 'linger' | 'fadeout' | 'reset'>('reset');
	let timer: ReturnType<typeof setInterval> | undefined;
	let inSpread = $state(0);
	let outSpread = $state(0);
	let gradPos = $state(0);
	let gradActive = $state(false);

	// ─── Morph state for smooth curve transitions ───
	let morphT = $state(1);
	let fromPlot = $state<[number, number][]>(scenarios[0].plot);
	let fromDotX = $state(scenarios[0].plotDot[0]); // just the x-parameter
	let fromAxisX = $state<number | null>(scenarios[0].axisX);
	let fromAxisY = $state<number | null>(scenarios[0].axisY);

	function startMorph(newIdx: number) {
		fromPlot = dispPlot;
		fromDotX = dispDotNx;
		fromAxisX = dispAxisXn;
		fromAxisY = dispAxisYn;
		idx = newIdx;
		morphT = 0;
		const start = performance.now();
		const dur = 500;
		function tick(now: number) {
			const t = Math.min((now - start) / dur, 1);
			morphT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
			if (t < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}

	let sc = $derived(scenarios[idx]);

	function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
	function lerpN(a: number | null, b: number | null, t: number): number | null {
		if (a === null && b === null) return null;
		if (a === null) return b;
		if (b === null) return a;
		return lerp(a, b, t);
	}

	// Interpolated curve
	let dispPlot = $derived.by(() => {
		if (morphT >= 1) return sc.plot;
		return sc.plot.map(([tx, ty], i) => {
			const [fx, fy] = fromPlot[i] ?? [tx, ty];
			return [lerp(fx, tx, morphT), lerp(fy, ty, morphT)] as [number, number];
		});
	});

	// Dot x-parameter (normalized 0–1) interpolated along the curve
	let dispDotNx = $derived(morphT >= 1 ? sc.plotDot[0] : lerp(fromDotX, sc.plotDot[0], morphT));

	// Sample y from the current interpolated curve at dispDotNx
	// This makes the dot RIDE the morphing curve instead of cutting across in a straight line
	let dispDotNy = $derived.by(() => {
		const pts = dispPlot;
		const nx = dispDotNx;
		// Find the two adjacent points that bracket nx
		for (let i = 0; i < pts.length - 1; i++) {
			const [x0, y0] = pts[i];
			const [x1, y1] = pts[i + 1];
			if (nx >= x0 && nx <= x1) {
				// Linear interpolation between these two curve points
				const frac = x1 === x0 ? 0 : (nx - x0) / (x1 - x0);
				return y0 + frac * (y1 - y0);
			}
		}
		// Fallback: clamp to nearest endpoint
		if (nx <= pts[0][0]) return pts[0][1];
		return pts[pts.length - 1][1];
	});

	let dispAxisXn = $derived(lerpN(fromAxisX, sc.axisX, morphT));
	let dispAxisYn = $derived(lerpN(fromAxisY, sc.axisY, morphT));

	function cycle() {
		phase = 'appear';
		setTimeout(() => { phase = 'swallow'; inSpread = 4; setTimeout(() => { inSpread = 0; }, 300); }, 900);
		setTimeout(() => { gradActive = true; gradPos = 0; const s = performance.now(); const dur = 700; function tick(n: number) { const p = Math.min((n-s)/dur,1); gradPos = p; if (p<1) requestAnimationFrame(tick); } requestAnimationFrame(tick); }, 1150);
		setTimeout(() => { phase = 'digest'; }, 1400);
		setTimeout(() => { gradActive = false; phase = 'spit'; outSpread = -2; setTimeout(() => { outSpread = 3; }, 100); setTimeout(() => { outSpread = 0; }, 280); }, 1900);
		setTimeout(() => { phase = 'linger'; }, 2300);
		setTimeout(() => { phase = 'fadeout'; }, 4000);
		setTimeout(() => {
			phase = 'reset';
			// Start morphing the curve to next scenario
			startMorph((idx + 1) % scenarios.length);
		}, 4600);
	}

	onMount(() => { setTimeout(cycle, 400); timer = setInterval(cycle, 5000); return () => { if (timer) clearInterval(timer); }; });

	function tex(s: string): string { return katex.renderToString(s, { throwOnError: false, trust: true }); }

	// ═══════════════════════════════════════════
	// GEOMETRY
	// ═══════════════════════════════════════════
	const VW = 480, VH = 200;
	const bL = 135, bR = 345, bT = 6, bB = 194;
	const bMid = (bT + bB) / 2;
	const fLen = 42, slotH = 46, mouthH = 92;
	const funnelLeftX = bL - fLen, funnelRightX = bR + fLen;
	const margin = 35;
	const pillLeftX = funnelLeftX - margin, pillRightX = funnelRightX + margin;
	const restLeft = (pillLeftX / VW * 100).toFixed(1);
	const restRight = ((VW - pillRightX) / VW * 100).toFixed(1);
	const swallowPct = ((bL + 20) / VW * 100).toFixed(1);
	const hiddenRight = ((VW - (bR - 20)) / VW * 100).toFixed(1);

	let machinePath = $derived.by(() => {
		const fLx = bL - fLen - inSpread, fRx = bR + fLen + outSpread;
		const mIn = mouthH + inSpread * 3, mOut = mouthH + Math.max(outSpread, 0) * 3;
		const r = 7;
		return [
			`M ${bL+r},${bT}`, `L ${bR-r},${bT}`, `Q ${bR},${bT} ${bR},${bT+r}`,
			`L ${bR},${bMid-slotH/2}`,
			`L ${fRx},${bMid-mOut/2}`, `L ${fRx},${bMid+mOut/2}`, `L ${bR},${bMid+slotH/2}`,
			`L ${bR},${bB-r}`, `Q ${bR},${bB} ${bR-r},${bB}`,
			`L ${bL+r},${bB}`, `Q ${bL},${bB} ${bL},${bB-r}`,
			`L ${bL},${bMid+slotH/2}`,
			`L ${fLx},${bMid+mIn/2}`, `L ${fLx},${bMid-mIn/2}`, `L ${bL},${bMid-slotH/2}`,
			`L ${bL},${bT+r}`, `Q ${bL},${bT} ${bL+r},${bT}`,
			'Z'
		].join(' ');
	});

	let gradX = $derived(funnelLeftX + gradPos * (funnelRightX - funnelLeftX));

	// Plot area
	const pL = bL + 14, pR = bR - 14, pT_ = 108, pB_ = 178;
	const pW = pR - pL, pH = pB_ - pT_;

	// Rendered from interpolated display values
	let plotPolyline = $derived.by(() => {
		return dispPlot.map(([nx, ny]) => `${pL + nx * pW},${pT_ + ny * pH}`).join(' ');
	});

	let dotPx = $derived({ cx: pL + dispDotNx * pW, cy: pT_ + dispDotNy * pH });
	let axisXpx = $derived(dispAxisXn !== null ? pL + dispAxisXn * pW : null);
	let axisYpx = $derived(dispAxisYn !== null ? pT_ + dispAxisYn * pH : null);
</script>

<div class="fm-wrap">
	<div class="fm-stage" style="--rest-l: {restLeft}%; --rest-r: {restRight}%; --swallow: {swallowPct}%; --hidden-r: {hiddenRight}%;">
		<div class="fm-val fm-val-in" class:appear={phase === 'appear'} class:swallow={phase === 'swallow'} class:gone={phase === 'digest' || phase === 'spit' || phase === 'linger'} class:fading={phase === 'fadeout' || phase === 'reset'} style="--vc: {sc.inputColor}">
			{@html tex(sc.inputMath)}
		</div>

		<!-- x / f(x) labels positioned inside SVG to align with body top -->
		<div class="fm-x-label" style="--rest-l: {restLeft}%;">{@html tex('x')}</div>
		<div class="fm-fx-label" style="--rest-r: {restRight}%;">{@html tex('f(x)')}</div>

		<svg class="fm-svg" viewBox="0 0 {VW} {VH}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="mGrad" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="#f5f3ff"/>
					<stop offset="35%" stop-color="#ede9fe"/>
					<stop offset="100%" stop-color="#f5f3ff"/>
				</linearGradient>
				<radialGradient id="sweepG" cx={gradX} cy={bMid} r="110" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stop-color="#e9d5ff" stop-opacity="0.8"/>
					<stop offset="50%" stop-color="#ede9fe" stop-opacity="0.2"/>
					<stop offset="100%" stop-color="#f5f3ff" stop-opacity="0"/>
				</radialGradient>
				<clipPath id="plotClip">
					<rect x={pL-6} y={pT_-6} width={pW+12} height={pH+12} rx="6"/>
				</clipPath>
			</defs>

			<path d={machinePath} fill="url(#mGrad)" stroke="#a855f7" stroke-width="1.8" stroke-linejoin="round" class="fm-path"/>
			{#if gradActive}
				<path d={machinePath} fill="url(#sweepG)" stroke="none"/>
			{/if}

			<foreignObject x={bL} y={bT} width={bR-bL} height="95">
				<div class="fm-label" xmlns="http://www.w3.org/1999/xhtml">
					{@html tex(sc.fnMath)}
				</div>
			</foreignObject>

			<rect x={pL-8} y={pT_-8} width={pW+16} height={pH+16} rx="8" ry="8" fill="white" fill-opacity="0.5" stroke="none" opacity="0.7"/>

			{#if axisXpx !== null}
				<line x1={axisXpx} y1={pT_} x2={axisXpx} y2={pB_} stroke="#c4b5fd" stroke-width="0.7" opacity="0.45"/>
			{/if}
			{#if axisYpx !== null}
				<line x1={pL} y1={axisYpx} x2={pR} y2={axisYpx} stroke="#c4b5fd" stroke-width="0.7" opacity="0.45"/>
			{/if}

			<g clip-path="url(#plotClip)" opacity="0.6">
				<polyline points={plotPolyline} fill="none" stroke="#a855f7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
				<line x1={dotPx.cx} y1={dotPx.cy} x2={axisXpx ?? pL} y2={dotPx.cy} stroke="#a855f7" stroke-width="0.7" stroke-dasharray="3,2" opacity="0.5"/>
				<line x1={dotPx.cx} y1={dotPx.cy} x2={dotPx.cx} y2={axisYpx ?? pB_} stroke="#a855f7" stroke-width="0.7" stroke-dasharray="3,2" opacity="0.5"/>
				<circle cx={dotPx.cx} cy={dotPx.cy} r="3.5" fill="#a855f7" opacity="0.9"/>
			</g>
		</svg>

		<div class="fm-val fm-val-out" class:emerge={phase === 'spit' || phase === 'linger'} class:fading={phase === 'fadeout' || phase === 'reset'} style="--vc: {sc.outputColor}">
			{@html tex(sc.outputMath)}
		</div>
	</div>
</div>

<style>
	.fm-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		padding: 0.5rem 0 1.2rem;
	}

	.fm-x-label, .fm-fx-label {
		position: absolute;
		top: 2%;
		z-index: 3;
		color: var(--color-ink-faint);
	}

	.fm-x-label { left: var(--rest-l); transform: translateX(-50%); }
	.fm-fx-label { right: var(--rest-r); transform: translateX(50%); }
	.fm-x-label :global(.katex), .fm-fx-label :global(.katex) { font-size: 0.92em; color: var(--color-ink-faint); }

	.fm-stage {
		position: relative;
		width: 100%;
		max-width: 460px;
		aspect-ratio: 480 / 200;
	}

	.fm-svg {
		position: absolute; inset: 0; width: 100%; height: 100%;
		z-index: 2; overflow: visible; pointer-events: none;
	}

	.fm-path { transition: d 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }

	.fm-label {
		width: 100%; height: 100%;
		display: flex; align-items: center; justify-content: center;
		color: var(--color-d); pointer-events: none;
	}

	.fm-label :global(.katex) { font-size: 1.35em; }

	.fm-val {
		position: absolute; top: 50%;
		transform: translateY(-50%) translateX(-50%);
		padding: 0.18rem 0.55rem; border-radius: 999px;
		background: white; border: 1.5px solid var(--vc);
		box-shadow: 0 1px 8px rgba(0,0,0,0.07);
		white-space: nowrap; z-index: 1; opacity: 0;
	}

	.fm-val :global(.katex) { font-size: 0.92em; color: var(--vc); }

	.fm-val-in { left: var(--rest-l); transition: left 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease; }
	.fm-val-in.appear { left: var(--rest-l); opacity: 1; transition: opacity 0.45s ease; }
	.fm-val-in.swallow { left: var(--swallow); opacity: 1; transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s 0.35s ease; }
	.fm-val-in.gone { left: calc(var(--swallow) + 8%); opacity: 0; transition: left 0.35s ease-in, opacity 0.3s ease-in; }
	.fm-val-in.fading { left: var(--rest-l); opacity: 0; transition: opacity 0.5s ease; }

	.fm-val-out { right: var(--hidden-r); transform: translateY(-50%) translateX(50%); opacity: 0; transition: right 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease; }
	.fm-val-out.emerge { right: var(--rest-r); opacity: 1; }
	.fm-val-out.fading { right: var(--rest-r); opacity: 0; transition: opacity 0.5s ease; }

	@media (max-width: 480px) {
		.fm-stage { max-width: 340px; }
		.fm-label :global(.katex) { font-size: 1.1em; }
		.fm-val :global(.katex) { font-size: 0.78em; }
	}

	@media (prefers-reduced-motion: reduce) {
		.fm-path { transition: none; }
		.fm-val { transition: none; }
	}
</style>
