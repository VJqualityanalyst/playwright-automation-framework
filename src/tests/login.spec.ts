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
