---
phase: 11
slug: frontend-plano-revisao-flashcards
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-08
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jasmine / Karma |
| **Config file** | frontend/karma.conf.js |
| **Quick run command** | `npm test -- --include src/app/features/{aulas,revisao,flashcards}/**` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --include src/app/features/{aulas,revisao,flashcards}/**`
- **After every plan wave:** Run `npm test`
- **Before /gsd-verify-work:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | INFR-06 | — | N/A | setup | `npm test` | ✅ W0 | ⬜ pending |
| 11-02-01 | 01 | 2 | PLAN-01..06 | — | N/A | unit | `npm test` | ❌ W0 | ⬜ pending |
| 11-03-01 | 01 | 2 | REVI-01..07 | — | N/A | unit | `npm test` | ❌ W0 | ⬜ pending |
| 11-04-01 | 01 | 2 | FLSH-01..08 | — | N/A | unit | `npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.spec.ts` — stubs for PLAN-01..06
- [ ] `frontend/src/app/features/revisao/pages/revisao-list/revisao-list.component.spec.ts` — stubs for REVI-01..07
- [ ] `frontend/src/app/features/flashcards/pages/flashcards-list/flashcards-list.component.spec.ts` — stubs for FLSH-01..08
- [ ] `frontend/src/app/features/flashcards/pages/flashcards-study/flashcards-study.component.spec.ts` — stubs for study mode

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Flip card animation | FLSH-04 | Visual/UX | Open study mode, click "Girar" and verify smooth 3D transition. |
| Ctrl+V image paste | FLSH-01 | Interaction | Open flashcard editor, copy an image from clipboard, Ctrl+V in textarea, verify Base64 Markdown insertion. |
| Priority Icons | PLAN-05 | Visual | Verify Diamond/Alta/etc. icons render with correct colors on Lesson list. |

---

## Validation Sign-Off

- [ ] All tasks have <automated> verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
