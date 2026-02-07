<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		type?: 'definition' | 'theorem' | 'key-idea' | 'warning';
		title?: string;
	}

	let { children, type = 'key-idea', title }: Props = $props();
</script>

<aside class="callout callout-{type}">
	{#if title}<div class="callout-title">{title}</div>{/if}
	<div class="callout-content">{@render children()}</div>
</aside>
