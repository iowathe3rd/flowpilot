import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FlowPilotProvider } from '../provider/FlowPilotProvider';
import { useFlowPilot } from '../hooks/useFlowPilot';
import { useFlow } from '../hooks/useFlow';
import { useCurrentStep } from '../hooks/useCurrentStep';
import { useFlowControls } from '../hooks/useFlowControls';
import type { FlowConfig } from '@flowpilot/core';

function TestComponent() {
  const { start, next, prev, skip, reset } = useFlowPilot();
  const flow = useFlow();
  const currentStep = useCurrentStep();
  const controls = useFlowControls();

  return (
    <div>
      <div data-testid="flow-status">{flow?.status || 'no-flow'}</div>
      <div data-testid="step-id">{currentStep?.id || 'no-step'}</div>
      <div data-testid="current-index">{flow?.currentIndex ?? -1}</div>
      <div data-testid="can-next">{String(controls.canNext)}</div>
      <div data-testid="can-prev">{String(controls.canPrev)}</div>
      <div data-testid="is-last">{String(controls.isLast)}</div>
      <button onClick={() => start('test-flow')}>Start</button>
      <button onClick={next}>Next</button>
      <button onClick={prev}>Prev</button>
      <button onClick={skip}>Skip</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function MultiFlowComponent() {
  const flow = useFlow();
  const { start, reset } = useFlowPilot();

  return (
    <div>
      <div data-testid="active-flow">{flow?.flowId || 'none'}</div>
      <button onClick={() => void start('flow-1')}>Start Flow 1</button>
      <button onClick={() => void start('flow-2')}>Start Flow 2</button>
      <button onClick={reset}>Reset Flow</button>
    </div>
  );
}

describe('FlowPilotProvider', () => {
  const testFlow: FlowConfig = {
    id: 'test-flow',
    steps: [
      { id: 'step-1', target: '#target-1' },
      { id: 'step-2', target: '#target-2' },
      { id: 'step-3', target: '#target-3' },
    ],
  };

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="target-1">Target 1</div>
      <div id="target-2">Target 2</div>
      <div id="target-3">Target 3</div>
    `;
  });

  it('provides FlowPilot engine to children', () => {
    const { container } = render(
      <FlowPilotProvider>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('initializes with idle status', () => {
    render(
      <FlowPilotProvider>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(screen.getByTestId('flow-status')).toHaveTextContent('idle');
    expect(screen.getByTestId('step-id')).toHaveTextContent('no-step');
  });

  it('registers flows and starts them', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('running');
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-1');
    });
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useFlowPilot must be used within FlowPilotProvider');

    spy.mockRestore();
  });
});

describe('useFlow hook', () => {
  const testFlow: FlowConfig = {
    id: 'test-flow',
    steps: [
      { id: 'step-1', target: '#target-1' },
      { id: 'step-2', target: '#target-2' },
    ],
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target-1">Target 1</div>
      <div id="target-2">Target 2</div>
    `;
  });

  it('returns null when no flow is active', () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(screen.getByTestId('flow-status')).toHaveTextContent('idle');
  });

  it('returns active flow data when flow starts', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('running');
    });
  });

  it('updates when flow resets', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('running');
    });

    screen.getByText('Reset').click();

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('idle');
    });
  });
});

describe('useCurrentStep hook', () => {
  const testFlow: FlowConfig = {
    id: 'test-flow',
    steps: [
      { id: 'step-1', target: '#target-1' },
      { id: 'step-2', target: '#target-2' },
      { id: 'step-3', target: '#target-3' },
    ],
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target-1">Target 1</div>
      <div id="target-2">Target 2</div>
      <div id="target-3">Target 3</div>
    `;
  });

  it('returns null when no step is active', () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(screen.getByTestId('step-id')).toHaveTextContent('no-step');
  });

  it('returns current step when flow starts', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-1');
    });
  });

  it('updates when navigating between steps', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-1');
    });

    screen.getByText('Next').click();

    await waitFor(() => {
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-2');
    });

    screen.getByText('Prev').click();

    await waitFor(() => {
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-1');
    });
  });

  it('handles skip correctly', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-1');
    });

    screen.getByText('Skip').click();

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('skipped');
    });
  });
});

describe('useFlowControls hook', () => {
  const testFlow: FlowConfig = {
    id: 'test-flow',
    steps: [
      { id: 'step-1', target: '#target-1' },
      { id: 'step-2', target: '#target-2' },
    ],
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target-1">Target 1</div>
      <div id="target-2">Target 2</div>
    `;
  });

  it('updates control flags across navigation', async () => {
    render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(screen.getByTestId('can-prev')).toHaveTextContent('false');
    expect(screen.getByTestId('can-next')).toHaveTextContent('false');

    screen.getByText('Start').click();

    await waitFor(() => {
      expect(screen.getByTestId('can-next')).toHaveTextContent('true');
      expect(screen.getByTestId('can-prev')).toHaveTextContent('false');
    });

    screen.getByText('Next').click();
    await waitFor(() => {
      expect(screen.getByTestId('can-prev')).toHaveTextContent('true');
      expect(screen.getByTestId('is-last')).toHaveTextContent('true');
    });
  });
});

describe('Multiple flows', () => {
  const flow1: FlowConfig = {
    id: 'flow-1',
    steps: [{ id: 'step-1', target: '#target-1' }],
  };

  const flow2: FlowConfig = {
    id: 'flow-2',
    steps: [{ id: 'step-2', target: '#target-2' }],
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target-1">Target 1</div>
      <div id="target-2">Target 2</div>
    `;
  });

  it('switches between flows correctly', async () => {
    render(
      <FlowPilotProvider flows={[flow1, flow2]}>
        <MultiFlowComponent />
      </FlowPilotProvider>
    );

    expect(screen.getByTestId('active-flow')).toHaveTextContent('none');

    screen.getByText('Start Flow 1').click();

    await waitFor(() => {
      expect(screen.getByTestId('active-flow')).toHaveTextContent('flow-1');
    });

    screen.getByText('Reset Flow').click();
    await waitFor(() => {
      expect(screen.getByTestId('active-flow')).toHaveTextContent('none');
    });

    screen.getByText('Start Flow 2').click();

    await waitFor(() => {
      expect(screen.getByTestId('active-flow')).toHaveTextContent('flow-2');
    });
  });
});

describe('SSR safety', () => {
  const testFlow: FlowConfig = {
    id: 'test-flow',
    steps: [{ id: 'step-1', target: '#target-1' }],
  };

  it('renders without crashing in SSR environment', () => {
    const { container } = render(
      <FlowPilotProvider flows={[testFlow]}>
        <TestComponent />
      </FlowPilotProvider>
    );

    expect(container).toBeInTheDocument();
  });
});

describe('controlled mode', () => {
  const flow: FlowConfig = {
    id: 'controlled-flow',
    steps: [{ id: 'step-1' }, { id: 'step-2' }],
  };

  it('starts the controlled flow and goes to controlled step', async () => {
    render(
      <FlowPilotProvider
        flows={[flow]}
        activeFlowId="controlled-flow"
        activeStepId="step-2"
      >
        <TestComponent />
      </FlowPilotProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('running');
      expect(screen.getByTestId('step-id')).toHaveTextContent('step-2');
    });
  });

  it('resets when activeFlowId is null', async () => {
    const { rerender } = render(
      <FlowPilotProvider flows={[flow]} activeFlowId="controlled-flow">
        <TestComponent />
      </FlowPilotProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('running');
    });

    rerender(
      <FlowPilotProvider flows={[flow]} activeFlowId={null}>
        <TestComponent />
      </FlowPilotProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('flow-status')).toHaveTextContent('idle');
      expect(screen.getByTestId('step-id')).toHaveTextContent('no-step');
    });
  });
});
