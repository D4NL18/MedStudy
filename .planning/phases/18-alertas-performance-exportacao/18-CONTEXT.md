# Context: Phase 18 — Alertas de Performance & Exportação

## 🎯 Objectives
Implementar inteligência visual no plano de aulas (alertas de desempenho) e ferramentas de extração de dados profissionais (PDF/CSV).

## 🛠️ Decisions

### 1. Exportação PDF (Backend)
- **Stack:** Flying Saucer (iText 2.1.7) + Thymeleaf.
- **Workflow Gráficos:** O frontend capturará os componentes de gráfico (`ngx-charts`) como Base64 (PNG) e os enviará no corpo da requisição de exportação. O backend usará esses Base64 para embutir no template HTML do relatório.
- **Relatório:** Focado em desempenho mensal, com tabelas detalhadas e visão geral por área.

### 2. Exportação CSV (Frontend/Backend)
- **Escopo:** Baseado nos filtros ativos na tela de histórico de sessões.
- **Implementação:** O backend gerará o CSV (usando `StringJoiner` ou `OpenCSV`) para garantir que grandes volumes de dados sejam processados corretamente via stream.

### 3. Inteligência no Plano de Aulas (UI)
- **Gatilhos de Alerta:**
  - **Reforço:** Média de acerto no tema < 75%.
  - **Teoria Ineficiente:** Tema marcado como "Assistido" mas com erro em questões > 40%.
- **UI:** Badges coloridas (Amarelo/Vermelho) com ícones Lucide (`Activity`, `AlertOctagon`) e tooltips explicativos.
- **PLAN-09:** Ao marcar "Assistida", a data de conclusão é preenchida com a data atual (editável via DatePicker).

## 🔍 Codebase Integration
- **Backend:** Criar `ExportService` no módulo `core` ou `analytics`.
- **Frontend:** Atualizar `LessonModalComponent` e `AulasListComponent`.
- **State:** Adicionar ações para `ExportPdf` e `ExportCsv` no NgRx.

## 📅 Timeline & Dependencies
- Depende de dados de `StudySession` e `Lesson` (v1.0 completa).
- Precede a Phase 19 (Gamificação).
