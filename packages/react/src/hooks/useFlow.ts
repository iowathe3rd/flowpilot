'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowState } from '@flowpilot/core';

/**
 * Hook to subscribe to flow state
 */
export function useFlow(): FlowState {
  const engine = useFlowPilotEngine();
  const stateRef = useRef<FlowState>(engine.getState());

  const subscribe = useCallback(
    (callback: () => void) => {
      // Subscribe to all state-changing events
      const wrappedCallback = () => {
        stateRef.current = engine.getState();
        callback();
      };

      const unsubscribers = [
        engine.on('flow:start', wrappedCallback),
        engine.on('flow:pause', wrappedCallback),
        engine.on('flow:resume', wrappedCallback),
        engine.on('flow:complete', wrappedCallback),
        engine.on('flow:skip', wrappedCallback),
        engine.on('flow:error', wrappedCallback),
        engine.on('step:enter', wrappedCallback),
        engine.on('step:leave', wrappedCallback),
        engine.on('step:ready', wrappedCallback),
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
    return stateRef.current;
  }, []);

  const getServerSnapshot = useCallback(() => {
    return engine.getState();
  }, [engine]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
