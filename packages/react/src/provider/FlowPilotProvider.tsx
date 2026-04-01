'use client';

import { createContext, useContext, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { FlowPilot } from '@flowpilot/core';
import type { FlowPilotConfig, FlowConfig, FlowState } from '@flowpilot/core';

export interface FlowPilotProviderProps {
  children: ReactNode;
  config?: FlowPilotConfig;
  flows?: FlowConfig[];
  activeFlowId?: string | null;
  activeStepId?: string | null;
  onStateChange?: (state: Readonly<FlowState>) => void;
}

const FlowPilotContext = createContext<FlowPilot | null>(null);

/**
 * Provider component for FlowPilot
 */
export function FlowPilotProvider({
  children,
  config,
  flows,
  activeFlowId,
  activeStepId,
  onStateChange,
}: FlowPilotProviderProps) {
  const engineRef = useRef<FlowPilot | null>(null);

  // Initialize engine once
  if (engineRef.current === null) {
    engineRef.current = new FlowPilot(config);
    if (flows?.length) {
      for (const flow of flows) {
        engineRef.current.registerFlow(flow);
      }
    }
  }

  // Controlled mode: sync external active flow/step into engine.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || activeFlowId === undefined) return;

    if (activeFlowId === null) {
      engine.reset();
      return;
    }

    if (
      engine.getState().flowId !== activeFlowId &&
      Array.isArray(flows) &&
      !flows.some((flow) => flow.id === activeFlowId)
    ) {
      throw new Error(
        `Controlled flow "${activeFlowId}" must be provided in FlowPilotProvider flows`
      );
    }

    const sync = async () => {
      const state = engine.getState();
      if (state.flowId !== activeFlowId) {
        await engine.start(activeFlowId);
      }

      if (activeStepId && engine.getState().currentStepId !== activeStepId) {
        await engine.goTo(activeStepId);
      }
    };

    void sync();
  }, [activeFlowId, activeStepId, flows]);

  // External observer for controlled/uncontrolled integrations.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !onStateChange) return;

    const emit = () => onStateChange(engine.getState());
    emit();

    const unsubscribers = [
      engine.on('flow:start', emit),
      engine.on('flow:pause', emit),
      engine.on('flow:resume', emit),
      engine.on('flow:complete', emit),
      engine.on('flow:skip', emit),
      engine.on('flow:error', emit),
      engine.on('step:enter', emit),
      engine.on('step:leave', emit),
      engine.on('step:ready', emit),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [onStateChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.reset();
      }
    };
  }, []);

  return (
    <FlowPilotContext.Provider value={engineRef.current}>
      {children}
    </FlowPilotContext.Provider>
  );
}

/**
 * Hook to access FlowPilot engine instance
 */
export function useFlowPilotEngine(): FlowPilot {
  const engine = useContext(FlowPilotContext);
  if (!engine) {
    throw new Error('useFlowPilot must be used within FlowPilotProvider');
  }
  return engine;
}
