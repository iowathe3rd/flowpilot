'use client';

import { useSyncExternalStore } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowControls } from '@flowpilot/core';

/**
 * Hook to get flow control flags
 */
export function useFlowControls(): FlowControls {
  const engine = useFlowPilotEngine();

  return useSyncExternalStore(
    (callback) => {
      const unsubscribers = [
        engine.on('flow:start', callback),
        engine.on('flow:pause', callback),
        engine.on('flow:resume', callback),
        engine.on('flow:complete', callback),
        engine.on('step:enter', callback),
      ];
      return () => {
        unsubscribers.forEach((unsub) => unsub());
      };
    },
    () => engine.getControls(),
    () => ({
      canNext: false,
      canPrev: false,
      isFirst: false,
      isLast: false,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    }) // SSR snapshot
  );
}
