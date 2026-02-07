<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import PerfectZoom from '$lib/components/demos/PerfectZoom.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch1">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 1</span>
			<h2 class="chapter-title">The Smooth World</h2>
			<p class="chapter-tagline">At the smallest scale, every curve is a perfectly straight line.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal={{ delay: 80 }}>
			<p>Imagine you have an impossibly powerful microscope — one that can zoom into any curve, any shape, deeper and deeper without limit.</p>
			<p>As you zoom in, something remarkable happens. The curve begins to flatten. The bends straighten out. And at the very bottom of the zoom — at a scale so small we call it <strong>infinitesimal</strong> — the curve becomes a perfectly straight line.</p>
			<p>Not approximately straight. Not "almost" straight. <strong>Perfectly, exactly straight.</strong></p>
			<p>This is not a simplification or a trick. This is the foundational truth about how smooth reality works. We call it <strong>microstraightness</strong>.</p>
		</div>
	</div>

	<!-- The Perfect Zoom demo (full width) -->
	<div use:reveal={{ delay: 100 }}>
		<PerfectZoom />
	</div>

	<div class="content-width">
		<!-- Conceptual figure: classical vs neocalculus zoom -->
		<Figure number="1.1" caption="Left: in classical math, a curve is always curved no matter how far you zoom. Right: in Neocalculus, at infinitesimal scale the curve becomes exactly straight — the tangent.">
			<svg viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:520px">
				<!-- Left: classical -->
				<rect x="0" y="0" width="240" height="170" rx="8" fill="white" stroke="#e5e1d8"/>
				<text x="120" y="18" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#94919b" font-weight="600">CLASSICAL</text>
				<circle cx="120" cy="95" r="55" stroke="#1a1a2e" stroke-width="2" fill="none"/>
				<rect x="85" y="55" width="30" height="30" rx="2" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
				<line x1="115" y1="70" x2="170" y2="35" stroke="#ef4444" stroke-width="0.8" stroke-dasharray="2,2"/>
				<rect x="165" y="25" width="60" height="35" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1"/>
				<path d="M170 50 Q185 35 220 42" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>
				<text x="195" y="20" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#ef4444">still curved!</text>
				<!-- Right: neocalculus -->
				<rect x="280" y="0" width="240" height="170" rx="8" fill="white" stroke="#e5e1d8"/>
				<text x="400" y="18" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">NEOCALCULUS</text>
				<circle cx="400" cy="95" r="55" stroke="#1a1a2e" stroke-width="2" fill="none"/>
				<rect x="365" y="55" width="30" height="30" rx="2" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="3,2"/>
				<line x1="395" y1="70" x2="450" y2="35" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="2,2"/>
				<rect x="445" y="25" width="60" height="35" rx="3" fill="#faf5ff" stroke="#a855f7" stroke-width="1"/>
				<line x1="450" y1="45" x2="500" y2="38" stroke="#a855f7" stroke-width="2"/>
				<text x="475" y="20" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#a855f7">straight!</text>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<p>What you see above is the core insight: at the infinitesimal scale, every smooth curve is indistinguishable from a straight line. The tangent doesn't just <em>touch</em> the curve — it <em>is</em> the curve, for an infinitesimal moment.</p>
			<p>To work with this idea, we need to give infinitesimal quantities a name and a rule.</p>

			<h3>Meet <span class="d-highlight">d</span></h3>
			<p>We call these infinitesimal quantities <span class="d-highlight"><strong>d</strong></span>. They live on the number line, just like 1 or ½ or π. But they obey one special rule:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="d^2 = 0" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>That's it. That's the one rule. When you multiply an infinitesimal by itself, you get exactly zero. Not "approximately zero." Not "approaches zero." <strong>Zero.</strong></p>
			<p>But <span class="d-highlight">d</span> itself is not zero. It has direction, slope, meaning. It's too small to measure directly, but large enough to carry information. Think of it as the mathematical atom of change — the smallest possible nudge.</p>
		</div>

		<!-- Figure: the number line with infinitesimal cloud -->
		<Figure number="1.2" caption="The number line in Neocalculus. Around every point there is an infinitesimal neighborhood — a tiny 'cloud' of quantities d where d² = 0.">
			<svg viewBox="0 0 460 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:460px">
				<!-- number line -->
				<line x1="30" y1="50" x2="430" y2="50" stroke="#1a1a2e" stroke-width="1.5"/>
				<polygon points="430,50 424,46 424,54" fill="#1a1a2e"/>
				<!-- ticks -->
				<line x1="80" y1="45" x2="80" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="80" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">-1</text>
				<line x1="175" y1="45" x2="175" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="175" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">0</text>
				<line x1="270" y1="45" x2="270" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="270" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">1</text>
				<line x1="365" y1="45" x2="365" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="365" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">2</text>
				<!-- infinitesimal cloud around 0 -->
				<ellipse cx="175" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.12)" stroke="#a855f7" stroke-width="1" stroke-dasharray="3,2"/>
				<text x="175" y="26" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="500">d² = 0</text>
				<!-- cloud around 1 -->
				<ellipse cx="270" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="3,2"/>
				<!-- cloud around 2 -->
				<ellipse cx="365" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="3,2"/>
			</svg>
		</Figure>

		<Callout type="definition" title="The Kock-Lawvere Axiom">
			<p>Every function <Katex math={r`f \colon D \to \mathcal{R}`} />, where <Katex math={r`D = \{d \in \mathcal{R} : d^2 = 0\}`} />, can be written <strong>uniquely</strong> as</p>
			<Katex math={r`f(d) = f(0) + s \cdot d`} display />
			<p>for some number <Katex math="s" />. In other words, every function on the infinitesimals is a straight line. No exceptions.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This axiom is the engine of everything that follows. It tells us that infinitesimals are too short to bend — they can be translated and rotated but never curved. A curve, when restricted to an infinitesimal segment, <em>must</em> be straight.</p>
			<p>From this single principle, we will rebuild all of calculus.</p>
		</div>

		<details class="dig-deeper" use:reveal>
			<summary>Why can d² = 0 without d = 0?</summary>
			<div class="dig-content">
				<p>In everyday logic, if something squared is zero, the thing itself must be zero. But Neocalculus operates in a subtler logical world called <strong>constructive logic</strong>, where we can only assert what we can directly construct or prove. We can't "sort" infinitesimals into "zero" and "non-zero" — they exist in a kind of mathematical twilight.</p>
				<p>The payoff is enormous: in this world, every function is automatically smooth and differentiable. There are no discontinuities, no pathological exceptions. The mathematical world is <em>safe by design</em>.</p>
			</div>
		</details>

		<!-- Exercises -->
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>

			<Exercise number={1}>
				If <Katex math="d" /> is infinitesimal (so <Katex math="d^2 = 0" />), simplify <Katex math="(3 + d)^2" />.
				{#snippet solution()}
					<Katex math={r`(3+d)^2 = 9 + 6d + d^2 = 9 + 6d`} display />
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				If <Katex math="d^2 = 0" />, what is <Katex math="(1 + d)(1 - d)" />?
				{#snippet solution()}
					<Katex math={r`(1+d)(1-d) = 1 - d^2 = 1`} display />
					<p>The product of <Katex math="(1+d)" /> and <Katex math="(1-d)" /> is exactly 1.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				Explain in your own words why, in the Neocalculus world, every curve must be "infinitesimally straight."
				{#snippet solution()}
					<p>The Kock-Lawvere axiom says every function on the infinitesimals is affine (a straight line). Since a curve restricted to an infinitesimal neighborhood is such a function, it must be straight in that neighborhood. Curves are made of infinitesimal straight segments joined together.</p>
				{/snippet}
			</Exercise>
		</div>
	</div>
</section>
