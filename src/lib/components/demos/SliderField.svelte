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
		tone?: 'violet' | 'blue' | 'teal' | 'amber' | 'rose';
		oninput?: () => void;
	}

	let {
		label,
		min,
		max,
		step = 0.01,
		hint,
		id,
		decimals = 2,
		value = $bindable(0),
		tone = 'violet',
		oninput
	}: Props = $props();

	let display = $derived(value.toFixed(decimals));
	let fieldId = $derived(id ?? `slider-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
	let progress = $derived(max === min ? 0 : Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)));
</script>

<div class="demo-field">
	<div class="demo-field-top">
		<label class="demo-field-label" for={fieldId}>{label}</label>
		<span class="demo-field-value">{display}</span>
	</div>
	<input
		class="demo-slider tone-{tone}"
		style={`--slider-progress: ${progress}%;`}
		id={fieldId}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		oninput={() => oninput?.()}
	/>
	{#if hint}
		<div class="demo-field-hint">{hint}</div>
	{/if}
</div>
