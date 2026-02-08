<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import StandardCalcBox from '$lib/components/StandardCalcBox.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupOptimization(JXG: any, board: any) {
		// f(x) = -x^3 + 3x  has max at x=1, min at x=-1
		const f = (x: number) => -x * x * x + 3 * x;

		// Function curve
		board.create('functiongraph', [f, -2.5, 2.5], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false
		});

		// Maximum at x=1
		board.create('point', [1, f(1)], {
			size: 4, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		// Horizontal tangent at max
		board.create('segment', [[-0.2, f(1)], [2.2, f(1)]], {
			strokeColor: '#a855f7', strokeWidth: 2, dash: 2,
			fixed: true, highlight: false
		});
		board.create('text', [1, f(1) + 0.35, "maximum: f'= 0"], {
			fontSize: 12, color: '#a855f7', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Minimum at x=-1
		board.create('point', [-1, f(-1)], {
			size: 4, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		// Horizontal tangent at min
		board.create('segment', [[-2.2, f(-1)], [0.2, f(-1)]], {
			strokeColor: '#a855f7', strokeWidth: 2, dash: 2,
			fixed: true, highlight: false
		});
		board.create('text', [-1, f(-1) - 0.4, "minimum: f' = 0"], {
			fontSize: 12, color: '#a855f7', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Infinitesimal neighborhoods (small rectangles)
		board.create('polygon', [[0.7, f(1) - 0.15], [1.3, f(1) - 0.15], [1.3, f(1) + 0.15], [0.7, f(1) + 0.15]], {
			fillColor: 'rgba(168,85,247,0.08)', strokeColor: '#a855f7',
			strokeWidth: 1, dash: 2, highlight: false,
			vertices: { visible: false }, borders: { highlight: false }
		});
		board.create('polygon', [[-1.3, f(-1) - 0.15], [-0.7, f(-1) - 0.15], [-0.7, f(-1) + 0.15], [-1.3, f(-1) + 0.15]], {
			fillColor: 'rgba(168,85,247,0.08)', strokeColor: '#a855f7',
			strokeWidth: 1, dash: 2, highlight: false,
			vertices: { visible: false }, borders: { highlight: false }
		});

		board.create('text', [0, -2.8, 'flat neighborhoods → stationary points'], {
			fontSize: 11, color: '#94919b', anchorX: 'middle', highlight: false
		});
	}

	function setupCurveSketching(JXG: any, board: any) {
		const f = (x: number) => x * x * x - 3 * x + 2;
		const fp = (x: number) => 3 * x * x - 3;
		const fpp = (x: number) => 6 * x;

		board.create('functiongraph', [f, -2.8, 2.8], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false
		});

		// Critical points
		board.create('point', [-1, f(-1)], {
			size: 4, fillColor: '#059669', strokeColor: '#059669',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [-1.05, f(-1) + 0.5, 'local max (−1, 4)'], {
			fontSize: 10, color: '#059669', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		board.create('point', [1, f(1)], {
			size: 4, fillColor: '#ef4444', strokeColor: '#ef4444',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [1.05, f(1) - 0.5, 'local min (1, 0)'], {
			fontSize: 10, color: '#ef4444', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Inflection point
		board.create('point', [0, f(0)], {
			size: 3, fillColor: '#f59e0b', strokeColor: '#f59e0b',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [0.5, f(0) + 0.3, 'inflection (0, 2)'], {
			fontSize: 10, color: '#f59e0b', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Horizontal tangents at critical points
		board.create('segment', [[-2, f(-1)], [0, f(-1)]], {
			strokeColor: '#059669', strokeWidth: 1.5, dash: 2,
			fixed: true, highlight: false
		});
		board.create('segment', [[0, f(1)], [2, f(1)]], {
			strokeColor: '#ef4444', strokeWidth: 1.5, dash: 2,
			fixed: true, highlight: false
		});
	}

	function setupNewtonMethod(JXG: any, board: any) {
		const f = (x: number) => x * x - 2;
		const fp = (x: number) => 2 * x;

		board.create('functiongraph', [f, 0, 2.5], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false
		});

		// x-axis
		board.create('line', [[0, 0], [1, 0]], {
			strokeColor: '#ccc8bf', strokeWidth: 1, highlight: false,
			straightFirst: true, straightLast: true,
			point1: { visible: false }, point2: { visible: false }
		});

		// x0 = 2
		const x0 = 2;
		const y0 = f(x0);
		const m0 = fp(x0);
		const x1 = x0 - y0 / m0; // 1.5
		const y1 = f(x1);
		const m1 = fp(x1);
		const x2 = x1 - y1 / m1; // ~1.4167

		// First tangent line from x0
		board.create('point', [x0, y0], {
			size: 4, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [x0 + 0.08, y0 + 0.15, 'x₀ = 2'], {
			fontSize: 10, color: '#a855f7', highlight: false, fontWeight: 'bold'
		});
		// Tangent from (x0, y0) to (x1, 0)
		board.create('segment', [[x0, y0], [x1, 0]], {
			strokeColor: '#a855f7', strokeWidth: 1.8, dash: 2,
			fixed: true, highlight: false
		});

		// x1
		board.create('point', [x1, 0], {
			size: 3, fillColor: '#6366f1', strokeColor: '#6366f1',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [x1 - 0.02, -0.22, 'x₁ = 1.5'], {
			fontSize: 10, color: '#6366f1', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Vertical dashed from x1 on axis up to curve
		board.create('segment', [[x1, 0], [x1, y1]], {
			strokeColor: '#6366f1', strokeWidth: 1, dash: 3,
			fixed: true, highlight: false
		});
		board.create('point', [x1, y1], {
			size: 3, fillColor: '#6366f1', strokeColor: '#6366f1',
			name: '', fixed: true, highlight: false
		});

		// Second tangent from (x1, y1) to (x2, 0)
		board.create('segment', [[x1, y1], [x2, 0]], {
			strokeColor: '#6366f1', strokeWidth: 1.8, dash: 2,
			fixed: true, highlight: false
		});

		// x2
		board.create('point', [x2, 0], {
			size: 3, fillColor: '#059669', strokeColor: '#059669',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [x2 + 0.02, -0.22, 'x₂ ≈ 1.4167'], {
			fontSize: 10, color: '#059669', anchorX: 'middle', highlight: false, fontWeight: 'bold'
		});

		// Exact root marker
		const sq2 = Math.sqrt(2);
		board.create('point', [sq2, 0], {
			size: 2, fillColor: '#ef4444', strokeColor: '#ef4444',
			name: '', fixed: true, highlight: false
		});
		board.create('text', [sq2, 0.2, '√2 ≈ 1.4142'], {
			fontSize: 9, color: '#ef4444', anchorX: 'middle', highlight: false
		});
	}
</script>

<section class="chapter" id="ch4">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 4</span>
			<h2 class="chapter-title">Applications of Derivatives</h2>
			<div class="chapter-epigraph">
				<blockquote>"Nothing takes place in the world whose meaning is not that of some maximum or minimum."</blockquote>
				<p class="epigraph-attr">— Leonhard Euler, <em>Methodus Inveniendi</em>, 1744</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Now that we can compute derivatives of any function, let's <em>use</em> them. The derivative tells us how a function changes — and that unlocks the ability to find peaks, valleys, sketch curves, approximate values, and solve equations. In this chapter, every application flows from one idea: the Kock-Lawvere slope equation <Katex math={r`f(x + d) = f(x) + f'(x) \cdot d`} />.</p>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 1: WHAT THE DERIVATIVE TELLS US                -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>What the derivative tells us</h3>
			<p>The slope equation says: when you nudge <Katex math="x" /> by an infinitesimal <span class="d-highlight">d</span>, the output changes by <Katex math={r`f'(x) \cdot d`} />. This tiny change reveals everything about the function's behavior.</p>
			<p>Since <span class="d-highlight">d</span> can be positive or negative but is nonzero, the <em>sign</em> of <Katex math={r`f'(x)`} /> determines the direction of change:</p>
		</div>

		<Callout type="key-idea" title="Increasing and Decreasing">
			<p>For a smooth function <Katex math="f" />:</p>
			<p>If <Katex math={r`f'(x) > 0`} /> on an interval, then <Katex math="f" /> is <strong>increasing</strong> there — as <Katex math="x" /> grows, so does <Katex math={r`f(x)`} />.</p>
			<p>If <Katex math={r`f'(x) < 0`} /> on an interval, then <Katex math="f" /> is <strong>decreasing</strong> there — as <Katex math="x" /> grows, <Katex math={r`f(x)`} /> shrinks.</p>
			<p>The SDG reasoning: <Katex math={r`f(x + d) - f(x) = f'(x) \cdot d`} />. A positive derivative times a positive nudge gives a positive change.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is beautifully direct. In the infinitesimal neighborhood of <Katex math="x" />, the function <em>is</em> a line with slope <Katex math={r`f'(x)`} />. A positive slope means going uphill; a negative slope means going downhill. There is nothing more to it.</p>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 2: CONCAVITY AND THE SECOND DERIVATIVE         -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Concavity and the second derivative</h3>
			<p>The first derivative tells us whether the function goes up or down. The <strong>second derivative</strong> <Katex math={r`f''(x)`} /> tells us <em>how the slope itself is changing</em> — whether the curve bends upward or downward.</p>
			<p>Think of driving along a road. The first derivative is your direction (uphill or downhill). The second derivative is whether the road is curving to make the hill steeper or gentler.</p>
		</div>

		<Callout type="definition" title="Concavity">
			<p>A function is <strong>concave up</strong> on an interval if <Katex math={r`f''(x) > 0`} /> there — the curve bends upward like a bowl. The slope is increasing.</p>
			<p>A function is <strong>concave down</strong> on an interval if <Katex math={r`f''(x) < 0`} /> there — the curve bends downward like a hill. The slope is decreasing.</p>
			<p>A point where <Katex math={r`f''(x) = 0`} /> and concavity changes is called an <strong>inflection point</strong>.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>In SDG, we can understand concavity through the <strong>second-order expansion</strong>. Recall from Chapter 3 that when we use two independent infinitesimals <Katex math={r`d_1, d_2`} /> (where <Katex math={r`d_1^2 = d_2^2 = 0`} /> but <Katex math={r`d_1 d_2`} /> need not vanish):</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + d_1 + d_2) = f(x) + f'(x)(d_1 + d_2) + f''(x) \cdot d_1 d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The coefficient of the product <Katex math={r`d_1 d_2`} /> is the second derivative. When <Katex math={r`f''(x) > 0`} />, the <Katex math={r`d_1 d_2`} /> term adds a positive correction to the linear approximation — the curve lies <em>above</em> its tangent. When <Katex math={r`f''(x) < 0`} />, the curve lies below.</p>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 3: STATIONARY POINTS + CLASSIFICATION          -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Stationary points and classification</h3>
			<p>A <strong>stationary point</strong> has a beautifully clean definition in SDG: a point <Katex math="a" /> where the function doesn't change at all in the infinitesimal neighborhood.</p>
		</div>

		<Callout type="definition" title="Stationary Point">
			<p>A point <Katex math="a" /> is a stationary point of <Katex math="f" /> if <Katex math={r`f(a + d) = f(a)`} /> for all infinitesimal <span class="d-highlight">d</span>. This means the infinitesimal neighborhood is <strong>flat</strong>.</p>
			<p>By the slope equation: <Katex math={r`f(a) + f'(a)\,d = f(a)`} />, so <Katex math={r`f'(a)\,d = 0`} /> for all <span class="d-highlight">d</span>, hence <Katex math={r`f'(a) = 0`} /> by microcancellation.</p>
		</Callout>

		<div use:reveal>
			<JSXGraphBoard
				setup={setupOptimization}
				boundingbox={[-2.8, 3.2, 2.8, -3.2]}
				aspectRatio={(2.8 - -2.8) / (3.2 - -3.2)}
				number="4.1"
				caption="At a maximum or minimum, the infinitesimal neighborhood is flat — the tangent is horizontal, meaning f'(a) = 0."
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>But how do we know whether a stationary point is a <strong>maximum</strong>, a <strong>minimum</strong>, or neither? We have two tests.</p>

			<h4>The First Derivative Test</h4>
			<p>Look at the sign of <Katex math={r`f'(x)`} /> on either side of the stationary point <Katex math="a" />:</p>
		</div>

		<Callout type="theorem" title="First Derivative Test">
			<p>Let <Katex math={r`f'(a) = 0`} />.</p>
			<p>If <Katex math={r`f'`} /> changes from <strong>positive to negative</strong> at <Katex math="a" />, then <Katex math="a" /> is a <strong>local maximum</strong>.</p>
			<p>If <Katex math={r`f'`} /> changes from <strong>negative to positive</strong> at <Katex math="a" />, then <Katex math="a" /> is a <strong>local minimum</strong>.</p>
			<p>If <Katex math={r`f'`} /> does <strong>not change sign</strong>, then <Katex math="a" /> is neither — it is a <strong>saddle point</strong> (or point of inflection with horizontal tangent).</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>The intuition is immediate from the slope equation: if the slope is positive before <Katex math="a" /> (function rising) and negative after (function falling), then <Katex math="a" /> must be a peak.</p>

			<h4>The Second Derivative Test</h4>
			<p>When <Katex math={r`f''(a)`} /> exists and is nonzero, we can classify a stationary point without checking the sign of <Katex math={r`f'`} /> on either side. The SDG proof is particularly elegant.</p>
		</div>

		<Callout type="theorem" title="Second Derivative Test">
			<p>Let <Katex math={r`f'(a) = 0`} />.</p>
			<p>If <Katex math={r`f''(a) > 0`} />, then <Katex math="a" /> is a <strong>local minimum</strong>.</p>
			<p>If <Katex math={r`f''(a) < 0`} />, then <Katex math="a" /> is a <strong>local maximum</strong>.</p>
			<p>If <Katex math={r`f''(a) = 0`} />, the test is <strong>inconclusive</strong>.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">SDG Proof of the Second Derivative Test</div>
			<div class="step"><div class="step-math"><Katex math={r`f(a + d_1 + d_2) = f(a) + f'(a)(d_1 + d_2) + f''(a)\,d_1 d_2`} display /></div><span class="step-note">second-order expansion</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f(a) + 0 \cdot (d_1 + d_2) + f''(a)\,d_1 d_2`} display /></div><span class="step-note"><Katex math={r`f'(a) = 0`} /> (stationary)</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`f(a + d_1 + d_2) = f(a) + f''(a)\,d_1 d_2`} display /></div><span class="step-note">nearby values determined by <Katex math={r`f''(a)`} /></span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>At a stationary point, the first-order term vanishes, so nearby values differ from <Katex math={r`f(a)`} /> by <Katex math={r`f''(a) \cdot d_1 d_2`} />. If <Katex math={r`f''(a) > 0`} />, then this correction is positive when <Katex math={r`d_1, d_2`} /> have the same sign — meaning the function is <em>above</em> <Katex math={r`f(a)`} /> in both directions. That's a minimum. If <Katex math={r`f''(a) < 0`} />, the nearby values are <em>below</em>, giving a maximum.</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, the second derivative test requires a careful argument with Taylor's theorem and remainder estimates. In SDG, it's immediate: at a stationary point <Katex math={r`f(a + d_1 + d_2) = f(a) + f''(a)\,d_1 d_2`} />, and the sign of <Katex math={r`f''(a)`} /> directly tells you whether nearby values are above or below <Katex math={r`f(a)`} />. The proof is three lines of algebra.</p>
		</SDGAdvantage>

		<DigDeeper title="What happens when f''(a) = 0?">
			<p>The second derivative test gives no information when <Katex math={r`f''(a) = 0`} />. Consider three examples at <Katex math={r`x = 0`} />:</p>
			<p><Katex math={r`f(x) = x^4`} />: Here <Katex math={r`f'(0) = 0`} /> and <Katex math={r`f''(0) = 0`} />, but <Katex math={r`x = 0`} /> is a minimum (the function is always non-negative).</p>
			<p><Katex math={r`f(x) = -x^4`} />: Same situation, but <Katex math={r`x = 0`} /> is a maximum.</p>
			<p><Katex math={r`f(x) = x^3`} />: Here <Katex math={r`f'(0) = 0`} /> and <Katex math={r`f''(0) = 0`} />, but <Katex math={r`x = 0`} /> is neither a max nor a min — it's an inflection point with a horizontal tangent.</p>
			<p>When the second derivative test fails, use the first derivative test (check sign changes) or examine higher-order terms in the SDG expansion.</p>
		</DigDeeper>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 4: CURVE SKETCHING                             -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Curve sketching</h3>
			<p>With the first and second derivatives, we can sketch any smooth function systematically. Let's do a complete walkthrough.</p>

			<h4>Complete walkthrough: <Katex math={r`f(x) = x^3 - 3x + 2`} /></h4>
			<p><strong>Step 1: Find the derivative and critical points.</strong></p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Step 1: Critical Points</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x+d) = (x+d)^3 - 3(x+d) + 2`} display /></div><span class="step-note">substitute <Katex math={r`x+d`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^3 + 3x^2 d - 3x - 3d + 2`} display /></div><span class="step-note">expand, <Katex math={r`d^2 = 0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= f(x) + (3x^2 - 3)\,d`} display /></div><span class="step-note">read off slope</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`f'(x) = 3x^2 - 3 = 3(x-1)(x+1)`} display /></div><span class="step-note">critical at <Katex math={r`x = \pm 1`} /></span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p><strong>Step 2: Classify the critical points using the second derivative.</strong></p>
			<p>The second derivative is <Katex math={r`f''(x) = 6x`} />.</p>
			<p>At <Katex math={r`x = -1`} />: <Katex math={r`f''(-1) = -6 < 0`} />, so <Katex math={r`(-1, 4)`} /> is a <strong>local maximum</strong>.</p>
			<p>At <Katex math={r`x = 1`} />: <Katex math={r`f''(1) = 6 > 0`} />, so <Katex math={r`(1, 0)`} /> is a <strong>local minimum</strong>.</p>

			<p><strong>Step 3: Find inflection points.</strong></p>
			<p>Set <Katex math={r`f''(x) = 6x = 0`} />, giving <Katex math={r`x = 0`} />. Since <Katex math={r`f''`} /> changes sign (negative for <Katex math={r`x < 0`} />, positive for <Katex math={r`x > 0`} />), the point <Katex math={r`(0, 2)`} /> is an <strong>inflection point</strong> where the curve changes from concave down to concave up.</p>

			<p><strong>Step 4: Determine intervals of increase/decrease.</strong></p>
			<p><Katex math={r`f'(x) = 3(x-1)(x+1)`} />:</p>
		</div>

		<Figure caption="Sign analysis: f'(x) = 3(x−1)(x+1). The function increases, reaches a max at x = −1, decreases to a min at x = 1, then increases again.">
			<svg viewBox="0 0 420 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:420px">
				<line x1="30" y1="30" x2="390" y2="30" stroke="#1a1a2e" stroke-width="1.5"/>
				<!-- tick at -1 -->
				<line x1="140" y1="20" x2="140" y2="40" stroke="#1a1a2e" stroke-width="1.5"/>
				<text x="140" y="55" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">−1</text>
				<!-- tick at 1 -->
				<line x1="280" y1="20" x2="280" y2="40" stroke="#1a1a2e" stroke-width="1.5"/>
				<text x="280" y="55" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">1</text>
				<!-- signs -->
				<text x="85" y="20" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#059669" font-weight="700">f' &gt; 0 ↗</text>
				<text x="210" y="20" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#ef4444" font-weight="700">f' &lt; 0 ↘</text>
				<text x="335" y="20" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#059669" font-weight="700">f' &gt; 0 ↗</text>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<p><strong>Step 5: Put it all together.</strong></p>
			<p>The function rises from <Katex math={r`-\infty`} /> to the local max at <Katex math={r`(-1, 4)`} />, falls to the local min at <Katex math={r`(1, 0)`} />, then rises to <Katex math={r`+\infty`} />. It changes concavity at the inflection point <Katex math={r`(0, 2)`} />. Since the leading term is <Katex math={r`x^3`} />, the function goes to <Katex math={r`-\infty`} /> on the left and <Katex math={r`+\infty`} /> on the right.</p>
		</div>

		<div use:reveal>
			<JSXGraphBoard
				setup={setupCurveSketching}
				boundingbox={[-2.8, 5.5, 2.8, -2.5]}
				aspectRatio={(2.8 - -2.8) / (5.5 - -2.5)}
				number="4.2"
				caption="f(x) = x³ − 3x + 2. Local max at (−1, 4), local min at (1, 0), inflection at (0, 2)."
			/>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 5: OPTIMIZATION                                -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Optimization</h3>
			<p>Optimization — finding the maximum or minimum of a function — is one of the most powerful applications of calculus. The strategy is always the same: <strong>model the quantity to optimize, find where the derivative is zero, classify the result</strong>.</p>

			<h4>Worked Example 1: Maximizing Area (The Fencing Problem)</h4>
			<p>A farmer has 100 meters of fencing and wants to enclose the largest rectangular area. If the sides are <Katex math="x" /> and <Katex math={r`50-x`} />, the area is <Katex math={r`A(x) = x(50-x) = 50x - x^2`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Maximizing Fenced Area</div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) = 50(x+d) - (x+d)^2`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 50x + 50d - x^2 - 2xd - \textcolor{#ef4444}{d^2}`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= A(x) + (50 - 2x)\,d`} display /></div><span class="step-note"><Katex math={r`d^2 = 0`} />, collect</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A'(x) = 50 - 2x = 0 \implies x = 25`} display /></div><span class="step-note">set derivative to 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`A_{\max} = 25 \times 25 = 625 \text{ m}^2`} display /></div><span class="step-note">a square! ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Confirmation: <Katex math={r`A''(x) = -2 < 0`} />, so this is indeed a maximum.</p>
		</div>

		<InlinePlot fn={x => x*(50-x)} domain={[0, 50]} range={[0, 700]} tangentAt={25} caption="A(x) = x(50−x). Maximum at x = 25 where the tangent is horizontal." />

		<div class="neo-prose" use:reveal>
			<h4>Worked Example 2: Open-Top Box from a Sheet</h4>
			<p>A box with no lid is made from a <Katex math={r`12 \times 12`} /> sheet of metal by cutting squares of side <Katex math="x" /> from each corner and folding up the sides. What value of <Katex math="x" /> maximizes volume?</p>
			<p>After cutting and folding, the base is <Katex math={r`(12 - 2x) \times (12 - 2x)`} /> and the height is <Katex math="x" />, so:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`V(x) = x(12 - 2x)^2`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Finding the Optimal Cut Size</div>
			<div class="step"><div class="step-math"><Katex math={r`V(x) = x(144 - 48x + 4x^2) = 144x - 48x^2 + 4x^3`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V(x+d) = 144(x+d) - 48(x+d)^2 + 4(x+d)^3`} display /></div><span class="step-note">substitute <Katex math={r`x + d`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= V(x) + (144 - 96x + 12x^2)\,d`} display /></div><span class="step-note">expand, apply <Katex math={r`d^2 = 0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`V'(x) = 144 - 96x + 12x^2 = 12(x^2 - 8x + 12)`} display /></div><span class="step-note">read off the derivative</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 12(x - 2)(x - 6) = 0`} display /></div><span class="step-note">factor</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x = 2 \quad \text{or} \quad x = 6`} display /></div><span class="step-note">candidates</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Since <Katex math="x" /> must satisfy <Katex math={r`0 < x < 6`} /> (otherwise the box has no base), <Katex math={r`x = 6`} /> gives zero volume. Check the second derivative: <Katex math={r`V''(x) = 24x - 96`} />, so <Katex math={r`V''(2) = 48 - 96 = -48 < 0`} />. Confirmed maximum at <Katex math={r`x = 2`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Final Answer</div>
			<div class="step step-result"><div class="step-math"><Katex math={r`V(2) = 2(12 - 4)^2 = 2 \times 64 = 128 \text{ cubic units}`} display /></div><span class="step-note">optimal box volume ✓</span></div>
		</div>

		<InlinePlot fn={x => x * (12 - 2*x) * (12 - 2*x)} domain={[0, 6]} range={[0, 145]} tangentAt={2} caption="V(x) = x(12−2x)². Maximum volume of 128 at x = 2." />

		<div class="neo-prose" use:reveal>
			<h4>Worked Example 3: Minimizing Distance</h4>
			<p>Find the point on the parabola <Katex math={r`y = x^2`} /> closest to <Katex math={r`(0, 1)`} />.</p>
			<p>The distance squared from <Katex math={r`(x, x^2)`} /> to <Katex math={r`(0, 1)`} /> is <Katex math={r`D(x) = x^2 + (x^2 - 1)^2 = x^4 - x^2 + 1`} />. (Minimizing <Katex math="D" /> is equivalent to minimizing the actual distance, since the square root is increasing.)</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Minimizing Distance to a Parabola</div>
			<div class="step"><div class="step-math"><Katex math={r`D(x+d) = (x+d)^4 - (x+d)^2 + 1`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^4 + 4x^3 d - x^2 - 2xd + 1`} display /></div><span class="step-note">expand, <Katex math={r`d^2 = 0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`D'(x) = 4x^3 - 2x = 2x(2x^2 - 1) = 0`} display /></div><span class="step-note">set to 0</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`x = 0 \quad \text{or} \quad x = \pm \frac{1}{\sqrt{2}}`} display /></div><span class="step-note">three candidates</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Check: <Katex math={r`D(0) = 1`} />, while <Katex math={r`D(1/\sqrt{2}) = 1/4 - 1/2 + 1 = 3/4`} />. So the closest points are <Katex math={r`(\pm 1/\sqrt{2},\; 1/2)`} /> at distance <Katex math={r`\sqrt{3}/2`} />.</p>
		</div>

		<!-- HISTORY: Fermat -->
		<HistoryBox name="Pierre de Fermat" years="1607–1665">
			<p>Fermat was one of the first to find extrema algebraically. His method: replace <Katex math="x" /> by <Katex math={r`x + e`} />, set the two expressions "adequal" (approximately equal), cancel common terms, then set <Katex math={r`e = 0`} />. This is strikingly close to SDG's approach — substitute <Katex math={r`x + d`} />, apply <Katex math={r`d^2 = 0`} />, read off the coefficient. Fermat lacked the algebraic framework to justify why his "setting <Katex math="e = 0" />" worked, but his intuition was sound: he was computing with nilpotent infinitesimals 350 years before the formal theory existed.</p>
		</HistoryBox>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 6: ABSOLUTE VS RELATIVE EXTREMA                -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Absolute vs. relative extrema</h3>
			<p>A <strong>local</strong> (or relative) extremum is a peak or valley compared to nearby points. An <strong>absolute</strong> (or global) extremum is the largest or smallest value on the entire domain.</p>
			<p>For functions on <strong>closed intervals</strong> <Katex math={r`[a, b]`} />, absolute extrema are guaranteed to exist. They occur either at critical points (where <Katex math={r`f'(x) = 0`} />) or at the <strong>endpoints</strong> of the interval.</p>
		</div>

		<Callout type="key-idea" title="Closed-Interval Method">
			<p>To find the absolute maximum and minimum of <Katex math="f" /> on <Katex math={r`[a, b]`} />:</p>
			<p><strong>1.</strong> Find all critical points where <Katex math={r`f'(x) = 0`} /> in <Katex math={r`(a, b)`} />.</p>
			<p><strong>2.</strong> Evaluate <Katex math="f" /> at each critical point and at the endpoints <Katex math="a" /> and <Katex math="b" />.</p>
			<p><strong>3.</strong> The largest value is the absolute maximum; the smallest is the absolute minimum.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p><strong>Example:</strong> Find the absolute extrema of <Katex math={r`f(x) = x^3 - 3x + 2`} /> on <Katex math={r`[-2, 3]`} />.</p>
			<p>We already found <Katex math={r`f'(x) = 3(x-1)(x+1) = 0`} /> at <Katex math={r`x = \pm 1`} />. Now evaluate:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Closed-Interval Method</div>
			<div class="step"><div class="step-math"><Katex math={r`f(-2) = -8 + 6 + 2 = 0`} display /></div><span class="step-note">left endpoint</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f(-1) = -1 + 3 + 2 = 4`} display /></div><span class="step-note">critical point</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f(1) = 1 - 3 + 2 = 0`} display /></div><span class="step-note">critical point</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f(3) = 27 - 9 + 2 = 20`} display /></div><span class="step-note">right endpoint</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\text{Absolute max: } f(3) = 20 \qquad \text{Absolute min: } f(-2) = f(1) = 0`} display /></div><span class="step-note">compare all values ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice that the absolute maximum occurs at an endpoint, not at a critical point. The local maximum at <Katex math={r`(-1, 4)`} /> is <em>not</em> the absolute maximum on this interval — the function keeps climbing past it on the right.</p>
		</div>

		<StandardCalcBox title="The Extreme Value Theorem and MVT">
			<p>In standard calculus, the <strong>Extreme Value Theorem</strong> guarantees that a continuous function on a closed interval attains its absolute max and min. The <strong>Mean Value Theorem</strong> says there exists some <Katex math="c" /> in <Katex math={r`(a,b)`} /> where <Katex math={r`f'(c) = \frac{f(b) - f(a)}{b - a}`} />.</p>
			<p>Both theorems rely on classical existence arguments (proof by contradiction, law of excluded middle) that are constructively delicate. In SDG, we use the <strong>Constancy Principle</strong> instead: if <Katex math={r`f'(x) = 0`} /> for all <Katex math="x" /> in an interval, then <Katex math="f" /> is constant there. This is a constructively valid replacement that powers most of the same applications.</p>
		</StandardCalcBox>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 7: LINEAR APPROXIMATION                        -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Linear approximation</h3>
			<p>The slope equation <Katex math={r`f(x+d) = f(x) + f'(x)\,d`} /> is exact for infinitesimal <span class="d-highlight">d</span>. For <em>small but finite</em> <Katex math={r`\Delta x`} />, it gives the best linear approximation:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In Neocalculus, this approximation has a clear origin: it's the slope equation with a finite number substituted for an infinitesimal. The error comes from higher-order terms that would vanish if <Katex math={r`\Delta x`} /> were truly infinitesimal but don't quite vanish for finite values.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: Approximating <Katex math={r`\sqrt{4.1}`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`f(x) = \sqrt{x}, \quad f'(x) = \frac{1}{2\sqrt{x}}`} display /></div><span class="step-note">function and derivative</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sqrt{4.1} \approx \sqrt{4} + \frac{1}{2\sqrt{4}} \cdot 0.1`} display /></div><span class="step-note"><Katex math={r`x=4`} />, <Katex math={r`\Delta x = 0.1`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2 + 0.025 = 2.025`} display /></div><span class="step-note">actual: 2.02485... ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Error analysis: connecting to Taylor</h4>
			<p>How good is this approximation? The second-order expansion tells us. Using two infinitesimals both set to <Katex math={r`\Delta x / 2`} /> (heuristically), the error is roughly:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\text{Error} \approx \frac{1}{2} f''(x) \cdot (\Delta x)^2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>For our example: <Katex math={r`f''(x) = -\frac{1}{4x^{3/2}}`} />, so the error is approximately <Katex math={r`\frac{1}{2} \cdot (-\frac{1}{32}) \cdot 0.01 \approx -0.000156`} />. Our approximation of 2.025 should be too high by about 0.00016, and indeed <Katex math={r`2.025 - 2.02485 = 0.00015`} />.</p>
			<p>This pattern continues: the <Katex math="n" />-th order SDG expansion (using <Katex math="n" /> independent infinitesimals) gives the <Katex math="n" />-th Taylor polynomial. The error from truncating at order <Katex math="n" /> is proportional to <Katex math={r`(\Delta x)^{n+1}`} />. We'll formalize this in Chapter 6 when we study Taylor series.</p>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 8: NEWTON'S METHOD                             -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Newton's method</h3>
			<p>Here's a stunning application of the Kock-Lawvere axiom: an algorithm for solving equations.</p>
			<p>Suppose we want to find where <Katex math={r`f(x) = 0`} />, and we have a guess <Katex math={r`x_0`} /> that's close to the answer. The K-L axiom says: near <Katex math={r`x_0`} />, the curve <em>is</em> a straight line. So replace the curve with its microstraight tangent and find where <em>that</em> line crosses zero.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving Newton's Method from the K-L Axiom</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x_0 + d) = f(x_0) + f'(x_0) \cdot d`} display /></div><span class="step-note">K-L slope equation</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Set } f(x_0 + d) = 0: \quad f(x_0) + f'(x_0) \cdot d = 0`} display /></div><span class="step-note">want the zero of the tangent</span></div>
			<div class="step"><div class="step-math"><Katex math={r`d = -\frac{f(x_0)}{f'(x_0)}`} display /></div><span class="step-note">solve for the correction</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`x_1 = x_0 - \frac{f(x_0)}{f'(x_0)}`} display /></div><span class="step-note">Newton's iteration ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The idea: slide along the tangent line from <Katex math={r`x_0`} /> until you hit zero, and call that point <Katex math={r`x_1`} />. Now repeat from <Katex math={r`x_1`} />. Each step, the approximation gets dramatically better.</p>

			<h4>Example: Finding <Katex math={r`\sqrt{2}`} /> by solving <Katex math={r`x^2 - 2 = 0`} /></h4>
			<p>Let <Katex math={r`f(x) = x^2 - 2`} />, so <Katex math={r`f'(x) = 2x`} />. Start with <Katex math={r`x_0 = 2`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Newton's Method: Computing <Katex math={r`\sqrt{2}`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`x_0 = 2: \quad x_1 = 2 - \frac{4 - 2}{4} = 2 - 0.5 = 1.5`} display /></div><span class="step-note">first iteration</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x_1 = 1.5: \quad x_2 = 1.5 - \frac{2.25 - 2}{3} = 1.5 - 0.0833... \approx 1.4167`} display /></div><span class="step-note">second iteration</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x_2 \approx 1.4167: \quad x_3 = 1.4167 - \frac{0.0069...}{2.8334} \approx 1.41422`} display /></div><span class="step-note">third iteration</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\sqrt{2} = 1.41421356...\quad \checkmark`} display /></div><span class="step-note">three steps gave 5 correct digits!</span></div>
		</div>

		<div use:reveal>
			<JSXGraphBoard
				setup={setupNewtonMethod}
				boundingbox={[-0.2, 2.8, 2.8, -0.8]}
				aspectRatio={(2.8 - -0.2) / (2.8 - -0.8)}
				number="4.3"
				caption="Newton's method for x² − 2 = 0. Starting from x₀ = 2, each tangent line crosses zero closer to √2."
			/>
		</div>

		<SDGAdvantage title="Newton's Method as K-L in Action">
			<p>In standard calculus, Newton's method is motivated by tangent line approximation or Taylor series. In SDG, it's a <em>direct application</em> of the Kock-Lawvere axiom: near any point, the curve literally <em>is</em> a straight line. Finding where the curve crosses zero reduces to finding where a line crosses zero — the simplest equation in algebra. Newton's method isn't an "approximation technique" — it's the exact consequence of microstraightness applied iteratively.</p>
		</SDGAdvantage>

		<DigDeeper title="How fast does Newton's method converge?">
			<p>Newton's method has <strong>quadratic convergence</strong>: if <Katex math={r`x_n`} /> has error <Katex math={r`\epsilon`} />, then <Katex math={r`x_{n+1}`} /> has error roughly <Katex math={r`\epsilon^2`} />. This is why the digit count roughly doubles each step.</p>
			<p>To see why: the error in replacing the curve by its tangent comes from the <Katex math={r`d^2`} /> term that we set to zero. For a finite step <Katex math={r`\Delta x`} />, this error is proportional to <Katex math={r`(\Delta x)^2`} />. If the current error is <Katex math={r`\epsilon = x_n - x^*`} />, then the next error is proportional to <Katex math={r`\epsilon^2`} /> — the same mechanism as the linear approximation error, applied iteratively.</p>
			<p>Newton's method can fail if <Katex math={r`f'(x_n) = 0`} /> (tangent is horizontal — no intersection with the axis) or if the initial guess is too far from the root. In SDG terms: the microstraight approximation only works in the infinitesimal neighborhood, and "close enough" for finite steps depends on how curved the function is.</p>
		</DigDeeper>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 9: L'HÔPITAL'S RULE                            -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>L'Hôpital's rule</h3>
			<p>When <Katex math={r`f(a) = g(a) = 0`} />, the ratio <Katex math={r`f(x)/g(x)`} /> near <Katex math="a" /> takes the indeterminate form <Katex math={r`0/0`} />. SDG resolves this beautifully using <strong>microcancellation</strong>.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">L'Hôpital's Rule via Microcancellation</div>
			<div class="step"><div class="step-math"><Katex math={r`f(a+d) = f(a) + f'(a)\,d = 0 + f'(a)\,d = f'(a)\,d`} display /></div><span class="step-note">slope equation, <Katex math={r`f(a)=0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`g(a+d) = g(a) + g'(a)\,d = 0 + g'(a)\,d = g'(a)\,d`} display /></div><span class="step-note">slope equation, <Katex math={r`g(a)=0`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`f(a+d) = f'(a)\,d \quad \text{and} \quad g(a+d) = g'(a)\,d`} display /></div><span class="step-note">both proportional to <span class="d-highlight">d</span></span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{So: } \quad g'(a) \cdot f(a+d) = g'(a) \cdot f'(a) \cdot d = f'(a) \cdot g'(a) \cdot d = f'(a) \cdot g(a+d)`} display /></div><span class="step-note">cross-multiply</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`g'(a) \cdot f(a+d) = f'(a) \cdot g(a+d) \quad \Longrightarrow \quad \frac{f(a+d)}{g(a+d)} \doteq \frac{f'(a)}{g'(a)}`} display /></div><span class="step-note">microcancellation gives the ratio ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Let's be precise about the last step. We <em>cannot</em> simply "cancel <span class="d-highlight">d</span>" by dividing — you cannot divide by an infinitesimal. Instead, we use <strong>microcancellation</strong>: since <Katex math={r`f(a+d) = f'(a) \cdot d`} /> and <Katex math={r`g(a+d) = g'(a) \cdot d`} /> for all infinitesimal <Katex math="d" />, and these decompositions are unique by the K-L axiom, the functions <Katex math="f" /> and <Katex math="g" /> near <Katex math="a" /> have the same "shape" scaled by their derivatives. The ratio of the functions equals the ratio of the derivatives.</p>
			<p>More formally: <Katex math={r`g'(a) \cdot f(a+d) = f'(a) \cdot g(a+d)`} /> for all <Katex math="d" />. Both sides define functions on <Katex math="D" /> with the same constant term (both zero) and the same coefficient of <Katex math="d" /> (both <Katex math={r`f'(a) \cdot g'(a)`} />). By uniqueness of the K-L decomposition, the identity holds, giving us the ratio.</p>
		</div>

		<SDGAdvantage title="L'Hôpital Without Limits">
			<p>In standard calculus, L'Hôpital's rule requires a careful proof using the Cauchy Mean Value Theorem — a non-trivial result that students often take on faith. In SDG, the rule follows in four lines from the slope equation and microcancellation. We never "cancel <Katex math="d" />" by dividing; instead, the uniqueness of the K-L decomposition does the work. No limits, no MVT, no epsilon-delta.</p>
		</SDGAdvantage>

		<div class="neo-prose" use:reveal>
			<h4>Example: <Katex math={r`\frac{\sin x}{x}`} /> as <Katex math={r`x \to 0`} /></h4>
			<p>Since <Katex math={r`\sin(0) = 0`} /> and the denominator is <Katex math={r`g(x) = x`} /> with <Katex math={r`g(0) = 0`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Evaluating sin(x)/x near x = 0</div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{\sin(0 + d)}{0 + d} \doteq \frac{(\sin)'(0)}{1} = \frac{\cos(0)}{1} = 1`} display /></div><span class="step-note">by L'Hôpital / microcancellation ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example: <Katex math={r`\frac{e^x - 1}{x}`} /> as <Katex math={r`x \to 0`} /></h4>
			<p>Here <Katex math={r`f(x) = e^x - 1`} /> with <Katex math={r`f(0) = 0`} />, and <Katex math={r`g(x) = x`} /> with <Katex math={r`g(0) = 0`} />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Evaluating (eˣ − 1)/x near x = 0</div>
			<div class="step"><div class="step-math"><Katex math={r`f'(x) = e^x, \quad g'(x) = 1`} display /></div><span class="step-note">derivatives</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\frac{e^{0+d} - 1}{0 + d} \doteq \frac{e^0}{1} = 1`} display /></div><span class="step-note">by microcancellation ✓</span></div>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- SECTION 10: DIFFERENTIALS                               -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<div class="neo-prose" use:reveal>
			<h3>Differentials</h3>
			<p>In standard calculus, the notation <Katex math={r`dy = f'(x)\,dx`} /> is treated as a convenient fiction — a "shorthand" that doesn't literally mean what it says. Students are told "don't think of <Katex math={r`dx`} /> and <Katex math={r`dy`} /> as actual quantities."</p>
			<p>In SDG, it <em>does</em> mean what it says.</p>
		</div>

		<Callout type="key-idea" title="Differentials Are Real">
			<p>If <Katex math={r`y = f(x)`} />, then for any infinitesimal <Katex math={r`dx`} /> (with <Katex math={r`dx^2 = 0`} />), the equation</p>
			<Katex math={r`dy = f'(x) \cdot dx`} display />
			<p>is a <strong>literal equality</strong> between infinitesimal quantities, not an approximation. Here <Katex math={r`dy = f(x + dx) - f(x)`} /> is the actual infinitesimal change in <Katex math="y" />.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is just the slope equation <Katex math={r`f(x + d) = f(x) + f'(x) \cdot d`} /> rewritten: the change <Katex math={r`dy = f(x+d) - f(x) = f'(x) \cdot d`} />. There is no approximation involved.</p>
			<p>This is why Leibniz's notation works so well. The chain rule <Katex math={r`\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}`} /> appears to be "canceling" <Katex math={r`du`} /> — and in SDG, it essentially <em>is</em> (via microcancellation). The fraction <Katex math={r`dy/dx`} /> isn't a limit; it's a genuine ratio of infinitesimal quantities, where "ratio" is understood through the K-L uniqueness.</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, differentials are an awkward concept: <Katex math={r`dx`} /> is "an independent variable," <Katex math={r`dy`} /> is "a dependent variable," and neither is actually infinitesimal. Students rightfully find this confusing. In SDG, <Katex math={r`dx`} /> is an infinitesimal, <Katex math={r`dy`} /> is an infinitesimal, and <Katex math={r`dy = f'(x)\,dx`} /> is an exact equation. No hand-waving, no metaphors, no "think of it as..."</p>
		</SDGAdvantage>

		<div class="neo-prose" use:reveal>
			<p><strong>Example:</strong> If <Katex math={r`y = x^3`} />, then <Katex math={r`dy = 3x^2\,dx`} />. At <Katex math={r`x = 2`} /> with infinitesimal <Katex math={r`dx = d`} />:</p>
			<p><Katex math={r`dy = 12d`} /></p>
			<p>This tells us the output changes 12 times faster than the input near <Katex math={r`x = 2`} />. For a finite change <Katex math={r`\Delta x = 0.01`} />, the approximation <Katex math={r`\Delta y \approx 12 \times 0.01 = 0.12`} /> is excellent (actual: <Katex math={r`2.01^3 - 8 = 0.120601`} />).</p>
		</div>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- EXERCISES                                               -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises</summary>

			<!-- Warm-up -->
			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Find the intervals where <Katex math={r`f(x) = x^2 - 4x + 3`} /> is increasing and where it is decreasing.</p>
				{#snippet solution()}<p>The slope equation gives <Katex math={r`f'(x) = 2x - 4`} />. Setting <Katex math={r`f'(x) = 0`} />: <Katex math={r`x = 2`} />. For <Katex math={r`x < 2`} />, <Katex math={r`f'(x) < 0`} /> (decreasing). For <Katex math={r`x > 2`} />, <Katex math={r`f'(x) > 0`} /> (increasing).</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Find the inflection point of <Katex math={r`f(x) = x^3 - 6x^2 + 9x + 1`} />.</p>
				{#snippet solution()}<p><Katex math={r`f'(x) = 3x^2 - 12x + 9`} />, <Katex math={r`f''(x) = 6x - 12 = 0`} /> at <Katex math={r`x = 2`} />. Since <Katex math={r`f''`} /> changes sign (negative for <Katex math={r`x < 2`} />, positive for <Katex math={r`x > 2`} />), the inflection point is <Katex math={r`(2, f(2)) = (2, 3)`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Use the second derivative test to classify the stationary points of <Katex math={r`f(x) = x^3 - 12x`} />.</p>
				{#snippet solution()}<p><Katex math={r`f'(x) = 3x^2 - 12 = 3(x-2)(x+2) = 0`} /> at <Katex math={r`x = \pm 2`} />. <Katex math={r`f''(x) = 6x`} />. At <Katex math={r`x = -2`} />: <Katex math={r`f''(-2) = -12 < 0`} /> → local max. At <Katex math={r`x = 2`} />: <Katex math={r`f''(2) = 12 > 0`} /> → local min.</p>{/snippet}
			</Exercise>

			<!-- Core: Curve Sketching -->
			<Exercise number={4}>
				<p><strong>Core.</strong> Sketch <Katex math={r`f(x) = 2x^3 - 9x^2 + 12x`} />: find critical points, classify them, find inflection points, and determine intervals of increase/decrease.</p>
				{#snippet solution()}
					<p><Katex math={r`f'(x) = 6x^2 - 18x + 12 = 6(x-1)(x-2) = 0`} /> at <Katex math={r`x = 1, 2`} />.</p>
					<p><Katex math={r`f''(x) = 12x - 18`} />. At <Katex math={r`x = 1`} />: <Katex math={r`f''(1) = -6 < 0`} /> → local max at <Katex math={r`(1, 5)`} />. At <Katex math={r`x = 2`} />: <Katex math={r`f''(2) = 6 > 0`} /> → local min at <Katex math={r`(2, 4)`} />.</p>
					<p>Inflection: <Katex math={r`f''(x) = 0`} /> at <Katex math={r`x = 3/2`} />, point <Katex math={r`(3/2, 9/2)`} />. Increasing on <Katex math={r`(-\infty, 1) \cup (2, \infty)`} />, decreasing on <Katex math={r`(1, 2)`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p><strong>Core.</strong> Find and classify all critical points of <Katex math={r`g(x) = x^4 - 4x^3 + 4x^2`} />.</p>
				{#snippet solution()}
					<p><Katex math={r`g'(x) = 4x^3 - 12x^2 + 8x = 4x(x^2 - 3x + 2) = 4x(x-1)(x-2) = 0`} /> at <Katex math={r`x = 0, 1, 2`} />.</p>
					<p><Katex math={r`g''(x) = 12x^2 - 24x + 8`} />. At <Katex math={r`x = 0`} />: <Katex math={r`g''(0) = 8 > 0`} /> → local min. At <Katex math={r`x = 1`} />: <Katex math={r`g''(1) = -4 < 0`} /> → local max at <Katex math={r`(1, 1)`} />. At <Katex math={r`x = 2`} />: <Katex math={r`g''(2) = 8 > 0`} /> → local min at <Katex math={r`(2, 0)`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Sketch <Katex math={r`h(x) = xe^{-x}`} /> for <Katex math={r`x \geq 0`} />. Find the global maximum.</p>
				{#snippet solution()}
					<p><Katex math={r`h'(x) = e^{-x} - xe^{-x} = e^{-x}(1-x) = 0`} /> at <Katex math={r`x = 1`} /> (since <Katex math={r`e^{-x} > 0`} /> always).</p>
					<p><Katex math={r`h''(x) = -e^{-x}(2-x)`} />. At <Katex math={r`x=1`} />: <Katex math={r`h''(1) = -e^{-1} < 0`} /> → local max.</p>
					<p>Since <Katex math={r`h(0) = 0`} /> and <Katex math={r`h(x) \to 0`} /> as <Katex math={r`x \to \infty`} />, the local max at <Katex math={r`(1, 1/e)`} /> is the global max.</p>
				{/snippet}
			</Exercise>

			<!-- Core: Optimization -->
			<Exercise number={7}>
				<p><strong>Core.</strong> A cylindrical can must hold 500 mL of liquid. Find the radius and height that minimize the total surface area <Katex math={r`S = 2\pi r^2 + 2\pi r h`} />, subject to <Katex math={r`\pi r^2 h = 500`} />.</p>
				{#snippet solution()}
					<p>From the constraint: <Katex math={r`h = 500/(\pi r^2)`} />. Substituting:</p>
					<p><Katex math={r`S(r) = 2\pi r^2 + 2\pi r \cdot \frac{500}{\pi r^2} = 2\pi r^2 + \frac{1000}{r}`} display /></p>
					<p><Katex math={r`S'(r) = 4\pi r - \frac{1000}{r^2} = 0 \implies r^3 = \frac{1000}{4\pi} = \frac{250}{\pi}`} display /></p>
					<p>So <Katex math={r`r = (250/\pi)^{1/3} \approx 4.30`} /> cm. Then <Katex math={r`h = 500/(\pi r^2) = 2r \approx 8.60`} /> cm. The optimal can has <Katex math={r`h = 2r`} /> (height equals diameter).</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p><strong>Core.</strong> A firm sells <Katex math="q" /> units at price <Katex math={r`p = 100 - 2q`} />. Find the quantity that maximizes revenue <Katex math={r`R = p \cdot q`} />.</p>
				{#snippet solution()}
					<p><Katex math={r`R(q) = q(100 - 2q) = 100q - 2q^2`} /></p>
					<p><Katex math={r`R'(q) = 100 - 4q = 0 \implies q = 25`} /></p>
					<p><Katex math={r`R''(q) = -4 < 0`} />, confirming maximum. Maximum revenue: <Katex math={r`R(25) = 25 \times 50 = 1250`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> A farmer wants to fence a rectangular area against a straight river (no fence needed on the river side). With 200 m of fencing, what dimensions maximize the area?</p>
				{#snippet solution()}
					<p>Let <Katex math="x" /> be the side perpendicular to the river (two of these), and <Katex math="y" /> be the side parallel (one of these). Constraint: <Katex math={r`2x + y = 200`} />, so <Katex math={r`y = 200 - 2x`} />.</p>
					<p><Katex math={r`A(x) = x(200 - 2x) = 200x - 2x^2`} /></p>
					<p><Katex math={r`A'(x) = 200 - 4x = 0 \implies x = 50`} />, <Katex math={r`y = 100`} /></p>
					<p><Katex math={r`A''(x) = -4 < 0`} /> → max. Area = <Katex math={r`50 \times 100 = 5000`} /> m².</p>
				{/snippet}
			</Exercise>

			<!-- Core: Linear Approximation -->
			<Exercise number={10}>
				<p><strong>Core.</strong> Approximate <Katex math={r`\sqrt[3]{8.1}`} /> using the slope equation.</p>
				{#snippet solution()}
					<p><Katex math={r`f(x) = x^{1/3}`} />, <Katex math={r`f'(x) = \frac{1}{3} x^{-2/3}`} />.</p>
					<p>At <Katex math={r`x = 8`} />: <Katex math={r`f(8) = 2`} />, <Katex math={r`f'(8) = \frac{1}{3 \cdot 4} = \frac{1}{12}`} />.</p>
					<p><Katex math={r`\sqrt[3]{8.1} \approx 2 + \frac{1}{12}(0.1) = 2 + 0.00833... \approx 2.0083`} /></p>
					<p>Actual: 2.00832..., so the approximation is excellent.</p>
				{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p><strong>Core.</strong> Approximate <Katex math={r`\sin(0.1)`} /> using linear approximation. Then estimate the error using the second-derivative term.</p>
				{#snippet solution()}
					<p><Katex math={r`f(x) = \sin x`} />, <Katex math={r`f'(x) = \cos x`} />, <Katex math={r`f''(x) = -\sin x`} />.</p>
					<p>At <Katex math={r`x = 0`} />: <Katex math={r`\sin(0.1) \approx \sin(0) + \cos(0) \cdot 0.1 = 0 + 0.1 = 0.1`} /></p>
					<p>Error estimate: <Katex math={r`\frac{1}{2}|f''(0)| \cdot (0.1)^2 = \frac{1}{2} \cdot 0 \cdot 0.01 = 0`} />. The second derivative vanishes at 0, so the error is controlled by the <em>third</em> derivative: <Katex math={r`\frac{1}{6}|\cos(0)| \cdot (0.1)^3 \approx 0.000167`} />. Actual: <Katex math={r`\sin(0.1) = 0.0998..`} />, error ≈ 0.000167. ✓</p>
				{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Core.</strong> Use the differential formula to estimate the change in the volume of a sphere <Katex math={r`V = \frac{4}{3}\pi r^3`} /> when the radius increases from 5 to 5.02.</p>
				{#snippet solution()}
					<p><Katex math={r`dV = 4\pi r^2\,dr`} />. With <Katex math={r`r = 5`} />, <Katex math={r`dr = 0.02`} />:</p>
					<p><Katex math={r`dV = 4\pi(25)(0.02) = 2\pi \approx 6.28`} /></p>
					<p>Actual change: <Katex math={r`\frac{4}{3}\pi(5.02^3 - 5^3) = \frac{4}{3}\pi(126.506 - 125) \approx 6.30`} />. Excellent agreement.</p>
				{/snippet}
			</Exercise>

			<!-- Core: Newton's Method -->
			<Exercise number={13}>
				<p><strong>Core.</strong> Use two steps of Newton's method to approximate <Katex math={r`\sqrt{5}`} /> (solve <Katex math={r`x^2 - 5 = 0`} /> starting from <Katex math={r`x_0 = 2`} />).</p>
				{#snippet solution()}
					<p><Katex math={r`f(x) = x^2 - 5`} />, <Katex math={r`f'(x) = 2x`} />.</p>
					<p><Katex math={r`x_1 = 2 - \frac{4-5}{4} = 2 + \frac{1}{4} = 2.25`} /></p>
					<p><Katex math={r`x_2 = 2.25 - \frac{5.0625 - 5}{4.5} = 2.25 - \frac{0.0625}{4.5} \approx 2.2361`} /></p>
					<p>Actual <Katex math={r`\sqrt{5} = 2.23607..`} /> Two steps give 4 correct digits.</p>
				{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p><strong>Core.</strong> Use Newton's method with <Katex math={r`x_0 = 1`} /> to perform one step on <Katex math={r`f(x) = x^3 - 2x - 5`} />. Then explain the result geometrically using the K-L axiom.</p>
				{#snippet solution()}
					<p><Katex math={r`f(1) = 1 - 2 - 5 = -6`} />, <Katex math={r`f'(1) = 3 - 2 = 1`} />.</p>
					<p><Katex math={r`x_1 = 1 - \frac{-6}{1} = 1 + 6 = 7`} /></p>
					<p>This is a terrible step — we jumped far from the root (which is near <Katex math={r`x \approx 2.09`} />). Geometrically: the tangent at <Katex math={r`x = 1`} /> is nearly horizontal (slope 1) while the curve is steeply below zero. The microstraight tangent intersects the axis far away. This illustrates that Newton's method requires a good starting guess — the K-L axiom gives a straight-line replacement that's only faithful in the <em>infinitesimal</em> neighborhood.</p>
				{/snippet}
			</Exercise>

			<!-- Core: L'Hôpital -->
			<Exercise number={15}>
				<p><strong>Core.</strong> Use the SDG form of L'Hôpital's rule (microcancellation) to evaluate <Katex math={r`\lim_{x \to 0} \frac{e^x - 1}{x}`} />.</p>
				{#snippet solution()}
					<p>With <Katex math={r`f(x) = e^x - 1`} /> and <Katex math={r`g(x) = x`} />: <Katex math={r`f(0) = 0`} />, <Katex math={r`g(0) = 0`} />.</p>
					<p><Katex math={r`f(d) = e^d - 1 = (1+d) - 1 = d = f'(0) \cdot d`} /></p>
					<p><Katex math={r`g(d) = d = g'(0) \cdot d`} /></p>
					<p>By microcancellation: the ratio is <Katex math={r`f'(0)/g'(0) = e^0 / 1 = 1`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={16}>
				<p><strong>Core.</strong> Use microcancellation to evaluate <Katex math={r`\lim_{x \to 0} \frac{1 - \cos x}{x^2}`} />. (Hint: this is a <Katex math={r`0/0`} /> form. Apply L'Hôpital twice, or use the second-order expansion.)</p>
				{#snippet solution()}
					<p>Using the second-order expansion with two infinitesimals <Katex math={r`d_1, d_2`} /> (each squaring to 0, with <Katex math={r`d = d_1 + d_2`} />):</p>
					<p><Katex math={r`\cos(d_1 + d_2) = 1 - d_1 d_2`} /> (from the Taylor expansion, since <Katex math={r`\cos'(0) = 0`} />, <Katex math={r`\cos''(0) = -1`} />).</p>
					<p>So <Katex math={r`1 - \cos(d_1+d_2) = d_1 d_2`} />, and <Katex math={r`(d_1+d_2)^2 = 2d_1 d_2`} />.</p>
					<p>The ratio is <Katex math={r`d_1 d_2 / (2 d_1 d_2) = 1/2`} />.</p>
					<p>Alternatively, applying L'Hôpital twice: <Katex math={r`\frac{\sin x}{2x} \to \frac{\cos 0}{2} = 1/2`} />.</p>
				{/snippet}
			</Exercise>

			<!-- Challenge -->
			<Exercise number={17}>
				<p><strong>Challenge.</strong> Show that the second derivative test is inconclusive for <Katex math={r`f(x) = x^4`} /> at <Katex math={r`x = 0`} />, even though <Katex math={r`x = 0`} /> is a minimum. Then use the first derivative test to classify it correctly.</p>
				{#snippet solution()}
					<p><Katex math={r`f'(x) = 4x^3 = 0`} /> at <Katex math={r`x = 0`} />. <Katex math={r`f''(x) = 12x^2`} />, so <Katex math={r`f''(0) = 0`} /> — inconclusive.</p>
					<p>First derivative test: <Katex math={r`f'(x) = 4x^3`} /> is negative for <Katex math={r`x < 0`} /> and positive for <Katex math={r`x > 0`} />. The derivative changes from negative to positive, so <Katex math={r`x = 0`} /> is a local minimum. ✓</p>
					<p>The SDG perspective: the second-order expansion gives <Katex math={r`f(d_1 + d_2) = (d_1+d_2)^4 = 0`} /> (all powers <Katex math={r`\geq 2`} /> vanish), so the second-order behavior reveals nothing. We'd need a fourth-order expansion (four independent infinitesimals) to see the minimum.</p>
				{/snippet}
			</Exercise>

			<Exercise number={18}>
				<p><strong>Challenge.</strong> Find the absolute maximum and minimum of <Katex math={r`f(x) = x^3 - 6x^2 + 9x + 2`} /> on the closed interval <Katex math={r`[0, 4]`} />.</p>
				{#snippet solution()}
					<p><Katex math={r`f'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3) = 0`} /> at <Katex math={r`x = 1, 3`} />.</p>
					<p>Evaluate at critical points and endpoints:</p>
					<p><Katex math={r`f(0) = 2, \quad f(1) = 1 - 6 + 9 + 2 = 6, \quad f(3) = 27 - 54 + 27 + 2 = 2, \quad f(4) = 64 - 96 + 36 + 2 = 6`} /></p>
					<p>Absolute max: 6 (at <Katex math={r`x = 1`} /> and <Katex math={r`x = 4`} />). Absolute min: 2 (at <Katex math={r`x = 0`} /> and <Katex math={r`x = 3`} />).</p>
				{/snippet}
			</Exercise>

			<!-- Exploration -->
			<Exercise number={19}>
				<p><strong>Exploration.</strong> Use the SDG second-order expansion to prove that a smooth function with <Katex math={r`f'(a) = 0`} /> and <Katex math={r`f''(a) > 0`} /> satisfies <Katex math={r`f(x) \geq f(a)`} /> for <Katex math="x" /> in the infinitesimal neighborhood of <Katex math="a" />. Where does this argument fail for the finite neighborhood?</p>
				{#snippet solution()}
					<p>From the second-order expansion at a stationary point: <Katex math={r`f(a + d_1 + d_2) = f(a) + f''(a)\,d_1 d_2`} />.</p>
					<p>If <Katex math={r`d_1 = d_2 = d`} /> (same infinitesimal), then <Katex math={r`d_1 d_2 = d^2 = 0`} />, so the expansion gives no information. We need <em>independent</em> infinitesimals where <Katex math={r`d_1 d_2 \neq 0`} />. With independent <Katex math={r`d_1, d_2`} />, the product <Katex math={r`d_1 d_2`} /> is a "second-order infinitesimal" that carries sign information.</p>
					<p>For finite <Katex math={r`\Delta x`} />, the argument only gives <Katex math={r`f(a + \Delta x) \geq f(a)`} /> up to higher-order terms. The <Katex math={r`(\Delta x)^3`} /> and higher corrections could overwhelm the <Katex math={r`(\Delta x)^2`} /> term if <Katex math={r`\Delta x`} /> is large enough.</p>
				{/snippet}
			</Exercise>

			<Exercise number={20}>
				<p><strong>Exploration.</strong> Newton's method for <Katex math={r`f(x) = x^3 - x`} /> starting from <Katex math={r`x_0 = 1/\sqrt{3}`} /> (a critical point of <Katex math="f" />) fails. Explain why in terms of the K-L axiom, and describe what happens geometrically.</p>
				{#snippet solution()}
					<p>At <Katex math={r`x_0 = 1/\sqrt{3}`} />: <Katex math={r`f'(x_0) = 3(1/3) - 1 = 0`} />. Newton's formula <Katex math={r`x_1 = x_0 - f(x_0)/f'(x_0)`} /> involves division by zero.</p>
					<p>Geometrically, the tangent line at this point is horizontal — it never crosses the x-axis. The K-L axiom replaces the curve with a microstraight segment, but this segment is flat, so it has no root. Newton's method assumes the tangent is not horizontal. In the infinitesimal neighborhood at a critical point, the function looks like a constant, not a line with a root to find.</p>
				{/snippet}
			</Exercise>
		</details>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- CHAPTER SUMMARY                                        -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<ChapterSummary>
			<ul>
				<li><strong>Increasing/decreasing:</strong> <Katex math={r`f'(x) > 0`} /> means increasing, <Katex math={r`f'(x) < 0`} /> means decreasing — read directly from the slope equation.</li>
				<li><strong>Concavity:</strong> <Katex math={r`f''(x) > 0`} /> means concave up (bowl), <Katex math={r`f''(x) < 0`} /> means concave down (hill). Inflection points occur where concavity changes.</li>
				<li><strong>Stationary points:</strong> Where <Katex math={r`f'(a) = 0`} /> — the infinitesimal neighborhood is flat.</li>
				<li><strong>Second derivative test:</strong> At a stationary point, <Katex math={r`f(a + d_1 + d_2) = f(a) + f''(a)\,d_1 d_2`} />. Sign of <Katex math={r`f''(a)`} /> determines max vs. min.</li>
				<li><strong>Optimization:</strong> Model → differentiate → set to zero → classify → interpret.</li>
				<li><strong>Closed-interval method:</strong> Compare critical-point values and endpoint values for absolute extrema.</li>
				<li><strong>Linear approximation:</strong> <Katex math={r`f(x + \Delta x) \approx f(x) + f'(x)\,\Delta x`} />, with error proportional to <Katex math={r`(\Delta x)^2`} />.</li>
				<li><strong>Newton's method:</strong> <Katex math={r`x_{n+1} = x_n - f(x_n)/f'(x_n)`} /> — replace the curve by its microstraight tangent and find its zero.</li>
				<li><strong>L'Hôpital's rule:</strong> When <Katex math={r`f(a) = g(a) = 0`} />, the ratio equals <Katex math={r`f'(a)/g'(a)`} /> by microcancellation — no dividing by <Katex math="d" />.</li>
				<li><strong>Differentials:</strong> <Katex math={r`dy = f'(x)\,dx`} /> is a literal equation between infinitesimals, not a shorthand.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══════════════════════════════════════════════════════ -->
		<!-- LOOKING AHEAD                                          -->
		<!-- ═══════════════════════════════════════════════════════ -->
		<LookingAhead>
			<p>We've used the derivative to analyze functions — finding peaks, valleys, and shapes. In the next chapter, we reverse direction: given a rate of change, can we reconstruct the total quantity? This is <strong>integration</strong>, and the relationship between derivatives and integrals — the <strong>Fundamental Theorem of Calculus</strong> — is one of the most beautiful results in all of mathematics. In SDG, it will emerge naturally from summing infinitesimal changes.</p>
		</LookingAhead>

		<NextChapter href="ch5" title="The World of Areas" number="5" />
	</div>
</section>
