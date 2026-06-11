# Phase 33 Context: UX Polish, Animações e Fluidez (Aesthetics)

## Domain
UI/UX, Animações, Feedback Visual, Componentes Angular (OnPush e Skeletons)

## Canonical References
- ROADMAP.md
- REQUIREMENTS.md

## Code Context
A interface usa Angular e requer adoção de boas práticas de reatividade (ChangeDetectionStrategy.OnPush) e melhorias visuais.

## Decisions

### 1. Estilo das Animações
- **Decisão:** Mistas (Rápidas para navegação/ações, elaboradas para entrada/saída de modais e páginas).

### 2. Skeleton Loaders
- **Decisão:** Misto: Skeletons super detalhados apenas nas telas principais (Dashboard/Feed) e genéricos nas secundárias.

### 3. ChangeDetectionStrategy.OnPush
- **Decisão:** Híbrido por Camadas: Componentes "Dumb/Presentational" 100% OnPush. Componentes "Smart/Containers" podem continuar como Default se a refatoração for muito arriscada.

### 4. Feedback de Interação
- **Decisão:** Feedback explícito e marcante (Ondas (ripple), vibração (haptic se possível), botões que mudam visivelmente o tamanho/cor ao clicar).

## Deferred Ideas
None.
