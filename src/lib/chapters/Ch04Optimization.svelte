<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch4">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 4</span>
			<h2 class="chapter-title">Applications of Derivatives</h2>
			<p class="chapter-tagline">Optimization, curve sketching, and the power of linear approximation.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Now that we can compute derivatives of any function, let's use them. The derivative tells us how a function changes — and that unlocks the ability to find peaks, valleys, sketch curves, and approximate values.</p>

			<h3>Stationary Points and Optimization</h3>
			<p>In Neocalculus, a <strong>stationary point</strong> has a beautifully clean definition: a point <Katex math="a" /> where the function doesn't change at all in the infinitesimal neighborhood.</p>
		</div>

		<Callout type="definition" title="Stationary Point">
			<p>A point <Katex math="a" /> is a stationary point of <Katex math="f" /> if <Katex math={r`f(a + d) = f(a)`} /> for all infinitesimal <span class="d-highlight">d</span>. This means the infinitesimal neighborhood is <strong>flat</strong>.</p>
			<p>By the slope equation: <Katex math={r`f(a) + f'(a)\,d = f(a)`} />, so <Katex math={r`f'(a)\,d = 0`} /> for all <span class="d-highlight">d</span>, hence <Katex math={r`f'(a) = 0`} />.</p>
		</Callout>

		<!-- Optimization figure -->
		<Figure number="4.1" caption="At a maximum or minimum, the infinitesimal neighborhood is flat — the tangent is horizontal, meaning f'(a) = 0.">
			<svg viewBox="0 0 420 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:420px">
				<!-- curve -->
				<path d="M 40 150 Q 100 150 140 60 Q 170 -10 210 100 Q 250 190 280 130 Q 330 30 400 80" stroke="#1a1a2e" stroke-width="2" fill="none"/>
				<!-- max tangent -->
				<line x1="110" y1="55" x2="175" y2="55" stroke="#a855f7" stroke-width="2" stroke-dasharray="5,3"/>
				<circle cx="142" cy="55" r="4" fill="#a855f7"/>
				<text x="142" y="42" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">max: f'=0</text>
				<!-- infinitesimal neighborhood -->
				<rect x="130" y="48" width="25" height="14" rx="3" fill="rgba(168,85,247,0.1)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="2,2"/>
				<!-- min tangent -->
				<line x1="180" y1="105" x2="245" y2="105" stroke="#a855f7" stroke-width="2" stroke-dasharray="5,3"/>
				<circle cx="212" cy="105" r="4" fill="#a855f7"/>
				<text x="212" y="125" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">min: f'=0</text>
				<rect x="200" y="98" width="25" height="14" rx="3" fill="rgba(168,85,247,0.1)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="2,2"/>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<h3>Worked Example: Maximizing Area</h3>
			<p>A farmer has 100 meters of fencing and wants to enclose the largest rectangular area. If the sides are <Katex math="x" /> and <Katex math={r`50-x`} />, the area is <Katex math={r`A(x) = x(50-x) = 50x - x^2`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Finding the Maximum Area</div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) = 50(x+d) - (x+d)^2`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 50x + 50d - x^2 - 2xd - \textcolor{#ef4444}{d^2}`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= A(x) + (50 - 2x)\,d`} display /></div><span class="step-note">d² = 0, collect</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A'(x) = 50 - 2x = 0 \implies x = 25`} display /></div><span class="step-note">set derivative to 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`A_{\max} = 25 \times 25 = 625 \text{ m}^2`} display /></div><span class="step-note">a square! ✓</span></div>
		</div>

		<InlinePlot fn={x => x*(50-x)} domain={[0, 50]} range={[0, 700]} tangentAt={25} caption="A(x) = x(50−x). Maximum at x = 25 where the tangent is horizontal." />

		<div class="neo-prose" use:reveal>
			<h3>The Second Derivative Test</h3>
			<p>How do we know a stationary point is a max vs. a min? Use the second derivative. If <Katex math={r`f''(a) < 0`} />, the curve is concave down — it's a <strong>maximum</strong>. If <Katex math={r`f''(a) > 0`} />, it's concave up — a <strong>minimum</strong>.</p>
			<p>In our example: <Katex math={r`A''(x) = -2 < 0`} />, confirming it's a maximum.</p>

			<h3>Linear Approximation</h3>
			<p>The slope equation <Katex math={r`f(x+d) = f(x) + f'(x)d`} /> is exact for infinitesimal <span class="d-highlight">d</span>. For <em>small but finite</em> <Katex math={r`\Delta x`} />, it gives the best linear approximation:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In Neocalculus, this approximation has a clear origin: it's the slope equation with a finite number substituted for an infinitesimal. The error is proportional to <Katex math={r`(\Delta x)^2`} /> — which would be zero if <Katex math={r`\Delta x`} /> were truly infinitesimal.</p>

			<h3>L'Hopital's Rule</h3>
			<p>When <Katex math={r`f(a) = g(a) = 0`} />, the ratio <Katex math={r`f(x)/g(x)`} /> near <Katex math="a" /> can be understood infinitesimally:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">L'Hopital's Rule via Infinitesimals</div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{f(a+d)}{g(a+d)} = \frac{f(a) + f'(a)\,d}{g(a) + g'(a)\,d}`} display /></div><span class="step-note">slope equation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{0 + f'(a)\,d}{0 + g'(a)\,d} = \frac{f'(a)}{g'(a)}`} display /></div><span class="step-note">f(a) = g(a) = 0, cancel d</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\frac{f(x)}{g(x)} \bigg|_{x \to a} = \frac{f'(a)}{g'(a)}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>That's L'Hopital's rule in three lines. In traditional calculus this requires a careful proof using the Mean Value Theorem.</p>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Find the dimensions of the box with maximum volume that can be made from a 12×12 sheet by cutting squares of side <Katex math="x" /> from each corner.
				{#snippet solution()}<p><Katex math={r`V(x) = x(12-2x)^2`} />. Expanding and differentiating: <Katex math={r`V'(x) = 144 - 96x + 12x^2 = 12(x-2)(x-6)`} />. Maximum at <Katex math="x=2" />, giving volume 128.</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Use the slope equation to approximate <Katex math={r`\sqrt{4.1}`} /> without a calculator.
				{#snippet solution()}<p><Katex math={r`f(x) = \sqrt{x}`} />, <Katex math={r`f'(x) = 1/(2\sqrt{x})`} />. At <Katex math="x=4" />: <Katex math={r`\sqrt{4.1} \approx 2 + \frac{0.1}{4} = 2.025`} />. (Actual: 2.02485...)</p>{/snippet}
			</Exercise>
			<Exercise number={3}>
				Use L'Hopital's rule (infinitesimal version) to evaluate <Katex math={r`\frac{\sin x}{x}`} /> near <Katex math="x = 0" />.
				{#snippet solution()}<p><Katex math={r`\frac{\sin(0+d)}{0+d} = \frac{d}{d} = 1`} />. So the limit is 1.</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
