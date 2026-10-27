import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.errorMessage = page.getByTestId('error');
  }

  async goto(): Promise<void> {
    // Locator actions wait for the form; don't block navigation on slow remote assets.
    await this.page.goto('/', { waitUntil: 'commit' });
    await this.username.waitFor({ state: 'visible', timeout: 20_000 });
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.page.getByTestId('login-button').click();
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('login-button').click();
  }
}
