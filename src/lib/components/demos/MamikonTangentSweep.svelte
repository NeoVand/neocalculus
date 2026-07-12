<script lang="ts">
	import { onMount } from 'svelte';
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	type CurveKey = 'circle' | 'ellipse' | 'triangle';
	type Point = { x: number; y: number };
	type CurveSpec = {
		key: CurveKey;
		label: string;
		point: (t: number) => Point;
		derivative: (t: number) => Point;
	};

	const curves: CurveSpec[] = [
		{
			key: 'circle',
			label: 'Circle',
			point: (t) => ({ x: Math.cos(t), y: Math.sin(t) }),
			derivative: (t) => ({ x: -Math.sin(t), y: Math.cos(t) })
		},
		{
			key: 'ellipse',
			label: 'Ellipse',
			point: (t) => ({ x: 1.2 * Math.cos(t), y: 0.76 * Math.sin(t) }),
			derivative: (t) => ({ x: -1.2 * Math.sin(t), y: 0.76 * Math.cos(t) })
		},
		{
			key: 'triangle',
			label: 'Rounded triangle',
			point: (t) => {
				const h = 1 + 0.07 * Math.cos(3 * t);
				const hp = -0.21 * Math.sin(3 * t);
				return {
					x: h * Math.cos(t) - hp * Math.sin(t),
					y: h * Math.sin(t) + hp * Math.cos(t)
				};
			},
			derivative: (t) => {
				const speed = 1 - 0.56 * Math.cos(3 * t);
				return { x: -speed * Math.sin(t), y: speed * Math.cos(t) };
			}
		}
	];

	const curveByKey = Object.fromEntries(curves.map((curve) => [curve.key, curve])) as Record<
		CurveKey,
		CurveSpec
	>;
	const TAU = Math.PI * 2;
	const tangentLength = 0.72;
	const leftCenter = { x: 250, y: 222 };
	const rightCenter = { x: 690, y: 222 };
	const plotScale = 112;

	let curveKey = $state<CurveKey>('ellipse');
	let progress = $state(0.68);
	let playing = $state(true);
	let curve = $derived(curveByKey[curveKey]);

	function unitTangent(spec: CurveSpec, t: number) {
		const derivative = spec.derivative(t);
		const length = Math.hypot(derivative.x, derivative.y) || 1;
		return { x: derivative.x / length, y: derivative.y / length };
	}

	function mapPoint(point: Point, center: Point): Point {
		return {
			x: center.x + point.x * plotScale,
			y: center.y - point.y * plotScale
		};
	}

	function pathFrom(points: Point[], close = false) {
		if (points.length === 0) return '';
		return (
			points
				.map(
					(point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
				)
				.join(' ') + (close ? ' Z' : '')
		);
	}

	function polygonArea(points: Point[]) {
		let sum = 0;
		for (let index = 0; index < points.length; index += 1) {
			const current = points[index];
			const next = points[(index + 1) % points.length];
			sum += current.x * next.y - next.x * current.y;
		}
		return Math.abs(sum) / 2;
	}

	function makeGeometry(spec: CurveSpec, amount: number) {
		const fullSamples = 220;
		const activeSamples = Math.max(3, Math.round(fullSamples * amount));
		const fullCurve: Point[] = [];
		const basePoints: Point[] = [];
		const outerPoints: Point[] = [];
		const clusterPoints: Point[] = [rightCenter];

		for (let index = 0; index <= fullSamples; index += 1) {
			const t = (TAU * index) / fullSamples;
			fullCurve.push(mapPoint(spec.point(t), leftCenter));
		}

		for (let index = 0; index <= activeSamples; index += 1) {
			const t = (TAU * amount * index) / activeSamples;
			const base = spec.point(t);
			const tangent = unitTangent(spec, t);
			const outer = {
				x: base.x + tangentLength * tangent.x,
				y: base.y + tangentLength * tangent.y
			};
			basePoints.push(mapPoint(base, leftCenter));
			outerPoints.push(mapPoint(outer, leftCenter));
			clusterPoints.push(
				mapPoint({ x: tangentLength * tangent.x, y: tangentLength * tangent.y }, rightCenter)
			);
		}
		clusterPoints.push(rightCenter);

		const currentT = TAU * amount;
		const currentBase = spec.point(currentT);
		const currentTangent = unitTangent(spec, currentT);
		const currentOuter = {
			x: currentBase.x + tangentLength * currentTangent.x,
			y: currentBase.y + tangentLength * currentTangent.y
		};
		const clusterOuter = {
			x: tangentLength * currentTangent.x,
			y: tangentLength * currentTangent.y
		};
		const sweepPolygon = [...basePoints, ...outerPoints.toReversed()];
		const scaleArea = plotScale * plotScale;

		return {
			fullCurvePath: pathFrom(fullCurve, true),
			sweepPath: pathFrom(sweepPolygon, true),
			clusterPath: pathFrom(clusterPoints, true),
			basePath: pathFrom(basePoints),
			outerPath: pathFrom(outerPoints),
			currentBase: mapPoint(currentBase, leftCenter),
			currentOuter: mapPoint(currentOuter, leftCenter),
			clusterOuter: mapPoint(clusterOuter, rightCenter),
			sweepArea: polygonArea(sweepPolygon) / scaleArea,
			clusterArea: polygonArea(clusterPoints) / scaleArea
		};
	}

	let geometry = $derived(makeGeometry(curve, progress));
	let progressPercent = $derived(Math.round(progress * 100));
	let sharedArea = $derived(((geometry.sweepArea + geometry.clusterArea) / 2).toFixed(2));

	onMount(() => {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) playing = false;
		let previous = performance.now();
		let frame = 0;
		const tick = (now: number) => {
			const elapsed = now - previous;
			previous = now;
			if (playing) {
				progress += elapsed / 13000;
				if (progress > 1) progress = 0.015;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<div id="mamikon-tangent-sweep" class="mamikon-demo">
	<DemoHeader title="Explore: gather a tangent sweep" />

	<div class="demo-toolbar">
		<div class="curve-switch" role="group" aria-label="Choose the underlying convex curve">
			{#each curves as option (option.key)}
				<button
					type="button"
					class:active={curveKey === option.key}
					aria-pressed={curveKey === option.key}
					onclick={() => (curveKey = option.key)}
				>
					{option.label}
				</button>
			{/each}
		</div>
		<div class="invariant">
			<span>same tangent length</span>
			<Katex math={String.raw`L=0.72`} />
		</div>
	</div>

	<div class="visual-shell">
		<svg
			class="sweep-visual"
			viewBox="0 0 920 430"
			role="img"
			aria-label="A tangent segment sweeps a region along a convex curve on the left while an equal-area cluster of translated tangent segments gathers around one point on the right."
		>
			<defs>
				<linearGradient id="mamikonSweepFill" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="var(--color-result)" stop-opacity="0.2"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0.3"></stop>
				</linearGradient>
				<radialGradient id="mamikonClusterFill" cx="50%" cy="50%" r="52%">
					<stop offset="0%" stop-color="var(--color-d)" stop-opacity="0.12"></stop>
					<stop offset="100%" stop-color="var(--color-d)" stop-opacity="0.34"></stop>
				</radialGradient>
				<filter id="mamikonGlow" x="-70%" y="-70%" width="240%" height="240%">
					<feGaussianBlur stdDeviation="5"></feGaussianBlur>
				</filter>
			</defs>

			<text class="panel-kicker" x="64" y="44">TANGENT SWEEP</text>
			<text class="panel-title" x="64" y="70">move the segment along any convex curve</text>
			<text class="panel-kicker" x="526" y="44">TANGENT CLUSTER</text>
			<text class="panel-title" x="526" y="70">translate every segment to one origin</text>

			<line class="panel-divider" x1="460" x2="460" y1="92" y2="382"></line>

			<path class="sweep-fill" d={geometry.sweepPath}></path>
			<path class="cluster-fill" d={geometry.clusterPath}></path>
			<path class="guide-curve" d={geometry.fullCurvePath}></path>
			<path class="active-base" d={geometry.basePath}></path>
			<path class="active-outer" d={geometry.outerPath}></path>

			<circle class="tangent-glow" cx={geometry.currentOuter.x} cy={geometry.currentOuter.y} r="17"
			></circle>
			<line
				class="current-tangent"
				x1={geometry.currentBase.x}
				y1={geometry.currentBase.y}
				x2={geometry.currentOuter.x}
				y2={geometry.currentOuter.y}
			></line>
			<circle class="current-base" cx={geometry.currentBase.x} cy={geometry.currentBase.y} r="5"
			></circle>
			<circle class="current-tip" cx={geometry.currentOuter.x} cy={geometry.currentOuter.y} r="5"
			></circle>

			<line
				class="cluster-tangent"
				x1={rightCenter.x}
				y1={rightCenter.y}
				x2={geometry.clusterOuter.x}
				y2={geometry.clusterOuter.y}
			></line>
			<circle class="cluster-origin" cx={rightCenter.x} cy={rightCenter.y} r="5"></circle>
			<circle class="current-tip" cx={geometry.clusterOuter.x} cy={geometry.clusterOuter.y} r="5"
			></circle>

			<text class="area-label" x="250" y="398" text-anchor="middle">
				swept area ≈ {geometry.sweepArea.toFixed(2)}
			</text>
			<text class="area-label" x="690" y="398" text-anchor="middle">
				clustered area ≈ {geometry.clusterArea.toFixed(2)}
			</text>
		</svg>

		<div class="area-equation" aria-live="polite">
			<span>different shapes, equal areas</span>
			<Katex math={String.raw`A_{\text{sweep}}=A_{\text{cluster}}\approx ${sharedArea}`} />
		</div>
	</div>

	<div class="sweep-controls">
		<button
			class="play-button"
			type="button"
			onclick={() => (playing = !playing)}
			aria-label={playing ? 'Pause tangent sweep' : 'Play tangent sweep'}
		>
			{#if playing}
				<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.5 4.5v11M13.5 4.5v11"></path></svg>
			{:else}
				<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z"></path></svg>
			{/if}
		</button>
		<div class="progress-control">
			<SliderField
				label="Sweep around the curve"
				min={0.015}
				max={1}
				step={0.005}
				decimals={2}
				tone="violet"
				bind:value={progress}
				oninput={() => (playing = false)}
				hint="{progressPercent}% of one full turn"
			/>
		</div>
	</div>
</div>

<style>
	.mamikon-demo {
		width: 100%;
	}

	.demo-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.72rem;
	}

	.curve-switch {
		display: flex;
		flex-wrap: wrap;
		gap: 0.38rem;
	}

	.curve-switch button {
		padding: 0.34rem 0.62rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: transparent;
		color: var(--color-ink-light);
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 650;
		cursor: pointer;
	}

	.curve-switch button.active {
		border-color: var(--color-d);
		background: var(--color-d-soft);
		color: var(--color-d);
	}

	.curve-switch button:focus-visible,
	.play-button:focus-visible {
		outline: 2px solid var(--color-d);
		outline-offset: 2px;
	}

	.invariant {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		white-space: nowrap;
		color: var(--color-d);
	}

	.invariant span {
		font-family: var(--font-sans);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.visual-shell {
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 16px;
		background:
			radial-gradient(circle at 74% 52%, var(--color-d-soft), transparent 32%),
			linear-gradient(180deg, var(--color-surface-raised), var(--color-surface));
	}

	.sweep-visual {
		display: block;
		width: 100%;
		height: auto;
	}

	.panel-kicker {
		fill: var(--color-d);
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.12em;
	}

	.panel-title {
		fill: var(--color-ink-light);
		font-family: var(--font-serif);
		font-size: 17px;
	}

	.panel-divider {
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.sweep-fill {
		fill: url(#mamikonSweepFill);
		stroke: color-mix(in srgb, var(--color-d) 58%, var(--color-border));
		stroke-width: 1.25;
	}

	.cluster-fill {
		fill: url(#mamikonClusterFill);
		stroke: color-mix(in srgb, var(--color-d) 66%, var(--color-border));
		stroke-width: 1.25;
	}

	.guide-curve {
		fill: none;
		stroke: var(--color-border);
		stroke-width: 2.1;
	}

	.active-base {
		fill: none;
		stroke: var(--color-result);
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	.active-outer {
		fill: none;
		stroke: var(--color-d);
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	.current-tangent,
	.cluster-tangent {
		stroke: var(--color-success);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.current-base,
	.cluster-origin {
		fill: var(--color-result);
		stroke: var(--color-surface-raised);
		stroke-width: 2.5;
	}

	.current-tip {
		fill: var(--color-success);
		stroke: var(--color-surface-raised);
		stroke-width: 2.5;
	}

	.tangent-glow {
		fill: var(--color-success);
		opacity: 0.16;
		filter: url(#mamikonGlow);
	}

	.area-label {
		fill: var(--color-ink-light);
		font-family: var(--font-sans);
		font-size: 15px;
		font-weight: 650;
	}

	.area-equation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.76rem 1rem 0.88rem;
		border-top: 1px solid var(--color-border-light);
		color: var(--color-d);
	}

	.area-equation span {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.sweep-controls {
		display: grid;
		grid-template-columns: auto minmax(0, 34rem);
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		margin-top: 0.82rem;
	}

	.play-button {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: 50%;
		background: var(--color-surface);
		color: var(--color-d);
		cursor: pointer;
	}

	.play-button svg {
		width: 1rem;
		height: 1rem;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.progress-control {
		min-width: 0;
	}

	@media (max-width: 700px) {
		.demo-toolbar {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.55rem;
		}

		.sweep-visual {
			width: 112%;
			margin-left: -6%;
		}

		.panel-title {
			display: none;
		}

		.panel-kicker {
			font-size: 17px;
		}

		.area-label {
			font-size: 19px;
		}

		.area-equation {
			flex-direction: column;
			gap: 0.3rem;
		}
	}

	@media (max-width: 480px) {
		.curve-switch {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			width: 100%;
		}

		.curve-switch button {
			padding-inline: 0.35rem;
			font-size: 0.66rem;
		}

		.sweep-controls {
			grid-template-columns: auto minmax(0, 1fr);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tangent-glow {
			display: none;
		}
	}
</style>
