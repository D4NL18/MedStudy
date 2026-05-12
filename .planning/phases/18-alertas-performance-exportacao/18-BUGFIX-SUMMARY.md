# Resumo da Execução — Bugfixes Phase 18

**Plano**: `18-BUGFIX-PLAN.md`
**Fase**: 18
**Status**: Concluído
**Data**: 2026-05-12

## O Que Foi Feito

1. **BF-01: Percentual Decimal na UI**
   - Corrigido adicionando o pipe `number:'1.0-0'` em `analise-area.component.html` e `analise-tema.component.html`.
   - Adicionado `Math.round()` no `chartData` do Angular para garantir que os tooltips do ngx-charts sejam valores inteiros.

2. **BF-02: Revisão Intervalada Sem Dados**
   - Corrigido typo na URL de resumo do frontend (`/summary` para `/resumo`).
   - Implementado o endpoint de listagem por tipo (`GET /api/revisoes?tipo=...`) em `RevisionController` e `RevisionService`.
   - Adicionado método `getCurrentUser` com mapeamento adequado (`UserDetails` / `String` email) em `RevisionService` para evitar `ClassCastException`.
   - Incluída query `findBy...` no `StudySessionRepository`.
   - Configurada UI para esconder tabela vazia.

3. **BF-03: Falha na Primeira Tentativa de Login**
   - O interceptor HTTP interpretava qualquer 401 como sessão expirada e forçava auto-logout.
   - Atualizado o `auth.effects.ts` para persistir o token imediatamente no `localStorage` no fluxo síncrono.
   - Atualizado o `auth.interceptor.ts` para ler o token do `localStorage` (como fallback do NgRx) e evitar auto-logout na "race-condition".
   - Inicialização do reducer alterada para carregar o token logo na inicialização.

4. **BF-04: UI do Relatório PDF**
   - O template Thymeleaf (`performance-report.html`) foi inteiramente redesenhado com o layout visualizado no plano, suportando tabela HTML e métricas expandidas (`kpis.studyMetrics`, `areas`, `topErrors`).
   - O `ExportController` foi alterado para injetar `DashboardService` e popular completamente as informações no PDF.
   - Ajustado `html2canvas` para tamanho fixo e cor de fundo branca, garantindo gráficos visíveis e formatados de forma nítida.
