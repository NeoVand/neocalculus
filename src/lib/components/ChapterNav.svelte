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

	let { chapters, mode = 'full', heroSelector = '.hero' }: Props = $props();

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
	let progressPercent = $derived.by(() => {
		if (chapters.length === 0) return 0;
		return Math.round((Math.min(activeIndex + 1, chapters.length) / chapters.length) * 100);
	});

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
				isPastHero = hero.getBoundingClientRect().bottom <= 88;
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
			<h3>Table of Contents</h3>
			<p>Ten chapters. Jump directly to any chapter.</p>
		</div>

		<ol>
			{#each chapters as chapter (chapter.id)}
				<li>
					<button type="button" onclick={() => jumpTo(chapter.id)}>
						<span class="toc-number">{chapter.number}</span>
						<span class="toc-main">
							<span class="toc-title">{chapter.title}</span>
						</span>
					</button>
				</li>
			{/each}
		</ol>
	</nav>
{:else if isPastHero}
	<aside class="toc-rail" aria-label="Chapter navigator">
		<header>
			<p class="toc-rail-eyebrow">Chapter Navigator</p>
			<p class="toc-rail-progress">{progressText}</p>
		</header>
		<div class="toc-rail-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent}>
			<div class="toc-rail-meter-fill" style={`width: ${progressPercent}%`}></div>
		</div>
		<p class="toc-rail-active">
			Now reading <strong>{activeChapter?.number}. {activeChapter?.title}</strong>
		</p>
		<ol>
			{#each chapters as chapter (chapter.id)}
				<li class:active={activeId === chapter.id}>
					<button type="button" onclick={() => jumpTo(chapter.id)}>
						<span class="toc-rail-number">{chapter.number}</span>
						<span class="toc-rail-main">
							<span class="toc-rail-title">{chapter.title}</span>
							{#if chapter.subtitle}
								<span class="toc-rail-subtitle">{chapter.subtitle}</span>
							{/if}
						</span>
					</button>
				</li>
			{/each}
		</ol>
	</aside>

	<button
		class="toc-mobile-toggle"
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Toggle chapter navigator"
		aria-expanded={isOpen}
	>
		<span class="toc-mobile-meta">{progressText}</span>
		<span class="toc-mobile-title">{activeChapter?.number}. {activeChapter?.title}</span>
	</button>
{/if}

{#if mode === 'floating' && isOpen}
	<button class="toc-mobile-backdrop" type="button" aria-label="Close chapter navigator" onclick={() => (isOpen = false)}></button>
	<nav class="toc-mobile-drawer" aria-label="Chapter navigator drawer">
		<header>
			<p class="toc-card-eyebrow">Chapter Navigator</p>
			<strong>{progressText}</strong>
		</header>
		<div class="toc-rail-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent}>
			<div class="toc-rail-meter-fill" style={`width: ${progressPercent}%`}></div>
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
					</button>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.toc-card {
		margin-top: var(--space-sm);
		max-width: 34rem;
		width: min(34rem, 100%);
		padding: 0.78rem 0.76rem 0.72rem;
		border: 1px solid color-mix(in srgb, var(--color-border) 82%, #9ec5fe 18%);
		border-radius: 0.9rem;
		background:
			radial-gradient(circle at 90% 6%, rgba(30, 144, 255, 0.06), transparent 36%),
			linear-gradient(165deg, #ffffff 0%, #fbfcff 55%, #f8f8ff 100%);
		text-align: left;
		animation: float-down 1.2s var(--ease-out-expo);
	}

	.toc-card-head h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-size: 0.98rem;
		color: var(--color-ink);
	}

	.toc-card-head p {
		margin: 0.24rem 0 0;
		font-family: var(--font-serif);
		font-size: 0.76rem;
		line-height: 1.4;
		color: var(--color-ink-light);
	}

	.toc-card-eyebrow,
	.toc-rail-eyebrow {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.68rem;
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
		margin-top: 0.5rem;
		display: grid;
		gap: 0.12rem;
	}

	.toc-card li button,
	.toc-mobile-drawer li button {
		width: 100%;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		gap: 0.56rem;
		padding: 0.34rem 0.4rem;
		border-radius: 0.6rem;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.16s ease;
	}

	.toc-card li button:hover,
	.toc-mobile-drawer li button:hover {
		background: color-mix(in srgb, var(--color-d-soft) 54%, white 46%);
	}

	.toc-card .toc-number {
		font-size: 0.66rem;
		min-width: 1.45rem;
	}

	.toc-card .toc-title {
		font-size: 0.77rem;
		font-weight: 600;
		line-height: 1.2;
	}

	.toc-number,
	.toc-rail-number {
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1;
		color: var(--color-ink-faint);
		min-width: 1.9rem;
	}

	.toc-main,
	.toc-rail-main {
		display: flex;
		flex-direction: column;
		gap: 0.12rem;
		min-width: 0;
		flex: 1;
	}

	.toc-title,
	.toc-rail-title {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		line-height: 1.25;
		color: var(--color-ink-light);
	}

	.toc-subtitle,
	.toc-rail-subtitle {
		font-family: var(--font-sans);
		font-size: 0.64rem;
		color: var(--color-ink-faint);
	}

	@media (min-width: 1120px) {
		.toc-card ol {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 0.52rem;
		}

		.toc-card li button {
			align-items: flex-start;
		}
	}

	.toc-rail {
		position: fixed;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 52;
		display: none;
		width: min(18.25rem, calc(100vw - 1.5rem));
		padding: 0.75rem;
		border: 1px solid var(--color-border-light);
		border-radius: 0.9rem;
		background:
			radial-gradient(circle at 94% 4%, rgba(168, 85, 247, 0.13), transparent 40%),
			linear-gradient(170deg, rgba(255, 255, 255, 0.97), rgba(247, 250, 255, 0.97));
		box-shadow: 0 16px 36px rgba(18, 24, 33, 0.12);
		backdrop-filter: blur(2px);
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
		margin-bottom: 0.4rem;
	}

	.toc-rail-progress {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.73rem;
		font-weight: 700;
		color: var(--color-d);
	}

	.toc-rail-meter {
		height: 0.32rem;
		background: color-mix(in srgb, var(--color-border-light) 75%, white 25%);
		border-radius: 999px;
		overflow: hidden;
	}

	.toc-rail-meter-fill {
		height: 100%;
		background: linear-gradient(90deg, #7c3aed, #2563eb);
		transition: width 0.18s ease;
	}

	.toc-rail-active {
		margin: 0.5rem 0 0.6rem;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		line-height: 1.35;
		color: var(--color-ink-faint);
	}

	.toc-rail-active strong {
		color: var(--color-ink-light);
		font-weight: 700;
	}

	.toc-rail ol {
		display: grid;
		gap: 0.2rem;
	}

	.toc-rail li button {
		width: 100%;
		border: 1px solid transparent;
		background: none;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.42rem;
		border-radius: 0.5rem;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease,
			transform 0.16s ease;
	}

	.toc-rail li button:hover {
		background: color-mix(in srgb, var(--color-d-soft) 70%, white 30%);
		border-color: color-mix(in srgb, var(--color-border) 65%, #a855f7 35%);
	}

	.toc-rail li.active button {
		background: color-mix(in srgb, var(--color-d-glow) 70%, white 30%);
		border-color: color-mix(in srgb, var(--color-border) 55%, #7c3aed 45%);
		transform: translateX(-0.05rem);
	}

	.toc-rail li.active .toc-rail-title {
		color: var(--color-d);
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

	.toc-mobile-meta {
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

	.toc-mobile-drawer .toc-rail-meter {
		margin-bottom: 0.55rem;
	}

	.toc-mobile-drawer li.active button {
		background: var(--color-d-glow);
	}

	.toc-mobile-drawer li.active .toc-title {
		color: var(--color-d);
	}

</style>
