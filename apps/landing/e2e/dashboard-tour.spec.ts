import { expect, test } from "@playwright/test"

test.describe("dashboard FlowPilot demo", () => {
  test("auto-starts and moves through the guided steps", async ({ page }) => {
    await page.goto("/dashboard")

    const tooltip = page.getByTestId("dashboard-tour-tooltip")

    await expect(tooltip).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Start at the navigation frame" })
    ).toBeVisible()
    await expect(page.getByText("Step 1 of 5")).toBeVisible()

    await tooltip
      .getByRole("button", { name: "Next" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await expect(
      page.getByRole("heading", { name: "Move through the KPI summary" })
    ).toBeVisible()
    await expect(page.getByText("Step 2 of 5")).toBeVisible()

    await tooltip
      .getByRole("button", { name: "Back" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await expect(
      page.getByRole("heading", { name: "Start at the navigation frame" })
    ).toBeVisible()
    await expect(page.getByText("Step 1 of 5")).toBeVisible()
  })

  test("can skip and replay the dashboard tour", async ({ page }) => {
    await page.goto("/dashboard")

    const tooltip = page.getByTestId("dashboard-tour-tooltip")

    await expect(tooltip).toBeVisible()
    await tooltip
      .getByRole("button", { name: "Skip" })
      .evaluate((node) => (node as HTMLButtonElement).click())

    await expect(page.getByText("Dashboard demo complete")).toBeVisible()

    await page.getByTestId("dashboard-tour-replay").click()
    await expect(page.getByTestId("dashboard-tour-tooltip")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Start at the navigation frame" })
    ).toBeVisible()
  })

  test("can complete and replay the dashboard tour", async ({ page }) => {
    await page.goto("/dashboard")

    const tooltip = page.getByTestId("dashboard-tour-tooltip")

    await expect(tooltip).toBeVisible()

    await tooltip
      .getByRole("button", { name: "Next" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await tooltip
      .getByRole("button", { name: "Next" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await tooltip
      .getByRole("button", { name: "Next" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await tooltip
      .getByRole("button", { name: "Next" })
      .evaluate((node) => (node as HTMLButtonElement).click())
    await tooltip
      .getByRole("button", { name: "Finish" })
      .evaluate((node) => (node as HTMLButtonElement).click())

    await expect(page.getByText("Dashboard demo complete")).toBeVisible()

    await page.getByTestId("dashboard-tour-replay").click()
    await expect(page.getByTestId("dashboard-tour-tooltip")).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Start at the navigation frame" })
    ).toBeVisible()
  })
})
