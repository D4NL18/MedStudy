# Contrato de API: Gamificação de Flashcards, Maestria Clínica e Streak Repair

> **Localização Mandatória:** `.agents/docs/api_contracts/gamificacao-maestria.md`  
> **Responsável:** Arquiteto (`api-contract-expert`)  
> **Referências de Regras:** `.agents/rules/backend-api-contract-rules.md`

---

## 1. Visão Geral
- **Prefixo Base da Rota:** `/api`
- **Protocolo:** HTTP/REST
- **Convenção de Nomenclatura:** `camelCase` (Java / Spring Boot)
- **Formato dos Dados:** `application/json`
- **Módulos Abrangidos:** Dashboard (Maestria Clínica Anatômica), Gamificação (Streak Status e Streak Repair) e Flashcards (Bounty Cards).

---

## 2. Endpoints

### 2.1. `GET /api/dashboard/maestria-clinica`
- **Objetivo:** Retorna o mapa de maestria anatômica e das 5 grandes áreas médicas com os respectivos níveis e tiers.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Resposta de Sucesso (`200 OK`):**
```json
{
  "overallMastery": 42.5,
  "overallTier": "PRATA",
  "areas": [
    {
      "grandeArea": "CLINICA_MEDICA",
      "displayName": "Clínica Médica",
      "regionKey": "torax_snc",
      "masteryPercentage": 45.0,
      "tier": "OURO",
      "corHex": "#3B82F6",
      "questoesFeitas": 120,
      "taxaAcertoQuestoes": 75.0,
      "cardsRevisados": 240,
      "taxaRetencaoCards": 82.0,
      "aulasAssistidas": 15,
      "totalAulas": 20
    }
  ]
}
```

---

### 2.2. `GET /api/gamificacao/streak-status`
- **Objetivo:** Retorna o status atual do streak, verificação de quebra de 24h e elegibilidade de Streak Repair.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Resposta de Sucesso (`200 OK`):**
```json
{
  "currentStreak": 12,
  "streakAtRisk": true,
  "canRepair": true,
  "repairDeadline": "2026-10-16T23:59:59Z",
  "requiredCardsCount": 20,
  "currentRepairedCount": 5,
  "lastRepairedAt": null
}
```

---

### 2.3. `POST /api/gamificacao/streak-repair`
- **Objetivo:** Executa a recuperação do streak caso a missão de resgate tenha sido cumprida (meta de flashcards revisados dentro do prazo de 24h e fora de cooldown).
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Resposta de Sucesso (`200 OK`):**
```json
{
  "success": true,
  "newStreak": 13,
  "message": "Streak recuperado com sucesso!"
}
```

---

### 2.4. `GET /api/flashcards/hoje`
- **Objetivo:** Fila de estudo diária com suporte ao atributo de classificação de `bountyCard` (Cards Sangrentos).
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Resposta de Sucesso (`200 OK`):**
```json
[
  {
    "id": "a1b2c3d4-0000-0000-0000-000000000001",
    "grandeArea": "CLINICA_MEDICA",
    "frente": { "type": "doc", "content": [] },
    "verso": { "type": "doc", "content": [] },
    "proximaRevisao": "2026-10-15",
    "bountyCard": true,
    "easeFactor": 1.55,
    "consecutiveHardCount": 2
  }
]
```

---

## 3. Matriz de Erros HTTP Mapeados

| Status Code | Causa | Formato do Payload |
| :--- | :--- | :--- |
| `400 Bad Request` | Parâmetros inválidos ou violação de contrato | `{"status": 400, "message": "Parâmetro inválido"}` |
| `401 Unauthorized` | Token ausente, expirado ou inválido | `{"status": 401, "message": "Token expirado ou inválido"}` |
| `403 Forbidden` | Usuário autenticado sem autorização ao recurso | `{"status": 403, "message": "Acesso negado"}` |
| `404 Not Found` | Recurso ou usuário não localizado | `{"status": 404, "message": "Recurso não encontrado"}` |
| `422 Unprocessable` | Regra de negócio violada (ex: Streak Repair fora do prazo ou em cooldown) | `{"status": 422, "message": "Janela de reparo expirada ou cooldown ativo"}` |

---

## 4. Diretrizes de Integração no Frontend
- **Serviços:**
  - `clinical-mastery.service.ts` -> Consome `GET /api/dashboard/maestria-clinica`.
  - `streak-repair.service.ts` -> Consome `GET /api/gamificacao/streak-status` e `POST /api/gamificacao/streak-repair`.
  - `flashcard.service.ts` -> Consome `GET /api/flashcards/hoje` renderizando estado de `bountyCard`.
- **Modelos TypeScript:**
  - `clinical-mastery.model.ts`
  - `streak-repair.model.ts`
  - `flashcard.model.ts`
