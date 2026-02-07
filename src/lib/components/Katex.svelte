<script lang="ts">
	import katex from 'katex';

	interface Props {
		math: string;
		display?: boolean;
		class?: string;
	}

	let { math, display = false, class: className = '' }: Props = $props();

	let html = $derived(
		katex.renderToString(math, {
			displayMode: display,
			throwOnError: false,
			trust: true
		})
	);
</script>

<span class={className} data-katex={display ? 'display' : 'inline'}>
	{@html html}
</span>
