// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Get a Quick Answer Links', () => {
  test("All 'How to reserve camping' links navigate to the correct reservation pages", async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click the 'Frontcountry camping' link
    await page.getByRole('link', { name: 'Frontcountry camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/frontcountry-camping/);
    await expect(page).toHaveTitle(/Frontcountry camping/);

    // 3. Go back to the contact page and click the 'Group camping' link
    await page.goto('https://bcparks.ca/contact/');
    await page.getByRole('link', { name: 'Group camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/group-camping/);
    await expect(page).toHaveTitle(/Group camping/);

    // 4. Go back to the contact page and click the 'Backcountry camping' link
    await page.goto('https://bcparks.ca/contact/');
    await page.getByRole('link', { name: 'Backcountry camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/backcountry-camping/);
    await expect(page).toHaveTitle(/Backcountry camping/);
  });

  test("All 'Camping policies' links navigate to the correct destinations", async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click 'Changes, cancellations, and refunds'
    await page.locator('role=link[name="Changes, cancellations, and refunds"]').click();
    await expect(page).toHaveURL(/\/reservations\/cancellations-refunds/);

    // 3. Go back and click 'Party size and number of vehicles'
    await page.goto('https://bcparks.ca/contact/');
    await page.locator('role=link[name="Party size and number of vehicles"]').click();
    await expect(page).toHaveURL('https://bcparks.ca/reservations/frontcountry-camping/#page-section-19');
    await expect(page.getByRole('heading', { name: 'Party size and vehicles' })).toBeVisible();

    // 4. Go back and click 'Generator use'
    await page.goto('https://bcparks.ca/contact/');
    await page.locator('role=link[name="Generator use"]').click();
    await expect(page).toHaveURL('https://bcparks.ca/plan-your-trip/visit-responsibly/responsible-recreation/#page-section-161');
  });

  test("All 'Popular topics' links navigate to the correct destinations", async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click '2026 fee changes'
    await page.locator('role=link[name="2026 fee changes"]').click();
    await expect(page).toHaveURL('https://bcparks.ca/reservations/camping-fees/#2026-fee-changes');

    // 3. Go back and click 'Day-use passes'
    await page.goto('https://bcparks.ca/contact/');
    await page.locator('role=link[name="Day-use passes"]').click();
    await expect(page).toHaveURL(/\/reservations\/day-use-passes/);
    await expect(page).toHaveTitle(/Day-use passes/);

    // 4. Go back and click 'Drones'
    await page.goto('https://bcparks.ca/contact/');
    await page.locator('role=link[name="Drones"]').click();
    await expect(page).toHaveURL('https://bcparks.ca/plan-your-trip/visit-responsibly/responsible-recreation/#page-section-166');
  });

  test("No 'Get a quick answer' link is broken (no 404s / dead links)", async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Collect the href of every link within the 'Get a quick answer' section
    const quickAnswerLinks = page.locator('#get-a-quick-answer a');
    await expect(quickAnswerLinks).toHaveCount(9);
    const linkCount = await quickAnswerLinks.count();
    const hrefs = [];
    for (let i = 0; i < linkCount; i++) {
      hrefs.push(await quickAnswerLinks.nth(i).getAttribute('href'));
    }
    expect(hrefs).toEqual([
      '/reservations/frontcountry-camping',
      '/reservations/group-camping',
      '/reservations/backcountry-camping',
      '/reservations/cancellations-refunds',
      '/reservations/frontcountry-camping#page-section-19',
      '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-161',
      '/reservations/camping-fees/#2026-fee-changes',
      '/reservations/day-use-passes',
      '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-166',
    ]);

    // 3. Issue a request (or navigate) to each collected href in turn
    for (const href of hrefs) {
      const url = new URL(href, 'https://bcparks.ca').toString();
      const response = await page.request.get(url);
      expect(response.ok(), `Expected ${url} to respond successfully`).toBeTruthy();
      expect(response.status(), `Expected ${url} to not be a 404/500`).toBeLessThan(400);
    }
  });
});
