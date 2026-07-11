<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import RevealBox from '$lib/components/RevealBox.svelte';
	import PerfectZoom from '$lib/components/demos/PerfectZoom.svelte';
	import FunctionMachine from '$lib/components/demos/FunctionMachine.svelte';
	import DerivativeMachine from '$lib/components/demos/DerivativeMachine.svelte';
	import MicrostraightnessBridge from '$lib/components/figures/MicrostraightnessBridge.svelte';
	import SmoothnessComparison from '$lib/components/figures/SmoothnessComparison.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch1">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 1</span>
			<h2 class="chapter-title">The Smooth World</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“A curve bends. A line does not. So how can a line tell us what a curve is doing?”
				</blockquote>
				<p class="epigraph-attr">The question that opens calculus</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>First: what is a function?</h3>
			<p>
				Before we study change, we need one simple piece of language. A <strong>function</strong>
				is a rule that accepts an input and gives back exactly one output.
			</p>
			<p>
				We usually call the input <Katex math="x" />. If the function is named
				<Katex math="f" />, its output is written <Katex math="f(x)" />, read “f of x.” Thus
				<Katex math={r`f(x)=x^2`} /> means “square the input.” For example,
				<Katex math={r`f(3)=9`} /> and <Katex math={r`f(-2)=4`} />. The parentheses in
				<Katex math="f(x)" /> do not mean multiplication; they tell us which input was given to
				<Katex math="f" />.
			</p>
			<p>
				Watch one cycle of the machine below. A number enters from the left. The displayed rule acts
				on it, and the result leaves on the right. The dot on the small graph marks that same
				input-output pair.
			</p>
		</div>
	</div>

	<div class="content-width" use:reveal>
		<figure class="neo-figure">
			<FunctionMachine />
			<figcaption>
				<span class="figure-number">Figure 1.1.</span>
				A function is a rule that turns an input into an output: x goes in, and f(x) comes out.
			</figcaption>
		</figure>
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>
				Each cycle uses a different rule, but the notation keeps the same meaning. A graph is a
				picture of all the input-output pairs: when the input <Katex math="x" /> produces the output
				<Katex math="f(x)" />, the point <Katex math={r`(x,f(x))`} /> lies on the graph.
			</p>
			<p>
				Now we can ask the question that begins calculus: when <Katex math="x" /> changes, how does
				<Katex math="f(x)" /> change? To answer it at one particular input, we look closely at the graph
				near the corresponding point. Sometimes the graph settles toward one line direction. Sometimes
				it does not.
			</p>

			<h3>Which curves have a local direction?</h3>
			<p>
				For now, call a graph <strong>smooth at a point</strong> when magnifying near that point
				reveals one line direction. A parabola has one. At the corner of <Katex math={r`|x|`} />,
				the directions from the left and right disagree. At a jump, the two nearby pieces do not
				even connect.
			</p>
		</div>

		<Figure
			number="1.2"
			caption="At the marked point, a smooth curve has one line direction. A corner has two competing directions, while a jump has no connected direction through the point."
		>
			<SmoothnessComparison />
		</Figure>

		<Callout type="key-idea" title="Our Working World">
			<p>
				The first chapters assume that our functions are smooth at the points we study. Corners and
				jumps are not mistakes; they simply require additional questions. We will return to them
				after the basic machinery is in place.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Look through a first-order lens</h3>
			<p>
				The purple dashed line in the demo is the <strong>tangent line</strong>: it passes through
				the chosen point and points in the graph’s local direction. Keep the parabola selected, turn
				on the tangent, and increase the zoom. Watch the gap between the curve and the line.
			</p>
		</div>
	</div>

	<div class="content-width" use:reveal={{ delay: 80 }}>
		<PerfectZoom />
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>
				At ordinary scale, the parabola and the tangent are visibly different. As the window shrinks
				around the chosen point, the bend becomes harder to see and the graph looks more like the
				line. Numerical zoom reveals this pattern, but it never reaches a final smallest
				magnification.
			</p>
			<p>
				Synthetic differential geometry asks an exact version of the zooming question. It represents
				a first-order change in the input by
				<span class="d-highlight"><strong>d</strong></span> and uses the rule
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="d^2=0" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This <span class="d-highlight">d</span> is not an ordinary real number that happens to be
				very small. It is a <strong>first-order displacement</strong> in the model. The term
				<Katex math="d" /> records the direct response to an input change; <Katex math="d^2" />
				records a second-order effect such as bending. The first-order lens discards the latter. It does
				not discard terms such as <Katex math="6d" />: their coefficients still tell us how the
				output responds.
			</p>
			<p>
				Now fix an input <Katex math="a" />. Smoothness says that, for first-order displacements,
				the output has one and only one form
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(a+d)=f(a)+md`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Here <Katex math="f(a)" /> is the original output, and <Katex math="md" /> is its first-order
				change. The number <Katex math="m" /> is determined by the function and the point. We will calculate
				it before giving it a name.
			</p>
		</div>
	</div>

	<div class="content-width" use:reveal>
		<Figure
			number="1.3"
			class="figure-1-3"
			caption="An ordinary finite step leaves a visible gap between the curve and its local line. The first-order lens keeps only their shared linear behavior."
		>
			<MicrostraightnessBridge />
		</Figure>
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>
				This is <strong>microstraightness</strong>. For an ordinary finite change
				<Katex math="\Delta x" />, the line usually gives an approximation:
				<Katex math={r`f(a+\Delta x)\approx f(a)+m\Delta x`} />. For a first-order displacement <Katex
					math="d"
				/>, the equation <Katex math={r`f(a+d)=f(a)+md`} /> is exact. The curve has not become a line
				everywhere; curve and line agree only at first order near the chosen point.
			</p>

			<h3>Finding the local coefficient</h3>
			<p>
				Now let us find <Katex math="m" /> for the squaring function. Start at the input 3 and change
				it to <Katex math="3+d" />. Expand in the ordinary way, then use
				<Katex math="d^2=0" />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Square an input near 3</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(3+d)^2=9+6d+d^2`} display /></div>
				<div class="step-note">expand normally</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`(3+d)^2=9+6d`} display /></div>
				<div class="step-note"><Katex math="d^2=0" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The answer has two parts. The 9 is the original output. The coefficient 6 tells us the
				first-order change: near 3, the squaring function changes by <Katex math="6d" /> when the input
				changes by <Katex math="d" />. In the microstraightness equation, this says
				<Katex math="m=6" /> at the input 3.
			</p>
			<p>
				Now let the starting input be <Katex math="x" /> instead of 3. For
				<Katex math={r`f(x)=x^2`} />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Square an input near x</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`f(x+d)=(x+d)^2=x^2+2xd+d^2`} display />
				</div>
				<div class="step-note">expand</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x+d)=x^2+2xd`} display /></div>
				<div class="step-note"><Katex math="d^2=0" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`f(x+d)=f(x)+(2x)d`} display /></div>
				<div class="step-note">separate the original value from the change</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This has the form <Katex math={r`f(x+d)=f(x)+md`} /> with
				<Katex math="m=2x" />. Because the starting input can vary, the local coefficient varies
				with it. This coefficient has a name.
			</p>
		</div>

		<Callout type="definition" title="The Derivative">
			<p>
				For a smooth function and a fixed input <Katex math="x" />, there is a unique number
				<Katex math="f'(x)" /> such that, for every first-order displacement <Katex math="d" />,
				<Katex math={r`f(x+d)=f(x)+f'(x)d`} />. This number is the
				<strong>derivative</strong>, or slope, at <Katex math="x" />.
			</p>
			<Katex math={r`f(x+d)=f(x)+f'(x)d`} display />
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				A derivative at one input is a number: the slope there. But let the input move, and
				each point supplies its own slope. Those slope values together form a new function,
				<Katex math="f'" />. Watch the point travel along each curve below. The purple tangent
				turns as the local slope changes; the function that records all those slopes emerges on
				the right.
			</p>
			<p>
				The trigonometric outputs are a preview. In Chapter 2, we will derive them instead of
				asking you to take them on faith.
			</p>
		</div>

		<Figure
			number="1.4"
			caption="Differentiation turns a function into its slope function. As the point moves along f, the tangent reveals the slope at each input; f′ collects those slopes into a new function."
		>
			<DerivativeMachine />
		</Figure>

		<div class="neo-prose" use:reveal>
			<p>
				For <Katex math={r`f(x)=x^2`} />, we found <Katex math={r`f'(x)=2x`} />. At
				<Katex math="x=3" />, the slope is 6. At
				<Katex math="x=-1" />, it is −2. The sign tells the direction; the size tells how steeply
				the output responds.
			</p>
			<p>
				Notice what we did not do: we never divided by <Katex math="d" />. We expanded the function
				and read the unique first-order coefficient.
			</p>
		</div>

		<RevealBox
			title="Under the hood: why is the coefficient unique?"
			subtitle="Optional foundation window"
			tone="math"
		>
			<p>
				In synthetic differential geometry, <Katex math="\mathcal R" /> names the smooth number line,
				and <Katex math={r`D=\{d\in\mathcal R:d^2=0\}`} /> is its first-order neighborhood of zero. The
				Kock–Lawvere axiom says that every map
				<Katex math={r`g:D\to\mathcal R`} /> has a unique form
				<Katex math={r`g(d)=a+bd`} />.
			</p>
			<p>
				Apply this to <Katex math={r`g(d)=f(x+d)`} />. Its constant term is
				<Katex math="f(x)" />, and its unique coefficient is <Katex math="f'(x)" />. This is the
				axiom behind the exact equation <Katex math={r`f(x+d)=f(x)+f'(x)d`} />.
			</p>
			<p>
				No division by <Katex math="d" /> is involved. If
				<Katex math="ad=bd" /> for every <Katex math="d\in D" />, then the two expressions have the
				same first-order coefficient, so <Katex math="a=b" />. This is sometimes called
				<strong>microcancellation</strong>.
			</p>
			<p>
				There is one logical subtlety. The model has a nontrivial infinitesimal neighborhood, but we
				do not choose a particular <Katex math="d" /> and declare it distinguishably nonzero. The mainline
				only needs the neighborhood <Katex math="D" /> and the unique coefficient rule.
			</p>
		</RevealBox>

		<ChapterSummary>
			<ul>
				<li>
					A function assigns exactly one output to each input; calculus studies how that output
					changes.
				</li>
				<li>A graph is smooth at a point when it has one local line direction there.</li>
				<li>
					A first-order displacement <Katex math="d" /> satisfies <Katex math="d^2=0" />; it is not
					an ordinary small real number.
				</li>
				<li>
					The local line is usually an approximation for finite <Katex math="\Delta x" />, but the
					first-order equation is exact for <Katex math="d" />.
				</li>
				<li>
					The derivative is the unique coefficient in
					<Katex math={r`f(x+d)=f(x)+f'(x)d`} />; for <Katex math="x^2" />, it is
					<Katex math="2x" />.
				</li>
			</ul>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Practice (six core, two explorations)</summary>

			<Exercise number={1}>
				<p>
					<strong>Core.</strong> For <Katex math={r`f(x)=3x+1`} />, identify the input and the
					output, then calculate the output for the input 4.
				</p>
				{#snippet solution()}
					<p>The input is <Katex math="x" /> and the output is <Katex math="f(x)" />.</p>
					<Katex math={r`f(4)=3(4)+1=13`} display />
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Core.</strong> Classify each graph as smooth, cornered, or discontinuous:
					<Katex math="x^2" />, <Katex math={r`|x|`} />, and a step function.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="x^2" /> is smooth. <Katex math={r`|x|`} /> has a corner at 0. A step function
						has a jump discontinuity.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> Simplify <Katex math="(5+d)^2" /> using <Katex math="d^2=0" />.
				</p>
				{#snippet solution()}
					<Katex math={r`(5+d)^2=25+10d+d^2=25+10d`} display />
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Expand <Katex math="(x+d)^3" /> and read the coefficient of
					<Katex math="d" />.
				</p>
				{#snippet solution()}
					<Katex math={r`(x+d)^3=x^3+3x^2d+3xd^2+d^3=x^3+3x^2d`} display />
					<p>The first-order coefficient is <Katex math="3x^2" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> The derivative of <Katex math="x^2" /> is <Katex math="2x" />. Find
					the slope at <Katex math="x=4" /> and explain what it means.
				</p>
				{#snippet solution()}
					<Katex math={r`f'(4)=2(4)=8`} display />
					<p>
						Near <Katex math="x=4" />, the output changes by <Katex math="8d" /> for an input change <Katex
							math="d"
						/>.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Explain the difference between the exact first-order statement
					<Katex math={r`f(x+d)=f(x)+f'(x)d`} /> and the finite approximation
					<Katex math={r`f(x+\Delta x)\approx f(x)+f'(x)\Delta x`} />.
				</p>
				{#snippet solution()}
					<p>
						The first equation is exact for every first-order <Katex math="d" /> satisfying
						<Katex math="d^2=0" />. An ordinary finite <Katex math="\Delta x" /> still has higher-order
						powers, so the linear expression is generally an approximation.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> Expand <Katex math={r`(x+\Delta x)^2`} /> for an ordinary finite
					<Katex math="\Delta x" />. Which term is absent from the first-order calculation, and what
					does it represent geometrically?
				</p>
				{#snippet solution()}
					<Katex math={r`(x+\Delta x)^2=x^2+2x\Delta x+(\Delta x)^2`} display />
					<p>
						The first-order calculation omits <Katex math={r`(\Delta x)^2`} />. For the parabola,
						this is the finite gap between the curve and its local line.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> Why do we read coefficients instead of dividing an equation by
					<Katex math="d" />?
				</p>
				{#snippet solution()}
					<p>
						A first-order displacement satisfying <Katex math="d^2=0" /> is not invertible, so division
						by <Katex math="d" /> is unavailable. The unique-coefficient rule lets us compare the coefficients
						directly.
					</p>
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				In Chapter 2, the equation <Katex math={r`f(x+d)=f(x)+f'(x)d`} /> becomes a calculation method.
				We will use it to find derivatives of powers, reciprocals, roots, trigonometric functions, exponentials,
				and logarithms.
			</p>
		</LookingAhead>
	</div>
</section>

<style>
	:global(.figure-1-3 figcaption) {
		max-width: var(--w-content);
		margin-inline: auto;
	}
</style>
