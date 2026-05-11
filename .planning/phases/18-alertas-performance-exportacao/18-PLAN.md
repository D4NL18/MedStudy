# Plan: Phase 18 — Alertas de Performance & Exportação

Implementar alertas visuais de desempenho no plano de aulas e exportação de relatórios profissionais (PDF/CSV).

## 📋 Tasks

### Wave 1: Backend Infrastructure (Export)
- [x] **Task 1.1**: Adicionar dependências (`flying-saucer-pdf-openpdf`, `thymeleaf-spring6`) ao `pom.xml`.
- [x] **Task 1.2**: Criar `PdfExportService` com lógica de renderização HTML -> PDF.
- [x] **Task 1.3**: Criar controller `ExportController` com endpoints `POST /api/export/pdf` e `GET /api/export/csv`.
- [x] **Task 1.4**: Implementar `CsvExportService` para gerar stream de dados de sessões filtradas.

### Wave 2: Frontend Integration (Alerts & Export)
- [x] **Task 2.1**: Adicionar botões de Exportação (PDF/CSV) na UI (Dashboard e Banco de Dados).
- [x] **Task 2.2**: Implementar captura de gráficos via `html2canvas` para envio no payload do PDF.
- [x] **Task 2.3**: Atualizar `AulasListComponent` para exibir Badges de "Reforço" e "Teoria Ineficiente".
- [x] **Task 2.4**: Implementar lógica de data de conclusão automática e editável em `LessonModalComponent`.

### Wave 3: Refinement & Validation
- [x] **Task 3.1**: Estilizar o template HTML do relatório PDF (estilo premium/MedStudy).
- [x] **Task 3.2**: Testes unitários para lógica de cálculo de alertas e geração de arquivos.
- [x] **Task 3.3**: Verificação final (UAT) de geração de arquivos e visibilidade dos alertas.

## 🛠️ Verification Loop
1. Exportar PDF com filtros de data e verificar se os gráficos aparecem corretamente.
2. Exportar CSV e abrir no Excel para validar separadores e colunas.
3. Simular baixa performance em um tema e verificar se a Badge de Alerta aparece no Plano de Aulas.
