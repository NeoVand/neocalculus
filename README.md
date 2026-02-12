# Neocalculus

Neocalculus is a SvelteKit-based interactive calculus book built around an infinitesimal-first teaching approach.

## Development

1. Install dependencies:
   - `npm install`
2. Run dev server:
   - `npm run dev`
3. Build production output:
   - `npm run build`
4. Preview production output:
   - `npm run preview`
5. Sync JSXGraph static assets manually (optional; already called by `dev`/`build`):
   - `npm run assets:jsxgraph`

## Quality and Baseline Tooling

1. Type/lint checks:
   - `npm run check`
   - `npm run lint`
2. Baseline metrics from existing build artifacts:
   - `npm run metrics:baseline`
3. Build and then collect baseline metrics:
   - `npm run metrics:baseline:build`

## Project Planning Docs

1. Master strategy: `/Users/neo/repos/neocalculus/MASTER_PLAN.md`
2. Execution backlog: `/Users/neo/repos/neocalculus/IMPLEMENTATION_BACKLOG.md`
3. Baseline snapshot: `/Users/neo/repos/neocalculus/BASELINE_REPORT.md`
4. QA regression harness: `/Users/neo/repos/neocalculus/QA_REGRESSION_CHECKLIST.md`
