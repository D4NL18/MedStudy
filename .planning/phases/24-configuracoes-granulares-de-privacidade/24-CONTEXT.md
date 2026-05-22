# Phase 24: Configurações Granulares de Privacidade - Context

**Gathered:** 2026-05-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Garante a privacidade total e proteção de dados acadêmicos e estatísticas de estudo no MedStudy. O usuário terá controle granular sobre o compartilhamento de suas informações na rede social (Streak, Faculdade, total de questões resolvidas, Galeria de Badges) e a visibilidade geral do seu perfil ("Público para amigos" vs "Totalmente Privado"). O backend filtrará estritamente os dados expostos em todas as consultas públicas, buscas de amigos e serviços de notificações sociais, enquanto o frontend receberá uma tela premium de privacidade com efeito glassmorphic para não-amigos e um painel de toggles reativos no perfil do usuário.

</domain>

<decisions>
## Implementation Decisions

### Visibilidade e Busca de Perfil
- **D-01 (Máscara de DTO para Não-Amigos):** Não-amigos continuam aptos a encontrar o perfil de outros na busca social (Nome, Handle, Avatar) para possibilitar novas solicitações de amizades. No entanto, o endpoint público do perfil (`GET /api/profiles/public/{handle}`) retornará estatísticas acadêmicas e de estudo zeradas/nulas, acompanhado do atributo `isPrivate = true`.
- **D-02 (Overlay de Privacidade):** Se o frontend receber `isPrivate: true` na consulta pública do perfil, renderizará um estado premium com desfoque glassmorphic informando que o perfil é privado e fornecendo o botão "Adicionar Amigo".

### Experiência de Ocultação Granular
- **D-03 (Layout Adaptativo Fluido):** Amigos aceitos visualizam o perfil de forma adaptativa. Caso o usuário oculte um dado granular (ex: Streak = Não), essa informação não será renderizada na interface do amigo. Não haverá placeholders ou espaços em branco; o cartão ajusta-se organicamente para manter a harmonia visual.
- **D-04 (Autonomia de Visualização):** O próprio usuário sempre visualizará 100% de seus dados acadêmicos, streaks, questões e badges no próprio dashboard e perfil, independente dos toggles de privacidade configurados. As restrições aplicam-se exclusivamente para terceiros.

### Sincronização de Notificações e Social Feed
- **D-05 (Silenciamento no Backend):** Toggles de privacidade granulares desativados desabilitam a geração de notificações sociais e eventos correspondentes no Feed de Atividades. Se o usuário desativar o compartilhamento do Streak ou de Badges, os amigos não receberão notificações ("Fulano bateu recorde de streak") e nenhum evento correspondente aparecerá no feed de atividades sociais.

### Valores Padrão (Defaults)
- **D-06 (Perfil Público para Amigos por Padrão):** Novos perfis criados no onboarding iniciam com `isPublic = true` (Perfil visível a amigos) e todas as preferências de compartilhamento granulares (Streak, Faculdade, Questões, Badges) marcadas como `true`. O usuário é estimulado a interagir imediatamente, podendo desativar as preferências a qualquer momento no painel.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Specs & Requirements
- `.planning/REQUIREMENTS.md` — Requisitos do Milestone v1.2 (PRIV-01, PRIV-02)
- `.planning/ROADMAP.md` — Entregas e escopo de fases da socialização

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Profile Entity & DTO (`Profile.java`, `ProfileDTO.java`)**: Estenderemos a tabela de perfis via migração Flyway e mapearemos as colunas booleanas nos modelos.
- **Friendship Checking**: `FriendshipService.java` já contém métodos para verificar relações entre usuários (`findFriendshipBetween`). Utilizaremos esse serviço no controller e na consulta de perfis públicos para validar se a relação é `ACCEPTED` antes de liberar informações.

### Established Patterns
- **Spring Security Authentication**: O usuário logado é extraído via `SecurityContextHolder.getContext().getAuthentication().getPrincipal()`. A comparação do ID do visualizador com o ID do dono do perfil garante que o proprietário sempre receba os dados completos dele mesmo.
- **Angular Store (NgRx)**: As ações e efeitos em `profile.actions.ts`, `profile.effects.ts` e `profile.reducer.ts` serão adaptados para persistir e refletir os 5 novos atributos de privacidade na tela `/perfil`.

### Integration Points
- **REST Endpoints**:
  * `GET /api/profiles/public/{handle}`: Filtro estrito de DTO baseado no status da amizade e escolhas granulares.
  * `POST /api/profiles`: Salvar os toggles enviados pelo formulário de configurações do frontend.
  * `GET /api/friendships/search`: Retorno de resultados limpos mascarando faculdade e semestre para quem não é amigo e possui privacidade ativada.

</code_context>

<specifics>
## Specific Ideas
- No frontend, o painel de privacidade no componente `PerfilComponent` usará toggles animados com transições suaves e cores HSL do sistema (verde-esmeralda para ativo, cinza/vidro para inativo) mantendo a estética premium e glassmorphism do MedStudy.

</specifics>

<deferred>
## Deferred Ideas
- Restrição de visualização de foto/avatar: O avatar preset permanecerá público em todos os níveis para manter a identidade na listagem básica da busca.

</deferred>

---

*Phase: 24-Configurações Granulares de Privacidade*
*Context gathered: 2026-05-19*
