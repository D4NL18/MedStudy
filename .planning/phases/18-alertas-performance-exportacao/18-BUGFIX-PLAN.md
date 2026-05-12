# Phase 18 — Bug Fix & UI Enhancement Plan

**Criado:** 2026-05-12  
**Status:** pending  
**Relacionado à:** 18-UAT.md, 18-SUMMARY.md

---

## Visão Geral

Este plano cobre quatro itens de correção/melhoria identificados pós-UAT da Phase 18:

| # | Tipo | Título | Arquivo(s) Principal(is) |
|---|------|--------|--------------------------|
| BF-01 | Bug Frontend | Percentual exibido com decimais excessivos | `analise-area.component.html`, `analise-tema.component.html` |
| BF-02 | Bug Full-Stack | Revisão Intervalada sem dados para usuário com sessões | `RevisionController.java`, `revision.service.ts`, `revisao-list.component.*` |
| BF-03 | Bug Backend | Primeira tentativa de login sempre falha | `AuthController`, fluxo de cookie/JWT |
| BF-04 | Feature UI | Melhorar relatório PDF com dados completos do Dashboard | `performance-report.html`, `ExportService.java`, `dashboard.component.ts` |

---

## BF-01 — Percentual Decimal em Análise de Área e Tema

### Diagnóstico
- **Local:** `analise-area.component.html` (linha 31) e o equivalente em `analise-tema`.
- **Causa:** O campo `area.accuracy` retorna `double` do backend (ex: `55.5555555555556`). No template HTML, ele é renderizado diretamente como `{{ area.accuracy }}%` sem formatação.
- No Dashboard (linha 91 de `dashboard.component.html`) o mesmo campo já usa `| number:'1.0-0'` (zero casas decimais) — o que está correto.
- A `analise-area` **não usa** o pipe `number`, passando o valor cru.

### Correções

**Arquivo 1:** `frontend/src/app/features/analytics/pages/analise-area/analise-area.component.html`
- Linha 31: `{{ area.accuracy }}%` → `{{ area.accuracy | number:'1.0-0' }}%`
- O `chartData()` computed já entrega `a.accuracy || 0` como valor do gráfico — verificar se `ngx-charts` também exibe label com decimal no tooltip; se sim, aplicar `Math.round()` no `computed()` em `analise-area.component.ts`.

**Arquivo 2:** `frontend/src/app/features/analytics/pages/analise-tema/analise-tema.component.html`
- Localizar a exibição do campo de acerto e aplicar o mesmo pipe `| number:'1.0-0'`.

**Arquivo 3:** `analise-area.component.ts` — `chartData` computed:
```ts
// De:
value: a.accuracy || 0
// Para:
value: Math.round(a.accuracy || 0)
```

**Verificação:** Após a correção, Pediatria deve exibir `56%` e Medicina Preventiva `90%`.

---

## BF-02 — Revisão Intervalada sem Dados

### Diagnóstico

Existem **dois problemas distintos** na cadeia de requisição:

#### Problema A — Mismatch de rota (API 404)
- O frontend chama `GET /api/revisoes/summary` (`revision.service.ts`, linha 16).
- O backend expõe `GET /api/revisoes/resumo` (`RevisionController.java`, linha 21).
- **Conclusão:** O endpoint `/summary` não existe → a requisição retorna 404 → o NgRx dispara `loadSummaryFailure` → a UI permanece vazia sem mensagem de erro ao usuário.

#### Problema B — Endpoint de listagem ausente
- O frontend chama `GET /api/revisoes?tipo=HOJE` (`revision.service.ts`, linha 21).
- O `RevisionController.java` **não implementa** este endpoint de listagem — o comentário na linha 26 diz "será implementado depois".
- Resultado: a aba de sessões também retorna 404.

#### Problema C — `RevisionService.getSummary()` usa `principal` sem verificação
- `(User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()` assume que o principal é sempre do tipo `User`. Se o token for válido mas o principal for `UserDetails` (String email), lança `ClassCastException` → 500.

### Correções

**Fix A — Alinhar rota no frontend:**
Arquivo: `frontend/src/app/core/services/revision.service.ts`
```ts
// De:
getSummary(): Observable<RevisionSummary> {
  return this.http.get<RevisionSummary>(`${this.apiUrl}/summary`);
}
// Para:
getSummary(): Observable<RevisionSummary> {
  return this.http.get<RevisionSummary>(`${this.apiUrl}/resumo`);
}
```

**Fix B — Implementar endpoint de listagem no backend:**
Arquivo: `backend/.../revision/controller/RevisionController.java`
- Adicionar `@GetMapping` que recebe `@RequestParam String tipo` (ATRASADAS, HOJE, FUTURAS, CONCLUIDAS).
- Delegar para `RevisionService.getSessions(userId, tipo)`.

Arquivo: `backend/.../revision/service/RevisionService.java`
- Implementar `getSessions(UUID userId, String tipo)` que filtra `StudySession` por `dataProximaRevisao` e `revisaoConcluida` conforme o tipo:
  - `ATRASADAS` → `dataProximaRevisao < hoje AND revisaoConcluida = false`
  - `HOJE` → `dataProximaRevisao = hoje AND revisaoConcluida = false`
  - `FUTURAS` → `dataProximaRevisao > hoje AND revisaoConcluida = false`
  - `CONCLUIDAS` → `revisaoConcluida = true`
- Retornar `List<StudySessionResponse>`.

**Fix C — Resolver `ClassCastException` no principal:**
Arquivo: `backend/.../revision/service/RevisionService.java`
- Usar padrão igual ao `StudySessionService.getCurrentUser()`:
```java
private User getCurrentUser() {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (principal instanceof User u) return u;
    // ... busca por email
}
```

**Fix D — Exibir mensagem de "sem dados" na UI:**
Arquivo: `frontend/src/app/features/revisao/pages/revisao-list/revisao-list.component.html`
- Adicionar estado vazio (`*ngIf="(sessions$ | async)?.length === 0 && !(loading$ | async)"`) com mensagem amigável: *"Nenhuma revisão para esta categoria."*

---

## BF-03 — Primeira Tentativa de Login Sempre Falha

### Diagnóstico

**Hipótese principal (Race Condition de Cookie):**
O fluxo de login é:
1. Frontend envia `POST /api/auth/login` → backend seta cookie `access_token` + retorna body com dados do usuário.
2. O Angular dispara imediatamente uma segunda requisição autenticada (ex: `GET /api/dashboard/kpis`) **antes** do cookie estar disponível para o browser.
3. O interceptor HTTP retorna 401 e o NgRx Auth reducer interpreta isso como falha de login.

**Hipótese secundária (Estado sujo do NgRx):**
- O `auth.reducer` mantém `error: null` apenas no estado inicial. Se a sessão anterior deixou um erro no store (ex: reload da página com estado persistido), o sinal `selectAuthError` já aparece como erro antes mesmo de submeter.

**Hipótese terciária (Cookie HttpOnly no primeiro carregamento):**
- O `JwtAuthenticationFilter` lê o cookie `access_token`. Se na primeira requisição pós-login o cookie ainda não foi confirmado pelo browser (timing do `Set-Cookie` + CORS), o filtro não encontra o token e o trata como não autenticado.

### Investigação necessária antes do fix:
1. Verificar se `AuthController` define `SameSite`, `Path` e `Secure` corretamente no cookie.
2. Verificar se o `auth.effects.ts` faz dispatch de `loginSuccess` apenas após o token ser confirmado.
3. Verificar se o `auth.reducer` reseta `error: null` no dispatch de `login` (loading state).

### Correções

**Fix A — Garantir reset de erro no início do login:**
Arquivo: `frontend/src/app/store/auth/auth.reducer.ts`
- No case `login`, garantir que `error` seja resetado para `null`:
```ts
on(AuthActions.login, (state) => ({ ...state, loading: true, error: null }))
```

**Fix B — Adicionar delay/guard no fluxo pós-login:**
Arquivo: `frontend/src/app/store/auth/auth.effects.ts`
- Após `loginSuccess`, aguardar a confirmação do cookie antes de redirecionar e disparar carregamentos de dados (usar `tap` + `delay(100)` ou aguardar próxima tick com `setTimeout`).

**Fix C — Backend: verificar atributos do cookie Set-Cookie:**
Arquivo: `backend/.../core/util/CookieUtil.java` ou `AuthController.java`
- Confirmar que `HttpOnly`, `Path=/`, `SameSite=Lax` estão definidos.
- Confirmar que `Secure=false` em ambiente dev (localhost não tem HTTPS).

**Fix D — Adicionar logging no `JwtAuthenticationFilter`:**
- Adicionar log `DEBUG` quando `jwt == null` para confirmar se é realmente um problema de cookie ou de lógica do filtro.

---

## BF-04 — Melhoria do Relatório PDF

### Diagnóstico
O template atual (`performance-report.html`) apresenta:
- Gráficos renderizados como imagens PNG capturadas pelo frontend — mas o container dos gráficos é pequeno e sem contraste no PDF (fundo branco vs tema escuro).
- Apenas 4 métricas no "Resumo Geral" (questões, média, sessões, streak).
- Sem tabela de Desempenho por Área.
- Sem tabela de Desempenho por Tema (presente em `analise-tema`).
- Sem o Ranking de Maiores Erros (`app-top-errors-ranking`).
- Sem Área Mais Forte / Área Mais Fraca.

### O que o Dashboard contém (excluindo troca de tema):
1. KPIs: Taxa Global, Questões Total, Sessões, Área Mais Forte, Área Mais Fraca, Streak
2. Gráfico: Evolução Mensal (%)
3. Tabela: Desempenho por Área (com Acerto % e Tendência 30d)
4. Gráfico: Distribuição de Questões (donut chart)
5. Ranking: Top Erros

### Correções

**Fix A — Backend: Ampliar dados passados ao template:**
Arquivo: `backend/.../modules/export/service/ExportService.java` (método de geração do PDF)
- Injetar `DashboardService` ou `AnalyticsService` para buscar:
  - `List<AreaAnalyticsResponse>` (tabela de áreas)
  - `DashboardKpisResponse` (bestArea, worstArea, totalQuestions, totalSessions, successRate, streak)
- Adicionar esses objetos ao `model` do Thymeleaf: `model.put("areas", areaList)`, `model.put("kpis", kpisResponse)`.

**Fix B — Template: Redesenhar com dados completos e layout PDF-friendly:**
Arquivo: `backend/.../resources/templates/exports/performance-report.html`
- **Seção 1 — Cabeçalho:** Título + data geração + nome do usuário.
- **Seção 2 — KPIs (6 cards em linha):** Taxa Global, Questões, Sessões, Streak, Área Forte, Área Fraca.
- **Seção 3 — Tabela de Desempenho por Área:** `th:each="area : ${areas}"` com colunas: Grande Área | Questões | Acerto (%) | Tendência.
  - Formatar acerto como inteiro: `${#numbers.formatDecimal(area.accuracy, 1, 0)}%`
- **Seção 4 — Análise Visual:** Container dos gráficos capturados (evolution-chart + distribution-chart) com largura 100% e `border` visível.
  - Adicionar título acima de cada gráfico.
  - Definir altura mínima de 300px para o container.
- **Estilo PDF-friendly:**
  - Fundo branco, texto escuro (#1a1a1a).
  - Cores de destaque: primária `#6F0642`, sucesso `#10b981`, erro `#ef4444`.
  - Usar `display: table` para grids (Flying Saucer não suporta `flexbox`/`grid` CSS).
  - Bordas e separadores claros entre seções.
  - Page-break: `page-break-after: always` na seção de gráficos.

**Fix C — Frontend: Capturar gráfico de distribuição com tamanho correto:**
Arquivo: `frontend/src/app/features/dashboard/dashboard.component.ts` (método `exportPdf`)
- Garantir que os elementos `#evolution-chart` e `#distribution-chart` tenham dimensões fixas antes da captura (`html2canvas`).
- Usar opções de `html2canvas`: `{ scale: 2, backgroundColor: '#ffffff' }` para alta resolução e fundo branco.

---

## Ordem de Execução Recomendada

```
Wave 1 (Frontend, Independentes):
  ├── BF-01: Formatar percentuais (5 min)
  └── BF-03-A: Reset erro no auth.reducer (10 min)

Wave 2 (Backend):
  ├── BF-02-A: Alinhar rota /resumo no frontend (2 min)
  ├── BF-02-B: Implementar endpoint GET /api/revisoes (listagem) (30 min)
  ├── BF-02-C: Fix ClassCastException no RevisionService (10 min)
  └── BF-03-C: Verificar atributos do cookie no AuthController (15 min)

Wave 3 (Feature):
  └── BF-04: Redesenhar template PDF + ampliar dados backend (60 min)

Wave 4 (UI Polish):
  ├── BF-02-D: Empty state no revisao-list (10 min)
  └── BF-03-B: Delay pós-login no auth.effects (10 min)
```

## Arquivos a Modificar

| Arquivo | Bug |
|---------|-----|
| `frontend/.../analise-area/analise-area.component.html` | BF-01 |
| `frontend/.../analise-area/analise-area.component.ts` | BF-01 |
| `frontend/.../analise-tema/analise-tema.component.html` | BF-01 |
| `frontend/.../core/services/revision.service.ts` | BF-02 |
| `frontend/.../features/revisao/.../revisao-list.component.html` | BF-02 |
| `frontend/.../store/auth/auth.reducer.ts` | BF-03 |
| `frontend/.../store/auth/auth.effects.ts` | BF-03 |
| `backend/.../revision/controller/RevisionController.java` | BF-02 |
| `backend/.../revision/service/RevisionService.java` | BF-02 |
| `backend/.../export/service/ExportService.java` | BF-04 |
| `backend/.../resources/templates/exports/performance-report.html` | BF-04 |
| `frontend/.../dashboard/dashboard.component.ts` | BF-04 |
