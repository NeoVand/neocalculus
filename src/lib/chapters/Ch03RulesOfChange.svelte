<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
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

		<div class="neo-prose" use:reveal>
			<p>Must we expand <Katex math="f(x+d)" /> from scratch every time? Of course not. The standard rules of differentiation all fall out of pure algebra with <Katex math="d^2 = 0" />.</p>
			<h3>The Product Rule</h3>
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

		<div class="neo-prose" use:reveal><h3>The Chain Rule</h3></div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Chain Rule — (f∘g)' = f'(g(x))·g'(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`f(g(x+d)) = f(g(x) + g'(x)\,d)`} display /></div><span class="step-note">slope equation on g</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(g'(x)\,d)^2 = g'(x)^2 \cdot d^2 = 0`} display /></div><span class="step-note">g'·d is infinitesimal!</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f(g(x)) + f'(g(x)) \cdot g'(x)\,d`} display /></div><span class="step-note">slope equation on f</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`(f \circ g)'(x) = f'(g(x)) \cdot g'(x)`} display /></div><span class="step-note">✓</span></div>
		</div>

		<Callout type="key-idea" title="The Key Insight">
			<p>If <span class="d-highlight">d</span> squares to zero, then so does <em>any multiple</em> of it: <Katex math={r`(c \cdot d)^2 = c^2 d^2 = 0`} />. So we can apply the slope equation a second time with <Katex math={r`g'(x) \cdot d`} /> as the new infinitesimal.</p>
		</Callout>

		<div class="neo-prose" use:reveal><h3>The Quotient Rule</h3></div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Quotient Rule — (f/g)' = (f'g − fg')/g²</div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{f(x+d)}{g(x+d)} = \frac{f + f'\!d}{g + g'\!d}`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{(f + f'\!d)(g - g'\!d)}{g^2 - \textcolor{#ef4444}{(g'\!d)^2}} = \frac{fg + (f'g - fg')d}{g^2}`} display /></div><span class="step-note">conjugate, d² = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}`} display /></div><span class="step-note">✓</span></div>
		</div>

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
			<h3>Logarithmic Differentiation</h3>
			<p>How do you differentiate <Katex math={r`x^x`} />? Take the logarithm first, then differentiate.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of xˣ</div>
			<div class="step"><div class="step-math"><Katex math={r`y = x^x \implies \ln y = x \ln x`} display /></div><span class="step-note">take ln of both sides</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{y'}{y}\,d = (\ln x + 1)\,d`} display /></div><span class="step-note">differentiate: product rule on x ln x</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = x^x(\ln x + 1)`} display /></div><span class="step-note">multiply by y = xˣ ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Higher-Order Derivatives</h3>
			<p>What about the second derivative, third derivative, and beyond? This is where Neocalculus reveals a beautiful structure. The sum of two nilsquares <Katex math={r`d_1, d_2`} /> is a <strong>nilcube</strong>:</p>
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
			<p>Define <Katex math={r`D_n = \{d \in \mathcal{R} : d^{n+1} = 0\}`} />. On <Katex math={r`D_n`} />, every function is uniquely a polynomial of degree ≤ n. This gives <strong>exact</strong> Taylor polynomials — not approximations.</p>
		</Callout>

		<details class="dig-deeper" use:reveal>
			<summary>The microcancellation principle</summary>
			<div class="dig-content">
				<p>Throughout these proofs, we use: if <Katex math={r`a \cdot d = b \cdot d`} /> for all infinitesimal d, then <Katex math="a = b" />. We're not "dividing by d" — we're using the <em>uniqueness</em> in the slope equation. Cancel, but don't divide.</p>
			</div>
		</details>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Use the product rule to find <Katex math={r`(x^2 \sin x)'`} />.
				{#snippet solution()}<p><Katex math={r`= 2x\sin x + x^2 \cos x`} /></p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Use the chain rule to find <Katex math={r`(\sin(x^2))'`} />.
				{#snippet solution()}<p><Katex math={r`= \cos(x^2) \cdot 2x = 2x\cos(x^2)`} /></p>{/snippet}
			</Exercise>
			<Exercise number={3}>
				Find <Katex math={r`dy/dx`} /> for the ellipse <Katex math={r`\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1`} /> using implicit differentiation.
				{#snippet solution()}<p>Nudge: <Katex math={r`\frac{2x}{a^2}d + \frac{2y}{b^2}y'd = 0`} />, so <Katex math={r`y' = -\frac{b^2 x}{a^2 y}`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={4}>
				If <Katex math={r`d_1^2 = d_2^2 = 0`} />, show that <Katex math={r`(d_1 + d_2)^2 = 2d_1 d_2`} />.
				{#snippet solution()}<p><Katex math={r`(d_1+d_2)^2 = d_1^2 + 2d_1d_2 + d_2^2 = 0 + 2d_1d_2 + 0 = 2d_1d_2`} /></p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
