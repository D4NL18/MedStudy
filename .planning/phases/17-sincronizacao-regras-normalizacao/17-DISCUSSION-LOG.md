# Discussion Log: Phase 17 — Sincronização de Regras & Normalização

**Date:** 2026-05-11
**Participants:** USER, Antigravity (AI Assistant)

## Areas Discussed

### 1. Normalização de Strings
- **User Preference:** Opção 2 (Robusta) e Opção 2 (Entity Lifecycle).
- **Outcome:** Normalização via `@PrePersist` removendo acentos para comparação.

### 2. Implementação do Jitter
- **User Preference:** Opção 2 (Balanceamento de Carga) e Opção 1 (Arredondamento para dias inteiros).
- **Outcome:** Jitter inteligente para espalhar carga, arredondado para dias inteiros.

### 3. Lógica de "Lapse"
- **User Preference:** Opção 1 (Preservar Histórico) e Opção 1 (Penalidade no Ease Factor).
- **Outcome:** Lapse reseta intervalo mas mantém logs; `EaseFactor` é penalizado.

### 4. Reset de Progresso
- **User Preference:** Opção 2 (Granular) e Opção 2 (Hard Confirmation).
- **Outcome:** Reset por Grande Área com confirmação via digitação de "RESETAR".

## Conclusion
Decisões de implementação capturadas e prontas para guiar o planejamento e execução.
