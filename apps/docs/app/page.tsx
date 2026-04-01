import Link from 'next/link';

export default function DocsHomePage() {
  return (
    <main className="page">
      <header className="hero">
        <h1>FlowPilot Documentation</h1>
        <p>
          Headless orchestration engine for product tours and onboarding. Build your own UI while
          FlowPilot handles lifecycle, navigation, and state.
        </p>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Quick Start</h2>
          <p>Install and launch your first flow in under 5 minutes.</p>
          <Link href="#quick-start">Read section</Link>
        </article>
        <article className="card">
          <h2>API Reference</h2>
          <p>Provider props, hooks API, events, and control semantics.</p>
          <Link href="#api-reference">Read section</Link>
        </article>
        <article className="card">
          <h2>Examples</h2>
          <p>Basic onboarding, custom UI pattern, and Next.js App Router.</p>
          <Link href="#examples">Read section</Link>
        </article>
        <article className="card">
          <h2>Release Checklist</h2>
          <p>Bundle audit, type validation, and publishing workflow.</p>
          <Link href="#release-checklist">Read section</Link>
        </article>
      </section>

      <section id="quick-start" className="section">
        <h2>Quick Start</h2>
        <p>Install packages:</p>
        <pre>
          <code>{`pnpm add @flowpilot/core @flowpilot/react`}</code>
        </pre>
        <p>Minimal React setup:</p>
        <pre>
          <code>{`import { FlowPilotProvider, useFlowPilot, useFlow } from '@flowpilot/react';

function Onboarding() {
  const { registerFlow, start, next } = useFlowPilot();
  const state = useFlow();

  useEffect(() => {
    registerFlow({
      id: 'onboarding',
      steps: [{ id: 'welcome' }, { id: 'features' }, { id: 'done' }],
    });
    void start('onboarding');
  }, [registerFlow, start]);

  return (
    <div>
      <p>Status: {state.status}</p>
      <p>Step: {state.currentStepId}</p>
      <button onClick={() => void next()}>Next</button>
    </div>
  );
}

export default function App() {
  return (
    <FlowPilotProvider>
      <Onboarding />
    </FlowPilotProvider>
  );
}`}</code>
        </pre>
      </section>

      <section id="api-reference" className="section">
        <h2>API Reference</h2>
        <h3>Provider</h3>
        <ul>
          <li>
            <code>flows?: FlowConfig[]</code> - pre-register flows at provider init.
          </li>
          <li>
            <code>activeFlowId?: string | null</code> - controlled mode for active flow.
          </li>
          <li>
            <code>activeStepId?: string | null</code> - controlled mode for active step.
          </li>
          <li>
            <code>onStateChange?: (state) =&gt; void</code> - observe state transitions.
          </li>
        </ul>
        <h3>Hooks</h3>
        <ul>
          <li>
            <code>useFlowPilot()</code> - imperative API: start/next/prev/goTo/skip/reset.
          </li>
          <li>
            <code>useFlow()</code> - current flow state.
          </li>
          <li>
            <code>useCurrentStep()</code> - resolved current step config.
          </li>
          <li>
            <code>useFlowControls()</code> - derived booleans for UI controls.
          </li>
          <li>
            <code>useTarget()</code> - target resolution + geometry.
          </li>
          <li>
            <code>useFlowEvents(type, listener)</code> - lifecycle event subscriptions.
          </li>
        </ul>
      </section>

      <section id="examples" className="section">
        <h2>Examples</h2>
        <h3>Basic onboarding</h3>
        <p>
          Use <code>useFlow()</code> + <code>useFlowControls()</code> to render simple text and nav
          buttons.
        </p>
        <h3>Custom UI pattern</h3>
        <p>
          Use <code>useCurrentStep()</code> and step metadata for your own tooltip, backdrop, and
          action layout.
        </p>
        <h3>Next.js App Router</h3>
        <pre>
          <code>{`'use client';
import { FlowPilotProvider } from '@flowpilot/react';

export default function OnboardingShell({ children }) {
  return <FlowPilotProvider>{children}</FlowPilotProvider>;
}`}</code>
        </pre>
      </section>

      <section id="release-checklist" className="section">
        <h2>Release Checklist</h2>
        <ul>
          <li>Run tests: <code>pnpm run test</code></li>
          <li>Run E2E: <code>pnpm --filter demo test:e2e</code></li>
          <li>Run build: <code>pnpm run build</code></li>
          <li>Validate package quality: <code>pnpm run validate:packages</code></li>
          <li>Publish with changesets: <code>pnpm release</code></li>
        </ul>
      </section>
    </main>
  );
}
