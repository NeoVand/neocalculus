<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch7">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 7</span>
			<h2 class="chapter-title">Infinite Series</h2>
			<div class="chapter-epigraph">
				<blockquote>"The infinite series is the most noble of all the instruments which the human mind has constructed."</blockquote>
				<p class="epigraph-attr">— Leonhard Euler</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION 1: Motivating Problem ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The question</h3>
			<p>How do you compute <Katex math={r`\sin(0.1)`} /> without a calculator?</p>
			<p>You know that <Katex math={r`\sin(0) = 0`} /> and <Katex math={r`\sin(\pi/6) = 1/2`} />, but 0.1 isn't a "nice" angle. You can't look it up in a table of known values. Yet somehow, your calculator returns <Katex math={r`\sin(0.1) = 0.0998334\ldots`} /> instantly. How?</p>
			<p>The answer is one of the most powerful ideas in all of mathematics: <strong>represent a function as a polynomial</strong>. Polynomials are easy to evaluate — just addition and multiplication. And as we've already seen, in the nilpotent world every function <em>is</em> a polynomial. The question is how to extend this to the real numbers.</p>
			<p>This chapter tells the full story, starting from the exact nilpotent expansions we already know, building up to the infinite series of classical mathematics, and explaining exactly why — and when — those infinite series converge.</p>
		</div>

		<!-- ═══ SECTION 2: Review of D_n ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Higher-order infinitesimals: the sets <Katex math={r`D_n`} /></h3>
			<p>In Chapter 1 we met <Katex math={r`D = \{d \in \mathcal{R} : d^2 = 0\}`} />, the set of nilsquare infinitesimals. On <Katex math="D" />, every function is exactly linear: <Katex math={r`f(d) = f(0) + f'(0)\cdot d`} />. But we need more than linear — we want quadratics, cubics, and beyond.</p>
		</div>

		<Callout type="definition" title="The Nilpotent Sets D_n">
			<p>For each natural number <Katex math="n" />, define</p>
			<Katex math={r`D_n = \bigl\{d \in \mathcal{R} : d^{n+1} = 0\bigr\}`} display />
			<p>On <Katex math={r`D_n`} />, every function is <strong>uniquely</strong> determined by a polynomial of degree <Katex math={r`\leq n`} />:</p>
			<Katex math={r`f(d) = a_0 + a_1 d + a_2 d^2 + \cdots + a_n d^n`} display />
			<p>The series terminates exactly at degree <Katex math="n" /> because <Katex math={r`d^{n+1} = 0`} />.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>So <Katex math={r`D_1 = D`} /> gives linear expansions, <Katex math={r`D_2`} /> gives quadratic, <Katex math={r`D_3`} /> gives cubic, and so on. These sets are nested: <Katex math={r`D \subset D_2 \subset D_3 \subset \cdots`} />. Each one gives us a more detailed picture of the function.</p>
		</div>

		<!-- Nested neighborhoods figure -->
		<Figure number="7.1" caption="Nested infinitesimal neighborhoods: D ⊂ D₂ ⊂ D₃. On D, functions are linear. On D₂, quadratic. On D₃, cubic. Each gives an exact expansion.">
			<svg viewBox="0 0 460 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:460px">
				<!-- D₃: outermost -->
				<ellipse cx="210" cy="72" rx="195" ry="55" fill="rgba(168,85,247,0.03)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="5,3"/>
				<text x="408" y="32" font-size="11" font-family="Inter,sans-serif" fill="#a855f7">D₃: cubic</text>
				<!-- D₂: middle -->
				<ellipse cx="210" cy="72" rx="130" ry="42" fill="rgba(168,85,247,0.06)" stroke="#a855f7" stroke-width="1" stroke-dasharray="5,3"/>
				<text x="342" y="50" font-size="11" font-family="Inter,sans-serif" fill="#a855f7">D₂: quadratic</text>
				<!-- D: innermost -->
				<ellipse cx="210" cy="72" rx="65" ry="26" fill="rgba(168,85,247,0.12)" stroke="#a855f7" stroke-width="1.8"/>
				<text x="278" y="70" font-size="11" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">D: linear</text>
				<!-- center point -->
				<circle cx="210" cy="72" r="3.5" fill="#1a1a2e"/>
				<text x="210" y="115" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">0</text>
				<!-- annotations -->
				<text x="210" y="142" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94919b">each neighborhood gives an exact polynomial expansion</text>
			</svg>
		</Figure>

		<!-- ═══ SECTION 3: Deriving Taylor Coefficients ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Extracting Taylor coefficients</h3>
			<p>On <Katex math="D" />, we get the first derivative: <Katex math={r`f(x + d) = f(x) + f'(x)\cdot d`} />. But how do we extract the <em>second</em> derivative? We need to be more clever.</p>
			<p>The key idea: take <strong>two independent nilsquares</strong> <Katex math={r`d_1, d_2 \in D`} />. Each satisfies <Katex math={r`d_1^2 = 0`} /> and <Katex math={r`d_2^2 = 0`} />, but their product <Katex math={r`d_1 d_2`} /> need <em>not</em> be zero. The sum <Katex math={r`d_1 + d_2`} /> belongs to <Katex math={r`D_2`} /> (since <Katex math={r`(d_1 + d_2)^3 = 0`} />), but not to <Katex math="D" /> (since <Katex math={r`(d_1 + d_2)^2 = 2d_1 d_2 \neq 0`} />).</p>
			<p>Now expand <Katex math={r`f(x + d_1 + d_2)`} /> in two different ways:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Extracting the second derivative</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x + d_1 + d_2) = f(x) + f'(x)(d_1 + d_2) + \frac{f''(x)}{2}(d_1 + d_2)^2`} display /></div>
				<span class="step-note">expansion on <Katex math={r`D_2`} /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(d_1 + d_2)^2 = d_1^2 + 2d_1 d_2 + d_2^2 = 2d_1 d_2`} display /></div>
				<span class="step-note"><Katex math={r`d_1^2 = d_2^2 = 0`} /></span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f(x + d_1 + d_2) = f(x) + f'(x)(d_1 + d_2) + f''(x)\,d_1 d_2`} display /></div>
				<span class="step-note">the coefficient of <Katex math={r`d_1 d_2`} /> is exactly <Katex math={r`f''(x)`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is a beautiful result. The second derivative <Katex math={r`f''(x)`} /> appears as the <strong>coefficient of <Katex math={r`d_1 d_2`} /></strong> in the two-nilsquare expansion. No limits, no difference quotients of difference quotients — just algebra.</p>
			<p>The same idea extends to all orders. On <Katex math={r`D_n`} />, the coefficient of <Katex math={r`d^k/k!`} /> is <Katex math={r`f^{(k)}(x)`} />, giving us the complete Taylor expansion:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d) = \sum_{k=0}^{n} \frac{f^{(k)}(x)}{k!}\,d^k \quad\text{for } d \in D_n`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is <strong>exact</strong>, not an approximation. On <Katex math={r`D_n`} />, the function <em>is</em> its Taylor polynomial. The "remainder" is literally zero because <Katex math={r`d^{n+1} = 0`} />.</p>
		</div>

		<!-- ═══ SECTION 4: Key Expansions on D_n ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Building up: key expansions</h3>
			<p>Let's watch the Taylor formula in action. We'll expand several important functions on successively larger neighborhoods, seeing more terms appear each time.</p>
		</div>

		<!-- eˣ derivations -->
		<div class="neo-prose" use:reveal>
			<h4>The exponential <Katex math={r`e^x`} /></h4>
			<p>We already know that on <Katex math="D" />, <Katex math={r`e^d = 1 + d`} />. Let's see what happens on <Katex math={r`D_2`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">eᵈ on D₂</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{d_1 + d_2} = e^{d_1} \cdot e^{d_2}`} display /></div>
				<span class="step-note">exponential law</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= (1 + d_1)(1 + d_2)`} display /></div>
				<span class="step-note">each factor on <Katex math="D" /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= 1 + d_1 + d_2 + d_1 d_2`} display /></div>
				<span class="step-note">multiply out</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`e^d = 1 + d + \tfrac{1}{2}d^2 \quad\text{on } D_2`} display /></div>
				<span class="step-note">set <Katex math={r`d = d_1 + d_2`} />, use <Katex math={r`d_1 d_2 = \tfrac{1}{2}d^2`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The factor of <Katex math={r`\tfrac{1}{2}`} /> wasn't put in by hand — it <em>emerged</em> from the product <Katex math={r`(1+d_1)(1+d_2)`} />. This is how the <Katex math={r`k!`} /> denominators in the Taylor formula arise naturally from the nilpotent structure.</p>
			<p>Continuing to <Katex math={r`D_3`} /> (using three nilsquares <Katex math={r`d_1, d_2, d_3`} />):</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">eᵈ on D₃</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{d_1+d_2+d_3} = (1+d_1)(1+d_2)(1+d_3)`} display /></div>
				<span class="step-note">three factors on <Katex math="D" /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= 1 + (d_1{+}d_2{+}d_3) + (d_1 d_2{+}d_1 d_3{+}d_2 d_3) + d_1 d_2 d_3`} display /></div>
				<span class="step-note">expand</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`e^d = 1 + d + \tfrac{1}{2}d^2 + \tfrac{1}{6}d^3 \quad\text{on } D_3`} display /></div>
				<span class="step-note"><Katex math={r`\tfrac{1}{6}`} /> = three products from three nilsquares</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The pattern is unmistakable. On <Katex math={r`D_n`} />:</p>
		</div>

		<Callout type="key-idea" title="Exponential on D_n">
			<Katex math={r`e^d = 1 + d + \frac{d^2}{2!} + \frac{d^3}{3!} + \cdots + \frac{d^n}{n!} \quad\text{on } D_n`} display />
			<p>This is <strong>exact</strong>. The <Katex math={r`k!`} /> denominators arise naturally from counting the products of independent nilsquares.</p>
		</Callout>

		<!-- sin(x) derivation -->
		<div class="neo-prose" use:reveal>
			<h4>Sine and cosine</h4>
			<p>For <Katex math={r`\sin`} /> and <Katex math={r`\cos`} />, we use the addition formula. On <Katex math={r`D_2`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">sin(x + d) on D₂</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sin(x + d) = \sin(x)\cos(d) + \cos(x)\sin(d)`} display /></div>
				<span class="step-note">addition formula</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\cos(d) = 1 - \tfrac{1}{2}d^2, \quad \sin(d) = d`} display /></div>
				<span class="step-note">on <Katex math={r`D_2`} />: <Katex math={r`d^3 = 0`} /></span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\sin(x+d) = \sin(x) + \cos(x)\cdot d - \tfrac{1}{2}\sin(x)\cdot d^2`} display /></div>
				<span class="step-note">read off: <Katex math={r`\sin'(x) = \cos(x)`} />, <Katex math={r`\sin''(x) = -\sin(x)`} /></span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">cos(x + d) on D₂</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\cos(x + d) = \cos(x)\cos(d) - \sin(x)\sin(d)`} display /></div>
				<span class="step-note">addition formula</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\cos(x+d) = \cos(x) - \sin(x)\cdot d - \tfrac{1}{2}\cos(x)\cdot d^2`} display /></div>
				<span class="step-note"><Katex math={r`\cos'(x) = -\sin(x)`} />, <Katex math={r`\cos''(x) = -\cos(x)`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Setting <Katex math={r`x = 0`} /> and working on higher <Katex math={r`D_n`} />, the full pattern emerges. The derivatives cycle: <Katex math={r`\sin, \cos, -\sin, -\cos, \sin, \ldots`} /> This gives:</p>
		</div>

		<Callout type="key-idea" title="Sine and Cosine on D_n">
			<Katex math={r`\sin(d) = d - \frac{d^3}{3!} + \frac{d^5}{5!} - \cdots \quad\text{(odd terms only)}`} display />
			<Katex math={r`\cos(d) = 1 - \frac{d^2}{2!} + \frac{d^4}{4!} - \cdots \quad\text{(even terms only)}`} display />
			<p>On <Katex math={r`D_n`} />, each series terminates at degree <Katex math="n" />.</p>
		</Callout>

		<!-- Geometric / 1/(1-x) derivation -->
		<div class="neo-prose" use:reveal>
			<h4>The geometric function <Katex math={r`1/(1-x)`} /></h4>
			<p>This one is especially elegant. On <Katex math="D" />, we showed in Chapter 1 that <Katex math={r`1/(1-d) = 1+d`} /> using the conjugate trick. On <Katex math={r`D_2`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">1/(1 − d) on D₂</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\frac{1}{1-d} \cdot (1-d) = 1`} display /></div>
				<span class="step-note">definition of reciprocal</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\text{Try } \frac{1}{1-d} = 1 + d + d^2`} display /></div>
				<span class="step-note">guess and check</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(1 + d + d^2)(1-d) = 1 + d + d^2 - d - d^2 - \textcolor{#ef4444}{d^3}`} display /></div>
				<span class="step-note">expand, <Katex math={r`d^3 = 0`} /> on <Katex math={r`D_2`} /></span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`= 1 \quad\checkmark`} display /></div>
				<span class="step-note">so <Katex math={r`1/(1-d) = 1 + d + d^2`} /> on <Katex math={r`D_2`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>On <Katex math={r`D_n`} />, the same argument gives:</p>
			<Katex math={r`\frac{1}{1-d} = 1 + d + d^2 + \cdots + d^n \quad\text{on } D_n`} display />
			<p>The "geometric series" terminates exactly at degree <Katex math="n" />. No convergence questions arise — the higher powers simply vanish.</p>
		</div>

		<!-- ═══ SECTION 5: The Nilpotent-to-Classical Bridge (CLIMAX) ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The nilpotent-to-classical bridge</h3>
			<p>We've now seen that on <Katex math={r`D_n`} />, every function equals its Taylor polynomial of degree <Katex math="n" /> — exactly, with zero remainder. But here's the crucial question:</p>
			<p><strong>What happens when we evaluate these polynomials at real numbers instead of infinitesimals?</strong></p>
			<p>On <Katex math={r`D_2`} />, we have <Katex math={r`e^d = 1 + d + \tfrac{1}{2}d^2`} /> exactly. If we plug in the real number <Katex math={r`x = 0.1`} />, we get <Katex math={r`1 + 0.1 + 0.005 = 1.105`} />. The true value is <Katex math={r`e^{0.1} = 1.10517\ldots`} /> So the degree-2 polynomial is close, but not exact.</p>
			<p>On <Katex math={r`D_3`} />: <Katex math={r`1 + 0.1 + 0.005 + 0.000167 = 1.105167`} />. Closer.</p>
			<p>On <Katex math={r`D_4`} />: <Katex math={r`1 + 0.1 + 0.005 + 0.000167 + 0.0000042 = 1.1051709\ldots`} /> Even closer.</p>
			<p>Each time we move to a larger <Katex math={r`D_n`} />, the polynomial gains a term, and the real-number evaluation gets more accurate. The expansions <strong>stabilize</strong>: the coefficient of <Katex math={r`d^k`} /> is <Katex math={r`f^{(k)}(0)/k!`} /> regardless of which <Katex math={r`D_n`} /> we work on (as long as <Katex math={r`n \geq k`} />). So there's a natural limiting object:</p>
		</div>

		<Callout type="key-idea" title="The Nilpotent-to-Classical Bridge">
			<p>On <Katex math={r`D_n`} />, the Taylor formula <Katex math={r`f(d) = \sum_{k=0}^{n} \frac{f^{(k)}(0)}{k!}\,d^k`} /> is <strong>exact</strong>.</p>
			<p>As <Katex math={r`n \to \infty`} />, the <Katex math={r`D_n`} /> expansions stabilize term by term. For well-behaved functions, we recover the <strong>classical infinite series</strong>:</p>
			<Katex math={r`f(x) = \sum_{k=0}^{\infty} \frac{f^{(k)}(0)}{k!}\,x^k`} display />
			<p>The infinite series is the <strong>limit</strong> of the exact nilpotent polynomials.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is the central insight of the chapter. The classical Taylor series is not a separate idea we introduce out of nowhere — it is the <em>natural extension</em> of the exact nilpotent expansions we've been doing since Chapter 1. The nilpotent world gives us certainty (the expansion is exact), and the bridge to the classical world asks: "does that certainty survive the passage to real numbers?"</p>
			<p>For many functions — <Katex math={r`e^x`} />, <Katex math={r`\sin(x)`} />, <Katex math={r`\cos(x)`} /> — the answer is <strong>yes, everywhere</strong>. For others — like <Katex math={r`1/(1-x)`} /> — the answer is "yes, but only for <Katex math={r`|x| < 1`} />." Understanding this distinction is the work of the rest of the chapter.</p>
		</div>

		<!-- InlinePlot: eˣ vs Taylor approximations -->
		<InlinePlot
			fn={x => Math.exp(x)}
			domain={[-3, 3]}
			range={[-1, 10]}
			secondFn={x => 1 + x}
			caption="eˣ (solid) vs degree-1 Taylor polynomial 1 + x (dashed). On D, they are identical — but on the reals, they diverge quickly."
		/>

		<InlinePlot
			fn={x => Math.exp(x)}
			domain={[-3, 3]}
			range={[-1, 10]}
			secondFn={x => 1 + x + x*x/2}
			caption="eˣ (solid) vs degree-2 Taylor polynomial 1 + x + x²/2 (dashed). Better! The quadratic hugs the exponential longer."
		/>

		<InlinePlot
			fn={x => Math.exp(x)}
			domain={[-3, 3]}
			range={[-1, 10]}
			secondFn={x => 1 + x + x*x/2 + x*x*x/6 + x*x*x*x/24}
			caption="eˣ (solid) vs degree-4 Taylor polynomial (dashed). Now the approximation is excellent on [−2, 2]. Each new term from the D_n expansion buys more accuracy."
		/>

		<!-- ═══ SECTION: Worked Example — sin(x) to degree 5 ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Worked example: Taylor series for <Katex math={r`\sin(x)`} /> to degree 5</h3>
			<p>Let's carry out the full derivation of the <Katex math={r`\sin`} /> expansion on <Katex math={r`D_4`} /> (where <Katex math={r`d^5 = 0`} />). We work at <Katex math={r`x = 0`} /> and use the known derivatives of sine:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">sin(d) on D₄: full derivation</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sin^{(0)}(0) = 0, \quad \sin^{(1)}(0) = 1, \quad \sin^{(2)}(0) = 0, \quad \sin^{(3)}(0) = -1, \quad \sin^{(4)}(0) = 0`} display /></div>
				<span class="step-note">derivatives cycle: <Katex math={r`0, 1, 0, -1, 0, 1, \ldots`} /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sin(d) = \frac{0}{0!} + \frac{1}{1!}d + \frac{0}{2!}d^2 + \frac{-1}{3!}d^3 + \frac{0}{4!}d^4`} display /></div>
				<span class="step-note">Taylor formula on <Katex math={r`D_4`} /></span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\sin(d) = d - \frac{d^3}{6} \quad\text{on } D_4`} display /></div>
				<span class="step-note">only odd terms survive</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Going one step further to <Katex math={r`D_6`} /> (where <Katex math={r`d^7 = 0`} />) adds the next nonzero term: <Katex math={r`\sin^{(5)}(0) = 1`} />, giving us:</p>
			<Katex math={r`\sin(d) = d - \frac{d^3}{3!} + \frac{d^5}{5!} \quad\text{on } D_6`} display />
			<p>Now let's use this to estimate <Katex math={r`\sin(0.1)`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Estimating sin(0.1)</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\sin(0.1) \approx 0.1 - \frac{(0.1)^3}{6} + \frac{(0.1)^5}{120}`} display /></div>
				<span class="step-note">degree-5 polynomial at <Katex math={r`x = 0.1`} /></span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= 0.1 - 0.000\overline{16} + 0.0000000\overline{083}`} display /></div>
				<span class="step-note">evaluate each term</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\approx 0.0998334 \quad\text{(true value: } 0.09983341664\ldots\text{)}`} display /></div>
				<span class="step-note">accurate to 7 decimal places!</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Just three terms of the series give us seven correct decimal places. This is how your calculator computes <Katex math={r`\sin`} />: it evaluates a Taylor polynomial. The only difference is that in Neocalculus, we know <em>why</em> the polynomial works — it came from an exact expansion on <Katex math={r`D_n`} />.</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, the Taylor series must be <em>proved</em> to converge, and the remainder term must be <em>estimated</em>. In Neocalculus, the expansion on <Katex math={r`D_n`} /> is <strong>exact by axiom</strong> — convergence is guaranteed by the nilpotent structure, and the remainder is literally zero. No convergence tests are needed in the infinitesimal world. The question of convergence only arises when we leave <Katex math={r`D_n`} /> and evaluate at real numbers.</p>
		</SDGAdvantage>

		<!-- ═══ SECTION 6: Geometric Series ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The geometric series</h3>
			<p>The simplest infinite series is the <strong>geometric series</strong>. We've already seen it on <Katex math={r`D_n`} />:</p>
			<Katex math={r`\frac{1}{1-d} = 1 + d + d^2 + \cdots + d^n \quad\text{(exact on } D_n\text{)}`} display />
			<p>Passing through the nilpotent-to-classical bridge, we write:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{1}{1-x} = \sum_{k=0}^{\infty} x^k = 1 + x + x^2 + x^3 + \cdots`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>But does this work for real <Katex math="x" />? Let's check some values:</p>
			<p>At <Katex math={r`x = \tfrac{1}{2}`} />: <Katex math={r`1 + \tfrac{1}{2} + \tfrac{1}{4} + \tfrac{1}{8} + \cdots = 2`} />. And indeed <Katex math={r`1/(1-\tfrac{1}{2}) = 2`} />. Correct!</p>
			<p>At <Katex math={r`x = \tfrac{1}{3}`} />: <Katex math={r`1 + \tfrac{1}{3} + \tfrac{1}{9} + \tfrac{1}{27} + \cdots = \tfrac{3}{2}`} />. And <Katex math={r`1/(1-\tfrac{1}{3}) = \tfrac{3}{2}`} />. Correct again!</p>
			<p>But at <Katex math={r`x = 2`} />: <Katex math={r`1 + 2 + 4 + 8 + 16 + \cdots`} /> The terms keep growing. The sum explodes to infinity. Yet <Katex math={r`1/(1-2) = -1`} />, which is perfectly finite. <strong>The series diverges</strong> — it gives no useful information at <Katex math={r`x = 2`} />.</p>
		</div>

		<Callout type="warning" title="When the Bridge Fails">
			<p>At <Katex math={r`x = 2`} />, the geometric series <Katex math={r`1 + 2 + 4 + 8 + \cdots`} /> diverges — the partial sums grow without bound. The function <Katex math={r`1/(1-x)`} /> is perfectly well-defined at <Katex math={r`x = 2`} />, but the series representation breaks down.</p>
			<p>On <Katex math={r`D_n`} />, there was no problem: <Katex math={r`d^{n+1} = 0`} /> kills all higher terms automatically. The trouble only appears for real <Katex math="x" />, where <Katex math={r`x^{n+1}`} /> does <em>not</em> vanish.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>What separates <Katex math={r`x = \tfrac{1}{2}`} /> (works) from <Katex math={r`x = 2`} /> (fails)? The answer is the <strong>convergence criterion</strong>:</p>
		</div>

		<Callout type="theorem" title="Geometric Series Convergence">
			<p>The geometric series <Katex math={r`\sum_{k=0}^{\infty} x^k`} /> converges to <Katex math={r`\frac{1}{1-x}`} /> if and only if <Katex math={r`|x| < 1`} />.</p>
			<p>When <Katex math={r`|x| \geq 1`} />, the terms <Katex math={r`x^k`} /> do not shrink to zero, and the series diverges.</p>
		</Callout>

		<!-- ═══ SECTION 7: Convergence and Radius ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Convergence and the radius of convergence</h3>
			<p>The geometric series converges for <Katex math={r`|x| < 1`} /> and diverges for <Katex math={r`|x| > 1`} />. This boundary, <Katex math={r`|x| = 1`} />, is called the <strong>radius of convergence</strong>.</p>
			<p>Every power series <Katex math={r`\sum a_k x^k`} /> has a radius of convergence <Katex math="R" />:</p>
		</div>

		<Callout type="definition" title="Radius of Convergence">
			<p>For a power series <Katex math={r`\sum_{k=0}^{\infty} a_k x^k`} />, there exists a number <Katex math={r`R \in [0, \infty]`} /> such that:</p>
			<ul>
				<li>The series <strong>converges</strong> (absolutely) for <Katex math={r`|x| < R`} /></li>
				<li>The series <strong>diverges</strong> for <Katex math={r`|x| > R`} /></li>
			</ul>
			<p><Katex math="R" /> is called the <strong>radius of convergence</strong>.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Different functions have different radii:</p>
			<ul>
				<li><Katex math={r`e^x = \sum x^k/k!`} /> has <Katex math={r`R = \infty`} /> — it converges for all real <Katex math="x" /></li>
				<li><Katex math={r`\sin(x)`} /> and <Katex math={r`\cos(x)`} /> also have <Katex math={r`R = \infty`} /></li>
				<li><Katex math={r`1/(1-x) = \sum x^k`} /> has <Katex math={r`R = 1`} /></li>
				<li><Katex math={r`\ln(1+x) = \sum (-1)^{k+1} x^k/k`} /> has <Katex math={r`R = 1`} /></li>
			</ul>
			<p>Notice: on <Katex math={r`D_n`} />, every series converges — the radius of convergence is irrelevant because <Katex math={r`d^{n+1} = 0`} /> kills everything. The radius of convergence is purely a phenomenon of the <strong>real</strong> world, arising when <Katex math={r`x^{n+1}`} /> fails to vanish.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<p>A beautiful example: the function <Katex math={r`1/(1+x^2)`} /> is perfectly smooth everywhere on the real line. Yet its Taylor series</p>
			<Katex math={r`\frac{1}{1+x^2} = 1 - x^2 + x^4 - x^6 + \cdots`} display />
			<p>converges only for <Katex math={r`|x| < 1`} />. Why? Because in the <em>complex</em> plane, <Katex math={r`1/(1+z^2)`} /> has poles at <Katex math={r`z = \pm i`} />, which are at distance 1 from the origin. The radius of convergence is determined by the nearest singularity — even a singularity in the complex plane constrains convergence on the real line.</p>
		</div>

		<DigDeeper title="Why does the complex plane matter?">
			<p>A power series <Katex math={r`\sum a_k z^k`} /> converges inside a disk of radius <Katex math="R" /> centered at the origin in the complex plane. The real line is just a slice through this disk. So even if a function looks perfectly well-behaved for real <Katex math="x" />, a singularity at a complex point <Katex math={r`z = a + bi`} /> with <Katex math={r`|z| = R`} /> limits the radius of convergence to <Katex math="R" />.</p>
			<p>For <Katex math={r`1/(1+x^2) = 1/(1-(-x^2))`} />, the geometric series has <Katex math={r`R = 1`} /> because the function blows up at <Katex math={r`x^2 = -1`} />, i.e., <Katex math={r`x = \pm i`} />. These complex singularities are invisible on the real line, but they cast a shadow on convergence.</p>
		</DigDeeper>

		<!-- ═══ SECTION 8: Error Estimation ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Error estimation: the Taylor remainder</h3>
			<p>When we truncate a Taylor series at degree <Katex math="n" /> and evaluate at a real point <Katex math="x" />, we get an approximation, not an exact answer. How big is the error?</p>
		</div>

		<Callout type="theorem" title="Taylor Remainder Bound">
			<p>If <Katex math="f" /> has continuous derivatives up to order <Katex math={r`n+1`} />, then the error in the degree-<Katex math="n" /> Taylor polynomial centered at <Katex math="a" /> satisfies</p>
			<Katex math={r`\bigl|f(x) - T_n(x)\bigr| \leq \frac{M}{(n+1)!}\,|x - a|^{n+1}`} display />
			<p>where <Katex math={r`M = \max_{t \in [a,x]} |f^{(n+1)}(t)|`} />.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Let's apply this to our <Katex math={r`\sin(0.1)`} /> estimate. We used the degree-5 polynomial, so the error involves the 6th derivative. But <Katex math={r`\sin^{(6)}(x) = -\sin(x)`} />, so <Katex math={r`|f^{(6)}(t)| \leq 1`} /> for all <Katex math="t" />. Therefore:</p>
			<Katex math={r`\text{error} \leq \frac{1}{6!}\,(0.1)^6 = \frac{10^{-6}}{720} \approx 1.4 \times 10^{-9}`} display />
			<p>The error is less than two billionths. Three terms of the Taylor series give <em>nine</em> correct decimal places for <Katex math={r`\sin(0.1)`} />.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice the contrast with the nilpotent setting: on <Katex math={r`D_n`} />, the remainder is <strong>zero</strong> — the expansion is exact. On the real line, the remainder is nonzero but bounded, and the bound shrinks as <Katex math="n" /> grows (for convergent series). The Taylor remainder formula quantifies exactly how much accuracy we lose when we leave the nilpotent world.</p>
		</div>

		<!-- ═══ SECTION 9: Binomial Series ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The binomial series</h3>
			<p>In Chapter 1 we saw that <Katex math={r`(1+d)^n = 1 + nd`} /> on <Katex math="D" /> for any integer <Katex math="n" />. But what about <em>non-integer</em> exponents? What is <Katex math={r`(1+d)^{1/2}`} /> or <Katex math={r`(1+d)^{-1}`} />?</p>
			<p>On <Katex math={r`D_n`} />, we can use the <strong>generalized binomial theorem</strong>. For any exponent <Katex math={r`\alpha`} /> (integer or not):</p>
		</div>

		<Callout type="key-idea" title="The Binomial Series">
			<Katex math={r`(1+d)^\alpha = \sum_{k=0}^{n} \binom{\alpha}{k} d^k \quad\text{on } D_n`} display />
			<p>where the <strong>generalized binomial coefficient</strong> is</p>
			<Katex math={r`\binom{\alpha}{k} = \frac{\alpha(\alpha-1)(\alpha-2)\cdots(\alpha-k+1)}{k!}`} display />
			<p>For real <Katex math="x" />, this series converges when <Katex math={r`|x| < 1`} />.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: (1 + d)^{1/2} on D₂</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\binom{1/2}{0} = 1, \quad \binom{1/2}{1} = \tfrac{1}{2}, \quad \binom{1/2}{2} = \frac{\tfrac{1}{2}(\tfrac{1}{2}-1)}{2!} = -\tfrac{1}{8}`} display /></div>
				<span class="step-note">generalized binomial coefficients</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\sqrt{1+d} = 1 + \tfrac{1}{2}d - \tfrac{1}{8}d^2 \quad\text{on } D_2`} display /></div>
				<span class="step-note">exact on <Katex math={r`D_2`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Passing to the classical series: <Katex math={r`\sqrt{1+x} = 1 + \tfrac{1}{2}x - \tfrac{1}{8}x^2 + \tfrac{1}{16}x^3 - \cdots`} /> for <Katex math={r`|x| < 1`} />.</p>
			<p>This gives us a way to compute square roots of numbers near 1. For instance, <Katex math={r`\sqrt{1.1} \approx 1 + \tfrac{1}{2}(0.1) - \tfrac{1}{8}(0.01) = 1.04875`} />, which is correct to four decimal places (the true value is <Katex math={r`1.04881\ldots`} />).</p>
		</div>

		<!-- ═══ SECTION 10: Applications of Series ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Applications: integrals we couldn't do before</h3>
			<p>One of the most important applications of series is computing integrals that have no elementary antiderivative. The strategy: replace the integrand by its Taylor series, then integrate term by term.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Computing the Gaussian integral via series</div>
			<div class="step">
				<div class="step-math"><Katex math={r`e^{-x^2} = 1 - x^2 + \frac{x^4}{2!} - \frac{x^6}{3!} + \cdots`} display /></div>
				<span class="step-note">substitute <Katex math={r`-x^2`} /> into the exponential series</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\int_0^1 e^{-x^2}\,dx = \int_0^1 \left(1 - x^2 + \frac{x^4}{2} - \frac{x^6}{6} + \cdots\right) dx`} display /></div>
				<span class="step-note">integrate term by term</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= \left[x - \frac{x^3}{3} + \frac{x^5}{10} - \frac{x^7}{42} + \frac{x^9}{216} - \cdots\right]_0^1`} display /></div>
				<span class="step-note">each term integrates as a power</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`= 1 - \frac{1}{3} + \frac{1}{10} - \frac{1}{42} + \frac{1}{216} - \cdots \approx 0.7468`} display /></div>
				<span class="step-note">true value: <Katex math={r`0.74682\ldots`} /></span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The integral <Katex math={r`\int_0^1 e^{-x^2}\,dx`} /> has no closed-form antiderivative — you cannot express it using elementary functions. But the series gives us its value to any desired accuracy. This is a standard technique in both pure and applied mathematics, and it is intimately connected to the Gaussian probability distribution.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Computing <Katex math={r`\pi`} /> from a series</h4>
			<p>Here is another beautiful application. We know that <Katex math={r`\arctan(1) = \pi/4`} />. The Taylor series for <Katex math={r`\arctan(x)`} /> is:</p>
			<Katex math={r`\arctan(x) = x - \frac{x^3}{3} + \frac{x^5}{5} - \frac{x^7}{7} + \cdots \quad\text{for } |x| \leq 1`} display />
			<p>Setting <Katex math={r`x = 1`} />:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \frac{1}{7} + \frac{1}{9} - \cdots`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is the <strong>Leibniz formula for <Katex math={r`\pi`} /></strong>. It converges very slowly — you need millions of terms for a few decimal places — but it is conceptually stunning: the number <Katex math={r`\pi`} />, which comes from geometry, equals an infinite sum of reciprocals of odd numbers.</p>
		</div>

		<!-- ═══ Worked Example: Geometric Series Divergence ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>When series go wrong: the geometric series at <Katex math={r`x = 2`} /></h3>
			<p>Let's examine the geometric series <Katex math={r`\sum x^k`} /> at <Katex math={r`x = 2`} /> in detail to see exactly where the nilpotent-to-classical bridge fails.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Geometric series at x = 2: what goes wrong</div>
			<div class="step">
				<div class="step-math"><Katex math={r`S_1 = 1 + 2 = 3`} display /></div>
				<span class="step-note">partial sum, degree 1</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`S_2 = 1 + 2 + 4 = 7`} display /></div>
				<span class="step-note">partial sum, degree 2</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`S_5 = 1 + 2 + 4 + 8 + 16 + 32 = 63`} display /></div>
				<span class="step-note">partial sum, degree 5</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`S_n = 2^{n+1} - 1 \to \infty \quad\text{as } n \to \infty`} display /></div>
				<span class="step-note">but <Katex math={r`1/(1-2) = -1`} /> is finite!</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>On <Katex math={r`D_n`} />, we'd have <Katex math={r`d^{n+1} = 0`} />, so the sum <Katex math={r`1 + d + d^2 + \cdots + d^n`} /> would give exactly <Katex math={r`1/(1-d)`} />. The nilpotent structure enforces termination. But for <Katex math={r`x = 2`} />, the terms <Katex math={r`2^k`} /> grow without bound, and no amount of adding can reach the true value of <Katex math={r`-1`} />.</p>
			<p>This is the deepest lesson about convergence: <strong>the nilpotent world is automatically convergent. The real world requires conditions.</strong></p>
		</div>

		<!-- ═══ HISTORY BOX ═══ -->
		<HistoryBox name="Leonhard Euler" years="1707–1783">
			<p>Euler was the undisputed master of infinite series. He computed the sum <Katex math={r`1 + \tfrac{1}{4} + \tfrac{1}{9} + \tfrac{1}{16} + \cdots = \pi^2/6`} /> (the "Basel problem"), discovered the relationship <Katex math={r`e^{i\theta} = \cos\theta + i\sin\theta`} /> connecting exponentials to trigonometry, and manipulated series with breathtaking fluency.</p>
			<p>Euler freely used divergent series — he would write <Katex math={r`1 + 2 + 4 + 8 + \cdots = -1`} /> and use it to derive correct results. His calculations often worked despite lacking rigorous foundations. From the SDG perspective, Euler was computing on <Katex math={r`D_n`} /> where his manipulations are exact, and extending the results beyond their formal domain. Modern summability theory has vindicated many of his "divergent" computations.</p>
		</HistoryBox>

		<!-- ═══ EXERCISES ═══ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises</summary>

			<Exercise number={1}>
				<p><strong>Warm-up.</strong> On <Katex math={r`D_2`} /> (where <Katex math={r`d^3 = 0`} />), expand <Katex math={r`\sin(d)`} /> and <Katex math={r`\cos(d)`} />.</p>
				{#snippet solution()}<p><Katex math={r`\sin(d) = d`} /> (the <Katex math={r`d^3/3!`} /> term vanishes since <Katex math={r`d^3 = 0`} />). <Katex math={r`\cos(d) = 1 - d^2/2`} /> (now we keep the <Katex math={r`d^2`} /> term, but <Katex math={r`d^4/4!`} /> vanishes).</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Compute the Taylor expansion of <Katex math={r`e^d`} /> on <Katex math={r`D_2`} /> by multiplying <Katex math={r`(1+d_1)(1+d_2)`} /> for two nilsquares <Katex math={r`d_1, d_2`} /> with <Katex math={r`d = d_1 + d_2`} />. Verify that you get <Katex math={r`1 + d + d^2/2`} />.</p>
				{#snippet solution()}<p><Katex math={r`(1+d_1)(1+d_2) = 1 + d_1 + d_2 + d_1 d_2 = 1 + d + d_1 d_2`} />. Since <Katex math={r`d^2 = (d_1+d_2)^2 = 2d_1 d_2`} />, we get <Katex math={r`d_1 d_2 = d^2/2`} />. So <Katex math={r`e^d = 1 + d + d^2/2`} /> on <Katex math={r`D_2`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Find the sum of the geometric series <Katex math={r`1 + \frac{1}{3} + \frac{1}{9} + \frac{1}{27} + \cdots`} /></p>
				{#snippet solution()}<p>This is <Katex math={r`\sum_{k=0}^{\infty} (1/3)^k = \frac{1}{1 - 1/3} = \frac{3}{2}`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p><strong>Core.</strong> Compute the Taylor expansion of <Katex math={r`\ln(1+d)`} /> on <Katex math={r`D_2`} /> by using the fact that <Katex math={r`\ln'(1+x) = 1/(1+x)`} /> and <Katex math={r`\ln''(1+x) = -1/(1+x)^2`} />.</p>
				{#snippet solution()}<p>At <Katex math={r`x = 0`} />: <Katex math={r`\ln(1) = 0`} />, <Katex math={r`\ln'(1) = 1`} />, <Katex math={r`\ln''(1) = -1`} />. So <Katex math={r`\ln(1+d) = 0 + 1\cdot d + \frac{-1}{2}d^2 = d - \frac{d^2}{2}`} /> on <Katex math={r`D_2`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p><strong>Core.</strong> Compute the Taylor expansion of <Katex math={r`\arctan(d)`} /> on <Katex math={r`D_2`} /> using <Katex math={r`\arctan'(x) = 1/(1+x^2)`} /> and <Katex math={r`\arctan''(x) = -2x/(1+x^2)^2`} />.</p>
				{#snippet solution()}<p>At <Katex math={r`x = 0`} />: <Katex math={r`\arctan(0) = 0`} />, <Katex math={r`\arctan'(0) = 1`} />, <Katex math={r`\arctan''(0) = 0`} />. So <Katex math={r`\arctan(d) = d`} /> on <Katex math={r`D_2`} />. (The first correction term is <Katex math={r`-d^3/3`} />, which appears on <Katex math={r`D_3`} />.)</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Use the degree-2 Taylor polynomial for <Katex math={r`\cos(x)`} /> to estimate <Katex math={r`\cos(0.1)`} />. How close is your answer to the true value <Katex math={r`0.99500417\ldots`} />?</p>
				{#snippet solution()}<p><Katex math={r`\cos(0.1) \approx 1 - (0.1)^2/2 = 1 - 0.005 = 0.995`} />. The error is <Katex math={r`|0.995 - 0.99500417| \approx 4.2 \times 10^{-6}`} />, so the degree-2 polynomial gives five correct decimal places.</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Core.</strong> Use the degree-4 Taylor polynomial to estimate <Katex math={r`e^{0.5}`} />. Compare with the true value <Katex math={r`1.64872\ldots`} /></p>
				{#snippet solution()}<p><Katex math={r`e^{0.5} \approx 1 + 0.5 + \frac{0.25}{2} + \frac{0.125}{6} + \frac{0.0625}{24} = 1 + 0.5 + 0.125 + 0.02083 + 0.00260 = 1.64844`} />. The error is about <Katex math={r`0.00028`} />, which is less than three hundredths of a percent.</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p><strong>Core.</strong> Find the radius of convergence of the Taylor series for <Katex math={r`1/(1+x^2)`} />. <em>Hint:</em> write it as <Katex math={r`1/(1-(-x^2))`} /> and use the geometric series.</p>
				{#snippet solution()}<p>Writing <Katex math={r`1/(1+x^2) = 1/(1-(-x^2)) = \sum_{k=0}^{\infty} (-x^2)^k = \sum_{k=0}^{\infty} (-1)^k x^{2k}`} />. The geometric series converges when <Katex math={r`|-x^2| < 1`} />, i.e., <Katex math={r`|x| < 1`} />. So the radius of convergence is <Katex math={r`R = 1`} />. (This is because <Katex math={r`1/(1+z^2)`} /> has poles at <Katex math={r`z = \pm i`} />, at distance 1 from the origin.)</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> Expand <Katex math={r`(1+x)^{1/2}`} /> to degree 3 using the generalized binomial theorem. Evaluate at <Katex math={r`x = 0.21`} /> to approximate <Katex math={r`\sqrt{1.21}`} />.</p>
				{#snippet solution()}<p>We need <Katex math={r`\binom{1/2}{k}`} /> for <Katex math={r`k = 0, 1, 2, 3`} />:
				<Katex math={r`\binom{1/2}{0} = 1`} />, <Katex math={r`\binom{1/2}{1} = \tfrac{1}{2}`} />, <Katex math={r`\binom{1/2}{2} = -\tfrac{1}{8}`} />, <Katex math={r`\binom{1/2}{3} = \tfrac{1}{16}`} />.
				So <Katex math={r`\sqrt{1+x} \approx 1 + \tfrac{1}{2}x - \tfrac{1}{8}x^2 + \tfrac{1}{16}x^3`} />.
				At <Katex math={r`x = 0.21`} />: <Katex math={r`1 + 0.105 - 0.005513 + 0.000579 = 1.100066`} />. The true value is <Katex math={r`\sqrt{1.21} = 1.1`} />, so the error is about <Katex math={r`0.000066`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Challenge.</strong> As <Katex math={r`n \to \infty`} />, what happens to the <Katex math={r`D_n`} /> expansion of a function <Katex math={r`f`} />? Explain in your own words how the exact nilpotent polynomials "converge" to the classical Taylor series.</p>
				{#snippet solution()}<p>On <Katex math={r`D_n`} />, <Katex math={r`f(d) = \sum_{k=0}^{n} \frac{f^{(k)}(0)}{k!} d^k`} /> is exact. As <Katex math={r`n`} /> increases, each expansion includes all previous terms plus one more. The coefficient of <Katex math={r`d^k`} /> stabilizes to <Katex math={r`f^{(k)}(0)/k!`} /> once <Katex math={r`n \geq k`} />. In the limit, we get the formal power series <Katex math={r`\sum_{k=0}^{\infty} \frac{f^{(k)}(0)}{k!} x^k`} />, which is the classical Taylor series. Whether this series converges at a real point <Katex math={r`x`} /> depends on the function — but the <em>coefficients</em> are determined by the nilpotent world, where every expansion is exact.</p>{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p><strong>Challenge.</strong> Compute <Katex math={r`\int_0^{0.5} \sin(x^2)\,dx`} /> to three decimal places using the Taylor series for <Katex math={r`\sin`} />.</p>
				{#snippet solution()}<p>Replace <Katex math={r`\sin(x^2)`} /> by its Taylor series:
				<Katex math={r`\sin(x^2) = x^2 - \frac{x^6}{3!} + \frac{x^{10}}{5!} - \cdots`} display />
				Integrate term by term from 0 to 0.5:
				<Katex math={r`\int_0^{0.5} \sin(x^2)\,dx = \left[\frac{x^3}{3} - \frac{x^7}{7 \cdot 6} + \frac{x^{11}}{11 \cdot 120} - \cdots \right]_0^{0.5}`} display />
				<Katex math={r`= \frac{0.125}{3} - \frac{0.0078125}{42} + \frac{0.000488}{1320} - \cdots`} display />
				<Katex math={r`= 0.04167 - 0.00019 + 0.0000004 - \cdots \approx 0.04148`} display />
				The first two terms already give three correct decimal places: <Katex math={r`\approx 0.041`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Challenge.</strong> Use the Taylor expansion of <Katex math={r`e^d`} /> on <Katex math={r`D_2`} /> to verify that <Katex math={r`(e^x)'' = e^x`} />. Then repeat on <Katex math={r`D_3`} /> to verify <Katex math={r`(e^x)''' = e^x`} />.</p>
				{#snippet solution()}<p>On <Katex math={r`D_2`} />: <Katex math={r`e^{x+d} = e^x \cdot e^d = e^x(1 + d + d^2/2) = e^x + e^x\cdot d + \frac{e^x}{2}\cdot d^2`} />. By the Taylor formula, the coefficient of <Katex math={r`d^2/2`} /> is <Katex math={r`f''(x)/2`} />, so <Katex math={r`f''(x) = e^x`} />.</p>
				<p>On <Katex math={r`D_3`} />: <Katex math={r`e^{x+d} = e^x(1 + d + d^2/2 + d^3/6)`} />. The coefficient of <Katex math={r`d^3/6`} /> is <Katex math={r`e^x/6 = f'''(x)/3!`} />, so <Katex math={r`f'''(x) = e^x`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p><strong>Exploration.</strong> Euler boldly wrote <Katex math={r`1 - 1 + 1 - 1 + 1 - \cdots = \frac{1}{2}`} />, reasoning that this is the geometric series <Katex math={r`1/(1-x)`} /> at <Katex math={r`x = -1`} />. On <Katex math={r`D_n`} />, compute <Katex math={r`1/(1-(-1))`} /> directly. Is the expansion on <Katex math={r`D_n`} /> valid? What does this tell us about Euler's claim?</p>
				{#snippet solution()}<p>On <Katex math={r`D_n`} />, the expansion <Katex math={r`1/(1-d) = 1 + d + d^2 + \cdots + d^n`} /> is valid for <Katex math={r`d \in D_n`} />, and the value <Katex math={r`x = -1`} /> is <em>not</em> in any <Katex math={r`D_n`} /> (it's a standard real number, not a nilpotent). The expansion is only exact for nilpotent inputs. Euler's equation is formally valid in certain summability methods (Cesàro, Abel) but represents an assignment of a value to a divergent series, not a convergent sum in the usual sense. The SDG perspective clarifies: the formula is exact on <Katex math={r`D_n`} />, but crossing the bridge to <Katex math={r`x = -1`} /> requires extending the notion of "sum."</p>{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p><strong>Exploration.</strong> The Taylor series for <Katex math={r`e^x`} /> converges for all <Katex math={r`x`} />, while the geometric series <Katex math={r`1/(1-x)`} /> converges only for <Katex math={r`|x| < 1`} />. Both are exact on <Katex math={r`D_n`} />. What property of the function determines whether its Taylor series converges everywhere? (Think about what happens to the function for large <Katex math={r`|x|`} /> and where the function has singularities.)</p>
				{#snippet solution()}<p>The radius of convergence equals the distance to the nearest singularity (in the complex plane). The function <Katex math={r`e^x`} /> is entire — it has no singularities anywhere, not even in the complex plane — so its radius of convergence is <Katex math={r`\infty`} />. The function <Katex math={r`1/(1-x)`} /> has a pole at <Katex math={r`x = 1`} />, at distance 1 from the center of expansion, so <Katex math={r`R = 1`} />. On <Katex math={r`D_n`} />, singularities don't matter because the nilpotent structure forces termination, but in the real/complex world, singularities determine the reach of the series.</p>{/snippet}
			</Exercise>
		</details>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li><strong><Katex math={r`D_n`} /> neighborhoods:</strong> <Katex math={r`D_n = \{d : d^{n+1} = 0\}`} />. On <Katex math={r`D_n`} />, every function equals its Taylor polynomial of degree <Katex math="n" /> exactly.</li>
				<li><strong>Extracting derivatives:</strong> The <Katex math="k" />th derivative of <Katex math="f" /> at <Katex math="x" /> equals <Katex math={r`k!`} /> times the coefficient of <Katex math={r`d^k`} /> in the expansion of <Katex math={r`f(x+d)`} /> on <Katex math={r`D_n`} />.</li>
				<li><strong>The nilpotent-to-classical bridge:</strong> As <Katex math={r`n \to \infty`} />, the exact <Katex math={r`D_n`} /> expansions stabilize into the classical Taylor series <Katex math={r`\sum f^{(k)}(a) x^k / k!`} />.</li>
				<li><strong>Convergence:</strong> On <Katex math={r`D_n`} />, convergence is automatic. For real <Katex math="x" />, convergence depends on the <strong>radius of convergence</strong> <Katex math="R" />, determined by the nearest singularity in the complex plane.</li>
				<li><strong>Error estimation:</strong> Truncating at degree <Katex math="n" /> gives error bounded by <Katex math={r`M|x-a|^{n+1}/(n+1)!`} />.</li>
				<li><strong>Key series:</strong> <Katex math={r`e^x`} />, <Katex math={r`\sin x`} />, <Katex math={r`\cos x`} /> converge everywhere; <Katex math={r`1/(1-x)`} />, <Katex math={r`\ln(1+x)`} />, <Katex math={r`(1+x)^\alpha`} /> converge for <Katex math={r`|x| < 1`} />.</li>
				<li><strong>Applications:</strong> Series let us compute integrals without antiderivatives, approximate function values, and even compute <Katex math={r`\pi`} />.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>We've seen how Taylor series turn functions into polynomials — finite on <Katex math={r`D_n`} />, infinite on <Katex math={r`\mathbb{R}`} />. In the next chapter, we'll put all the tools of Neocalculus to work on <strong>physical problems</strong>: modeling motion, growth, oscillation, and change. The series from this chapter will be essential for solving differential equations that describe the real world.</p>
		</LookingAhead>

		<NextChapter href="ch8" title="Modeling the Physical World" number="8" />
	</div>
</section>
