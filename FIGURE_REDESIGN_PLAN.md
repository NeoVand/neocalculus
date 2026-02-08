# Figure Redesign Master Plan

Status: Proposed (ready to execute)
Date: 2026-02-08
Owner: Codex + project maintainers

## 1. Objective

Rebuild the visual system so every figure/demo is:

1. Mathematically correct.
2. Visually consistent across chapters.
3. Pedagogically clear for first-time calculus learners.
4. Tunable from centralized styles/components.

## 2. Audit Summary (Current Repository)

### 2.1 What already works well

1. `src/lib/components/demos/FunctionMachine.svelte` is visually coherent, high craft, and animation-rich without feeling noisy.
2. `src/lib/components/demos/PerfectZoom.svelte` has strong interaction affordances and clear control hierarchy.
3. `src/lib/components/demos/InfinitesimalTrig.svelte` has good storytelling and tighter panel composition.

### 2.2 Regressions in newly added demos

1. Missing exploration icon and inconsistent demo header treatment:
   - `src/lib/components/demos/RuleProver.svelte`
   - `src/lib/components/demos/InfinitesimalStrip.svelte`
   - `src/lib/components/demos/GradientJacobianExplorer.svelte`
   - `src/lib/components/demos/StokesVisualizer.svelte`
2. Raw browser controls (range/checkbox) not styled to project system.
3. Ambiguous parameter labels (`a,b,c,d,x,y`) in Jacobian demo without semantic naming/help text.
4. Right-hand Jacobian/gradient visualization can exceed comfortable plotting bounds (vector exits framing).
5. Panel/card rhythm differs from stronger demos, causing inconsistent density and whitespace.

### 2.3 Figure system issues

1. Figure numbering is inconsistent (at least one unnumbered figure):
   - `src/lib/chapters/Ch04Optimization.svelte:744`
2. JSXGraph figures are authored ad hoc per chapter; no shared drawing primitives or label policy.
3. Mixed typography in figure/derivation titles (plain text math in many headings instead of KaTeX rendering).
4. Multiple plot backgrounds/borders and axis treatments produce visual drift.
5. Label collisions and clipping appear in several figures due hardcoded text positions.

### 2.4 Coverage gap

1. Chapter 8 (multivariable/vector) lacks compelling 3D visuals despite 3D-heavy concepts.
2. Figure `9.1` (current contour/gradient) needs a full redesign with better composition and explanatory layering.

## 3. Target Visual Grammar (Single Source of Truth)

## 3.1 Global visual tokens

Create canonical figure/demo tokens in one place and consume everywhere:

1. Frame radius, stroke, background, grid colors, axis colors.
2. Semantic palette (`primary`, `accent`, `warning`, `constructive`, `boundary`).
3. Typography scale for plot labels, legends, equations, and captions.
4. Standard spacing scale for controls/panels/legends.

Primary file:

1. `src/routes/layout.css` (tokens) plus extracted demo/figure utility classes.

## 3.2 Reusable shell components

Introduce reusable building blocks:

1. `src/lib/components/demos/DemoHeader.svelte`
2. `src/lib/components/demos/DemoCard.svelte`
3. `src/lib/components/demos/SliderField.svelte`
4. `src/lib/components/demos/ToggleField.svelte`
5. `src/lib/components/demos/LegendList.svelte`
6. `src/lib/components/demos/EquationPanel.svelte`

Rules:

1. Every interactive demo uses `DemoHeader` with icon.
2. Every control has label + value + hint.
3. Every plotted panel uses the same frame/background/border system.

## 3.3 JSXGraph standardization

Add a shared helper module:

1. `src/lib/visuals/jsxTheme.ts`

Provide:

1. `initStyledBoard(...)` with default axes/ticks/fonts/colors.
2. `clampToView(...)` and vector scaling helpers to avoid out-of-frame arrows.
3. label placement helpers with safe offsets.
4. a small set of primitives (styled point, vector, region fill, annotation).

Then migrate all chapter `setup...` functions to use it.

## 3.4 Figure metadata policy

Add strict figure metadata conventions:

1. Every `Figure`/`JSXGraphBoard` has a number and caption.
2. All chapter text references to figures are validated against existing numbers.
3. Add a lightweight check script to fail when a figure is unnumbered.

## 3.5 Math text policy for titles/labels

1. For any title containing formulas/symbol-heavy expressions, use KaTeX render path.
2. Avoid plain Unicode superscripts/subscripts when a formula is semantically mathematical.
3. Keep concise natural-language titles; move heavy formulas into subtitle/equation line.

## 4. Concrete Redesign Backlog (Prioritized)

## Phase A (Foundation + highest pain)

1. Build shared demo components and shared control styling.
2. Rework these four demos onto the shared system:
   - `src/lib/components/demos/RuleProver.svelte`
   - `src/lib/components/demos/InfinitesimalStrip.svelte`
   - `src/lib/components/demos/GradientJacobianExplorer.svelte`
   - `src/lib/components/demos/StokesVisualizer.svelte`
3. Fix Jacobian semantics:
   - rename matrix controls to `J11, J12, J21, J22` plus readable equation labels.
   - rename point controls to `x0, y0`.
   - enforce dynamic scaling/clamping for arrows and mapped cell.
4. Fix missing figure number in:
   - `src/lib/chapters/Ch04Optimization.svelte:744`

## Phase B (Chapter 4/5/9 visual rehab)

1. Recompose `4.1`, `4.2`, `4.3` with cleaner labels and bounded annotations:
   - `src/lib/chapters/Ch04Optimization.svelte`
2. Redesign `5.1` with robust text placement and no truncation:
   - `src/lib/chapters/Ch05WorldOfAreas.svelte`
3. Replace current `9.1` with a split view:
   - left: contour map with draggable point and tangent-level direction.
   - right: local linear map panel + normalized gradient/directional vectors.
   - file: `src/lib/chapters/Ch09ManyDimensions.svelte`

## Phase C (3D expansion for multivariable chapter)

Add three 3D-first visuals to Chapter 8:

1. Surface + tangent plane + gradient normal indicator.
2. Jacobian local linearization from curved surface patch to tangent patch.
3. Divergence/curl intuition field block (small cube flux + local rotation).

Implementation note:

1. Preferred: lightweight custom canvas projection first (no new dependency).
2. If quality/performance insufficient, add `three` and standardize scene controls in one wrapper component.

## Phase D (full consistency sweep)

1. Standardize all InlinePlot labels/legend placement to avoid overlap with curves/shaded regions.
2. Normalize all figure backgrounds/borders/padding.
3. Standardize derivation-title formatting with KaTeX support where needed.
4. Ensure chapter-wide figure numbering continuity and reference integrity.

## 5. Correctness and QA Plan

## 5.1 Mathematical correctness gates

For each interactive demo, add explicit invariant checks (internal assertions or test helpers):

1. Infinitesimal strip: rectangle + triangle decomposition matches formula numerically.
2. Jacobian explorer: area scaling equals `|det J|` within tolerance.
3. Gradient panel: vector equals analytical gradient at selected point.
4. Stokes visualizer: interior cancellation count and boundary count match combinatorics.

## 5.2 UI/visual QA gates

1. No text clipping at mobile, tablet, desktop breakpoints.
2. Controls remain readable and labeled (no single-letter ambiguity without legend).
3. All demos include exploration icon/header and consistent control chrome.
4. No default browser slider/checkbox visuals remain in custom demos.

## 5.3 Regression checks

1. `npm run check`
2. `npm run build`
3. Manual visual pass across all chapters with a fixed checklist.

## 6. Execution Sequence (Recommended)

1. Implement Phase A completely before any further chapter content edits.
2. Do Phase B next (chapter figures with highest learner-facing impact).
3. Do Phase C (3D additions) once shared visual system is stable.
4. Finish with Phase D global polish + final audit.

## 7. Definition of Done

This initiative is complete when:

1. Every figure and demo follows a shared visual system.
2. Newly added demos match or exceed the quality bar set by FunctionMachine/PerfectZoom.
3. Figure numbering and references are internally consistent.
4. Chapter 8 includes at least three strong 3D visuals tied to learning goals.
5. No known clipping/overlap/control-style regressions remain.
6. Mathematical invariants for interactive demos are verified.
