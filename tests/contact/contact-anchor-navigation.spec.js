// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('In-Page Anchor Navigation', () => {
  test(`Clicking each 'On this page' link scrolls to the corresponding section`, async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ on a desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click the 'Get a quick answer' link in the 'On this page' widget
    await page.getByRole('link', { name: 'Get a quick answer' }).click();
    await expect(page).toHaveURL(/#get-a-quick-answer$/);
    await expect(page.getByRole('heading', { name: 'Get a quick answer' })).toBeVisible();

    // 3. Click the 'Contact us' link in the 'On this page' widget
    await page.getByRole('link', { name: 'Contact us' }).first().click();
    await expect(page).toHaveURL(/#contact-us$/);
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();

    // 4. Click the 'Follow us' link in the 'On this page' widget
    await page.getByRole('link', { name: 'Follow us' }).click();
    await expect(page).toHaveURL(/#follow-us$/);
    await expect(page.getByRole('heading', { name: 'Follow us' })).toBeVisible();
  });

  test('Direct navigation to a page anchor URL scrolls to that section on load', async ({ page }) => {
    // 1. Navigate directly to https://bcparks.ca/contact/#contact-us
    const response = await page.goto('https://bcparks.ca/contact/#contact-us');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();
  });

  test('Navigating to an invalid/unknown anchor does not break the page', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    // 1. Navigate directly to https://bcparks.ca/contact/#does-not-exist
    const response = await page.goto('https://bcparks.ca/contact/#does-not-exist');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Contact BC Parks' })).toBeVisible();
    expect(pageErrors).toHaveLength(0);
  });
});
