# Phase 20: Ajustes de Responsividade - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Garantir que todos os componentes da interface (especialmente aqueles introduzidos na v1.1 como Badges, Notificações, Analytics e as tabelas de aulas/revisões) funcionem de forma fluida em dispositivos móveis e tablets, melhorando a experiência de uso sem adicionar novas funcionalidades.
</domain>

<decisions>
## Implementation Decisions

### Estratégia de Breakpoints
- **D-01:** Criar um sistema centralizado de breakpoints em `styles.scss` ou `_variables.scss` global.
- **D-02:** Utilizar 4 valores simplificados para o projeto:
  - Mobile Small: `480px`
  - Mobile: `768px`
  - Tablet: `1024px`
  - Desktop: `1400px`

### Navbar Mobile
- **D-03:** Em telas menores (`< 768px`), a barra superior mostrará apenas a Logo, Sino de Notificações e o ícone Hambúrguer (☰).
- **D-04:** O Hambúrguer abrirá um Drawer Lateral (overlay) deslizando da esquerda (`slide-in` da esquerda).
- **D-05:** O Drawer terá um backdrop semitransparente escuro que fecha o menu ao clicar fora dele.
- **D-06:** O Drawer conterá os links de navegação, avatar do usuário e botão "Sair".

### Notificações no Mobile
- **D-07:** O dropdown de notificações atual se transformará em um Bottom Sheet (painel que desliza da parte inferior) em telas mobile.
- **D-08:** A altura será dinâmica (Auto-height) baseada no conteúdo, respeitando limites máximos da tela.
- **D-09:** O usuário pode fechar o Bottom Sheet deslizando para baixo (Swipe-down) ou clicando fora. O Angular CDK Drag/Drop deve ser usado para lidar com os gestos se necessário.

### Tabelas de Dados (Aulas/Revisões)
- **D-10:** As tabelas de listagem vão quebrar o layout tabular em telas pequenas e empilhar em formato de Cards independentes (Stacking layout).
- **D-11:** Os cards deverão manter a mesma estética de Glassmorphism (`var(--color-surface-glass)`, blur, etc) utilizada no restante do sistema para consistência visual.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Roadmap
- `.planning/ROADMAP.md` — Requisito RESP-01 (Phase 20)
- `.planning/PROJECT.md` — Restrições de design e stack (Glassmorphism, v1.1 Constraints)
- `.planning/phases/19-gamificacao-notificacoes/19-CONTEXT.md` — Contexto da fase anterior sobre como badges e notificações funcionam atualmente.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `frontend/src/app/core/layout/shell.component.scss` — Define o grid layout principal e navbar atual (que precisa receber media queries do drawer).
- Estilo Global de Glassmorphism (`.glass` / `--color-surface-glass`) no `styles.scss`.

### Established Patterns
- Utilização de ícones Lucide (lucide-icon) e SCSS aninhado.
- Estrutura da galeria de badges já utiliza `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`, o que ajuda na flexibilidade do layout.

### Integration Points
- Alterações em `shell.component.html/ts` serão necessárias para gerenciar o estado (`isOpen`) do Drawer lateral e do Bottom Sheet.
- Componentes com tabelas complexas: `aulas-list.component`, `dashboard.component`, revisoes list.

</code_context>

<specifics>
## Specific Ideas

- O fechamento do Bottom Sheet de notificações por swipe down precisará captar eventos de touch (pode-se utilizar CDK do Angular para simplificar a física do gesto).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 20-Ajustes de Responsividade*
*Context gathered: 2026-05-13*
