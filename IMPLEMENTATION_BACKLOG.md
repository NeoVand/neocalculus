# Neocalculus Implementation Backlog

Status: Active execution backlog  
Owner: Content + Product Engineering  
Last updated: 2026-02-12  
Scope: Planned implementation from current repository state, with no demo rewrites

## Current Execution Status

1. `[done]` `BK-001` baseline instrumentation scaffold
2. `[done]` `BK-005` regression checklist and sign-off log scaffold
3. `[done]` `BK-002` depth-lane primitives scaffolded:
   - `RevealBox`
   - `ProofDrawer`
   - `TranslationBox`
   - `ModelScopeBox`
   - `FailureModeBox`
4. `[done]` `BK-002` pilot integration:
   - `Ch01`: `ModelScopeBox`, `RevealBox`, `TranslationBox`
   - `Ch03`: `ProofDrawer`, `FailureModeBox`
5. `[done]` `BK-004` claim discipline pass completed on:
   - `+page` hero language
   - `Ch01`, `Ch02`, `Ch03`, `Ch07`, `Ch09`, `Ch10`
6. `[done]` `BK-003` deferred rendering phase 1 completed:
   - Added `LazyChapter` shell with intersection-triggered dynamic imports
   - Migrated `+page` from eager chapter imports to lazy chapter shells (except `Ch01` kept eager)
   - Build result: former `nodes/2.*.js` ~1.02 MB chunk removed; one large shared chunk remains (`BSQ_gVBC.js`)
7. `[done]` `BK-003` deferred rendering phase 2:
   - Migrated `JSXGraphBoard` from bundled `import('jsxgraph')` to runtime script-loader (`/vendor/jsxgraphcore.js`, CDN fallback)
   - Added asset sync script (`scripts/sync_jsxgraph_assets.sh`) and wired build/dev scripts
   - Build result: removed `node_modules/jsxgraph/src/index.js` client chunk entirely; largest client JS now `~349.74 kB` (`DPQWV-R5.js`)
8. `[done]` `BK-006` wormhole navigation pilot completed:
   - Added reusable `WormholeLink` and global `WormholeReturn` with session-backed jump stack
   - Integrated pilot dependency jumps in `Ch07` and `Ch10` (return-to-origin flow validated)
   - Added stable anchor IDs for chapter/section targeting (`Ch02`, `Ch03`, `Ch05`, `Ch07`, `Ch10`)
9. `[done]` `BK-007` dependency maps:
   - Added chapter-level prerequisite map component with bidirectional jump affordances
   - Integrated maps in `Ch03`, `Ch05`, `Ch07`, and `Ch10`
   - Added lazy-load deep-anchor scroll support so map links land reliably after deferred mount
10. `[in_progress]` `BK-008` chapter compression pass (pilot chapters):
   - Added explicit core-path callouts and moved secondary derivation clusters into extension drawers
   - Piloted compression in `Ch03`, `Ch05`, `Ch07`, and `Ch10` without touching interactive demo logic
   - Reclassified exercise depth by keeping core sets surfaced and grouping higher-depth sets in extension drawers
11. `[done]` `BK-009` bridge-failure scope notes:
   - Added convergence/radius failure note in `Ch07`
   - Added non-smooth physical-regime failure note in `Ch08`
   - Added topology/global-primitive failure note in `Ch10`

## 1. Purpose

This backlog turns the strategic plan into executable work with:

1. Priority order
2. Ticket-level acceptance criteria
3. File-level touch map
4. Explicit non-regression checks for every current interactive visualization

The primary goal is to make the book shorter on first render, deeper on demand, mathematically stricter, and faster to load, while preserving the existing interactive demos and figure quality.

## 2. Hard Constraints

1. Do not remove or redesign existing interactive demo logic unless a bug demands it.
2. Prefer text architecture, disclosure structure, and mount strategy changes over demo internals.
3. Surface-level claims must remain correct under explicit assumptions.
4. Preserve the "book" reading rhythm; avoid turning the experience into app-like tab overload.
5. Keep mobile and desktop reading quality as first-class constraints.

## 3. Baseline Snapshot (2026-02-12)

### 3.1 Content scale

1. Chapter source total: `14,650` lines across `src/lib/chapters/*.svelte`
2. KaTeX usage total: `3,259` `<Katex>` calls
3. Chapter count currently rendered on one route: `10`

### 3.2 Build/performance signals

From `npm run build` on current main branch:

1. Large client chunk: `_app/immutable/nodes/2.*.js` = `1,011.61 kB` (minified), `276.41 kB` gzip
2. Large client chunk: `_app/immutable/chunks/BSQ_gVBC.js` = `934.57 kB` (minified), `245.66 kB` gzip
3. Build warning: some chunks > `500 kB`
4. Current architecture eagerly imports all chapters in `src/routes/+page.svelte`

### 3.3 Existing interactive assets to preserve

1. `src/lib/components/demos/PerfectZoom.svelte`
2. `src/lib/components/demos/FunctionMachine.svelte`
3. `src/lib/components/demos/InfinitesimalTrig.svelte`
4. `src/lib/components/demos/AlgebraMachine.svelte`
5. `src/lib/components/demos/RuleProver.svelte`
6. `src/lib/components/demos/InfinitesimalStrip.svelte`
7. `src/lib/components/demos/GradientJacobianExplorer.svelte`
8. `src/lib/components/demos/SurfaceTangent3D.svelte`
9. `src/lib/components/demos/StokesVisualizer.svelte`
10. `src/lib/components/JSXGraphBoard.svelte` and chapter-specific JSXGraph setups
11. `src/lib/components/figures/AngleAdditionLemma.svelte`
12. `src/lib/components/figures/MicrostraightnessBridge.svelte`

## 4. Priority Queue

Priority legend:

1. `P0` = must complete first
2. `P1` = high value, follows P0
3. `P2` = polish and consolidation

### P0 tickets

1. `BK-001` Baseline instrumentation and acceptance harness
2. `BK-002` Depth-lane component primitives (`Core`, `Bridge`, `Deep`)
3. `BK-003` Deferred mount strategy for chapters and deep blocks
4. `BK-004` Claim discipline pass (hero + chapter openers + theorem headlines)
5. `BK-005` Non-regression harness for all existing demos

### P1 tickets

1. `BK-006` Wormhole navigation (jump and return)
2. `BK-007` Dependency maps per chapter
3. `BK-008` Chapter compression pass to target section/exercise caps
4. `BK-009` Bridge-failure scope notes in series/physics/forms

### P2 tickets

1. `BK-010` Styling and motion refinement for disclosure rhythm
2. `BK-011` Print and reduced-motion quality pass
3. `BK-012` Final editorial consistency sweep

## 5. Ticket Definitions

## BK-001 (P0): Baseline Instrumentation and Acceptance Harness

Objective:
Lock measurable pre-change benchmarks and quality gates.

Deliverables:

1. A checked-in benchmark note with current counts and build outputs.
2. A repeatable command set for pre/post comparisons.
3. A pass/fail gate list for release readiness.

Primary files:

1. `IMPLEMENTATION_BACKLOG.md` (baseline section updates)
2. `README.md` (optional command shortcuts)

Acceptance criteria:

1. Baseline metrics are documented and reproducible.
2. Team can run one command sequence and compare before/after state.

## BK-002 (P0): Depth-Lane Component Primitives

Objective:
Provide reusable UI primitives for progressive disclosure without narrative clutter.

Deliverables:

1. `RevealBox` for compact technical reveals.
2. `ProofDrawer` for staged proof walkthroughs.
3. `TranslationBox` for neocalculus/classical translation.
4. `ModelScopeBox` for assumptions and scope.
5. `FailureModeBox` for where bridge/scope limits appear.

Primary files:

1. `src/lib/components/RevealBox.svelte` (new)
2. `src/lib/components/ProofDrawer.svelte` (new)
3. `src/lib/components/TranslationBox.svelte` (new)
4. `src/lib/components/ModelScopeBox.svelte` (new)
5. `src/lib/components/FailureModeBox.svelte` (new)
6. `src/routes/layout.css` (component styles)

Acceptance criteria:

1. All primitives are keyboard accessible.
2. All primitives support mobile layout.
3. No existing chapter behavior regresses when primitives are unused.

## BK-003 (P0): Deferred Mount Strategy

Objective:
Reduce initial route payload and initial DOM/KaTeX work.

Deliverables:

1. Convert chapter loading in `+page.svelte` from eager imports to staged/lazy imports.
2. Gate deep-lane blocks with actual conditional mount logic.
3. Lazy-mount heavy demo wrappers near viewport while preserving existing demos.

Primary files:

1. `src/routes/+page.svelte`
2. `src/routes/+layout.svelte` (if global observer/store needed)
3. `src/lib/chapters/*.svelte` (incremental adoption)
4. `src/lib/components/Katex.svelte` (optional caching strategy)

Acceptance criteria:

1. Build no longer emits current largest-chunk profile.
2. First render no longer mounts all chapters and all deep details.
3. Demo behavior is unchanged when demo is mounted.

## BK-004 (P0): Claim Discipline Pass

Objective:
Remove overclaims and enforce assumption-scoped language.

Deliverables:

1. Rewrite hero claims in `+page.svelte`.
2. Rewrite theorem summary claims in each chapter header/summary.
3. Add "Assumptions in force" note where claims are foundation-sensitive.

Primary files:

1. `src/routes/+page.svelte`
2. `src/lib/chapters/Ch01SmoothWorld.svelte`
3. `src/lib/chapters/Ch02SlopeEquation.svelte`
4. `src/lib/chapters/Ch03RulesOfChange.svelte`
5. `src/lib/chapters/Ch07InfiniteSeries.svelte`
6. `src/lib/chapters/Ch09ManyDimensions.svelte`
7. `src/lib/chapters/Ch10LanguageOfForms.svelte`

Acceptance criteria:

1. No absolute/universal claims without assumptions.
2. Language remains beginner-readable.
3. Cross-check points are added where model/foundation scope matters.

## BK-005 (P0): Demo Non-Regression Harness

Objective:
Guarantee preserved functionality and visual integrity of current demos/figures.

Deliverables:

1. Manual regression checklist (see Section 8).
2. Optional lightweight smoke script for route load + console check.
3. Sign-off record after every phase touching layout/chapters.

Primary files:

1. `IMPLEMENTATION_BACKLOG.md` (Section 8 updates)
2. `src/routes/+page.svelte` (if hooks for smoke checks are needed)

Acceptance criteria:

1. Each listed demo and figure passes all checks in Section 8.
2. No new console errors introduced.

## BK-006 (P1): Wormhole Navigation

Objective:
Allow readers to dive into details and return exactly to origin context.

Deliverables:

1. `WormholeLink` pattern for jump + return.
2. Hash/history-safe return anchors.
3. Back-button behavior consistent with native reading flow.

Primary files:

1. `src/lib/utils/scroll.ts` (or new utility module)
2. `src/lib/components/ChapterNav.svelte`
3. `src/lib/chapters/*.svelte` (anchor insertion where needed)

Acceptance criteria:

1. Jump-return works across chapters and depth drawers.
2. Back/forward navigation remains intuitive.

## BK-007 (P1): Dependency Maps

Objective:
Expose concept dependencies without flooding the main narrative.

Deliverables:

1. Lightweight map component in each chapter.
2. Clickable nodes to canonical theorem/definition locations.
3. Return path from dependency destination.

Primary files:

1. `src/lib/components/DependencyMap.svelte` (new)
2. `src/lib/chapters/*.svelte`

Acceptance criteria:

1. Dependency maps are optional and unobtrusive.
2. Node links resolve correctly and return anchors work.

## BK-008 (P1): Chapter Compression Pass

Objective:
Make first-pass reading shorter while preserving advanced depth.

Deliverables:

1. Cap chapters to target core section count.
2. Move secondary derivations to deep-lane drawers.
3. Reduce mainline exercise count and classify extras as extension.

Primary files:

1. `src/lib/chapters/*.svelte`
2. `CHAPTER_SPECS.md` (if cap details are refined)
3. `MIGRATION_MATRIX.md` (if mapping updates are required)

Acceptance criteria:

1. Mainline page length and initial cognitive load are reduced.
2. Deep content remains accessible via controlled reveals.

## BK-009 (P1): Bridge-Failure Scope Notes

Objective:
Teach where the infinitesimal-to-classical bridge has limits without breaking momentum.

Deliverables:

1. Failure-mode notes for convergence and radius in Chapter 7.
2. Failure-mode notes for non-smooth physical regimes in Chapter 8.
3. Scope note for global/topological constraints in Chapter 10.

Primary files:

1. `src/lib/chapters/Ch07InfiniteSeries.svelte`
2. `src/lib/chapters/Ch08Physics.svelte`
3. `src/lib/chapters/Ch10LanguageOfForms.svelte`

Acceptance criteria:

1. Readers see both power and limits.
2. Claims remain accurate without jargon overload.

## BK-010 (P2): Disclosure Motion and Styling Refinement

Objective:
Make depth transitions feel intentional and "book-like".

Deliverables:

1. Consistent spacing, typography, and reveal rhythm for all new primitives.
2. Minimal motion with reduced-motion support.

Primary files:

1. `src/routes/layout.css`
2. New disclosure component files

Acceptance criteria:

1. No visual jitter.
2. No distracting animation loops.

## BK-011 (P2): Print and Reduced-Motion Pass

Objective:
Ensure output remains robust under print and accessibility settings.

Deliverables:

1. Print-friendly disclosure rendering defaults.
2. Reduced-motion-safe interaction fallbacks.

Primary files:

1. `src/routes/layout.css`
2. New disclosure components

Acceptance criteria:

1. Print output remains coherent.
2. Reduced-motion mode avoids transition-heavy behavior.

## BK-012 (P2): Final Editorial Consistency Sweep

Objective:
Unify voice, notation, and claim precision across all chapters.

Deliverables:

1. Consistent terminology and notation.
2. Consistent theorem, warning, and assumption box grammar.
3. Final pass for beginner readability.

Primary files:

1. `src/routes/+page.svelte`
2. `src/lib/chapters/*.svelte`

Acceptance criteria:

1. No contradictory terminology or notation.
2. Surface layer is concise and accurate everywhere.

## 6. File-Touch Map by Workstream

### 6.1 Route shell and global behavior

1. `src/routes/+page.svelte`
2. `src/routes/+layout.svelte`
3. `src/routes/layout.css`
4. `src/lib/utils/scroll.ts`

### 6.2 Chapter content (all chapters touched over project)

1. `src/lib/chapters/Ch01SmoothWorld.svelte`
2. `src/lib/chapters/Ch02SlopeEquation.svelte`
3. `src/lib/chapters/Ch03RulesOfChange.svelte`
4. `src/lib/chapters/Ch04Optimization.svelte`
5. `src/lib/chapters/Ch05WorldOfAreas.svelte`
6. `src/lib/chapters/Ch06ApplicationsIntegration.svelte`
7. `src/lib/chapters/Ch07InfiniteSeries.svelte`
8. `src/lib/chapters/Ch08Physics.svelte`
9. `src/lib/chapters/Ch09ManyDimensions.svelte`
10. `src/lib/chapters/Ch10LanguageOfForms.svelte`

### 6.3 Components likely to be added

1. `src/lib/components/RevealBox.svelte`
2. `src/lib/components/ProofDrawer.svelte`
3. `src/lib/components/TranslationBox.svelte`
4. `src/lib/components/ModelScopeBox.svelte`
5. `src/lib/components/FailureModeBox.svelte`
6. `src/lib/components/DependencyMap.svelte`

### 6.4 Components to preserve (no functional rewrite by default)

1. `src/lib/components/demos/*.svelte`
2. `src/lib/components/figures/*.svelte`
3. `src/lib/components/JSXGraphBoard.svelte`

## 7. Execution Sequence and Gates

## Phase A: P0 foundation (BK-001..BK-005)

Exit gate:

1. Benchmarks and non-regression harness exist.
2. Core disclosure primitives exist.
3. Deferred mount is live for at least one chapter slice.
4. Claim discipline completed for hero + first three chapters.

## Phase B: P1 depth network (BK-006..BK-009)

Exit gate:

1. Wormhole + dependency map active in pilot chapters.
2. Compression pass complete for pilot chapters.
3. Bridge-failure notes implemented and reviewed.

## Phase C: P2 polish and final sweep (BK-010..BK-012)

Exit gate:

1. Motion, accessibility, and print quality validated.
2. Editorial consistency sweep complete across all chapters.
3. Final non-regression sign-off complete.

## 8. Non-Regression Checklist (Interactive + Figure Assets)

Run this checklist after any change to:

1. `src/routes/+page.svelte`
2. `src/routes/layout.css`
3. Any chapter file
4. Any shared component used by chapters

Common checks for every asset:

1. Renders without console errors.
2. Controls update state and view.
3. Mobile viewport remains usable.
4. No clipping/overlap from layout changes.
5. No hydration mismatch warnings.

### 8.1 Demo checks

1. `PerfectZoom` (`Ch01`)
   - Curve switch works
   - Zoom behavior converges visually
   - Point slider/tangent toggle work
2. `FunctionMachine` (`Ch01`)
   - Input/output transitions animate
   - All function modes render correctly
3. `InfinitesimalTrig` (`Ch02`)
   - Both canvases render
   - Angle controls update both views
4. `AlgebraMachine` (`Ch02`)
   - Function selection works
   - Step reveals remain correct
5. `RuleProver` (`Ch03`)
   - Tab switching works
   - Equation sequence renders fully
6. `InfinitesimalStrip` (`Ch05`)
   - Partition controls update strips
   - Visual accumulation remains stable
7. `GradientJacobianExplorer` (`Ch09`)
   - Parameter controls update map
   - Jacobian cues remain legible
8. `SurfaceTangent3D` (`Ch09`)
   - Canvas renders on load/resize
   - Gradient/normal vectors move correctly
9. `StokesVisualizer` (`Ch10`)
   - Grid-size and interior toggle work
   - Metrics update with controls

### 8.2 JSXGraph checks

1. Chapter 4 JSXGraph scenes load and resize correctly
2. Chapter 5 JSXGraph scenes load and resize correctly
3. Chapter 6 JSXGraph scenes load and resize correctly
4. Chapter 8 JSXGraph scenes load and resize correctly
5. Chapter 9 JSXGraph scene load and resize correctly

### 8.3 Figure checks

1. `MicrostraightnessBridge` (`Ch01`) displays fully and text labels are readable
2. `AngleAdditionLemma` (`Ch02`) geometry and labels remain aligned

## 9. Verification Commands

Required on each major phase completion:

1. `npm run check`
2. `npm run build`
3. `npm run preview` and manual walkthrough of Section 8

Recommended before merge:

1. Repeat build and compare chunk outputs against baseline in Section 3.2
2. Spot-check mobile breakpoints and reduced-motion behavior

## 10. Open Decisions to Resolve During Execution

1. Exact chapter delivery strategy:
   - keep one long page with deferred mounts
   - or split chapters into routes while preserving book flow with chapter nav
2. KaTeX optimization depth:
   - shallow caching only
   - or deeper chunk/lane-specific math rendering strategy
3. Dependency map density:
   - minimal nodes per chapter
   - or richer graph with category filters

Default selection if no further decision is made:

1. Keep one route for now, implement deferred mounts first.
2. Implement shallow KaTeX caching and deep-lane deferral.
3. Start with minimal dependency maps (5-8 nodes/chapter).

## 11. Done Definition (Project-Level)

The project is complete when all are true:

1. Surface narrative is shorter and more accurate than baseline.
2. Deep technical material is discoverable on demand without bloating first render.
3. Existing demos and figures pass Section 8 with no regressions.
4. Initial route performance materially improves versus Section 3 baseline.
5. The experience still reads as a coherent book, not an app dashboard.
