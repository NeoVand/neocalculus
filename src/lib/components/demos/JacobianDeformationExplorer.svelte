<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';

	type Point = { x: number; y: number };

	const sourceCenter = { x: 170, y: 190 };
	const imageCenter = { x: 590, y: 190 };
	const panelHalf = 128;
	const gridFractions = [-1, -0.5, 0, 0.5, 1];

	let u0 = $state(1);
	let v0 = $state(1);
	let radius = $state(0.45);

	const map = (u: number, v: number): Point => ({ x: u * u - v * v, y: 2 * u * v });
	const baseImage = $derived(map(u0, v0));
	const j11 = $derived(2 * u0);
	const j12 = $derived(-2 * v0);
	const j21 = $derived(2 * v0);
	const j22 = $derived(2 * u0);
	const determinant = $derived(j11 * j22 - j12 * j21);
	const orientation = $derived(determinant > 0.001 ? 'preserved' : determinant < -0.001 ? 'reversed' : 'collapsed');
	const nonlinearGap = $derived(2 * radius * radius);

	const squareCorners = $derived([
		{ x: u0 - radius, y: v0 - radius },
		{ x: u0 + radius, y: v0 - radius },
		{ x: u0 + radius, y: v0 + radius },
		{ x: u0 - radius, y: v0 + radius }
	]);

	const sourceBoundary = $derived.by(() => {
		const points: Point[] = [];
		const samples = 16;
		for (let index = 0; index <= samples; index += 1) {
			const t = -radius + (index / samples) * 2 * radius;
			points.push({ x: u0 + t, y: v0 - radius });
		}
		for (let index = 1; index <= samples; index += 1) {
			const t = -radius + (index / samples) * 2 * radius;
			points.push({ x: u0 + radius, y: v0 + t });
		}
		for (let index = 1; index <= samples; index += 1) {
			const t = radius - (index / samples) * 2 * radius;
			points.push({ x: u0 + t, y: v0 + radius });
		}
		for (let index = 1; index <= samples; index += 1) {
			const t = radius - (index / samples) * 2 * radius;
			points.push({ x: u0 - radius, y: v0 + t });
		}
		return points;
	});
	const mappedBoundary = $derived(sourceBoundary.map((point) => map(point.x, point.y)));
	const linearCorners = $derived(
		squareCorners.map((point) => {
			const du = point.x - u0;
			const dv = point.y - v0;
			return {
				x: baseImage.x + j11 * du + j12 * dv,
				y: baseImage.y + j21 * du + j22 * dv
			};
		})
	);
	const outputLocalRange = $derived(
		Math.max(
			0.001,
			...mappedBoundary.flatMap((point) => [Math.abs(point.x - baseImage.x), Math.abs(point.y - baseImage.y)]),
			...linearCorners.flatMap((point) => [Math.abs(point.x - baseImage.x), Math.abs(point.y - baseImage.y)])
		) * 1.22
	);

	const sourceX = (value: number) => sourceCenter.x + ((value - u0) / (radius * 1.55)) * panelHalf;
	const sourceY = (value: number) => sourceCenter.y - ((value - v0) / (radius * 1.55)) * panelHalf;
	const imageX = (value: number) => imageCenter.x + ((value - baseImage.x) / outputLocalRange) * panelHalf;
	const imageY = (value: number) => imageCenter.y - ((value - baseImage.y) / outputLocalRange) * panelHalf;
	const sourcePolygon = $derived(
		squareCorners.map((point) => `${sourceX(point.x)},${sourceY(point.y)}`).join(' ')
	);
	const linearPolygon = $derived(
		linearCorners.map((point) => `${imageX(point.x)},${imageY(point.y)}`).join(' ')
	);
	const mappedPath = $derived(
		mappedBoundary
			.map((point, index) => `${index === 0 ? 'M' : 'L'}${imageX(point.x)},${imageY(point.y)}`)
			.join(' ') + ' Z'
	);
	const imageU = $derived({ x: baseImage.x + j11 * radius, y: baseImage.y + j21 * radius });
	const imageV = $derived({ x: baseImage.x + j12 * radius, y: baseImage.y + j22 * radius });
</script>

<div class="jacobian-explorer">
	<DemoHeader title="Explore how a Jacobian deforms a small patch" />

	<DemoCard title="Choose a base point and an ordinary patch size">
		<div class="demo-controls-grid">
			<SliderField label="Base coordinate u₀" min={-1.2} max={1.2} step={0.1} decimals={1} bind:value={u0} tone="blue" />
			<SliderField label="Base coordinate v₀" min={-1.2} max={1.2} step={0.1} decimals={1} bind:value={v0} tone="amber" />
			<SliderField
				label="Patch half-width s"
				min={0.12}
				max={0.7}
				step={0.02}
				decimals={2}
				bind:value={radius}
				hint="Shrink s to see the nonlinear image approach its Jacobian prediction."
				tone="violet"
			/>
		</div>
	</DemoCard>

	<div class="map-shell">
		<svg viewBox="0 0 760 380" role="img" aria-label="A square patch mapped by a nonlinear function and compared with its Jacobian parallelogram">
			<defs>
				<marker id="jacobian-map-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
					<path d="M0,0 L8,4 L0,8 Z" fill="var(--color-ink-faint)" />
				</marker>
				<marker id="jacobian-u-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
					<path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" />
				</marker>
				<marker id="jacobian-v-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
					<path d="M0,0 L7,3.5 L0,7 Z" fill="#d97706" />
				</marker>
			</defs>

			<text class="panel-title" x="170" y="24" text-anchor="middle">MAGNIFIED INPUT NEIGHBORHOOD</text>
			<text class="panel-title" x="590" y="24" text-anchor="middle">MAGNIFIED OUTPUT NEIGHBORHOOD</text>

			{#each gridFractions as fraction (fraction)}
				<line class="grid-line" x1={sourceCenter.x + fraction * panelHalf} y1="62" x2={sourceCenter.x + fraction * panelHalf} y2="318" />
				<line class="grid-line" x1="42" y1={sourceCenter.y - fraction * panelHalf} x2="298" y2={sourceCenter.y - fraction * panelHalf} />
				<line class="grid-line" x1={imageCenter.x + fraction * panelHalf} y1="62" x2={imageCenter.x + fraction * panelHalf} y2="318" />
				<line class="grid-line" x1="462" y1={imageCenter.y - fraction * panelHalf} x2="718" y2={imageCenter.y - fraction * panelHalf} />
			{/each}

			<line class="axis-line" x1="42" y1={sourceCenter.y} x2="298" y2={sourceCenter.y} />
			<line class="axis-line" x1={sourceCenter.x} y1="62" x2={sourceCenter.x} y2="318" />
			<line class="axis-line" x1="462" y1={imageCenter.y} x2="718" y2={imageCenter.y} />
			<line class="axis-line" x1={imageCenter.x} y1="62" x2={imageCenter.x} y2="318" />

			<polygon class="source-patch" points={sourcePolygon} />
			<line
				class="basis-u"
				x1={sourceX(u0)}
				y1={sourceY(v0)}
				x2={sourceX(u0 + radius)}
				y2={sourceY(v0)}
				marker-end="url(#jacobian-u-arrow)"
			/>
			<line
				class="basis-v"
				x1={sourceX(u0)}
				y1={sourceY(v0)}
				x2={sourceX(u0)}
				y2={sourceY(v0 + radius)}
				marker-end="url(#jacobian-v-arrow)"
			/>
			<circle class="base-point" cx={sourceX(u0)} cy={sourceY(v0)} r="4.5" />

			<line class="map-arrow" x1="332" y1="190" x2="426" y2="190" marker-end="url(#jacobian-map-arrow)" />
			<text class="map-label" x="379" y="174" text-anchor="middle">F(u,v)</text>

			<path class="actual-image" d={mappedPath} />
			<polygon class="linear-image" points={linearPolygon} />
			<line
				class="basis-u"
				x1={imageX(baseImage.x)}
				y1={imageY(baseImage.y)}
				x2={imageX(imageU.x)}
				y2={imageY(imageU.y)}
				marker-end="url(#jacobian-u-arrow)"
			/>
			<line
				class="basis-v"
				x1={imageX(baseImage.x)}
				y1={imageY(baseImage.y)}
				x2={imageX(imageV.x)}
				y2={imageY(imageV.y)}
				marker-end="url(#jacobian-v-arrow)"
			/>
			<circle class="base-point" cx={imageX(baseImage.x)} cy={imageY(baseImage.y)} r="4.5" />

			<text class="axis-label" x="304" y={sourceCenter.y + 4}>Δu</text>
			<text class="axis-label" x={sourceCenter.x + 6} y="58">Δv</text>
			<text class="axis-label" x="724" y={imageCenter.y + 4}>ΔP</text>
			<text class="axis-label" x={imageCenter.x + 6} y="58">ΔQ</text>
		</svg>

		<div class="legend" aria-label="Jacobian explorer legend">
			<span><i class="actual-key"></i>actual curved image under <Katex math="F" /></span>
			<span><i class="linear-key"></i>Jacobian parallelogram</span>
			<span><i class="u-key"></i>first coordinate direction</span>
			<span><i class="v-key"></i>second coordinate direction</span>
		</div>
	</div>

	<EquationPanel title="The local map at the selected point">
		<Katex
			math={String.raw`J_F(u_0,v_0)=\begin{pmatrix}${j11.toFixed(2)}&${j12.toFixed(2)}\\${j21.toFixed(2)}&${j22.toFixed(2)}\end{pmatrix}`}
			display
		/>
		<Katex
			math={String.raw`\det J_F=${determinant.toFixed(3)},\qquad \text{orientation ${orientation}}`}
			display
		/>
		<Katex
			math={String.raw`\|\text{nonlinear remainder}\|_{\max}=2s^2=${nonlinearGap.toFixed(3)}`}
			display
		/>
		<p class="gap-reading">For this quadratic map, this is the largest visible gap on the selected square patch.</p>
	</EquationPanel>
</div>

<style>
	.jacobian-explorer {
		font-family: var(--font-sans);
	}

	.map-shell {
		margin: 0.8rem 0;
		padding: 0.5rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: #fff;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.grid-line {
		stroke: var(--color-border-light);
		stroke-width: 1;
	}

	.axis-line {
		stroke: var(--color-ink-faint);
		stroke-width: 1.25;
	}

	.panel-title,
	.map-label,
	.axis-label {
		fill: var(--color-ink-light);
		font-family: var(--font-sans);
	}

	.panel-title {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.map-label,
	.axis-label {
		font-size: 13px;
		font-style: italic;
	}

	.source-patch {
		fill: rgb(148 163 184 / 13%);
		stroke: var(--color-ink-faint);
		stroke-width: 1.5;
	}

	.actual-image {
		fill: rgb(37 99 235 / 16%);
		stroke: #2563eb;
		stroke-width: 2.4;
	}

	.linear-image {
		fill: rgb(168 85 247 / 18%);
		stroke: var(--color-d);
		stroke-width: 2;
		stroke-dasharray: 7 4;
	}

	.basis-u,
	.basis-v {
		stroke-width: 2.6;
		stroke-linecap: round;
	}

	.basis-u {
		stroke: #2563eb;
	}

	.basis-v {
		stroke: #d97706;
	}

	.base-point {
		fill: var(--color-ink);
		stroke: #fff;
		stroke-width: 2;
	}

	.map-arrow {
		stroke: var(--color-ink-faint);
		stroke-width: 1.6;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem 1rem;
		margin: 0.25rem 0 0.2rem;
		font-size: 0.75rem;
		color: var(--color-ink-light);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.legend i {
		display: inline-block;
		width: 1.15rem;
		height: 0.45rem;
	}

	.gap-reading {
		margin: 0.28rem 0 0;
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--color-ink-faint);
	}

	.actual-key {
		background: rgb(37 99 235 / 16%);
		border: 2px solid #2563eb;
	}

	.linear-key {
		background: rgb(168 85 247 / 18%);
		border: 2px dashed var(--color-d);
	}

	.u-key {
		border-top: 3px solid #2563eb;
	}

	.v-key {
		border-top: 3px solid #d97706;
	}

	@media (max-width: 620px) {
		.map-shell {
			padding: 0.25rem;
		}

		.legend {
			justify-content: flex-start;
		}
	}
</style>
