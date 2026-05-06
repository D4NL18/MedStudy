# Phase 3 Summary — Auth Backend (Spring Security + JWT)

## Accomplishments
- [x] Implementado Spring Security 7 com autenticação stateless via JWT.
- [x] Implementado Refresh Token Rotation (um novo refresh token invalida o anterior).
- [x] Implementado Logout (invalida tokens de atualização no banco).
- [x] Implementado sistema de atraso progressivo (rate limiting) para falhas de login.
- [x] Implementado fluxo de recuperação de senha via SMTP (Mailtrap) com tokens JWT de curta duração.
- [x] Adicionada validação de complexidade de senha (8+ chars, Uppercase, Lowercase, Number).
- [x] Configurado Swagger UI para suportar autorização via Bearer Token globalmente.

## User-Facing Changes
- **Auth API**: Novos endpoints em `/api/auth` (login, logout, refresh, forgot-password, reset-password).
- **Segurança**: Rotas agora exigem token Bearer válido, exceto endpoints públicos configurados.
- **Swagger**: Campo "Authorize" adicionado para testar rotas protegidas com o token gerado no login.

## Modified Files
- `com.medstudy.backend.core.config.SecurityConfig`
- `com.medstudy.backend.core.security.JwtAuthenticationFilter`
- `com.medstudy.backend.modules.auth.controller.AuthController`
- `com.medstudy.backend.modules.auth.service.AuthService`
- `com.medstudy.backend.modules.auth.service.EmailService`
- `com.medstudy.backend.modules.auth.service.LoginAttemptService`
- `com.medstudy.backend.modules.user.dto.UserRequest`
