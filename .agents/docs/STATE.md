# Status Atual do Desenvolvimento (Context Window)

Este documento é mantido exclusivamente pelo **Orquestrador**. Ele serve como uma memória persistente do estado exato onde a conversa e a funcionalidade se encontram, prevenindo que as diretrizes se percam em contextos (prompts) longos.

## Tarefa Atual em Foco
- **Feature/Entidade:** Minha Clínica Médica: Itens de Parede Isométricos, Maca 2.5D, Eliminação de Hitbox e Movimentação da Dra./Dr.
- **Branch Atual:** `feature/gamificacao-flashcards-maestria`
- **Etapa Atual do Fluxo:** Ajustes Concluídos e Testados com Sucesso (100% dos testes verdes)
- **Última Ação Realizada:**
  1. **Itens de Parede Fixados na Perspectiva Isométrica (Wall Shear):**
     - Aplicado `transform: skewY(-26.565deg) scaleX(0.8944)` na parede NW (esquerda) e `skewY(26.565deg) scaleX(0.8944)` na parede NE (direita), com sombras projetadas realistas.
     - Régua girafinha (`ped_regua_girafa`), tabela optométrica, negatoscópio e diplomas agora parecem verdadeiramente grudados na parede ao invés de flutuarem voltados para a tela.
     - Slices interativos de parede (`nwWallSlices` e `neWallSlices`) para posicionamento direto na parede com alta precisão.
  2. **Eliminação de Hitbox Excessiva nos Quadrados do Piso (Clicks da Parte Superior):**
     - Removido `pointer-events: auto` dos contêineres retangulares (`.placed-item-anchor`, `.doctor-avatar-anchor`, `svg`).
     - Agora `pointer-events: visiblePainted !important` opera estritamente sobre os traços e preenchimentos visuais do SVG (`path, circle, rect, polygon:not(.shadow-polygon), etc.`), ignorando áreas transparentes e sombras.
     - Cada centímetro do quadrado do piso (`iso-tile`) agora responde a cliques perfeitamente, sem que caixas transparentes bloqueiem os quadrados superiores.
  3. **Maca Infantil 2.5D Isométrica Verdadeira:**
     - Redesenhada a `ped_maca_baleia` e refinada a `ped_maca_dino` com 4 pernas de aço cirúrgico alinhadas aos 4 vértices isométricos 2:1 do grid.
     - Superfície estofada e corpo volumétrico em ângulo 2:1 com espessura 3D lateral, rabo curvado e esguicho animado no topo, estendendo-se harmoniosamente sobre os 2 quadrados ocupados.
     - Sombra isométrica proporcional para móveis de 2 ladrilhos (`points="46,54 94,78 70,90 22,67"`).
  4. **Movimentação do Personagem Médico (Dra./Dr.):**
     - No modo de edição (`🛠️ Decorar / Mover`), clicar no(a) Doutor(a) no diorama ou no novo botão `📍 Mover Dra./Dr.` ativa o modo de reposicionamento.
     - O avatar entra em estado translúcido (`.is-selected-moving`), o ghost avatar flutua seguindo o cursor sobre o ladrilho hovered, com indicador verde (válido) ou vermelho (ocupado por móvel).
     - Clicar em qualquer ladrilho livre posiciona o(a) Doutor(a) imediatamente e persiste via `clinicService.updateDoctorAvatar({ avatarX, avatarY })`.
- **Próximo Passo Imediato:** Pronto para validação pelo usuário na interface.

## Progresso do Workflow (Esteira Consolidada de 5 Macro-Etapas)
- [x] **Etapa 1 — Descoberta, Escopo e Especificação** (US-11, US-12, US-13; P-093..P-095)
- [x] **Etapa 2 — Arquitetura, Design Plan, DB e Privacy by Design** (ADR-010, V28, Seção 8 do Design Plan)
- [x] **Etapa 3 — TDD e Execução**
  - [x] 3.1/3.2 Backend: 40 testes Clinic*Test verdes (SecureRandom, lock pessimista, cashback, 403 em compra direta de exclusivos)
  - [x] 3.3 Frontend: modal de Lootbox, badges de raridade, áudio sintetizado por raridade
  - [x] 3.4 Testes: minha-clinica (8/8), clinic.service (13/13), clinic-viewport (4/4); chunk minha-clinica = 35.73 kB gzipped (limite 300 kB)
- [x] **Etapa 4 — Quality Gate 360**
  - [x] UX Reviewer (subagente): APROVADO (Anti-Cassino, 8 estados, prefers-reduced-motion)
  - [x] Security / Privacy / Reviewer: auditoria e validação de segurança (CSPRNG, PESSIMISTIC_WRITE, isolamento multi-tenant por userId, @PreAuthorize, log sem PII além de user_id, odds públicas)
- [x] **Etapa 5 — Release, CI/CD, FinOps e Compressão de Contexto** (devops + orchestrator)
  - [x] Commits atômicos padronizados efetuados no Git (Conventional Commits)
  - [x] FinOps validado (transfer size de 35.73 kB gzipped na rota lazy)
  - [x] Consolidação em KNOWLEDGE_GRAPH.md e STATE.md atualizado
