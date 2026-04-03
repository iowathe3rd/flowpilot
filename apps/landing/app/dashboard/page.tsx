import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { DashboardTourLayer } from "@/components/dashboard-tour"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardTourLayer />
      <div id="dashboard-shell-nav">
        <AppSidebar variant="inset" />
      </div>
      <SidebarInset>
        <div id="dashboard-header">
          <SiteHeader />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <section id="dashboard-kpis">
                <SectionCards />
              </section>
              <section id="dashboard-chart" className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </section>
              <section id="dashboard-table">
                <DataTable data={data} />
              </section>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
