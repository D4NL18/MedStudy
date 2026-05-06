# Phase 3: Auth Backend (Spring Security + JWT) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-06
**Phase:** 3-Auth Backend (Spring Security + JWT)
**Areas discussed:** Logout Strategy, Rate Limiting, Password Recovery, Password Complexity

---

## Logout & Session Management

| Option | Description | Selected |
|--------|-------------|----------|
| Invalidação apenas do Refresh Token | O Logout remove o Refresh Token do banco. Access Token continua funcionando até expirar. | ✓ |
| Blacklist de Access Tokens | O Logout adiciona o Access Token em uma lista de bloqueio (Redis/DB). | |

**User's choice:** Opção A.
**Notes:** Foco em simplicidade e performance para a v1.

---

## Implementação de Rate Limiting

| Option | Description | Selected |
|--------|-------------|----------|
| Bloqueio por IP | Bloqueio temporário após X falhas. | |
| Bloqueio por Conta | Bloqueio do e-mail do usuário. | |
| Atraso Progressivo | Aumenta o tempo de resposta a cada falha consecutiva. | ✓ |

**User's choice:** Opção C.
**Notes:** Proteção contra força bruta sem o risco de trancar o acesso legítimo por erro de digitação frequente.

---

## Fluxo de Recuperação de Senha

| Option | Description | Selected |
|--------|-------------|----------|
| Mock / Console | Apenas loga o link de recuperação. | |
| Integração Mailtrap/SMTP | Envio real de e-mail em ambiente de teste. | ✓ |

**User's choice:** Opção B.
**Notes:** Desejo de testar o fluxo de e-mail completo já nesta fase.

---

## Regras de Complexidade de Senha

| Option | Description | Selected |
|--------|-------------|----------|
| Básica | Mínimo 8 caracteres. | |
| Médio/Forte | 8 caracteres + Upper + Lower + Number. | ✓ |
| Máximo | 8 caracteres + Upper + Lower + Number + Special. | |

**User's choice:** Opção B.
**Notes:** Equilíbrio entre segurança e usabilidade.

---

## the agent's Discretion
- Implementação técnica do Spring Security Filter Chain.
- Escolha da biblioteca JWT.
- Detalhes do algoritmo de delay progressivo.
