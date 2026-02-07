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

	function setupKepler(JXG: any, board: any) {
		// Elliptical orbit
		const a = 3, b = 2; // semi-axes
		board.create('curve', [
			(t: number) => a * Math.cos(t),
			(t: number) => b * Math.sin(t),
			0, 2 * Math.PI
		], {
			strokeColor: '#1a1a2e', strokeWidth: 2, highlight: false
		});

		// Focus (sun) at (-c, 0) where c = sqrt(a²-b²)
		const c = Math.sqrt(a * a - b * b);
		const O = board.create('point', [-c, 0], {
			size: 5, fillColor: '#f59e0b', strokeColor: '#d97706',
			name: 'O', label: { fontSize: 14, offset: [-15, -5] },
			fixed: true, highlight: false
		});

		// Point P on the orbit
		const theta1 = 0.6;
		const P = board.create('point', [a * Math.cos(theta1), b * Math.sin(theta1)], {
			size: 4, fillColor: '#1a1a2e', strokeColor: '#1a1a2e',
			name: 'P', label: { fontSize: 14, offset: [5, 5] },
			fixed: true, highlight: false
		});

		// Point Q (infinitesimally close to P on the orbit)
		const theta2 = theta1 + 0.25;
		const Q = board.create('point', [a * Math.cos(theta2), b * Math.sin(theta2)], {
			size: 4, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: 'Q', label: { fontSize: 14, offset: [5, 5], color: '#a855f7' },
			fixed: true, highlight: false
		});

		// Triangle OPQ
		board.create('polygon', [O, P, Q], {
			fillColor: 'rgba(168,85,247,0.12)', strokeWidth: 0,
			highlight: false, vertices: { visible: false },
			borders: { strokeColor: '#a855f7', strokeWidth: 1.5, highlight: false }
		});

		// Radius lines
		board.create('segment', [O, P], { strokeColor: '#1a1a2e', strokeWidth: 1.5, highlight: false });
		board.create('segment', [O, Q], { strokeColor: '#a855f7', strokeWidth: 1.5, highlight: false });

		// Radius label
		const mx = (-c + a * Math.cos(theta1)) / 2;
		const my = (0 + b * Math.sin(theta1)) / 2;
		board.create('text', [mx - 0.15, my + 0.2, 'r'], {
			fontSize: 15, color: '#1a1a2e', fontStyle: 'italic', highlight: false
		});

		// Area label
		board.create('text', [0.2, 0.8, 'area = ½r²dθ'], {
			fontSize: 13, color: '#a855f7', anchorX: 'middle', highlight: false, fontWeight: '500'
		});

		// Angle arc at O
		board.create('angle', [P, O, Q], {
			radius: 0.5, name: 'dθ', strokeColor: '#a855f7',
			fillColor: 'rgba(168,85,247,0.08)', highlight: false,
			label: { fontSize: 13, color: '#a855f7', offset: [0, 0] }
		});
	}
</script>

<section class="chapter" id="ch8">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 8</span>
			<h2 class="chapter-title">Modeling the Physical World</h2>
			<p class="chapter-tagline">Velocity, acceleration, force, and motion — where infinitesimal reasoning was born.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Calculus was invented to describe physics. In Neocalculus, the connection is even more direct: physical quantities like velocity and acceleration are <em>literal</em> infinitesimal ratios, not limits of ratios.</p>

			<h3>Velocity and Acceleration</h3>
			<p>If a particle is at position <Katex math={r`x(t)`} /> at time <Katex math="t" />, then in an infinitesimal time <span class="d-highlight">d</span>:</p>
		</div>

		<!-- Position-Velocity-Acceleration chain figure -->
		<Figure number="8.1" caption="The chain of derivatives: position → velocity → acceleration. Each is the infinitesimal rate of change of the previous.">
			<svg viewBox="0 0 440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:440px">
				<!-- boxes -->
				<rect x="10" y="20" width="100" height="40" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
				<text x="60" y="45" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#2563eb" font-style="italic">x(t)</text>
				<text x="60" y="72" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94919b">position</text>
				<rect x="170" y="20" width="100" height="40" rx="8" fill="#ecfdf5" stroke="#059669" stroke-width="1.5"/>
				<text x="220" y="45" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#059669" font-style="italic">v(t)</text>
				<text x="220" y="72" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94919b">velocity</text>
				<rect x="330" y="20" width="100" height="40" rx="8" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5"/>
				<text x="380" y="45" text-anchor="middle" font-size="14" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">a(t)</text>
				<text x="380" y="72" text-anchor="middle" font-size="9" font-family="Inter,sans-serif" fill="#94919b">acceleration</text>
				<!-- arrows -->
				<line x1="112" y1="40" x2="165" y2="40" stroke="#1a1a2e" stroke-width="1.5" marker-end="url(#arr)"/>
				<text x="138" y="33" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">d/dt</text>
				<line x1="272" y1="40" x2="325" y2="40" stroke="#1a1a2e" stroke-width="1.5" marker-end="url(#arr)"/>
				<text x="298" y="33" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">d/dt</text>
				<defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#1a1a2e"/></marker></defs>
			</svg>
		</Figure>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t+d) = x(t) + v(t)\,d, \qquad v(t+d) = v(t) + a(t)\,d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Velocity is the slope of the position function. Acceleration is the slope of velocity. These are literal infinitesimal displacements — not limits.</p>
		</div>

		<HistoryBox name="Isaac Newton" years="1643–1727">
			<p>Newton called infinitesimals "fluxions" and used them to derive the laws of motion and universal gravitation. His methods were essentially the same algebra we use here — expand, drop vanishing terms, read off the answer. The epsilon-delta formalism came 150 years later.</p>
		</HistoryBox>

		<div class="neo-prose" use:reveal>
			<h3>Newton's Second Law</h3>
		</div>

		<Callout type="theorem" title="Newton's Second Law (Infinitesimal Form)">
			<Katex math={r`F(t) = m \cdot a(t) = m \cdot \frac{v(t+d) - v(t)}{d}`} display />
			<p>Force equals mass times the infinitesimal rate of change of velocity.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Projectile Motion</h3>
			<p>A ball thrown upward with initial velocity <Katex math={r`v_0`} /> under constant gravity <Katex math="g" />:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Deriving Projectile Motion</div>
			<div class="step"><div class="step-math"><Katex math={r`a(t) = -g \text{ (constant downward)}`} display /></div><span class="step-note">gravity</span></div>
			<div class="step"><div class="step-math"><Katex math={r`v(t+d) = v(t) - g\,d \implies v(t) = v_0 - gt`} display /></div><span class="step-note">integrate a</span></div>
			<div class="step"><div class="step-math"><Katex math={r`x(t+d) = x(t) + (v_0 - gt)\,d \implies x(t) = v_0 t - \tfrac{1}{2}gt^2`} display /></div><span class="step-note">integrate v</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`x(t) = v_0 t - \frac{1}{2}gt^2`} display /></div><span class="step-note">the parabolic trajectory ✓</span></div>
		</div>

		<InlinePlot fn={t => 20*t - 5*t*t} domain={[0, 4]} range={[-2, 22]} caption="Projectile height: x(t) = 20t − 5t². Maximum at t = 2." tangentAt={2} />

		<div class="neo-prose" use:reveal>
			<h3>Simple Harmonic Motion</h3>
			<p>A spring with force <Katex math={r`F = -kx`} /> gives acceleration <Katex math={r`a = -\omega^2 x`} /> where <Katex math={r`\omega^2 = k/m`} />. The solution is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t) = A\cos(\omega t) + B\sin(\omega t)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>We can verify: <Katex math={r`x'(t) = -A\omega\sin(\omega t) + B\omega\cos(\omega t)`} /> and <Katex math={r`x''(t) = -\omega^2 x(t)`} /> — exactly as required.</p>

			<h3>Kepler's Areal Law</h3>
			<p>A particle moving under central force toward a point O sweeps equal areas in equal times. The proof uses microstraightness: an infinitesimal sector is <em>exactly</em> a triangle.</p>
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
			<div class="step"><div class="step-math"><Katex math={r`dA = \tfrac{1}{2}r^2\,d\theta`} display /></div><span class="step-note">area of infinitesimal triangle</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A'(t) = \tfrac{1}{2}r^2\,\dot\theta`} display /></div><span class="step-note">rate of area sweep</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Central force} \implies \frac{d}{dt}(r^2\dot\theta) = 0`} display /></div><span class="step-note">no torque</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`A'(t) = \text{constant} \implies \text{equal areas in equal times}`} display /></div><span class="step-note">Kepler's law ✓</span></div>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				A ball is dropped from rest. Using <Katex math={r`a = g = 9.8`} /> m/s², find its velocity and position after <Katex math="t" /> seconds.
				{#snippet solution()}<p><Katex math={r`v(t) = gt = 9.8t`} /> m/s. <Katex math={r`x(t) = \frac{1}{2}gt^2 = 4.9t^2`} /> meters.</p>{/snippet}
			</Exercise>
			<Exercise number={2}>
				Verify that <Katex math={r`x(t) = \cos(\omega t)`} /> satisfies <Katex math={r`x''(t) = -\omega^2 x(t)`} />.
				{#snippet solution()}<p><Katex math={r`x'(t) = -\omega\sin(\omega t)`} />, <Katex math={r`x''(t) = -\omega^2\cos(\omega t) = -\omega^2 x(t)`} />. ✓</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
