# Executive Research Summary: Milestone v1.5 (Planos de Usuário e Monetização PIX)

## Architecture Overview
The monetization subsystem is structured into three primary modules:
1. **Subscription & Trial Management Core**: Manages 30-day automatic trial on registration, status transitions (`TRIAL` -> `ACTIVE` / `EXPIRED` / `LIFETIME`), and Spring Security & Angular route gating.
2. **Banco do Brasil PIX Direct Integration Gateway**: Connects via OAuth2 + mTLS to BB REST API for dynamic QR code generation (`cob`/`cobv`), webhook event ingestion, and manual "Já Paguei" status polling.
3. **Single Admin Access Control Panel**: Provides admin interface to grant manual access, view active subscriptions, and override user statuses.

## Key Stack Decisions
- **Spring Boot 3 + Netty/RestClient SSL**: Native mTLS certificate loading for BB API.
- **Spring Profile Mock Mode**: Enable `mock-pix` profile for dev/testing without active BB credentials.
- **NgRx Subscription Slice**: Reactively feeds Angular UI, header badges, route guards, and paywall modals.

## Critical Watch-Outs
- **Webhook Fallback**: Must provide "Já Paguei" button that queries BB API directly to avoid user blocking if webhooks delay.
- **Idempotency**: Webhook processing must check `e2e_id` to prevent duplicate activation.
- **Timezone Safety**: Store all trial and subscription expiration dates in UTC (`Instant`).
