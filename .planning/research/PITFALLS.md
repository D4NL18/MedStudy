# Research: Pitfalls & Mitigations for v1.5 (PIX BB & Paywall)

## Critical Pitfalls & Mitigation Strategies

### 1. Webhook Latency or Loss from Banco do Brasil
- **Risk**: User pays via PIX app, but Banco do Brasil webhook call fails, drops, or delays due to network instability. User remains blocked on Paywall.
- **Mitigation**: Implement a fallback endpoint `GET /api/v1/subscriptions/pix/{txid}/status` triggered manually by a "Já Paguei" (I Paid) button in Angular. This endpoint directly queries the BB API `GET /pix/v2/cob/{txid}` to synchronize payment status on-demand.

### 2. Idempotency & Replay Attacks on Webhook
- **Risk**: Webhook delivers duplicate payload or malicious third-party sends POST requests to `/api/v1/webhooks/pix/bb`.
- **Mitigation**:
  1. Store `e2e_id` (End-to-End ID unique from Central Bank). If `e2e_id` already exists in `pix_transactions`, return HTTP 200 OK immediately without processing.
  2. Implement webhook authorization token header validation required by BB developer settings.

### 3. mTLS Certificate Management in Development vs Production
- **Risk**: BB PIX API requires mTLS (`.p12`/`.pfx` client certificate). In local sandbox/dev environments without certificates, backend crashes on startup.
- **Mitigation**: Create a mock implementation (`MockPixGatewayService`) activated by Spring Profile `dev` / `mock-pix`, allowing full E2E testing of QR Code display and payment simulation without requiring live BB API credentials.

### 4. Timezone Discrepancies on 30-Day Trial Expiration
- **Risk**: Trial start date stored in UTC vs User timezone (Brasília `UTC-3`) causing early or late expiration.
- **Mitigation**: Always store dates as `Instant` (UTC) in database, compute expiration relative to UTC, and render localized date strings in UI.

### 5. Single Admin Override Security
- **Risk**: Unauthorized users gaining access to Admin Endpoints to grant free access.
- **Mitigation**: Annotate Admin Endpoints with `@PreAuthorize("hasRole('ADMIN')")`. Bootstrap the primary admin account securely via configuration property (`app.admin.email`).
