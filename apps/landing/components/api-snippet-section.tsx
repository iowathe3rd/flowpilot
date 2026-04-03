"use client"

import { useState } from "react"
import type React from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

const snippets = [
  {
    label: "Installation",
    lang: "bash",
    code: `npm install flowpilot
# or
yarn add flowpilot
# or
pnpm add flowpilot`,
  },
  {
    label: "Basic flow",
    lang: "tsx",
    code: `import { FlowPilotProvider, useFlowPilot } from "flowpilot"

const flow = [
  { id: "step-1", target: "#dashboard-header" },
  { id: "step-2", target: "[data-tour='sidebar']" },
  { id: "step-3", target: "#action-bar" },
]

function App() {
  return (
    <FlowPilotProvider flow={flow}>
      <Dashboard />
    </FlowPilotProvider>
  )
}`,
  },
  {
    label: "useFlowPilot hook",
    lang: "tsx",
    code: `const {
  activeStep,   // current step object | null
  stepIndex,    // 0-based index
  isActive,     // boolean
  start,        // () => void
  next,         // () => void
  prev,         // () => void
  stop,         // () => void
  goTo,         // (id: string) => void
} = useFlowPilot()

// Navigate programmatically
<button onClick={next}>Continue</button>`,
  },
  {
    label: "Events & hooks",
    lang: "tsx",
    code: `<FlowPilotProvider
  flow={flow}
  onFlowStart={() => analytics.track("tour_started")}
  onStepEnter={(step) => console.log("entered", step.id)}
  onStepExit={(step) => console.log("exited", step.id)}
  onFlowComplete={() => markOnboardingDone(userId)}
>
  {children}
</FlowPilotProvider>`,
  },
  {
    label: "Async steps",
    lang: "tsx",
    code: `const flow = [
  {
    id: "analytics",
    target: "#chart-section",
    onBeforeEnter: async () => {
      // Wait for data to load before advancing
      await fetchChartData()
    },
  },
  {
    id: "export",
    target: "#export-btn",
  },
]`,
  },
]

export default function ApiSnippetSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="api" className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-4">
          <Badge
            icon={
              <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3L1 5.5L3 8M9 3L11 5.5L9 8M7 1L5 10" stroke="#37322F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            text="API"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            A minimal, predictable API
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Everything you need to build guided experiences.
            <br />
            Nothing you don&apos;t.
          </div>
        </div>
      </div>

      {/* Code viewer */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative pattern */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden hidden md:block">
          <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 border-l border-r border-[rgba(55,50,47,0.12)] flex flex-col md:flex-row min-h-[420px]">
          {/* Sidebar tabs */}
          <div className="md:w-48 flex flex-row md:flex-col border-b md:border-b-0 md:border-r border-[rgba(55,50,47,0.12)] overflow-x-auto md:overflow-x-visible">
            {snippets.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 px-5 py-4 text-left text-sm font-medium leading-5 font-sans transition-colors border-b md:border-b border-[rgba(55,50,47,0.08)] ${
                  active === i
                    ? "bg-white text-[#37322F] border-l-2 border-l-[#37322F] md:border-l-2"
                    : "text-[#605A57] hover:text-[#37322F] hover:bg-[rgba(55,50,47,0.02)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Code panel */}
          <div className="flex-1 bg-[#2B2621] p-6 md:p-8 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.12)]" />
              <span className="ml-2 text-[rgba(255,255,255,0.30)] text-xs font-mono">{snippets[active].lang}</span>
            </div>
            <pre className="text-[#D4CFC9] text-[12.5px] leading-[1.7] font-mono whitespace-pre overflow-x-auto">
              {snippets[active].code}
            </pre>
          </div>
        </div>

        {/* Right decorative pattern */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden hidden md:block">
          <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 200 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
