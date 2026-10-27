import { test, expect } from '../fixtures/testFixtures';
import { users } from '../test-data/testData';

test.describe('Login @regression', () => {
  test.beforeEach(async ({ loginPage }) => loginPage.goto());

  test('logs in with valid credentials @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('rejects an invalid username and password', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('requires a username when credentials are empty', async ({ loginPage }) => {
    await loginPage.submit();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('requires a password after a username is entered', async ({ loginPage }) => {
    await loginPage.username.fill(users.standard.username);
    await loginPage.submit();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('shows the locked-out user error', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('logs out successfully @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.logout();
    await expect(loginPage.username).toBeVisible();
  });

  test('masks password characters while typing', async ({ loginPage }) => {
    await expect(loginPage.password).toHaveAttribute('type', 'password');
    await loginPage.password.fill(users.standard.password);
    await expect(loginPage.password).toHaveAttribute('type', 'password');
  });

  test('rejects a valid username with an incorrect password', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, users.invalid.password);
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('rejects usernames with different letter casing', async ({ loginPage }) => {
    await loginPage.login(users.standard.username.toUpperCase(), users.standard.password);
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('allows the user to dismiss a login error', async ({ loginPage, page }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await page.getByTestId('error-button').click();
    await expect(loginPage.errorMessage).toBeHidden();
  });

  test('keeps the login form available after invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.username).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  test('rejects a locked user even with the demo password', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
