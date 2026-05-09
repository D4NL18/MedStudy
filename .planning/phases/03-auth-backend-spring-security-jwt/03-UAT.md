---
status: testing
phase: 03-auth-backend-spring-security-jwt
source: [03-SUMMARY.md]
started: 2026-05-06T12:06:00Z
updated: 2026-05-06T12:06:00Z
---

## Current Test

number: 7
name: Swagger Security Configuration
expected: |
  A documentação do Swagger deve estar acessível sem autenticação.
  Os endpoints protegidos devem exigir o Bearer Token no cabeçalho.
awaiting: user response
result: pass
result: pass

## Tests

### 1. Cold Start Smoke Test
expected: |
  O servidor deve iniciar sem erros, carregar as configurações de segurança e JWT, e estar pronto para receber requisições.
result: pass

### 2. Login & Token Rotation
expected: |
  Ao fazer login em `/api/auth/login`, o sistema deve retornar um `accessToken` e um `refreshToken`. 
  Ao usar o `refreshToken` no endpoint `/refresh`, um novo par de tokens deve ser gerado e o antigo deve ser invalidado.
result: pass

### 3. Logout
expected: |
  Ao chamar o endpoint de `/logout` com um `refreshToken` válido, o token deve ser removido do banco de dados e não deve mais permitir a geração de novos tokens de acesso.
result: pass

### 4. Password Complexity Validation
expected: |
  Ao tentar registrar ou atualizar um usuário com uma senha que não atende aos critérios (mínimo 8 caracteres, uma maiúscula, uma minúscula e um número), o sistema deve retornar erro 400 Bad Request com mensagem detalhada.
result: pass

### 5. Password Recovery (Forgot/Reset)
expected: |
  O fluxo de `/forgot-password` deve enviar um e-mail (visível no Mailtrap) com um link contendo um token JWT curto. 
  O endpoint `/reset-password` deve aceitar esse token e permitir a troca da senha.
result: pass

### 6. Rate Limiting (Progressive Delay)
expected: |
  Após múltiplas falhas de login consecutivas (ex: 3+), o sistema deve introduzir um atraso perceptível (delay progressivo) na resposta de erro, dificultando ataques de força bruta.
result: pass

### 7. Swagger Authorization
expected: |
  Ao acessar o Swagger UI, deve ser possível clicar no botão "Authorize", inserir um token Bearer, e realizar chamadas para endpoints protegidos com sucesso.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
