<script lang="ts">
	import { onMount } from 'svelte';
	import Ch01 from '$lib/chapters/Ch01SmoothWorld.svelte';
	import ChapterNav from '$lib/components/ChapterNav.svelte';
	import HeroCurves from '$lib/components/HeroCurves.svelte';
	import LazyChapter from '$lib/components/LazyChapter.svelte';
	import Katex from '$lib/components/Katex.svelte';
	import WormholeReturn from '$lib/components/WormholeReturn.svelte';
	import {
		CHAPTER_NAVIGATE_EVENT,
		type ChapterNavigateDetail
	} from '$lib/utils/chapter-navigation';
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
			subtitle: 'Rates, signed accumulation, and antiderivatives'
		},
		{
			id: 'ch6',
			number: '6',
			title: 'Integration Geometry and Techniques',
			subtitle: 'Substitution, parts, slices, and physical totals'
		},
		{
			id: 'ch7',
			number: '7',
			title: 'Differential Equations and Physics Modeling',
			subtitle: 'Local laws, initial conditions, and evolving systems'
		},
		{
			id: 'ch8',
			number: '8',
			title: 'Series and Approximation',
			subtitle: 'Taylor polynomials, error, and convergence'
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
			title: 'Complex Analysis: Calculus in the Plane',
			subtitle: 'Complex functions, derivatives, and contour integrals'
		},
		{
			id: 'ch11',
			number: '11',
			title: 'Differential Forms and Unification',
			subtitle: 'Exterior derivative and Stokes unification'
		}
	] as const;

	onMount(() => {
		let frameId = 0;
		let alignmentActive = false;

		const stopAlignment = () => {
			alignmentActive = false;
			cancelAnimationFrame(frameId);
		};

		const targetScrollTop = (target: HTMLElement) => {
			const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
			return target.getBoundingClientRect().top + window.scrollY - scrollMargin;
		};

		const jumpImmediately = (top: number) => {
			const root = document.documentElement;
			const previousScrollBehavior = root.style.scrollBehavior;
			root.style.scrollBehavior = 'auto';
			window.scrollTo({ top, left: window.scrollX, behavior: 'auto' });
			root.style.scrollBehavior = previousScrollBehavior;
		};

		const alignTarget = (targetId: string, duration = 2600) => {
			stopAlignment();
			if (!targetId) return;

			alignmentActive = true;
			const started = performance.now();
			let lastDesired: number | null = null;

			const align = () => {
				if (!alignmentActive) return;
				const target = document.getElementById(targetId);
				if (target) {
					const desired = targetScrollTop(target);
					const layoutShifted = lastDesired === null || Math.abs(desired - lastDesired) > 2;

					// If layout is stable but the viewport moved, the reader deliberately scrolled.
					if (!layoutShifted && Math.abs(window.scrollY - desired) > 2) {
						stopAlignment();
						return;
					}

					if (Math.abs(window.scrollY - desired) > 2) jumpImmediately(desired);
					lastDesired = desired;
				}

				if (performance.now() - started < duration) {
					frameId = requestAnimationFrame(align);
				} else {
					alignmentActive = false;
				}
			};

			align();
		};

		const alignHashTarget = () => {
			const targetId = decodeURIComponent(window.location.hash.slice(1));
			alignTarget(targetId);
		};

		const handleChapterNavigate = (event: Event) => {
			const { id } = (event as CustomEvent<ChapterNavigateDetail>).detail;
			alignTarget(id);
		};

		alignHashTarget();
		window.addEventListener('hashchange', alignHashTarget);
		window.addEventListener(CHAPTER_NAVIGATE_EVENT, handleChapterNavigate);
		window.addEventListener('wheel', stopAlignment, { passive: true });
		window.addEventListener('touchmove', stopAlignment, { passive: true });

		return () => {
			stopAlignment();
			window.removeEventListener('hashchange', alignHashTarget);
			window.removeEventListener(CHAPTER_NAVIGATE_EVENT, handleChapterNavigate);
			window.removeEventListener('wheel', stopAlignment);
			window.removeEventListener('touchmove', stopAlignment);
		};
	});
</script>

<!-- ═══ HERO ═══ -->
<section class="hero">
	<HeroCurves />
	<div class="hero-shell">
		<div class="hero-inner">
			<h1 class="hero-title">Neocalculus</h1>
			<p class="hero-author">By Mostafa 'Neo' Mohsenvand</p>
			<p class="hero-subtitle">
				Where smooth curves become infinitesimally linear,<br />and calculus becomes first-order
				algebra.
			</p>
			<p class="hero-motivation">
				Calculus asks how a changing input changes an output. Neocalculus studies that question
				through a first-order infinitesimal lens: smooth curves become locally linear, and
				derivatives appear as coefficients of <Katex math="d" />. The chapters build from this local
				picture to accumulation, modeling, and geometry.
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
		preview="Rates become totals through signed accumulation, moving endpoints, and antiderivatives."
		load={() => import('$lib/chapters/Ch05WorldOfAreas.svelte')}
	/>
	<LazyChapter
		id="ch6"
		chapterNumber="6"
		title="Integration Geometry and Techniques"
		preview="Choose an antiderivative technique, then build areas, volumes, work, and averages from local contributions."
		anchors={['volume-slicer']}
		load={() => import('$lib/chapters/Ch06ApplicationsIntegration.svelte')}
	/>
	<LazyChapter
		id="ch7"
		chapterNumber="7"
		title="Differential Equations and Physics Modeling"
		preview="A local rate law and initial condition determine growth, cooling, and motion."
		load={() => import('$lib/chapters/Ch07Physics.svelte')}
	/>
	<LazyChapter
		id="ch8"
		chapterNumber="8"
		title="Series and Approximation"
		preview="Build Taylor polynomials from derivatives, bound their error, and decide when an infinite series truly represents a function."
		load={() => import('$lib/chapters/Ch08Series.svelte')}
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
		title="Complex Analysis: Calculus in the Plane"
		preview="Complex functions reshape the plane; complex derivatives and contour integrals reveal a rigid geometry."
		anchors={[
			'complex-mapping-lab',
			'domain-coloring-lab',
			'complex-derivative-picture',
			'complex-contour-lab',
			'argument-principle-lab'
		]}
		load={() => import('$lib/chapters/Ch10ComplexAnalysis.svelte')}
	/>
	<LazyChapter
		id="ch11"
		chapterNumber="11"
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

	:global(html[data-theme='dark']) .hero {
		background:
			radial-gradient(126% 96% at 8% 12%, rgba(64, 105, 175, 0.16) 0%, transparent 56%),
			radial-gradient(118% 92% at 95% 14%, rgba(192, 132, 252, 0.08) 0%, transparent 64%),
			linear-gradient(180deg, #171a24 0%, #141720 48%, #12151d 78%, var(--color-paper) 100%);
	}

	:global(html[data-theme='dark']) .hero::before {
		background: radial-gradient(circle, rgba(96, 165, 250, 0.13) 0%, rgba(96, 165, 250, 0) 70%);
	}

	:global(html[data-theme='dark']) .hero::after {
		background: linear-gradient(
			180deg,
			rgba(17, 19, 26, 0) 0%,
			rgba(17, 19, 26, 0.48) 45%,
			rgba(17, 19, 26, 0.84) 78%,
			var(--color-paper) 100%
		);
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
		position: relative;
		z-index: 1;
		width: min(78rem, 100%);
		min-width: 0;
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
		min-width: 0;
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
		min-width: 0;
		display: grid;
		align-items: center;
		justify-items: end;
	}

	.hero-toc :global(.toc-card) {
		margin-top: 0;
		width: min(31rem, 100%);
		max-width: 100%;
		box-sizing: border-box;
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

	@media (max-width: 520px) {
		.hero-title {
			font-size: clamp(2.25rem, 10.8vw, 2.8rem);
			letter-spacing: 0.11em;
		}

		.hero-motivation {
			overflow-wrap: anywhere;
		}
	}

	/* ── Closing ── */
	.closing {
		padding: var(--space-xl) 0 var(--space-2xl);
		border-top: 1px solid var(--color-border-light);
	}
</style>
