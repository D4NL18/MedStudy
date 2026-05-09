# Phase 3: Auth Backend (Spring Security + JWT) - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Implementação da camada de segurança do backend usando Spring Security 6 e JWT. Inclui autenticação de usuário (login), rotação de Refresh Tokens, fluxo de recuperação de senha e proteção de rotas, servindo como base para todas as comunicações seguras entre o Angular e o Spring Boot.

</domain>

<decisions>
## Implementation Decisions

### Logout & Session Management
- **D-01:** O Logout irá invalidar apenas o Refresh Token no banco de dados.
- **D-02:** O Access Token (JWT) permanecerá válido até sua expiração natural (stateless). Não será implementada uma Blacklist de Access Tokens nesta fase para manter a simplicidade e performance.

### Rate Limiting & Security Hardening
- **D-03:** Implementar "Atraso Progressivo" (Progressive Delay) para tentativas de login falhas, em vez de bloqueio imediato por IP. Isso dificulta ataques de força bruta sem o risco de falso-positivo de bloqueio.
- **D-04:** Regras de complexidade de senha: Mínimo de 8 caracteres, exigindo pelo menos uma letra maiúscula, uma minúscula e um número.

### Password Recovery flow
- **D-05:** Implementar fluxo real de e-mail usando Spring Mail e integração com Mailtrap (SMTP) para ambiente de desenvolvimento.

### the agent's Discretion
- Escolha da biblioteca de JWT (recomenda-se `jjwt` ou `auth0-java-jwt`).
- Estrutura interna dos filtros do Spring Security.
- Formato exato do payload do JWT (claims padrões como sub, iat, exp, roles).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Core
- `.planning/ROADMAP.md` — Phase 3 deliverables and goals.
- `.planning/REQUIREMENTS.md` — AUTH-01..07 and SECU-01..07 requirements.

### Architecture & Security
- `.planning/PROJECT.md` — Security constraints and OWASP Top 10 alignment.
- `.planning/phases/02-database-schema-e-backend-skeleton/02-CONTEXT.md` — Standardized error responses and UUID patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `User` entity: Já possui campos `email`, `password` (BCrypt), `role`.
- `RefreshToken` entity: Já mapeada para persistência de tokens de longa duração.
- `GlobalExceptionHandler`: Deve ser estendido para tratar `BadCredentialsException` e `AccessDeniedException`.

### Established Patterns
- **UUIDs**: Continuar usando UUIDs para qualquer nova entidade de segurança.
- **DTOs & Mappers**: Seguir o padrão de Records e MapStruct para dados de autenticação.

### Integration Points
- `SecurityConfig`: Ponto central de configuração das rotas no backend.
- `JwtAuthenticationFilter`: Interceptor que validará o Bearer token em cada request.

</code_context>

<specifics>
## Specific Ideas
- Uso do Mailtrap para captura de e-mails em desenvolvimento.
- Senha "forte" (Upper, Lower, Number) validada no DTO de registro/troca de senha.

</specifics>

<deferred>
## Deferred Ideas
- **Blacklist de Tokens**: Se houver necessidade de revogação instantânea de sessões no futuro, será movido para uma fase de hardening avançado.
- **OAuth2/Social Login**: Fora do escopo da v1.

</deferred>

---

*Phase: 3-Auth Backend (Spring Security + JWT)*
*Context gathered: 2026-05-06*
