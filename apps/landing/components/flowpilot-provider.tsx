"use client"

import type { ReactNode } from "react"
import { FlowPilotProvider } from "@flowpilot/react"

export function AppFlowPilotProvider({
  children,
}: {
  children: ReactNode
}) {
  return <FlowPilotProvider>{children}</FlowPilotProvider>
}
