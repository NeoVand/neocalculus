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
						<path class="density-fill" d="M92,204 L92,173 C145,142 194,151 242,120 C301,82 356,111 402,92 C453,71 504,103 548,132 L548,204 Z" />
						<path class="density-curve" d="M92,173 C145,142 194,151 242,120 C301,82 356,111 402,92 C453,71 504,103 548,132" />
						<line class="interval-line" x1="92" y1="204" x2="548" y2="204" />
						{#each [132, 188, 244, 300, 356, 412, 468, 524] as x (x)}
							<line class="density-slice" x1={x} y1="204" x2={x} y2={x < 250 ? 143 : x < 420 ? 105 : 126} />
						{/each}
						<circle class="endpoint endpoint-start" cx="92" cy="204" r="9" />
						<circle class="endpoint endpoint-end" cx="548" cy="204" r="9" />
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
						<path class="surface-shape" d="M78,205 C158,65 286,53 564,138 C501,264 282,292 78,205 Z" />
						<path class="surface-mesh" d="M119,166 C236,122 385,126 531,161" />
						<path class="surface-mesh" d="M96,211 C235,167 403,181 515,221" />
						<path class="surface-mesh" d="M190,92 C170,160 194,235 266,276" />
						<path class="surface-mesh" d="M330,73 C301,150 332,229 413,257" />
						<path class="boundary-segment" d="M78,205 C158,65 286,53 385,78" marker-end="url(#family-boundary-arrow)" />
						<path class="boundary-segment" d="M385,78 C460,96 521,112 564,138" marker-end="url(#family-boundary-arrow)" />
						<path class="boundary-segment" d="M564,138 C501,264 282,292 78,205" marker-end="url(#family-boundary-arrow)" />
						{#each [[210,180,210,112],[325,170,325,96],[438,182,438,116]] as arrow (arrow.join('-'))}
							<line class="flux-arrow" x1={arrow[0]} y1={arrow[1]} x2={arrow[2]} y2={arrow[3]} marker-end="url(#family-field-arrow)" />
						{/each}
						<text class="inside-caption" x="322" y="218" text-anchor="middle">curl flux through the oriented surface</text>
						<path class="label-leader" d="M455,239 L508,270" />
						<text class="boundary-caption" x="600" y="278" text-anchor="end">circulation on the edge</text>
					{:else}
						<ellipse class="volume-shape" cx="320" cy="157" rx="174" ry="112" />
						<path class="volume-back" d="M146,157 C188,104 451,104 494,157" />
						<path class="volume-front" d="M146,157 C188,216 451,216 494,157" />
						{#each [[320,157,320,42],[320,157,320,272],[320,157,145,157],[320,157,495,157],[320,157,194,72],[320,157,446,72],[320,157,195,241],[320,157,445,241]] as arrow (arrow.join('-'))}
							<line class="flux-arrow" x1={arrow[0]} y1={arrow[1]} x2={arrow[2]} y2={arrow[3]} marker-end="url(#family-field-arrow)" />
						{/each}
						<circle class="source-point" cx="320" cy="157" r="7" />
						<text class="inside-caption label-halo" x="320" y="195" text-anchor="middle">source density inside V</text>
						<text class="boundary-caption label-halo" x="512" y="256" text-anchor="end">outward flux through ∂V</text>
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
	.volume-front {
		fill: none;
		stroke: var(--plot-axis);
		stroke-width: 1.2;
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

	.label-halo {
		paint-order: stroke;
		stroke: var(--plot-background);
		stroke-width: 8px;
		stroke-linejoin: round;
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
