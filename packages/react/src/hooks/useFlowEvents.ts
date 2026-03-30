'use client';

import { useEffect } from 'react';
import { useFlowPilotEngine } from '../provider/FlowPilotProvider';
import type { FlowPilotEvent, EventListener } from '@flowpilot/core';

/**
 * Hook to subscribe to flow events
 */
export function useFlowEvents<T extends FlowPilotEvent['type']>(
  eventType: T,
  listener: EventListener<Extract<FlowPilotEvent, { type: T }>>
): void {
  const engine = useFlowPilotEngine();

  useEffect(() => {
    const unsubscribe = engine.on(eventType, listener);
    return unsubscribe;
  }, [engine, eventType, listener]);
}
