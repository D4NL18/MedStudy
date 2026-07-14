# Phase 41 Research — Integração API PIX Banco do Brasil & Webhooks (Spring Boot)

## Objective
Pesquisar os requisitos técnicos, padrões Spring Boot, especificações de OAuth2/mTLS da API Banco do Brasil PIX, receptáculo de Webhooks, estratégias de rate limit e resiliência, e arquitetura do mock de ambiente dev (`mock-pix`).

---

## 1. Banco do Brasil PIX API v2 Specifications

### 1.1. Autenticação & mTLS
- **Endpoint OAuth2**: `POST /oauth/token` (Ambiente de Produção: `https://oauth.bb.com.br`, Homologação: `https://oauth.hm.bb.com.br`).
- **Autenticação**: OAuth 2.0 Client Credentials Grant (`grant_type=client_credentials`, `scope=cob.write cob.read webhook.read webhook.write`).
- **mTLS (Mutual TLS)**: Requer que todas as chamadas HTTPS enviem certificado digital cliente (formato `.p12` ou `.pem` contendo chave privada e certificado público e-CNPJ da empresa).
- **Configuração no Spring Boot**: Utilizar `RestClient` ou `WebClient` com `SslBundles` do Spring Boot 3.1+ (ou SSLContext customizado carregado via KeyStore Java).

### 1.2. Cobrança PIX Dinâmica (`PUT /v2/cob/{txid}`)
- **txid**: Identificador único da transação (alfanumérico, 26 a 35 caracteres, ex: `MEDSTUDY` + UUID sem hífen).
- **Payload de Requisição**:
  ```json
  {
    "calendario": {
      "expiracao": 900
    },
    "devedor": {
      "cpf": "12345678900",
      "nome": "Nome do Usuario"
    },
    "valor": {
      "original": "297.00"
    },
    "chave": "chave-pix-bb@medstudy.com",
    "solicitacaoPagador": "Assinatura Anual MedStudy - 1 Ano de Acesso"
  }
  ```
- **Campos de Resposta Críticos**:
  - `pixCopiaECola`: String da chave de pagamento instantâneo Copia e Cola (EMV QRCPS format).
  - `location`: URL do QR Code dinâmico do BB.

---

## 2. Receptáculo de Webhook Seguro (`POST /api/webhooks/pix/bb`)

### 2.1. Payload do Webhook do Banco do Brasil
Quando o PIX é pago, o servidor do BB envia uma requisição `POST` contendo:
```json
{
  "pix": [
    {
      "endToEndId": "E00000000202607141900a1b2c3d4e5f",
      "txid": "MEDSTUDY3f11a834b52b4ae3b059219b",
      "valor": "297.00",
      "horario": "2026-07-14T19:54:00.000Z"
    }
  ]
}
```

### 2.2. Segurança e Validação do Webhook
- **Rota Isenta no Spring Security**: `/api/webhooks/**` configurada com `permitAll()` no `SecurityConfig`.
- **Validação**: Validação de chave secreta no header `X-Webhook-Secret` ou IP whitelist dos servidores do Banco do Brasil.
- **Idempotência**: Verificar via `PixTransactionRepository.findByE2eId` se a transação com `endToEndId` já foi processada antes de alterar a assinatura para evitar dupla ativação.

---

## 3. Arquitetura do Componente de Mock (`@Profile("mock-pix")`)

### 3.1. Abstração `PixService`
```java
public interface PixClient {
    PixTransactionDto createImmediateCharge(User user, BigDecimal amount);
    PixTransactionStatusDto getChargeStatus(String txid);
}
```

### 3.2. Implementações:
1. `BbPixClientImpl` (`@Profile("!mock-pix")`):
   - Conecta-se aos servidores oficiais do Banco do Brasil com mTLS e OAuth2.
2. `MockPixClientImpl` (`@Profile("mock-pix")`):
   - Gera `txid` válido localmente.
   - Retorna um `pixCopiaECola` fake válido para testes (`00020101021226870014br.gov.bcb.pix...`).
   - Gera QR Code Base64 simulado ou link de teste.
   - Disponibiliza endpoint dev `POST /api/subscriptions/dev/simulate-pix-paid/{txid}` para simulação de confirmação em ambiente local.

---

## 4. Fallback "Já Paguei" e Preservação de Rate Limit

- **Endpoint**: `GET /api/subscriptions/pix/{txid}/status`
- **Fluxo**:
  1. Busca `PixTransaction` pelo `txid`.
  2. Se status for `PAID` ou `EXPIRED`, retorna o status imediatamente (sem bater no BB).
  3. Se status for `CREATED`, verifica se passaram ao menos 5 segundos desde a última consulta (throttling em memória ou timestamp em `updatedAt`).
  4. Caso liberado, chama `pixClient.getChargeStatus(txid)`.
  5. Se status for `CONCLUIDA`/`PAID`:
     - Atualiza `PixTransaction` -> `PAID`, preenche `paidAt` e `endToEndId`.
     - Atualiza `Subscription`: `status = ACTIVE`, `currentPeriodEnd += 365 dias`.
     - Evicta o cache `subscriptionStatusCache` via `cacheManager`.

---

## 5. Summary of Architecture Recommendations

1. **Spring Profile `mock-pix`**: Habilitado por padrão no `application-dev.yml` para garantir ambiente de dev pronto sem depender de certificados digitais do BB.
2. **Cache Eviction**: `cacheManager.getCache("subscriptionStatusCache").evict(userId)` deve ser invocado em 100% dos fluxos de confirmação de pagamento (Webhook e botão "Já Paguei").
3. **Validade de 15 Minutos**: O scheduler diário ou a própria verificação de status deve atualizar transações expiradas (`Instant.now() > expirationDate`) para `EXPIRED`.
