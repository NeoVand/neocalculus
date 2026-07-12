<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import FormsOrientationExplorer from '$lib/components/demos/FormsOrientationExplorer.svelte';
	import StokesVisualizer from '$lib/components/demos/StokesVisualizer.svelte';
	import StokesFamilyExplorer from '$lib/components/demos/StokesFamilyExplorer.svelte';
	import TopologyLoopExplorer from '$lib/components/demos/TopologyLoopExplorer.svelte';
	import CurlDivergenceLab from '$lib/components/demos/CurlDivergenceLab.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch11">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 11</span>
			<h2 class="chapter-title">Differential Forms and Unification</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“Why do so many integral theorems say that the inside is determined by the boundary?”
				</blockquote>
				<p class="epigraph-attr">The question that brings calculus together</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The Fundamental Theorem of Calculus says that integrating a derivative over an interval
				leaves only two endpoint values:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_a^b F'(x)\,dx=F(b)-F(a)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				In a planar region, an analogous theorem turns a quantity spread across the interior into a
				quantity measured around the boundary curve. In space, surface and volume theorems do the
				same. These are not coincidences. They are instances of one idea:
			</p>
		</div>

		<Callout type="key-idea" title="The boundary principle">
			<p>
				Integrate a suitable derivative over an oriented region, and the result can be read from the
				original quantity on the oriented boundary.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				To state that principle in every dimension, we need objects that know whether they are meant
				to be integrated along a path, across a surface, or through a volume. Those objects are
				<strong>differential forms</strong>.
			</p>

			<h3>Forms are oriented measuring machines</h3>
			<p>
				At each point, a differential form accepts directions and returns a number. Its
				<strong>degree</strong> tells us how many directions it accepts—and therefore what kind of object
				it can measure.
			</p>
			<ul>
				<li>A <strong>0-form</strong> is a function. It measures a value at a point.</li>
				<li>
					A <strong>1-form</strong> accepts one tangent vector. It measures along a directed step.
				</li>
				<li>A <strong>2-form</strong> accepts two tangent vectors. It measures oriented area.</li>
				<li>
					A <strong>3-form</strong> accepts three tangent vectors. It measures oriented volume.
				</li>
			</ul>
			<p>
				A 1-form on the plane looks like <Katex math={r`\omega=P\,dx+Q\,dy`} />. Applied at a point
				to a vector <Katex math={r`\mathbf v=(v_1,v_2)`} />, it gives
				<Katex math={r`\omega(\mathbf v)=Pv_1+Qv_2`} />. This resembles a dot product, but the form
				is the measuring rule and the vector is the motion being measured.
			</p>
			<p>
				A 2-form must be <strong>alternating</strong>: swapping its two input directions reverses
				the sign. The basic planar area form is <Katex math={r`dx\wedge dy`} />, and
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(dx\wedge dy)(\mathbf v,\mathbf w)=v_1w_2-v_2w_1`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The right side is the signed area of the parallelogram spanned by the two vectors. Before
				moving the controls below, predict what happens when the vectors become parallel, and what
				happens when their order is reversed.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="11.1"
				caption="The wedge product measures oriented area. Counterclockwise order is positive, clockwise order is negative, and parallel directions give zero."
			>
				<FormsOrientationExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> Alternation packages orientation into algebra:
				<Katex math={r`dx\wedge dy=-dy\wedge dx`} /> and
				<Katex math={r`dx\wedge dx=0`} />. A weighted area form
				<Katex math={r`f(x,y)\,dx\wedge dy`} /> measures signed area with density <Katex
					math="f"
				/>.
			</p>

			<h4>Example 1: read a 1-form</h4>
			<p>
				For <Katex math={r`\omega=x\,dy-y\,dx`} />, the coefficients are
				<Katex math={r`P=-y`} /> and <Katex math={r`Q=x`} />. Therefore
				<Katex math={r`\omega(v_1,v_2)=-yv_1+xv_2`} />. On a circle centered at the origin, this
				form measures motion in the tangential direction; radial motion contributes zero.
			</p>

			<h3>The exterior derivative measures local boundary change</h3>
			<p>
				The exterior derivative raises degree by one. It turns a quantity measured on boundaries
				into a density measured in interiors. For a function <Katex math={r`f(x,y)`} />,
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`df=f_x\,dx+f_y\,dy`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is the derivative from Chapter 9 written as a 1-form:
				<Katex math={r`df(\mathbf v)=Df(\mathbf v)=\nabla f\cdot\mathbf v`} />. For a planar 1-form
				<Katex math={r`\omega=P\,dx+Q\,dy`} />,
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`d\omega=(Q_x-P_y)\,dx\wedge dy`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The coefficient <Katex math={r`Q_x-P_y`} /> is circulation density. A tiny positively oriented
				loop reads how much the 1-form turns around it; dividing by the ordinary loop area and taking
				the classical limit leads to this coefficient. In an SDG treatment, the same coordinate formula
				is encoded by the form’s action on first-order infinitesimal cells.
			</p>

			<h4>Put a local field under the microscope</h4>
			<p>
				A vector field has two different kinds of local behavior. <strong>Divergence</strong> asks
				whether a tiny material region gains or loses area. <strong>Curl</strong> asks whether a tiny
				paddlewheel tends to rotate. Move the paired probe below: its concentric green rings stream outward
				or inward with divergence, while its violet wheel turns with curl.
			</p>
			<p>
				These readings do not describe every possible deformation. In the saddle field, a tiny
				circle stretches into an ellipse even though both divergence and curl are zero. That is why
				the two probes are illuminating without being the whole derivative.
			</p>
		</div>

		<div id="curl-divergence-lab" use:reveal>
			<Figure
				number="11.2"
				caption="Divergence and curl ask different local questions of the same field. Concentric green wavefronts reveal the direction and strength of first-order area change; the violet paddlewheel reveals the direction and strength of local turning. Drag the probe or use the coordinate sliders, then compare pure rotation, pure expansion, saddle flow, and a field where both readings vary."
			>
				<CurlDivergenceLab />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example 2: differentiate a circulation form</h4>
			<p>
				Let <Katex math={r`\omega=x\,dy-y\,dx`} />. Since <Katex math={r`P=-y`} /> and <Katex
					math={r`Q=x`}
				/>,
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Compute <Katex math={r`d\omega`} /></div>
			<div class="step">
				<div class="step-math"><Katex math={r`Q_x=1,\qquad P_y=-1`} display /></div>
				<div class="step-note">differentiate the coefficients</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`d\omega=2\,dx\wedge dy`} display /></div>
				<div class="step-note">constant circulation density</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Thus the circulation of <Katex math="\omega" /> around a suitable planar boundary equals twice
				the signed area inside it. That sentence is already Green’s theorem for this particular form.
			</p>
		</div>

		<Callout type="warning" title="Two different meanings of d² = 0">
			<p>
				This book began with a first-order displacement <Katex math={r`\delta`} /> satisfying
				<Katex math={r`\delta^2=0`} />. The exterior derivative is conventionally written
				<Katex math="d" /> and satisfies <Katex math={r`d\circ d=0`} />. These are
				<strong>distinct, typed statements</strong>: one concerns an infinitesimal displacement; the
				other concerns an operator on forms. SDG relates their geometry, but identical notation does
				not make them the same axiom.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				For a twice continuously differentiable function, the operator identity follows from
				equality of mixed partials:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`d(df)=(f_{yx}-f_{xy})\,dx\wedge dy=0`} display />
		</div>

		<DigDeeper title="Why d raises degree">
			<p>
				A function changes along directed steps, so its derivative is a 1-form. A 1-form changes
				around tiny oriented loops, so its derivative is a 2-form. A 2-form changes across the faces
				of tiny oriented boxes, so its derivative is a 3-form. The degree shift records the passage
				from a boundary measurement to an interior density.
			</p>
		</DigDeeper>

		<div class="neo-prose" use:reveal>
			<h3>Stokes’ theorem: the boundary of the whole</h3>
			<p>
				For a compact oriented smooth region <Katex math="M" /> with boundary and a sufficiently smooth
				form <Katex math="\omega" /> of the correct degree, the generalized Stokes theorem says
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_M d\omega=\int_{\partial M}\omega`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Orientation is essential. Two neighboring cells traverse their shared face in opposite
				directions, so the two boundary contributions cancel. Only faces on the outer boundary
				remain. Change the grid size below and inspect one shared edge carefully.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="11.3"
				caption="Cell boundaries cancel in oppositely oriented pairs. This finite grid is a model of the cancellation mechanism; the theorem for smooth regions also requires the usual limiting and regularity arguments."
			>
				<StokesVisualizer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> Cancellation is the geometric heart of Stokes’ theorem, but it is not
				by itself a complete proof for arbitrary smooth regions. A classical proof controls orientations,
				charts or triangulations, limits, and regularity. We do not build a finite region from “infinitely
				many infinitesimal cells.”
			</p>

			<h3>Four theorems, one sentence</h3>
			<p>
				Choose each theorem in the explorer. Track three things: the dimension of the region, the
				object integrated over its boundary, and the derivative integrated through its interior.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="11.4"
				caption="FTC, Green’s theorem, the classical Stokes theorem, and the divergence theorem differ in dimension and interpretation, but share the form ∫M dω = ∫∂M ω."
			>
				<StokesFamilyExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> The symbol <Katex math="d" /> changes its coordinate appearance with
				the degree of the form, while Stokes’ theorem itself does not change.
			</p>

			<h3>Closed, exact, and the shape of a domain</h3>
			<p>
				A form is <strong>closed</strong> if <Katex math={r`d\omega=0`} />. It is
				<strong>exact</strong> if <Katex math={r`\omega=d\eta`} /> for some form
				<Katex math="\eta" />. Every exact form is closed because
				<Katex math={r`d\omega=d(d\eta)=0`} />.
			</p>
			<p>
				The converse is local under the hypotheses of the Poincaré lemma, and it is global on
				domains such as star-shaped regions. Holes can obstruct a global primitive. The most vivid
				example on the punctured plane is
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\omega=\frac{-y\,dx+x\,dy}{x^2+y^2}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Away from the origin, <Katex math={r`d\omega=0`} />. Yet every positively oriented circle
				around the missing point has <Katex math={r`\oint\omega=2\pi`} />. Move the loop radius
				below. The field weakens with distance, but the path becomes longer in exactly the
				compensating way.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="11.5"
				caption="A closed form need not be globally exact on a domain with a hole. The angular form has zero exterior derivative away from the origin but constant circulation 2π around every circle that encloses it."
			>
				<TopologyLoopExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> If this form were exact, its integral around every closed loop would
				be zero by Stokes’ theorem. The nonzero loop integral proves that no single-valued global potential
				exists on the punctured plane. The quotient “closed forms modulo exact forms” begins de Rham cohomology,
				where calculus detects topology.
			</p>

			<h3>Exercises</h3>
			<p>Keep degree, orientation, region, and boundary visible in every answer.</p>

			<Exercise number={1}>
				<p>
					Let <Katex math={r`\mathbf v=(2,1)`} /> and <Katex math={r`\mathbf w=(-1,3)`} />. Compute
					<Katex math={r`(dx\wedge dy)(\mathbf v,\mathbf w)`} /> and interpret its sign.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`2\cdot3-1\cdot(-1)=7`} />. The oriented area is 7, and the positive sign
						means the turn from <Katex math="\mathbf v" /> to <Katex math="\mathbf w" /> is counterclockwise.
					</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>Compute <Katex math={r`df`} /> for <Katex math={r`f(x,y)=x^2e^y`} />.</p>
				{#snippet solution()}<p><Katex math={r`df=2xe^y\,dx+x^2e^y\,dy`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					Compute <Katex math={r`d\omega`} /> for
					<Katex math={r`\omega=xy\,dx+x^2\,dy`} />.
				</p>
				{#snippet solution()}<p>
						Here <Katex math={r`P=xy`} /> and <Katex math={r`Q=x^2`} />, so
						<Katex math={r`d\omega=(2x-x)\,dx\wedge dy=x\,dx\wedge dy`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					Explain precisely why the first-order statement <Katex math={r`\delta^2=0`} /> and the exterior
					operator statement <Katex math={r`d\circ d=0`} /> should not be identified merely because both
					are often printed as “<Katex math={r`d^2=0`} />.”
				</p>
				{#snippet solution()}<p>
						<Katex math="\delta" /> is an element representing a first-order displacement, whereas
						<Katex math="d" /> is an operator sending a <Katex math="k" />-form to a
						<Katex math={r`(k+1)`} />-form. Their types and meanings differ.
					</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					Identify <Katex math="M" />, <Katex math="\omega" />, <Katex math="d\omega" />, and
					<Katex math="\partial M" /> when the generalized Stokes theorem becomes the FTC.
				</p>
				{#snippet solution()}<p>
						Take <Katex math={r`M=[a,b]`} />, <Katex math={r`\omega=F`} />,
						<Katex math={r`d\omega=F'(x)\,dx`} />, and
						<Katex math={r`\partial M=\{b\}-\{a\}`} />.
					</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					Why do two neighboring oriented cells contribute opposite values on their shared edge? Why
					does this explanation alone not prove Stokes’ theorem for every smooth region?
				</p>
				{#snippet solution()}<p>
						The induced boundary orientations on a shared edge are opposite, so the two integrals
						cancel. A general proof must additionally control a decomposition or charts, limiting
						processes, orientation consistency, and regularity.
					</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong>
					Show directly that the angular form in Figure 11.5 has
					<Katex math={r`d\omega=0`} /> away from the origin.
				</p>
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong>
					Use Green’s theorem to verify that
					<Katex math={r`\oint_C(x\,dy-y\,dx)=2\,\mathrm{Area}(R)`} /> for a positively oriented simple
					closed curve <Katex math="C" /> bounding a suitable planar region <Katex math="R" />.
				</p>
			</Exercise>
		</div>

		<ChapterSummary>
			<ul>
				<li>A <strong>k-form</strong> measures oriented k-dimensional input and is alternating.</li>
				<li>
					The wedge product builds higher-degree forms; <Katex math={r`dx\wedge dy`} /> measures signed
					area.
				</li>
				<li>
					The exterior derivative raises degree: <Katex math={r`f\mapsto df`} /> and <Katex
						math={r`\omega\mapsto d\omega`}
					/>.
				</li>
				<li>
					<Katex math={r`d\circ d=0`} /> for the exterior derivative is distinct from a nilpotent displacement
					satisfying <Katex math={r`\delta^2=0`} />.
				</li>
				<li>
					Generalized Stokes says <Katex math={r`\int_Md\omega=\int_{\partial M}\omega`} /> under the
					appropriate smoothness and orientation hypotheses.
				</li>
				<li>
					FTC, Green, classical Stokes, and divergence are dimension-specific readings of the same
					theorem.
				</li>
				<li>Closed forms that are not globally exact reveal topological obstructions.</li>
			</ul>
		</ChapterSummary>

		<div class="neo-prose" use:reveal>
			<h4>Coda: local change, global boundary</h4>
			<p>
				The book began by asking how a curve responds to a first-order displacement. It ends with
				the same local-to-global movement in a wider language. Derivatives describe local response.
				Integrals accumulate it. Orientation determines signs. Boundaries record what survives
				cancellation.
			</p>
			<p>
				Synthetic differential geometry supplies an exact first-order lens for smooth local
				behavior. Classical integration supplies the global accumulation principles and analytic
				hypotheses. Used together—and kept carefully distinct—they reveal a remarkably coherent
				calculus.
			</p>
		</div>

		<Callout type="key-idea" title="The final sentence">
			<p>
				Calculus is the study of how local change accumulates, and Stokes’ theorem says that the
				accumulated change inside a region is written on its boundary.
			</p>
		</Callout>
	</div>
</section>
