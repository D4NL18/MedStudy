# Phase 32 Plan: Expansão de Cobertura de Testes

## Wave 1: Backend Edge Cases & Rate Limiting

- [ ] **32-01-01:** Refatorar `RateLimitInterceptor` para ler limites do `application.yml` via `@Value`. Adicionar configuração de `rate.limit.user: 20` no `application-test.yml`.
  - *Automated verify:* `mvn test -Dtest=RateLimitInterceptorTest` (se o bean carrega a prop)
- [ ] **32-01-02:** Criar `GlobalExceptionHandlerTest` utilizando `@WebMvcTest`. Testar validações (400), credenciais/acesso (401/403) e recursos não encontrados (404), garantindo a estrutura do `ErrorResponse`.
  - *Automated verify:* `mvn test -Dtest=GlobalExceptionHandlerTest`
- [ ] **32-01-03:** Criar `RateLimitIntegrationTest` com `@SpringBootTest` e H2. Simular um loop de 20 requisições (2xx) e garantir que a 21ª retorne `429 Too Many Requests`.
  - *Automated verify:* `mvn test -Dtest=RateLimitIntegrationTest`

## Wave 2: Frontend Complex Services & Shallow UI

- [ ] **32-02-01:** Implementar testes unitários para `FlashcardService` e `RevisionService` (em `core/services/`) usando `HttpTestingController` para simular as chamadas da repetição espaçada.
  - *Automated verify:* `ng test --no-watch --include="**/core/services/*.spec.ts"`
- [ ] **32-02-02:** Implementar testes *Shallow* para componentes de apresentação isolados (ex: formulários e cards de flashcard) utilizando `ng-mocks` para focar na lógica interna sem renderizar dependências pesadas.
  - *Automated verify:* `ng test --no-watch --include="**/flashcards/components/**/*.spec.ts"`

## Wave 3: Frontend Deep Integration

- [ ] **32-03-01:** Implementar testes de *Deep Integration* para o `FlashcardsStudyComponent`. Renderizar o DOM completo para simular uma sessão de repetição espaçada, testando a interação pai-filho e ações de rating ("Fácil", "Difícil").
  - *Automated verify:* `ng test --no-watch --include="**/flashcards/pages/flashcards-study/**/*.spec.ts"`

## Completion
- [ ] **32-04-01:** Rodar suite completa do backend com verificação de cobertura (Jacoco) e do frontend (Karma).
  - *Automated verify:* `mvn clean test jacoco:report jacoco:check && ng test --no-watch --code-coverage`
