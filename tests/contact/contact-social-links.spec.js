// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Follow Us / Social Links', () => {
  test('Facebook and Instagram links point to the correct official profiles', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and locate the 'Follow us' section
    await page.goto('https://bcparks.ca/contact/');
    const followUsSection = page.locator('#follow-us');

    // 2. Inspect the 'Facebook' link href
    const facebookLink = followUsSection.getByRole('link', { name: 'Facebook' });
    await expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/YourBCParks/');

    // 3. Inspect the 'Instagram' link href
    const instagramLink = followUsSection.getByRole('link', { name: 'Instagram' });
    await expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/yourbcparks/');

    // 4. Click the 'Facebook' link
    await facebookLink.click();
    await expect(page).toHaveURL(/facebook\.com/);
  });

  test('BC Parks blog link navigates correctly', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click the 'BC Parks blog' link in the 'Follow us' section
    await page.locator('#follow-us').getByRole('link', { name: 'BC Parks blog' }).click();
    await expect(page).toHaveURL('https://engage.gov.bc.ca/bcparksblog/');
  });

  test('Social media moderation policy PDF link opens in a new tab', async ({ page, context }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and scroll to the moderation policy sentence at the bottom of 'Follow us'
    await page.goto('https://bcparks.ca/contact/');
    const followUsSection = page.locator('#follow-us');
    const moderationPolicyLink = followUsSection.getByRole('link', { name: 'social media moderation policy' });
    await expect(moderationPolicyLink).toBeVisible();

    // 2. Inspect the link's target/rel attributes
    await expect(moderationPolicyLink).toHaveAttribute('target', '_blank');
    await expect(moderationPolicyLink).toHaveAttribute('rel', /noopener/);

    // 3. Click the link and capture the new tab/page that opens
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      moderationPolicyLink.click(),
    ]);
    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL('https://nrs.objectstore.gov.bc.ca/kuwyyf/bc_parks_social_media_moderation_policy_101cd4e97e.pdf');
    await expect(page).toHaveURL('https://bcparks.ca/contact/');
  });

  test('Social response-time and moderation disclaimer copy is present', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and read the paragraphs under 'Follow us'
    await page.goto('https://bcparks.ca/contact/');
    const followUsSection = page.locator('#follow-us');
    await expect(followUsSection.getByText('We respond to social media comments on weekdays from 9am to 5pm Pacific Time. We make every effort to respond within a week, but it may take longer during peak summer season. We read every message but, due to high volume, we may not respond to each one.')).toBeVisible();
  });
});
