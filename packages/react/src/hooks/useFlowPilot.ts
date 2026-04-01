'use client';

import { useCallback, useMemo } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowConfig } from '@flowpilot/core';

/**
 * Main hook for FlowPilot - provides access to engine and common operations
 */
export function useFlowPilot() {
  const engine = useFlowPilotEngine();

  const registerFlow = useCallback(
    (config: FlowConfig) => engine.registerFlow(config),
    [engine]
  );
  const start = useCallback((flowId: string) => engine.start(flowId), [engine]);
  const stop = useCallback(() => engine.stop(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const resume = useCallback(() => engine.resume(), [engine]);
  const next = useCallback(() => engine.next(), [engine]);
  const prev = useCallback(() => engine.prev(), [engine]);
  const goTo = useCallback((stepId: string) => engine.goTo(stepId), [engine]);
  const skip = useCallback(() => engine.skip(), [engine]);
  const reset = useCallback(() => engine.reset(), [engine]);

  return useMemo(
    () => ({
      engine,
      registerFlow,
      start,
      stop,
      pause,
      resume,
      next,
      prev,
      goTo,
      skip,
      reset,
    }),
    [
      engine,
      registerFlow,
      start,
      stop,
      pause,
      resume,
      next,
      prev,
      goTo,
      skip,
      reset,
    ]
  );
}
