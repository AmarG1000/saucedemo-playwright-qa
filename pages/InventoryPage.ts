import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly productCards: Locator;
  readonly sortSelect: Locator;

  constructor(private readonly page: Page) {
    this.productCards = page.getByTestId('inventory-item');
    this.sortSelect = page.getByTestId('product-sort-container');
  }

  get title(): Locator { return this.page.getByTestId('title'); }
  get cartBadge(): Locator { return this.page.getByTestId('shopping-cart-badge'); }

  async productNames(): Promise<string[]> {
    return this.productCards.getByTestId('inventory-item-name').allTextContents();
  }

  async productPrices(): Promise<string[]> {
    return this.productCards.getByTestId('inventory-item-price').allTextContents();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async addProduct(name: string): Promise<void> {
    const card = this.productCards.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
    await card.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(name: string): Promise<void> {
    const card = this.productCards.filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
    await card.getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByTestId('logout-sidebar-link').click();
  }
}
