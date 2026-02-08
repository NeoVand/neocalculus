<script lang="ts">
	interface LegendItem {
		label: string;
		color: string;
	}

	interface Props {
		items: LegendItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

<ul class={`demo-legend ${className}`.trim()}>
	{#each items as item}
		<li>
			<span class="demo-legend-swatch" style={`--swatch:${item.color}`}></span>
			<span>{item.label}</span>
		</li>
	{/each}
</ul>
