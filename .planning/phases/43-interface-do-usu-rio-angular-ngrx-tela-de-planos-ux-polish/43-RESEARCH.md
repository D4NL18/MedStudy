# Phase 43 Research

## What do I need to know to PLAN this phase well?

### 1. Paywall UX (Interceptor & Modal)
- **402 Interceptor:**
  - We have interceptors at `frontend/src/app/core/interceptors/`. We need to add an interceptor (or modify `error.interceptor.ts`) to intercept `402 Payment Required`.
  - When `402` is intercepted, we shouldn't redirect immediately. Instead, we should dispatch a NgRx action (e.g. `[Paywall] Show Block Modal`) or use a global UI service to display the modal over the current route.
- **Global Modal:**
  - Since the project uses custom modals (e.g. `modal-backdrop`, `modal-card`), we can create a `PaywallModalComponent` that subscribes to a global state (e.g. `selectShowPaywallModal`).
  - We will need to add a flag in the store (e.g., in `profile` or `auth` store slice, or a new `ui` store).

### 2. PIX Checkout Flow
- **`/planos` Component:**
  - Create a new feature at `frontend/src/app/features/planos/`.
  - Display the annual plan with benefits.
  - When the user clicks "Assinar", make an API request to generate the PIX (`POST /api/subscriptions/checkout`).
- **Checkout Modal / Overlay:**
  - An overlay over the `/planos` page that shows the generated QR code (`pixQrCodeBase64`), the copy-paste string (`pixCopiaECola`), and a "Já Paguei" button.
  - The "Já Paguei" button triggers a check to `GET /api/subscriptions/pix/{txid}/status`.
  - Once paid, show success, dispatch an action to refresh profile, and close the modal.

### 3. Notification Banner
- **Sticky Banner Placement:**
  - We should place the banner in the main layout component so it appears globally on top of the dashboard and other screens.
  - The banner needs data: `trialEndDate`, `currentPeriodEnd`, and `status`. We should select this from the `ProfileStore` or `AuthStore`.

### 4. Payment History in Profile
- **Profile Component:**
  - We have `frontend/src/app/features/perfil/`.
  - Add a new tab or section for "Assinatura e Pagamentos".
  - Fetch history from the backend endpoint (`GET /api/subscriptions/my-transactions` or similar).

### Summary
The technical approach requires:
1. `PaywallInterceptor` that triggers a global UI state.
2. `PaywallModalComponent` injected globally.
3. `PlanosComponent` for the plans page and PIX checkout modal.
4. `TopBannerComponent` (or just HTML in the main layout) checking days remaining.
5. `PerfilAssinaturaComponent` to show current plan and transaction history.
