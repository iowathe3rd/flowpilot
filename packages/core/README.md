# @flowpilot/core

> Framework-agnostic orchestration engine for product tours and onboarding flows

## Features

- 🎯 **Framework-agnostic** - Works in any JavaScript environment
- 🔄 **State Machine** - Deterministic flow and step state transitions
- 📡 **Event System** - Type-safe lifecycle events
- 🪝 **Lifecycle Hooks** - Before/after hooks for flows and steps
- 🛡️ **Type-Safe** - Full TypeScript support with excellent DX
- 🪶 **Lightweight** - Minimal bundle size, zero dependencies

## Installation

```bash
npm install @flowpilot/core
# or
pnpm add @flowpilot/core
```

## Quick Start

```typescript
import { FlowPilot } from '@flowpilot/core';

// Create engine instance
const engine = new FlowPilot();

// Register a flow
engine.registerFlow({
  id: 'onboarding',
  steps: [
    { id: 'welcome', meta: { title: 'Welcome!' } },
    { id: 'features', meta: { title: 'Key Features' } },
    { id: 'complete', meta: { title: 'All Set!' } },
  ],
});

// Start the flow
await engine.start('onboarding');

// Navigate
await engine.next();
await engine.prev();

// Subscribe to events
engine.on('step:enter', (event) => {
  console.log('Entered step:', event.payload.stepId);
});
```

## API

### FlowPilot

Main orchestration engine.

**Methods:**
- `registerFlow(config)` - Register a flow
- `start(flowId)` - Start a flow
- `next()` - Move to next step
- `prev()` - Move to previous step
- `goTo(stepId)` - Jump to specific step
- `pause()` - Pause current flow
- `resume()` - Resume paused flow
- `skip()` - Skip current flow
- `reset()` - Reset to idle state
- `getState()` - Get current state
- `getControls()` - Get control flags
- `getCurrentStep()` - Get current step
- `on(eventType, listener)` - Subscribe to events

## License

MIT
