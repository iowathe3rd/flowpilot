'use client';

import { useSyncExternalStore } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { StepConfig } from '@flowpilot/core';

/**
 * Hook to get current step
 */
export function useCurrentStep(): StepConfig | null {
  const engine = useFlowPilotEngine();

  return useSyncExternalStore(
    (callback) => {
      const unsubscribers = [
        engine.on('step:enter', callback),
        engine.on('step:leave', callback),
      ];
      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    },
    () => engine.getCurrentStep(),
    () => null // SSR snapshot
  );
}
