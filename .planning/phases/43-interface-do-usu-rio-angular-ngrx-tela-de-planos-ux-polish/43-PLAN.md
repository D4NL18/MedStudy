# Phase 43 Plan

## 1. Paywall UX & Interceptor
Implement the paywall logic to catch 402 errors and display a global modal.
- Modify `frontend/src/app/core/interceptors/error.interceptor.ts` to dispatch a new action when a `402` status is encountered.
- Update `Auth` (or create `UI`) NgRx state to handle `showPaywallModal`.
- Create `PaywallModalComponent` to display a blurred backdrop and an action button "Ver Planos".
- Integrate `PaywallModalComponent` into `app.component.html`.

## 2. Notification Banner
Implement a sticky banner to warn users about their trial/subscription status.
- Create `ExpirationBannerComponent`.
- Inject the banner at the top of the main layout (or Dashboard).
- Wire up logic to calculate remaining days based on `trialEndDate` or subscription `currentPeriodEnd`.

## 3. Plans Page (`/planos`)
Create the plans page to allow users to subscribe.
- Create `PlanosModule` and `PlanosComponent`.
- Layout the plans (Free vs Premium).
- Add "Assinar Agora" button which makes an API request to `POST /api/subscriptions/checkout` to generate the PIX transaction.
- Create `PixCheckoutModalComponent` overlay that opens when PIX is generated. Display the QR code and the "Copia e Cola" string.
- Add "Já Paguei" button to trigger a status check (`GET /api/subscriptions/pix/{txid}/status`).

## 4. Payment History in Profile
Show transaction history to the user.
- Modify `PerfilComponent` to include a "Assinatura e Pagamentos" tab.
- Fetch and display the user's past PIX transactions.
