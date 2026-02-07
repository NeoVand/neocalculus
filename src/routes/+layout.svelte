<script lang="ts">
	import 'katex/dist/katex.min.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	let scrollY = $state(0);
	let scrollHeight = $state(0);
	let innerHeight = $state(0);

	let progress = $derived(
		scrollHeight > innerHeight ? Math.min(scrollY / (scrollHeight - innerHeight), 1) * 100 : 0
	);

	onMount(() => {
		const update = () => {
			scrollHeight = document.documentElement.scrollHeight;
			innerHeight = window.innerHeight;
		};
		update();
		window.addEventListener('resize', update);
		const ro = new ResizeObserver(update);
		ro.observe(document.body);
		return () => {
			window.removeEventListener('resize', update);
			ro.disconnect();
		};
	});
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Neocalculus</title>
	<meta name="description" content="Calculus, reimagined from first principles." />
</svelte:head>

<div
	class="progress-bar"
	style="width: {progress}%"
	role="progressbar"
	aria-valuenow={progress}
	aria-valuemin={0}
	aria-valuemax={100}
></div>

{@render children()}
