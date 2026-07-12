<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import ComplexMappingLab from '$lib/components/demos/ComplexMappingLab.svelte';
	import ComplexContourLab from '$lib/components/demos/ComplexContourLab.svelte';
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
				number="10.2"
				caption="A nonzero complex derivative acts locally as one rotation and one uniform scaling. The horizontal and vertical test directions must agree on the same complex multiplier."
			>
				<div
					class="derivative-picture"
					role="img"
					aria-label="A small orthogonal cross mapped to a rotated and uniformly scaled cross"
				>
					<div class="plane">
						<span class="plane-label">near z</span><svg viewBox="0 0 260 210"
							><circle class="micro" cx="130" cy="108" r="58" /><line
								class="h blue"
								x1="56"
								x2="204"
								y1="108"
								y2="108"
							/><line class="v amber" x1="130" x2="130" y1="34" y2="182" /><circle
								class="origin"
								cx="130"
								cy="108"
								r="5"
							/><text x="192" y="98">h</text><text x="140" y="47">ih</text></svg
						>
					</div>
					<div class="multiplier"><Katex math={r`\times\ f'(z)`} /><span>rotate + scale</span></div>
					<div class="plane">
						<span class="plane-label">near f(z)</span><svg viewBox="0 0 260 210"
							><g transform="rotate(-32 130 108) scale(1.18) translate(-20 -16)"
								><circle class="micro mapped" cx="130" cy="108" r="58" /><line
									class="h blue"
									x1="56"
									x2="204"
									y1="108"
									y2="108"
								/><line class="v amber" x1="130" x2="130" y1="34" y2="182" /><circle
									class="origin"
									cx="130"
									cy="108"
									r="5"
								/></g
							></svg
						>
					</div>
				</div>
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
				number="10.3"
				caption="A contour integral as vector accumulation. The integral of z around a closed circle cancels. The integral of 1/(z−a) is 2πi when the pole a lies inside the circle and 0 when it lies outside."
				><ComplexContourLab /></Figure
			>
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
				<li>
					Contour integrals add <Katex math={r`f(z)dz`} /> along directed paths; enclosed singularities
					can make closed-loop integrals nonzero.
				</li>
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

<style>
	.derivative-picture {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		gap: 1rem;
	}
	.plane {
		position: relative;
		border: 1px solid var(--color-border-light);
		border-radius: 16px;
		background: var(--plot-background);
		overflow: hidden;
	}
	.plane svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.plane-label {
		position: absolute;
		top: 0.75rem;
		left: 0.9rem;
		color: var(--plot-muted);
		font: 800 0.68rem/1 var(--font-sans);
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}
	.micro {
		fill: color-mix(in srgb, var(--plot-violet) 5%, transparent);
		stroke: var(--plot-violet);
		stroke-width: 1.5;
		stroke-dasharray: 4 5;
	}
	.micro.mapped {
		stroke: var(--plot-teal);
	}
	.h,
	.v {
		stroke-width: 3;
		stroke-linecap: round;
	}
	.blue {
		stroke: var(--plot-blue);
	}
	.amber {
		stroke: var(--plot-amber);
	}
	.origin {
		fill: var(--color-ink);
	}
	.plane text {
		fill: var(--plot-muted);
		font: 700 12px var(--font-sans);
	}
	.multiplier {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		color: var(--plot-violet);
	}
	.multiplier span {
		color: var(--color-ink-light);
		font: 700 0.68rem/1.2 var(--font-sans);
		white-space: nowrap;
	}
	@media (max-width: 640px) {
		.derivative-picture {
			grid-template-columns: 1fr;
			gap: 0.6rem;
		}
		.multiplier {
			padding: 0.15rem;
		}
		.plane {
			max-width: 19rem;
			width: 100%;
			margin: auto;
		}
	}
</style>
