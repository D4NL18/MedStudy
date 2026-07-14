# Phase 42 Research — Painel Administrativo de Assinaturas (Single Admin)

## Objective
Pesquisar a arquitetura dos endpoints de administração no Spring Boot, a segurança declarativa com `@PreAuthorize("hasRole('ADMIN')")`, a agregação de estatísticas e receita total PIX via JPA, e os padrões de componentes e guards em Angular.

---

## 1. Segurança Backend Spring Security

- **Anotação de Método**: `@PreAuthorize("hasRole('ADMIN')")` ativada por `@EnableMethodSecurity` no Spring Security 3+.
- **Garantia de Role**: O JWT retornado traz a role `ROLE_ADMIN` para usuários administradores.
- **Isenção de Paywall para Admins**: O `SubscriptionStatusFilter` ignora requisições de usuários com `ROLE_ADMIN` ou rotas sob `/api/admin/**`.

---

## 2. DTOs & Consultas de Agregação JPA

### 2.1. Endpoints Administrativos
1. `GET /api/admin/subscriptions/stats`:
   - Retorna estatísticas agregadas em tempo real:
     - `activeCount`: número de assinaturas com status `ACTIVE` + `LIFETIME`.
     - `trialCount`: número de assinaturas com status `TRIAL`.
     - `expiredCount`: número de assinaturas com status `EXPIRED`.
     - `totalPixRevenue`: soma total dos valores (`amount`) da tabela `pix_transactions` onde `status = PAID`.

2. `GET /api/admin/subscriptions/users`:
   - Parâmetros: `search` (String), `status` (`SubscriptionStatus`), `page` (int), `size` (int).
   - Retorna lista paginada com dados do usuário, status da assinatura, `trialEndDate`, `currentPeriodEnd`, `isAdminOverride` e `notes`.

3. `POST /api/admin/subscriptions/users/{userId}/override`:
   - Corpo: `AdminOverrideRequestDto` (`overrideOption`, `notes`).
   - Opções: `ADD_30_DAYS`, `ADD_90_DAYS`, `ADD_365_DAYS`, `GRANT_LIFETIME`, `FORCE_EXPIRE`.
   - Atualiza `isAdminOverride = true`, grava o motivo em `notes`, e limpa o cache Caffeine `subscriptionStatusCache`.

4. `GET /api/admin/subscriptions/transactions`:
   - Parâmetros: `status` (`PixStatus`), `page` (int), `size` (int).
   - Retorna histórico de transações PIX paginado.

---

## 3. Frontend Angular & Routing Security

- **`AdminGuard` (`CanActivateFn`)**:
  - Verifica se o sinal de usuário autenticado no `AuthService` possui a role `ROLE_ADMIN`. Se não for admin, redireciona para a página principal (`/`) com notificação de acesso negado.
- **Navegação**:
  - `NavbarComponent` / `SidebarComponent`: exibe o link "Painel Admin" (com ícone `shield` ou `crown`) condicionado a `currentUser()?.role === 'ROLE_ADMIN'`.
- **Componente `AdminSubscriptionsComponent`**:
  - 4 Cards no topo com ícones e gradientes vibrantes (Total Ativos, Em Trial, Expirados, Receita PIX).
  - Controle de abas: "Assinantes" e "Transações PIX".
  - Modal com formulário reativo para concessão/estensão manual de prazo + campo de observações.
