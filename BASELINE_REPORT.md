# Baseline Report

Status: Active baseline snapshot  
Captured on: 2026-02-12  
Scope: `BK-001` performance/content instrumentation baseline

## Summary

1. Chapter files: `10`
2. Total chapter lines: `14,650`
3. Total `<Katex>` usages: `3,259`
4. Total `<Callout>` usages: `57`
5. Total `<DigDeeper>` usages: `14`
6. Total `<Exercise>` usages: `164`

## Build Snapshot (current branch)

From recent production build:

1. Large client chunk observed: `_app/immutable/nodes/2.*.js` ~ `1,011.61 kB` minified
2. Large client chunk observed: `_app/immutable/chunks/BSQ_gVBC.js` ~ `934.57 kB` minified
3. Build warning about chunks over `500 kB` present

## Repro Commands

1. Capture metrics from existing build artifacts:
   - `npm run metrics:baseline`
2. Build and then capture metrics:
   - `npm run metrics:baseline:build`
3. Full validation:
   - `npm run check`
   - `npm run build`

## Phase Gates (BK-001)

1. Baseline must be recorded before each major implementation phase.
2. Any phase that touches route composition or chapter mounting must include:
   - fresh `npm run metrics:baseline`
   - manual demo regression sign-off in `/Users/neo/repos/neocalculus/QA_REGRESSION_CHECKLIST.md`
3. A phase fails if:
   - interactive demo regression appears
   - new runtime console errors appear during chapter walkthrough
