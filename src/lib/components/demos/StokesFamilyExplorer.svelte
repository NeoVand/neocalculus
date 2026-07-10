<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';

	type CaseId = 'ftc' | 'green' | 'stokes' | 'divergence';

	type StokesCase = {
		id: CaseId;
		name: string;
		degree: string;
		region: string;
		boundary: string;
		insideLabel: string;
		boundaryLabel: string;
		interiorMath: string;
		boundaryMath: string;
	};

	const cases: StokesCase[] = [
		{
			id: 'ftc',
			name: 'FTC',
			degree: '0-form → 1-form',
			region: 'oriented interval [a,b]',
			boundary: 'two signed endpoints',
			insideLabel: 'change accumulated along the interval',
			boundaryLabel: 'final value minus initial value',
			interiorMath: String.raw`\int_a^b F'(x)\,dx`,
			boundaryMath: String.raw`F(b)-F(a)`
		},
		{
			id: 'green',
			name: 'Green',
			degree: '1-form → 2-form',
			region: 'oriented plane region R',
			boundary: 'counterclockwise curve ∂R',
			insideLabel: 'curl density accumulated through R',
			boundaryLabel: 'circulation measured around ∂R',
			interiorMath: String.raw`\iint_R(Q_x-P_y)\,dA`,
			boundaryMath: String.raw`\oint_{\partial R}P\,dx+Q\,dy`
		},
		{
			id: 'stokes',
			name: 'Stokes 3D',
			degree: '1-form → 2-form',
			region: 'oriented surface S',
			boundary: 'induced edge curve ∂S',
			insideLabel: 'curl flux accumulated through S',
			boundaryLabel: 'circulation measured around ∂S',
			interiorMath: String.raw`\iint_S(\nabla\times\mathbf F)\cdot\mathbf n\,dS`,
			boundaryMath: String.raw`\oint_{\partial S}\mathbf F\cdot d\mathbf r`
		},
		{
			id: 'divergence',
			name: 'Divergence',
			degree: '2-form → 3-form',
			region: 'oriented solid volume V',
			boundary: 'outward-facing surface ∂V',
			insideLabel: 'source density accumulated through V',
			boundaryLabel: 'outward flux measured across ∂V',
			interiorMath: String.raw`\iiint_V\nabla\cdot\mathbf F\,dV`,
			boundaryMath: String.raw`\oiint_{\partial V}\mathbf F\cdot\mathbf n\,dS`
		}
	];

	let selected = $state<CaseId>('green');
	const current = $derived(cases.find((item) => item.id === selected) ?? cases[0]);

	const pathFromPoints = (points: { x: number; y: number }[], close = false) =>
		`${points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')}${close ? ' Z' : ''}`;
	const sample = <T,>(count: number, fn: (index: number) => T): T[] =>
		Array.from({ length: count }, (_, index) => fn(index));

	const ftcY = (x: number) => {
		const t = (x - 92) / 456;
		return 145 - 28 * Math.sin(t * Math.PI * 1.35) - 13 * Math.sin(t * Math.PI * 3.4);
	};
	const ftcCurvePoints = sample(81, (index) => {
		const x = 92 + (456 * index) / 80;
		return { x, y: ftcY(x) };
	});
	const ftcCurvePath = pathFromPoints(ftcCurvePoints);
	const ftcFillPath = `${ftcCurvePath} L548,208 L92,208 Z`;
	const ftcSlices = [124, 172, 220, 268, 316, 364, 412, 460, 508].map((x) => ({ x, y: ftcY(x) }));

	const membranePoint = (radius: number, theta: number) => {
		const x = radius * Math.cos(theta);
		const y = radius * Math.sin(theta);
		const z = 0.78 * (radius * radius - 1);
		return { x: 320 + x * 205 + y * 42, y: 134 + y * 58 - z * 84 };
	};
	const membraneRing = (radius: number) =>
		pathFromPoints(sample(73, (index) => membranePoint(radius, (index / 72) * Math.PI * 2)), true);
	const membraneRings = [0.22, 0.45, 0.68, 0.86, 1].map((radius) => ({ radius, path: membraneRing(radius) }));
	const membraneSpokes = sample(12, (index) => {
		const theta = (index / 12) * Math.PI * 2;
		return pathFromPoints(sample(22, (step) => membranePoint(step / 21, theta)));
	});
	const boundaryArrows = [0.1, 2.2, 4.3].map((start) =>
		pathFromPoints(sample(9, (index) => membranePoint(1, start + (index / 8) * 0.55)))
	);
	const membraneNormals = [0.3, 2.35, 4.45].map((theta) => {
		const point = membranePoint(0.48, theta);
		return { x1: point.x, y1: point.y + 15, x2: point.x, y2: point.y - 34 };
	});

	const sphereArrows = [
		[320, 47, 320, 17],
		[320, 263, 320, 291],
		[154, 155, 116, 155],
		[486, 155, 524, 155],
		[205, 80, 177, 57],
		[435, 80, 463, 57],
		[205, 230, 177, 253],
		[435, 230, 463, 253]
	];
</script>

<div class="family-explorer">
	<DemoHeader title="Explore the Stokes family" />

	<div class="case-tabs" role="group" aria-label="Choose a theorem">
		{#each cases as item (item.id)}
			<button
				type="button"
				class={{ active: selected === item.id }}
				aria-pressed={selected === item.id}
				onclick={() => (selected = item.id)}
			>
				<span>{item.name}</span>
				<small>{item.degree}</small>
			</button>
		{/each}
	</div>

	<div class="theorem-stage">
		<svg
			viewBox="0 0 640 300"
			role="img"
			aria-label={`${current.name}: ${current.insideLabel} equals ${current.boundaryLabel}`}
		>
			<title>{current.name}: inside accumulation equals boundary measurement</title>
			<desc>{current.insideLabel}. By Stokes’ theorem, this equals {current.boundaryLabel}.</desc>
			<defs>
				<marker id="family-boundary-arrow" markerWidth="7" markerHeight="7" refX="6.2" refY="3.5" orient="auto">
					<path d="M0,0 L7,3.5 L0,7 Z" fill="var(--plot-violet)" />
				</marker>
				<marker id="family-field-arrow" markerWidth="6.5" markerHeight="6.5" refX="5.8" refY="3.25" orient="auto">
					<path d="M0,0 L6.5,3.25 L0,6.5 Z" fill="var(--plot-blue)" />
				</marker>
				<linearGradient id="family-region-fill" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="var(--plot-blue)" stop-opacity="0.16" />
					<stop offset="1" stop-color="var(--plot-violet)" stop-opacity="0.22" />
				</linearGradient>
				<radialGradient id="family-volume-fill" cx="38%" cy="28%" r="72%">
					<stop offset="0" stop-color="var(--plot-blue)" stop-opacity="0.25" />
					<stop offset="1" stop-color="var(--plot-violet)" stop-opacity="0.12" />
				</radialGradient>
			</defs>

			<text class="region-kicker" x="34" y="34">INSIDE {selected === 'ftc' ? '[a,b]' : selected === 'green' ? 'R' : selected === 'stokes' ? 'S' : 'V'}</text>
			<text class="boundary-kicker" x="606" y="34" text-anchor="end">BOUNDARY {selected === 'ftc' ? '{a,b}' : selected === 'green' ? '∂R' : selected === 'stokes' ? '∂S' : '∂V'}</text>

			{#key selected}
				<g class="geometry-layer">
					{#if selected === 'ftc'}
						<path class="density-fill" d={ftcFillPath} />
						<path class="density-curve" d={ftcCurvePath} />
						<line class="interval-line" x1="92" y1="208" x2="548" y2="208" />
						{#each ftcSlices as slice (slice.x)}
							<line class="density-slice" x1={slice.x} y1="208" x2={slice.x} y2={slice.y} />
						{/each}
						<circle class="endpoint endpoint-start" cx="92" cy="208" r="9" />
						<circle class="endpoint endpoint-end" cx="548" cy="208" r="9" />
						<text class="endpoint-value" x="92" y="240" text-anchor="middle">−F(a)</text>
						<text class="endpoint-value" x="548" y="240" text-anchor="middle">+F(b)</text>
						<text class="inside-caption" x="320" y="270" text-anchor="middle">sum the local changes F′(x) dx</text>
					{:else if selected === 'green'}
						<path class="region-shape" d="M92,175 C84,82 179,48 294,69 C402,36 538,81 552,164 C568,251 449,270 334,248 C222,278 106,253 92,175 Z" />
						<path class="boundary-segment" d="M92,175 C84,82 179,48 294,69" marker-end="url(#family-boundary-arrow)" />
						<path class="boundary-segment" d="M294,69 C402,36 538,81 552,164" marker-end="url(#family-boundary-arrow)" />
						<path class="boundary-segment" d="M552,164 C568,251 449,270 334,248" marker-end="url(#family-boundary-arrow)" />
						<path class="boundary-segment" d="M334,248 C222,278 106,253 92,175" marker-end="url(#family-boundary-arrow)" />
						{#each [[190,130],[320,112],[444,145],[238,207],[390,210]] as point (`${point[0]}-${point[1]}`)}
							<path class="curl-arrow" d={`M${point[0]-17},${point[1]+3} C${point[0]-21},${point[1]-17} ${point[0]+12},${point[1]-24} ${point[0]+19},${point[1]-5}`} marker-end="url(#family-field-arrow)" />
						{/each}
						<text class="inside-caption" x="320" y="166" text-anchor="middle">curl accumulated through the region</text>
						<path class="label-leader" d="M445,244 L492,270" />
						<text class="boundary-caption" x="600" y="278" text-anchor="end">counterclockwise circulation</text>
					{:else if selected === 'stokes'}
						<path class="surface-shape" d={membraneRing(1)} />
						{#each membraneRings as ring (ring.radius)}
							<path class:ring-boundary={ring.radius === 1} class="surface-mesh" d={ring.path} />
						{/each}
						{#each membraneSpokes as spoke (spoke)}
							<path class="surface-mesh" d={spoke} />
						{/each}
						{#each boundaryArrows as arrowPath (arrowPath)}
							<path class="boundary-segment boundary-arrow" d={arrowPath} marker-end="url(#family-boundary-arrow)" />
						{/each}
						{#each membraneNormals as arrow (`${arrow.x1}-${arrow.y1}`)}
							<line class="flux-arrow" x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} marker-end="url(#family-field-arrow)" />
						{/each}
						<text class="inside-caption" x="320" y="236" text-anchor="middle">curl flux through the hanging surface</text>
						<text class="boundary-caption" x="590" y="270" text-anchor="end">circulation follows the closed rim</text>
					{:else}
						<ellipse class="volume-shape" cx="320" cy="157" rx="174" ry="112" />
						<ellipse class="sphere-longitude" cx="320" cy="157" rx="58" ry="112" />
						<path class="volume-back" d="M146,157 C188,111 451,111 494,157" />
						<path class="volume-front" d="M146,157 C188,203 451,203 494,157" />
						<ellipse class="sphere-latitude" cx="320" cy="118" rx="140" ry="28" />
						<ellipse class="sphere-latitude" cx="320" cy="196" rx="140" ry="28" />
						{#each sphereArrows as arrow (arrow.join('-'))}
							<line class="flux-arrow" x1={arrow[0]} y1={arrow[1]} x2={arrow[2]} y2={arrow[3]} marker-end="url(#family-field-arrow)" />
						{/each}
						{#each [[282,139],[326,170],[365,135],[296,187],[350,201]] as source (source.join('-'))}
							<circle class="source-point" cx={source[0]} cy={source[1]} r="5" />
						{/each}
						<text class="inside-caption" x="320" y="161" text-anchor="middle">sources fill V</text>
						<text class="boundary-caption" x="596" y="280" text-anchor="end">flux leaves through the closed surface</text>
					{/if}
				</g>
			{/key}
		</svg>
	</div>

	<div class="equation-flow" aria-live="polite">
		<div class="formula-side formula-inside">
			<div class="formula-label"><i aria-hidden="true"></i><span>Inside {selected === 'ftc' ? '[a,b]' : selected === 'green' ? 'R' : selected === 'stokes' ? 'S' : 'V'}</span></div>
			<Katex math={current.interiorMath} display />
			<p>{current.insideLabel}</p>
		</div>
		<div class="equals-mark" aria-label="equals">
			<span>=</span>
			<small>Stokes</small>
		</div>
		<div class="formula-side formula-boundary">
			<div class="formula-label"><i aria-hidden="true"></i><span>Boundary {selected === 'ftc' ? '{a,b}' : selected === 'green' ? '∂R' : selected === 'stokes' ? '∂S' : '∂V'}</span></div>
			<Katex math={current.boundaryMath} display />
			<p>{current.boundaryLabel}</p>
		</div>
	</div>

	<div class="theorem-line">
		<div class="metadata" aria-label="Selected theorem details">
			<span><b>Region</b> {current.region}</span>
			<span><b>Boundary</b> {current.boundary}</span>
			<span><b>Degree</b> {current.degree}</span>
		</div>
		<div class="unified-form"><Katex math={String.raw`\int_M d\omega=\int_{\partial M}\omega`} /></div>
	</div>
</div>

<style>
	.family-explorer {
		font-family: var(--font-sans);
	}

	.case-tabs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.35rem;
		margin: 0 0 0.7rem;
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.case-tabs button {
		min-width: 0;
		padding: 0.42rem 0.5rem;
		border: 1px solid transparent;
		border-radius: 0.55rem;
		background: transparent;
		font-family: var(--font-sans);
		color: var(--color-ink-light);
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			color 0.16s ease;
	}

	.case-tabs button:hover {
		background: var(--color-d-soft);
		color: var(--color-ink);
	}

	.case-tabs button.active {
		border-color: color-mix(in srgb, var(--color-d) 58%, var(--color-border));
		background: var(--color-d-glow);
		color: var(--color-ink);
	}

	.case-tabs button:focus-visible {
		outline: 3px solid color-mix(in srgb, var(--color-d) 26%, transparent);
		outline-offset: 2px;
	}

	.case-tabs span,
	.case-tabs small {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.case-tabs span {
		font-size: 0.76rem;
		font-weight: 700;
		line-height: 1.2;
	}

	.case-tabs small {
		margin-top: 0.1rem;
		font-size: 0.7rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
	}

	.theorem-stage {
		border-bottom: 1px solid var(--color-border-light);
		background: linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, var(--color-d) 4%), transparent);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 18rem;
	}

	.geometry-layer {
		animation: geometry-in 0.22s ease-out both;
	}

	@keyframes geometry-in {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.region-kicker,
	.boundary-kicker,
	.inside-caption,
	.boundary-caption,
	.endpoint-value {
		font-family: var(--font-sans);
	}

	.region-kicker,
	.boundary-kicker {
		fill: var(--color-ink-faint);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.region-kicker {
		fill: var(--plot-blue);
	}

	.boundary-kicker {
		fill: var(--plot-violet);
	}

	.region-shape,
	.surface-shape,
	.density-fill {
		fill: url(#family-region-fill);
		stroke: none;
	}

	.density-curve {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 2.4;
	}

	.interval-line {
		stroke: var(--plot-axis);
		stroke-width: 2;
	}

	.density-slice {
		stroke: var(--plot-blue);
		stroke-width: 1.4;
		stroke-opacity: 0.5;
	}

	.endpoint {
		fill: var(--plot-background);
		stroke-width: 3;
	}

	.endpoint-start {
		stroke: var(--plot-rose);
	}

	.endpoint-end {
		stroke: var(--plot-violet);
	}

	.endpoint-value {
		fill: var(--color-ink);
		font-size: 14px;
		font-weight: 650;
	}

	.boundary-segment {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.curl-arrow,
	.flux-arrow {
		fill: none;
		stroke: var(--plot-blue);
		stroke-width: 2.4;
		stroke-linecap: round;
	}

	.surface-mesh,
	.volume-back,
	.volume-front,
	.sphere-longitude,
	.sphere-latitude {
		fill: none;
		stroke: var(--plot-axis);
		stroke-width: 1.2;
	}

	.surface-mesh {
		stroke-opacity: 0.82;
	}

	.surface-mesh.ring-boundary {
		stroke: var(--plot-violet);
		stroke-width: 3.2;
		stroke-opacity: 1;
	}

	.boundary-arrow {
		stroke-width: 3.6;
	}

	.sphere-longitude,
	.sphere-latitude {
		stroke: color-mix(in srgb, var(--plot-violet) 52%, var(--plot-axis));
	}

	.volume-shape {
		fill: url(#family-volume-fill);
		stroke: var(--plot-violet);
		stroke-width: 2.2;
	}

	.source-point {
		fill: var(--plot-blue);
		stroke: var(--plot-outline);
		stroke-width: 2;
	}

	.inside-caption,
	.boundary-caption {
		font-size: 13px;
		font-weight: 650;
	}

	.inside-caption {
		fill: var(--color-ink-light);
	}

	.boundary-caption {
		fill: var(--plot-violet);
	}

	.label-leader {
		fill: none;
		stroke: var(--plot-violet);
		stroke-width: 1.2;
		stroke-opacity: 0.65;
	}

	.equation-flow {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		gap: 0.9rem;
		padding: 0.85rem 0.2rem 0.7rem;
	}

	.formula-side {
		min-width: 0;
		text-align: center;
	}

	.formula-label {
		display: inline-flex;
		align-items: center;
		gap: 0.38rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.formula-label i {
		width: 0.48rem;
		height: 0.48rem;
		border-radius: 50%;
		background: var(--plot-blue);
	}

	.formula-boundary .formula-label i {
		background: var(--plot-violet);
	}

	.formula-side :global(.katex-display) {
		margin: 0.25rem 0 !important;
	}

	.formula-side p {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 0.76rem;
		line-height: 1.35;
		color: var(--color-ink-faint);
	}

	.equals-mark {
		display: grid;
		justify-items: center;
		gap: 0.05rem;
		color: var(--color-d);
	}

	.equals-mark span {
		font-family: var(--font-serif);
		font-size: 1.7rem;
		line-height: 1;
	}

	.equals-mark small {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.theorem-line {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding: 0.6rem 0.2rem 0;
		border-top: 1px solid var(--color-border-light);
	}

	.metadata {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 0.8rem;
		font-size: 0.7rem;
		color: var(--color-ink-faint);
	}

	.metadata b {
		margin-right: 0.2rem;
		color: var(--color-ink-light);
	}

	.unified-form {
		flex: 0 0 auto;
		color: var(--color-d);
	}

	@media (max-width: 640px) {
		.case-tabs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		svg {
			max-height: none;
		}

		.region-kicker,
		.boundary-kicker {
			font-size: 21px;
		}

		.inside-caption,
		.boundary-caption,
		.endpoint-value {
			font-size: 21px;
		}

		.equation-flow {
			grid-template-columns: 1fr;
			gap: 0.35rem;
			padding-inline: 0;
		}

		.equals-mark {
			grid-template-columns: 1fr auto 1fr;
			align-items: center;
			gap: 0.45rem;
		}

		.equals-mark::before,
		.equals-mark::after {
			content: '';
			height: 1px;
			background: var(--color-border-light);
		}

		.equals-mark small {
			display: none;
		}

		.theorem-line {
			align-items: flex-start;
			flex-direction: column-reverse;
		}

		.unified-form {
			align-self: center;
		}
	}
</style>
