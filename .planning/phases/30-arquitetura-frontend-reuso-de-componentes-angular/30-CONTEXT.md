# Phase 30: Arquitetura Frontend & Reuso de Componentes (Angular) Context

## Domain
Limpeza de código do Angular, reutilização de componentes UI, remoção de código morto e otimização de imports.

## Decisions

### Padrão de Reuso de Componentes
- **Decisão:** Criar uma pasta `Shared` centralizada contendo os componentes reutilizáveis (botões, cards, modais, etc) padronizados como Standalone Components para consumo nos demais módulos.

### Estratégia de Limpeza de Código
- **Decisão:** Configurar e rodar regras estritas do ESLint para auto-fix e remoção de código morto/imports não utilizados (ex: `unused-imports`), e completar eventuais sobras manualmente.

### Estrutura de Imports
- **Decisão:** Configurar *path aliases* no `tsconfig.json` (ex: `@shared/*`, `@core/*`, `@features/*`) e refatorar os imports existentes para evitar caminhos relativos longos.

## Canonical Refs
- O Frontend é uma aplicação Angular 18 estruturada de forma modular migrando para Standalone.
