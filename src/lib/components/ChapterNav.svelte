<script lang="ts">
	import { onMount } from 'svelte';

	const chapters = [
		{ id: 'ch1', num: '1', title: 'The Smooth World' },
		{ id: 'ch2', num: '2', title: 'The Slope Equation' },
		{ id: 'ch3', num: '3', title: 'Rules of Change' },
		{ id: 'ch4', num: '4', title: 'Optimization' },
		{ id: 'ch5', num: '5', title: 'The World of Areas' },
		{ id: 'ch6', num: '6', title: 'Applications' },
		{ id: 'ch7', num: '7', title: 'Infinite Series' },
		{ id: 'ch8', num: '8', title: 'Physics' },
		{ id: 'ch9', num: '9', title: 'Many Dimensions' },
		{ id: 'ch10', num: '10', title: 'Language of Forms' }
	];

	let activeChapter = $state('');
	let isOpen = $state(false);
	let isPastHero = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeChapter = entry.target.id;
					}
				}
			},
			{ rootMargin: '-20% 0px -70% 0px' }
		);

		// Observe hero to know when we're past it
		const heroObserver = new IntersectionObserver(
			(entries) => {
				isPastHero = !entries[0].isIntersecting;
			},
			{ threshold: 0 }
		);

		const heroEl = document.querySelector('.hero');
		if (heroEl) heroObserver.observe(heroEl);

		for (const ch of chapters) {
			const el = document.getElementById(ch.id);
			if (el) observer.observe(el);
		}

		return () => {
			observer.disconnect();
			heroObserver.disconnect();
		};
	});

	function handleNavClick(id: string) {
		isOpen = false;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<!-- Desktop sidebar -->
{#if isPastHero}
	<nav class="chapter-sidebar" aria-label="Chapter navigation">
		<ol>
			{#each chapters as ch}
				<li class:active={activeChapter === ch.id}>
					<button onclick={() => handleNavClick(ch.id)}>
						<span class="ch-num">{ch.num}</span>
						<span class="ch-title">{ch.title}</span>
					</button>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<!-- Mobile hamburger -->
{#if isPastHero}
	<button
		class="chapter-mobile-toggle"
		onclick={() => (isOpen = !isOpen)}
		aria-label="Toggle chapter navigation"
		aria-expanded={isOpen}
	>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
			{#if isOpen}
				<path d="M5 5l10 10M15 5L5 15" stroke-linecap="round" />
			{:else}
				<path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
			{/if}
		</svg>
		<span class="mobile-ch-label">Ch {chapters.find((c) => c.id === activeChapter)?.num ?? ''}</span>
	</button>
{/if}

<!-- Mobile drawer -->
{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="chapter-mobile-backdrop" onclick={() => (isOpen = false)}></div>
	<nav class="chapter-mobile-drawer" aria-label="Chapter navigation">
		<div class="drawer-header">Chapters</div>
		<ol>
			{#each chapters as ch}
				<li class:active={activeChapter === ch.id}>
					<button onclick={() => handleNavClick(ch.id)}>
						<span class="ch-num">{ch.num}.</span>
						{ch.title}
					</button>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	/* ── Desktop Sidebar ── */
	.chapter-sidebar {
		position: fixed;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 50;
		display: none;
	}

	@media (min-width: 1280px) {
		.chapter-sidebar {
			display: block;
		}
	}

	.chapter-sidebar ol {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.chapter-sidebar li button {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.3rem 0.5rem;
		border-radius: 0.4rem;
		transition: all 0.15s;
		width: 100%;
		text-align: left;
	}

	.chapter-sidebar li button:hover {
		background: var(--color-d-soft);
	}

	.chapter-sidebar li.active button {
		background: var(--color-d-glow);
	}

	.chapter-sidebar .ch-num {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 700;
		color: var(--color-ink-faint);
		min-width: 1rem;
		text-align: right;
	}

	.chapter-sidebar li.active .ch-num {
		color: var(--color-d);
	}

	.chapter-sidebar .ch-title {
		font-family: var(--font-sans);
		font-size: 0.68rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
	}

	.chapter-sidebar li.active .ch-title {
		color: var(--color-d);
		font-weight: 600;
	}

	/* ── Mobile Toggle ── */
	.chapter-mobile-toggle {
		position: fixed;
		bottom: 1.25rem;
		right: 1.25rem;
		z-index: 60;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 2rem;
		padding: 0.55rem 0.9rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		transition: all 0.15s;
	}

	.chapter-mobile-toggle:hover {
		border-color: var(--color-d);
	}

	.mobile-ch-label {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--color-d);
	}

	@media (min-width: 1280px) {
		.chapter-mobile-toggle {
			display: none;
		}
	}

	/* ── Mobile Backdrop ── */
	.chapter-mobile-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 70;
	}

	/* ── Mobile Drawer ── */
	.chapter-mobile-drawer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 80;
		background: white;
		border-radius: 1rem 1rem 0 0;
		padding: 1rem 1.25rem 2rem;
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
		max-height: 70vh;
		overflow-y: auto;
	}

	.drawer-header {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border-light);
	}

	.chapter-mobile-drawer ol {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.chapter-mobile-drawer li button {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		padding: 0.6rem 0.5rem;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 0.88rem;
		color: var(--color-ink-light);
		border-radius: 0.4rem;
		transition: all 0.1s;
	}

	.chapter-mobile-drawer li button:hover {
		background: var(--color-d-soft);
	}

	.chapter-mobile-drawer li.active button {
		color: var(--color-d);
		font-weight: 600;
		background: var(--color-d-glow);
	}

	.chapter-mobile-drawer .ch-num {
		color: var(--color-ink-faint);
		font-weight: 700;
		font-size: 0.78rem;
	}

	.chapter-mobile-drawer li.active .ch-num {
		color: var(--color-d);
	}

	@media (min-width: 1280px) {
		.chapter-mobile-backdrop,
		.chapter-mobile-drawer {
			display: none;
		}
	}
</style>
