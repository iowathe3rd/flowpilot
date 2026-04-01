'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import { resolveTarget } from '@flowpilot/core';
import type { ResolvedTarget, TargetSpec } from '@flowpilot/core';

/**
 * Hook to resolve and track target element
 */
export function useTarget(spec?: TargetSpec): ResolvedTarget | null {
  const engine = useFlowPilotEngine();
  const targetRef = useRef<ResolvedTarget | null>(null);

  const getCurrentSpec = useCallback((): TargetSpec | null => {
    if (spec !== undefined) return spec;
    return engine.getCurrentStep()?.target ?? null;
  }, [engine, spec]);

  if (targetRef.current === null) {
    const initialSpec = getCurrentSpec();
    targetRef.current = initialSpec ? resolveTarget(initialSpec) : null;
  }

  const subscribe = useCallback(
    (callback: () => void) => {
      // Subscribe to step changes
      const wrappedCallback = () => {
        const currentSpec = getCurrentSpec();
        targetRef.current = currentSpec ? resolveTarget(currentSpec) : null;
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
    [engine, getCurrentSpec]
  );

  const getSnapshot = useCallback(() => targetRef.current, []);
  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
