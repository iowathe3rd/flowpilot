'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowControls } from '@flowpilot/core';

/**
 * Hook to get flow control flags
 */
export function useFlowControls(): FlowControls {
  const engine = useFlowPilotEngine();
  const controlsRef = useRef<FlowControls>(engine.getControls());

  const subscribe = useCallback(
    (callback: () => void) => {
      const wrappedCallback = () => {
        controlsRef.current = engine.getControls();
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

  const getSnapshot = useCallback(() => controlsRef.current, []);

  const getServerSnapshot = useCallback(
    () => ({
      canNext: false,
      canPrev: false,
      isFirst: false,
      isLast: false,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
    }),
    []
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
