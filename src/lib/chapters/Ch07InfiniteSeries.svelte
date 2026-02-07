<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch7">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 7</span>
			<h2 class="chapter-title">Infinite Series and Taylor Polynomials</h2>
			<p class="chapter-tagline">Exact polynomial expansions from higher-order nilpotents.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In Chapter 3 we saw that the sum of two nilsquares is a nilcube, giving an exact second-order formula. This idea extends beautifully: higher-order nilpotents give <em>exact</em> polynomial expansions to any desired degree.</p>
		</div>

		<Callout type="definition" title="Higher-Order Infinitesimals">
			<p>Define <Katex math={r`D_n = \{d \in \mathcal{R} : d^{n+1} = 0\}`} />. On <Katex math={r`D_n`} />, every function is <strong>uniquely</strong> determined by a polynomial of degree ≤ n:</p>
			<Katex math={r`f(d) = a_0 + a_1 d + a_2 d^2 + \cdots + a_n d^n`} display />
		</Callout>

		<!-- Nested neighborhoods figure -->
		<Figure number="7.1" caption="Nested infinitesimal neighborhoods: D ⊂ D₂ ⊂ D₃. On D, functions are linear. On D₂, quadratic. On D₃, cubic. Each gives an exact expansion.">
			<svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px">
				<ellipse cx="200" cy="60" rx="170" ry="45" fill="rgba(168,85,247,0.04)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="4,3"/>
				<text x="370" y="25" font-size="10" font-family="Inter,sans-serif" fill="#a855f7">D₃: cubic</text>
				<ellipse cx="200" cy="60" rx="115" ry="35" fill="rgba(168,85,247,0.07)" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/>
				<text x="315" y="42" font-size="10" font-family="Inter,sans-serif" fill="#a855f7">D₂: quadratic</text>
				<ellipse cx="200" cy="60" rx="60" ry="22" fill="rgba(168,85,247,0.12)" stroke="#a855f7" stroke-width="1.5"/>
				<text x="260" y="57" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">D: linear</text>
				<circle cx="200" cy="60" r="3" fill="#1a1a2e"/>
				<text x="200" y="95" text-anchor="middle" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e">0</text>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<h3>The Taylor Formula</h3>
			<p>At a point <Katex math="a" />, using a nilpotent <Katex math={r`d \in D_n`} />:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(a + d) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}\,d^k`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is <strong>exact</strong>, not an approximation. On <Katex math={r`D_n`} />, the function <em>is</em> its Taylor polynomial. The "remainder" is literally zero because <Katex math={r`d^{n+1} = 0`} />.</p>
			<h3>Common Expansions</h3>
			<p>Setting <Katex math="a = 0" /> and using the defining properties of each function:</p>
		</div>

		<Callout type="key-idea" title="Key Taylor Expansions">
			<Katex math={r`e^d = 1 + d + \frac{d^2}{2!} + \frac{d^3}{3!} + \cdots`} display />
			<Katex math={r`\sin(d) = d - \frac{d^3}{3!} + \frac{d^5}{5!} - \cdots`} display />
			<Katex math={r`\cos(d) = 1 - \frac{d^2}{2!} + \frac{d^4}{4!} - \cdots`} display />
			<Katex math={r`\ln(1+d) = d - \frac{d^2}{2} + \frac{d^3}{3} - \cdots`} display />
			<Katex math={r`\frac{1}{1-d} = 1 + d + d^2 + d^3 + \cdots`} display />
			<p style="font-size:0.9rem;margin-top:0.5rem;">On <Katex math={r`D_n`} />, each series terminates at degree n. Every series converges trivially because higher terms vanish.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Notice something remarkable: in standard calculus, convergence of infinite series is a deep and subtle topic requiring careful tests. In Neocalculus, on <Katex math={r`D_n`} />, every formal power series converges automatically because it reduces to a finite polynomial. The "infinite" series is actually finite.</p>
		</div>

		<InlinePlot fn={x => Math.exp(x)} domain={[-2, 2.5]} secondFn={x => 1 + x + x*x/2} caption="eˣ (solid) vs its 2nd-order Taylor polynomial 1 + x + x²/2 (dashed). On D₂, they are identical." />

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — deriving e^d = 1 + d on D</div>
			<div class="step"><div class="step-math"><Katex math={r`e^d = 1 + d + \frac{d^2}{2!} + \cdots`} display /></div><span class="step-note">Taylor series</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 1 + d + \textcolor{#ef4444}{0} + \cdots = 1 + d`} display /></div><span class="step-note">on D: d² = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`e^d = 1 + d \quad\text{(on } D\text{)}`} display /></div><span class="step-note">confirms our Ch.2 result ✓</span></div>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				On <Katex math={r`D_2`} /> (where <Katex math={r`d^3 = 0`} />), expand <Katex math={r`\sin(d)`} /> and <Katex math={r`\cos(d)`} />.
				{#snippet solution()}<p><Katex math={r`\sin(d) = d`} /> (the d³ term vanishes). <Katex math={r`\cos(d) = 1 - d^2/2`} /> (now we keep the d² term!).</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Use the Taylor expansion of <Katex math={r`e^d`} /> on <Katex math={r`D_2`} /> to verify that <Katex math={r`(e^x)'' = e^x`} />.
				{#snippet solution()}<p>On <Katex math={r`D_2`} />: <Katex math={r`e^{x+d} = e^x(1 + d + d^2/2)`} />. The coefficient of <Katex math={r`d^2/2`} /> is <Katex math={r`e^x`} />, which is <Katex math={r`f''(x)/2`} />, so <Katex math={r`f''(x) = e^x`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={3}>
				Show that <Katex math={r`\frac{1}{1-d} = 1 + d`} /> on <Katex math="D" /> using the conjugate trick.
				{#snippet solution()}<p><Katex math={r`\frac{1}{1-d} = \frac{1+d}{(1-d)(1+d)} = \frac{1+d}{1 - d^2} = \frac{1+d}{1} = 1+d`} /></p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
