<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import ComplexMappingLab from '$lib/components/demos/ComplexMappingLab.svelte';
	import ComplexContourLab from '$lib/components/demos/ComplexContourLab.svelte';
	import ConformalDerivativeLab from '$lib/components/demos/ConformalDerivativeLab.svelte';
	import DomainColoringLab from '$lib/components/demos/DomainColoringLab.svelte';
	import ArgumentPrincipleLab from '$lib/components/demos/ArgumentPrincipleLab.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch10">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 10</span>
			<h2 class="chapter-title">Complex Analysis: Calculus in the Plane</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“In the complex plane, differentiability is not a mild request. It is a law of
					extraordinary rigidity.”
				</blockquote>
				<p class="epigraph-attr">One derivative must agree from every direction</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A real number lives on a line. A complex number lives on a plane. Write <Katex
					math={r`z=x+iy`}
				/>, where <Katex math={r`i^2=-1`} />. The real part <Katex math="x" /> tells us how far to move
				horizontally; the imaginary part <Katex math="y" /> tells us how far to move vertically.
			</p>
			<p>
				This is more than a convenient picture. Addition becomes vector addition, while
				multiplication combines a change of size with a rotation. If <Katex
					math={r`z=re^{i\theta}`}
				/>, then multiplying by <Katex math={r`ae^{i\phi}`} /> multiplies the distance from the origin
				by <Katex math="a" /> and turns the angle by <Katex math={r`\phi`} />.
			</p>
		</div>

		<Callout type="definition" title="Complex Number">
			<p>
				A <strong>complex number</strong> is <Katex math={r`z=x+iy`} /> with real <Katex
					math="x,y"
				/> and <Katex math={r`i^2=-1`} />. Its conjugate is <Katex math={r`\bar z=x-iy`} />, and its
				modulus is <Katex math={r`|z|=\sqrt{x^2+y^2}`} />.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>A function now moves an entire plane</h3>
			<p>
				A complex function accepts one point <Katex math="z" /> in the plane and produces another point
				<Katex math={r`w=f(z)`} />. A single height graph is no longer enough: the input already
				uses two dimensions and the output needs two more. Instead, we draw a grid in the input
				plane and watch the function bend that grid into the output plane.
			</p>
			<p>
				Vertical blue lines hold the real part fixed. Horizontal amber lines hold the imaginary part
				fixed. Their intersections cannot tear apart: both families must carry the same input point
				to the same output point. Try the four functions below and follow the violet point.
			</p>
		</div>

		<div id="complex-mapping-lab" use:reveal>
			<Figure
				number="10.1"
				caption="A complex function is a map from one plane to another. Squaring doubles angles, the exponential turns horizontal translation into radial scaling and vertical translation into rotation, and the reciprocal turns lines and circles into lines or circles."
				><ComplexMappingLab /></Figure
			>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Möbius maps: the geometry of division</h3>
			<p>
				The most important rational maps of degree one are <Katex
					math={r`T(z)=\frac{az+b}{cz+d},\qquad ad-bc\ne0`}
				/>. They are built from translations, rotations and dilations, and the inversion <Katex
					math={r`z\mapsto1/z`}
				/>. Their remarkable signature is that every line or circle becomes another line or
				circle—if we agree that a line is a circle passing through the point at infinity.
			</p>
			<p>
				Choose the Cayley map in Figure 10.1. The real axis becomes the unit circle, the upper
				half-plane becomes the unit disk, and complicated boundary geometry becomes round. This is
				why Möbius maps are not algebraic curiosities: they are coordinate changes chosen to make a
				problem’s geometry simpler.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Color can carry the missing two dimensions</h3>
			<p>
				A transformed grid shows what happens to selected lines. <strong>Domain coloring</strong>
				answers a different question: what is <Katex math={r`f(z)`} /> at every visible input point? We
				give each output direction a hue and use brightness bands for output magnitude. The resulting
				picture lives in the input plane, but every pixel reports information about the output plane.
			</p>
			<p>
				Around a zero, every output direction appears in sequence as the colors converge into a dark
				point. Around a pole, the colors run in the opposite order and the magnitude grows without
				bound. Count how many times the color wheel turns around a small loop: that integer will
				return later as a winding number.
			</p>
		</div>

		<div id="domain-coloring-lab" use:reveal>
			<Figure
				number="10.2"
				caption="An enhanced phase portrait of a complex function. Hue records arg f(z), while logarithmic brightness bands record |f(z)|. Zeros draw all hues inward; poles send magnitude outward and reverse the color order."
			>
				<DomainColoringLab />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>One derivative must work in every direction</h3>
			<p>
				For an ordinary real function, a small input change approaches zero from the left or the
				right. In the complex plane, a small change <Katex math="h" /> can approach from infinitely many
				directions. A complex derivative exists only when all of them give the same multiplier:
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`f'(z)=\lim_{h\to0}\frac{f(z+h)-f(z)}{h}`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				The quotient is complex division, so the derivative is itself a complex number. Locally,
				multiplication by <Katex math={r`f'(z)`} /> rotates every direction by the same angle and scales
				every direction by the same factor. A tiny circle therefore remains a circle—not a generic ellipse—unless
				<Katex math={r`f'(z)=0`} />.
			</p>
		</div>

		<div id="complex-derivative-picture" use:reveal>
			<Figure
				number="10.3"
				caption="Needham’s amplitwist: at a holomorphic point with nonzero derivative, a sufficiently small neighborhood undergoes one amplification and one twist. Shrink ε to watch two directional quotients converge; compare reflection and unequal stretching, where they never agree."
			>
				<ConformalDerivativeLab />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>The Cauchy–Riemann equations</h3>
			<p>
				Write the output as <Katex math={r`f(x+iy)=u(x,y)+iv(x,y)`} />. Approaching horizontally
				tests how <Katex math="u" /> and <Katex math="v" /> change with <Katex math="x" />.
				Approaching vertically tests how they change with <Katex math="y" />. Requiring those
				answers to describe the same complex multiplier gives
			</p>
		</div>
		<div class="key-equation" use:reveal><Katex math={r`u_x=v_y,\qquad u_y=-v_x`} display /></div>
		<div class="neo-prose" use:reveal>
			<p>
				These are the <strong>Cauchy–Riemann equations</strong>. They explain why complex
				differentiability is much stronger than ordinary differentiability in two real variables.
				For example, <Katex math={r`f(z)=z^2`} /> has <Katex math={r`u=x^2-y^2`} /> and <Katex
					math={r`v=2xy`}
				/>. Then <Katex math={r`u_x=2x=v_y`} /> and <Katex math={r`u_y=-2y=-v_x`} />, so the
				equations hold everywhere.
			</p>
			<p>
				By contrast, <Katex math={r`f(z)=\bar z`} /> has <Katex math={r`u=x`} /> and <Katex
					math={r`v=-y`}
				/>. Here <Katex math={r`u_x=1`} /> but <Katex math={r`v_y=-1`} />. Conjugation reflects the
				plane; a reflection cannot be made from a rotation and a positive uniform scaling.
			</p>
			<p>
				In real coordinates, multiplication by <Katex math={r`f'(z)=a+ib`} /> has Jacobian
				<Katex math={r`\begin{pmatrix}a&-b\\b&a\end{pmatrix}`} />. Its columns are perpendicular and
				equally long, and its determinant is <Katex math={r`a^2+b^2=|f'(z)|^2`} />. Thus a
				holomorphic map preserves angles wherever <Katex math={r`f'(z)\ne0`} />, while multiplying
				tiny areas by
				<Katex math={r`|f'(z)|^2`} />.
			</p>
		</div>

		<Callout type="key-idea" title="Holomorphic">
			<p>
				A function that is complex differentiable throughout an open region is called <strong
					>holomorphic</strong
				> there. Under standard regularity assumptions, the Cauchy–Riemann equations characterize this
				property.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Holomorphic functions hide two harmonic functions</h3>
			<p>
				Differentiate the Cauchy–Riemann equations once more. When the second derivatives are
				continuous, both components satisfy Laplace’s equation:
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`\Delta u=u_{xx}+u_{yy}=0,\qquad \Delta v=v_{xx}+v_{yy}=0`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				Such functions are <strong>harmonic</strong>. They describe steady temperature,
				electrostatic potential, and ideal fluid flow. The curves <Katex
					math={r`u=\text{constant}`}
				/> and <Katex math={r`v=\text{constant}`} /> cross at right angles because <Katex
					math={r`\nabla v`}
				/> is a quarter-turn of <Katex math={r`\nabla u`} />. Thus the level curves of <Katex
					math="u"
				/> and <Katex math="v" /> form their own orthogonal bent grid: equipotential curves crossing flow
				lines.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Power series become the native language</h3>
			<p>
				A remarkable theorem says that a holomorphic function is not merely once differentiable. It
				is locally represented by a convergent power series:
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`f(z)=\sum_{n=0}^{\infty}a_n(z-z_0)^n`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				This makes Chapter 8 newly powerful. The familiar series for <Katex math={r`e^z`} />, <Katex
					math={r`\sin z`}
				/>, and <Katex math={r`\cos z`} /> work for complex inputs. Euler’s identity follows immediately
				by separating even and odd powers:
			</p>
			<p>
				There is also a geometric limit on every Taylor series: its disk of convergence reaches
				exactly as far as the nearest singularity in the complex plane. A real formula can therefore
				fail to converge for a reason that is invisible on the real line. For example, the series
				for
				<Katex math={r`1/(1+x^2)`} /> about <Katex math="0" /> stops at radius <Katex math="1" />
				because the complex poles <Katex math={r`\pm i`} /> are one unit away.
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`e^{i\theta}=\cos\theta+i\sin\theta`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Integrating along a curve</h3>
			<p>
				A contour <Katex math="C" /> is a directed path in the complex plane. If <Katex
					math={r`z=\gamma(t)`}
				/> for <Katex math={r`a\le t\le b`} />, then <Katex math={r`dz=\gamma'(t)dt`} /> and
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`\int_C f(z)\,dz=\int_a^b f(\gamma(t))\gamma'(t)\,dt`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				Each tiny displacement <Katex math="dz" /> is multiplied by the nearby value <Katex
					math={r`f(z)`}
				/>; the integral adds the resulting complex contributions head to tail. Reversing the
				direction of the curve reverses every <Katex math="dz" /> and changes the sign of the integral.
			</p>
			<p>
				If <Katex math="f" /> has an antiderivative <Katex math="F" /> throughout the region containing
				the path, the ordinary Fundamental Theorem survives: <Katex
					math={r`\int_C f(z)dz=F(z_{\rm end})-F(z_{\rm start})`}
				/>. Every closed contour then gives zero.
			</p>
		</div>

		<div id="complex-contour-lab" use:reveal>
			<Figure
				number="10.4"
				caption="A contour integral as vector accumulation. The integral of z around a closed circle cancels. The integral of 1/(z−a) is 2πi when the pole a lies inside the circle and 0 when it lies outside."
				><ComplexContourLab /></Figure
			>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Cauchy’s theorem: deform the path, preserve the answer</h3>
			<p>
				If <Katex math="f" /> is holomorphic throughout a simply connected region, then its integral around
				every closed contour in that region is zero. Consequently, two paths with the same endpoints give
				the same integral whenever one can be smoothly deformed into the other without crossing a singularity.
				The shape of the path is flexible; the holes it encloses are not.
			</p>
			<p>
				Cauchy’s integral formula goes further. Values on a boundary determine every value inside:
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`f(z_0)=\frac{1}{2\pi i}\oint_C\frac{f(z)}{z-z_0}\,dz`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				The kernel <Katex math={r`1/(z-z_0)`} /> makes one turn around its pole and extracts the interior
				value. Differentiating the formula produces every higher derivative. This single identity is the
				source of complex analysis’s rigidity: a holomorphic function cannot choose its interior behavior
				independently of its boundary.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Singularities leave a measurable trace</h3>
			<p>
				The function <Katex math={r`1/z`} /> is holomorphic everywhere except the origin. No antiderivative
				can be defined consistently on a whole punctured neighborhood around that missing point. Going
				once counterclockwise around the origin gives
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\oint_C \frac{dz}{z}=2\pi i`} display />
		</div>
		<div class="neo-prose" use:reveal>
			<p>
				The value does not depend on the precise shape of the loop, provided the loop winds once
				around the origin without crossing it. More generally, the <strong>residue theorem</strong>
				says that a closed contour integral is <Katex math={r`2\pi i`} /> times the sum of the enclosed
				residues, counted with winding number. This converts many difficult real integrals into geometric
				bookkeeping—but a full proof belongs to a dedicated analysis course.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>The boundary can count zeros and poles</h3>
			<p>
				Suppose <Katex math="f" /> has no zeros or poles on <Katex math="C" />. As <Katex
					math="z"
				/>
				travels around <Katex math="C" />, the image <Katex math={r`f(z)`} /> traces a closed curve. Each
				enclosed zero makes that image curve turn once counterclockwise around the origin; each enclosed
				pole contributes one clockwise turn, with multiplicities counted.
			</p>
		</div>
		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{1}{2\pi i}\oint_C\frac{f'(z)}{f(z)}\,dz=N-P`} display />
		</div>
		<div id="argument-principle-lab" use:reveal>
			<Figure
				number="10.5"
				caption="The argument principle turns an interior counting problem into boundary motion. The synchronized points show how one trip around C becomes N−P trips of f(C) around the origin. Move C across a zero to watch the count change."
			>
				<ArgumentPrincipleLab />
			</Figure>
		</div>

		<div class="neo-prose exercises-section" use:reveal>
			<h3>Exercises</h3>
			<Exercise number={1}
				><p>Write <Katex math={r`(1+2i)(3-i)`} /> in the form <Katex math={r`x+iy`} />.</p>
				{#snippet solution()}<p>
						<Katex math={r`(1+2i)(3-i)=3-i+6i-2i^2=5+5i`} />.
					</p>{/snippet}</Exercise
			>
			<Exercise number={2}
				><p>
					For <Katex math={r`f(z)=z^2`} />, calculate <Katex math={r`f'(z)`} /> directly from the difference
					quotient.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`[(z+h)^2-z^2]/h=2z+h\to2z`} />, so <Katex math={r`f'(z)=2z`} />.
					</p>{/snippet}</Exercise
			>
			<Exercise number={3}
				><p>
					Check the Cauchy–Riemann equations for <Katex math={r`f(z)=e^z=e^x(\cos y+i\sin y)`} />.
				</p>
				{#snippet solution()}<p>
						With <Katex math={r`u=e^x\cos y`} /> and <Katex math={r`v=e^x\sin y`} />, we have <Katex
							math={r`u_x=e^x\cos y=v_y`}
						/> and <Katex math={r`u_y=-e^x\sin y=-v_x`} />.
					</p>{/snippet}</Exercise
			>
			<Exercise number={4}
				><p>
					Parameterize the circle <Katex math={r`|z|=R`} /> counterclockwise and evaluate <Katex
						math={r`\oint dz/z`}
					/>.
				</p>
				{#snippet solution()}<p>
						Take <Katex math={r`z=Re^{it}`} />, <Katex math={r`0\le t\le2\pi`} />. Then <Katex
							math={r`dz=iRe^{it}dt`}
						/>, so <Katex math={r`dz/z=i\,dt`} /> and the integral is <Katex math={r`2\pi i`} />.
					</p>{/snippet}</Exercise
			>
			<Exercise number={5}
				><p>
					Assume <Katex math={r`f=u+iv`} /> is holomorphic and has continuous second derivatives. Use
					the Cauchy–Riemann equations to show that <Katex math={r`\Delta u=0`} />.
				</p>
				{#snippet solution()}<p>
						Differentiate <Katex math={r`u_x=v_y`} /> with respect to <Katex math="x" /> and <Katex
							math={r`u_y=-v_x`}
						/> with respect to <Katex math="y" />. Then <Katex math={r`u_{xx}=v_{yx}`} /> and <Katex
							math={r`u_{yy}=-v_{xy}`}
						/>. Equality of mixed partials gives <Katex math={r`u_{xx}+u_{yy}=0`} />.
					</p>{/snippet}</Exercise
			>
			<Exercise number={6}
				><p>
					Let <Katex math={r`f(z)=(z^2-1)/(z-0.35)`} />. Predict the winding number of <Katex
						math={r`f(C)`}
					/> about <Katex math="0" /> when <Katex math="C" /> is the circle <Katex
						math={r`|z|=0.8`}
					/>, and again when <Katex math={r`|z|=1.2`} />.
				</p>
				{#snippet solution()}<p>
						At radius <Katex math="0.8" />, the pole at <Katex math="0.35" /> is enclosed but the zeros
						<Katex math={r`\pm1`} /> are not, so <Katex math={r`N-P=-1`} />. At radius <Katex
							math="1.2"
						/>, both zeros and the pole are enclosed, so <Katex math={r`N-P=2-1=1`} />.
					</p>{/snippet}</Exercise
			>
		</div>

		<ChapterSummary
			><ul>
				<li>Complex numbers form a plane; multiplication combines scaling and rotation.</li>
				<li>A complex function maps the input plane to an output plane.</li>
				<li>A complex derivative must give the same local multiplier from every direction.</li>
				<li>
					The Cauchy–Riemann equations express that directional agreement in real coordinates.
				</li>
				<li>
					Holomorphic functions are locally power series and possess derivatives of every order.
				</li>
				<li>The real and imaginary parts of a holomorphic function are harmonic conjugates.</li>
				<li>
					Contour integrals add <Katex math={r`f(z)dz`} /> along directed paths; enclosed singularities
					can make closed-loop integrals nonzero.
				</li>
				<li>
					Cauchy’s formula lets boundary values determine every interior value and derivative.
				</li>
				<li>The argument principle counts enclosed zeros minus poles by a winding number.</li>
			</ul></ChapterSummary
		>
		<LookingAhead
			><p>
				Chapter 11 turns the same ideas into the language of differential forms. Complex contour
				integration becomes a particularly elegant example of integrating a 1-form, and Stokes’
				theorem explains why boundary integrals detect what cannot be filled in smoothly.
			</p></LookingAhead
		>
	</div>
</section>
