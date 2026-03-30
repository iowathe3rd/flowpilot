import type { FlowState, FlowStatus, StepStatus } from '../types';
import { createInitialState } from '../types';

/**
 * Transition validators for flow states
 */
const VALID_FLOW_TRANSITIONS: Record<FlowStatus, FlowStatus[]> = {
  idle: ['running'],
  running: ['paused', 'completed', 'skipped', 'error', 'idle'],
  paused: ['running', 'completed', 'skipped', 'error', 'idle'],
  completed: ['idle'],
  skipped: ['idle'],
  error: ['idle'],
};

/**
 * Transition validators for step states
 */
const VALID_STEP_TRANSITIONS: Record<StepStatus, StepStatus[]> = {
  pending: ['resolving-target', 'active', 'ready', 'skipped'],
  'resolving-target': ['ready', 'target-missing', 'active', 'skipped'],
  ready: ['active', 'skipped'],
  active: ['completed', 'skipped', 'ready'], // Allow back to ready for re-entering
  'target-missing': ['resolving-target', 'skipped'],
  completed: ['pending', 'active'], // Allow re-entering completed step
  skipped: ['pending', 'active'], // Allow re-entering skipped step
};

/**
 * State machine for managing flow state transitions
 */
export class FlowStateMachine {
  private state: FlowState;

  constructor(initialState?: Partial<FlowState>) {
    this.state = { ...createInitialState(), ...initialState };
  }

  /**
   * Get current state (immutable copy)
   */
  getState(): Readonly<FlowState> {
    return { ...this.state };
  }

  /**
   * Check if flow transition is valid
   */
  canTransitionFlow(to: FlowStatus): boolean {
    const validTransitions = VALID_FLOW_TRANSITIONS[this.state.status];
    return validTransitions.includes(to);
  }

  /**
   * Check if step transition is valid
   */
  canTransitionStep(to: StepStatus): boolean {
    const validTransitions = VALID_STEP_TRANSITIONS[this.state.stepStatus];
    return validTransitions.includes(to);
  }

  /**
   * Transition flow status
   */
  transitionFlow(to: FlowStatus): FlowState {
    if (!this.canTransitionFlow(to)) {
      throw new Error(
        `Invalid flow transition from "${this.state.status}" to "${to}"`
      );
    }
    this.state.status = to;
    return this.getState();
  }

  /**
   * Transition step status
   */
  transitionStep(to: StepStatus): FlowState {
    if (!this.canTransitionStep(to)) {
      throw new Error(
        `Invalid step transition from "${this.state.stepStatus}" to "${to}"`
      );
    }
    this.state.stepStatus = to;
    return this.getState();
  }

  /**
   * Start a flow
   */
  startFlow(flowId: string, totalSteps: number): FlowState {
    this.transitionFlow('running');
    this.state.flowId = flowId;
    this.state.totalSteps = totalSteps;
    this.state.currentIndex = 0;
    this.state.error = null;
    return this.getState();
  }

  /**
   * Pause the current flow
   */
  pauseFlow(): FlowState {
    this.transitionFlow('paused');
    return this.getState();
  }

  /**
   * Resume the current flow
   */
  resumeFlow(): FlowState {
    this.transitionFlow('running');
    return this.getState();
  }

  /**
   * Complete the current flow
   */
  completeFlow(): FlowState {
    this.transitionFlow('completed');
    return this.getState();
  }

  /**
   * Skip the current flow
   */
  skipFlow(): FlowState {
    this.transitionFlow('skipped');
    return this.getState();
  }

  /**
   * Set error state
   */
  setError(error: Error): FlowState {
    // Only transition if not already in error state
    if (this.state.status !== 'error') {
      this.transitionFlow('error');
    }
    this.state.error = error;
    return this.getState();
  }

  /**
   * Reset to idle state
   */
  reset(): FlowState {
    if (this.state.status !== 'idle') {
      this.transitionFlow('idle');
    }
    this.state = createInitialState();
    return this.getState();
  }

  /**
   * Enter a step
   */
  enterStep(stepId: string, index: number): FlowState {
    this.state.currentStepId = stepId;
    this.state.currentIndex = index;
    // Transition to active from any state
    if (this.canTransitionStep('active')) {
      this.transitionStep('active');
    }
    return this.getState();
  }

  /**
   * Complete current step
   */
  completeStep(): FlowState {
    this.transitionStep('completed');
    return this.getState();
  }

  /**
   * Skip current step
   */
  skipStep(): FlowState {
    this.transitionStep('skipped');
    return this.getState();
  }

  /**
   * Mark target as resolving
   */
  resolvingTarget(): FlowState {
    this.transitionStep('resolving-target');
    return this.getState();
  }

  /**
   * Mark target as ready
   */
  targetReady(): FlowState {
    this.transitionStep('ready');
    return this.getState();
  }

  /**
   * Mark target as missing
   */
  targetMissing(): FlowState {
    this.transitionStep('target-missing');
    return this.getState();
  }

  /**
   * Update metadata
   */
  updateMeta(meta: Record<string, unknown>): FlowState {
    this.state.meta = { ...this.state.meta, ...meta };
    return this.getState();
  }
}
