'use client';

import { useSyncExternalStore, useMemo } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import { resolveTarget } from '@flowpilot/core';
import type { ResolvedTarget, TargetSpec } from '@flowpilot/core';

/**
 * Hook to resolve and track target element
 */
export function useTarget(spec?: TargetSpec): ResolvedTarget | null {
  const engine = useFlowPilotEngine();

  // Get current step's target if no spec provided
  const targetSpec = useMemo(() => {
    if (spec !== undefined) {
      return spec;
    }
    const step = engine.getCurrentStep();
    return step?.target ?? null;
  }, [spec, engine]);

  return useSyncExternalStore(
    (callback) => {
      // Subscribe to step changes
      const unsubscribers = [
        engine.on('step:enter', callback),
        engine.on('step:ready', callback),
      ];

      // Setup periodic updates for target changes (resize, position, etc)
      const interval = setInterval(callback, 100);

      return () => {
        unsubscribers.forEach((unsub) => unsub());
        clearInterval(interval);
      };
    },
    () => (targetSpec ? resolveTarget(targetSpec) : null),
    () => null // SSR snapshot
  );
}
