# Phase 33 Plan: UX Polish, Animações e Fluidez (Aesthetics)

## 1. Skeleton Loaders
- Criar componente genérico `SkeletonComponent` em `shared/components/skeleton` com variações (linha, círculo, bloco).
- Criar skeleton super detalhado para `Dashboard` e `Social Feed` com componentes como `DashboardSkeleton` e `FeedSkeleton`.
- Integrar os skeletons nos componentes existentes durante carregamento.

## 2. ChangeDetectionStrategy.OnPush
- Refatorar componentes "Dumb/Presentational" (como `ButtonComponent`, `CardComponent`, `AvatarComponent`) para `ChangeDetectionStrategy.OnPush`.
- Manter componentes "Smart/Containers" (como `AulasList`, `FlashcardsStudy`) no padrão atual, priorizando o risco mínimo.

## 3. Animações (Estilo Misto)
- Criar animações de entrada/saída padronizadas no Angular (ex: `animations.ts` em `shared/animations`).
- Transições rápidas para ações rotineiras (ex: favoritar um flashcard, abrir menu dropdown).
- Animações fluidas e elaboradas para entrada e saída de modais (ex: `LessonModal`, `SessionModal`).

## 4. Feedback de Interação
- Criar diretiva `RippleDirective` em `shared/directives/ripple`.
- Aplicar essa diretiva em todos os botões (`ButtonComponent`) e cards clicáveis (`CardComponent`).
- Adicionar transição sutil de escala `transform: scale(0.98)` ao estado `:active` dos elementos interativos.
