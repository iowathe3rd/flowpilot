import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlowPilotProvider,
  useCurrentStep,
  useFlow,
  useFlowControls,
  useFlowEvents,
  useFlowPilot,
  useTarget,
} from '@flowpilot/react';
import type { FlowConfig, FlowPilotEvent, FlowState } from '@flowpilot/core';

type LogLine = { id: number; text: string };

function UncontrolledShowcase() {
  const { registerFlow, start, next, prev, skip, pause, resume, reset, goTo } = useFlowPilot();
  const state = useFlow();
  const step = useCurrentStep();
  const controls = useFlowControls();
  const target = useTarget();

  const initializedRef = useRef(false);
  const optionalEnabledRef = useRef(true);
  const [optionalEnabled, setOptionalEnabled] = useState(true);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const logIdRef = useRef(0);

  optionalEnabledRef.current = optionalEnabled;

  const pushLog = useCallback((line: string) => {
    logIdRef.current += 1;
    setLogs((prevLogs) => [{ id: logIdRef.current, text: line }, ...prevLogs].slice(0, 18));
  }, []);

  const onFlowStart = useCallback((event: Extract<FlowPilotEvent, { type: 'flow:start' }>) => {
    pushLog(`flow:start → ${event.payload.flowId}`);
  }, [pushLog]);
  const onFlowPause = useCallback(() => pushLog('flow:pause'), [pushLog]);
  const onFlowResume = useCallback(() => pushLog('flow:resume'), [pushLog]);
  const onFlowSkip = useCallback(() => pushLog('flow:skip'), [pushLog]);
  const onFlowComplete = useCallback(() => pushLog('flow:complete'), [pushLog]);
  const onStepEnter = useCallback((event: Extract<FlowPilotEvent, { type: 'step:enter' }>) => {
    pushLog(`step:enter → ${event.payload.stepId}`);
  }, [pushLog]);
  const onStepReady = useCallback((event: Extract<FlowPilotEvent, { type: 'step:ready' }>) => {
    pushLog(`step:ready → ${event.payload.stepId}`);
  }, [pushLog]);

  useFlowEvents('flow:start', onFlowStart);
  useFlowEvents('flow:pause', onFlowPause);
  useFlowEvents('flow:resume', onFlowResume);
  useFlowEvents('flow:skip', onFlowSkip);
  useFlowEvents('flow:complete', onFlowComplete);
  useFlowEvents('step:enter', onStepEnter);
  useFlowEvents('step:ready', onStepReady);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const mainFlow: FlowConfig = {
      id: 'demo-tour',
      steps: [
        {
          id: 'welcome',
          target: '#welcome-target',
          meta: { title: 'Welcome', description: 'Start of the demo flow' },
          beforeEnter: () => pushLog('hook:beforeEnter(welcome)'),
          afterEnter: () => pushLog('hook:afterEnter(welcome)'),
        },
        {
          id: 'features',
          target: '#features-target',
          meta: { title: 'Features', description: 'Core features of FlowPilot' },
        },
        {
          id: 'optional-guarded',
          target: '#guard-target',
          when: () => optionalEnabledRef.current,
          meta: { title: 'Guarded Step', description: 'Included only when guard=true' },
        },
        {
          id: 'setup',
          target: '#setup-target',
          meta: { title: 'Setup', description: 'Integration checklist' },
        },
        {
          id: 'complete',
          target: '#complete-target',
          meta: { title: 'Done', description: 'You are all set' },
        },
      ],
      onStart: () => pushLog('hook:onStart'),
      onComplete: () => pushLog('hook:onComplete'),
      onSkip: () => pushLog('hook:onSkip'),
      onError: (error) => pushLog(`hook:onError(${error.message})`),
    };

    const branchFlow: FlowConfig = {
      id: 'branch-tour',
      steps: [
        { id: 'branch-a', target: '#branch-a-target', next: 'branch-c' },
        { id: 'branch-b', target: '#branch-b-target' },
        { id: 'branch-c', target: '#branch-c-target' },
      ],
    };

    registerFlow(mainFlow);
    registerFlow(branchFlow);
    void start('demo-tour');
  }, [pushLog, registerFlow, start]);

  const stepTitle = (step?.meta?.title as string | undefined) ?? step?.id ?? 'No step';
  const stepDescription = (step?.meta?.description as string | undefined) ?? 'No description';

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <h1>FlowPilot Demo</h1>
        <p>A headless tour library for React — full feature showcase</p>
      </header>

      <div className="demo-grid">
        <section className="card">
          <h2>Flow state</h2>
          <p><strong>Flow:</strong> {state.flowId ?? 'none'}</p>
          <p><strong>Status:</strong> {state.status}</p>
          <p><strong>Step Status:</strong> {state.stepStatus}</p>
          <p><strong>Index:</strong> {state.currentIndex + 1} / {state.totalSteps}</p>
          <p><strong>Current Step:</strong> {stepTitle}</p>
          <p>{stepDescription}</p>
        </section>

        <section className="card">
          <h2>Target resolver</h2>
          <p><strong>Resolved:</strong> {target?.found ? 'yes' : 'no'}</p>
          <p><strong>Visible:</strong> {target?.isVisible ? 'yes' : 'no'}</p>
          <p><strong>In viewport:</strong> {target?.isInViewport ? 'yes' : 'no'}</p>
          <p>
            <strong>Rect:</strong>{' '}
            {target?.rect ? `${Math.round(target.rect.x)},${Math.round(target.rect.y)} ${Math.round(target.rect.width)}x${Math.round(target.rect.height)}` : 'n/a'}
          </p>
        </section>

        <section className="card">
          <h2>Controls</h2>
          <div className="row">
            <button onClick={() => void prev()} disabled={!controls.canPrev}>Previous</button>
            <button onClick={() => void next()} disabled={!controls.canNext}>
              {controls.isLast ? 'Complete' : 'Next'}
            </button>
          </div>
          <div className="row">
            <button onClick={() => pause()} disabled={!controls.isRunning}>Pause</button>
            <button onClick={() => resume()} disabled={!controls.isPaused}>Resume</button>
            <button onClick={() => void skip()}>Skip Tour</button>
          </div>
          <div className="row">
            <button onClick={() => void goTo('setup')}>Go To setup</button>
            <button onClick={() => reset()}>Reset</button>
            <button onClick={() => void start('branch-tour')}>Start branch-tour</button>
          </div>
          <p className="hint">
            canPrev={String(controls.canPrev)} canNext={String(controls.canNext)} first={String(controls.isFirst)} last={String(controls.isLast)}
          </p>
        </section>

        <section className="card">
          <h2>Guards + hooks</h2>
          <label className="toggle">
            <input
              type="checkbox"
              checked={optionalEnabled}
              onChange={(event) => setOptionalEnabled(event.target.checked)}
            />
            <span>Enable optional guarded step</span>
          </label>
          <p className="hint">Guard is evaluated when entering the step.</p>
          <button onClick={() => void start('demo-tour')}>Restart demo-tour</button>
        </section>
      </div>

      <section className="targets">
        <h2>Target elements (for useTarget / placement)</h2>
        <div id="welcome-target" className="target-box">#welcome-target</div>
        <div id="features-target" className="target-box">#features-target</div>
        <div id="guard-target" className="target-box">#guard-target (guarded)</div>
        <div id="setup-target" className="target-box">#setup-target</div>
        <div id="complete-target" className="target-box">#complete-target</div>
        <div id="branch-a-target" className="target-box">#branch-a-target</div>
        <div id="branch-b-target" className="target-box">#branch-b-target</div>
        <div id="branch-c-target" className="target-box">#branch-c-target</div>
      </section>

      <section className="logs">
        <h2>Event stream</h2>
        <button onClick={() => setLogs([])}>Clear</button>
        <ul>
          {logs.map((line) => (
            <li key={line.id}>{line.text}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ControlledShowcase() {
  const { start, next, goTo, reset } = useFlowPilot();
  const state = useFlow();

  return (
    <section className="card">
      <h2>Controlled mode panel</h2>
      <p>State from hooks: flow={state.flowId ?? 'none'} step={state.currentStepId ?? 'none'} status={state.status}</p>
      <div className="row">
        <button onClick={() => void start('demo-tour')}>Start controlled flow</button>
        <button onClick={() => void goTo('features')}>GoTo features</button>
        <button onClick={() => void next()}>Next</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </section>
  );
}

function ControlledModeDemo() {
  const [activeFlowId, setActiveFlowId] = useState<string | null>('demo-tour');
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [externalState, setExternalState] = useState<Readonly<FlowState> | null>(null);

  const controlledFlows = useMemo<FlowConfig[]>(
    () => [
      {
        id: 'demo-tour',
        steps: [
          { id: 'welcome' },
          { id: 'features' },
          { id: 'setup' },
          { id: 'complete' },
        ],
      },
    ],
    []
  );

  return (
    <FlowPilotProvider
      flows={controlledFlows}
      activeFlowId={activeFlowId}
      activeStepId={activeStepId}
      onStateChange={setExternalState}
      config={{ logger: { level: 'silent' } }}
    >
      <div className="demo-shell">
        <h1>Controlled Mode Demo</h1>
        <p>External control via provider props + internal hook controls.</p>
        <div className="row">
          <button onClick={() => setActiveFlowId('demo-tour')}>Set activeFlowId=demo-tour</button>
          <button onClick={() => setActiveFlowId(null)}>Set activeFlowId=null</button>
          <button onClick={() => setActiveStepId('setup')}>Set activeStepId=setup</button>
          <button onClick={() => setActiveStepId(null)}>Clear activeStepId</button>
        </div>
        <p className="hint">
          External observer: {externalState ? `${externalState.flowId ?? 'none'} / ${externalState.currentStepId ?? 'none'} / ${externalState.status}` : 'n/a'}
        </p>
        <ControlledShowcase />
      </div>
    </FlowPilotProvider>
  );
}

export function App() {
  const [tab, setTab] = useState<'uncontrolled' | 'controlled'>('uncontrolled');

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setTab('uncontrolled')} disabled={tab === 'uncontrolled'}>
          Uncontrolled showcase
        </button>
        <button onClick={() => setTab('controlled')} disabled={tab === 'controlled'}>
          Controlled mode
        </button>
      </div>

      {tab === 'uncontrolled' ? (
        <FlowPilotProvider config={{ logger: { level: 'debug' } }}>
          <UncontrolledShowcase />
        </FlowPilotProvider>
      ) : (
        <ControlledModeDemo />
      )}
    </div>
  );
}
