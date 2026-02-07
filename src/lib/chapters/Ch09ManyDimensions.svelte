<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupContourGradient(JXG: any, board: any) {
		// Contour lines of f(x,y) = x² + y² (circles)
		for (let rad = 0.8; rad <= 3.2; rad += 0.6) {
			board.create('circle', [[0, 0], rad], {
				strokeColor: '#e5e1d8', strokeWidth: 1, fixed: true,
				fillColor: 'none', highlight: false, dash: 0
			});
		}

		// Moveable point where we evaluate the gradient
		const pt = board.create('point', [1.5, 1], {
			size: 5, fillColor: '#1a1a2e', strokeColor: '#1a1a2e',
			name: '(x, y)', label: { fontSize: 13, offset: [8, 8] },
			fixed: false, highlight: true
		});

		// d₁ direction (along x-axis from the point)
		board.create('arrow', [
			() => [pt.X(), pt.Y()],
			() => [pt.X() + 1.0, pt.Y()]
		], { strokeColor: '#3b82f6', strokeWidth: 3, highlight: false });
		board.create('text', [
			() => pt.X() + 1.15, () => pt.Y(), 'd₁'
		], { fontSize: 14, color: '#3b82f6', fontStyle: 'italic', fontWeight: 'bold', highlight: false });

		// d₂ direction (along y-axis from the point)
		board.create('arrow', [
			() => [pt.X(), pt.Y()],
			() => [pt.X(), pt.Y() + 1.0]
		], { strokeColor: '#059669', strokeWidth: 3, highlight: false });
		board.create('text', [
			() => pt.X() - 0.05, () => pt.Y() + 1.2, 'd₂'
		], { fontSize: 14, color: '#059669', fontStyle: 'italic', fontWeight: 'bold', anchorX: 'middle', highlight: false });

		// Gradient vector (points radially outward for f = x²+y²)
		const gradScale = 0.35;
		board.create('arrow', [
			() => [pt.X(), pt.Y()],
			() => [pt.X() + 2 * pt.X() * gradScale, pt.Y() + 2 * pt.Y() * gradScale]
		], { strokeColor: '#a855f7', strokeWidth: 2.5, dash: 2, highlight: false });
		board.create('text', [
			() => pt.X() + 2 * pt.X() * gradScale + 0.15,
			() => pt.Y() + 2 * pt.Y() * gradScale + 0.15, '∇f'
		], { fontSize: 14, color: '#a855f7', fontWeight: 'bold', highlight: false });

		// Caption
		board.create('text', [0, -3.3, 'Contours of f(x,y) = x² + y². Drag the point. ∇f always points radially outward, perpendicular to contours.'], {
			fontSize: 10, color: '#94919b', anchorX: 'middle', highlight: false
		});
	}
</script>

<section class="chapter" id="ch9">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 9</span>
			<h2 class="chapter-title">Many Dimensions</h2>
			<p class="chapter-tagline">Partial derivatives, gradients, and the geometry of surfaces — where infinitesimals fan out in every direction.</p>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION 1: Motivation ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Beyond a single variable</h3>
			<p>Until now, every function we've studied has taken one number in and produced one number out. But the real world rarely cooperates with such simplicity. Temperature depends on <em>position</em> — both <Katex math="x" /> and <Katex math="y" /> (and maybe <Katex math="z" />). The altitude of a mountain depends on where you stand on the map. Air pressure depends on longitude, latitude, and altitude. The profit of a company depends on price, advertising budget, and production cost — all at once.</p>
			<p>Functions of several variables arise everywhere. A function <Katex math={r`f(x,y)`} /> assigns a number to each point of the plane; a function <Katex math={r`f(x,y,z)`} /> assigns a number to each point in space. The question that drove all of single-variable calculus — <em>how does the output respond when you nudge the input?</em> — now becomes richer, because you can nudge <Katex math="x" /> and <Katex math="y" /> independently, or in any diagonal direction at once.</p>
			<p>The Neocalculus framework extends beautifully to this setting. We simply allow <em>multiple</em> infinitesimals, each nudging a different variable — and the algebra does the rest.</p>
		</div>

		<!-- ═══ SECTION 2: D(2) and partial derivatives ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The infinitesimal cross <Katex math={r`D(2)`} /> and partial derivatives</h3>
			<p>In one dimension, we nudged <Katex math="x" /> by a single infinitesimal <Katex math="d" /> with <Katex math="d^2 = 0" />. In two dimensions, we introduce <em>two</em> independent infinitesimals <Katex math={r`d_1`} /> and <Katex math={r`d_2`} />, one for each variable. But we need a crucial extra condition:</p>
		</div>

		<Callout type="definition" title="The Infinitesimal Cross D(2)">
			<p><Katex math={r`D(2) = \{(d_1, d_2) \in \mathcal{R}^2 : d_1^2 = d_2^2 = d_1 d_2 = 0\}`} /></p>
			<p>Each infinitesimal squares to zero (as before), and their product <Katex math={r`d_1 d_2`} /> is also zero. This means <Katex math={r`D(2)`} /> is not a tiny square — it is a tiny <strong>cross</strong>, consisting only of infinitesimal motions along each axis. It captures first-order information in each direction, but no mixed information.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Now apply the Kock-Lawvere axiom in two dimensions. For any smooth function <Katex math={r`f \colon \mathcal{R}^2 \to \mathcal{R}`} /> and any <Katex math={r`(d_1, d_2) \in D(2)`} />, we can write:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d_1,\, y + d_2) = f(x,y) + \frac{\partial f}{\partial x}\,d_1 + \frac{\partial f}{\partial y}\,d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is the <strong>multivariable slope equation</strong>. The coefficients <Katex math={r`\partial f / \partial x`} /> and <Katex math={r`\partial f / \partial y`} /> are the <strong>partial derivatives</strong>: the rate of change of <Katex math="f" /> when you nudge <Katex math="x" /> alone (holding <Katex math="y" /> fixed) and <Katex math="y" /> alone (holding <Katex math="x" /> fixed), respectively.</p>
			<p>Why does the condition <Katex math={r`d_1 d_2 = 0`} /> matter? Without it, expanding <Katex math={r`f(x + d_1, y + d_2)`} /> could produce a mixed term involving <Katex math={r`d_1 d_2`} />. That mixed term would bring in second-derivative information (the mixed partial <Katex math={r`f_{xy}`} />), and the slope equation above would no longer be correct. The condition <Katex math={r`d_1 d_2 = 0`} /> filters that out, leaving us with the gradient alone.</p>
		</div>

		<!-- Contour + gradient figure -->
		<div use:reveal>
			<JSXGraphBoard
				setup={setupContourGradient}
				boundingbox={[-3.5, 3.5, 3.5, -3.5]}
				aspectRatio={1}
				number="9.1"
				caption="Contour plot of f(x,y) = x²+y². At the point (x,y), the infinitesimal directions d₁ (blue, along x) and d₂ (green, along y) capture each partial derivative. The gradient ∇f (purple dashed) points perpendicular to the contours — drag the point to see."
			/>
		</div>

		<!-- Worked example: partial derivatives of x²y -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Partial derivatives of f(x,y) = x²y</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x+d_1, y+d_2) = (x+d_1)^2(y+d_2)`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= (x^2 + 2xd_1 + \cancel{d_1^2})(y + d_2)`} display /></div><span class="step-note"><Katex math={r`d_1^2 = 0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= (x^2 + 2xd_1)(y + d_2)`} display /></div><span class="step-note">simplify</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 y + 2xy\,d_1 + x^2\,d_2 + \cancel{2x\,d_1 d_2}`} display /></div><span class="step-note"><Katex math={r`d_1 d_2 = 0`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= x^2 y + \underbrace{2xy}_{f_x}\,d_1 + \underbrace{x^2}_{f_y}\,d_2`} display /></div><span class="step-note">read off coefficients ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Just as in single-variable calculus, we simply expanded, applied the nilpotency conditions, and read off the coefficients. The partial derivative <Katex math={r`f_x = 2xy`} /> tells us how <Katex math="f" /> changes when <Katex math="x" /> increases slightly while <Katex math="y" /> stays fixed; <Katex math={r`f_y = x^2`} /> tells us the same for <Katex math="y" />.</p>
		</div>

		<!-- ═══ SECTION 3: Directional derivatives ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Directional derivatives</h3>
			<p>Partial derivatives measure the rate of change along the coordinate axes. But what if you want the rate of change in some <em>other</em> direction — say, at a 45° angle, or toward the northeast?</p>
			<p>Let <Katex math={r`\mathbf{v} = (v_1, v_2)`} /> be a unit vector pointing in the direction you care about. Nudge the point <Katex math={r`(x,y)`} /> by an infinitesimal amount <Katex math="d" /> in that direction:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d\,v_1,\; y + d\,v_2) = f(x,y) + \bigl(f_x \, v_1 + f_y \, v_2\bigr)\,d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Why does this work? Because <Katex math={r`d\,v_1`} /> and <Katex math={r`d\,v_2`} /> are both infinitesimal (each squares to zero since <Katex math={r`(dv_1)^2 = v_1^2 d^2 = 0`} />), and their product <Katex math={r`d^2 v_1 v_2 = 0`} /> as well. So the pair <Katex math={r`(d\,v_1, d\,v_2)`} /> belongs to <Katex math={r`D(2)`} />, and the slope equation applies.</p>
			<p>The coefficient of <Katex math="d" /> is the <strong>directional derivative</strong>:</p>
		</div>

		<Callout type="definition" title="Directional Derivative">
			<p>The directional derivative of <Katex math={r`f`} /> at <Katex math={r`(x,y)`} /> in the direction of a unit vector <Katex math={r`\mathbf{v} = (v_1, v_2)`} /> is</p>
			<Katex math={r`D_{\mathbf{v}} f = f_x \, v_1 + f_y \, v_2 = \nabla f \cdot \mathbf{v}`} display />
			<p>It is simply the dot product of the gradient with the direction vector.</p>
		</Callout>

		<!-- Worked example: directional derivative -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Directional derivative of f(x,y) = x² + xy</div>
			<div class="step"><div class="step-math"><Katex math={r`\nabla f = (2x + y,\; x)`} display /></div><span class="step-note">compute partials</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\mathbf{v} = \left(\tfrac{1}{\sqrt{2}},\; \tfrac{1}{\sqrt{2}}\right)`} display /></div><span class="step-note">direction: 45° northeast</span></div>
			<div class="step"><div class="step-math"><Katex math={r`D_{\mathbf{v}} f = (2x+y)\,\tfrac{1}{\sqrt{2}} + x\,\tfrac{1}{\sqrt{2}} = \frac{3x + y}{\sqrt{2}}`} display /></div><span class="step-note">dot product</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\text{At } (1,2)\!: \quad D_{\mathbf{v}} f = \frac{3+2}{\sqrt{2}} = \frac{5}{\sqrt{2}} = \frac{5\sqrt{2}}{2}`} display /></div><span class="step-note">evaluate ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Let's verify this by direct infinitesimal nudging. At <Katex math={r`(1,2)`} />, nudge by <Katex math={r`d/\!\sqrt{2}`} /> in both coordinates:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Verification — direct nudge</div>
			<div class="step"><div class="step-math"><Katex math={r`f\!\left(1 + \tfrac{d}{\sqrt{2}},\; 2 + \tfrac{d}{\sqrt{2}}\right) = \left(1 + \tfrac{d}{\sqrt{2}}\right)^{\!2} + \left(1 + \tfrac{d}{\sqrt{2}}\right)\!\left(2 + \tfrac{d}{\sqrt{2}}\right)`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 1 + \tfrac{2d}{\sqrt{2}} + 2 + \tfrac{d}{\sqrt{2}} + \tfrac{2d}{\sqrt{2}} = 3 + \frac{5d}{\sqrt{2}}`} display /></div><span class="step-note"><Katex math={r`d^2 = 0`} /> throughout</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= f(1,2) + \frac{5}{\sqrt{2}}\,d \quad\checkmark`} display /></div><span class="step-note">coefficient matches ✓</span></div>
		</div>

		<!-- ═══ SECTION 4: The gradient ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The gradient</h3>
			<p>The partial derivatives package together into a single vector, the <strong>gradient</strong>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\nabla f = \left(\frac{\partial f}{\partial x},\; \frac{\partial f}{\partial y}\right)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The gradient is more than a convenient notation — it has two fundamental geometric properties that we can prove directly from the infinitesimal framework.</p>
		</div>

		<Callout type="theorem" title="The Gradient is Perpendicular to Level Curves">
			<p>If <Katex math={r`f`} /> is constant along a curve <Katex math={r`\gamma`} /> (a <em>level curve</em>), then <Katex math={r`\nabla f`} /> is perpendicular to <Katex math={r`\gamma`} /> at every point.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Proof — ∇f ⊥ level curves</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Along a level curve: } f\bigl(x + dx,\, y + dy\bigr) = f(x,y)`} display /></div><span class="step-note"><Katex math="f" /> is constant</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f(x,y) + f_x\,dx + f_y\,dy = f(x,y)`} display /></div><span class="step-note">slope equation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f_x\,dx + f_y\,dy = 0`} display /></div><span class="step-note">cancel <Katex math={r`f(x,y)`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\nabla f \cdot d\mathbf{r} = 0 \implies \nabla f \perp d\mathbf{r}`} display /></div><span class="step-note"><Katex math={r`d\mathbf{r} = (dx, dy)`} /> is tangent to the curve ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Since <Katex math={r`d\mathbf{r}`} /> is an infinitesimal tangent vector along the level curve, and <Katex math={r`\nabla f \cdot d\mathbf{r} = 0`} />, the gradient is perpendicular to the level curve. Look at Figure 9.1 — the purple gradient arrow always points straight outward from the circular contours, at right angles.</p>
		</div>

		<Callout type="theorem" title="The Gradient Points in the Direction of Steepest Ascent">
			<p>Among all unit directions <Katex math={r`\mathbf{v}`} />, the directional derivative <Katex math={r`D_{\mathbf{v}} f = \nabla f \cdot \mathbf{v}`} /> is maximized when <Katex math={r`\mathbf{v}`} /> points in the same direction as <Katex math={r`\nabla f`} />.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Proof — steepest ascent</div>
			<div class="step"><div class="step-math"><Katex math={r`D_{\mathbf{v}} f = \nabla f \cdot \mathbf{v} = |\nabla f|\,|\mathbf{v}|\,\cos\theta = |\nabla f|\cos\theta`} display /></div><span class="step-note"><Katex math={r`|\mathbf{v}| = 1`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`\cos\theta \leq 1, \text{ with equality when } \theta = 0`} display /></div><span class="step-note">Cauchy–Schwarz / geometry</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`D_{\mathbf{v}} f \leq |\nabla f|, \text{ maximum achieved when } \mathbf{v} \parallel \nabla f`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>So the gradient tells you both the direction of fastest increase <em>and</em> the rate of that increase. If you're hiking on a mountain and want to go uphill as steeply as possible, follow the gradient. If you want to stay at the same altitude, walk perpendicular to it — along a contour line.</p>
		</div>

		<!-- ═══ SECTION 5: Multivariable chain rule ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The multivariable chain rule</h3>
			<p>Suppose <Katex math="x" /> and <Katex math="y" /> are not independent, but both depend on a parameter <Katex math="t" />: say <Katex math={r`x = g(t)`} /> and <Katex math={r`y = h(t)`} />. Then <Katex math={r`F(t) = f\bigl(g(t), h(t)\bigr)`} /> is a function of <Katex math="t" /> alone. What is its derivative?</p>
			<p>The SDG answer is immediate. Nudge <Katex math="t" /> by an infinitesimal <Katex math="d" />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving the multivariable chain rule</div>
			<div class="step"><div class="step-math"><Katex math={r`g(t + d) = g(t) + g'(t)\,d, \quad h(t + d) = h(t) + h'(t)\,d`} display /></div><span class="step-note">single-variable KL axiom</span></div>
			<div class="step"><div class="step-math"><Katex math={r`F(t + d) = f\bigl(g(t) + g'(t)\,d,\; h(t) + h'(t)\,d\bigr)`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f\bigl(g(t),h(t)\bigr) + f_x \cdot g'(t)\,d + f_y \cdot h'(t)\,d`} display /></div><span class="step-note">multivariable slope equation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`F'(t) = f_x\,g'(t) + f_y\,h'(t) = \nabla f \cdot \mathbf{r}'(t)`} display /></div><span class="step-note">coefficient of <Katex math="d" /> ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The derivative of the composition is the dot product of the gradient of <Katex math="f" /> with the velocity vector <Katex math={r`\mathbf{r}'(t) = (g'(t), h'(t))`} />. In matrix form:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{dF}{dt} = \begin{pmatrix} f_x & f_y \end{pmatrix} \begin{pmatrix} g'(t) \\ h'(t) \end{pmatrix}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is a <Katex math={r`1 \times 2`} /> matrix times a <Katex math={r`2 \times 1`} /> vector — the chain rule is matrix multiplication. This observation generalizes: if <Katex math={r`f \colon \mathcal{R}^n \to \mathcal{R}^m`} /> and <Katex math={r`g \colon \mathcal{R}^k \to \mathcal{R}^n`} />, the derivative of <Katex math={r`f \circ g`} /> is the product of their Jacobian matrices.</p>
		</div>

		<!-- Worked chain-rule example -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Chain rule with parametric curves</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x,y) = x^2 + y, \quad x(t) = \sin t, \quad y(t) = t^2`} display /></div><span class="step-note">setup</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\nabla f = (2x,\; 1), \quad \mathbf{r}'(t) = (\cos t,\; 2t)`} display /></div><span class="step-note">compute pieces</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{dF}{dt} = 2\sin t \cdot \cos t + 1 \cdot 2t = \sin 2t + 2t`} display /></div><span class="step-note">dot product</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\frac{d}{dt}\bigl(\sin^2 t + t^2\bigr) = \sin 2t + 2t \quad\checkmark`} display /></div><span class="step-note">agrees with direct differentiation ✓</span></div>
		</div>

		<!-- Implicit differentiation example -->
		<div class="neo-prose" use:reveal>
			<h4>Application: implicit differentiation</h4>
			<p>The chain rule gives us implicit differentiation for free. Suppose <Katex math={r`x^2 + y^2 = 1`} /> defines <Katex math="y" /> as a function of <Katex math="x" />. Nudge <Katex math="x" /> by <Katex math="d" />; then <Katex math="y" /> changes by <Katex math={r`y'(x)\,d`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Implicit differentiation: x² + y² = 1</div>
			<div class="step"><div class="step-math"><Katex math={r`(x + d)^2 + (y + y'd)^2 = 1`} display /></div><span class="step-note">nudge by <Katex math="d" /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`x^2 + 2xd + y^2 + 2yy'd = 1`} display /></div><span class="step-note"><Katex math={r`d^2 = 0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`(2x + 2yy')\,d = 0`} display /></div><span class="step-note">use <Katex math={r`x^2 + y^2 = 1`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`y' = -\frac{x}{y}`} display /></div><span class="step-note">microcancellation ✓</span></div>
		</div>

		<!-- ═══ SECTION 6: Hessian and second-order information ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Second derivatives and the Hessian</h3>
			<p>To capture second-order information, we need a <em>larger</em> infinitesimal neighborhood. Recall that <Katex math={r`D(2)`} /> killed the mixed product <Katex math={r`d_1 d_2`} />, which prevented any second-derivative terms from appearing. To see those terms, we relax that condition:</p>
		</div>

		<Callout type="definition" title="The Second-Order Infinitesimal Square D₂(2)">
			<p><Katex math={r`D_2(2) = \{(d_1, d_2) \in \mathcal{R}^2 : d_1^2 = d_2^2 = 0, \text{ but } d_1 d_2 \text{ not necessarily zero}\}`} /></p>
			<p>Now <Katex math={r`d_1 d_2`} /> is a nonzero "second-order infinitesimal" — it satisfies <Katex math={r`(d_1 d_2)^2 = d_1^2 d_2^2 = 0`} />, but it is not itself zero. It can carry information about curvature.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>For <Katex math={r`(d_1, d_2) \in D_2(2)`} />, the full second-order expansion of a smooth function is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x+d_1,\,y+d_2) = f(x,y) + f_x\,d_1 + f_y\,d_2 + f_{xy}\,d_1\,d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice that the terms <Katex math={r`f_{xx}\,d_1^2`} /> and <Katex math={r`f_{yy}\,d_2^2`} /> still vanish (since <Katex math={r`d_1^2 = d_2^2 = 0`} />). The only surviving second-order term involves the <strong>mixed partial</strong> <Katex math={r`f_{xy}`} />.</p>
			<p>To capture the full <strong>Hessian matrix</strong>, we need multiple second-order probes. The Hessian is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`H_f = \begin{pmatrix} f_{xx} & f_{xy} \\ f_{yx} & f_{yy} \end{pmatrix}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>For smooth functions, <Katex math={r`f_{xy} = f_{yx}`} /> (the mixed partials are equal). The Hessian governs whether a critical point (where <Katex math={r`\nabla f = 0`} />) is a maximum, minimum, or saddle point:</p>
		</div>

		<Callout type="theorem" title="Second Derivative Test (2D)">
			<p>At a critical point <Katex math={r`(a,b)`} /> where <Katex math={r`\nabla f(a,b) = 0`} />, let <Katex math={r`\Delta = f_{xx} f_{yy} - f_{xy}^2 = \det(H_f)`} />.</p>
			<ul>
				<li>If <Katex math={r`\Delta > 0`} /> and <Katex math={r`f_{xx} > 0`} />: <strong>local minimum</strong></li>
				<li>If <Katex math={r`\Delta > 0`} /> and <Katex math={r`f_{xx} < 0`} />: <strong>local maximum</strong></li>
				<li>If <Katex math={r`\Delta < 0`} />: <strong>saddle point</strong></li>
			</ul>
			<p>The determinant <Katex math={r`\Delta`} /> measures how the curvatures in different directions interact.</p>
		</Callout>

		<!-- ═══ SECTION 7: Lagrange multipliers ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Lagrange multipliers (SDG style)</h3>
			<p>One of the most important optimization techniques in mathematics and its applications is <strong>constrained optimization</strong>: finding the extremum of a function <Katex math={r`f(x,y)`} /> subject to a constraint <Katex math={r`g(x,y) = k`} />.</p>
			<p>The geometric idea is beautiful: at the constrained optimum, the level curves of <Katex math="f" /> and <Katex math="g" /> must be tangent. If they weren't, you could slide along the constraint curve and find a better value of <Katex math="f" />. Tangency means their gradients are parallel: <Katex math={r`\nabla f = \lambda \nabla g`} /> for some scalar <Katex math={r`\lambda`} />.</p>
			<p>In SDG, we see this directly. At a constrained extremum, every infinitesimal displacement <Katex math={r`(d_1, d_2)`} /> that satisfies the constraint must also leave <Katex math="f" /> unchanged:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">SDG derivation of the Lagrange condition</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Constraint: } g_x\,d_1 + g_y\,d_2 = 0`} display /></div><span class="step-note">infinitesimal constraint</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Stationarity: } f_x\,d_1 + f_y\,d_2 = 0`} display /></div><span class="step-note">optimality condition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Both } \nabla f \cdot d\mathbf{r} = 0 \text{ and } \nabla g \cdot d\mathbf{r} = 0 \text{ for the same } d\mathbf{r}`} display /></div><span class="step-note">same null direction</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\nabla f = \lambda\,\nabla g \text{ for some scalar } \lambda`} display /></div><span class="step-note">gradients must be parallel ✓</span></div>
		</div>

		<!-- Optimal cylinder example -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Optimal cylinder (from O'Connor)</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Minimize } f(r,h) = 2\pi rh + 2\pi r^2 \text{ subject to } g(r,h) = \pi r^2 h = k`} display /></div><span class="step-note">surface area, fixed volume</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Constraint: } g_r\,d_1 + g_h\,d_2 = 2\pi rh\,d_1 + \pi r^2\,d_2 = 0`} display /></div><span class="step-note">nudge constraint</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\implies d_1 = -\frac{r}{2h}\,d_2`} display /></div><span class="step-note">solve for <Katex math={r`d_1`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Stationarity: } (2\pi h + 4\pi r)\,d_1 + 2\pi r\,d_2 = 0`} display /></div><span class="step-note">nudge objective</span></div>
			<div class="step"><div class="step-math"><Katex math={r`(2\pi h + 4\pi r)\!\left(-\frac{r}{2h}\right)d_2 + 2\pi r\,d_2 = 0`} display /></div><span class="step-note">substitute <Katex math={r`d_1`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\text{Cancel } d_2 \text{ (microcancellation), solve: } h = 2r`} display /></div><span class="step-note">optimal can: height = diameter ✓</span></div>
		</div>

		<!-- ═══ SECTION 8: Multiple integrals ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Double integrals: summing over infinitesimal tiles</h3>
			<p>In single-variable calculus, we defined the integral as the sum of infinitesimal rectangles <Katex math={r`f(x)\,d`} />. The same idea extends to two dimensions. Tile the plane with infinitesimal rectangles of width <Katex math={r`d_1`} /> and height <Katex math={r`d_2`} />. Each tile has area:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`dA = d_1 \cdot d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Note: here <Katex math={r`d_1`} /> and <Katex math={r`d_2`} /> are independent infinitesimals where <Katex math={r`d_1 d_2 \neq 0`} /> — they do <em>not</em> belong to <Katex math={r`D(2)`} />. This is the integration context, not the differentiation context. The product <Katex math={r`d_1 d_2`} /> is a genuine (second-order) infinitesimal area element.</p>
			<p>The <strong>double integral</strong> of <Katex math={r`f`} /> over a region <Katex math={r`R`} /> is the sum of all the infinitesimal contributions:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\iint_R f(x,y)\, dA = \iint_R f(x,y)\, d_1\, d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In practice, we evaluate double integrals by <strong>iterated integration</strong> (Fubini's theorem): integrate over one variable first, then the other.</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\iint_R f(x,y)\, dA = \int_a^b \left(\int_{c(x)}^{d(x)} f(x,y)\, dy\right) dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The inner integral treats <Katex math="x" /> as a constant and sums infinitesimal strips along <Katex math="y" />; the outer integral then sums these strips along <Katex math="x" />. The order can be swapped (for well-behaved functions and regions), often simplifying the computation.</p>
		</div>

		<!-- ═══ SECTION 9: Jacobian and change of variables ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Jacobian: how maps distort infinitesimal area</h3>
			<p>When we change coordinates — for instance, from Cartesian <Katex math={r`(x,y)`} /> to polar <Katex math={r`(r,\theta)`} /> — the infinitesimal tiles change shape. The Jacobian determinant tells us exactly how much the area of each tile is stretched or compressed.</p>
			<p>Here is the SDG derivation, and it is one of the most natural arguments in all of calculus.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving the Jacobian via the infinitesimal parallelogram</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Let } x = x(u,v), \quad y = y(u,v)`} display /></div><span class="step-note">coordinate transformation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{An infinitesimal rectangle in } (u,v)\text{-space has sides } du \text{ and } dv`} display /></div><span class="step-note">start with a tile</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Side along } u\!: \quad \left(\frac{\partial x}{\partial u}\,du,\; \frac{\partial y}{\partial u}\,du\right)`} display /></div><span class="step-note">image of <Katex math={r`du`} /> edge</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Side along } v\!: \quad \left(\frac{\partial x}{\partial v}\,dv,\; \frac{\partial y}{\partial v}\,dv\right)`} display /></div><span class="step-note">image of <Katex math={r`dv`} /> edge</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Area of parallelogram} = \left|\det\begin{pmatrix} x_u\,du & x_v\,dv \\ y_u\,du & y_v\,dv \end{pmatrix}\right|`} display /></div><span class="step-note">2D cross product</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \left|\det\begin{pmatrix} x_u & x_v \\ y_u & y_v \end{pmatrix}\right| du\,dv = |\det J|\,du\,dv`} display /></div><span class="step-note">factor out infinitesimals ✓</span></div>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, the change-of-variables formula <Katex math={r`dA = |\det J|\,du\,dv`} /> is motivated by a linearization argument: the Jacobian matrix "approximately" maps infinitesimal rectangles to parallelograms. In SDG, there is no approximation. The infinitesimal rectangle <em>exactly</em> maps to an infinitesimal parallelogram, because all functions are exactly linear over infinitesimal distances. The Jacobian formula is not an approximation — it is an identity.</p>
		</SDGAdvantage>

		<div class="neo-prose" use:reveal>
			<p>This gives the <strong>change of variables formula</strong> for double integrals:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\iint_R f(x,y)\,dx\,dy = \iint_{R'} f\bigl(x(u,v),\,y(u,v)\bigr)\,|\det J|\,du\,dv`} display />
		</div>

		<!-- Worked example: polar coordinates -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Jacobian for polar coordinates</div>
			<div class="step"><div class="step-math"><Katex math={r`x = r\cos\theta, \quad y = r\sin\theta`} display /></div><span class="step-note">polar → Cartesian</span></div>
			<div class="step"><div class="step-math"><Katex math={r`J = \begin{pmatrix} \cos\theta & -r\sin\theta \\ \sin\theta & r\cos\theta \end{pmatrix}`} display /></div><span class="step-note">compute partials</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\det J = r\cos^2\theta + r\sin^2\theta = r`} display /></div><span class="step-note">expand determinant</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`dA = dx\,dy = r\,dr\,d\theta`} display /></div><span class="step-note">the familiar polar area element ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The factor of <Katex math="r" /> is not mysterious — it reflects the fact that infinitesimal tiles far from the origin subtend a larger arc length. The infinitesimal rectangle in <Katex math={r`(r,\theta)`} />-space, with sides <Katex math={r`dr`} /> and <Katex math={r`d\theta`} />, maps to a tiny "wedge" in <Katex math={r`(x,y)`} />-space with area <Katex math={r`r\,dr\,d\theta`} />.</p>
		</div>

		<!-- ═══ SECTION 10: Double integral example ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Application: area of a disk</h3>
			<p>Let's use the polar Jacobian to compute the area of a disk of radius <Katex math="R" /> — a classic application of double integrals.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Area of a disk via polar double integral</div>
			<div class="step"><div class="step-math"><Katex math={r`A = \iint_{\text{disk}} dA = \int_0^{2\pi}\!\int_0^R r\,dr\,d\theta`} display /></div><span class="step-note">polar coordinates</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \int_0^{2\pi}\left[\frac{r^2}{2}\right]_0^R d\theta = \int_0^{2\pi} \frac{R^2}{2}\,d\theta`} display /></div><span class="step-note">inner integral</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{R^2}{2}\cdot 2\pi = \pi R^2`} display /></div><span class="step-note">outer integral ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Nothing surprising — but notice how naturally the Jacobian factor <Katex math="r" /> appeared. Without it, we would incorrectly compute <Katex math={r`\int_0^{2\pi}\int_0^R dr\,d\theta = 2\pi R`} />, which has the wrong units (length, not area). The Jacobian corrects the "distortion" introduced by the coordinate change.</p>
		</div>

		<!-- ═══ SECTION 11: Vector fields ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Vector fields</h3>
			<p>A <strong>vector field</strong> assigns a vector to each point in the plane. Formally, <Katex math={r`\mathbf{F}(x,y) = \bigl(P(x,y),\; Q(x,y)\bigr)`} /> — at each point <Katex math={r`(x,y)`} />, there is a vector <Katex math={r`(P, Q)`} /> pointing in some direction with some magnitude.</p>
			<p>Vector fields model flows and forces:</p>
			<ul>
				<li><strong>Velocity field</strong>: the velocity of a fluid at each point. Water flowing in a river; air currents in the atmosphere.</li>
				<li><strong>Gravitational field</strong>: the gravitational force per unit mass at each point in space, pointing toward the center of the attracting body.</li>
				<li><strong>Electric field</strong>: the force per unit charge. It radiates outward from positive charges and inward toward negative charges.</li>
				<li><strong>Gradient field</strong>: <Katex math={r`\mathbf{F} = \nabla f`} /> for some scalar function <Katex math="f" />. These are called <em>conservative</em> fields — we'll explore this connection deeply in Chapter 10.</li>
			</ul>
		</div>

		<!-- ═══ SECTION 12: Divergence and curl ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Divergence and curl: infinitesimal flux and circulation</h3>
			<p>Two fundamental operations on vector fields — <strong>divergence</strong> and <strong>curl</strong> — measure how the field behaves locally. SDG gives them immediate geometric meaning.</p>
		</div>

		<Callout type="definition" title="Divergence (2D)">
			<p>The <strong>divergence</strong> of <Katex math={r`\mathbf{F} = (P, Q)`} /> is</p>
			<Katex math={r`\operatorname{div} \mathbf{F} = \frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y}`} display />
			<p>It measures the <strong>net infinitesimal flux</strong> per unit area: how much the field "spreads out" from a point. If <Katex math={r`\operatorname{div} \mathbf{F} > 0`} />, the point is a source; if <Katex math={r`< 0`} />, a sink.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>To see why, consider an infinitesimal rectangle with corners at <Katex math={r`(x,y)`} />, width <Katex math={r`d_1`} />, height <Katex math={r`d_2`} />. The horizontal flux out of the right side minus the left side is <Katex math={r`P(x+d_1, y) - P(x,y) = P_x\,d_1`} />. Similarly, the vertical flux out of the top minus the bottom is <Katex math={r`Q_y\,d_2`} />. The total net flux is <Katex math={r`(P_x + Q_y)\,d_1\,d_2`} />, and dividing by the area <Katex math={r`d_1\,d_2`} /> gives <Katex math={r`P_x + Q_y`} />.</p>
		</div>

		<Callout type="definition" title="Curl (2D)">
			<p>The <strong>curl</strong> (or scalar curl) of <Katex math={r`\mathbf{F} = (P, Q)`} /> in 2D is</p>
			<Katex math={r`\operatorname{curl} \mathbf{F} = \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}`} display />
			<p>It measures the <strong>infinitesimal circulation</strong> per unit area: the tendency of the field to rotate around a point.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Consider the same infinitesimal rectangle. Walk around its boundary counterclockwise, summing <Katex math={r`\mathbf{F} \cdot d\mathbf{r}`} />: along the bottom, <Katex math={r`P\,d_1`} />; up the right side, <Katex math={r`Q(x+d_1, y)\,d_2`} />; backward along the top, <Katex math={r`-P(x, y+d_2)\,d_1`} />; down the left, <Katex math={r`-Q\,d_2`} />. The net circulation is <Katex math={r`(Q_x - P_y)\,d_1\,d_2`} />. Per unit area: <Katex math={r`Q_x - P_y`} />. This is the curl.</p>
			<p>These two operations — divergence and curl — will become central characters in Chapter 10, where they connect to the theorems of Green, Gauss, and Stokes through differential forms.</p>
		</div>

		<!-- ═══ SECTION 13: Line integrals ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Line integrals: work along a curve</h3>
			<p>A <strong>line integral</strong> computes the total effect of a vector field along a curve. If <Katex math={r`\mathbf{F} = (P, Q)`} /> represents a force field, and you move a particle along a curve <Katex math={r`C`} />, the total <strong>work</strong> done is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_C \mathbf{F} \cdot d\mathbf{r} = \int_C P\,dx + Q\,dy`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>At each point of the curve, the infinitesimal displacement is <Katex math={r`d\mathbf{r} = (dx, dy)`} /> — literally a microsegment of the curve. The dot product <Katex math={r`\mathbf{F} \cdot d\mathbf{r} = P\,dx + Q\,dy`} /> is the infinitesimal contribution to the work. We sum all these contributions along the entire curve.</p>
			<p>If the curve is parametrized by <Katex math={r`\mathbf{r}(t) = (x(t), y(t))`} /> for <Katex math={r`t \in [a,b]`} />, then <Katex math={r`dx = x'(t)\,dt`} /> and <Katex math={r`dy = y'(t)\,dt`} />, giving:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_C \mathbf{F} \cdot d\mathbf{r} = \int_a^b \bigl[P(x(t), y(t))\,x'(t) + Q(x(t), y(t))\,y'(t)\bigr]\,dt`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is just the chain rule in disguise: <Katex math={r`\mathbf{F} \cdot \mathbf{r}'(t)`} /> is the dot product of the field with the velocity vector, integrated over time. We will explore line integrals much more deeply in Chapter 10.</p>
		</div>

		<!-- ═══ SECTION 14: Tangent vectors as microsegments ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Tangent vectors as microsegments</h3>
			<p>In Neocalculus, a <strong>tangent vector</strong> at a point <Katex math="m" /> on a space <Katex math="M" /> is simply a map <Katex math={r`t \colon D \to M`} /> with <Katex math={r`t(0) = m`} />. It is an infinitesimal path — a <strong>microsegment</strong> placed on the space, too short to bend.</p>
			<p>Think of it this way: in classical differential geometry, a tangent vector is an equivalence class of curves — all curves through <Katex math="m" /> with the same velocity. But two curves that agree to first order differ only by terms involving <Katex math={r`d^2`} />, which vanish. So in SDG, the equivalence class <em>is</em> the microsegment. The tangent vector is not an abstraction — it is a concrete infinitesimal piece of the space.</p>
			<p>The collection of all tangent vectors at <Katex math="m" /> forms the <strong>tangent space</strong> <Katex math={r`T_m M = M^D`} /> — the space of all maps from <Katex math="D" /> into <Katex math="M" /> that send 0 to <Katex math="m" />. For <Katex math={r`M = \mathcal{R}^n`} />, this is naturally isomorphic to <Katex math={r`\mathcal{R}^n`} /> itself (each microsegment is determined by its velocity vector). But for curved spaces — manifolds — the tangent space varies from point to point, and the collection of all tangent spaces forms the <strong>tangent bundle</strong> <Katex math={r`TM`} />.</p>
		</div>

		<DigDeeper title="The tangent bundle as an exponential object">
			<p>In SDG, the tangent bundle of <Katex math="M" /> is literally the function space <Katex math={r`M^D`} /> — the set of all maps from <Katex math="D" /> to <Katex math="M" />. This is an <em>exponential object</em> in the category of smooth spaces. The fact that tangent bundles are exponential objects makes many constructions in differential geometry — pullbacks, jets, connections — purely algebraic. This is one of the deepest advantages of the SDG framework, and we will begin to see its power in Chapter 10.</p>
		</DigDeeper>

		<!-- ═══ HISTORY ═══ -->
		<HistoryBox name="Leonhard Euler" years="1707–1783">
			<p>Euler pioneered the study of functions of several variables, introducing the notation <Katex math={r`f(x,y)`} /> and developing the first systematic treatment of partial derivatives. He was also the first to study what we now call the <strong>Euler-Lagrange equations</strong> — the multivariable optimization conditions that underlie the calculus of variations, mechanics, and modern physics.</p>
		</HistoryBox>

		<HistoryBox name="Joseph-Louis Lagrange" years="1736–1813">
			<p>Lagrange transformed mechanics from a geometric science into an analytic one, reformulating Newton's laws in terms of generalized coordinates and the principle of least action. His method of <strong>Lagrange multipliers</strong> — optimizing a function subject to constraints — remains one of the most widely used tools in mathematics, economics, and engineering to this day.</p>
		</HistoryBox>

		<!-- ═══ EXERCISES ═══ -->
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>

			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Find the partial derivatives of <Katex math={r`f(x,y) = \sin(x)\,e^y`} /> using infinitesimal nudging.</p>
				{#snippet solution()}<p>Nudge: <Katex math={r`f(x+d_1, y+d_2) = (\sin x + \cos x\,d_1)(e^y + e^y d_2) = \sin x\,e^y + \cos x\,e^y\,d_1 + \sin x\,e^y\,d_2`} />. (The mixed term <Katex math={r`\cos x\,e^y\,d_1 d_2 = 0`} /> by the <Katex math={r`D(2)`} /> condition.) So <Katex math={r`f_x = \cos x\,e^y`} />, <Katex math={r`f_y = \sin x\,e^y`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Find the gradient of <Katex math={r`f(x,y) = x^2 + y^2`} /> and explain geometrically what direction it points.</p>
				{#snippet solution()}<p><Katex math={r`\nabla f = (2x, 2y)`} />. This points radially outward from the origin — the direction of steepest increase of the paraboloid. It is perpendicular to the circular level curves, as guaranteed by our theorem.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Compute the partial derivatives of <Katex math={r`f(x,y) = x^3 - 3xy + y^2`} /> by infinitesimal nudging. Find all critical points.</p>
				{#snippet solution()}<p>Nudge: <Katex math={r`f(x+d_1, y+d_2) = (x+d_1)^3 - 3(x+d_1)(y+d_2) + (y+d_2)^2`} />. Expanding with <Katex math={r`d_1^2 = d_2^2 = d_1 d_2 = 0`} />: <Katex math={r`= x^3 - 3xy + y^2 + (3x^2 - 3y)\,d_1 + (-3x + 2y)\,d_2`} />. So <Katex math={r`f_x = 3x^2 - 3y`} /> and <Katex math={r`f_y = -3x + 2y`} />. Setting both to zero: <Katex math={r`y = x^2`} /> and <Katex math={r`y = \frac{3x}{2}`} />, giving <Katex math={r`x^2 = \frac{3x}{2}`} />, so <Katex math={r`x = 0`} /> or <Katex math={r`x = \frac{3}{2}`} />. Critical points: <Katex math={r`(0, 0)`} /> and <Katex math={r`(\frac{3}{2}, \frac{9}{4})`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p><strong>Core.</strong> Compute the directional derivative of <Katex math={r`f(x,y) = e^x \cos y`} /> at the point <Katex math={r`(0, \pi/4)`} /> in the direction <Katex math={r`\mathbf{v} = (\frac{3}{5}, \frac{4}{5})`} />.</p>
				{#snippet solution()}<p><Katex math={r`\nabla f = (e^x \cos y,\; -e^x \sin y)`} />. At <Katex math={r`(0, \pi/4)`} />: <Katex math={r`\nabla f = (\frac{\sqrt{2}}{2}, -\frac{\sqrt{2}}{2})`} />. Then <Katex math={r`D_{\mathbf{v}} f = \frac{\sqrt{2}}{2} \cdot \frac{3}{5} + (-\frac{\sqrt{2}}{2}) \cdot \frac{4}{5} = \frac{\sqrt{2}}{2} \cdot \frac{3-4}{5} = -\frac{\sqrt{2}}{10}`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p><strong>Core.</strong> Prove that the gradient <Katex math={r`\nabla(fg) = f\nabla g + g\nabla f`} /> using infinitesimal nudging (the product rule for gradients).</p>
				{#snippet solution()}<p>Nudge <Katex math="x" /> by <Katex math={r`d_1`} />, <Katex math="y" /> by <Katex math={r`d_2`} />: <Katex math={r`f(x+d_1, y+d_2)\,g(x+d_1, y+d_2) = (f + f_x d_1 + f_y d_2)(g + g_x d_1 + g_y d_2)`} /><Katex math={r`= fg + (f g_x + g f_x)\,d_1 + (f g_y + g f_y)\,d_2`} /> (all <Katex math={r`d_i d_j = 0`} /> terms vanish). Reading off coefficients: <Katex math={r`(fg)_x = f g_x + g f_x`} /> and <Katex math={r`(fg)_y = f g_y + g f_y`} />, i.e. <Katex math={r`\nabla(fg) = f\nabla g + g\nabla f`} />. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Use the chain rule to find <Katex math={r`\frac{dF}{dt}`} /> where <Katex math={r`F(t) = (2t)^2 + (2t)(\sin t) = 4t^2 + 2t\sin t`} /> by writing <Katex math={r`f(x,y) = x^2 + xy`} />, <Katex math={r`x(t) = 2t`} />, <Katex math={r`y(t) = \sin t`} />.</p>
				{#snippet solution()}<p><Katex math={r`\nabla f = (2x + y, x)`} />, and <Katex math={r`\mathbf{r}'(t) = (2, \cos t)`} />. So <Katex math={r`F'(t) = (2\cdot 2t + \sin t)\cdot 2 + 2t \cdot \cos t = 8t + 2\sin t + 2t\cos t`} />. Check: <Katex math={r`F(t) = 4t^2 + 2t\sin t`} />, <Katex math={r`F'(t) = 8t + 2\sin t + 2t\cos t`} />. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Core.</strong> Compute the Jacobian determinant for the transformation <Katex math={r`x = u^2 - v^2`} />, <Katex math={r`y = 2uv`} />. Recognize this as a familiar complex-variable map.</p>
				{#snippet solution()}<p><Katex math={r`J = \begin{pmatrix} 2u & -2v \\ 2v & 2u \end{pmatrix}`} />, so <Katex math={r`\det J = 4u^2 + 4v^2 = 4(u^2 + v^2)`} />. This is <Katex math={r`(u + iv)^2 = (u^2 - v^2) + 2uvi`} />, the complex squaring map. Its Jacobian is <Katex math={r`4|z|^2`} /> where <Katex math={r`z = u + iv`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p><strong>Core.</strong> Evaluate the double integral <Katex math={r`\iint_R (x^2 + y^2)\,dA`} /> where <Katex math="R" /> is the disk <Katex math={r`x^2 + y^2 \leq 4`} />. (Use polar coordinates.)</p>
				{#snippet solution()}<p>In polar: <Katex math={r`\int_0^{2\pi}\!\int_0^2 r^2 \cdot r\,dr\,d\theta = \int_0^{2\pi}\!\int_0^2 r^3\,dr\,d\theta = \int_0^{2\pi} \left[\frac{r^4}{4}\right]_0^2 d\theta = \int_0^{2\pi} 4\,d\theta = 8\pi`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> Compute the divergence and curl of <Katex math={r`\mathbf{F}(x,y) = (x^2 y,\; -xy^2)`} />.</p>
				{#snippet solution()}<p><Katex math={r`\operatorname{div} \mathbf{F} = \frac{\partial}{\partial x}(x^2 y) + \frac{\partial}{\partial y}(-xy^2) = 2xy - 2xy = 0`} />. The field is divergence-free! <Katex math={r`\operatorname{curl} \mathbf{F} = \frac{\partial}{\partial x}(-xy^2) - \frac{\partial}{\partial y}(x^2 y) = -y^2 - x^2 = -(x^2 + y^2)`} />. The field has nonzero curl everywhere except the origin — it rotates clockwise (negative curl).</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Core.</strong> Use Lagrange multipliers to find the maximum of <Katex math={r`f(x,y) = xy`} /> subject to <Katex math={r`x^2 + y^2 = 1`} />.</p>
				{#snippet solution()}<p><Katex math={r`\nabla f = (y, x)`} /> and <Katex math={r`\nabla g = (2x, 2y)`} />. Setting <Katex math={r`\nabla f = \lambda \nabla g`} />: <Katex math={r`y = 2\lambda x`} /> and <Katex math={r`x = 2\lambda y`} />. Substituting: <Katex math={r`y = 2\lambda(2\lambda y) = 4\lambda^2 y`} />, so <Katex math={r`\lambda = \pm \frac{1}{2}`} />. When <Katex math={r`\lambda = \frac{1}{2}`} />: <Katex math={r`x = y`} />, and <Katex math={r`2x^2 = 1`} />, so <Katex math={r`x = y = \frac{1}{\sqrt{2}}`} />, giving <Katex math={r`f = \frac{1}{2}`} />. The maximum is <Katex math={r`\frac{1}{2}`} />, achieved at <Katex math={r`(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}})`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p><strong>Conceptual.</strong> Why do we require <Katex math={r`d_1 d_2 = 0`} /> in <Katex math={r`D(2)`} />? What would go wrong in the multivariable slope equation if we allowed <Katex math={r`d_1 d_2 \neq 0`} />?</p>
				{#snippet solution()}<p>If <Katex math={r`d_1 d_2 \neq 0`} />, the expansion <Katex math={r`f(x + d_1, y + d_2)`} /> would include a term <Katex math={r`f_{xy}\,d_1 d_2`} />, mixing first- and second-order information. The multivariable slope equation <Katex math={r`f(x+d_1, y+d_2) = f(x,y) + f_x\,d_1 + f_y\,d_2`} /> would no longer hold — the right side would need a third term. The condition <Katex math={r`d_1 d_2 = 0`} /> ensures we capture <em>only</em> the gradient (first-order directional information), cleanly separated from curvature. When we <em>want</em> second-order information, we use <Katex math={r`D_2(2)`} /> instead.</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Challenge.</strong> Derive the formula for the <strong>Laplacian in polar coordinates</strong>. Start from <Katex math={r`\nabla^2 f = f_{xx} + f_{yy}`} /> and use the chain rule with <Katex math={r`x = r\cos\theta`} />, <Katex math={r`y = r\sin\theta`} /> to show:</p>
				<Katex math={r`\nabla^2 f = f_{rr} + \frac{1}{r}\,f_r + \frac{1}{r^2}\,f_{\theta\theta}`} display />
				{#snippet solution()}<p>Using the chain rule: <Katex math={r`f_x = f_r \cos\theta + f_\theta(-\frac{\sin\theta}{r})`} /> and <Katex math={r`f_y = f_r \sin\theta + f_\theta \frac{\cos\theta}{r}`} />. Differentiating again (applying the product rule and chain rule to each term) and summing <Katex math={r`f_{xx} + f_{yy}`} />, after careful simplification using <Katex math={r`\cos^2\theta + \sin^2\theta = 1`} />, one obtains <Katex math={r`\nabla^2 f = f_{rr} + \frac{1}{r}f_r + \frac{1}{r^2}f_{\theta\theta}`} />. The computation is lengthy but systematic — each application of the chain rule is a single infinitesimal nudge.</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p><strong>Challenge.</strong> Show that if <Katex math={r`\mathbf{F} = \nabla f`} /> (i.e., the field is a gradient), then <Katex math={r`\operatorname{curl} \mathbf{F} = 0`} />. Use infinitesimal nudging on the partial derivatives.</p>
				{#snippet solution()}<p>If <Katex math={r`\mathbf{F} = (f_x, f_y)`} />, then <Katex math={r`\operatorname{curl} \mathbf{F} = (f_y)_x - (f_x)_y = f_{yx} - f_{xy}`} />. For smooth functions (as guaranteed in SDG), the mixed partials are equal: <Katex math={r`f_{xy} = f_{yx}`} />. Therefore <Katex math={r`\operatorname{curl}(\nabla f) = 0`} />. The converse — is every curl-free field a gradient? — is the subject of Green's theorem in Chapter 10.</p>{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p><strong>Exploration.</strong> Consider the transformation <Katex math={r`u = x + y`} />, <Katex math={r`v = x - y`} />. Compute its Jacobian, then use it to evaluate <Katex math={r`\iint_R e^{x+y}\,dA`} /> over the square with vertices <Katex math={r`(0,0), (1,0), (0,1), (1,1)`} /> by changing to <Katex math={r`(u,v)`} /> coordinates.</p>
				{#snippet solution()}<p>We have <Katex math={r`x = \frac{u+v}{2}`} />, <Katex math={r`y = \frac{u-v}{2}`} />. The Jacobian: <Katex math={r`J = \begin{pmatrix} 1/2 & 1/2 \\ 1/2 & -1/2 \end{pmatrix}`} />, <Katex math={r`|\det J| = \frac{1}{2}`} />. The square in <Katex math={r`(x,y)`} /> maps to a rotated square in <Katex math={r`(u,v)`} /> with vertices <Katex math={r`(0,0), (1,1), (1,-1), (2,0)`} />. The integral becomes <Katex math={r`\frac{1}{2}\iint e^u\,du\,dv`} /> over this region. Since <Katex math={r`e^{x+y} = e^u`} />, the <Katex math="v" />-integral just measures width: <Katex math={r`\frac{1}{2}\int_0^2 e^u \cdot w(u)\,du`} /> where <Katex math={r`w(u) = \min(2u, 2(2-u))`} /> (the diamond width). This simplifies to <Katex math={r`\int_0^1 u\,e^u\,du + \int_1^2 (2-u)\,e^u\,du = e - 1`} /> (via integration by parts).</p>{/snippet}
			</Exercise>
		</div>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li>The <strong>infinitesimal cross</strong> <Katex math={r`D(2) = \{(d_1, d_2): d_1^2 = d_2^2 = d_1 d_2 = 0\}`} /> captures first-order information in two directions.</li>
				<li><strong>Partial derivatives</strong> are the coefficients in <Katex math={r`f(x+d_1, y+d_2) = f(x,y) + f_x\,d_1 + f_y\,d_2`} />.</li>
				<li>The <strong>directional derivative</strong> <Katex math={r`D_{\mathbf{v}} f = \nabla f \cdot \mathbf{v}`} /> is the rate of change in any direction.</li>
				<li>The <strong>gradient</strong> <Katex math={r`\nabla f`} /> is perpendicular to level curves and points in the direction of steepest ascent.</li>
				<li>The <strong>chain rule</strong>: <Katex math={r`(f \circ \mathbf{r})'(t) = \nabla f \cdot \mathbf{r}'(t)`} /> — derivative of a composition is a dot product.</li>
				<li>The <strong>Hessian</strong> captures second-order information; the second derivative test classifies critical points.</li>
				<li><strong>Lagrange multipliers</strong>: at constrained extrema, <Katex math={r`\nabla f = \lambda\,\nabla g`} />.</li>
				<li><strong>Double integrals</strong> sum <Katex math={r`f\,dA`} /> over infinitesimal tiles; <strong>Fubini's theorem</strong> allows iterated integration.</li>
				<li>The <strong>Jacobian</strong> <Katex math={r`|\det J|`} /> measures how a coordinate change distorts infinitesimal area. In SDG, this is exact, not approximate.</li>
				<li><strong>Vector fields</strong> assign vectors to points; <strong>divergence</strong> = infinitesimal net flux, <strong>curl</strong> = infinitesimal circulation.</li>
				<li><strong>Line integrals</strong> <Katex math={r`\int_C \mathbf{F}\cdot d\mathbf{r}`} /> compute accumulated work along a curve.</li>
				<li>A <strong>tangent vector</strong> is a microsegment <Katex math={r`D \to M`} /> — a concrete infinitesimal piece of the space.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>The vector fields, divergence, curl, and line integrals we introduced here are the raw materials for Chapter 10, where we unify them all through <strong>differential forms</strong>. We will see that <Katex math={r`P\,dx + Q\,dy`} /> is not merely notation — it is a 1-form, an object that eats microsegments and returns numbers. And the theorems of Green, Gauss, and Stokes will emerge as a single, beautiful statement: <Katex math={r`\int_{\partial\Omega} \omega = \int_\Omega d\omega`} /> — the integral of a form over a boundary equals the integral of its exterior derivative over the interior.</p>
		</LookingAhead>

		<NextChapter href="ch10" title="The Language of Forms" number="10" />
	</div>
</section>
