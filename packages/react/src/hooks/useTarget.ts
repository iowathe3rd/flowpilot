'use client';

import { useSyncExternalStore, useMemo, useRef, useCallback } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import { resolveTarget } from '@flowpilot/core';
import type { ResolvedTarget, TargetSpec } from '@flowpilot/core';

/**
 * Hook to resolve and track target element
 */
export function useTarget(spec?: TargetSpec): ResolvedTarget | null {
  const engine = useFlowPilotEngine();
  const targetRef = useRef<ResolvedTarget | null>(null);

  // Get current step's target if no spec provided
  const targetSpec = useMemo(() => {
    if (spec !== undefined) {
      return spec;
    }
    const step = engine.getCurrentStep();
    return step?.target ?? null;
  }, [spec, engine]);

  if (targetRef.current === null && targetSpec) {
    targetRef.current = resolveTarget(targetSpec);
  }

  const subscribe = useCallback(
    (callback: () => void) => {
      // Subscribe to step changes
      const wrappedCallback = () => {
        targetRef.current = targetSpec ? resolveTarget(targetSpec) : null;
        callback();
      };
      const unsubscribers = [
        engine.on('step:enter', wrappedCallback),
        engine.on('step:ready', wrappedCallback),
      ];

      // Setup periodic updates for target changes (resize, position, etc)
      const interval = setInterval(wrappedCallback, 100);

      return () => {
        unsubscribers.forEach((unsub) => unsub());
        clearInterval(interval);
      };
    },
    [engine, targetSpec]
  );

  const getSnapshot = useCallback(() => targetRef.current, []);
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
