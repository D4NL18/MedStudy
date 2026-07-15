# Phase 40: Modelo de Assinaturas & Motor de Trial Freemium no Backend - Technical Research

**Researched:** 2026-07-14
**Phase:** 40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend

## Technical Analysis & Architecture

### 1. JPA Entities & Schema Mapping (`subscriptions` & `pix_transactions`)
- **Table `subscriptions`**:
  - `id` UUID (`@GeneratedValue`)
  - `user_id` UUID (`@OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false)`)
  - `status` Enum (`SubscriptionStatus`: `TRIAL`, `ACTIVE`, `EXPIRED`, `LIFETIME`)
  - `trial_start_date` `Instant` (UTC, default `now()`)
  - `trial_end_date` `Instant` (UTC, default `now() + 30 days`)
  - `current_period_start` `Instant` (nullable)
  - `current_period_end` `Instant` (nullable)
  - `is_admin_override` `boolean` (default `false`)
  - `notes` `String`
- **Table `pix_transactions`**:
  - `id` UUID
  - `user_id` UUID
  - `subscription_id` UUID
  - `txid` `String` (unique index, length 50)
  - `e2e_id` `String` (unique index, length 100)
  - `amount` `BigDecimal` (scale 2)
  - `status` Enum (`PixStatus`: `CREATED`, `PAID`, `EXPIRED`, `CANCELLED`)
  - `pix_copia_e_cola` `String` (TEXT)
  - `qr_code_base64` `String` (TEXT)
  - `expiration_date` `Instant`
  - `paid_at` `Instant`
- **Database Indexes**:
  - `idx_subscriptions_user_id` on `subscriptions(user_id)`
  - `idx_subscriptions_status_end_dates` on `subscriptions(status, trial_end_date, current_period_end)`

### 2. Spring Security `SubscriptionStatusFilter`
- **Class Implementation**: Extends `OncePerRequestFilter`.
- **Filter Order**: Inserted in `SecurityConfig` via `.addFilterAfter(subscriptionStatusFilter, JwtAuthenticationFilter.class)`.
- **Exempt Routes Matrix**:
  - `/api/v1/auth/**` (login, register, refresh, logout)
  - `/api/v1/subscriptions/**` (plans, checkout, status check)
  - `/api/v1/webhooks/**` (bank callbacks)
  - `/swagger-ui/**`, `/v3/api-docs/**`
- **Blocked Response Payload**:
  - Status Code: `402 Payment Required` (`HttpServletResponse.SC_PAYMENT_REQUIRED` / 402)
  - Header: `Content-Type: application/json`
  - JSON Body:
    ```json
    {
      "code": "PAYWALL_REQUIRED",
      "message": "Assinatura ou período de teste expirado",
      "expiredAt": "2026-07-14T00:00:00Z",
      "status": "EXPIRED"
    }
    ```

### 3. Caching Strategy (Spring Cache + Caffeine)
- Dependency: `org.springframework.boot:spring-boot-starter-cache` + `com.github.ben-manes.caffeine:caffeine`.
- Cache Name: `subscriptionStatusCache`.
- Key: `user.getId()`.
- TTL: 5 minutos (evita acessos repetitivos ao banco durante navegação ativa, enquanto garante atualização rápida em mudanças).
- Invalidação: `@CacheEvict(value = "subscriptionStatusCache", key = "#userId")` chamado ao processar pagamentos ou alterar status manualmente.

### 4. Background Scheduler (`@EnableScheduling`)
- Component: `SubscriptionSchedulerService`.
- Cron: `@Scheduled(cron = "0 0 0 * * *", zone = "UTC")` (executa todo dia à 00:00:00 UTC).
- Batch Processing: Query `SubscriptionRepository.findExpiredActiveOrTrialSubscriptions(Instant.now())` atualizando em lotes o status para `EXPIRED` e invalidando os caches em memória.

---

## Validation Architecture (Nyquist Validation)

To ensure high reliability and zero regressions, tests for Phase 40 MUST cover:
1. **Unit Tests**:
   - `SubscriptionStatusFilterTest`: Verifies bypass for `/auth/**` and `/subscriptions/**`, 402 JSON payload generation for expired users, and PassThrough for active/trial users.
   - `UserServiceRegisterTest`: Verifies 30-day `TRIAL` creation upon user registration.
   - `SubscriptionSchedulerServiceTest`: Verifies database query and batch transition of expired accounts to `EXPIRED`.
2. **Integration Tests (`@SpringBootTest` + `MockMvc`)**:
   - `FreemiumPaywallIntegrationTest`:
     - Test A: Registered user within 30 days accesses `/api/v1/decks` -> HTTP 200 OK.
     - Test B: User with `trial_end_date` in the past accesses `/api/v1/decks` -> HTTP 402 Payment Required + `PAYWALL_REQUIRED` JSON body.
     - Test C: Expired user accesses `/api/v1/subscriptions/plans` -> HTTP 200 OK (Exempt route).

---

## Pattern Map & Analogues

| Role | Existing Analogue | Target Component |
|------|-------------------|------------------|
| Security Filter | `JwtAuthenticationFilter.java` | `SubscriptionStatusFilter.java` |
| Error Handler | `CustomAccessDeniedHandler.java` | `SubscriptionStatusFilter.java` (Direct response writer) |
| Scheduling | `@EnableScheduling` setup | `SubscriptionSchedulerService.java` |
