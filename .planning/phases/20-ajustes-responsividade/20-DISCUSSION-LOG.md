# Phase 20: Ajustes de Responsividade - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-13
**Phase:** 20-ajustes-responsividade
**Areas discussed:** Estratégia de Breakpoints, Navbar Mobile, Dropdown de Notificações, Tabelas de Dados

---

## Estratégia de Breakpoints

| Option | Description | Selected |
|--------|-------------|----------|
| Sistema centralizado em styles.scss | Variáveis globais para todos os componentes importarem | ✓ |
| Valores locais padronizados | Cada arquivo define suas queries manualmente | |
| Você decide | Deixar para o agente de planejamento | |

**User's choice:** Sistema centralizado em styles.scss
**Notes:** Decidido uso de 4 breakpoints com adição de um específico "mobile small" (480px, 768px, 1024px, 1400px).

---

## Navbar Mobile

| Option | Description | Selected |
|--------|-------------|----------|
| Menu hambúrguer (overlay lateral / drawer) | Painel lateral com links da esquerda | ✓ |
| Menu hambúrguer (dropdown vertical) | Links expandem para baixo empilhados | |
| Bottom navigation bar | Links fixos na parte inferior da tela | |

**User's choice:** Drawer lateral (overlay)
**Notes:** A barra mostrará apenas a Logo, ☰ e Sino. O Avatar e botão Sair estarão dentro do Drawer. Backdrop escuro que fecha o menu ao clicar fora.

---

## Dropdown de Notificações no Mobile

| Option | Description | Selected |
|--------|-------------|----------|
| Bottom Sheet (Desliza de baixo) | Ocupa toda largura vindo da base da tela | ✓ |
| Fullscreen Modal | Modal tela inteira bloqueando UI | |
| Abaixo da Navbar 100% largura | Igual dropdown mas cobrindo bordas laterais | |

**User's choice:** Bottom Sheet (Desliza de baixo)
**Notes:** Altura baseada no conteúdo (Auto-height). Swipe-down para fechar, ou clicar fora.

---

## Tabelas de Dados (Aulas/Revisões)

| Option | Description | Selected |
|--------|-------------|----------|
| Transformar em Cards (Stacking) | Empilhar as células verticalmente e ler como lista de cards | ✓ |
| Scroll Horizontal | Manter tabular com overflow lateral | |
| Ocultar colunas (Responsive Columns) | Retirar colunas secundárias em mobile | |

**User's choice:** Transformar em Cards (Stacking)
**Notes:** O visual dos cards deve manter o estilo Glassmorphism utilizado globalmente.

---

## the agent's Discretion

None.

## Deferred Ideas

None.
