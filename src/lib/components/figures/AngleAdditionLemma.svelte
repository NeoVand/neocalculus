<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';

	const r = String.raw;
	type Vec = { x: number; y: number };

	let alphaDeg = $state(116);
	let betaDeg = $state(42);

	let alpha = $derived((alphaDeg * Math.PI) / 180);
	let beta = $derived((betaDeg * Math.PI) / 180);

	let p = $derived<Vec>({ x: Math.cos(alpha), y: Math.sin(alpha) });
	let q = $derived<Vec>({ x: Math.cos(beta), y: Math.sin(beta) });

	const VIEW = {
		w: 760,
		h: 430,
		cx: 380,
		cy: 245,
		scale: 160
	};

	function mapPoint(v: Vec) {
		return {
			x: VIEW.cx + VIEW.scale * v.x,
			y: VIEW.cy - VIEW.scale * v.y
		};
	}

	function arcPoints(start: number, end: number, radiusFactor: number): string {
		const steps = Math.max(16, Math.ceil(Math.abs(end - start) * 36));
		const radius = VIEW.scale * radiusFactor;
		const pts: string[] = [];

		for (let i = 0; i <= steps; i += 1) {
			const t = start + ((end - start) * i) / steps;
			const x = VIEW.cx + radius * Math.cos(t);
			const y = VIEW.cy - radius * Math.sin(t);
			pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
		}

		return pts.join(' ');
	}

	function fmt(n: number) {
		return n.toFixed(4);
	}

	let O = $derived(mapPoint({ x: 0, y: 0 }));
	let P = $derived(mapPoint(p));
	let Q = $derived(mapPoint(q));

	let alphaArc = $derived(arcPoints(0, alpha, 0.30));
	let betaArc = $derived(arcPoints(0, beta, 0.42));

	let alphaLabel = $derived(
		mapPoint({ x: 0.36 * Math.cos(alpha / 2), y: 0.36 * Math.sin(alpha / 2) })
	);
	let betaLabel = $derived(
		mapPoint({ x: 0.48 * Math.cos(beta / 2), y: 0.48 * Math.sin(beta / 2) })
	);

	let lhsCosDiff = $derived(Math.cos(alpha - beta));
	let rhsCosDiff = $derived(Math.cos(alpha) * Math.cos(beta) + Math.sin(alpha) * Math.sin(beta));
	let lhsSinSum = $derived(Math.sin(alpha + beta));
	let rhsSinSum = $derived(Math.sin(alpha) * Math.cos(beta) + Math.cos(alpha) * Math.sin(beta));
</script>

<div class="lemma" role="img" aria-label="Interactive high-school geometric proof of angle addition formulas">
	<div class="controls">
		<div class="control">
			<label for="alpha-slider">Angle <Katex math={r`\alpha`} /></label>
			<input id="alpha-slider" type="range" min="10" max="170" step="1" bind:value={alphaDeg} />
			<span>{alphaDeg}&deg;</span>
		</div>
		<div class="control">
			<label for="beta-slider">Angle <Katex math={r`\beta`} /></label>
			<input id="beta-slider" type="range" min="10" max="170" step="1" bind:value={betaDeg} />
			<span>{betaDeg}&deg;</span>
		</div>
	</div>

	<svg class="diagram" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} xmlns="http://www.w3.org/2000/svg">
		<rect x="0" y="0" width={VIEW.w} height={VIEW.h} rx="10" fill="#fdfbf7" />
		<line x1="42" y1={O.y} x2={VIEW.w - 42} y2={O.y} class="axis" />
		<line x1={O.x} y1="28" x2={O.x} y2={VIEW.h - 26} class="axis" />
		<circle cx={O.x} cy={O.y} r={VIEW.scale} class="circle" />

		<line x1={O.x} y1={O.y} x2={P.x} y2={P.y} class="ray-alpha" />
		<line x1={O.x} y1={O.y} x2={Q.x} y2={Q.y} class="ray-beta" />
		<line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} class="chord" />

		<polyline points={alphaArc} class="arc-alpha" />
		<polyline points={betaArc} class="arc-beta" />

		<circle cx={O.x} cy={O.y} r="3.2" class="pt-o" />
		<circle cx={P.x} cy={P.y} r="4.2" class="pt-alpha" />
		<circle cx={Q.x} cy={Q.y} r="4.2" class="pt-beta" />

		<text x={O.x + 8} y={O.y + 18} class="pt-label">O</text>
		<text x={P.x + 8} y={P.y - 5} class="pt-label">P</text>
		<text x={Q.x + 8} y={Q.y - 5} class="pt-label">Q</text>

		<text x={alphaLabel.x} y={alphaLabel.y} class="angle-alpha">α</text>
		<text x={betaLabel.x} y={betaLabel.y} class="angle-beta">β</text>
	</svg>

	<div class="legend" aria-hidden="true">
		<div class="item"><span class="swatch circle"></span>Unit circle (radius 1)</div>
		<div class="item"><span class="swatch alpha"></span>Ray <Katex math={r`OP`} /> at angle <Katex math={r`\alpha`} /></div>
		<div class="item"><span class="swatch beta"></span>Ray <Katex math={r`OQ`} /> at angle <Katex math={r`\beta`} /></div>
		<div class="item"><span class="swatch chord"></span>Chord <Katex math={r`PQ`} /></div>
	</div>

	<div class="proof">
		<p>
			Take points <Katex math={r`P=(\cos\alpha,\sin\alpha)`} /> and
			<Katex math={r`Q=(\cos\beta,\sin\beta)`} /> on the unit circle.
			Now compute the same length <Katex math={r`PQ`} /> in two different ways.
		</p>
		<div class="line"><Katex math={r`\text{(Law of cosines in }\triangle OPQ\text{)}\quad PQ^2=2-2\cos(\alpha-\beta)`} display /></div>
		<div class="line"><Katex math={r`\text{(Distance formula)}\quad PQ^2=(\cos\alpha-\cos\beta)^2+(\sin\alpha-\sin\beta)^2`} display /></div>
		<div class="line"><Katex math={r`\Rightarrow\ PQ^2=2-2(\cos\alpha\cos\beta+\sin\alpha\sin\beta)`} display /></div>
		<div class="line result"><Katex math={r`\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta`} display /></div>
		<p>
			Replace <Katex math={r`\beta`} /> by <Katex math={r`-\beta`} /> to get the cosine sum formula,
			then use <Katex math={r`\sin\theta=\cos\!\left(\frac\pi2-\theta\right)`} /> for the sine sum formula.
		</p>
		<div class="final-box">
			<Katex
				math={r`\begin{aligned}
\cos(\alpha+\beta)&=\cos\alpha\cos\beta-\sin\alpha\sin\beta\\
\sin(\alpha+\beta)&=\sin\alpha\cos\beta+\cos\alpha\sin\beta
\end{aligned}`}
				display
			/>
		</div>
		<p class="check">
			Live check: <Katex math={r`\cos(\alpha-\beta)`} /> = <strong>{fmt(lhsCosDiff)}</strong>,
			RHS = <strong>{fmt(rhsCosDiff)}</strong>.
			<Katex math={r`\sin(\alpha+\beta)`} /> = <strong>{fmt(lhsSinSum)}</strong>,
			RHS = <strong>{fmt(rhsSinSum)}</strong>.
		</p>
	</div>
</div>

<style>
	.lemma {
		display: grid;
		gap: 0.82rem;
		max-width: 900px;
		margin: 0 auto;
	}

	.controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.65rem;
	}

	.control {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.52rem;
		padding: 0.5rem 0.64rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.56rem;
		background: #fff;
	}

	.control label {
		font-family: var(--font-sans);
		font-size: 0.79rem;
		font-weight: 620;
		color: var(--color-ink-light);
		white-space: nowrap;
	}

	.control input {
		width: 100%;
		accent-color: var(--color-d);
	}

	.control span {
		min-width: 2.75rem;
		text-align: right;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 640;
		color: var(--color-d);
		font-variant-numeric: tabular-nums;
	}

	.diagram {
		display: block;
		width: 100%;
		height: auto;
		border: 1px solid var(--color-border-light);
		border-radius: 0.72rem;
		background: #fff;
	}

	.axis {
		stroke: #c8c2b8;
		stroke-width: 1.2;
	}

	.circle {
		fill: none;
		stroke: #b8b1a5;
		stroke-width: 2.2;
	}

	.ray-alpha,
	.ray-beta,
	.chord {
		stroke-linecap: round;
	}

	.ray-alpha {
		stroke: #7c3aed;
		stroke-width: 3;
	}

	.ray-beta {
		stroke: #2563eb;
		stroke-width: 3;
	}

	.chord {
		stroke: #dc2626;
		stroke-width: 2.6;
	}

	.arc-alpha,
	.arc-beta {
		fill: none;
		stroke-linecap: round;
	}

	.arc-alpha {
		stroke: #7c3aed;
		stroke-width: 2;
	}

	.arc-beta {
		stroke: #2563eb;
		stroke-width: 2;
	}

	.pt-o {
		fill: #4b4c7a;
	}

	.pt-alpha {
		fill: #7c3aed;
	}

	.pt-beta {
		fill: #2563eb;
	}

	.pt-label {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 620;
		fill: #4b4c7a;
	}

	.angle-alpha,
	.angle-beta {
		font-family: var(--font-sans);
		font-size: 19px;
		font-weight: 700;
		paint-order: stroke;
		stroke: #fdfbf7;
		stroke-width: 4px;
		stroke-linejoin: round;
	}

	.angle-alpha {
		fill: #7c3aed;
	}

	.angle-beta {
		fill: #2563eb;
	}

	.legend {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.52rem 1rem;
		padding: 0.66rem 0.78rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.62rem;
		background: #fff;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.54rem;
		font-family: var(--font-sans);
		font-size: 0.84rem;
		color: var(--color-ink-light);
	}

	.item :global(.katex) {
		font-size: 0.96em;
	}

	.swatch {
		width: 1.24rem;
		height: 0.5rem;
		border-radius: 999px;
		flex: 0 0 auto;
	}

	.swatch.circle {
		background: #b8b1a5;
	}

	.swatch.alpha {
		background: #7c3aed;
	}

	.swatch.beta {
		background: #2563eb;
	}

	.swatch.chord {
		background: #dc2626;
	}

	.proof {
		padding: 0.74rem 0.86rem;
		border: 1px solid #ded4f6;
		border-radius: 0.66rem;
		background: #fff;
	}

	.proof p {
		margin: 0 0 0.38rem;
		font-family: var(--font-sans);
		font-size: 0.86rem;
		line-height: 1.56;
		color: var(--color-ink-light);
	}

	.proof :global(.katex) {
		font-size: 0.9em;
	}

	.proof p :global(.katex) {
		font-size: 0.95em;
	}

	.line :global(.katex-display) {
		margin: 0.12rem 0 !important;
		text-align: left;
	}

	.result {
		margin-top: 0.22rem;
		padding-top: 0.32rem;
		border-top: 1px solid #ece4fb;
	}

	.final-box {
		margin-top: 0.36rem;
		padding: 0.5rem 0.62rem;
		border: 1px solid #e7dbff;
		border-radius: 0.56rem;
		background: #faf7ff;
	}

	.final-box :global(.katex-display) {
		margin: 0 !important;
	}

	.check {
		margin-top: 0.46rem !important;
		margin-bottom: 0 !important;
		font-size: 0.8rem !important;
		color: var(--color-ink-faint) !important;
	}

	.check strong {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 640;
		color: var(--color-ink-light);
	}

	@media (max-width: 800px) {
		.controls,
		.legend {
			grid-template-columns: 1fr;
		}

		.angle-alpha,
		.angle-beta {
			font-size: 17px;
		}
	}
</style>
