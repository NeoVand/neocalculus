<script lang="ts">
	import { onMount } from 'svelte';
	import { WORMHOLE_STACK_EVENT, peekWormholeEntry, popWormholeEntry } from '$lib/utils/wormhole';

	let topEntry = $state<ReturnType<typeof peekWormholeEntry>>(null);

	function refreshStackState() {
		topEntry = peekWormholeEntry();
	}

	function returnToOrigin() {
		if (typeof window === 'undefined') return;
		const entry = popWormholeEntry();
		if (!entry) {
			refreshStackState();
			return;
		}

		window.scrollTo({ top: entry.y, behavior: 'smooth' });
		const baseUrl = `${window.location.pathname}${window.location.search}`;
		history.replaceState(history.state, '', entry.hash ? `${baseUrl}${entry.hash}` : baseUrl);
		refreshStackState();
	}

	onMount(() => {
		refreshStackState();
		window.addEventListener(WORMHOLE_STACK_EVENT, refreshStackState as EventListener);
		window.addEventListener('storage', refreshStackState as EventListener);

		return () => {
			window.removeEventListener(WORMHOLE_STACK_EVENT, refreshStackState as EventListener);
			window.removeEventListener('storage', refreshStackState as EventListener);
		};
	});
</script>

{#if topEntry}
	<button class="wormhole-return" onclick={returnToOrigin} aria-label="Return to previous section">
		<span class="wormhole-return-title">Return</span>
		<span class="wormhole-return-label">{topEntry.returnLabel}</span>
	</button>
{/if}

<style>
	.wormhole-return {
		position: fixed;
		right: 1.25rem;
		bottom: 4.4rem;
		z-index: 59;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.1rem;
		background: #fffbeb;
		border: 1px solid #fde68a;
		border-radius: 0.6rem;
		padding: 0.45rem 0.6rem;
		cursor: pointer;
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
	}

	.wormhole-return:hover {
		border-color: #f59e0b;
	}

	.wormhole-return-title {
		font-family: var(--font-sans);
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #854d0e;
	}

	.wormhole-return-label {
		font-family: var(--font-sans);
		font-size: 0.74rem;
		font-weight: 600;
		color: #78350f;
	}

	@media (max-width: 768px) {
		.wormhole-return {
			right: 1rem;
			bottom: 4.8rem;
		}

		.wormhole-return-label {
			max-width: 12rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
