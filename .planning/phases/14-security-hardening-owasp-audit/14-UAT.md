---
status: partial
phase: 14-security-hardening-owasp-audit
source: [manual implementation]
started: 2026-05-11T01:43:42Z
updated: 2026-05-11T02:01:42Z
---

## Current Test
number: 1
name: HttpOnly Cookie Storage
expected: |
  Ao realizar login ou refresh de token, o navegador deve receber os cookies `access_token` e `refresh_token`. 
  O cookie `access_token` deve estar marcado como `HttpOnly`, `Secure` e `SameSite=Strict`. 
  O cookie não deve ser acessível via `document.cookie` no console do navegador.
awaiting: gap closure

## Tests

### 1. HttpOnly Cookie Storage
expected: Ao realizar login, os cookies `access_token` e `refresh_token` são definidos com flags de segurança (HttpOnly, Secure, Strict).
result: issue
reported: "Cookies are correctly set, but localStorage still contains 'token' and 'refreshToken'."
severity: blocker

### 2. CSRF Protection (Double Submit)
expected: Requisições de escrita (POST/PUT/DELETE) sem o header `X-XSRF-TOKEN` ou com valor incompatível com o cookie `XSRF-TOKEN` devem ser bloqueadas (403 Forbidden). O Angular deve enviar o header automaticamente.
result: pass

### 3. Strict Content Security Policy (CSP)
expected: Todas as respostas da API devem conter o header `Content-Security-Policy: default-src 'self'; ...`. Recursos externos (scripts de outros domínios) devem ser bloqueados pelo navegador.
result: pass

### 4. Global Log Masking
expected: Ao forçar um log que contenha "password", "email" ou "token" (ex: erro de login), o valor sensível deve aparecer mascarado com asteriscos (ex: `password=****`) no console/arquivo de log.
result: pass

### 5. Dependency Audit Integration
expected: O comando `./mvnw dependency-check:check` (no backend) e `npm audit` (no frontend) devem estar disponíveis e integrados ao workflow de build.
result: pass

## Summary

total: 5
passed: 4
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "Tokens should NOT be stored in localStorage after migrating to HttpOnly cookies."
  status: failed
  reason: "User reported: localStorage still contains 'token' and 'refreshToken'. Diagnosis: AuthEffects.ts is still explicitly saving tokens to localStorage."
  severity: blocker
  test: 1
  artifacts: ["frontend/src/app/store/auth/auth.effects.ts"]
  missing: ["Removal of localStorage.setItem calls for tokens in AuthEffects"]
