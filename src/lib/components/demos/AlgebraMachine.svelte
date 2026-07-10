<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import { Dual, differentiate } from '$lib/engine/dual';

	type Step = {
		latex: string;
		note?: string;
		isVanish?: boolean;
		isResult?: boolean;
	};

	const derivations: Record<
		string,
		{ label: string; steps: Step[]; verifyFn?: (d: Dual) => Dual }
	> = {
		'x²': {
			label: 'x²',
			verifyFn: (d) => d.pow(2),
			steps: [
				{ latex: 'f(x + d) = (x + d)^2', note: 'substitute' },
				{
					latex: '= x^2 + 2xd + \\textcolor{#ef4444}{d^2}',
					note: 'expand'
				},
				{
					latex: '= x^2 + 2xd + \\textcolor{#ef4444}{0}',
					note: 'd² = 0',
					isVanish: true
				},
				{ latex: '= x^2 + \\textcolor{#a855f7}{2x} \\cdot d', note: 'collect terms' },
				{
					latex: "\\boxed{f'(x) = 2x}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		'x³': {
			label: 'x³',
			verifyFn: (d) => d.pow(3),
			steps: [
				{ latex: 'f(x + d) = (x + d)^3', note: 'substitute' },
				{
					latex: '= x^3 + 3x^2d + \\textcolor{#ef4444}{3xd^2} + \\textcolor{#ef4444}{d^3}',
					note: 'expand'
				},
				{
					latex: '= x^3 + 3x^2 d',
					note: 'd² = 0, d³ = 0',
					isVanish: true
				},
				{
					latex: "\\boxed{f'(x) = 3x^2}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		'1/x': {
			label: '1/x',
			verifyFn: (d) => Dual.of(1).div(d),
			steps: [
				{ latex: 'f(x+d) = \\frac{1}{x+d}', note: 'substitute' },
				{
					latex: '= \\frac{1}{x+d} \\cdot \\frac{x-d}{x-d}',
					note: 'multiply by conjugate'
				},
				{
					latex: '= \\frac{x - d}{x^2 - \\textcolor{#ef4444}{d^2}} = \\frac{x - d}{x^2}',
					note: 'd² = 0',
					isVanish: true
				},
				{
					latex: '= \\frac{1}{x} - \\frac{1}{x^2} \\cdot d',
					note: 'separate terms'
				},
				{
					latex: "\\boxed{f'(x) = -\\frac{1}{x^2}}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		'√x': {
			label: '√x',
			verifyFn: (d) => d.sqrt(),
			steps: [
				{
					latex: 'f(x+d) = \\sqrt{x+d} = \\sqrt{x} + k \\cdot d',
					note: 'we need to find k'
				},
				{ latex: '\\text{Square both sides:}' },
				{
					latex: 'x + d = x + 2k\\sqrt{x}\\cdot d + \\textcolor{#ef4444}{k^2 d^2}',
					note: 'expand'
				},
				{
					latex: 'x + d = x + 2k\\sqrt{x}\\cdot d',
					note: 'd² = 0',
					isVanish: true
				},
				{
					latex: '1 = 2k\\sqrt{x} \\;\\Rightarrow\\; k = \\frac{1}{2\\sqrt{x}}',
					note: 'match coefficients of d'
				},
				{
					latex: "\\boxed{f'(x) = \\frac{1}{2\\sqrt{x}}}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		'sin(x)': {
			label: 'sin(x)',
			verifyFn: (d) => d.sin(),
			steps: [
				{
					latex: '\\text{For infinitesimal } d\\text{: } \\sin(d) = d,\\; \\cos(d) = 1',
					note: 'infinitesimal triangle'
				},
				{
					latex: 'f(x+d) = \\sin(x + d)',
					note: 'substitute'
				},
				{
					latex: '= \\sin x \\cos d + \\cos x \\sin d',
					note: 'angle addition'
				},
				{
					latex: '= \\sin x \\cdot 1 + \\cos x \\cdot d',
					note: 'cos(d) = 1, sin(d) = d'
				},
				{ latex: '= \\sin x + \\textcolor{#a855f7}{\\cos x} \\cdot d', note: 'simplify' },
				{
					latex: "\\boxed{f'(x) = \\cos x}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		eˣ: {
			label: 'eˣ',
			verifyFn: (d) => d.exp(),
			steps: [
				{
					latex: 'e^d = 1+d \\quad \\text{for first-order } d',
					note: 'normalization of the natural base'
				},
				{
					latex: 'f(x+d)=e^{x+d}=e^x e^d',
					note: 'exponential law'
				},
				{
					latex: '=e^x(1+d)=e^x+e^x d',
					note: 'substitute and expand'
				},
				{
					latex: "\\boxed{f'(x) = e^x}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		},
		'ln(x)': {
			label: 'ln(x)',
			verifyFn: (d) => d.log(),
			steps: [
				{
					latex: '\\ln(x+d)=\\ln x+k d',
					note: 'find the coefficient k'
				},
				{
					latex: 'x+d=e^{\\ln x+k d}',
					note: 'exponentiate'
				},
				{
					latex: '=x e^{k d}=x(1+k d)=x+xk d',
					note: '(kd)² = 0'
				},
				{
					latex: '1=xk \\;\\Rightarrow\\; k=\\frac1x',
					note: 'match coefficients'
				},
				{
					latex: "\\boxed{f'(x) = \\frac{1}{x}}",
					note: 'coefficient of d',
					isResult: true
				}
			]
		}
	};

	let selectedFn = $state<string>('x²');

	function selectFn(key: string) {
		selectedFn = key;
	}

	let currentDerivation = $derived(derivations[selectedFn]);

	// Verification with dual numbers
	let verifyPoint = $state(2);
	let verifiedDerivative = $derived.by(() => {
		const fn = currentDerivation.verifyFn;
		if (!fn) return null;
		try {
			return differentiate(fn, verifyPoint);
		} catch {
			return null;
		}
	});
</script>

<div class="demo-container content-width">
	<div class="demo-label">
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><path
				d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"
			/><path
				d="M18 8a2 2 0 0 1 2 2v7.4a4 4 0 0 1-.6 2.1L17.5 22H8.8a2 2 0 0 1-1.7-1l-3.5-6A2 2 0 0 1 6 12h0"
			/></svg
		>
		Explore: step-by-step derivatives
	</div>

	<div class="mb-5 flex flex-wrap gap-2" role="tablist">
		{#each Object.entries(derivations) as [key, d] (key)}
			<button
				role="tab"
				aria-selected={selectedFn === key}
				class="fn-tab"
				class:active={selectedFn === key}
				onclick={() => selectFn(key)}
			>
				{d.label}
			</button>
		{/each}
	</div>

	{#key selectedFn}
		<div class="algebra-display">
			{#each currentDerivation.steps as step, i (step.latex)}
				<div
					class="algebra-step"
					class:is-vanish={step.isVanish}
					class:is-result={step.isResult}
					style="animation-delay: {i * 0.06}s"
				>
					<div class="step-equation">
						<Katex math={step.latex} display />
					</div>
					{#if step.note}
						<div class="step-annotation">{step.note}</div>
					{/if}
				</div>
			{/each}
		</div>
	{/key}

	{#if currentDerivation.verifyFn}
		<div class="algebra-controls">
			<div class="verify-box">
				<label class="verify-label" for="derivative-verify-point">Verify numerically at x =</label>
				<input
					id="derivative-verify-point"
					type="number"
					bind:value={verifyPoint}
					class="verify-input"
					step="0.5"
					min="0.1"
				/>
				<span class="verify-result">
					→ f'({verifyPoint}) = <strong>{verifiedDerivative?.toFixed(4)}</strong>
				</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.fn-tab {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		padding: 0.35rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-ink-light);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.fn-tab:hover {
		border-color: var(--color-d);
		color: var(--color-d);
	}

	.fn-tab.active {
		background: var(--color-d);
		color: white;
		border-color: var(--color-d);
	}

	.algebra-display {
		min-height: 200px;
		padding: 1.5rem 0;
	}

	.algebra-step {
		padding: 0.6rem 1rem;
		border-radius: 0.5rem;
		animation: step-enter 0.4s var(--ease-out-expo) both;
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}

	.algebra-step + .algebra-step {
		margin-top: 0.15rem;
	}

	.algebra-step.is-vanish {
		background: rgba(239, 68, 68, 0.04);
	}

	.algebra-step.is-result {
		background: rgba(168, 85, 247, 0.06);
		border: 1px solid rgba(168, 85, 247, 0.15);
		margin-top: 0.75rem;
		padding: 0.8rem 1rem;
	}

	.step-equation {
		flex: 1;
		min-width: 0;
	}

	.step-equation :global(.katex-display) {
		margin: 0 !important;
		text-align: left;
	}

	.step-annotation {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-ink-faint);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.is-result .step-annotation {
		color: var(--color-d);
		font-weight: 600;
	}

	.algebra-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border-light);
	}

	.verify-box {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--color-ink-light);
	}

	.verify-label {
		white-space: nowrap;
	}

	.verify-input {
		width: 4rem;
		padding: 0.25rem 0.4rem;
		border-radius: 0.3rem;
		border: 1px solid var(--color-border);
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-align: center;
	}

	.verify-result {
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	.verify-result strong {
		color: var(--color-d);
	}

	@keyframes step-enter {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 640px) {
		.algebra-step {
			flex-direction: column;
			gap: 0.2rem;
		}

		.verify-box {
			margin-left: 0;
			margin-top: 0.5rem;
			flex-wrap: wrap;
		}
	}
</style>
