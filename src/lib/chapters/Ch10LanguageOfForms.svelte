<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import DependencyMap from '$lib/components/DependencyMap.svelte';
	import RevealBox from '$lib/components/RevealBox.svelte';
	import FailureModeBox from '$lib/components/FailureModeBox.svelte';
	import StokesVisualizer from '$lib/components/demos/StokesVisualizer.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	const chapterDependencyNodes = [
		{
			id: 'ch5-ftc',
			label: 'Boundary cancellation intuition (Ch5 FTC)',
			to: '#ch5-ftc-core',
			lane: 'core',
			note: 'Endpoint-only survival in 1D is the first Stokes pattern.'
		},
		{
			id: 'ch9-vector',
			label: 'Vector-calculus setup (Ch9)',
			to: '#ch9',
			lane: 'core',
			note: 'Gradient, curl, divergence provide coordinate intuition.'
		},
		{
			id: 'ch10-exterior',
			label: 'Exterior derivative core (this chapter)',
			to: '#ch10-exterior-derivative',
			lane: 'core',
			note: 'd raises form degree and controls boundary flow.'
		},
		{
			id: 'ch10-stokes',
			label: 'Generalized Stokes theorem (this chapter)',
			to: '#ch10-generalized-stokes',
			lane: 'bridge',
			note: 'One equation unifies FTC, Green, Stokes, Divergence.'
		},
		{
			id: 'ch10-topology',
			label: 'Closed vs exact forms (this chapter)',
			to: '#ch10-closed-exact',
			lane: 'deep',
			note: 'Global topology limits what local antiderivatives can do.'
		}
	] as const;

	const chapterDependencyEdges = [
		{ from: 'ch5-ftc', to: 'ch10-exterior' },
		{ from: 'ch9-vector', to: 'ch10-exterior' },
		{ from: 'ch10-exterior', to: 'ch10-stokes' },
		{ from: 'ch10-stokes', to: 'ch10-topology' }
	] as const;
</script>

<section class="chapter" id="ch10">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 9</span>
			<h2 class="chapter-title">Differential Forms and Unification</h2>
			<div class="chapter-epigraph">
				<blockquote>
					"Mathematics is the art of giving the same name to different things."
				</blockquote>
				<p class="epigraph-attr">— Henri Poincaré, <em>Science and Method</em>, 1908</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION: Motivation ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The last question</h3>
			<p>
				We've come a long way. We began with a single axiom — <Katex math="d^2 = 0" /> — and from it built
				derivatives, integrals, and the Fundamental Theorem of Calculus:
			</p>
			<Katex math={r`\int_a^b f'(x)\,dx = f(b) - f(a).`} display />
			<p>
				This theorem is extraordinary. It says that to compute the integral of a derivative over an
				interval, you only need to know what happens at the <em>boundary</em> — the two endpoints. All
				the infinitesimal contributions in the interior telescope and cancel, leaving only the boundary
				terms.
			</p>
			<p>
				But a question nags: <strong
					>is there a version for surfaces? For volumes? For any dimension?</strong
				>
			</p>
			<p>
				The answer is yes — and the language that makes it possible is the language of <strong
					>differential forms</strong
				>. In this chapter, we'll show that the standard integration theorems from this course — the
				Fundamental Theorem of Calculus, Green's theorem, the classical Stokes' theorem, and the
				Divergence theorem — can be written as special cases of one boundary/interior principle. In
				the SDG presentation, they share the same interior-cancellation mechanism.
			</p>
		</div>

		<DependencyMap
			title="Chapter 9 Dependency Network"
			intro="Open for the prerequisite spine from FTC and vector calculus into generalized Stokes."
			returnLabel="Chapter 9 dependency map"
			nodes={chapterDependencyNodes}
			edges={chapterDependencyEdges}
		/>

		<Callout type="key-idea" title="Core Path (First Pass)">
			<p>
				For a first pass, focus on forms, exterior derivative, generalized Stokes, and
				closed-versus-exact logic. Open extension studios for detailed classical specializations and
				variational mechanics.
			</p>
		</Callout>

		<!-- ═══ SECTION: What Is a Differential Form? ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>What is a differential form?</h3>
			<p>
				A <strong>k-form</strong> is a machine that measures infinitesimal k-dimensional content. Think
				of it as a gadget you place on an infinitesimal parallelotope, and it returns a number:
			</p>
			<ul>
				<li>
					A <strong>0-form</strong> is just a function — it assigns a number to each point. Temperature
					at a point, pressure at a point, altitude at a point. No direction involved.
				</li>
				<li>
					A <strong>1-form</strong> measures infinitesimal displacement — you feed it a tiny arrow, and
					it returns a number. Work done by a force over a tiny step. Voltage drop along a tiny wire segment.
				</li>
				<li>
					A <strong>2-form</strong> measures infinitesimal area — you feed it a tiny parallelogram, and
					it returns a number. Flux of a field through a tiny patch of surface. The rate of flow through
					a tiny window.
				</li>
				<li>
					A <strong>3-form</strong> measures infinitesimal volume — mass density, charge density, energy
					density packed into a tiny box.
				</li>
			</ul>
			<p>
				The key properties: forms are <em>linear</em> in each argument, and <em>alternating</em> —
				swapping two sides of the parallelotope negates the value. This captures the idea of
				<strong>orientation</strong>: a clockwise loop and a counterclockwise loop give opposite
				answers.
			</p>
		</div>

		<Callout type="definition" title="Differential Forms in Neocalculus">
			<p>
				An <strong>k-form</strong>
				<Katex math={r`\omega`} /> on a space <Katex math="S" /> is a mapping from infinitesimal k-cubes
				to numbers, satisfying:
			</p>
			<ul>
				<li>
					<strong>Homogeneity</strong>: scaling a side by <Katex math="a" /> scales the value by <Katex
						math="a"
					/>
				</li>
				<li><strong>Alternation</strong>: swapping two sides negates the value</li>
				<li><strong>Degeneracy</strong>: if any two sides are parallel, the value is 0</li>
			</ul>
		</Callout>

		<!-- ═══ SECTION: The Wedge Product ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The wedge product</h3>
			<p>
				To build higher-degree forms from lower-degree ones, we need a product operation. The <strong
					>wedge product</strong
				>
				<Katex math={r`\wedge`} /> ("wedge") combines forms the way the cross product combines vectors
				— but it works in any dimension.
			</p>
			<p>
				The simplest example: <Katex math={r`dx \wedge dy`} />. What does this mean? Think of two
				infinitesimal displacements: one in the <Katex math="x" />-direction and one in the <Katex
					math="y"
				/>-direction. Together they span a tiny parallelogram. <Katex math={r`dx \wedge dy`} /> measures
				its <strong>oriented area</strong>.
			</p>
		</div>

		<Callout type="key-idea" title="The Wedge Product: Oriented Area">
			<p>
				Given two infinitesimal displacement vectors <Katex math={r`\mathbf{v} = (v_1, v_2)`} /> and <Katex
					math={r`\mathbf{w} = (w_1, w_2)`}
				/>, the wedge product gives:
			</p>
			<Katex math={r`(dx \wedge dy)(\mathbf{v}, \mathbf{w}) = v_1 w_2 - v_2 w_1`} display />
			<p>
				This is the signed area of the parallelogram spanned by <Katex math={r`\mathbf{v}`} /> and <Katex
					math={r`\mathbf{w}`}
				/>. Positive if the rotation from <Katex math={r`\mathbf{v}`} /> to <Katex
					math={r`\mathbf{w}`}
				/> is counterclockwise.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>The wedge product obeys one crucial rule: <strong>antisymmetry</strong>.</p>
			<Katex math={r`dx \wedge dy = -\, dy \wedge dx`} display />
			<p>
				Swapping the order negates the result. This is because swapping the two sides of a
				parallelogram reverses its orientation — a counterclockwise parallelogram becomes clockwise,
				and vice versa.
			</p>
			<p>And this immediately gives us the most important consequence:</p>
			<Katex
				math={r`dx \wedge dx = -\,dx \wedge dx \qquad \Longrightarrow \qquad dx \wedge dx = 0`}
				display
			/>
			<p>
				A "parallelogram" whose two sides point in the same direction has zero area. This is
				geometrically obvious — and algebraically forced by antisymmetry.
			</p>
		</div>

		<SDGAdvantage>
			<p>
				In SDG, the wedge product has a direct infinitesimal interpretation. Given two independent
				infinitesimal displacements <Katex math={r`d_1`} /> and <Katex math={r`d_2`} />, the
				expression <Katex math={r`(dx \wedge dy)(d_1, d_2)`} /> computes the oriented area of the infinitesimal
				parallelogram they span. The antisymmetry <Katex math={r`dx \wedge dy = -dy \wedge dx`} /> simply
				says: "reversing the order of the sides flips the orientation." No abstract formalism needed —
				it's geometry.
			</p>
		</SDGAdvantage>

		<!-- ═══ SECTION: Coordinate Notation ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Explicit coordinate notation</h4>
			<p>
				Now we can write forms explicitly in coordinates. In two dimensions (<Katex math="x" /> and <Katex
					math="y"
				/>):
			</p>
			<p><strong>A general 1-form</strong> looks like:</p>
			<Katex math={r`\omega = P\,dx + Q\,dy`} display />
			<p>
				where <Katex math="P" /> and <Katex math="Q" /> are functions of <Katex math="(x,y)" />.
				This 1-form, when fed an infinitesimal displacement <Katex math={r`(dx, dy)`} />, returns <Katex
					math={r`P\,dx + Q\,dy`}
				/> — a weighted combination of the displacement in each direction. Think of it as measuring how
				much of the displacement is "captured" by each component.
			</p>
			<p><strong>A general 2-form</strong> in two dimensions looks like:</p>
			<Katex math={r`\omega = f\,dx \wedge dy`} display />
			<p>
				There is only one independent 2-form in 2D (since <Katex
					math={r`dy \wedge dx = -dx \wedge dy`}
				/> and <Katex math={r`dx \wedge dx = dy \wedge dy = 0`} />). This 2-form measures area,
				weighted by the function <Katex math="f" />.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked example: interpreting a 1-form</div>
			<p style="margin-bottom: 0.5rem;">
				Consider the 1-form <Katex math={r`\omega = x\,dy - y\,dx`} />. What does it measure?
			</p>
			<div class="step">
				<div class="step-math"><Katex math={r`\omega = -y\,dx + x\,dy`} display /></div>
				<span class="step-note">rewrite in standard order</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`P = -y, \quad Q = x`} display /></div>
				<span class="step-note">read off components</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\omega(\mathbf{v}) = -y\,v_1 + x\,v_2`} display />
				</div>
				<span class="step-note"
					>applied to displacement <Katex math={r`\mathbf{v} = (v_1, v_2)`} /></span
				>
			</div>
			<p style="margin-top: 0.5rem;">
				This measures the component of the displacement perpendicular to the position vector — it's
				related to angular momentum! Specifically, <Katex math={r`\omega = r^2\,d\theta`} /> in polar
				coordinates: it measures the angular sweep, weighted by the distance from the origin.
			</p>
		</div>

		<!-- ═══ SECTION: The Exterior Derivative ═══ -->
		<div class="neo-prose" use:reveal>
			<h3 id="ch10-exterior-derivative">The exterior derivative</h3>
			<p>
				Given a k-form <Katex math={r`\omega`} />, its <strong>exterior derivative</strong>
				<Katex math={r`d\omega`} /> is a (k+1)-form. It measures how <Katex math={r`\omega`} /> varies
				— the "derivative" of a form.
			</p>
			<p>The definition is beautifully simple in SDG:</p>
		</div>

		<Callout type="definition" title="The Exterior Derivative (SDG)">
			<p>
				The exterior derivative <Katex math={r`d\omega`} /> of a k-form <Katex math={r`\omega`} /> is
				the unique (k+1)-form satisfying:
			</p>
			<Katex math={r`\int_{\partial C} \omega = \int_C d\omega`} display />
			<p>
				for every infinitesimal (k+1)-cube <Katex math="C" />. In words: <Katex math={r`d\omega`} /> on
				a tiny cell equals <Katex math={r`\omega`} /> integrated around its boundary.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Let's see what this gives us in coordinates.</p>
			<p>
				<strong>For a 0-form</strong>
				<Katex math={r`f(x,y)`} /> (a function), the exterior derivative is:
			</p>
			<Katex
				math={r`df = \frac{\partial f}{\partial x}\,dx + \frac{\partial f}{\partial y}\,dy`}
				display
			/>
			<p>
				This is the gradient, repackaged as a 1-form. It measures how much <Katex math="f" /> changes
				in each direction.
			</p>
			<p>
				<strong>For a 1-form</strong>
				<Katex math={r`\omega = P\,dx + Q\,dy`} />, the exterior derivative is:
			</p>
			<Katex
				math={r`d\omega = \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dx \wedge dy`}
				display
			/>
			<p>
				This is the <strong>curl</strong> — or more precisely, the 2D curl. It measures the rotation or
				circulation density of the 1-form.
			</p>
		</div>

		<DigDeeper title="Why the exterior derivative has that form">
			<p>
				For the 1-form case, here's the computation. We need <Katex math={r`d(P\,dx + Q\,dy)`} />.
				Apply <Katex math="d" /> to each term:
			</p>
			<Katex
				math={r`d(P\,dx) = dP \wedge dx = \left(\frac{\partial P}{\partial x}dx + \frac{\partial P}{\partial y}dy\right) \wedge dx`}
				display
			/>
			<p>Since <Katex math={r`dx \wedge dx = 0`} />, only the second term survives:</p>
			<Katex
				math={r`d(P\,dx) = \frac{\partial P}{\partial y}\,dy \wedge dx = -\frac{\partial P}{\partial y}\,dx \wedge dy`}
				display
			/>
			<p>
				Similarly, <Katex math={r`d(Q\,dy) = \frac{\partial Q}{\partial x}\,dx \wedge dy`} />.
				Adding:
			</p>
			<Katex
				math={r`d\omega = \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dx \wedge dy`}
				display
			/>
		</DigDeeper>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked example: exterior derivative of a 0-form</div>
			<p style="margin-bottom: 0.5rem;">
				Let <Katex math={r`f(x,y) = x^2 y`} />. Compute <Katex math={r`df`} />.
			</p>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\frac{\partial f}{\partial x} = 2xy, \qquad \frac{\partial f}{\partial y} = x^2`}
						display
					/>
				</div>
				<span class="step-note">partial derivatives</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`df = 2xy\,dx + x^2\,dy`} display /></div>
				<span class="step-note">the gradient 1-form ✓</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked example: exterior derivative of a 1-form</div>
			<p style="margin-bottom: 0.5rem;">
				Let <Katex math={r`\omega = x\,dy - y\,dx`} />. Compute <Katex math={r`d\omega`} />.
			</p>
			<div class="step">
				<div class="step-math"><Katex math={r`P = -y, \quad Q = x`} display /></div>
				<span class="step-note">identify components</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\frac{\partial Q}{\partial x} = 1, \qquad \frac{\partial P}{\partial y} = -1`}
						display
					/>
				</div>
				<span class="step-note">partial derivatives</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`d\omega = (1 - (-1))\,dx \wedge dy = 2\,dx \wedge dy`} display />
				</div>
				<span class="step-note">twice the area form ✓</span>
			</div>
			<p style="margin-top: 0.5rem;">
				The form <Katex math={r`\omega = x\,dy - y\,dx`} /> has a constant "curl" of 2. Integrating <Katex
					math={r`d\omega`}
				/> over an oriented planar region gives twice the signed area of that region.
			</p>
		</div>

		<!-- ═══ SECTION: d² = 0 ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>The deepest equation: <Katex math="d^2 = 0" /> (again!)</h4>
			<p>Here is the moment where the entire book comes full circle.</p>
			<p>
				We began in Chapter 1 with the axiom <Katex math="d^2 = 0" /> for infinitesimals: the square of
				an infinitesimal displacement is zero. Now we discover that the exterior derivative <Katex
					math="d"
				/> satisfies <em>exactly the same equation</em>:
			</p>
		</div>

		<Callout type="theorem" title="d² = 0 for the Exterior Derivative">
			<p>For smooth differential forms <Katex math={r`\omega`} /> on the domains we consider:</p>
			<Katex math={r`d(d\omega) = 0`} display />
			<p>The exterior derivative applied twice is zero.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Proof for a 0-form.</strong> Let <Katex math={r`f(x,y)`} /> be a smooth function. We compute
				<Katex math={r`d(df)`} /> step by step:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Proof: d(df) = 0</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`df = \frac{\partial f}{\partial x}\,dx + \frac{\partial f}{\partial y}\,dy`}
						display
					/>
				</div>
				<span class="step-note">exterior derivative of f</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`d(df) = \left(\frac{\partial}{\partial x}\frac{\partial f}{\partial y} - \frac{\partial}{\partial y}\frac{\partial f}{\partial x}\right) dx \wedge dy`}
						display
					/>
				</div>
				<span class="step-note">apply d again (1-form → 2-form)</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`= \left(\frac{\partial^2 f}{\partial x\,\partial y} - \frac{\partial^2 f}{\partial y\,\partial x}\right) dx \wedge dy`}
						display
					/>
				</div>
				<span class="step-note">mixed partials</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`= 0`} display /></div>
				<span class="step-note">mixed partials are equal for smooth f ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The proof uses the symmetry of mixed partial derivatives: <Katex
					math={r`f_{xy} = f_{yx}`}
				/>. In SDG, this symmetry is automatic — smooth functions have no choice but to have
				symmetric mixed partials, because the order of two infinitesimal perturbations cannot matter
				when both squares vanish.
			</p>
		</div>

		<SDGAdvantage title="Two Faces of d² = 0">
			<p>
				The exterior <Katex math={r`d^2 = 0`} /> (applying the derivative operator twice gives zero) and
				the infinitesimal <Katex math={r`d^2 = 0`} /> (the square of an infinitesimal is zero) are
				<strong>two faces of the same principle</strong>.
			</p>
			<p>
				In SDG, the equality of mixed partials <Katex math={r`f_{xy} = f_{yx}`} /> follows from the fact
				that <Katex math={r`d_1 \cdot d_2 = d_2 \cdot d_1`} /> — infinitesimal displacements commute.
				The antisymmetry of the wedge product then forces <Katex math={r`d(df) = 0`} />. The axiom
				that launched the book is the same axiom that completes it.
			</p>
		</SDGAdvantage>

		<!-- ═══ SECTION: Generalized Stokes' Theorem ═══ -->
		<div class="neo-prose" use:reveal>
			<h3 id="ch10-generalized-stokes">The Generalized Stokes' Theorem</h3>
			<p>
				We defined the exterior derivative by what it does on infinitesimal cells: <Katex
					math={r`\int_C d\omega = \int_{\partial C} \omega`}
				/> for every infinitesimal cube <Katex math="C" />. What happens when we sum this over a
				<em>finite</em> region?
			</p>
			<p>
				The key mechanism: interior boundaries cancel. When two infinitesimal cells share a face,
				they traverse that face in opposite orientations. The alternation property means these
				contributions cancel exactly. Only the outer boundary survives.
			</p>
		</div>

		<Callout type="theorem" title="The Generalized Stokes' Theorem">
			<p>
				For suitable smooth differential forms <Katex math={r`\omega`} /> and oriented regions <Katex
					math="M"
				/>:
			</p>
			<Katex math={r`\int_M d\omega = \int_{\partial M} \omega`} display />
			<p>
				The integral of the derivative over the interior equals the integral of the form over the
				boundary.
			</p>
		</Callout>

		<div use:reveal>
			<StokesVisualizer />
		</div>

		<!-- Stokes unification figure (existing Figure 10.1) -->
		<Figure
			number="10.1"
			caption="Four theorems, one principle. Every classical 'integral theorem' is a special case of Stokes' theorem: the integral of d(something) over a region equals the integral of that something over the boundary."
		>
			<svg
				viewBox="0 0 460 260"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style="max-width:460px"
			>
				<!-- center theorem -->
				<rect
					x="130"
					y="10"
					width="200"
					height="50"
					rx="10"
					fill="#faf5ff"
					stroke="#a855f7"
					stroke-width="2"
				/>
				<text
					x="230"
					y="30"
					text-anchor="middle"
					font-size="11"
					font-family="Inter,sans-serif"
					fill="#a855f7"
					font-weight="700">STOKES' THEOREM</text
				>
				<text
					x="230"
					y="48"
					text-anchor="middle"
					font-size="12"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">∫ dω = ∫ ω</text
				>
				<!-- four special cases -->
				<!-- FTC -->
				<rect
					x="10"
					y="100"
					width="100"
					height="55"
					rx="8"
					fill="#eff6ff"
					stroke="#3b82f6"
					stroke-width="1.2"
				/>
				<text
					x="60"
					y="118"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#2563eb"
					font-weight="600">FTC</text
				>
				<text
					x="60"
					y="138"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">∫ f'dx = F(b)−F(a)</text
				>
				<text
					x="60"
					y="150"
					text-anchor="middle"
					font-size="8"
					font-family="Inter,sans-serif"
					fill="#94919b">0-form → 1-form</text
				>
				<!-- Green's -->
				<rect
					x="130"
					y="100"
					width="100"
					height="55"
					rx="8"
					fill="#ecfdf5"
					stroke="#059669"
					stroke-width="1.2"
				/>
				<text
					x="180"
					y="118"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#059669"
					font-weight="600">GREEN'S</text
				>
				<text
					x="180"
					y="138"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">∮ F·dr = ∬ curl</text
				>
				<text
					x="180"
					y="150"
					text-anchor="middle"
					font-size="8"
					font-family="Inter,sans-serif"
					fill="#94919b">1-form → 2-form</text
				>
				<!-- Classical Stokes -->
				<rect
					x="250"
					y="100"
					width="100"
					height="55"
					rx="8"
					fill="#fef3c7"
					stroke="#d97706"
					stroke-width="1.2"
				/>
				<text
					x="300"
					y="118"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#b45309"
					font-weight="600">STOKES'</text
				>
				<text
					x="300"
					y="138"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">∬ curl·n = ∮ F·dr</text
				>
				<text
					x="300"
					y="150"
					text-anchor="middle"
					font-size="8"
					font-family="Inter,sans-serif"
					fill="#94919b">1-form → 2-form (3D)</text
				>
				<!-- Divergence -->
				<rect
					x="370"
					y="100"
					width="80"
					height="55"
					rx="8"
					fill="#fef2f2"
					stroke="#ef4444"
					stroke-width="1.2"
				/>
				<text
					x="410"
					y="118"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#ef4444"
					font-weight="600">DIVERGENCE</text
				>
				<text
					x="410"
					y="138"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">∬ F·n = ∭ div</text
				>
				<text
					x="410"
					y="150"
					text-anchor="middle"
					font-size="8"
					font-family="Inter,sans-serif"
					fill="#94919b">2-form → 3-form</text
				>
				<!-- connector lines -->
				<line
					x1="180"
					y1="60"
					x2="60"
					y2="100"
					stroke="#a855f7"
					stroke-width="1"
					stroke-dasharray="4,3"
				/>
				<line
					x1="210"
					y1="60"
					x2="180"
					y2="100"
					stroke="#a855f7"
					stroke-width="1"
					stroke-dasharray="4,3"
				/>
				<line
					x1="250"
					y1="60"
					x2="300"
					y2="100"
					stroke="#a855f7"
					stroke-width="1"
					stroke-dasharray="4,3"
				/>
				<line
					x1="270"
					y1="60"
					x2="410"
					y2="100"
					stroke="#a855f7"
					stroke-width="1"
					stroke-dasharray="4,3"
				/>
				<!-- conclusion -->
				<text
					x="230"
					y="195"
					text-anchor="middle"
					font-size="12"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">"Integrating a derivative over a region</text
				>
				<text
					x="230"
					y="215"
					text-anchor="middle"
					font-size="12"
					font-family="Crimson Pro,serif"
					fill="#1a1a2e"
					font-style="italic">= evaluating the original on the boundary."</text
				>
				<text
					x="230"
					y="245"
					text-anchor="middle"
					font-size="11"
					font-family="Inter,sans-serif"
					fill="#a855f7"
					font-weight="500">One theorem. All of calculus.</text
				>
			</svg>
		</Figure>

		<!-- Cancellation figure (existing Figure 10.2) -->
		<Figure
			number="10.2"
			caption="Why Stokes works: when you sum dω over adjacent cells, shared edges have opposite orientations and cancel. Only the outer boundary survives. This is the same telescoping that gives us the FTC — now in any dimension."
		>
			<svg
				viewBox="0 0 420 210"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style="max-width:420px"
			>
				<!-- 4×3 grid -->
				<rect
					x="60"
					y="20"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="135"
					y="20"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="210"
					y="20"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="285"
					y="20"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="60"
					y="70"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="135"
					y="70"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.07)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="210"
					y="70"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.07)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="285"
					y="70"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="60"
					y="120"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="135"
					y="120"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="210"
					y="120"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<rect
					x="285"
					y="120"
					width="75"
					height="50"
					fill="rgba(168,85,247,0.04)"
					stroke="#d8d5ce"
					stroke-width="0.8"
				/>
				<!-- interior opposing arrows on a shared vertical edge -->
				<line x1="210" y1="78" x2="210" y2="92" stroke="#ef4444" stroke-width="2.5" />
				<polygon points="210,78 207,83 213,83" fill="#ef4444" />
				<line x1="210" y1="108" x2="210" y2="94" stroke="#3b82f6" stroke-width="2.5" />
				<polygon points="210,108 207,103 213,103" fill="#3b82f6" />
				<!-- X mark showing cancellation -->
				<line x1="205" y1="88" x2="215" y2="98" stroke="#ef4444" stroke-width="1.5" opacity="0.7" />
				<line x1="215" y1="88" x2="205" y2="98" stroke="#ef4444" stroke-width="1.5" opacity="0.7" />
				<!-- interior opposing arrows on a shared horizontal edge -->
				<line x1="165" y1="70" x2="179" y2="70" stroke="#ef4444" stroke-width="2.5" />
				<polygon points="179,70 174,67 174,73" fill="#ef4444" />
				<line x1="205" y1="70" x2="191" y2="70" stroke="#3b82f6" stroke-width="2.5" />
				<polygon points="191,70 196,67 196,73" fill="#3b82f6" />
				<line x1="183" y1="65" x2="193" y2="75" stroke="#ef4444" stroke-width="1.5" opacity="0.7" />
				<line x1="193" y1="65" x2="183" y2="75" stroke="#ef4444" stroke-width="1.5" opacity="0.7" />
				<!-- label -->
				<text
					x="250"
					y="96"
					font-size="10"
					font-family="Inter,sans-serif"
					fill="#ef4444"
					font-weight="600">opposite → cancel</text
				>
				<!-- outer boundary (thick, purple) -->
				<rect
					x="60"
					y="20"
					width="300"
					height="150"
					fill="none"
					stroke="#a855f7"
					stroke-width="3"
					rx="2"
				/>
				<!-- arrows on outer boundary showing net orientation -->
				<polygon points="210,18 207,13 213,13" fill="#a855f7" />
				<polygon points="210,172 207,177 213,177" fill="#a855f7" />
				<polygon points="58,95 53,92 53,98" fill="#a855f7" />
				<polygon points="362,95 367,92 367,98" fill="#a855f7" />
				<text
					x="210"
					y="195"
					text-anchor="middle"
					font-size="11"
					font-family="Inter,sans-serif"
					fill="#a855f7"
					font-weight="600">only the outer boundary survives</text
				>
			</svg>
		</Figure>

		<SDGAdvantage title="Stokes' Proof: Algebra, Not Analysis">
			<p>
				In standard calculus, proving the generalized Stokes' theorem requires partitions of unity,
				orientation theory, and careful analytic estimates. In SDG, the proof is <em>algebraic</em>:
				sum the defining identity <Katex math={r`\int_C d\omega = \int_{\partial C} \omega`} /> over all
				infinitesimal cells. Interior faces cancel by alternation. The outer boundary is all that remains.
				This is the core mechanism; a full formal treatment still tracks regularity and orientation hypotheses.
			</p>
		</SDGAdvantage>

		<RevealBox
			title="Extension Studio: Four Classical Theorems as Stokes Specializations"
			subtitle="Optional first-pass branch"
			tone="math"
		>
		<!-- ═══ SECTION: Deriving the Classical Theorems ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The four classical theorems</h3>
			<p>
				Now we derive the four classical integration theorems in this course as short
				specializations of Stokes'. This is one of the most satisfying moments in all of
				mathematics: four theorems that seemed unrelated turn out to be a single theorem in
				disguise.
			</p>
		</div>

		<!-- FTC -->
		<div class="neo-prose" use:reveal>
			<h4>I. The Fundamental Theorem of Calculus</h4>
			<p>
				Take <Katex math={r`\omega = F`} /> (a 0-form, i.e., a function) and <Katex
					math={r`M = [a, b]`}
				/> (an interval on the line).
			</p>
			<ul>
				<li><Katex math={r`d\omega = dF = F'(x)\,dx`} /> — a 1-form</li>
				<li>
					<Katex math={r`\partial M = \{b\} - \{a\}`} /> — the boundary of an interval is its two endpoints,
					with signs
				</li>
			</ul>
			<p>Stokes gives:</p>
			<Katex math={r`\int_a^b F'(x)\,dx = F(b) - F(a)`} display />
			<p>The Fundamental Theorem of Calculus. The theorem that started it all.</p>
		</div>

		<!-- Green's Theorem -->
		<div class="neo-prose" use:reveal>
			<h4>II. Green's Theorem</h4>
			<p>
				Take <Katex math={r`\omega = P\,dx + Q\,dy`} /> (a 1-form on <Katex
					math={r`\mathbb{R}^2`}
				/>) and <Katex math="M = R" /> (a region in the plane).
			</p>
			<ul>
				<li>
					<Katex
						math={r`d\omega = \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dx \wedge dy`}
					/> — a 2-form
				</li>
				<li>
					<Katex math={r`\partial M = C`} /> — the boundary curve of the region, traversed counterclockwise
				</li>
			</ul>
			<p>Stokes gives:</p>
			<Katex
				math={r`\oint_C P\,dx + Q\,dy = \iint_R \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dA`}
				display
			/>
			<p>
				Green's Theorem. The line integral around a closed curve equals the double integral of the
				curl over the enclosed region.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked example: Green's theorem on the unit disk</div>
			<p style="margin-bottom: 0.5rem;">
				Let <Katex math={r`\omega = -y\,dx + x\,dy`} /> and let <Katex math="R" /> be the unit disk <Katex
					math={r`x^2 + y^2 \le 1`}
				/>.
			</p>
			<div class="step">
				<div class="step-math"><Katex math={r`P = -y, \quad Q = x`} display /></div>
				<span class="step-note">read off components</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 1 - (-1) = 2`}
						display
					/>
				</div>
				<span class="step-note">compute the curl</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\iint_R 2\,dA = 2 \cdot \text{Area}(R) = 2\pi`} display />
				</div>
				<span class="step-note">integrate over the disk</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\oint_C -y\,dx + x\,dy = 2\pi`} display /></div>
				<span class="step-note">Green's theorem confirmed ✓</span>
			</div>
			<p style="margin-top: 0.5rem;">
				The line integral <Katex math={r`\frac{1}{2}\oint_C x\,dy - y\,dx`} /> computes the
				<em>area</em> of the enclosed region — this is the surveyor's formula!
			</p>
		</div>

		<!-- Classical Stokes in 3D -->
		<div class="neo-prose" use:reveal>
			<h4>III. The Classical Stokes' Theorem (3D)</h4>
			<p>
				Take <Katex math={r`\omega = P\,dx + Q\,dy + R\,dz`} /> (a 1-form on <Katex
					math={r`\mathbb{R}^3`}
				/>) and <Katex math="M = S" /> (an oriented surface in space).
			</p>
			<ul>
				<li>
					<Katex math={r`d\omega`} /> involves all the partial cross-terms — this is exactly the curl
					<Katex math={r`\nabla \times \mathbf{F}`} /> rewritten as a 2-form
				</li>
				<li><Katex math={r`\partial M = C`} /> — the boundary curve of the surface</li>
			</ul>
			<p>Stokes gives:</p>
			<Katex
				math={r`\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}`}
				display
			/>
			<p>
				The classical Stokes' theorem. The circulation of a vector field around the boundary of a
				surface equals the flux of its curl through the surface.
			</p>
		</div>

		<!-- Divergence Theorem -->
		<div class="neo-prose" use:reveal>
			<h4>IV. The Divergence Theorem</h4>
			<p>
				Take <Katex math={r`\omega = P\,dy \wedge dz + Q\,dz \wedge dx + R\,dx \wedge dy`} /> (a 2-form
				on <Katex math={r`\mathbb{R}^3`} />) and <Katex math="M = V" /> (a solid region).
			</p>
			<ul>
				<li>
					<Katex
						math={r`d\omega = \left(\frac{\partial P}{\partial x} + \frac{\partial Q}{\partial y} + \frac{\partial R}{\partial z}\right) dx \wedge dy \wedge dz`}
					/> — the divergence times the volume form
				</li>
				<li><Katex math={r`\partial M = S`} /> — the boundary surface of the solid</li>
			</ul>
			<p>Stokes gives:</p>
			<Katex
				math={r`\oiint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_V (\nabla \cdot \mathbf{F})\, dV`}
				display
			/>
			<p>
				The Divergence Theorem. The outward flux of a vector field through a closed surface equals
				the integral of its divergence over the enclosed volume.
			</p>
		</div>

		<SDGAdvantage title="Four Theorems, Four Specializations">
			<p>
				Each classical theorem is obtained by choosing a specific degree of form and a specific
				dimension of region. Once generalized Stokes is in place, the standard quartet (FTC, Green,
				classical Stokes, Divergence) appears as direct corollaries. The language of forms makes the
				common structure explicit.
			</p>
		</SDGAdvantage>
		</RevealBox>

		<!-- ═══ SECTION: de Rham Cohomology ═══ -->
		<div class="neo-prose" use:reveal>
			<h4 id="ch10-closed-exact">Closed and exact forms: detecting holes</h4>
			<p>
				The equation <Katex math={r`d^2 = 0`} /> has a profound consequence. If <Katex
					math={r`\omega = d\eta`}
				/> for some form <Katex math={r`\eta`} />, then automatically <Katex
					math={r`d\omega = d(d\eta) = 0`}
				/>. So every "derivative of something" has zero derivative — every
				<strong>exact form</strong>
				is <strong>closed</strong>.
			</p>
			<p>
				But is the converse true? If <Katex math={r`d\omega = 0`} />, must <Katex
					math={r`\omega = d\eta`}
				/> for some <Katex math={r`\eta`} />?
			</p>
			<p>
				On simple domains (no holes), the answer is <strong>yes</strong> — this is the
				<strong>Poincar&eacute; lemma</strong>. But on domains with holes, there can be closed forms
				that are not exact. And these forms <em>detect the holes</em>.
			</p>
		</div>

		<Callout type="definition" title="Closed and Exact Forms">
			<p>
				A form <Katex math={r`\omega`} /> is <strong>closed</strong> if <Katex
					math={r`d\omega = 0`}
				/>.
			</p>
			<p>
				A form <Katex math={r`\omega`} /> is <strong>exact</strong> if <Katex
					math={r`\omega = d\eta`}
				/> for some form <Katex math={r`\eta`} />.
			</p>
			<p>
				Every exact form is closed (since <Katex math={r`d^2 = 0`} />). The question "is every
				closed form exact?" depends on the <em>topology</em> of the domain.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Example:</strong> On <Katex math={r`\mathbb{R}^2 \setminus \{0\}`} /> (the plane with
				the origin removed), consider the 1-form:
			</p>
			<Katex math={r`\omega = \frac{-y\,dx + x\,dy}{x^2 + y^2}`} display />
			<p>
				A computation shows <Katex math={r`d\omega = 0`} /> — it is closed. And it integrates to <Katex
					math={r`2\pi`}
				/> around any circle enclosing the origin. But if it were exact (<Katex
					math={r`\omega = d\theta`}
				/> for a globally defined function <Katex math={r`\theta`} />), then by Stokes, <Katex
					math={r`\oint \omega = \theta(\text{end}) - \theta(\text{start}) = 0`}
				/> for any closed curve. Contradiction!
			</p>
			<p>
				This form is closed but not exact. It detects the "hole" at the origin. The study of which
				closed forms are exact — and which aren't — is called <strong>de Rham cohomology</strong>.
				It is where calculus meets topology, and it shows that the equation <Katex
					math={r`d^2 = 0`}
				/> has implications far beyond computation.
			</p>
		</div>

		<DigDeeper title="The angle form and winding numbers">
			<p>
				The form <Katex math={r`\omega = \frac{-y\,dx + x\,dy}{x^2 + y^2}`} /> is the exterior derivative
				of the angle function <Katex math={r`\theta = \arctan(y/x)`} /> — but <Katex
					math={r`\theta`}
				/> is only defined <em>locally</em>, not globally on <Katex
					math={r`\mathbb{R}^2 \setminus \{0\}`}
				/> (it jumps by <Katex math={r`2\pi`} /> when you go around the origin). The integral <Katex
					math={r`\frac{1}{2\pi}\oint_C \omega`}
				/> counts how many times the curve <Katex math="C" /> winds around the origin — the
				<strong>winding number</strong>. This connects calculus to topology in the most concrete
				possible way.
			</p>
		</DigDeeper>

		<FailureModeBox
			title="Failure Mode: Local Primitive Assumed Global"
			trigger="Treating a locally exact form as globally exact on a domain with holes"
			symptom="Predicted loop integral is zero, but computation gives a nonzero winding contribution"
			recovery="Check topology first; use chart-wise primitives and track global obstructions via closed-vs-exact analysis"
		/>

		<RevealBox
			title="Extension Studio: Variational Mechanics Bridge"
			subtitle="Optional first-pass branch"
			tone="math"
		>
		<!-- ═══ SECTION: Euler-Lagrange / Principle of Least Action ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>The principle of least action</h4>
			<p>
				The language of forms doesn't just unify the theorems of calculus — it connects to the
				variational framework used across physics. The <strong
					>principle of stationary action</strong
				>
				says that, in many classical models, physical trajectories make a quantity called the
				<em>action</em> stationary.
			</p>
			<p>
				The action is an integral of a function called the <strong>Lagrangian</strong>
				<Katex math={r`L(x, \dot{x}, t)`} /> over time:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`S[x] = \int_{t_0}^{t_1} L\bigl(x(t),\, \dot{x}(t),\, t\bigr)\, dt`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				In SDG, we derive the equation that nature's path must satisfy — the <strong
					>Euler-Lagrange equation</strong
				>
				— by nudging the path by an infinitesimal variation. If <Katex math={r`x(t)`} /> is the true path
				and <Katex math={r`x(t) + d \cdot \eta(t)`} /> is a nearby path (where <Katex
					math={r`\eta`}
				/> vanishes at the endpoints), then stationarity of the action requires:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Euler-Lagrange Equation</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`S[x + d\eta] = S[x] + d\int_{t_0}^{t_1}\!\left(\frac{\partial L}{\partial x}\eta + \frac{\partial L}{\partial \dot{x}}\dot{\eta}\right) dt`}
						display
					/>
				</div>
				<span class="step-note">expand to first order in d</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{Integrate } \frac{\partial L}{\partial \dot{x}}\dot{\eta} \text{ by parts: boundary terms vanish}`}
						display
					/>
				</div>
				<span class="step-note"><Katex math={r`\eta = 0`} /> at endpoints</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`d\int_{t_0}^{t_1}\!\left(\frac{\partial L}{\partial x} - \frac{d}{dt}\frac{\partial L}{\partial \dot{x}}\right)\eta\, dt = 0`}
						display
					/>
				</div>
				<span class="step-note">for all <Katex math={r`\eta`} /></span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex
						math={r`\frac{\partial L}{\partial x} - \frac{d}{dt}\frac{\partial L}{\partial \dot{x}} = 0`}
						display
					/>
				</div>
				<span class="step-note">the Euler-Lagrange equation ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This equation generates a large class of classical mechanics models. With <Katex
					math={r`L = \tfrac{1}{2}m\dot{x}^2 - V(x)`}
				/>, it gives Newton's <Katex math={r`F = ma`} />. With richer Lagrangians and additional
				structure, the same variational method underlies formulations used in electromagnetism,
				relativity, and field theory. SDG makes the first-order variational algebra transparent.
			</p>
		</div>
		</RevealBox>

		<!-- ═══ SECTION: The Grand Unification ═══ -->
		<Callout type="key-idea" title="The Grand Unification">
			<p>
				Much of first-course calculus can be read through one theme: <strong
					>local differential data and global integral data are linked by boundary operators</strong
				>. Derivatives capture local change; integration accumulates it. Stokes' theorem makes that
				link explicit in a uniform language.
			</p>
			<p>
				In this text, the mainline development centers on <Katex math="d^2 = 0" />, together with
				smoothness and orientation assumptions when needed.
			</p>
		</Callout>

		<!-- ═══ HISTORY ═══ -->
		<HistoryBox name="Élie Cartan" years="1869–1951">
			<p>
				Élie Cartan created the theory of differential forms, the exterior derivative, and the
				general Stokes' theorem. Before Cartan, the integral theorems of Green, Stokes, and Gauss
				were proved separately, each with its own specialized argument. Cartan saw that they were
				all the same theorem — <Katex math={r`\int_M d\omega = \int_{\partial M} \omega`} /> — applied
				to forms of different degree.
			</p>
			<p>
				His work unified a century of integral theorems into a single equation. He also introduced
				the "moving frame" method, made foundational contributions to Lie groups, and laid the
				groundwork for modern differential geometry. Einstein reportedly said of Cartan's work on
				connections and geometry: "If only I had known this mathematics earlier."
			</p>
		</HistoryBox>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li>
					A <strong>k-form</strong> is a machine that measures infinitesimal k-dimensional content: 0-forms
					are functions, 1-forms measure displacement, 2-forms measure area.
				</li>
				<li>
					The <strong>wedge product</strong>
					<Katex math={r`\wedge`} /> combines forms. It is antisymmetric: <Katex
						math={r`dx \wedge dy = -dy \wedge dx`}
					/>, and <Katex math={r`dx \wedge dx = 0`} />.
				</li>
				<li>
					A 1-form in 2D: <Katex math={r`\omega = P\,dx + Q\,dy`} />. A 2-form in 2D: <Katex
						math={r`\omega = f\,dx \wedge dy`}
					/>.
				</li>
				<li>
					The <strong>exterior derivative</strong>
					<Katex math="d" /> sends k-forms to (k+1)-forms: <Katex
						math={r`df = f_x\,dx + f_y\,dy`}
					/>, and <Katex math={r`d(P\,dx + Q\,dy) = (Q_x - P_y)\,dx \wedge dy`} />.
				</li>
				<li>
					<Katex math={r`d^2 = 0`} /> for the exterior derivative — the same <Katex
						math={r`d^2 = 0`}
					/> that launched this book. Two faces of one principle.
				</li>
				<li>
					The <strong>Generalized Stokes' Theorem</strong>: <Katex
						math={r`\int_M d\omega = \int_{\partial M} \omega`}
					/>. Proved by the cancellation of interior boundaries.
				</li>
				<li>
					The standard quartet — <strong>FTC, Green's, Stokes', Divergence</strong> — appears as specializations
					of this framework.
				</li>
				<li>
					<strong>Closed</strong> forms (<Katex math={r`d\omega = 0`} />) that are not
					<strong>exact</strong>
					(<Katex math={r`\omega \neq d\eta`} />) detect topological holes.
				</li>
				<li>
					The <strong>Euler-Lagrange equation</strong> follows from infinitesimal variation of the action
					— a major organizing principle in classical mechanics, presented in first-order algebraic form.
				</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (Core 1-10, Extension optional)</summary>

			<Exercise number={1}>
				<p>
					<strong>Warm-up.</strong> Compute <Katex math={r`df`} /> for the 0-form <Katex
						math={r`f(x,y) = x^3 + y^2`}
					/>.
				</p>
				{#snippet solution()}<p>
						We have <Katex math={r`\frac{\partial f}{\partial x} = 3x^2`} /> and <Katex
							math={r`\frac{\partial f}{\partial y} = 2y`}
						/>, so:
					</p>
					<Katex math={r`df = 3x^2\,dx + 2y\,dy`} display />{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Warm-up.</strong> Compute <Katex math={r`df`} /> for <Katex
						math={r`f(x,y) = e^x \sin y`}
					/>.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`\frac{\partial f}{\partial x} = e^x \sin y`} />, <Katex
							math={r`\frac{\partial f}{\partial y} = e^x \cos y`}
						/>. So:
					</p>
					<Katex math={r`df = e^x \sin y\,dx + e^x \cos y\,dy`} display />{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Warm-up.</strong> Compute <Katex math={r`dx \wedge dy + dy \wedge dx`} />. What do
					you get?
				</p>
				{#snippet solution()}<p>
						By antisymmetry, <Katex math={r`dy \wedge dx = -dx \wedge dy`} />. So <Katex
							math={r`dx \wedge dy + dy \wedge dx = dx \wedge dy - dx \wedge dy = 0`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Show that <Katex math={r`dx \wedge dy = -dy \wedge dx`} /> directly from
					the definition of the wedge product as oriented area.
				</p>
				{#snippet solution()}<p>
						For vectors <Katex math={r`\mathbf{v} = (v_1, v_2)`} /> and <Katex
							math={r`\mathbf{w} = (w_1, w_2)`}
						/>:
					</p>
					<Katex
						math={r`(dx \wedge dy)(\mathbf{v}, \mathbf{w}) = v_1 w_2 - v_2 w_1`}
						display
					/><Katex
						math={r`(dy \wedge dx)(\mathbf{v}, \mathbf{w}) = v_2 w_1 - v_1 w_2 = -(v_1 w_2 - v_2 w_1)`}
						display
					/>
					<p>
						These are negatives of each other, confirming <Katex
							math={r`dx \wedge dy = -dy \wedge dx`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Compute <Katex math={r`d\omega`} /> for the 1-form <Katex
						math={r`\omega = xy\,dx + x^2\,dy`}
					/>.
				</p>
				{#snippet solution()}<p>With <Katex math={r`P = xy`} /> and <Katex math={r`Q = x^2`} />:</p>
					<Katex
						math={r`\frac{\partial Q}{\partial x} = 2x, \qquad \frac{\partial P}{\partial y} = x`}
						display
					/><Katex math={r`d\omega = (2x - x)\,dx \wedge dy = x\,dx \wedge dy`} display />{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Verify that <Katex math={r`d(df) = 0`} /> for <Katex
						math={r`f(x,y) = x^2 y + \sin(xy)`}
					/>.
				</p>
				{#snippet solution()}<p>
						First: <Katex math={r`f_x = 2xy + y\cos(xy)`} />, <Katex
							math={r`f_y = x^2 + x\cos(xy)`}
						/>.
					</p>
					<p>Now <Katex math={r`d(df) = (f_{yx} - f_{xy})\,dx \wedge dy`} />. We compute:</p>
					<Katex
						math={r`f_{xy} = \frac{\partial}{\partial y}(2xy + y\cos(xy)) = 2x + \cos(xy) - xy\sin(xy)`}
						display
					/><Katex
						math={r`f_{yx} = \frac{\partial}{\partial x}(x^2 + x\cos(xy)) = 2x + \cos(xy) - xy\sin(xy)`}
						display
					/>
					<p>These are equal, so <Katex math={r`d(df) = 0`} />. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Core.</strong> Verify Green's theorem for <Katex
						math={r`\omega = xy\,dx + x^2\,dy`}
					/> on the unit square <Katex math={r`[0,1] \times [0,1]`} />.
				</p>
				{#snippet solution()}<p>
						<strong>Right side (area integral):</strong> From Exercise 5, <Katex
							math={r`d\omega = x\,dx \wedge dy`}
						/>. So:
					</p>
					<Katex
						math={r`\iint_R x\,dA = \int_0^1\int_0^1 x\,dx\,dy = \int_0^1 \frac{1}{2}\,dy = \frac{1}{2}`}
						display
					/>
					<p>
						<strong>Left side (line integral):</strong> We integrate <Katex
							math={r`\omega = xy\,dx + x^2\,dy`}
						/> counterclockwise around the boundary.
					</p>
					<p>
						Bottom (<Katex math={r`y=0, 0 \le x \le 1`} />): <Katex
							math={r`\int_0^1 0\,dx + x^2 \cdot 0 = 0`}
						/>
					</p>
					<p>
						Right (<Katex math={r`x=1, 0 \le y \le 1`} />): <Katex
							math={r`\int_0^1 y \cdot 0 + 1\,dy = 1`}
						/>
					</p>
					<p>
						Top (<Katex math={r`y=1, 1 \ge x \ge 0`} />): <Katex
							math={r`\int_1^0 x\,dx + x^2 \cdot 0 = -\frac{1}{2}`}
						/>
					</p>
					<p>
						Left (<Katex math={r`x=0, 1 \ge y \ge 0`} />): <Katex math={r`\int_1^0 0 + 0 = 0`} />
					</p>
					<p>
						Total: <Katex math={r`0 + 1 - \frac{1}{2} + 0 = \frac{1}{2}`} />. Both sides agree. ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Core.</strong> Explain how the Fundamental Theorem of Calculus <Katex
						math={r`\int_a^b f'(x)\,dx = f(b) - f(a)`}
					/> is a special case of Stokes' theorem. Which form? Which region? Which boundary?
				</p>
				{#snippet solution()}<p>
						Take <Katex math={r`\omega = f`} /> (a 0-form), <Katex math={r`M = [a,b]`} /> (a 1-dimensional
						region). Then <Katex math={r`d\omega = f'(x)\,dx`} /> (a 1-form), and <Katex
							math={r`\partial M = \{b\} - \{a\}`}
						/> (the two endpoints with signs). Stokes gives <Katex
							math={r`\int_M d\omega = \omega|_{\partial M}`}
						/>, which is <Katex math={r`\int_a^b f'\,dx = f(b) - f(a)`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p>
					<strong>Core.</strong> Which classical theorem (FTC, Green's, Stokes' 3D, or Divergence)
					do you get when you apply the generalized Stokes' theorem with <Katex math={r`\omega`} /> a
					2-form on <Katex math={r`\mathbb{R}^3`} /> and <Katex math="M" /> a solid region?
				</p>
				{#snippet solution()}<p>
						The Divergence Theorem. The 2-form integrates over the boundary surface <Katex
							math={r`\partial M`}
						/> (giving the flux <Katex math={r`\oiint_S \mathbf{F} \cdot d\mathbf{S}`} />), and its
						exterior derivative is a 3-form that integrates over the volume (giving <Katex
							math={r`\iiint_V \nabla \cdot \mathbf{F}\,dV`}
						/>).
					</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p>
					<strong>Core.</strong> Why do "interior contributions cancel" when summing <Katex
						math={r`d\omega`}
					/> over adjacent infinitesimal cells? Use the alternation property of forms to explain.
				</p>
				{#snippet solution()}<p>
						Adjacent cells share a face, but with opposite orientations. The alternation property of
						forms means: when you swap the orientation of a face, the integral changes sign. So the
						contribution of <Katex math={r`\omega`} /> on the shared face from one cell is the exact negative
						of its contribution from the adjacent cell. They cancel, leaving only the faces on the outer
						boundary.
					</p>{/snippet}
			</Exercise>

			<RevealBox
				title="Extension Exercises (11-13)"
				subtitle="Open for variational and topology-focused problems"
				tone="math"
			>
			<Exercise number={11}>
				<p>
					<strong>Challenge.</strong> For the projectile Lagrangian <Katex
						math={r`L = \tfrac{1}{2}m\dot{y}^2 - mgy`}
					/>, apply the Euler-Lagrange equation to derive Newton's second law for a falling object.
				</p>
				{#snippet solution()}<p>
						The Euler-Lagrange equation is <Katex
							math={r`\frac{\partial L}{\partial y} - \frac{d}{dt}\frac{\partial L}{\partial \dot{y}} = 0`}
						/>.
					</p>
					<Katex
						math={r`\frac{\partial L}{\partial y} = -mg, \qquad \frac{\partial L}{\partial \dot{y}} = m\dot{y}`}
						display
					/><Katex
						math={r`-mg - \frac{d}{dt}(m\dot{y}) = 0 \quad \Longrightarrow \quad m\ddot{y} = -mg`}
						display
					/>
					<p>
						This is Newton's second law: <Katex math={r`ma = -mg`} />, or equivalently, the
						acceleration due to gravity is <Katex math={r`\ddot{y} = -g`} />. ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p>
					<strong>Challenge.</strong> Derive the wave equation from the Lagrangian density <Katex
						math={r`\mathcal{L} = \tfrac{1}{2}\bigl(u_t^2 - c^2 u_x^2\bigr)`}
					/>, where <Katex math={r`u(x,t)`} /> is the displacement and <Katex math="c" /> is the wave
					speed. (Use the field-theoretic Euler-Lagrange equation: <Katex
						math={r`\frac{\partial \mathcal{L}}{\partial u} - \frac{\partial}{\partial t}\frac{\partial \mathcal{L}}{\partial u_t} - \frac{\partial}{\partial x}\frac{\partial \mathcal{L}}{\partial u_x} = 0`}
					/>.)
				</p>
				{#snippet solution()}<p>Compute each term:</p>
					<Katex
						math={r`\frac{\partial \mathcal{L}}{\partial u} = 0, \qquad \frac{\partial \mathcal{L}}{\partial u_t} = u_t, \qquad \frac{\partial \mathcal{L}}{\partial u_x} = -c^2 u_x`}
						display
					/>
					<p>The Euler-Lagrange equation gives:</p>
					<Katex
						math={r`0 - \frac{\partial}{\partial t}(u_t) - \frac{\partial}{\partial x}(-c^2 u_x) = 0`}
						display
					/><Katex math={r`-u_{tt} + c^2 u_{xx} = 0`} display /><Katex
						math={r`\boxed{u_{tt} = c^2 u_{xx}}`}
						display
					/>
					<p>The one-dimensional wave equation. ✓</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p>
					<strong>Exploration.</strong> The 1-form <Katex
						math={r`\omega = \frac{-y\,dx + x\,dy}{x^2 + y^2}`}
					/> on <Katex math={r`\mathbb{R}^2 \setminus \{0\}`} /> is closed but not exact. Verify that
					<Katex math={r`d\omega = 0`} /> by direct computation. Then explain intuitively why it cannot
					be exact.
				</p>
				{#snippet solution()}<p>
						With <Katex math={r`P = \frac{-y}{x^2+y^2}`} /> and <Katex
							math={r`Q = \frac{x}{x^2+y^2}`}
						/>:
					</p>
					<Katex
						math={r`\frac{\partial Q}{\partial x} = \frac{(x^2+y^2) - x \cdot 2x}{(x^2+y^2)^2} = \frac{y^2 - x^2}{(x^2+y^2)^2}`}
						display
					/><Katex
						math={r`\frac{\partial P}{\partial y} = \frac{-(x^2+y^2) + y \cdot 2y}{(x^2+y^2)^2} = \frac{y^2 - x^2}{(x^2+y^2)^2}`}
						display
					/>
					<p>So <Katex math={r`Q_x - P_y = 0`} />, confirming <Katex math={r`d\omega = 0`} />.</p>
					<p>
						If <Katex math={r`\omega`} /> were exact, say <Katex math={r`\omega = d\theta`} />, then
						by Stokes' theorem <Katex
							math={r`\oint_C \omega = \theta(\text{end}) - \theta(\text{start}) = 0`}
						/> for any closed curve <Katex math="C" />. But <Katex
							math={r`\oint_C \omega = 2\pi`}
						/> for a circle around the origin. Contradiction. The "hole" at the origin prevents <Katex
						math={r`\omega`}
						/> from being exact.
					</p>{/snippet}
			</Exercise>
			</RevealBox>
		</details>

		<!-- ═══ CLOSING REFLECTION ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Coda: one axiom</h4>
			<p>
				We began this book with a single equation: <Katex math="d^2 = 0" />. An infinitesimal
				displacement, squared, gives zero. It seemed like a small thing — a quirky rule about very
				small numbers.
			</p>
			<p>
				From that one equation, we built a derivative workflow for smooth functions in this text,
				using algebraic coefficient extraction. We built integration as accumulation of
				infinitesimal contributions, and we established the Fundamental Theorem of Calculus through
				telescoping.
			</p>
			<p>
				Then we extended the same method to core function families: polynomials, exponentials,
				trigonometric functions, and logarithms. We derived the chain, product, and quotient rules;
				built Taylor expansions; and applied the framework to differential equations and geometric
				quantities.
			</p>
			<p>
				In this final chapter, we saw the same first-order discipline reappear in exterior calculus.
				Within the assumptions made here, FTC, Green, classical Stokes, and Divergence fit into the
				common template <Katex math={r`\int_M d\omega = \int_{\partial M} \omega`} />. We also saw
				how closed-versus-exact forms detect topology, and how variational equations connect to
				mechanics.
			</p>
			<p>
				One axiom, used carefully with explicit assumptions, can organize a remarkably large part of
				calculus.
			</p>
		</div>

		<Callout type="key-idea" title="The Final Word">
			<p>
				From <Katex math="d^2 = 0" /> to Stokes' theorem, this text develops a coherent first-order mainline
				with one guiding axiom and clearly stated scope conditions.
			</p>
		</Callout>
	</div>
</section>
