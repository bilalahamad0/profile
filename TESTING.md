# QA & Testing Suite Documentation

This document provides instructions on how to use the automated testing and security validation pipeline for the portfolio website.

## 1. Unit & Integration Testing
We use **Vitest** combined with **React Testing Library** for our unit and integration tests. Vitest was chosen over Jest for its superior performance and native ESM support with Vite/Next.js.

- **Run all tests:** `npm run test` inside the `resume-site` directory.
- **Run tests in watch mode:** `npx vitest`
- **View Coverage:** `npm run test:coverage`
  - A global threshold is set to 85%. If coverage falls below this, the CI pipeline will fail.
  - HTML reports are generated in the `coverage/` directory.

## 2. End-to-End (E2E) & System Testing
**Playwright** is configured to run end-to-end tests simulating real user interactions across Chromium, Firefox, WebKit, and mobile emulators.

- **Run E2E tests:** `npx playwright test` inside the `resume-site` directory.
- **View trace/HTML report:** `npx playwright show-report`
- **UI Mode:** `npx playwright test --ui`

## 3. Accessibility & Performance
- **Accessibility:** Playwright runs `@axe-core/playwright` during E2E tests to scan for WCAG violations.
- **Performance:** Ensure you monitor performance locally by running a production build and testing via Chrome's Lighthouse tab.

## 4. Visual Regression Testing
We use **Lost-Pixel** for visual regression testing. This helps detect unintended CSS or layout shifts by comparing UI snapshots against a baseline.

- **Generate local baselines:** `npx lost-pixel` (will save snapshots to `.lostpixel/baseline`)
- In CI, this runs automatically against the preview/build URL.

## 5. Security & Vulnerability Scanning
- **Dependabot:** Configured to check for vulnerable npm and GitHub Actions dependencies weekly.
- **CodeQL (GHAS):** Static Analysis Security Testing (SAST) runs automatically on PRs and weekly to detect code patterns that may lead to vulnerabilities.
- **Content Security Policy (CSP):** Strict security headers (CSP, HSTS, X-Frame-Options) are enforced via Next.js `next.config.ts`.

## 6. CI/CD Pipeline
The primary workflow is located in `.github/workflows/ci.yml`. It triggers on every `push` and `pull_request` to the `main` or `master` branches.

**The Pipeline Stages:**
1. **Lint & Unit Tests:** Runs ESLint and checks the 85% coverage threshold using Vitest.
2. **Playwright E2E & A11y:** Installs browsers and runs full E2E journeys.
3. **Visual Regression:** Builds the Next.js app and runs Lost-Pixel visual tests.
4. **CodeQL:** Runs independently to scan for security vulnerabilities.

A failed stage will block merging to the production branch.
