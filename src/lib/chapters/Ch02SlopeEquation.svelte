<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import RevealBox from '$lib/components/RevealBox.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import InfinitesimalTrig from '$lib/components/demos/InfinitesimalTrig.svelte';
	import AlgebraMachine from '$lib/components/demos/AlgebraMachine.svelte';
	import SlopeEquationMachine from '$lib/components/demos/SlopeEquationMachine.svelte';
	import AngleAdditionLemma from '$lib/components/figures/AngleAdditionLemma.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch2">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 2</span>
			<h2 class="chapter-title" id="ch2-slope-equation">The Slope Equation</h2>
			<div class="chapter-epigraph">
				<blockquote>“If the derivative is a coefficient, how do we find it?”</blockquote>
				<p class="epigraph-attr">The task of this chapter</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Chapter 1 ended with one exact first-order equation. For a smooth function and a first-order
				displacement <Katex math="d" />,
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x+d)=f(x)+f'(x)d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The equation separates the output into two pieces: the original value
				<Katex math="f(x)" /> and the first-order change <Katex math="f'(x)d" />. This chapter turns
				that observation into a repeatable calculation.
			</p>
		</div>

		<Callout type="key-idea" title="The Coefficient-Extraction Method">
			<p>
				<strong>1. Change the input.</strong> Replace <Katex math="x" /> by <Katex math="x+d" />.
			</p>
			<p>
				<strong>2. Simplify.</strong> Use ordinary algebra together with <Katex math="d^2=0" />.
			</p>
			<p>
				<strong>3. Read the coefficient.</strong> Rewrite the result as
				<Katex math={r`f(x)+(\text{coefficient})d`} />. That coefficient is
				<Katex math="f'(x)" />.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>What the coefficient tells us</h3>
			<p>
				If an input changes by a first-order amount <Katex math="d" />, then the output changes by
				<Katex math="f'(x)d" />. The coefficient <Katex math="f'(x)" /> therefore answers a simple question:
				how much output change belongs to one unit of input change at this point?
			</p>
			<p>
				On a graph, that coefficient is the slope of the tangent line. In an applied problem, it is
				an instantaneous rate. Its units are always “output units per input unit.” If height is
				measured in meters and time in seconds, its derivative is measured in meters per second.
			</p>
			<p>
				For an ordinary finite step <Katex math="\Delta x" />, the same coefficient gives the local
				line prediction
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(a+\Delta x)\approx f(a)+f'(a)\Delta x`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The approximation sign matters: <Katex math="\Delta x" /> is an ordinary number, so a finite gap
				can remain. In the lab below, move <Katex math="\Delta x" /> and increase the zoom. The blue segment
				measures that gap in red.
			</p>
		</div>
	</div>

	<div class="content-width" use:reveal>
		<figure class="neo-figure">
			<SlopeEquationMachine />
			<figcaption>
				<span class="figure-number">Figure 2.1.</span>
				A finite input step leaves a visible gap between the curve and its local-line prediction.
			</figcaption>
		</figure>
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>
				The local line through <Katex math={r`(a,f(a))`} /> with slope <Katex math="f'(a)" /> has the
				equation
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`y=f(a)+f'(a)(x-a)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Now consider a falling ball whose height is <Katex math={r`h(t)=100-5t^2`} /> meters. Its derivative
				will tell us its vertical velocity.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Velocity of the falling ball</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`h(t+d)=100-5(t+d)^2`} display />
				</div>
				<div class="step-note">change the input</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`=100-5t^2-10td-5d^2`} display />
				</div>
				<div class="step-note">expand</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`=h(t)+(-10t)d`} display /></div>
				<div class="step-note"><Katex math="d^2=0" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`h'(t)=-10t`} display /></div>
				<div class="step-note">coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				At <Katex math="t=3" />, the velocity is <Katex math={r`h'(3)=-30`} /> meters per second. The
				negative sign says the height is decreasing; the ball’s downward speed is 30 meters per second.
			</p>

			<h3>Powers: one pattern</h3>
			<p>
				Two warm-ups require almost no calculation. A constant never changes, so
				<Katex math={r`(c)'=0`} />. A line <Katex math={r`f(x)=mx+b`} /> already has the form
				<Katex math={r`f(x+d)=f(x)+md`} />, so <Katex math={r`f'(x)=m`} />.
			</p>
			<p>The same pattern handles every positive integer power. The binomial expansion begins</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The first-order part of a power</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\begin{aligned}(x+d)^n={}&x^n+nx^{n-1}d\\&+\binom{n}{2}x^{n-2}d^2+\cdots\end{aligned}`}
						display
					/>
				</div>
				<div class="step-note">binomial expansion</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(x+d)^n=x^n+nx^{n-1}d`} display /></div>
				<div class="step-note">all later terms contain <Katex math="d^2" /></div>
			</div>
		</div>

		<Callout type="theorem" title="The Power Rule">
			<Katex math={r`f(x)=x^n\quad\Longrightarrow\quad f'(x)=nx^{n-1}`} display />
			<p>This version holds for positive integers <Katex math="n" />.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				The rule gives <Katex math={r`(x^2)'=2x`} />, <Katex math={r`(x^3)'=3x^2`} />, and
				<Katex math={r`(x^4)'=4x^3`} /> without three separate proofs. Rules for combining several terms
				will come in Chapter 3.
			</p>

			<h3>Two useful algebra tricks</h3>
			<p>
				Powers expand directly. Reciprocals and roots need one additional idea, but the goal is
				unchanged: isolate the coefficient of <Katex math="d" />.
			</p>
			<p>
				For the reciprocal, assume <Katex math="x\ne0" />. The product
				<Katex math={r`(x+d)(x-d)=x^2-d^2=x^2`} /> gives the inverse of
				<Katex math="x+d" /> immediately.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The reciprocal function</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\frac{1}{x+d}=\frac{x-d}{x^2}`} display />
				</div>
				<div class="step-note"><Katex math={r`(x+d)(x-d)=x^2`} /></div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\frac{1}{x+d}=\frac1x-\frac{1}{x^2}d`} display />
				</div>
				<div class="step-note">separate constant and first-order parts</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\left(\frac1x\right)'=-\frac1{x^2}`} display /></div>
				<div class="step-note">for <Katex math="x\ne0" /></div>
			</div>
		</div>

		<InlinePlot
			fn={(x) => 1 / x}
			domain={[0.3, 5]}
			tangentAt={1}
			caption="The reciprocal function and its local line at x = 1, where the slope is −1."
		/>

		<div class="neo-prose" use:reveal>
			<p>
				For the square root, assume <Katex math="x>0" />. Smoothness gives a unique coefficient
				<Katex math="k" /> in <Katex math={r`\sqrt{x+d}=\sqrt{x}+kd`} />. Squaring both sides will
				reveal it.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The square-root function</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`x+d=(\sqrt{x}+kd)^2`} display />
				</div>
				<div class="step-note">square both sides</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`x+d=x+2k\sqrt{x}\,d+k^2d^2`} display />
				</div>
				<div class="step-note">expand</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`1=2k\sqrt{x}`} display /></div>
				<div class="step-note">match the coefficients of <Katex math="d" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`(\sqrt{x})'=\frac{1}{2\sqrt{x}}`} display />
				</div>
				<div class="step-note">for <Katex math="x>0" /></div>
			</div>
		</div>

		<InlinePlot
			fn={(x) => Math.sqrt(Math.max(x, 0))}
			domain={[0, 5]}
			tangentAt={1}
			caption="The square-root function and its local line at x = 1, where the slope is 1/2."
		/>

		<div class="neo-prose" use:reveal>
			<p>
				We compared coefficients; we did not divide by <Katex math="d" />. The condition
				<Katex math="x>0" /> also matters: the square-root graph does not have a finite slope at
				<Katex math="x=0" />.
			</p>

			<h3>Angles and growth</h3>
			<h4>Sine and cosine</h4>
			<p>
				The next demo uses an ordinary finite angle <Katex math="\theta" />, measured in radians. As <Katex
					math="\theta"
				/> approaches zero, the arc length and vertical coordinate approach one another, while the horizontal
				coordinate approaches 1. The demo illustrates a limiting pattern; it does not turn a numerical
				angle into an infinitesimal.
			</p>
		</div>
	</div>

	<div use:reveal>
		<figure class="neo-figure">
			<InfinitesimalTrig />
			<figcaption>
				<span class="figure-number">Figure 2.2.</span>
				For finite angles, the differences become small but remain numerical differences.
			</figcaption>
		</figure>
	</div>

	<div class="content-width">
		<Callout type="key-idea" title="The First-Order Circle Facts">
			<p>For a first-order angle <Katex math="d" /> measured in radians,</p>
			<Katex math={r`\sin d=d,\qquad \cos d=1`} display />
			<p>
				These equations are exact for <Katex math="d^2=0" />. They are not equations for an ordinary
				nonzero angle.
			</p>
		</Callout>

		<RevealBox
			title="Under the hood: the unit circle and angle addition"
			subtitle="Optional geometry window"
			tone="math"
		>
			<p>
				At angle zero, the unit-circle point is <Katex math={r`(1,0)`} />. Radian measure makes
				motion around the unit circle have unit speed, and the tangent direction there is vertical.
				A first-order angle <Katex math="d" /> therefore moves the point to
				<Katex math={r`(1,d)`} />. Since its coordinates are
				<Katex math={r`(\cos d,\sin d)`} />, we obtain <Katex math={r`\cos d=1`} /> and
				<Katex math={r`\sin d=d`} />.
			</p>
			<p>The remaining ingredients are the angle-addition identities:</p>
			<AngleAdditionLemma />
		</RevealBox>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The sine function</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\sin(x+d)=\sin x\cos d+\cos x\sin d`} display />
				</div>
				<div class="step-note">angle addition</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sin(x+d)=\sin x+(\cos x)d`} display /></div>
				<div class="step-note"><Katex math={r`\cos d=1,\ \sin d=d`} /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(\sin x)'=\cos x`} display /></div>
				<div class="step-note">coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The cosine function</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\cos(x+d)=\cos x\cos d-\sin x\sin d`} display />
				</div>
				<div class="step-note">angle addition</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\cos(x+d)=\cos x-(\sin x)d`} display /></div>
				<div class="step-note"><Katex math={r`\cos d=1,\ \sin d=d`} /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(\cos x)'=-\sin x`} display /></div>
				<div class="step-note">coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Exponential and logarithmic functions</h4>
			<p>
				Equal input steps on an exponential curve produce equal multiplication factors. The natural
				base <Katex math="e" /> is normalized so that a first-order step satisfies
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`e^d=1+d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is an exact first-order identity, not a statement about an ordinary finite exponent.
				The exponential law now exposes the derivative:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The natural exponential</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{x+d}=e^x e^d`} display /></div>
				<div class="step-note">exponential law</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{x+d}=e^x(1+d)=e^x+e^x d`} display /></div>
				<div class="step-note"><Katex math={r`e^d=1+d`} /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(e^x)'=e^x`} display /></div>
				<div class="step-note">coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The natural logarithm is the inverse of <Katex math="e^x" />. For <Katex math="x>0" />,
				write its unknown first-order coefficient as <Katex math="k" />:
				<Katex math={r`\ln(x+d)=\ln x+kd`} />. Exponentiating both sides gives
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The natural logarithm</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x+d=e^{\ln x+kd}`} display /></div>
				<div class="step-note">exponentiate</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x+d=x e^{kd}=x(1+kd)`} display /></div>
				<div class="step-note"><Katex math={r`(kd)^2=0`} /></div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`1=xk`} display /></div>
				<div class="step-note">match coefficients</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(\ln x)'=\frac1x`} display /></div>
				<div class="step-note">for <Katex math="x>0" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For any positive base <Katex math="a" />, the identity
				<Katex math={r`a^x=e^{x\ln a}`} /> similarly gives
				<Katex math={r`(a^x)'=a^x\ln a`} />.
			</p>

			<h3>A small derivative library</h3>
			<p>
				Every result below came from the same question: what is the coefficient of
				<Katex math="d" />? The conditions in the last column are part of each result, not fine
				print.
			</p>
		</div>

		<Callout type="key-idea" title="Derivative Library">
			<table class="neo-table">
				<colgroup><col class="function-column" /><col class="derivative-column" /><col /></colgroup>
				<thead>
					<tr><th>Function</th><th>Derivative</th><th>Condition</th></tr>
				</thead>
				<tbody>
					<tr><td><Katex math="c" /></td><td><Katex math="0" /></td><td>constant</td></tr>
					<tr
						><td><Katex math="mx+b" /></td><td><Katex math="m" /></td><td>all <Katex math="x" /></td
						></tr
					>
					<tr
						><td><Katex math="x^n" /></td><td><Katex math={r`nx^{n-1}`} /></td><td
							>positive integer <Katex math="n" /></td
						></tr
					>
					<tr
						><td><Katex math={r`1/x`} /></td><td><Katex math={r`-1/x^2`} /></td><td
							><Katex math="x\ne0" /></td
						></tr
					>
					<tr
						><td><Katex math={r`\sqrt{x}`} /></td><td><Katex math={r`1/(2\sqrt{x})`} /></td><td
							><Katex math="x>0" /></td
						></tr
					>
					<tr
						><td><Katex math={r`\sin x`} /></td><td><Katex math={r`\cos x`} /></td><td>radians</td
						></tr
					>
					<tr
						><td><Katex math={r`\cos x`} /></td><td><Katex math={r`-\sin x`} /></td><td>radians</td
						></tr
					>
					<tr
						><td><Katex math="e^x" /></td><td><Katex math="e^x" /></td><td
							>all <Katex math="x" /></td
						></tr
					>
					<tr
						><td><Katex math="a^x" /></td><td><Katex math={r`a^x\ln a`} /></td><td
							><Katex math="a>0" /></td
						></tr
					>
					<tr
						><td><Katex math={r`\ln x`} /></td><td><Katex math={r`1/x`} /></td><td
							><Katex math="x>0" /></td
						></tr
					>
				</tbody>
			</table>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				Use the lab to revisit a derivation. Each tab follows the same three steps from the
				beginning of the chapter.
			</p>
		</div>
	</div>

	<div use:reveal>
		<AlgebraMachine />
	</div>

	<div class="content-width">
		<ChapterSummary>
			<ul>
				<li>
					To find a derivative, compute <Katex math="f(x+d)" />, use <Katex math="d^2=0" />, and
					read the coefficient of <Katex math="d" />.
				</li>
				<li>
					The derivative is a local slope and an instantaneous rate, with units of output per input.
				</li>
				<li>
					For finite <Katex math="\Delta x" />, the local line is generally an approximation; for
					first-order <Katex math="d" />, the slope equation is exact.
				</li>
				<li>
					Powers, reciprocals, and roots use different algebraic moves but the same coefficient
					rule.
				</li>
				<li>
					The identities <Katex math={r`\sin d=d`} />, <Katex math={r`\cos d=1`} />, and
					<Katex math={r`e^d=1+d`} /> reveal the basic trigonometric and exponential derivatives.
				</li>
			</ul>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Practice (six core, two explorations)</summary>

			<Exercise number={1}>
				<p>
					<strong>Core.</strong> Use coefficient extraction to find the derivative of
					<Katex math={r`f(x)=7x-4`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`f(x+d)=7(x+d)-4=f(x)+7d`} display />
					<p>Therefore <Katex math={r`f'(x)=7`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Core.</strong> Derive the derivative of <Katex math={r`x^4`} /> directly from
					<Katex math={r`(x+d)^4`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`(x+d)^4=x^4+4x^3d+6x^2d^2+4xd^3+d^4=x^4+4x^3d`} display />
					<p>Thus <Katex math={r`(x^4)'=4x^3`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> A stone’s height is <Katex math={r`h(t)=45-5t^2`} /> meters. Find its
					velocity at <Katex math="t=2" /> and explain the sign.
				</p>
				{#snippet solution()}
					<p>
						Coefficient extraction gives <Katex math={r`h'(t)=-10t`} />, so
						<Katex math={r`h'(2)=-20`} /> m/s. The negative sign means the height is decreasing.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Find the slope of <Katex math={r`f(x)=1/x`} /> at
					<Katex math="x=2" />.
				</p>
				{#snippet solution()}
					<Katex math={r`f'(2)=-\frac1{2^2}=-\frac14`} display />
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Use the square-root derivative to find the slope at
					<Katex math="x=4" />.
				</p>
				{#snippet solution()}
					<Katex math={r`(\sqrt{x})'\big|_{x=4}=\frac1{2\sqrt4}=\frac14`} display />
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Starting from the angle-addition formula, derive
					<Katex math={r`(\cos x)'=-\sin x`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`\cos(x+d)=\cos x\cos d-\sin x\sin d=\cos x-(\sin x)d`} display />
					<p>The coefficient of <Katex math="d" /> is <Katex math={r`-\sin x`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> Use <Katex math={r`2^x=e^{x\ln2}`} /> to show that
					<Katex math={r`(2^x)'=2^x\ln2`} />.
				</p>
				{#snippet solution()}
					<Katex math={r`2^{x+d}=2^x e^{d\ln2}=2^x(1+d\ln2)`} display />
					<p>The coefficient is <Katex math={r`2^x\ln2`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> Use the local-line approximation at <Katex math="x=4" /> to estimate
					<Katex math={r`\sqrt{4.01}`} /> without a calculator.
				</p>
				{#snippet solution()}
					<Katex math={r`\sqrt{4.01}\approx2+\frac14(0.01)=2.0025`} display />
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				We can now differentiate several individual function families. Chapter 3 asks what happens
				when functions are added, multiplied, divided, composed, or inverted, and derives the rules
				for each operation from the same first-order equation.
			</p>
		</LookingAhead>
	</div>
</section>

<style>
	:global(#ch2 > .neo-figure figcaption) {
		max-width: var(--w-content);
		margin-inline: auto;
	}
</style>
