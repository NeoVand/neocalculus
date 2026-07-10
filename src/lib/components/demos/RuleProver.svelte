<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import DemoHeader from '$lib/components/demos/DemoHeader.svelte';
	import DemoCard from '$lib/components/demos/DemoCard.svelte';
	import EquationPanel from '$lib/components/demos/EquationPanel.svelte';

	type RuleKey = 'product' | 'chain' | 'quotient';
	type RuleSpec = {
		label: string;
		title: string;
		condition?: string;
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
				{
					latex: String.raw`=fg+\textcolor{#a855f7}{(f'g+fg')}d`,
					note: 'the second-order term vanishes; the purple coefficient survives'
				}
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
					latex: String.raw`=f(g(x))+\textcolor{#a855f7}{f'(g(x))\,g'(x)}\,d`,
					note: 'the purple coefficient is the derivative of the composition'
				}
			]
		},
		quotient: {
			label: 'Quotient rule',
			title: 'Divide two changing quantities',
			condition: 'g(x) ≠ 0',
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
				{
					latex: String.raw`=\frac{f}{g}+\textcolor{#a855f7}{\frac{f'g-fg'}{g^2}}d`,
					note: 'second-order terms vanish; the purple coefficient survives'
				}
			]
		}
	};

	let selected = $state<RuleKey>('product');
</script>

<div class="demo-container">
	<DemoHeader title="Explore: algebraic rule proofs" />

	<DemoCard>
		<div class="rule-tabs" role="tablist" aria-label="Rule proofs">
			{#each Object.entries(rules) as [key, rule] (key)}
				<button
					type="button"
					role="tab"
					aria-selected={selected === key}
					class:active={selected === key}
					onclick={() => (selected = key as RuleKey)}
				>
					{rule.label}
				</button>
			{/each}
		</div>

		<div class="color-key" aria-label="Color key">
			<span><i class="vanish"></i>red: second order, vanishes</span>
			<span><i class="survive"></i>purple: first-order coefficient, survives</span>
		</div>

		<div class="rule-title">
			<span>{rules[selected].title}</span>
			{#if rules[selected].condition}<small>{rules[selected].condition}</small>{/if}
		</div>

		<div class="rule-steps">
			{#each rules[selected].steps as step (step.latex)}
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
		background: var(--color-surface);
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
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-ink-light);
		margin-bottom: 0.6rem;
	}

	.rule-title small {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		color: var(--color-d);
	}

	.color-key {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1rem;
		margin: -0.18rem 0 0.8rem;
		font-family: var(--font-sans);
		font-size: 0.68rem;
		color: var(--color-ink-faint);
	}

	.color-key span {
		display: inline-flex;
		align-items: center;
		gap: 0.32rem;
	}

	.color-key i {
		width: 0.56rem;
		height: 0.56rem;
		border-radius: 50%;
	}

	.color-key .vanish {
		background: var(--color-vanish);
	}

	.color-key .survive {
		background: var(--color-d);
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
