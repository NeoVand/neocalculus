<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import VolumeSlicer from '$lib/components/demos/VolumeSlicer.svelte';
	import MamikonTangentSweep from '$lib/components/demos/MamikonTangentSweep.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch6">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 6</span>
			<h2 class="chapter-title">Integration Geometry and Techniques</h2>
			<div class="chapter-epigraph">
				<blockquote>“What should we add, and which antiderivative can do the adding?”</blockquote>
				<p class="epigraph-attr">The two practical questions of integration</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Chapter 5 gave integration a meaning: accumulate a rate over an interval. Real problems now
				ask us to make two choices. First, what local quantity should be accumulated? Second, how
				can we find an antiderivative when the basic table is not enough?
			</p>
			<p>
				Consider a solid whose cross-sectional area at position <Katex math="x" /> is
				<Katex math="A(x)" /> square centimetres. A thin ordinary slab of width
				<Katex math={r`\Delta x`} /> has volume approximately
				<Katex math={r`A(x)\Delta x`} />. Adding many such slabs suggests
				<Katex math={r`V=\int_a^b A(x)\,dx`} />. The formula is useful because its units already
				make sense:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`(\text{area})\times(\text{length})=\text{volume}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Start with the slice and its units</h3>
			<p>
				The picture of a thin slab is a modeling guide, not a claim that a finite slab is literally
				a perfect cylinder. For an ordinary width, its volume is approximated by cross-sectional
				area times width. The definite integral gives the accumulated volume under the usual
				continuity conditions.
			</p>
			<p>
				At first order, a displacement <Katex math="d" /> gives the exact local relation
				<Katex math={r`V(x+d)=V(x)+A(x)d`} />. As in Chapter 5, that equation describes how an
				already-defined volume function changes locally; it does not build a finite solid from
				<Katex math="1/d" /> pieces.
			</p>
		</div>

		<Callout type="key-idea" title="The Slice Checklist">
			<ol>
				<li>Choose an input that moves through the object or process.</li>
				<li>Write the contribution per unit of that input.</li>
				<li>
					Check that multiplying the integrand’s units by the input units gives the desired total.
				</li>
				<li>Set bounds that cover the physical interval, then evaluate the integral.</li>
			</ol>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Reverse the chain rule: substitution</h3>
			<p>
				Suppose an integrand contains a function and, nearby, its derivative. The chain rule says
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\frac{d}{dx}F(g(x))=F'(g(x))g'(x)`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Read backward, this tells us how to integrate a composition. We name the inner expression
				<Katex math="u=g(x)" /> and transform the whole differential expression using
				<Katex math={r`du=g'(x)\,dx`} />. This notation records the derivative’s action; it is not
				division by an infinitesimal.
			</p>
		</div>

		<Callout type="key-idea" title="Substitution Rule">
			<p>
				If <Katex math="F'=f" />, then
				<Katex math={r`\int f(g(x))g'(x)\,dx=F(g(x))+C`} />. For a definite integral, transform the
				bounds along with the variable or substitute back before evaluating.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h4>Example: expose the inner input</h4>
			<p>Evaluate <Katex math={r`\int 2x\cos(x^2)\,dx`} />.</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Choose <Katex math="u=x^2" /></div>
			<div class="step">
				<div class="step-math"><Katex math={r`u=x^2,\qquad du=2x\,dx`} display /></div>
				<div class="step-note">the remaining factor is exactly <Katex math="du" /></div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\int 2x\cos(x^2)\,dx=\int\cos u\,du`} display /></div>
				<div class="step-note">rewrite the entire integral</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`=\sin u+C=\sin(x^2)+C`} display /></div>
				<div class="step-note">return to the original input</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Differentiate <Katex math={r`\sin(x^2)`} /> to check: the chain rule returns
				<Katex math={r`2x\cos(x^2)`} />. That check is quick and should become habitual.
			</p>

			<h3>Reverse the product rule: integration by parts</h3>
			<p>The product rule can be rearranged before it is integrated:</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Derive the formula</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(uv)'=u'v+uv'`} display /></div>
				<div class="step-note">product rule</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`uv'=(uv)'-u'v`} display /></div>
				<div class="step-note">isolate the term we want</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\int u\,dv=uv-\int v\,du`} display /></div>
				<div class="step-note">accumulate both sides</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The choice of <Katex math="u" /> should become simpler when differentiated. The remaining factor
				becomes <Katex math="dv" /> and must have an antiderivative we can find.
			</p>
			<h4>Example: integrate <Katex math={r`xe^x`} /></h4>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Let the polynomial simplify</div>
			<div class="step">
				<div class="step-math"><Katex math={r`u=x,\quad dv=e^x\,dx`} display /></div>
				<div class="step-note"><Katex math={r`du=dx`} />, <Katex math="v=e^x" /></div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\int xe^x\,dx=xe^x-\int e^x\,dx`} display /></div>
				<div class="step-note">apply integration by parts</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`=e^x(x-1)+C`} display /></div>
				<div class="step-note">differentiate to verify</div>
			</div>
		</div>

		<DigDeeper title="A third pattern: partial fractions">
			<p>
				A rational function can sometimes be decomposed into simpler fractions. For example,
				<Katex math={r`\frac{1}{x^2-1}=\frac{1}{2(x-1)}-\frac{1}{2(x+1)}`} />, so
				<Katex math={r`\int\frac{dx}{x^2-1}=\tfrac12\ln|x-1|-\tfrac12\ln|x+1|+C`} />
				on intervals that do not cross <Katex math={r`x=\pm1`} />. The algebraic decomposition is
				the main work; integration then uses the logarithm rule.
			</p>
		</DigDeeper>

		<div class="neo-prose" use:reveal>
			<h3>Geometry: integrate the cross-sectional area</h3>
			<p>
				Rotate <Katex math={r`y=\sqrt{x}`} /> around the horizontal axis from
				<Katex math="x=0" /> to <Katex math="x=4" />. At position <Katex math="x" />, the
				cross-section is a disk of radius <Katex math={r`\sqrt{x}`} />, so its area is
				<Katex math={r`A(x)=\pi x`} />. Move the cross-section in the demo and watch its area and
				the accumulated volume change together.
			</p>
		</div>

		<div id="volume-slicer" use:reveal>
			<Figure
				number="6.1"
				caption="Each position x determines one circular cross-section. The volume from 0 to x is the accumulation of these varying areas, not the volume of one visibly thick disk."
			>
				<VolumeSlicer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>At the full endpoint, the volume is</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">A solid generated by <Katex math={r`y=\sqrt{x}`} /></div>
			<div class="step">
				<div class="step-math"><Katex math={r`A(x)=\pi(\sqrt{x})^2=\pi x`} display /></div>
				<div class="step-note">cross-sectional area</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`V=\int_0^4\pi x\,dx=\left[\frac{\pi x^2}{2}\right]_0^4=8\pi`} display />
				</div>
				<div class="step-note">cubic units</div>
			</div>
		</div>

		<Callout type="key-idea" title="Common Geometric Integrands">
			<ul>
				<li>
					<strong>Area between curves:</strong>
					<Katex math={r`\int_a^b(\text{top}-\text{bottom})\,dx`} />.
				</li>
				<li><strong>Disk:</strong> <Katex math={r`\int_a^b\pi R(x)^2\,dx`} />.</li>
				<li><strong>Washer:</strong> <Katex math={r`\int_a^b\pi(R(x)^2-r(x)^2)\,dx`} />.</li>
				<li><strong>Known cross-section:</strong> <Katex math={r`\int_a^b A(x)\,dx`} />.</li>
			</ul>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>A geometric surprise: gather the tangents</h3>
			<p>
				Rectangles and disks are not the only shapes that can reveal an accumulation. Fix a line
				segment of length <Katex math="L" /> tangent to a smooth convex curve and sweep it around the
				curve. Now translate every tangent segment—without rotating it—so that all starting points coincide.
			</p>
			<p>
				Mamikon’s tangent-sweep theorem says that the swept region and the translated
				<strong>tangent cluster</strong> have equal area. For one full turn with constant length,
				the cluster is simply a disk of radius <Katex math="L" />. Change the curve below; the sweep
				changes shape, while its total area does not.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="6.2"
				caption="The moving tangent sweeps a complicated region, but translating the same segments to one origin gathers an equal area. After one full turn, every chosen curve produces the same disk."
			>
				<MamikonTangentSweep />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The equality can be understood locally: each tiny swept sliver is translated rigidly into
				the cluster, so its area is preserved. The theorem is a geometric reorganization of an
				accumulation—not a claim that the two regions have the same boundary.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Area between two graphs</h4>
			<p>
				The curves <Katex math="y=x" /> and <Katex math="y=x^2" /> meet at
				<Katex math="x=0" /> and <Katex math="x=1" />. On that interval, the line is above the
				parabola. A vertical strip therefore has height <Katex math={r`x-x^2`} />, giving
				<Katex math={r`\int_0^1(x-x^2)\,dx=1/6`} /> square unit.
			</p>
			<p>
				If the curves exchange order, split the interval where they cross or integrate the absolute
				difference. A geometric area is nonnegative even when a signed integral is not.
			</p>

			<h3>Physical totals: work and average value</h3>
			<p>
				A constant force <Katex math="F" /> acting through distance <Katex math="L" /> does work
				<Katex math="FL" />. When force varies with position, accumulate it:
				<Katex math={r`W=\int_a^b F(x)\,dx`} />. The units confirm the model: newtons times metres
				give joules.
			</p>
			<p>
				For a spring obeying Hooke’s law <Katex math="F(x)=kx" />, the work required to stretch it
				from its natural length to extension <Katex math="L" /> is
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`W=\int_0^L kx\,dx=\frac12kL^2`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				An integral can also compress a changing quantity into one representative value. The
				<strong>average value</strong> of <Katex math="f" /> on <Katex math="[a,b]" /> is the constant
				height that has the same signed area as the graph:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f_{\mathrm{avg}}=\frac{1}{b-a}\int_a^b f(x)\,dx`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				For <Katex math="f(x)=x^2" /> on <Katex math="[0,3]" />, the average is
				<Katex math={r`\frac13\int_0^3x^2\,dx=3`} />. The graph is below 3 for part of the interval
				and above it for part, but the two constant-height rectangles have equal area.
			</p>
		</div>

		<Callout type="warning" title="Choose the Model Before the Technique">
			<p>
				Substitution and integration by parts help evaluate an integral; they do not decide which
				integral represents a physical quantity. First identify the local contribution, bounds,
				sign, and units. Only then choose an antiderivative technique.
			</p>
		</Callout>

		<ChapterSummary>
			<ul>
				<li>A slice model begins with a contribution per unit input and a units check.</li>
				<li>Substitution reverses the chain rule.</li>
				<li>Integration by parts reverses the product rule.</li>
				<li>
					Volumes accumulate cross-sectional area; areas between curves accumulate top minus bottom.
				</li>
				<li>
					Work accumulates force over distance, while average value spreads an integral evenly
					across its interval.
				</li>
			</ul>
			<p>
				For the opening solid, the cross-section <Katex math="A(x)" /> told us exactly what to integrate,
				and the resulting units identified the answer as volume. Integration problems become manageable
				when modeling and antiderivative technique are treated as two separate decisions.
			</p>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (6 core, 2 explorations)</summary>

			<Exercise number={1}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int 6x(3x^2+1)^4\,dx`} />.</p>
				{#snippet solution()}
					<p>
						Let <Katex math="u=3x^2+1" />, so <Katex math={r`du=6x\,dx`} />. The result is
						<Katex math={r`u^5/5+C=(3x^2+1)^5/5+C`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_0^1 2x e^{x^2}\,dx`} />.</p>
				{#snippet solution()}
					<p>
						With <Katex math="u=x^2" />, the bounds remain 0 and 1. Thus
						<Katex math={r`\int_0^1e^u\,du=e-1`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					<strong>Core.</strong> Use integration by parts to find <Katex
						math={r`\int x\cos x\,dx`}
					/>.
				</p>
				{#snippet solution()}
					<p>
						Choose <Katex math="u=x" /> and <Katex math={r`dv=\cos x\,dx`} />. Then
						<Katex math={r`du=dx`} />, <Katex math={r`v=\sin x`} />, and the answer is
						<Katex math={r`x\sin x+\cos x+C`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> Find the area between <Katex math="y=2x" /> and
					<Katex math="y=x^2" /> from <Katex math="x=0" /> to <Katex math="x=2" />.
				</p>
				{#snippet solution()}
					<p>
						The line is above the parabola, so the area is
						<Katex math={r`\int_0^2(2x-x^2)\,dx=[x^2-x^3/3]_0^2=4/3`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> Rotating <Katex math="y=x" /> on <Katex math="[0,2]" /> around the horizontal
					axis produces a cone. Find its volume using disks.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`V=\int_0^2\pi x^2\,dx=8\pi/3`} /> cubic units.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> A spring has <Katex math={r`k=40\text{ N/m}`} />. Find the work
					required to stretch it <Katex math="0.25" /> metre.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`W=\frac12kL^2=\frac12(40)(0.25)^2=1.25\text{ J}`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> Find the average value of <Katex math={r`\sin x`} /> on
					<Katex math="[0,\pi]" /> and explain its geometric meaning.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`f_{\mathrm{avg}}=\frac1\pi\int_0^\pi\sin x\,dx=2/\pi`} />. A rectangle of
						width <Katex math="\pi" /> and height <Katex math="2/\pi" /> has the same area as the sine
						arch.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> A solid extends from <Katex math="x=0" /> to
					<Katex math="x=1" />. Its cross-section perpendicular to the horizontal axis is a square
					with side <Katex math="1+x" />. Set up and evaluate its volume.
				</p>
				{#snippet solution()}
					<p>
						The cross-sectional area is <Katex math={r`A(x)=(1+x)^2`} />, so
						<Katex math={r`V=\int_0^1(1+x)^2\,dx=[x+x^2+x^3/3]_0^1=7/3`} /> cubic units.
					</p>
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				Integration has now turned changing local contributions into geometric and physical totals.
				Chapter 7 asks what happens when the local rate is not merely known, but is itself specified
				in terms of the unknown quantity. That question leads to differential equations.
			</p>
		</LookingAhead>
	</div>
</section>
