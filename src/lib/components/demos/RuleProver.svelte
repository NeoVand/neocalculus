<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';

	type RuleKey = 'product' | 'chain' | 'quotient';
	type RuleSpec = {
		label: string;
		title: string;
		ruleMath: string;
		steps: { latex: string; note: string }[];
	};

	const rules: Record<RuleKey, RuleSpec> = {
		product: {
			label: 'Product rule',
			title: 'Multiply two changing quantities',
			ruleMath: String.raw`(fg)'=f'g+fg'`,
			steps: [
				{ latex: String.raw`(fg)(x+d)=f(x+d)\,g(x+d)`, note: 'substitute x+d into both factors' },
				{
					latex: String.raw`=[f+f'd][g+g'd]`,
					note: 'apply the slope equation to each factor'
				},
				{
					latex: String.raw`=fg+(f'g+fg')d+\textcolor{#ef4444}{f'g'd^2}`,
					note: 'expand and collect first-order terms'
				},
				{ latex: String.raw`=fg+(f'g+fg')d`, note: String.raw`drop d^2 because d^2=0` }
			]
		},
		chain: {
			label: 'Chain rule',
			title: 'Compose two changing quantities',
			ruleMath: String.raw`(f\circ g)'(x)=f'(g(x))g'(x)`,
			steps: [
				{ latex: String.raw`g(x+d)=g(x)+g'(x)d`, note: 'start with the inner function' },
				{
					latex: String.raw`f(g(x+d))=f(g(x)+g'(x)d)`,
					note: 'feed inner output into the outer function'
				},
				{
					latex: String.raw`=f(g(x))+f'(g(x))\,g'(x)\,d`,
					note: 'apply the outer slope equation'
				}
			]
		},
		quotient: {
			label: 'Quotient rule',
			title: 'Divide two changing quantities',
			ruleMath: String.raw`\left(\frac{f}{g}\right)'=\frac{f'g-fg'}{g^2}`,
			steps: [
				{
					latex: String.raw`\frac{f(x+d)}{g(x+d)}=\frac{f+f'd}{g+g'd}`,
					note: 'expand numerator and denominator'
				},
				{
					latex: String.raw`=\frac{f+f'd}{g+g'd}\cdot\frac{g-g'd}{g-g'd}`,
					note: 'stabilize denominator to first order'
				},
				{
					latex: String.raw`=\frac{fg+(f'g-fg')d+\textcolor{#ef4444}{(\cdots)d^2}}{g^2}`,
					note: 'expand and collect terms'
				},
				{ latex: String.raw`=\frac{f}{g}+\frac{f'g-fg'}{g^2}d`, note: String.raw`drop d^2 and read coefficient` }
			]
		}
	};

	let selected = $state<RuleKey>('product');
</script>

<div class="demo-container content-width">
	<DemoHeader title="Explore: algebraic rule proofs" />

	<DemoCard>
		<div class="rule-tabs" role="tablist" aria-label="Rule proofs">
			{#each Object.entries(rules) as [key, rule]}
				<button
					role="tab"
					aria-selected={selected === key}
					class:active={selected === key}
					onclick={() => (selected = key as RuleKey)}
				>
					{rule.label}
				</button>
			{/each}
		</div>

		<div class="rule-title">{rules[selected].title}</div>

		<div class="rule-steps">
			{#each rules[selected].steps as step}
				<div class="rule-step">
					<div class="rule-math"><Katex math={step.latex} display /></div>
					<div class="rule-note">{step.note}</div>
				</div>
			{/each}
		</div>
	</DemoCard>

	<EquationPanel title="Derived rule">
		<Katex math={String.raw`\boxed{${rules[selected].ruleMath}}`} display />
	</EquationPanel>
</div>

<style>
	.rule-tabs {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
		margin-bottom: 0.8rem;
	}

	.rule-tabs button {
		border: 1px solid var(--color-border);
		background: white;
		color: var(--color-ink-light);
		font-family: var(--font-sans);
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.35rem 0.62rem;
		border-radius: 999px;
		cursor: pointer;
	}

	.rule-tabs button.active {
		border-color: var(--color-d);
		background: var(--color-d-soft);
		color: var(--color-d);
	}

	.rule-title {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-light);
		margin-bottom: 0.6rem;
	}

	.rule-step {
		padding: 0.54rem 0;
		border-top: 1px solid var(--color-border-light);
	}

	.rule-step:first-child {
		border-top: none;
		padding-top: 0;
	}

	.rule-note {
		font-family: var(--font-sans);
		font-size: 0.72rem;
		color: var(--color-ink-faint);
	}
</style>
