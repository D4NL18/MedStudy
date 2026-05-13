---
phase: 20
plan: 2
type: execute
wave: 2
depends_on: ["1"]
files_modified:
  - frontend/src/app/features/dashboard/dashboard.component.scss
  - frontend/src/app/features/perfil/perfil.component.scss
  - frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.scss
  - frontend/src/app/features/revisao/pages/revisao-list/revisao-list.component.scss
autonomous: true
requirements:
  - RESP-01
must_haves:
  truths:
    - O Grid do Dashboard colapsa para uma coluna única no mobile.
    - A galeria de Badges exibe corretamente no mobile (scroll ou wrapping).
    - As tabelas de aulas e revisões exibem visual de "cards empilhados" no mobile.
  artifacts:
    - path: frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.scss
      provides: Estilização da tabela em mobile para Stacking Cards.
  key_links: []
---

<objective>
Adaptar os conteúdos internos das páginas (Grids do Dashboard, Galeria do Perfil e as Tabelas de Aulas e Revisões) para funcionarem em dispositivos móveis, completando a responsividade exigida na Fase 20.

Purpose: Garantir que o usuário possa visualizar dados e consumir conteúdo estruturado em telas de até 320px sem overflow horizontal indesejado.
Output: Regras de CSS ajustadas usando os breakpoints globais estabelecidos na Wave 1.
</objective>

<execution_context>
@~/.gemini/antigravity/get-shit-done/workflows/execute-plan.md
@~/.gemini/antigravity/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/20-ajustes-responsividade/20-CONTEXT.md
@.planning/phases/20-ajustes-responsividade/20-UI-SPEC.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Responsividade dos Grids (Dashboard e Perfil)</name>
  <files>
    frontend/src/app/features/dashboard/dashboard.component.scss,
    frontend/src/app/features/perfil/perfil.component.scss
  </files>
  <action>
    No `dashboard.component.scss`, importar os variáveis globais (`styles/themes` e breakpoints se necessário via `@use`). Converter a definição de grid de 3 colunas para 1 coluna usando `@include respond-to('mobile') { grid-template-columns: 1fr; }`.
    No `perfil.component.scss`, ajustar a galeria de badges. Ela já usa auto-fit, mas garantir que não estoure em telas de 320px reduzindo o `minmax` (`minmax(120px, 1fr)` em mobile).
  </action>
  <verify>
    <automated>npm run test -- --include src/app/features/dashboard/dashboard.component.spec.ts</automated>
  </verify>
  <done>Os grids e layouts auto-fit não vazam as bordas da tela mobile (max-width).</done>
</task>

<task type="auto">
  <name>Task 2: Conversão de Tabelas para Stacking Cards</name>
  <files>
    frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.scss,
    frontend/src/app/features/revisao/pages/revisao-list/revisao-list.component.scss
  </files>
  <action>
    Utilizar o design pattern the "Stacking Cards" definido no UI-SPEC para tabelas no mobile.
    Nos arquivos SCSS das duas listas, envolver os seletores da tabela nativa ou estrutura flex em um `@include respond-to('mobile')`.
    Transformar o `.row` ou a estrutura equivalente em elementos `display: flex; flex-direction: column;`.
    Aplicar o glassmorphism aos "cards" gerados: `background: var(--color-surface-glass); backdrop-filter: blur(12px); border-radius: 16px; padding: 16px; gap: 8px; margin-bottom: 16px;`. Ocultar os cabeçalhos das colunas (theads) ou adicionar data-labels dependendo do markup (preferencialmente focar na responsividade de flexbox mantendo a estrutura atual visualmente organizada).
  </action>
  <verify>
    <automated>npm run test -- --include src/app/features/aulas/pages/aulas-list/aulas-list.component.spec.ts</automated>
  </verify>
  <done>As tabelas convertem-se suavemente para um layout empilhado de cartões nas telas móveis.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser | CSS UI Modifications Only |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-20-02 | Denial of Service | SCSS CSSOM | accept | Alterações são puramente CSS e não introduzem riscos lógicos de negação de serviço. |
</threat_model>

<verification>
Abrir a página Aulas e Revisões no simulador de celular do navegador.
O Thead não deve estar poluindo e cada registro (aula/revisão) deve se comportar como um widget vertical (card).
</verification>

<success_criteria>
O usuário pode ler informações em todas as páginas sem rolar para os lados no celular.
</success_criteria>

<output>
After completion, create `.planning/phases/20-ajustes-responsividade/20-2-SUMMARY.md`
</output>
