<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		caption?: string;
		number?: string;
		class?: string;
	}

	let { children, caption, number, class: className = '' }: Props = $props();
</script>

<figure class="neo-figure {className}">
	<div class="figure-content">
		{@render children()}
	</div>
	{#if caption}
		<figcaption>
			{#if number}<span class="figure-number">Figure {number}.</span>{/if}
			{caption}
		</figcaption>
	{/if}
</figure>
