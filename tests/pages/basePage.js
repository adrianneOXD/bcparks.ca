import { expect } from '@playwright/test';

export class BasePage{
    constructor(page){
        this.page = page;
        this.baseURL = 'https://bcparks.ca/';

    // Booking Camping button
        this.bookingCampingButton = page.getByLabel('Book camping button');

    // Scroll to the Top Button
        this.backToTopButton = page.getByLabel('scroll to top');

    // Land acknowledgement message
        this.landAcknowledgementMessage = page.locator('#home div').filter({ hasText: 'We acknowledge all First' }).nth(1);
    }

    async goto(path = ''){
        await this.page.goto(this.baseURL + path, { timeout: 90000 });
    }

    async waitForLoad(){
        await this.page.waitForLoadState('networkidle');
    }

    // Booking Camping button
    async expectBookingCampingButtonVisible(){
        await expect(this.bookingCampingButton).toBeVisible();
    }

    async clickBookingCampingButton(){
        await this.bookingCampingButton.click();
    }

     // Scroll to the bottom of page
     async scrollToBottom(){
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
     }

    // Scroll to the Top Button
    async expectBackToTopButtonVisible(){
        await expect(this.backToTopButton).toBeVisible();
    }

    async expectBackToTopButtonNotVisible(){
        await expect(this.backToTopButton).not.toBeVisible();
    }

    async clickBackToTopButton(){
        await this.backToTopButton.click();
    }

    // Land acknowledgement message
    async expectLandAcknowledgementMessageVisible(){
        await expect(this.landAcknowledgementMessage).toBeVisible();
    }

    async landAcknowledgementMessageText(){
        await expect(this.landAcknowledgementMessage).toHaveText('We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.');
    }
}