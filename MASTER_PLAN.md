# Neocalculus Master Plan

Status: Active v1  
Date: 2026-02-08  
Scope: Full-course pedagogy, content architecture, rigor standards, and production roadmap
Execution backlog: `/Users/neo/repos/neocalculus/IMPLEMENTATION_BACKLOG.md`

## 1. Mission

Neocalculus teaches a complete first-course calculus sequence through an infinitesimal-first lens.

The book is designed to satisfy three constraints at once:

1. It must work for first-time learners in high school or first-year college STEM.
2. It must preserve full practical calculus coverage expected in mainstream pathways.
3. It must be mathematically credible to both classical instructors and modern constructive/SDG-oriented experts.

## 2. Strategic Position

Neocalculus is not "classical calculus plus side notes."

Neocalculus is:

1. A first-order calculus built around smoothness and infinitesimal linearity.
2. A pedagogy that treats `d^2 = 0` as a deliberate modeling microscope.
3. A bridge between intuition, computation, geometry, and modern foundations.

Neocalculus is not:

1. A graduate text in topos theory, type theory, or categorical foundations.
2. A rejection of classical calculus outcomes.
3. A marketing shell around ordinary limit-first sequencing.

## 3. Non-Negotiables

1. Full mainstream topic coverage remains in scope.
2. The final unification chapter is required, not optional.
3. Advanced foundation ideas appear throughout in concise, learner-safe form.
4. Every core method must have computational payoff and geometric meaning.
5. Claims must be careful about assumptions and domains.

## 4. Audience and Outcomes

Primary learner profiles:

1. Advanced high school student learning calculus for the first time.
2. First-year STEM student in a standard calculus sequence.
3. Independent learner seeking conceptual clarity and modern framing.

End-of-course outcomes:

1. Compute derivatives and integrals fluently across standard families.
2. Use calculus to model change in physics and engineering contexts.
3. Work with multivariable ideas including gradient, Jacobian, and line/surface reasoning.
4. Understand differential forms at an intuitive and operational first-course level.
5. Explain why infinitesimal methods are coherent and where assumptions matter.

## 5. Core Pedagogy Commitment

Each section uses a consistent teaching contract:

1. Question: a concrete puzzle or phenomenon.
2. Micro-idea: one new infinitesimal principle.
3. Algebra: exact first-order computation.
4. Geometry or simulation: visual confirmation.
5. Transfer: a practical application.

This structure keeps the course distinctive without overwhelming the learner.

## 6. Foundational Narrative Without Derailing

Modern ideas remain visible through short "foundation windows."

Each window must follow this format:

1. One sentence: what this idea is.
2. One sentence: why it matters here.
3. One sentence: what we are not requiring from the learner.

Mandatory windows across the book:

1. Kock-Lawvere as local affine behavior on infinitesimals.
2. Constructive logic as a discipline of explicit reasoning.
3. Smooth topos perspective as context for rigorous infinitesimals.
4. HoTT/univalent mention as a horizon item in the final chapter only.

## 7. Origin Story for `d^2 = 0`

This must be taught explicitly and early.

Canonical explanation sequence:

1. Local linearity is the operational heart of calculus.
2. In ordinary formulations, higher-order terms become small via limiting.
3. In infinitesimal formulations, we use a first-order probe where second-order terms vanish exactly.
4. Dual-number algebra (`epsilon^2 = 0`) models this probe computationally.
5. Kock-Lawvere gives the structural statement: smooth maps are affine on infinitesimal neighborhoods.

Required analogy:

1. First-order microscope: preserves displacement and slope, erases curvature.

## 8. Chapter Architecture (Required 9-Chapter Sequence)

### Chapter 1: Smoothness and the First-Order Microscope

Big idea:

1. Calculus studies smooth change by zooming to first order.

Core outcomes:

1. Distinguish smooth behavior from corners and jumps.
2. Interpret `d^2 = 0` operationally.
3. Understand microstraightness and coefficient extraction.

Anchor interactive:

1. Perfect Zoom with function selector and tangent convergence.

### Chapter 2: Derivative as Coefficient

Big idea:

1. `f(x+d) = f(x) + f'(x)d` defines and computes derivatives directly.

Core outcomes:

1. Differentiate polynomial, rational, root, trig, exponential, and logarithmic families.
2. Use microcancellation correctly.
3. Read derivative as slope, rate, and unit transformation.

Anchor interactive:

1. Algebra Machine with step reveal and dual-number verification.

### Chapter 3: Rules of Change and Local Models

Big idea:

1. Product, chain, quotient, implicit, and local linearization are one algebraic workflow.

Core outcomes:

1. Prove and apply core derivative rules.
2. Execute related rates and implicit differentiation.
3. Use linearization for approximation and error intuition.

Anchor interactive:

1. Rule Prover with term-color logic and vanish visualization.

### Chapter 4: Accumulation and Fundamental Theorem

Big idea:

1. Integration is accumulation of exact first-order contributions.

Core outcomes:

1. Interpret antiderivative and definite integral coherently.
2. Derive FTC in first-order geometric language.
3. Apply substitution and basic integral properties.

Anchor interactive:

1. Infinitesimal Strip and interior cancellation preview.

### Chapter 5: Integration Geometry and Techniques

Big idea:

1. Arc length, area/volume methods, and integration techniques are geometric consequences of first-order structure.

Core outcomes:

1. Set up disk/washer/shell/cross-section models.
2. Compute arc length and average value.
3. Apply integration by parts and partial fractions in targeted contexts.

Anchor interactive:

1. Unrolling Curve and Revolution Lab.

### Chapter 6: Differential Equations and Physics Modeling

Big idea:

1. Physical laws become local update rules and differential equations.

Core outcomes:

1. Model velocity, acceleration, work, and energy.
2. Solve separable first-order equations in canonical contexts.
3. Use local laws to explain global trajectories and conservation patterns.

Anchor interactive:

1. Physics Sandbox with parameter sweeps and local rule tracing.

### Chapter 7: Series and Approximation

Big idea:

1. Higher-order information extends first-order reasoning into controlled approximation.

Core outcomes:

1. Build Taylor polynomials and interpret remainder.
2. Understand convergence radius at a first-course depth.
3. Use series for approximation and integral solving.

Anchor interactive:

1. Taylor Telescope with degree control and error overlay.

### Chapter 8: Multivariable and Vector Calculus

Big idea:

1. Independent infinitesimal directions organize partials, gradient, Jacobian, divergence, and curl.

Core outcomes:

1. Compute and interpret partial and directional derivatives.
2. Use gradient and Jacobian geometrically.
3. Set up line and surface-style accumulation ideas.

Anchor interactive:

1. Gradient/Jacobian Explorer with mapped microcells.

### Chapter 9: Differential Forms and Unification (Required)

Big idea:

1. One boundary-differential principle unifies major integration theorems.

Core outcomes:

1. Interpret 0-, 1-, and 2-form ideas operationally.
2. Use exterior derivative and orientation at a first-course level.
3. See FTC, Green, Stokes, and Divergence as one pattern.

Anchor interactive:

1. Stokes Visualizer with interior cancellation and surviving boundary flow.

## 9. Scope Compression Rules

Current project baseline includes high density, duplicated topics, and chapter-level overload.

Compression policy:

1. Maximum 6 core sections per chapter.
2. Maximum 10 exercises per chapter in the main flow.
3. One theorem appears once in mainline exposition.
4. Repeated topic usage must reference the canonical section rather than re-prove.

Known current duplicates to resolve:

1. L'Hopital appears in both Chapter 3 and Chapter 4.
2. Constancy Principle appears in both Chapter 3 and Chapter 5.

## 10. Exercise System Redesign

Exercise tiers:

1. Core: procedural fluency and concept checks.
2. Bridge: connect algebra to geometry/modeling.
3. Explore: optional advanced extensions.

Per chapter exercise target:

1. 6 Core
2. 3 Bridge
3. 1 Explore

Authoring requirements:

1. Each exercise has one dominant learning objective.
2. Solutions are concise and do not introduce new prerequisite theory.
3. At least two exercises per chapter include unit/context interpretation.

## 11. Visualization and Interactivity Plan

### P0 Interactives (Must Have)

1. Perfect Zoom
2. Algebra Machine
3. Rule Prover
4. Infinitesimal Strip + FTC visual
5. Physics Sandbox
6. Gradient/Jacobian Explorer
7. Stokes Interior Cancellation Visualizer

### P1 Interactives (Should Have)

1. Unrolling Curve
2. Revolution Lab
3. Taylor Telescope
4. Differential-equation phase sketches

### Visual quality rules

1. Every chapter must contain one central figure that carries conceptual load.
2. Every central figure must answer one explicit question.
3. Visuals cannot be decorative placeholders in final production.

## 12. Mathematical Rigor Policy

Each major result includes:

1. Statement in Neocalculus language.
2. Domain assumptions and smoothness conditions.
3. Classical compatibility note.
4. One worked example and one counterexample boundary case if relevant.

Language guardrails:

1. Do not claim classical calculus is wrong.
2. Do claim this framework makes first-order structure explicit.
3. Distinguish exact first-order equalities from global or infinite limiting statements.

## 13. Expert Review Criteria

### Classical review checks

1. No false theorem statements under stated assumptions.
2. No hidden division by infinitesimals.
3. Mainstream computational competencies preserved.

### Constructive/SDG review checks

1. Logic-sensitive claims are phrased correctly.
2. Kock-Lawvere usage is consistent.
3. Distinction between first-order exactness and higher-order/global claims is maintained.

### Curriculum compatibility checks

1. Learner can transition to standard exams and follow-on courses.
2. Core topic inventory matches first-course expectations.
3. Notation and conventions remain interoperable.

## 14. Content Migration from Current Project

Source currently contains 10 chapters in:

1. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch01SmoothWorld.svelte`
2. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch02SlopeEquation.svelte`
3. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch03RulesOfChange.svelte`
4. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch04Optimization.svelte`
5. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch05WorldOfAreas.svelte`
6. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch06ApplicationsIntegration.svelte`
7. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch07InfiniteSeries.svelte`
8. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch08Physics.svelte`
9. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch09ManyDimensions.svelte`
10. `/Users/neo/repos/neocalculus/src/lib/chapters/Ch10LanguageOfForms.svelte`

Migration policy:

1. Merge optimization and derivative applications into one canonical flow.
2. Merge integration foundations and integration applications into one two-chapter arc.
3. Preserve forms chapter as required culmination.
4. Remove duplicate expositions, keep strongest single treatment.

## 15. Tone and Voice Standards

Narrative tone:

1. Precise and warm, never grandiose.
2. Confident without dismissing standard methods.
3. Curious and explanatory, not polemical.

Sentence-level rules:

1. Prefer concrete verbs and finite examples.
2. Avoid repeated "no limits, no epsilon-delta" rhetoric in every section.
3. Use contrast sparingly and only where pedagogically useful.

## 16. Accessibility and Usability Standards

1. All interactive controls keyboard reachable.
2. Color choices pass contrast checks for text and key marks.
3. Figures include captions that state pedagogical purpose.
4. Mobile layout preserves interaction fidelity and readability.

## 17. Production Roadmap

### Phase A: Pedagogy Lock

Deliverables:

1. This master plan approved.
2. Section-level table of contents approved for 9 chapters.
3. Duplicate topic ownership map approved.

Exit criteria:

1. No unresolved chapter-boundary conflicts.
2. All major theorem homes assigned.

### Phase B: Structural Rewrite

Deliverables:

1. Chapter scaffold rewrite to 9-chapter sequence.
2. Mainline section budget enforcement.
3. Exercise tiering implementation.

Exit criteria:

1. Each chapter matches section and exercise budgets.
2. No duplicate theorem expositions in mainline.

### Phase C: Interactivity Core

Deliverables:

1. P0 interactives integrated chapter-by-chapter.
2. Figure/caption upgrades for core conceptual loads.
3. Visual consistency pass.

Exit criteria:

1. Every chapter has required anchor interactive.
2. Anchor interactive has explicit learning objective text.

### Phase D: Rigor and QA

Deliverables:

1. Assumption boxes and compatibility notes added.
2. Expert review checklist pass.
3. Final language and continuity pass.

Exit criteria:

1. No unresolved mathematical-risk flags.
2. End-to-end narrative coherence from Chapter 1 through Chapter 9.

## 18. Risk Register and Mitigations

Risk 1: Over-compression removes needed practice.  
Mitigation:

1. Tiered exercise model preserves depth while reducing clutter.

Risk 2: Advanced references overwhelm beginners.  
Mitigation:

1. Foundation windows capped to three sentences and one purpose.

Risk 3: Distinctiveness collapses into conventional sequencing.  
Mitigation:

1. Section contract enforces micro-idea and first-order algebra in every chapter.

Risk 4: Mathematical overclaims alienate experts.  
Mitigation:

1. Rigor policy requires assumptions and compatibility notes for major results.

Risk 5: Interactive scope expands faster than capacity.  
Mitigation:

1. Strict P0/P1 prioritization and phase gates.

## 19. Governance and Change Control

Any major content decision must answer:

1. Does this improve first-time learner comprehension?
2. Does this preserve first-course competency coverage?
3. Does this strengthen or weaken infinitesimal-first identity?
4. Is the claim mathematically precise under stated assumptions?

If a change fails any one question, it is not merged into mainline content.

## 20. Immediate Next Planning Artifacts

After master plan approval, produce:

1. Chapter-by-chapter section map with exact section titles.
2. Current-to-target migration matrix at section granularity.
3. Demo implementation spec for P0 interactives with ownership and dependencies.
4. Theorem ownership list with assumptions and compatibility notes.
