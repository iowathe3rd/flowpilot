import { describe, it, expect, beforeEach } from 'vitest';
import { FlowStateMachine } from '../engine/state-machine';

describe('FlowStateMachine', () => {
  let machine: FlowStateMachine;

  beforeEach(() => {
    machine = new FlowStateMachine();
  });

  describe('initial state', () => {
    it('should start in idle status', () => {
      const state = machine.getState();
      expect(state.status).toBe('idle');
      expect(state.flowId).toBeNull();
      expect(state.currentStepId).toBeNull();
    });
  });

  describe('flow transitions', () => {
    it('should transition from idle to running', () => {
      const state = machine.startFlow('test-flow', 3);
      expect(state.status).toBe('running');
      expect(state.flowId).toBe('test-flow');
      expect(state.totalSteps).toBe(3);
    });

    it('should transition from running to paused', () => {
      machine.startFlow('test-flow', 3);
      const state = machine.pauseFlow();
      expect(state.status).toBe('paused');
    });

    it('should transition from paused to running', () => {
      machine.startFlow('test-flow', 3);
      machine.pauseFlow();
      const state = machine.resumeFlow();
      expect(state.status).toBe('running');
    });

    it('should transition from running to completed', () => {
      machine.startFlow('test-flow', 3);
      const state = machine.completeFlow();
      expect(state.status).toBe('completed');
    });

    it('should throw on invalid transition', () => {
      expect(() => machine.pauseFlow()).toThrow('Invalid flow transition');
    });
  });

  describe('step transitions', () => {
    it('should enter a step', () => {
      machine.startFlow('test-flow', 3);
      const state = machine.enterStep('step-1', 0);
      expect(state.currentStepId).toBe('step-1');
      expect(state.currentIndex).toBe(0);
      expect(state.stepStatus).toBe('active');
    });

    it('should mark target as resolving', () => {
      const state = machine.resolvingTarget();
      expect(state.stepStatus).toBe('resolving-target');
    });

    it('should mark target as ready', () => {
      machine.resolvingTarget();
      const state = machine.targetReady();
      expect(state.stepStatus).toBe('ready');
    });
  });

  describe('error handling', () => {
    it('should set error state', () => {
      machine.startFlow('test-flow', 3);
      const error = new Error('Test error');
      const state = machine.setError(error);
      expect(state.status).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      machine.startFlow('test-flow', 3);
      machine.enterStep('step-1', 0);
      const state = machine.reset();
      expect(state.status).toBe('idle');
      expect(state.flowId).toBeNull();
      expect(state.currentStepId).toBeNull();
    });
  });
});
