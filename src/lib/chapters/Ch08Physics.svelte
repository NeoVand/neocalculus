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
	import SDGAdvantage from '$lib/components/SDGAdvantage.svelte';
	import NextChapter from '$lib/components/NextChapter.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupKepler(JXG: any, board: any) {
		// Elliptical orbit
		const a = 3,
			b = 2; // semi-axes
		board.create(
			'curve',
			[(t: number) => a * Math.cos(t), (t: number) => b * Math.sin(t), 0, 2 * Math.PI],
			{
				strokeColor: '#1a1a2e',
				strokeWidth: 2,
				highlight: false
			}
		);

		// Focus (sun) at (-c, 0) where c = sqrt(a²-b²)
		const c = Math.sqrt(a * a - b * b);
		const O = board.create('point', [-c, 0], {
			size: 5,
			fillColor: '#f59e0b',
			strokeColor: '#d97706',
			name: 'O',
			label: { fontSize: 14, offset: [-15, -5] },
			fixed: true,
			highlight: false
		});

		// Point P on the orbit
		const theta1 = 0.6;
		const P = board.create('point', [a * Math.cos(theta1), b * Math.sin(theta1)], {
			size: 4,
			fillColor: '#1a1a2e',
			strokeColor: '#1a1a2e',
			name: 'P',
			label: { fontSize: 14, offset: [5, 5] },
			fixed: true,
			highlight: false
		});

		// Point Q (infinitesimally close to P on the orbit)
		const theta2 = theta1 + 0.25;
		const Q = board.create('point', [a * Math.cos(theta2), b * Math.sin(theta2)], {
			size: 4,
			fillColor: '#a855f7',
			strokeColor: '#a855f7',
			name: 'Q',
			label: { fontSize: 14, offset: [5, 5], color: '#a855f7' },
			fixed: true,
			highlight: false
		});

		// Triangle OPQ
		board.create('polygon', [O, P, Q], {
			fillColor: 'rgba(168,85,247,0.12)',
			strokeWidth: 0,
			highlight: false,
			vertices: { visible: false },
			borders: { strokeColor: '#a855f7', strokeWidth: 1.5, highlight: false }
		});

		// Radius lines
		board.create('segment', [O, P], { strokeColor: '#1a1a2e', strokeWidth: 1.5, highlight: false });
		board.create('segment', [O, Q], { strokeColor: '#a855f7', strokeWidth: 1.5, highlight: false });

		// Radius label
		const mx = (-c + a * Math.cos(theta1)) / 2;
		const my = (0 + b * Math.sin(theta1)) / 2;
		board.create('text', [mx - 0.15, my + 0.2, 'r'], {
			fontSize: 15,
			color: '#1a1a2e',
			fontStyle: 'italic',
			highlight: false
		});

		// Area label
		board.create('text', [0.2, 0.8, 'area = ½r²dθ'], {
			fontSize: 13,
			color: '#a855f7',
			anchorX: 'middle',
			highlight: false,
			fontWeight: '500'
		});

		// Angle arc at O
		board.create('angle', [P, O, Q], {
			radius: 0.5,
			name: 'dθ',
			strokeColor: '#a855f7',
			fillColor: 'rgba(168,85,247,0.08)',
			highlight: false,
			label: { fontSize: 13, color: '#a855f7', offset: [0, 0] }
		});
	}
</script>

<section class="chapter" id="ch8">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 6</span>
			<h2 class="chapter-title">Differential Equations and Physics Modeling</h2>
			<div class="chapter-epigraph">
				<blockquote>"The book of nature is written in the language of mathematics."</blockquote>
				<p class="epigraph-attr">— Galileo Galilei, <em>The Assayer</em>, 1623</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ OPENING MOTIVATION ═══ -->
		<div class="neo-prose" use:reveal>
			<p>
				In 1589 — so the legend goes — Galileo climbed the Tower of Pisa, held out two balls of
				different weight, and let them fall. They hit the ground at the same instant. Heavy or
				light, every object falls the same way.
			</p>
			<p>
				But <em>how</em> does it fall? How fast is it going after one second? After two? How long does
				it take to hit the ground from a height of 50 meters? These are the questions that launched modern
				physics, and they are the questions that calculus was invented to answer.
			</p>
			<p>
				In Neocalculus, the connection between physics and calculus is even more direct than in the
				standard treatment. Physical quantities like velocity and acceleration are <em>literal</em> infinitesimal
				ratios, not limits of ratios. Force, energy, momentum — each concept emerges from one line of
				infinitesimal algebra. Let's see how.
			</p>
		</div>

		<!-- ═══ SECTION: Velocity and Acceleration ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Velocity and Acceleration</h3>
			<p>
				If a particle is at position <Katex math={r`x(t)`} /> at time <Katex math="t" />, then in an
				infinitesimal time <span class="d-highlight">d</span>:
			</p>
		</div>

		<!-- Position-Velocity-Acceleration chain figure -->
		<Figure
			number="8.1"
			caption="The chain of derivatives: position → velocity → acceleration. Each is the infinitesimal rate of change of the previous."
		>
			<svg
				viewBox="0 0 440 80"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style="max-width:440px"
			>
				<!-- boxes -->
				<rect
					x="10"
					y="20"
					width="100"
					height="40"
					rx="8"
					fill="#eff6ff"
					stroke="#3b82f6"
					stroke-width="1.5"
				/>
				<text
					x="60"
					y="45"
					text-anchor="middle"
					font-size="14"
					font-family="Crimson Pro,serif"
					fill="#2563eb"
					font-style="italic">x(t)</text
				>
				<text
					x="60"
					y="72"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#94919b">position</text
				>
				<rect
					x="170"
					y="20"
					width="100"
					height="40"
					rx="8"
					fill="#ecfdf5"
					stroke="#059669"
					stroke-width="1.5"
				/>
				<text
					x="220"
					y="45"
					text-anchor="middle"
					font-size="14"
					font-family="Crimson Pro,serif"
					fill="#059669"
					font-style="italic">v(t)</text
				>
				<text
					x="220"
					y="72"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#94919b">velocity</text
				>
				<rect
					x="330"
					y="20"
					width="100"
					height="40"
					rx="8"
					fill="#faf5ff"
					stroke="#a855f7"
					stroke-width="1.5"
				/>
				<text
					x="380"
					y="45"
					text-anchor="middle"
					font-size="14"
					font-family="Crimson Pro,serif"
					fill="#a855f7"
					font-style="italic">a(t)</text
				>
				<text
					x="380"
					y="72"
					text-anchor="middle"
					font-size="9"
					font-family="Inter,sans-serif"
					fill="#94919b">acceleration</text
				>
				<!-- arrows -->
				<line
					x1="112"
					y1="40"
					x2="165"
					y2="40"
					stroke="#1a1a2e"
					stroke-width="1.5"
					marker-end="url(#arr)"
				/>
				<text
					x="138"
					y="33"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#a855f7"
					font-style="italic">d/dt</text
				>
				<line
					x1="272"
					y1="40"
					x2="325"
					y2="40"
					stroke="#1a1a2e"
					stroke-width="1.5"
					marker-end="url(#arr)"
				/>
				<text
					x="298"
					y="33"
					text-anchor="middle"
					font-size="10"
					font-family="Crimson Pro,serif"
					fill="#a855f7"
					font-style="italic">d/dt</text
				>
				<defs
					><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"
						><path d="M0,0 L6,3 L0,6" fill="#1a1a2e" /></marker
					></defs
				>
			</svg>
		</Figure>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t+d) = x(t) + v(t)\,d, \qquad v(t+d) = v(t) + a(t)\,d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Velocity is the slope of the position function. Acceleration is the slope of velocity. These
				are literal infinitesimal displacements — not limits.
			</p>
			<p>
				Over an infinitesimal time interval <span class="d-highlight">d</span>, the particle moves
				exactly <Katex math={r`v(t) \cdot d`} /> — no higher-order corrections needed, because <Katex
					math="d^2 = 0"
				/>. The path is microstraight: too short to curve.
			</p>
		</div>

		<HistoryBox name="Isaac Newton" years="1643–1727">
			<p>
				Newton called infinitesimals "fluxions" and used them to derive the laws of motion and
				universal gravitation. His methods were essentially the same algebra we use here — expand,
				drop vanishing terms, read off the answer. The epsilon-delta formalism came 150 years later.
			</p>
		</HistoryBox>

		<!-- ═══ SECTION: Newton's Second Law ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Newton's Second Law</h3>
		</div>

		<Callout type="theorem" title="Newton's Second Law (Infinitesimal Form)">
			<Katex math={r`F(t) = m \cdot a(t) = m \cdot \frac{v(t+d) - v(t)}{d}`} display />
			<p>Force equals mass times the infinitesimal rate of change of velocity.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				This is not an approximation or a limit — it is the <em>exact</em> statement that force is mass
				times the slope of velocity. From this single equation, all of classical mechanics follows.
			</p>
		</div>

		<!-- ═══ SECTION: Projectile Motion ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Projectile Motion</h3>
			<p>
				A ball thrown upward with initial velocity <Katex math={r`v_0`} /> under constant gravity <Katex
					math="g"
				/>. Let's answer Galileo's question.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving Projectile Motion</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`a(t) = -g \text{ (constant downward)}`} display />
				</div>
				<span class="step-note">gravity</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`v(t+d) = v(t) - g\,d`} display /></div>
				<span class="step-note">infinitesimal update</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`v(t+d) - v(t) = -g \cdot d \text{ for every infinitesimal } d`} display />
				</div>
				<span class="step-note">slope of v is −g</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{By microstraightness: } v \text{ has constant slope } {-g}, \text{ so } v \text{ is linear}`}
						display
					/>
				</div>
				<span class="step-note">v(t) = v₀ − gt</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x(t+d) = x(t) + (v_0 - gt)\,d`} display /></div>
				<span class="step-note">integrate v</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`x'(t) = v_0 - gt \implies x(t) = v_0 t - \tfrac{1}{2}gt^2`} display />
				</div>
				<span class="step-note">by antidifferentiation (Ch 6)</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`x(t) = v_0 t - \frac{1}{2}gt^2`} display /></div>
				<span class="step-note">the parabolic trajectory ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Let's pause at the key step. We had <Katex math={r`v(t+d) - v(t) = -g \cdot d`} /> for
				<em>every</em>
				infinitesimal <Katex math="d" />. By the Kock-Lawvere axiom, this means the function <Katex
					math={r`v`}
				/> is affine on every infinitesimal neighborhood — its slope is <Katex math="-g" /> everywhere.
				A function with constant slope is linear, so <Katex math={r`v(t) = v_0 - gt`} />. No "taking
				a limit" needed. The infinitesimal equation <em>is</em> the global result.
			</p>
		</div>

		<InlinePlot
			fn={(t) => 20 * t - 5 * t * t}
			domain={[0, 4]}
			range={[-2, 22]}
			caption="Projectile height: x(t) = 20t − 5t². Maximum at t = 2."
			tangentAt={2}
		/>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Galileo's answer:</strong> A ball dropped from rest (<Katex math={r`v_0 = 0`} />)
				from height <Katex math="h" /> hits the ground when <Katex
					math={r`h = \tfrac{1}{2}gt^2`}
				/>, so <Katex math={r`t = \sqrt{2h/g}`} />. From 50 meters: <Katex
					math={r`t = \sqrt{100/9.8} \approx 3.2`}
				/> seconds — regardless of the ball's weight.
			</p>
		</div>

		<!-- ═══ SECTION: Simple Harmonic Motion — DERIVED ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Simple Harmonic Motion</h3>
			<p>
				A mass on a spring obeys Hooke's law: <Katex math={r`F = -kx`} />. By Newton's second law, <Katex
					math={r`ma = -kx`}
				/>, so:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`x''(t) = -\omega^2 x(t), \qquad \omega^2 = k/m`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				In the previous chapter, we had merely <em>verified</em> that sine and cosine satisfy this
				equation. Now let's do something more powerful: <strong>derive</strong> the solution using
				the <Katex math="D_n" /> Taylor expansion from Chapter 7.
			</p>
			<p>
				Recall that for two independent infinitesimals <Katex math={r`d_1, d_2`} /> (each squaring to
				zero, but <Katex math={r`d_1 d_2 \neq 0`} />):
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t + d_1 + d_2) = x(t) + x'(t)(d_1 + d_2) + x''(t) \cdot d_1 d_2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is the second-order Taylor expansion — exact, not approximate — from the <Katex
					math="D_2"
				/> axiom. Now substitute <Katex math={r`x'' = -\omega^2 x`} />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving the SHM Solution via Taylor Expansion</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`x(t + d_1 + d_2) = x(t) + x'(t)(d_1{+}d_2) - \omega^2 x(t)\, d_1 d_2`}
						display
					/>
				</div>
				<span class="step-note">substitute x'' = −ω²x</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{Write } x(t) = \sum_{n=0}^{\infty} a_n t^n. \text{ Then } x'' = \sum_{n=2}^{\infty} n(n{-}1) a_n t^{n-2}`}
						display
					/>
				</div>
				<span class="step-note">power series ansatz</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`x'' = -\omega^2 x \implies (n{+}2)(n{+}1)\,a_{n+2} = -\omega^2 a_n`}
						display
					/>
				</div>
				<span class="step-note">match coefficients</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`a_{n+2} = \frac{-\omega^2}{(n+2)(n+1)}\,a_n`} display />
				</div>
				<span class="step-note">the recurrence</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Starting from <Katex math={r`a_0 = x(0)`} /> and <Katex math={r`a_1 = x'(0)`} />, the
				recurrence generates two independent chains:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Even coefficients (from a₀)</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`a_0, \quad a_2 = \frac{-\omega^2}{2!}\,a_0, \quad a_4 = \frac{\omega^4}{4!}\,a_0, \quad a_6 = \frac{-\omega^6}{6!}\,a_0, \;\ldots`}
						display
					/>
				</div>
				<span class="step-note">these are the coefficients of cos(ωt)</span>
			</div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Odd coefficients (from a₁)</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`a_1, \quad a_3 = \frac{-\omega^2}{3!}\,a_1, \quad a_5 = \frac{\omega^4}{5!}\,a_1, \quad a_7 = \frac{-\omega^6}{7!}\,a_1, \;\ldots`}
						display
					/>
				</div>
				<span class="step-note">these are the coefficients of sin(ωt)/ω</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Summing both chains and recalling the Taylor series from Chapter 7:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t) = x(0)\cos(\omega t) + \frac{x'(0)}{\omega}\sin(\omega t)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Sine and cosine don't appear from nowhere — they <strong>emerge</strong> from the recurrence <Katex
					math={r`a_{n+2} = -\omega^2 a_n / [(n+2)(n+1)]`}
				/>. The ODE <em>forces</em> the solution to be sinusoidal. This is the Taylor machinery of
				Chapter 7 paying off beautifully: the <Katex math="D_n" /> expansion generates the recurrence,
				and the recurrence builds the familiar trig functions term by term.
			</p>
		</div>

		<InlinePlot
			fn={(t) => 2 * Math.cos(1.5 * t) + (1 / 1.5) * Math.sin(1.5 * t)}
			domain={[0, 8]}
			range={[-3, 3]}
			caption="SHM: x(t) = 2cos(1.5t) + (1/1.5)sin(1.5t). The motion oscillates forever."
		/>

		<DigDeeper title="Why the D₂ expansion is the key">
			<p>
				The critical insight is that the <Katex math="D_2" /> Taylor expansion <Katex
					math={r`x(t+d_1+d_2) = x(t) + x'(t)(d_1+d_2) + x''(t)d_1 d_2`}
				/> is <em>exact</em> — not truncated. When we substitute the ODE <Katex
					math={r`x'' = -\omega^2 x`}
				/>, we get a functional equation that the solution must satisfy for all infinitesimals.
				Expanding in a power series and matching coefficients is then pure algebra. No
				existence-and-uniqueness theorems needed — the infinitesimal structure does the work.
			</p>
		</DigDeeper>

		<!-- ═══ SECTION: Conservation of Energy ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Conservation of Energy</h3>
			<p>
				Here is one of the most elegant results in all of physics, and in Neocalculus it takes
				exactly <strong>one line</strong>.
			</p>
			<p>
				Suppose a particle of mass <Katex math="m" /> moves under a force derived from a potential: <Katex
					math={r`F = -V'(x)`}
				/>, where <Katex math="V(x)" /> is the potential energy. Define:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`E = \underbrace{\tfrac{1}{2}mv^2}_{\text{kinetic energy}} + \underbrace{V(x)}_{\text{potential energy}}`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				We claim <Katex math="E" /> never changes. Let's compute the infinitesimal change <Katex
					math="dE"
				/>:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Conservation of Energy</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`d(\tfrac{1}{2}mv^2) = mv \cdot dv = m\,a \cdot v \cdot dt = F \cdot v \cdot dt`}
						display
					/>
				</div>
				<span class="step-note">chain rule + F = ma</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`d(V(x)) = V'(x) \cdot dx = V'(x) \cdot v \cdot dt = -F \cdot v \cdot dt`}
						display
					/>
				</div>
				<span class="step-note">chain rule + F = −V'(x)</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`dE = d(\tfrac{1}{2}mv^2) + d(V(x)) = F v\,dt - F v\,dt = 0`} display />
				</div>
				<span class="step-note">energy is conserved ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				That's it. The infinitesimal change in kinetic energy is <Katex
					math={r`F \cdot v \, dt`}
				/>. The infinitesimal change in potential energy is <Katex math={r`-F \cdot v \, dt`} />.
				They cancel exactly. Total energy is constant.
			</p>
		</div>

		<SDGAdvantage title="Conservation of Energy: One Line">
			<p>
				In standard calculus, proving conservation of energy requires the chain rule applied
				carefully to a composite function, followed by substitution and simplification. In
				Neocalculus, we just compute <Katex math={r`d(\text{KE}) + d(\text{PE})`} /> — each term is a
				product of infinitesimals, and they cancel on sight. The proof is
				<strong>three lines of algebra</strong>, not a page of analysis.
			</p>
		</SDGAdvantage>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — A Falling Object</div>
			<div class="step">
				<div class="step-math"><Katex math={r`V(x) = mgx, \quad F = -V'(x) = -mg`} display /></div>
				<span class="step-note">gravity potential</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`E = \tfrac{1}{2}mv^2 + mgx = \text{constant}`} display />
				</div>
				<span class="step-note">conservation</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{Drop from height } h: \quad 0 + mgh = \tfrac{1}{2}mv^2 + 0`}
						display
					/>
				</div>
				<span class="step-note">top vs. bottom</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`v = \sqrt{2gh}`} display /></div>
				<span class="step-note">impact speed ✓</span>
			</div>
		</div>

		<!-- ═══ SECTION: Work-Energy Theorem ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Work and the Work-Energy Theorem</h4>
			<p>
				When a force <Katex math="F" /> pushes an object through an infinitesimal displacement <Katex
					math="dx"
				/>, the infinitesimal <strong>work</strong> done is:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`dW = F \cdot dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is a literal product of infinitesimals — no "abuse of notation" required. The total
				work over a finite distance is the integral:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`W = \int_a^b F(x)\,dx`} display />
		</div>

		<Callout type="theorem" title="Work-Energy Theorem">
			<Katex math={r`W_{\text{net}} = \Delta(\tfrac{1}{2}mv^2)`} display />
			<p>The net work done on a particle equals the change in its kinetic energy.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Proof:</strong> From <Katex
					math={r`dW = F\,dx = ma \cdot v\,dt = m\,v\,dv = d(\tfrac{1}{2}mv^2)`}
				/>. Integrate both sides.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — Variable Force</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`F(x) = 3x \text{ newtons, pushed from } x = 0 \text{ to } x = 4 \text{ m}`}
						display
					/>
				</div>
				<span class="step-note">variable force</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`W = \int_0^4 3x\,dx = \tfrac{3}{2}x^2\Big|_0^4 = \tfrac{3}{2}(16) = 24 \text{ J}`}
						display
					/>
				</div>
				<span class="step-note">integrate</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`W = 24 \text{ joules}`} display /></div>
				<span class="step-note">work done ✓</span>
			</div>
		</div>

		<!-- ═══ SECTION: Momentum and Impulse ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Momentum and Impulse</h4>
			<p>
				Define the <strong>momentum</strong> of a particle as <Katex math={r`p = mv`} />. Then
				Newton's second law says:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`dp = F \cdot dt`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The infinitesimal change in momentum equals force times the infinitesimal time interval.
				This product <Katex math={r`F \cdot dt`} /> is called the <strong>impulse</strong>.
			</p>
			<p>
				Now consider two particles colliding, with no external forces. By Newton's third law, the
				force of particle 1 on particle 2 is <Katex math={r`-F`} />, and the force of particle 2 on
				particle 1 is <Katex math={r`F`} />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Conservation of Momentum</div>
			<div class="step">
				<div class="step-math"><Katex math={r`dp_1 = F\,dt, \qquad dp_2 = -F\,dt`} display /></div>
				<span class="step-note">Newton's third law</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`d(p_1 + p_2) = F\,dt - F\,dt = 0`} display /></div>
				<span class="step-note">add the changes</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`p_1 + p_2 = \text{constant}`} display /></div>
				<span class="step-note">total momentum is conserved ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				In SDG, this proof is almost embarrassingly short: the infinitesimal impulses cancel because
				Newton's third law says they're equal and opposite. No integration needed — the
				infinitesimal statement <em>is</em> the conservation law.
			</p>
		</div>

		<!-- ═══ SECTION: Separation of Variables ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Separation of Variables</h3>
			<p>
				Here is arguably the most important section of this chapter — the place where SDG <em
					>vindicates</em
				> what physicists have been doing for centuries.
			</p>
			<p>
				Consider radioactive decay. A sample of <Katex math={r`N`} /> atoms decays at a rate proportional
				to how much is left:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{dN}{dt} = -\lambda N`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				In standard calculus, students are taught to "separate variables" by writing <Katex
					math={r`\frac{dN}{N} = -\lambda\,dt`}
				/> and integrating both sides. Textbooks immediately add a caveat: "This is informal notation.
				We are not really dividing by <Katex math="N" /> or treating <Katex math="dN" /> and <Katex
					math="dt"
				/> as separate quantities."
			</p>
			<p>
				In Neocalculus, we <em>are</em>. The infinitesimal <Katex math="dN" /> is the actual change in
				<Katex math="N" /> over the infinitesimal time <Katex math="dt" />. Dividing by <Katex
					math="N"
				/> is genuine division. The equation <Katex math={r`dN/N = -\lambda\,dt`} /> is a
				<em>literal equation between infinitesimals</em>.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Solving by Separation of Variables</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\frac{dN}{N} = -\lambda\,dt`} display /></div>
				<span class="step-note">separate: literal algebra</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\int \frac{dN}{N} = \int -\lambda\,dt`} display />
				</div>
				<span class="step-note">integrate both sides</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\ln N = -\lambda t + C`} display /></div>
				<span class="step-note">antiderivatives</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`N = e^{-\lambda t + C} = e^C \cdot e^{-\lambda t}`} display />
				</div>
				<span class="step-note">exponentiate</span>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`N(t) = N_0\,e^{-\lambda t}`} display /></div>
				<span class="step-note">set e^C = N₀ = N(0) ✓</span>
			</div>
		</div>

		<SDGAdvantage title="Separation of Variables: Literal Algebra">
			<p>
				In standard calculus, writing <Katex math={r`\frac{dN}{N} = -\lambda\,dt`} /> is called "informal
				notation" or even "abuse of notation." Students are told that <Katex math="dN" /> and <Katex
					math="dt"
				/> aren't really separate quantities — they're parts of a limit. In Neocalculus,
				<strong>it's an equation</strong>. The infinitesimal <Katex math="dN" /> is a genuine number.
				Dividing by <Katex math="N" /> is genuine division. Integrating both sides is integrating equal
				things. Every step that physicists do instinctively is fully rigorous here.
			</p>
		</SDGAdvantage>

		<div class="neo-prose" use:reveal>
			<p>
				This technique — separate, then integrate — works for any ODE of the form <Katex
					math={r`\frac{dy}{dx} = f(x)\,g(y)`}
				/>. Write <Katex math={r`\frac{dy}{g(y)} = f(x)\,dx`} />, integrate both sides, and solve
				for <Katex math="y" />. In SDG, every step is literal.
			</p>
		</div>

		<InlinePlot
			fn={(t) => Math.exp(-0.3 * t)}
			domain={[0, 8]}
			caption="Exponential decay: N(t) = N₀·e^(−λt). The quantity halves at regular intervals."
		/>

		<!-- ═══ SECTION: Newton's Law of Cooling ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Newton's Law of Cooling</h4>
			<p>
				A hot object cools at a rate proportional to the difference between its temperature and the
				environment. If <Katex math={r`T(t)`} /> is the object's temperature and <Katex
					math={r`T_{\text{env}}`}
				/> is the room temperature:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{dT}{dt} = -k(T - T_{\text{env}})`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is a separable ODE. Let <Katex math={r`u = T - T_{\text{env}}`} />, so <Katex
					math={r`du = dT`}
				/> (since <Katex math={r`T_{\text{env}}`} /> is constant):
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Worked Example — Coffee Cooling</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\frac{du}{u} = -k\,dt`} display /></div>
				<span class="step-note">separate</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\ln u = -kt + C \implies u = u_0\,e^{-kt}`} display />
				</div>
				<span class="step-note">integrate and exponentiate</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`T(t) = T_{\text{env}} + (T_0 - T_{\text{env}})\,e^{-kt}`} display />
				</div>
				<span class="step-note">substitute back</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`T_0 = 90°\text{C}, \; T_{\text{env}} = 20°\text{C}: \quad T(t) = 20 + 70\,e^{-kt}`}
						display
					/>
				</div>
				<span class="step-note">coffee from 90°C in 20°C room</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex
						math={r`\text{If } k = 0.1: \quad T(5) = 20 + 70\,e^{-0.5} \approx 62°\text{C}`}
						display
					/>
				</div>
				<span class="step-note">after 5 minutes ✓</span>
			</div>
		</div>

		<InlinePlot
			fn={(t) => 20 + 70 * Math.exp(-0.1 * t)}
			domain={[0, 40]}
			range={[15, 95]}
			caption="Coffee cooling: T(t) = 20 + 70·e^(−0.1t). The temperature approaches room temperature asymptotically."
		/>

		<!-- ═══ SECTION: Kepler's Areal Law ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Kepler's Areal Law</h4>
			<p>
				A planet orbiting the Sun sweeps out equal areas in equal times. The proof uses
				microstraightness: an infinitesimal arc is <em>exactly</em> a straight segment, so an
				infinitesimal sector is <em>exactly</em> a triangle.
			</p>
		</div>

		<!-- Kepler figure -->
		<div use:reveal>
			<JSXGraphBoard
				setup={setupKepler}
				boundingbox={[-4.5, 3, 4.5, -3]}
				aspectRatio={(4.5 - -4.5) / (3 - -3)}
				axes={false}
				number="8.2"
				caption="Kepler's areal law: the infinitesimal sector OPQ is exactly a triangle (by microstraightness). Its area is ½r²·dθ. Equal areas in equal times."
			/>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Kepler's Areal Law</div>
			<div class="step">
				<div class="step-math"><Katex math={r`dA = \tfrac{1}{2}r^2\,d\theta`} display /></div>
				<span class="step-note">area of infinitesimal triangle</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\dot A = \tfrac{1}{2}r^2\,\dot\theta`} display />
				</div>
				<span class="step-note">rate of area sweep</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\text{Central force: } \mathbf{F} \parallel \mathbf{r} \implies \mathbf{F} \times \mathbf{r} = 0`}
						display
					/>
				</div>
				<span class="step-note">force is radial</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\frac{d}{dt}(\mathbf{r} \times \mathbf{v}) = \mathbf{v} \times \mathbf{v} + \mathbf{r} \times \frac{\mathbf{F}}{m} = 0 + 0 = 0`}
						display
					/>
				</div>
				<span class="step-note">angular momentum constant</span>
			</div>
			<div class="step">
				<div class="step-math">
					<Katex
						math={r`\mathbf{L} = \mathbf{r} \times \mathbf{v} = \text{const} \implies r^2\dot\theta = \text{const}`}
						display
					/>
				</div>
				<span class="step-note">in polar coordinates</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex
						math={r`\dot A = \text{constant} \implies \text{equal areas in equal times}`}
						display
					/>
				</div>
				<span class="step-note">Kepler's law ✓</span>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The key justification: a central force is parallel to the position vector <Katex
					math={r`\mathbf{r}`}
				/>, so its cross product with <Katex math={r`\mathbf{r}`} /> vanishes. This means the torque is
				zero, so angular momentum <Katex math={r`\mathbf{L} = \mathbf{r} \times \mathbf{v}`} /> is constant.
				In polar coordinates, <Katex math={r`|\mathbf{L}| = r^2 \dot\theta`} />, so the areal rate <Katex
					math={r`\dot A = \frac{1}{2}r^2\dot\theta`}
				/> is constant.
			</p>
		</div>

		<SDGAdvantage title="Kepler's Law: The Sector IS a Triangle">
			<p>
				In standard calculus, computing the area of an infinitesimal sector requires a limit
				argument: approximate the sector by a triangle, bound the error, and take a limit. In
				Neocalculus, the sector <strong>is</strong> a triangle — by microstraightness, the arc <Katex
					math={r`PQ`}
				/> is a straight segment over an infinitesimal angle <Katex math={r`d\theta`} />. The area
				formula <Katex math={r`dA = \frac{1}{2}r^2 d\theta`} /> is exact, not a first-order approximation.
			</p>
		</SDGAdvantage>

		<!-- ═══ SECTION: Exponential Growth and Decay ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Exponential Growth and Decay</h4>
			<p>
				Many natural processes change at a rate proportional to their current value. A population
				grows faster when it's large. A radioactive sample decays faster when there's more of it.
				The defining equation is:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f'(t) = k \cdot f(t)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				We already solved this by separation of variables above! Writing <Katex
					math={r`df/f = k\,dt`}
				/> and integrating gives <Katex math={r`f(t) = f(0) \cdot e^{kt}`} />. When <Katex
					math="k > 0"
				/>, the quantity grows exponentially. When <Katex math="k < 0" />, it decays.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Radioactive Decay</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`N'(t) = -\lambda N(t), \quad N(0) = N_0`} display />
				</div>
				<span class="step-note">decay rate ∝ amount</span>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`N(t) = N_0 \, e^{-\lambda t}`} display /></div>
				<span class="step-note">solution by separation</span>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`\text{Half-life: } t_{1/2} = \frac{\ln 2}{\lambda}`} display />
				</div>
				<span class="step-note">set N = N₀/2 ✓</span>
			</div>
		</div>

		<!-- ═══ SECTION: Compound Interest → e ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Compound Interest and the Number <Katex math="e" /></h4>
			<p>
				Here's a beautiful connection between finance and calculus. Invest $1 at 100% interest,
				compounded <Katex math="n" /> times per year. After one year you have <Katex
					math={r`(1 + 1/n)^n`}
				/> dollars. As <Katex math={r`n \to \infty`} />, this approaches <Katex math="e" />.
			</p>
			<p>
				In SDG, we can think of it differently. Compound continuously: over each infinitesimal time <Katex
					math="dt"
				/>, your money grows by a factor <Katex math={r`(1 + dt)`} />. Over one year (unit time),
				you multiply by <Katex math={r`(1+dt)`} /> a "total of <Katex math={r`1/dt`} />" times. This
				product is <Katex math="e" />.
			</p>
			<p>
				More precisely: the ODE <Katex math={r`dM/dt = M`} /> (money grows proportionally to itself) has
				solution <Katex math={r`M(t) = M_0 e^t`} />. Compound interest is just exponential growth,
				and <Katex math="e" /> is the natural base because <Katex math={r`e^x`} /> is its own derivative.
			</p>
		</div>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li>
					<strong>Velocity and acceleration</strong> are literal infinitesimal ratios: <Katex
						math={r`v = dx/dt`}
					/>, <Katex math={r`a = dv/dt`} />.
				</li>
				<li><strong>Newton's second law:</strong> <Katex math={r`F = ma = m\,dv/dt`} />.</li>
				<li>
					<strong>Projectile motion</strong> follows from integrating constant acceleration: <Katex
						math={r`x(t) = v_0 t - \frac{1}{2}gt^2`}
					/>.
				</li>
				<li>
					<strong>SHM</strong> (<Katex math={r`x'' = -\omega^2 x`} />) is solved by the <Katex
						math="D_n"
					/> Taylor expansion: the recurrence forces <Katex
						math={r`x = A\cos\omega t + B\sin\omega t`}
					/>.
				</li>
				<li>
					<strong>Conservation of energy:</strong>
					<Katex math={r`d(\text{KE} + \text{PE}) = 0`} /> by direct infinitesimal computation.
				</li>
				<li>
					<strong>Work:</strong>
					<Katex math={r`dW = F\,dx`} /> — a literal infinitesimal product.
				</li>
				<li>
					<strong>Momentum:</strong>
					<Katex math={r`dp = F\,dt`} />; Newton's third law gives conservation of total momentum.
				</li>
				<li>
					<strong>Separation of variables:</strong>
					<Katex math={r`dy/g(y) = f(x)\,dx`} /> is <em>literal algebra</em> in SDG, not an "abuse of
					notation."
				</li>
				<li>
					<strong>Kepler's areal law:</strong> zero torque implies constant angular momentum; the
					sector <em>is</em> a triangle by microstraightness.
				</li>
				<li>
					<strong>Exponential growth/decay:</strong>
					<Katex math={r`f' = kf`} /> has solution <Katex math={r`f = f(0)e^{kt}`} />.
				</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (Core 1-10, Extension optional)</summary>

			<Exercise number={1}>
				<p>
					<strong>Warm-up.</strong> A ball is dropped from rest. Using <Katex
						math={r`a = g = 9.8`}
					/> m/s², find its velocity and position after <Katex math="t" /> seconds.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`v(t) = gt = 9.8t`} /> m/s. <Katex
							math={r`x(t) = \frac{1}{2}gt^2 = 4.9t^2`}
						/> meters.
					</p>{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Warm-up.</strong> Verify that <Katex math={r`x(t) = \cos(\omega t)`} /> satisfies <Katex
						math={r`x''(t) = -\omega^2 x(t)`}
					/>.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`x'(t) = -\omega\sin(\omega t)`} />, <Katex
							math={r`x''(t) = -\omega^2\cos(\omega t) = -\omega^2 x(t)`}
						/>. ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Warm-up.</strong> A population doubles every 5 years. Find the growth constant <Katex
						math="k"
					/>.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`2 = e^{5k} \implies k = \frac{\ln 2}{5} \approx 0.1386`} /> per year.
					</p>{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> A ball is thrown upward with initial velocity <Katex
						math={r`v_0 = 30`}
					/> m/s. Find the maximum height and the time to return to the ground. (Use <Katex
						math={r`g = 10`}
					/> m/s².)
				</p>
				{#snippet solution()}<p>
						At maximum height, <Katex math={r`v = 0`} />: <Katex
							math={r`0 = 30 - 10t \implies t = 3`}
						/> s. Height: <Katex math={r`x(3) = 30(3) - 5(9) = 45`} /> m. Returns when <Katex
							math={r`x = 0`}
						/>: <Katex math={r`30t - 5t^2 = 0 \implies t(30-5t) = 0 \implies t = 6`} /> s. Maximum height
						is <strong>45 m</strong>, total flight time is <strong>6 s</strong>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Compute the work done by a force <Katex math={r`F(x) = 2x + 1`} /> as
					an object moves from <Katex math={r`x = 0`} /> to <Katex math={r`x = 3`} /> meters.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`W = \int_0^3 (2x+1)\,dx = [x^2 + x]_0^3 = 9 + 3 = 12`} /> joules.
					</p>{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> A spring with <Katex math={r`\omega = 2`} /> rad/s has initial conditions
					<Katex math={r`x(0) = 3`} />, <Katex math={r`x'(0) = 0`} />. Write the full solution and
					find the period of oscillation.
				</p>
				{#snippet solution()}<p>
						From <Katex math={r`x(t) = x(0)\cos(\omega t) + \frac{x'(0)}{\omega}\sin(\omega t)`} />: <Katex
							math={r`x(t) = 3\cos(2t)`}
						/>. Period: <Katex math={r`T = 2\pi/\omega = \pi \approx 3.14`} /> s.
					</p>{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Core.</strong> Use separation of variables to solve <Katex
						math={r`\frac{dy}{dx} = 2xy`}
					/> with <Katex math={r`y(0) = 1`} />.
				</p>
				{#snippet solution()}<p>
						Separate: <Katex math={r`\frac{dy}{y} = 2x\,dx`} />. Integrate: <Katex
							math={r`\ln y = x^2 + C`}
						/>. Since <Katex math={r`y(0) = 1`} />, <Katex math={r`C = 0`} />. So <Katex
							math={r`y = e^{x^2}`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Core.</strong> Derive conservation of momentum for two colliding particles from
					Newton's third law, using infinitesimals. (Write out <Katex math={r`dp_1`} /> and <Katex
						math={r`dp_2`}
					/> explicitly.)
				</p>
				{#snippet solution()}<p>
						Let the force of particle 2 on particle 1 be <Katex math="F" />. By Newton's third law,
						the force of 1 on 2 is <Katex math="-F" />. Then <Katex math={r`dp_1 = F\,dt`} /> and <Katex
							math={r`dp_2 = -F\,dt`}
						/>. Adding: <Katex math={r`d(p_1 + p_2) = F\,dt - F\,dt = 0`} />. So <Katex
							math={r`p_1 + p_2`}
						/> is constant. ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p>
					<strong>Core.</strong> A cup of coffee starts at 85°C in a 22°C room. After 10 minutes, it
					has cooled to 60°C. Find the cooling constant <Katex math="k" />, and determine how long
					it takes to reach 40°C.
				</p>
				{#snippet solution()}<p>
						<Katex math={r`T(t) = 22 + 63\,e^{-kt}`} />. At <Katex math={r`t=10`} />: <Katex
							math={r`60 = 22 + 63\,e^{-10k}`}
						/>, so <Katex math={r`e^{-10k} = 38/63`} />, giving <Katex
							math={r`k = \frac{1}{10}\ln(63/38) \approx 0.0505`}
						/>. For <Katex math={r`T = 40`} />: <Katex math={r`40 = 22 + 63\,e^{-kt}`} />, so <Katex
							math={r`e^{-kt} = 18/63`}
						/>, giving <Katex math={r`t = \frac{\ln(63/18)}{k} \approx 24.9`} /> minutes.
					</p>{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p>
					<strong>Core.</strong> Use conservation of energy to find the speed of a 2 kg object that slides
					from rest down a frictionless ramp of height 5 m.
				</p>
				{#snippet solution()}<p>
						<Katex
							math={r`\frac{1}{2}mv^2 = mgh \implies v = \sqrt{2gh} = \sqrt{2 \cdot 9.8 \cdot 5} = \sqrt{98} \approx 9.9`}
						/> m/s. Note: the mass cancels — just as Galileo discovered.
					</p>{/snippet}
			</Exercise>

			<Exercise number={11}>
				<p>
					<strong>Conceptual.</strong> In Neocalculus, <Katex math={r`F = ma`} /> says the force is the
					<em>exact</em> infinitesimal rate of change of momentum. In standard calculus, it's a limit.
					Explain in your own words why the SDG formulation makes the law more intuitive.
				</p>
				{#snippet solution()}<p>
						In SDG, <Katex math={r`F\,dt = dp`} /> is a literal equation: a force applied for an infinitesimal
						time produces an infinitesimal change in momentum. There's no abstraction layer of limits
						— the relationship between force and motion is direct and algebraic. You can manipulate <Katex
							math="dp"
						/>, <Katex math="dt" />, and <Katex math="F" /> as ordinary quantities, which matches the
						physicist's intuition perfectly.
					</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p>
					<strong>Challenge.</strong> Verify that separation of variables works on <Katex
						math={r`\frac{dy}{dx} = \frac{x}{y}`}
					/> with <Katex math={r`y(0) = 2`} />. Separate, integrate both sides, and solve for <Katex
						math="y"
					/>.
				</p>
				{#snippet solution()}<p>
						Separate: <Katex math={r`y\,dy = x\,dx`} />. Integrate: <Katex
							math={r`\frac{1}{2}y^2 = \frac{1}{2}x^2 + C`}
						/>. With <Katex math={r`y(0)=2`} />: <Katex math={r`C = 2`} />. So <Katex
							math={r`y^2 = x^2 + 4`}
						/>, giving <Katex math={r`y = \sqrt{x^2 + 4}`} /> (taking the positive root).
					</p>{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p>
					<strong>Challenge.</strong> A projectile is launched at angle <Katex math={r`\theta`} /> with
					speed <Katex math={r`v_0`} />. Using <Katex math={r`x(t) = v_0 \cos\theta \cdot t`} /> and <Katex
						math={r`y(t) = v_0 \sin\theta \cdot t - \frac{1}{2}gt^2`}
					/>, find the maximum height and the range (horizontal distance when <Katex
						math={r`y = 0`}
					/> again).
				</p>
				{#snippet solution()}<p>
						Max height when <Katex math={r`\dot y = 0`} />: <Katex
							math={r`v_0\sin\theta - gt = 0 \implies t^* = v_0\sin\theta/g`}
						/>. Height: <Katex math={r`y_{\max} = \frac{v_0^2 \sin^2\theta}{2g}`} />. Range: <Katex
							math={r`y = 0`}
						/> at <Katex math={r`t = 2t^* = 2v_0\sin\theta/g`} />, so <Katex
							math={r`R = v_0\cos\theta \cdot \frac{2v_0\sin\theta}{g} = \frac{v_0^2\sin 2\theta}{g}`}
						/>.
					</p>{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p>
					<strong>Challenge.</strong> <em>(The Rocket Equation.)</em> A rocket expels mass at rate <Katex
						math={r`dm/dt = -\alpha`}
					/> (so its mass decreases). The exhaust has velocity <Katex math={r`v_e`} /> relative to the
					rocket. By conservation of momentum, show that <Katex
						math={r`m\,dv = v_e\,\alpha\,dt`}
					/>, and hence <Katex math={r`v(t) = v_e \ln\!\big(\frac{m_0}{m_0 - \alpha t}\big)`} />.
				</p>
				{#snippet solution()}<p>
						In an infinitesimal time <Katex math="dt" />, the rocket (mass <Katex math="m" />,
						velocity <Katex math="v" />) expels mass <Katex math={r`\alpha\,dt`} /> at velocity <Katex
							math={r`v - v_e`}
						/>. Conservation of momentum: <Katex
							math={r`mv = (m - \alpha\,dt)(v + dv) + \alpha\,dt(v - v_e)`}
						/>. Expanding and dropping <Katex math={r`dt \cdot dv`} /> (which is <Katex
							math={r`d_1 d_2`}
						/>-order but these are <em>not</em> independent infinitesimals from the same <Katex
							math="D"
						/>; rather, <Katex math="dv" /> is proportional to <Katex math="dt" />, so <Katex
							math={r`dv \cdot dt`}
						/> vanishes): <Katex math={r`0 = m\,dv - v_e\,\alpha\,dt`} />, so <Katex
							math={r`m\,dv = v_e\,\alpha\,dt`}
						/>. Separate: <Katex math={r`dv = v_e\,\frac{\alpha\,dt}{m_0 - \alpha t}`} />.
						Integrate: <Katex math={r`v = -v_e \ln(m_0 - \alpha t) + C`} />. With <Katex
							math={r`v(0) = 0`}
						/>: <Katex math={r`v(t) = v_e\ln\!\big(\frac{m_0}{m_0 - \alpha t}\big)`} />. ✓
					</p>{/snippet}
			</Exercise>

			<Exercise number={15}>
				<p>
					<strong>Exploration.</strong> We proved <Katex math={r`d(\text{KE} + \text{PE}) = 0`} /> for
					a particle in one dimension. What assumption about the force did we use? Give an example of
					a force for which energy is <em>not</em> conserved, and explain which step in the proof breaks
					down.
				</p>
				{#snippet solution()}<p>
						We assumed <Katex math={r`F = -V'(x)`} /> — that the force is the (negative) derivative of
						a potential function. This is true for gravity, springs, and electrostatics, but
						<em>not</em>
						for friction. Friction <Katex math={r`F = -\mu mg \operatorname{sgn}(v)`} /> always opposes
						motion; there is no function <Katex math={r`V(x)`} /> whose derivative gives this force (it
						depends on <Katex math="v" />, not just <Katex math="x" />). The step <Katex
							math={r`d(V) = V'(x)\,dx = -F\,v\,dt`}
						/> fails because no such <Katex math="V" /> exists.
					</p>{/snippet}
			</Exercise>
		</details>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>
				In Chapter 7, we turn to series and approximation. Higher-order infinitesimals and Taylor
				expansions will let us solve and approximate models that do not yield elementary closed
				forms.
			</p>
		</LookingAhead>

		<NextChapter href="ch7" title="Series and Approximation" number="7" />
	</div>
</section>
