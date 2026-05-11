# Context: Phase 17 — Sincronização de Regras & Normalização

**Date:** 2026-05-11
**Phase:** 17
**Goal:** Normalizar dados de temas/áreas e refinar algoritmos de revisão.

---

## Domain Boundary
Esta fase foca na integridade dos dados de entrada e na precisão dos algoritmos de repetição espaçada. O objetivo é garantir que o sistema seja resiliente a variações de digitação (normalização) e que o ritmo de estudo seja equilibrado e pedagogicamente eficiente (jitter, lapse e reset).

## Decisions Captured

### 1. Normalização de Strings
- **Estratégia:** Normalização robusta que remove acentos e caracteres especiais para comparação interna, mas mantém a formatação Title Case para exibição.
- **Localização:** A lógica será implementada no ciclo de vida das entidades (`@PrePersist` / `@PreUpdate`), garantindo que os dados sejam limpos antes de atingir o banco de dados.

### 2. Algoritmo de Jitter (Variabilidade)
- **Balanceamento:** O jitter de ±10% não será puramente aleatório; o sistema tentará "espalhar" o agendamento para dias com menor carga de revisões pendentes.
- **Granularidade:** Os intervalos serão sempre arredondados para dias inteiros (Integer Day Rounding).

### 3. Lógica de Lapse (Flashcards)
- **Histórico:** Em caso de Lapse (3x "HARD"), o histórico de revisões passadas e logs de erro serão preservados para fins de Analytics.
- **Penalidade:** O `EaseFactor` do card sofrerá uma penalidade (redução) para garantir que o usuário revise este item com mais frequência no novo ciclo.

### 4. Reset de Progresso
- **Granularidade:** O sistema permitirá resets seletivos por Grande Área (ex: Resetar apenas "Pediatria").
- **Segurança:** Implementação de "Hard Confirmation" exigindo que o usuário digite a palavra "RESETAR" no modal de confirmação.

---

## Canonical Refs
- [17-SPEC.md](17-SPEC.md) (Locked requirements)
- [REQUIREMENTS.md](../../REQUIREMENTS.md) (SYNC-01..04)

## Code Context
- **Backend Services:** `StudySessionService.java`, `SpacedRepetitionService.java`
- **Entities:** `StudySession.java`, `Flashcard.java`
- **Normalization Util:** Criar `com.medstudy.backend.core.util.StringNormalizer`

---

## Deferred Ideas
- *Nenhuma ideia adiada nesta fase.*
