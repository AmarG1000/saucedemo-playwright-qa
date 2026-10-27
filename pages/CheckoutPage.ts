import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly errorMessage: Locator;
  readonly summaryItems: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.errorMessage = page.getByTestId('error');
    this.summaryItems = page.getByTestId('inventory-item');
  }

  async fillCustomer(first: string, last: string, postal: string): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
  }

  async continue(): Promise<void> {
    await this.page.getByTestId('continue').click();
  }

  async finish(): Promise<void> {
    await this.page.getByTestId('finish').click();
  }

  async cancel(): Promise<void> {
    await this.page.getByTestId('cancel').click();
  }

  async backHome(): Promise<void> {
    await this.page.getByTestId('back-to-products').click();
  }

  async itemNames(): Promise<string[]> {
    return this.summaryItems.getByTestId('inventory-item-name').allTextContents();
  }

  get itemTotal(): Locator { return this.page.locator('[data-test="subtotal-label"]'); }
  get tax(): Locator { return this.page.locator('[data-test="tax-label"]'); }
  get total(): Locator { return this.page.locator('[data-test="total-label"]'); }
  get confirmation(): Locator { return this.page.getByTestId('complete-header'); }
}
