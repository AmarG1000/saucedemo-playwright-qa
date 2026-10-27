import { test, expect } from '../fixtures/testFixtures';
import { users, checkoutCustomer } from '../test-data/testData';

test.describe('Cart @regression', () => {
test.beforeEach(async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.addProduct('Sauce Labs Backpack');
  await inventoryPage.addProduct('Sauce Labs Bike Light');
  await inventoryPage.openCart();
});

test('shows selected products with names, prices, and quantity one @smoke', async ({ cartPage }) => {
  expect(await cartPage.itemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  expect(await cartPage.itemPrices()).toHaveLength(2);
  await expect(cartPage.cartItems.getByTestId('item-quantity').first()).toHaveText('1');
});

test('removes a product from the cart', async ({ cartPage }) => {
  await cartPage.removeItem('Sauce Labs Backpack');
  expect(await cartPage.itemNames()).toEqual(['Sauce Labs Bike Light']);
});

test('continues shopping and navigates back to inventory', async ({ cartPage, inventoryPage }) => {
  await cartPage.continueShopping();
  await expect(inventoryPage.title).toHaveText('Products');
});

test('navigates to checkout @smoke', async ({ cartPage, page }) => {
  await cartPage.checkout();
  await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
});

test('shows the expected price for each selected product', async ({ cartPage }) => {
  expect(await cartPage.itemPrices()).toEqual(['$29.99', '$9.99']);
});

test('preserves the selected products after continuing shopping', async ({ cartPage, inventoryPage }) => {
  await cartPage.continueShopping();
  await expect(inventoryPage.cartBadge).toHaveText('2');
});

test('removing all items leaves an empty cart and clears the badge', async ({ cartPage, page }) => {
  await cartPage.removeItem('Sauce Labs Backpack');
  await cartPage.removeItem('Sauce Labs Bike Light');
  await expect(cartPage.cartItems).toHaveCount(0);
  await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
});

test('keeps the remaining product after removing another item', async ({ cartPage }) => {
  await cartPage.removeItem('Sauce Labs Backpack');
  expect(await cartPage.itemNames()).toEqual(['Sauce Labs Bike Light']);
});

test('shows each selected cart item with quantity one', async ({ cartPage }) => {
  await expect(cartPage.cartItems.getByTestId('item-quantity')).toHaveText(['1', '1']);
});

test('checkout opens with the chosen items still in the cart', async ({ cartPage, page }) => {
  await cartPage.checkout();
  await page.getByTestId('firstName').fill(checkoutCustomer.firstName);
  await page.getByTestId('lastName').fill(checkoutCustomer.lastName);
  await page.getByTestId('postalCode').fill(checkoutCustomer.postalCode);
  await page.getByTestId('continue').click();
  await expect(page.getByTestId('inventory-item')).toHaveCount(2);
});

test('can return from checkout information to the cart', async ({ cartPage, checkoutPage, page }) => {
  await cartPage.checkout();
  await checkoutPage.cancel();
  await expect(page.getByTestId('title')).toHaveText('Your Cart');
  expect(await cartPage.itemNames()).toHaveLength(2);
});
});
