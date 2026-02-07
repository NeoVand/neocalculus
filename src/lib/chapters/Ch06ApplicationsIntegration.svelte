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
			<p class="chapter-tagline">Volumes, surface areas, work, and more — all from infinitesimal slices.</p>
			<hr class="chapter-divider" />
		</div>

		<!-- ═══ SECTION: The Slicing Principle ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Slicing Principle</h3>
			<p>Integration is the art of accumulation. In the previous chapter we learned to compute areas by stacking infinitesimal rectangles. Now we turn that same idea loose on the physical world — volumes, surfaces, work, mass — and discover that one universal pattern handles them all.</p>
			<p>The pattern has four steps:</p>
			<ol>
				<li><strong>Slice</strong> the quantity into infinitesimal pieces.</li>
				<li><strong>Compute</strong> each piece's contribution.</li>
				<li><strong>Simplify</strong> — the rule <Katex math="d^2 = 0" /> makes each piece <em>exact</em>.</li>
				<li><strong>Integrate</strong> to accumulate the total.</li>
			</ol>
			<p>Whenever we can describe a quantity as a sum of infinitesimal contributions, we can integrate. The key insight of this chapter is that microstraightness doesn't just simplify derivatives — it makes every infinitesimal slice <em>geometrically exact</em>. A thin disk is truly a cylinder. A thin shell is truly a rectangle. No approximation, no error terms, no limits.</p>
		</div>

		<Callout type="key-idea" title="The Slicing Principle">
			<p>Any quantity that can be decomposed into infinitesimal contributions <Katex math={r`Q'(x) \cdot d`} /> can be recovered by integration: <Katex math={r`Q = \int_a^b Q'(x)\,dx`} />. By <Katex math="d^2 = 0" />, each infinitesimal piece is <strong>exact</strong> — not an approximation.</p>
		</Callout>

		<!-- ═══ SECTION: Volumes of Revolution — Disk Method ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Volumes of Revolution — Disk Method</h3>
			<p>Rotate the curve <Katex math={r`y = f(x)`} /> around the x-axis. At position <Katex math="x" />, the solid has a circular cross-section of radius <Katex math={r`f(x)`} />. Slice the solid into infinitesimal pieces of thickness <span class="d-highlight">d</span>.</p>
			<p>Each piece is a disk — a flat cylinder. Its radius is <Katex math={r`f(x)`} /> and its thickness is <span class="d-highlight">d</span>. Because the thickness is infinitesimal, the curve doesn't change over the width of the slice. The disk isn't tapered, flared, or curved. It is a <em>perfect cylinder</em>.</p>
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
			<div class="step"><div class="step-math"><Katex math={r`\text{Disk volume} = \pi\,[f(x)]^2 \cdot d`} display /></div><span class="step-note">area of circle × thickness</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V'(x)\,d = \pi f(x)^2\,d`} display /></div><span class="step-note">rate of volume accumulation</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`V = \int_a^b \pi\,[f(x)]^2\,dx`} display /></div><span class="step-note">integrate ✓</span></div>
		</div>

		<SDGAdvantage title="Why Each Disk Is Exact">
			<p>In standard calculus, each disk is an <em>approximation</em> — the radius varies slightly across its width, so the true shape is a truncated cone, not a cylinder. You argue the error vanishes "in the limit." In Neocalculus, the radius literally cannot change over a distance <span class="d-highlight">d</span>, because any variation would involve a <Katex math="d^2" /> term, and <Katex math="d^2 = 0" />. Each disk is <strong>exactly</strong> a cylinder. There is nothing to approximate.</p>
		</SDGAdvantage>

		<!-- ═══ Example: Volume of a Cone ═══ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Volume of a Cone</div>
			<div class="step"><div class="step-math"><Katex math={r`y = \frac{r}{h}x \text{ rotated around x-axis, } 0 \le x \le h`} display /></div><span class="step-note">cone profile</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_0^h \pi \left(\frac{r}{h}x\right)^2 dx = \frac{\pi r^2}{h^2}\int_0^h x^2\,dx`} display /></div><span class="step-note">substitute</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{\pi r^2}{h^2} \cdot \frac{h^3}{3} = \frac{1}{3}\pi r^2 h`} display /></div><span class="step-note">the familiar formula ✓</span></div>
		</div>

		<!-- ═══ Example: Volume of a Sphere ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Volume of a Sphere</h4>
			<p>A sphere of radius <Katex math="r" /> is generated by revolving the semicircle <Katex math={r`y = \sqrt{r^2 - x^2}`} /> around the x-axis. Each infinitesimal disk has radius <Katex math={r`\sqrt{r^2 - x^2}`} /> and thickness <span class="d-highlight">d</span>.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Volume of a Sphere</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x) = \sqrt{r^2 - x^2}, \quad -r \le x \le r`} display /></div><span class="step-note">semicircle</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_{-r}^{r} \pi(r^2 - x^2)\,dx`} display /></div><span class="step-note">disk method</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi \left[r^2 x - \frac{x^3}{3}\right]_{-r}^{r}`} display /></div><span class="step-note">antidifferentiate</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi \left[\left(r^3 - \frac{r^3}{3}\right) - \left(-r^3 + \frac{r^3}{3}\right)\right]`} display /></div><span class="step-note">evaluate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{4}{3}\pi r^3`} display /></div><span class="step-note">Archimedes' formula ✓</span></div>
		</div>

		<!-- ═══ SECTION: Washer Method ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Washer Method</h3>
			<p>What if the region being rotated doesn't touch the axis? Suppose we revolve the area between two curves <Katex math={r`y = R(x)`} /> (outer) and <Katex math={r`y = r(x)`} /> (inner) around the x-axis. Each infinitesimal slice is no longer a full disk — it's a <strong>washer</strong>, a disk with a hole punched through the center.</p>
			<p>The washer's outer radius is <Katex math={r`R(x)`} />, its inner radius is <Katex math={r`r(x)`} />, and its thickness is <span class="d-highlight">d</span>. Its volume is the area of the ring times the thickness:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`V = \int_a^b \pi\bigl[R(x)^2 - r(x)^2\bigr]\,dx`} display />
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Washer: Region Between y = x and y = x²</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Revolve region between } y = x \text{ and } y = x^2 \text{ around the x-axis, } 0 \le x \le 1`} display /></div><span class="step-note">setup: <Katex math="x \ge x^2" /> on [0,1]</span></div>
			<div class="step"><div class="step-math"><Katex math={r`R(x) = x, \quad r(x) = x^2`} display /></div><span class="step-note">outer and inner radii</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_0^1 \pi\bigl[x^2 - x^4\bigr]\,dx`} display /></div><span class="step-note">washer formula</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi\left[\frac{x^3}{3} - \frac{x^5}{5}\right]_0^1`} display /></div><span class="step-note">antidifferentiate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \pi\left(\frac{1}{3} - \frac{1}{5}\right) = \frac{2\pi}{15}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ SECTION: Cross-Sectional Volumes ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Volumes by Cross-Section</h3>
			<p>Revolution is just one way to build a solid. More generally, suppose we know the cross-sectional area <Katex math={r`A(x)`} /> at every position <Katex math="x" /> along an axis. Slice the solid into infinitesimal slabs of thickness <span class="d-highlight">d</span>. Each slab is a prism whose face has area <Katex math={r`A(x)`} /> — and because <Katex math="d^2 = 0" />, the cross-section doesn't change across the slab. The volume is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`V = \int_a^b A(x)\,dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is the most general slicing formula. The disk and washer methods are special cases where <Katex math={r`A(x) = \pi R^2`} /> or <Katex math={r`A(x) = \pi(R^2 - r^2)`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Square Cross-Sections</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Base region: } y = \sqrt{x}, \quad y = 0, \quad x = 4`} display /></div><span class="step-note">base in the xy-plane</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Cross-sections perpendicular to x-axis are squares with side } s = \sqrt{x}`} display /></div><span class="step-note">side length = height of base</span></div>
			<div class="step"><div class="step-math"><Katex math={r`A(x) = s^2 = x`} display /></div><span class="step-note">area of square</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_0^4 x\,dx = \left[\frac{x^2}{2}\right]_0^4`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 8`} display /></div><span class="step-note">cubic units ✓</span></div>
		</div>

		<!-- ═══ SECTION: Shell Method ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>The Shell Method</h3>
			<p>Instead of slicing perpendicular to the axis of rotation, we can slice <em>parallel</em> to it. This gives us cylindrical shells — thin hollow cylinders.</p>
			<p>Consider a region under <Katex math={r`y = f(x)`} /> being revolved around the y-axis. At position <Katex math="x" />, we have a cylindrical shell of:</p>
			<ul>
				<li><strong>Radius:</strong> <Katex math="x" /> (distance from the axis)</li>
				<li><strong>Height:</strong> <Katex math={r`f(x)`} /></li>
				<li><strong>Thickness:</strong> <span class="d-highlight">d</span> (infinitesimal)</li>
			</ul>
			<p>Now here is the beautiful part. Imagine cutting the shell along its length and unrolling it flat. You get a thin rectangle of width <Katex math={r`2\pi x`} /> (the circumference), height <Katex math={r`f(x)`} />, and thickness <span class="d-highlight">d</span>.</p>
			<p>But wait — a real cylinder has <em>curvature</em>. When you unroll it, the outer edge is longer than the inner edge. Doesn't that create a trapezoid, not a rectangle?</p>
			<p>No. The outer circumference is <Katex math={r`2\pi(x + d)`} /> and the inner is <Katex math={r`2\pi x`} />. The difference is <Katex math={r`2\pi d`} />, which is infinitesimal — but the discrepancy in the unrolled shape involves the product of this difference with the height, producing a term proportional to <Katex math="d^2" />. Since <Katex math="d^2 = 0" />, the curvature correction <strong>vanishes exactly</strong>. The unrolled shell is a perfect rectangle.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Shell Method — Full Derivation</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Shell volume} = \text{outer cylinder} - \text{inner cylinder}`} display /></div><span class="step-note">exact decomposition</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi(x+d)^2 f(x) - \pi x^2 f(x)`} display /></div><span class="step-note">both cylinders have height <Katex math={r`f(x)`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi f(x)\bigl[(x+d)^2 - x^2\bigr]`} display /></div><span class="step-note">factor</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi f(x)\bigl[x^2 + 2xd + d^2 - x^2\bigr]`} display /></div><span class="step-note">expand</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi f(x)\bigl[2xd + d^2\bigr]`} display /></div><span class="step-note">cancel <Katex math="x^2" /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi f(x) \cdot 2x \cdot d`} display /></div><span class="step-note"><Katex math="d^2 = 0" /> kills the curvature term</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`V = \int_a^b 2\pi x\, f(x)\,dx`} display /></div><span class="step-note">integrate ✓</span></div>
		</div>

		<SDGAdvantage title="Curvature Vanishes">
			<p>The <Katex math="d^2" /> term in the shell derivation is precisely the curvature correction — the difference between a curved shell and a flat rectangle. In standard calculus, you argue this error is "negligible in the limit." In Neocalculus, it's not negligible — it's <strong>zero</strong>. The shell literally <em>is</em> a rectangle. This is why the SDG approach makes integral setup feel obvious rather than approximate.</p>
		</SDGAdvantage>

		<!-- ═══ Example: Shell vs Washer comparison ═══ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Shell Method: Same Region as Washer</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Region between } y = x \text{ and } y = x^2, \text{ revolved around the y-axis}`} display /></div><span class="step-note">same region, different axis</span></div>
			<div class="step"><div class="step-math"><Katex math={r`V = \int_0^1 2\pi x\bigl[x - x^2\bigr]\,dx`} display /></div><span class="step-note">shell: radius = x, height = x − x²</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 2\pi \int_0^1 \bigl(x^2 - x^3\bigr)\,dx`} display /></div><span class="step-note">distribute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 2\pi \left[\frac{x^3}{3} - \frac{x^4}{4}\right]_0^1`} display /></div><span class="step-note">antidifferentiate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2\pi\left(\frac{1}{3} - \frac{1}{4}\right) = \frac{\pi}{6}`} display /></div><span class="step-note">✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>Notice: the washer example (same region, x-axis) gave <Katex math={r`\tfrac{2\pi}{15}`} />, while the shell example (same region, y-axis) gives <Katex math={r`\tfrac{\pi}{6}`} />. Different axes of rotation produce different solids — and different volumes. But in each case, the slicing principle gives an exact answer with no ambiguity about the setup.</p>
		</div>

		<DigDeeper title="Disk vs. Shell: which should you use?">
			<p>The disk/washer method slices <strong>perpendicular</strong> to the axis of rotation. The shell method slices <strong>parallel</strong> to it. They always give the same answer for the same solid, but one may lead to a simpler integral.</p>
			<p><strong>Rule of thumb:</strong> If the region is described as <Katex math={r`y = f(x)`} /> and you rotate around the x-axis, disks are natural. If you rotate around the y-axis, shells are usually easier. If you'd need to split the integral or invert the function for one method, try the other.</p>
		</DigDeeper>

		<!-- ═══ SECTION: Surface Area of Revolution ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Surface Area of Revolution</h3>
			<p>Now instead of volume, we ask: what is the <em>surface area</em> of the solid formed by rotating <Katex math={r`y = f(x)`} /> around the x-axis?</p>
			<p>Take an infinitesimal piece of the curve from <Katex math="x" /> to <Katex math={r`x + d`} />. By microstraightness, this piece is a straight line segment. Its horizontal run is <span class="d-highlight">d</span> and its vertical rise is <Katex math={r`f'(x) \cdot d`} />. By the Pythagorean theorem, its length is:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Surface Area — Derivation</div>
			<div class="step"><div class="step-math"><Katex math={r`\ell = \sqrt{d^2 + [f'(x)\,d]^2} = \sqrt{d^2(1 + f'(x)^2)} = |d|\sqrt{1 + f'(x)^2}`} display /></div><span class="step-note">arc length of infinitesimal segment</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{When this segment rotates, it sweeps a band (frustum) of width } \ell`} display /></div><span class="step-note">but is it a frustum or a cylinder?</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Radius at } x \text{: } f(x). \quad \text{Radius at } x+d \text{: } f(x) + f'(x)\,d`} display /></div><span class="step-note">two ends of the band</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Frustum area} = \pi\bigl[f(x) + f(x) + f'(x)\,d\bigr] \cdot \ell`} display /></div><span class="step-note">sum of radii × slant × π</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \pi\bigl[2f(x) + f'(x)\,d\bigr] \cdot d\sqrt{1 + f'(x)^2}`} display /></div><span class="step-note">substitute <Katex math={r`\ell`} /></span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 2\pi f(x)\sqrt{1 + f'(x)^2}\,d + \pi f'(x)\sqrt{1 + f'(x)^2}\,d^2`} display /></div><span class="step-note">distribute</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= 2\pi f(x)\sqrt{1 + f'(x)^2}\,d`} display /></div><span class="step-note"><Katex math="d^2 = 0" /> kills the frustum correction</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`S = \int_a^b 2\pi f(x)\,\sqrt{1 + f'(x)^2}\,dx`} display /></div><span class="step-note">integrate ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>The crucial step: the frustum correction — the difference between the two radii — contributes a <Katex math="d^2" /> term that vanishes exactly. The frustum becomes a cylinder. This is why the formula uses the radius <Katex math={r`f(x)`} /> rather than an average of two radii.</p>
		</div>

		<SDGAdvantage title="Frustum Becomes Cylinder">
			<p>Standard calculus textbooks spend significant effort justifying the frustum-to-cylinder simplification using limits. In SDG, the argument is algebraic and immediate: the frustum correction involves <Katex math="d^2" />, which equals zero. The infinitesimal band is <strong>exactly</strong> a cylinder.</p>
		</SDGAdvantage>

		<!-- ═══ Example: Surface Area of a Sphere ═══ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Surface Area of a Sphere</div>
			<div class="step"><div class="step-math"><Katex math={r`f(x) = \sqrt{r^2 - x^2}, \quad f'(x) = \frac{-x}{\sqrt{r^2 - x^2}}`} display /></div><span class="step-note">semicircle and its derivative</span></div>
			<div class="step"><div class="step-math"><Katex math={r`1 + f'(x)^2 = 1 + \frac{x^2}{r^2 - x^2} = \frac{r^2}{r^2 - x^2}`} display /></div><span class="step-note">simplify under the radical</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\sqrt{1 + f'(x)^2} = \frac{r}{\sqrt{r^2 - x^2}}`} display /></div><span class="step-note">take square root</span></div>
			<div class="step"><div class="step-math"><Katex math={r`S = \int_{-r}^{r} 2\pi \sqrt{r^2 - x^2} \cdot \frac{r}{\sqrt{r^2 - x^2}}\,dx`} display /></div><span class="step-note">substitute into surface area formula</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \int_{-r}^{r} 2\pi r\,dx`} display /></div><span class="step-note">the radicals cancel!</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= 2\pi r \cdot 2r = 4\pi r^2`} display /></div><span class="step-note">Archimedes' formula ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>A lovely result: the integrand simplifies to a constant. The surface area of a sphere depends only on its radius — every latitude band contributes the same amount of area.</p>
		</div>

		<!-- ═══ SECTION: Work ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Work</h3>
			<p>Work is force times distance. When force is constant, the calculation is trivial: <Katex math="W = Fd" />. But when force varies — a stretching spring gets harder, gravity weakens with altitude, a pump lifts water from different depths — we need integration.</p>
			<p>Move an object from <Katex math="x" /> to <Katex math={r`x + d`} />. Over this infinitesimal displacement, the force <Katex math={r`F(x)`} /> is constant (microstraightness). The infinitesimal work is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`dW = F(x) \cdot d, \qquad W = \int_a^b F(x)\,dx`} display />
		</div>

		<!-- ═══ Example: Spring ═══ -->
		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Work to Stretch a Spring</div>
			<div class="step"><div class="step-math"><Katex math={r`F(x) = kx \quad \text{(Hooke's law)}`} display /></div><span class="step-note">spring force at extension x</span></div>
			<div class="step"><div class="step-math"><Katex math={r`W = \int_0^L kx\,dx = k\left[\frac{x^2}{2}\right]_0^L`} display /></div><span class="step-note">integrate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`W = \frac{1}{2}kL^2`} display /></div><span class="step-note">✓</span></div>
		</div>

		<!-- ═══ Example: Pumping Water ═══ -->
		<div class="neo-prose" use:reveal>
			<h4>Pumping Water from a Hemispherical Tank</h4>
			<p>Consider a hemispherical tank of radius <Katex math="R" />, filled with water, oriented with its flat side on top. We want to pump all the water out over the rim. Place the origin at the center of the flat top, so the bottom of the tank is at depth <Katex math="R" />.</p>
			<p>At depth <Katex math="y" /> below the rim, the cross-section of the hemisphere is a circle of radius <Katex math={r`\sqrt{R^2 - (R - y)^2} = \sqrt{2Ry - y^2}`} />. Wait — let's set up coordinates more carefully. Place <Katex math="y" /> measuring <em>downward</em> from the rim, so the tank extends from <Katex math="y = 0" /> (top) to <Katex math="y = R" /> (bottom).</p>
			<p>At depth <Katex math="y" />, the hemisphere has radius <Katex math={r`r(y) = \sqrt{2Ry - y^2}`} />. An infinitesimal slab of water at depth <Katex math="y" /> has:</p>
			<ul>
				<li><strong>Volume:</strong> <Katex math={r`\pi r(y)^2 \cdot d = \pi(2Ry - y^2)\,d`} /></li>
				<li><strong>Weight:</strong> <Katex math={r`\rho g \cdot \pi(2Ry - y^2)\,d`} /> where <Katex math={r`\rho`} /> is water density</li>
				<li><strong>Distance to lift:</strong> <Katex math="y" /> (it must travel from depth y to the rim)</li>
			</ul>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Example — Pumping a Hemispherical Tank</div>
			<div class="step"><div class="step-math"><Katex math={r`dW = \rho g \,\pi(2Ry - y^2) \cdot y \,\cdot d`} display /></div><span class="step-note">force × distance for each slab</span></div>
			<div class="step"><div class="step-math"><Katex math={r`W = \rho g \pi \int_0^R (2Ry^2 - y^3)\,dy`} display /></div><span class="step-note">integrate from top to bottom</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \rho g \pi \left[\frac{2R y^3}{3} - \frac{y^4}{4}\right]_0^R`} display /></div><span class="step-note">antidifferentiate</span></div>
			<div class="step"><div class="step-math"><Katex math={r`= \rho g \pi \left(\frac{2R^4}{3} - \frac{R^4}{4}\right)`} display /></div><span class="step-note">evaluate</span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`= \frac{5}{12}\rho g \pi R^4`} display /></div><span class="step-note">✓</span></div>
		</div>

		<StandardCalcBox>
			<p>Standard calculus derives the same work formula <Katex math={r`W = \int_a^b F(x)\,dx`} /> but must argue that each Riemann sum approximation converges in the limit. In Neocalculus, each infinitesimal slab is <em>exactly</em> a cylinder of water, lifted <em>exactly</em> a distance <Katex math="y" />, with no limiting argument needed.</p>
		</StandardCalcBox>

		<!-- ═══ SECTION: Center of Mass ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Center of Mass and Moments</h3>
			<p>Consider a thin rod lying along the x-axis from <Katex math="a" /> to <Katex math="b" />, with density (mass per unit length) <Katex math={r`\rho(x)`} />. How do we find its center of mass — the point where we could balance it on a fingertip?</p>
			<p>Each infinitesimal piece at position <Katex math="x" /> has mass <Katex math={r`dm = \rho(x) \cdot d`} />. Its <strong>moment</strong> about the origin — how much it contributes to tipping the rod — is position times mass:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Center of Mass of a Thin Rod</div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Total mass: } M = \int_a^b \rho(x)\,dx`} display /></div><span class="step-note">accumulate infinitesimal masses</span></div>
			<div class="step"><div class="step-math"><Katex math={r`\text{Moment about origin: } M_0 = \int_a^b x\,\rho(x)\,dx`} display /></div><span class="step-note">accumulate <Katex math={r`x \cdot \rho(x) \cdot d`} /></span></div>
			<div class="step step-result"><div class="step-math"><Katex math={r`\bar{x} = \frac{M_0}{M} = \frac{\displaystyle\int_a^b x\,\rho(x)\,dx}{\displaystyle\int_a^b \rho(x)\,dx}`} display /></div><span class="step-note">center of mass ✓</span></div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>If the density is constant, <Katex math={r`\rho(x) = \rho`} /> cancels from top and bottom, and the center of mass is just the geometric centroid:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\bar{x} = \frac{\int_a^b x\,dx}{\int_a^b dx} = \frac{a + b}{2}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>The midpoint — exactly what intuition says. For non-uniform density, the center of mass shifts toward the heavier end.</p>
		</div>

		<!-- ═══ SECTION: Probability Density ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Probability Density — An Infinitesimal Interpretation</h3>
			<p>Here is a surprising application of infinitesimal thinking. In probability, a <strong>probability density function</strong> <Katex math={r`p(x)`} /> describes how likely a continuous random variable is to fall near a particular value. But what does <Katex math={r`p(x)`} /> actually <em>mean</em>?</p>
			<p>In the SDG framework, the answer is beautifully direct. The probability that the variable falls in the infinitesimal interval <Katex math={r`[a, \, a + d]`} /> is:</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`P\bigl(x \in [a, \, a + d]\bigr) = p(a) \cdot d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>This is an <em>exact</em> infinitesimal probability — not an approximation. The total probability over any interval is then:</p>
			<Katex math={r`P(a \le x \le b) = \int_a^b p(x)\,dx`} display />
			<p>The slicing principle at work once more: slice the event into infinitesimal sub-events, compute each one's exact probability, and integrate.</p>
		</div>

		<!-- ═══ SECTION: Pappus' Theorem ═══ -->
		<div class="neo-prose" use:reveal>
			<h3>Pappus' Theorem</h3>
			<p>We close with an elegant theorem that connects centroids and volumes of revolution. Suppose a plane region of area <Katex math="A" /> is revolved around an external axis. How far does each infinitesimal piece of area travel? It sweeps a circle of circumference <Katex math={r`2\pi \bar{r}`} />, where <Katex math={r`\bar{r}`} /> is the distance from the centroid to the axis.</p>
		</div>

		<Callout type="theorem" title="Pappus' Centroid Theorem (Volumes)">
			<p>The volume of a solid of revolution equals the area of the generating region times the distance traveled by its centroid:</p>
			<Katex math={r`V = 2\pi\,\bar{r}\,A`} display />
			<p>where <Katex math={r`\bar{r}`} /> is the distance from the centroid to the axis of rotation.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p><strong>Quick check:</strong> A circle of radius <Katex math="a" /> centered at distance <Katex math="R" /> from the axis (with <Katex math="R > a" />) generates a torus when revolved. Its area is <Katex math={r`\pi a^2`} />, and its centroid travels a distance <Katex math={r`2\pi R`} />. Pappus gives <Katex math={r`V = 2\pi R \cdot \pi a^2 = 2\pi^2 R a^2`} /> — the correct volume of a torus.</p>
		</div>

		<!-- ═══ HISTORY ═══ -->
		<HistoryBox name="Archimedes of Syracuse" years="c. 287–212 BC">
			<p>Two thousand years before Newton or Leibniz, Archimedes computed volumes and surface areas by <strong>slicing</strong>. His <em>method of exhaustion</em> — filling a shape with ever-finer approximations — anticipated integration. He proved that the volume of a sphere is <Katex math={r`\tfrac{2}{3}`} /> that of its circumscribing cylinder, and reportedly asked for this figure to be engraved on his tombstone.</p>
			<p>In his lost work <em>The Method</em>, rediscovered in 1906 on a palimpsest, Archimedes revealed an even more remarkable technique: he balanced infinitesimal slices on a lever to discover formulas before proving them rigorously. This "mechanical method" is strikingly close to the infinitesimal slicing principle we use today.</p>
		</HistoryBox>

		<!-- ═══ CHAPTER SUMMARY ═══ -->
		<ChapterSummary>
			<ul>
				<li><strong>The Slicing Principle:</strong> slice into infinitesimal pieces, compute each contribution exactly (using <Katex math="d^2 = 0" />), and integrate.</li>
				<li><strong>Disk method:</strong> <Katex math={r`V = \int_a^b \pi[f(x)]^2\,dx`} /> — each disk is exactly a cylinder.</li>
				<li><strong>Washer method:</strong> <Katex math={r`V = \int_a^b \pi[R(x)^2 - r(x)^2]\,dx`} /> — disks with holes.</li>
				<li><strong>Cross-sections:</strong> <Katex math={r`V = \int_a^b A(x)\,dx`} /> — the most general slicing formula.</li>
				<li><strong>Shell method:</strong> <Katex math={r`V = \int_a^b 2\pi x\,f(x)\,dx`} /> — curvature vanishes because <Katex math="d^2 = 0" />.</li>
				<li><strong>Surface area:</strong> <Katex math={r`S = \int_a^b 2\pi f(x)\sqrt{1 + f'(x)^2}\,dx`} /> — frustum becomes cylinder.</li>
				<li><strong>Work:</strong> <Katex math={r`W = \int_a^b F(x)\,dx`} /> — force × infinitesimal displacement.</li>
				<li><strong>Center of mass:</strong> <Katex math={r`\bar{x} = \frac{\int x\,\rho(x)\,dx}{\int \rho(x)\,dx}`} />.</li>
				<li><strong>Probability:</strong> <Katex math={r`P(x \in [a, a+d]) = p(a) \cdot d`} /> exactly.</li>
				<li><strong>Pappus' theorem:</strong> <Katex math={r`V = 2\pi\bar{r}A`} />.</li>
			</ul>
		</ChapterSummary>

		<!-- ═══ EXERCISES ═══ -->
		<div class="exercises-group" use:reveal>
			<div class="exercises-group-title">Exercises</div>

			<!-- Disk Method -->
			<Exercise number={1}>
				<p><strong>Warm-up.</strong> Find the volume of the solid obtained by rotating <Katex math={r`y = \sqrt{x}`} /> around the x-axis from <Katex math="x=0" /> to <Katex math="x=4" />.</p>
				{#snippet solution()}<Katex math={r`V = \int_0^4 \pi x\,dx = \pi\left[\frac{x^2}{2}\right]_0^4 = 8\pi`} display />{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Warm-up.</strong> Verify the volume of a sphere by setting up the disk integral for <Katex math={r`y = \sqrt{r^2 - x^2}`} /> rotated around the x-axis. Show each step.</p>
				{#snippet solution()}
					<Katex math={r`V = \int_{-r}^r \pi(r^2 - x^2)\,dx = \pi\left[r^2 x - \frac{x^3}{3}\right]_{-r}^r = \pi\left(\frac{2r^3}{1} - \frac{2r^3}{3}\right) = \frac{4}{3}\pi r^3`} display />
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Core.</strong> Find the volume of the solid formed by rotating <Katex math={r`y = x^2`} /> around the x-axis from <Katex math="x = 0" /> to <Katex math="x = 2" />.</p>
				{#snippet solution()}
					<Katex math={r`V = \int_0^2 \pi x^4\,dx = \pi\left[\frac{x^5}{5}\right]_0^2 = \frac{32\pi}{5}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p><strong>Core.</strong> Find the volume of a cone with height <Katex math="h" /> and base radius <Katex math="r" /> by revolving the line <Katex math={r`y = \frac{r}{h}(h - x)`} /> around the x-axis from <Katex math="x = 0" /> to <Katex math="x = h" />. Compare with the formula <Katex math={r`V = \frac{1}{3}\pi r^2 h`} />.</p>
				{#snippet solution()}
					<Katex math={r`V = \int_0^h \pi \frac{r^2}{h^2}(h-x)^2\,dx`} display />
					<p>Let <Katex math="u = h - x" />, <Katex math="du = -dx" />:</p>
					<Katex math={r`= \frac{\pi r^2}{h^2}\int_0^h u^2\,du = \frac{\pi r^2}{h^2}\cdot\frac{h^3}{3} = \frac{1}{3}\pi r^2 h \quad\checkmark`} display />
				{/snippet}
			</Exercise>

			<!-- Washer Method -->
			<Exercise number={5}>
				<p><strong>Core.</strong> Find the volume of the solid formed by revolving the region between <Katex math={r`y = x`} /> and <Katex math={r`y = x^2`} /> around the x-axis, for <Katex math={r`0 \le x \le 1`} />.</p>
				{#snippet solution()}
					<p>Outer radius <Katex math="R = x" />, inner radius <Katex math="r = x^2" />:</p>
					<Katex math={r`V = \int_0^1 \pi(x^2 - x^4)\,dx = \pi\left[\frac{x^3}{3} - \frac{x^5}{5}\right]_0^1 = \pi\left(\frac{1}{3}-\frac{1}{5}\right) = \frac{2\pi}{15}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p><strong>Core.</strong> Find the volume of the solid formed by revolving the region between <Katex math={r`y = \sqrt{x}`} /> and <Katex math={r`y = x`} /> around the x-axis, for <Katex math={r`0 \le x \le 1`} />.</p>
				{#snippet solution()}
					<p>On [0,1], <Katex math={r`\sqrt{x} \ge x`} />, so <Katex math={r`R = \sqrt{x}`} />, <Katex math="r = x" />:</p>
					<Katex math={r`V = \int_0^1 \pi(x - x^2)\,dx = \pi\left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1 = \pi\left(\frac{1}{2} - \frac{1}{3}\right) = \frac{\pi}{6}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p><strong>Challenge.</strong> The region bounded by <Katex math={r`y = 2 - x^2`} /> and <Katex math={r`y = x`} /> (first quadrant only) is revolved around the x-axis. Set up the washer integral. (You'll need to find the intersection point first.)</p>
				{#snippet solution()}
					<p>Intersection: <Katex math={r`x = 2 - x^2 \Rightarrow x^2 + x - 2 = 0 \Rightarrow x = 1`} /> (taking positive root).</p>
					<p>On <Katex math="[0,1]" />, <Katex math="R = 2 - x^2" /> and <Katex math="r = x" />:</p>
					<Katex math={r`V = \int_0^1 \pi\bigl[(2-x^2)^2 - x^2\bigr]\,dx = \int_0^1 \pi(4 - 4x^2 + x^4 - x^2)\,dx`} display />
					<Katex math={r`= \pi\int_0^1(4 - 5x^2 + x^4)\,dx = \pi\left[4x - \frac{5x^3}{3} + \frac{x^5}{5}\right]_0^1 = \pi\left(4 - \frac{5}{3} + \frac{1}{5}\right) = \frac{38\pi}{15}`} display />
				{/snippet}
			</Exercise>

			<!-- Shell Method -->
			<Exercise number={8}>
				<p><strong>Core.</strong> Use the shell method to find the volume of the solid formed by revolving <Katex math={r`y = x^2`} /> (from <Katex math="x = 0" /> to <Katex math="x = 1" />) around the y-axis.</p>
				{#snippet solution()}
					<Katex math={r`V = \int_0^1 2\pi x \cdot x^2\,dx = 2\pi\int_0^1 x^3\,dx = 2\pi\cdot\frac{1}{4} = \frac{\pi}{2}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={9}>
				<p><strong>Core.</strong> Use the shell method to find the volume when the region between <Katex math={r`y = x`} /> and <Katex math={r`y = x^2`} /> (for <Katex math={r`0 \le x \le 1`} />) is revolved around the y-axis.</p>
				{#snippet solution()}
					<Katex math={r`V = \int_0^1 2\pi x(x - x^2)\,dx = 2\pi\int_0^1(x^2 - x^3)\,dx = 2\pi\left[\frac{1}{3} - \frac{1}{4}\right] = \frac{\pi}{6}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={10}>
				<p><strong>Challenge.</strong> Set up <em>both</em> a disk/washer integral and a shell integral for the volume of the solid formed by revolving <Katex math={r`y = \sqrt{x}`} /> (from <Katex math="x = 0" /> to <Katex math="x = 4" />) around the y-axis. Verify they give the same answer.</p>
				{#snippet solution()}
					<p><strong>Shell method</strong> (integrate in x): <Katex math={r`V = \int_0^4 2\pi x \cdot \sqrt{x}\,dx = 2\pi\int_0^4 x^{3/2}\,dx = 2\pi\cdot\frac{2}{5}\cdot 4^{5/2} = 2\pi\cdot\frac{2}{5}\cdot 32 = \frac{128\pi}{5}`} display /></p>
					<p><strong>Disk method</strong> (integrate in y, since axis is y): <Katex math={r`y = \sqrt{x}`} /> means <Katex math={r`x = y^2`} />. The disks go from <Katex math="y = 0" /> to <Katex math="y = 2" /> with outer radius 4 and inner radius <Katex math="y^2" />:</p>
					<Katex math={r`V = \int_0^2 \pi(4^2 - (y^2)^2)\,dy = \pi\int_0^2(16 - y^4)\,dy = \pi\left[16y - \frac{y^5}{5}\right]_0^2 = \pi\left(32 - \frac{32}{5}\right) = \frac{128\pi}{5} \quad\checkmark`} display />
				{/snippet}
			</Exercise>

			<!-- Work -->
			<Exercise number={11}>
				<p><strong>Warm-up.</strong> Find the work done in compressing a spring with constant <Katex math="k = 200" /> N/m by 0.1 m.</p>
				{#snippet solution()}<p><Katex math={r`W = \frac{1}{2}(200)(0.1)^2 = 1`} /> Joule.</p>{/snippet}
			</Exercise>

			<Exercise number={12}>
				<p><strong>Core.</strong> A spring requires 10 J of work to stretch it from its natural length to 0.5 m beyond natural length. Find the spring constant <Katex math="k" />, then find the work needed to stretch it from 0.5 m to 1 m beyond natural length.</p>
				{#snippet solution()}
					<p>From <Katex math={r`\frac{1}{2}k(0.5)^2 = 10`} />, we get <Katex math="k = 80" /> N/m.</p>
					<Katex math={r`W = \int_{0.5}^{1} 80x\,dx = 80\left[\frac{x^2}{2}\right]_{0.5}^1 = 80\left(\frac{1}{2} - \frac{1}{8}\right) = 80 \cdot \frac{3}{8} = 30 \text{ J}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={13}>
				<p><strong>Challenge.</strong> A chain of length 20 m and mass 5 kg/m hangs from a ledge. Find the work required to pull the entire chain up to the top. (Hint: when <Katex math="y" /> meters of chain have been pulled up, the remaining hanging length is <Katex math={r`20 - y`} />.)</p>
				{#snippet solution()}
					<p>When <Katex math="y" /> m has been pulled up, the hanging weight is <Katex math={r`5g(20 - y)`} /> N. The infinitesimal work to pull up the next <Katex math="d" /> is <Katex math={r`5g(20 - y)\,d`} />:</p>
					<Katex math={r`W = \int_0^{20} 5g(20-y)\,dy = 5g\left[20y - \frac{y^2}{2}\right]_0^{20} = 5g\left(400 - 200\right) = 1000g \approx 9800 \text{ J}`} display />
				{/snippet}
			</Exercise>

			<Exercise number={14}>
				<p><strong>Challenge.</strong> A hemispherical tank of radius 3 m is full of water (<Katex math={r`\rho = 1000`} /> kg/m<sup>3</sup>). Find the work to pump all the water to the rim. Express your answer in terms of <Katex math="g" />.</p>
				{#snippet solution()}
					<p>Using the formula derived in the chapter with <Katex math="R = 3" />:</p>
					<Katex math={r`W = \rho g \pi \int_0^3 (6y - y^2) \cdot y\,dy = 1000g\pi\int_0^3(6y^2 - y^3)\,dy`} display />
					<Katex math={r`= 1000g\pi\left[2y^3 - \frac{y^4}{4}\right]_0^3 = 1000g\pi\left(54 - \frac{81}{4}\right) = 1000g\pi\cdot\frac{135}{4} = \frac{135000\pi g}{4} \text{ J}`} display />
				{/snippet}
			</Exercise>

			<!-- Surface Area -->
			<Exercise number={15}>
				<p><strong>Core.</strong> Verify that the surface area of a cone with slant height <Katex math={r`\ell`} /> and base radius <Katex math="r" /> is <Katex math={r`\pi r \ell`} /> by revolving the line <Katex math={r`y = \frac{r}{h}x`} /> from <Katex math="x = 0" /> to <Katex math="x = h" /> and using the surface area formula.</p>
				{#snippet solution()}
					<p><Katex math={r`f(x) = \frac{r}{h}x`} />, <Katex math={r`f'(x) = \frac{r}{h}`} />, <Katex math={r`\sqrt{1 + f'^2} = \sqrt{1 + \frac{r^2}{h^2}} = \frac{\ell}{h}`} /> where <Katex math={r`\ell = \sqrt{h^2 + r^2}`} />.</p>
					<Katex math={r`S = \int_0^h 2\pi \cdot \frac{r}{h}x \cdot \frac{\ell}{h}\,dx = \frac{2\pi r \ell}{h^2}\int_0^h x\,dx = \frac{2\pi r\ell}{h^2}\cdot\frac{h^2}{2} = \pi r\ell \quad\checkmark`} display />
				{/snippet}
			</Exercise>

			<Exercise number={16}>
				<p><strong>Core.</strong> Set up the integral for the surface area of the solid formed by revolving <Katex math={r`y = x^2`} /> around the x-axis from <Katex math="x = 0" /> to <Katex math="x = 1" />. (You do not need to evaluate the integral.)</p>
				{#snippet solution()}
					<p><Katex math={r`f(x) = x^2`} />, <Katex math={r`f'(x) = 2x`} />:</p>
					<Katex math={r`S = \int_0^1 2\pi x^2 \sqrt{1 + 4x^2}\,dx`} display />
					<p>This integral requires trigonometric substitution (let <Katex math={r`2x = \tan\theta`} />) and is left as a calculus challenge.</p>
				{/snippet}
			</Exercise>

			<!-- Cross-section -->
			<Exercise number={17}>
				<p><strong>Core.</strong> A solid has its base in the xy-plane as the region under <Katex math={r`y = 1 - x^2`} /> from <Katex math="x = -1" /> to <Katex math="x = 1" />. Cross-sections perpendicular to the x-axis are equilateral triangles with one side on the base. Find the volume.</p>
				{#snippet solution()}
					<p>Side length <Katex math={r`s = 1 - x^2`} />. Area of equilateral triangle: <Katex math={r`A = \frac{\sqrt{3}}{4}s^2 = \frac{\sqrt{3}}{4}(1-x^2)^2`} />.</p>
					<Katex math={r`V = \int_{-1}^1 \frac{\sqrt{3}}{4}(1 - x^2)^2\,dx = \frac{\sqrt{3}}{2}\int_0^1(1 - 2x^2 + x^4)\,dx`} display />
					<Katex math={r`= \frac{\sqrt{3}}{2}\left[1 - \frac{2}{3} + \frac{1}{5}\right] = \frac{\sqrt{3}}{2}\cdot\frac{8}{15} = \frac{4\sqrt{3}}{15}`} display />
				{/snippet}
			</Exercise>

			<!-- Center of mass -->
			<Exercise number={18}>
				<p><strong>Core.</strong> A thin rod of length 2 m has density <Katex math={r`\rho(x) = 3x`} /> kg/m, where <Katex math="x" /> is measured from one end. Find the total mass and the center of mass.</p>
				{#snippet solution()}
					<Katex math={r`M = \int_0^2 3x\,dx = 3\cdot\frac{4}{2} = 6 \text{ kg}`} display />
					<Katex math={r`M_0 = \int_0^2 x \cdot 3x\,dx = 3\int_0^2 x^2\,dx = 3\cdot\frac{8}{3} = 8 \text{ kg·m}`} display />
					<Katex math={r`\bar{x} = \frac{8}{6} = \frac{4}{3} \approx 1.33 \text{ m}`} display />
					<p>The center of mass is shifted toward the heavier end, as expected.</p>
				{/snippet}
			</Exercise>

			<!-- Exploration -->
			<Exercise number={19}>
				<p><strong>Exploration.</strong> Use Pappus' theorem to find the volume of a torus generated by revolving a circle of radius <Katex math="a" /> (centered at distance <Katex math="R > a" /> from the axis) around an external axis. Then verify by setting up the integral directly using the disk or shell method.</p>
				{#snippet solution()}
					<p><strong>Pappus:</strong> The centroid of the circle is at distance <Katex math="R" /> from the axis. Area <Katex math={r`= \pi a^2`} />.</p>
					<Katex math={r`V = 2\pi R \cdot \pi a^2 = 2\pi^2 R a^2`} display />
					<p><strong>Shell verification:</strong> Parameterize the circle as <Katex math={r`y = \pm\sqrt{a^2 - (x - R)^2}`} /> for <Katex math={r`x \in [R - a, R + a]`} />. Each shell at radius <Katex math="x" /> has height <Katex math={r`2\sqrt{a^2 - (x-R)^2}`} />:</p>
					<Katex math={r`V = \int_{R-a}^{R+a} 2\pi x \cdot 2\sqrt{a^2 - (x-R)^2}\,dx`} display />
					<p>Substituting <Katex math="u = x - R" />: the odd part (in <Katex math="u" />) vanishes by symmetry, and the even part gives <Katex math={r`4\pi R \int_{-a}^{a}\sqrt{a^2 - u^2}\,du = 4\pi R \cdot \frac{\pi a^2}{2} = 2\pi^2 R a^2`} />. ✓</p>
				{/snippet}
			</Exercise>

			<Exercise number={20}>
				<p><strong>Exploration.</strong> Explain, in your own words, why <Katex math="d^2 = 0" /> makes every infinitesimal shell exactly a rectangle. Where does the <Katex math="d^2" /> term appear in the derivation, and what does it represent geometrically?</p>
				{#snippet solution()}
					<p>When we compute the shell volume as <Katex math={r`\pi(x+d)^2 f(x) - \pi x^2 f(x)`} />, we get <Katex math={r`\pi f(x)(2xd + d^2)`} />. The term <Katex math={r`2xd`} /> is the volume of the "unrolled rectangle" (width <Katex math={r`2\pi x`} />, height <Katex math={r`f(x)`} />, thickness <Katex math="d" />). The term <Katex math="d^2" /> represents the <strong>curvature correction</strong> — the extra volume in the outer part of the shell due to the fact that the outer circumference is larger than the inner. Setting <Katex math="d^2 = 0" /> says this curvature is exactly zero: an infinitesimally thin shell has no discernible difference between its inner and outer edges.</p>
				{/snippet}
			</Exercise>
		</div>

		<!-- ═══ LOOKING AHEAD ═══ -->
		<LookingAhead>
			<p>So far, we've used integration to accumulate exact infinitesimal contributions — areas, volumes, work, mass. In the next chapter, we turn to a different kind of accumulation: <strong>infinite sums</strong>. Taylor polynomials will let us approximate any smooth function as a polynomial, with the error controlled by higher-order infinitesimals. The key idea: if <Katex math="d^2 = 0" /> gives us the first derivative, what happens when we allow <Katex math="d^2 \neq 0" /> but <Katex math="d^3 = 0" />?</p>
		</LookingAhead>

		<NextChapter href="ch7" title="Infinite Series and Taylor Polynomials" number="7" />
	</div>
</section>
