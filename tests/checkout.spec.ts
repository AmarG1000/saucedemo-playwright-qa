import { test, expect } from '../fixtures/testFixtures';
import { users, checkoutCustomer } from '../test-data/testData';

test.describe('Checkout @regression', () => {
test.beforeEach(async ({ loginPage, inventoryPage, cartPage }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.addProduct('Sauce Labs Backpack');
  await inventoryPage.addProduct('Sauce Labs Bike Light');
  await inventoryPage.openCart();
  await cartPage.checkout();
});

test('validates empty checkout fields in order', async ({ checkoutPage }) => {
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  await checkoutPage.firstName.fill(checkoutCustomer.firstName);
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  await checkoutPage.lastName.fill(checkoutCustomer.lastName);
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
});

test('shows order overview and total, then confirms checkout @smoke', async ({ checkoutPage, page }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
  expect(await checkoutPage.itemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  await expect(checkoutPage.itemTotal).toHaveText('Item total: $39.98');
  await checkoutPage.finish();
  await expect(checkoutPage.confirmation).toHaveText('Thank you for your order!');
});

test('reports the missing first name when other fields are filled', async ({ checkoutPage }) => {
  await checkoutPage.lastName.fill(checkoutCustomer.lastName);
  await checkoutPage.postalCode.fill(checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('First Name is required');
});

test('reports the missing last name', async ({ checkoutPage }) => {
  await checkoutPage.firstName.fill(checkoutCustomer.firstName);
  await checkoutPage.postalCode.fill(checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
});

test('reports the missing postal code', async ({ checkoutPage }) => {
  await checkoutPage.firstName.fill(checkoutCustomer.firstName);
  await checkoutPage.lastName.fill(checkoutCustomer.lastName);
  await checkoutPage.continue();
  await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
});

test('returns from checkout information to the cart', async ({ checkoutPage, page }) => {
  await checkoutPage.cancel();
  await expect(page.getByTestId('title')).toHaveText('Your Cart');
});

test('includes both chosen products in the order summary', async ({ checkoutPage, page }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(page.getByTestId('inventory-item')).toHaveCount(2);
});

test('shows the expected prices for both items in the summary', async ({ checkoutPage, page }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(checkoutPage.summaryItems.getByTestId('inventory-item-price')).toHaveText(['$29.99', '$9.99']);
});

test('calculates tax for the order', async ({ checkoutPage }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(checkoutPage.tax).toHaveText('Tax: $3.20');
});

test('shows the final total including tax', async ({ checkoutPage }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await expect(checkoutPage.total).toHaveText('Total: $43.18');
});

test('cancel from order overview returns to inventory', async ({ checkoutPage, page }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await checkoutPage.cancel();
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('returns to the inventory after completing an order', async ({ checkoutPage, page }) => {
  await checkoutPage.fillCustomer(checkoutCustomer.firstName, checkoutCustomer.lastName, checkoutCustomer.postalCode);
  await checkoutPage.continue();
  await checkoutPage.finish();
  await checkoutPage.backHome();
  await expect(page.getByTestId('title')).toHaveText('Products');
});
});
