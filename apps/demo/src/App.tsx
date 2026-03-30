import { useEffect } from 'react';
import { FlowPilotProvider, useFlowPilot, useFlow, useFlowControls } from '@flowpilot/react';

function Demo() {
  const { registerFlow, start, next, prev, skip } = useFlowPilot();
  const state = useFlow();
  const controls = useFlowControls();

  useEffect(() => {
    registerFlow({
      id: 'demo-tour',
      steps: [
        { id: 'welcome', meta: { title: 'Welcome!', description: 'Welcome to FlowPilot demo' } },
        { id: 'features', meta: { title: 'Features', description: 'Explore the features' } },
        { id: 'setup', meta: { title: 'Setup', description: 'Quick setup guide' } },
        { id: 'complete', meta: { title: 'Done!', description: 'You are all set' } },
      ],
      onStart: () => console.log('Tour started!'),
      onComplete: () => console.log('Tour completed!'),
    });

    start('demo-tour');
  }, [registerFlow, start]);

  if (state.status === 'idle') {
    return <div>Loading...</div>;
  }

  if (state.status === 'completed') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>🎉 Tour Completed!</h1>
        <p>You have successfully completed the demo tour.</p>
      </div>
    );
  }

  const currentStep = state.currentStepId;
  const stepMeta = currentStep ? {} : {};

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>FlowPilot Demo</h1>
        <p>A headless tour library for React</p>
      </div>

      <div style={{ border: '2px solid #333', borderRadius: '8px', padding: '2rem', marginBottom: '2rem' }}>
        <h2>Step {state.currentIndex + 1} of {state.totalSteps}</h2>
        <h3>{currentStep}</h3>
        <p>Status: {state.status}</p>
        <p>Step Status: {state.stepStatus}</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button onClick={() => prev()} disabled={!controls.canPrev}>
          Previous
        </button>
        <button onClick={() => skip()}>
          Skip Tour
        </button>
        <button onClick={() => next()} disabled={!controls.canNext}>
          {controls.isLast ? 'Complete' : 'Next'}
        </button>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#666' }}>
        <p>First: {String(controls.isFirst)} | Last: {String(controls.isLast)}</p>
        <p>Can Prev: {String(controls.canPrev)} | Can Next: {String(controls.canNext)}</p>
      </div>
    </div>
  );
}

export function App() {
  return (
    <FlowPilotProvider config={{ logger: { level: 'debug' } }}>
      <Demo />
    </FlowPilotProvider>
  );
}
