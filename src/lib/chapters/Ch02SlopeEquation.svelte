<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import StandardCalcBox from '$lib/components/StandardCalcBox.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import InfinitesimalTrig from '$lib/components/demos/InfinitesimalTrig.svelte';
	import AlgebraMachine from '$lib/components/demos/AlgebraMachine.svelte';
	import AngleAdditionLemma from '$lib/components/figures/AngleAdditionLemma.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch2">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 2</span>
			<h2 class="chapter-title">The Slope Equation</h2>
			<div class="chapter-epigraph">
				<blockquote>
					"It is useful to solve differential equations by means of infinite series, but I am
					surprised that no one likes the method of infinitely small quantities, which is shorter
					and more direct."
				</blockquote>
				<p class="epigraph-attr">— Gottfried Wilhelm Leibniz, letter to Johann Bernoulli, 1695</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A ball is falling. Its height at time <Katex math="t" /> is <Katex
					math={r`h(t) = 100 - 5t^2`}
				/> meters. How fast is it falling at <Katex math="t = 3" /> seconds?
			</p>
			<p>
				In traditional calculus, answering this requires limits — taking a ratio, letting the
				denominator "approach" zero without ever reaching it, and hoping the expression simplifies.
				In Neocalculus, there is no dance. There is just algebra.
			</p>
		</div>

		<!-- ═══ SECTION: The Slope Equation ═══ -->
		<Callout type="theorem" title="The Slope Equation">
			<p>
				For <em>any</em> function <Katex math="f" /> and any infinitesimal
				<span class="d-highlight">d</span>, there exists a unique number <Katex math={r`f'(x)`} /> such
				that:
			</p>
			<Katex math={r`f(x + d) = f(x) + f'(x) \cdot d`} display />
			<p>
				The quantity <Katex math={r`f'(x)`} /> is the <strong>derivative</strong> — the coefficient
				of <span class="d-highlight">d</span>.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				This follows directly from the Kock-Lawvere axiom we met in Chapter 1. Since any function
				restricted to an infinitesimal interval is uniquely of the form <Katex
					math="f(0) + s \cdot d"
				/>, the slope equation holds for every smooth function. The unique number <Katex math="s" /> is
				what we call <Katex math={r`f'(x)`} /> — the derivative of <Katex math="f" /> at <Katex
					math="x"
				/>.
			</p>
		</div>

		<!-- ═══ SECTION: What the derivative means ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>What the derivative means</h3>
			<p>Before we compute a single derivative, let's understand what this number tells us.</p>
			<p>
				<strong>Geometrically:</strong>
				<Katex math={r`f'(x)`} /> is the <em>slope of the tangent line</em> to the graph of <Katex
					math="f"
				/> at the point <Katex math="x" />. At the infinitesimal scale, the curve <em>is</em> its tangent
				line (by microstraightness), so the derivative is the slope of the curve itself.
			</p>
			<p>
				<strong>Physically:</strong>
				<Katex math={r`f'(x)`} /> is the <em>instantaneous rate of change</em> of <Katex
					math="f"
				/>. If <Katex math="f(t)" /> is the position of a car at time <Katex math="t" />, then <Katex
					math={r`f'(t)`}
				/> is its velocity — how fast the position is changing at that instant.
			</p>
			<p>
				<strong>Units:</strong> If <Katex math="x" /> is in seconds and <Katex math="f(x)" /> is in meters,
				then <Katex math={r`f'(x)`} /> is in meters per second. The derivative always has units of "output
				per input."
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The slope equation also immediately gives us the <strong
					>equation of the tangent line</strong
				>
				at any point <Katex math="a" />:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`y = f(a) + f'(a)(x - a)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is the line through <Katex math={r`(a, f(a))`} /> with slope <Katex math={r`f'(a)`} /> —
				exactly the tangent line. In Neocalculus, the tangent line is not an "approximation" — at the
				infinitesimal scale, it <em>is</em> the function.
			</p>
			<p>
				Now let's see the slope equation work on every important function. The technique is always
				the same: expand <Katex math="f(x + d)" />, simplify using <Katex math="d^2 = 0" />, and
				read off the coefficient of <Katex math="d" />.
			</p>
		</div>

		<!-- ═══ SECTION: Basic rules ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The simplest rules</h3>
			<p>
				Before tackling individual functions, let's establish the rules for combining derivatives.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of a constant: (c)' = 0</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x+d) = c = c + 0 \cdot d`} display /></div>
				<span class="step-note">constant doesn't change</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f'(x) = 0`} display /></div>
				<span class="step-note">makes sense: no change ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of a linear function: (mx + b)' = m</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`f(x+d) = m(x+d) + b = mx + b + m \cdot d`} display />
				</div>
				<span class="step-note">distribute</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f'(x) = m`} display /></div>
				<span class="step-note">the slope of a line is its slope ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Sum rule: (f + g)' = f' + g'</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(f+g)(x+d) = f(x+d) + g(x+d)`} display /></div>
				<span class="step-note">definition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= [f(x) + f'(x)d] + [g(x) + g'(x)d]`} display /></div>
				<span class="step-note">slope equation on each</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`= (f+g)(x) + [f'(x) + g'(x)] \cdot d`} display />
				</div>
				<span class="step-note">(f+g)' = f' + g' ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Constant multiple rule: (cf)' = cf'</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`(cf)(x+d) = c \cdot f(x+d) = c[f(x) + f'(x)d] = cf(x) + cf'(x) \cdot d`}
						display
					/>
				</div>
				<span class="step-note">factor out c</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(cf)' = cf'`} display /></div>
				<span class="step-note">✓</span>
			</div>
		</div>

		<!-- ═══ SECTION: Polynomials ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Polynomials</h3>
			<p>Let's start with the simplest functions and work our way up.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of x²</div>
			<div class="step">
				<div class="step-math"><Katex math="f(x+d) = (x+d)^2" display /></div>
				<span class="step-note">substitute</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`= x^2 + 2xd + \textcolor{#ef4444}{d^2}`} display />
				</div>
				<span class="step-note">expand</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= x^2 + 2xd`} display /></div>
				<span class="step-note">d² = 0</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math="f'(x) = 2x" display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Let's apply this. For <Katex math="f(x) = x^2" />, we get <Katex math="f'(3) = 6" />. This
				means the tangent line at <Katex math="x = 3" /> has slope 6 — the curve is rising 6 units for
				every 1 unit to the right.
			</p>
		</div>

		<InlinePlot
			fn={(x) => x * x}
			domain={[-2.5, 2.5]}
			tangentAt={1}
			caption="f(x) = x² with tangent at x = 1 (slope = 2)"
		/>

		<div class="neo-prose" use:reveal>
			<p>
				Now let's answer the opening question: how fast is a ball falling at <Katex math="t = 3" />?
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: velocity of a falling ball</div>
			<div class="step">
				<div class="step-math"><Katex math={r`h(t) = 100 - 5t^2`} display /></div>
				<span class="step-note">height function</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`h(t+d) = 100 - 5(t+d)^2 = 100 - 5t^2 - 10td`} display />
				</div>
				<span class="step-note">expand, d² = 0</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`h'(t) = -10t`} display /></div>
				<span class="step-note">velocity</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`h'(3) = -30 \text{ m/s}`} display /></div>
				<span class="step-note">falling at 30 m/s ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of x³</div>
			<div class="step">
				<div class="step-math"><Katex math="f(x+d) = (x+d)^3 " display /></div>
				<span class="step-note">substitute</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`= x^3 + 3x^2 d + \textcolor{#ef4444}{3xd^2 + d^3}`} display />
				</div>
				<span class="step-note">expand</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math="= x^3 + 3x^2 d" display /></div>
				<span class="step-note">d² = 0 kills higher terms</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math="f'(x) = 3x^2" display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				See the pattern? For <em>any</em> positive integer power <Katex math="x^n" />, the binomial
				expansion gives:
			</p>
			<Katex
				math={r`(x+d)^n = x^n + nx^{n-1}d + \binom{n}{2}x^{n-2}\textcolor{#ef4444}{d^2} + \cdots`}
				display
			/>
			<p>
				Since <Katex math="d^2 = 0" /> kills every term from the second onward, only the first two survive:
			</p>
		</div>

		<Callout type="theorem" title="The Power Rule">
			<Katex math={r`\frac{d}{dx}\!\left(x^n\right) = nx^{n-1}`} display />
			<p>
				This holds for any positive integer <Katex math="n" />. We'll extend it to all real
				exponents using the chain rule in Chapter 3.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>With the sum rule and power rule, we can now differentiate any polynomial:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: a multi-term polynomial</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x) = 2x^3 - 5x^2 + x - 3`} display /></div>
				<span class="step-note">given</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`f'(x) = 2 \cdot 3x^2 - 5 \cdot 2x + 1 - 0`} display />
				</div>
				<span class="step-note">power rule + sum rule</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f'(x) = 6x^2 - 10x + 1`} display /></div>
				<span class="step-note">✓</span>
			</div>
		</div>

		<!-- ═══ SECTION: Rational & Radical ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Rational and radical functions</h3>
			<p>
				Neocalculus isn't limited to polynomials. The same rule handles functions that require
				clever tricks in classical calculus.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of 1/x</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x+d) = \frac{1}{x+d}`} display /></div>
				<span class="step-note">substitute</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`= \frac{1}{x+d} \cdot \frac{x-d}{x-d} = \frac{x-d}{x^2 - \textcolor{#ef4444}{d^2}} = \frac{x-d}{x^2}`}
						display
					/>
				</div>
				<span class="step-note">conjugate, d² = 0</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= \frac{1}{x} - \frac{d}{x^2}`} display /></div>
				<span class="step-note">separate</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f'(x) = -\frac{1}{x^2}`} display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<InlinePlot
			fn={(x) => 1 / x}
			domain={[0.3, 5]}
			tangentAt={1}
			caption="f(x) = 1/x with tangent at x = 1 (slope = −1)"
		/>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of √x</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\sqrt{x+d} = \sqrt{x} + k \cdot d \quad \text{(find } k \text{)}`}
						display
					/>
				</div>
				<span class="step-note">K-L axiom guarantees this form</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{Square: } x + d = x + 2k\sqrt{x}\,d + \textcolor{#ef4444}{k^2 d^2}`}
						display
					/>
				</div>
				<span class="step-note">square both sides</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x + d = x + 2k\sqrt{x}\,d`} display /></div>
				<span class="step-note">d² = 0</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`1 = 2k\sqrt{x}`} display /></div>
				<span class="step-note">match d coefficients (microcancellation)</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f'(x) = \frac{1}{2\sqrt{x}}`} display /></div>
				<span class="step-note">✓</span>
			</div>
		</div>

		<InlinePlot
			fn={(x) => Math.sqrt(Math.max(x, 0))}
			domain={[0, 5]}
			tangentAt={1}
			caption="f(x) = √x with tangent at x = 1 (slope = ½)"
		/>

		<!-- ═══ SECTION: Trig ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Trigonometric functions</h3>
			<p>
				Here's where Neocalculus shines with a beautiful geometric argument. The key fact is that
				for an infinitesimal angle <span class="d-highlight">d</span> on the unit circle:
			</p>
		</div>

		<Callout type="key-idea" title="The Infinitesimal Triangle">
			<p>
				For infinitesimal <Katex math="d" />, draw a right triangle inscribed in the unit circle
				with angle <Katex math="d" />. The hypotenuse has length 1 (the radius). By the Kock-Lawvere
				axiom, the arc of length <Katex math="d" /> is a straight line (microstraightness), so:
			</p>
			<Katex math={r`\sin(d) = d, \qquad \cos(d) = \sqrt{1 - d^2} = \sqrt{1} = 1`} display />
			<p>
				These are <strong>exact</strong>, not approximations. The sine of an infinitesimal
				<em>is</em>
				that infinitesimal; the cosine <em>is</em> 1.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				The demo below lets you see this geometrically — as the angle shrinks toward the
				infinitesimal, the chord, arc, and sine become identical:
			</p>
		</div>

		<div use:reveal>
			<InfinitesimalTrig />
		</div>

		<Callout type="theorem" title="Lemma: Angle Addition Formulas (Geometric Proof)">
			<p>
				Before differentiating trig functions, prove the identities once from unit-circle geometry.
			</p>
			<AngleAdditionLemma />
			<p>
				Now the derivative derivations below are direct substitutions using <Katex math="d^2=0" />,
				<Katex math={r`\sin d=d`} />, and <Katex math={r`\cos d=1`} />.
			</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of sin(x)</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\sin(x+d) = \sin x \cos d + \cos x \sin d`} display />
				</div>
				<span class="step-note">angle addition formula</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= \sin x \cdot 1 + \cos x \cdot d`} display /></div>
				<span class="step-note">cos(d)=1, sin(d)=d</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\sin'(x) = \cos x`} display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of cos(x)</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\cos(x+d) = \cos x \cos d - \sin x \sin d`} display />
				</div>
				<span class="step-note">angle addition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= \cos x - \sin x \cdot d`} display /></div>
				<span class="step-note">cos(d)=1, sin(d)=d</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\cos'(x) = -\sin x`} display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of tan(x)</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\tan(x+d) = \frac{\sin(x+d)}{\cos(x+d)} = \frac{\sin x + \cos x \cdot d}{\cos x - \sin x \cdot d}`}
						display
					/>
				</div>
				<span class="step-note">substitute</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`= \frac{(\sin x + \cos x \, d)(\cos x + \sin x \, d)}{\cos^2 x - \textcolor{#ef4444}{\sin^2\!x\, d^2}}`}
						display
					/>
				</div>
				<span class="step-note">conjugate</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`= \frac{\sin x \cos x + d(\cos^2\!x + \sin^2\!x)}{\cos^2 x} = \tan x + \frac{d}{\cos^2 x}`}
						display
					/>
				</div>
				<span class="step-note">d²=0, Pythagorean identity</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\tan'(x) = \frac{1}{\cos^2 x} = \sec^2 x`} display />
				</div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<InlinePlot
			fn={(x) => Math.sin(x)}
			domain={[-4, 4]}
			tangentAt={Math.PI / 4}
			secondFn={(x) => Math.cos(x)}
			caption="sin(x) (solid) and cos(x) (dashed blue). Tangent to sin at x = π/4."
		/>

		<StandardCalcBox>
			<p>
				In standard calculus, proving <Katex math={r`\sin'(x) = \cos x`} /> requires the squeeze theorem
				to show <Katex math={r`\lim_{h \to 0} \frac{\sin h}{h} = 1`} />, which itself requires a
				geometric area argument. In Neocalculus, the same result follows from one axiom
				(microstraightness) and one identity (angle addition). Three lines.
			</p>
		</StandardCalcBox>

		<!-- ═══ SECTION: Exponential & Log ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Exponential and logarithmic functions</h3>
			<p>
				The exponential function <Katex math="e^x" /> is one of the most important in all of mathematics.
				We <em>define</em> it as the unique function that is its own derivative:
			</p>
		</div>

		<Callout type="definition" title="The exponential function">
			<p>
				<Katex math="e^x" /> is defined as the unique function satisfying <Katex
					math={r`f'(x) = f(x)`}
				/> and <Katex math="f(0) = 1" />. It is "the function whose rate of change equals itself."
			</p>
			<p>
				Such a function exists and is unique (by the existence theorem for differential equations).
				This definition is not circular — it tells us <em>what property characterizes</em>
				<Katex math="e^x" />, and the derivative follows directly.
			</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of eˣ and the infinitesimal exponential</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`e^{x+d} = e^x + (e^x)' \cdot d = e^x + e^x \cdot d`} display />
				</div>
				<span class="step-note">slope equation + definition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= e^x(1+d)`} display /></div>
				<span class="step-note">factor</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\text{But also } e^{x+d} = e^x \cdot e^d`} display />
				</div>
				<span class="step-note">exponential law</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\therefore\; e^d = 1 + d \quad \text{for infinitesimal } d`} display />
				</div>
				<span class="step-note">the infinitesimal exponential ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This gives us one of the most beautiful facts in Neocalculus: <strong
					>the number <Katex math="e" /> is the base whose infinitesimal power is <Katex
						math="1 + d"
					/></strong
				>.
			</p>
		</div>

		<InlinePlot
			fn={(x) => Math.exp(x)}
			domain={[-2, 3]}
			tangentAt={1}
			caption="f(x) = eˣ with tangent at x = 1 (slope = e ≈ 2.718). The tangent slope equals the function value!"
		/>

		<!-- General exponential -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of aˣ (general exponential)</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`a^{x+d} = a^x \cdot a^d = a^x \cdot e^{d \ln a}`} display />
				</div>
				<span class="step-note"><Katex math={r`a^d = e^{d \ln a}`} /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= a^x(1 + d \ln a)`} display /></div>
				<span class="step-note"
					><Katex math={r`e^\varepsilon = 1 + \varepsilon`} /> for infinitesimal <Katex
						math={r`\varepsilon = d\ln a`}
					/></span
				>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(a^x)' = a^x \ln a`} display /></div>
				<span class="step-note">coefficient of d ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of ln(x)</div>
			<div class="step">
				<div class="step-math"><Katex math={r`y = \ln(x) \implies e^y = x`} display /></div>
				<span class="step-note">inverse definition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{y + y'd} = x + d`} display /></div>
				<span class="step-note">nudge both sides</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^y(1 + y'\!d) = x + d`} display /></div>
				<span class="step-note"><Katex math={r`e^\varepsilon = 1+\varepsilon`} /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x + xy'\!d = x + d`} display /></div>
				<span class="step-note"><Katex math="e^y = x" /></span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\ln'(x) = \frac{1}{x}`} display /></div>
				<span class="step-note">match d coefficients ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of log_a(x)</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\log_a(x) = \frac{\ln x}{\ln a}`} display /></div>
				<span class="step-note">change of base</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(\log_a x)' = \frac{1}{x \ln a}`} display /></div>
				<span class="step-note">constant multiple rule ✓</span>
			</div>
		</div>

		<HistoryBox name="Jacob Bernoulli" years="1655–1705">
			<p>
				The number <Katex math="e" /> was discovered by Bernoulli while studying compound interest. He
				asked: what happens when you compound interest continuously? The answer is <Katex
					math={r`e = \lim_{n \to \infty}(1 + 1/n)^n \approx 2.718`}
				/>. In Neocalculus, we see this differently: <Katex math={r`e^d = 1 + d`} /> for infinitesimal
				<Katex math="d" /> — <Katex math="e" /> is the base whose infinitesimal growth is exactly linear.
			</p>
		</HistoryBox>

		<!-- ═══ SECTION: Inverse Trig ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Inverse trigonometric functions</h4>
			<p>
				The same "nudge both sides" technique works for any inverse function. If <Katex
					math={r`y = f^{-1}(x)`}
				/>, then <Katex math={r`f(y) = x`} />. Nudging both sides: <Katex
					math={r`f'(y) \cdot y'd = d`}
				/>, so:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\left(f^{-1}\right)'(x) = \frac{1}{f'(f^{-1}(x))}`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of arcsin(x)</div>
			<div class="step">
				<div class="step-math"><Katex math={r`y = \arcsin(x) \implies \sin(y) = x`} display /></div>
				<span class="step-note">inverse definition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\cos(y) \cdot y'\!d = d`} display /></div>
				<span class="step-note">nudge: sin'(y)=cos(y)</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`y' = \frac{1}{\cos(y)} = \frac{1}{\sqrt{1-x^2}}`} display />
				</div>
				<span class="step-note">Pythagorean identity</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\arcsin'(x) = \frac{1}{\sqrt{1-x^2}}`} display />
				</div>
				<span class="step-note">✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of arctan(x)</div>
			<div class="step">
				<div class="step-math"><Katex math={r`y = \arctan(x) \implies \tan(y) = x`} display /></div>
				<span class="step-note">inverse definition</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sec^2(y) \cdot y'\!d = d`} display /></div>
				<span class="step-note">nudge: tan'(y)=sec²(y)</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`y' = \frac{1}{1+\tan^2(y)} = \frac{1}{1+x^2}`} display />
				</div>
				<span class="step-note">identity</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\arctan'(x) = \frac{1}{1+x^2}`} display /></div>
				<span class="step-note">✓</span>
			</div>
		</div>

		<!-- ═══ Tangent line example ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Finding tangent lines</h4>
			<p>
				Let's put the derivative to use. The tangent line to <Katex math="f(x) = x^2" /> at <Katex
					math="x = 3"
				/> has slope <Katex math="f'(3) = 6" /> and passes through <Katex math="(3, 9)" />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: tangent line to x² at x = 3</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`y = f(3) + f'(3)(x - 3) = 9 + 6(x - 3)`} display />
				</div>
				<span class="step-note">tangent line formula</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`y = 6x - 9`} display /></div>
				<span class="step-note">the tangent line ✓</span>
			</div>
		</div>

		<!-- ═══ Derivative Summary ═══ -->
		<Callout type="key-idea" title="Complete Derivative Table">
			<table class="neo-table">
				<thead><tr><th>Function</th><th>Derivative</th><th>Method</th></tr></thead>
				<tbody>
					<tr><td><Katex math="c" /> (constant)</td><td><Katex math="0" /></td><td>direct</td></tr>
					<tr
						><td><Katex math="x^n" /></td><td><Katex math={r`nx^{n-1}`} /></td><td
							>binomial, d²=0</td
						></tr
					>
					<tr
						><td><Katex math={r`\sin x`} /></td><td><Katex math={r`\cos x`} /></td><td
							>infinitesimal triangle</td
						></tr
					>
					<tr
						><td><Katex math={r`\cos x`} /></td><td><Katex math={r`-\sin x`} /></td><td
							>infinitesimal triangle</td
						></tr
					>
					<tr
						><td><Katex math={r`\tan x`} /></td><td><Katex math={r`\sec^2 x`} /></td><td
							>sin/cos + conjugate</td
						></tr
					>
					<tr
						><td><Katex math="e^x" /></td><td><Katex math="e^x" /></td><td>definition (f'=f)</td
						></tr
					>
					<tr
						><td><Katex math="a^x" /></td><td><Katex math={r`a^x \ln a`} /></td><td
							><Katex math={r`e^{d\ln a}=1+d\ln a`} /></td
						></tr
					>
					<tr
						><td><Katex math={r`\ln x`} /></td><td><Katex math={r`1/x`} /></td><td
							>inverse of exp</td
						></tr
					>
					<tr
						><td><Katex math={r`\log_a x`} /></td><td><Katex math={r`1/(x \ln a)`} /></td><td
							>change of base</td
						></tr
					>
					<tr
						><td><Katex math={r`\arcsin x`} /></td><td><Katex math={r`1/\sqrt{1-x^2}`} /></td><td
							>inverse of sin</td
						></tr
					>
					<tr
						><td><Katex math={r`\arctan x`} /></td><td><Katex math={r`1/(1+x^2)`} /></td><td
							>inverse of tan</td
						></tr
					>
				</tbody>
			</table>
			<p style="font-size:0.9rem;margin-top:0.5rem;">
				Every one of these was derived from a single rule: <Katex math="d^2 = 0" />.
			</p>
		</Callout>

		<SDGAdvantage>
			<p>
				In a standard calculus course, students memorize this derivative table as a list of
				formulas, often without seeing the proofs. In Neocalculus, every formula has been <em
					>derived</em
				>
				from one algebraic rule — <Katex math="d^2 = 0" />. There is nothing to memorize that you
				can't re-derive in minutes.
			</p>
		</SDGAdvantage>

		<!-- ═══ History ═══ -->
		<HistoryBox name="F. William Lawvere" years="1937–2023">
			<p>
				Lawvere envisioned a mathematical universe where infinitesimals exist naturally within
				"smooth toposes." His insight — that the right logical framework makes infinitesimals
				rigorous — is the foundation on which Neocalculus is built.
			</p>
		</HistoryBox>

		<HistoryBox name="Anders Kock" years="born 1938">
			<p>
				Kock developed the axiomatic framework of Synthetic Differential Geometry, including the
				axiom that bears his name. His work showed that all of differential calculus and geometry
				can be rebuilt on the simple principle that infinitesimal segments cannot bend.
			</p>
		</HistoryBox>

		<div class="neo-prose" use:reveal>
			<p>
				Try any of these interactively — pick a function, step through the algebra, and verify
				numerically:
			</p>
		</div>
	</div>

	<div use:reveal>
		<AlgebraMachine />
	</div>

	<div class="content-width">
		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li>
					The <strong>slope equation</strong>
					<Katex math={r`f(x+d) = f(x) + f'(x) \cdot d`} /> gives the derivative as the coefficient of
					<Katex math="d" />.
				</li>
				<li>
					<strong>Geometrically:</strong> the derivative is the slope of the tangent line.
					<strong>Physically:</strong> it is the instantaneous rate of change.
				</li>
				<li>
					The <strong>tangent line</strong> at <Katex math="a" />: <Katex
						math={r`y = f(a) + f'(a)(x-a)`}
					/>.
				</li>
				<li>
					<strong>Sum rule:</strong>
					<Katex math={r`(f+g)' = f' + g'`} />. <strong>Constant multiple:</strong>
					<Katex math={r`(cf)' = cf'`} />.
				</li>
				<li>
					<strong>Power rule:</strong>
					<Katex math={r`(x^n)' = nx^{n-1}`} />. Every polynomial can be differentiated term by
					term.
				</li>
				<li>
					<strong>Trig:</strong>
					<Katex math={r`\sin' = \cos, \; \cos' = -\sin`} /> from the infinitesimal triangle (<Katex
						math={r`\sin d = d, \cos d = 1`}
					/>).
				</li>
				<li>
					<strong>Exponential:</strong>
					<Katex math={r`(e^x)' = e^x`} /> and <Katex math={r`e^d = 1+d`} />. <strong>Log:</strong>
					<Katex math={r`(\ln x)' = 1/x`} />.
				</li>
				<li>
					<strong>Inverse functions:</strong>
					<Katex math={r`(f^{-1})' = 1/f'(f^{-1})`} />, giving arcsin, arctan, etc.
				</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (Core 1-10, Extension optional)</summary>

			<Exercise number={1}>
				<p>
					<strong>Warm-up.</strong> Use <Katex math="d^2 = 0" /> to find the derivative of <Katex
						math={r`f(x) = x^4`}
					/>.
				</p>
				{#snippet solution()}<Katex
						math={r`(x+d)^4 = x^4 + 4x^3 d + \ldots = x^4 + 4x^3 d. \text{ So } f'(x)=4x^3.`}
						display
					/>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Warm-up.</strong> Find <Katex math={r`f'(x)`} /> for <Katex
						math={r`f(x) = x^2 + 3x`}
					/>.
				</p>
				{#snippet solution()}<Katex math={r`f'(x)=2x+3.`} display />
					<p>Sum rule + power rule.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> Find <Katex math={r`f'(x)`} /> for <Katex
						math={r`f(x) = 5x^3 - 2x + 1`}
					/>.
				</p>
				{#snippet solution()}<Katex math={r`f'(x) = 15x^2 - 2`} display />{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Find <Katex math={r`f'(x)`} /> for <Katex
						math={r`f(x) = 1/x^2`}
					/>. (Hint: write as <Katex math={r`x^{-2}`} /> and use the power rule, or use the conjugate
					trick.)
				</p>
				{#snippet solution()}<p>
						Using the power rule: <Katex math={r`(x^{-2})' = -2x^{-3} = -2/x^3`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Find the equation of the tangent line to <Katex
						math={r`f(x) = x^3`}
					/> at <Katex math="x = 2" />.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`f(2) = 8, \; f'(x) = 3x^2, \; f'(2) = 12`} />. Tangent line: <Katex
							math={r`y = 8 + 12(x-2) = 12x - 16`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Find where the tangent to <Katex math={r`f(x) = x^2 - 4x + 3`} /> is
					horizontal.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`f'(x) = 2x - 4 = 0 \implies x = 2`} />. The tangent is horizontal at <Katex
							math="x = 2"
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Core.</strong> A car's position is <Katex math={r`s(t) = t^2 + 3t`} /> meters. Find
					its velocity at <Katex math="t = 4" /> seconds.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`v(t) = s'(t) = 2t + 3`} />. At <Katex math="t=4" />: <Katex
							math={r`v(4) = 11`}
						/> m/s.
					</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Core.</strong> Verify that <Katex math="e^x" /> is its own derivative by computing <Katex
						math={r`e^{x+d}`}
					/> directly using <Katex math={r`e^d = 1+d`} />.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`e^{x+d} = e^x \cdot e^d = e^x(1+d) = e^x + e^x \cdot d`} />. The
						coefficient of <Katex math="d" /> is <Katex math="e^x" />, confirming <Katex
							math={r`(e^x)' = e^x`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p>
					<strong>Core.</strong> Show that <Katex math={r`(e^{2x})' = 2e^{2x}`} /> using <Katex
						math={r`e^d = 1 + d`}
					/>. (Hint: <Katex math={r`e^{2(x+d)} = e^{2x} \cdot e^{2d}`} /> and <Katex math={r`2d`} /> is
					infinitesimal.)
				</p>
				{#snippet solution()}<p>
						<Katex math={r`e^{2(x+d)} = e^{2x} \cdot e^{2d} = e^{2x}(1+2d)`} />. Coefficient of d is <Katex
							math={r`2e^{2x}`}
						/> ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p>
					<strong>Core.</strong> Compute <Katex math={r`\sin'(x)`} /> from scratch using the angle addition
					formula and <Katex math={r`\sin(d) = d, \cos(d) = 1`} />.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`\sin(x+d) = \sin x \cos d + \cos x \sin d = \sin x + \cos x \cdot d`} />.
						So <Katex math={r`\sin'(x) = \cos x`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p>
					<strong>Core.</strong> Derive the derivative of <Katex math={r`\arccos(x)`} /> using the inverse
					function technique.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`y = \arccos(x) \implies \cos(y) = x`} />. Nudge: <Katex
							math={r`-\sin(y) \cdot y'd = d`}
						/>, so <Katex math={r`y' = -1/\sin(y) = -1/\sqrt{1-x^2}`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p>
					<strong>Challenge.</strong> Find <Katex math={r`f'(x)`} /> for <Katex
						math={r`f(x) = \sec(x) = 1/\cos(x)`}
					/> using the conjugate technique from the <Katex math="1/x" /> derivation.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`\frac{1}{\cos(x+d)} = \frac{1}{\cos x - \sin x \, d}`} />. Multiply top
						and bottom by <Katex math={r`\cos x + \sin x \, d`} />:
					</p>
					<Katex
						math={r`= \frac{\cos x + \sin x \, d}{\cos^2 x - \sin^2 x \, d^2} = \frac{\cos x + \sin x \, d}{\cos^2 x} = \sec x + \frac{\sin x}{\cos^2 x} d`}
						display
					/>
					<p>So <Katex math={r`\sec'(x) = \sec x \tan x`} /> ✓</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p>
					<strong>Challenge.</strong> What is <Katex math={r`(2^x)'`} />? (Use the general
					exponential derivative.)
				</p>
				{#snippet solution()}<p><Katex math={r`(2^x)' = 2^x \ln 2`} /> ✓</p>{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p>
					<strong>Exploration.</strong> The tangent line to <Katex math="f(x)" /> at <Katex
						math="x = a"
					/> gives a "linear approximation": <Katex
						math={r`f(a + \Delta x) \approx f(a) + f'(a) \cdot \Delta x`}
					/> for small <Katex math={r`\Delta x`} />. Use this to estimate <Katex
						math={r`\sqrt{4.01}`}
					/> without a calculator. (Hint: <Katex math={r`f(x) = \sqrt{x}`} />, <Katex
						math="a = 4"
					/>, <Katex math={r`\Delta x = 0.01`} />.)
				</p>
				{#snippet solution()}<p>
						<Katex
							math={r`\sqrt{4.01} \approx \sqrt{4} + \frac{1}{2\sqrt{4}} \cdot 0.01 = 2 + \frac{0.01}{4} = 2.0025`}
						/>. (Exact value: 2.002498...) The approximation is excellent!
					</p>{/snippet}
			</Exercise>
		</details>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>
				We can now differentiate individual functions. But what about products like <Katex
					math={r`x^2 \sin x`}
				/>, compositions like <Katex math={r`\sin(x^2)`} />, or quotients like <Katex
					math={r`\sin x / x`}
				/>? In the next chapter, we'll derive the product, chain, and quotient rules — and discover
				they're all just algebra with <Katex math="d^2 = 0" />.
			</p>
		</LookingAhead>

		<NextChapter href="ch3" title="Rules of Change and Local Models" number="3" />
	</div>
</section>
