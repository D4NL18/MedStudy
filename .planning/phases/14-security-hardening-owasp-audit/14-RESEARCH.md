# Phase 14: Security Hardening & OWASP Audit - Research

## Research Overview
Este documento detalha as abordagens técnicas para implementar as decisões de segurança capturadas no contexto da fase 14, focando em mitigação de OWASP Top 10 e endurecimento da infraestrutura.

---

## 1. JWT in HttpOnly Cookies
Para mitigar ataques de XSS (A03:2021-Injection / A07:2021-Identification and Authentication Failures), migraremos o armazenamento do token do `localStorage` para Cookies seguros.

### Backend Implementation
- **Filter Update**: `JwtAuthenticationFilter` deve ser modificado para extrair o token do cookie em vez do header `Authorization`.
  ```java
  String token = null;
  Cookie[] cookies = request.getCookies();
  if (cookies != null) {
      for (Cookie cookie : cookies) {
          if ("access_token".equals(cookie.getName())) {
              token = cookie.getValue();
          }
      }
  }
  ```
- **Controller Update**: `AuthController` deve retornar o token via `ResponseCookie`.
  ```java
  ResponseCookie cookie = ResponseCookie.from("access_token", token)
      .httpOnly(true)
      .secure(true) // Requer HTTPS em prod
      .path("/")
      .maxAge(duration)
      .sameSite("Strict")
      .build();
  response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  ```

### Frontend Implementation
- **Interceptors**: Remover a injeção manual do header `Authorization`. Adicionar `withCredentials: true` em todas as requisições para que o navegador envie o cookie automaticamente.

---

## 2. Double Submit Cookie CSRF
Para mitigar CSRF (A01:2021-Broken Access Control), utilizaremos o padrão de Double Submit Cookie integrado ao Spring Security.

### Configuration
```java
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
);
```
- **Cookie Name**: `XSRF-TOKEN` (padrão do Angular).
- **Header Name**: `X-XSRF-TOKEN`.
- **Frontend**: O HttpClient do Angular (`HttpClientXsrfModule`) detecta o cookie automaticamente e injeta o header nas requisições de escrita.

---

## 3. Strict Content Security Policy (CSP)
Endurecimento contra XSS e Content Injection.

### Policy Directives
Como o projeto não utiliza fontes ou scripts externos, utilizaremos a política mais restritiva possível:
- `default-src 'self';`
- `script-src 'self';`
- `style-src 'self' 'unsafe-inline';` (necessário para o Angular carregar estilos de componentes standalone).
- `img-src 'self' data:;` (para permitir imagens base64/blobs).

### Implementation
```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"))
);
```

---

## 4. Global Log Masking (Logback)
Prevenção de vazamento de dados sensíveis (A09:2021-Security Logging and Monitoring Failures).

### Approach
Criar uma classe `MaskingPatternLayout` que estende `PatternLayout` e aplica regex nos campos sensíveis.

### Targets
- `password`, `token`, `access_token`, `refresh_token`, `email`, `cpf`.
- Regex exemplo: `(?i)(password|token|access_token|refresh_token)\s*[:=]\s*["']?([^"'\s,]+)["']?`

---

## 5. Dependency Audit Strategy
Identificação de componentes vulneráveis (A06:2021-Vulnerable and Outdated Components).

### Backend
- Plugin: `org.owasp:dependency-check-maven`.
- Execução: `mvn org.owasp:dependency-check-maven:check`.
- Ação: Atualizar versões no `pom.xml` ou substituir bibliotecas sem patch.

### Frontend
- Execução: `npm audit`.
- Ação: `npm audit fix` ou substituição manual em `package.json`.

---

## Validation Architecture
- **Automated Scanning**: Relatórios de auditoria devem ser gerados no diretório da fase.
- **Security Integration Tests**: Testes que tentam acessar recursos sem o cookie CSRF ou com CSP violado (usando Selenium/Cypress em fases futuras, ou validação de headers via MockMvc agora).

---
*Research Complete: 2026-05-11*
