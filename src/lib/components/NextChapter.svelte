<script lang="ts">
	interface Props {
		/** Anchor id of the next chapter, e.g. "ch2" */
		href: string;
		/** Display title, e.g. "The Slope Equation" */
		title: string;
		/** Chapter number, e.g. "2" */
		number: string;
	}

	let { href, title, number }: Props = $props();
</script>

<div class="next-chapter-nav">
	<a class="next-chapter-link" href="#{href}">
		<span class="next-chapter-label">Next Chapter</span>
		<span class="next-chapter-title">
			<span class="next-ch-num">{number}.</span> {title}
		</span>
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M7 4l6 6-6 6" />
		</svg>
	</a>
	<button class="back-to-top" onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
		<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
			<path d="M7 12V2M3 5l4-4 4 4" />
		</svg>
		Back to top
	</button>
</div>

<style>
	.next-chapter-nav {
		margin-top: var(--space-xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.next-chapter-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 1rem 1.5rem;
		text-decoration: none;
		transition: all 0.15s;
		max-width: 24rem;
		width: 100%;
	}

	.next-chapter-link:hover {
		border-color: var(--color-d);
		box-shadow: 0 2px 8px rgba(168, 85, 247, 0.08);
	}

	.next-chapter-label {
		font-family: var(--font-sans);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-ink-faint);
		display: block;
	}

	.next-chapter-title {
		font-family: var(--font-serif);
		font-size: 1.05rem;
		color: var(--color-ink);
		flex: 1;
	}

	.next-ch-num {
		color: var(--color-d);
		font-weight: 600;
	}

	.next-chapter-link svg {
		color: var(--color-d);
		flex-shrink: 0;
	}

	.back-to-top {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.3rem 0;
		transition: color 0.15s;
	}

	.back-to-top:hover {
		color: var(--color-d);
	}
</style>
