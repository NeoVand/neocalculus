<script lang="ts">
	import { onMount } from 'svelte';
	import type { Component } from 'svelte';

	type ChapterModule = {
		default: Component;
	};

	interface Props {
		id: string;
		chapterNumber: string;
		title: string;
		preview: string;
		load: () => Promise<ChapterModule>;
	}

	let { id, chapterNumber, title, preview, load }: Props = $props();

	let started = $state(false);
	let modulePromise = $state<Promise<ChapterModule> | null>(null);

	function scrollToHashTarget() {
		if (typeof window === 'undefined') return;
		const hash = window.location.hash;
		if (!hash.startsWith('#')) return;

		const targetId = decodeURIComponent(hash.slice(1));
		if (!targetId) return;

		const target = document.getElementById(targetId);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function scheduleHashScroll() {
		if (typeof window === 'undefined') return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				scrollToHashTarget();
			});
		});
	}

	function beginLoad(force = false) {
		if (started && !force) return;
		started = true;
		modulePromise = load().then((module) => {
			scheduleHashScroll();
			return module;
		});
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					beginLoad();
					observer.disconnect();
				}
			},
			{ rootMargin: '800px 0px' }
		);

		const target = document.getElementById(id);
		if (target) observer.observe(target);

		return () => observer.disconnect();
	});
</script>

{#if started && modulePromise}
	{#await modulePromise}
		<section class="chapter chapter-shell chapter-shell-loading" {id}>
			<div class="content-width">
				<div class="chapter-shell-inner">
					<span class="chapter-number">Chapter {chapterNumber}</span>
					<h2 class="chapter-title">{title}</h2>
					<p class="chapter-shell-copy">Loading chapter content...</p>
				</div>
			</div>
		</section>
	{:then { default: ChapterComponent }}
		<ChapterComponent />
	{:catch _error}
		<section class="chapter chapter-shell chapter-shell-error" {id}>
			<div class="content-width">
				<div class="chapter-shell-inner">
					<span class="chapter-number">Chapter {chapterNumber}</span>
					<h2 class="chapter-title">{title}</h2>
					<p class="chapter-shell-copy">
						Chapter load failed. Retry to continue reading this section.
					</p>
					<button class="chapter-shell-button" type="button" onclick={() => beginLoad(true)}>
						Retry chapter load
					</button>
				</div>
			</div>
		</section>
	{/await}
{:else}
	<section class="chapter chapter-shell" {id}>
		<div class="content-width">
			<div class="chapter-shell-inner">
				<span class="chapter-number">Chapter {chapterNumber}</span>
				<h2 class="chapter-title">{title}</h2>
				<p class="chapter-shell-copy">{preview}</p>
				<button class="chapter-shell-button" type="button" onclick={() => beginLoad()}>
					Open chapter
				</button>
			</div>
		</div>
	</section>
{/if}

<style>
	.chapter-shell-inner {
		background: linear-gradient(180deg, rgba(168, 85, 247, 0.05), rgba(168, 85, 247, 0.02));
		border: 1px solid var(--color-border-light);
		border-radius: 0.9rem;
		padding: 1.25rem 1.25rem 1.15rem;
	}

	.chapter-shell-copy {
		font-family: var(--font-serif);
		color: var(--color-ink-light);
		font-size: 1rem;
		line-height: 1.65;
		margin: 0 0 0.9rem;
	}

	.chapter-shell-button {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--color-d);
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		padding: 0.4rem 0.85rem;
		cursor: pointer;
		transition:
			border-color 0.15s ease,
			background-color 0.15s ease;
	}

	.chapter-shell-button:hover {
		border-color: var(--color-d);
		background: var(--color-d-soft);
	}

	.chapter-shell-error .chapter-shell-inner {
		border-color: #f0d3d5;
		background: linear-gradient(180deg, rgba(239, 68, 68, 0.03), rgba(239, 68, 68, 0.01));
	}
</style>
