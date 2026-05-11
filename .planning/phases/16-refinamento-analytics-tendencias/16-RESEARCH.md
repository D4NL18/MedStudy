# Research: Phase 16 — Refinamento de Analytics & Tendências

**Phase:** 16
**Status:** Complete

---

## 1. Backend Analysis (Spring Boot)

### Current State
- `AnalyticsService.java`: Has basic aggregation logic. `calculateTrend` is hardcoded for 7 days.
- `StudySessionRepository.java`: Has `@Query` for aggregation by area and topic since a date.
- `AreaAnalyticsResponse`: DTO only has one `trendRate`.

### Implementation Plan
- **Trend Logic (ANLY-01):** 
  - Update `AnalyticsService` to perform three aggregations: Global, Last 30 Days, and Last 7 Days.
  - Calculate `trendShort` (Rate7d / Rate30d) and `trendLong` (Rate30d / RateGlobal).
- **Breakpoints (ANLY-02):** 
  - Update `calculatePerformanceLevel` to:
    - `LOW`: < 70%
    - `MEDIUM`: 70% - 85%
    - `HIGH`: > 85%
- **Ranking of Errors (ANLY-04):**
  - Add `getTopErrorThemes(UUID userId, LocalDate since, int minQuestions)` to `AnalyticsService`.
  - Add a custom query to `StudySessionRepository` to find the themes with highest `(sum(qtsFeitas) - sum(qtsCorretas)) / sum(qtsFeitas)` where `sum(qtsFeitas) >= 3`.

## 2. Frontend Analysis (Angular + NgRx)

### Current State
- `DashboardComponent`: Fetches basic KPIs but charts use hardcoded data.
- `AreaChartComponent`: Uses `ngx-charts` with local `chartData`.
- No `PerformanceThemeService` exists yet.

### Implementation Plan
- **PerformanceThemeService (ANLY-02):**
  - Location: `src/app/core/services/performance-theme.service.ts`
  - Method: `getColor(rate: number): string` (Returns hex colors matching the 70/85 breakpoints).
- **NgRx Update:**
  - Update `DashboardState` to include `areaAnalytics: AreaAnalytics[]`.
  - Update `loadDashboard` effect to call `AnalyticsService.getAreaAnalytics()`.
- **Subarea Modal (ANLY-03):**
  - Create `SubareaModalComponent` in `features/dashboard/components`.
  - Fetch topic-level data filtered by the selected Area.
- **UI Indicators (ANLY-01):**
  - Add `LucideIcons` (trending-up, trending-down) next to percentage values in cards and tables.

## 3. Database & Schema
- No schema changes required. `StudySession` already contains `grandeArea`, `tema`, `qtsFeitas`, and `qtsCorretas`.

## 4. Risks & Landmines
- **Performance:** Aggregating all sessions on every dashboard load might be slow for users with thousands of sessions. 
  - *Mitigation:* Ensure `userId` and `dataSessao` are indexed (already done in Phase 2/4).
- **Chart Responsiveness:** `ngx-charts` might need manual resizing logic if put inside a Modal.
