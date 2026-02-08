<script lang="ts">
	interface Props {
		label: string;
		min: number;
		max: number;
		step?: number;
		hint?: string;
		id?: string;
		decimals?: number;
		value?: number;
	}

	let {
		label,
		min,
		max,
		step = 0.01,
		hint,
		id,
		decimals = 2,
		value = $bindable(0)
	}: Props = $props();

	let display = $derived(value.toFixed(decimals));
	let fieldId = $derived(id ?? `slider-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
</script>

<div class="demo-field">
	<div class="demo-field-top">
		<label class="demo-field-label" for={fieldId}>{label}</label>
		<span class="demo-field-value">{display}</span>
	</div>
	<input class="demo-slider" id={fieldId} type="range" {min} {max} {step} bind:value />
	{#if hint}
		<div class="demo-field-hint">{hint}</div>
	{/if}
</div>
