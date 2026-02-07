<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch9">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 9</span>
			<h2 class="chapter-title">Many Dimensions</h2>
			<p class="chapter-tagline">Partial derivatives, gradients, and the geometry of surfaces.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>When a function depends on multiple variables, like <Katex math={r`f(x, y)`} />, we can nudge each variable by its own infinitesimal. The Neocalculus framework extends beautifully to many dimensions.</p>

			<h3>Partial Derivatives</h3>
			<p>Nudge <Katex math="x" /> by <Katex math={r`d_1`} /> and <Katex math="y" /> by <Katex math={r`d_2`} />, where <Katex math={r`d_1^2 = d_2^2 = d_1 d_2 = 0`} /> (they belong to <Katex math={r`D(2)`} />):</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d_1,\, y + d_2) = f(x,y) + \frac{\partial f}{\partial x}\,d_1 + \frac{\partial f}{\partial y}\,d_2`} display />
		</div>

		<!-- D(2) cross figure -->
		<Figure number="9.1" caption="The infinitesimal cross D(2): two infinitesimal directions d₁ and d₂ where not only d₁² = d₂² = 0, but also d₁d₂ = 0. This isolates each partial derivative.">
			<svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:300px">
				<!-- surface sketch -->
				<path d="M 30 140 Q 80 100 150 80 Q 220 60 280 90" stroke="#e5e1d8" stroke-width="1.5" fill="none"/>
				<path d="M 80 160 Q 130 120 200 100 Q 240 90 270 100" stroke="#e5e1d8" stroke-width="1" fill="none"/>
				<!-- point -->
				<circle cx="150" cy="80" r="4" fill="#1a1a2e"/>
				<!-- d1 direction -->
				<line x1="150" y1="80" x2="210" y2="65" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arr2)"/>
				<text x="215" y="58" font-size="11" font-family="Crimson Pro,serif" fill="#3b82f6" font-style="italic">d₁</text>
				<!-- d2 direction -->
				<line x1="150" y1="80" x2="170" y2="130" stroke="#059669" stroke-width="2.5" marker-end="url(#arr2)"/>
				<text x="178" y="135" font-size="11" font-family="Crimson Pro,serif" fill="#059669" font-style="italic">d₂</text>
				<!-- labels -->
				<text x="150" y="170" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#94919b">d₁² = d₂² = d₁d₂ = 0</text>
				<text x="137" y="72" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e">(x, y)</text>
				<defs><marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="currentColor"/></marker></defs>
			</svg>
		</Figure>

		<Callout type="definition" title="The Infinitesimal Cross D(2)">
			<p><Katex math={r`D(2) = \{(d_1, d_2) \in \mathcal{R}^2 : d_1^2 = d_2^2 = d_1 d_2 = 0\}`} /></p>
			<p>The condition <Katex math={r`d_1 d_2 = 0`} /> ensures the formula above has <em>no</em> mixed second-derivative terms — it captures the gradient alone.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Partial derivatives of f(x,y) = x²y</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x+d_1, y+d_2) = (x+d_1)^2(y+d_2)`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= (x^2 + 2xd_1)(y + d_2)`} display /></div><span class="step-note">d₁² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 y + 2xy\,d_1 + x^2\,d_2 + \textcolor{#ef4444}{2xd_1 d_2}`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 y + 2xy\,d_1 + x^2\,d_2`} display /></div><span class="step-note">d₁d₂ = 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`f_x = 2xy, \quad f_y = x^2`} display /></div><span class="step-note">coefficients ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>The Gradient</h3>
			<p>The <strong>gradient</strong> <Katex math={r`\nabla f = (f_x, f_y)`} /> points in the direction of steepest ascent. Its magnitude is the rate of greatest increase. In Neocalculus, the gradient naturally emerges as the coefficients of the infinitesimal cross.</p>

			<h3>Lagrange Multipliers (SDG Style)</h3>
			<p>To optimize <Katex math={r`f(x,y)`} /> subject to <Katex math={r`g(x,y) = k`} />, we require that <Katex math={r`f(x+d_1, y+d_2) = f(x,y)`} /> for all infinitesimal <Katex math={r`(d_1, d_2)`} /> satisfying the constraint <Katex math={r`g(x+d_1, y+d_2) = g(x,y)`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Optimal Cylinder (from O'Connor)</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Minimize } f(r,h) = 2\pi rh + 2\pi r^2 \text{ subject to } g(r,h) = \pi r^2 h = k`} display /></div><span class="step-note">surface area, fixed volume</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Constraint: } 2rh\,d_1 + r^2\,d_2 = 0 \implies d_1 = -\frac{r}{2h}\,d_2`} display /></div><span class="step-note">nudge constraint</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Stationarity: } (2\pi h + 4\pi r)\,d_1 + 2\pi r\,d_2 = 0`} display /></div><span class="step-note">nudge objective</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Substitute } d_1 \text{ and cancel } d_2 \text{: solve for } h = 2r`} display /></div><span class="step-note">microcancellation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\text{The optimal can has height = diameter: } h = 2r`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Tangent Vectors as Microsegments</h3>
			<p>In Neocalculus, a <strong>tangent vector</strong> at a point <Katex math="m" /> on a space <Katex math="M" /> is simply a map <Katex math={r`t \colon D \to M`} /> with <Katex math={r`t(0) = m`} />. It's an infinitesimal path — a microsegment placed on the space, too short to bend. The collection of all tangent vectors at <Katex math="m" /> forms the <strong>tangent space</strong> <Katex math={r`T_m M`} />.</p>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Find the partial derivatives of <Katex math={r`f(x,y) = \sin(x)\,e^y`} /> using infinitesimal nudging.
				{#snippet solution()}<p><Katex math={r`f(x+d_1, y+d_2) = (\sin x + \cos x\,d_1)(e^y + e^y d_2) = \sin x\,e^y + \cos x\,e^y\,d_1 + \sin x\,e^y\,d_2`} />. So <Katex math={r`f_x = \cos x\,e^y`} />, <Katex math={r`f_y = \sin x\,e^y`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Find the gradient of <Katex math={r`f(x,y) = x^2 + y^2`} /> and explain geometrically what direction it points.
				{#snippet solution()}<p><Katex math={r`\nabla f = (2x, 2y)`} />. It points radially outward — the direction of steepest increase of the paraboloid.</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
