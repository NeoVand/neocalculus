<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import RuleProver from '$lib/components/demos/RuleProver.svelte';
	import ChainRuleNudges from '$lib/components/demos/ChainRuleNudges.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch3">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 3</span>
			<h2 class="chapter-title">Rules of Change and Local Models</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“How does a change travel through a formula built from several functions?”
				</blockquote>
				<p class="epigraph-attr">The question behind the derivative rules</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Chapter 2 built a small library of derivatives. Real formulas combine those functions by
				adding, multiplying, dividing, composing, and inverting them. We will derive one rule for
				each operation from the same first-order equation.
			</p>
			<p>
				To keep the algebra readable, fix an input <Katex math="x" /> and use the shorthand
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\begin{aligned}f(x+d)&=f+f'd,\\g(x+d)&=g+g'd.\end{aligned}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Here <Katex math="f" />, <Katex math="g" />, <Katex math="f'" />, and
				<Katex math="g'" /> all mean their values at the fixed input <Katex math="x" />. We are only
				suppressing <Katex math="(x)" /> temporarily.
			</p>

			<h3>Add and scale</h3>
			<p>
				When outputs are added, their first-order changes add. When an output is multiplied by a
				constant, its first-order change is multiplied by the same constant.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The sum rule</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`(f+g)(x+d)=(f+f'd)+(g+g'd)`} display />
				</div>
				<div class="step-note">expand each function</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(f+g)'=f'+g'`} display /></div>
				<div class="step-note">read the coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The constant-multiple rule</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(cf)(x+d)=c(f+f'd)=cf+(cf')d`} display /></div>
				<div class="step-note"><Katex math="c" /> is constant</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(cf)'=cf'`} display /></div>
				<div class="step-note">read the coefficient</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Together with the power rule, these give derivatives of polynomials term by term. For
				example,
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(2x^3-5x^2+x-3)'=6x^2-10x+1`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Multiply and divide</h3>
			<p>
				If both factors change, a product has two first-order contributions: the change in the first
				factor and the change in the second. Multiplying their local forms makes this visible.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The product rule</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(fg)(x+d)=(f+f'd)(g+g'd)`} display /></div>
				<div class="step-note">expand both factors</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`=fg+(f'g+fg')d+f'g'd^2`} display /></div>
				<div class="step-note">multiply</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(fg)'=f'g+fg'`} display /></div>
				<div class="step-note"><Katex math="d^2=0" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The term <Katex math="f'g'd^2" /> is the simultaneous change of both factors. It is second order,
				so the first-order lens removes it.
			</p>
			<p>
				For <Katex math={r`h(x)=x^2e^x`} />, the product rule gives
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">A product example</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`h'(x)=(2x)e^x+x^2e^x`} display />
				</div>
				<div class="step-note">differentiate each factor in turn</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`h'(x)=e^x(2x+x^2)`} display /></div>
				<div class="step-note">factor</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For a quotient, assume the denominator value <Katex math="g(x)" /> is invertible. At an ordinary
				real input, this is the familiar condition <Katex math="g(x)\ne0" />. Its first-order
				reciprocal has the form
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac1{g+g'd}=\frac1g-\frac{g'}{g^2}d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Multiplying the right side by <Katex math="g+g'd" /> gives 1 because the remaining error contains
				<Katex math="d^2" />. Now combine this reciprocal with the product rule.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The quotient rule</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\frac{f+f'd}{g+g'd}=(f+f'd)\left(\frac1g-\frac{g'}{g^2}d\right)`}
						display
					/>
				</div>
				<div class="step-note">replace the reciprocal</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`=\frac fg+\frac{f'g-fg'}{g^2}d`} display />
				</div>
				<div class="step-note">expand and use <Katex math="d^2=0" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}`} display />
				</div>
				<div class="step-note">where <Katex math="g" /> is invertible</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The quotient rule supplies the trigonometric derivative postponed in Chapter 2:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`\begin{aligned}(\tan x)'&=\frac{\cos^2x+\sin^2x}{\cos^2x}\\&=\frac{1}{\cos^2x}=\sec^2x.\end{aligned}`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Compose: the chain rule</h3>
			<p>
				A composition <Katex math={r`f(g(x))`} /> changes in two stages. The inner function first turns
				the input change <Katex math="d" /> into <Katex math="g'd" />. The outer function then
				responds to that new first-order change.
			</p>
			<p>
				Because <Katex math={r`(g'd)^2=(g')^2d^2=0`} />, the inner change is still first order.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="3.1"
				caption="One first-order nudge passes through two local stretches. The inner function turns d into 2x d; the outer function then scales that result by cos(x²)."
			>
				<ChainRuleNudges />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The three number lines use the same scale, so the changing lengths can be compared
				directly. The outer function never receives the original <Katex math="d" />. It receives
				the change already produced by the inner function—and that is why the two local stretch
				factors multiply.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The chain rule</div>
			<div class="step">
				<div class="step-math"><Katex math={r`g(x+d)=g(x)+g'(x)d`} display /></div>
				<div class="step-note">inner change</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`f(g(x+d))=f(g(x)+g'(x)d)`} display />
				</div>
				<div class="step-note">feed it into the outer function</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`=f(g(x))+f'(g(x))g'(x)d`} display />
				</div>
				<div class="step-note">outer first-order equation</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`(f\circ g)'(x)=f'(g(x))g'(x)`} display />
				</div>
				<div class="step-note">read the coefficient</div>
			</div>
		</div>

		<Callout type="key-idea" title="Reading the Chain Rule">
			<p>
				Differentiate the outer function at the current inner value, then multiply by the derivative
				of the inner function.
			</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">A composition example</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`h(x)=\sin(x^2)`} display />
				</div>
				<div class="step-note">outer: sine; inner: square</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`h'(x)=\cos(x^2)\cdot2x`} display /></div>
				<div class="step-note">outer derivative × inner derivative</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The same rule gives <Katex math={r`(e^{2x})'=2e^{2x}`} />: the exponential reproduces
				itself, and the inner function <Katex math="2x" /> contributes the factor 2.
			</p>
			<p>
				Use the lab below to compare the product, chain, and quotient proofs. Their surface algebra
				differs, but each proof ends by reading one coefficient.
			</p>
		</div>
	</div>

	<div class="content-width" use:reveal>
		<RuleProver />
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<h3>Invert and constrain</h3>
			<p>
				The chain rule now makes inverse-function differentiation legitimate. Let
				<Katex math={r`y=f^{-1}(x)`} />, so <Katex math={r`f(y)=x`} />. Write the unknown
				first-order response of the inverse as <Katex math="kd" />.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The inverse-function rule</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(y+kd)=x+d`} display /></div>
				<div class="step-note">change input and inverse output together</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x+f'(y)kd=x+d`} display /></div>
				<div class="step-note">apply the slope equation to <Katex math="f" /></div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f'(y)k=1`} display /></div>
				<div class="step-note">match coefficients</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`(f^{-1})'(x)=\frac1{f'(f^{-1}(x))}`} display />
				</div>
				<div class="step-note">where the denominator is invertible</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For <Katex math={r`y=\arcsin x`} />, the original function is sine. On the principal branch, <Katex
					math={r`\cos y=\sqrt{1-x^2}`}
				/>, so
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(\arcsin x)'=\frac1{\sqrt{1-x^2}},\qquad |x|<1`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A relation can also define <Katex math="y" /> without solving explicitly for it. On the circle
				<Katex math={r`x^2+y^2=1`} />, suppose <Katex math="y" /> changes by
				<Katex math="y'd" /> when <Katex math="x" /> changes by <Katex math="d" />. Substitute both
				changes into the relation:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Implicit slope on a circle</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`(x+d)^2+(y+y'd)^2=1`} display />
				</div>
				<div class="step-note">change both coordinates</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x^2+y^2+(2x+2yy')d=1`} display /></div>
				<div class="step-note"><Katex math="d^2=0" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`y'=-\frac xy`} display /></div>
				<div class="step-note">for <Katex math="y\ne0" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Local models and second derivatives</h3>
			<p>
				Once a derivative has been assembled from these rules, it gives the local line at
				<Katex math="x=a" />:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`L_a(x)=f(a)+f'(a)(x-a)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For <Katex math={r`f(x)=x^2e^x`} />, the product rule gives
				<Katex math={r`f'(x)=e^x(2x+x^2)`} />. At <Katex math="a=1" />,
				<Katex math={r`f(1)=e`} /> and <Katex math={r`f'(1)=3e`} />, so
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`L_1(x)=e+3e(x-1)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This line is exact as a line and is a first-order approximation to the curve for ordinary
				nearby inputs.
			</p>
			<p>
				A derivative is itself a function, so it can be differentiated again. The
				<strong>second derivative</strong>
				<Katex math="f''" /> measures how the first derivative changes. For position, the first derivative
				is velocity and the second is acceleration.
			</p>
		</div>

		<Callout type="definition" title="Second Derivative">
			<Katex math={r`f''(x)=(f'(x))'`} display />
			<p>
				If <Katex math={r`s(t)=t^3`} />, then <Katex math={r`s'(t)=3t^2`} /> and
				<Katex math={r`s''(t)=6t`} />.
			</p>
		</Callout>

		<ChapterSummary>
			<ul>
				<li>Sum and constant-multiple rules combine first-order coefficients linearly.</li>
				<li>
					In a product, the simultaneous change of both factors contains <Katex math="d^2" /> and disappears,
					leaving <Katex math={r`(fg)'=f'g+fg'`} />.
				</li>
				<li>
					The quotient rule requires an invertible denominator and follows from the product rule
					plus a first-order reciprocal.
				</li>
				<li>
					The chain rule passes the inner first-order change into the outer function:
					<Katex math={r`(f\circ g)'=(f'\circ g)g'`} />.
				</li>
				<li>
					Inverse and implicit derivatives come from changing both sides of a defining relation.
				</li>
				<li>
					The local line uses <Katex math="f'" />; the second derivative <Katex math="f''" /> records
					how that slope changes.
				</li>
			</ul>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Practice (six core, two explorations)</summary>

			<Exercise number={1}>
				<p>
					<strong>Core.</strong> Differentiate <Katex math={r`f(x)=3x^4-2x^2+5`} /> using the sum and
					constant-multiple rules.
				</p>
				{#snippet solution()}
					<Katex math={r`f'(x)=12x^3-4x`} display />
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Core.</strong> Differentiate <Katex math={r`h(x)=x^3e^x`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`h'(x)=3x^2e^x+x^3e^x=e^x(3x^2+x^3)`} display />
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> Use the quotient rule to differentiate
					<Katex math={r`q(x)=(x^2+1)/x`} />, for <Katex math="x\ne0" />.
				</p>
				{#snippet solution()}
					<Katex math={r`q'(x)=\frac{(2x)x-(x^2+1)}{x^2}=1-\frac1{x^2}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Differentiate <Katex math={r`h(x)=\sin(x^3)`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`h'(x)=\cos(x^3)\cdot3x^2`} display />
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Find <Katex math={r`(\arctan x)'`} /> using the inverse-function rule
					and <Katex math={r`1+\tan^2y=\sec^2y`} />.
				</p>
				{#snippet solution()}
					<p>
						If <Katex math={r`y=\arctan x`} />, then
						<Katex math={r`(\arctan x)'=1/\sec^2y=1/(1+x^2)`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> A particle has position <Katex math={r`s(t)=t^3-3t`} />. Find its
					velocity and acceleration at <Katex math="t=2" />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`v(t)=3t^2-3`} /> and <Katex math={r`a(t)=6t`} />. Thus
						<Katex math={r`v(2)=9`} /> and <Katex math={r`a(2)=12`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> Find the slope of the circle <Katex math={r`x^2+y^2=25`} /> at the
					point <Katex math={r`(3,4)`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`y'=-x/y=-3/4`} display />
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> Build the local line for <Katex math={r`f(x)=x^2e^x`} /> at
					<Katex math="x=1" /> and use it to estimate <Katex math={r`f(1.01)`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`L_1(x)=e+3e(x-1)`} />, so
						<Katex math={r`f(1.01)\approx e+0.03e=1.03e`} />.
					</p>
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				Chapter 4 uses <Katex math="f'" /> to locate candidate maxima and minima, and
				<Katex math="f''" /> to read how a graph bends. The same local models will also lead to Newton’s
				method for improving numerical guesses.
			</p>
		</LookingAhead>
	</div>
</section>
