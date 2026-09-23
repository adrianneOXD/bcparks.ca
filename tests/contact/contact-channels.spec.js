// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Contact Us Section - Direct Contact Channels', () => {
  test('Email contact link has correct mailto address and surrounding copy', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and locate the 'Email' sub-section
    await page.goto('https://bcparks.ca/contact/');
    const contactUsSection = page.locator('#contact-us');
    const emailLink = contactUsSection.getByRole('link', { name: 'parkinfo@gov.bc.ca' });
    await expect(emailLink).toBeVisible();

    // 2. Inspect the href attribute of the email link
    await expect(emailLink).toHaveAttribute('href', 'mailto:parkinfo@gov.bc.ca');

    // 3. Read the paragraph beneath the email link
    await expect(contactUsSection.getByText('We answer emails weekdays from 9am to 5pm Pacific Time. We make every effort to respond within a week, but it may take longer during peak summer season.')).toBeVisible();
  });

  test('Phone numbers have correct tel: links and surrounding copy', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and locate the 'Phone' sub-section
    await page.goto('https://bcparks.ca/contact/');
    const contactUsSection = page.locator('#contact-us');
    const tollFreeLink = contactUsSection.getByRole('link', { name: '1-800-689-9025' });
    const internationalLink = contactUsSection.getByRole('link', { name: '1-519-858-6161' });
    await expect(tollFreeLink).toBeVisible();
    await expect(internationalLink).toBeVisible();

    // 2. Inspect the href of the toll-free number
    await expect(tollFreeLink).toHaveAttribute('href', 'tel:1-800-689-9025');
    await expect(contactUsSection.getByText('1-800-689-9025 (toll free from Canada or the US)')).toBeVisible();

    // 3. Inspect the href of the international number
    await expect(internationalLink).toHaveAttribute('href', 'tel:1-519-858-6161');
    await expect(contactUsSection.getByText('1-519-858-6161 (international)')).toBeVisible();

    // 4. Read the paragraph describing call centre hours and fees
    await expect(contactUsSection.getByText('Our call centre is open from 7am to 7pm Pacific Time. There is a $5 fee for camping reservations, changes, or cancellations made by phone, but no charge for general information calls.')).toBeVisible();
  });

  test('Mailing address is displayed correctly and is plain text (not a broken link)', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and locate the 'Mail' sub-section
    await page.goto('https://bcparks.ca/contact/');
    const contactUsSection = page.locator('#contact-us');
    const mailParagraph = contactUsSection.getByText('BC Parks PO Box 9351 STN Prov Govt Victoria BC V8W 9V1');
    await expect(mailParagraph).toBeVisible();
    await expect(mailParagraph.locator('a')).toHaveCount(0);
  });

  test(`'Contact a campground' guidance links to Find a Park`, async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and locate the 'Contact a campground' sub-section
    await page.goto('https://bcparks.ca/contact/');
    const contactUsSection = page.locator('#contact-us');
    await expect(contactUsSection.getByText(`For lost and found, unexpected arrival delays, and specific campground questions, contact the park operator directly. Contact information is listed under 'contact' on each`)).toBeVisible();
    const parkPageLink = contactUsSection.getByRole('link', { name: 'park page' });
    await expect(parkPageLink).toBeVisible();

    // 2. Click the 'park page' link
    await parkPageLink.click();
    await expect(page).toHaveURL(/\/find-a-park/);
    await expect(page.getByRole('heading', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByText('results')).toBeVisible();
  });
});
