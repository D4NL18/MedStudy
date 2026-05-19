# Phase 21: PWA & Otimização Final

## Phase Overview
Transform MedStudy into a Progressive Web App (PWA) with offline capabilities, installation support, and high-performance metrics (>90 Lighthouse score). This phase focuses on technical infrastructure, user experience during connectivity loss, and final bundle optimizations.

## Steps

### Step 1: PWA Infrastructure & Configuration
- [ ] **Generate Manifest**: Create `src/manifest.webmanifest` with icons, theme color, and standalone display mode.
- [ ] **Configure NGSW**: Edit `ngsw-config.json` to implement `assetGroups` (prefetch) and `dataGroups` (freshness strategy for `/api/**` with 10s timeout).
- [ ] **Service Worker Registration**: Ensure `ServiceWorkerModule` is correctly registered in `AppModule`.

### Step 2: PwaService & Installation Logic
- [ ] **Create Service**: Implement `src/app/core/services/pwa.service.ts` to capture the `beforeinstallprompt` event.
- [ ] **State Exposure**: Expose `isInstallable$` and `updateAvailable$` observables.
- [ ] **Methods**: Implement `install()` for triggering the prompt and `reload()` for applying silent updates.

### Step 3: Sidebar & Installation UI
- [ ] **Integration**: Add the "Instalar App" button to `SidebarComponent`.
- [ ] **Styling**: Apply Glassmorphism (blur: 10px, semi-transparent background) per UI-SPEC.
- [ ] **Visibility**: Bind to `isInstallable$` state.

### Step 4: Offline UX & Interceptors
- [ ] **Offline Banner**: Create `OfflineBannerComponent` (Yellow) for real-time connectivity feedback.
- [ ] **Offline View**: Create `OfflinePageComponent` for fallback on non-cached routes.
- [ ] **Interceptor**: Implement `ConnectivityInterceptor` to redirect to offline views on network failure (504/0 status).

### Step 5: Optimization & Final Audit
- [ ] **Lazy Loading Audit**: Verify all main feature modules use `loadChildren`.
- [ ] **Bundle Analysis**: Optimize large dependencies and assets.
- [ ] **Lighthouse**: Perform final audit to ensure Performance and PWA scores are >90.

## Verification (UAT)
- **UAT 21.1**: "Install" button appears in the sidebar and triggers the prompt.
- **UAT 21.2**: App renders core UI while offline.
- **UAT 21.3**: API calls show cached data when offline.
- **UAT 21.4**: Lighthouse score >90 for Performance and PWA.
- **UAT 21.5**: Background updates occur without user interruption.
