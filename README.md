# SauceDemo QA Automation

A maintainable browser test framework for [SauceDemo](https://www.saucedemo.com/) built with Playwright Test and TypeScript. The suite covers login, product inventory, cart behavior, and checkout using realistic browser interactions and isolated tests.

## Technology

- Node.js and TypeScript
- Playwright Test with Chromium
- `dotenv` for local environment configuration
- GitHub Actions for continuous integration

## Project structure

```text
pages/                 Page objects and reusable UI actions
tests/                 Independent user-flow test scenarios
fixtures/              Per-test page object setup
test-data/             Environment-backed users and test values
utils/env.ts           dotenv loading and required variable checks
.github/workflows/     GitHub Actions workflow
playwright.config.ts   Browser, timeout, report, and diagnostics settings
```

Each page class owns its locators and page-specific actions. Tests compose those actions and keep scenario assertions in the spec files. Playwright fixtures create fresh page objects for each isolated browser context.

## Setup

Use Node.js 22 or newer. Install packages and browser binaries:

```bash
npm ci
npx playwright install chromium
```

Create your local environment file from the safe template:

```bash
cp .env.example .env
```

On Windows PowerShell, use `Copy-Item .env.example .env`. Set `BASE_URL`, `STANDARD_USER`, `STANDARD_PASSWORD`, and `LOCKED_USER` in `.env`. The public SauceDemo accounts use `secret_sauce`; the checked-in `.env.example` is only a template. The local `.env` is ignored by Git. Missing required values stop config loading with a clear error.

## Run the suite

```bash
npm test                 # Headless Chromium suite with HTML and list output
npm run test:headed      # Run with a visible browser
npm run test:smoke       # Run only critical-path cases tagged @smoke
npm run test:smoke:headed # Run the smoke group with a visible browser
npm run test:regression  # Run all regression cases (includes the smoke cases)
npm run test:regression:headed # Run the full regression group headed
npm run test:debug       # Open Playwright Inspector
npm run report           # Open the latest HTML report
npm run typecheck        # TypeScript validation
```

The HTML report is written to `playwright-report/`; test results, traces, and failure screenshots are stored under ignored `test-results/`. The config captures screenshots and video on failure and records traces on retries. Headless Chromium is the default for local and CI runs.

## Test groups and scenarios

The suite has 51 cases tagged for selection. Critical login, inventory, cart, and order completion checks carry `@smoke`. Every case belongs to `@regression`, so the regression command runs the full set including smoke checks.

- Valid, invalid, empty, and partial login; locked account error; logout
- Inventory visibility, product names and prices, all four sort orders, add/remove actions, and cart badge
- Cart contents, quantities, prices, removal, continue shopping, and checkout navigation
- Checkout required-field validation, overview total, and order confirmation

Tests start with a fresh browser context and seed their own state, so they can run independently and in parallel.

## GitHub Actions

The workflow runs on pushes and pull requests, installs Chromium and its Linux dependencies, executes the suite, and uploads the HTML report even when tests fail. Add these repository settings under **Settings → Secrets and variables → Actions**:

- Variable `STANDARD_USER`: `standard_user`
- Variable `LOCKED_USER`: `locked_out_user`
- Secret `STANDARD_PASSWORD`: `secret_sauce`

The workflow supplies the public demo URL directly. The password is read from a GitHub Actions secret; no credentials are embedded in the workflow. Do not commit `.env`.

## AI-assisted maintenance

AI can help draft a scenario from a plain-language acceptance criterion, then map it onto the existing page object methods. For maintenance, provide the failing assertion, Playwright trace or screenshot, and relevant page object. Keep tests grounded in observed UI behavior, review generated selectors and expectations, and run the suite before accepting changes. This framework uses hand-authored Playwright tests and does not use Codegen.

## Troubleshooting

- **Missing environment variable:** copy `.env.example` to `.env` and provide all four values.
- **Browser executable missing:** run `npx playwright install chromium`.
- **Tests cannot reach SauceDemo:** check network access to `https://www.saucedemo.com/` and try again.
- **CI environment validation fails:** confirm the two repository variables and password secret are configured with the exact names above.
- **Inspect a failure:** open `playwright-report/index.html` with `npm run report`; traces and screenshots are available in `test-results/`.

## Publishing

`.env`, `node_modules/`, reports, traces, and test results are excluded from Git. `.env.example` contains only public demo defaults and placeholders for the runtime configuration template. The workspace used to create this project did not include a `.git` repository; initialize one before publishing if needed.
