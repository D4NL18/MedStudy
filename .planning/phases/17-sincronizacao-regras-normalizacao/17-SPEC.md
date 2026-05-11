# Spec: Phase 17 - Sincronização de Regras & Normalização

## 🎯 Objetivo
Normalizar os dados de entrada para evitar duplicidade de temas e áreas, além de refinar o algoritmo de Spaced Repetition para sessões e flashcards, garantindo que o progresso do usuário seja consistente com as regras de negócio herdadas.

## 📋 Requisitos (Falsificáveis)

### 1. Normalização de Strings (Backend)
- [ ] Implementar um `StringNormalizer` utilitário que remova espaços extras e padronize o casing (Title Case) para `tema` e `grandeArea`.
- [ ] Aplicar esta normalização em `StudySessionService` (Create/Update).
- [ ] Aplicar esta normalização em `FlashcardService` (Create/Update).
- [ ] Criar um script de migração (SQL) para normalizar os registros existentes no banco de dados.

### 2. Refinamento de Spaced Repetition (Sessions)
- [ ] Ajustar `calculateNextRevision` em `StudySessionService` para seguir a tabela:
  - Acerto < 50% -> 1 dia
  - Acerto 50-75% -> 3 dias
  - Acerto 75-90% -> 7 dias
  - Acerto > 90% -> 15 dias
- [ ] Adicionar flag `urgente` se a taxa de acerto for < 40%.

### 3. Agendamento de Flashcards
- [ ] Ajustar `SpacedRepetitionService` para incluir uma margem de "jitter" aleatório (±10%) no intervalo para evitar acúmulo de cards no mesmo dia.
- [ ] Implementar regra de "Lapse": se o usuário marcar "HARD" 3 vezes seguidas, o card volta ao estado inicial (New).

### 4. Reset de Progresso (Flashcards)
- [ ] Criar endpoint `POST /api/flashcards/reset` que reseta `intervaloAtual`, `easeFactor` e `dataProximaRevisao` de todos os cards do usuário.
- [ ] Adicionar botão de "Reset de Progresso" na UI de Flashcards (Configurações ou Listagem).

## 🚩 Fronteiras (Out of Scope)
- Alteração visual drástica no Dashboard (apenas dados).
- Novos módulos de estudo.

## ✅ Critérios de Aceite (UAT)
1. Criar sessão com tema " pediatria " e verificar se vira "Pediatria".
2. Verificar se uma sessão com 40% de acerto agendou para +1 dia.
3. Verificar se o botão de Reset zera a fila de estudos de hoje.
