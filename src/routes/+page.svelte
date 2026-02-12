<script lang="ts">
	import Ch01 from '$lib/chapters/Ch01SmoothWorld.svelte';
	import ChapterNav from '$lib/components/ChapterNav.svelte';
	import LazyChapter from '$lib/components/LazyChapter.svelte';
	import Katex from '$lib/components/Katex.svelte';
	import WormholeReturn from '$lib/components/WormholeReturn.svelte';
	import { reveal } from '$lib/utils/scroll';

	const chapters = [
		{
			id: 'ch1',
			number: '1',
			title: 'The Smooth World',
			subtitle: 'Infinitesimal model and microstraightness',
			kind: 'core'
		},
		{
			id: 'ch2',
			number: '2',
			title: 'The Slope Equation',
			subtitle: 'Derivatives as coefficient extraction',
			kind: 'core'
		},
		{
			id: 'ch3',
			number: '3',
			title: 'Rules of Change and Local Models',
			subtitle: 'Product, chain, quotient, and linearization',
			kind: 'core'
		},
		{
			id: 'ch4',
			number: '3E',
			title: 'Optimization Extension',
			subtitle: 'Critical points and Newton updates',
			kind: 'extension'
		},
		{
			id: 'ch5',
			number: '4',
			title: 'Accumulation and the Fundamental Theorem',
			subtitle: 'Area accumulation and antiderivatives',
			kind: 'core'
		},
		{
			id: 'ch6',
			number: '5',
			title: 'Integration Geometry and Techniques',
			subtitle: 'Methods and geometric applications',
			kind: 'core'
		},
		{
			id: 'ch8',
			number: '6',
			title: 'Differential Equations and Physics Modeling',
			subtitle: 'Dynamics from local laws',
			kind: 'core'
		},
		{
			id: 'ch7',
			number: '7',
			title: 'Series and Approximation',
			subtitle: 'Taylor bridges and convergence',
			kind: 'core'
		},
		{
			id: 'ch9',
			number: '8',
			title: 'Multivariable and Vector Calculus',
			subtitle: 'Partials, gradients, Jacobians, and fields',
			kind: 'core'
		},
		{
			id: 'ch10',
			number: '9',
			title: 'Differential Forms and Unification',
			subtitle: 'Exterior derivative and Stokes unification',
			kind: 'core'
		}
	] as const;
</script>

<!-- ═══ HERO ═══ -->
<section class="hero">
	<div class="hero-inner">
		<h1 class="hero-title">Neocalculus</h1>
		<p class="hero-subtitle">
			Where smooth curves become infinitesimally linear,<br />and calculus becomes first-order
			algebra.
		</p>
		<p class="hero-motivation">
			Calculus is often introduced through limits. This book starts from a different,
			infinitesimal-first model of smooth change. In that model we adopt the axiom that
			infinitesimal quantities satisfy <Katex math="d^2=0" />, and we build core first-course
			calculus results through algebraic coefficient extraction. Where extra assumptions matter, we
			call them out explicitly.
		</p>
	</div>
	<ChapterNav mode="full" {chapters} />
	<div class="scroll-hint" aria-hidden="true">
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg
		>
	</div>
</section>

<!-- ═══ CHAPTER NAVIGATION ═══ -->
<ChapterNav mode="floating" {chapters} />
<WormholeReturn />

<!-- ═══ CHAPTERS ═══ -->
<div class="page-wrapper">
	<Ch01 />
	<LazyChapter
		id="ch2"
		chapterNumber="2"
		title="The Slope Equation"
		preview="Derivatives as first-order coefficients, including trig, exponential, and logarithmic families."
		load={() => import('$lib/chapters/Ch02SlopeEquation.svelte')}
	/>
	<LazyChapter
		id="ch3"
		chapterNumber="3"
		title="Rules of Change and Local Models"
		preview="Product, chain, quotient, implicit differentiation, and local linear models from one algebraic workflow."
		load={() => import('$lib/chapters/Ch03RulesOfChange.svelte')}
	/>
	<LazyChapter
		id="ch4"
		chapterNumber="3 Extension"
		title="Optimization Extension"
		preview="Critical points, extrema, and Newton's method as a compact extension module."
		load={() => import('$lib/chapters/Ch04Optimization.svelte')}
	/>
	<LazyChapter
		id="ch5"
		chapterNumber="4"
		title="Accumulation and the Fundamental Theorem"
		preview="Accumulation, antiderivatives, and the FTC through infinitesimal strips and cancellation."
		load={() => import('$lib/chapters/Ch05WorldOfAreas.svelte')}
	/>
	<LazyChapter
		id="ch6"
		chapterNumber="5"
		title="Integration Geometry and Techniques"
		preview="Arc length, area and volume methods, and integration techniques in geometric form."
		load={() => import('$lib/chapters/Ch06ApplicationsIntegration.svelte')}
	/>
	<LazyChapter
		id="ch8"
		chapterNumber="6"
		title="Differential Equations and Physics Modeling"
		preview="Local laws, separable equations, and physical modeling through differential equations."
		load={() => import('$lib/chapters/Ch08Physics.svelte')}
	/>
	<LazyChapter
		id="ch7"
		chapterNumber="7"
		title="Series and Approximation"
		preview="Taylor expansions, convergence, and bridge points between nilpotent and classical series."
		load={() => import('$lib/chapters/Ch07InfiniteSeries.svelte')}
	/>
	<LazyChapter
		id="ch9"
		chapterNumber="8"
		title="Multivariable and Vector Calculus"
		preview="Partials, gradient, Jacobian, and vector-field integrals in multiple dimensions."
		load={() => import('$lib/chapters/Ch09ManyDimensions.svelte')}
	/>
	<LazyChapter
		id="ch10"
		chapterNumber="9"
		title="Differential Forms and Unification"
		preview="Exterior derivative, Stokes-style unification, and topological scope notes."
		load={() => import('$lib/chapters/Ch10LanguageOfForms.svelte')}
	/>
</div>

<!-- ═══ CLOSING ═══ -->
<section class="closing">
	<div class="content-width" use:reveal>
		<hr class="chapter-divider" style="margin: 0 auto var(--space-lg)" />
		<div class="neo-prose" style="text-align: center;">
			<p style="font-size: 1.3rem; font-weight: 500;">
				One central axiom: <Katex math="d^2 = 0" />.
			</p>
			<p style="color: var(--color-ink-light);">
				From this rule, together with smoothness assumptions, we derived the main derivative
				families used in this course, proved the product/chain/quotient rules, established the
				Fundamental Theorem of Calculus, and developed integration, series, multivariable methods,
				and differential-forms unification.
			</p>
			<p style="color: var(--color-ink-light);">
				The mainline presentation is algebraic and infinitesimal-first, with optional bridges to
				limit-based analysis where those comparisons are useful.
			</p>
			<p style="font-style: italic; color: var(--color-d); margin-top: var(--space-lg);">
				Neocalculus — calculus, reimagined from first principles.
			</p>
		</div>
	</div>
</section>

<style>
	/* ── Hero ── */
	.hero {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--space-lg);
		position: relative;
		background: radial-gradient(ellipse at 50% 30%, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
	}

	.hero-inner {
		animation: float-down 1s var(--ease-out-expo);
	}

	.hero-title {
		font-family: var(--font-serif);
		font-size: clamp(2.8rem, 7vw, 5rem);
		font-weight: 300;
		letter-spacing: 0.12em;
		color: var(--color-ink);
		margin-bottom: 0.8rem;
		text-transform: uppercase;
	}

	.hero-subtitle {
		font-family: var(--font-serif);
		font-size: clamp(1.05rem, 2.2vw, 1.35rem);
		color: var(--color-ink-light);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.hero-motivation {
		font-family: var(--font-serif);
		font-size: clamp(0.9rem, 1.8vw, 1.05rem);
		color: var(--color-ink-faint);
		line-height: 1.7;
		max-width: 38rem;
		margin-top: 1.2rem;
	}

	/* ── Scroll Hint ── */
	.scroll-hint {
		position: absolute;
		bottom: 2rem;
		color: var(--color-ink-faint);
		animation: scroll-hint 2.5s ease-in-out infinite;
	}

	/* ── Closing ── */
	.closing {
		padding: var(--space-xl) 0 var(--space-2xl);
		border-top: 1px solid var(--color-border-light);
	}
</style>
