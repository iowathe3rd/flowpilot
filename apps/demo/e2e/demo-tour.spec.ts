import { test, expect } from '@playwright/test';

test.describe('FlowPilot demo tour', () => {
  test('shows initial running state and step details', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'FlowPilot Demo' })).toBeVisible();
    await expect(page.getByText('Status: running')).toBeVisible();
    await expect(page.getByText('Index: 1 / 5')).toBeVisible();
    await expect(page.getByText('Current Step: Welcome')).toBeVisible();
  });

  test('navigates through steps via next', async ({ page }) => {
    await page.goto('/');

    const nextButton = page.getByRole('button', { name: 'Next' });
    await nextButton.click();
    await expect(page.getByText('Index: 2 / 5')).toBeVisible();

    await nextButton.click();
    await expect(page.getByText('Index: 3 / 5')).toBeVisible();

    await nextButton.click();
    await expect(page.getByText('Index: 4 / 5')).toBeVisible();
  });

  test('can skip the tour', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Skip Tour' }).click();
    await expect(page.getByText('Status: skipped')).toBeVisible();
  });
});
