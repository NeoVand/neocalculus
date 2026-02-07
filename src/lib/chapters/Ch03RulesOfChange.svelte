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
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch3">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 3</span>
			<h2 class="chapter-title">The Rules of Change</h2>
			<p class="chapter-tagline">Product, chain, quotient rules, implicit differentiation, and higher derivatives — all from pure algebra.</p>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ OPENING NARRATIVE ═══ -->
		<div class="neo-prose" use:reveal>
			<p>In Chapter 2, we learned how to differentiate individual functions — polynomials, trig, exponentials, logarithms — each by expanding <Katex math="f(x+d)" /> and reading off the coefficient of <span class="d-highlight">d</span>. But real-world functions are rarely that simple. They are <em>products</em> like revenue = price × quantity, <em>compositions</em> like the temperature of a moving particle, <em>quotients</em> like efficiency ratios.</p>
			<p>Now we learn combinations — and discover that the rules for differentiating them are just algebra with <Katex math="d^2 = 0" />. No clever tricks, no limit arguments, no epsilon-delta gymnastics. Just multiply out and drop <Katex math="d^2" />.</p>
		</div>

		<!-- ═══ MICROCANCELLATION RECAP ═══ -->
		<Callout type="key-idea" title="Recall: Microcancellation">
			<p>In Chapter 1 we introduced a principle we use constantly: if <Katex math={r`a \cdot d = b \cdot d`} /> for all infinitesimal <span class="d-highlight">d</span>, then <Katex math="a = b" />. We are <strong>not</strong> dividing by <Katex math="d" /> — we are using the <em>uniqueness</em> guaranteed by the Kock-Lawvere axiom. The slope equation <Katex math={r`f(x+d) = f(x) + s \cdot d`} /> has a <em>unique</em> slope <Katex math="s" />, so if two expressions both serve as the coefficient of <Katex math="d" />, they must be equal.</p>
		</Callout>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: THE PRODUCT RULE                      -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>The Product Rule</h3>
			<p>Suppose we know the derivatives of <Katex math="f" /> and <Katex math="g" /> individually. What is the derivative of their product <Katex math="fg" />? The answer comes from literally multiplying out two slope equations.</p>
		</div>

		<!-- Product Rule Rectangle Figure -->
		<Figure number="3.1" caption="Expanding the product (f+f'd)(g+g'd). The pink rectangle has area f'g'd² = 0 — it vanishes.">
			<svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:300px">
				<rect x="30" y="30" width="170" height="120" fill="#f0f7ff" stroke="#3b82f6" stroke-width="1.5"/>
				<rect x="200" y="30" width="50" height="120" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
				<rect x="30" y="150" width="170" height="35" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
				<rect x="200" y="150" width="50" height="35" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,2"/>
				<text x="115" y="95" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#2563eb" font-style="italic">fg</text>
				<text x="225" y="95" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#059669" font-style="italic">f·g'd</text>
				<text x="115" y="172" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#059669" font-style="italic">f'·g·d</text>
				<text x="225" y="172" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#ef4444" font-weight="600">= 0</text>
				<!-- dimension labels -->
				<text x="115" y="20" text-anchor="middle" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e">f</text>
				<text x="225" y="20" text-anchor="middle" font-size="11" font-family="Crimson Pro,serif" fill="#a855f7">f'd</text>
				<text x="18" y="95" text-anchor="middle" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e">g</text>
				<text x="18" y="168" text-anchor="middle" font-size="11" font-family="Crimson Pro,serif" fill="#a855f7">g'd</text>
			</svg>
		</Figure>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Product Rule — (fg)' = f'g + fg'</div>
			<div class="step"><div class="step-math"><Katex math={r`(fg)(x+d) = [f + f'\!d][g + g'\!d]`} display /></div><span class="step-note">slope equation on each</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= fg + f'g\,d + fg'\,d + \textcolor{#ef4444}{f'g'\,d^2}`} display /></div><span class="step-note">multiply out</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= fg + (f'g + fg')\,d`} display /></div><span class="step-note">d² = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math="(fg)' = f'g + fg'" display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Look at Figure 3.1 again. The product <Katex math={r`(f + f'd)(g + g'd)`} /> is the total area of a rectangle with sides <Katex math={r`f + f'd`} /> and <Katex math={r`g + g'd`} />. The four sub-rectangles have areas <Katex math="fg" />, <Katex math={r`fg'd`} />, <Katex math={r`f'gd`} />, and <Katex math={r`f'g'd^2`} />. The last one — the tiny pink corner — vanishes because <Katex math="d^2 = 0" />. The surviving <Katex math="d" />-terms give the derivative.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Product Rule</h4>
			<p>Find the derivative of <Katex math={r`h(x) = x^2 \cdot e^x`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">d/dx[x² · eˣ]</div>
			<div class="step"><div class="step-math"><Katex math={r`f = x^2, \; f' = 2x, \quad g = e^x, \; g' = e^x`} display /></div><span class="step-note">identify parts</span></div>
			<div class="step"><div class="step-math"><Katex math={r`h' = f'g + fg' = 2x \cdot e^x + x^2 \cdot e^x`} display /></div><span class="step-note">apply product rule</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= e^x(2x + x^2)`} display /></div><span class="step-note">factor ✓</span></div>
		</div>

		<HistoryBox name="Gottfried Wilhelm Leibniz" years="1646–1716">
			<p>Leibniz wrote the product rule as <Katex math={r`d(xy) = x\,dy + y\,dx`} /> — a statement about infinitesimal increments. In Neocalculus, this is not metaphorical: <Katex math={r`d(fg) = f \cdot g'd + f'd \cdot g`} /> is a literal algebraic identity. Leibniz's notation was vindicated centuries later by SDG.</p>
		</HistoryBox>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: THE CHAIN RULE                        -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>The Chain Rule</h3>
			<p>The chain rule handles <em>compositions</em>: what happens when you plug one function into another? This is arguably the most important rule in calculus. In standard calculus, the proof is subtle and requires careful handling of a "zero denominator" case. In Neocalculus, it is three lines of algebra.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Chain Rule — (f∘g)' = f'(g(x))·g'(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`f(g(x+d)) = f(g(x) + g'(x)\,d)`} display /></div><span class="step-note">slope equation on g</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(g'(x)\,d)^2 = g'(x)^2 \cdot d^2 = 0`} display /></div><span class="step-note">g'·d is infinitesimal!</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f(g(x)) + f'(g(x)) \cdot g'(x)\,d`} display /></div><span class="step-note">slope equation on f</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`(f \circ g)'(x) = f'(g(x)) \cdot g'(x)`} display /></div><span class="step-note">✓</span></div>
		</div>

		<Callout type="key-idea" title="The Key Insight">
			<p>If <span class="d-highlight">d</span> squares to zero, then so does <em>any multiple</em> of it: <Katex math={r`(c \cdot d)^2 = c^2 d^2 = 0`} />. So we can apply the slope equation a second time with <Katex math={r`g'(x) \cdot d`} /> as the new infinitesimal. This is the entire proof of the chain rule — substitution, twice.</p>
		</Callout>

		<StandardCalcBox>
			<p>In standard calculus, the chain rule proof requires defining <Katex math={r`\phi(k) = \frac{f(g(x)+k) - f(g(x))}{k}`} /> (when <Katex math={r`k \ne 0`} />) and carefully handling the case <Katex math={r`g(x+h) - g(x) = 0`} /> to avoid dividing by zero. The proof fills a full page. In Neocalculus, the same result is three lines: apply the slope equation to <Katex math="g" />, observe that <Katex math={r`g'd`} /> is still nilsquare, and apply the slope equation to <Katex math="f" />. No case analysis, no limits.</p>
		</StandardCalcBox>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Chain Rule</h4>
			<p>Find <Katex math={r`\frac{d}{dx}\!\left[\sin(x^2)\right]`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">d/dx[sin(x²)]</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{outer: } f(u) = \sin u, \; f'(u) = \cos u`} display /></div><span class="step-note">identify outer</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{inner: } g(x) = x^2, \; g'(x) = 2x`} display /></div><span class="step-note">identify inner</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\frac{d}{dx}\!\left[\sin(x^2)\right] = \cos(x^2) \cdot 2x`} display /></div><span class="step-note">f'(g) · g' ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Product Rule + Chain Rule</h4>
			<p>Differentiate <Katex math={r`h(x) = x^2 \cdot \sin(3x)`} />. This requires both the product rule and chain rule.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">d/dx[x² · sin(3x)]</div>
			<div class="step"><div class="step-math"><Katex math={r`f = x^2, \; f' = 2x, \quad g = \sin(3x), \; g' = 3\cos(3x)`} display /></div><span class="step-note">product rule setup; chain rule on g</span></div>
			<div class="step"><div class="step-math"><Katex math={r`h' = 2x \cdot \sin(3x) + x^2 \cdot 3\cos(3x)`} display /></div><span class="step-note">apply product rule</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2x\sin(3x) + 3x^2\cos(3x)`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The chain rule has a beautiful intuitive reading: <strong>rates of change multiply</strong>. If <Katex math="y" /> changes 3 times as fast as <Katex math="u" />, and <Katex math="u" /> changes 5 times as fast as <Katex math="x" />, then <Katex math="y" /> changes <Katex math={r`3 \times 5 = 15`} /> times as fast as <Katex math="x" />. In infinitesimal language: the "nudge" propagates. Nudge <Katex math="x" /> by <Katex math="d" />, then <Katex math="g" /> shifts by <Katex math={r`g'd`} />, and <Katex math="f" /> shifts by <Katex math={r`f'(g) \cdot g'd`} />.</p>
		</div>

		<HistoryBox name="Isaac Newton" years="1643–1727">
			<p>Newton called derivatives "fluxions" and denoted them with dots: <Katex math={r`\dot{x}`} /> for velocity, <Katex math={r`\ddot{x}`} /> for acceleration. This notation is still standard in physics and engineering. Newton's method of "flowing quantities" was intuitive but lacked the algebraic precision that Leibniz's notation provided — and that SDG now makes rigorous.</p>
		</HistoryBox>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: THE QUOTIENT RULE                     -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>The Quotient Rule</h3>
			<p>The quotient rule follows from the same conjugate trick we used for <Katex math="1/x" /> in Chapter 2.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Quotient Rule — (f/g)' = (f'g − fg')/g²</div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{f(x+d)}{g(x+d)} = \frac{f + f'\!d}{g + g'\!d}`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{(f + f'\!d)(g - g'\!d)}{g^2 - \textcolor{#ef4444}{(g'\!d)^2}} = \frac{fg + (f'g - fg')d}{g^2}`} display /></div><span class="step-note">conjugate, d² = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Quotient Rule</h4>
			<p>Find <Katex math={r`\frac{d}{dx}\!\left[\frac{\sin x}{x}\right]`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">d/dx[sin(x)/x]</div>
			<div class="step"><div class="step-math"><Katex math={r`f = \sin x, \; f' = \cos x, \quad g = x, \; g' = 1`} display /></div><span class="step-note">identify parts</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\left(\frac{\sin x}{x}\right)' = \frac{\cos x \cdot x - \sin x \cdot 1}{x^2}`} display /></div><span class="step-note">apply quotient rule</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{x\cos x - \sin x}{x^2}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<DigDeeper title="Derive the quotient rule from product + chain">
			<p>You don't need to memorize the quotient rule as a separate formula. Write <Katex math={r`f/g = f \cdot g^{-1}`} /> and apply the product rule:</p>
			<Katex math={r`(f \cdot g^{-1})' = f' \cdot g^{-1} + f \cdot (g^{-1})'`} display />
			<p>The chain rule gives <Katex math={r`(g^{-1})' = -g'/g^2`} />, so:</p>
			<Katex math={r`= \frac{f'}{g} - \frac{fg'}{g^2} = \frac{f'g - fg'}{g^2}`} display />
			<p>The quotient rule is a consequence of the product rule and chain rule — not a separate fact.</p>
		</DigDeeper>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: L'HÔPITAL'S RULE                     -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>L'Hôpital's Rule</h3>
			<p>What is <Katex math={r`\lim_{x \to a} \frac{f(x)}{g(x)}`} /> when both <Katex math={r`f(a) = 0`} /> and <Katex math={r`g(a) = 0`} />? Standard calculus treats this as a limit problem requiring a special theorem. In Neocalculus, the answer is immediate from the slope equation.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">L'Hôpital's Rule from the Slope Equation</div>
			<div class="step"><div class="step-math"><Katex math={r`f(a + d) = f(a) + f'(a)\,d = 0 + f'(a)\,d`} display /></div><span class="step-note">f(a) = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`g(a + d) = g(a) + g'(a)\,d = 0 + g'(a)\,d`} display /></div><span class="step-note">g(a) = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{f(a + d)}{g(a + d)} = \frac{f'(a)\,d}{g'(a)\,d}`} display /></div><span class="step-note">form the ratio</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{f'(a)}{g'(a)}`} display /></div><span class="step-note">microcancellation ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Near <Katex math="a" />, both functions are essentially linear (the slope equation <em>is</em> the linearization), with slopes <Katex math={r`f'(a)`} /> and <Katex math={r`g'(a)`} />. The infinitesimal <Katex math="d" /> factors cancel by microcancellation — not by "dividing by <Katex math="d" />" but by the uniqueness of the slope.</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, L'Hôpital's rule requires Cauchy's Mean Value Theorem — a non-trivial result whose proof spans a full page. In Neocalculus, L'Hôpital's rule is a three-line consequence of the slope equation. The rule becomes <em>obvious</em>: near a shared zero, functions are approximated by their tangent lines, and the ratio of two lines through the origin is just the ratio of their slopes.</p>
		</SDGAdvantage>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: L'Hôpital's Rule</h4>
			<p>Evaluate <Katex math={r`\lim_{x \to 0} \frac{e^x - 1}{x}`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">lim(eˣ − 1)/x as x → 0</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x) = e^x - 1, \;\; f(0) = 0, \;\; f'(0) = e^0 = 1`} display /></div><span class="step-note">numerator</span></div>
			<div class="step"><div class="step-math"><Katex math={r`g(x) = x, \;\; g(0) = 0, \;\; g'(0) = 1`} display /></div><span class="step-note">denominator</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\frac{f'(0)}{g'(0)} = \frac{1}{1} = 1`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: RELATED RATES                         -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Related Rates</h3>
			<p>Related rates problems ask: if several quantities are changing simultaneously and are connected by an equation, how do their rates relate? In Neocalculus, the approach is beautifully direct — <strong>nudge every variable by its infinitesimal increment</strong> and read off the relationship between the rates.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example: Expanding Balloon</h4>
			<p>A spherical balloon is being inflated so that its radius increases at <Katex math={r`\frac{dr}{dt} = 2`} /> cm/s. How fast is the volume increasing when <Katex math="r = 10" /> cm?</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Related rates — balloon volume</div>
			<div class="step"><div class="step-math"><Katex math={r`V = \tfrac{4}{3}\pi r^3`} display /></div><span class="step-note">volume of a sphere</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V + V'd = \tfrac{4}{3}\pi (r + r'd)^3`} display /></div><span class="step-note">nudge r by r'd, V by V'd</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \tfrac{4}{3}\pi \left(r^3 + 3r^2 r' d + \textcolor{#ef4444}{\ldots\, d^2}\right)`} display /></div><span class="step-note">expand, d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V'd = 4\pi r^2 r'\,d`} display /></div><span class="step-note">cancel V = (4/3)πr³</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V' = 4\pi r^2 r'`} display /></div><span class="step-note">microcancellation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`V'(10) = 4\pi (100)(2) = 800\pi \approx 2513 \text{ cm}^3/\text{s}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example: Sliding Ladder</h4>
			<p>A 10-foot ladder leans against a wall. The base slides away at 1 ft/s. How fast is the top sliding down when the base is 6 feet from the wall?</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Related rates — sliding ladder</div>
			<div class="step"><div class="step-math"><Katex math={r`x^2 + y^2 = 100`} display /></div><span class="step-note">Pythagorean theorem (constant ladder)</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(x + x'd)^2 + (y + y'd)^2 = 100`} display /></div><span class="step-note">nudge both x and y</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x^2 + 2xx'd + y^2 + 2yy'd = 100`} display /></div><span class="step-note">expand, d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(2xx' + 2yy')\,d = 0`} display /></div><span class="step-note">x²+y²=100 cancels</span></div>
			<div class="step"><div class="step-math"><Katex math={r`xx' + yy' = 0 \implies y' = -\frac{xx'}{y}`} display /></div><span class="step-note">microcancellation, solve</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = -\frac{6 \cdot 1}{8} = -\frac{3}{4} \text{ ft/s}`} display /></div><span class="step-note">y = √(100−36) = 8 ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice how natural this is: we nudge every variable simultaneously, expand, kill <Katex math="d^2" /> terms, cancel known values, and solve. No implicit differentiation "with respect to <Katex math="t" />" — just a single algebraic nudge.</p>
		</div>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: LINEARIZATION / DIFFERENTIALS         -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Linearization and Differentials</h3>
			<p>In standard calculus, linearization is introduced as an <em>approximation</em>: <Katex math={r`f(a + \Delta x) \approx f(a) + f'(a)\,\Delta x`} /> for "small" <Katex math={r`\Delta x`} />. The word "approximately" does a lot of heavy lifting — how small must <Katex math={r`\Delta x`} /> be? How good is the approximation?</p>
			<p>In Neocalculus, the slope equation <em>is</em> the linearization, and it is <strong>exact</strong>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d) = f(x) + f'(x)\,d \quad \textit{(exact, not approximate)}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>For finite <Katex math={r`\Delta x`} />, the linearization is an approximation that gets better as <Katex math={r`\Delta x`} /> shrinks. For infinitesimal <Katex math="d" />, it is a theorem. The standard notation <Katex math={r`dy = f'(x)\,dx`} /> is, in Neocalculus, a <em>literal infinitesimal equation</em>, not a "suggestive shorthand."</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Approximate <Katex math={r`\sqrt{4.01}`} /></h4>
			<p>Let <Katex math={r`f(x) = \sqrt{x}`} />, <Katex math="a = 4" />, <Katex math={r`\Delta x = 0.01`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Linearization of √x near x = 4</div>
			<div class="step"><div class="step-math"><Katex math={r`f(4) = 2, \quad f'(x) = \frac{1}{2\sqrt{x}}, \quad f'(4) = \frac{1}{4}`} display /></div><span class="step-note">value and slope</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sqrt{4.01} \approx f(4) + f'(4) \cdot 0.01 = 2 + \frac{0.01}{4}`} display /></div><span class="step-note">linearize</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2.0025`} display /></div><span class="step-note">exact: 2.002498… ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Worked Example: Approximate <Katex math={r`\sqrt[3]{8.06}`} /></h4>
			<p>Let <Katex math={r`f(x) = x^{1/3}`} />, <Katex math="a = 8" />, <Katex math={r`\Delta x = 0.06`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Linearization of ∛x near x = 8</div>
			<div class="step"><div class="step-math"><Katex math={r`f(8) = 2, \quad f'(x) = \tfrac{1}{3}x^{-2/3}, \quad f'(8) = \tfrac{1}{3} \cdot \tfrac{1}{4} = \tfrac{1}{12}`} display /></div><span class="step-note">value and slope</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sqrt[3]{8.06} \approx 2 + \tfrac{1}{12} \cdot 0.06 = 2 + 0.005`} display /></div><span class="step-note">linearize</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2.005`} display /></div><span class="step-note">exact: 2.00499… ✓</span></div>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, "differentials" are a notational convenience: <Katex math={r`dy = f'(x)\,dx`} /> is a shorthand for the limit definition. In SDG, this equation is <strong>literally true</strong> for infinitesimal <Katex math="dx" />. When we write <Katex math={r`dy = f'(x)\,dx`} />, we mean exactly what it says: the infinitesimal change in <Katex math="y" /> equals the derivative times the infinitesimal change in <Katex math="x" />. Differentials are not metaphors — they are algebra.</p>
		</SDGAdvantage>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: IMPLICIT DIFFERENTIATION              -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Implicit Differentiation</h3>
			<p>What if the relationship between <Katex math="x" /> and <Katex math="y" /> is given by an equation like <Katex math={r`x^2 + y^2 = r^2`} /> (a circle)? We can still find <Katex math={r`dy/dx`} /> by nudging both variables simultaneously.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — dy/dx on the circle x² + y² = r²</div>
			<div class="step"><div class="step-math"><Katex math={r`(x + d)^2 + (y + y'\!d)^2 = r^2`} display /></div><span class="step-note">nudge x by d, y by y'd</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x^2 + 2xd + y^2 + 2yy'\!d + \textcolor{#ef4444}{\ldots d^2} = r^2`} display /></div><span class="step-note">expand, d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\underbrace{x^2 + y^2}_{r^2} + (2x + 2yy')\,d = r^2`} display /></div><span class="step-note">collect</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(2x + 2yy')\,d = 0`} display /></div><span class="step-note">cancel r²</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = -\frac{x}{y}`} display /></div><span class="step-note">microcancellation ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example: The Folium of Descartes</h4>
			<p>Find <Katex math={r`dy/dx`} /> on the curve <Katex math={r`x^3 + y^3 = 6xy`} />. This beautiful curve loops through the origin and has a leaf-like shape.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Implicit differentiation on x³ + y³ = 6xy</div>
			<div class="step"><div class="step-math"><Katex math={r`(x+d)^3 + (y+y'd)^3 = 6(x+d)(y+y'd)`} display /></div><span class="step-note">nudge both variables</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x^3 + 3x^2 d + y^3 + 3y^2 y'd = 6\!\left(xy + xy'd + yd\right)`} display /></div><span class="step-note">expand, d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\underbrace{x^3+y^3}_{6xy} + (3x^2 + 3y^2 y')d = 6xy + (6xy'+6y)d`} display /></div><span class="step-note">collect; x³+y³ = 6xy cancels</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(3x^2 + 3y^2 y')d = (6xy' + 6y)d`} display /></div><span class="step-note">remaining d-terms</span></div>
			<div class="step"><div class="step-math"><Katex math={r`3x^2 + 3y^2 y' = 6xy' + 6y`} display /></div><span class="step-note">microcancellation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`y'(3y^2 - 6x) = 6y - 3x^2`} display /></div><span class="step-note">collect y' terms</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = \frac{6y - 3x^2}{3y^2 - 6x} = \frac{2y - x^2}{y^2 - 2x}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: LOGARITHMIC DIFFERENTIATION           -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Logarithmic Differentiation</h3>
			<p>How do you differentiate <Katex math={r`x^x`} />? It's not a power rule (<Katex math="x" /> is in the exponent) and it's not an exponential (<Katex math="x" /> is in the base too). The trick: take the logarithm first, then differentiate.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of xˣ</div>
			<div class="step"><div class="step-math"><Katex math={r`y = x^x \implies \ln y = x \ln x`} display /></div><span class="step-note">take ln of both sides</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{d}{dx}[\ln y] = \frac{1}{y} \cdot y'`} display /></div><span class="step-note">chain rule on ln(y): d/dx[ln(y)] = (1/y) · y'</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{y'}{y} = \frac{d}{dx}[x \ln x] = \ln x + 1`} display /></div><span class="step-note">product rule on x ln x</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = x^x(\ln x + 1)`} display /></div><span class="step-note">multiply by y = xˣ ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The key step is the chain rule on <Katex math={r`\ln y`} />: since <Katex math="y" /> depends on <Katex math="x" />, differentiating <Katex math={r`\ln y`} /> with respect to <Katex math="x" /> gives <Katex math={r`\frac{1}{y} \cdot \frac{dy}{dx}`} /> — the chain rule applied to the outer function <Katex math={r`\ln(\cdot)`} />. This technique works whenever the variable appears in both the base and exponent.</p>
		</div>

		<DigDeeper title="Logarithmic differentiation for complicated products">
			<p>Logarithmic differentiation is also useful for products with many factors. If <Katex math={r`y = f_1 \cdot f_2 \cdot f_3 \cdots`} />, then <Katex math={r`\ln y = \ln f_1 + \ln f_2 + \ln f_3 + \cdots`} />, and differentiating:</p>
			<Katex math={r`\frac{y'}{y} = \frac{f_1'}{f_1} + \frac{f_2'}{f_2} + \frac{f_3'}{f_3} + \cdots`} display />
			<p>This converts a product of complicated factors into a sum of simple fractions — a considerable simplification.</p>
		</DigDeeper>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: HIGHER-ORDER DERIVATIVES              -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Higher-Order Derivatives</h3>
			<p>The derivative <Katex math={r`f'(x)`} /> is itself a function, and we can differentiate it again. The result, <Katex math={r`f''(x)`} />, is the <strong>second derivative</strong>.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Computing f''(x)</h4>
			<p>The method is straightforward: differentiate <Katex math={r`f'(x)`} /> using the same rules. Let's compute <Katex math={r`f''(x)`} /> for <Katex math={r`f(x) = x^4`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Second derivative of x⁴</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x) = x^4`} display /></div><span class="step-note">given</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f'(x) = 4x^3`} display /></div><span class="step-note">power rule</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f''(x) = \frac{d}{dx}[4x^3] = 12x^2`} display /></div><span class="step-note">differentiate f' ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Physical Meaning</h4>
			<p>If <Katex math="s(t)" /> is position, then:</p>
			<ul>
				<li><Katex math={r`s'(t) = v(t)`} /> is <strong>velocity</strong> — how fast position changes.</li>
				<li><Katex math={r`s''(t) = a(t)`} /> is <strong>acceleration</strong> — how fast velocity changes.</li>
			</ul>
			<p><strong>Geometrically:</strong> <Katex math={r`f''(x)`} /> measures <strong>concavity</strong>. If <Katex math={r`f''(x) > 0`} />, the graph curves upward (concave up, like a bowl). If <Katex math={r`f''(x) < 0`} />, the graph curves downward (concave down, like an arch).</p>
		</div>

		<!-- Higher-order nilpotents -->
		<div class="neo-prose" use:reveal>
			<h4>The Infinitesimal Taylor Formula</h4>
			<p>Neocalculus reveals a beautiful structure for higher derivatives. The sum of two nilsquares <Katex math={r`d_1, d_2`} /> is a <strong>nilcube</strong>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(d_1 + d_2)^3 = 0, \quad\text{but } (d_1 + d_2)^2 = 2d_1 d_2 \neq 0`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Using two separate nilsquares, the slope equation applied twice gives an exact second-order formula:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Infinitesimal Taylor Formula (2nd order)</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x + d_1 + d_2) = f(x) + f'(x)(d_1 + d_2) + \tfrac{1}{2}f''(x)(d_1 + d_2)^2`} display /></div><span class="step-note">exact, not approximate!</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f(x) + f'(x)(d_1 + d_2) + f''(x)\,d_1 d_2`} display /></div><span class="step-note">since (d₁+d₂)² = 2d₁d₂</span></div>
		</div>

		<Callout type="definition" title="Higher Nilpotents">
			<p>Define <Katex math={r`D_n = \{d \in \mathcal{R} : d^{n+1} = 0\}`} />. On <Katex math={r`D_n`} />, every function is uniquely a polynomial of degree <Katex math={r`\leq n`} />. This gives <strong>exact</strong> Taylor polynomials — not approximations.</p>
		</Callout>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: GENERAL LEIBNIZ RULE                  -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h4>The General Leibniz Rule</h4>
			<p>What is <Katex math={r`(fg)''`} />? Apply the product rule twice:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">(fg)'' = f''g + 2f'g' + fg''</div>
			<div class="step"><div class="step-math"><Katex math={r`(fg)' = f'g + fg'`} display /></div><span class="step-note">product rule</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(fg)'' = (f'g + fg')' = (f'g)' + (fg')'`} display /></div><span class="step-note">sum rule</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= (f''g + f'g') + (f'g' + fg'')`} display /></div><span class="step-note">product rule on each term</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`(fg)'' = f''g + 2f'g' + fg''`} display /></div><span class="step-note">combine like terms ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice the pattern of coefficients: <Katex math="1, 2, 1" /> — the binomial coefficients! In general, the <Katex math="n" />th derivative of a product follows the <strong>General Leibniz Rule</strong>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(fg)^{(n)} = \sum_{k=0}^{n} \binom{n}{k} f^{(k)} g^{(n-k)}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is the "product rule" version of the binomial theorem — and in SDG, it arises from the same algebraic source: expanding products of sums involving nilpotent increments.</p>
		</div>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: MEAN VALUE THEOREM / CONSTANCY        -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>The Constancy Principle</h3>
			<p>In standard calculus, the <strong>Mean Value Theorem</strong> (MVT) says: if <Katex math="f" /> is differentiable on <Katex math={r`[a,b]`} />, there exists some <Katex math={r`c \in (a,b)`} /> with <Katex math={r`f'(c) = \frac{f(b)-f(a)}{b-a}`} />. This is one of the most important theorems in analysis — it connects local information (the derivative) to global information (the change over an interval).</p>
			<p>However, the MVT is <em>non-constructive</em>: it asserts that such a <Katex math="c" /> exists but gives no way to find it. In constructive mathematics (the logical framework underlying SDG), we cannot use the MVT directly.</p>
			<p>The SDG replacement is the <strong>Constancy Principle</strong>:</p>
		</div>

		<Callout type="theorem" title="The Constancy Principle">
			<p>If <Katex math={r`f'(x) = 0`} /> for all <Katex math="x" /> in an interval, then <Katex math="f" /> is constant on that interval.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is the key consequence of the MVT that we actually use: if the derivative is zero everywhere, the function doesn't change. In SDG, this is taken as an axiom (it is a consequence of the microaffine structure of the line). From it, all the standard corollaries follow: if <Katex math={r`f' = g'`} /> then <Katex math={r`f = g + c`} /> (functions with the same derivative differ by a constant), and if <Katex math={r`f' > 0`} /> then <Katex math="f" /> is increasing.</p>
		</div>

		<DigDeeper title="Why the MVT fails constructively">
			<p>The classical MVT proof relies on the <em>extreme value theorem</em>: a continuous function on <Katex math={r`[a,b]`} /> attains its maximum. Finding this maximum requires <em>excluded middle</em> — the ability to assert that for each point, the function either equals its supremum or it doesn't. Constructive logic does not assume this. The Constancy Principle sidesteps the issue by directly axiomatizing the connection between zero derivative and constant function, which is the only consequence of the MVT used in practice.</p>
		</DigDeeper>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- SECTION: HISTORY BOXES / EXTRA                 -->
		<!-- ═══════════════════════════════════════════════ -->

		<!-- ═══════════════════════════════════════════════ -->
		<!-- CHAPTER SUMMARY                                -->
		<!-- ═══════════════════════════════════════════════ -->
		<ChapterSummary>
			<ul>
				<li><strong>Product rule:</strong> <Katex math={r`(fg)' = f'g + fg'`} /> — multiply out the slope equations, <Katex math="d^2 = 0" /> kills the corner term.</li>
				<li><strong>Chain rule:</strong> <Katex math={r`(f \circ g)' = f'(g) \cdot g'`} /> — any multiple of <Katex math="d" /> is still nilsquare, so the slope equation applies twice.</li>
				<li><strong>Quotient rule:</strong> <Katex math={r`(f/g)' = (f'g - fg')/g^2`} /> — conjugate trick with <Katex math="d^2 = 0" />.</li>
				<li><strong>L'Hôpital's rule:</strong> <Katex math={r`\frac{f(a+d)}{g(a+d)} = \frac{f'(a)}{g'(a)}`} /> when <Katex math={r`f(a)=g(a)=0`} /> — microcancellation of <Katex math="d" />.</li>
				<li><strong>Related rates:</strong> Nudge every variable by its infinitesimal increment, expand, kill <Katex math="d^2" />, solve.</li>
				<li><strong>Linearization:</strong> <Katex math={r`f(x+d) = f(x) + f'(x)d`} /> <em>is</em> the linearization (exact in SDG, approximate for finite increments).</li>
				<li><strong>Implicit differentiation:</strong> Nudge both <Katex math="x" /> and <Katex math="y" />, expand, cancel, microcancellate.</li>
				<li><strong>Logarithmic differentiation:</strong> Take <Katex math={r`\ln`} />, differentiate using chain rule: <Katex math={r`y'/y = (\ln y)' `} />.</li>
				<li><strong>Higher derivatives:</strong> <Katex math={r`f''`} /> measures concavity/acceleration. Nilcubes give exact Taylor polynomials.</li>
				<li><strong>Leibniz rule:</strong> <Katex math={r`(fg)'' = f''g + 2f'g' + fg''`} /> — binomial coefficients from algebra.</li>
				<li><strong>Constancy principle:</strong> <Katex math={r`f' = 0`} /> everywhere implies <Katex math="f" /> is constant — the constructive replacement for the MVT.</li>
			</ul>
			<table class="neo-table" style="margin-top: 1rem;">
				<thead><tr><th>Rule</th><th>Formula</th><th>SDG mechanism</th></tr></thead>
				<tbody>
					<tr><td>Product</td><td><Katex math={r`(fg)' = f'g + fg'`} /></td><td>FOIL, <Katex math="d^2 = 0" /></td></tr>
					<tr><td>Chain</td><td><Katex math={r`(f \circ g)' = f'(g) g'`} /></td><td>nested slope equation</td></tr>
					<tr><td>Quotient</td><td><Katex math={r`(f/g)' = \frac{f'g-fg'}{g^2}`} /></td><td>conjugate, <Katex math="d^2 = 0" /></td></tr>
					<tr><td>Implicit</td><td>nudge both sides, solve for <Katex math={r`y'`} /></td><td>expand, <Katex math="d^2 = 0" /></td></tr>
					<tr><td>Higher-order</td><td><Katex math={r`f''`} /> via nilcubes</td><td><Katex math={r`(d_1+d_2)^2 = 2d_1d_2`} /></td></tr>
				</tbody>
			</table>
		</ChapterSummary>

		<!-- ═══════════════════════════════════════════════ -->
		<!-- EXERCISES                                      -->
		<!-- ═══════════════════════════════════════════════ -->
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>

			<!-- WARM-UP -->
			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Use the product rule to find <Katex math={r`(x^2 \sin x)'`} />.</p>
				{#snippet solution()}<p><Katex math={r`= 2x\sin x + x^2 \cos x`} /></p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Use the chain rule to find <Katex math={r`\frac{d}{dx}\!\left[\sin(x^2)\right]`} />.</p>
				{#snippet solution()}<p><Katex math={r`= \cos(x^2) \cdot 2x = 2x\cos(x^2)`} /></p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Use the quotient rule to find <Katex math={r`\frac{d}{dx}\!\left[\frac{x}{x^2 + 1}\right]`} />.</p>
				{#snippet solution()}<p><Katex math={r`= \frac{1 \cdot (x^2+1) - x \cdot 2x}{(x^2+1)^2} = \frac{1-x^2}{(x^2+1)^2}`} /></p>{/snippet}
			</Exercise>

			<!-- CORE -->
			<Exercise number={4}>
				<p><strong>Core.</strong> Find <Katex math={r`\frac{d}{dx}\!\left[e^{\sin x}\right]`} />.</p>
				{#snippet solution()}<p>Chain rule: outer <Katex math={r`e^u`} />, inner <Katex math={r`\sin x`} />. So <Katex math={r`\frac{d}{dx}[e^{\sin x}] = e^{\sin x} \cdot \cos x`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p><strong>Core.</strong> Find <Katex math={r`\frac{d}{dx}\!\left[(x^2+1)^5\right]`} />.</p>
				{#snippet solution()}<p>Chain rule: <Katex math={r`5(x^2+1)^4 \cdot 2x = 10x(x^2+1)^4`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Find <Katex math={r`\frac{d}{dx}\!\left[\ln(\cos x)\right]`} />.</p>
				{#snippet solution()}<p>Chain rule: <Katex math={r`\frac{1}{\cos x} \cdot (-\sin x) = -\tan x`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Core.</strong> Differentiate <Katex math={r`h(x) = x^3 \sin(2x)`} /> using both the product rule and chain rule.</p>
				{#snippet solution()}<p><Katex math={r`h' = 3x^2 \sin(2x) + x^3 \cdot 2\cos(2x) = 3x^2\sin(2x) + 2x^3\cos(2x)`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p><strong>Core.</strong> Find <Katex math={r`dy/dx`} /> for the ellipse <Katex math={r`\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1`} /> using implicit differentiation.</p>
				{#snippet solution()}<p>Nudge: <Katex math={r`\frac{2x}{a^2}d + \frac{2y}{b^2}y'd = 0`} />, so <Katex math={r`y' = -\frac{b^2 x}{a^2 y}`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> Find <Katex math={r`dy/dx`} /> for <Katex math={r`y^2 = x^3`} /> (a cusp curve).</p>
				{#snippet solution()}<p>Nudge: <Katex math={r`(y+y'd)^2 = (x+d)^3`} />. Expanding with <Katex math="d^2 = 0" />: <Katex math={r`y^2 + 2yy'd = x^3 + 3x^2 d`} />. Cancel <Katex math={r`y^2 = x^3`} />: <Katex math={r`2yy'd = 3x^2 d`} />, so <Katex math={r`y' = \frac{3x^2}{2y}`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Core.</strong> Find <Katex math={r`f''(x)`} /> for <Katex math={r`f(x) = \sin x`} />.</p>
				{#snippet solution()}<p><Katex math={r`f'(x) = \cos x`} />, <Katex math={r`f''(x) = -\sin x`} />. The second derivative of sine is minus itself.</p>{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p><strong>Core.</strong> Find <Katex math={r`f''(x)`} /> for <Katex math={r`f(x) = e^x`} />.</p>
				{#snippet solution()}<p><Katex math={r`f'(x) = e^x`} />, <Katex math={r`f''(x) = e^x`} />. Every derivative of <Katex math={r`e^x`} /> is <Katex math={r`e^x`} />!</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Core.</strong> A particle's position is <Katex math={r`s(t) = \sin(t)`} />. Find its velocity <Katex math={r`v(t)`} /> and acceleration <Katex math={r`a(t)`} />.</p>
				{#snippet solution()}<p><Katex math={r`v(t) = s'(t) = \cos t`} />, <Katex math={r`a(t) = s''(t) = -\sin t`} />. The acceleration is always proportional and opposite to position — simple harmonic motion.</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p><strong>Core.</strong> Use L'Hôpital's rule (SDG style) to evaluate <Katex math={r`\lim_{x \to 0}\frac{e^x - 1}{x}`} />.</p>
				{#snippet solution()}<p><Katex math={r`f(x)=e^x -1, \; f(0)=0, \; f'(0)=1`} />. <Katex math={r`g(x) = x, \; g(0) = 0, \; g'(0) = 1`} />. Near 0: <Katex math={r`\frac{f'(0)d}{g'(0)d} = \frac{1}{1} = 1`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p><strong>Core.</strong> A sphere's radius is expanding at 3 cm/s. How fast is its surface area <Katex math={r`A = 4\pi r^2`} /> increasing when <Katex math="r = 5" /> cm?</p>
				{#snippet solution()}<p>Nudge: <Katex math={r`A + A'd = 4\pi(r+r'd)^2 = 4\pi(r^2 + 2rr'd) = A + 8\pi r r' d`} />. So <Katex math={r`A' = 8\pi r r' = 8\pi(5)(3) = 120\pi \approx 377`} /> cm²/s.</p>{/snippet}
			</Exercise>

			<Exercise number={15}>
				<p><strong>Core.</strong> Use linearization to approximate <Katex math={r`\sqrt[3]{8.06}`} />.</p>
				{#snippet solution()}<p><Katex math={r`f(x) = x^{1/3}, \; a=8, \; f(8) = 2, \; f'(8) = \frac{1}{12}`} />. So <Katex math={r`\sqrt[3]{8.06} \approx 2 + \frac{1}{12} \cdot 0.06 = 2.005`} />. (Exact: 2.00499…)</p>{/snippet}
			</Exercise>

			<!-- CHALLENGE -->
			<Exercise number={16}>
				<p><strong>Challenge.</strong> Use logarithmic differentiation to find <Katex math={r`\frac{d}{dx}\!\left[(\sin x)^x\right]`} />.</p>
				{#snippet solution()}<p>Let <Katex math={r`y = (\sin x)^x`} />. Then <Katex math={r`\ln y = x \ln(\sin x)`} />. Differentiate: <Katex math={r`\frac{y'}{y} = \ln(\sin x) + x \cdot \frac{\cos x}{\sin x}`} />. So:</p>
				<Katex math={r`y' = (\sin x)^x \!\left[\ln(\sin x) + x \cot x\right]`} display />{/snippet}
			</Exercise>

			<Exercise number={17}>
				<p><strong>Challenge.</strong> Prove the quotient rule using only the product rule and chain rule (without the conjugate trick).</p>
				{#snippet solution()}<p>Write <Katex math={r`f/g = f \cdot g^{-1}`} />. Product rule: <Katex math={r`(f \cdot g^{-1})' = f'g^{-1} + f(g^{-1})'`} />. Chain rule on <Katex math={r`g^{-1}`} />: <Katex math={r`(g^{-1})' = -g'/g^2`} />. So:</p>
				<Katex math={r`\frac{f'}{g} + f \cdot \frac{-g'}{g^2} = \frac{f'g - fg'}{g^2}`} display />{/snippet}
			</Exercise>

			<Exercise number={18}>
				<p><strong>Challenge.</strong> Show that <Katex math={r`(fgh)' = f'gh + fg'h + fgh'`} />.</p>
				{#snippet solution()}<p>Apply the product rule to <Katex math={r`(fg) \cdot h`} />: <Katex math={r`((fg) \cdot h)' = (fg)'h + (fg)h'`} />. Expand <Katex math={r`(fg)' = f'g + fg'`} />:</p>
				<Katex math={r`= (f'g + fg')h + fgh' = f'gh + fg'h + fgh'`} display />
				<p>Alternatively: <Katex math={r`(f+f'd)(g+g'd)(h+h'd)`} />. Expanding and keeping only terms through first order in <Katex math="d" /> (since <Katex math="d^2 = 0" /> kills all cross-terms), we get <Katex math={r`fgh + (f'gh + fg'h + fgh')d`} />. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={19}>
				<p><strong>Challenge.</strong> If <Katex math={r`d_1^2 = d_2^2 = 0`} />, show that <Katex math={r`(d_1 + d_2)^2 = 2d_1 d_2`} />.</p>
				{#snippet solution()}<p><Katex math={r`(d_1+d_2)^2 = d_1^2 + 2d_1d_2 + d_2^2 = 0 + 2d_1d_2 + 0 = 2d_1d_2`} /></p>{/snippet}
			</Exercise>

			<!-- EXPLORATION -->
			<Exercise number={20}>
				<p><strong>Exploration.</strong> <em>Why does the chain rule multiply rates?</em> Consider a car driving along a winding road. The car's distance along the road at time <Katex math="t" /> is <Katex math="s(t)" />, and the altitude of the road at position <Katex math="s" /> is <Katex math="h(s)" />. Explain, in physical terms, why the rate of altitude change with respect to time is <Katex math={r`h'(s) \cdot s'(t)`} />. Then verify this by writing the slope equation for each function and composing.</p>
				{#snippet solution()}<p><Katex math={r`s'(t)`} /> is the car's speed (distance per time), and <Katex math={r`h'(s)`} /> is the road's grade (altitude per distance). So <Katex math={r`h'(s) \cdot s'(t)`} /> is altitude per distance × distance per time = altitude per time. In infinitesimal terms: nudge <Katex math="t" /> by <Katex math="d" />, <Katex math="s" /> changes by <Katex math={r`s'd`} />, and <Katex math="h" /> changes by <Katex math={r`h'(s) \cdot s'd`} />. The coefficient of <Katex math="d" /> is <Katex math={r`h'(s) \cdot s'(t)`} />. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={21}>
				<p><strong>Exploration.</strong> A ladder 13 feet long leans against a wall. The base is pulled away at 2 ft/s. How fast is the top sliding down when the base is 5 feet from the wall?</p>
				{#snippet solution()}<p><Katex math={r`x^2 + y^2 = 169`} />. Nudge: <Katex math={r`2xx' + 2yy' = 0`} />. At <Katex math={r`x=5`} />: <Katex math={r`y = 12`} />, so <Katex math={r`y' = -\frac{5 \cdot 2}{12} = -\frac{5}{6}`} /> ft/s. The top slides down at <Katex math={r`5/6 \approx 0.83`} /> ft/s.</p>{/snippet}
			</Exercise>

			<Exercise number={22}>
				<p><strong>Exploration.</strong> The Constancy Principle says: if <Katex math={r`f'(x) = 0`} /> for all <Katex math="x" />, then <Katex math="f" /> is constant. Use this to prove: if <Katex math={r`f'(x) = g'(x)`} /> for all <Katex math="x" />, then <Katex math={r`f(x) = g(x) + C`} /> for some constant <Katex math="C" />.</p>
				{#snippet solution()}<p>Let <Katex math={r`h(x) = f(x) - g(x)`} />. Then <Katex math={r`h'(x) = f'(x) - g'(x) = 0`} />. By the Constancy Principle, <Katex math="h" /> is constant: <Katex math={r`h(x) = C`} />. So <Katex math={r`f(x) = g(x) + C`} />. ✓</p>{/snippet}
			</Exercise>
		</div>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>We now have a complete toolkit for computing derivatives. But <em>what are derivatives good for?</em> In the next chapter, we turn to <strong>applications</strong>: finding maxima and minima (optimization), understanding the shape of curves (concavity, inflection points), and solving real-world problems. The derivative, it turns out, is the key to understanding how functions behave — and the rules from this chapter are the engine that makes it all work.</p>
		</LookingAhead>

		<NextChapter href="ch4" title="Applications of Derivatives" number="4" />
	</div>
</section>
