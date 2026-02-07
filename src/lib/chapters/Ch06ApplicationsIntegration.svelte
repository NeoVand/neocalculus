<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import JSXGraphBoard from '$lib/components/JSXGraphBoard.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;

	function setupVolumeOfRevolution(JXG: any, board: any) {
		const f = (x: number) => 0.6 * Math.sqrt(x) + 0.3;

		// Top profile curve
		board.create('functiongraph', [f, 0.1, 5], {
			strokeColor: '#1a1a2e', strokeWidth: 2.5, highlight: false
		});
		// Bottom profile (reflected)
		board.create('functiongraph', [(x: number) => -f(x), 0.1, 5], {
			strokeColor: '#1a1a2e', strokeWidth: 1.5, strokeOpacity: 0.3, highlight: false
		});
		// x-axis
		board.create('segment', [[0, 0], [5.5, 0]], {
			strokeColor: '#ccc8bf', strokeWidth: 1, highlight: false
		});

		// Highlighted disk at x=3
		const x0 = 3;
		const r0 = f(x0);
		// Ellipse representing the disk
		board.create('ellipse', [[x0, 0], [x0, r0], [x0, 0.01]], {
			strokeColor: '#a855f7', strokeWidth: 2, fillColor: 'rgba(168,85,247,0.12)',
			highlight: false
		});
		// Radius line
		board.create('segment', [[x0, 0], [x0, r0]], {
			strokeColor: '#a855f7', strokeWidth: 1.5, dash: 2, highlight: false
		});
		board.create('point', [x0, 0], {
			size: 2, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		board.create('point', [x0, r0], {
			size: 3, fillColor: '#a855f7', strokeColor: '#a855f7',
			name: '', fixed: true, highlight: false
		});
		// Labels
		board.create('text', [x0 + 0.15, r0 / 2, 'f(x)'], {
			fontSize: 14, color: '#a855f7', fontStyle: 'italic', highlight: false
		});
		board.create('text', [x0, -0.22, 'x'], {
			fontSize: 13, color: '#1a1a2e', anchorX: 'middle', fontStyle: 'italic', highlight: false
		});
		board.create('text', [5.3, 0.15, 'x'], {
			fontSize: 13, color: '#1a1a2e', fontStyle: 'italic', highlight: false
		});
		// Thickness bracket
		board.create('text', [x0 + 0.2, -r0 - 0.2, 'd'], {
			fontSize: 13, color: '#a855f7', fontStyle: 'italic', anchorX: 'middle', highlight: false
		});
	}
</script>

<section class="chapter" id="ch6">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 6</span>
			<h2 class="chapter-title">Applications of Integration</h2>
			<p class="chapter-tagline">Volumes, surface areas, and work — all from infinitesimal slices.</p>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>Integration is the art of accumulation. Any quantity that can be broken into infinitesimal pieces can be integrated. Microstraightness makes each piece <em>exactly right</em> — no approximation needed.</p>

			<h3>Volumes of Revolution — Disk Method</h3>
			<p>Rotate <Katex math={r`y = f(x)`} /> around the x-axis. Each infinitesimal slice is a disk of radius <Katex math={r`f(x)`} /> and thickness <span class="d-highlight">d</span>.</p>
		</div>

		<!-- Volume of revolution figure -->
		<div use:reveal>
			<JSXGraphBoard
				setup={setupVolumeOfRevolution}
				boundingbox={[-0.5, 2.2, 5.8, -2.2]}
				aspectRatio={(5.8 - -0.5) / (2.2 - -2.2)}
				axes={false}
				number="6.1"
				caption="Rotating y = f(x) around the x-axis. The highlighted ellipse represents an infinitesimal disk of radius f(x) and thickness d."
			/>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Volume of Revolution (Disk Method)</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Disk volume} = \pi\,[f(x)]^2 \cdot d`} display /></div><span class="step-note">area × thickness</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V'(x)\,d = \pi f(x)^2\,d`} display /></div><span class="step-note">rate of volume accumulation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`V = \int_a^b \pi\,[f(x)]^2\,dx`} display /></div><span class="step-note">integrate ✓</span></div>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Volume of a Cone</div>
			<div class="step"><div class="step-math"><Katex math={r`y = \frac{r}{h}x \text{ rotated around x-axis, } 0 \le x \le h`} display /></div><span class="step-note">cone profile</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_0^h \pi \left(\frac{r}{h}x\right)^2 dx = \frac{\pi r^2}{h^2}\int_0^h x^2\,dx`} display /></div><span class="step-note">substitute</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{\pi r^2}{h^2} \cdot \frac{h^3}{3} = \frac{1}{3}\pi r^2 h`} display /></div><span class="step-note">the familiar formula ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Shell Method</h3>
			<p>Alternatively, we can integrate using cylindrical shells. An infinitesimal shell at radius <Katex math="x" /> has circumference <Katex math={r`2\pi x`} />, height <Katex math={r`f(x)`} />, and thickness <span class="d-highlight">d</span>:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`V = \int_a^b 2\pi x\, f(x)\,dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Surface Area of Revolution</h3>
			<p>By microstraightness, each infinitesimal piece of the curve is straight. When rotated, it forms a cylinder (not a frustum — because <Katex math={r`d^2 = 0`} /> makes the slant correction vanish). The surface area element is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`S = \int_a^b 2\pi f(x)\,\sqrt{1 + f'(x)^2}\,dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Work</h3>
			<p>Work is force times distance. When force varies, we accumulate infinitesimal work: <Katex math={r`dW = F(x) \cdot d`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Work to Stretch a Spring</div>
			<div class="step"><div class="step-math"><Katex math={r`F(x) = kx \text{ (Hooke's law)}`} display /></div><span class="step-note">spring force</span></div>
			<div class="step"><div class="step-math"><Katex math={r`W = \int_0^L kx\,dx = \frac{1}{2}kL^2`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`W = \frac{1}{2}kL^2`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>
			<Exercise number={1}>
				Find the volume of the solid obtained by rotating <Katex math={r`y = \sqrt{x}`} /> around the x-axis from <Katex math="x=0" /> to <Katex math="x=4" />.
				{#snippet solution()}<Katex math={r`V = \int_0^4 \pi x\,dx = \pi[x^2/2]_0^4 = 8\pi`} display />{/snippet}
			</Exercise>
			<Exercise number={2}>
				Find the work done in compressing a spring with constant <Katex math="k = 200" /> N/m by 0.1 m.
				{#snippet solution()}<p><Katex math={r`W = \frac{1}{2}(200)(0.1)^2 = 1`} /> Joule</p>{/snippet}
			</Exercise>
		</div>
	</div>
</section>
