---
phase: 40
slug: modelo-de-assinaturas-motor-de-trial-freemium-no-backend
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-14
---

# Phase 40 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | JUnit 5 + Mockito + MockMvc (Spring Boot Test) |
| **Config file** | `backend/pom.xml` |
| **Quick run command** | `./mvnw test -Dtest=*Subscription*` |
| **Full suite command** | `./mvnw test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `./mvnw test -Dtest=*Subscription*`
- **After every plan wave:** Run `./mvnw test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 40-01-01 | 01 | 1 | PAYWALL-01 | T-40-01 | Status inicial TRIAL com 30 dias de validade no banco | unit | `./mvnw test -Dtest=SubscriptionEntityTest` | ❌ W0 | ⬜ pending |
| 40-01-02 | 01 | 1 | PAYWALL-01 | T-40-02 | Inserção de registro de assinatura automática no register | unit | `./mvnw test -Dtest=UserServiceTest` | ✅ | ⬜ pending |
| 40-01-03 | 01 | 2 | PAYWALL-02 | T-40-03 | Scheduler transiciona TRIAL vencido para EXPIRED | unit | `./mvnw test -Dtest=SubscriptionSchedulerServiceTest` | ❌ W0 | ⬜ pending |
| 40-01-04 | 01 | 2 | PAYWALL-02 | T-40-04 | SubscriptionStatusFilter retorna HTTP 402 no JSON de erro | unit/integration | `./mvnw test -Dtest=SubscriptionStatusFilterTest` | ❌ W0 | ⬜ pending |
| 40-01-05 | 01 | 3 | PAYWALL-01..02 | T-40-05 | Endpoints operacionais bloqueados (402) vs Auth/Subscriptions liberados (200) | integration | `./mvnw test -Dtest=FreemiumPaywallIntegrationTest` | ❌ W0 | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `backend/src/test/java/com/medstudy/backend/modules/subscription/SubscriptionEntityTest.java` — Testes unitários do modelo e cálculo de expiração
- [ ] `backend/src/test/java/com/medstudy/backend/modules/subscription/SubscriptionSchedulerServiceTest.java` — Testes unitários do Job Cron
- [ ] `backend/src/test/java/com/medstudy/backend/core/security/SubscriptionStatusFilterTest.java` — Testes unitários do filtro Spring Security
- [ ] `backend/src/test/java/com/medstudy/backend/integration/FreemiumPaywallIntegrationTest.java` — Testes de integração E2E com MockMvc

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-14
