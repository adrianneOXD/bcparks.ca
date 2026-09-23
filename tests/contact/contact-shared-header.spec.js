// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Shared Header, Footer, and Cross-Page Navigation', () => {
  test(`'Book camping' header button navigates to the camping reservation portal`, async ({ page }) => {
    // 1. Navigate to https://bcparks.ca/contact/
    await page.goto('https://bcparks.ca/contact/');

    // 2. Click the 'Book camping' button in the header
    await page.getByRole('button', { name: 'Book camping button' }).click();

    // expect: Browser navigates to https://camping.bcparks.ca/ and the camping reservation home page loads
    await expect(page).toHaveURL('https://camping.bcparks.ca/');
    await expect(page).toHaveTitle('Home Page');
  });

  test('Main mega-menu navigation items are present and functional from the contact page', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to https://bcparks.ca/contact/ on a desktop viewport
    await page.goto('https://bcparks.ca/contact/');

    // expect: Header navigation menu shows: Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Plan your trip ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();

    // 2. Click 'Find a park' menu item
    // Note: the mega-menu renders a hidden duplicate menuitem (used as the
    // dropdown "header" link) for every top-level nav item, so `.first()`
    // is used to reliably target the visible top-level trigger.
    await page.getByRole('menuitem', { name: 'Find a park' }).first().click();

    // expect: Navigates to (or opens a mega-menu leading to) the Find a Park page/section
    await expect(page).toHaveURL('https://bcparks.ca/find-a-park/');

    // 3. Return to the contact page and hover/click 'Plan your trip'
    await page.goto('https://bcparks.ca/contact/');
    const consoleErrorCountBeforeMenu = consoleErrors.length;
    // `.first()` targets the visible top-level trigger, avoiding the hidden
    // duplicate "menu-header" menuitem that the mega-menu renders inside
    // each dropdown's children wrapper (see comment above).
    const planYourTripMenuItem = page.getByRole('menuitem', { name: 'Plan your trip ' }).first();
    await planYourTripMenuItem.click();

    // expect: A mega-menu / dropdown opens showing related sub-links without console errors
    await expect(page.getByRole('menuitem', { name: 'Active advisories' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Things to do' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Visit responsibly' })).toBeVisible();
    expect(consoleErrors.length).toBe(consoleErrorCountBeforeMenu);

    // 4. Confirm the 'Contact' menu item is styled/marked as the active/current page
    await planYourTripMenuItem.click();

    // expect: 'Contact' item reflects an active/selected state consistent with the current page
    await expect(page.getByRole('menuitem', { name: 'Contact' }).first()).toHaveAttribute('aria-current', 'page');
  });

  test('Mobile hamburger menu opens and closes correctly on the contact page', async ({ page }) => {
    // 1. Set viewport to a mobile size (e.g. 375x812) and navigate to https://bcparks.ca/contact/
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('https://bcparks.ca/contact/');

    // expect: An 'Open menu' hamburger button is visible instead of the full inline menu
    const openMenuButton = page.getByRole('button', { name: 'Open menu' });
    await expect(openMenuButton).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).not.toBeVisible();

    // expect: The 'On this page' TOC widget is not shown (or is otherwise appropriately adapted) on mobile
    await expect(page.getByText('On this page')).not.toBeVisible();

    // 2. Click the 'Open menu' button
    await openMenuButton.click();

    // expect: The navigation menu (Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact) expands and becomes visible/interactable
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Plan your trip ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();

    // 3. Click the menu toggle again (or an equivalent close control)
    const closeMenuButton = page.getByRole('button', { name: 'Close menu' });
    await closeMenuButton.click();

    // expect: The menu collapses/closes back to its initial state
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).not.toBeVisible();
  });
});
