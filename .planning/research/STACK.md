# Research: Stack Additions for v1.5 (PIX Banco do Brasil & Freemium Paywall)

## Target Capabilities
- Integration with Banco do Brasil PIX API (OAuth2 Client Credentials, mTLS certificate client, REST endpoints `cob`/`cobv`, Webhook callback).
- Freemium Paywall Subscription Engine in Spring Boot & Angular NgRx.
- Single Admin Access Management & Manual Overrides.

## Recommended Stack Additions

### Backend (Java 21 / Spring Boot 3)
1. **Spring WebClient / RestClient with SSL/mTLS Configuration**:
   - `Netty Client` or Apache HTTP Client 5 configured with Client SSLContext loading `.p12`/`.pfx` certificates for Banco do Brasil mTLS requirement.
2. **Spring Boot Scheduler (`@EnableScheduling`)**:
   - Cron job checking subscription expiration, transitioning users from `TRIAL`/`ACTIVE` to `EXPIRED` status, and triggering 30-day/7-day/1-day expiration warnings.
3. **Spring Security Custom Interceptor/Filter**:
   - `SubscriptionAccessFilter` executing after `JwtAuthenticationFilter` to block API requests (except `/api/v1/subscriptions/**`, `/api/v1/auth/**`, `/api/v1/admin/**`) when account status is `EXPIRED`.

### Frontend (Angular 18 / NgRx)
1. **NgRx Subscription State Slice**:
   - Actions: `loadSubscription`, `createPixCharge`, `checkPaymentStatus`, `refreshSubscription`.
   - Selectors: `selectSubscriptionStatus` (`TRIAL`, `ACTIVE`, `EXPIRED`, `LIFETIME`), `selectDaysRemaining`, `selectIsPaywallActive`.
2. **Ngx-QRCode / QRCodes renderer**:
   - Standard library or canvas-based SVG renderer for displaying PIX `emv` payload / Copy-and-Paste (Copia e Cola) string.
3. **Paywall Functional Guard (`CanActivateFn`)**:
   - Intercepts Angular routes if `selectIsPaywallActive` is true, redirecting users seamlessly to `/planos`.

## What NOT to Add
- **No external heavy payment SDKs (e.g. Stripe, PagSeguro)**: Direct BB API REST integration ensures full privacy, zero middleman transaction fees, and simple architectural control.
- **No native mobile app billing libraries**: Pure web-based responsive flow with PIX Copia e Cola.
