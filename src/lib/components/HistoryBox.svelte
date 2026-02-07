<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		name: string;
		years?: string;
		image?: string;
	}

	let { children, name, years, image }: Props = $props();
</script>

<aside class="history-box">
	<div class="history-header">
		{#if image}
			<img class="history-portrait" src={image} alt={name} />
		{:else}
			<div class="history-portrait-placeholder">
				<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="20" cy="16" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
					<path d="M6 36 Q6 26 20 24 Q34 26 34 36" stroke="currentColor" stroke-width="1.5" fill="none"/>
				</svg>
			</div>
		{/if}
		<div>
			<div class="history-name">{name}</div>
			{#if years}<div class="history-years">{years}</div>{/if}
		</div>
	</div>
	<div class="history-content">
		{@render children()}
	</div>
</aside>

<style>
	.history-box {
		border: 1px solid var(--color-border-light);
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fffbeb, #fefce8);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.history-header {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.history-portrait {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-border);
		flex-shrink: 0;
	}

	.history-portrait-placeholder {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #fef3c7;
		border: 2px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #b45309;
		flex-shrink: 0;
	}

	.history-portrait-placeholder svg {
		width: 28px;
		height: 28px;
	}

	.history-name {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-ink);
	}

	.history-years {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-faint);
	}

	.history-content {
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}

	.history-content :global(p) {
		margin-bottom: 0.4rem;
	}

	.history-content :global(p:last-child) {
		margin-bottom: 0;
	}
</style>
