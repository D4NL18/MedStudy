# Phase 41 Discussion Log — Integração API PIX Banco do Brasil & Webhooks (Spring Boot)

Date: 2026-07-14

## Area 1: Comportamento do Perfil de Simulação Dev (`mock-pix`)
- **Options Presented**:
  1. Endpoint de Simulação Dev (`POST /api/subscriptions/dev/simulate-pix-paid/{txid}`) com disparo de Webhook fake e delay opcional de 5s. (Selected)
  2. Auto-aprovação imediata ao criar o PIX.
  3. Apenas simulação via botão "Já Paguei".
- **User Choice**: Endpoint Dev de Simulação (`POST /api/subscriptions/dev/simulate-pix-paid/{txid}`).

## Area 2: Tempo de Expiração da Cobrança PIX e QR Code
- **Options Presented**:
  1. 30 minutos (1800s).
  2. 15 minutos (900s). (Selected)
  3. 60 minutos (3600s).
- **User Choice**: 15 minutos (900s) com transição para status `EXPIRED` se não for pago a tempo.

## Area 3: Mecanismo de Fallback / Botão "Já Paguei"
- **Options Presented**:
  1. Consulta ao banco local -> se `CREATED`, consulta API do BB com rate limit de 5s por requisição. (Selected)
  2. Consulta ao banco -> chamada à API do BB sem rate limit.
  3. Consulta exclusivamente ao banco local via webhook.
- **User Choice**: Consulta ao banco local primeiro + fallback à API do BB com rate limit de 5 segundos.

## Area 4: Regra de Renovação / Compra Antecipada
- **Options Presented**:
  1. Acumular período (+365 dias a partir do vencimento atual do trial/assinatura). (Selected)
  2. Reiniciar período (365 dias a partir do momento do pagamento).
- **User Choice**: Acumular período (+365 dias a partir do vencimento atual).
