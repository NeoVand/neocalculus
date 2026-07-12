<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import GradientDirectionExplorer from '$lib/components/demos/GradientDirectionExplorer.svelte';
	import JacobianDeformationExplorer from '$lib/components/demos/JacobianDeformationExplorer.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch9">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 9</span>
			<h2 class="chapter-title">Multivariable and Vector Calculus</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“When an input can move in many directions, what replaces a single slope?”
				</blockquote>
				<p class="epigraph-attr">The question behind the multivariable derivative</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A height map assigns an altitude to every point <Katex math={r`(x,y)`} /> on a map. At one location
				you can walk east, north, or in any diagonal direction. The altitude may change at a different
				rate along each path. One number can no longer describe every possible response.
			</p>
			<p>
				The replacement is a <strong>linear map</strong>. It accepts a small change in all input
				coordinates at once and returns the corresponding first-order change in the output. Partial
				derivatives, gradients, and Jacobian matrices are different ways of reading that one local
				map.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>From one input to many</h3>
			<p>
				A scalar-valued function of two variables has the form
				<Katex math={r`f:\mathbb R^2\to\mathbb R`} />. Its graph is a surface
				<Katex math={r`z=f(x,y)`} />. A second useful picture is a <strong>level curve</strong>: the
				set of points where <Katex math="f" /> has one fixed value.
			</p>
			<p>
				The partial derivative <Katex math={r`f_x`} /> measures change in the
				<Katex math="x" /> direction while <Katex math="y" /> is held fixed. Similarly,
				<Katex math={r`f_y`} /> measures change in the <Katex math="y" /> direction. They are ordinary
				single-variable derivatives of slices:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`f_x(a,b)=\left.\frac{d}{dx}f(x,b)\right|_{x=a},\qquad f_y(a,b)=\left.\frac{d}{dy}f(a,y)\right|_{y=b}`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Partials answer two coordinate questions. The full derivative must answer every direction at
				once.
			</p>

			<h3>The derivative is a linear map</h3>
			<p>For first-order changes in two coordinates, use the infinitesimal neighborhood</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`D(2)=\{(d_1,d_2):d_i d_j=0\text{ for every }i,j\in\{1,2\}\}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Thus <Katex math={r`d_1^2=d_1d_2=d_2^2=0`} />. This is not merely the union of the two
				coordinate axes. If <Katex math={r`d^2=0`} /> and <Katex math={r`\mathbf v=(v_1,v_2)`} /> is an
				ordinary vector, then <Katex math={r`(dv_1,dv_2)\in D(2)`} /> describes a diagonal first-order
				motion.
			</p>
			<p>
				The multivariable Kock–Lawvere principle says that a smooth scalar function has a unique
				linear response on this neighborhood:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x+d_1,y+d_2)=f(x,y)+f_x(x,y)d_1+f_y(x,y)d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The linear map <Katex math={r`Df_{(x,y)}`} /> sends an input vector
				<Katex math={r`(h,k)`} /> to <Katex math={r`f_xh+f_yk`} />. For a first-order SDG vector the
				equation above is exact. For an ordinary real step, it becomes the local approximation
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x+h,y+k)\approx f(x,y)+f_xh+f_yk`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example 1: read the local map</h4>
			<p>Let <Katex math={r`f(x,y)=x^2y`} />. Holding one input fixed at a time gives</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The derivative at <Katex math={r`(1,2)`} /></div>
			<div class="step">
				<div class="step-math"><Katex math={r`f_x=2xy,\qquad f_y=x^2`} display /></div>
				<div class="step-note">differentiate the coordinate slices</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f_x(1,2)=4,\qquad f_y(1,2)=1`} display /></div>
				<div class="step-note">evaluate at the point</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`Df_{(1,2)}(h,k)=4h+k`} display /></div>
				<div class="step-note">one formula for every input direction</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For example, an ordinary move <Katex math={r`(h,k)=(0.02,-0.01)`} /> predicts an output change
				of <Katex math={r`4(0.02)-0.01=0.07`} />. This is an approximation because the move is an
				ordinary real vector, not an element of <Katex math={r`D(2)`} />.
			</p>
		</div>

		<Callout type="key-idea" title="The Main Shift">
			<p>
				In one variable, the derivative is represented by one coefficient. In several variables, the
				derivative is a linear map. A row of partial derivatives is its coordinate representation.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>The gradient turns the local rule into a direction</h3>
			<p>
				In the Euclidean plane, we package the two partial derivatives into the
				<strong>gradient</strong>
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\nabla f=(f_x,f_y)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				If <Katex math={r`\mathbf v=(v_1,v_2)`} /> is a unit vector, the rate of change in that direction
				is
				<Katex math={r`D_{\mathbf v}f=\nabla f\cdot\mathbf v`} />. This is the same linear map as
				before, now written as a dot product.
			</p>
			<p>
				Use the explorer below. Keep the point fixed and rotate the blue direction. The left view
				looks down on the level curves; the right view lifts the selected level circle onto the
				paraboloid. The surface is drawn with only two perpendicular curve families: circular level
				curves and radial meridians. The rose line points in the chosen direction inside the tangent
				plane. At which angle is that line steepest? At which angles is it horizontal?
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="9.1"
				caption="Two views of f(x,y) = x² + y². The contour map shows direction in the input plane. The 3D view lifts the selected circular level set onto the paraboloid and shows the tangent plane and chosen tangent direction."
			>
				<GradientDirectionExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> The directional derivative is largest when the chosen unit vector points
				with the gradient, smallest when it points against the gradient, and zero when it is perpendicular
				to the gradient. In the 3D view, these become the steepest upward, steepest downward, and horizontal
				directions in the tangent plane at the marked point.
			</p>
			<p>
				The geometry follows from two short facts. First,
				<Katex math={r`\nabla f\cdot\mathbf v\le\|\nabla f\|`} /> for every unit vector, with equality
				when the vectors point together. Second, if a curve <Katex math={r`\gamma(t)`} /> lies on a level
				set, then <Katex math={r`f(\gamma(t))`} /> is constant. The chain rule gives
				<Katex math={r`\nabla f(\gamma(t))\cdot\gamma'(t)=0`} />, so the gradient is perpendicular
				to the curve’s tangent direction.
			</p>
		</div>

		<DigDeeper title="Constrained optimization and parallel gradients">
			<p>
				Suppose <Katex math="f" /> is optimized along a smooth constraint
				<Katex math={r`g(x,y)=c`} />, and suppose <Katex math={r`\nabla g\ne0`} /> at the candidate point.
				Every allowed tangent direction is perpendicular to <Katex math={r`\nabla g`} />. At a
				constrained extremum it must also be perpendicular to <Katex math={r`\nabla f`} />. In the
				plane, the two gradients must therefore be parallel:
				<Katex math={r`\nabla f=\lambda\nabla g`} />. This is the Lagrange multiplier condition; it
				finds candidates that still require comparison and boundary checks.
			</p>
		</DigDeeper>

		<div class="neo-prose" use:reveal>
			<h3>The Jacobian handles several outputs</h3>
			<p>
				Now let a map produce two outputs:
				<Katex math={r`F(u,v)=(P(u,v),Q(u,v))`} />. Each output has its own row of partial
				derivatives. Together they form the <strong>Jacobian matrix</strong>
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`J_F(u,v)=\begin{pmatrix}P_u&P_v\\Q_u&Q_v\end{pmatrix}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For <Katex math={r`\mathbf d\in D(2)`} />, the SDG local equation is exact:
				<Katex math={r`F(\mathbf p+\mathbf d)=F(\mathbf p)+J_F(\mathbf p)\mathbf d`} />. For an
				ordinary real vector <Katex math={r`\mathbf h`} />, the same matrix gives the local
				approximation <Katex
					math={r`F(\mathbf p+\mathbf h)\approx F(\mathbf p)+J_F(\mathbf p)\mathbf h`}
				/>.
			</p>
			<p>
				The columns show what happens to the two coordinate directions. The determinant
				<Katex math={r`\det J_F`} /> records signed local area scaling: its magnitude gives the scale
				factor, while its sign records whether orientation is preserved or reversed.
			</p>
			<p>
				The next explorer uses the nonlinear map <Katex math={r`F(u,v)=(u^2-v^2,2uv)`} />. The blue
				boundary is the actual image of an ordinary square patch; the dashed purple parallelogram is
				the Jacobian’s linear prediction. Shrink the patch. Both panels magnify the changing
				neighborhood so the shapes remain readable. What happens to the visible gap between them?
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="9.2"
				caption="A Jacobian is a local deformation. It sends the two coordinate directions to the columns of the matrix, turning a small square into a parallelogram. The panels magnify each selected neighborhood; as the ordinary patch shrinks, its curved image approaches the Jacobian prediction."
			>
				<JacobianDeformationExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> The matrix is not merely a table of four derivatives. It is the
				best linear picture of what the map does near one point. Its columns are the transformed
				coordinate directions, and <Katex math={r`|\det J_F|`} /> is the corresponding local area factor.
			</p>

			<h4>Example 2: a local map with two outputs</h4>
			<p>Consider <Katex math={r`F(u,v)=(u^2-v^2,2uv)`} />. Its Jacobian is</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Linearize at <Katex math={r`(1,1)`} /></div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`J_F(u,v)=\begin{pmatrix}2u&-2v\\2v&2u\end{pmatrix}`} display />
				</div>
				<div class="step-note">differentiate each output</div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`J_F(1,1)=\begin{pmatrix}2&-2\\2&2\end{pmatrix}`} display />
				</div>
				<div class="step-note">the local linear map</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`J_F(1,1)\binom{h}{k}=\binom{2h-2k}{2h+2k}`} display />
				</div>
				<div class="step-note">predict both output changes at once</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Derivatives also compose. If <Katex math="G" /> feeds into <Katex math="F" />, then
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`J_{F\circ G}(\mathbf p)=J_F(G(\mathbf p))J_G(\mathbf p)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is the multivariable chain rule: local linear maps compose by matrix multiplication.
				For a scalar function along a curve <Katex math={r`\mathbf r(t)`} />, it becomes
				<Katex math={r`\frac{d}{dt}f(\mathbf r(t))=\nabla f(\mathbf r(t))\cdot\mathbf r'(t)`} />.
			</p>

			<h3>Two kinds of accumulation</h3>
			<h4>Over a region: double integrals</h4>
			<p>
				A double integral accumulates a density or height over an ordinary region. Begin with an
				ordinary finite partition into small rectangles. On a rectangle of area
				<Katex math={r`\Delta A`} />, the contribution is approximately
				<Katex math={r`f(x,y)\Delta A`} />. Under the usual integrability conditions, the limit of
				these sums defines
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\iint_R f(x,y)\,dA`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For a continuous function on a simple bounded region, Fubini’s theorem lets us evaluate this
				as an iterated integral. This is a classical accumulation principle. We do not construct a
				finite region from <Katex math={r`1/(d_1d_2)`} /> nilpotent tiles.
			</p>
			<p>
				A smooth one-to-one coordinate change <Katex math={r`T(u,v)=(x(u,v),y(u,v))`} /> with nonzero
				Jacobian determinant transforms area according to the change-of-variables theorem:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`\iint_R f(x,y)\,dx\,dy=\iint_{T^{-1}(R)}f(T(u,v))\,|\det J_T(u,v)|\,du\,dv`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example 3: area of a disk</h4>
			<p>
				For polar coordinates <Katex math={r`x=r\cos\theta`} /> and
				<Katex math={r`y=r\sin\theta`} />, the Jacobian determinant has magnitude <Katex
					math="r"
				/>. The origin and the duplicated boundary ray are exceptional sets of area zero, so the
				standard polar change-of-variables formula still applies to the disk. A disk of radius
				<Katex math="R" /> therefore has area
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Use the polar area factor</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`J_T=\begin{pmatrix}\cos\theta&-r\sin\theta\\\sin\theta&r\cos\theta\end{pmatrix}`}
						display
					/>
				</div>
				<div class="step-note"><Katex math={r`|\det J_T|=r`} /></div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`A=\int_0^{2\pi}\int_0^R r\,dr\,d\theta=\pi R^2`} display />
				</div>
				<div class="step-note">square units, as required</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Along a curve: vector fields and work</h4>
			<p>
				A vector field assigns a vector to each point:
				<Katex math={r`\mathbf F(x,y)=(P(x,y),Q(x,y))`} />. If it represents force and a path is
				parametrized by <Katex math={r`\mathbf r(t)`} /> for <Katex math={r`a\le t\le b`} />, the
				work done along the path is the ordinary integral
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`\int_C\mathbf F\cdot d\mathbf r=\int_a^b\mathbf F(\mathbf r(t))\cdot\mathbf r'(t)\,dt`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The notation <Katex math={r`d\mathbf r=\mathbf r'(t)\,dt`} /> records the derivative’s action
				under the parametrization; it is not division by <Katex math="dt" />. Divergence, curl, and
				the global theorems relating fields to boundaries belong to Chapter 11, where differential
				forms provide the right unifying language.
			</p>
		</div>

		<DigDeeper title="Tangent vectors as infinitesimal paths">
			<p>
				In SDG, a tangent vector at a point <Katex math="p" /> of a smooth space <Katex math="M" />
				can be represented by a map <Katex math={r`t:D\to M`} /> with <Katex math={r`t(0)=p`} />. It
				is a first-order path based at <Katex math="p" />. The collection of all such paths over all
				base points is the tangent bundle <Katex math={r`M^D`} />; the tangent space at
				<Katex math="p" /> is the fiber consisting only of paths based at <Katex math="p" />.
			</p>
		</DigDeeper>

		<div class="neo-prose exercises-section" use:reveal>
			<h3>Exercises</h3>
			<p>Keep the base point, input direction, and resulting output change visibly separate.</p>

			<Exercise number={1}>
				<p>
					Find <Katex math={r`f_x`} /> and <Katex math={r`f_y`} /> for <Katex
						math={r`f(x,y)=x^3y+\sin y`}
					/>.
				</p>
				{#snippet solution()}
					<p><Katex math={r`f_x=3x^2y`} /> and <Katex math={r`f_y=x^3+\cos y`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					For <Katex math={r`f(x,y)=x^2+3xy`} />, find <Katex math={r`Df_{(1,2)}(h,k)`} /> and use it
					to estimate <Katex math={r`f(1.01,1.98)-f(1,2)`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`f_x=2x+3y`} /> and <Katex math={r`f_y=3x`} />, so
						<Katex math={r`Df_{(1,2)}(h,k)=8h+3k`} />. With <Katex math={r`(h,k)=(0.01,-0.02)`} />,
						the predicted change is <Katex math={r`0.08-0.06=0.02`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					For <Katex math={r`f(x,y)=x^2+y^2`} />, compute the directional derivative at
					<Katex math={r`(1,-1)`} /> in the unit direction <Katex math={r`\mathbf v=(3/5,4/5)`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`\nabla f(1,-1)=(2,-2)`} />, so
						<Katex math={r`D_{\mathbf v}f=(2,-2)\cdot(3/5,4/5)=-2/5`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					Find the gradient of <Katex math={r`f(x,y)=x+2y`} />. Explain why every level curve is
					perpendicular to that same vector.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`\nabla f=(1,2)`} />. The level curves are lines
						<Katex math={r`x+2y=c`} /> with tangent direction <Katex math={r`(2,-1)`} />, and
						<Katex math={r`(1,2)\cdot(2,-1)=0`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					For <Katex math={r`F(u,v)=(u+v,uv)`} />, compute <Katex math={r`J_F(1,2)`} /> and find the image
					of the vector <Katex math={r`(h,k)=(3,-1)`} /> under this derivative map.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`J_F(1,2)=\begin{pmatrix}1&1\\2&1\end{pmatrix}`} />, and
						<Katex math={r`J_F(1,2)\binom{3}{-1}=\binom{2}{5}`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>Evaluate <Katex math={r`\int_0^2\int_0^1(x+y)\,dy\,dx`} />.</p>
				{#snippet solution()}
					<p>
						The inner integral is <Katex math={r`x+1/2`} />, so the value is
						<Katex math={r`\int_0^2(x+1/2)\,dx=3`} />.
					</p>
				{/snippet}
			</Exercise>

			<h4>Explore</h4>

			<Exercise number={7}>
				<p>
					Use polar coordinates to evaluate <Katex math={r`\iint_R(x^2+y^2)\,dA`} /> over the unit disk.
				</p>
				{#snippet solution()}
					<p>
						Since <Katex math={r`x^2+y^2=r^2`} /> and <Katex math={r`dA=r\,dr\,d\theta`} />,
						<Katex math={r`\int_0^{2\pi}\int_0^1r^3\,dr\,d\theta=\pi/2`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					Let <Katex math={r`\mathbf F(x,y)=(y,x)`} /> and
					<Katex math={r`\mathbf r(t)=(t,t^2)`} /> for <Katex math={r`0\le t\le1`} />. Compute the
					line integral <Katex math={r`\int_C\mathbf F\cdot d\mathbf r`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`\mathbf F(\mathbf r(t))=(t^2,t)`} /> and
						<Katex math={r`\mathbf r'(t)=(1,2t)`} />. Their dot product is
						<Katex math={r`3t^2`} />, so the integral equals <Katex
							math={r`\int_0^1 3t^2\,dt=1`}
						/>.
					</p>
				{/snippet}
			</Exercise>
		</div>

		<ChapterSummary>
			<ul>
				<li>
					In several variables, the derivative is a linear map from input changes to output changes.
				</li>
				<li>Partial derivatives are the coordinate coefficients of that map.</li>
				<li>
					The gradient represents a scalar-valued derivative as a vector and controls directional
					change.
				</li>
				<li>
					A Jacobian matrix represents the derivative of a map with several outputs; chain rules
					become matrix products.
				</li>
				<li>
					Double integrals accumulate over regions, and Jacobian determinants supply area factors in
					valid coordinate changes.
				</li>
				<li>
					Vector-field line integrals accumulate the component of a field along a parametrized
					curve.
				</li>
			</ul>
		</ChapterSummary>

		<LookingAhead>
			<p>
				Chapter 10 extends calculus to complex-valued functions. There, a derivative must agree from
				every direction in a plane, and line integrals become contour integrals that can detect
				enclosed singularities.
			</p>
		</LookingAhead>
	</div>
</section>
