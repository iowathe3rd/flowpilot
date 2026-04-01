import { beforeEach, describe, expect, it } from 'vitest';
import { FlowPilot } from '../engine/flow-pilot';
import type { FlowConfig } from '../types';

describe('FlowPilot integration scenarios', () => {
  let engine: FlowPilot;

  beforeEach(() => {
    engine = new FlowPilot({ logger: { level: 'silent' } });
  });

  it('handles dynamic target-like branching via when guards', async () => {
    const flow: FlowConfig = {
      id: 'dynamic-target-flow',
      steps: [
        { id: 'intro' },
        { id: 'optional', when: () => false },
        { id: 'final' },
      ],
    };

    engine.registerFlow(flow);
    await engine.start(flow.id);

    expect(engine.getState().currentStepId).toBe('intro');

    await engine.next();

    const state = engine.getState();
    expect(state.currentStepId).toBe('final');
    expect(state.currentIndex).toBe(2);
  });

  it('supports goTo navigation and continues from that step', async () => {
    const flow: FlowConfig = {
      id: 'goto-flow',
      steps: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
    };

    engine.registerFlow(flow);
    await engine.start(flow.id);
    await engine.goTo('c');

    expect(engine.getState().currentStepId).toBe('c');

    await engine.next();
    expect(engine.getState().currentStepId).toBe('d');
  });

  it('emits state-consistent events through pause/resume/skip lifecycle', async () => {
    const flow: FlowConfig = {
      id: 'lifecycle-flow',
      steps: [{ id: 's1' }, { id: 's2' }],
    };

    engine.registerFlow(flow);
    await engine.start(flow.id);
    expect(engine.getState().status).toBe('running');

    engine.pause();
    expect(engine.getState().status).toBe('paused');

    engine.resume();
    expect(engine.getState().status).toBe('running');

    await engine.skip();
    expect(engine.getState().status).toBe('skipped');
  });
});
