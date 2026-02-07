<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
</script>

<section class="chapter" id="ch5">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 5</span>
			<h2 class="chapter-title">The World of Areas</h2>
			<p class="chapter-tagline">Integration, the Fundamental Theorem, and techniques for finding antiderivatives.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Calculus has two halves: <strong>differentiation</strong> (taking things apart) and <strong>integration</strong> (putting things together). We've mastered the first. Now for the second.</p>
			<p>In traditional calculus, integration is built on Riemann sums — stacks of finite rectangles that approximate the area, followed by a limit. In Neocalculus, each infinitesimal rectangle is already <strong>exactly right</strong>.</p>
		</div>

		<!-- FTC Figure -->
		<Figure number="5.1" caption="The sliver of new area from x to x+d: a rectangle of area f(x)·d, plus a triangle of area ½f'(x)·d² = 0.">
			<svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px">
				<!-- axes -->
				<line x1="50" y1="170" x2="370" y2="170" stroke="#1a1a2e" stroke-width="1.2"/>
				<line x1="50" y1="170" x2="50" y2="20" stroke="#1a1a2e" stroke-width="1.2"/>
				<!-- curve -->
				<path d="M 60 120 Q 120 40 200 70 Q 280 100 350 50" stroke="#1a1a2e" stroke-width="2" fill="none"/>
				<!-- shaded area -->
				<path d="M 60 170 L 60 120 Q 120 40 200 70 Q 240 82 260 80 L 260 170 Z" fill="rgba(168,85,247,0.1)" stroke="none"/>
				<!-- infinitesimal strip -->
				<rect x="220" y="76" width="18" height="94" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" stroke-width="1.5"/>
				<!-- triangle on top -->
				<path d="M 220 76 L 238 76 L 238 72 Z" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1"/>
				<!-- labels -->
				<text x="229" y="140" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#2563eb" font-weight="500">f(x)·d</text>
				<text x="252" y="68" text-anchor="start" font-size="9" font-family="Inter,sans-serif" fill="#ef4444">= 0</text>
				<text x="220" y="185" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#1a1a2e">x</text>
				<text x="238" y="185" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#a855f7">x+d</text>
				<text x="40" y="18" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">y</text>
				<text x="370" y="185" font-size="11" font-family="Crimson Pro,serif" fill="#1a1a2e" font-style="italic">x</text>
			</svg>
		</Figure>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Fundamental Theorem of Calculus</div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) - A(x) = f(x)\,d + \tfrac{1}{2}f'(x)\,\textcolor{#ef4444}{d^2}`} display /></div><span class="step-note">rectangle + triangle</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) - A(x) = f(x)\,d`} display /></div><span class="step-note">d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A'(x)\,d = f(x)\,d`} display /></div><span class="step-note">slope equation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`A'(x) = f(x)`} display /></div><span class="step-note">microcancellation ✓</span></div>
		</div>

		<Callout type="theorem" title="The Fundamental Theorem of Calculus">
			<p>The rate at which area accumulates equals the height of the curve: <Katex math={r`A'(x) = f(x)`} />. Equivalently, if <Katex math={r`F'(x) = f(x)`} />, then</p>
			<Katex math={r`\int_a^b f(x)\,dx = F(b) - F(a)`} display />
		</Callout>

		<Callout type="key-idea" title="The Constancy Principle">
			<p>If <Katex math={r`f'(x) = 0`} /> for all <Katex math="x" /> in an interval, then <Katex math="f" /> is constant. This bridges the infinitesimal and the global: infinitesimal flatness everywhere implies global constancy.</p>
			<p>Consequence: two functions with the same derivative differ by at most a constant.</p>
		</Callout>

		<InlinePlot fn={x => x*x} domain={[0, 3]} areaFrom={0.5} areaTo={2.5} caption="The area under x² from 0.5 to 2.5 = x³/3 evaluated at the endpoints." />

		<div class="neo-prose" use:reveal>
			<h3>Notation</h3>
			<p>The <strong>indefinite integral</strong> <Katex math={r`\int f(x)\,dx`} /> means "find a function whose derivative is <Katex math={r`f(x)`} />." The <strong>definite integral</strong> <Katex math={r`\int_a^b f(x)\,dx`} /> is the area (signed) under the curve from <Katex math="a" /> to <Katex math="b" />.</p>

			<h3>Integration by Substitution</h3>
			<p>The chain rule in reverse. If <Katex math={r`F'(x) = f(x)`} />, then <Katex math={r`F(g(x))' = f(g(x)) \cdot g'(x)`} /> by the chain rule. Reading this backwards:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int f(g(x))\,g'(x)\,dx = F(g(x)) + C`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — ∫ 2x·cos(x²) dx</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Let } u = x^2, \text{ so } du = 2x\,dx`} display /></div><span class="step-note">substitution</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int \cos(u)\,du = \sin(u) + C`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \sin(x^2) + C`} display /></div><span class="step-note">substitute back ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Integration by Parts</h3>
			<p>The product rule in reverse. Since <Katex math={r`(fg)' = f'g + fg'`} />, integrating both sides gives:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int f\,g'\,dx = fg - \int f'\,g\,dx`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — ∫ x·eˣ dx</div>
			<div class="step"><div class="step-math"><Katex math={r`f = x,\; g' = e^x \implies f' = 1,\; g = e^x`} display /></div><span class="step-note">choose f and g'</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int x\,e^x\,dx = x\,e^x - \int 1 \cdot e^x\,dx`} display /></div><span class="step-note">apply formula</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= x\,e^x - e^x + C = e^x(x-1) + C`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Arc Length</h3>
			<p>By microstraightness, each infinitesimal piece of a curve is a straight segment. The Pythagorean theorem gives:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Arc Length via Microstraightness</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{segment length}^2 = d^2 + (f'(x)\,d)^2 = d^2(1 + f'(x)^2)`} display /></div><span class="step-note">Pythagorean theorem</span></div>
			<div class="step"><div class="step-math"><Katex math={r`s'(x)\,d = d\sqrt{1 + f'(x)^2}`} display /></div><span class="step-note">take root</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`s = \int_a^b \sqrt{1 + f'(x)^2}\,dx`} display /></div><span class="step-note">microcancellation, integrate ✓</span></div>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Find <Katex math={r`\int x^3\,dx`} />.
				{#snippet solution()}<p><Katex math={r`x^4/4 + C`} /> (reverse the power rule)</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Evaluate <Katex math={r`\int_0^{\pi} \sin(x)\,dx`} />.
				{#snippet solution()}<p><Katex math={r`[-\cos(x)]_0^{\pi} = -\cos(\pi) + \cos(0) = 1 + 1 = 2`} /></p>{/snippet}
			</Exercise>
			<Exercise number={3}>
				Use substitution to find <Katex math={r`\int \frac{2x}{1+x^2}\,dx`} />.
				{#snippet solution()}<p>Let <Katex math={r`u = 1+x^2`} />, <Katex math={r`du = 2x\,dx`} />. Then <Katex math={r`\int du/u = \ln|u| + C = \ln(1+x^2) + C`} />.</p>{/snippet}
			</Exercise>
			<Exercise number={4}>
				Use integration by parts to find <Katex math={r`\int x\cos(x)\,dx`} />.
				{#snippet solution()}<p><Katex math={r`f=x, g'=\cos x \implies x\sin x - \int \sin x\,dx = x\sin x + \cos x + C`} /></p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
