<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		trigger?: string;
		symptom?: string;
		recovery?: string;
		children?: Snippet;
	}

	let { title = 'Failure Mode', trigger, symptom, recovery, children }: Props = $props();
</script>

<aside class="failure-mode-box">
	<div class="failure-title">{title}</div>
	{#if trigger}
		<p><strong>Trigger:</strong> {trigger}</p>
	{/if}
	{#if symptom}
		<p><strong>What breaks:</strong> {symptom}</p>
	{/if}
	{#if recovery}
		<p><strong>How to proceed:</strong> {recovery}</p>
	{/if}
	{#if children}
		<div class="failure-extra">
			{@render children()}
		</div>
	{/if}
</aside>

<style>
	.failure-mode-box {
		border: 1px solid #f4c6c6;
		border-radius: 0.75rem;
		padding: 1rem;
		margin: var(--space-md) 0;
		background: linear-gradient(135deg, #fff7f7, #fff2f2);
	}

	.failure-title {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: #b42318;
		margin-bottom: 0.55rem;
	}

	.failure-mode-box p {
		margin: 0.35rem 0;
		font-size: 0.96rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}

	.failure-extra {
		margin-top: 0.5rem;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--color-ink-light);
	}
</style>
