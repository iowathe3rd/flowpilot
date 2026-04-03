"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import {
  useCurrentStep,
  useFlow,
  useFlowPilot,
  useTarget,
} from "@flowpilot/react"
import type { FlowConfig, Placement, TargetRect } from "@flowpilot/core"

const dashboardTourFlow: FlowConfig = {
  id: "dashboard-tour",
  steps: [
    {
      id: "shell",
      target: "#dashboard-shell-nav",
      placement: "right",
      onMissingTarget: "wait",
      waitForTarget: 2500,
    },
    {
      id: "kpis",
      target: "#dashboard-kpis",
      placement: "bottom",
      onMissingTarget: "wait",
      waitForTarget: 2500,
    },
    {
      id: "chart",
      target: "#dashboard-chart",
      placement: "bottom",
      onMissingTarget: "wait",
      waitForTarget: 2500,
    },
    {
      id: "table",
      target: "#dashboard-table",
      placement: "top",
      onMissingTarget: "wait",
      waitForTarget: 2500,
    },
    {
      id: "finish",
      target: "#dashboard-header",
      placement: "bottom-end",
      onMissingTarget: "skip",
      waitForTarget: 1000,
    },
  ],
}

const stepContent: Record<
  string,
  {
    eyebrow: string
    title: string
    description: string
  }
> = {
  shell: {
    eyebrow: "Workspace shell",
    title: "Start at the navigation frame",
    description:
      "FlowPilot can begin with product orientation, anchoring the tour to the shell before moving into working surfaces.",
  },
  kpis: {
    eyebrow: "Overview",
    title: "Move through the KPI summary",
    description:
      "This step frames the top-line metrics first, so operators understand health before drilling into detail.",
  },
  chart: {
    eyebrow: "Trend exploration",
    title: "Guide attention into the chart",
    description:
      "The tour can shift focus to filters and trends, keeping the active region centered for narration and demos.",
  },
  table: {
    eyebrow: "Action surface",
    title: "Land on the editable table",
    description:
      "Targeting the work area makes it easy to explain inline edits, section management, and task-level actions.",
  },
  finish: {
    eyebrow: "Wrap-up",
    title: "Close the tour cleanly",
    description:
      "End back at the top of the workspace, then replay instantly for another recording take without reloading the page.",
  },
}

function getTooltipStyle(
  rect: TargetRect,
  placement: Placement | undefined
): CSSProperties {
  if (typeof window === "undefined") {
    return {
      top: rect.bottom + 24,
      left: rect.left,
    }
  }

  const width = 360
  const gap = 24
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const clampLeft = (value: number) =>
    Math.min(Math.max(20, value), Math.max(20, viewportWidth - width - 20))

  const centeredLeft = clampLeft(rect.left + rect.width / 2 - width / 2)
  const centeredTop = Math.min(
    Math.max(20, rect.top + rect.height / 2 - 120),
    Math.max(20, viewportHeight - 220)
  )

  switch (placement) {
    case "right":
    case "right-start":
    case "right-end":
      return {
        top: Math.min(rect.top, viewportHeight - 220),
        left: clampLeft(rect.right + gap),
      }
    case "top":
    case "top-start":
    case "top-end":
      return {
        top: Math.max(20, rect.top - 220),
        left:
          placement === "top-start"
            ? clampLeft(rect.left)
            : placement === "top-end"
              ? clampLeft(rect.right - width)
              : centeredLeft,
      }
    case "bottom-end":
      return {
        top: Math.min(rect.bottom + gap, viewportHeight - 220),
        left: clampLeft(rect.right - width),
      }
    case "bottom-start":
      return {
        top: Math.min(rect.bottom + gap, viewportHeight - 220),
        left: clampLeft(rect.left),
      }
    case "center":
      return {
        top: centeredTop,
        left: centeredLeft,
      }
    case "left":
    case "left-start":
    case "left-end":
      return {
        top: Math.min(rect.top, viewportHeight - 220),
        left: clampLeft(rect.left - width - gap),
      }
    case "bottom":
    default:
      return {
        top: Math.min(rect.bottom + gap, viewportHeight - 220),
        left: centeredLeft,
      }
  }
}

function SpotlightOverlay({ rect }: { rect: TargetRect }) {
  const padding = 18
  const radius = 22

  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-slate-950/62 backdrop-blur-[2px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9991] rounded-[22px] border border-white/55 bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_0_0_9999px_rgba(2,6,23,0.62)] transition-all duration-500 ease-out"
        style={{
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          borderRadius: radius,
        }}
      >
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20" />
      </div>
    </>
  )
}

function DashboardTourOverlay() {
  const step = useCurrentStep()
  const flowState = useFlow()
  const { next, prev, skip, start, reset } = useFlowPilot()
  const target = useTarget()
  const [isReplaying, setIsReplaying] = useState(false)

  const isRunning = flowState.flowId === "dashboard-tour" && flowState.status === "running"
  const rect = target?.rect ?? null

  useEffect(() => {
    if (!isRunning || !target?.element || !(target.element instanceof HTMLElement)) {
      return
    }

    target.element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    })
  }, [isRunning, target?.element, step?.id])

  const handleReplay = useCallback(async () => {
    setIsReplaying(true)
    try {
      reset()
      await start("dashboard-tour")
    } finally {
      setIsReplaying(false)
    }
  }, [reset, start])

  const content = step ? stepContent[step.id] : null
  const tooltipStyle = useMemo(() => {
    if (!rect) return null
    return getTooltipStyle(rect, step?.placement)
  }, [rect, step?.placement])

  if (isRunning && step && rect && tooltipStyle && content) {
    const isFirstStep = flowState.currentIndex === 0
    const isLastStep = flowState.currentIndex === flowState.totalSteps - 1

    return (
      <>
        <SpotlightOverlay rect={rect} />
        <div
          className="fixed z-[9992] w-[min(360px,calc(100vw-32px))] rounded-[28px] border border-white/10 bg-slate-950/92 p-5 text-slate-50 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl transition-all duration-300 ease-out"
          data-testid="dashboard-tour-tooltip"
          style={tooltipStyle}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-300/80">
                {content.eyebrow}
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Step {flowState.currentIndex + 1} of {flowState.totalSteps}
              </p>
            </div>
            <button
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5"
              onClick={() => void skip()}
              type="button"
            >
              Skip
            </button>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight">
            {content.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {content.description}
          </p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={isFirstStep}
                onClick={() => void prev()}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-full border border-sky-400/40 bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                onClick={() => void next()}
                type="button"
              >
                {isLastStep ? "Finish" : "Next"}
              </button>
            </div>
            <span className="text-xs text-slate-400">
              FlowPilot demo
            </span>
          </div>
        </div>
      </>
    )
  }

  const showReplay =
    flowState.flowId === "dashboard-tour" &&
    (flowState.status === "completed" || flowState.status === "skipped")

  if (!showReplay) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9992] flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 rounded-full border border-slate-200 bg-white/95 px-5 py-3 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Dashboard demo complete
          </p>
          <p className="text-xs text-slate-500">
            Replay the tour for another recording pass.
          </p>
        </div>
        <button
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
          data-testid="dashboard-tour-replay"
          disabled={isReplaying}
          onClick={() => void handleReplay()}
          type="button"
        >
          {isReplaying ? "Restarting..." : "Replay"}
        </button>
      </div>
    </div>
  )
}

export function DashboardTourLayer() {
  const { registerFlow, start, reset } = useFlowPilot()
  const flowState = useFlow()
  const [registered, setRegistered] = useState(false)
  const autoStartedRef = useRef(false)

  useEffect(() => {
    if (registered) return

    try {
      registerFlow(dashboardTourFlow)
      setRegistered(true)
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("already registered")
      ) {
        setRegistered(true)
        return
      }

      console.error("Failed to register dashboard tour", error)
    }
  }, [registerFlow, registered])

  useEffect(() => {
    if (!registered || autoStartedRef.current) return

    if (flowState.flowId === "dashboard-tour" && flowState.status === "running") {
      autoStartedRef.current = true
      return
    }

    autoStartedRef.current = true

    const boot = async () => {
      if (flowState.flowId && flowState.flowId !== "dashboard-tour") {
        reset()
      }

      await start("dashboard-tour")
    }

    void boot()
  }, [flowState.flowId, registered, reset, start])

  return <DashboardTourOverlay />
}
