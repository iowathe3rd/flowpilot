'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useFlowPilot,
  useCurrentStep,
  useFlow,
  useTarget,
} from '@flowpilot/react';
import type { FlowConfig } from '@flowpilot/core';

// Tour flow definition targeting landing sections
const landingTourFlow: FlowConfig = {
  id: 'landing-tour',
  steps: [
    {
      id: 'hero',
      target: '#hero',
      placement: 'center'
    },
    {
      id: 'features',
      target: '#features',
    },
    {
      id: 'how-it-works',
      target: '#how-it-works',
    },
    {
      id: 'use-cases',
      target: '#use-cases',
    },
    {
      id: 'api',
      target: '#api',
    },
    {
      id: 'faq',
      target: '#faq',
    },
    {
      id: 'cta',
      target: '#cta',
    },
  ],
};

// Step content for each tour step
const stepContent: Record<string, { title: string; description: string }> = {
  hero: {
    title: 'Welcome to FlowPilot',
    description:
      'FlowPilot is a headless React library for building guided tours and onboarding flows. You own the UI. We own the state.',
  },
  features: {
    title: 'Headless by Design',
    description:
      'FlowPilot provides state management and sequencing. You render exactly what your design system requires — no forced UI components.',
  },
  'how-it-works': {
    title: 'Three Steps to Guided UX',
    description:
      'Define your flow as an array, attach targets in your UI, and run the flow. FlowPilot handles state transitions and events.',
  },
  'use-cases': {
    title: 'Flexible Use Cases',
    description:
      'Build onboarding flows, feature announcements, product walkthroughs, or contextual help — FlowPilot adapts to your needs.',
  },
  api: {
    title: 'Minimal, Predictable API',
    description:
      "Everything you need to build guided experiences. Nothing you don't. TypeScript-first with excellent DX.",
  },
  faq: {
    title: 'Questions & Answers',
    description:
      "Learn more about FlowPilot's headless architecture, Next.js support, TypeScript integration, and bundle size.",
  },
  cta: {
    title: 'Ship Your First Tour Today',
    description:
      'Install FlowPilot, define a flow, and render it with your own UI. No lock-in. No hidden UI. Just the right abstraction.',
  },
};

// Spotlight overlay component
function SpotlightOverlay({ rect }: { rect: { top: number; left: number; width: number; height: number } | null }) {
  if (!rect) return null;

  const padding = 16;
  const borderRadius = 12;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        borderRadius,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
        pointerEvents: 'none',
        transition: 'all 0.3s ease-out',
        zIndex: 9998,
      }}
    />
  );
}

// Tour UI Component (tooltip + controls)
function TourUI() {
  const step = useCurrentStep();
  const flowState = useFlow();
  const { next, prev, skip } = useFlowPilot();
  const target = useTarget();

  if (!step || flowState.status !== 'running' || !target?.rect) return null;

  const targetRect = target.rect; // Type narrowing
  const content = stepContent[step.id];
  const isFirstStep = flowState.currentIndex === 0;
  const isLastStep = flowState.currentIndex === flowState.totalSteps - 1;

  // Position tooltip below the target
  const tooltipTop = targetRect.top + targetRect.height + 24;
  const tooltipLeft = targetRect.left;

  return (
    <>
      {/* Spotlight overlay */}
      <SpotlightOverlay rect={targetRect} />

      {/* Tooltip */}
      <div
        style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          maxWidth: '400px',
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
          zIndex: 9999,
        }}
      >
        <div style={{ marginBottom: '8px', color: '#37322F', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>
          {flowState.currentIndex + 1} / {flowState.totalSteps}
        </div>
        <h3 style={{ margin: 0, marginBottom: '8px', color: '#37322F', fontSize: '20px', fontWeight: 600 }}>
          {content?.title || step.id}
        </h3>
        <p style={{ margin: 0, marginBottom: '24px', color: '#605A57', fontSize: '14px', lineHeight: '1.6' }}>
          {content?.description || 'Explore this section of the landing page.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={skip}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              color: '#605A57',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isFirstStep && (
              <button
                onClick={prev}
                style={{
                  padding: '8px 20px',
                  border: '1px solid rgba(55, 50, 47, 0.2)',
                  borderRadius: '24px',
                  background: 'white',
                  color: '#37322F',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '24px',
                background: '#37322F',
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {isLastStep ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function LandingTourLayer() {
  const { registerFlow } = useFlowPilot();
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!registered) {
      try {
        registerFlow(landingTourFlow);
        setRegistered(true);
      } catch (error) {
        // Flow already registered (e.g., during hot reload or strict mode)
        if (error instanceof Error && error.message.includes('already registered')) {
          setRegistered(true);
        } else {
          console.error('Error registering flow:', error);
        }
      }
    }
  }, [registerFlow, registered]);

  return <TourUI />;
}

export const LandingTourProvider = LandingTourLayer;

// Hook to start the tour from anywhere (e.g., Hero CTA)
export function useStartLandingTour() {
  const { start } = useFlowPilot();
  const flowState = useFlow();

  return useCallback(() => {
    // Only start if flow is idle, completed, or skipped (prevent double-start error)
    if (flowState.status === 'idle' || flowState.status === 'completed' || flowState.status === 'skipped') {
      start('landing-tour');
    } else if (flowState.status === 'running') {
      console.log('[Landing] Tour is already running');
    } else if (flowState.status === 'error') {
      console.warn('[Landing] Tour is in error state - page reload required');
    }
  }, [start, flowState.status]);
}
