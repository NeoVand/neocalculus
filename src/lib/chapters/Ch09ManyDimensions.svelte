<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupPartialDerivatives(JXG: any, board: any) {
		// Contour lines of f(x,y) = x² + y² (circles)
		for (let r = 0.8; r <= 3.2; r += 0.6) {
			board.create('circle', [[0, 0], r], {
				strokeColor: '#e5e1d8', strokeWidth: 1, fixed: true,
				fillColor: 'none', highlight: false, dash: 0
			});
		}

		// Point (x₀, y₀) where we evaluate partials
		const x0 = 1.5, y0 = 1;
		const pt = board.create('point', [x0, y0], {
			size: 5, fillColor: '#1a1a2e', strokeColor: '#1a1a2e',
			name: '(x, y)', label: { fontSize: 13, offset: [8, 8] },
			fixed: true, highlight: false
		});

		// d₁ direction (along x-axis from the point)
		board.create('arrow', [[x0, y0], [x0 + 1.2, y0]], {
			strokeColor: '#3b82f6', strokeWidth: 3, highlight: false
		});
		board.create('text', [x0 + 1.35, y0, 'd₁'], {
			fontSize: 14, color: '#3b82f6', fontStyle: 'italic',
			fontWeight: 'bold', highlight: false
		});

		// d₂ direction (along y-axis from the point)
		board.create('arrow', [[x0, y0], [x0, y0 + 1.2]], {
			strokeColor: '#059669', strokeWidth: 3, highlight: false
		});
		board.create('text', [x0 - 0.05, y0 + 1.4, 'd₂'], {
			fontSize: 14, color: '#059669', fontStyle: 'italic',
			fontWeight: 'bold', anchorX: 'middle', highlight: false
		});

		// Gradient vector (points radially outward for f = x²+y²)
		const gradLen = 1.3;
		const norm = Math.sqrt(x0 * x0 + y0 * y0);
		board.create('arrow', [[x0, y0], [x0 + gradLen * x0 / norm, y0 + gradLen * y0 / norm]], {
			strokeColor: '#a855f7', strokeWidth: 2.5, dash: 2, highlight: false
		});
		board.create('text', [x0 + gradLen * x0 / norm + 0.15, y0 + gradLen * y0 / norm + 0.15, '∇f'], {
			fontSize: 14, color: '#a855f7', fontWeight: 'bold', highlight: false
		});

		// Labels
		board.create('text', [0, -3.2, 'Contours of f(x,y) = x² + y². Gradient ∇f points radially outward.'], {
			fontSize: 10, color: '#94919b', anchorX: 'middle', highlight: false
		});
	}
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
		<div use:reveal>
			<JSXGraphBoard
				setup={setupPartialDerivatives}
				boundingbox={[-3.5, 3.5, 3.5, -3.5]}
				aspectRatio={1}
				number="9.1"
				caption="Contour plot of f(x,y) = x²+y². At the point (x,y), the infinitesimal directions d₁ (blue, along x) and d₂ (green, along y) capture each partial derivative. The gradient ∇f (purple dashed) points perpendicular to the contours."
			/>
		</div>

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
