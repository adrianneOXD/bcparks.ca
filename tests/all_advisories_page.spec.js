import { test, expect } from '@playwright/test';

test.describe('All advisories page tests', ()=>{

    const baseURL = 'https://bcparks.ca/';
    const activeAdvisoriesURL = 'https://bcparks.ca/active-advisories/';
    // const { chromium } = require('@playwright/test');
    const customTimeout = 90000;

    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
    });

    test('Navigate to active advisories page', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.getByText('See all advisories').click();
        await expect(page).toHaveURL(baseURL + 'active-advisories/');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('Verify the breadcrumbs are visible and working', async ({page})=>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('link', { name: 'Home'})).toBeVisible();
        await page.getByRole('link', {name: 'Home'}).click();
        await expect(page).toHaveURL(baseURL);
    });

    test('Verify the h1 is visible', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('h1', {name : 'Active advisories'})).toBeVisible();
    });

    test('Verify the Event search is working', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await page.getByLabel('Select a type').click();
        await page.getByLabel('Select a type').fill('Avalanche', { customTimeout });
        await page.getByRole('option', { name: 'Avalanche', exact: true }).click();
        await page.getByRole('button', { name: 'Search' }).click();
        await expect(page.locator('h1', {name : 'Active advisories | Avalanche'})).toBeVisible();
        await page.getByLabel('Clear').click();
        await expect(page.getByLabel('Select a type')).toBeEmpty();
        await page.getByLabel('Select a type').fill('Fire');
        await page.getByRole('option', { name: 'Wildfire', exact: true }).click();
        await page.getByRole('button', {name :  'Search'}).click();
        await expect(page.locator('h1', {name : 'Active advisories | Fire'})).toBeVisible();
    });

    test('Verify the search filters are working', async ({page})=>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await page.getByRole('checkbox').nth(1).check();
        await page.getByRole('textbox', {name : 'Search'}).fill('Babine');
        await page.getByRole('button', {name : 'Search'}).click();
    });

    test('Verify the park safety advisories legend is visible', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        const highAdvisoryLegendItem = page.locator('.advisory-legend-item').first();
        const mediumAdvisoryLegendItem = page.locator('.advisory-legend-item').nth(1);
        const lowAdvisoryLegendItem = page.locator('.advisory-legend-item').nth(2);

        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await expect(highAdvisoryLegendItem).toBeVisible();
        await expect(highAdvisoryLegendItem).toHaveText('HighImmediate danger and closures');
        await expect(mediumAdvisoryLegendItem).toBeVisible();
        await expect(mediumAdvisoryLegendItem).toHaveText('MediumSafety and health related');
        await expect(lowAdvisoryLegendItem).toBeVisible();
        await expect(lowAdvisoryLegendItem).toHaveText('LowDiscretion and warnings');
    });

    test('Check that all links redirect to the correct pages', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.waitForLoadState('networkidle');
        await page.getByRole('link', { name: 'BC Wildfire Service', exact: true }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/safety/wildfire-status');
        await page.goBack();
        await page.getByRole('link', { name: 'BC River Forecast Centre' }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/environment/air-land-water/water/drought-flooding-dikes-dams/river-forecast-centre');
        await page.goBack();
        await page.locator('a:nth-child(5)').click();
        await expect(page).toHaveURL('https://drivebc.ca/');
    });

    test('Check the land acknowledgment message is visible', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.evaluate(() =>{
            window.scrollBy(0, 5000);
        });
        await expect(page.locator('#home div').filter({ hasText: 'We acknowledge all First' }).nth(1)).toBeVisible();
        await expect(page.locator('#home div').filter({ hasText: 'We acknowledge all First' }).nth(1)).toContainText('We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.')
        await expect(page.getByText('We acknowledge all First')).toBeVisible();
    });

    test('Check the back to top button is working', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByText('See all advisories').click();
        await page.waitForTimeout(5000);
        await page.evaluate(() => {
            window.scrollBy(0, 5000);
        });
        await expect(page.getByLabel('scroll to top')).toBeVisible();
        await page.getByLabel('scroll to top').click();
        await page.waitForTimeout(5000)
        const updatedScrollPosition = await page.evaluate(() => window.scrollY);
        expect(updatedScrollPosition).toBe(0);
        await expect(page.getByLabel('scroll to top')).toBeHidden();
    });
});
   