<script lang="ts">
	interface Props {
		label: string;
		hint?: string;
		checked?: boolean;
	}

	let { label, hint, checked = $bindable(false) }: Props = $props();
</script>

<div class="demo-toggle-field">
	<button
		type="button"
		class="demo-switch"
		class:is-on={checked}
		onclick={() => (checked = !checked)}
		role="switch"
		aria-checked={checked}
		aria-label={label}
	>
		<span class="demo-switch-knob"></span>
	</button>
	<div class="demo-toggle-meta">
		<div class="demo-field-label">{label}</div>
		{#if hint}
			<div class="demo-field-hint">{hint}</div>
		{/if}
	</div>
</div>
