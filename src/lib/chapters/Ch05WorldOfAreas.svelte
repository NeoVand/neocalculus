<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import InfinitesimalStrip from '$lib/components/demos/InfinitesimalStrip.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch5">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 5</span>
			<h2 class="chapter-title">Accumulation and the Fundamental Theorem</h2>
			<div class="chapter-epigraph">
				<blockquote>“If a rate tells us what is happening now, how do we recover the whole journey?”</blockquote>
				<p class="epigraph-attr">The question behind integration</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A speedometer and an odometer tell different stories. The speedometer reports a rate at
				one instant. The odometer records how much distance has accumulated over time. If we know
				the speed at every instant, can we reconstruct the distance travelled?
			</p>
			<p>
				For a first example, suppose a vehicle’s velocity after <Katex math="t" /> seconds is
				<Katex math={r`v(t)=2t\text{ m/s}`} />. Between <Katex math="t=1" /> and
				<Katex math="t=4" />, the velocity is changing continuously. Multiplying one velocity by
				the whole three-second interval would miss that change. We need a way to combine all the
				local contributions.
			</p>

			<h3>From many local contributions to one total</h3>
			<p>
				Imagine dividing the time interval into ordinary finite pieces. On a short piece of width
				<Katex math={r`\Delta t`} />, the distance gained is approximately
				<Katex math={r`v(t)\Delta t`} />. Adding these rectangular contributions gives an
				approximation to the total distance. Finer partitions generally improve it.
			</p>
			<p>
				The <strong>definite integral</strong> names the accumulated value obtained from this
				process. We write
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\int_a^b f(t)\,dt`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Here <Katex math="a" /> and <Katex math="b" /> are the starting and ending inputs,
				<Katex math="f(t)" /> is the rate or height being accumulated, and <Katex math="dt" />
				reminds us which input is varying. The letter inside is temporary:
				<Katex math={r`\int_a^b f(t)\,dt=\int_a^b f(u)\,du`} />.
			</p>
		</div>

		<Callout type="definition" title="Definite Integral">
			<p>
				The quantity <Katex math={r`\int_a^b f(t)\,dt`} /> is the signed accumulation of
				<Katex math="f" /> from <Katex math="a" /> to <Katex math="b" />. Geometrically, it is
				the signed area between the graph and the horizontal axis: regions above the axis count
				positively and regions below it count negatively.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				In this book, integration is an additional principle compatible with differentiation. A
				finite interval is not imagined as <Katex math="1/d" /> infinitesimal pieces; division by a
				first-order displacement is not available. Ordinary finite sums motivate the integral,
				while the next section explains its exact first-order behavior.
			</p>

			<h3>Let the endpoint move</h3>
			<p>
				Fix a starting input <Katex math="a" /> and allow the right endpoint to move. The function
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`A(x)=\int_a^x f(t)\,dt`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				records how much has accumulated by the time the endpoint reaches <Katex math="x" />. To
				understand its derivative, move that endpoint first by a small ordinary width
				<Katex math="h" /> in the demo below. The green rectangle is the leading contribution.
				The red correction comes from the change in height across the strip. Shrink
				<Katex math="h" /> and watch that correction become less important than the rectangle.
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="5.1"
				caption="For an ordinary finite width h, the new area is approximately f(x₀)h, with a smaller curvature correction. The first-order equation below is exact only when the displacement is d with d² = 0."
			>
				<InfinitesimalStrip />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Now replace the finite preview width by a first-order displacement <Katex math="d" />. The
				change in the accumulation function is the integral over the new microinterval:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">The endpoint’s first-order change</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`A(x+d)-A(x)=\int_x^{x+d}f(t)\,dt`} display />
				</div>
				<div class="step-note">additivity of accumulation</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`A(x+d)-A(x)=f(x)d`} display /></div>
				<div class="step-note">exact first-order strip law</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math="A'(x)=f(x)" display /></div>
				<div class="step-note">extract the coefficient of <Katex math="d" /></div>
			</div>
		</div>

		<Callout type="theorem" title="Fundamental Theorem of Calculus: Accumulation Form">
			<p>
				If <Katex math="f" /> is continuous and
				<Katex math={r`A(x)=\int_a^x f(t)\,dt`} />, then
				<Katex math="A'(x)=f(x)" />.
			</p>
			<p>
				In words: the rate at which a total accumulates is the quantity being accumulated.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				This is the central reversal of calculus. Differentiation takes a total and reveals its
				local rate. Integration takes a rate and rebuilds a total. Under the theorem’s conditions,
				each operation undoes the other.
			</p>

			<h3>Compute a total with an antiderivative</h3>
			<p>
				A function <Katex math="F" /> is an <strong>antiderivative</strong> of
				<Katex math="f" /> on an interval when <Katex math="F'(x)=f(x)" /> throughout that
				interval. For example, <Katex math={r`F(t)=t^2`} /> is an antiderivative of
				<Katex math={r`f(t)=2t`} />.
			</p>
			<p>
				The accumulation function <Katex math="A" /> and any antiderivative <Katex math="F" />
				have the same derivative. The constancy principle from Chapter 3 therefore says that they
				differ by one constant. Since <Katex math="A(a)=0" />, that constant is determined at the
				starting point.
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Turn accumulation into endpoint subtraction</div>
			<div class="step">
				<div class="step-math"><Katex math={r`A'(x)=f(x)=F'(x)`} display /></div>
				<div class="step-note">same derivative on the interval</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math="A(x)=F(x)+C" display /></div>
				<div class="step-note">constancy principle</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math="0=A(a)=F(a)+C" display /></div>
				<div class="step-note"><Katex math="C=-F(a)" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`\int_a^b f(x)\,dx=F(b)-F(a)`} display /></div>
				<div class="step-note">evaluate at the final endpoint</div>
			</div>
		</div>

		<Callout type="theorem" title="Fundamental Theorem of Calculus: Evaluation Form">
			<p>
				If <Katex math="f" /> is continuous on <Katex math="[a,b]" /> and
				<Katex math="F'=f" /> there, then
				<Katex math={r`\int_a^b f(x)\,dx=F(b)-F(a)`} />.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h4>Return to the moving vehicle</h4>
			<p>
				For <Katex math={r`v(t)=2t\text{ m/s}`} />, choose
				<Katex math={r`F(t)=t^2\text{ m}`} />. The displacement from
				<Katex math="t=1" /> to <Katex math="t=4" /> is
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Accumulate the velocity</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\int_1^4 2t\,dt`} display /></div>
				<div class="step-note">velocity accumulated over time</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`=[t^2]_1^4`} display /></div>
				<div class="step-note"><Katex math={r`[F(t)]_a^b`} /> means <Katex math="F(b)-F(a)" /></div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`=4^2-1^2=15\text{ m}`} display /></div>
				<div class="step-note">the units are metres, not metres per second</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Signed accumulation and net change</h3>
			<p>
				An integral records <em>net</em> accumulation. If velocity is negative, position decreases;
				if a flow rate is negative, material leaves a tank. This is why area below the horizontal
				axis counts negatively.
			</p>
			<p>
				Suppose a particle has velocity <Katex math="v(t)=t-2" /> from
				<Katex math="t=0" /> to <Katex math="t=4" />. The negative contribution before
				<Katex math="t=2" /> and positive contribution after <Katex math="t=2" /> have equal
				magnitude, so the net displacement is zero. The particle still travelled a positive
				distance. Distance would require accumulating <Katex math={r`|v(t)|`} /> instead.
			</p>
		</div>

		<Callout type="key-idea" title="Net Change Theorem">
			<p>
				If <Katex math="Q'(t)=r(t)" />, then
				<Katex math={r`Q(b)-Q(a)=\int_a^b r(t)\,dt`} />. Final amount equals initial amount plus
				accumulated rate:
				<Katex math={r`Q(b)=Q(a)+\int_a^b r(t)\,dt`} />.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>The definite integral also obeys the bookkeeping rules we expect from accumulation:</p>
		</div>

		<Callout type="key-idea" title="Three Accumulation Rules">
			<ul>
				<li>
					<strong>Linearity:</strong>
					<Katex math={r`\int_a^b(\alpha f+\beta g)=\alpha\int_a^b f+\beta\int_a^b g`} />.
				</li>
				<li>
					<strong>Split an interval:</strong>
					<Katex math={r`\int_a^b f+\int_b^c f=\int_a^c f`} />.
				</li>
				<li>
					<strong>Reverse direction:</strong>
					<Katex math={r`\int_b^a f=-\int_a^b f`} />.
				</li>
			</ul>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Build a small antiderivative library</h3>
			<p>
				Every derivative rule from Chapters 2 and 3 can be read backward. The variable in the
				integral does not change the rule; it only identifies the input being accumulated.
			</p>
		</div>

		<div class="formula-table" use:reveal>
			<div class="formula-row formula-header">
				<div>Integrand</div>
				<div>One antiderivative</div>
			</div>
			<div class="formula-row">
				<div><Katex math="x^n" />, <Katex math={r`n\neq-1`} /></div>
				<div><Katex math={r`\dfrac{x^{n+1}}{n+1}`} /></div>
			</div>
			<div class="formula-row">
				<div><Katex math={r`1/x`} /></div>
				<div><Katex math={r`\ln|x|`} /></div>
			</div>
			<div class="formula-row">
				<div><Katex math="e^x" /></div>
				<div><Katex math="e^x" /></div>
			</div>
			<div class="formula-row">
				<div><Katex math={r`\cos x`} /></div>
				<div><Katex math={r`\sin x`} /></div>
			</div>
			<div class="formula-row">
				<div><Katex math={r`\sin x`} /></div>
				<div><Katex math={r`-\cos x`} /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The notation <Katex math={r`\int f(x)\,dx=F(x)+C`} /> describes the whole family of
				antiderivatives. The <Katex math="+C" /> belongs to an <em>indefinite</em> integral because
				all constant shifts have the same derivative. A definite integral is a number, so its
				endpoint subtraction already cancels the constant.
			</p>
			<h4>Example: accumulate a polynomial</h4>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Evaluate <Katex math={r`\int_0^2(3x^2-4x+1)\,dx`} /></div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\int(3x^2-4x+1)\,dx=x^3-2x^2+x+C`} display />
				</div>
				<div class="step-note">reverse the power rule term by term</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`[x^3-2x^2+x]_0^2=(8-8+2)-0=2`} display />
				</div>
				<div class="step-note">subtract the endpoint values</div>
			</div>
		</div>

		<Callout type="warning" title="An Integral Is More Than an Area Picture">
			<p>
				Area is the best first picture, but the same notation accumulates velocity, flow, density,
				probability, force, and many other quantities. Always read the units: rate units multiplied
				by input units produce the units of the total.
			</p>
		</Callout>

		<ChapterSummary>
			<ul>
				<li>A definite integral is a signed accumulated quantity over an ordinary interval.</li>
				<li>The moving-endpoint function <Katex math={r`A(x)=\int_a^x f`} /> satisfies <Katex math="A'=f" />.</li>
				<li>If <Katex math="F'=f" />, then <Katex math={r`\int_a^b f=F(b)-F(a)`} />.</li>
				<li>Integrating a rate gives net change; total distance may require integrating its absolute value.</li>
				<li>First-order strips explain the derivative of an accumulation function but do not construct a finite interval from infinitesimal pieces.</li>
			</ul>
			<p>
				For the opening journey, accumulating <Katex math={r`v(t)=2t`} /> from 1 to 4 seconds gave
				<Katex math={r`\int_1^4 2t\,dt=15`} /> metres. The speedometer’s changing readings determine
				the odometer’s net change.
			</p>
		</ChapterSummary>

		<details class="exercises-group" use:reveal>
			<summary class="exercises-group-title">Exercises (6 core, 2 explorations)</summary>

			<Exercise number={1}>
				<p>
					<strong>Core.</strong> In one sentence, distinguish <Katex math="f(x)" /> from
					<Katex math={r`\int_a^x f(t)\,dt`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math="f(x)" /> is the local rate or height at one input, while
						<Katex math={r`\int_a^x f(t)\,dt`} /> is the signed amount accumulated from
						<Katex math="a" /> to <Katex math="x" />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					<strong>Core.</strong> If <Katex math={r`A(x)=\int_2^x (t^3+1)\,dt`} />, find
					<Katex math="A'(x)" /> and <Katex math="A(2)" />.
				</p>
				{#snippet solution()}
					<p>The Fundamental Theorem gives <Katex math="A'(x)=x^3+1" />, and <Katex math="A(2)=0" />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p><strong>Core.</strong> Evaluate <Katex math={r`\int_0^3(2x+1)\,dx`} />.</p>
				{#snippet solution()}
					<p>
						An antiderivative is <Katex math="x^2+x" />, so the value is
						<Katex math={r`[x^2+x]_0^3=12`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					<strong>Core.</strong> A tank contains 50 litres and fills at
					<Katex math={r`r(t)=3+t`} /> litres per minute. How much water is present after 4 minutes?
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`Q(4)=50+\int_0^4(3+t)\,dt=50+[3t+t^2/2]_0^4=70`} /> litres.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					<strong>Core.</strong> A particle has velocity <Katex math="v(t)=t-1" /> on
					<Katex math="[0,2]" />. Find its net displacement and explain why its distance travelled is
					larger.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`\int_0^2(t-1)\,dt=[t^2/2-t]_0^2=0`} />. The particle moves backward
						before <Katex math="t=1" /> and forward afterward, so the signed changes cancel. Distance
						counts both pieces positively and equals 1.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					<strong>Core.</strong> Find the family of antiderivatives of
					<Katex math={r`4x^3-\sin x`} /> and check your answer by differentiation.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`x^4+\cos x+C`} />. Its derivative is
						<Katex math={r`4x^3-\sin x`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={7}>
				<p>
					<strong>Explore.</strong> Without finding an antiderivative, use integral properties to
					simplify <Katex math={r`\int_0^3 f(x)\,dx+\int_3^5 f(x)\,dx-\int_0^5 f(x)\,dx`} />.
				</p>
				{#snippet solution()}
					<p>The first two integrals combine to <Katex math={r`\int_0^5 f(x)\,dx`} />, so the expression is 0.</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					<strong>Explore.</strong> Let <Katex math={r`G(x)=\int_{x}^{1} e^{t^2}\,dt`} />.
					Find <Katex math="G'(x)" /> even though the integrand has no elementary antiderivative.
				</p>
				{#snippet solution()}
					<p>
						Reverse the bounds: <Katex math={r`G(x)=-\int_1^x e^{t^2}\,dt`} />. The Fundamental
						Theorem gives <Katex math={r`G'(x)=-e^{x^2}`} />.
					</p>
				{/snippet}
			</Exercise>
		</details>

		<LookingAhead>
			<p>
				The Fundamental Theorem tells us what an integral means and how an antiderivative computes
				it. Chapter 6 asks two practical questions: how can we find less obvious antiderivatives,
				and how can accumulated slices measure area, volume, work, and average value?
			</p>
		</LookingAhead>
	</div>
</section>
