# Requirements: MedStudy v1.2 — Socialização Aprofundada

**Milestone:** v1.2
**Goal:** Introduzir recursos sociais robustos para aumentar o engajamento através de amizades, competições automatizadas por questões, feeds de conquistas e controles estritos de privacidade.

---

## v1.2 Requirements

### Profile & Basic Info (PROF)
- [ ] **PROF-01**: O usuário deve poder cadastrar informações básicas no perfil: Nome Completo, Nome de Usuário Único (@handle), Semestre (1º ao 12º), Faculdade/Instituição de Ensino, e Avatar/Foto.
- [ ] **PROF-02**: Criar uma página pública de perfil visualizável por amigos, exibindo informações autorizadas, conquistas (badges) e estatísticas de estudo.

### Social & Friends (FRND)
- [ ] **FRND-01**: O usuário deve poder buscar outros usuários pelo nome, @handle ou instituição para enviar solicitações de amizade.
- [ ] **FRND-02**: Sistema de solicitações de amizade: enviar, aceitar, recusar, listar amigos e remover/bloquear conexões.
- [ ] **FRND-03**: Notificações in-app em tempo real quando um amigo conquistar uma badge nova ou bater recorde de streak.

### Competitions & Groups (COMP)
- [ ] **COMP-01**: O usuário deve poder criar grupos de competição com duração pré-determinada (ex: 7 dias, 30 dias) e convidar amigos.
- [ ] **COMP-02**: O grupo deve calcular o ranking automaticamente baseado no número de questões realizadas no banco de dados durante o período do desafio (sem posts manuais, apenas extração direta).
- [ ] **COMP-03**: Exibir progresso em tempo real de cada membro do grupo em um dashboard de competição unificado.
- [ ] **COMP-04**: Adicionar suporte a "Duelos 1v1" rápidos entre amigos com duração curta e metas de questões específicas.

### Social Activity Feed & Interaction (FEED)
- [ ] **FEED-01**: Um Feed de Atividades de Amigos, listando apenas eventos automatizados como: "Fulano completou 100 questões hoje", "Ciclana ganhou a badge Estrela da Preventiva".
- [ ] **FEED-02**: Sistema de Interação Silenciosa: Enviar "Aplausos" (Clap) ou "Dar Força" (Cheer) para conquistas no feed, gerando notificações rápidas para o amigo sem necessidade de comentários em texto.

### Privacy & Data Control (PRIV)
- [ ] **PRIV-01**: O usuário deve ter controle granular de privacidade em sua página de configurações:
  - Escolher se o perfil é Público (apenas para amigos) ou Totalmente Privado.
  - Escolher se deseja compartilhar: Streak (Sim/Não), Faculdade (Sim/Não), Quantidade total de Questões (Sim/Não), Galeria de Badges (Sim/Não).
- [ ] **PRIV-02**: Garantir conformidade de privacidade no backend: endpoints de perfil, feed e competições devem filtrar estritamente os dados baseados nas opções salvas pelo usuário.

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PROF-01..02 | Phase 22 | Pending |
| FRND-01..03 | Phase 23 | Pending |
| PRIV-01..02 | Phase 24 | Pending |
| COMP-01..04 | Phase 25 | Pending |
| FEED-01..02 | Phase 26 | Pending |
