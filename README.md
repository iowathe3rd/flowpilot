# FlowPilot

> A headless TypeScript library for building product tours, onboarding flows, and guided walkthroughs in React and Next.js

## Status

🚧 **Work in Progress** - MVP implementation in active development

## Overview

FlowPilot is a modern, headless orchestration engine that provides state management, events, DOM integration, and lifecycle hooks for building custom product tours—without imposing any UI constraints. You bring your own components, we handle the flow logic.

### Key Principles

- **Headless-first**: No opinionated UI components—you control the visual layer
- **TypeScript-native**: Comprehensive types with excellent developer experience  
- **SSR-safe**: First-class Next.js support with App Router compatibility
- **Lightweight**: Minimal bundle size, zero heavy dependencies
- **Framework-agnostic core**: React bindings provided, core engine works anywhere

## Packages

This monorepo contains:

- **[@flowpilot/core](./packages/core)** - Framework-agnostic orchestration engine
- **[@flowpilot/react](./packages/react)** - React hooks and provider  
- **[docs](./apps/docs)** - Documentation site (Next.js)
- **[demo](./apps/demo)** - Development sandbox

## Development

This project uses:

- **pnpm** - Fast, disk space efficient package manager
- **Turborepo** - High-performance build system
- **TypeScript** - Type safety and excellent DX
- **Vitest** - Fast unit testing
- **Playwright** - End-to-end browser tests
- **Changesets** - Version management and changelogs

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Start development
pnpm run dev
```

### Monorepo Commands

```bash
# Build all packages
pnpm run build

# Build specific package
pnpm run build --filter='@flowpilot/core'

# Run linting
pnpm run lint

# Type check
pnpm run type-check

# Format code
pnpm run format
```

## Architecture

FlowPilot follows a layered architecture:

1. **Engine Layer** - State machine, transitions, flow semantics
2. **Target Layer** - DOM resolution, observers, measurements
3. **React Binding Layer** - Provider, hooks, subscriptions
4. **Diagnostics Layer** - Logging, warnings, debug metadata

## Roadmap

### ✅ Phase 1: Foundation (In Progress)

- [x] Monorepo setup with Turborepo + pnpm
- [x] Core type system
- [ ] State machine implementation
- [ ] Event system
- [ ] Logger implementation

### Phase 2: Core Engine

- [ ] Flow registry
- [ ] Step navigation
- [ ] Guards and conditionals
- [ ] Target resolution system

### Phase 3: React Bindings

- [ ] FlowPilotProvider
- [ ] Core hooks (useFlow, useCurrentStep, useFlowControls)
- [ ] Target hooks
- [ ] Event hooks
- [ ] SSR safety

### Phase 4: Testing & Docs

- [ ] Unit tests for core engine
- [ ] React integration tests
- [ ] E2E browser tests
- [ ] Documentation site
- [ ] Examples and guides

### Phase 5: Polish

- [ ] Bundle optimization
- [ ] Type validation
- [ ] API review
- [ ] Publishing setup

## Contributing

This is currently in active MVP development. Contributions will be welcome once the initial release is stable.

## License

MIT © Boris Beglerov
