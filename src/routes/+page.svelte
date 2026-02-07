<script lang="ts">
	import Ch01 from '$lib/chapters/Ch01SmoothWorld.svelte';
	import Ch02 from '$lib/chapters/Ch02SlopeEquation.svelte';
	import Ch03 from '$lib/chapters/Ch03RulesOfChange.svelte';
	import Ch04 from '$lib/chapters/Ch04Optimization.svelte';
	import Ch05 from '$lib/chapters/Ch05WorldOfAreas.svelte';
	import Ch06 from '$lib/chapters/Ch06ApplicationsIntegration.svelte';
	import Ch07 from '$lib/chapters/Ch07InfiniteSeries.svelte';
	import Ch08 from '$lib/chapters/Ch08Physics.svelte';
	import Ch09 from '$lib/chapters/Ch09ManyDimensions.svelte';
	import Ch10 from '$lib/chapters/Ch10LanguageOfForms.svelte';
	import ChapterNav from '$lib/components/ChapterNav.svelte';
	import Katex from '$lib/components/Katex.svelte';
	import { reveal } from '$lib/utils/scroll';
</script>

<!-- ═══ HERO ═══ -->
<section class="hero">
	<div class="hero-inner">
		<h1 class="hero-title">Neocalculus</h1>
		<p class="hero-subtitle">
			Where every curve becomes a straight line,<br />and calculus becomes algebra.
		</p>
		<p class="hero-motivation">
			For over two centuries, calculus has been taught through limits — an unintuitive machinery
			of epsilons and deltas that obscures the geometric simplicity underneath. But there is another way.
			Modern mathematics has shown that calculus can be rebuilt from a single, elegant axiom: that
			infinitesimal quantities exist, and their squares vanish. No limits. No hand-waving. Just algebra.
			This is that calculus.
		</p>
	</div>
	<nav class="toc" aria-label="Table of contents">
		<ol>
			<li><a href="#ch1">The Smooth World</a></li>
			<li><a href="#ch2">The Slope Equation</a></li>
			<li><a href="#ch3">The Rules of Change</a></li>
			<li><a href="#ch4">Applications of Derivatives</a></li>
			<li><a href="#ch5">The World of Areas</a></li>
			<li><a href="#ch6">Applications of Integration</a></li>
			<li><a href="#ch7">Infinite Series</a></li>
			<li><a href="#ch8">The Physical World</a></li>
			<li><a href="#ch9">Many Dimensions</a></li>
			<li><a href="#ch10">The Language of Forms</a></li>
		</ol>
	</nav>
	<div class="scroll-hint" aria-hidden="true">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
	</div>
</section>

<!-- ═══ CHAPTER NAVIGATION ═══ -->
<ChapterNav />

<!-- ═══ CHAPTERS ═══ -->
<div class="page-wrapper">
	<Ch01 />
	<Ch02 />
	<Ch03 />
	<Ch04 />
	<Ch05 />
	<Ch06 />
	<Ch07 />
	<Ch08 />
	<Ch09 />
	<Ch10 />
</div>

<!-- ═══ CLOSING ═══ -->
<section class="closing">
	<div class="content-width" use:reveal>
		<hr class="chapter-divider" style="margin: 0 auto var(--space-lg)" />
		<div class="neo-prose" style="text-align: center;">
			<p style="font-size: 1.3rem; font-weight: 500;">
				One axiom. <Katex math="d^2 = 0" />.
			</p>
			<p style="color: var(--color-ink-light);">
				From this single rule, we derived every derivative in the standard table. We proved the product, chain, and quotient rules. We established the Fundamental Theorem of Calculus, integration techniques, volumes of revolution, Taylor series, the equations of motion, and the generalized Stokes' theorem.
			</p>
			<p style="color: var(--color-ink-light);">
				All without limits. All without epsilon-delta. All from algebra and the geometry of microstraightness.
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

	/* ── Table of Contents ── */
	.toc {
		margin-top: var(--space-lg);
		animation: float-down 1.2s var(--ease-out-expo);
	}

	.toc ol {
		list-style: none;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem 1.2rem;
		max-width: 36rem;
	}

	.toc li {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		color: var(--color-ink-faint);
	}

	.toc a {
		color: var(--color-ink-faint);
		text-decoration: none;
		transition: color 0.15s;
	}

	.toc a:hover {
		color: var(--color-d);
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
