<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import FencingOptimizer from '$lib/components/demos/FencingOptimizer.svelte';
	import NewtonExplorer from '$lib/components/demos/NewtonExplorer.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
	let behaviorX = $state(-1.75);
	let behaviorBoard: any = null;

	function updateBehaviorBoard() {
		requestAnimationFrame(() => behaviorBoard?.update());
	}

	function setupBehaviorGraph(JXG: any, board: any) {
		behaviorBoard = board;
		const f = (x: number) => x * x * x - 3 * x + 2;

		const graph = board.create('functiongraph', [f, -2.35, 2.35], {
			strokeColor: '#1a1a2e',
			strokeWidth: 2.5,
			highlight: false
		});

		const points = [
			{ x: -1, labelX: -1, color: 'var(--plot-solution)', label: 'local maximum (−1, 4)', labelY: 4.45, anchorX: 'middle' },
			{ x: 1, labelX: 1, color: 'var(--plot-error)', label: 'local minimum (1, 0)', labelY: -0.45, anchorX: 'middle' },
			{ x: 0, labelX: 0.2, color: 'var(--plot-point)', label: 'inflection (0, 2)', labelY: 2.35, anchorX: 'left' }
		];

		for (const point of points) {
			board.create('point', [point.x, f(point.x)], {
				size: point.x === 0 ? 3 : 4,
				fillColor: point.color,
				strokeColor: point.color,
				name: '',
				fixed: true,
				highlight: false
			});
			board.create('text', [point.labelX, point.labelY, point.label], {
				fontSize: 10,
				color: point.color,
				anchorX: point.anchorX,
				highlight: false,
				fontWeight: 'bold'
			});
		}

		board.create('segment', [[-1.8, 4], [-0.2, 4]], {
			strokeColor: '#059669',
			strokeWidth: 1.5,
			dash: 2,
			fixed: true,
			highlight: false
		});
		board.create('segment', [[0.2, 0], [1.8, 0]], {
			strokeColor: '#ef4444',
			strokeWidth: 1.5,
			dash: 2,
			fixed: true,
			highlight: false
		});

		const probe = board.create('point', [() => behaviorX, () => f(behaviorX)], {
			size: 5,
			fillColor: '#a855f7',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});
		const tangentGuide = board.create(
			'point',
			[
				() => behaviorX + 1,
				() => f(behaviorX) + (3 * behaviorX * behaviorX - 3)
			],
			{ visible: false, fixed: true, name: '' }
		);
		board.create('line', [probe, tangentGuide], {
			strokeColor: '#a855f7',
			strokeWidth: 1.8,
			strokeOpacity: 0.68,
			dash: 2,
			fixed: true,
			highlight: false
		});
		board.create(
			'text',
			[
				-2.38,
				4.72,
				() => {
					const x = behaviorX;
					const slope = 3 * x * x - 3;
					const bend = 6 * x;
					return `x=${x.toFixed(2)} · f′=${slope.toFixed(2)} · f″=${bend.toFixed(2)}`;
				}
			],
			{
				fontSize: 11,
				color: '#6d5c84',
				fixed: true,
				highlight: false
			}
		);
	}

	function setupNewtonGraph(JXG: any, board: any) {
		const f = (x: number) => x * x - 2;
		const fp = (x: number) => 2 * x;

		const graph = board.create('functiongraph', [f, 0.8, 2.25], {
			strokeColor: '#1a1a2e',
			strokeWidth: 2.5,
			highlight: false
		});
		board.create('line', [[0, 0], [1, 0]], {
			strokeColor: '#b9b4c0',
			strokeWidth: 1,
			straightFirst: true,
			straightLast: true,
			point1: { visible: false },
			point2: { visible: false },
			highlight: false
		});

		const x0 = board.create('glider', [2, f(2), graph], {
			size: 5,
			fillColor: '#a855f7',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: false,
			highlightFillColor: '#7c3aed',
			highlightStrokeColor: '#ffffff',
			snapSizeX: 0.01
		});
		const next = () => {
			const x = x0.X();
			return x - f(x) / fp(x);
		};
		const nextAgain = () => {
			const x = next();
			return x - f(x) / fp(x);
		};
		const x1 = board.create('point', [next, 0], {
			size: 4,
			fillColor: '#2563eb',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});
		const curveAtX1 = board.create('point', [next, () => f(next())], {
			visible: false,
			name: '',
			fixed: true
		});
		const x2 = board.create('point', [nextAgain, 0], {
			size: 4,
			fillColor: '#059669',
			strokeColor: '#ffffff',
			strokeWidth: 2,
			name: '',
			fixed: true,
			highlight: false
		});

		board.create('segment', [x0, x1], {
			strokeColor: '#a855f7',
			strokeWidth: 2,
			dash: 2,
			fixed: true,
			highlight: false
		});
		board.create('segment', [x1, curveAtX1], {
			strokeColor: '#6366f1',
			strokeWidth: 1,
			dash: 3,
			fixed: true,
			highlight: false
		});
		board.create('segment', [curveAtX1, x2], {
			strokeColor: '#6366f1',
			strokeWidth: 2,
			dash: 2,
			fixed: true,
			highlight: false
		});

		board.create(
			'text',
			[
				0.82,
				2.34,
				() =>
					`drag x₀=${x0.X().toFixed(3)}  →  x₁=${next().toFixed(4)}  →  x₂=${nextAgain().toFixed(4)}`
			],
			{
				fontSize: 11,
				color: '#6d5c84',
				fixed: true,
				highlight: false
			}
		);

		const root = Math.sqrt(2);
		board.create('point', [root, 0], {
			size: 2,
			fillColor: '#ef4444',
			strokeColor: '#ef4444',
			name: '',
			fixed: true,
			highlight: false
		});
		board.create('text', [root, -0.24, '√2'], {
			fontSize: 9,
			color: '#ef4444',
			anchorX: 'middle',
			highlight: false
		});
	}
</script>

<section class="chapter" id="ch4">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 4</span>
			<h2 class="chapter-title">Optimization and Local Analysis</h2>
			<div class="chapter-epigraph">
				<blockquote>“How can a local slope settle a contest among many possible choices?”</blockquote>
				<p class="epigraph-attr">The question behind optimization</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Suppose you have 100 metres of fencing and want to enclose a rectangle. A long, thin
				rectangle wastes space. A shape closer to a square seems better—but which dimensions give
				the largest possible area?
			</p>
			<p>
				Move the slider below. Watch both the rectangle and the point on the area graph. Try to
				make the displayed area as large as you can before reading on.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="4.1"
				caption="Every slider position uses the same 100 metres of fencing. The graph records how the enclosed area changes with the side x."
			>
				<FencingOptimizer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The experiment suggests a winner near <Katex math="x=25" /> metres. Calculus must do more
				than suggest: it must explain why the area rises before that choice, falls after it, and
				has no larger value hiding at an endpoint.
			</p>

			<h3>From a slope to a direction</h3>
			<p>
				At one input, the derivative is the coefficient in the exact first-order equation
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="f(x+d)=f(x)+f'(x)d" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				That equation describes the local direction of the graph. To make a statement across an
				ordinary interval, we use a global bridge: the monotonicity theorem.
			</p>
		</div>

		<Callout type="theorem" title="Derivative Signs on an Interval">
			<p>
				If <Katex math="f" /> is differentiable throughout an ordinary interval, then
				<Katex math="f'(x)>0" /> everywhere on that interval makes <Katex math="f" /> increasing,
				while <Katex math="f'(x)<0" /> everywhere makes it decreasing.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				For example, <Katex math="p(x)=x^2" /> has derivative <Katex math="p'(x)=2x" />. It is
				negative on <Katex math="x<0" /> and positive on <Katex math="x>0" />. So the parabola
				decreases until <Katex math="x=0" /> and increases afterward.
			</p>
		</div>

		<Callout type="key-idea" title="Local Information, Global Conclusion">
			<p>
				The first-order equation tells us the slope at each point. The conclusion that a function
				increases across a whole interval uses an additional global principle. We do not prove it
				by choosing a “positive infinitesimal”: first-order displacements in the SDG model are not
				ordinary signed real steps.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Where can an optimum occur?</h3>
			<p>
				A <strong>local maximum</strong> is a value at least as large as all sufficiently nearby
				values. A <strong>local minimum</strong> is at most as large as all sufficiently nearby
				values. An <strong>absolute</strong> maximum or minimum wins against every allowed input,
				not just nearby ones.
			</p>
			<p>
				At a smooth interior peak or valley, the graph cannot still be climbing or falling. Its
				local line must be horizontal. This is Fermat’s stationary-point theorem.
			</p>
		</div>

		<Callout type="theorem" title="Stationary-Point Condition">
			<p>
				If <Katex math="f" /> is differentiable at an interior point <Katex math="a" /> and has a
				local maximum or minimum there, then <Katex math="f'(a)=0" />.
			</p>
			<p>
				In first-order language, <Katex math="f'(a)=0" /> means
				<Katex math="f(a+d)=f(a)" /> for every first-order displacement <Katex math="d" />. The
				microline is flat.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				The condition is necessary, not sufficient. For <Katex math="f(x)=x^3" />, we have
				<Katex math="f'(0)=0" />, yet the graph passes through the origin while continuing to
				increase. A flat tangent makes a point a <em>candidate</em>, not an automatic winner.
			</p>
			<p>
				A <strong>critical number</strong> is an allowed input where <Katex math="f'=0" /> or where
				the derivative does not exist. On a closed interval, the endpoints are candidates too.
				That gives us a reliable search list.
			</p>
		</div>

		<Callout type="key-idea" title="Closed-Interval Candidate Method">
			<p>
				For a continuous function on <Katex math="[a,b]" />, the extreme value theorem guarantees
				an absolute maximum and minimum. Find the interior critical numbers, evaluate the function
				at those inputs and at both endpoints, then compare the resulting values.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Classify what the graph is doing</h3>
			<p>
				A stationary point can be a peak, a valley, or neither. The safest classifier asks what
				the function does just before and just after the point.
			</p>
		</div>

		<Callout type="theorem" title="First-Derivative Test">
			<p>Suppose <Katex math="f'(a)=0" /> and inspect ordinary intervals beside <Katex math="a" />.</p>
			<ul>
				<li>Positive slope on the left and negative slope on the right gives a local maximum.</li>
				<li>Negative slope on the left and positive slope on the right gives a local minimum.</li>
				<li>If the slope keeps the same sign, the point is neither.</li>
			</ul>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				The second derivative tells us how the slope changes. If <Katex math="f''>0" /> on an
				interval, then <Katex math="f'" /> increases and the graph is <strong>concave up</strong>.
				If <Katex math="f''<0" />, the graph is <strong>concave down</strong>. An inflection point
				is a point where concavity actually changes; merely finding <Katex math="f''=0" /> is not
				enough.
			</p>
		</div>

		<Callout type="theorem" title="Second-Derivative Test">
			<p>
				Suppose <Katex math="f'(a)=0" /> and <Katex math="f''" /> is continuous near
				<Katex math="a" />. If <Katex math="f''(a)>0" />, then <Katex math="a" /> is a strict local
				minimum. If <Katex math="f''(a)<0" />, it is a strict local maximum. If
				<Katex math="f''(a)=0" />, the test says nothing.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h4>One graph, read from its derivatives</h4>
			<p>Consider <Katex math="f(x)=x^3-3x+2" />. Differentiate twice:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Build the sign information</div>
			<div class="step">
				<div class="step-math"><Katex math="f'(x)=3x^2-3=3(x-1)(x+1)" display /></div>
				<div class="step-note">stationary at <Katex math="x=-1,1" /></div>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\begin{aligned}f'&>0&&\text{ on }(-\infty,-1),\\f'&<0&&\text{ on }(-1,1),\\f'&>0&&\text{ on }(1,\infty).\end{aligned}`}
						display
					/>
				</div>
				<div class="step-note">test one ordinary input in each interval</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math="f''(x)=6x" display /></div>
				<div class="step-note">concavity changes at <Katex math="x=0" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Thus <Katex math="(-1,4)" /> is a local maximum, <Katex math="(1,0)" /> is a local minimum,
				and <Katex math="(0,2)" /> is an inflection point. These extrema are only local: the cubic
				continues without bound in both directions.
			</p>
			<p>
				In the graph below, notice that the horizontal tangents mark the two stationary points.
				The orange point marks a different event: the curve changes the way it bends.
			</p>
		</div>

		<div use:reveal>
			<label class="behavior-control" for="behavior-x">
				<span>Move the point along the curve</span>
				<input
					id="behavior-x"
					type="range"
					min="-2.2"
					max="2.2"
					step="0.05"
					bind:value={behaviorX}
					oninput={updateBehaviorBoard}
					class="demo-slider tone-violet"
					style={`--slider-progress: ${((behaviorX + 2.2) / 4.4) * 100}%`}
				/>
				<output>x = {behaviorX.toFixed(2)}</output>
			</label>
			<JSXGraphBoard
				setup={setupBehaviorGraph}
				boundingbox={[-2.55, 5, 2.55, -1]}
				aspectRatio={1.2}
				keepAspectRatio={false}
				interactive
				number="4.2"
				caption="Drag the purple point along the curve. The live values of f′ and f″ separate direction from bending; the fixed markers identify the extrema and inflection point."
			/>
		</div>

		<DigDeeper title="Why f''(a) = 0 is inconclusive">
			<p>
				At <Katex math="x=0" />, each of <Katex math="x^4" />, <Katex math="-x^4" />, and
				<Katex math="x^3" /> has first and second derivative zero. Yet the first has a minimum, the
				second has a maximum, and the third has neither. When the second-derivative test is silent,
				return to the first-derivative sign test.
			</p>
		</DigDeeper>

		<div class="neo-prose" use:reveal>
			<h3>Finish the fencing problem</h3>
			<p>
				Let the rectangle sides be <Katex math="x" /> and <Katex math="y" /> metres. The perimeter
				condition gives <Katex math="2x+2y=100" />, so <Katex math="y=50-x" />. The area is
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`\begin{aligned}A(x)&=x(50-x)=50x-x^2,\\&\hspace{1.25em}0\le x\le50.\end{aligned}`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The domain matters. It records every feasible choice, including the two collapsed boundary
				cases. Differentiate and locate the interior candidate.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Maximize the enclosed area</div>
			<div class="step">
				<div class="step-math"><Katex math="A'(x)=50-2x" display /></div>
				<div class="step-note">differentiate the model</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`50-2x=0\quad\Longrightarrow\quad x=25`} display /></div>
				<div class="step-note">interior stationary point</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`A(0)=0,\quad A(25)=625,\quad A(50)=0`} display /></div>
				<div class="step-note">compare every candidate</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The absolute maximum area is therefore <Katex math={r`625\text{ m}^2`} />. It occurs when
				<Katex math="x=25" /> and <Katex math="y=25" />: the winning rectangle is a square.
				The derivative located the interior candidate; the closed-interval comparison established
				the global result.
			</p>
		</div>

		<Callout type="key-idea" title="A Practical Optimization Checklist">
			<ol>
				<li>Name the quantity you want to maximize or minimize.</li>
				<li>Write it as a function of one input and state the allowed domain.</li>
				<li>Find interior critical numbers.</li>
				<li>Classify locally when useful, but compare all required candidates for a global answer.</li>
				<li>Report the result with units and interpret it in the original problem.</li>
			</ol>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Use a local line to improve a guess</h3>
			<p>
				Optimization searches for inputs where a quantity is largest or smallest. A related problem
				is solving <Katex math="f(x)=0" /> when algebra does not give an easy answer. Newton’s
				method repeatedly replaces the curve by its local line.
			</p>
			<p>
				Start from an ordinary numerical guess <Katex math="x_n" />. For an ordinary correction
				<Katex math="h" />, the local line predicts
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x_n+h)\approx f(x_n)+f'(x_n)h`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Set the <em>linear model</em>, not the original function, equal to zero and solve for
				<Katex math="h" />. This gives the next guess.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Newton’s update</div>
			<div class="step">
				<div class="step-math"><Katex math="0=f(x_n)+f'(x_n)h" display /></div>
				<div class="step-note">zero of the tangent line</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`h=-\frac{f(x_n)}{f'(x_n)}`} display /></div>
				<div class="step-note">requires <Katex math={r`f'(x_n)\neq0`} /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`} display /></div>
				<div class="step-note">move to the tangent’s intercept</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example: approximate <Katex math={r`\sqrt2`} /></h4>
			<p>
				Solving <Katex math="x^2-2=0" /> finds <Katex math={r`\sqrt2`} />. With
				<Katex math="f(x)=x^2-2" />, <Katex math="f'(x)=2x" />, and <Katex math="x_0=2" />,
				the first two updates are
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Two Newton steps</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x_1=2-\frac{2^2-2}{2\cdot2}=1.5`} display /></div>
				<div class="step-note">first tangent intercept</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`x_2=1.5-\frac{1.5^2-2}{2(1.5)}\approx1.4167`} display /></div>
				<div class="step-note"><Katex math={r`\sqrt2\approx1.4142`} /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Read the diagram from purple to blue. Each tangent meets the horizontal axis closer to the
				true root, and that intercept becomes the next input.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="4.3"
				caption="Move the starting guess. Each tangent meets the axis at the next guess, making two Newton updates visible as a changing construction."
			>
				<NewtonExplorer />
			</Figure>
		</div>

		<Callout type="warning" title="Newton’s Method Needs Conditions">
			<p>
				The method can fail if <Katex math="f'(x_n)=0" />, if a tangent jumps outside the useful
				domain, or if the starting guess is too far from the desired root. The first-order model is
				exact on infinitesimal displacements; a Newton correction is an ordinary finite step, so
				convergence requires separate assumptions.
			</p>
		</Callout>

		<ChapterSummary>
			<ul>
				<li>Derivative signs describe increasing and decreasing behavior on ordinary intervals.</li>
				<li>An interior differentiable extremum must be stationary, but a stationary point need not be an extremum.</li>
				<li>The first-derivative test tracks direction changes; the second-derivative test is a conditional shortcut.</li>
				<li>Absolute optimization requires a domain and comparison of all relevant candidates, including endpoints.</li>
				<li>Newton’s method uses an ordinary tangent-line approximation to improve a numerical guess.</li>
			</ul>
			<p>
				For the opening problem, the derivative found the only interior candidate and the endpoint
				comparison proved that a <Katex math={r`25\text{ m}\times25\text{ m}`} /> square encloses the
				largest area.
			</p>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (6 core, 2 explorations)</summary>

			<Exercise number={1}>
				<p>
					<strong>Core.</strong> Find where <Katex math="f(x)=x^2-4x+1" /> is increasing and
					decreasing, then classify its stationary point.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="f'(x)=2x-4" /> is negative for <Katex math="x<2" /> and positive for
						<Katex math="x>2" />. The function decreases on <Katex math={r`(-\infty,2)`} /> and
						increases on <Katex math={r`(2,\infty)`} />, so <Katex math="x=2" /> is a local minimum.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Core.</strong> Find and classify the stationary points of
					<Katex math="g(x)=x^3-3x" />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="g'(x)=3(x-1)(x+1)" />, so the stationary inputs are
						<Katex math="x=-1,1" />. The derivative changes from positive to negative at
						<Katex math="-1" />, giving a local maximum <Katex math="(-1,2)" />. It changes from
						negative to positive at <Katex math="1" />, giving a local minimum <Katex math="(1,-2)" />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> Explain why <Katex math="f(x)=x^3" /> shows that
					<Katex math="f'(a)=0" /> does not guarantee an extremum.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="f'(x)=3x^2" />, so <Katex math="f'(0)=0" />. But the derivative is
						positive on both sides of zero, and <Katex math="x^3" /> keeps increasing through the
						origin. Thus zero is stationary but is neither a maximum nor a minimum.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Find the absolute maximum and minimum of
					<Katex math="f(x)=x^3-3x+1" /> on <Katex math="[-2,2]" />.
				</p>
				{#snippet solution()}
					<p>
						The interior critical numbers are <Katex math="x=-1,1" />. The candidate values are
						<Katex math={r`f(-2)=-1,\ f(-1)=3,\ f(1)=-1,\ f(2)=3`} />. The absolute maximum is 3
						at <Katex math="x=-1" /> and <Katex math="x=2" />; the absolute minimum is −1 at
						<Katex math="x=-2" /> and <Katex math="x=1" />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> A rectangle has perimeter 60 metres. Find the dimensions that give
					the largest area, and state that area.
				</p>
				{#snippet solution()}
					<p>
						With sides <Katex math="x" /> and <Katex math="30-x" />,
						<Katex math="A(x)=x(30-x)" /> on <Katex math="[0,30]" />. Since
						<Katex math="A'(x)=30-2x" />, the interior candidate is <Katex math="x=15" />. Comparing
						with the endpoints gives a <Katex math={r`15\text{ m}\times15\text{ m}`} /> square with area
						<Katex math={r`225\text{ m}^2`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Use two Newton steps to approximate <Katex math={r`\sqrt5`} />, starting
					from <Katex math="x_0=2" />.
				</p>
				{#snippet solution()}
					<p>
						For <Katex math="f(x)=x^2-5" />, the update is
						<Katex math={r`x_{n+1}=x_n-(x_n^2-5)/(2x_n)`} />. Thus
						<Katex math="x_1=2.25" /> and <Katex math={r`x_2\approx2.2361`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> A concert venue can sell <Katex math="q" /> tickets at price
					<Katex math="p(q)=80-2q" /> dollars each, with <Katex math={r`0\le q\le40`} />. Find the
					ticket count and price that maximize revenue.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="R(q)=q(80-2q)=80q-2q^2" /> and
						<Katex math="R'(q)=80-4q" />, so <Katex math="q=20" /> is the interior candidate. The
						endpoint revenues are zero, while <Katex math="R(20)=800" />. Charge $40 and sell 20
						tickets.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> Newton’s method is started on
					<Katex math="f(x)=x^3-x" /> at <Katex math={r`x_0=1/\sqrt3`} />. Explain why the next
					update is not defined and interpret the failure geometrically.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="f'(x)=3x^2-1" />, so <Katex math={r`f'(1/\sqrt3)=0`} />. Newton’s formula
						would divide by zero. Geometrically, the tangent is horizontal and therefore has no
						horizontal-axis intercept to use as the next guess.
					</p>
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				Optimization used derivatives to compare possible outputs. Chapter 5 asks the reverse
				question: when a rate of change is known, how can we recover the accumulated quantity?
			</p>
		</LookingAhead>
	</div>
</section>

<style>
	.behavior-control {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) 4.8rem;
		align-items: center;
		gap: 0.75rem;
		margin: var(--space-md) 0 0.45rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--color-ink-light);
	}

	.behavior-control output {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		text-align: right;
		color: var(--color-d);
	}

	@media (max-width: 540px) {
		.behavior-control {
			grid-template-columns: 1fr 4.5rem;
		}

		.behavior-control span {
			grid-column: 1 / -1;
		}
	}
</style>
