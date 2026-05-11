---
phase: 13
slug: testes-frontend
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-09
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jasmine / Karma |
| **Config file** | `frontend/karma.conf.js` (Wave 0) |
| **Quick run command** | `npm run test -- --no-watch --include src/app/store/auth/` |
| **Full suite command** | `npm run test -- --no-watch --code-coverage` |
| **Estimated runtime** | ~45 seconds |

---

## Sampling Rate

- **After every task commit:** Run `ng test --no-watch --include {path/to/modified/file}`
- **After every plan wave:** Run `npm run test -- --no-watch --code-coverage`
- **Before `/gsd-verify-work`:** Full suite must be green with 80% coverage
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 0 | TEST-05 | — | N/A | config | `ng generate config karma` | ❌ W0 | ⬜ pending |
| 13-01-02 | 01 | 0 | TEST-05 | — | N/A | install | `npm install --save-dev ng-mocks jasmine-marbles` | ✅ | ⬜ pending |
| 13-02-01 | 01 | 1 | TEST-07 | — | N/A | unit | `ng test --no-watch --include src/app/store/auth/` | ✅ | ⬜ pending |
| 13-03-01 | 01 | 2 | TEST-05 | — | N/A | component | `ng test --no-watch --include src/app/features/auth/` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/karma.conf.js` — config with 80% coverage enforcement
- [ ] `ng-mocks`, `jasmine-marbles` — dev dependencies
- [ ] `frontend/src/app/testing/fixtures/` — base directory for test data

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| N/A | N/A | N/A | All phase behaviors have automated verification. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
