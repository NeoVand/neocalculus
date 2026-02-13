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
			subtitle: 'Infinitesimal model and microstraightness'
		},
		{
			id: 'ch2',
			number: '2',
			title: 'The Slope Equation',
			subtitle: 'Derivatives as coefficient extraction'
		},
		{
			id: 'ch3',
			number: '3',
			title: 'Rules of Change and Local Models',
			subtitle: 'Product, chain, quotient, and linearization'
		},
		{
			id: 'ch4',
			number: '4',
			title: 'Optimization and Local Analysis',
			subtitle: 'Critical points, extrema, and Newton updates'
		},
		{
			id: 'ch5',
			number: '5',
			title: 'Accumulation and the Fundamental Theorem',
			subtitle: 'Area accumulation and antiderivatives'
		},
		{
			id: 'ch6',
			number: '6',
			title: 'Integration Geometry and Techniques',
			subtitle: 'Methods and geometric applications'
		},
		{
			id: 'ch8',
			number: '7',
			title: 'Differential Equations and Physics Modeling',
			subtitle: 'Dynamics from local laws'
		},
		{
			id: 'ch7',
			number: '8',
			title: 'Series and Approximation',
			subtitle: 'Taylor bridges and convergence'
		},
		{
			id: 'ch9',
			number: '9',
			title: 'Multivariable and Vector Calculus',
			subtitle: 'Partials, gradients, Jacobians, and fields'
		},
		{
			id: 'ch10',
			number: '10',
			title: 'Differential Forms and Unification',
			subtitle: 'Exterior derivative and Stokes unification'
		}
	] as const;
</script>

<!-- ═══ HERO ═══ -->
<section class="hero">
	<div class="hero-shell">
		<div class="hero-inner">
			<h1 class="hero-title">Neocalculus</h1>
			<p class="hero-author">By Mostafa 'Neo' Mohsenvand</p>
			<p class="hero-subtitle">
				Where smooth curves become infinitesimally linear,<br />and calculus becomes first-order
				algebra.
			</p>
			<p class="hero-motivation">
				Most courses start with limits. This one starts with an infinitesimal model where
				<Katex math="d^2=0" /> and smoothness turns local change into first-order algebra. Core
				calculus results are built by coefficient extraction, with assumptions stated only when they
				matter.
			</p>
		</div>
		<div class="hero-toc">
			<ChapterNav {chapters} />
		</div>
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
		chapterNumber="4"
		title="Optimization and Local Analysis"
		preview="Critical points, extrema, curve behavior, and Newton's method from derivative structure."
		load={() => import('$lib/chapters/Ch04Optimization.svelte')}
	/>
	<LazyChapter
		id="ch5"
		chapterNumber="5"
		title="Accumulation and the Fundamental Theorem"
		preview="Accumulation, antiderivatives, and the FTC through infinitesimal strips and cancellation."
		load={() => import('$lib/chapters/Ch05WorldOfAreas.svelte')}
	/>
	<LazyChapter
		id="ch6"
		chapterNumber="6"
		title="Integration Geometry and Techniques"
		preview="Arc length, area and volume methods, and integration techniques in geometric form."
		load={() => import('$lib/chapters/Ch06ApplicationsIntegration.svelte')}
	/>
	<LazyChapter
		id="ch8"
		chapterNumber="7"
		title="Differential Equations and Physics Modeling"
		preview="Local laws, separable equations, and physical modeling through differential equations."
		load={() => import('$lib/chapters/Ch08Physics.svelte')}
	/>
	<LazyChapter
		id="ch7"
		chapterNumber="8"
		title="Series and Approximation"
		preview="Taylor expansions, convergence, and bridge points between nilpotent and classical series."
		load={() => import('$lib/chapters/Ch07InfiniteSeries.svelte')}
	/>
	<LazyChapter
		id="ch9"
		chapterNumber="9"
		title="Multivariable and Vector Calculus"
		preview="Partials, gradient, Jacobian, and vector-field integrals in multiple dimensions."
		load={() => import('$lib/chapters/Ch09ManyDimensions.svelte')}
	/>
	<LazyChapter
		id="ch10"
		chapterNumber="10"
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
		display: grid;
		place-items: center;
		padding: clamp(1.2rem, 2.8vw, 2.3rem);
		position: relative;
		overflow: hidden;
		background:
			radial-gradient(126% 96% at 8% 12%, rgba(26, 60, 112, 0.12) 0%, transparent 56%),
			radial-gradient(118% 92% at 95% 14%, rgba(163, 116, 74, 0.07) 0%, transparent 64%),
			linear-gradient(
				180deg,
				#f5f2f8 0%,
				#f8f7fb 44%,
				#f4f7fb 74%,
				#f8f8f9 90%,
				var(--color-paper) 100%
			);
	}

	.hero::before,
	.hero::after {
		content: '';
		position: absolute;
		pointer-events: none;
		z-index: 0;
	}

	.hero::before {
		width: min(42rem, 72vw);
		aspect-ratio: 1;
		left: -10rem;
		top: -18rem;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(73, 117, 204, 0.2) 0%, rgba(73, 117, 204, 0) 70%);
		filter: blur(6px);
	}

	.hero::after {
		left: 0;
		right: 0;
		bottom: -1px;
		height: clamp(5rem, 14vh, 8rem);
		background: linear-gradient(
			180deg,
			rgba(253, 251, 247, 0) 0%,
			rgba(253, 251, 247, 0.48) 45%,
			rgba(253, 251, 247, 0.84) 78%,
			var(--color-paper) 100%
		);
	}

	.hero-shell {
		width: min(78rem, 100%);
		display: grid;
		gap: clamp(1.1rem, 2.2vw, 2rem);
		align-items: center;
	}

	@media (min-width: 1120px) {
		.hero-shell {
			grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
			gap: clamp(1rem, 2vw, 1.8rem);
		}
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		animation: float-down 1s var(--ease-out-expo);
		text-align: left;
		max-width: 38rem;
		margin-inline: 0;
	}

	.hero-title {
		font-family: var(--font-serif);
		font-size: clamp(3rem, 6.9vw, 5.15rem);
		font-weight: 320;
		letter-spacing: 0.15em;
		color: var(--color-ink);
		margin: 0 0 0.62rem;
		text-transform: uppercase;
		line-height: 0.95;
	}

	.hero-author {
		margin: 0 0 0.88rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in srgb, var(--color-ink-light) 78%, var(--color-d) 22%);
	}

	.hero-subtitle {
		font-family: var(--font-serif);
		font-size: clamp(1.01rem, 2.05vw, 1.28rem);
		color: var(--color-ink-light);
		line-height: 1.52;
		margin: 0 0 0.92rem;
	}

	.hero-motivation {
		font-family: var(--font-serif);
		font-size: clamp(0.86rem, 1.5vw, 0.98rem);
		color: var(--color-ink-faint);
		line-height: 1.6;
		max-width: 36rem;
		margin: 0;
	}

	.hero-toc {
		position: relative;
		z-index: 1;
		display: grid;
		align-items: center;
		justify-items: end;
	}

	.hero-toc :global(.toc-card) {
		margin-top: 0;
		width: min(31rem, 100%);
		margin-inline: auto;
	}

	@media (max-width: 1119px) {
		.hero {
			padding-top: 1.2rem;
			padding-bottom: 1.1rem;
		}

		.hero-inner {
			text-align: center;
			max-width: 42rem;
			margin-inline: auto;
		}

		.hero-subtitle br {
			display: none;
		}

		.hero-motivation {
			margin-left: auto;
			margin-right: auto;
		}
	}

	/* ── Closing ── */
	.closing {
		padding: var(--space-xl) 0 var(--space-2xl);
		border-top: 1px solid var(--color-border-light);
	}
</style>
