<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import PerfectZoom from '$lib/components/demos/PerfectZoom.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupCurveVsTangent(JXG: any, board: any) {
		// A circle — the classic curve
		board.create('circle', [[0, 0], 2], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false,
			fillColor: 'none'
		});

		// Point on the circle at ~40 degrees
		const theta = 0.7; // radians
		const px = 2 * Math.cos(theta);
		const py = 2 * Math.sin(theta);

		const P = board.create('point', [px, py], {
			size: 5, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});

		// Tangent line at P (perpendicular to radius)
		// Tangent direction: (-sin(theta), cos(theta))
		const tx = -Math.sin(theta);
		const ty = Math.cos(theta);
		const tLen = 1.8;
		board.create('segment', [
			[px - tLen * tx, py - tLen * ty],
			[px + tLen * tx, py + tLen * ty]
		], {
			strokeColor: '#a855f7', strokeWidth: 2.5, dash: 2,
			highlight: false
		});

		// Label
		board.create('text', [px + 0.3, py + 0.3, 'tangent = curve\nat infinitesimal scale'], {
			fontSize: 11, color: '#a855f7', highlight: false, anchorX: 'left'
		});

		// Small "zoom region" rectangle around P
		const rSize = 0.35;
		board.create('polygon', [
			[px - rSize, py - rSize], [px + rSize, py - rSize],
			[px + rSize, py + rSize], [px - rSize, py + rSize]
		], {
			fillColor: 'rgba(168,85,247,0.06)', strokeColor: '#a855f7',
			strokeWidth: 1, dash: 2, highlight: false,
			vertices: { visible: false }, borders: { highlight: false }
		});
	}
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
		<div use:reveal>
			<JSXGraphBoard
				setup={setupCurveVsTangent}
				boundingbox={[-3, 3, 3.8, -3]}
				aspectRatio={(3.8 - -3) / (3 - -3)}
				axes={false}
				number="1.1"
				caption="A circle with its tangent line at a point. In Neocalculus, at infinitesimal scale within the dashed region, the curve and the tangent are identical."
			/>
		</div>

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

		<div class="neo-prose" use:reveal>
			<h3>How can d² = 0 without d = 0?</h3>
			<p>This is the question everyone asks, and it deserves a real answer — not a hand-wave.</p>
			<p>In everyday algebra, the argument goes like this: "If <Katex math="d^2 = 0" />, then <Katex math="d = 0" />. Done." And in the number system you're used to, that's correct. But the argument relies on a hidden assumption: that for every number, we can <em>decide</em> whether it equals zero or not.</p>
			<p>Neocalculus operates in a world called <strong>constructive logic</strong>, where we can only assert what we can directly construct or verify. In this world, we lose one principle that most people take for granted:</p>
		</div>

		<Callout type="warning" title="What We Give Up: The Law of Excluded Middle">
			<p>In classical logic, every statement is either true or false: <Katex math={r`P \lor \neg P`} /> always holds. In constructive logic, we can only claim <Katex math={r`P \lor \neg P`} /> when we have a <em>procedure</em> to determine which one it is.</p>
			<p>For infinitesimals, we <strong>cannot decide</strong> whether <Katex math="d = 0" /> or <Katex math={r`d \neq 0`} />. They exist in a mathematical twilight — not provably zero, yet not provably nonzero either.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This might sound like a loss, but it's actually a <em>feature</em>. Here's what we gain:</p>
		</div>

		<Callout type="key-idea" title="What We Gain: A Smooth World">
			<p><strong>Every function is continuous.</strong> You can't build a discontinuous step function because you'd need to sort each number into "zero" or "nonzero" — and that sorting is exactly what constructive logic prevents.</p>
			<p><strong>Every function is infinitely differentiable.</strong> Since the slope equation gives every function a derivative, and the derivative is itself a function, you can differentiate forever. There are no corners, no cusps, no pathological exceptions.</p>
			<p><strong>The mathematical world is safe by design.</strong> All the ugly edge cases of classical analysis — functions that are continuous but nowhere differentiable, sets that can be rearranged to double their volume — simply cannot exist here.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>Think of it this way: in the classical world, mathematicians spent the 19th century building walls (epsilon-delta definitions, Riemann integrals, Lebesgue measures) to keep out pathological monsters. In Neocalculus, the monsters never existed in the first place. The logic of the world prevents them from forming.</p>
			<p>This is why <Katex math="d^2 = 0" /> can hold without forcing <Katex math="d = 0" />: the proof that "<Katex math="d^2 = 0" /> implies <Katex math="d = 0" />" relies on the law of excluded middle, which we choose not to assume. And by making that choice, we get a universe where calculus is simple, clean, and everything works.</p>
		</div>

		<HistoryBox name="Gottfried Wilhelm Leibniz" years="1646–1716">
			<p>Leibniz invented calculus using infinitesimals — quantities "infinitely small" that he manipulated algebraically. For 200 years, mathematicians used his notation (dx, dy, ∫) but couldn't justify the infinitesimals rigorously. Neocalculus vindicates Leibniz: his infinitesimals were nilpotent quantities all along.</p>
		</HistoryBox>

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
