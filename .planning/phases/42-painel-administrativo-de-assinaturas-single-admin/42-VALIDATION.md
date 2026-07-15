# Phase 42 Validation Strategy — Painel Administrativo de Assinaturas (Single Admin)

## Validation Architecture

### 1. Unit & Controller Tests
- `AdminSubscriptionServiceTest`: Valida os cálculos de estatísticas, totalização da receita PIX, e aplicação dos overrides (+30d, +90d, +365d, LIFETIME, EXPIRED) com gravação de `notes` e limpeza de cache.
- `AdminSubscriptionControllerTest`: Valida a restrição de acesso por `@PreAuthorize("hasRole('ADMIN')")`, garantindo que usuários normais (`ROLE_USER`) recebam HTTP 403 Forbidden e administradores (`ROLE_ADMIN`) tenham acesso liberado.

### 2. Integration Tests
- `AdminFlowIntegrationTest`:
  - Efetua login como usuário `ROLE_ADMIN`.
  - Requisita `GET /api/admin/subscriptions/stats` -> valida retorno dos 4 cards de estatísticas.
  - Concede acesso manual a um usuário via `POST /api/admin/subscriptions/users/{id}/override` -> verifica transição para `LIFETIME`/`ACTIVE`, flag `isAdminOverride = true` e atualização de `notes`.
  - Requisita relatórios de transações PIX -> verifica a lista paginada.

---

## Acceptance Matrix

| Requisito | Teste Unitário / Integração | Critério de Aceite |
|---|---|---|
| **ADMIN-01** | `AdminSubscriptionControllerTest.nonAdminAccess_ShouldReturn403Forbidden` | Usuários sem role `ROLE_ADMIN` recebem HTTP 403 Forbidden ao tentar acessar endpoints administrativos. |
| **ADMIN-02** | `AdminFlowIntegrationTest.overrideSubscription_ShouldGrantAccessAndEvictCache` | Admin consegue estender/conceder acesso manual com justificativa em `notes`, liberando o paywall do usuário. |
| **ADMIN-03** | `AdminFlowIntegrationTest.getStatsAndTransactions_ShouldReturnAggregatedMetrics` | Endpoints de estatísticas e transações PIX retornam receita em R$, contagem por status e lista paginada de cobranças. |
