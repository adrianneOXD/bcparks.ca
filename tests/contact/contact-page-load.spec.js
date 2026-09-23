// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Page Load and Core Content', () => {
  test('Contact page loads with correct title, heading, and breadcrumb', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    const response = await page.goto('https://bcparks.ca/contact/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle('Contact BC Parks | BC Parks');
    await expect(page.getByRole('heading', { name: 'Contact BC Parks' })).toBeVisible();

    // 2. Inspect the breadcrumb navigation at the top of the content area
    const breadcrumb = page.getByRole('navigation', { name: 'breadcrumb' });
    await expect(breadcrumb).toContainText('Home›Contact');
    const homeBreadcrumbLink = breadcrumb.getByRole('link', { name: 'Home' });
    await expect(homeBreadcrumbLink).toHaveAttribute('href', '/');

    // 3. Click the 'Home' breadcrumb link
    await homeBreadcrumbLink.click();
    await expect(page).toHaveURL('https://bcparks.ca/');
  });

  test('All three main sections and their headings are present', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Locate the 'Get a quick answer' section
    const quickAnswerSection = page.locator('#get-a-quick-answer');
    await expect(quickAnswerSection.getByRole('heading', { name: 'Get a quick answer' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'How to reserve camping' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'Camping policies' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'Popular topics' })).toBeVisible();
    await expect(quickAnswerSection.getByText('If you have a quick question, these links might provide your answer.')).toBeVisible();

    // 3. Locate the 'Contact us' section
    const contactUsSection = page.locator('#contact-us');
    await expect(contactUsSection.getByRole('heading', { name: 'Contact us' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Email' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Phone' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Mail', exact: true })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Contact a campground' })).toBeVisible();

    // 4. Locate the 'Follow us' section
    const followUsSection = page.locator('#follow-us');
    await expect(followUsSection.getByRole('heading', { name: 'Follow us' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'Facebook' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'Instagram' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'BC Parks blog' })).toBeVisible();
  });

  test(`'On this page' table of contents is present on desktop viewport`, async ({ page }) => {
    // 1. Set viewport to a desktop size (e.g. 1280x800) and navigate to https://bcparks.ca/contact/
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('https://bcparks.ca/contact/');
    await expect(page.getByText('On this page')).toBeVisible();
    const getQuickAnswerTocLink = page.getByRole('link', { name: 'Get a quick answer' });
    const contactUsTocLink = page.getByRole('link', { name: 'Contact us' }).first();
    const followUsTocLink = page.getByRole('link', { name: 'Follow us' });
    await expect(getQuickAnswerTocLink).toBeVisible();
    await expect(contactUsTocLink).toBeVisible();
    await expect(followUsTocLink).toBeVisible();

    // 2. Verify the href of each 'On this page' link
    await expect(getQuickAnswerTocLink).toHaveAttribute('href', '#get-a-quick-answer');
    await expect(contactUsTocLink).toHaveAttribute('href', '#contact-us');
    await expect(followUsTocLink).toHaveAttribute('href', '#follow-us');
  });
});
