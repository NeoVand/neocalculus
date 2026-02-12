<script lang="ts">
	import { pushWormholeEntry } from '$lib/utils/wormhole';

	interface Props {
		to: string;
		label: string;
		hint?: string;
		returnLabel?: string;
	}

	let { to, label, hint, returnLabel = 'previous section' }: Props = $props();

	const href = $derived(to.startsWith('#') ? to : `#${to}`);

	function rememberOrigin() {
		if (typeof window === 'undefined') return;
		pushWormholeEntry({
			y: window.scrollY,
			hash: window.location.hash,
			to: href,
			returnLabel
		});
	}
</script>

<span class="wormhole-link">
	<span class="wormhole-badge">Wormhole</span>
	<a href={href} onclick={rememberOrigin}>{label}</a>
	{#if hint}<span class="wormhole-hint">{hint}</span>{/if}
</span>

<style>
	.wormhole-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0 0.35rem 0.35rem 0;
	}

	.wormhole-badge {
		font-family: var(--font-sans);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #854d0e;
		background: #fef3c7;
		border: 1px solid #fde68a;
		padding: 0.16rem 0.35rem;
		border-radius: 999px;
		line-height: 1;
	}

	.wormhole-link a {
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-d);
		text-decoration: none;
		border-bottom: 1px dashed rgba(168, 85, 247, 0.45);
	}

	.wormhole-link a:hover {
		color: var(--color-c);
		border-bottom-color: var(--color-c);
	}

	.wormhole-hint {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}
</style>
