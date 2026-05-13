---
phase: 20
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/styles.scss
  - frontend/src/app/core/layout/shell.component.ts
  - frontend/src/app/core/layout/shell.component.html
  - frontend/src/app/core/layout/shell.component.scss
autonomous: true
requirements:
  - RESP-01
must_haves:
  truths:
    - O sistema tem breakpoints globais aplicados.
    - Em telas menores que 768px, o menu da navbar é ocultado e o ícone de hambúrguer aparece.
    - O menu hambúrguer abre um Drawer lateral vindo da esquerda com os links, avatar e sair.
    - O sino de notificações abre um Bottom Sheet em telas mobile.
  artifacts:
    - path: frontend/src/styles.scss
      provides: Mixins de breakpoints globais
    - path: frontend/src/app/core/layout/shell.component.html
      provides: Elementos CDK Overlay para Drawer e Bottom Sheet
  key_links:
    - from: frontend/src/app/core/layout/shell.component.ts
      to: CDK Overlay
      via: Controle de visibilidade stateful
---

<objective>
Implementar a infraestrutura de responsividade base, incluindo mixins SCSS para breakpoints e a transformação da Navbar em um sistema móvel robusto usando o Angular CDK para Drawer Lateral e Bottom Sheet de Notificações.

Purpose: Garantir a navegabilidade e acesso a notificações de forma fluida em telas mobile.
Output: Navbar atualizada com Drawer Lateral (Hambúrguer) e Bottom Sheet (Sino de Notificações) ativados apenas via Media Queries.
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
  <name>Task 1: Mixins de Breakpoints e CDK Core</name>
  <files>frontend/src/styles.scss</files>
  <action>
    Adicionar um mapa de breakpoints (`$bp-xs: 480px, $bp-mobile: 768px, $bp-tablet: 1024px, $bp-desktop: 1400px`) e um mixin `respond-to($breakpoint)` no arquivo global `styles.scss`.
    Adicionar também classes base para CDK Overlay: `.drawer-overlay-pane` (para fixar o Drawer à esquerda) e `.bottom-sheet-overlay-pane` (para fixar na base da tela).
  </action>
  <verify>
    <automated>npm run test</automated>
  </verify>
  <done>Os mixins estão declarados corretamente e as classes CDK Overlay estão definidas no escopo global.</done>
</task>

<task type="auto">
  <name>Task 2: Refatoração da Navbar e Implementação do Drawer</name>
  <files>
    frontend/src/app/core/layout/shell.component.ts,
    frontend/src/app/core/layout/shell.component.html,
    frontend/src/app/core/layout/shell.component.scss
  </files>
  <action>
    Em `shell.component.scss`, usar o mixin `@include respond-to('mobile')` para ocultar os links normais da navbar e exibir um botão ☰.
    Em `shell.component.ts`, injetar dependências do Angular CDK, gerenciar os estados de overlay.
    Em `shell.component.html`, criar um CDK portal/template-driven overlay para o Drawer que se abre da esquerda, apresentando os links e o usuário (avatar e botão Sair). O overlay deve ter um backdrop (`hasBackdrop="true"`) com `backdropClick` configurado para fechar o Drawer.
  </action>
  <verify>
    <automated>npm run test -- --include src/app/core/layout/shell.component.spec.ts</automated>
  </verify>
  <done>Navbar renderiza o menu mobile com Drawer lateral controlado por um botão ☰ em telas < 768px.</done>
</task>

<task type="auto">
  <name>Task 3: Refatoração de Notificações para Bottom Sheet</name>
  <files>
    frontend/src/app/core/layout/shell.component.ts,
    frontend/src/app/core/layout/shell.component.html,
    frontend/src/app/core/layout/shell.component.scss
  </files>
  <action>
    Adaptar o dropdown de notificações atual: em telas maiores que 768px, mantém o comportamento atual. Em telas `< 768px`, ele deve usar um Bottom Sheet.
    Utilize também classes Overlay conectadas (ou CDK Dialog sem backdrop fixo se aplicável), posicionado na parte inferior da tela. Implemente a lógica usando `cdkDrag` restrito verticalmente ou apenas botão de fechar se simplificado.
    Adicionar as media queries em `shell.component.scss` para modificar o container das notificações para largura auto e fundo de tela.
  </action>
  <verify>
    <automated>npm run test -- --include src/app/core/layout/shell.component.spec.ts</automated>
  </verify>
  <done>As notificações aparecem corretamente num Bottom Sheet em aparelhos mobile e podem ser dispensadas.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser | Renderização UI apenas |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-20-01 | Information Disclosure | shell.component | accept | O drawer de navegação e notificações lida com dados já autenticados e retornados da API. Sem novos riscos de escalação. |
</threat_model>

<verification>
Verificar manualmente usando Chrome DevTools:
1. O mixin SCSS está disponível globalmente.
2. O botão ☰ da Navbar abre e fecha o menu Drawer via backdrop click.
3. O Sino abre as notificações como Dropdown em desktop e Bottom Sheet em mobile.
</verification>

<success_criteria>
O ShellApp se adapta perfeitamente do formato 1080p para telas mobile (320px/480px) sem quebra de flexbox da Navbar e sem perda da funcionalidade de navegação e notificações.
</success_criteria>

<output>
After completion, create `.planning/phases/20-ajustes-responsividade/20-1-SUMMARY.md`
</output>
