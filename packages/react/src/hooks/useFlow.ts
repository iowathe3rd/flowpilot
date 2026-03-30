'use client';

import { useSyncExternalStore } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowState } from '@flowpilot/core';

/**
 * Hook to subscribe to flow state
 */
export function useFlow(): FlowState {
  const engine = useFlowPilotEngine();

  return useSyncExternalStore(
    (callback) => {
      // Subscribe to all state-changing events
      const unsubscribers = [
        engine.on('flow:start', callback),
        engine.on('flow:pause', callback),
        engine.on('flow:resume', callback),
        engine.on('flow:complete', callback),
        engine.on('flow:skip', callback),
        engine.on('flow:error', callback),
        engine.on('step:enter', callback),
        engine.on('step:leave', callback),
        engine.on('step:ready', callback),
      ];

      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    },
    () => engine.getState(),
    () => engine.getState() // SSR snapshot
  );
}
