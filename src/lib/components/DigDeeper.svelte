<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		title?: string;
	}

	let { children, title = 'Dig Deeper' }: Props = $props();
</script>

<details class="dig-deeper">
	<summary>{title}</summary>
	<div class="dig-content">
		{@render children()}
	</div>
</details>
