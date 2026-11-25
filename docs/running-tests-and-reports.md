# Running Tests and Reading Reports

[⬅ Back to README](../README.md)

> [!IMPORTANT]
> **Before you start:** finish the [framework setup](../README.md#part-2-build-the-framework-step-by-step) and the [Page Object Model guide](page-object-model.md).

## Ways to run your tests

| Run this | What it does |
| --- | --- |
| `npm test` | Runs all tests with no visible browser (headless) |
| `npm run test:headed` | Runs tests with the browser visible |
| `npm run test:ui` | Opens **UI Mode**: pick tests, watch them run, time-travel through each step |
| `npm run test:debug` | Opens the **Inspector** to go through a test step by step |
| `npm run test:staging` | Runs tests against `.env.staging` |
| `npm run report` | Opens the last HTML report |

> [!TIP]
> **New to Playwright? Start with `npm run test:ui`.** It's the easiest way to see what your tests are doing.

## Run only some tests

```bash
npx playwright test login.spec.ts          # One file
npx playwright test --grep "locked-out"    # Tests whose name contains "locked-out"
npm test -- --grep login                   # Same idea through npm (note the extra --)
```

> [!NOTE]
> In Windows PowerShell, the `--` in `npm test -- --grep login` sometimes gets lost. If that happens, use the `npx playwright test --grep login` form.

## Reading the HTML report

```bash
npm run report
```

The report opens in your browser. Click any test to see each step. For **failed** tests you also get:

| Evidence | Where it comes from |
| --- | --- |
| 📸 Screenshot | `screenshot: 'only-on-failure'` |
| 🎥 Video | `video: 'retain-on-failure'` |
| 🔍 Trace (step-by-step replay with DOM, network, console) | `trace: 'on-first-retry'` |

## Record a test with codegen

Playwright can watch you click through a site and write the test code for you:

```bash
npx playwright codegen https://www.saucedemo.com
```

A browser and a code window open. Everything you do in the browser appears as code you can copy into a test or page object.

---

[⬅ Page Object Model](page-object-model.md) &nbsp;|&nbsp; **Next:** [GitHub Actions (CI) ➡](github-actions-ci.md)
