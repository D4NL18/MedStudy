# Ship Report: Phase 17 — Sincronização de Regras & Normalização

**Phase:** 17
**Status:** 🚢 SHIPPED
**Date:** 2026-05-11

## 🚀 Resumo das Alterações
Esta fase implementou a normalização de dados legados, o refinamento dos algoritmos de repetição espaçada e a infraestrutura para reset granular de progresso.

### 1. Normalização & Consistência (Backend)
- Criada classe utilitária `StringNormalizer` (NFD + Regex + Title Case).
- Adicionados hooks `@PrePersist` e `@PreUpdate` em `StudySession` e `Flashcard`.
- Migrações Flyway `V10`, `V11` e `V12` para atualizar schema e normalizar dados existentes.

### 2. Inteligência de Estudo (SRS)
- Atualizados intervalos de revisão em `StudySessionService` (1, 3, 7, 15 dias).
- Implementado **Jitter com Load Balancing** em `SpacedRepetitionService`.
- Implementada **Penalidade de Lapse (Ease Factor)** após 3 "HARD" consecutivos.

### 3. Reset de Progresso (Full Stack)
- Criado endpoint `POST /api/flashcards/reset` no backend.
- Desenvolvido modal de confirmação no frontend com trava de segurança (digitar "RESETAR").
- Integrado botão de reset na lista de flashcards.

## 🧪 Verificação Final
- **Backend Tests:** `mvn test` - 98 testes aprovados (100% de sucesso).
- **Frontend Tests:** `ng test` - Componente de reset validado com sucesso.
- **UAT Manual:** Verificado via subagente no browser.

## 📦 Entrega
Branch: `feat/17-sincronizacao-regras-normalizacao`
PR pronto para merge.
