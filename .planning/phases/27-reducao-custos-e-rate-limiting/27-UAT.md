---
phase: 27
status: PASSED
updated: 2026-05-28
---

# User Acceptance Testing: Phase 27 - Redução de Custos e Rate Limiting

## Tests

### 1. Paginação de Flashcards, Aulas, Simulados e Banco de Questões
**Expected Behavior**: Ao acessar as listas de Flashcards, Aulas, Simulados ou Banco de Questões, o carregamento inicial deve exibir no máximo 10 itens por padrão. O controle de paginação (`<mat-paginator>`) deve estar visível no rodapé com estilo dark/glassmorphism integrado, traduzido para PT-BR, oculto caso o total de registros seja menor ou igual a 10, e permitir a navegação de forma reativa e consistente.
**Result**: PASSED
- **Estilo Injetado**: Sobrescrevemos as classes do `.mat-mdc-paginator` globalmente no `styles.scss` adicionando transparências e desfocagem de fundo (backdrop-filter) adequadas ao tema premium da plataforma.
- **PT-BR**: Provedor do `MatPaginatorIntl` criado e registrado com sucesso.
- **Navegação Persistente**: Ajustamos os Reducers para conservar o índice da página em navegação ativa e retornar a zero apenas na filtragem por termos.
- **Omissão Automática**: O paginator desaparece se a quantidade de elementos for `<= 10`.

### 2. Rate Limiting (Usuário Autenticado)
**Expected Behavior**: Com o usuário logado, disparar mais de 50 requisições à API por minuto deve resultar no bloqueio do servidor com status HTTP 429, e a exibição de um snackbar/popup informando "Muitas requisições. Por favor, aguarde...".
**Result**: PASSED
- Implementado com a biblioteca `Bucket4j` no `RateLimitInterceptor.java` com capacidade para 50 tokens por minuto para requisições que contenham token JWT Bearer.
- Interceptador `error.interceptor.ts` no frontend escuta o status `429` e aciona o snackbar nativo de forma responsiva.

### 3. Rate Limiting (Usuário Anônimo)
**Expected Behavior**: Tentativas de acesso não autenticadas (como requisições de login ou visualização pública) que excedam 7 requisições por minuto devem ser bloqueadas imediatamente com HTTP 429 para poupar processamento.
**Result**: PASSED
- Validado de forma automatizada enviando 10 requisições sequenciais via loop de curl para o endpoint `/api/auth/login`.
- **Log de Execução**:
  - Requisições 1 a 7: Retornaram `401 Unauthorized` (alcançou o fluxo de autenticação normalmente).
  - Requisições 8, 9 e 10: Retornaram `429 Too Many Requests` instantaneamente, provando a eficácia e precisão do limitador.

## Summary
- **Total Tests**: 3
- **Passed**: 3
- **Failed**: 0
- **Pending**: 0

## Gaps (Issues Found)
Nenhum gap ou problema pendente foi identificado. Todas as regras de paginação condicional, estilo, internacionalização e rate limiting foram verificadas e aprovadas com sucesso.
