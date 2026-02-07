<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch10">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 10</span>
			<h2 class="chapter-title">The Language of Forms</h2>
			<p class="chapter-tagline">Differential forms, Stokes' theorem, and the grand unification.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Everything we've built — derivatives, integrals, the Fundamental Theorem, arc length, area, volume — is a special case of a single, breathtakingly general principle. To see it, we need the language of <strong>differential forms</strong>.</p>

			<h3>What Is a Differential Form?</h3>
			<p>A <strong>k-form</strong> is a machine that measures infinitesimal k-dimensional content. Think of it as a way to assign a number to an infinitesimal parallelotope:</p>
			<ul>
				<li>A <strong>0-form</strong> is just a function — it assigns a number to each point.</li>
				<li>A <strong>1-form</strong> measures infinitesimal length — it assigns a number to each infinitesimal line segment.</li>
				<li>A <strong>2-form</strong> measures infinitesimal area — it assigns a number to each infinitesimal parallelogram.</li>
			</ul>
		</div>

		<Callout type="definition" title="Differential Forms in Neocalculus">
			<p>An <strong>n-form</strong> <Katex math={r`\omega`} /> on a space <Katex math="S" /> is a mapping from infinitesimal n-cubes to numbers, satisfying:</p>
			<ul>
				<li><strong>Homogeneity</strong>: scaling a side by <Katex math="a" /> scales the value by <Katex math="a" /></li>
				<li><strong>Alternation</strong>: swapping two sides negates the value</li>
				<li><strong>Degeneracy</strong>: if any side has zero length, the value is 0</li>
			</ul>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>The Exterior Derivative</h3>
			<p>Given a k-form <Katex math={r`\omega`} />, its <strong>exterior derivative</strong> <Katex math={r`d\omega`} /> is a (k+1)-form defined by the most natural possible construction:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_C d\omega = \int_{\partial C} \omega`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The integral of <Katex math={r`d\omega`} /> over an infinitesimal (k+1)-cube equals the integral of <Katex math={r`\omega`} /> over its boundary. This is both a <em>definition</em> and a local version of the most powerful theorem in calculus.</p>

			<h3>The Generalized Stokes' Theorem</h3>
			<p>The infinitesimal boundary formula above, when summed over a finite region, gives:</p>
		</div>

		<Callout type="theorem" title="The Generalized Stokes' Theorem">
			<p>For any differential form <Katex math={r`\omega`} /> and any oriented region <Katex math="M" />:</p>
			<Katex math={r`\int_M d\omega = \int_{\partial M} \omega`} display />
			<p>The integral of the derivative over the interior equals the integral of the form over the boundary.</p>
		</Callout>

		<!-- Stokes unification figure -->
		<Figure number="10.1" caption="Four theorems, one principle. Every classical 'integral theorem' is a special case of Stokes' theorem: the integral of d(something) over a region equals the integral of that something over the boundary.">
			<svg viewBox="0 0 460 260" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:460px">
				<!-- center theorem -->
				<rect x="130" y="10" width="200" height="50" rx="10" fill="#faf5ff" stroke="#a855f7" stroke-width="2"/>
				<text x="230" y="30" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#a855f7" font-weight="700">STOKES' THEOREM</text>
				<text x="230" y="48" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">∫ dω = ∫ ω</text>
				<!-- four special cases -->
				<!-- FTC -->
				<rect x="10" y="100" width="100" height="55" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
				<text x="60" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#2563eb" font-weight="600">FTC</text>
				<text x="60" y="138" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">∫ f'dx = F(b)−F(a)</text>
				<text x="60" y="150" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#94919b">0-form → 1-form</text>
				<!-- Green's -->
				<rect x="130" y="100" width="100" height="55" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.2"/>
				<text x="180" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#059669" font-weight="600">GREEN'S</text>
				<text x="180" y="138" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">∮ F·dr = ∬ curl</text>
				<text x="180" y="150" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#94919b">1-form → 2-form</text>
				<!-- Classical Stokes -->
				<rect x="250" y="100" width="100" height="55" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
				<text x="300" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#b45309" font-weight="600">STOKES'</text>
				<text x="300" y="138" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">∬ curl·n = ∮ F·dr</text>
				<text x="300" y="150" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#94919b">1-form → 2-form (3D)</text>
				<!-- Divergence -->
				<rect x="370" y="100" width="80" height="55" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
				<text x="410" y="118" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#ef4444" font-weight="600">DIVERGENCE</text>
				<text x="410" y="138" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">∬ F·n = ∭ div</text>
				<text x="410" y="150" text-anchor="middle" font-size="8" font-family="Inter,sans-serif" fill="#94919b">2-form → 3-form</text>
				<!-- connector lines -->
				<line x1="180" y1="60" x2="60" y2="100" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/>
				<line x1="210" y1="60" x2="180" y2="100" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/>
				<line x1="250" y1="60" x2="300" y2="100" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/>
				<line x1="270" y1="60" x2="410" y2="100" stroke="#a855f7" stroke-width="1" stroke-dasharray="4,3"/>
				<!-- conclusion -->
				<text x="230" y="195" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">"Integrating a derivative over a region</text>
				<text x="230" y="215" text-anchor="middle" font-size="12" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">= evaluating the original on the boundary."</text>
				<text x="230" y="245" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#a855f7" font-weight="500">One theorem. All of calculus.</text>
			</svg>
		</Figure>

		<div class="neo-prose" use:reveal>
			<h3>The FTC as Stokes' Theorem</h3>
			<p>When <Katex math={r`\omega = F`} /> is a 0-form (function) and <Katex math={r`M = [a, b]`} /> is an interval:</p>
			<ul>
				<li><Katex math={r`d\omega = F'\,dx`} /> (a 1-form)</li>
				<li><Katex math={r`\partial M = \{b\} - \{a\}`} /> (the boundary of an interval is its two endpoints)</li>
				<li>So <Katex math={r`\int_a^b F'\,dx = F(b) - F(a)`} /> — the Fundamental Theorem of Calculus!</li>
			</ul>

			<h3>Why This Matters</h3>
			<p>The generalized Stokes' theorem shows that all the "integration theorems" you might encounter — the Fundamental Theorem of Calculus, Green's theorem, the classical Stokes' theorem, the Divergence theorem — are the <em>same theorem</em> applied to forms of different degrees.</p>
			<p>In Neocalculus, this unity is visible from the start: the exterior derivative is defined by what happens on infinitesimal cubes, and the global theorem is just the sum of all the infinitesimal contributions, with interior terms canceling.</p>
		</div>

		<!-- Cancellation figure -->
		<Figure number="10.2" caption="Why Stokes works: when you sum d(ω) over adjacent squares, shared edges have opposite orientations and cancel. Only the outer boundary survives.">
			<svg viewBox="0 0 420 210" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:420px">
				<!-- 4×3 grid -->
				<rect x="60" y="20" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="135" y="20" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="210" y="20" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="285" y="20" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="60" y="70" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="135" y="70" width="75" height="50" fill="rgba(168,85,247,0.07)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="210" y="70" width="75" height="50" fill="rgba(168,85,247,0.07)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="285" y="70" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="60" y="120" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="135" y="120" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="210" y="120" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<rect x="285" y="120" width="75" height="50" fill="rgba(168,85,247,0.04)" stroke="#d8d5ce" stroke-width="0.8"/>
				<!-- interior opposing arrows on a shared vertical edge -->
				<line x1="210" y1="78" x2="210" y2="92" stroke="#ef4444" stroke-width="2.5"/>
				<polygon points="210,78 207,83 213,83" fill="#ef4444"/>
				<line x1="210" y1="108" x2="210" y2="94" stroke="#3b82f6" stroke-width="2.5"/>
				<polygon points="210,108 207,103 213,103" fill="#3b82f6"/>
				<!-- X mark showing cancellation -->
				<line x1="205" y1="88" x2="215" y2="98" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
				<line x1="215" y1="88" x2="205" y2="98" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
				<!-- interior opposing arrows on a shared horizontal edge -->
				<line x1="165" y1="70" x2="179" y2="70" stroke="#ef4444" stroke-width="2.5"/>
				<polygon points="179,70 174,67 174,73" fill="#ef4444"/>
				<line x1="205" y1="70" x2="191" y2="70" stroke="#3b82f6" stroke-width="2.5"/>
				<polygon points="191,70 196,67 196,73" fill="#3b82f6"/>
				<line x1="183" y1="65" x2="193" y2="75" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
				<line x1="193" y1="65" x2="183" y2="75" stroke="#ef4444" stroke-width="1.5" opacity="0.7"/>
				<!-- label -->
				<text x="250" y="96" font-size="10" font-family="Inter,sans-serif" fill="#ef4444" font-weight="600">opposite → cancel</text>
				<!-- outer boundary (thick, purple) -->
				<rect x="60" y="20" width="300" height="150" fill="none" stroke="#a855f7" stroke-width="3" rx="2"/>
				<!-- arrows on outer boundary showing net orientation -->
				<polygon points="210,18 207,13 213,13" fill="#a855f7"/>
				<polygon points="210,172 207,177 213,177" fill="#a855f7"/>
				<polygon points="58,95 53,92 53,98" fill="#a855f7"/>
				<polygon points="362,95 367,92 367,98" fill="#a855f7"/>
				<text x="210" y="195" text-anchor="middle" font-size="11" font-family="Inter,sans-serif" fill="#a855f7" font-weight="600">only the outer boundary survives</text>
			</svg>
		</Figure>

		<Callout type="key-idea" title="The Grand Unification">
			<p>All of calculus — from the derivative of <Katex math="x^2" /> to the Divergence Theorem in three dimensions — rests on a single principle: <strong>the infinitesimal determines the global</strong>. The derivative captures infinitesimal change; integration accumulates it. Stokes' theorem says these are the same operation, viewed from different angles.</p>
			<p>And all of it flows from one axiom: <Katex math="d^2 = 0" />.</p>
		</Callout>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Explain how the Fundamental Theorem of Calculus <Katex math={r`\int_a^b f'(x)\,dx = f(b) - f(a)`} /> is a special case of Stokes' theorem.
				{#snippet solution()}<p>Take <Katex math={r`\omega = f`} /> (a 0-form), <Katex math={r`M = [a,b]`} />. Then <Katex math={r`d\omega = f'\,dx`} /> and <Katex math={r`\partial M = \{b\} - \{a\}`} />. Stokes gives <Katex math={r`\int_M d\omega = \omega|_{\partial M} = f(b) - f(a)`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Why do "interior contributions cancel" when summing over adjacent infinitesimal cubes?
				{#snippet solution()}<p>Adjacent cubes share a face, but with opposite orientations. The alternation property of forms means the two contributions from the shared face are equal and opposite, hence cancel.</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
