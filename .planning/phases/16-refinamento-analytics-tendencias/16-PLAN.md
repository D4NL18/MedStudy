# Plan: Phase 16 — Refinamento de Analytics & Tendências

**Phase:** 16
**Goal:** Implementar tendências de 30 dias e drill-down por subárea conforme legado.
**Complexity:** Medium

---

## 🏗️ Architecture & Design
- **Backend:** Spring Boot (JPA/Hibernate)
- **Frontend:** Angular 18 (NgRx, Lucide Icons, ngx-charts)
- **Design System:** Vanilla CSS + Lucide Icons for indicators.

## 📝 Tasks

### 1. Backend: Data Infrastructure (Analytics)
- [ ] **Task 1.1: Update Analytics DTOs**
  - Add `trendShort` and `trendLong` to `AreaAnalyticsResponse` and `TopicAnalyticsResponse`.
  - Add `performanceLevel` field to both DTOs.
- [ ] **Task 1.2: Refactor AnalyticsService Trend Logic**
  - Implement dual window comparison: 7d vs 30d (Short) and 30d vs Global (Long).
  - Update `calculatePerformanceLevel` to new thresholds (<70, 70-85, >85).
- [ ] **Task 1.3: Implement Ranking of Errors Endpoint**
  - Create `getTopErrorThemes` in `AnalyticsService`.
  - Criteria: Themes with highest error rate, min 3 questions, filtered by period.
- [ ] **Task 1.4: Unit Tests for AnalyticsService**
  - Verify trend calculations with mocked repository data.
  - Verify breakpoint logic.

### 2. Frontend: Core Services & State
- [ ] **Task 2.1: Implement PerformanceThemeService**
  - Create `performance-theme.service.ts` in `core/services`.
  - Logic to return hex colors/classes based on performance rates.
- [ ] **Task 2.2: Update NgRx Dashboard Store**
  - Update `DashboardKPIs` interface to include `areaAnalytics`.
  - Add `loadAreaAnalytics` actions/effects to fetch data from `/api/analytics/areas`.
- [ ] **Task 2.3: Integrate Performance Colors in Dashboard**
  - Update KPI cards to use the new service for text/background colors.

### 3. Frontend: Components & UI
- [ ] **Task 3.1: Create SubareaModalComponent**
  - Responsive modal showing topics of a selected area.
  - Include trend indicators (Lucide icons).
- [ ] **Task 3.2: Create TopErrorsRankingComponent**
  - List of top 10 error themes with 60d/Total toggle.
- [ ] **Task 3.3: Refine DashboardComponent Layout**
  - Replace hardcoded charts with real data from store.
  - Add "Ver Detalhes" button or make chart bars clickable to open modal.
- [ ] **Task 3.4: Visual Polish & Trend Icons**
  - Add `trending-up` (green), `trending-down` (red), and `minus` (gray) icons based on trend deltas.

---

## 🧪 Verification Plan

### Automated Tests
- **Backend:** `mvn test` focusing on `AnalyticsServiceTest`.
- **Frontend:** `npm test` focusing on `PerformanceThemeService` and new components.

### Manual UAT (User Acceptance Testing)
1. **Trend Check:** Verify if the arrows match the performance variation (e.g., if last 7 days is better than 30, arrow should be UP).
2. **Drill-down Check:** Click an area (e.g., Pediatria) and verify if the modal shows only Pediatric topics.
3. **Color Check:** Verify if 75% accuracy results in an Yellow indicator.
4. **Ranking Check:** Verify if the "Ranking de Erros" changes when toggling between 60 days and Total.

---

## 🚩 Threat Model
- **Data Privacy:** Analytics must be strictly scoped to the logged-in user (checked via `SecurityContextHolder`).
- **Data Integrity:** Ensure division by zero is handled in all rate calculations.
