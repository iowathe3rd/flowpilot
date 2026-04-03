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

const steps = [
  {
    number: "01",
    title: "Define your flows",
    description:
      "Declare a flow as an ordered array of step objects. Each step has an id, a target selector or ref, and optional async lifecycle hooks. No JSX required at the flow definition layer.",
    code: `const flow = [
  { id: "welcome",  target: "#app-header" },
  { id: "sidebar",  target: "[data-tour='nav']" },
  { id: "actions",  target: "#action-toolbar" },
]`,
  },
  {
    number: "02",
    title: "Attach targets in your UI",
    description:
      "Mark any element in your component tree with a CSS selector, a data attribute, or a React ref. FlowPilot resolves targets at runtime — no wiring required at the component level.",
    code: `// Any existing element works as a target.
// CSS selector:
<nav id="app-nav" data-tour="nav">…</nav>

// Or pass a ref directly to the flow step:
const navRef = useRef(null)
{ id: "sidebar", target: navRef }`,
  },
  {
    number: "03",
    title: "Run the flow",
    description:
      "Call start() from the useFlowPilot hook to begin. FlowPilot manages step state and fires events at every transition. Render whatever UI you want alongside each active step.",
    code: `const { start, activeStep } = useFlowPilot(flow)

// Start from anywhere
<button onClick={() => start()}>
  Begin tour
</button>

// Render your own UI per step
{activeStep && <MyTooltip step={activeStep} />}`,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] flex flex-col justify-start items-center gap-4">
          <Badge
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1v10M1 6h10" stroke="#37322F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            }
            text="How it works"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Three steps to guided UX
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            FlowPilot keeps the surface area small.
            <br />
            Define, attach, run — then bring your own UI.
          </div>
        </div>
      </div>

      {/* Steps */}
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

        <div className="flex-1 border-l border-r border-[rgba(55,50,47,0.12)] flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[rgba(55,50,47,0.12)]">
          {steps.map((step) => (
            <div key={step.number} className="flex-1 p-6 md:p-10 flex flex-col gap-6">
              {/* Step number */}
              <div className="text-[rgba(55,50,47,0.20)] text-4xl font-serif font-normal leading-none select-none">
                {step.number}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[#37322F] text-lg font-semibold leading-6 font-sans">{step.title}</h3>
                <p className="text-[#605A57] text-sm font-normal leading-6 font-sans">{step.description}</p>
              </div>

              {/* Code block */}
              <div className="flex-1 bg-[#2B2621] rounded-lg p-4 overflow-x-auto">
                <pre className="text-[#D4CFC9] text-[11.5px] leading-5 font-mono whitespace-pre">{step.code}</pre>
              </div>
            </div>
          ))}
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
