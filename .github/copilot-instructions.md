# Copilot Instructions for FlowPilot

## Build, test, lint commands

Use `pnpm` at repository root.

### Workspace-level

- `pnpm install`
- `pnpm run build` — Turbo build for all workspaces
- `pnpm run test` — Turbo test for all workspaces
- `pnpm run lint` — Turbo lint
- `pnpm run type-check` — Turbo type checks
- `pnpm run test:e2e` — Turbo e2e tasks
- `pnpm run validate:packages` — type validation + bundle size checks

### Package/app-level

- Core build/test:
  - `pnpm --filter @flowpilot/core run build`
  - `pnpm --filter @flowpilot/core run test`
- React build/test:
  - `pnpm --filter @flowpilot/react run build`
  - `pnpm --filter @flowpilot/react run test`
- Demo app:
  - `pnpm --filter demo dev`
  - `pnpm --filter demo build`
  - `pnpm --filter demo test:e2e`
- Docs app:
  - `pnpm --filter docs dev`
  - `pnpm --filter docs build`

### Single test runs

- Single Vitest file (core):  
  `pnpm --filter @flowpilot/core exec vitest run src/__tests__/flow-pilot.test.ts`
- Single Vitest file (react):  
  `pnpm --filter @flowpilot/react exec vitest run src/__tests__/react-integration.test.tsx`
- Single Playwright spec (demo):  
  `pnpm --filter demo exec playwright test e2e/demo-tour.spec.ts`
- Single Playwright test by title:  
  `pnpm --filter demo exec playwright test -g "can skip the tour"`

## High-level architecture

- Monorepo (`pnpm` + `turbo`) with primary packages:
  - `@flowpilot/core`: framework-agnostic orchestration engine
  - `@flowpilot/react`: React bindings over core engine
  - `apps/demo`: Vite demo (showcase + e2e target)
  - `apps/docs`: Next.js docs app

- Core engine (`packages/core/src/engine`):
  - `FlowPilot` orchestrates registry + navigator + state machine + event emitter.
  - `FlowStateMachine` is authoritative for flow and step transitions.
  - `FlowRegistry` stores flow configs and validates uniqueness.
  - `StepNavigator` handles next/prev/goTo and branch `next` links.
  - Guards/hooks run around step transitions (`when`, `beforeEnter`, `afterEnter`, etc).
  - Event bus emits `flow:*` and `step:*` events consumed by React hooks.

- Target layer (`packages/core/src/target`):
  - Resolves selector/ref/function/element targets.
  - Exposes geometry/visibility helpers used by UI overlays.

- React layer (`packages/react/src`):
  - `FlowPilotProvider` owns a single engine instance, supports uncontrolled and controlled mode (`activeFlowId`, `activeStepId`, `onStateChange`).
  - Hooks (`useFlow`, `useCurrentStep`, `useFlowControls`, `useTarget`, `useFlowEvents`, `useFlowPilot`) wrap engine state/actions.

## Key conventions in this repository

- **Headless-first**: do not add UI components to `@flowpilot/core` or `@flowpilot/react`; rendering belongs to consumer apps (`apps/demo`, downstream apps).

- **Engine as source of truth**: all flow/step transitions should go through `FlowPilot` + `FlowStateMachine`; avoid bypassing transition rules.

- **Event-driven React updates**: React hooks subscribe to engine events and maintain stable snapshots with refs; preserve this pattern when updating hooks.

- **SSR/client boundaries**:
  - React provider/hooks use `'use client'`.
  - Core remains framework-agnostic and avoids hard coupling to React.

- **Flow registration strategy**:
  - Flows are registered once and keyed by unique `id`.
  - In React components, avoid repeated registration on re-render/mount loops.

- **Controlled mode contract**:
  - `activeFlowId`/`activeStepId` are provider-level controls.
  - If using controlled mode, ensure targeted flow IDs are present in `flows`.

- **Release/quality gates**:
  - CI runs lint, type-check, test, build, and `validate:packages`.
  - Bundle guardrails are encoded in root scripts (`size:core`, `size:react`).
