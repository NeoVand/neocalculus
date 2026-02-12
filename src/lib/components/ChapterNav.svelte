<script lang="ts">
	import { onMount } from 'svelte';

	export type TocChapter = {
		id: string;
		number: string;
		title: string;
		subtitle?: string;
		kind?: 'core' | 'extension';
	};

	interface Props {
		chapters: readonly TocChapter[];
		mode?: 'full' | 'floating';
		heroSelector?: string;
	}

	let { chapters, mode = 'floating', heroSelector = '.hero' }: Props = $props();

	let isPastHero = $state(false);
	let isOpen = $state(false);
	let activeId = $state('');

	let activeIndex = $derived.by(() => {
		const currentId = activeId || chapters[0]?.id || '';
		const index = chapters.findIndex((chapter) => chapter.id === currentId);
		return index >= 0 ? index : 0;
	});

	let activeChapter = $derived(chapters[activeIndex] ?? chapters[0]);
	let progressText = $derived(`${Math.min(activeIndex + 1, chapters.length)} / ${chapters.length}`);

	function chapterIndex(id: string) {
		return chapters.findIndex((chapter) => chapter.id === id);
	}

	function isVisited(id: string) {
		const index = chapterIndex(id);
		return index >= 0 && index < activeIndex;
	}

	function jumpTo(id: string) {
		if (typeof window === 'undefined') return;

		isOpen = false;
		activeId = id;

		const target = document.getElementById(id);
		if (!target) return;

		const hash = `#${encodeURIComponent(id)}`;
		if (window.location.hash !== hash) {
			history.pushState(null, '', hash);
		}

		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	onMount(() => {
		if (mode !== 'floating') return;

		let rafPending = false;

		const updateState = () => {
			const hero = document.querySelector<HTMLElement>(heroSelector);
			if (hero) {
				isPastHero = hero.getBoundingClientRect().bottom <= 96;
			} else {
				isPastHero = true;
			}

			if (chapters.length === 0) return;

			const anchorLine = Math.min(window.innerHeight * 0.35, 260);
			let currentId = activeId || chapters[0].id;

			for (const chapter of chapters) {
				const element = document.getElementById(chapter.id);
				if (!element) continue;
				if (element.getBoundingClientRect().top <= anchorLine) {
					currentId = chapter.id;
				}
			}

			activeId = currentId;
		};

		const scheduleUpdate = () => {
			if (rafPending) return;
			rafPending = true;
			requestAnimationFrame(() => {
				rafPending = false;
				updateState();
			});
		};

		const handleHashChange = () => {
			const hash = decodeURIComponent(window.location.hash.slice(1));
			if (!hash) return;
			if (chapters.some((chapter) => chapter.id === hash)) {
				activeId = hash;
			}
			scheduleUpdate();
		};

		scheduleUpdate();
		handleHashChange();

		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		window.addEventListener('hashchange', handleHashChange);

		const mutationObserver = new MutationObserver(scheduleUpdate);
		mutationObserver.observe(document.body, { childList: true, subtree: true });

		return () => {
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			window.removeEventListener('hashchange', handleHashChange);
			mutationObserver.disconnect();
		};
	});
</script>

{#if mode === 'full'}
	<nav class="toc-card" aria-label="Table of contents">
		<div class="toc-card-head">
			<p class="toc-card-eyebrow">Book Navigation</p>
			<h3>Table of Contents</h3>
			<p>
				The list below is the source of truth for chapter order, including the optimization extension.
				Use it to jump to any chapter.
			</p>
		</div>

		<ol>
			{#each chapters as chapter (chapter.id)}
				<li class:active={activeId === chapter.id}>
					<button type="button" onclick={() => jumpTo(chapter.id)}>
						<span class="toc-number">{chapter.number}</span>
						<span class="toc-main">
							<span class="toc-title">{chapter.title}</span>
							{#if chapter.subtitle}
								<span class="toc-subtitle">{chapter.subtitle}</span>
							{/if}
						</span>
						{#if chapter.kind === 'extension'}
							<span class="toc-kind">Extension</span>
						{/if}
					</button>
				</li>
			{/each}
		</ol>

		<p class="toc-card-note">
			The floating TOC appears after the hero and tracks your live reading position.
		</p>
	</nav>
{:else if isPastHero}
	<aside class="toc-rail" aria-label="Chapter navigation">
		<header>
			<span class="toc-rail-label">Reading Position</span>
			<strong>{progressText}</strong>
		</header>
		<ol>
			{#each chapters as chapter (chapter.id)}
				<li class:active={activeId === chapter.id} class:visited={isVisited(chapter.id)}>
					<button type="button" onclick={() => jumpTo(chapter.id)}>
						<span class="toc-rail-number">{chapter.number}</span>
						<span class="toc-rail-title">{chapter.title}</span>
					</button>
				</li>
			{/each}
		</ol>
		<button class="toc-top" type="button" onclick={() => jumpTo(chapters[0].id)}>Jump to Top</button>
	</aside>

	<button
		class="toc-mobile-toggle"
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Toggle table of contents"
		aria-expanded={isOpen}
	>
		<span class="toc-mobile-progress">{progressText}</span>
		<span class="toc-mobile-title">{activeChapter?.number}. {activeChapter?.title}</span>
	</button>
{/if}

{#if mode === 'floating' && isOpen}
	<button class="toc-mobile-backdrop" type="button" aria-label="Close table of contents" onclick={() => (isOpen = false)}></button>
	<nav class="toc-mobile-drawer" aria-label="Table of contents drawer">
		<header>
			<p class="toc-card-eyebrow">Table of Contents</p>
			<strong>Chapter {Math.min(activeIndex + 1, chapters.length)} of {chapters.length}</strong>
		</header>
		<ol>
			{#each chapters as chapter (chapter.id)}
				<li class:active={activeId === chapter.id} class:visited={isVisited(chapter.id)}>
					<button type="button" onclick={() => jumpTo(chapter.id)}>
						<span class="toc-number">{chapter.number}</span>
						<span class="toc-main">
							<span class="toc-title">{chapter.title}</span>
							{#if chapter.subtitle}
								<span class="toc-subtitle">{chapter.subtitle}</span>
							{/if}
						</span>
						{#if chapter.kind === 'extension'}
							<span class="toc-kind">Extension</span>
						{/if}
					</button>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.toc-card {
		margin-top: var(--space-lg);
		max-width: 48rem;
		width: min(48rem, 100%);
		padding: 1.1rem 1.1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 82%, #9ec5fe 18%);
		border-radius: 0.95rem;
		background:
			radial-gradient(circle at 85% 8%, rgba(30, 144, 255, 0.08), transparent 38%),
			linear-gradient(165deg, #ffffff 0%, #f9fbff 55%, #f7f6ff 100%);
		text-align: left;
		animation: float-down 1.2s var(--ease-out-expo);
	}

	.toc-card-head h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 1.25rem;
		color: var(--color-ink);
	}

	.toc-card-head p {
		margin: 0.45rem 0 0;
		font-family: var(--font-serif);
		font-size: 0.94rem;
		line-height: 1.6;
		color: var(--color-ink-light);
	}

	.toc-card-eyebrow {
		margin: 0 0 0.25rem;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.toc-card ol,
	.toc-mobile-drawer ol,
	.toc-rail ol {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-card ol {
		margin-top: 0.85rem;
		display: grid;
		gap: 0.35rem;
	}

	.toc-card li button,
	.toc-mobile-drawer li button {
		width: 100%;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.55rem 0.6rem;
		border-radius: 0.6rem;
		cursor: pointer;
		text-align: left;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease;
	}

	.toc-card li button:hover,
	.toc-mobile-drawer li button:hover {
		background: color-mix(in srgb, var(--color-d-soft) 60%, white 40%);
	}

	.toc-number,
	.toc-rail-number {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
		color: var(--color-ink-faint);
		min-width: 2rem;
	}

	.toc-main {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
		flex: 1;
	}

	.toc-title,
	.toc-rail-title {
		font-family: var(--font-sans);
		font-size: 0.84rem;
		font-weight: 600;
		line-height: 1.3;
		color: var(--color-ink-light);
	}

	.toc-subtitle {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--color-ink-faint);
	}

	.toc-kind {
		font-family: var(--font-sans);
		font-size: 0.63rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #8a4f00;
		background: #fff4d6;
		border: 1px solid #f4d9a0;
		border-radius: 999px;
		padding: 0.18rem 0.45rem;
	}

	.toc-card li.active button,
	.toc-mobile-drawer li.active button {
		background: var(--color-d-glow);
	}

	.toc-card li.active .toc-title,
	.toc-mobile-drawer li.active .toc-title,
	.toc-rail li.active .toc-rail-title {
		color: var(--color-d);
	}

	.toc-card-note {
		margin: 0.6rem 0 0;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}

	.toc-rail {
		position: fixed;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 52;
		width: 16rem;
		display: none;
		padding: 0.7rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.9rem;
		background: color-mix(in srgb, white 92%, #edf4ff 8%);
		box-shadow: 0 14px 36px rgba(18, 24, 33, 0.08);
	}

	@media (min-width: 1280px) {
		.toc-rail {
			display: block;
		}
	}

	.toc-rail header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.55rem;
	}

	.toc-rail-label {
		font-family: var(--font-sans);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
	}

	.toc-rail header strong {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		color: var(--color-d);
	}

	.toc-rail ol {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.toc-rail li button {
		width: 100%;
		border: none;
		background: none;
		display: flex;
		gap: 0.45rem;
		align-items: center;
		padding: 0.35rem 0.42rem;
		border-radius: 0.45rem;
		text-align: left;
		cursor: pointer;
	}

	.toc-rail li button:hover {
		background: var(--color-d-soft);
	}

	.toc-rail li.visited .toc-rail-title {
		color: var(--color-ink-faint);
	}

	.toc-rail li.active button {
		background: var(--color-d-glow);
	}

	.toc-top {
		margin-top: 0.55rem;
		width: 100%;
		border: 1px solid var(--color-border);
		background: white;
		color: var(--color-d);
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.35rem 0.55rem;
		cursor: pointer;
	}

	.toc-top:hover {
		border-color: var(--color-d);
		background: var(--color-d-soft);
	}

	.toc-mobile-toggle {
		position: fixed;
		bottom: 1.15rem;
		right: 1rem;
		z-index: 58;
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 12rem;
		max-width: min(18rem, calc(100vw - 2rem));
		border: 1px solid var(--color-border);
		background: white;
		border-radius: 0.85rem;
		padding: 0.48rem 0.62rem;
		text-align: left;
		cursor: pointer;
		box-shadow: 0 10px 24px rgba(18, 24, 33, 0.16);
	}

	.toc-mobile-progress {
		font-family: var(--font-sans);
		font-size: 0.63rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-d);
	}

	.toc-mobile-title {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-ink-light);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (min-width: 1280px) {
		.toc-mobile-toggle {
			display: none;
		}
	}

	.toc-mobile-backdrop {
		position: fixed;
		inset: 0;
		border: none;
		background: rgba(0, 0, 0, 0.34);
		z-index: 70;
	}

	.toc-mobile-drawer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 71;
		max-height: 76vh;
		overflow-y: auto;
		padding: 1rem 1rem 1.35rem;
		background: white;
		border-radius: 1rem 1rem 0 0;
		box-shadow: 0 -12px 36px rgba(18, 24, 33, 0.18);
	}

	.toc-mobile-drawer header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 0.55rem;
		border-bottom: 1px solid var(--color-border-light);
		margin-bottom: 0.5rem;
	}

	.toc-mobile-drawer header strong {
		font-family: var(--font-sans);
		font-size: 0.76rem;
		font-weight: 600;
		color: var(--color-d);
	}

	.toc-mobile-drawer li.visited .toc-title {
		color: var(--color-ink-faint);
	}
</style>
