import type {
  FlowConfig,
  FlowState,
  FlowControls,
  StepConfig,
  Logger,
  LoggerConfig,
  EventEmitter,
  Unsubscribe,
} from '../types';
import { FlowStateMachine } from './state-machine';
import { FlowEventEmitter } from './event-emitter';
import { FlowRegistry } from './flow-registry';
import { StepNavigator } from './step-navigator';
import { createLogger } from './logger';
import { evaluateGuard } from './guards';
import {
  executeBeforeEnter,
  executeAfterEnter,
  executeBeforeLeave,
  executeFlowStart,
  executeFlowComplete,
  executeFlowSkip,
  executeFlowError,
} from './hooks';

export interface FlowPilotConfig {
  logger?: LoggerConfig;
}

/**
 * Main FlowPilot orchestration engine
 */
export class FlowPilot {
  private stateMachine: FlowStateMachine;
  private eventEmitter: FlowEventEmitter;
  private registry: FlowRegistry;
  private navigator: StepNavigator | null = null;
  private logger: Logger;

  constructor(config: FlowPilotConfig = {}) {
    this.stateMachine = new FlowStateMachine();
    this.eventEmitter = new FlowEventEmitter();
    this.registry = new FlowRegistry();
    this.logger = createLogger(config.logger);
  }

  /**
   * Register a flow
   */
  registerFlow(config: FlowConfig): void {
    try {
      this.registry.register(config);
      this.logger.debug(`Registered flow: ${config.id}`);
    } catch (error) {
      this.logger.error(`Failed to register flow: ${config.id}`, error);
      throw error;
    }
  }

  /**
   * Start a flow
   */
  async start(flowId: string): Promise<void> {
    const flow = this.registry.get(flowId);
    if (!flow) {
      throw new Error(`Flow "${flowId}" not found`);
    }

    try {
      // Execute flow start hook
      await executeFlowStart(flow.onStart, flowId);

      // Initialize navigator
      this.navigator = new StepNavigator(flow, flow.initialStep);

      // Update state
      this.stateMachine.startFlow(flowId, this.navigator.getTotalSteps());

      // Emit flow start event
      this.eventEmitter.emit({
        type: 'flow:start',
        payload: { flowId, state: this.stateMachine.getState() },
      });

      this.logger.info(`Started flow: ${flowId}`);

      // Enter first step
      await this.enterCurrentStep();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Stop the current flow
   */
  stop(): void {
    const state = this.stateMachine.getState();
    if (!state.flowId) return;

    this.stateMachine.reset();
    this.navigator = null;
    this.logger.info(`Stopped flow: ${state.flowId}`);
  }

  /**
   * Pause the current flow
   */
  pause(): void {
    const state = this.stateMachine.getState();
    if (!state.flowId || state.status !== 'running') return;

    this.stateMachine.pauseFlow();
    this.eventEmitter.emit({
      type: 'flow:pause',
      payload: { flowId: state.flowId, state: this.stateMachine.getState() },
    });
    this.logger.info(`Paused flow: ${state.flowId}`);
  }

  /**
   * Resume the current flow
   */
  resume(): void {
    const state = this.stateMachine.getState();
    if (!state.flowId || state.status !== 'paused') return;

    this.stateMachine.resumeFlow();
    this.eventEmitter.emit({
      type: 'flow:resume',
      payload: { flowId: state.flowId, state: this.stateMachine.getState() },
    });
    this.logger.info(`Resumed flow: ${state.flowId}`);
  }

  /**
   * Move to next step
   */
  async next(): Promise<void> {
    if (!this.navigator) return;

    try {
      const currentStep = this.navigator.getCurrentStep();
      if (!currentStep) return;

      // Execute before leave hook
      await executeBeforeLeave(currentStep.beforeLeave, currentStep.id);

      // Emit step leave event
      this.eventEmitter.emit({
        type: 'step:leave',
        payload: {
          flowId: this.stateMachine.getState().flowId!,
          stepId: currentStep.id,
          step: currentStep,
          index: this.navigator.getCurrentIndex(),
          state: this.stateMachine.getState(),
        },
      });

      // Move to next step
      const nextStep = this.navigator.next();
      if (!nextStep) {
        await this.complete();
        return;
      }

      // Enter next step
      await this.enterCurrentStep();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Move to previous step
   */
  async prev(): Promise<void> {
    if (!this.navigator) return;

    try {
      const currentStep = this.navigator.getCurrentStep();
      if (!currentStep) return;

      // Execute before leave hook
      await executeBeforeLeave(currentStep.beforeLeave, currentStep.id);

      // Move to previous step
      const prevStep = this.navigator.prev();
      if (!prevStep) return;

      // Enter previous step
      await this.enterCurrentStep();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Go to specific step
   */
  async goTo(stepId: string): Promise<void> {
    if (!this.navigator) return;

    const step = this.navigator.goTo(stepId);
    if (!step) {
      this.logger.warn(`Step "${stepId}" not found`);
      return;
    }

    await this.enterCurrentStep();
  }

  /**
   * Skip current flow
   */
  async skip(): Promise<void> {
    const state = this.stateMachine.getState();
    if (!state.flowId) return;

    const flow = this.registry.get(state.flowId);
    if (!flow) return;

    try {
      await executeFlowSkip(flow.onSkip, state.flowId);

      this.stateMachine.skipFlow();
      this.eventEmitter.emit({
        type: 'flow:skip',
        payload: { flowId: state.flowId, state: this.stateMachine.getState() },
      });

      this.logger.info(`Skipped flow: ${state.flowId}`);
      this.navigator = null;
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Complete current flow
   */
  async complete(): Promise<void> {
    const state = this.stateMachine.getState();
    if (!state.flowId) return;

    const flow = this.registry.get(state.flowId);
    if (!flow) return;

    try {
      await executeFlowComplete(flow.onComplete, state.flowId);

      this.stateMachine.completeFlow();
      this.eventEmitter.emit({
        type: 'flow:complete',
        payload: { flowId: state.flowId, state: this.stateMachine.getState() },
      });

      this.logger.info(`Completed flow: ${state.flowId}`);
      this.navigator = null;
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Reset flow to initial state
   */
  reset(): void {
    this.stateMachine.reset();
    this.navigator = null;
    this.logger.debug('Reset flow state');
  }

  /**
   * Get current state
   */
  getState(): Readonly<FlowState> {
    return this.stateMachine.getState();
  }

  /**
   * Get control flags
   */
  getControls(): FlowControls {
    const state = this.stateMachine.getState();
    return {
      canNext: this.navigator?.canNext() ?? false,
      canPrev: this.navigator?.canPrev() ?? false,
      isFirst: this.navigator?.isFirst() ?? false,
      isLast: this.navigator?.isLast() ?? false,
      isRunning: state.status === 'running',
      isPaused: state.status === 'paused',
      isCompleted: state.status === 'completed',
    };
  }

  /**
   * Get current step
   */
  getCurrentStep(): StepConfig | null {
    return this.navigator?.getCurrentStep() ?? null;
  }

  /**
   * Subscribe to events
   */
  on: EventEmitter['on'] = (eventType, listener) => {
    return this.eventEmitter.on(eventType, listener);
  };

  /**
   * Emit event (for advanced use cases)
   */
  emit: EventEmitter['emit'] = (event) => {
    this.eventEmitter.emit(event);
  };

  /**
   * Remove event listeners
   */
  off: EventEmitter['off'] = (eventType) => {
    this.eventEmitter.off(eventType);
  };

  /**
   * Enter current step
   */
  private async enterCurrentStep(): Promise<void> {
    if (!this.navigator) return;

    const step = this.navigator.getCurrentStep();
    if (!step) return;

    const flowId = this.stateMachine.getState().flowId!;

    // Check if step should be included
    const shouldInclude = await evaluateGuard(step.when);
    if (!shouldInclude) {
      this.logger.debug(`Skipping step due to guard: ${step.id}`);
      await this.next();
      return;
    }

    // Update state
    this.stateMachine.enterStep(step.id, this.navigator.getCurrentIndex());

    // Emit step enter event
    this.eventEmitter.emit({
      type: 'step:enter',
      payload: {
        flowId,
        stepId: step.id,
        step,
        index: this.navigator.getCurrentIndex(),
        state: this.stateMachine.getState(),
      },
    });

    // Execute before enter hook
    await executeBeforeEnter(step.beforeEnter, step.id);

    // Mark step as ready
    this.stateMachine.targetReady();
    this.eventEmitter.emit({
      type: 'step:ready',
      payload: {
        flowId,
        stepId: step.id,
        step,
        index: this.navigator.getCurrentIndex(),
        state: this.stateMachine.getState(),
      },
    });

    // Execute after enter hook
    await executeAfterEnter(step.afterEnter, step.id);

    this.logger.debug(`Entered step: ${step.id}`);
  }

  /**
   * Handle error
   */
  private async handleError(error: Error): Promise<void> {
    const state = this.stateMachine.getState();
    this.logger.error('Flow error:', error);

    this.stateMachine.setError(error);

    if (state.flowId) {
      const flow = this.registry.get(state.flowId);
      if (flow) {
        await executeFlowError(flow.onError, state.flowId, error);
      }
    }

    this.eventEmitter.emit({
      type: 'flow:error',
      payload: {
        flowId: state.flowId,
        error,
        state: this.stateMachine.getState(),
      },
    });
  }
}
