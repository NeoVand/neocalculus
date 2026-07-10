<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import TaylorApproximationExplorer from '$lib/components/demos/TaylorApproximationExplorer.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch8">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 8</span>
			<h2 class="chapter-title">Series and Approximation</h2>
			<div class="chapter-epigraph">
				<blockquote>“How much of a function can its derivatives at one point reveal?”</blockquote>
				<p class="epigraph-attr">The question behind Taylor approximation</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Suppose you want to estimate <Katex math={r`e^{0.2}`} /> using only addition and
				multiplication. The tangent line at zero gives <Katex math={r`e^x\approx1+x`} />, so the
				first estimate is <Katex math={r`1.2`} />. The true value is about
				<Katex math={r`1.2214`} />. The line captured the initial direction but missed the bending.
			</p>
			<p>
				The second derivative records that bending. Higher derivatives record further layers of local
				behavior. Taylor’s idea is to build a polynomial that matches as many of those layers as we
				choose, then ask how well that local polynomial performs at an ordinary real input.
			</p>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>A polynomial built from derivatives</h3>
			<p>
				Choose a center <Katex math="a" />. The degree-<Katex math="n" /> Taylor polynomial of a
				function <Katex math="f" /> at that center is
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`T_n(x)=f(a)+f'(a)(x-a)+\frac{f''(a)}{2!}(x-a)^2+\cdots+\frac{f^{(n)}(a)}{n!}(x-a)^n`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The factorials are exactly what make the derivatives match. At <Katex math="x=a" />, every
				term containing <Katex math="x-a" /> vanishes, so <Katex math={r`T_n(a)=f(a)`} />.
				Differentiate once and evaluate at <Katex math="a" /> to get
				<Katex math={r`T_n'(a)=f'(a)`} />. Repeating gives
			</p>
		</div>

		<Callout type="key-idea" title="What the Taylor Polynomial Matches">
			<Katex math={r`T_n^{(k)}(a)=f^{(k)}(a)\qquad\text{for }k=0,1,\ldots,n`} display />
			<p>
				It matches the function’s value, slope, curvature, and all derivative data through order
				<Katex math="n" /> at one center.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>Exact on a higher-order infinitesimal neighborhood</h3>
			<p>
				Chapter 1 used first-order displacements <Katex math="d" /> satisfying
				<Katex math={r`d^2=0`} />. To retain more local information, define
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`D_n=\{d:d^{n+1}=0\}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The higher-order Kock–Lawvere principle says that, in the SDG setting used here, a smooth map
				on <Katex math={r`D_n`} /> has a unique polynomial expression of degree at most
				<Katex math="n" />. Its coefficients are the derivative coefficients:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex
				math={r`f(a+d)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}d^k\qquad(d\in D_n)`}
				display
			/>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This equality is exact for <Katex math={r`d\in D_n`} />. It is a higher-order axiom of the
				framework, not a consequence of the algebraic equation <Katex math={r`d^{n+1}=0`} /> alone.
				That distinction matters: nilpotence makes the polynomial terminate, while the smoothness axiom
				identifies its coefficients.
			</p>
			<p>
				For an ordinary real displacement <Katex math="h" />, the same polynomial is generally only an
				approximation:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`f(a+h)=T_n(a+h)+R_n(a+h)`} display />
		</div>

		<Callout type="warning" title="Keep the Two Inputs Separate">
			<p>
				For <Katex math={r`d\in D_n`} />, the higher-order infinitesimal expansion is exact. For an
				ordinary real <Katex math="h" />, a remainder is present. We may prove that the remainder is
				small, but we may not silently replace <Katex math="d" /> by <Katex math="h" /> and keep the
				word “exact.”
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				Use the explorer below with <Katex math={r`f(x)=e^x`} /> centered at zero. First hold the
				evaluation point near zero and increase the degree. Then keep the degree fixed and move the
				point farther away. Where do the two curves agree first, and what makes the visible error grow?
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="8.1"
				caption="The dark curve is eˣ. The dashed curve is its Taylor polynomial centered at 0. Both share the same derivative data at the center; the marked vertical gap is their error at the selected ordinary input."
			>
				<TaylorApproximationExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> Adding derivative information improves the match outward from the
				center. It does not turn a finite polynomial into the function everywhere. Accuracy depends on
				both the degree and the distance from the center.
			</p>

			<h3>Measure the error before taking infinitely many terms</h3>
			<p>
				For ordinary real inputs, Taylor’s theorem supplies the missing remainder. The following form
				is useful because it produces a numerical guarantee.
			</p>
		</div>

		<Callout type="theorem" title="Taylor Remainder Bound">
			<p>
				Let an interval <Katex math="I" /> contain both <Katex math="a" /> and
				<Katex math="x" />. Suppose <Katex math="f" /> has <Katex math={r`n+1`} /> continuous
				derivatives on <Katex math="I" /> and
				<Katex math={r`|f^{(n+1)}(t)|\le M`} /> throughout that interval. Then
			</p>
			<Katex
				math={r`|f(x)-T_n(x)|\le\frac{M}{(n+1)!}|x-a|^{n+1}`}
				display
			/>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h4>Example 1: estimate <Katex math={r`\sin(0.1)`} /></h4>
			<p>
				The derivatives of sine repeat in a four-step cycle. At zero their values are
				<Katex math={r`0,1,0,-1,0,1,\ldots`} />, so the degree-5 polynomial is
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Use three nonzero terms</div>
			<div class="step">
				<div class="step-math"><Katex math={r`T_5(x)=x-\frac{x^3}{3!}+\frac{x^5}{5!}`} display /></div>
				<div class="step-note">match derivatives through degree 5</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`T_5(0.1)=0.1-\frac{0.1^3}{6}+\frac{0.1^5}{120}`} display /></div>
				<div class="step-note">evaluate the polynomial</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`T_5(0.1)\approx0.0998334167`} display /></div>
				<div class="step-note">an estimate using only arithmetic</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Every derivative of sine has absolute value at most 1. Taylor’s bound therefore gives
				<Katex math={r`|\sin(0.1)-T_5(0.1)|\le0.1^6/6!\approx1.4\times10^{-9}`} />. The
				important point is not merely that the answer looks plausible; we have a proof that the error is
				below a stated threshold.
			</p>

			<h3>From finite polynomials to an infinite series</h3>
			<p>
				The Taylor polynomials form a sequence <Katex math={r`T_0,T_1,T_2,\ldots`} />. For a fixed
				real input <Katex math="x" />, we can ask whether the sequence of numbers
				<Katex math={r`T_n(x)`} /> approaches a limit. This leads to the Taylor series
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`\sum_{k=0}^{\infty}\frac{f^{(k)}(a)}{k!}(x-a)^k`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Writing the infinite symbol does not establish equality with <Katex math="f(x)" />. Equality
				holds at a particular input only when the real remainder satisfies
				<Katex math={r`R_n(x)=f(x)-T_n(x)\to0`} /> as <Katex math={r`n\to\infty`} />.
			</p>
		</div>

		<Callout type="key-idea" title="Three Questions, Not One">
			<ol>
				<li>What coefficients do the derivatives determine?</li>
				<li>Does the resulting numerical series converge at the chosen real input?</li>
				<li>If it converges, is its sum actually equal to the function there?</li>
			</ol>
			<p>The higher-order SDG expansion answers the first question. Classical remainder analysis answers the other two.</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				A function that equals its Taylor series on some open interval around the center is called
				<strong>analytic</strong> there. The exponential, sine, and cosine are analytic everywhere on
				the real line. Smoothness alone is not enough.
			</p>
		</div>

		<DigDeeper title="A smooth function whose Taylor series misses it">
			<p>Define</p>
			<Katex
				math={r`f(x)=\begin{cases}e^{-1/x^2},&x\ne0,\\0,&x=0.\end{cases}`}
				display
			/>
			<p>
				This function is smooth, and every derivative at zero equals zero. Its Taylor series at zero is
				therefore the zero series, which certainly converges. But <Katex math={r`f(x)>0`} /> whenever
				<Katex math={r`x\ne0`} />. The series converges, yet its sum does not reproduce the function
				away from the center. This is why convergence and equality must be checked separately.
			</p>
		</DigDeeper>

		<div class="neo-prose" use:reveal>
			<h3>The geometric series makes convergence visible</h3>
			<p>
				The simplest power series is <Katex math={r`1+x+x^2+\cdots`} />. Before discussing infinity,
				multiply the finite sum by <Katex math={r`1-x`} />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">A finite identity first</div>
			<div class="step">
				<div class="step-math"><Katex math={r`S_n=1+x+x^2+\cdots+x^n`} display /></div>
				<div class="step-note">the degree-<Katex math="n" /> partial sum</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`(1-x)S_n=1-x^{n+1}`} display /></div>
				<div class="step-note">all middle terms cancel</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`S_n=\frac{1-x^{n+1}}{1-x}`} display /></div>
				<div class="step-note">for <Katex math={r`x\ne1`} /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				If <Katex math={r`|x|<1`} />, then <Katex math={r`x^{n+1}\to0`} />, so the partial sums
				approach <Katex math={r`1/(1-x)`} />. If <Katex math={r`|x|>1`} />, the terms
				<Katex math={r`x^n`} /> do not even approach zero, so the series cannot converge. At
				<Katex math={r`x=1`} /> and <Katex math={r`x=-1`} />, direct inspection also shows divergence.
			</p>
		</div>

		<Callout type="theorem" title="Geometric Series">
			<Katex math={r`\sum_{k=0}^{\infty}x^k=\frac{1}{1-x}\qquad\text{exactly when }|x|<1`} display />
			<p>
				For example, at <Katex math={r`x=1/2`} /> the neglected tail after degree
				<Katex math="n" /> equals <Katex math={r`2^{-n}`} />, so the error can be made as small as
				we wish by increasing <Katex math="n" />.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<p>
				More generally, a power series centered at <Katex math="a" /> has the form
				<Katex math={r`\sum c_k(x-a)^k`} />. There is a radius <Katex math="R" /> such that it
				converges absolutely for <Katex math={r`|x-a|<R`} /> and diverges for
				<Katex math={r`|x-a|>R`} />. The two endpoints must be tested separately.
			</p>
		</div>

		<Callout type="warning" title="Finite Exactness Is Not Infinite Convergence">
			<p>
				On <Katex math={r`D_n`} />, the geometric expression
				<Katex math={r`1+d+\cdots+d^n`} /> is finite and exactly equals
				<Katex math={r`1/(1-d)`} />. No infinite sum is being taken there. Replacing
				<Katex math="d" /> by a real number creates a new convergence question.
			</p>
		</Callout>

		<DigDeeper title="Using a series inside an integral">
			<p>
				On intervals where term-by-term integration is justified, the exponential series gives
				<Katex math={r`e^{-x^2}=1-x^2+x^4/2!-x^6/3!+\cdots`} />. Hence
			</p>
			<Katex
				math={r`\int_0^1 e^{-x^2}\,dx=1-\frac13+\frac1{10}-\frac1{42}+\cdots`}
				display
			/>
			<p>
				The integral has no elementary antiderivative, but its convergent series provides controlled
				numerical approximations. The justification comes from convergence theorems, not from treating
				the infinite expression as a finite polynomial.
			</p>
		</DigDeeper>

		<div class="neo-prose exercises-section" use:reveal>
			<h3>Exercises</h3>
			<p>For approximation problems, state the center, degree, and an error estimate.</p>

			<Exercise number={1}>
				<p>Find the degree-3 Taylor polynomial for <Katex math={r`e^x`} /> centered at zero.</p>
				{#snippet solution()}
					<p><Katex math={r`T_3(x)=1+x+x^2/2+x^3/6`} /> because every derivative of <Katex math={r`e^x`} /> equals <Katex math={r`e^x`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>Find the degree-4 Taylor polynomial for <Katex math={r`\cos x`} /> centered at zero.</p>
				{#snippet solution()}
					<p><Katex math={r`T_4(x)=1-x^2/2!+x^4/4!`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>
					Use the degree-2 Taylor polynomial for <Katex math={r`\cos x`} /> to estimate
					<Katex math={r`\cos(0.2)`} />. Bound the error using <Katex math={r`M=1`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`T_2(0.2)=1-0.2^2/2=0.98`} />. Taylor’s general bound gives
						<Katex math={r`|R_2(0.2)|\le0.2^3/3!\approx0.00134`} />. A sharper bound is possible
						because the next derivative vanishes at the center, but this bound is already valid.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					For <Katex math={r`x=1/3`} />, use the finite geometric identity to find the partial sum
					<Katex math={r`S_4=1+x+\cdots+x^4`} /> and its distance from <Katex math={r`3/2`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`S_4=(1-(1/3)^5)/(1-1/3)=121/81`} />. Since
						<Katex math={r`3/2-121/81=1/162`} />, the error is about <Katex math={r`0.00617`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					Write <Katex math={r`1/(1+x^2)`} /> as a geometric series. Give its radius of convergence
					and check both real endpoints.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`1/(1+x^2)=\sum_{k=0}^{\infty}(-1)^kx^{2k}`} /> for
						<Katex math={r`|x|<1`} />, so <Katex math={r`R=1`} />. At both
						<Katex math={r`x=1`} /> and <Katex math={r`x=-1`} />, the terms alternate between
						<Katex math={r`1`} /> and <Katex math={r`-1`} /> and do not approach zero; both endpoints diverge.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					Classify each statement as an exact higher-order infinitesimal identity, a real approximation,
					or a convergent real-series identity:
				</p>
				<ol>
					<li><Katex math={r`e^d=1+d+d^2/2`} /> for <Katex math={r`d\in D_2`} />.</li>
					<li><Katex math={r`e^{0.2}\approx1+0.2+0.2^2/2`} />.</li>
					<li><Katex math={r`e^x=\sum_{k=0}^{\infty}x^k/k!`} /> for real <Katex math="x" />.</li>
				</ol>
				{#snippet solution()}
					<p>Statements 1, 2, and 3 are respectively exact infinitesimal, real approximation, and convergent real-series identity.</p>
				{/snippet}
			</Exercise>

			<h4>Explore</h4>

			<Exercise number={7}>
				<p>
					The smooth function in the “Dig Deeper” box has every derivative equal to zero at the origin.
					What is every Taylor polynomial there, and why can none reproduce the function on an interval?
				</p>
				{#snippet solution()}
					<p>
						Every coefficient is zero, so every Taylor polynomial is the zero polynomial. But the function
						is positive at every nonzero input, so it cannot equal that polynomial on any interval around zero.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					Integrate the first four terms of <Katex math={r`e^{-x^2}`} /> from 0 to 1 and use them to
					approximate <Katex math={r`\int_0^1e^{-x^2}\,dx`} />.
				</p>
				{#snippet solution()}
					<p>
						Using <Katex math={r`1-x^2+x^4/2-x^6/6`} /> gives
						<Katex math={r`1-1/3+1/10-1/42\approx0.74286`} />. More terms move the value toward
						<Katex math={r`0.74682`} />.
					</p>
				{/snippet}
			</Exercise>
		</div>

		<ChapterSummary>
			<ul>
				<li>The degree-<Katex math="n" /> Taylor polynomial matches a function’s derivatives through order <Katex math="n" /> at its center.</li>
				<li>In the higher-order SDG setting, that polynomial is exact for displacements in <Katex math={r`D_n`} />.</li>
				<li>At an ordinary real input, the polynomial generally has a remainder that must be bounded.</li>
				<li>An infinite Taylor series equals the function only where the real remainder tends to zero.</li>
				<li>Smooth functions need not be analytic; convergence of a Taylor series does not alone guarantee equality with the function.</li>
				<li>A power series converges inside its radius, diverges outside it, and requires separate endpoint tests.</li>
			</ul>
		</ChapterSummary>

		<LookingAhead>
			<p>
				Chapter 9 lets functions depend on several inputs. Derivatives become linear maps, gradients,
				and Jacobian matrices, but the same local-model question remains.
			</p>
		</LookingAhead>
	</div>
</section>
