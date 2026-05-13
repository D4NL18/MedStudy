---
phase: 20
slug: ajustes-responsividade
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-13
---

# Phase 20 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jasmine + Karma |
| **Config file** | karma.conf.js |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run test -- --watch=false --browsers=ChromeHeadless` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run test -- --watch=false --browsers=ChromeHeadless`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 20-01-01 | 01 | 1 | RESP-01 | — | N/A | unit | `npm run test -- --include src/app/core/layout/shell.component.spec.ts` | ✅ | ⬜ pending |
| 20-01-02 | 01 | 1 | RESP-01 | — | N/A | unit | `npm run test -- --include src/app/features/dashboard/dashboard.component.spec.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsividade | RESP-01 | Media queries e layouts CSS são melhor avaliados visualmente | Abrir a aplicação em um dispositivo móvel ou no Chrome DevTools (modo responsivo) e verificar se o menu hambúrguer funciona e a tabela está empilhada. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
