<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children: Snippet;
		class?: string;
	}

	let { title, children, class: className = '' }: Props = $props();
</script>

<section class={`demo-card ${className}`.trim()}>
	{#if title}
		<div class="demo-card-title">{title}</div>
	{/if}
	<div class="demo-card-body">
		{@render children()}
	</div>
</section>
