# QA Regression Checklist

Status: Active QA harness  
Owner: Content + Product Engineering  
Scope: `BK-005` non-regression and phase sign-off

Use this checklist after any change to:

1. `src/routes/+page.svelte`
2. `src/routes/layout.css`
3. `src/lib/components/*` shared content components
4. any `src/lib/chapters/*.svelte` file

## Global Checks

- [ ] No new console errors on initial load.
- [ ] No hydration mismatch warnings.
- [ ] Chapter navigation still tracks active chapter correctly.
- [ ] Mobile chapter drawer opens/closes and chapter jumps still work.
- [ ] Progress bar still updates while scrolling.

## Interactive Demo Checks

### 1) PerfectZoom (`Ch01`)

- [ ] Renders without console errors.
- [ ] Curve selector changes graph correctly.
- [ ] Zoom slider and point slider update view.
- [ ] Tangent toggle works.

### 2) FunctionMachine (`Ch01`)

- [ ] Renders and animates output transitions.
- [ ] Function modes produce expected qualitative behavior.

### 3) InfinitesimalTrig (`Ch02`)

- [ ] Both canvases render.
- [ ] Controls update both sine/cosine visual states.

### 4) AlgebraMachine (`Ch02`)

- [ ] Function selection updates derivation steps.
- [ ] Step sequence is visually intact and complete.

### 5) RuleProver (`Ch03`)

- [ ] Tab switching works.
- [ ] Equation and note steps render in the right order.

### 6) InfinitesimalStrip (`Ch05`)

- [ ] Strip partition controls update figure.
- [ ] Summation visuals remain stable.

### 7) GradientJacobianExplorer (`Ch09`)

- [ ] Control changes update mapping visualization.
- [ ] Labels/legend remain legible.

### 8) SurfaceTangent3D (`Ch09`)

- [ ] Canvas renders on load and resize.
- [ ] Gradient and normal arrows update when sliders move.

### 9) StokesVisualizer (`Ch10`)

- [ ] Grid size slider updates tiling.
- [ ] Interior toggle updates edge-pair display.
- [ ] Boundary/interior metrics update correctly.

## Figure Checks

### 1) MicrostraightnessBridge (`Ch01`)

- [ ] Renders without overlap or clipping.
- [ ] Labels remain readable on mobile and desktop.

### 2) AngleAdditionLemma (`Ch02`)

- [ ] Geometry and labels remain aligned.
- [ ] No text clipping at narrow widths.

## JSXGraph Checks

- [ ] Chapter 4 JSXGraph examples render and resize.
- [ ] Chapter 5 JSXGraph examples render and resize.
- [ ] Chapter 6 JSXGraph examples render and resize.
- [ ] Chapter 8 JSXGraph examples render and resize.
- [ ] Chapter 9 JSXGraph example renders and resizes.

## Phase Sign-Off Log

| Date       | Phase        | Scope Summary                                 | QA Owner | Result | Notes                                                                    |
| ---------- | ------------ | --------------------------------------------- | -------- | ------ | ------------------------------------------------------------------------ |
| 2026-02-12 | BK-005 setup | Initial checklist created                     | Codex    | pass   | Checklist established and ready for use                                  |
| 2026-02-12 | BK-001 setup | Baseline scripts and metrics commands wired   | Codex    | pass   | `npm run metrics:baseline` and `npm run metrics:baseline:build` verified |
| 2026-02-12 | BK-002 setup | New depth-lane component primitives validated | Codex    | pass   | `npm run check` clean after adding new components                        |
| 2026-02-12 | BK-002 pilot | Pilot integration in Ch01 and Ch03            | Codex    | pass   | Build and typecheck clean; manual demo walkthrough still pending         |
| 2026-02-12 | BK-004 pass  | Claim-discipline language updates across core chapters and hero | Codex | pass | `npm run check` and `npm run build` clean after copy pass |
| 2026-02-12 | BK-003 phase 1 | Deferred chapter loading via `LazyChapter` + dynamic imports in `+page` | Codex | pass | Build clean; initial route chunk profile improved; preview smoke confirmed chapter shell -> load flow and zero console errors |
| 2026-02-12 | BK-003 phase 2 | JSXGraph bundle externalized to runtime-loaded static vendor asset with fallback loader | Codex | pass | `npm run check` + `npm run build` clean; no client manifest `jsxgraph` chunk; preview smoke confirmed `jxgbox` SVG render and zero console errors |
| 2026-02-12 | BK-006 pilot | Wormhole jump-and-return flow added to chapter dependencies (`Ch07`, `Ch10`) | Codex | pass | Build/typecheck clean; preview smoke confirmed wormhole jump to `#ch2`, return chip visibility, and return-to-origin scroll with zero console errors |
