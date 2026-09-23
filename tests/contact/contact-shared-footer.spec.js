// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shared Header, Footer, and Cross-Page Navigation', () => {
  test('Footer links are present and correctly wired on the contact page', async ({ page }) => {
    const footer = page.locator('#home-footer');

    // 1. Navigate to https://bcparks.ca/contact/ and scroll to the footer
    await page.goto('https://bcparks.ca/contact/');
    await footer.scrollIntoViewIfNeeded();

    // expect: Footer columns 'Get a permit', 'Get involved', and 'Stay connected' are visible with their respective links
    await expect(footer.getByText('Get a permit')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Park-use permits' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Filming in parks' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Travel trade' })).toBeVisible();

    await expect(footer.getByText('Get involved')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Donate' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Buy a licence plate' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Volunteer' })).toBeVisible();

    await expect(footer.getByText('Stay connected')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Contact us' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'BC Parks blog' })).toBeVisible();

    // expect: Legal links 'Site map', 'Disclaimer', 'Privacy', 'Accessibility', 'Copyright' are visible
    await expect(page.getByRole('link', { name: 'Site map' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Disclaimer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Accessibility', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Copyright' })).toBeVisible();

    // 2. Click the footer 'Contact us' link (under 'Stay connected')
    await footer.getByRole('link', { name: 'Contact us' }).click();

    // expect: Navigates to /contact/ (reloads the same contact page) without error
    await expect(page).toHaveURL('https://bcparks.ca/contact/');
    await expect(page.getByRole('heading', { name: 'Contact BC Parks' })).toBeVisible();

    // 3. Click the footer BC Parks Wordmark/logo link
    await page.getByRole('link', { name: 'BC Parks Wordmark' }).click();

    // expect: Navigates to the BC Parks home page ('/')
    await expect(page).toHaveURL('https://bcparks.ca/');

    // 4. Verify footer Facebook and Instagram icon links
    await page.goto('https://bcparks.ca/contact/');
    const followUs = page.locator('#follow-us');
    const footerFacebookHref = await footer.getByRole('link', { name: 'Facebook' }).getAttribute('href');
    const followUsFacebookHref = await followUs.getByRole('link', { name: 'Facebook' }).getAttribute('href');
    const footerInstagramHref = await footer.getByRole('link', { name: 'Instagram' }).getAttribute('href');
    const followUsInstagramHref = await followUs.getByRole('link', { name: 'Instagram' }).getAttribute('href');

    // expect: Both icon links have hrefs matching the same Facebook/Instagram URLs as the 'Follow us' section links
    expect(footerFacebookHref).toBe(followUsFacebookHref);
    expect(footerInstagramHref).toBe(followUsInstagramHref);
  });

  test('First Nations territorial acknowledgement is displayed', async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/ and scroll just above the footer
    await page.goto('https://bcparks.ca/contact/');
    const acknowledgement = page.getByText(
      'We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.'
    );
    await acknowledgement.scrollIntoViewIfNeeded();

    // expect: The territorial acknowledgement statement about First Nations is visible and readable in full, above the footer contentinfo region
    await expect(acknowledgement).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
