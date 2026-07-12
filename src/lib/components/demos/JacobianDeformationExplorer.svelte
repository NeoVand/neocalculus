<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';
	import SliderField from '$lib/components/demos/SliderField.svelte';
	import JacobianMapShader from '$lib/components/demos/JacobianMapShader.svelte';

	let u0 = $state(1);
	let v0 = $state(1);
	let radius = $state(0.45);
	let mapShader: JacobianMapShader | undefined;

	const j11 = $derived(2 * u0);
	const j12 = $derived(-2 * v0);
	const j21 = $derived(2 * v0);
	const j22 = $derived(2 * u0);
	const determinant = $derived(j11 * j22 - j12 * j21);
	const orientation = $derived(
		determinant > 0.001 ? 'preserved' : determinant < -0.001 ? 'reversed' : 'collapsed'
	);
	const nonlinearGap = $derived(2 * radius * radius);

	function redrawMap() {
		requestAnimationFrame(() => mapShader?.redraw());
	}
</script>

<div class="jacobian-explorer">
	<DemoHeader title="Explore how a Jacobian deforms a small patch" />

	<DemoCard title="Choose a base point and an ordinary patch size">
		<div class="demo-controls-grid">
			<SliderField
				label="Base coordinate u₀"
				min={-1.2}
				max={1.2}
				step={0.1}
				decimals={1}
				bind:value={u0}
				tone="blue"
				oninput={redrawMap}
			/>
			<SliderField
				label="Base coordinate v₀"
				min={-1.2}
				max={1.2}
				step={0.1}
				decimals={1}
				bind:value={v0}
				tone="amber"
				oninput={redrawMap}
			/>
			<SliderField
				label="Patch half-width s"
				min={0.12}
				max={0.7}
				step={0.01}
				decimals={2}
				bind:value={radius}
				hint="Shrink s to see the nonlinear image approach its Jacobian prediction."
				tone="violet"
				oninput={redrawMap}
			/>
		</div>
	</DemoCard>

	<JacobianMapShader bind:this={mapShader} u={u0} v={v0} {radius} />

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
		<p class="gap-reading">
			For this quadratic map, this is the largest visible gap on the selected square patch.
		</p>
	</EquationPanel>
</div>

<style>
	.jacobian-explorer {
		font-family: var(--font-sans);
	}

	.gap-reading {
		margin: 0.28rem 0 0;
		color: var(--color-ink-faint);
		font-size: 0.75rem;
		line-height: 1.45;
	}
</style>
