import { test, expect } from '@playwright/test';

test.describe('Static section landing page - Conservation page test', ()=>{

    const baseURL = 'https://bcparks.ca/';

    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
    });

    test('Go to the conservation page', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Conservation' }).click();
        await page.getByRole('menuitem', { name: 'Conservation', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/');
        await expect(page).toHaveTitle('Conservation - Province of British Columbia | BC Parks');
    });

    test('Check that the page title is visible', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Conservation' }).click();
        await page.getByRole('menuitem', { name: 'Conservation', exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Conservation', exact: true })).toBeVisible();
    });

    test('Check that Find a park search is visibl and working', async ({page})=>{
        await expect(page.locator('div').filter({ hasText: /^Find a parkBy park nameSearch$/ }).first()).toBeVisible();
        await page.getByPlaceholder(' ').click();
        await page.getByPlaceholder(' ').fill('Garibaldi');
        await page.getByLabel('Garibaldi Park').click();
        await expect(page).toHaveURL('https://bcparks.ca/find-a-park/?q=Garibaldi%20Park');
    });

    test('Breadcrumbs are visible and working', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Conservation' }).click();
        await page.getByRole('menuitem', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Home' }).click();
        await page.goBack();
        await expect(page.getByRole('heading', { name: 'Conservation', exact: true })).toBeVisible();
        await expect(page).toHaveURL(baseURL + 'conservation/');
    });

    test('Check the Learn More redirect links are working', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Conservation' }).click();
        await page.getByRole('menuitem', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Conservation resources Learn' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/resources/');
        await expect(page.getByRole('link', { name: 'Conservation', exact: true })).toBeVisible();
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Long-Term Ecological' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/long-term-ecological-monitoring-program/');
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Climate change Learn more' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/climate-change/');
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Impact assessment process' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/impact-assessment-process/');
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Living Lab Program Learn more' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/living-lab-program/');
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Invasive species Learn more' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/invasive-species/');
        await page.getByRole('link', { name: 'Conservation', exact: true }).click();
        await page.getByRole('link', { name: 'Ecological reserves Learn' }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/ecological-reserves/');
    });

});