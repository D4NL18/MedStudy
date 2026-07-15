# Research: Architecture & Data Model for v1.5 (PIX & Subscriptions)

## Data Model Extensions

### 1. Model `Subscription` (`subscriptions` table)
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL, -- 'TRIAL', 'ACTIVE', 'EXPIRED', 'LIFETIME'
    trial_start_date TIMESTAMP NOT NULL,
    trial_end_date TIMESTAMP NOT NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    is_admin_override BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Model `PixTransaction` (`pix_transactions` table)
```sql
CREATE TABLE pix_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    txid VARCHAR(50) NOT NULL UNIQUE,
    e2e_id VARCHAR(100),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL, -- 'CREATED', 'PAID', 'EXPIRED', 'CANCELLED'
    pix_copia_e_cola TEXT NOT NULL,
    qr_code_base64 TEXT,
    expiration_date TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Updates to `User` Entity
- Field `role`: `USER` / `ADMIN`.
- Virtual method `isSubscriptionActive()` check against `status IN ('TRIAL', 'ACTIVE', 'LIFETIME')` and valid dates.

## API Integration Architecture (Banco do Brasil PIX)

```
[Angular App] --(1) Solicita Cobrança PIX--> [Spring Boot Backend]
                                                    |
                                       (2) OAuth2 Client Creds (mTLS)
                                                    |
                                                    v
                                         [Banco do Brasil API]
                                                    |
                                       (3) Retorna txid + CopiaECola
                                                    |
[Angular App] <-- (4) Exibe QR Code + CopiaECola <--+

--- Fluxo de Liquidação Assíncrona ---

[Banco do Brasil] --(5) Webhook POST (endToEndId, txid)--> [Spring Boot Webhook Endpoint]
                                                                    |
                                                      (6) Valida HMAC / Signature
                                                      (7) Atualiza PixTransaction -> PAID
                                                      (8) Atualiza Subscription -> ACTIVE (+365 dias)
```

## Security & Protection Layers
1. **Public Webhook Endpoint (`/api/v1/webhooks/pix/bb`)**:
   - Exempt from JWT Authentication.
   - Protected via Webhook Secret / IP Whitelisting / Token Verification.
   - Idempotent processing using `txid` and `e2e_id` to prevent duplicate credits.
2. **Subscription Gate**:
   - `SubscriptionFilter` / Angular Guard intercepting operational requests when `Subscription` status is `EXPIRED`.
