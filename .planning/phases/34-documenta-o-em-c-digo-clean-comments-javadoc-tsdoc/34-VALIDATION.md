---
phase: 34
slug: documenta-o-em-c-digo-clean-comments-javadoc-tsdoc
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-11
---

# Phase 34 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest / Karma / JUnit |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run lint` & `mvn checkstyle:check` |
| **Full suite command** | `npm run compodoc` & `mvn javadoc:javadoc` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint` / Check Java syntax
- **After every plan wave:** Run `npm run compodoc` & `mvn javadoc:javadoc`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 34-01-01 | 01 | 1 | DOC-01 | N/A | N/A | lint | `npm run lint` | ✓ | ⚪ pending |
| 34-02-01 | 02 | 1 | DOC-02 | N/A | N/A | build | `mvn javadoc:javadoc` | ✓ | ⚪ pending |

*Status: ⚪ pending | 🟢 green | 🔴 red | 🟡 flaky*

---

## Wave 0 Requirements

- [ ] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Swagger Config | DOC-02 | Needs runtime validation | Launch Spring Boot app and open Swagger UI to verify all descriptions |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
