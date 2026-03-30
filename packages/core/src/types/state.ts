/**
 * Flow lifecycle states
 */
export type FlowStatus = 
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'skipped'
  | 'error';

/**
 * Step lifecycle states
 */
export type StepStatus =
  | 'pending'
  | 'resolving-target'
  | 'ready'
  | 'active'
  | 'target-missing'
  | 'completed'
  | 'skipped';

/**
 * Core flow state
 */
export interface FlowState {
  flowId: string | null;
  currentStepId: string | null;
  currentIndex: number;
  totalSteps: number;
  status: FlowStatus;
  stepStatus: StepStatus;
  error: Error | null;
  meta: Record<string, unknown>;
}

/**
 * Control flags derived from state
 */
export interface FlowControls {
  canNext: boolean;
  canPrev: boolean;
  isFirst: boolean;
  isLast: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
}

export function createInitialState(): FlowState {
  return {
    flowId: null,
    currentStepId: null,
    currentIndex: 0,
    totalSteps: 0,
    status: 'idle',
    stepStatus: 'pending',
    error: null,
    meta: {},
  };
}
