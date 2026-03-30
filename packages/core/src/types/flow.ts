import type { StepConfig } from './step';

export type FlowStartHook = () => void | Promise<void>;
export type FlowCompleteHook = () => void | Promise<void>;
export type FlowSkipHook = () => void | Promise<void>;
export type FlowErrorHook = (error: Error) => void | Promise<void>;

export interface FlowConfig {
  id: string;
  steps: StepConfig[];
  initialStep?: string;
  onStart?: FlowStartHook;
  onComplete?: FlowCompleteHook;
  onSkip?: FlowSkipHook;
  onError?: FlowErrorHook;
  meta?: Record<string, unknown>;
}

export interface Flow extends FlowConfig {
  steps: StepConfig[];
  stepMap: Map<string, StepConfig>;
}
