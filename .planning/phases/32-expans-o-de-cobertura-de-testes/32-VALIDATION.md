---
phase: 32
slug: expans-o-de-cobertura-de-testes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-11
---

# Phase 32 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | backend: jacoco / frontend: karma+jasmine |
| **Config file** | pom.xml / karma.conf.js |
| **Quick run command** | `mvn test` / `ng test --no-watch` |
| **Full suite command** | `mvn clean test jacoco:report jacoco:check` / `ng test --no-watch --code-coverage` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `mvn test` ou `ng test --no-watch` (dependendo do escopo)
- **After every plan wave:** Run `mvn clean test jacoco:report jacoco:check` / `ng test --no-watch --code-coverage`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 32-01-01 | 01 | 1 | REQ-TEST-01 | — | N/A | unit | `mvn test` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `application-test.yml` — setup rate limit 20 req/min para bucket4j
- [ ] `GlobalExceptionHandlerTest.java` — stubs para os testes 400, 401, 403, 404
- [ ] `RateLimitInterceptorTest.java` — stubs para o teste do bucket4j

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| N/A | TEST-01/02 | Todos os casos de uso são cobertos por testes automatizados. | Executar os comandos de teste da suite full. |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
