import type { FlowState } from './state';
import type { StepConfig } from './step';

export interface FlowEventPayload {
  flowId: string;
  state: FlowState;
}

export interface StepEventPayload {
  flowId: string;
  stepId: string;
  step: StepConfig;
  index: number;
  state: FlowState;
}

export interface ErrorEventPayload {
  flowId: string | null;
  error: Error;
  state: FlowState;
}

export type FlowPilotEvent =
  | { type: 'flow:start'; payload: FlowEventPayload }
  | { type: 'flow:pause'; payload: FlowEventPayload }
  | { type: 'flow:resume'; payload: FlowEventPayload }
  | { type: 'flow:complete'; payload: FlowEventPayload }
  | { type: 'flow:skip'; payload: FlowEventPayload }
  | { type: 'flow:error'; payload: ErrorEventPayload }
  | { type: 'step:enter'; payload: StepEventPayload }
  | { type: 'step:leave'; payload: StepEventPayload }
  | { type: 'step:target-missing'; payload: StepEventPayload }
  | { type: 'step:ready'; payload: StepEventPayload }
  | { type: 'step:complete'; payload: StepEventPayload };

export type EventListener<T extends FlowPilotEvent = FlowPilotEvent> = (event: T) => void;
export type Unsubscribe = () => void;

export interface EventEmitter {
  on<T extends FlowPilotEvent['type']>(
    eventType: T,
    listener: EventListener<Extract<FlowPilotEvent, { type: T }>>
  ): Unsubscribe;
  emit(event: FlowPilotEvent): void;
  off(eventType?: FlowPilotEvent['type']): void;
}
