# @flowpilot/react

> React bindings for FlowPilot

## Features

- ⚛️ **React 18+** - Built with modern React patterns
- 🪝 **Hooks API** - Clean, composable hooks
- 🔄 **useSyncExternalStore** - Efficient subscriptions
- 🌐 **SSR-Safe** - Works with Next.js App Router
- 📦 **Lightweight** - Minimal overhead

## Installation

```bash
npm install @flowpilot/react @flowpilot/core
# or
pnpm add @flowpilot/react @flowpilot/core
```

## Quick Start

```tsx
import { FlowPilotProvider, useFlowPilot, useFlow } from '@flowpilot/react';

// 1. Wrap your app
function App() {
  return (
    <FlowPilotProvider>
      <OnboardingFlow />
    </FlowPilotProvider>
  );
}

// 2. Use hooks in components
function OnboardingFlow() {
  const { registerFlow, start } = useFlowPilot();
  const state = useFlow();

  useEffect(() => {
    registerFlow({
      id: 'onboarding',
      steps: [{ id: 'welcome' }, { id: 'features' }, { id: 'complete' }],
    });
    start('onboarding');
  }, []);

  return <div>Current step: {state.currentStepId}</div>;
}
```

## Provider

### `<FlowPilotProvider />`

Props:

- `config?: FlowPilotConfig` - logger and engine config
- `flows?: FlowConfig[]` - pre-register flows
- `activeFlowId?: string | null` - controlled active flow
- `activeStepId?: string | null` - controlled active step
- `onStateChange?: (state) => void` - observe state transitions

## Hooks

### useFlowPilot()

Main hook providing access to engine methods.

### useFlow()

Subscribe to flow state changes.

### useCurrentStep()

Get current step configuration.

### useFlowControls()

Get control flags (canNext, canPrev, etc).

### useFlowEvents(eventType, listener)

Subscribe to specific events.

### useTarget(spec?)

Resolve and track target element geometry for custom overlays/tooltips.

## License

MIT
