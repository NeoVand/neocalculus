# Neocalculus Migration Matrix

Status: Active  
From: Current 10-chapter implementation in `/Users/neo/repos/neocalculus/src/lib/chapters`  
To: 9-chapter architecture in `/Users/neo/repos/neocalculus/CHAPTER_SPECS.md`

Action labels:

1. `KEEP`: keep section as core with light edits.
2. `MERGE`: merge into another section to reduce duplication/load.
3. `MOVE`: move to another target chapter.
4. `REFRAME`: keep topic, rewrite pedagogical framing.
5. `RETIRE`: remove standalone section; preserve as short reference note if needed.

## Ch01SmoothWorld.svelte

| Source section                  | Target chapter |  Action | Notes                                                 |
| ------------------------------- | -------------- | ------: | ----------------------------------------------------- |
| What is a function?             | Ch1            |    KEEP | Tighten to smooth-change framing quickly.             |
| Smoothness                      | Ch1            |    KEEP | Keep as gatekeeping assumption section.               |
| Zooming in: the key insight     | Ch1            |    KEEP | Keep with stronger "first-order microscope" language. |
| Meet d                          | Ch1            |    KEEP | Keep with explicit origin-story sequencing.           |
| Arithmetic with infinitesimals  | Ch1            |    KEEP | Keep as toolbelt.                                     |
| A first taste: the slope of x^2 | Ch1            |    KEEP | Keep as bridge into Chapter 2.                        |
| How can d^2 = 0 without d = 0?  | Ch1            | REFRAME | Keep concise; tie to constructive logic window.       |

## Ch02SlopeEquation.svelte

| Source section                        | Target chapter | Action | Notes                                 |
| ------------------------------------- | -------------- | -----: | ------------------------------------- |
| What the derivative means             | Ch2            |   KEEP | Keep geometry/physics/units triad.    |
| The simplest rules                    | Ch2            |   KEEP | Keep but cap derivation length.       |
| Polynomials                           | Ch2            |   KEEP | Core fluency block.                   |
| Rational and radical functions        | Ch2            |   KEEP | Keep with fewer repetitive examples.  |
| Trigonometric functions               | Ch2            |   KEEP | Keep triangle interpretation + demo.  |
| Exponential and logarithmic functions | Ch2            |   KEEP | Keep with inverse reasoning emphasis. |
| Inverse trigonometric functions       | Ch2            |  MERGE | Merge into function-family section.   |
| Finding tangent lines                 | Ch2            |   KEEP | Keep as transfer/output section.      |

## Ch03RulesOfChange.svelte

| Source section                  | Target chapter | Action | Notes                                              |
| ------------------------------- | -------------- | -----: | -------------------------------------------------- |
| The Product Rule                | Ch3            |   KEEP | Canonical proof location.                          |
| The Chain Rule                  | Ch3            |   KEEP | Canonical proof location.                          |
| The Quotient Rule               | Ch3            |   KEEP | Canonical proof location.                          |
| L'Hôpital's Rule                | Ch3            |   KEEP | Canonical theorem location.                        |
| Related Rates                   | Ch3            |   KEEP | Keep with model-first framing.                     |
| Linearization and Differentials | Ch3            |   KEEP | Keep and link to Chapter 4 usage.                  |
| Implicit Differentiation        | Ch3            |   KEEP | Keep as core.                                      |
| Logarithmic Differentiation     | Ch3            |  MERGE | Merge into implicit/chain workflow.                |
| Higher-Order Derivatives        | Ch7            |   MOVE | Move most higher-order emphasis to series chapter. |
| The Constancy Principle         | Ch3            |   KEEP | Canonical theorem location.                        |

## Ch04Optimization.svelte

| Source section                       | Target chapter | Action | Notes                                                            |
| ------------------------------------ | -------------- | -----: | ---------------------------------------------------------------- |
| What the derivative tells us         | Ch3            |  MERGE | Merge into Chapter 3 transfer block.                             |
| Concavity and the second derivative  | Ch3            |   KEEP | Keep as local-model consequence.                                 |
| Stationary points and classification | Ch3            |   KEEP | Keep with optimization bridge.                                   |
| Curve sketching                      | Ch3            |  MERGE | Merge into stationarity/concavity workflow.                      |
| Optimization                         | Ch3            |   KEEP | Keep but shorten scenario count.                                 |
| Absolute vs. relative extrema        | Ch3            |  MERGE | Merge into optimization assumptions box.                         |
| Linear approximation                 | Ch3            |  MERGE | Merge with linearization section.                                |
| Newton's method                      | Ch3            |   KEEP | Keep as algorithmic local model.                                 |
| L'Hôpital's rule                     | Ch3            | RETIRE | Retired as standalone; reference Chapter 3 canonical proof only. |
| Differentials                        | Ch3            |  MERGE | Merge with existing linearization+differentials block.           |

## Ch05WorldOfAreas.svelte

| Source section                      | Target chapter | Action | Notes                                                              |
| ----------------------------------- | -------------- | -----: | ------------------------------------------------------------------ |
| From rates to totals                | Ch4            |   KEEP | Chapter opener.                                                    |
| Integration without limits          | Ch4            |   KEEP | Keep but reduce rhetoric repetition.                               |
| The Fundamental Theorem of Calculus | Ch4            |   KEEP | Canonical theorem location.                                        |
| Notation                            | Ch4            |   KEEP | Concise operational notation block.                                |
| Basic antiderivatives               | Ch4            |   KEEP | Core technique block.                                              |
| Properties of definite integrals    | Ch4            |   KEEP | Keep as compact theorem card.                                      |
| The Constancy Principle             | Ch3            | RETIRE | Retired as standalone here; reference Chapter 3 canonical theorem. |
| Integration by substitution         | Ch4            |   KEEP | Core reverse-chain technique.                                      |
| Substitution in definite integrals  | Ch4            |  MERGE | Merge into substitution section.                                   |
| Integration by parts                | Ch5            |   MOVE | Technique chapter.                                                 |
| Repeated integration by parts       | Ch5            |  MERGE | Merge into parts section.                                          |
| The cycle trick                     | Ch5            |  MERGE | Merge into parts section as subcase.                               |
| Partial fractions                   | Ch5            |   MOVE | Technique chapter.                                                 |
| Area between curves                 | Ch5            |   MOVE | Geometry chapter.                                                  |
| Average value of a function         | Ch5            |   MOVE | Geometry/applications chapter.                                     |
| Arc length                          | Ch5            |   MOVE | Geometry chapter.                                                  |
| Improper integrals                  | Ch5            |   MOVE | Technique chapter ending with caveat on infinity.                  |

## Ch06ApplicationsIntegration.svelte

| Source section                                        | Target chapter |  Action | Notes                                          |
| ----------------------------------------------------- | -------------- | ------: | ---------------------------------------------- |
| The Slicing Principle                                 | Ch5            |    KEEP | Geometry chapter opener.                       |
| Volumes of Revolution — Disk Method                   | Ch5            |    KEEP | Core geometric setup.                          |
| The Washer Method                                     | Ch5            |    KEEP | Keep.                                          |
| Volumes by Cross-Section                              | Ch5            |    KEEP | Keep.                                          |
| The Shell Method                                      | Ch5            |    KEEP | Keep.                                          |
| Surface Area of Revolution                            | Ch5            |    KEEP | Keep.                                          |
| Work                                                  | Ch6            |    MOVE | Physics modeling chapter.                      |
| Center of Mass and Moments                            | Ch6            |    MOVE | Physics/data modeling section.                 |
| Probability Density — An Infinitesimal Interpretation | Ch6            |    MOVE | Keep as optional modeling bridge.              |
| Pappus' Theorem                                       | Ch5            | REFRAME | Keep as enrichment callout, not core mainline. |

## Ch07InfiniteSeries.svelte

| Source section                                       | Target chapter | Action | Notes                               |
| ---------------------------------------------------- | -------------- | -----: | ----------------------------------- |
| The question                                         | Ch7            |   KEEP | Keep as motivation opener.          |
| Higher-order infinitesimals: the sets D_n            | Ch7            |   KEEP | Core conceptual move.               |
| Extracting Taylor coefficients                       | Ch7            |   KEEP | Core method.                        |
| Building up: key expansions                          | Ch7            |   KEEP | Canonical examples.                 |
| The nilpotent-to-classical bridge                    | Ch7            |   KEEP | Keep with careful scope statements. |
| Worked example: Taylor series for sin(x) to degree 5 | Ch7            |   KEEP | Keep as template worked example.    |
| The geometric series                                 | Ch7            |   KEEP | Core series example.                |
| Convergence and the radius of convergence            | Ch7            |   KEEP | Keep concise first-course depth.    |
| Error estimation: the Taylor remainder               | Ch7            |   KEEP | Core approximation control.         |
| The binomial series                                  | Ch7            |  MERGE | Merge into expansions block.        |
| Applications: integrals we couldn't do before        | Ch7            |   KEEP | Keep transfer section.              |
| When series go wrong: geometric series at x=2        | Ch7            |   KEEP | Keep as failure-mode literacy.      |

## Ch08Physics.svelte

| Source section                     | Target chapter | Action | Notes                                    |
| ---------------------------------- | -------------- | -----: | ---------------------------------------- |
| Velocity and Acceleration          | Ch6            |   KEEP | Core local-law entry.                    |
| Newton's Second Law                | Ch6            |   KEEP | Core law section.                        |
| Projectile Motion                  | Ch6            |   KEEP | Core model.                              |
| Simple Harmonic Motion             | Ch6            |   KEEP | Core oscillation model.                  |
| Conservation of Energy             | Ch6            |   KEEP | Core transfer law.                       |
| Work and the Work-Energy Theorem   | Ch6            |   KEEP | Keep.                                    |
| Momentum and Impulse               | Ch6            |   KEEP | Keep.                                    |
| Separation of Variables            | Ch6            |   KEEP | Keep as DE method.                       |
| Newton's Law of Cooling            | Ch6            |   KEEP | Keep as canonical separable model.       |
| Kepler's Areal Law                 | Ch6            |   KEEP | Keep as geometric high-point.            |
| Exponential Growth and Decay       | Ch6            |  MERGE | Merge with cooling/compound model group. |
| Compound Interest and the Number e | Ch6            |  MERGE | Merge with growth/decay model group.     |

## Ch09ManyDimensions.svelte

| Source section                                          | Target chapter | Action | Notes                                            |
| ------------------------------------------------------- | -------------- | -----: | ------------------------------------------------ |
| Beyond a single variable                                | Ch8            |   KEEP | Intro framing.                                   |
| The infinitesimal cross D(2) and partial derivatives    | Ch8            |   KEEP | Canonical first move.                            |
| Directional derivatives                                 | Ch8            |   KEEP | Keep.                                            |
| The gradient                                            | Ch8            |   KEEP | Keep.                                            |
| The multivariable chain rule                            | Ch8            |   KEEP | Keep.                                            |
| Second derivatives and the Hessian                      | Ch8            |   KEEP | Keep.                                            |
| Lagrange multipliers (SDG style)                        | Ch8            |   KEEP | Keep concise.                                    |
| Double integrals: summing over infinitesimal tiles      | Ch8            |   KEEP | Keep.                                            |
| The Jacobian: how maps distort infinitesimal area       | Ch8            |   KEEP | Keep.                                            |
| Application: area of a disk                             | Ch8            |  MERGE | Merge into Jacobian/change-of-variables section. |
| Vector fields                                           | Ch8            |   KEEP | Keep.                                            |
| Divergence and curl: infinitesimal flux and circulation | Ch8            |   KEEP | Keep.                                            |
| Line integrals: work along a curve                      | Ch8            |   KEEP | Keep.                                            |
| Tangent vectors as microsegments                        | Ch8            |  MERGE | Merge into intro or vector-field section.        |

## Ch10LanguageOfForms.svelte

| Source section                          | Target chapter |  Action | Notes                             |
| --------------------------------------- | -------------- | ------: | --------------------------------- |
| The last question                       | Ch9            |    KEEP | Opener.                           |
| What is a differential form?            | Ch9            |    KEEP | Core definitions by use-case.     |
| The wedge product                       | Ch9            |    KEEP | Core operation.                   |
| Explicit coordinate notation            | Ch9            |    KEEP | Keep for computation.             |
| The exterior derivative                 | Ch9            |    KEEP | Core differential operator.       |
| The deepest equation: d^2 = 0 (again!)  | Ch9            |    KEEP | Keep conceptual closure.          |
| The Generalized Stokes' Theorem         | Ch9            |    KEEP | Canonical theorem.                |
| The four classical theorems             | Ch9            |    KEEP | Keep as unification section.      |
| Closed and exact forms: detecting holes | Ch9            |    KEEP | Keep, concise first-course depth. |
| The principle of least action           | Ch9            | REFRAME | Keep as enrichment extension.     |
| Coda: one axiom                         | Ch9            |    KEEP | Final close.                      |

## Immediate Code Cleanup Applied

1. Duplicate L'Hopital exposition removed from Chapter 4 and replaced with canonical Chapter 3 reference.
2. Duplicate Constancy Principle exposition removed from Chapter 5 and replaced with canonical Chapter 3 reference.
