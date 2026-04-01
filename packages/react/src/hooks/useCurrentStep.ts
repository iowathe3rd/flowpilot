'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { StepConfig } from '@flowpilot/core';

/**
 * Hook to get current step
 */
export function useCurrentStep(): StepConfig | null {
  const engine = useFlowPilotEngine();
  const stepRef = useRef<StepConfig | null>(engine.getCurrentStep());

  const subscribe = useCallback(
    (callback: () => void) => {
      const wrappedCallback = () => {
        stepRef.current = engine.getCurrentStep();
        callback();
      };

      const unsubscribers = [
        engine.on('step:enter', wrappedCallback),
        engine.on('step:leave', wrappedCallback),
      ];
      const interval = setInterval(wrappedCallback, 100);
      return () => {
        unsubscribers.forEach((unsub) => unsub());
        clearInterval(interval);
      };
    },
    [engine]
  );

  const getSnapshot = useCallback(() => {
    return stepRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return null;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
