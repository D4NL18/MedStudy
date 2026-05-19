# Phase 23: Sistema de Conexões (Amigos) & Busca - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase compreende o desenvolvimento e a integração do sistema de conexões sociais (amigos) e busca avançada de usuários no MedStudy. O escopo abrange desde o modelo relacional de amizades até a interface de busca dinâmica de estudantes e o gerenciamento de solicitações de conexão, além de estender a infraestrutura de notificações existente para incluir notificações sociais em tempo real de streaks e badges de amigos.

</domain>

<decisions>
## Implementation Decisions

### 1. Modelagem de Relacionamento de Amizades (Friendship)
- **D-01:** Utilizar uma tabela de registro único `friendships` no banco de dados com a seguinte estrutura de colunas:
  - `requester_id` (UUID, FK para users)
  - `receiver_id` (UUID, FK para users)
  - `status` (Enum: `PENDING`, `ACCEPTED`, `BLOCKED`)
  - Timestamps padrão de criação e atualização.
  - Chave primária composta ou restrição de unicidade para o par `(requester_id, receiver_id)`.
- **D-02:** Consultas de listagem de amigos aceitos realizarão uma query unificada do tipo `requester_id = :userId OR receiver_id = :userId` filtrada por `status = 'ACCEPTED'` para evitar duplicidade de registros e manter a consistência do banco de dados.

### 2. Mecanismo de Busca Reativa & Autocomplete
- **D-03:** Desenvolver uma barra de busca reativa no frontend com RxJS `debounceTime(300ms)` e `distinctUntilChanged()`, disparando requisições para a API `GET /api/profiles/search?query=...`.
- **D-04:** A busca de perfis deve permitir a filtragem inteligente e parcial baseada em nome completo, `@handle` (username) ou instituição/faculdade.
- **D-05:** Regras de negócio de privacidade aplicadas na busca:
  - O próprio usuário deve ser excluído da busca.
  - Usuários que bloquearam ou foram bloqueados pelo usuário atual não devem aparecer nos resultados.
  - Cada resultado de busca deve indicar o estado atual de conexão (ex: "Enviar Solicitação", "Pendente", "Amigo", "Bloqueado").

### 3. Gerenciamento de Solicitações e Conexões
- **D-06:** Implementar os seguintes endpoints de backend protegidos por autenticação:
  - `POST /api/friendships/request/{handle}` - Enviar solicitação de amizade.
  - `POST /api/friendships/accept/{handle}` - Aceitar solicitação de amizade.
  - `POST /api/friendships/decline/{handle}` - Recusar solicitação de amizade.
  - `DELETE /api/friendships/remove/{handle}` - Remover amizade existente.
  - `POST /api/friendships/block/{handle}` - Bloquear um usuário.
  - `POST /api/friendships/unblock/{handle}` - Desbloquear um usuário.
  - `GET /api/friendships/friends` - Listar amigos ativos do usuário logado.
  - `GET /api/friendships/pending` - Listar solicitações de amizade pendentes recebidas.
  - `GET /api/friendships/blocked` - Listar usuários bloqueados pelo usuário logado.

### 4. Notificações Sociais Persistentes
- **D-07:** Criar a entidade de banco de dados `notifications` (ou `social_notifications`) para salvar e manter o histórico de conquistas de amigos (streaks quebrados/conquistados, novas badges).
- **D-08:** Estender o `NotificationService` no backend para agregar alertas sociais no resumo geral (`NotificationSummaryResponse`), incrementando o contador global de alertas in-app.
- **D-09:** O frontend deve exibir esses alertas de forma amigável no dropdown ou painel de notificações, permitindo marcar individualmente ou coletivamente como lidas.

### 5. Interface de Usuário (UI): Painel Social (/social)
- **D-10:** Criar uma rota/tela dedicada no frontend Angular (`/social`) acessível pelo menu lateral principal. A tela usará abas dinâmicas (tabs) para segmentar a experiência:
  - **Aba "Buscar Estudantes":** Campo de busca autocomplete, listando perfis correspondentes com botões contextuais de ação ("Conectar", "Pendente", "Bloquear").
  - **Aba "Meus Amigos":** Grid/Lista de amigos ativos, exibindo seu avatar, handle, faculdade/situação acadêmica, além do streak atual.
  - **Aba "Solicitações Pendentes":** Lista de requisições recebidas com botões fáceis de "Aceitar" ou "Recusar".
  - **Aba "Bloqueados":** Lista de perfis bloqueados com a opção de "Desbloquear".

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Specs & Requirements
- `.planning/REQUIREMENTS.md` — Requisitos do Milestone v1.2 (FRND-01, FRND-02, FRND-03)
- `.planning/ROADMAP.md` — Entregas e escopo de fases da socialização

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Profile Entity & Service**: `Profile` já está conectado um-para-um ao `User`. Os serviços existentes de busca e validação no `ProfileService` e `ProfileController` podem ser estendidos ou servir de referência.
- **Notification infrastructure**: `NotificationService` atualmente conta revisões pendentes e aulas de reforço. Deve ser refatorado para incluir a contagem de notificações sociais não lidas da nova tabela.
- **Angular components & services**: Utilizar o `ProfileService` no frontend para operações sociais e estender o store do NgRx se aplicável, ou criar um novo `SocialService` isolado para requisições de amizade.

### Established Patterns
- **Spring Boot controller mapping**: Padrão de respostas com DTOs mapeados via MapStruct e tratamento uniforme de exceções em `GlobalExceptionHandler`.
- **Security Context**: Obter o usuário logado via `SecurityContextHolder.getContext().getAuthentication().getPrincipal()` para garantir que o requester seja sempre o usuário autenticado.

### Integration Points
- **Sidebar Navigation**: Adicionar o novo link para `/social` na sidebar principal (`frontend/src/app/core/components/sidebar` ou equivalente).

</code_context>

<specifics>
## Specific Ideas
- Ao bloquear um usuário, quaisquer solicitações de amizade pendentes entre as duas partes devem ser automaticamente canceladas, e a relação deve passar a ter o status `BLOCKED` com o bloqueador como o requester original da ação de bloqueio.
- Exibição de cards de usuários contendo badges conquistadas em miniatura na listagem de amigos para instigar a gamificação e o engajamento saudável.

</specifics>

<deferred>
## Deferred Ideas
- Chat ou mensagens diretas (DMs) em tempo real entre amigos. Fica fora do escopo do Milestone v1.2 (Socialização Aprofundada).
</deferred>

---

*Phase: 23-Sistema de Conexões (Amigos) & Busca*
*Context gathered: 2026-05-19*
