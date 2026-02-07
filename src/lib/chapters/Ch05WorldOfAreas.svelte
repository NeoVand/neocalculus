<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import HistoryBox from '$lib/components/HistoryBox.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import StandardCalcBox from '$lib/components/StandardCalcBox.svelte';
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
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

	function setupAreaBetweenCurves(JXG: any, board: any) {
		const f = (x: number) => x;
		const g = (x: number) => x * x;

		// Curves
		board.create('functiongraph', [f, -0.3, 1.5], {
			strokeColor: '#2563eb', strokeWidth: 2.5, highlight: false
		});
		board.create('functiongraph', [g, -0.3, 1.5], {
			strokeColor: '#ef4444', strokeWidth: 2.5, highlight: false
		});

		// Shaded region between curves from 0 to 1
		const pts: [number, number][] = [];
		for (let t = 0; t <= 1; t += 0.02) pts.push([t, f(t)]);
		for (let t = 1; t >= 0; t -= 0.02) pts.push([t, g(t)]);
		board.create('polygon', pts, {
			fillColor: 'rgba(168,85,247,0.15)', strokeWidth: 0,
			highlight: false, vertices: { visible: false }, borders: { strokeWidth: 0, highlight: false }
		});

		// Infinitesimal strip at x=0.5
		const xm = 0.5;
		const dw = 0.04;
		board.create('polygon', [
			[xm, g(xm)], [xm + dw, g(xm)], [xm + dw, f(xm)], [xm, f(xm)]
		], {
			fillColor: 'rgba(59,130,246,0.3)', strokeColor: '#3b82f6', strokeWidth: 1,
			highlight: false, vertices: { visible: false }, borders: { highlight: false }
		});

		// Labels
		board.create('text', [1.2, 1.15, 'y = x'], {
			fontSize: 13, color: '#2563eb', highlight: false, fontStyle: 'italic'
		});
		board.create('text', [1.2, 1.55, 'y = x²'], {
			fontSize: 13, color: '#ef4444', highlight: false, fontStyle: 'italic'
		});
		board.create('text', [0.6, 0.35, 'f(x)−g(x)'], {
			fontSize: 11, color: '#3b82f6', highlight: false, fontWeight: '600'
		});

		// Intersection dots
		board.create('point', [0, 0], {
			size: 3, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		board.create('point', [1, 1], {
			size: 3, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
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

		<!-- ═══ SECTION: Motivation ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>From rates to totals</h3>
			<p>We've spent four chapters mastering the derivative — the tool that takes a function and tells us its instantaneous rate of change. We've differentiated polynomials, trigonometric functions, exponentials, and elaborate compositions. We've used derivatives to find slopes, velocities, and optimal values.</p>
			<p>Now we ask the <em>reverse</em> question. Given a rate of change, can we recover the total quantity? If we know how fast water flows into a tank at every instant, can we find how much water is in the tank? If we know the velocity of a car at every moment, can we determine how far it has traveled?</p>
			<p>This is <strong>integration</strong> — the second half of calculus. And the deep miracle is that these two halves are <em>inverses</em> of each other. Differentiation and integration undo one another, connected by what may be the most important theorem in all of mathematics.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Integration without limits</h3>
			<p>In traditional calculus, integration is built on <em>Riemann sums</em> — stacks of finite rectangles that approximate the area under a curve, followed by a limit as the rectangles get thinner and thinner. The definition is intricate: partition the interval, choose sample points, sum the rectangles, and hope the limit exists.</p>
			<p>In Neocalculus, we need none of that machinery. Each infinitesimal strip is already <strong>exactly right</strong> — not an approximation. We don't approach the answer through a limiting process. We simply sum infinitesimal contributions, each of which is exact, and the answer emerges immediately.</p>
		</div>

		<!-- ═══ SECTION: The Fundamental Theorem ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Fundamental Theorem of Calculus</h3>
			<p>Let <Katex math={r`f`} /> be a smooth function, and let <Katex math={r`A(x)`} /> be the area under the curve from some fixed starting point <Katex math={r`a`} /> to the variable endpoint <Katex math={r`x`} />. What happens when we nudge <Katex math={r`x`} /> by an infinitesimal <span class="d-highlight">d</span>?</p>
			<p>The area gains a thin strip from <Katex math={r`x`} /> to <Katex math={r`x + d`} />. By microstraightness, the curve is a straight line over this strip. The strip decomposes into a <strong>rectangle</strong> of height <Katex math={r`f(x)`} /> and width <Katex math={r`d`} />, plus a tiny <strong>triangle</strong> sitting on top.</p>
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

		<div class="neo-prose" use:reveal>
			<p>The rectangle has area <Katex math={r`f(x) \cdot d`} />. The triangle has base <Katex math={r`d`} /> and height proportional to <Katex math={r`f'(x) \cdot d`} /> (the change in the curve over the strip), so its area is <Katex math={r`\tfrac{1}{2} f'(x) \cdot d^2`} />. But <Katex math={r`d^2 = 0`} />, so the triangle has <strong>exactly zero area</strong>. Only the rectangle counts.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The Fundamental Theorem of Calculus</div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) - A(x) = f(x)\,d + \tfrac{1}{2}f'(x)\,\textcolor{#ef4444}{d^2}`} display /></div><span class="step-note">rectangle + triangle</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A(x+d) - A(x) = f(x)\,d`} display /></div><span class="step-note">d² = 0</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A'(x)\,d = f(x)\,d`} display /></div><span class="step-note">slope equation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`A'(x) = f(x)`} display /></div><span class="step-note">microcancellation ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is extraordinary. The rate at which area accumulates is simply the height of the curve. There are no limits, no epsilon-delta arguments, no approximation step. The triangle term vanishes <em>exactly</em> because <Katex math={r`d^2 = 0`} />, and the result follows by microcancellation.</p>
		</div>

		<Callout type="theorem" title="The Fundamental Theorem of Calculus (First Form)">
			<p>If <Katex math={r`A(x) = \int_a^x f(t)\,dt`} /> is the area function, then</p>
			<Katex math={r`A'(x) = f(x)`} display />
			<p>The rate at which area accumulates equals the height of the curve. Equivalently, if <Katex math={r`F'(x) = f(x)`} /> (that is, <Katex math="F" /> is an <strong>antiderivative</strong> of <Katex math="f" />), then</p>
			<Katex math={r`\int_a^b f(x)\,dx = F(b) - F(a)`} display />
		</Callout>

		<DigDeeper title="The telescoping perspective">
			<div class="neo-prose">
				<p>There's another beautiful way to see the FTC. Think of the interval <Katex math={r`[a, b]`} /> as composed of infinitely many infinitesimal segments. Over each segment, the change in <Katex math="F" /> is exactly <Katex math={r`F'(x) \cdot d = f(x) \cdot d`} />.</p>
				<p>Summing all these infinitesimal changes across the continuum gives a telescoping sum:</p>
				<Katex math={r`\sum F(x + d) - F(x) = F(b) - F(a)`} display />
				<p>Every internal point cancels — it's the end of one segment and the start of the next. Only the boundary values <Katex math={r`F(b)`} /> and <Katex math={r`F(a)`} /> survive. This is the most transparent possible justification: the integral is the accumulation of infinitesimal differences, and it telescopes to the boundary.</p>
			</div>
		</DigDeeper>

		<!-- ═══ SECTION: Second FTC ═══ -->
		<Callout type="theorem" title="The Fundamental Theorem (Second Form)">
			<p>Differentiation and integration are inverse operations:</p>
			<Katex math={r`\frac{d}{dx} \int_a^x f(t)\,dt = f(x)`} display />
			<p>In words: if you accumulate <Katex math="f" /> and then ask "how fast is the accumulation growing?", the answer is <Katex math="f" /> itself. Integration followed by differentiation returns you to where you started.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Notation</h3>
			<p>The <strong>indefinite integral</strong> <Katex math={r`\int f(x)\,dx`} /> means "find a function whose derivative is <Katex math={r`f(x)`} />." Since any two such functions differ by a constant, we always include <Katex math={r`+ C`} />. The <strong>definite integral</strong> <Katex math={r`\int_a^b f(x)\,dx`} /> is the signed area under the curve from <Katex math="a" /> to <Katex math="b" />, computed as <Katex math={r`F(b) - F(a)`} />.</p>
			<p>We write <Katex math={r`\bigl[F(x)\bigr]_a^b`} /> or <Katex math={r`F(x)\big|_a^b`} /> as shorthand for <Katex math={r`F(b) - F(a)`} />.</p>
		</div>

		<!-- ═══ SECTION: Basic Antiderivatives ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Basic antiderivatives</h3>
			<p>The FTC transforms every integration problem into a search for antiderivatives. An <strong>antiderivative</strong> of <Katex math={r`f(x)`} /> is any function <Katex math={r`F(x)`} /> with <Katex math={r`F'(x) = f(x)`} />. Since we already know the derivatives of all the standard functions, we can read the table backwards.</p>
		</div>

		<Callout type="definition" title="The Power Rule in Reverse">
			<p>Since <Katex math={r`\frac{d}{dx}\left[\frac{x^{n+1}}{n+1}\right] = x^n`} />, we have</p>
			<Katex math={r`\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \qquad (n \neq -1)`} display />
			<p>The special case <Katex math={r`n = -1`} /> gives <Katex math={r`\int \frac{1}{x}\,dx = \ln|x| + C`} />.</p>
		</Callout>

		<!-- Antiderivative Reference Table -->
		<div class="reference-table" use:reveal>
			<div class="derivation-title">Antiderivative Reference Table</div>
			<table>
				<thead>
					<tr>
						<th><Katex math={r`f(x)`} /></th>
						<th><Katex math={r`\int f(x)\,dx`} /></th>
						<th>Why</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><Katex math={r`x^n`} /></td>
						<td><Katex math={r`\dfrac{x^{n+1}}{n+1} + C`} /></td>
						<td>Power rule reversed (<Katex math={r`n \neq -1`} />)</td>
					</tr>
					<tr>
						<td><Katex math={r`\dfrac{1}{x}`} /></td>
						<td><Katex math={r`\ln|x| + C`} /></td>
						<td><Katex math={r`(\ln x)' = 1/x`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`e^x`} /></td>
						<td><Katex math={r`e^x + C`} /></td>
						<td><Katex math={r`(e^x)' = e^x`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`a^x`} /></td>
						<td><Katex math={r`\dfrac{a^x}{\ln a} + C`} /></td>
						<td><Katex math={r`(a^x)' = a^x \ln a`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`\sin x`} /></td>
						<td><Katex math={r`-\cos x + C`} /></td>
						<td><Katex math={r`(-\cos x)' = \sin x`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`\cos x`} /></td>
						<td><Katex math={r`\sin x + C`} /></td>
						<td><Katex math={r`(\sin x)' = \cos x`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`\sec^2 x`} /></td>
						<td><Katex math={r`\tan x + C`} /></td>
						<td><Katex math={r`(\tan x)' = \sec^2 x`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`\dfrac{1}{1+x^2}`} /></td>
						<td><Katex math={r`\arctan x + C`} /></td>
						<td><Katex math={r`(\arctan x)' = \frac{1}{1+x^2}`} /></td>
					</tr>
					<tr>
						<td><Katex math={r`\dfrac{1}{\sqrt{1-x^2}}`} /></td>
						<td><Katex math={r`\arcsin x + C`} /></td>
						<td><Katex math={r`(\arcsin x)' = \frac{1}{\sqrt{1-x^2}}`} /></td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Worked Example: Basic Definite Integral -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int_0^2 (3x^2 + 2x)\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`\int_0^2 (3x^2 + 2x)\,dx`} display /></div><span class="step-note">find antiderivative</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \left[x^3 + x^2\right]_0^2`} display /></div><span class="step-note"><Katex math={r`\int 3x^2 = x^3`} />, <Katex math={r`\int 2x = x^2`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= (2^3 + 2^2) - (0^3 + 0^2)`} display /></div><span class="step-note">evaluate at endpoints</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 8 + 4 - 0 = 12`} display /></div><span class="step-note">✓</span></div>
		</div>

		<InlinePlot fn={x => x*x} domain={[0, 3]} areaFrom={0.5} areaTo={2.5} caption="The area under x² from 0.5 to 2.5 = x³/3 evaluated at the endpoints." />

		<!-- ═══ SECTION: Properties of Definite Integrals ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Properties of definite integrals</h3>
			<p>Definite integrals obey several natural properties, all of which follow from the infinitesimal picture.</p>
		</div>

		<Callout type="key-idea" title="Properties of Definite Integrals">
			<p><strong>Linearity.</strong> Constants factor out, and the integral of a sum is the sum of the integrals:</p>
			<Katex math={r`\int_a^b \bigl[\alpha\, f(x) + \beta\, g(x)\bigr]\,dx = \alpha \int_a^b f(x)\,dx + \beta \int_a^b g(x)\,dx`} display />
			<p><strong>Additivity over intervals.</strong> You can split an integral at any interior point:</p>
			<Katex math={r`\int_a^b f(x)\,dx = \int_a^c f(x)\,dx + \int_c^b f(x)\,dx`} display />
			<p><strong>Order of limits.</strong> Reversing the limits negates the integral:</p>
			<Katex math={r`\int_b^a f(x)\,dx = -\int_a^b f(x)\,dx`} display />
			<p><strong>Comparison.</strong> If <Katex math={r`f(x) \geq g(x)`} /> on <Katex math={r`[a, b]`} />, then <Katex math={r`\int_a^b f \geq \int_a^b g`} />.</p>
		</Callout>

		<DigDeeper title="Even and odd functions">
			<div class="neo-prose">
				<p>When the interval is symmetric about the origin, symmetry simplifies computation:</p>
				<p><strong>Even functions</strong> (<Katex math={r`f(-x) = f(x)`} />): <Katex math={r`\int_{-a}^{a} f(x)\,dx = 2\int_0^a f(x)\,dx`} />. The two halves contribute equally.</p>
				<p><strong>Odd functions</strong> (<Katex math={r`f(-x) = -f(x)`} />): <Katex math={r`\int_{-a}^{a} f(x)\,dx = 0`} />. The two halves cancel perfectly.</p>
				<p>For example, <Katex math={r`\int_{-1}^{1} x^3\,dx = 0`} /> because <Katex math={r`x^3`} /> is odd, while <Katex math={r`\int_{-1}^{1} x^2\,dx = 2\int_0^1 x^2\,dx = \frac{2}{3}`} /> because <Katex math={r`x^2`} /> is even.</p>
			</div>
		</DigDeeper>

		<!-- ═══ SECTION: Constancy Principle ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Constancy Principle</h3>
			<p>One consequence of the FTC deserves to be stated on its own, because it bridges the infinitesimal and the global in a striking way.</p>
		</div>

		<Callout type="theorem" title="The Constancy Principle">
			<p>If <Katex math={r`f'(x) = 0`} /> for all <Katex math="x" /> in an interval, then <Katex math="f" /> is constant on that interval.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p><strong>Why it's true.</strong> If <Katex math={r`f'(x) = 0`} /> everywhere, then at every point the slope equation gives <Katex math={r`f(x + d) = f(x) + f'(x) \cdot d = f(x) + 0 \cdot d = f(x)`} />. So <Katex math={r`f`} /> doesn't change when we nudge by any infinitesimal. But any finite displacement is composed of infinitesimal displacements, each of which leaves <Katex math={r`f`} /> unchanged. Therefore <Katex math={r`f`} /> never changes — it is constant.</p>
			<p>This principle has an immediate and important corollary:</p>
		</div>

		<Callout type="key-idea" title="Antiderivatives Differ by a Constant">
			<p>If <Katex math={r`F'(x) = G'(x)`} /> for all <Katex math="x" />, then <Katex math={r`F(x) - G(x) = C`} /> for some constant <Katex math="C" />.</p>
			<p>Proof: Let <Katex math={r`h(x) = F(x) - G(x)`} />. Then <Katex math={r`h'(x) = F'(x) - G'(x) = 0`} />, so by the Constancy Principle, <Katex math="h" /> is constant.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>This is why indefinite integrals always carry "<Katex math={r`+ C`} />." There is an entire <em>family</em> of antiderivatives, all differing by a constant, and each one is equally valid.</p>
		</div>

		<!-- ═══ SECTION: Substitution ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Integration by substitution</h3>
			<p>The chain rule in reverse. If <Katex math={r`F'(x) = f(x)`} />, then by the chain rule <Katex math={r`\frac{d}{dx}F(g(x)) = f(g(x)) \cdot g'(x)`} />. Reading this backwards:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int f(g(x))\,g'(x)\,dx = F(g(x)) + C`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>In practice, we let <Katex math={r`u = g(x)`} />, compute <Katex math={r`du = g'(x)\,dx`} />, substitute, integrate, and substitute back. But in SDG, the equation <Katex math={r`du = g'(x)\,dx`} /> is more than a useful mnemonic — it's a <em>literal</em> statement about infinitesimals.</p>
		</div>

		<SDGAdvantage>
			<p>In standard calculus, students are told to write <Katex math={r`du = g'(x)\,dx`} /> as a "formal manipulation" — a shorthand that works but isn't supposed to mean anything literally. Textbooks caution that <Katex math={r`du`} /> and <Katex math={r`dx`} /> are "not really fractions."</p>
			<p>In SDG, they <strong>are</strong> genuine infinitesimal quantities. The equation <Katex math={r`du = g'(x)\,dx`} /> is a real equation relating real (infinitesimal) quantities: when you nudge <Katex math={r`x`} /> by <Katex math={r`dx`} />, the quantity <Katex math={r`u = g(x)`} /> changes by exactly <Katex math={r`g'(x)\,dx`} />. No hand-waving required.</p>
		</SDGAdvantage>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — <Katex math={r`\int 2x \cos(x^2)\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Let } u = x^2, \text{ so } du = 2x\,dx`} display /></div><span class="step-note">substitution</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int \cos(u)\,du = \sin(u) + C`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \sin(x^2) + C`} display /></div><span class="step-note">substitute back ✓</span></div>
		</div>

		<!-- Harder substitution -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int x\sqrt{x+1}\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Let } u = x + 1, \text{ so } x = u - 1 \text{ and } dx = du`} display /></div><span class="step-note">substitution</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int (u-1)\sqrt{u}\,du = \int (u^{3/2} - u^{1/2})\,du`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{2}{5}u^{5/2} - \frac{2}{3}u^{3/2} + C`} display /></div><span class="step-note">power rule</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{2}{5}(x+1)^{5/2} - \frac{2}{3}(x+1)^{3/2} + C`} display /></div><span class="step-note">substitute back ✓</span></div>
		</div>

		<!-- Definite integral with bounds transformation -->
		<div class="neo-prose" use:reveal>
			<h3>Substitution in definite integrals</h3>
			<p>When applying substitution to a definite integral, you have a choice: substitute back and use the original bounds, or <strong>transform the bounds</strong> along with the variable. The second approach is cleaner.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int_0^2 x\,e^{x^2}\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`u = x^2,\quad du = 2x\,dx \implies x\,dx = \tfrac{1}{2}\,du`} display /></div><span class="step-note">substitution</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x = 0 \Rightarrow u = 0;\quad x = 2 \Rightarrow u = 4`} display /></div><span class="step-note">transform bounds</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{1}{2}\int_0^4 e^u\,du = \frac{1}{2}\left[e^u\right]_0^4`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{1}{2}(e^4 - 1)`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Integration by Parts ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Integration by parts</h3>
			<p>This technique follows immediately from the product rule. In SDG, the product rule gives us the identity <Katex math={r`(fg)' = f'g + fg'`} />. Integrate both sides over <Katex math={r`[a, b]`} />:</p>
			<Katex math={r`\int_a^b (fg)'\,dx = \int_a^b f'g\,dx + \int_a^b fg'\,dx`} display />
			<p>By the FTC, the left side is <Katex math={r`f(b)g(b) - f(a)g(a)`} />. Rearranging:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int f\,g'\,dx = fg - \int f'\,g\,dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The art lies in choosing <Katex math={r`f`} /> and <Katex math={r`g'`} /> wisely. A useful mnemonic is <strong>LIATE</strong> — choose <Katex math={r`f`} /> from this list in order of priority:</p>
		</div>

		<Callout type="key-idea" title="LIATE: How to Choose f">
			<p>When applying integration by parts, choose <Katex math="f" /> as the function that appears earliest in this list:</p>
			<p><strong>L</strong>ogarithmic (<Katex math={r`\ln x`} />) → <strong>I</strong>nverse trig (<Katex math={r`\arctan x`} />) → <strong>A</strong>lgebraic (<Katex math={r`x^n`} />) → <strong>T</strong>rigonometric (<Katex math={r`\sin x, \cos x`} />) → <strong>E</strong>xponential (<Katex math={r`e^x`} />)</p>
			<p>The idea: choose <Katex math="f" /> as the function that <em>simplifies</em> when differentiated. Polynomials lose a degree, logarithms become algebraic, and so on.</p>
		</Callout>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — <Katex math={r`\int x\,e^x\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`f = x,\; g' = e^x \implies f' = 1,\; g = e^x`} display /></div><span class="step-note">LIATE: x is algebraic, choose it for f</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int x\,e^x\,dx = x\,e^x - \int 1 \cdot e^x\,dx`} display /></div><span class="step-note">apply formula</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= x\,e^x - e^x + C = e^x(x-1) + C`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- Repeated IBP -->
		<div class="neo-prose" use:reveal>
			<h3>Repeated integration by parts</h3>
			<p>Sometimes one round isn't enough. If the remaining integral still contains a product of mismatched types, apply the formula again.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int x^2 e^x\,dx`} /> (IBP twice)</div>
			<div class="step"><div class="step-math"><Katex math={r`f = x^2,\; g' = e^x \implies f' = 2x,\; g = e^x`} display /></div><span class="step-note">first application</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= x^2 e^x - \int 2x\,e^x\,dx`} display /></div><span class="step-note">remaining integral needs IBP again</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int 2x\,e^x\,dx:\; f = 2x,\; g' = e^x \implies f' = 2,\; g = e^x`} display /></div><span class="step-note">second application</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 2x\,e^x - \int 2\,e^x\,dx = 2x\,e^x - 2e^x`} display /></div><span class="step-note">evaluate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\int x^2 e^x\,dx = x^2 e^x - 2x\,e^x + 2e^x + C = e^x(x^2 - 2x + 2) + C`} display /></div><span class="step-note">combine ✓</span></div>
		</div>

		<!-- Cycle trick -->
		<div class="neo-prose" use:reveal>
			<h3>The cycle trick</h3>
			<p>A remarkable situation arises when integration by parts produces the <em>original integral</em> on the right side. Rather than going in circles, we solve algebraically for the integral.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int e^x \sin x\,dx`} /> (cycle trick)</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Let } I = \int e^x \sin x\,dx`} display /></div><span class="step-note">name the integral</span></div>
			<div class="step"><div class="step-math"><Katex math={r`f = \sin x,\; g' = e^x \implies I = e^x \sin x - \int e^x \cos x\,dx`} display /></div><span class="step-note">first IBP</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int e^x \cos x\,dx:\; f = \cos x,\; g' = e^x`} display /></div><span class="step-note">second IBP</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= e^x \cos x - \int e^x(-\sin x)\,dx = e^x \cos x + I`} display /></div><span class="step-note">the original I reappears!</span></div>
			<div class="step"><div class="step-math"><Katex math={r`I = e^x \sin x - (e^x \cos x + I)`} display /></div><span class="step-note">substitute back</span></div>
			<div class="step"><div class="step-math"><Katex math={r`2I = e^x(\sin x - \cos x)`} display /></div><span class="step-note">collect I terms</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`I = \frac{e^x(\sin x - \cos x)}{2} + C`} display /></div><span class="step-note">solve for I ✓</span></div>
		</div>

		<!-- ═══ SECTION: Partial Fractions ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Partial fractions</h3>
			<p>When the integrand is a rational function — a ratio of polynomials — we can often break it into simpler pieces by <strong>partial fraction decomposition</strong>. The idea: a complicated fraction is the sum of simpler ones, each of which we know how to integrate.</p>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The simplest case arises when the denominator factors into distinct linear factors. If <Katex math={r`Q(x) = (x - r_1)(x - r_2) \cdots (x - r_k)`} />, then</p>
			<Katex math={r`\frac{P(x)}{Q(x)} = \frac{A_1}{x - r_1} + \frac{A_2}{x - r_2} + \cdots + \frac{A_k}{x - r_k}`} display />
			<p>where the constants <Katex math={r`A_1, A_2, \ldots, A_k`} /> are determined by clearing denominators and matching coefficients (or plugging in convenient values of <Katex math={r`x`} />).</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — <Katex math={r`\int \frac{1}{x^2 - 1}\,dx`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`\frac{1}{x^2-1} = \frac{1}{(x-1)(x+1)} = \frac{A}{x-1} + \frac{B}{x+1}`} display /></div><span class="step-note">factor and decompose</span></div>
			<div class="step"><div class="step-math"><Katex math={r`1 = A(x+1) + B(x-1)`} display /></div><span class="step-note">clear denominators</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x = 1: \; 1 = 2A \implies A = \tfrac{1}{2};\quad x = -1: \; 1 = -2B \implies B = -\tfrac{1}{2}`} display /></div><span class="step-note">plug in roots</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int \frac{1}{x^2-1}\,dx = \frac{1}{2}\int\frac{dx}{x-1} - \frac{1}{2}\int\frac{dx}{x+1}`} display /></div><span class="step-note">split and integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{1}{2}\ln\left|\frac{x-1}{x+1}\right| + C`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Area Between Curves ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Area between curves</h3>
			<p>The same infinitesimal strip idea extends naturally. If <Katex math={r`f(x) \geq g(x)`} /> on <Katex math={r`[a, b]`} />, then the infinitesimal strip at position <Katex math="x" /> has width <Katex math="d" /> and height <Katex math={r`f(x) - g(x)`} />. Its area is <Katex math={r`[f(x) - g(x)]\,d`} />, and the total area between the curves is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\text{Area} = \int_a^b \bigl[f(x) - g(x)\bigr]\,dx`} display />
		</div>

		<!-- Area between curves figure -->
		<div use:reveal>
			<JSXGraphBoard
				setup={setupAreaBetweenCurves}
				boundingbox={[-0.3, 1.8, 1.6, -0.3]}
				aspectRatio={(1.6 - -0.3) / (1.8 - -0.3)}
				number="5.2"
				caption="The area between y = x (blue) and y = x² (red) from 0 to 1. Each infinitesimal strip has height x − x²."
			/>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — Area between <Katex math={r`y = x`} /> and <Katex math={r`y = x^2`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`x = x^2 \implies x^2 - x = 0 \implies x(x - 1) = 0`} display /></div><span class="step-note">find intersections: x = 0, 1</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{On } [0,1]: \; x \geq x^2, \text{ so } f(x) - g(x) = x - x^2`} display /></div><span class="step-note">identify top and bottom</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\int_0^1 (x - x^2)\,dx = \left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{1}{2} - \frac{1}{3} = \frac{1}{6}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Average Value ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Average value of a function</h3>
			<p>What does it mean to "average" a function over an interval? Intuitively, the average value is the height of a rectangle with the same base and the same area as the region under the curve.</p>
			<p>If the rectangle has base <Katex math={r`b - a`} /> and height <Katex math={r`f_{\text{avg}}`} />, then its area must equal <Katex math={r`\int_a^b f(x)\,dx`} />:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f_{\text{avg}} = \frac{1}{b-a}\int_a^b f(x)\,dx`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — Average value of <Katex math={r`\sin x`} /> on <Katex math={r`[0, \pi]`} /></div>
			<div class="step"><div class="step-math"><Katex math={r`f_{\text{avg}} = \frac{1}{\pi - 0}\int_0^{\pi} \sin x\,dx`} display /></div><span class="step-note">apply formula</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{1}{\pi}\bigl[-\cos x\bigr]_0^{\pi} = \frac{1}{\pi}\bigl[-\cos\pi + \cos 0\bigr]`} display /></div><span class="step-note">evaluate antiderivative</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{1}{\pi}(1 + 1) = \frac{2}{\pi} \approx 0.637`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Arc Length ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Arc length</h3>
			<p>By microstraightness, each infinitesimal piece of a curve is a straight segment — not approximately, but <em>exactly</em>. Consider the curve <Katex math={r`y = f(x)`} />. Over the infinitesimal interval from <Katex math={r`x`} /> to <Katex math={r`x + d`} />, the curve moves horizontally by <Katex math={r`d`} /> and vertically by <Katex math={r`f'(x) \cdot d`} />. The length of this microstraight segment follows from the Pythagorean theorem:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Arc Length via Microstraightness</div>
			<div class="step"><div class="step-math"><Katex math={r`\Delta x = d, \quad \Delta y = f'(x)\,d`} display /></div><span class="step-note">horizontal and vertical displacements</span></div>
			<div class="step"><div class="step-math"><Katex math={r`ds = \sqrt{(\Delta x)^2 + (\Delta y)^2} = \sqrt{d^2 + f'(x)^2\,d^2}`} display /></div><span class="step-note">Pythagorean theorem on microstraight segment</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \sqrt{d^2\bigl(1 + f'(x)^2\bigr)} = |d|\,\sqrt{1 + f'(x)^2}`} display /></div><span class="step-note">factor out d²</span></div>
			<div class="step"><div class="step-math"><Katex math={r`ds = \sqrt{1 + f'(x)^2}\;\,d`} display /></div><span class="step-note">d is a positive displacement</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`s = \int_a^b \sqrt{1 + f'(x)^2}\,dx`} display /></div><span class="step-note">sum the infinitesimal lengths ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Note how the derivation is entirely geometric: each infinitesimal piece is literally a straight segment, so the Pythagorean theorem applies exactly, not approximately. There is no limiting argument.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — Arc length of <Katex math={r`y = x^{3/2}`} /> from 0 to 4</div>
			<div class="step"><div class="step-math"><Katex math={r`f'(x) = \tfrac{3}{2}x^{1/2}, \quad f'(x)^2 = \tfrac{9}{4}x`} display /></div><span class="step-note">compute derivative</span></div>
			<div class="step"><div class="step-math"><Katex math={r`s = \int_0^4 \sqrt{1 + \tfrac{9}{4}x}\,dx`} display /></div><span class="step-note">arc length formula</span></div>
			<div class="step"><div class="step-math"><Katex math={r`u = 1 + \tfrac{9}{4}x,\quad du = \tfrac{9}{4}\,dx \implies dx = \tfrac{4}{9}\,du`} display /></div><span class="step-note">substitute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x = 0 \Rightarrow u = 1; \quad x = 4 \Rightarrow u = 10`} display /></div><span class="step-note">transform bounds</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \frac{4}{9}\int_1^{10} u^{1/2}\,du = \frac{4}{9}\cdot\frac{2}{3}\left[u^{3/2}\right]_1^{10}`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{8}{27}\left(10\sqrt{10} - 1\right) \approx 9.07`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Improper Integrals ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Improper integrals</h3>
			<p>Throughout this chapter, we've reveled in the fact that SDG integration requires no limits — no epsilon-delta machinery, no "as <Katex math="n" /> approaches infinity." The infinitesimal strips are exact, and everything is algebraic.</p>
			<p>But there is <strong>one place</strong> where a limiting process is genuinely unavoidable: when the interval of integration is <em>infinite</em>, or when the integrand is <em>unbounded</em> on the interval. These are <strong>improper integrals</strong>, and even in SDG, we must confront infinity honestly.</p>
		</div>

		<Callout type="definition" title="Improper Integrals">
			<p><strong>Infinite interval.</strong> We define</p>
			<Katex math={r`\int_a^{\infty} f(x)\,dx = \lim_{R \to \infty} \int_a^R f(x)\,dx`} display />
			<p>if this limit exists. Similarly for <Katex math={r`\int_{-\infty}^b`} />.</p>
			<p><strong>Unbounded integrand.</strong> If <Katex math={r`f`} /> has a singularity at <Katex math={r`c \in [a, b]`} />, we define</p>
			<Katex math={r`\int_a^b f(x)\,dx = \lim_{\varepsilon \to 0^+} \int_a^{c-\varepsilon} f(x)\,dx + \lim_{\varepsilon \to 0^+} \int_{c+\varepsilon}^b f(x)\,dx`} display />
			<p>If the limit(s) exist, the integral <strong>converges</strong>; otherwise it <strong>diverges</strong>.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>For example, <Katex math={r`\int_1^{\infty} \frac{1}{x^2}\,dx = \lim_{R \to \infty}\left[-\frac{1}{x}\right]_1^R = \lim_{R \to \infty}\left(-\frac{1}{R} + 1\right) = 1`} />. The area under the curve is finite even though the region extends infinitely far. But <Katex math={r`\int_1^{\infty} \frac{1}{x}\,dx`} /> diverges — the area is infinite.</p>
			<p>This is a genuine limiting process, and SDG doesn't eliminate it. The infinitesimal framework handles each <em>finite</em> integral exactly, but the passage to an infinite domain requires an honest limit. SDG is not a magic wand — it simplifies the finite, but respects the infinite.</p>
		</div>

		<!-- ═══ SECTION: Standard Calculus Comparison ═══ -->
		<StandardCalcBox>
			<p>In standard calculus, integration begins with <strong>Riemann sums</strong>: partition <Katex math={r`[a,b]`} /> into <Katex math="n" /> subintervals, form the sum <Katex math={r`\sum_{i=1}^n f(x_i^*)\,\Delta x`} />, and take the limit as <Katex math={r`n \to \infty`} />. This requires proving the limit exists, that it's independent of partition and sample points, and then developing the FTC separately. In SDG, each infinitesimal strip contributes <Katex math={r`f(x)\,d`} /> exactly — no approximation, no limit. The FTC follows in four lines of algebra.</p>
		</StandardCalcBox>

		<!-- ═══ HISTORY ═══ -->
		<HistoryBox name="John L. Bell" years="1945–2024">
			<p>Bell wrote <em>A Primer of Infinitesimal Analysis</em> — the most accessible book on this approach. His geometric proof of the Fundamental Theorem (the vanishing triangle argument above) shows how microstraightness makes integration beautifully simple. Bell spent decades demonstrating that SDG could serve as a full foundation for calculus and differential geometry, making rigorous what Leibniz had only intuited.</p>
		</HistoryBox>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li>The <strong>Fundamental Theorem of Calculus</strong> says <Katex math={r`A'(x) = f(x)`} />: differentiation and integration are inverse operations.</li>
				<li>In SDG, the FTC follows from the vanishing triangle: the infinitesimal strip has area <Katex math={r`f(x)\,d`} /> exactly, because the triangle's area involves <Katex math={r`d^2 = 0`} />.</li>
				<li>The <strong>Constancy Principle</strong>: if <Katex math={r`f'(x) = 0`} /> everywhere, then <Katex math="f" /> is constant. Antiderivatives differ by at most <Katex math={r`C`} />.</li>
				<li><strong>Substitution</strong> reverses the chain rule. In SDG, <Katex math={r`du = g'(x)\,dx`} /> is a literal equation about infinitesimals.</li>
				<li><strong>Integration by parts</strong> reverses the product rule: <Katex math={r`\int f\,g' = fg - \int f'\,g`} />. Use LIATE to choose <Katex math="f" />.</li>
				<li><strong>Partial fractions</strong> decompose rational functions into simpler terms that integrate to logarithms and arctangents.</li>
				<li><strong>Area between curves:</strong> <Katex math={r`\int_a^b [f(x) - g(x)]\,dx`} /> when <Katex math={r`f \geq g`} />.</li>
				<li><strong>Average value:</strong> <Katex math={r`f_{\text{avg}} = \frac{1}{b-a}\int_a^b f`} />.</li>
				<li><strong>Arc length:</strong> <Katex math={r`\int_a^b \sqrt{1 + f'(x)^2}\,dx`} />, derived exactly via the Pythagorean theorem on microstraight segments.</li>
				<li><strong>Improper integrals</strong> are the one place where SDG must invoke a genuine limit — to handle infinite intervals or unbounded integrands.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>

			<!-- Basic antiderivatives -->
			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Find <Katex math={r`\int x^3\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`\frac{x^4}{4} + C`} /> (reverse the power rule: increase exponent by 1, divide by new exponent).</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Find <Katex math={r`\int (5x^4 - 3x^2 + 1)\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`x^5 - x^3 + x + C`} />. Integrate term by term using the power rule.</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Warm-up.</strong> Find <Katex math={r`\int \bigl(3\sin x + e^x\bigr)\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`-3\cos x + e^x + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p><strong>Warm-up.</strong> Find <Katex math={r`\int \sec^2 x\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`\tan x + C`} />, since <Katex math={r`(\tan x)' = \sec^2 x`} />.</p>{/snippet}
			</Exercise>

			<!-- Definite integrals -->
			<Exercise number={5}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_0^{\pi} \sin x\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`[-\cos x]_0^{\pi} = -\cos(\pi) + \cos(0) = 1 + 1 = 2`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_1^3 (2x + 1)\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`[x^2 + x]_1^3 = (9 + 3) - (1 + 1) = 10`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_0^1 (6x^2 - 4x + 3)\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`[2x^3 - 2x^2 + 3x]_0^1 = 2 - 2 + 3 = 3`} />.</p>{/snippet}
			</Exercise>

			<!-- Substitution -->
			<Exercise number={8}>
				<p><strong>Core.</strong> Use substitution to find <Katex math={r`\int \frac{2x}{1+x^2}\,dx`} />.</p>
				{#snippet solution()}<p>Let <Katex math={r`u = 1+x^2`} />, <Katex math={r`du = 2x\,dx`} />. Then <Katex math={r`\int \frac{du}{u} = \ln|u| + C = \ln(1+x^2) + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> Find <Katex math={r`\int x^2\sqrt{x^3+1}\,dx`} />.</p>
				{#snippet solution()}<p>Let <Katex math={r`u = x^3 + 1`} />, <Katex math={r`du = 3x^2\,dx`} />. Then <Katex math={r`\int \frac{1}{3}\sqrt{u}\,du = \frac{1}{3}\cdot\frac{2}{3}u^{3/2} + C = \frac{2}{9}(x^3+1)^{3/2} + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_0^{\pi/2} \cos x \cdot e^{\sin x}\,dx`} />.</p>
				{#snippet solution()}<p>Let <Katex math={r`u = \sin x`} />, <Katex math={r`du = \cos x\,dx`} />. Bounds: <Katex math={r`x=0 \Rightarrow u=0`} />, <Katex math={r`x=\pi/2 \Rightarrow u=1`} />. <Katex math={r`\int_0^1 e^u\,du = [e^u]_0^1 = e - 1`} />.</p>{/snippet}
			</Exercise>

			<!-- IBP -->
			<Exercise number={11}>
				<p><strong>Core.</strong> Use integration by parts to find <Katex math={r`\int x\cos x\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`f=x, \; g'=\cos x \implies f'=1, \; g=\sin x`} />. So <Katex math={r`x\sin x - \int \sin x\,dx = x\sin x + \cos x + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Challenge.</strong> Find <Katex math={r`\int \ln x\,dx`} />.</p>
				{#snippet solution()}<p><Katex math={r`f = \ln x, \; g' = 1 \implies f' = 1/x, \; g = x`} />. So <Katex math={r`x\ln x - \int \frac{x}{x}\,dx = x\ln x - x + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p><strong>Challenge.</strong> Find <Katex math={r`\int e^x \cos x\,dx`} /> using the cycle trick.</p>
				{#snippet solution()}<p>Let <Katex math={r`I = \int e^x\cos x\,dx`} />. IBP twice: first with <Katex math={r`f=\cos x, g'=e^x`} />, then with <Katex math={r`f=\sin x, g'=e^x`} />. We get <Katex math={r`I = e^x\cos x + e^x\sin x - I`} />, so <Katex math={r`2I = e^x(\cos x + \sin x)`} />, giving <Katex math={r`I = \frac{e^x(\cos x + \sin x)}{2} + C`} />.</p>{/snippet}
			</Exercise>

			<!-- Partial fractions -->
			<Exercise number={14}>
				<p><strong>Challenge.</strong> Find <Katex math={r`\int \frac{3}{x^2 + 3x + 2}\,dx`} />.</p>
				{#snippet solution()}<p>Factor: <Katex math={r`x^2 + 3x + 2 = (x+1)(x+2)`} />. Decompose: <Katex math={r`\frac{3}{(x+1)(x+2)} = \frac{A}{x+1} + \frac{B}{x+2}`} />. Solving: <Katex math={r`A = 3, B = -3`} />. So <Katex math={r`3\ln|x+1| - 3\ln|x+2| + C = 3\ln\left|\frac{x+1}{x+2}\right| + C`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={15}>
				<p><strong>Challenge.</strong> Find <Katex math={r`\int \frac{x + 5}{x^2 - x - 6}\,dx`} />.</p>
				{#snippet solution()}<p>Factor: <Katex math={r`x^2 - x - 6 = (x-3)(x+2)`} />. Partial fractions: <Katex math={r`\frac{x+5}{(x-3)(x+2)} = \frac{A}{x-3} + \frac{B}{x+2}`} />. Clear denominators: <Katex math={r`x+5 = A(x+2) + B(x-3)`} />. Set <Katex math={r`x=3`} />: <Katex math={r`8=5A \implies A=8/5`} />. Set <Katex math={r`x=-2`} />: <Katex math={r`3=-5B \implies B=-3/5`} />. Result: <Katex math={r`\frac{8}{5}\ln|x-3| - \frac{3}{5}\ln|x+2| + C`} />.</p>{/snippet}
			</Exercise>

			<!-- Area between curves -->
			<Exercise number={16}>
				<p><strong>Core.</strong> Find the area enclosed between <Katex math={r`y = x^2`} /> and <Katex math={r`y = 2x`} />.</p>
				{#snippet solution()}<p>Intersections: <Katex math={r`x^2 = 2x \implies x = 0, 2`} />. On <Katex math={r`[0,2]`} />, <Katex math={r`2x \geq x^2`} />. Area: <Katex math={r`\int_0^2 (2x - x^2)\,dx = [x^2 - x^3/3]_0^2 = 4 - 8/3 = 4/3`} />.</p>{/snippet}
			</Exercise>

			<Exercise number={17}>
				<p><strong>Challenge.</strong> Find the area between <Katex math={r`y = \sin x`} /> and <Katex math={r`y = \cos x`} /> from <Katex math={r`x = 0`} /> to <Katex math={r`x = \pi/2`} />.</p>
				{#snippet solution()}<p>The curves cross at <Katex math={r`x = \pi/4`} />. On <Katex math={r`[0, \pi/4]`} />, <Katex math={r`\cos x \geq \sin x`} />; on <Katex math={r`[\pi/4, \pi/2]`} />, <Katex math={r`\sin x \geq \cos x`} />. Area: <Katex math={r`\int_0^{\pi/4}(\cos x - \sin x)\,dx + \int_{\pi/4}^{\pi/2}(\sin x - \cos x)\,dx = [\sin x + \cos x]_0^{\pi/4} + [-\cos x - \sin x]_{\pi/4}^{\pi/2} = (\sqrt{2} - 1) + (- 1 - (-\sqrt{2})) = 2\sqrt{2} - 2`} />.</p>{/snippet}
			</Exercise>

			<!-- Average value -->
			<Exercise number={18}>
				<p><strong>Core.</strong> Find the average value of <Katex math={r`f(x) = x^2`} /> on <Katex math={r`[0, 3]`} />.</p>
				{#snippet solution()}<p><Katex math={r`f_{\text{avg}} = \frac{1}{3}\int_0^3 x^2\,dx = \frac{1}{3}\left[\frac{x^3}{3}\right]_0^3 = \frac{1}{3}\cdot 9 = 3`} />.</p>{/snippet}
			</Exercise>

			<!-- Arc length -->
			<Exercise number={19}>
				<p><strong>Challenge.</strong> Find the arc length of <Katex math={r`y = \frac{x^2}{2}`} /> from <Katex math={r`x = 0`} /> to <Katex math={r`x = 1`} />.</p>
				{#snippet solution()}<p><Katex math={r`f'(x) = x`} />, so <Katex math={r`s = \int_0^1 \sqrt{1+x^2}\,dx`} />. Using the standard result (or trig substitution <Katex math={r`x = \tan\theta`} />): <Katex math={r`s = \left[\frac{x\sqrt{1+x^2}}{2} + \frac{1}{2}\ln\bigl(x+\sqrt{1+x^2}\bigr)\right]_0^1 = \frac{\sqrt{2}}{2} + \frac{1}{2}\ln(1+\sqrt{2}) \approx 1.148`} />.</p>{/snippet}
			</Exercise>

			<!-- Verify FTC -->
			<Exercise number={20}>
				<p><strong>Exploration.</strong> Verify the FTC directly: let <Katex math={r`A(x) = \int_0^x t^2\,dt`} />. (a) Compute <Katex math={r`A(x)`} /> explicitly. (b) Compute <Katex math={r`A'(x)`} />. (c) Check that <Katex math={r`A'(x) = x^2`} />.</p>
				{#snippet solution()}<p>(a) <Katex math={r`A(x) = [t^3/3]_0^x = x^3/3`} />. (b) <Katex math={r`A'(x) = (x^3/3)' = x^2`} />. (c) Indeed <Katex math={r`A'(x) = x^2 = f(x)`} />, confirming the FTC. The rate at which area accumulates equals the height of the curve.</p>{/snippet}
			</Exercise>

			<Exercise number={21}>
				<p><strong>Exploration.</strong> Explain in your own words why the equation <Katex math={r`du = g'(x)\,dx`} /> in substitution is "literally true" in SDG, whereas in standard calculus it is treated as a convenient shorthand. What changes about its meaning?</p>
				{#snippet solution()}<p>In SDG, <Katex math={r`dx`} /> is a genuine infinitesimal quantity — a number <Katex math={r`d`} /> in the number line with <Katex math={r`d^2 = 0`} />. When we write <Katex math={r`du = g'(x)\,dx`} />, this is a real equation: nudging <Katex math={r`x`} /> by the infinitesimal <Katex math={r`dx`} /> changes <Katex math={r`u = g(x)`} /> by exactly <Katex math={r`g'(x)\,dx`} /> (with no error, since <Katex math={r`d^2 = 0`} /> kills all higher-order terms). In standard calculus, <Katex math={r`dx`} /> and <Katex math={r`du`} /> are not numbers — they're part of a limiting notation. The equation works as a rule for manipulating symbols, but the symbols don't refer to actual quantities.</p>{/snippet}
			</Exercise>
		</div>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>We've learned to compute areas, find antiderivatives, and measure arc lengths. In the next chapter, we turn these ideas loose in three dimensions. We'll revolve curves to create solids, compute their volumes and surface areas, and apply integration to physics: work, center of mass, and pressure. The infinitesimal approach makes every setup transparent — slice the object, write down the infinitesimal contribution, and integrate.</p>
		</LookingAhead>

		<NextChapter href="ch6" title="Applications of Integration" number="6" />
	</div>
</section>

<style>
	.reference-table {
		margin: var(--space-md) 0;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: 0.75rem;
		padding: 1.25rem var(--space-md);
		overflow-x: auto;
	}

	.reference-table table {
		width: 100%;
		border-collapse: collapse;
		font-size: 1rem;
	}

	.reference-table th {
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-ink-faint);
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 2px solid var(--color-border);
	}

	.reference-table td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid var(--color-border-light, #f0ece4);
		vertical-align: middle;
	}

	.reference-table tr:last-child td {
		border-bottom: none;
	}

	.reference-table tr:hover td {
		background: var(--color-d-glow, #faf5ff);
	}

	.reference-table td:last-child {
		font-size: 0.88rem;
		color: var(--color-ink-light);
		font-style: italic;
	}
</style>
