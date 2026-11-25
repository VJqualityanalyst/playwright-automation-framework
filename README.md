# Playwright Framework Setup (TypeScript)
[![Playwright Tests](https://github.com/VJqualityanalyst/playwright-automation-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/VJqualityanalyst/playwright-automation-framework/actions/workflows/playwright.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

A beginner-friendly, step-by-step guide to setting up a Playwright test framework from scratch with **TypeScript** and **environment configuration**.

Every step tells you what to type, why you need it, and what you should see when it works.

> [!TIP]
> Sections marked **📖 Learn more** are optional deep dives. Skip them on your first read and come back later.

## 📚 Guides

| Guide | What you'll learn |
| --- | --- |
| **This README** | Set up the framework from an empty folder |
| [Page Object Model](docs/page-object-model.md) | Organize tests with page objects, and write the first login tests |
| [Running tests and reports](docs/running-tests-and-reports.md) | UI Mode, running some tests, reading the HTML report |
| [GitHub Actions (CI)](docs/github-actions-ci.md) | Run tests automatically on every push |

---

## Table of Contents

- [What's in this repo](#whats-in-this-repo)
- [Quick Start (run this repo)](#quick-start-run-this-repo)
- [Prerequisites](#prerequisites)
- [Part 1: npm and npx in 2 minutes](#part-1-npm-and-npx-in-2-minutes)
- [Part 2: Build the framework step by step](#part-2-build-the-framework-step-by-step)
  - [Step 1: Create the project](#step-1-create-the-project)
  - [Step 2: Install Playwright](#step-2-install-playwright)
  - [Step 3: Install the browsers](#step-3-install-the-browsers)
  - [Step 4: Create `.gitignore`](#step-4-create-gitignore)
  - [Step 5: Create the folders](#step-5-create-the-folders)
  - [Step 6: Set up TypeScript](#step-6-set-up-typescript)
  - [Step 7: Set up environments](#step-7-set-up-environments)
  - [Step 8: Create the Playwright config](#step-8-create-the-playwright-config)
  - [Step 9: Write your first test](#step-9-write-your-first-test)
  - [Step 10: Add scripts](#step-10-add-scripts)
- [Part 3: Understanding the config file](#part-3-understanding-the-config-file)
- [Alternative setup: `npm init playwright@latest`](#alternative-setup-npm-init-playwrightlatest)
- [Troubleshooting](#troubleshooting)
- [Command cheat sheet](#command-cheat-sheet)
- [Next steps](#next-steps)
- [License](#license)

---

## What's in this repo

```
playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml      ← runs the tests on GitHub on every push
├── docs/                       ← guides: POM, running tests, CI
├── src/
│   ├── config/
│   │   └── env.ts              ← reads URL, username, password from .env files
│   ├── fixtures/
│   │   └── pages.ts            ← gives every test ready-made page objects
│   ├── pages/
│   │   ├── LoginPage.ts        ← locators + actions for the login page
│   │   └── InventoryPage.ts    ← locators for the products page
│   ├── tests/
│   │   ├── first.spec.ts       ← your first simple test
│   │   └── login.spec.ts       ← login tests using POM
│   └── utils/                  ← helper functions (for later)
├── .env.example                ← template for environment values (committed)
├── .env.qa                     ← your real values (NOT committed)
├── .gitignore
├── LICENSE
├── package.json
├── package-lock.json
├── playwright.config.ts
└── tsconfig.json
```

The tests run against [Sauce Demo](https://www.saucedemo.com), a free practice site built for test automation.

---

## Quick Start (run this repo)

If you've cloned this repo and just want to see the tests run:

```bash
npm install                     # 1. Install packages
npx playwright install          # 2. Download browsers
cp .env.example .env.qa         # 3. Create your environment file (Windows CMD: copy .env.example .env.qa)
npm test                        # 4. Run the tests
npm run report                  # 5. Open the HTML report
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

Want to understand how it's built? Follow [Part 2](#part-2-build-the-framework-step-by-step) and build it yourself. The login tests are explained in the [Page Object Model guide](docs/page-object-model.md).

---

## Prerequisites

| Tool | Check it's installed | Download |
| --- | --- | --- |
| Node.js 20 or newer (includes npm) | `node -v` and `npm -v` | [nodejs.org](https://nodejs.org/) |
| VS Code (recommended) | — | [code.visualstudio.com](https://code.visualstudio.com/) |
| Git | `git --version` | [git-scm.com](https://git-scm.com/) |

> [!TIP]
> Install the **Playwright Test for VS Code** extension. It lets you run and debug tests by clicking ▶ next to each test.

---

## Part 1: npm and npx in 2 minutes

| | **npm** (Node Package Manager) | **npx** (Node Package eXecute) |
| --- | --- | --- |
| What it does | **Installs** packages (ready-made code) into your project | **Runs** a command from a package |
| Phone analogy | Installing an app | Opening the app |
| Example | `npm install @playwright/test` | `npx playwright test` |

**Quick rule:** use **npm** to *add* things to your project, and **npx** to *run* a tool.

<details>
<summary><b>📖 Learn more: npm, npx and <code>init</code></b></summary>

### npm is an app store for code

| App store | npm |
| --- | --- |
| The store | The npm registry, with millions of packages |
| Installing an app | `npm install @playwright/test` |
| Your list of installed apps | `package.json` |
| Where the apps are stored | The `node_modules/` folder |

```bash
npm init                  # Start a new project (creates package.json)
npm install <package>     # Download a package into your project
npm uninstall <package>   # Remove a package
npm run <script>          # Run a script defined in package.json
```

### npx

- If the package is already in your project, npx runs that copy.
- If it isn't installed, npx downloads it to a temporary cache, runs it once, and does **not** add it to your project.

### What does `init` mean?

`init` is short for **initialize**: set something up from the start.

| Command | Meaning |
| --- | --- |
| `git init` | Start a new Git repository |
| `npm init` | Start a new Node project (creates `package.json`) |

### Why `npx playwright test` and not `playwright test`?

Playwright's command is installed in `node_modules/.bin/playwright`. Your terminal doesn't look inside that folder, so `playwright test` fails with **"command not found"**. npx knows to look in `node_modules/.bin`, so `npx playwright test` works.

### `npm run test` vs `npm test` vs `npx playwright test`

| Command | What happens |
| --- | --- |
| `npm run test` | npm opens `package.json`, finds the script named `test`, and runs it |
| `npm test` | Shortcut for `npm run test` |
| `npx playwright test` | Runs Playwright directly, without reading `package.json` scripts |

> [!WARNING]
> **`npx run test` does not work.** npx never reads `scripts`. It treats the first word after `npx` as a tool name, so it looks for a tool called `run` and fails.

</details>

---

## Part 2: Build the framework step by step

### Step 1: Create the project

Create a folder (for example `D:\playwright-framework`), open a terminal **inside it**, and run:

```bash
npm init -y
```

`-y` means **"yes to everything"**: npm skips its questions and uses default values.

✅ **You should see:** a new `package.json` file in your folder.

<details>
<summary><b>📖 Learn more: what's inside <code>package.json</code></b></summary>

```json
{
  "name": "playwright-framework",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```

| Field | Meaning |
| --- | --- |
| `name` | The project name |
| `version` | The project version |
| `description` | A short description |
| `main` | The main JavaScript entry file. Not needed for a test project, so you can delete it |
| `scripts` | Shortcuts for terminal commands (we fill these in during [Step 10](#step-10-add-scripts)) |
| `keywords` | Search words for the npm website. Only useful if you publish the package |
| `author` | Who created the project. ⚠️ Visible to everyone in a public repo |
| `license` | What others may do with your code |
| `type` | How Node reads `.js` files |

#### `license`

| License | Meaning |
| --- | --- |
| `ISC` (npm default) | Anyone can use, change and share it if they keep the copyright notice |
| `MIT` | Almost the same as ISC, and very popular |
| `Apache-2.0` | Similar freedom, plus rules about patents |
| `UNLICENSED` | Nobody gets permission to use it. Common for company projects |

Company projects often add `"private": true`, which makes npm **refuse to publish** the project by accident.

#### `type`: CommonJS vs ES Modules

| | CommonJS | ES Modules (ESM) |
| --- | --- | --- |
| Value | `"commonjs"` | `"module"` |
| Bring code in | `require()` | `import` |
| Send code out | `module.exports` | `export` |
| Age | Node's original system | The official JavaScript standard |

```js
// CommonJS
module.exports = { LoginPage };
const { LoginPage } = require('./loginPage');

// ES Modules
export class LoginPage {}
import { LoginPage } from './loginPage.js';
```

`.cjs` files are always CommonJS and `.mjs` files are always ESM, whatever `type` says.

**For our project:** we write TypeScript with `import`. That works even with `"type": "commonjs"`, because Playwright converts our TypeScript before running it. Keep `commonjs`.

</details>

---

### Step 2: Install Playwright

```bash
npm install --save-dev @playwright/test @types/node
```

| Package | What it is |
| --- | --- |
| `@playwright/test` | The test runner: `test()`, `expect()`, reports, parallel runs |
| `@types/node` | Type descriptions for Node.js, so VS Code understands things like `process.env` |

`--save-dev` saves them as **devDependencies**: packages needed for development and testing.

✅ **You should see:** a `node_modules/` folder, a `package-lock.json` file, and this in `package.json`:

```json
"devDependencies": {
  "@playwright/test": "^1.65.1",
  "@types/node": "^26.6.6"
}
```

> Your version numbers may differ. That's normal: npm installs the latest version available. The `^` means future installs may use a newer **1.x** version, but never **2.0**.

<details>
<summary><b>📖 Learn more: why 2 packages became 5</b></summary>

#### What's in `node_modules/`

```
node_modules/
├── .bin/                 ← command shortcuts (playwright, playwright.cmd, playwright.ps1)
├── @playwright/
│   └── test/             ① you asked for this
├── @types/
│   └── node/             ② you asked for this
├── playwright/           ③ needed by @playwright/test
├── playwright-core/      ④ needed by playwright
└── undici-types/         ⑤ needed by @types/node
```

npm reads each package's own `package.json` and downloads what it needs, round by round, until nothing new is needed:

```
your project
├── @playwright/test 1.65.1        ← Round 1 (you asked)
│   └── playwright 1.65.1          ← Round 2 (it needs this)
│       └── playwright-core 1.65.1 ← Round 3 (it needs this)
└── @types/node 26.6.6             ← Round 1 (you asked)
    └── undici-types 8.9.0         ← Round 2 (it needs this)
```

See this tree yourself with `npm ls --all`.

**Names starting with `@`** are *scoped packages*: `@owner/package-name`. That's why they sit in nested folders.

#### The Playwright layers

| Layer | Package | Job |
| --- | --- | --- |
| Top | `@playwright/test` | The official name you install and import. It just forwards to `playwright` |
| Middle | `playwright` | Test runner: `test()`, `expect()`, workers, retries, HTML report |
| Bottom | `playwright-core` | Engine: start the browser, open pages, click, type, take screenshots |

```
your test  →  @playwright/test  →  playwright  →  playwright-core  →  Chrome
```

The 3 Playwright packages are **locked to exactly the same version**, because they're built and tested together. Install **only** `@playwright/test`. Installing `playwright` separately as well can cause duplicate copies on different versions.

#### `@types/node` and `undici-types`

`@types/node` holds only **type descriptions** (`.d.ts` files), with no code that runs: `fs.d.ts`, `http.d.ts`, `globals.d.ts` and so on. Node's built-in `fetch()` is powered by a library called **Undici**, so its types come from `undici-types`.

#### Why `node_modules` is flat

npm puts every package at the top level when it can (**hoisting**). Shared packages are stored once and folder paths stay short. npm only nests a package when two *different* versions are needed.

#### `package.json` vs `package-lock.json`

| | `package.json` | `package-lock.json` |
| --- | --- | --- |
| Written by | You, with some help from npm | npm only. **Never edit it** |
| Lists | Only the packages you asked for | Every installed package |
| Versions | Ranges, like `^1.65.1` | Exact, like `1.65.1` |
| Purpose | What the project **needs** | What was **actually installed** |
| Commit to Git? | ✅ Yes | ✅ Yes |

</details>

---

### Step 3: Install the browsers

```bash
npx playwright install
```

This downloads **Chromium** (Chrome/Edge engine), **Firefox** and **WebKit** (Safari engine), plus helpers such as FFmpeg for recording videos.

✅ **You should see:** download progress bars, then the command finishes. The first time takes a few minutes (about 500 MB to 1 GB). If the browsers are already on your computer, it finishes almost instantly. That's normal.

> [!TIP]
> In a hurry? `npx playwright install chromium` installs only Chromium, which is all this guide needs.

<details>
<summary><b>📖 Learn more: where browsers are stored</b></summary>

Browsers are **not** stored in your project. They go into a shared folder, so all your projects reuse one download:

| OS | Location |
| --- | --- |
| Windows | `%USERPROFILE%\AppData\Local\ms-playwright\` |
| macOS | `~/Library/Caches/ms-playwright/` |
| Linux | `~/.cache/ms-playwright/` |

Folder names like `chromium-1255` are **build numbers**. Each Playwright version needs specific builds, listed in `node_modules/playwright-core/browsers.json`. Playwright uses its own tested builds, so you don't need Chrome or Firefox installed yourself.

| Command | What it does |
| --- | --- |
| `npx playwright install` | Installs all browsers |
| `npx playwright install chromium` | Installs only Chromium |
| `npx playwright install --with-deps` | Installs browsers plus the system libraries they need (Linux / CI) |
| `npx playwright install --dry-run` | Shows what it would download, without downloading |

</details>

---

### Step 4: Create `.gitignore`

Create a file named `.gitignore` in the project root. It tells Git which files **not** to upload to GitHub:

```gitignore
# Dependencies (recreated by "npm install")
node_modules/

# Playwright output
test-results/
playwright-report/
blob-report/
playwright/.cache/

# Environment files hold URLs, usernames and passwords - never commit them
.env
.env.*
!.env.example
```

The last line (`!`) is an exception: `.env.example` **is** committed, because it's only a template with no real secrets.

---

### Step 5: Create the folders

Create a `src` folder next to `package.json`, and these 5 folders inside it:

| Folder | What goes in it |
| --- | --- |
| `src/tests/` | Test files (`*.spec.ts`) |
| `src/pages/` | Page Object classes |
| `src/fixtures/` | Custom fixtures that give tests ready-made objects |
| `src/config/` | Environment settings |
| `src/utils/` | Helper functions (we'll use this later) |

> [!NOTE]
> Git doesn't upload empty folders. To keep `src/utils/` in the repo before it has any files, add an empty file named `.gitkeep` inside it.

---

### Step 6: Set up TypeScript

Install the TypeScript compiler, which checks your code for mistakes:

```bash
npm install --save-dev typescript
```

Create `tsconfig.json` in the project root:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "preserve",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "playwright.config.ts"]
}
```

| Option | Why |
| --- | --- |
| `strict` | Catches more mistakes, such as a value that might be `undefined` |
| `noEmit` | Only check the code, don't create `.js` files. Playwright runs TypeScript itself |
| `module` / `moduleResolution` | Lets you write `import` without adding file extensions |
| `types: ["node"]` | Makes `process.env` and other Node features known to TypeScript |
| `include` | Which files to check |

> [!NOTE]
> Playwright can run `.ts` files **without** `tsconfig.json`. The file is for **type checking** (`npm run typecheck`) and better suggestions in VS Code.

---

### Step 7: Set up environments

Your tests need a URL, a username and a password. These change between environments (QA, staging, production) and some are secret, so we keep them **out of the code** in `.env` files.

**7.1. Install dotenv**, which reads `.env` files:

```bash
npm install --save-dev dotenv
```

**7.2. Create `.env.example`** in the project root. This template **is** committed to Git:

```bash
# Copy this file to .env.qa (and .env.staging, etc.) and fill in real values.
# Sauce Demo is a public practice site, so these values are safe to share.
BASE_URL=https://www.saucedemo.com
APP_USERNAME=standard_user
APP_PASSWORD=secret_sauce
```

**7.3. Copy it to `.env.qa`**, which holds your real values and is **not** committed:

```bash
cp .env.example .env.qa       # macOS / Linux / Git Bash / PowerShell
copy .env.example .env.qa     # Windows Command Prompt
```

For more environments, create `.env.staging`, `.env.prod` and so on, each with its own values.

**7.4. Create `src/config/env.ts`.** This file loads the right `.env` file and gives the rest of the framework a clean `env` object:

```ts
import dotenv from 'dotenv';
import path from 'path';

// Which environment to run against: qa (default), staging, prod...
// Set it with: npm run test:staging, or TEST_ENV=staging
export const testEnv = process.env.TEST_ENV || 'qa';

// Load values from .env.qa, .env.staging, etc. into process.env
dotenv.config({ path: path.resolve(process.cwd(), `.env.${testEnv}`), quiet: true });

// Read a value, and stop with a clear message if it is missing
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing "${name}". Add it to .env.${testEnv} (copy .env.example to get started).`
    );
  }
  return value;
}

export const env = {
  baseUrl: required('BASE_URL'),
  username: required('APP_USERNAME'),
  password: required('APP_PASSWORD'),
};
```

**How it works:**

```
TEST_ENV=staging  →  loads .env.staging  →  env.baseUrl, env.username, env.password
(not set)         →  loads .env.qa       →  env.baseUrl, env.username, env.password
```

> [!TIP]
> Why `APP_USERNAME` and not `USERNAME`? On Windows, `USERNAME` is already set to your Windows login name, which could quietly replace the value from your `.env` file.

---

### Step 8: Create the Playwright config

Create `playwright.config.ts` in the project root:

```ts
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Uncomment to run on more browsers:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

| Setting | What it does |
| --- | --- |
| `testDir` | Look for tests in `src/tests` |
| `timeout` | Fail a test that takes longer than 30 seconds |
| `fullyParallel` | Run tests at the same time, to finish faster |
| `retries` | Retry failed tests twice on CI, never locally |
| `reporter` | Show results in the terminal (`list`) and create an HTML report |
| `baseURL` | Lets tests write `page.goto('/')` instead of the full URL |
| `testIdAttribute` | Sauce Demo marks elements with `data-test="..."`, so `getByTestId()` reads that attribute |
| `screenshot`, `video`, `trace` | Save evidence when a test fails |
| `projects` | Which browsers to run on |

Full explanation in [Part 3](#part-3-understanding-the-config-file).

---

### Step 9: Write your first test

Create `src/tests/first.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('home page opens', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Swag Labs');
});
```

Line by line:

| Code | Meaning |
| --- | --- |
| `test('home page opens', ...)` | Creates a test with a name |
| `async ({ page })` | Playwright gives the test a fresh browser tab called `page` |
| `await page.goto('/')` | Opens `baseURL` + `/`, so `https://www.saucedemo.com/` |
| `await expect(page).toHaveTitle(...)` | Checks the tab's title. The test fails if it doesn't match |

Run it:

```bash
npx playwright test
```

✅ **You should see:**

```
Running 1 test using 1 worker
  ✓  1 [chromium] › first.spec.ts:3:1 › home page opens (1.2s)

  1 passed
```

🎉 **Your framework works.** One last step: add shortcuts for the commands you'll use every day.

---

### Step 10: Add scripts

Scripts are short names for longer commands. Replace the `scripts` section in `package.json` with:

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "test:debug": "playwright test --debug",
  "test:staging": "cross-env TEST_ENV=staging playwright test",
  "report": "playwright show-report",
  "typecheck": "tsc --noEmit"
}
```

`test:staging` uses **cross-env**, which sets `TEST_ENV` the same way on Windows, macOS and Linux. Install it:

```bash
npm install --save-dev cross-env
```

| Run this | What it does |
| --- | --- |
| `npm test` | Runs all tests with no visible browser (headless) |
| `npm run test:headed` | Runs tests with the browser visible |
| `npm run test:ui` | Opens **UI Mode**: pick tests, watch them run, time-travel through each step |
| `npm run test:debug` | Opens the **Inspector** to go through a test step by step |
| `npm run test:staging` | Runs tests against `.env.staging` |
| `npm run report` | Opens the last HTML report |
| `npm run typecheck` | Checks for TypeScript errors |

> [!TIP]
> **New to Playwright? Start with `npm run test:ui`.** It's the easiest way to see what your tests are doing.

Try it:

```bash
npm test
```

✅ **You should see:** the same result as `npx playwright test` in Step 9.

<details>
<summary><b>📖 Learn more: how scripts work</b></summary>

A script is a **short name for a longer command**. The left side is the name, the right side is the command. npm looks for tools in `node_modules/.bin`, so scripts don't need `npx`.

The `:` in `test:headed` has no special meaning. It's a naming habit that groups related scripts.

npm also runs scripts named `pre<name>` and `post<name>` automatically:

```json
"pretest": "echo Runs first",
"test": "playwright test",
"posttest": "echo Runs only if the tests pass"
```

This is only to explain the idea. You don't need it in this project.

</details>

🎉 **Setup complete.** Next, organize your tests with the [Page Object Model](docs/page-object-model.md).

---

## Part 3: Understanding the config file

The config file is the **settings file** for your whole framework. You write settings **once** instead of typing them every time.

**Without a config file**, you'd type something like this for every run:

```bash
npx playwright test src/tests --project=chromium --retries=2 --workers=4 --reporter=html --timeout=60000
```

**With a config file**, everyone runs `npx playwright test` and gets the **same behavior**: you, your teammates and the CI server.

| Area | Setting | Example | Why it's useful |
| --- | --- | --- | --- |
| **Where** | `testDir` | `'./src/tests'` | Where to find test files |
| **Which browsers** | `projects` | Chromium, Firefox, WebKit, mobile | Test many browsers without changing tests |
| **How long** | `timeout` | `30_000` (30 seconds) | Fail a stuck test instead of waiting forever |
| **Retry** | `retries` | `2` | Run a failed test again, for unstable (flaky) tests |
| **Speed** | `workers`, `fullyParallel` | `4`, `true` | Run tests at the same time |
| **Results** | `reporter` | `'html'`, `'list'`, `'allure-playwright'` | How results are shown |
| **App address** | `use.baseURL` | `'https://www.saucedemo.com'` | Write `page.goto('/')` instead of the full URL |
| **Evidence** | `use.screenshot`, `use.video`, `use.trace` | `'only-on-failure'` | Proof of what went wrong |
| **Browser window** | `use.headless`, `use.viewport` | `false`, `{ width: 1920, height: 1080 }` | Visible browser and screen size |
| **Environment** | `process.env` + `.env` files | QA, staging, production | One framework for every environment |

<details>
<summary><b>📖 Learn more: <code>baseURL</code> and settings priority</b></summary>

### How `baseURL` helps

Without it, every test repeats the full address:

```ts
await page.goto('https://www.saucedemo.com/');
await page.goto('https://www.saucedemo.com/inventory.html');
```

With `baseURL` set:

```ts
await page.goto('/');
await page.goto('/inventory.html');
```

When the app moves from QA to staging, only the `.env` file changes. No test changes.

### Settings priority

When a setting is in several places, the most specific one wins:

```
Command line  >  Config file  >  Playwright defaults
```

So `npx playwright test --headed` shows the browser **for that run only**, and the config file stays unchanged.

</details>

---

## Alternative setup: `npm init playwright@latest`

To start a new project quickly, one command does most of Steps 1–8:

```bash
npm init playwright@latest
```

It asks a few questions (TypeScript or JavaScript, tests folder name, GitHub Actions workflow, install browsers?), then:

- Creates `package.json`, `package-lock.json` and `node_modules/`
- Installs `@playwright/test`
- Creates `playwright.config.ts` with many settings filled in
- Adds an example test
- Updates `.gitignore`
- Optionally adds `.github/workflows/playwright.yml` and downloads the browsers

> [!TIP]
> Build it manually once (this guide) to understand every file. After that, `npm init playwright@latest` is the faster way to start new projects. Then add the `src/` structure and `.env` setup from this guide, and POM from the [Page Object Model guide](docs/page-object-model.md).

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `'npm' is not recognized` / `node: command not found` | Node.js isn't installed or isn't on your PATH. Reinstall Node.js, then **close and reopen** the terminal |
| PowerShell: `npx.ps1 cannot be loaded because running scripts is disabled` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use Command Prompt instead |
| `Error: No tests found` | Check that you're in the project folder, that test files end in `.spec.ts`, and that `testDir` in the config is `./src/tests` |
| `Executable doesn't exist ... Please run npx playwright install` | Browsers aren't downloaded. Run `npx playwright install` |
| `Missing "BASE_URL". Add it to .env.qa` | Create `.env.qa` from the template: `cp .env.example .env.qa` |
| Browser download fails or times out | You may be behind a company proxy. Set `HTTPS_PROXY` (ask your IT team for the value), then try again |
| `Cannot find module '@playwright/test'` | Packages aren't installed. Run `npm install` in the project folder |
| Red underlines in VS Code but tests run fine | Run `npm run typecheck` to see the TypeScript errors, and check `tsconfig.json` exists |
| `npm test -- --grep login` runs all tests (PowerShell) | Use `npx playwright test --grep login` instead |

---

## Command cheat sheet

| Command | Purpose |
| --- | --- |
| `npm install` | Install all packages listed in `package.json` |
| `npx playwright install` | Download the browsers |
| `npm test` | Run all tests |
| `npm run test:headed` | Run tests with the browser visible |
| `npm run test:ui` | Open UI Mode |
| `npm run test:debug` | Step through tests in the Inspector |
| `npm run test:staging` | Run tests against staging |
| `npx playwright test login.spec.ts` | Run one test file |
| `npx playwright test --grep "login"` | Run tests whose name contains "login" |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | Check for TypeScript errors |
| `npx playwright codegen https://www.saucedemo.com` | Record actions in a browser and generate test code |
| `npm ls --all` | Show the full dependency tree |

---

## Next steps

Your framework is set up. Continue with the guides in the [`docs`](docs) folder:

1. **[Page Object Model](docs/page-object-model.md):** create page objects and write the first login tests
2. **[Running tests and reports](docs/running-tests-and-reports.md):** UI Mode, running some tests, the HTML report
3. **[GitHub Actions (CI)](docs/github-actions-ci.md):** run your tests automatically on every push

---

## License

This project is licensed under the [MIT License](LICENSE). You're free to use, change and share it, as long as you keep the copyright notice.
