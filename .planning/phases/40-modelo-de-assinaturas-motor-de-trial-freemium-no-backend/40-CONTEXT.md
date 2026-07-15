# Phase 40: Modelo de Assinaturas & Motor de Trial Freemium no Backend - Context

**Gathered:** 2026-07-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase constrói o modelo de dados de assinaturas no PostgreSQL e o motor de controle de trial freemium no Spring Boot. Inclui as entidades JPA (`Subscription` e `PixTransaction`), a concessão automática de 30 dias de trial no cadastro de novos usuários (`UserService.register`), o agendador de segundo plano (`@Scheduled`) executando diariamente (00:00 UTC) para varrer e transicionar o status de contas vencidas para `EXPIRED`, o filtro customizado do Spring Security (`SubscriptionStatusFilter`) inserido após o `JwtAuthenticationFilter`, com suporte a Spring Cache (Caffeine) em memória e resposta HTTP status 402 Payment Required com payload JSON completo (`PAYWALL_REQUIRED`).

</domain>

<decisions>
## Implementation Decisions

### Tratamento de Bloqueio por Expiração (Status HTTP, Payload & Interceptação)
- **D-01 (Status HTTP):** Retornar HTTP Status 402 Payment Required especificamente padronizado para bloqueios de Paywall.
- **D-02 (Payload de Erro):** Payload JSON completo retornado com status 402 contendo: `code` (`"PAYWALL_REQUIRED"`), `message` (`"Assinatura ou período de teste expirado"`), `expiredAt` (timestamp ISO-8601 da expiração), e `status` (`"EXPIRED"`).
- **D-03 (Filtro de Interceptação):** Implementação de filtro customizado `SubscriptionStatusFilter` inserido na cadeia do Spring Security logo após o `JwtAuthenticationFilter` para verificação centralizada de acesso.
- **D-04 (Otimização & Cache):** Utilização de Spring Cache em memória (Caffeine / `@Cacheable`) com TTL curto e invalidação sob demanda na renovação/pagamento para evitar queries repetitivas ao banco a cada requisição HTTP.

### Ciclo de Vida do Trial & Agendamento
- **D-05 (Concessão Automática):** Criação automática do registro inicial de assinatura com status `TRIAL` e `trialEndDate = NOW() + 30 dias` diretamente na lógica de cadastro de novos usuários (`UserService.register()`).
- **D-06 (Agendador de Background):** Cron job agendado (`@Scheduled`) executando diariamente às 00:00 UTC para varrer a tabela de assinaturas, transicionar contas vencidas para `EXPIRED` e evictar os caches correspondentes.

### Escopo de Rotas Isentas do Bloqueio
- **D-07 (Isenção Restrita):** Manter isentas do `SubscriptionStatusFilter` exclusivamente as rotas de Autenticação (`/api/v1/auth/**`) e as rotas de Assinatura/Planos (`/api/v1/subscriptions/**`). Todas as demais rotas operacionais do sistema exigem assinatura ou trial válido.

### the agent's Discretion
- Estrutura exata do repositório JPA e nomes de DTOs secundários (`SubscriptionResponseDTO`, etc.).
- Detalhes de indexação das tabelas `subscriptions` e `pix_transactions` no PostgreSQL.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone & Project Specs
- `.planning/PROJECT.md` — Visão geral da plataforma, milestones e decisões chave
- `.planning/REQUIREMENTS.md` — Requisitos do milestone v1.5 (`PAYWALL-01`, `PAYWALL-02`)
- `.planning/ROADMAP.md` — Fase 40 dentro do planejamento estratégico
- `.planning/research/ARCHITECTURE.md` — Modelo de dados de `subscriptions` e `pix_transactions` e diagramas de sequência
- `.planning/research/STACK.md` — Stack tecnológica recomendada (Spring Security + Netty / Client mTLS / Cache)
- `.planning/research/PITFALLS.md` — Mitigações para fusos horários, timezone UTC e concorrência no scheduler

### Existing Codebase
- `backend/src/main/java/com/medstudy/backend/core/config/SecurityConfig.java` — Configuração do Spring Security Filter Chain
- `backend/src/main/java/com/medstudy/backend/modules/user/entity/User.java` — Entidade do Usuário
- `backend/src/main/java/com/medstudy/backend/modules/user/service/UserService.java` — Serviço de cadastro de usuário

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CustomAccessDeniedHandler.java` / `CustomAuthenticationEntryPoint.java` — Padrão de escrita de respostas JSON de erro diretamente na response do HttpServletResponse.
- `User.java` — Entidade de Usuário onde a relacionamento `OneToOne` com `Subscription` será acoplado.

### Established Patterns
- Padrão em camadas do backend: `Controller` → `Service` → `Repository` com DTOs e MapStruct.
- Tratamento global de exceções via `@RestControllerAdvice`.

### Integration Points
- `UserService.register()`: Interceptar criação de novo usuário para instanciar a entidade `Subscription` inicial de 30 dias.
- `SecurityConfig.java`: Inserir `SubscriptionStatusFilter` logo após `JwtAuthenticationFilter`.

</code_context>

<specifics>
## Specific Ideas

- O payload 402 deve permitir que o frontend exiba a mensagem exata sem depender de hardcodes estáticos.
- `trialEndDate` e `currentPeriodEnd` devem ser salvos no banco como `Instant` (timestamp UTC) para imunidade a fuso horário.

</specifics>

<deferred>
## Deferred Ideas

- Nenhuma ideia fora do escopo foi levantada — as discussões focaram estritamente na Fase 40.

</deferred>

---

*Phase: 40-modelo-de-assinaturas-motor-de-trial-freemium-no-backend*
*Context gathered: 2026-07-14*
