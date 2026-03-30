'use client';

import { createContext, useContext, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { FlowPilot } from '@flowpilot/core';
import type { FlowPilotConfig } from '@flowpilot/core';

export interface FlowPilotProviderProps {
  children: ReactNode;
  config?: FlowPilotConfig;
}

const FlowPilotContext = createContext<FlowPilot | null>(null);

/**
 * Provider component for FlowPilot
 */
export function FlowPilotProvider({ children, config }: FlowPilotProviderProps) {
  const engineRef = useRef<FlowPilot | null>(null);

  // Initialize engine once
  if (engineRef.current === null) {
    engineRef.current = new FlowPilot(config);
  }

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
    throw new Error('useFlowPilotEngine must be used within FlowPilotProvider');
  }
  return engine;
}
