# Plan: Phase 3 — Auth Backend (Spring Security + JWT)

Implementação de autenticação segura com JWT e Refresh Token.

## 1. Infraestrutura de Segurança & JWT
- [ ] 1.1 Adicionar dependências no `pom.xml`: `jjwt-api`, `jjwt-impl`, `jjwt-jackson`, `spring-boot-starter-mail`.
- [ ] 1.2 Criar `JwtService` para geração e validação de tokens.
- [ ] 1.3 Criar `UserDetailsServiceImpl` para integração com o banco de dados.
- [ ] 1.4 Configurar `SecurityConfig` com `SecurityFilterChain` (Stateless, CORS, Public/Private routes).
- [ ] 1.5 Criar `JwtAuthenticationFilter` e registrar no Spring Security.

## 2. Lógica de Autenticação & Tokens
- [ ] 2.1 Criar DTOs: `LoginRequest`, `AuthResponse`, `TokenRefreshRequest`.
- [ ] 2.2 Implementar `AuthService` com métodos `authenticate`, `refresh` e `logout`.
- [ ] 2.3 Implementar lógica de rotação de `RefreshToken` (invalidação ao usar).
- [ ] 2.4 Criar `AuthController` com os endpoints de autenticação.

## 3. Segurança Avançada & Recuperação
- [ ] 3.1 Criar `LoginAttemptService` para aplicar o delay progressivo em falhas de login.
- [ ] 3.2 Integrar `LoginAttemptService` no fluxo de autenticação.
- [ ] 3.3 Criar `EmailService` configurado para Mailtrap.
- [ ] 3.4 Implementar endpoints `/forgot-password` e `/reset-password`.
- [ ] 3.5 Adicionar validação de complexidade de senha no `UserRequest` DTO.

## 4. Tratamento de Erros & Documentação
- [ ] 4.1 Atualizar `GlobalExceptionHandler` com exceções de segurança.
- [ ] 4.2 Configurar Swagger/OpenAPI para suportar autenticação Bearer.

## 5. Verificação & Testes
- [ ] 5.1 Criar testes de integração para o fluxo de login e refresh.
- [ ] 5.2 Validar proteção de rotas privadas (401 Unauthorized).
- [ ] 5.3 Verificar envio de e-mails no Mailtrap.
