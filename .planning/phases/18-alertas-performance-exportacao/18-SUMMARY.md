# Summary: Phase 18 — Alertas de Performance & Exportação

## Accomplishments
- **Backend Export Infrastructure**: Implemented PDF (Flying Saucer/Thymeleaf) and CSV (OpenCSV) export services.
- **Backend Logic**: Added automatic completion date (`dataAula`) setting when a lesson is marked as assisted.
- **Frontend Export Service**: Created a unified service for file downloads and PDF/CSV export triggers.
- **Dashboard Integration**: Added export buttons for PDF and CSV with chart capture functionality.
- **Banco de Dados Integration**: Added CSV export button with active filter support.
- **Performance Alerts**: Implemented visual badges ("Reforço" and "Crítico") in the Aulas list based on lesson performance.
- **Lesson Modal Update**: Added editable assisted status and automated date logic to the modal.

## User-facing changes
- **Dashboard Header**: New buttons to export PDF reports (with charts) and CSV data.
- **Banco Header**: New button to export the current filtered view to CSV.
- **Plano de Aulas**: New "Alertas" column with badges that show performance feedback (yellow for Reforço, red pulsing for Crítico).
- **Lesson Modal**: New fields for marking completion and setting the date, with auto-population of today's date.

## Modified Files
- `backend/pom.xml`
- `backend/src/main/java/com/medstudy/backend/core/export/service/PdfExportService.java`
- `backend/src/main/java/com/medstudy/backend/core/export/service/CsvExportService.java`
- `backend/src/main/java/com/medstudy/backend/core/export/controller/ExportController.java`
- `backend/src/main/java/com/medstudy/backend/modules/aula/service/LessonService.java`
- `backend/src/main/resources/templates/exports/performance-report.html`
- `backend/src/test/java/com/medstudy/backend/modules/aula/service/LessonServiceTest.java`
- `frontend/src/app/core/services/export/export.service.ts`
- `frontend/src/app/features/dashboard/dashboard.component.ts`
- `frontend/src/app/features/dashboard/dashboard.component.html`
- `frontend/src/app/features/dashboard/dashboard.component.scss`
- `frontend/src/app/features/banco/pages/banco-list/banco-list.component.ts`
- `frontend/src/app/features/banco/pages/banco-list/banco-list.component.html`
- `frontend/src/app/features/banco/pages/banco-list/banco-list.component.scss`
- `frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.html`
- `frontend/src/app/features/aulas/pages/aulas-list/aulas-list.component.scss`
- `frontend/src/app/features/aulas/components/lesson-modal/lesson-modal.component.ts`
