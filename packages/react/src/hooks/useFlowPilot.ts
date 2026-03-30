'use client';

import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowConfig } from '@flowpilot/core';

/**
 * Main hook for FlowPilot - provides access to engine and common operations
 */
export function useFlowPilot() {
  const engine = useFlowPilotEngine();

  return {
    engine,
    registerFlow: (config: FlowConfig) => engine.registerFlow(config),
    start: (flowId: string) => engine.start(flowId),
    stop: () => engine.stop(),
    pause: () => engine.pause(),
    resume: () => engine.resume(),
    next: () => engine.next(),
    prev: () => engine.prev(),
    goTo: (stepId: string) => engine.goTo(stepId),
    skip: () => engine.skip(),
    reset: () => engine.reset(),
  };
}
