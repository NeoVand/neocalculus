<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupFTCStrip(JXG: any, board: any) {
		const f = (x: number) => 0.15 * x * x + 0.8; // simple positive curve

		// Function curve
		board.create('functiongraph', [f, 0, 6], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false
		});

		// Shaded area under curve from 0.5 to x0
		const x0 = 3.5;
		const dx = 0.5; // visible "infinitesimal" strip width
		const pts: [number, number][] = [[0.5, 0]];
		for (let t = 0.5; t <= x0; t += 0.05) pts.push([t, f(t)]);
		pts.push([x0, 0]);
		board.create('polygon', pts, {
			fillColor: 'rgba(168,85,247,0.1)', strokeWidth: 0,
			highlight: false, vertices: { visible: false }, borders: { strokeWidth: 0, highlight: false }
		});

		// The infinitesimal strip (rectangle)
		board.create('polygon', [
			[x0, 0], [x0 + dx, 0], [x0 + dx, f(x0)], [x0, f(x0)]
		], {
			fillColor: 'rgba(59,130,246,0.2)', strokeColor: '#3b82f6', strokeWidth: 1.5,
			highlight: false, vertices: { visible: false }, borders: { highlight: false }
		});

		// The vanishing triangle on top of the strip
		board.create('polygon', [
			[x0, f(x0)], [x0 + dx, f(x0)], [x0 + dx, f(x0 + dx)]
		], {
			fillColor: 'rgba(239,68,68,0.2)', strokeColor: '#ef4444', strokeWidth: 1.2,
			highlight: false, vertices: { visible: false }, borders: { highlight: false }
		});

		// Dot at (x0, f(x0))
		board.create('point', [x0, f(x0)], {
			size: 3, fillColor: '#3b82f6', strokeColor: '#3b82f6',
			name: '', fixed: true, highlight: false
		});

		// Labels
		board.create('text', [x0 + dx / 2, f(x0) / 2, 'f(x)·d'], {
			fontSize: 13, color: '#2563eb', anchorX: 'middle', highlight: false, fontWeight: '600'
		});
		board.create('text', [x0 + dx + 0.3, f(x0) + 0.15, 'area = 0'], {
			fontSize: 11, color: '#ef4444', anchorX: 'left', highlight: false, fontWeight: '600'
		});
		board.create('text', [x0 + dx + 0.3, f(x0) - 0.05, '(d² = 0)'], {
			fontSize: 10, color: '#ef4444', anchorX: 'left', highlight: false
		});

		// x-axis labels
		board.create('text', [x0, -0.18, 'x'], {
			fontSize: 13, color: '#1a1a2e', anchorX: 'middle', highlight: false, fontStyle: 'italic'
		});
		board.create('text', [x0 + dx, -0.18, 'x+d'], {
			fontSize: 13, color: '#a855f7', anchorX: 'middle', highlight: false, fontStyle: 'italic'
		});
	}
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
		<div use:reveal>
			<JSXGraphBoard
				setup={setupFTCStrip}
				boundingbox={[-0.3, 2.8, 6.5, -0.5]}
				aspectRatio={(6.5 - -0.3) / (2.8 - -0.5)}
				number="5.1"
				caption="The infinitesimal strip from x to x+d: a blue rectangle of area f(x)·d, plus a red triangle whose area is ½f'(x)·d² = 0. Only the rectangle counts."
			/>
		</div>

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

		<HistoryBox name="John L. Bell" years="1945–2024">
			<p>Bell wrote "A Primer of Infinitesimal Analysis" — the most accessible book on this approach. His geometric proof of the Fundamental Theorem (the vanishing triangle argument above) shows how microstraightness makes integration beautifully simple.</p>
		</HistoryBox>

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
