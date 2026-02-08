# Neocalculus: The Definitive Plan

> Note: Active execution has moved to `/Users/neo/repos/neocalculus/MASTER_PLAN.md`, `/Users/neo/repos/neocalculus/CHAPTER_SPECS.md`, and `/Users/neo/repos/neocalculus/MIGRATION_MATRIX.md`. This document is retained for historical context.

## Vision

A single-page, scroll-driven web experience that teaches calculus from scratch using
Synthetic Differential Geometry (SDG) — without ever mentioning limits, epsilon-delta,
or the historical baggage of 19th-century analysis. We call it **Neocalculus**.

The target audience is a gifted teenager (or curious adult) who wants to understand
calculus and use it for physics, engineering, and computation. The app treats SDG
axioms as _the natural truth about how smooth reality works_, not as advanced
mathematics.

**Tech stack:** SvelteKit 2 + Svelte 5 + Tailwind 4 + KaTeX + Canvas/SVG
interactive demos + mdsvex for content sections.

---

## Part I: Narrative Architecture (The Story)

The page scrolls through **7 chapters**, each with:

- A conceptual introduction (narrative text + animated illustrations)
- Interactive demos the student can play with
- Worked examples with step-by-step animated algebra
- 3–5 challenge problems with instant feedback
- A "Dig Deeper" expandable section for the mathematically curious

### Chapter 1: The Smooth World

**Core idea:** Reality is smooth. If you zoom into any curve far enough, it becomes
a perfectly straight line. There is a "bottom" to the zoom — the infinitesimal scale.

**Key concepts:**

- The number line R contains special numbers called _infinitesimals_ (d) where d² = 0
- These are not zero — they're too small to measure, but they have direction and slope
- At the infinitesimal scale, every curve is a straight line segment (Microstraightness)
- This is not an approximation — it's exact

**Interactive Demo 1: "The Perfect Zoom"**

- A canvas showing a curve (parabola, sine wave, circle — user picks)
- A draggable magnifying lens that zooms into any point
- As zoom level increases, the curve flattens
- At maximum zoom (the "infinitesimal scale"), the curve becomes a perfectly
  straight magenta line segment — the tangent
- Toggle between "Classical Zoom" (curve stays curved, just smaller) and
  "Neocalculus Zoom" (curve becomes exactly straight)
- Labels appear: "This straight segment IS part of the curve at infinitesimal scale"

**Interactive Demo 2: "Meet d"**

- A number line visualization
- Drag a slider to make a quantity smaller and smaller
- As it approaches "infinitesimal", its square visually collapses to exactly 0
- An equation display: shows d = [value], d² = [value], and at infinitesimal:
  d² = 0 exactly
- "d is not zero. d² is zero. That's the only rule you need."

---

### Chapter 2: The Slope Equation (Derivatives Without Limits)

**Core idea:** For any function f, when you nudge x by an infinitesimal d:

    f(x + d) = f(x) + f'(x) · d

The derivative f'(x) is simply the coefficient of d. No limits. No approaching.
Just algebra.

**Key concepts:**

- The Fundamental Equation: f(x + d) = f(x) + f'(x)·d
- The derivative is the unique number that makes this equation true
- The "Cancel but don't divide" rule (Microcancellation): if a·d = b·d for all
  infinitesimal d, then a = b
- d² = 0 is the only computational tool you need

**Interactive Demo 3: "The Algebra Machine"**

- User picks a function from a menu OR types one in:
  x², x³, x⁴, 1/x, √x, sin(x), eˣ, x·sin(x), etc.
- The app performs the expansion f(x + d) step by step, animated:
  1. Write out the expression with (x + d) substituted
  2. Expand algebraically (FOIL, binomial, etc.)
  3. Every term containing d² or higher powers turns RED and fades out (with
     a satisfying "poof" animation and the label "d² = 0")
  4. The remaining expression is f(x) + [something]·d
  5. The [something] is highlighted in MAGENTA — "That's the derivative!"
- The d-Toggle: a switch that shows/hides the infinitesimal terms, coloring d
  in magenta throughout

**Worked Examples (all shown step-by-step with animation):**

**Example 2.1: f(x) = x²**

```
f(x + d) = (x + d)²
         = x² + 2xd + d²
         = x² + 2xd + 0       ← d² = 0
         = x² + (2x)·d
∴ f'(x) = 2x
```

**Example 2.2: f(x) = x³**

```
f(x + d) = (x + d)³
         = x³ + 3x²d + 3xd² + d³
         = x³ + 3x²d + 0 + 0   ← d² = 0 implies d³ = 0
         = x³ + (3x²)·d
∴ f'(x) = 3x²
```

**Example 2.3: f(x) = 1/x (quotient by algebra)**

```
f(x + d) = 1/(x + d)

Multiply numerator and denominator by (x - d):
= (x - d) / [(x + d)(x - d)]
= (x - d) / [x² - d²]
= (x - d) / x²              ← d² = 0
= x/x² - d/x²
= 1/x - (1/x²)·d

∴ f'(x) = -1/x²
```

**Example 2.4: f(x) = √x**

```
f(x + d) = √(x + d)

We need: √(x + d) = √x + k·d for some k.
Square both sides:
x + d = x + 2k√x·d + k²d²
x + d = x + 2k√x·d            ← d² = 0

Matching the d terms: 1 = 2k√x
∴ k = 1/(2√x)
∴ f'(x) = 1/(2√x)
```

**Example 2.5: f(x) = sin(x) — The Infinitesimal Triangle**

```
Key insight: For infinitesimal d, draw a right triangle with angle d
and hypotenuse 1.
- The opposite side (height) = sin(d) = d    (exactly, not approximately!)
- The adjacent side (base) = cos(d) = √(1 - d²) = √1 = 1

Now use the angle addition formula:
sin(x + d) = sin(x)·cos(d) + cos(x)·sin(d)
           = sin(x)·1 + cos(x)·d
           = sin(x) + cos(x)·d

∴ sin'(x) = cos(x)
```

**Example 2.6: f(x) = cos(x)**

```
cos(x + d) = cos(x)·cos(d) - sin(x)·sin(d)
           = cos(x)·1 - sin(x)·d
           = cos(x) - sin(x)·d

∴ cos'(x) = -sin(x)
```

**Example 2.7: f(x) = eˣ**

```
We define eˣ as the unique function where f'(x) = f(x) and f(0) = 1.
"The function whose rate of change equals itself."

By the Fundamental Equation:
eˣ⁺ᵈ = eˣ + (eˣ)'·d = eˣ + eˣ·d = eˣ(1 + d)

So eˣ⁺ᵈ = eˣ · eᵈ, and we discover: eᵈ = 1 + d (for infinitesimal d).

This is the most natural definition of e: it's the base whose
infinitesimal power is 1 + d.
```

**Example 2.8: f(x) = ln(x)**

```
Since ln is the inverse of exp, and exp'(x) = exp(x):

If y = ln(x), then x = eʸ.
Nudge: x + d = eʸ⁺ᵈʸ = eʸ · eᵈʸ = eʸ(1 + d·y')  = x(1 + d·y')
So: x + d = x + x·d·y'
Matching d terms: 1 = x·y'
∴ y' = 1/x
∴ ln'(x) = 1/x
```

---

### Chapter 3: The Rules of Change

**Core idea:** All the standard differentiation rules fall out of pure algebra with d² = 0.

**Key concepts:**

- The Product Rule
- The Chain Rule
- The Quotient Rule
- The Power Rule (general)
- Higher-order derivatives via higher nilpotents (d₁ + d₂ cubes to zero → second derivative)

**Interactive Demo 4: "Rule Prover"**

- Pick a rule (Product, Chain, Quotient)
- The app shows the algebraic proof step by step with color-coded terms:
  - f terms in BLUE
  - g terms in GREEN
  - d terms in MAGENTA
  - d² terms in RED (then they vanish)
- The proof assembles like a puzzle, each step appearing on click/scroll

**Worked Proofs:**

**Product Rule: (f·g)' = f'·g + f·g'**

```
(fg)(x + d) = f(x + d) · g(x + d)
            = [f(x) + f'(x)·d] · [g(x) + g'(x)·d]
            = f(x)g(x) + f'(x)g(x)·d + f(x)g'(x)·d + f'(x)g'(x)·d²
            = f(x)g(x) + [f'(x)g(x) + f(x)g'(x)]·d     ← d² = 0
∴ (fg)'(x) = f'(x)g(x) + f(x)g'(x)  ✓
```

(Accompanied by the visual rectangle diagram from Bell's paper — a rectangle
with sides f and g, showing the infinitesimal strips.)

**Chain Rule: (f∘g)' = f'(g(x)) · g'(x)**

```
f(g(x + d)) = f(g(x) + g'(x)·d)

Note: g'(x)·d is infinitesimal because (g'(x)·d)² = g'(x)²·d² = 0

So we can apply the Fundamental Equation again:
= f(g(x)) + f'(g(x)) · g'(x) · d

∴ (f∘g)'(x) = f'(g(x)) · g'(x)  ✓
```

**Quotient Rule: (f/g)' = (f'g - fg') / g²**

```
(f/g)(x + d) = f(x + d) / g(x + d)
             = [f + f'd] / [g + g'd]

Multiply top and bottom by (g - g'd):
= [f + f'd][g - g'd] / [g + g'd][g - g'd]
= [fg - fg'd + f'gd - f'g'd²] / [g² - (g'd)²]
= [fg + (f'g - fg')d] / g²           ← d² = 0 in both places
= f/g + [(f'g - fg')/g²]·d

∴ (f/g)' = (f'g - fg') / g²  ✓
```

**Higher Derivatives: The Taylor Telescope**

```
Use two different nilsquares d₁ and d₂:
f(x + d₁ + d₂) = f(x) + f'(x)(d₁ + d₂) + ½f''(x)(d₁ + d₂)²

Note: (d₁ + d₂)² = d₁² + 2d₁d₂ + d₂² = 2d₁d₂
(The product of two different nilsquares is NOT zero!)

So: f(x + d₁ + d₂) = f(x) + f'(x)(d₁ + d₂) + f''(x)·d₁d₂

This is an EXACT infinitesimal Taylor formula — not an approximation!

Extending: D_n = {d : d^(n+1) = 0} gives exact polynomial expansion to degree n.
```

**Interactive Demo 5: "The Taylor Telescope"**

- Pick a function. Pick the order (1st, 2nd, 3rd).
- The app shows the exact infinitesimal Taylor polynomial.
- Compare with classical Taylor: "Ours is exact on D_n, theirs is approximate everywhere."
- Visualize: the function, its linear approximation (using D), its quadratic
  approximation (using D₂), etc., all overlaid on the graph.

---

### Chapter 4: The World of Areas (Integration)

**Core idea:** Integration is the reverse of differentiation. The area under a curve
accumulates via infinitesimal rectangles that are _exactly right_ — not approximately.

**Key concepts:**

- The Fundamental Theorem of Calculus (as a geometric derivation, not a theorem to prove)
- Area under a curve via microstraightness
- The Constancy Principle: if f'(x) = 0 everywhere, then f is constant
- Antiderivatives determine global behavior from infinitesimal behavior

**The Geometric Proof (Bell's Derivation):**

```
Let A(x) = area under curve y = f(x) from 0 to x.

The area gained from x to x + d consists of:
- A rectangle of width d and height f(x): area = f(x)·d
- A triangle on top (because the curve rises/falls by f'(x)·d):
  area = ½ · d · f'(x)·d = ½ · f'(x) · d² = 0    ← d² = 0!

So: A(x + d) - A(x) = f(x)·d
    d·A'(x) = d·f(x)
    A'(x) = f(x)    ← by microcancellation

"The rate at which area accumulates equals the height of the curve."
This IS the Fundamental Theorem of Calculus.
```

**Interactive Demo 6: "The Infinitesimal Strip"**

- A curve displayed on a graph
- User drags a point along the x-axis
- At each point, an infinitesimal strip appears:
  - The rectangle portion (width d, height f(x)) is shaded BLUE
  - The tiny triangle on top is shaded RED and labeled "area = 0 (because d² = 0)"
- The accumulated area fills in smoothly as the point moves
- A running equation shows: A'(x) = f(x) updating in real time
- Side panel shows the antiderivative being computed

**Worked Examples:**

**Example 4.1: Area under f(x) = x²**

```
We need A(x) such that A'(x) = x² and A(0) = 0.
Test: A(x) = x³/3.
Check: A'(x) = 3x²/3 = x². ✓
Check: A(0) = 0. ✓

∴ ∫₀ˣ t² dt = x³/3
```

**Example 4.2: Area under sin(x)**

```
We need A(x) such that A'(x) = sin(x) and A(0) = 0.
Since cos'(x) = -sin(x), we have (-cos)'(x) = sin(x).
So A(x) = -cos(x) + C. Since A(0) = 0: 0 = -cos(0) + C = -1 + C, so C = 1.

∴ ∫₀ˣ sin(t) dt = 1 - cos(x)
```

---

### Chapter 5: Geometry From Infinitesimals

**Core idea:** Microstraightness + the Pythagorean theorem = all of geometric calculus.
Arc length, surface area, and volume formulas _derive themselves_.

**Key concepts:**

- Arc length via microstraight segments + Pythagorean theorem
- Surface area of revolution via infinitesimal frustums (that are actually cylinders,
  because the curvature vanishes at infinitesimal scale)
- Volume of revolution via infinitesimal disks

**The Arc Length Derivation (from O'Connor):**

```
At any point on the curve y = f(x), the infinitesimal piece from x to x+d
is STRAIGHT (microstraightness). It's a line segment from (x, f(x)) to
(x + d, f(x) + f'(x)d).

By the Pythagorean theorem:
  length² = d² + (f'(x)·d)²
          = d² + f'(x)²·d²
          = d²(1 + f'(x)²)

  length = d · √(1 + f'(x)²)

So: s'(x) = √(1 + f'(x)²)    (by microcancellation)

∴ s(x) = ∫₀ˣ √(1 + f'(t)²) dt
```

**Interactive Demo 7: "The Unrolling Curve"**

- A curve on a graph (user picks: parabola, sine, circle, etc.)
- Click "Unroll" and the curve literally unrolls into a straight line below,
  with each infinitesimal straight segment laid end-to-end
- The total length is computed and displayed
- Each segment has a tiny right triangle visible (hypotenuse = segment,
  legs = d and f'(x)·d)

**Interactive Demo 8: "The Revolution"**

- A curve rotated around the x-axis, rendered in 3D (Three.js or CSS 3D)
- Each infinitesimal strip is shown as a disk/cylinder
- Toggle: "Classical frustums" (truncated cones) vs "Neocalculus disks" (flat,
  because microstraightness)
- The volume integral builds up visually

---

### Chapter 6: Modeling the Physical World

**Core idea:** Physics is where Neocalculus truly shines. Velocity, acceleration,
force, motion — all become algebraic operations on infinitesimals.

**Key concepts:**

- Velocity = derivative of position (the infinitesimal displacement per infinitesimal time)
- Acceleration = derivative of velocity = second derivative of position
- Newton's F = ma in infinitesimal form
- The catenary (hanging chain)
- Kepler's areal law

**Interactive Demo 9: "The Physics Sandbox"**

- A projectile simulator:
  - Set initial velocity, angle, gravity
  - Toggle between "Euler steps" (discrete, approximate) and "Synthetic trajectory"
    (exact infinitesimal expansion)
  - The Euler version shows visible step artifacts; the synthetic version is perfectly smooth
  - Display the position equation built from infinitesimal reasoning:
    x(t+d) = x(t) + v(t)·d, v(t+d) = v(t) + a·d

**Interactive Demo 10: "The Hanging Chain"**

- A draggable chain that naturally forms a catenary shape
- The infinitesimal force balance is shown at each point
- The differential equation falls out from SDG reasoning:
  balance forces on the infinitesimal straight segment from P to Q

**Worked Example: Kepler's Areal Law (from Bell)**

```
A particle moves under central force toward point O.
In infinitesimal time d, the radius vector sweeps an area:
  dA = ½ · r · (r·dθ) = ½r²·dθ      (using microstraightness: sector = triangle)

The force is radial, so there's no torque:
  d(r²·θ')/dt = 0

∴ r²·θ' = constant
∴ A(t) = ½kt (equal areas in equal times)
```

---

### Chapter 7: The Bigger Picture

**Core idea:** What we've built is just the beginning. The same principles extend to
multivariable calculus, differential forms, and the deepest structures of mathematics.

**Key concepts (lighter treatment, showing the horizon):**

- Partial derivatives: f(x + d₁, y + d₂) = f(x,y) + f_x·d₁ + f_y·d₂
- D(2) = {(d₁,d₂): d₁² = d₂² = d₁d₂ = 0} for gradients without mixed partials
- Tangent vectors as maps D → M (a microsegment placed on a surface)
- Constrained optimization via infinitesimal constraints (Lagrange multipliers,
  SDG-style — from O'Connor's notes)
- Differential forms as measuring infinitesimal parallelotopes
- The Generalized Stokes' Theorem: ∫_∂M ω = ∫_M dω
  (unifying the FTC, Green's, Stokes', and Divergence theorems)

**Interactive Demo 11: "The Gradient Explorer"**

- A 3D surface plot
- User places an infinitesimal cross D(2) on the surface at any point
- The partial derivatives are shown as slopes of the two arms
- The gradient vector is displayed as an arrow

**Interactive Demo 12: "Stokes' Theorem Visualizer"**

- An animated demonstration showing how the exterior derivative of a 1-form
  on infinitesimal squares adds up, with interior contributions canceling,
  leaving only the boundary integral
- This is the deep reason why ∫_∂M ω = ∫_M dω

---

## Part II: Interactive Demo Specifications

### Core Engine: The DualNumber Arithmetic Library

A JavaScript/TypeScript library that implements dual number arithmetic where d² = 0
is enforced exactly. This powers all interactive computations.

```typescript
class Dual {
	real: number; // the "real part"
	inf: number; // the "infinitesimal part" (coefficient of d)

	constructor(real: number, inf: number = 0) {
		this.real = real;
		this.inf = inf;
	}

	add(other: Dual): Dual {
		return new Dual(this.real + other.real, this.inf + other.inf);
	}

	mul(other: Dual): Dual {
		// (a + bd)(c + ed) = ac + (ae + bc)d + bed² = ac + (ae + bc)d
		return new Dual(this.real * other.real, this.real * other.inf + this.inf * other.real);
	}

	div(other: Dual): Dual {
		// (a + bd)/(c + ed) = a/c + (bc - ae)/(c²) · d
		const c = other.real;
		return new Dual(this.real / c, (this.inf * c - this.real * other.inf) / (c * c));
	}

	pow(n: number): Dual {
		return new Dual(Math.pow(this.real, n), n * Math.pow(this.real, n - 1) * this.inf);
	}

	sin(): Dual {
		return new Dual(Math.sin(this.real), Math.cos(this.real) * this.inf);
	}

	cos(): Dual {
		return new Dual(Math.cos(this.real), -Math.sin(this.real) * this.inf);
	}

	exp(): Dual {
		const e = Math.exp(this.real);
		return new Dual(e, e * this.inf);
	}

	log(): Dual {
		return new Dual(Math.log(this.real), this.inf / this.real);
	}

	sqrt(): Dual {
		const s = Math.sqrt(this.real);
		return new Dual(s, this.inf / (2 * s));
	}
}

// Usage: derivative of f(x) = x³ at x = 2
const x = new Dual(2, 1); // x = 2 + 1·d (the "1" means "nudge by d")
const result = x.pow(3); // result = 8 + 12d
// result.real = 8 = f(2)
// result.inf = 12 = f'(2) = 3·(2²)
```

### Demo Component Architecture (Svelte 5)

Each interactive demo is a self-contained Svelte component:

```
src/
  lib/
    engine/
      dual.ts              ← DualNumber library
      symbolic.ts           ← Symbolic expansion engine (for step-by-step display)
    components/
      demos/
        PerfectZoom.svelte        ← Demo 1: The microscope / zoom
        MeetD.svelte              ← Demo 2: Number line + d² = 0
        AlgebraMachine.svelte     ← Demo 3: Step-by-step derivative
        RuleProver.svelte         ← Demo 4: Product/Chain/Quotient rule proofs
        TaylorTelescope.svelte    ← Demo 5: Higher-order Taylor
        InfinitesimalStrip.svelte ← Demo 6: FTC / area accumulation
        UnrollingCurve.svelte     ← Demo 7: Arc length
        Revolution.svelte         ← Demo 8: Surface/volume of revolution
        PhysicsSandbox.svelte     ← Demo 9: Projectile motion
        HangingChain.svelte       ← Demo 10: Catenary
        GradientExplorer.svelte   ← Demo 11: 3D partial derivatives
        StokesVisualizer.svelte   ← Demo 12: Stokes' theorem
      math/
        Equation.svelte           ← KaTeX equation renderer
        StepByStep.svelte         ← Animated equation stepper
        DToggle.svelte            ← The d-toggle that reveals infinitesimal terms
      ui/
        Chapter.svelte            ← Chapter layout wrapper
        Section.svelte            ← Subsection with scroll-triggered entrance
        Challenge.svelte          ← Interactive problem with feedback
        DigDeeper.svelte          ← Expandable "for the curious" section
        SideNote.svelte           ← Margin note / tooltip
  routes/
    +page.svelte                  ← Main scrollable page assembling all chapters
    +layout.svelte                ← Global layout with fonts, theme
    layout.css                    ← Tailwind + custom typography
```

---

## Part III: Visual Design Principles

### Typography & Color

- **Body font:** A warm serif (Crimson Pro or Lora) for the narrative text
- **Math font:** KaTeX default (Computer Modern)
- **Code/computation font:** JetBrains Mono
- **Color system:**
  - Background: warm off-white (#FDFBF7) with subtle paper texture
  - Text: near-black (#1A1A2E)
  - **Infinitesimal magenta (#D946EF)**: all instances of d, ε, infinitesimal terms
  - **Vanishing red (#EF4444)**: terms that vanish (d² = 0), shown briefly before fading
  - **Result blue (#3B82F6)**: final derivative/integral results
  - **Construction green (#10B981)**: intermediate valid steps
  - Interactive elements: subtle gradients, glassmorphism on demo panels

### Animation Philosophy

- **Scroll-triggered reveals:** Content enters as you scroll, not all at once
- **Step-by-step equations:** Mathematical derivations appear one line at a time,
  with d² terms appearing then fading out with a particle effect
- **Smooth transitions:** All interactive demos use spring physics for dragging/zooming
- **No jarring:** Animations are gentle, purposeful, never gratuitous
- **Performance:** Use CSS transforms and Canvas for 60fps, avoid DOM thrashing

### Layout

- **Max content width:** 720px for text (optimal reading width)
- **Full-bleed demos:** Interactive demos span the full viewport width
- **Floating math:** Key equations "float" in styled callout boxes
- **Progress indicator:** A thin progress bar at the top showing chapter progress
- **Chapter navigation:** Sticky side nav (desktop) or hamburger (mobile) for jumping

---

## Part IV: Content Inventory — Every Derivative and Integral

### Derivatives We Prove (all via d² = 0 algebra)

| Function         | Method                                                          | Proof Complexity   |
| ---------------- | --------------------------------------------------------------- | ------------------ |
| xⁿ (integer n)   | Binomial expansion, d² = 0 kills all but linear term            | ★ Easy             |
| 1/x              | Multiply by conjugate (x-d)/(x-d), d² = 0                       | ★★ Medium          |
| √x               | Square both sides, match d coefficients                         | ★★ Medium          |
| sin(x)           | Infinitesimal triangle: sin(d)=d, cos(d)=1, then angle addition | ★★ Medium          |
| cos(x)           | Same method as sin                                              | ★★ Medium          |
| tan(x)           | Quotient rule on sin/cos                                        | ★★ Medium          |
| eˣ               | Defined by f'=f, f(0)=1. eᵈ = 1+d follows.                      | ★ Easy (axiomatic) |
| ln(x)            | Inverse function: if y=ln(x), then x=eʸ, nudge both sides       | ★★ Medium          |
| xᵃ (real a)      | Write as e^(a·ln(x)), apply chain rule                          | ★★★ Harder         |
| arcsin(x)        | Inverse function method on sin                                  | ★★★ Harder         |
| arctan(x)        | Inverse function method on tan                                  | ★★★ Harder         |
| sinh(x), cosh(x) | From eˣ definition, direct computation                          | ★★ Medium          |

### Differentiation Rules We Prove

| Rule              | Method                                        |
| ----------------- | --------------------------------------------- |
| Sum rule          | Direct: (f+g)(x+d) = f(x+d) + g(x+d)          |
| Constant multiple | Direct: (cf)(x+d) = c·f(x+d)                  |
| Product rule      | Expand product, d² vanishes                   |
| Quotient rule     | Multiply by conjugate of denominator          |
| Chain rule        | Nested application of Fundamental Equation    |
| Inverse function  | Nudge both sides of y = f⁻¹(x), i.e. f(y) = x |

### Integration Topics

| Topic                           | Method                                               |
| ------------------------------- | ---------------------------------------------------- |
| Fundamental Theorem (geometric) | Infinitesimal strip = rectangle + vanishing triangle |
| Basic antiderivatives           | Reverse the derivative table above                   |
| Area under curves               | Direct from FTC                                      |
| Arc length                      | Pythagorean theorem on microstraight segments        |
| Surface area of revolution      | Infinitesimal cylinder (frustum with d²=0)           |
| Volume of revolution (disks)    | Infinitesimal disk: V' = π·f(x)²·d                   |
| Volume of revolution (shells)   | Infinitesimal cylindrical shell                      |

### Physics Applications

| Application             | SDG Content                                         |
| ----------------------- | --------------------------------------------------- |
| Velocity & acceleration | v = dx/dt as literal infinitesimal ratio            |
| Projectile motion       | x(t+d) = x(t) + v·d, v(t+d) = v(t) + g·d            |
| Simple harmonic motion  | Spring: F = -kx → x'' = -ω²x                        |
| The catenary            | Infinitesimal force balance → differential equation |
| Kepler's areal law      | Infinitesimal sector = triangle (microstraightness) |
| Work and energy         | W = F·dx as literal infinitesimal work              |

---

## Part V: Implementation Phases

### Phase 1: Foundation (Week 1-2)

- [ ] Set up SvelteKit project with Tailwind, KaTeX, custom fonts
- [ ] Build the DualNumber engine (dual.ts)
- [ ] Build core math rendering components (Equation, StepByStep, DToggle)
- [ ] Build the Chapter/Section/DigDeeper layout components
- [ ] Build the scrolling infrastructure (intersection observers, progress bar)

### Phase 2: Chapters 1-2 (Week 3-4)

- [ ] Chapter 1: Narrative + "Perfect Zoom" demo + "Meet d" demo
- [ ] Chapter 2: All 8 worked derivative examples with animated step-by-step
- [ ] The Algebra Machine interactive demo
- [ ] Challenge problems for Chapters 1-2

### Phase 3: Chapters 3-4 (Week 5-6)

- [ ] Chapter 3: Rule proofs (product, chain, quotient) + Taylor Telescope
- [ ] Chapter 4: FTC geometric proof + Infinitesimal Strip demo
- [ ] Integration examples
- [ ] Challenge problems for Chapters 3-4

### Phase 4: Chapters 5-6 (Week 7-8)

- [ ] Chapter 5: Arc length + Unrolling Curve + Revolution demos
- [ ] Chapter 6: Physics Sandbox + Hanging Chain + Kepler
- [ ] Challenge problems

### Phase 5: Chapter 7 + Polish (Week 9-10)

- [ ] Chapter 7: Multivariable preview (Gradient Explorer, Stokes)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Final polish, transitions, micro-interactions
