# FlowPilot

> Headless TypeScript library for product tours, onboarding flows, and guided walkthroughs in React/Next.js applications.

FlowPilot separates **flow orchestration** from **UI rendering**.  
You build your own tooltip, overlay, and styles — FlowPilot handles state, navigation, lifecycle, guards, events, and targets.

## What is FlowPilot

FlowPilot is a layered system with:

- a framework-agnostic engine (`@flowpilot/core`)
- React bindings (`@flowpilot/react`)
- a demo app and docs app inside this monorepo

It is designed for teams that need custom onboarding UX without being locked into prebuilt UI components.

## Key Features

### Headless architecture

- no opinionated UI components
- engine and hooks expose state + actions + events
- your application controls all rendering

### Strong flow orchestration

- declarative flow/step config
- controls: `start`, `stop`, `pause`, `resume`, `next`, `prev`, `goTo`, `skip`, `reset`
- deterministic state machine for flow and step lifecycles

### Guards and lifecycle hooks

- per-step guard (`when`) to include/exclude steps dynamically
- lifecycle hooks:
  - flow level: `onStart`, `onComplete`, `onSkip`, `onError`
  - step level: `beforeEnter`, `afterEnter`, `beforeLeave`

### Typed events

- `flow:start`, `flow:pause`, `flow:resume`, `flow:complete`, `flow:skip`, `flow:error`
- `step:enter`, `step:leave`, `step:ready`, `step:target-missing`, `step:complete`
- strongly typed payloads for analytics and custom behavior

### Target resolution and geometry

- supports selector / element / ref / function target specs
- target visibility and viewport checks
- target rect for tooltip/overlay positioning

### React integration

- `FlowPilotProvider`
- hooks:
  - `useFlowPilot`
  - `useFlow`
  - `useCurrentStep`
  - `useFlowControls`
  - `useFlowEvents`
  - `useTarget`

### Controlled mode support

`FlowPilotProvider` supports controlled orchestration via:

- `activeFlowId`
- `activeStepId`
- `onStateChange`

### SSR-safe usage

- core architecture is React-agnostic
- React package is compatible with client-component usage in Next.js app router

## Monorepo Packages

- **[@flowpilot/core](./packages/core)** — framework-agnostic orchestration engine
- **[@flowpilot/react](./packages/react)** — React provider and hooks
- **[apps/demo](./apps/demo)** — full showcase app (uncontrolled + controlled mode)
- **[apps/docs](./apps/docs)** — Next.js documentation app

## Quick Start

```tsx
import { FlowPilotProvider, useFlowPilot, useFlow } from '@flowpilot/react';
import { useEffect } from 'react';

function Onboarding() {
  const { registerFlow, start, next } = useFlowPilot();
  const state = useFlow();

  useEffect(() => {
    registerFlow({
      id: 'onboarding',
      steps: [{ id: 'welcome' }, { id: 'features' }, { id: 'done' }],
    });
    void start('onboarding');
  }, [registerFlow, start]);

  return (
    <div>
      <p>Status: {state.status}</p>
      <p>Current step: {state.currentStepId}</p>
      <button onClick={() => void next()}>Next</button>
    </div>
  );
}

export default function App() {
  return (
    <FlowPilotProvider>
      <Onboarding />
    </FlowPilotProvider>
  );
}
```

## Architecture (high-level)

1. **Engine layer (`@flowpilot/core`)**
   - state machine
   - flow registry
   - step navigator
   - event emitter
   - hooks/guards execution

2. **Target layer (`@flowpilot/core/target`)**
   - target resolving
   - visibility/viewport/rect utilities

3. **React layer (`@flowpilot/react`)**
   - provider lifecycle
   - subscriptions via hooks
   - controlled mode adapter

4. **Consumer UI layer (your app)**
   - tooltip/overlay/components
   - visual design and interaction model

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
pnpm install
```

### Common Commands

```bash
# all workspaces
pnpm run build
pnpm run test
pnpm run lint
pnpm run type-check

# package-level examples
pnpm --filter @flowpilot/core run test
pnpm --filter @flowpilot/react run test

# demo
pnpm --filter demo dev
pnpm --filter demo build
pnpm --filter demo test:e2e

# docs
pnpm --filter docs dev
pnpm --filter docs build
```

### Validation / Release prep

```bash
# package type + bundle checks
pnpm run validate:packages

# changesets publish workflow
pnpm changeset
pnpm version
pnpm release
```

## Testing

- Unit/integration: Vitest (`core`, `react`)
- E2E: Playwright (`apps/demo/e2e`)

Examples:

```bash
pnpm --filter @flowpilot/core exec vitest run src/__tests__/integration.test.ts
pnpm --filter @flowpilot/react exec vitest run src/__tests__/react-integration.test.tsx
pnpm --filter demo exec playwright test e2e/demo-tour.spec.ts
```

## Current Project Status

✅ MVP implemented:

- core engine
- React bindings
- controlled mode
- target system
- demo showcase
- docs app
- CI, validation, and release scaffolding

## License

MIT © Boris Beglerov
