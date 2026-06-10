# Context: Phase 28 — Feed de Atividades & Interações Silenciosas

## Domain
- **Phase Goal:** Implementar o feed de conquistas automatizadas e interações silenciosas de suporte.
- **Requirements:** FEED-01, FEED-02, FRND-03

## Canonical References
- `.planning/REQUIREMENTS.md`

## Architecture & Implementation Decisions
Essas decisões foram escolhidas e travadas durante a fase de discussão e devem ser rigorosamente seguidas na fase de planejamento (`/gsd-plan-phase`).

### 1. Armazenamento do Feed
- **Decisão:** JPA/PostgreSQL com Paginação.
- **Detalhes:** Manter consistência com o restante do sistema utilizando o banco relacional existente. A tabela de feed deverá possuir índices otimizados (ex: por data de criação e ID do usuário/amigo) para garantir performance de leitura nas consultas paginadas via frontend.

### 2. Notificações em Tempo Real
- **Decisão:** Server-Sent Events (SSE).
- **Detalhes:** O backend fornecerá um endpoint de emissão de eventos em `SseEmitter` unidirecional para enviar eventos e notificações de conquistas/feed aos clientes Angular em tempo real, mantendo baixo consumo de recursos.

### 3. Gatilhos de Geração de Eventos (Triggers)
- **Decisão:** Spring ApplicationEvents (`@EventListener`).
- **Detalhes:** Utilizar arquitetura assíncrona orientada a eventos para desacoplar a lógica de negócio central. Quando um usuário concluir 100 questões, bater streak ou ganhar uma badge, um evento (`ApplicationEvent`) será disparado e processado por um listener dedicado (ex: `FeedEventListener`) para gerar a entrada no feed e emitir o evento via SSE.

### 4. Prevenção de Spam (Clap/Cheer)
- **Decisão:** Interação Única Toggle (Like style).
- **Detalhes:** Cada usuário poderá enviar apenas 1 "Clap" ou "Cheer" por cada entrada do feed. O frontend deve bloquear imediatemente o clique duplo. O backend deve garantir a integridade evitando duplicidade através de restrições de banco (`UniqueConstraint` entre `event_id` e `user_id`).

## Out of Scope (Deferred Ideas)
- Interações complexas, comentários em texto no feed (mantido fora de escopo conforme FEED-02 exige que seja "sem necessidade de comentários em texto").
