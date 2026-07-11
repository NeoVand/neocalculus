<script lang="ts">
	import 'katex/dist/katex.min.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { onMount } from 'svelte';

	const siteUrl = 'https://neovand.github.io/neocalculus/';
	const socialImageUrl = `${siteUrl}og-neocalculus.png`;
	const title = 'Neocalculus — An Interactive, Infinitesimal-First Calculus Book';
	const description =
		'Explore calculus from first principles through clear explanations, beautiful interactive figures, and an infinitesimal-first path from functions to differential forms.';

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
	<link rel="canonical" href={siteUrl} />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content="Mostafa 'Neo' Mohsenvand" />
	<meta name="theme-color" content="#11131a" />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Neocalculus" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content={socialImageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="The Neocalculus interactive textbook, with flowing curves and its ten-chapter table of contents"
	/>

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImageUrl} />
	<meta
		name="twitter:image:alt"
		content="The Neocalculus interactive textbook, with flowing curves and its ten-chapter table of contents"
	/>
</svelte:head>

<div
	class="progress-bar"
	style="width: {progress}%"
	role="progressbar"
	aria-valuenow={progress}
	aria-valuemin={0}
	aria-valuemax={100}
></div>

<ThemeToggle />

{@render children()}
