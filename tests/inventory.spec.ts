import { test, expect } from '../fixtures/testFixtures';
import { users, expectedProducts } from '../test-data/testData';

test.describe('Inventory @regression', () => {
test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

test('shows the inventory and each product name and price @smoke', async ({ inventoryPage }) => {
  await expect(inventoryPage.title).toHaveText('Products');
  expect(await inventoryPage.productNames()).toEqual(expectedProducts);
  expect(await inventoryPage.productPrices()).toHaveLength(expectedProducts.length);
  await expect(inventoryPage.productCards.getByTestId('inventory-item-price').first()).toContainText('$');
});

test('sorts products by name ascending and descending', async ({ inventoryPage }) => {
  await inventoryPage.sortBy('az');
  expect(await inventoryPage.productNames()).toEqual([...expectedProducts].sort((a, b) => a.localeCompare(b)));
  await inventoryPage.sortBy('za');
  expect(await inventoryPage.productNames()).toEqual([...expectedProducts].sort((a, b) => b.localeCompare(a)));
});

test('sorts products by price ascending and descending', async ({ inventoryPage }) => {
  const getPrices = async () => (await inventoryPage.productPrices()).map((price) => Number(price.replace('$', '')));
  await inventoryPage.sortBy('lohi');
  const ascending = await getPrices();
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
  await inventoryPage.sortBy('hilo');
  const descending = await getPrices();
  expect(descending).toEqual([...descending].sort((a, b) => b - a));
});

test('adds and removes products while updating the cart badge @smoke', async ({ inventoryPage }) => {
  await inventoryPage.addProduct('Sauce Labs Backpack');
  await inventoryPage.addProduct('Sauce Labs Bike Light');
  await expect(inventoryPage.cartBadge).toHaveText('2');
  await inventoryPage.removeProduct('Sauce Labs Backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');
});

for (const productName of expectedProducts) {
  test(`adds ${productName} to the cart`, async ({ inventoryPage, page }) => {
    await inventoryPage.addProduct(productName);
    const card = inventoryPage.productCards.filter({
      has: page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    await expect(card.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
}

for (const productName of expectedProducts) {
  test(`removes ${productName} from the inventory`, async ({ inventoryPage, page }) => {
    await inventoryPage.addProduct(productName);
    await inventoryPage.removeProduct(productName);
    const card = inventoryPage.productCards.filter({
      has: page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
}
});
