# Phase 41 Validation Strategy — Integração API PIX Banco do Brasil & Webhooks

## Validation Architecture

### 1. Unit Tests
- `MockPixClientTest`: Valida a geração de payload PIX mock e simulação de webhook no profile `mock-pix`.
- `PixSubscriptionServiceTest`: Valida a lógica de ativação/renovação da assinatura (+365 dias acumulados) e desativação/expiração de transações PIX.
- `PixWebhookControllerTest`: Valida a aceitação de payloads do Webhook BB e idenpotência com `endToEndId`.

### 2. Integration Tests
- `PixPaymentFlowIntegrationTest`:
  - Efetua cadastro de usuário com trial.
  - Solicita geração de PIX (`POST /api/subscriptions/pix/create`) -> verifica geração de `txid` e `pixCopiaECola`.
  - Simula o pagamento chamando `POST /api/subscriptions/dev/simulate-pix-paid/{txid}`.
  - Verifica transição para `status = ACTIVE`, acúmulo de +365 dias no `currentPeriodEnd`, e retorno HTTP 200 ao acessar rotas protegidas sem receber HTTP 402.

---

## Acceptance Matrix

| Requisito | Teste Unitário / Integração | Critério de Aceite |
|---|---|---|
| **PIX-01** | `PixPaymentFlowIntegrationTest.createPixCharge_ShouldReturnQrCodeAndCopiaECola` | `pixCopiaECola` preenchido e transação gravada no banco com `status = CREATED` e `expirationDate = 15min`. |
| **PIX-02** | `PixWebhookControllerTest.receiveWebhook_ShouldActivateSubscriptionAndEvictCache` | Assinatura passa para `ACTIVE`, ganha +365 dias e o cache de status é limpo. |
| **PIX-03** | `PixPaymentFlowIntegrationTest.checkPaymentStatus_JaPaguei_ShouldFallbackToApiAndActivate` | Botão "Já Paguei" atualiza transação no banco e ativa assinatura em caso de atraso no webhook, respeitando rate-limit de 5s. |
| **PIX-04** | `MockPixClientTest.simulatePayment_ShouldWorkWithoutBbCredentials` | Profile `mock-pix` permite fluxo 100% autônomo sem requerer credenciais reais ou mTLS do BB. |
