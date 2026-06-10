# UAT: Phase 28 — Feed de Atividades & Interações

## Status: IN PROGRESS

## Test Cases

### 1. Geração de Evento de Feed
- **Condição:** Quando um usuário conclui um marco (ex: 100 questões).
- **Ação:** No backend, chame ou simule o `QuestionService` completando 100 questões.
- **Resultado Esperado:** O evento deve ser salvo no banco e aparecer ao chamar a API `/api/feed`.
- **Status:** `PASSED`

### 2. Notificação em Tempo Real (SSE)
- **Condição:** Transmissão instantânea.
- **Ação:** Com a UI aberta no perfil do usuário amigo, veja o feed quando o evento for gerado.
- **Resultado Esperado:** O card de evento deve aparecer instantaneamente via SSE (sem refresh).
- **Status:** `PASSED`

### 3. Interação Única Toggle (Clap/Cheer) e Prevenção de Spam
- **Condição:** Clique de interação de amigo.
- **Ação:** Clique repetidamente em "Clap" de um mesmo evento (ou dispare requisições repetidas na API).
- **Resultado Esperado:** O frontend desabilita o clique e o backend retorna erro `400 Bad Request` para duplicatas, computando apenas 1.
- **Status:** `PASSED`
