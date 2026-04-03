"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What does 'headless' mean in the context of FlowPilot?",
    answer:
      "Headless means FlowPilot owns zero UI. It manages flow state, step sequencing, target resolution, and event emission — but renders nothing itself. You bring your own tooltip, modal, popover, or any UI primitive. This lets you match your design system exactly without fighting overrides.",
  },
  {
    question: "How do I attach a step to a DOM element?",
    answer:
      "Each step accepts a `target` property, which can be a CSS selector string, a React ref, or a plain DOM element reference. FlowPilot resolves the target at runtime, so you never need to worry about element mounting order as long as the target exists when the step becomes active.",
  },
  {
    question: "Can I use FlowPilot with controlled state from my own store?",
    answer:
      "Yes. FlowPilot supports both controlled and uncontrolled usage. In controlled mode you pass `activeStep` and `onStepChange` props and manage state yourself — in Redux, Zustand, Jotai, or any state manager. In uncontrolled mode, FlowPilot manages state internally and exposes it via context.",
  },
  {
    question: "How do events and hooks work?",
    answer:
      "FlowPilot fires typed events at every transition: `onFlowStart`, `onStepEnter`, `onStepExit`, and `onFlowComplete`. You can also use the `useFlowPilot` hook to read current step, navigate programmatically, or pause and resume a flow from anywhere in the component tree.",
  },
  {
    question: "Is FlowPilot compatible with server-side rendering (SSR)?",
    answer:
      "Yes. FlowPilot defers all DOM queries to the client and avoids any window/document access during SSR. It is fully compatible with Next.js App Router, Remix, and any other SSR framework. No special configuration is required.",
  },
  {
    question: "Can I run multiple independent flows simultaneously?",
    answer:
      "FlowPilot instances are scoped to a `FlowPilotProvider`. You can mount multiple providers in different subtrees to run independent flows in parallel — for example, a global onboarding tour alongside a contextual feature highlight.",
  },
  {
    question: "How do I handle async steps — e.g. waiting for a network request?",
    answer:
      "Each step accepts an `onBeforeEnter` async callback. FlowPilot waits for the returned promise to resolve before transitioning. This is useful for prefetching data, triggering an animation, or waiting for a UI element to appear after a navigation.",
  },
  {
    question: "What is the bundle size impact?",
    answer:
      "The FlowPilot core is under 3 kB gzipped. There are no runtime dependencies beyond React. Because it is headless, you only pay for the UI components you choose to render — there is no hidden CSS or animation framework bundled with the library.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Practical answers to real implementation questions
            <br className="hidden md:block" />
            about integrating FlowPilot into your app.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
