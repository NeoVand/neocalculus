<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import PerfectZoom from '$lib/components/demos/PerfectZoom.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch1">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 1</span>
			<h2 class="chapter-title">The Smooth World</h2>
			<p class="chapter-tagline">Functions, smoothness, and the single idea that rebuilds all of calculus.</p>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION: What is a function? ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>What is a function?</h3>
			<p>Before we talk about calculus, we need one idea: the <strong>function</strong>.</p>
			<p>A function is a machine. You put a number in, and a number comes out. That's it. You give it an input, it gives you an output — always the same output for the same input, reliably, every time.</p>
		</div>

		<!-- Simple function-machine SVG -->
		<Figure caption="A function is a machine: one input, one output.">
			<svg viewBox="0 0 360 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:360px">
				<!-- Input arrow -->
				<line x1="30" y1="50" x2="105" y2="50" stroke="#94919b" stroke-width="1.5"/>
				<polygon points="105,50 99,46 99,54" fill="#94919b"/>
				<text x="65" y="40" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#94919b" font-style="italic">input x</text>
				<!-- Box -->
				<rect x="110" y="22" width="140" height="56" rx="10" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5"/>
				<text x="180" y="55" text-anchor="middle" font-size="16" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic" font-weight="600">f</text>
				<!-- Output arrow -->
				<line x1="255" y1="50" x2="330" y2="50" stroke="#94919b" stroke-width="1.5"/>
				<polygon points="330,50 324,46 324,54" fill="#94919b"/>
				<text x="295" y="40" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#94919b" font-style="italic">output f(x)</text>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<p>When we write <Katex math={r`f(x) = x^2`} />, we mean: "put in any number <Katex math="x" />, and the machine squares it." Put in 3, get 9. Put in -2, get 4. The function is completely described by its rule.</p>
			<p>Functions are everywhere. The height of a thrown ball at time <Katex math="t" /> is a function. The temperature at each point along a metal rod is a function. The balance in your bank account on each day is a function. Calculus is the study of <em>how functions change</em> — how the output responds when you nudge the input.</p>
		</div>

		<!-- ═══ SECTION: Smoothness ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Smoothness: a world without breaks</h3>
			<p>Not all functions are created equal. Some change gently — a ball arcing through the sky traces a smooth curve. Others jump suddenly — a light switch is either on or off, with no in-between.</p>
			<p>In the physical world, almost everything is smooth. Temperature doesn't teleport from 20°C to 100°C in zero distance. A moving car doesn't instantly jump from 0 to 60 mph. The real world <em>flows</em>.</p>
			<p>In Neocalculus, we build our mathematics to match this reality. We work in a world where <strong>every function is smooth</strong> — no sudden jumps, no sharp corners, no breaks. Everything flows continuously, and every curve can be followed without lifting your pen.</p>
			<p>This isn't a limitation. It's a <em>feature</em>. By starting with smoothness as a given, we avoid all the messy edge cases that plague classical mathematics, and we unlock a version of calculus that is simpler, more intuitive, and more powerful.</p>
		</div>

		<Callout type="key-idea" title="The Smooth World">
			<p>In Neocalculus, every function is <strong>smooth</strong>: continuous, infinitely differentiable, with no jumps or corners. The mathematical world matches the physical world — things flow, they don't break.</p>
		</Callout>

		<!-- ═══ SECTION: Zooming in ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Zooming in: the key insight</h3>
			<p>Here is the single most important observation in all of calculus, and everything else follows from it.</p>
			<p>Take any smooth curve. Pick any point on it. Now zoom in — closer and closer, deeper and deeper. What happens?</p>
			<p>The curve begins to flatten. The bends straighten out. And at the very bottom of the zoom — at a scale so small we call it <strong>infinitesimal</strong> — the curve becomes a perfectly straight line.</p>
			<p>Not approximately straight. Not "almost" straight. <strong>Perfectly, exactly straight.</strong></p>
			<p>This is called <strong>microstraightness</strong>. Try it yourself with any function you like:</p>
		</div>
	</div>

	<!-- The Perfect Zoom demo -->
	<div use:reveal={{ delay: 80 }}>
		<PerfectZoom />
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>No matter which function you chose, no matter where you placed the point — when you zoom far enough, the curve and its tangent become identical. This isn't a coincidence or an approximation. It is the foundational truth about how smooth functions behave.</p>
			<p>This insight is the engine of everything that follows. The slope of that straight line <em>is</em> the derivative. The area under the curve accumulates from infinitesimal rectangles that are <em>exactly right</em>. Every formula in calculus flows from this one idea.</p>
			<p>But to work with it, we need to give these infinitesimal quantities a name and a rule.</p>
		</div>

		<!-- ═══ SECTION: Meet d ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Meet <span class="d-highlight">d</span></h3>
			<p>We call these infinitesimal quantities <span class="d-highlight"><strong>d</strong></span>. They live on the number line, just like 1 or ½ or π. But they obey one special rule:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="d^2 = 0" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>That's it. That's the one rule. When you multiply an infinitesimal by itself, you get exactly zero. Not "approximately zero." Not "approaches zero." <strong>Zero.</strong></p>
			<p>But <span class="d-highlight">d</span> itself is not zero. It has direction, slope, meaning. It's too small to measure directly, but large enough to carry information. Think of it as the mathematical atom of change — the smallest possible nudge.</p>
			<p>This is what microstraightness means algebraically: over a distance of <span class="d-highlight">d</span>, every function is linear — a straight line — because any curvature would require a <Katex math="d^2" /> term, and <Katex math="d^2 = 0" />.</p>
		</div>

		<!-- Figure: the number line with infinitesimal cloud -->
		<Figure number="1.1" caption="The number line in Neocalculus. Around every point there is an infinitesimal neighborhood — a tiny 'cloud' of quantities d where d² = 0.">
			<svg viewBox="0 0 460 90" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:460px">
				<line x1="30" y1="50" x2="430" y2="50" stroke="#1a1a2e" stroke-width="1.5"/>
				<polygon points="430,50 424,46 424,54" fill="#1a1a2e"/>
				<line x1="80" y1="45" x2="80" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="80" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">-1</text>
				<line x1="175" y1="45" x2="175" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="175" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">0</text>
				<line x1="270" y1="45" x2="270" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="270" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">1</text>
				<line x1="365" y1="45" x2="365" y2="55" stroke="#1a1a2e" stroke-width="1.2"/>
				<text x="365" y="70" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e">2</text>
				<ellipse cx="175" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.12)" stroke="#a855f7" stroke-width="1" stroke-dasharray="3,2"/>
				<text x="175" y="26" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="500">d² = 0</text>
				<ellipse cx="270" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="3,2"/>
				<ellipse cx="365" cy="50" rx="22" ry="16" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="0.8" stroke-dasharray="3,2"/>
			</svg>
		</Figure>

		<!-- ═══ SECTION: The axiom ═══ -->
		<Callout type="definition" title="The Kock-Lawvere Axiom">
			<p>Every function <Katex math={r`f \colon D \to \mathcal{R}`} />, where <Katex math={r`D = \{d \in \mathcal{R} : d^2 = 0\}`} />, can be written <strong>uniquely</strong> as</p>
			<Katex math={r`f(d) = f(0) + s \cdot d`} display />
			<p>for some number <Katex math="s" />. In other words, every function on the infinitesimals is a straight line. No exceptions.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This axiom is the engine of everything that follows. It tells us that infinitesimals are too short to bend — they can be translated and rotated but never curved. A curve, when restricted to an infinitesimal segment, <em>must</em> be straight.</p>
			<p>From this single principle, we will rebuild all of calculus.</p>
		</div>

		<!-- ═══ SECTION: How can d² = 0 without d = 0? ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>How can d² = 0 without d = 0?</h3>
			<p>This is the question everyone asks, and it deserves a real answer.</p>
			<p>In everyday algebra, the argument goes: "If <Katex math="d^2 = 0" />, then <Katex math="d = 0" />. Done." And in the number system you're used to, that's correct. But the argument relies on a hidden assumption: that for every number, we can <em>decide</em> whether it equals zero or not.</p>
			<p>Neocalculus operates in a world called <strong>constructive logic</strong>, where we can only assert what we can directly construct or verify. In this world, we give up one principle that most people take for granted:</p>
		</div>

		<Callout type="warning" title="What We Give Up: The Law of Excluded Middle">
			<p>In classical logic, every statement is either true or false: <Katex math={r`P \lor \neg P`} /> always holds. In constructive logic, we can only claim <Katex math={r`P \lor \neg P`} /> when we have a <em>procedure</em> to determine which one it is.</p>
			<p>For infinitesimals, we <strong>cannot decide</strong> whether <Katex math="d = 0" /> or <Katex math={r`d \neq 0`} />. They exist in a mathematical twilight — not provably zero, yet not provably nonzero either.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This might sound like a loss, but it's actually a <em>feature</em>. Here's what we gain:</p>
		</div>

		<Callout type="key-idea" title="What We Gain: A World Without Monsters">
			<p><strong>Every function is continuous.</strong> You can't build a discontinuous step function because you'd need to sort each number into "zero" or "nonzero" — and that sorting is exactly what constructive logic prevents.</p>
			<p><strong>Every function is infinitely differentiable.</strong> Since the slope equation gives every function a derivative, and the derivative is itself a function, you can differentiate forever. No corners, no cusps, no pathological exceptions.</p>
			<p><strong>The mathematical world is safe by design.</strong> All the ugly edge cases of classical analysis — functions that are continuous but nowhere differentiable, sets that can be rearranged to double their volume — simply cannot exist here.</p>
		</Callout>

		<!-- ═══ SECTION: What smoothness really means ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>What smoothness really means</h3>
			<p>Let's step back and appreciate what we've done. We haven't just chosen a mathematical convention — we've chosen to build our mathematics to match the physical world.</p>
			<p>In the real world, physical quantities flow. Temperature changes gradually. Objects move along smooth paths. Forces vary continuously. Nature doesn't have step functions or nowhere-differentiable curves.</p>
			<p>Classical mathematics built a number system (the real numbers) that <em>does</em> allow all those pathological objects, and then spent centuries building walls to keep them out. The epsilon-delta definition of limits, the Riemann integral, Lebesgue measure theory — all of these are, at their core, tools for taming mathematical monsters.</p>
			<p>In Neocalculus, we take a different path. We start with a world where the monsters never existed. Every function is smooth. Every curve is infinitesimally straight. And the calculus that emerges is simple, algebraic, and clean.</p>
			<p>This is why <Katex math="d^2 = 0" /> can hold without forcing <Katex math="d = 0" />: the proof that "<Katex math="d^2 = 0" /> implies <Katex math="d = 0" />" relies on the law of excluded middle, which we choose not to assume. By making that choice, we get a universe where calculus is algebra and everything works.</p>
		</div>

		<HistoryBox name="Gottfried Wilhelm Leibniz" years="1646–1716">
			<p>Leibniz invented calculus using infinitesimals — quantities "infinitely small" that he manipulated algebraically. For 200 years, mathematicians used his notation (dx, dy, ∫) but couldn't justify the infinitesimals rigorously. Neocalculus vindicates Leibniz: his infinitesimals were nilpotent quantities all along.</p>
		</HistoryBox>

		<!-- ═══ EXERCISES ═══ -->
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
					<p>The product is exactly 1.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				Explain in your own words why, in the Neocalculus world, every curve must be "infinitesimally straight."
				{#snippet solution()}
					<p>The Kock-Lawvere axiom says every function on the infinitesimals is affine (a straight line). Since a curve restricted to an infinitesimal neighborhood is such a function, it must be straight in that neighborhood. Curves are made of infinitesimal straight segments joined together — too short to bend.</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				Why can't you define a step function (f(x) = 0 for x &lt; 0, f(x) = 1 for x ≥ 0) in the Neocalculus world?
				{#snippet solution()}
					<p>To define this function, you'd need to decide for every number whether it's less than 0 or not. But for infinitesimals near 0, this decision cannot be made — they exist in a twilight zone. So the step function simply cannot be defined on all numbers, and therefore doesn't exist as a function on the full number line.</p>
				{/snippet}
			</Exercise>
		</div>
	</div>
</section>
