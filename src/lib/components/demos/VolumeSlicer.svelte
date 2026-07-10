<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';

	const W = 760;
	const H = 320;
	const left = 62;
	const right = 28;
	const centerY = 158;
	const plotW = W - left - right;
	const radiusScale = 52;
	const sectionSamples = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

	let x = $state(2.4);

	const radius = $derived(Math.sqrt(x));
	const area = $derived(Math.PI * x);
	const volume = $derived((Math.PI * x * x) / 2);
	const sx = (value: number) => left + (value / 4) * plotW;
	const sy = (value: number) => centerY - value * radiusScale;
	const radiusLabelX = $derived(x > 3.15 ? sx(x) - 22 : sx(x) + 22);
	const radiusLabelAnchor = $derived(x > 3.15 ? 'end' : 'start');

	const topPath = $derived.by(() => {
		let path = '';
		for (let i = 0; i <= 120; i += 1) {
			const value = (4 * i) / 120;
			path += `${i === 0 ? 'M' : 'L'} ${sx(value)} ${sy(Math.sqrt(value))} `;
		}
		return path.trim();
	});

	const bottomPath = $derived.by(() => {
		let path = '';
		for (let i = 0; i <= 120; i += 1) {
			const value = (4 * i) / 120;
			path += `${i === 0 ? 'M' : 'L'} ${sx(value)} ${sy(-Math.sqrt(value))} `;
		}
		return path.trim();
	});

	const accumulatedPath = $derived.by(() => {
		let path = `M ${sx(0)} ${centerY} `;
		for (let i = 0; i <= 80; i += 1) {
			const value = (x * i) / 80;
			path += `L ${sx(value)} ${sy(Math.sqrt(value))} `;
		}
		for (let i = 80; i >= 0; i -= 1) {
			const value = (x * i) / 80;
			path += `L ${sx(value)} ${sy(-Math.sqrt(value))} `;
		}
		return `${path}Z`;
	});
</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: one cross-section builds a volume" />

	<DemoCard title="Choose a cross-section">
		<SliderField
			id="volume-slice-x"
			label="Position x"
			hint="Move the cross-section through the solid y = √x"
			min={0.25}
			max={4}
			step={0.01}
			decimals={2}
			bind:value={x}
		/>
	</DemoCard>

	<DemoCard title="Rotate the profile around the x-axis">
		<svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A movable circular cross-section through a solid of revolution">
			<defs>
				<linearGradient id="volume-fill" x1="0" x2="1" y1="0" y2="0">
					<stop offset="0%" stop-color="rgba(59,130,246,0.08)" />
					<stop offset="100%" stop-color="rgba(59,130,246,0.22)" />
				</linearGradient>
			</defs>

			<line x1={left} y1={centerY} x2={W - right} y2={centerY} stroke="#c9c5bd" stroke-width="1.2" />
			<path d={accumulatedPath} fill="url(#volume-fill)" stroke="none" />
			<path d={topPath} fill="none" stroke="#1a1a2e" stroke-width="2.4" />
			<path d={bottomPath} fill="none" stroke="#1a1a2e" stroke-width="1.5" stroke-opacity="0.45" />

			<g class="section-contours" aria-hidden="true">
				{#each sectionSamples.filter((sample) => sample < x - 0.08) as sample (sample)}
					<ellipse
						cx={sx(sample)}
						cy={centerY}
						rx="7"
						ry={Math.sqrt(sample) * radiusScale}
						fill="none"
						stroke="#3b82f6"
						stroke-width="0.8"
						stroke-opacity="0.18"
					/>
				{/each}
			</g>

			<ellipse
				cx={sx(x)}
				cy={centerY}
				rx="15"
				ry={radius * radiusScale}
				fill="rgba(168,85,247,0.18)"
				stroke="#a855f7"
				stroke-width="2"
			/>
			<line
				x1={sx(x)}
				y1={centerY}
				x2={sx(x)}
				y2={sy(radius)}
				stroke="#a855f7"
				stroke-width="1.5"
				stroke-dasharray="5 4"
			/>

			<text
				x={radiusLabelX}
				y={sy(radius / 2)}
				text-anchor={radiusLabelAnchor}
				class="plot-label"
				fill="#7e22ce"
				font-size="12"
				font-family="var(--font-sans)"
			>
				r = √x = {radius.toFixed(2)}
			</text>
			<text x={sx(x)} y={centerY + radius * radiusScale + 24} text-anchor="middle" class="plot-label" fill="#7e22ce" font-size="12" font-family="var(--font-sans)">
				x = {x.toFixed(2)}
			</text>
			<text x={W - right - 8} y={centerY - 10} text-anchor="end" class="plot-label" fill="#77716a" font-size="12" font-family="var(--font-sans)">
				y = √x
			</text>
		</svg>
		<div class="slice-readout" aria-live="polite">
			<span><small>position</small>x = {x.toFixed(2)}</span>
			<span><small>radius</small>r = {radius.toFixed(2)}</span>
			<span><small>disk area</small>A = {area.toFixed(2)}</span>
		</div>
	</DemoCard>

	<EquationPanel title="Cross-section and accumulated volume">
		<Katex math={String.raw`A(x)=\pi(\sqrt{x})^2=\pi x\approx ${area.toFixed(2)}`} display />
		<Katex math={String.raw`V(x)=\int_0^x \pi t\,dt=\frac{\pi x^2}{2}\approx ${volume.toFixed(2)}`} display />
	</EquationPanel>
</div>

<style>
	svg {
		width: 100%;
		height: auto;
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		background: white;
	}

	.slice-readout {
		display: none;
	}

	@media (max-width: 520px) {
		.plot-label {
			display: none;
		}

		.slice-readout {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.3rem;
			margin-top: 0.45rem;
			font-family: var(--font-mono);
			font-size: 0.67rem;
			font-weight: 700;
			color: var(--color-ink-light);
			font-variant-numeric: tabular-nums;
		}

		.slice-readout span {
			display: grid;
			gap: 0.05rem;
		}

		.slice-readout small {
			font-family: var(--font-sans);
			font-size: 0.54rem;
			font-weight: 600;
			letter-spacing: 0.05em;
			text-transform: uppercase;
			color: var(--color-ink-faint);
		}
	}
</style>
