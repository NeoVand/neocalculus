<script lang="ts">
	import Katex from '$lib/components/Katex.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import Figure from '$lib/components/Figure.svelte';
	import Exercise from '$lib/components/Exercise.svelte';
	import DigDeeper from '$lib/components/DigDeeper.svelte';
	import ChapterSummary from '$lib/components/ChapterSummary.svelte';
	import LookingAhead from '$lib/components/LookingAhead.svelte';
	import DifferentialEquationExplorer from '$lib/components/demos/DifferentialEquationExplorer.svelte';
	import PendulumPhaseLab from '$lib/components/demos/PendulumPhaseLab.svelte';
	import DrivenResonanceLab from '$lib/components/demos/DrivenResonanceLab.svelte';
	import CoupledOscillatorsLab from '$lib/components/demos/CoupledOscillatorsLab.svelte';
	import { reveal } from '$lib/utils/scroll';

	const r = String.raw;
</script>

<section class="chapter" id="ch7">
	<div class="content-width">
		<div use:reveal>
			<span class="chapter-number">Chapter 7</span>
			<h2 class="chapter-title">Differential Equations and Physics Modeling</h2>
			<div class="chapter-epigraph">
				<blockquote>
					“If you know how a system is changing now, what can you say about its future?”
				</blockquote>
				<p class="epigraph-attr">The guiding question of a differential equation</p>
			</div>
			<hr class="chapter-divider" />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				A cup of coffee cools quickly when it is much warmer than the room and slowly when the two
				temperatures are close. A population may grow faster when more individuals are already
				present. A falling object gains downward velocity as time passes. In each case, a rule about
				<strong>change at one moment</strong> can determine an entire history.
			</p>
			<p>
				That is the purpose of a differential equation. It does not begin by giving the unknown
				function. It gives a relation involving the function and one or more of its derivatives. Our
				job is to find the functions that obey that relation.
			</p>
		</div>

		<Callout type="definition" title="Differential Equation">
			<p>
				A <strong>differential equation</strong> is an equation in which an unknown function appears
				together with its derivatives. For example, <Katex math={r`y'=3y`} /> says that the rate of change
				of <Katex math="y" /> is three times its current value.
			</p>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>A law is not yet a history</h3>
			<p>
				The equation <Katex math={r`y'=3y`} /> has many solutions. Both
				<Katex math={r`y=e^{3t}`} /> and <Katex math={r`y=7e^{3t}`} /> obey it, as does the zero function.
				The differential equation describes a <em>family</em> of possible histories.
			</p>
			<p>
				To choose one member of the family, we usually give an <strong>initial condition</strong>,
				such as <Katex math={r`y(0)=7`} />. The initial condition tells us where the history begins;
				the differential equation tells us how it must continue.
			</p>
			<p>
				In the first-order infinitesimal language of this book, a law
				<Katex math={r`y'=F(t,y)`} /> can be read as
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`y(t+d)=y(t)+F(t,y(t))\,d,\qquad d^2=0`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				This is an exact first-order statement for an SDG displacement <Katex math="d" />. The
				coefficient of <Katex math="d" /> is the local rate. We are not treating
				<Katex math="d" /> as an ordinary nonzero number, and we will not divide by it.
			</p>
			<p>
				A local rule and an initial condition often determine a unique solution, but this depends on
				conditions on the rule <Katex math="F" />. We will work with well-behaved examples where
				existence and uniqueness hold.
			</p>

			<h3>A rate proportional to the amount</h3>
			<p>
				Our first model is <Katex math={r`y'=ky`} />, where <Katex math="k" /> is a constant. The units
				of <Katex math="k" /> must be inverse time: multiplying <Katex math="k" /> by an amount must produce
				an amount per unit time.
			</p>
			<ul>
				<li>If <Katex math="k>0" />, positive values grow.</li>
				<li>If <Katex math="k<0" />, positive values decay toward zero.</li>
				<li>If <Katex math="k=0" />, the value remains constant.</li>
			</ul>
			<p>
				Use the two sliders below. First change <Katex math="k" /> and watch the small direction marks.
				Then change <Katex math={r`y_0`} />. What changes in the field itself, and what only changes
				the selected curve?
			</p>
		</div>

		<div use:reveal>
			<Figure
				number="7.1"
				caption="The short marks show the slope prescribed by y′ = ky at each plotted point. The colored curve is the one solution that passes through the chosen starting value y(0) = y₀."
			>
				<DifferentialEquationExplorer />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				<strong>Takeaway.</strong> Changing <Katex math="k" /> changes the law, so it changes the whole
				slope field. Changing <Katex math={r`y_0`} /> leaves the law alone and selects a different solution
				from the same family.
			</p>

			<h3>Solve without treating derivatives as fractions</h3>
			<p>
				You may have seen the symbols in <Katex math={r`y'=ky`} /> rearranged as though
				<Katex math={r`dy/dt`} /> were an ordinary fraction. That mnemonic can produce the right answer,
				but we do not need it. The chain rule gives a precise route.
			</p>
			<p>
				On an interval where <Katex math="y" /> is not zero,
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Solve <Katex math={r`y'=ky`} /></div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`\frac{d}{dt}\ln|y(t)|=\frac{y'(t)}{y(t)}=k`} display />
				</div>
				<div class="step-note">chain rule, then use the equation</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`\ln|y(t)|=kt+C_1`} display /></div>
				<div class="step-note">take an antiderivative with respect to time</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`y(t)=Ce^{kt}`} display /></div>
				<div class="step-note">include either sign in the constant <Katex math="C" /></div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The zero solution, omitted while we divided by the ordinary value <Katex math="y(t)" />, is
				included again by allowing <Katex math="C=0" />. If <Katex math={r`y(0)=y_0`} />, then
				<Katex math={r`C=y_0`} />, so
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`y'=ky,\quad y(0)=y_0\qquad\Longrightarrow\qquad y(t)=y_0e^{kt}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				Always check a proposed solution. Differentiating <Katex math={r`y_0e^{kt}`} /> gives
				<Katex math={r`ky_0e^{kt}=ky(t)`} />, and setting <Katex math="t=0" /> returns
				<Katex math={r`y_0`} />. The law and the initial condition both pass the test.
			</p>

			<h4>Example 1: proportional growth</h4>
			<p>
				A culture begins with 500 cells and grows at a continuous relative rate of
				<Katex math={r`0.2\ \text{hour}^{-1}`} />. If <Katex math="P(t)" /> is the population after
				<Katex math="t" /> hours, the model is <Katex math={r`P'=0.2P`} /> with
				<Katex math={r`P(0)=500`} />. Therefore
				<Katex math={r`P(t)=500e^{0.2t}`} />. After four hours the model predicts
				<Katex math={r`P(4)=500e^{0.8}\approx1113`} /> cells.
			</p>
			<p>
				This is a model, not a promise that growth continues forever. Limited space and nutrients
				eventually make proportional growth unrealistic.
			</p>

			<h3>Cooling toward an equilibrium</h3>
			<p>
				Newton’s law of cooling says that the rate at which an object’s temperature changes is
				proportional to the difference between its temperature and the surrounding temperature. If
				the room stays at <Katex math={r`T_a`} />, the model is
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`T'=-k(T-T_a),\qquad k>0`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The sign is worth reading before solving. If <Katex math={r`T>T_a`} />, then
				<Katex math={r`T'<0`} /> and the object cools. If <Katex math={r`T<T_a`} />, then
				<Katex math={r`T'>0`} /> and the object warms. In both cases the law pushes the temperature toward
				the surroundings.
			</p>
			<p>
				Let <Katex math={r`u=T-T_a`} /> be the temperature difference. Since
				<Katex math={r`T_a`} /> is constant, <Katex math={r`u'=T'=-ku`} />. The previous model now
				applies directly:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`T(t)=T_a+(T_0-T_a)e^{-kt}`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example 2: a cup of coffee</h4>
			<p>
				Coffee at <Katex math={r`90^\circ\mathrm C`} /> is placed in a
				<Katex math={r`20^\circ\mathrm C`} /> room. Suppose
				<Katex math={r`k=0.1\ \text{min}^{-1}`} />. Then
				<Katex math={r`T(t)=20+70e^{-0.1t}`} />. After ten minutes,
				<Katex math={r`T(10)=20+70e^{-1}\approx45.8^\circ\mathrm C`} />.
			</p>
			<p>
				The formula also passes two immediate checks: <Katex math={r`T(0)=90`} />, and as time
				increases the exponential term approaches zero, so the predicted temperature approaches
				<Katex math={r`20^\circ\mathrm C`} />.
			</p>

			<h3>Acceleration builds velocity, then position</h3>
			<p>
				For one-dimensional motion, position is <Katex math="x(t)" />, velocity is
				<Katex math={r`v(t)=x'(t)`} />, and acceleration is
				<Katex math={r`a(t)=v'(t)=x''(t)`} />. These derivatives are local rates, not literal
				quotients of infinitesimals.
			</p>
			<p>At first order, the two linked local laws are</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math={r`x(t+d)=x(t)+v(t)d,\qquad v(t+d)=v(t)+a(t)d`} display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				If acceleration is a constant <Katex math="a" />, take antiderivatives and use the initial
				values <Katex math={r`v(0)=v_0`} /> and <Katex math={r`x(0)=x_0`} />:
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Motion with constant acceleration</div>
			<div class="step">
				<div class="step-math">
					<Katex math={r`v'=a\quad\Longrightarrow\quad v(t)=v_0+at`} display />
				</div>
				<div class="step-note">accumulate acceleration</div>
			</div>
			<div class="step step-result">
				<div class="step-math">
					<Katex math={r`x'=v_0+at\quad\Longrightarrow\quad x(t)=x_0+v_0t+\tfrac12at^2`} display />
				</div>
				<div class="step-note">accumulate velocity</div>
			</div>
		</div>

		<div class="neo-prose" use:reveal>
			<h4>Example 3: a vertical toss</h4>
			<p>
				Use metres and seconds, take upward as positive, and approximate gravitational acceleration
				by <Katex math={r`a=-10\ \mathrm{m/s^2}`} />. A ball launched from ground level at
				<Katex math={r`20\ \mathrm{m/s}`} /> has
			</p>
		</div>

		<div class="derivation" use:reveal>
			<div class="derivation-title">Find the highest point and return time</div>
			<div class="step">
				<div class="step-math"><Katex math={r`v(t)=20-10t`} display /></div>
				<div class="step-note">velocity reaches zero at <Katex math={r`t=2`} /></div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x(t)=20t-5t^2`} display /></div>
				<div class="step-note">position from constant acceleration</div>
			</div>
			<div class="step">
				<div class="step-math"><Katex math={r`x(2)=40-20=20`} display /></div>
				<div class="step-note">maximum height: 20 metres</div>
			</div>
			<div class="step step-result">
				<div class="step-math"><Katex math={r`x(t)=5t(4-t)=0`} display /></div>
				<div class="step-note">
					after launch, the ball returns at <Katex math={r`t=4`} /> seconds
				</div>
			</div>
		</div>

		<Callout type="key-idea" title="A Reliable Modeling Routine">
			<ol>
				<li>Name the changing quantity and its input; include units.</li>
				<li>Translate the verbal rule into a differential equation.</li>
				<li>Record the initial condition separately.</li>
				<li>Solve, then verify both the equation and the initial condition.</li>
				<li>Ask whether the sign, units, and long-term behavior make sense.</li>
			</ol>
		</Callout>

		<div class="neo-prose" use:reveal>
			<h3>A second-order law is a flow through states</h3>
			<p>
				A pendulum needs two numbers to determine what happens next: its angle and its angular
				velocity. Knowing the angle alone does not tell us whether the bob is moving left, moving
				right, or momentarily at rest. Introduce <Katex math="\omega=\theta'" /> and the single second-order
				law becomes two linked first-order laws:
			</p>
		</div>

		<div class="key-equation" use:reveal>
			<Katex math="\theta'=\omega,\qquad \omega'=-\sin\theta-b\omega" display />
		</div>

		<div class="neo-prose" use:reveal>
			<p>
				The pair <Katex math="(\theta,\omega)" /> is the pendulum’s <strong>state</strong>. Every
				possible state is one point in a phase plane. The differential equation places a tiny
				direction at every point, and the moving pendulum traces one path through those directions.
				With no damping, energy contours organize the motion. With damping, the path crosses them
				inward as energy is lost.
			</p>
		</div>

		<div id="pendulum-phase-lab" use:reveal>
			<Figure
				number="7.2"
				caption="The physical pendulum and its phase portrait describe the same motion. Drag and throw the bob: its partner point records angle θ horizontally and angular velocity ω vertically. Closed paths are oscillations, paths crossing θ = ±π are full rotations, and damping draws states toward rest."
			>
				<PendulumPhaseLab />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Resonance: when repeated nudges cooperate</h3>
			<p>
				A swing barely moves if you push at arbitrary moments. Push once during every return,
				however, and small transfers of energy accumulate. The same timing governs vibrating
				bridges, musical instruments, radio circuits, and atoms absorbing light.
			</p>
			<p>
				For a damped spring driven by a periodic force, a convenient dimensionless model is
				<Katex math={r`x''+2\zeta x'+x=F\cos(\Omega t)`} />. The natural angular frequency has been
				scaled to <Katex math={r`\omega_0=1`} />. The parameter <Katex math={r`\Omega`} /> is the rhythm
				of the external push, while <Katex math={r`\zeta`} /> measures energy lost to damping.
			</p>
			<p>
				After the initial transients fade, the response is another sinusoid. Its amplitude and delay
				are not arbitrary: both are determined by the drive frequency. Sweep through
				<Katex math={r`\Omega=1`} /> slowly and watch all three views agree.
			</p>
		</div>

		<div id="resonance-lab" use:reveal>
			<Figure
				number="7.3"
				caption="A driven oscillator seen physically, through time, and across frequency. Near the natural frequency, each push reinforces the motion; damping lowers and broadens the resonance peak."
			>
				<DrivenResonanceLab />
			</Figure>
		</div>

		<div class="neo-prose" use:reveal>
			<h3>Normal modes: find the simple motions hiding inside</h3>
			<p>
				Connect two oscillators and neither mass follows a single sinusoid in general. Yet two
				special patterns remain perfectly simple: the masses can move together, or they can move
				oppositely. These are the system’s <strong>normal modes</strong>.
			</p>
			<p>
				For equal masses and equal outer springs, the coordinates
				<Katex math={r`q_+=(x_1+x_2)/\sqrt2`} /> and <Katex math={r`q_-=(x_1-x_2)/\sqrt2`} />
				separate the shared motion from the opposing motion. Each new coordinate obeys its own ordinary
				oscillator equation. A complicated-looking exchange of energy is only those two rhythms superposed.
			</p>
		</div>

		<div id="coupled-oscillators-lab" use:reveal>
			<Figure
				number="7.4"
				caption="Two coupled masses decompose into a symmetric mode q₊ and an antisymmetric mode q₋. Starting only one mass excites both modes; their changing relative phase makes energy appear to migrate back and forth."
			>
				<CoupledOscillatorsLab />
			</Figure>
		</div>

		<DigDeeper title="Oscillation from a restoring force">
			<p>
				A mass on an ideal spring can satisfy <Katex math={r`x''=-\omega^2x`} />. The negative sign
				means acceleration points back toward equilibrium. Differentiate twice to verify that
				<Katex math={r`x(t)=A\cos(\omega t)+B\sin(\omega t)`} /> solves the equation. Two initial conditions—usually
				position and velocity at one time—determine the two constants
				<Katex math="A" /> and <Katex math="B" />.
			</p>
		</DigDeeper>

		<div class="neo-prose exercises-section" use:reveal>
			<h3>Exercises</h3>
			<p>
				For each model, keep the differential equation, initial condition, and resulting solution
				visibly separate.
			</p>

			<Exercise number={1}>
				<p>
					For <Katex math={r`y'=4-y`} /> with <Katex math={r`y(0)=1`} />, identify the local law and
					the initial condition. Without solving, determine whether <Katex math="y" /> initially increases
					or decreases.
				</p>
				{#snippet solution()}
					<p>
						The local law is <Katex math={r`y'=4-y`} /> and the initial condition is
						<Katex math={r`y(0)=1`} />. Initially <Katex math={r`y'(0)=4-1=3>0`} />, so
						<Katex math="y" /> increases.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={2}>
				<p>
					Verify that <Katex math={r`y(t)=3e^{-2t}`} /> solves <Katex math={r`y'=-2y`} /> and satisfies
					<Katex math={r`y(0)=3`} />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`y'=-6e^{-2t}=-2(3e^{-2t})=-2y`} />, and
						<Katex math={r`y(0)=3e^0=3`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={3}>
				<p>Solve <Katex math={r`y'=0.4y`} /> with <Katex math={r`y(0)=10`} />.</p>
				{#snippet solution()}
					<p><Katex math={r`y(t)=10e^{0.4t}`} />.</p>
				{/snippet}
			</Exercise>

			<Exercise number={4}>
				<p>
					Soup begins at <Katex math={r`80^\circ\mathrm C`} /> in a
					<Katex math={r`20^\circ\mathrm C`} /> room and follows Newton’s law with
					<Katex math={r`k=0.05\ \text{min}^{-1}`} />. Write <Katex math="T(t)" /> and find the temperature
					after 20 minutes.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`T(t)=20+60e^{-0.05t}`} />, so
						<Katex math={r`T(20)=20+60e^{-1}\approx42.1^\circ\mathrm C`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={5}>
				<p>
					A car has constant acceleration <Katex math={r`3\ \mathrm{m/s^2}`} />, initial velocity
					<Katex math={r`5\ \mathrm{m/s}`} />, and initial position <Katex
						math={r`x(0)=2\ \mathrm m`}
					/>. Find <Katex math="v(t)" /> and <Katex math="x(t)" />.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`v(t)=5+3t`} /> and <Katex math={r`x(t)=2+5t+\tfrac32t^2`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={6}>
				<p>
					With upward positive and <Katex math={r`a=-10\ \mathrm{m/s^2}`} />, a ball is thrown
					upward from a 15-metre platform at <Katex math={r`10\ \mathrm{m/s}`} />. Find its height
					and velocity after one second.
				</p>
				{#snippet solution()}
					<p>
						<Katex math={r`x(t)=15+10t-5t^2`} /> and <Katex math={r`v(t)=10-10t`} />. Thus
						<Katex math={r`x(1)=20\ \mathrm m`} /> and <Katex math={r`v(1)=0`} />.
					</p>
				{/snippet}
			</Exercise>

			<h4>Explore</h4>

			<Exercise number={7}>
				<p>
					A decaying substance follows <Katex math={r`N'=-\lambda N`} />. If its half-life is
					<Katex math="H" />, show that <Katex math={r`\lambda=\ln 2/H`} />.
				</p>
				{#snippet solution()}
					<p>
						From <Katex math={r`N(t)=N_0e^{-\lambda t}`} /> and
						<Katex math={r`N(H)=N_0/2`} />, we get <Katex math={r`e^{-\lambda H}=1/2`} />. Taking
						logarithms gives <Katex math={r`-\lambda H=-\ln 2`} />, hence
						<Katex math={r`\lambda=\ln 2/H`} />.
					</p>
				{/snippet}
			</Exercise>

			<Exercise number={8}>
				<p>
					Verify directly that <Katex math={r`x(t)=A\cos(\omega t)+B\sin(\omega t)`} /> solves
					<Katex math={r`x''=-\omega^2x`} />.
				</p>
				{#snippet solution()}
					<p>
						Differentiating twice gives
						<Katex math={r`x''=-A\omega^2\cos(\omega t)-B\omega^2\sin(\omega t)=-\omega^2x`} />.
					</p>
				{/snippet}
			</Exercise>
		</div>

		<ChapterSummary>
			<ul>
				<li>A differential equation gives a local rule; an initial condition selects a history.</li>
				<li>
					<Katex math={r`y'=ky`} /> with <Katex math={r`y(0)=y_0`} /> has solution <Katex
						math={r`y=y_0e^{kt}`}
					/>.
				</li>
				<li>
					Separable-looking equations can be solved with the chain rule and substitution; no
					division by <Katex math="dt" /> is required.
				</li>
				<li>
					Newton cooling applies proportional decay to the difference from ambient temperature.
				</li>
				<li>Acceleration accumulates into velocity, and velocity accumulates into position.</li>
				<li>
					A model should be checked against its equation, initial data, units, signs, and physical
					scope.
				</li>
			</ul>
		</ChapterSummary>

		<LookingAhead>
			<p>
				Many differential equations do not have solutions expressible with familiar elementary
				functions. Chapter 8 develops polynomial approximations that let us estimate such functions
				from their derivatives near a chosen point.
			</p>
		</LookingAhead>
	</div>
</section>
