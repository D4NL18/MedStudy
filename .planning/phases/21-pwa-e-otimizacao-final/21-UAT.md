---
status: complete
phase: 21-pwa-e-otimizacao-final
source: ["21-SUMMARY.md"]
started: "2026-05-18T21:25:00Z"
updated: "2026-05-18T21:25:00Z"
---

## Current Test

[testing complete]

## Tests

### 1. PWA Installation UI
expected: |
  Open the app on an installable environment (Chrome, valid HTTPS/localhost). The "Instalar App" button should appear in the navigation bar (desktop) and side drawer (mobile). Clicking it should trigger the browser's native installation prompt.
result: pass

### 2. Background Updates
expected: |
  When a new version of the app is deployed, the service worker downloads it silently in the background. A console message "MedStudy: Nova versão baixada" should appear, and the new version should apply on next load.
result: pass

### 3. Offline Banner Activation
expected: |
  While using the app, disconnect from the network (or simulate offline in DevTools). A yellow banner saying "Conexão perdida" should immediately appear pinned at the top of the screen. Reconnecting should make it disappear.
result: issue
reported: "nao apareceu nenhum aviso no app sobre a falta de internet"
severity: major

### 4. Offline Data Access (Freshness Strategy)
expected: |
  While offline, navigate to a page with previously loaded API data (e.g., Dashboard). The data should load seamlessly from the service worker cache without errors.
result: pass

### 5. Offline Page Fallback (Connectivity Interceptor)
expected: |
  While offline, try to navigate to a page whose API data wasn't cached, triggering a network error (status 0). The app should automatically intercept the error and redirect you to the `/offline` fallback page displaying "Sem Conexão".
result: skipped
reason: "User wants to fix the Lighthouse issues first"

### 6. Performance & Lazy Loading
expected: |
  Run a Lighthouse report on the production build. The Performance and PWA scores should be > 90, with all routes successfully utilizing lazy loading.
result: issue
reported: "o teste do lighthouse foi muito abaixo (Performance 58, Accessibility 77, Best Practices 81)"
severity: major

## Summary

total: 6
passed: 3
issues: 2
pending: 0
skipped: 1

## Gaps

- truth: "While using the app, disconnect from the network (or simulate offline in DevTools). A yellow banner saying 'Conexão perdida' should immediately appear pinned at the top of the screen. Reconnecting should make it disappear."
  status: diagnosed
  reason: "User reported: nao apareceu nenhum aviso no app sobre a falta de internet"
  severity: major
  test: 3
  root_cause: "OfflineBannerComponent was crashing silently when trying to render because 'WifiOff' was not registered in the LucideAngularModule.pick() registry."
  artifacts: []
  missing:
    - "Add WifiOff and Download icons to app.config.ts"

- truth: "Run a Lighthouse report on the production build. The Performance and PWA scores should be > 90, with all routes successfully utilizing lazy loading."
  status: diagnosed
  reason: "User reported: o teste do lighthouse foi muito abaixo. Performance score is 58."
  severity: major
  test: 6
  root_cause: "1. Lighthouse was run against a dev server (npm start) without minification or AOT optimization. 2. 'html2canvas' was statically imported in DashboardComponent, inflating the main chunk. 3. Several icon buttons and select fields were missing aria-labels, decreasing accessibility score."
  artifacts: []
  missing:
    - "Refactor html2canvas to be dynamically imported only on PDF generation"
    - "Add aria-labels to buttons and selects in shell, dashboard, and list components"
    - "Add html2canvas to allowedCommonJsDependencies"

