# Status Atual do Desenvolvimento (Context Window)

Este documento é mantido exclusivamente pelo **Orquestrador**. Ele serve como uma memória persistente do estado exato onde a conversa e a funcionalidade se encontram, prevenindo que as diretrizes se percam em contextos (prompts) longos.

## Tarefa Atual em Foco
- **Feature/Entidade:** Minha Clínica Médica: Desbloqueio de Skins do Médico e Provador em Tempo Real (Preview Before Buy)
- **Branch Atual:** `feature/P-093-lootboxes-and-50-rare-items`
- **Etapa Atual do Fluxo:** Ajustes Concluídos e Testados com Sucesso (100% dos testes verdes)
- **Última Ação Realizada:**
  1. **Provador em Tempo Real (Live Preview Before Buy):**
     - O usuário agora pode clicar em qualquer item cosmético (jaleco, estetoscópio, acessório), mesmo que bloqueado, e o avatar no palco esquerdo veste a peça imediatamente em tempo real.
     - Indicador visual no card: badge dourado `👀 Provando` e destaque `.is-previewing`.
     - Trava amigável no botão `💾 Salvar e Equipar`: caso o usuário tente salvar com um item não desbloqueado, o sistema alerta para desbloquear primeiro com seu XP.
  2. **Correção do Desbloqueio de Skins (Botão Desbloquear):**
     - Registrados todos os identificadores canônicos e aliases no catálogo do backend (`OFFICIAL_SKINS_CATALOG`), incluindo `coat_default`, `coat_pediatric`, `coat_gold`, `steth_standard`, `steth_elephant`, `steth_gold`, `acc_red_bowtie`, `acc_scrub_cap`.
     - Atualizado `ClinicService.buySkin` para retornar o mapa com `unlockedSkins` e saldo atualizado.
     - Atualizado `ClinicService.buyDoctorSkin` no frontend para manter a reatividade das skins desbloqueadas sem corromper o estado global do avatar.
     - Auto-equipa a peça desbloqueada na hora e toca feedback sonoro de compra.
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
