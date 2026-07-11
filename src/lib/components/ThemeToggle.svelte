<script lang="ts">
	import { onMount } from 'svelte';
	import { THEME_CHANGE_EVENT } from '$lib/utils/theme';

	type Theme = 'light' | 'dark';
	let theme = $state<Theme>('light');

	function applyTheme(nextTheme: Theme) {
		theme = nextTheme;
		document.documentElement.dataset.theme = nextTheme;
		document.documentElement.style.colorScheme = nextTheme;
		window.localStorage.setItem('neocalculus-theme', nextTheme);
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: nextTheme }));
	}

	function toggleTheme() {
		applyTheme(theme === 'dark' ? 'light' : 'dark');
	}

	onMount(() => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
	});
</script>

<button
	type="button"
	class="theme-toggle"
	class:is-dark={theme === 'dark'}
	onclick={toggleTheme}
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	aria-pressed={theme === 'dark'}
>
	<span class="theme-toggle-icon" aria-hidden="true">
		{#if theme === 'dark'}
			<svg viewBox="0 0 24 24">
				<circle cx="12" cy="12" r="3.5"></circle>
				<path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"></path>
			</svg>
		{:else}
			<svg viewBox="0 0 24 24">
				<path d="M20.2 15.2A8.7 8.7 0 0 1 8.8 3.8 8.7 8.7 0 1 0 20.2 15.2Z"></path>
			</svg>
		{/if}
	</span>
</button>

<style>
	.theme-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 101;
		display: grid;
		place-items: center;
		width: 2.4rem;
		height: 2.4rem;
		padding: 0.48rem;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: var(--color-d);
		opacity: 0.78;
		cursor: pointer;
		transition:
			color 0.22s ease,
			opacity 0.22s ease,
			transform 0.32s var(--ease-out-expo);
	}

	.theme-toggle:hover {
		color: color-mix(in srgb, var(--color-d) 72%, var(--color-ink));
		opacity: 1;
		transform: rotate(8deg) scale(1.08);
	}

	.theme-toggle:focus-visible {
		outline: 3px solid color-mix(in srgb, var(--color-d) 28%, transparent);
		outline-offset: 3px;
	}

	.theme-toggle-icon,
	.theme-toggle-icon svg {
		width: 1.3rem;
		height: 1.3rem;
	}

	.theme-toggle-icon {
		display: grid;
		place-items: center;
		color: var(--color-d);
	}

	.theme-toggle-icon svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	@media (max-width: 640px) {
		.theme-toggle {
			top: 0.75rem;
			right: 0.75rem;
		}
	}
</style>
