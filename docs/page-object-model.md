# Page Object Model (POM) and the First Login Tests

[⬅ Back to README](../README.md)

This guide organizes your tests with the **Page Object Model** and writes the first login tests against [Sauce Demo](https://www.saucedemo.com).

> [!IMPORTANT]
> **Before you start:** finish the [framework setup in the README](../README.md#part-2-build-the-framework-step-by-step) (Steps 1–10). This guide uses `src/config/env.ts`, `.env.qa` and `playwright.config.ts` from there.

**Files in this guide:**

| File | Purpose |
| --- | --- |
| [`src/pages/LoginPage.ts`](../src/pages/LoginPage.ts) | Locators and actions for the login page |
| [`src/pages/InventoryPage.ts`](../src/pages/InventoryPage.ts) | Locators for the Products page |
| [`src/fixtures/pages.ts`](../src/fixtures/pages.ts) | Gives every test ready-made page objects |
| [`src/tests/login.spec.ts`](../src/tests/login.spec.ts) | The login tests |

## Contents

- [What is POM and why use it?](#what-is-pom-and-why-use-it)
- [Step 1: Create the Login page object](#step-1-create-the-login-page-object)
- [Step 2: Create the Inventory page object](#step-2-create-the-inventory-page-object)
- [Step 3: Create a fixture](#step-3-create-a-fixture)
- [Step 4: Write the login tests](#step-4-write-the-login-tests)

---

## What is POM and why use it?

The **Page Object Model** means creating **one class per page** of the app. The class holds:

- **Locators**: *where* the elements are (username box, login button)
- **Actions**: *what you can do* on the page (log in)

Tests then use these classes instead of repeating locators everywhere.

**Without POM**, every test repeats the same locators:

```ts
test('valid login', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
});

test('wrong password', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill('standard_user');   // repeated
  await page.locator('[data-test="password"]').fill('wrong');           // repeated
  await page.locator('[data-test="login-button"]').click();             // repeated
});
```

If the login button's locator changes, you fix it in **every test**.

**With POM**, the locator lives in one place:

```ts
test('valid login', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
});
```

If the locator changes, you fix it **once**, in `LoginPage.ts`.

| Benefit | Why it matters |
| --- | --- |
| **One place to fix** | A UI change means one edit, not fifty |
| **Readable tests** | `loginPage.login(...)` reads like a manual test step |
| **Reusable** | Every test that needs to log in uses the same method |
| **Clear roles** | Pages know *where* things are, tests decide *what to check* |

> [!IMPORTANT]
> **Golden rule:** page objects hold locators and actions. **Tests** hold the checks (`expect`). This keeps page objects reusable for both passing and failing scenarios.

---

## Step 1: Create the Login page object

Create `src/pages/LoginPage.ts`:

```ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

| Part | Meaning |
| --- | --- |
| `export class LoginPage` | A class other files can import |
| `readonly ...: Locator` | The page's elements. `readonly` means they can't be changed by mistake |
| `constructor(page: Page)` | Runs when you write `new LoginPage(page)`. It receives the browser tab and sets up the locators |
| `page.getByTestId('username')` | Finds the element with `data-test="username"` (set by `testIdAttribute` in [`playwright.config.ts`](../playwright.config.ts)) |
| `async goto()` | Action: open the login page |
| `async login(username, password)` | Action: fill both fields and click Log in |

> [!TIP]
> Creating a locator doesn't search the page yet. Playwright looks for the element only when you use it (`fill`, `click`, `expect`), and automatically waits for it to appear.

---

## Step 2: Create the Inventory page object

After logging in, Sauce Demo shows the **Products** page. Create `src/pages/InventoryPage.ts`:

```ts
import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
  }
}
```

It's small for now. As you test more of the page (add to cart, sort products), add their locators and actions here.

---

## Step 3: Create a fixture

Without a fixture, every test has to create its page objects:

```ts
test('valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  // ...
});
```

A **fixture** does that for you. Create `src/fixtures/pages.ts`:

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

// "test" now gives every test a ready-made loginPage and inventoryPage
export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
```

| Part | Meaning |
| --- | --- |
| `base.extend<Pages>({...})` | Makes a new `test` that has everything the normal one has, plus our page objects |
| `loginPage: async ({ page }, use) => {...}` | When a test asks for `loginPage`, create it from the test's `page` |
| `await use(...)` | Hands the object to the test |
| `export { expect }` | So tests can import `test` and `expect` from one place |

Now a test just asks for what it needs: `async ({ loginPage, inventoryPage }) => { ... }`.

> [!NOTE]
> Playwright only creates a fixture when a test asks for it. A test that only uses `loginPage` never creates an `InventoryPage`.

---

## Step 4: Write the login tests

Create `src/tests/login.spec.ts`:

```ts
import { test, expect } from '../fixtures/pages';
import { env } from '../config/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can log in', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(env.username, env.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('wrong password shows an error', async ({ loginPage }) => {
    await loginPage.login(env.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match'
    );
  });

  test('locked-out user sees an error', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', env.password);

    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
```

| Part | Meaning |
| --- | --- |
| `import { test, expect } from '../fixtures/pages'` | Use **our** `test`, which includes the page objects, not the one from `@playwright/test` |
| `import { env } from '../config/env'` | Username and password come from `.env.qa`, not hard-coded |
| `test.describe('Login', ...)` | Groups related tests. The report shows them together |
| `test.beforeEach(...)` | Runs before **each** test in the group: open the login page |
| `toHaveURL(/inventory\.html/)` | Checks the URL contains `inventory.html` |
| `toHaveText('Products')` | Checks the page heading is exactly "Products" |
| `toContainText('locked out')` | Checks the error message contains this text |

Run all tests:

```bash
npx playwright test
```

✅ **You should see:**

```
Running 4 tests using 4 workers
  ✓  [chromium] › first.spec.ts › home page opens
  ✓  [chromium] › login.spec.ts › Login › valid user can log in
  ✓  [chromium] › login.spec.ts › Login › wrong password shows an error
  ✓  [chromium] › login.spec.ts › Login › locked-out user sees an error

  4 passed
```

**How the pieces connect:**

```
login.spec.ts        "valid user can log in"         ← WHAT to test
     │ asks for loginPage
     ▼
fixtures/pages.ts    new LoginPage(page)             ← creates page objects
     │
     ▼
pages/LoginPage.ts   usernameInput, login()          ← WHERE things are, HOW to act
     │ uses
     ▼
config/env.ts        env.username, env.password      ← values from .env.qa
     │
     ▼
playwright.config.ts baseURL, browsers, reports      ← HOW to run
```

> [!TIP]
> **Adding a new page?** Follow the same 3 steps:
> 1. Create `src/pages/CartPage.ts` with its locators and actions
> 2. Add `cartPage` to `src/fixtures/pages.ts`
> 3. Use `async ({ cartPage }) => { ... }` in your tests

> [!TIP]
> If a test fails with `Timeout 30000ms exceeded`, the site is slow or a locator is wrong. Run `npm run test:ui` to see exactly where it stops.

---

**Next:** [Running tests and reports ➡](running-tests-and-reports.md)
