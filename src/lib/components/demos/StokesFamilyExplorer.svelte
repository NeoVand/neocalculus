<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';

	type CaseId = 'ftc' | 'green' | 'stokes' | 'divergence';

	const cases = [
		{
			id: 'ftc' as CaseId,
			name: 'FTC',
			degree: '0-form → 1-form',
			region: 'interval',
			boundary: 'two signed endpoints',
			interiorMath: String.raw`\int_a^b F'(x)\,dx`,
			boundaryMath: String.raw`F(b)-F(a)`
		},
		{
			id: 'green' as CaseId,
			name: 'Green',
			degree: '1-form → 2-form',
			region: 'plane region',
			boundary: 'oriented closed curve',
			interiorMath: String.raw`\iint_R(Q_x-P_y)\,dA`,
			boundaryMath: String.raw`\oint_{\partial R}P\,dx+Q\,dy`
		},
		{
			id: 'stokes' as CaseId,
			name: 'Stokes 3D',
			degree: '1-form → 2-form',
			region: 'oriented surface',
			boundary: 'oriented edge curve',
			interiorMath: String.raw`\iint_S(\nabla\times\mathbf F)\cdot\mathbf n\,dS`,
			boundaryMath: String.raw`\oint_{\partial S}\mathbf F\cdot d\mathbf r`
		},
		{
			id: 'divergence' as CaseId,
			name: 'Divergence',
			degree: '2-form → 3-form',
			region: 'solid volume',
			boundary: 'closed outer surface',
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
			<button type="button" class:active={selected === item.id} aria-pressed={selected === item.id} onclick={() => (selected = item.id)}>
				<span>{item.name}</span>
				<small>{item.degree}</small>
			</button>
		{/each}
	</div>

	<div class="family-grid">
		<div class="plot-shell">
			<svg viewBox="0 0 640 390" role="img" aria-label={`${current.name}: ${current.region} with ${current.boundary}`}>
				<defs>
					<marker id="family-boundary-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
						<path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" />
					</marker>
					<marker id="family-field-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
						<path d="M0,0 L7,3.5 L0,7 Z" fill="#2563eb" />
					</marker>
					<linearGradient id="surface-family-fill" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stop-color="#60a5fa" stop-opacity="0.2" />
						<stop offset="1" stop-color="#a855f7" stop-opacity="0.24" />
					</linearGradient>
					<radialGradient id="volume-family-fill" cx="40%" cy="30%" r="70%">
						<stop offset="0" stop-color="#bfdbfe" stop-opacity="0.5" />
						<stop offset="1" stop-color="#a855f7" stop-opacity="0.18" />
					</radialGradient>
				</defs>

				<text class="plot-heading" x="320" y="30" text-anchor="middle">{current.region}</text>

				{#if selected === 'ftc'}
					<line class="interior-line" x1="120" y1="205" x2="520" y2="205" />
					{#each [170, 230, 290, 350, 410, 470] as x (x)}
						<line class="field-arrow" x1={x} y1="235" x2={x + 30} y2="180" marker-end="url(#family-field-arrow)" />
					{/each}
					<circle class="boundary-point" cx="120" cy="205" r="11" />
					<circle class="boundary-point" cx="520" cy="205" r="11" />
					<text class="endpoint-sign" x="120" y="164" text-anchor="middle">−F(a)</text>
					<text class="endpoint-sign" x="520" y="164" text-anchor="middle">+F(b)</text>
					<text class="axis-label" x="120" y="232" text-anchor="middle">a</text>
					<text class="axis-label" x="520" y="232" text-anchor="middle">b</text>
				{:else if selected === 'green'}
					<path class="region-shape" d="M155,235 C145,125 245,72 354,92 C475,114 514,205 462,286 C405,352 283,344 195,300 C173,288 160,264 155,235 Z" />
					<path class="boundary-path" d="M155,235 C145,125 245,72 354,92 C475,114 514,205 462,286 C405,352 283,344 195,300 C173,288 160,264 155,235" marker-end="url(#family-boundary-arrow)" />
					{#each [[235,160],[320,145],[405,175],[240,250],[335,250],[415,250]] as point (`${point[0]}-${point[1]}`)}
						<path class="swirl" d={`M${point[0]-17},${point[1]} C${point[0]-10},${point[1]-18} ${point[0]+13},${point[1]-17} ${point[0]+17},${point[1]}`} marker-end="url(#family-field-arrow)" />
					{/each}
					<text class="inside-label" x="320" y="220" text-anchor="middle">curl density inside</text>
					<text class="boundary-label" x="470" y="315" text-anchor="middle">circulation on ∂R</text>
				{:else if selected === 'stokes'}
					<path class="surface-shape" d="M128,250 C185,118 300,105 510,190 C450,315 280,340 128,250 Z" />
					<path class="surface-grid" d="M170,208 C250,175 350,180 474,215" />
					<path class="surface-grid" d="M155,252 C250,220 365,230 470,266" />
					<path class="surface-grid" d="M225,151 C210,220 225,286 280,321" />
					<path class="surface-grid" d="M350,135 C325,205 345,273 395,302" />
					<path class="boundary-path" d="M128,250 C185,118 300,105 510,190 C450,315 280,340 128,250" marker-end="url(#family-boundary-arrow)" />
					{#each [[240,220],[330,205],[405,225]] as point (`${point[0]}-${point[1]}`)}
						<line class="field-arrow" x1={point[0]} y1={point[1]+25} x2={point[0]} y2={point[1]-28} marker-end="url(#family-field-arrow)" />
					{/each}
					<text class="inside-label" x="324" y="270" text-anchor="middle">curl flux through S</text>
					<text class="boundary-label" x="470" y="312" text-anchor="middle">circulation on ∂S</text>
				{:else}
					<ellipse class="volume-shape" cx="320" cy="210" rx="150" ry="125" />
					<ellipse class="volume-back" cx="320" cy="210" rx="150" ry="48" />
					{#each [[320,70,320,28],[205,120,165,85],[435,120,475,85],[180,220,125,220],[460,220,515,220],[225,300,185,340],[415,300,455,340],[320,335,320,375]] as a (a.join('-'))}
						<line class="field-arrow" x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} marker-end="url(#family-field-arrow)" />
					{/each}
					<text class="inside-label" x="320" y="210" text-anchor="middle">divergence inside V</text>
					<text class="boundary-label" x="320" y="357" text-anchor="middle">outward flux through ∂V</text>
				{/if}
			</svg>
		</div>

		<EquationPanel title={`${current.name}: one reading of Stokes`}>
			<Katex math={current.interiorMath} display />
			<div class="equals">equals</div>
			<Katex math={current.boundaryMath} display />
			<div class="mapping">
				<div><span>Region</span><strong>{current.region}</strong></div>
				<div><span>Boundary</span><strong>{current.boundary}</strong></div>
				<div><span>Degree</span><strong>{current.degree}</strong></div>
			</div>
			<Katex math={String.raw`\int_M d\omega=\int_{\partial M}\omega`} display />
		</EquationPanel>
	</div>
</div>

<style>
	.family-explorer {
		font-family: var(--font-sans);
	}

	.case-tabs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.45rem;
		margin: 0 0 0.8rem;
	}

	.case-tabs button {
		padding: 0.55rem 0.45rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.65rem;
		background: var(--color-surface);
		font-family: var(--font-sans);
		color: var(--color-ink-light);
		cursor: pointer;
	}

	.case-tabs button:hover,
	.case-tabs button.active {
		border-color: var(--color-d);
		background: rgb(168 85 247 / 8%);
		color: var(--color-ink);
	}

	.case-tabs span,
	.case-tabs small {
		display: block;
	}

	.case-tabs span {
		font-size: 0.76rem;
		font-weight: 750;
	}

	.case-tabs small {
		margin-top: 0.15rem;
		font-size: 0.62rem;
	}

	.family-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
		gap: 0.8rem;
		align-items: stretch;
	}

	.plot-shell {
		padding: 0.4rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: var(--color-surface);
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	.plot-heading,
	.inside-label,
	.boundary-label,
	.endpoint-sign,
	.axis-label {
		font-family: var(--font-sans);
	}

	.plot-heading {
		fill: var(--color-ink-light);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.interior-line {
		stroke: var(--color-ink-faint);
		stroke-width: 2;
	}

	.field-arrow,
	.swirl {
		fill: none;
		stroke: #2563eb;
		stroke-width: 2.3;
		stroke-linecap: round;
	}

	.boundary-point {
		fill: rgb(168 85 247 / 18%);
		stroke: var(--color-d);
		stroke-width: 2.5;
	}

	.endpoint-sign,
	.boundary-label {
		fill: var(--color-d);
		font-size: 13px;
		font-weight: 650;
	}

	.axis-label {
		fill: var(--color-ink-light);
		font-size: 13px;
		font-style: italic;
	}

	.region-shape,
	.surface-shape {
		fill: url(#surface-family-fill);
		stroke: none;
	}

	.boundary-path {
		fill: none;
		stroke: var(--color-d);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.surface-grid,
	.volume-back {
		fill: none;
		stroke: rgb(99 102 241 / 24%);
		stroke-width: 1.2;
	}

	.volume-shape {
		fill: url(#volume-family-fill);
		stroke: var(--color-d);
		stroke-width: 2;
	}

	.inside-label {
		fill: #1d4ed8;
		font-size: 13px;
		font-weight: 650;
	}

	.mapping {
		display: grid;
		gap: 0.4rem;
		margin: 0.55rem 0;
	}

	.equals {
		margin: -0.2rem 0;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-align: center;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.mapping div {
		display: grid;
		grid-template-columns: 4.5rem 1fr;
		gap: 0.4rem;
		font-size: 0.72rem;
	}

	.mapping span {
		color: var(--color-ink-faint);
	}

	.mapping strong {
		color: var(--color-ink);
	}

	@media (max-width: 780px) {
		.family-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.case-tabs {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
