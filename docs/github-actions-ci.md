# Run Tests on GitHub Actions (CI)

[⬅ Back to README](../README.md)


**CI (Continuous Integration)** means your tests run automatically on a server every time you push code, so a broken change is caught straight away, even if you forgot to run the tests yourself.

This repo already has the workflow in [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml). GitHub finds it automatically, so there's nothing to switch on.

## When it runs

| Trigger | When |
| --- | --- |
| `push` | Every push to the `main` branch |
| `pull_request` | Every pull request into `main` |
| `workflow_dispatch` | When you click **Run workflow** on the **Actions** tab |

## What it does

```yaml
steps:
  - uses: actions/checkout@v4                         # 1. Get the code
  - uses: actions/setup-node@v4                       # 2. Install Node.js
  - run: npm ci                                       # 3. Install packages (exact versions from package-lock.json)
  - run: npx playwright install --with-deps chromium  # 4. Install Chromium + Linux libraries
  - run: cp .env.example .env.qa                      # 5. Create the environment file
  - run: npm run typecheck                            # 6. Check TypeScript
  - run: npm test                                     # 7. Run the tests
  - uses: actions/upload-artifact@v4                  # 8. Save the HTML report
```

> [!NOTE]
> **`npm ci` vs `npm install`:** `npm ci` installs **exactly** what's in `package-lock.json` and never changes it. That makes every CI run use the same versions. Use `npm install` on your own machine, and `npm ci` on CI.

On CI, GitHub sets `CI=true`, so the config's `retries: process.env.CI ? 2 : 0` retries failed tests twice there, but never on your machine.

## See the results

1. Push your code to GitHub.
2. Open your repo and click the **Actions** tab.
3. Click the latest run. ✅ green means all tests passed, ❌ red means something failed.
4. To see the HTML report, scroll to **Artifacts** at the bottom of the run, download **playwright-report**, unzip it and open `index.html`.

## Show the status badge

The badge at the top of the [README](../README.md) shows whether the latest run passed. If you copy this framework into your own repo, change `VJqualityanalyst/playwright-automation-framework` in the badge link to your own GitHub username and repo name.

## Using real passwords: GitHub Secrets

Sauce Demo's values are public, so the workflow simply copies `.env.example`. For a **real** application, **never** put passwords in the repo. Store them as GitHub Secrets instead:

1. In your repo, go to **Settings → Secrets and variables → Actions → New repository secret**.
2. Add `BASE_URL`, `APP_USERNAME` and `APP_PASSWORD`.
3. In `playwright.yml`, delete the **Create the environment file** step and give the secrets to the **Run tests** step:

```yaml
      - name: Run tests
        run: npm test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          APP_USERNAME: ${{ secrets.APP_USERNAME }}
          APP_PASSWORD: ${{ secrets.APP_PASSWORD }}
```

This works without any code change: when there's no `.env.qa` file, `src/config/env.ts` reads the values straight from these environment variables. GitHub also hides secret values in the logs.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Run fails on GitHub but tests pass locally | Open the failed run on the **Actions** tab, read the red step's log, and download the **playwright-report** artifact to see screenshots and traces |
| The badge shows "no status" | Check the badge link has your own username and repo name, and that the workflow has run at least once |

---

[⬅ Running tests and reports](running-tests-and-reports.md) &nbsp;|&nbsp; [Back to README](../README.md)
