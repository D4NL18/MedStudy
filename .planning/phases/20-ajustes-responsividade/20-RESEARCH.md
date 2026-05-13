# Phase 20: Ajustes de Responsividade - Research

**Researched:** 2026-05-13
**Domain:** Frontend UI / CSS / Angular CDK
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Criar um sistema centralizado de breakpoints em styles.scss.
- Utilizar 4 valores simplificados para o projeto: 480px, 768px, 1024px, 1400px.
- Em telas menores (< 768px), a barra superior mostrará apenas a Logo, Sino de Notificações e o ícone Hambúrguer (☰).
- O Hambúrguer abrirá um Drawer Lateral (overlay) deslizando da esquerda.
- O Drawer terá um backdrop semitransparente escuro que fecha o menu ao clicar fora dele.
- O Drawer conterá os links de navegação, avatar do usuário e botão "Sair".
- O dropdown de notificações atual se transformará em um Bottom Sheet (painel que desliza da parte inferior) em telas mobile.
- A altura será dinâmica (Auto-height) baseada no conteúdo, respeitando limites máximos da tela.
- O usuário pode fechar o Bottom Sheet deslizando para baixo (Swipe-down) ou clicando fora.
- As tabelas de listagem vão quebrar o layout tabular em telas pequenas e empilhar em formato de Cards independentes (Stacking layout).
- Os cards deverão manter a estética de Glassmorphism.

### the agent's Discretion
- O fechamento do Bottom Sheet de notificações por swipe down precisará captar eventos de touch (pode-se utilizar CDK do Angular para simplificar a física do gesto).

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RESP-01 | Adaptação de layout para mobile e tablet | SCSS media queries baseadas em mixins globais, `@angular/cdk/overlay` e `cdkDrag` |
</phase_requirements>

## Summary

Esta fase concentra-se puramente em CSS e restruturação visual sem adicionar ou remover regras de negócio. O trabalho consiste em centralizar os media queries, refatorar a navegação (`Navbar`/`Drawer`), aplicar o padrão de bottom sheet para notificações e adaptar tabelas para "cards empilhados". 

**Primary recommendation:** Utilizar `@angular/cdk/overlay` e `@angular/cdk/drag-drop` (que já estão instalados na v21.2) para implementar os overlays sem reinventar os cálculos de posicionamento e backdrop.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Responsive Layout | Browser / Client | — | Trata-se puramente de CSS via CSS Media Queries |
| Drawer State | Browser / Client | — | Estado do Menu Hambúrguer contido no `shell.component` |
| Touch Gestures | Browser / Client | — | Angular CDK para swipe-to-close do Bottom Sheet |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SCSS | — | Estilização | Estilo padrão adotado pelo projeto |
| @angular/cdk | ^21.2.10 | Overlays e Drag/Drop | CDK já presente e nativo ao ecossistema Angular |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @angular/cdk/overlay | ngClass conditionally | CDK trata acessibilidade (focus trap), scroll lock e backdrops nativamente |

## Architecture Patterns

### Pattern 1: CSS Mixins para Breakpoints
**What:** Definir as variáveis globais no `styles.scss` usando map e mixins, para que todos os componentes fiquem consistentes.
**When to use:** Em todo lugar que for usar `@media`.
**Example:**
```scss
$breakpoints: (
  xs: 480px,
  mobile: 768px,
  tablet: 1024px,
  desktop: 1400px
);

@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (max-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

### Pattern 2: Angular CDK Drag-Drop para Swipe-to-close
**What:** CDK `cdkDrag` restrito a movimentação vertical e atrelado a um limite, de forma que ao soltar, feche o bottom sheet.
**When to use:** No componente Bottom Sheet das notificações mobile.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Overlays (Bottom sheet, Drawer) | Divs com `z-index` e fixed positioning controladas por boolean | `@angular/cdk/overlay` ou `mat-drawer` se já usado | Lidar com scroll locking, focus trapping, e backdrop click closing é extremamente propício a bugs quando hand-rolled. |

## Common Pitfalls

### Pitfall 1: Aninhamento Excessivo nas Media Queries
**What goes wrong:** Sobrescrita excessiva de regras CSS (ex: `.mobile-view .table .cell`).
**Why it happens:** Tentativa de reaproveitar markup sem usar display styles apropriados (ex: flex vs table).
**How to avoid:** O uso do flexbox nas "tabelas-cards" com `flex-direction: column` simplifica as regras ao invés de forçar regras de display.

## Code Examples

### Stacking Cards
```scss
.table-responsive {
  @include respond-to('mobile') {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    // Convert rows to glass cards
    .row {
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-radius: 16px;
      background: var(--color-surface-glass);
      backdrop-filter: blur(12px);
    }
  }
}
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Angular CDK será usado para lidar com touch events (swipe) | Arch Patterns | Se não usado, swipe precisará de listeners `touchstart`/`touchend` complexos e propensos a bugs. |

## Environment Availability

Step 2.6: SKIPPED (no external dependencies identified)

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Jasmine + Karma |
| Config file | karma.conf.js |
| Quick run command | `npm run test` |
| Full suite command | `npm run test -- --watch=false --browsers=ChromeHeadless` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RESP-01 | Shell Component renderiza Drawer quando tela < 768px | unit | `npm run test` | ✅ |
| RESP-01 | Notificações disparam ação de fechar ao realizar o gesto | unit | `npm run test` | ✅ |

### Wave 0 Gaps
None — existing test infrastructure covers all phase requirements.

## Sources

### Primary (HIGH confidence)
- `package.json` — Verified Angular 21.2.12 and `@angular/cdk` installed
- `styles.scss` — Verified Glassmorphism patterns and global SCSS structure

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Angular and its CDK are already installed and used.
- Architecture: HIGH - the CSS/SCSS media queries mixin is the industry standard approach for Angular.
- Pitfalls: HIGH - Common responsive UI refactoring bugs are well known.

**Research date:** 2026-05-13
**Valid until:** 2026-06-13
