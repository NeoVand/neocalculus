<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import StandardCalcBox from '$lib/components/StandardCalcBox.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import PerfectZoom from '$lib/components/demos/PerfectZoom.svelte';
	import FunctionMachine from '$lib/components/demos/FunctionMachine.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch1">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 1</span>
			<h2 class="chapter-title">The Smooth World</h2>
			<div class="chapter-epigraph">
				<blockquote>"Nature never makes jumps."</blockquote>
				<p class="epigraph-attr">— Gottfried Wilhelm Leibniz, <em>New Essays</em>, 1704</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION: What is a function? ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>What is a function?</h3>
			<p>A function is a machine: something goes in, something comes out — always the same output for the same input. Functions are far more general than "plug in a number, get a number." They are the universal language of transformation:</p>
		</div>

	</div>

	<!-- Function Machine Demo — full width -->
	<div class="content-width" use:reveal>
		<FunctionMachine />
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>A function can square a number, measure the length of a word, take the derivative of another function, or compute the divergence of a vector field. In every case the contract is the same: one input, one output, deterministic. In calculus we focus on functions from numbers to numbers — like <Katex math={r`f(x) = x^2`} /> — but the deeper idea is universal.</p>
			<p>Calculus studies <em>how functions change</em>: how the output responds when you nudge the input. To do that cleanly, we need to be precise about what kind of functions we allow.</p>
		</div>

		<!-- ═══ SECTION: Smoothness ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Smoothness</h3>
			<p>Not all functions change the same way. Some flow gently — a ball arcing through the sky traces a smooth curve. Others break. There are two ways a function can fail to be smooth:</p>
			<ul>
				<li><strong>A corner</strong> — like <Katex math={r`|x|`} /> at the origin, where the slope changes abruptly.</li>
				<li><strong>A jump</strong> — like a step function that leaps from 0 to 1, with no intermediate values.</li>
			</ul>
			<p>In Neocalculus, we work exclusively with <strong>smooth</strong> functions: no corners, no jumps, no breaks of any kind. This matches the physical world — temperature doesn't teleport, velocity doesn't snap — and it makes calculus algebraic.</p>
		</div>

		<!-- ═══ FIGURE 1.1: Three-panel comparison ═══ -->
		<Figure number="1.1" caption="Three kinds of functions. Left: x² is smooth — at every point, zooming in reveals a straight tangent line. Center: |x| has a corner at x = 0 that persists at every zoom level. Right: a step function has a jump discontinuity — the output teleports.">
			<svg viewBox="0 0 690 210" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:690px">
				<!-- ──── Panel 1: SMOOTH (x²) ──── -->
				<rect x="6" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" stroke-width="1"/>
				<text x="111" y="25" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="700" letter-spacing="0.04em">SMOOTH</text>
				<!-- axes at origin (111, 152) -->
				<line x1="22" y1="152" x2="200" y2="152" stroke="#d4d0c8" stroke-width="0.6"/>
				<line x1="111" y1="32" x2="111" y2="192" stroke="#d4d0c8" stroke-width="0.6"/>
				<!-- x² parabola: origin=(111,152), scaleX=40px/unit, scaleY=25px/unit -->
				<!-- 25 computed points from x=-2.2 to x=2.2 -->
				<polyline points="23,31 30,50 38,68 45,84 52,98 60,111 67,122 74,131 82,139 89,144 96,149 104,151 111,152 118,151 126,149 133,144 140,139 148,131 155,122 162,111 170,98 177,84 184,68 192,50 199,31"
					stroke="#1a1a2e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
				<!-- tangent at x=1: point=(151,127), slope=2 -->
				<line x1="123" y1="162" x2="179" y2="92" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="5,3"/>
				<circle cx="151" cy="127" r="3" fill="#a855f7"/>
				<text x="180" y="86" font-size="8.5" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">tangent</text>
				<text x="111" y="190" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="#1a1a2e">f(x) = x²</text>

				<!-- ──── Panel 2: CORNER (|x|) ──── -->
				<rect x="240" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" stroke-width="1"/>
				<text x="345" y="25" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="700" letter-spacing="0.04em">CORNER</text>
				<!-- axes at origin (345, 152) -->
				<line x1="256" y1="152" x2="434" y2="152" stroke="#d4d0c8" stroke-width="0.6"/>
				<line x1="345" y1="32" x2="345" y2="192" stroke="#d4d0c8" stroke-width="0.6"/>
				<!-- |x|: V at origin. scale ~40px/unit both directions -->
				<line x1="265" y1="72" x2="345" y2="152" stroke="#1a1a2e" stroke-width="2"/>
				<line x1="345" y1="152" x2="425" y2="72" stroke="#1a1a2e" stroke-width="2"/>
				<circle cx="345" cy="152" r="3.5" fill="#a855f7"/>
				<!-- conflicting slopes shown as dashed extensions -->
				<line x1="308" y1="180" x2="345" y2="152" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.7"/>
				<line x1="345" y1="152" x2="382" y2="180" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.7"/>
				<text x="282" y="182" font-size="7.5" font-family="Inter,sans-serif" fill="#a855f7" font-weight="500" opacity="0.8">−1</text>
				<text x="384" y="182" font-size="7.5" font-family="Inter,sans-serif" fill="#a855f7" font-weight="500" opacity="0.8">+1</text>
				<text x="345" y="190" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="#1a1a2e">f(x) = |x|</text>

				<!-- ──── Panel 3: JUMP (step function) ──── -->
				<rect x="474" y="6" width="210" height="198" rx="10" fill="white" stroke="#e5e1d8" stroke-width="1"/>
				<text x="579" y="25" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#a855f7" font-weight="700" letter-spacing="0.04em">JUMP</text>
				<!-- axes at origin (579, 132) -->
				<line x1="490" y1="132" x2="668" y2="132" stroke="#d4d0c8" stroke-width="0.6"/>
				<line x1="579" y1="32" x2="579" y2="192" stroke="#d4d0c8" stroke-width="0.6"/>
				<!-- Step: y=0 for x<0, y=1 for x≥0 -->
				<line x1="496" y1="132" x2="579" y2="132" stroke="#1a1a2e" stroke-width="2"/>
				<line x1="579" y1="72" x2="662" y2="72" stroke="#1a1a2e" stroke-width="2"/>
				<!-- dashed gap -->
				<line x1="579" y1="132" x2="579" y2="72" stroke="#a855f7" stroke-width="1.3" stroke-dasharray="3,3" opacity="0.6"/>
				<!-- open/filled circles -->
				<circle cx="579" cy="132" r="3.5" fill="white" stroke="#1a1a2e" stroke-width="1.5"/>
				<circle cx="579" cy="72" r="3.5" fill="#1a1a2e"/>
				<!-- annotation -->
				<text x="596" y="106" font-size="8" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600" opacity="0.8">jump!</text>
				<text x="572" y="136" text-anchor="end" font-size="8" font-family="Inter,sans-serif" fill="#94919b">0</text>
				<text x="572" y="76" text-anchor="end" font-size="8" font-family="Inter,sans-serif" fill="#94919b">1</text>
				<text x="579" y="190" text-anchor="middle" font-size="10" font-family="var(--font-mono)" fill="#1a1a2e">step function</text>
			</svg>
		</Figure>

		<Callout type="key-idea" title="The Smooth World">
			<p>In Neocalculus, every function is <strong>smooth</strong> — infinitely differentiable, with no corners and no jumps. This is not a limitation; it is a design choice that eliminates pathological edge cases and makes calculus algebraic.</p>
		</Callout>

		<!-- ═══ SECTION: Zooming in ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Zooming in: the key insight</h3>
			<p>Take any smooth curve. Pick any point. Now zoom in. What happens?</p>
			<p>The curve flattens. The bends straighten out. And at the very bottom of the zoom — at a scale we call <strong>infinitesimal</strong> — the curve becomes a perfectly straight line. Not approximately straight. <strong>Exactly straight.</strong></p>
			<p>This is <strong>microstraightness</strong>. Try it yourself:</p>
		</div>
	</div>

	<!-- The Perfect Zoom demo -->
	<div use:reveal={{ delay: 80 }}>
		<PerfectZoom />
	</div>

	<div class="content-width">
		<div class="neo-prose" use:reveal>
			<p>No matter which function you chose, no matter where you placed the point — when you zoom far enough, the curve and its tangent become identical. That infinitesimal straight segment has a tiny width we call <span class="d-highlight"><strong>d</strong></span>, and its slope is what we will call the <strong>derivative</strong>.</p>
		</div>

		<!-- ═══ SECTION: Meet d ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Meet <span class="d-highlight">d</span></h3>
			<p>Infinitesimals live on the number line alongside 1, ½, and π. They obey one special rule:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="d^2 = 0" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>When you multiply an infinitesimal by itself, you get exactly zero. But <span class="d-highlight">d</span> itself is <em>not</em> zero — it has direction and slope. It is the mathematical atom of change: too small to measure, but large enough to carry information.</p>
			<p>This is microstraightness stated algebraically: over a distance of <span class="d-highlight">d</span>, every function is linear, because curvature requires a <Katex math="d^2" /> term, and <Katex math="d^2 = 0" />.</p>
		</div>

		<!-- Number line figure — placed here, near "Meet d" where it belongs -->
		<Figure number="1.2" caption="The Neocalculus number line. Around every point sits an infinitesimal neighborhood D — a 'cloud' of quantities d where d² = 0.">
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

		<div class="neo-prose" use:reveal>
			<p>We write <Katex math={r`D = \{d \in \mathcal{R} : d^2 = 0\}`} /> for the set of all infinitesimals — the infinitesimal neighborhood of zero. Our number line <Katex math={r`\mathcal{R}`} /> contains everything you already know (integers, fractions, irrationals) plus these infinitesimals.</p>
		</div>

		<!-- ═══ SECTION: Infinitesimal arithmetic ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Arithmetic with infinitesimals</h3>
			<p>The only new rule is <Katex math="d^2 = 0" />. Everything else is ordinary algebra.</p>
			<ul>
				<li><strong>Constant multiples:</strong> <Katex math="(3d)^2 = 9d^2 = 0" />, so any multiple of an infinitesimal is infinitesimal.</li>
				<li><strong>Higher powers vanish:</strong> <Katex math="d^3 = d \cdot d^2 = 0" />, and <Katex math="d^4 = 0" />, and so on.</li>
			</ul>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example: simplifying with d² = 0</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(3 + d)^2 = 9 + 6d + d^2`} display /></div>
				<div class="step-note">expand</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`= 9 + 6d`} display /></div>
				<div class="step-note"><Katex math="d^2 = 0" /> ✓</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Expand normally, kill every <Katex math="d^2" /> and higher, done. The result is always a number plus something times <Katex math="d" />.</p>
		</div>

		<!-- ═══ SECTION: A first taste ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>A first taste: the slope of <Katex math="x^2" /></h3>
			<p>Take <Katex math={r`f(x) = x^2`} /> and nudge its input by an infinitesimal:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Finding the slope of x²</div>
			<div class="step">
				<div class="step-math"><Katex math={r`f(x + d) = (x + d)^2 = x^2 + 2xd + d^2`} display /></div>
				<div class="step-note">expand</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`= x^2 + 2xd`} display /></div>
				<div class="step-note"><Katex math="d^2 = 0" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`= f(x) + \underbrace{2x}_{\text{the slope}} \cdot d`} display /></div>
				<div class="step-note">read off coefficient of d</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The slope of <Katex math="x^2" /> at any point <Katex math="x" /> is <Katex math="2x" />. At <Katex math="x = 3" />, the slope is 6. At <Katex math="x = -1" />, it's &minus;2. We just computed the derivative — and all we did was algebra. No limits, no epsilon-delta, no "approaching zero."</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, this requires defining a limit: <Katex math={r`\lim_{h \to 0} \frac{(x+h)^2 - x^2}{h}`} />. In Neocalculus, it's three lines of algebra. Same answer, simpler path.</p>
		</SDGAdvantage>

		<!-- ═══ SECTION: The axiom ═══ -->
		<Callout type="definition" title="The Kock-Lawvere Axiom">
			<p>For any function <Katex math={r`f`} /> and any infinitesimal <Katex math="d" />, there is a <strong>unique</strong> number <Katex math="s" /> such that</p>
			<Katex math={r`f(d) = f(0) + s \cdot d`} display />
			<p>Every function on the infinitesimals is exactly linear. The unique slope <Katex math="s" /> is the derivative.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>The word <em>uniquely</em> is the key. It means there is exactly one slope that works — and that uniqueness is what lets us extract the derivative by "reading off the coefficient of <Katex math="d" />."</p>
		</div>

		<!-- ═══ SECTION: Microcancellation ═══ -->
		<Callout type="theorem" title="Microcancellation">
			<p>If <Katex math="a \cdot d = b \cdot d" /> for all infinitesimal <Katex math="d" />, then <Katex math="a = b" />.</p>
			<p>We "cancel" the <Katex math="d" /> — <strong>not by dividing</strong> (you cannot divide by an infinitesimal!) — but by the uniqueness of the Kock-Lawvere decomposition.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is the workhorse of every derivation in this book. Expand <Katex math="f(x+d)" />, apply <Katex math="d^2 = 0" />, and match the coefficients of <Katex math="d" /> on both sides.</p>
		</div>

		<!-- ═══ SECTION: How can d² = 0 without d = 0? ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>How can <Katex math="d^2 = 0" /> without <Katex math="d = 0" />?</h3>
			<p>In ordinary algebra, <Katex math="d^2 = 0" /> forces <Katex math="d = 0" />. The proof goes: "Suppose <Katex math={r`d \neq 0`} />. Divide both sides of <Katex math="d \cdot d = 0" /> by <Katex math="d" />. Then <Katex math="d = 0" />. Contradiction." But this argument assumes you can always decide whether <Katex math="d = 0" /> or <Katex math={r`d \neq 0`} /> — that is, it uses the <strong>law of excluded middle</strong>.</p>
		</div>

		<Callout type="warning" title="Constructive Logic">
			<p>Neocalculus operates in <strong>constructive logic</strong>, where we only assert what we can directly verify. For infinitesimals, we <em>cannot</em> decide whether <Katex math="d = 0" /> — they are too small to measure. So the classical proof breaks down, and <Katex math="d^2 = 0" /> is compatible with <Katex math="d" /> being nonzero.</p>
			<p>This is a feature: it prevents constructing pathological objects (step functions, nowhere-differentiable curves) that require case-splitting on "is this number zero?" Every function in our world is automatically smooth.</p>
		</Callout>

		<DigDeeper title="Why the classical proof fails">
			<p>The classical argument has two steps. <strong>Step 1:</strong> Assume <Katex math={r`d \neq 0`} />, divide <Katex math="d \cdot d = 0" /> by <Katex math="d" />, get <Katex math="d = 0" />. Contradiction. <strong>Step 2:</strong> Since <Katex math={r`d \neq 0`} /> is impossible, conclude <Katex math="d = 0" />.</p>
			<p>Step 2 uses the law of excluded middle: "not (<Katex math={r`d \neq 0`} />) therefore <Katex math="d = 0" />." In constructive logic, this inference is not valid — a number might be neither provably zero nor provably nonzero. Infinitesimals live in this twilight.</p>
		</DigDeeper>

		<StandardCalcBox>
			<p>In standard calculus, the derivative is defined as a limit: <Katex math={r`f'(x) = \lim_{h \to 0} \frac{f(x+h)-f(x)}{h}`} />. The epsilon-delta machinery exists precisely because the real numbers have no infinitesimals. Neocalculus adds infinitesimals to the number line and skips the limit entirely.</p>
		</StandardCalcBox>

		<!-- ═══ HISTORY ═══ -->
		<HistoryBox name="Gottfried Wilhelm Leibniz" years="1646–1716">
			<p>Leibniz co-invented calculus using infinitesimals, writing <Katex math="dx" />, <Katex math="dy" />, and <Katex math={r`\textstyle\int`} />. His notation was brilliant, but his infinitesimals lacked rigorous foundations. Bishop Berkeley mocked them as "ghosts of departed quantities" in 1734. For 200 years, mathematicians used Leibniz's notation while replacing his ideas with limits. Neocalculus vindicates Leibniz: his infinitesimals were nilpotent (<Katex math="d^2 = 0" />) all along.</p>
		</HistoryBox>

		<HistoryBox name="L. E. J. Brouwer" years="1881–1966">
			<p>Brouwer founded <strong>intuitionism</strong>, arguing that mathematical existence requires construction, not just proof by contradiction. He rejected the law of excluded middle. His ideas, once controversial, became the foundation of constructive mathematics — the logical framework that makes Neocalculus possible.</p>
		</HistoryBox>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li><strong>Smoothness:</strong> In Neocalculus, every function is smooth — no jumps, no corners.</li>
				<li><strong>Microstraightness:</strong> Zoom into any smooth curve far enough and it becomes perfectly straight.</li>
				<li><strong>Infinitesimals:</strong> Quantities <Katex math="d" /> where <Katex math="d^2 = 0" /> but <Katex math={r`d \neq 0`} />.</li>
				<li><strong>Kock-Lawvere axiom:</strong> Every function on <Katex math="D" /> is uniquely of the form <Katex math="f(0) + s \cdot d" />.</li>
				<li><strong>Microcancellation:</strong> <Katex math="ad = bd" /> for all <Katex math="d" /> implies <Katex math="a = b" />.</li>
				<li><strong>Constructive logic:</strong> We don't assume the law of excluded middle, which is why <Katex math="d^2 = 0" /> doesn't force <Katex math="d = 0" />.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises</summary>

			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Simplify <Katex math="(3 + d)^2" /> using <Katex math="d^2 = 0" />.</p>
				{#snippet solution()}
					<Katex math={r`(3+d)^2 = 9 + 6d + d^2 = 9 + 6d`} display />
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Simplify <Katex math="(1 + d)(1 - d)" />.</p>
				{#snippet solution()}
					<Katex math={r`(1+d)(1-d) = 1 - d^2 = 1`} display />
					<p>So <Katex math="1-d" /> is the multiplicative inverse of <Katex math="1+d" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Simplify <Katex math="(5 + d)^3" />.</p>
				{#snippet solution()}
					<Katex math={r`(5+d)^3 = 125 + 75d + 15d^2 + d^3 = 125 + 75d`} display />
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p><strong>Core.</strong> Simplify <Katex math={r`\frac{1}{1+d}`} /> by multiplying top and bottom by <Katex math="(1 - d)" />.</p>
				{#snippet solution()}
					<Katex math={r`\frac{1}{1+d} = \frac{1-d}{(1+d)(1-d)} = \frac{1-d}{1} = 1-d`} display />
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p><strong>Core.</strong> True or false: <Katex math="d^2 = 0" /> implies <Katex math="d^3 = 0" />.</p>
				{#snippet solution()}
					<p><strong>True.</strong> <Katex math="d^3 = d \cdot d^2 = d \cdot 0 = 0" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Simplify <Katex math="(2+d)^4" />.</p>
				{#snippet solution()}
					<Katex math={r`(2+d)^4 = 16 + 4 \cdot 8 \cdot d + \cdots = 16 + 32d`} display />
					<p>All terms with <Katex math="d^2" /> or higher vanish.</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Core.</strong> Compute <Katex math="(x+d)^3" />, apply <Katex math="d^2 = 0" />, and read off the coefficient of <Katex math="d" />. What is the slope of <Katex math="x^3" />?</p>
				{#snippet solution()}
					<Katex math={r`(x+d)^3 = x^3 + 3x^2 d + 3xd^2 + d^3 = x^3 + 3x^2 d`} display />
					<p>The slope of <Katex math="x^3" /> at <Katex math="x" /> is <Katex math="3x^2" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p><strong>Core.</strong> Explain in your own words why every smooth curve must be "infinitesimally straight."</p>
				{#snippet solution()}
					<p>The Kock-Lawvere axiom says every function on D is affine: <Katex math="f(d) = f(0) + s \cdot d" />. A curve restricted to an infinitesimal interval is such a function, so it must be a straight line. Curves are built from infinitesimal segments too short to bend.</p>
				{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Challenge.</strong> Why can't you define a step function (<Katex math="f(x) = 0" /> for <Katex math="x < 0" />, <Katex math="f(x) = 1" /> for <Katex math={r`x \geq 0`} />) in the Neocalculus world?</p>
				{#snippet solution()}
					<p>The definition requires deciding whether each number is negative or non-negative. For infinitesimals near 0, this decision cannot be made — constructive logic does not provide a procedure to determine their sign. The function is undefined on these numbers and so does not exist on the full number line.</p>
				{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Challenge.</strong> List three physical quantities that change smoothly. For each, explain what "infinitesimally straight" means physically.</p>
				{#snippet solution()}
					<p>(1) <strong>Temperature along a rod:</strong> over an infinitesimal length, temperature changes linearly: <Katex math="T(x+d) = T(x) + T'(x) \cdot d" />. (2) <strong>Height of a ball:</strong> over an infinitesimal time, height changes at constant velocity: <Katex math="h(t+d) = h(t) + v(t) \cdot d" />. (3) <strong>Population:</strong> over an infinitesimal time, growth is proportional: <Katex math="P(t+d) = P(t)(1 + r \cdot d)" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p><strong>Exploration.</strong> Is <Katex math="3d^2" /> zero? What about <Katex math={r`\sqrt{d^2}`} />? Can you take <Katex math={r`\sqrt{d}`} />?</p>
				{#snippet solution()}
					<p><Katex math="3d^2 = 0" /> — any multiple of <Katex math="d^2" /> is zero. <Katex math={r`\sqrt{d^2} = \sqrt{0} = 0`} />. As for <Katex math={r`\sqrt{d}`} />: this is not defined in standard SDG, because <Katex math="d" /> is not provably non-negative.</p>
				{/snippet}
			</Exercise>
		</details>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>In the next chapter, we'll use <Katex math="d^2 = 0" /> to find the slope of every function you've ever seen — polynomials, trig, exponentials, logarithms — and the algebra will be shockingly simple. The key formula: <Katex math={r`f(x + d) = f(x) + f'(x) \cdot d`} />.</p>
		</LookingAhead>

		<NextChapter href="ch2" title="The Slope Equation" number="2" />
	</div>
</section>
