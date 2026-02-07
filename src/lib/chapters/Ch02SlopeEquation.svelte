<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import AlgebraMachine from '$lib/components/demos/AlgebraMachine.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch2">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 2</span>
			<h2 class="chapter-title">The Slope Equation</h2>
			<p class="chapter-tagline">Derivatives without limits. Just algebra.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In traditional calculus, finding the slope of a curve requires a painful dance with limits — taking a ratio, letting the denominator "approach" zero without ever reaching it, and hoping the expression simplifies.</p>
			<p>In Neocalculus, there is no dance. There is just algebra.</p>
		</div>

		<Callout type="theorem" title="The Slope Equation">
			<p>For <em>any</em> function <Katex math="f" /> and any infinitesimal <span class="d-highlight">d</span>, there exists a unique number <Katex math={r`f'(x)`} /> such that:</p>
			<Katex math={r`f(x + d) = f(x) + f'(x) \cdot d`} display />
			<p>The quantity <Katex math={r`f'(x)`} /> is the <strong>derivative</strong> — the coefficient of <span class="d-highlight">d</span>.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>No limits. No "approaching." Expand, simplify using <Katex math="d^2 = 0" />, and read off the answer. Let's see it work on every important function.</p>

			<h3>Polynomials</h3>
		</div>

		<!-- x² -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of x²</div>
			<div class="step"><div class="step-math"><Katex math="f(x+d) = (x+d)^2" display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 + 2xd + \textcolor{#ef4444}{d^2}`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 + 2xd`} display /></div><span class="step-note">d² = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math="f'(x) = 2x" display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<InlinePlot fn={x => x*x} domain={[-2.5, 2.5]} tangentAt={1} caption="f(x) = x² with tangent at x = 1 (slope = 2)" />

		<!-- x³ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of x³</div>
			<div class="step"><div class="step-math"><Katex math="f(x+d) = (x+d)^3 " display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^3 + 3x^2 d + \textcolor{#ef4444}{3xd^2 + d^3}`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math="= x^3 + 3x^2 d" display /></div><span class="step-note">d² = 0 kills higher terms</span></div>
			<div class="step step-result"><div class="step-math"><Katex math="f'(x) = 3x^2" display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>See the pattern? For <em>any</em> power <Katex math="x^n" />, the binomial expansion is <Katex math={r`(x+d)^n = x^n + nx^{n-1}d + \ldots`} />, and every term with <Katex math="d^2" /> or higher vanishes:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{d}{dx}\!\left(x^n\right) = nx^{n-1}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Rational and Radical Functions</h3>
			<p>Neocalculus isn't limited to polynomials. The same rule handles functions that require clever tricks in classical calculus.</p>
		</div>

		<!-- 1/x -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of 1/x</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x+d) = \frac{1}{x+d}`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{1}{x+d} \cdot \frac{x-d}{x-d} = \frac{x-d}{x^2 - \textcolor{#ef4444}{d^2}} = \frac{x-d}{x^2}`} display /></div><span class="step-note">conjugate, d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{1}{x} - \frac{d}{x^2}`} display /></div><span class="step-note">separate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`f'(x) = -\frac{1}{x^2}`} display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<!-- √x -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of √x</div>
			<div class="step"><div class="step-math"><Katex math={r`\sqrt{x+d} = \sqrt{x} + k \cdot d \quad \text{(find } k \text{)}`} display /></div><span class="step-note">assumed form</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Square: } x + d = x + 2k\sqrt{x}\,d + \textcolor{#ef4444}{k^2 d^2}`} display /></div><span class="step-note">square both sides</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x + d = x + 2k\sqrt{x}\,d`} display /></div><span class="step-note">d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`1 = 2k\sqrt{x}`} display /></div><span class="step-note">match d coefficients</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`f'(x) = \frac{1}{2\sqrt{x}}`} display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<InlinePlot fn={x => Math.sqrt(Math.max(x, 0))} domain={[0, 5]} tangentAt={1} caption="f(x) = √x with tangent at x = 1 (slope = ½)" />

		<div class="neo-prose" use:reveal>
			<h3>Trigonometric Functions</h3>
			<p>Here's where Neocalculus shines with a beautiful geometric argument.</p>
		</div>

		<!-- Infinitesimal triangle figure -->
		<Figure number="2.1" caption="A right triangle with infinitesimal angle d and hypotenuse 1. Since d² = 0, the base cos(d) = √(1-d²) = 1 exactly, and sin(d) = d exactly.">
			<svg viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:340px">
				<!-- triangle -->
				<line x1="60" y1="160" x2="280" y2="160" stroke="#1a1a2e" stroke-width="2"/>
				<line x1="280" y1="160" x2="280" y2="50" stroke="#1a1a2e" stroke-width="2"/>
				<line x1="60" y1="160" x2="280" y2="50" stroke="#a855f7" stroke-width="2.5"/>
				<!-- right angle -->
				<polyline points="265,160 265,145 280,145" fill="none" stroke="#1a1a2e" stroke-width="1.2"/>
				<!-- labels -->
				<text x="170" y="180" text-anchor="middle" font-size="13" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">cos(d) = 1</text>
				<text x="300" y="110" text-anchor="start" font-size="13" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">sin(d) = d</text>
				<text x="150" y="100" text-anchor="middle" font-size="13" font-family="Crimson Pro,serif" fill="#a855f7" font-weight="600">1</text>
				<!-- angle arc -->
				<path d="M 90 160 A 30 30 0 0 0 85 145" stroke="#a855f7" stroke-width="1.5" fill="none"/>
				<text x="100" y="148" font-size="12" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">d</text>
				<!-- note -->
				<text x="170" y="25" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94919b">Since d² = 0: base = √(1 − d²) = √1 = 1</text>
			</svg>
		</Figure>

		<!-- sin(x) -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of sin(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{For infinitesimal } d\text{: } \sin(d) = d, \quad \cos(d) = 1`} display /></div><span class="step-note">infinitesimal triangle</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sin(x+d) = \sin x \cos d + \cos x \sin d`} display /></div><span class="step-note">angle addition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \sin x \cdot 1 + \cos x \cdot d`} display /></div><span class="step-note">substitute</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\sin'(x) = \cos x`} display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<!-- cos(x) -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of cos(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`\cos(x+d) = \cos x \cos d - \sin x \sin d`} display /></div><span class="step-note">angle addition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \cos x - \sin x \cdot d`} display /></div><span class="step-note">cos(d) = 1, sin(d) = d</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\cos'(x) = -\sin x`} display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<!-- tan(x) -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of tan(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`\tan(x+d) = \frac{\sin(x+d)}{\cos(x+d)} = \frac{\sin x + \cos x \cdot d}{\cos x - \sin x \cdot d}`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{(\sin x + \cos x \, d)(\cos x + \sin x \, d)}{\cos^2 x - \textcolor{#ef4444}{\sin^2\!x\, d^2}}`} display /></div><span class="step-note">conjugate</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{\sin x \cos x + d(\cos^2\!x + \sin^2\!x)}{\cos^2 x} = \tan x + \frac{d}{\cos^2 x}`} display /></div><span class="step-note">d² = 0, simplify</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\tan'(x) = \frac{1}{\cos^2 x} = \sec^2 x`} display /></div><span class="step-note">coefficient of d ✓</span></div>
		</div>

		<InlinePlot fn={x => Math.sin(x)} domain={[-4, 4]} tangentAt={Math.PI/4} secondFn={x => Math.cos(x)} caption="sin(x) (solid) and cos(x) (dashed blue). Tangent to sin at x = π/4." />

		<div class="neo-prose" use:reveal>
			<h3>Exponential and Logarithmic Functions</h3>
		</div>

		<!-- eˣ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of eˣ</div>
			<div class="step"><div class="step-math"><Katex math={r`e^x \text{ is the unique function with } f'(x) = f(x),\; f(0) = 1`} display /></div><span class="step-note">defining property</span></div>
			<div class="step"><div class="step-math"><Katex math={r`e^{x+d} = e^x + e^x \cdot d = e^x(1+d)`} display /></div><span class="step-note">by the slope equation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{So } e^d = 1 + d \text{ for infinitesimal } d`} display /></div><span class="step-note">the infinitesimal exponential</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`(e^x)' = e^x`} display /></div><span class="step-note">equals itself ✓</span></div>
		</div>

		<!-- ln(x) -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of ln(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`y = \ln(x) \implies e^y = x`} display /></div><span class="step-note">inverse definition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`e^{y + y'd} = x + d`} display /></div><span class="step-note">nudge both sides</span></div>
			<div class="step"><div class="step-math"><Katex math={r`e^y(1 + y'\!d) = x + d`} display /></div><span class="step-note">e^(ε) = 1 + ε</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x + xy'\!d = x + d`} display /></div><span class="step-note">eʸ = x</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\ln'(x) = \frac{1}{x}`} display /></div><span class="step-note">match d coefficients ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Inverse Trigonometric Functions</h3>
			<p>The same "nudge both sides" trick that worked for ln(x) works for any inverse function. If <Katex math={r`y = f^{-1}(x)`} />, then <Katex math={r`f(y) = x`} />. Nudge both sides by <span class="d-highlight">d</span>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f'(y) \cdot y'\!d = d \implies y' = \frac{1}{f'(y)}`} display />
		</div>

		<!-- arcsin -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of arcsin(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`y = \arcsin(x) \implies \sin(y) = x`} display /></div><span class="step-note">inverse definition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\cos(y) \cdot y'\!d = d`} display /></div><span class="step-note">nudge: sin'(y) = cos(y)</span></div>
			<div class="step"><div class="step-math"><Katex math={r`y' = \frac{1}{\cos(y)} = \frac{1}{\sqrt{1-\sin^2(y)}} = \frac{1}{\sqrt{1-x^2}}`} display /></div><span class="step-note">Pythagorean identity</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\arcsin'(x) = \frac{1}{\sqrt{1-x^2}}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- arctan -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Derivative of arctan(x)</div>
			<div class="step"><div class="step-math"><Katex math={r`y = \arctan(x) \implies \tan(y) = x`} display /></div><span class="step-note">inverse definition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sec^2(y) \cdot y'\!d = d`} display /></div><span class="step-note">nudge: tan'(y) = sec²(y)</span></div>
			<div class="step"><div class="step-math"><Katex math={r`y' = \frac{1}{\sec^2(y)} = \frac{1}{1+\tan^2(y)} = \frac{1}{1+x^2}`} display /></div><span class="step-note">identity</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\arctan'(x) = \frac{1}{1+x^2}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- Derivative Summary Table -->
		<Callout type="key-idea" title="Complete Derivative Table">
			<table class="neo-table">
				<thead><tr><th>Function</th><th>Derivative</th></tr></thead>
				<tbody>
					<tr><td><Katex math="x^n" /></td><td><Katex math={r`nx^{n-1}`} /></td></tr>
					<tr><td><Katex math={r`\sin x`} /></td><td><Katex math={r`\cos x`} /></td></tr>
					<tr><td><Katex math={r`\cos x`} /></td><td><Katex math={r`-\sin x`} /></td></tr>
					<tr><td><Katex math={r`\tan x`} /></td><td><Katex math={r`\sec^2 x`} /></td></tr>
					<tr><td><Katex math="e^x" /></td><td><Katex math="e^x" /></td></tr>
					<tr><td><Katex math={r`\ln x`} /></td><td><Katex math={r`1/x`} /></td></tr>
					<tr><td><Katex math={r`\arcsin x`} /></td><td><Katex math={r`1/\sqrt{1-x^2}`} /></td></tr>
					<tr><td><Katex math={r`\arctan x`} /></td><td><Katex math={r`1/(1+x^2)`} /></td></tr>
				</tbody>
			</table>
			<p style="font-size:0.9rem;margin-top:0.5rem;">Every one of these was derived from a single rule: <Katex math="d^2 = 0" />.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Try any of these interactively — pick a function, step through the algebra, and verify numerically:</p>
		</div>
	</div>

	<div use:reveal>
		<AlgebraMachine />
	</div>

	<div class="content-width">
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Use <Katex math="d^2 = 0" /> to find the derivative of <Katex math={r`f(x) = x^4`} />.
				{#snippet solution()}<Katex math={r`(x+d)^4 = x^4 + 4x^3 d + \ldots = x^4 + 4x^3 d. \text{ So } f'(x)=4x^3.`} display />{/snippet}
			</Exercise>
			<Exercise number={2}>
				Find <Katex math={r`f'(x)`} /> for <Katex math={r`f(x) = x^2 + 3x`} />.
				{#snippet solution()}<Katex math={r`(x+d)^2 + 3(x+d) = x^2 + 2xd + 3x + 3d = (x^2+3x) + (2x+3)d. \text{ So } f'(x)=2x+3.`} display />{/snippet}
			</Exercise>
			<Exercise number={3}>
				Derive the derivative of <Katex math={r`\arccos(x)`} /> using the inverse function technique.
				{#snippet solution()}<p><Katex math={r`y = \arccos(x) \implies \cos(y) = x`} />. Nudge: <Katex math={r`-\sin(y) \cdot y'd = d`} />, so <Katex math={r`y' = -1/\sin(y) = -1/\sqrt{1-x^2}`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={4}>
				Show that <Katex math={r`(e^{2x})' = 2e^{2x}`} /> using the fact that <Katex math={r`e^d = 1 + d`} />.
				{#snippet solution()}<p><Katex math={r`e^{2(x+d)} = e^{2x+2d} = e^{2x} \cdot e^{2d} = e^{2x}(1+2d)`} />. Coefficient of d is <Katex math={r`2e^{2x}`} />.</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
