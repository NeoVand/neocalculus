<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import InlinePlot from '$lib/components/InlinePlot.svelte';
	import { reveal } from '$lib/utils/scroll';
	const r = String.raw;
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
		<Figure number="6.1" caption="Rotating y = f(x) around the x-axis. Each infinitesimal slice is a circular disk of radius f(x) and thickness d.">
			<svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="max-width:400px">
				<!-- axis -->
				<line x1="40" y1="100" x2="370" y2="100" stroke="#1a1a2e" stroke-width="1"/>
				<!-- curve (top half) -->
				<path d="M 80 100 Q 120 30 200 50 Q 280 70 340 40" stroke="#1a1a2e" stroke-width="2" fill="none"/>
				<!-- curve (bottom half, reflected) -->
				<path d="M 80 100 Q 120 170 200 150 Q 280 130 340 160" stroke="#1a1a2e" stroke-width="2" fill="none" stroke-dasharray="5,3" opacity="0.4"/>
				<!-- disk slice -->
				<ellipse cx="220" cy="100" rx="8" ry="40" fill="rgba(168,85,247,0.15)" stroke="#a855f7" stroke-width="1.5"/>
				<!-- radius label -->
				<line x1="220" y1="100" x2="220" y2="60" stroke="#a855f7" stroke-width="1" stroke-dasharray="3,2"/>
				<text x="230" y="78" font-size="11" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">f(x)</text>
				<!-- thickness label -->
				<line x1="216" y1="145" x2="224" y2="145" stroke="#a855f7" stroke-width="1.5"/>
				<text x="220" y="160" text-anchor="middle" font-size="10" font-family="Crimson Pro,serif" fill="#a855f7" font-style="italic">d</text>
			</svg>
		</Figure>

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
