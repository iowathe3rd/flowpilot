import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FlowPilot } from '../engine/flow-pilot';
import type { FlowConfig } from '../types';

describe('FlowPilot', () => {
  let engine: FlowPilot;
  let testFlow: FlowConfig;

  beforeEach(() => {
    engine = new FlowPilot({ logger: { level: 'silent' } });
    testFlow = {
      id: 'onboarding',
      steps: [
        { id: 'step-1', meta: { title: 'Welcome' } },
        { id: 'step-2', meta: { title: 'Features' } },
        { id: 'step-3', meta: { title: 'Done' } },
      ],
    };
  });

  describe('flow registration', () => {
    it('should register a flow', () => {
      expect(() => engine.registerFlow(testFlow)).not.toThrow();
    });

    it('should throw on duplicate flow registration', () => {
      engine.registerFlow(testFlow);
      expect(() => engine.registerFlow(testFlow)).toThrow();
    });

    it('should throw on flow with no steps', () => {
      const invalidFlow = { id: 'invalid', steps: [] };
      expect(() => engine.registerFlow(invalidFlow)).toThrow();
    });
  });

  describe('flow execution', () => {
    beforeEach(() => {
      engine.registerFlow(testFlow);
    });

    it('should start a flow', async () => {
      await engine.start('onboarding');
      const state = engine.getState();
      expect(state.flowId).toBe('onboarding');
      expect(state.status).toBe('running');
      expect(state.currentStepId).toBe('step-1');
    });

    it('should move to next step', async () => {
      await engine.start('onboarding');
      await engine.next();
      const state = engine.getState();
      expect(state.currentStepId).toBe('step-2');
      expect(state.currentIndex).toBe(1);
    });

    it('should move to previous step', async () => {
      await engine.start('onboarding');
      await engine.next();
      await engine.prev();
      const state = engine.getState();
      expect(state.currentStepId).toBe('step-1');
      expect(state.currentIndex).toBe(0);
    });

    it('should complete flow on last step next', async () => {
      await engine.start('onboarding');
      await engine.next();
      await engine.next();
      await engine.next();
      const state = engine.getState();
      expect(state.status).toBe('completed');
    });

    it('should skip flow', async () => {
      await engine.start('onboarding');
      await engine.skip();
      const state = engine.getState();
      expect(state.status).toBe('skipped');
    });
  });

  describe('controls', () => {
    beforeEach(async () => {
      engine.registerFlow(testFlow);
      await engine.start('onboarding');
    });

    it('should provide correct control flags', () => {
      const controls = engine.getControls();
      expect(controls.isFirst).toBe(true);
      expect(controls.isLast).toBe(false);
      expect(controls.canNext).toBe(true);
      expect(controls.canPrev).toBe(false);
      expect(controls.isRunning).toBe(true);
    });
  });

  describe('events', () => {
    beforeEach(() => {
      engine.registerFlow(testFlow);
    });

    it('should emit flow:start event', async () => {
      const handler = vi.fn();
      engine.on('flow:start', handler);
      await engine.start('onboarding');
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'flow:start',
          payload: expect.objectContaining({ flowId: 'onboarding' }),
        })
      );
    });

    it('should emit step:enter event', async () => {
      const handler = vi.fn();
      engine.on('step:enter', handler);
      await engine.start('onboarding');
      expect(handler).toHaveBeenCalled();
    });

    it('should unsubscribe from events', async () => {
      const handler = vi.fn();
      const unsubscribe = engine.on('flow:start', handler);
      unsubscribe();
      await engine.start('onboarding');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('hooks', () => {
    it('should execute flow start hook', async () => {
      const onStart = vi.fn();
      engine.registerFlow({ ...testFlow, onStart });
      await engine.start('onboarding');
      expect(onStart).toHaveBeenCalled();
    });

    it('should execute flow complete hook', async () => {
      const onComplete = vi.fn();
      engine.registerFlow({ ...testFlow, onComplete });
      await engine.start('onboarding');
      await engine.next();
      await engine.next();
      await engine.next();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('guards', () => {
    it('should skip step with false guard', async () => {
      const flowWithGuard: FlowConfig = {
        id: 'guarded',
        steps: [
          { id: 'step-1' },
          { id: 'step-2', when: () => false },
          { id: 'step-3' },
        ],
      };
      engine.registerFlow(flowWithGuard);
      await engine.start('guarded');
      await engine.next();
      const state = engine.getState();
      expect(state.currentStepId).toBe('step-3');
    });
  });
});
