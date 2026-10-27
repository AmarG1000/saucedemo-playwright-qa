import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.getByTestId('inventory-item');
  }

  async itemNames(): Promise<string[]> {
    return this.cartItems.getByTestId('inventory-item-name').allTextContents();
  }

  async itemPrices(): Promise<string[]> {
    return this.cartItems.getByTestId('inventory-item-price').allTextContents();
  }

  async removeItem(name: string): Promise<void> {
    const item = this.cartItems.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
    await item.getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByTestId('continue-shopping').click();
  }

  async checkout(): Promise<void> {
    await this.page.getByTestId('checkout').click();
  }
}
