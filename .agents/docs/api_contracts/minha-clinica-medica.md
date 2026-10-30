# Contrato de API: Minha Clínica Médica, Revestimentos, Itens de Parede e Personagem Médico

> **Localização Mandatória:** `.agents/docs/api_contracts/minha-clinica-medica.md`  
> **Responsável:** Arquiteto (`api-contract-expert`)  
> **Referências de Regras:** `.agents/rules/security-anti-patterns.md`, `.agents/docs/business_rules/minha-clinica-medica.md` (`P-080` a `P-089`), `ADR-001`, `ADR-008`

---

## 1. Visão Geral
- **Prefixos Base das Rotas:** `/api/v1/clinic` e `/api/v1/study`
- **Protocolo:** HTTP/REST
- **Convenção de Nomenclatura:** `camelCase` (Java 21 / Spring Boot 3+ e Angular 18 TypeScript)
- **Formato dos Dados:** `application/json`
- **Autenticação e Segurança:** Stateless JWT via Cookie `HttpOnly` / Header `Authorization: Bearer <JWT_TOKEN>`.
  - O identificador do estudante (`userId`) é extraído **exclusivamente** do contexto seguro do token JWT (`SecurityContextHolder`), proibido em payloads ou query params (Princípio da Minimização LGPD e prevenção contra IDOR).
  - O atributo `gender` do avatar é estritamente uma preferência de customização de jogo/interface (Art. 7º, V da LGPD), não configurando dado sensível de saúde nem biometria.

---

## 2. Padrão de Envelope de Resposta

Todas as respostas HTTP `2xx` utilizam o envelope padronizado `{"data": ..., "meta": ...}`:

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-10-28T20:30:00Z"
  }
}
```

---

## 3. Endpoints da Clínica

### 3.1. `GET /api/v1/clinic`
- **Objetivo:** Retornar o estado consolidado da clínica do estudante autenticado, incluindo saldos de XP (`lifetimeXp`, `currentXp`), nível de expansão, temas ativos de superfície (`wallTheme`, `floorTheme`), avatar médico configurado, itens posicionados (chão e parede), inventário e catálogo oficial. Caso seja o primeiro acesso, executa o Onboarding Nível 1 gratuito com 3 itens e avatar médico base.
- **Regras Rastreáveis:** `P-080`, `P-082`, `P-083`, `P-084`, `P-087`, `P-088`, `P-089`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>` / Cookie `HttpOnly`)

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "clinicId": "c1a2b3d4-1111-4222-8333-000000000001",
    "clinicName": "Minha Clínica",
    "expansionLevel": 1,
    "expansionName": "Box do Internato",
    "gridWidth": 4,
    "gridHeight": 4,
    "theme": "clean_modern",
    "wallTheme": "wall_clean_white",
    "floorTheme": "floor_porcelanato_cinza",
    "lifetimeXp": 1548,
    "currentXp": 348,
    "currentStreakDays": 7,
    "streakMultiplierPercent": 20,
    "nextExpansionLevel": 2,
    "nextExpansionName": "Consultório Júnior",
    "nextExpansionGridWidth": 6,
    "nextExpansionGridHeight": 6,
    "nextExpansionCostXp": 1200,
    "nextExpansionRequiredLifetimeXp": 1500,
    "canExpand": false,
    "avatar": {
      "id": "e1f2a3b4-5555-6666-7777-000000000001",
      "gender": "FEMALE",
      "skinCoat": "coat_intern_white",
      "skinStethoscope": "steth_classic_black",
      "skinAccessory": "acc_none",
      "avatarX": 1,
      "avatarY": 1
    },
    "ownedSurfaces": [
      {
        "id": "wall_clean_white",
        "type": "WALL",
        "name": "Paredes Brancas Internato",
        "costXp": 0
      },
      {
        "id": "floor_porcelanato_cinza",
        "type": "FLOOR",
        "name": "Porcelanato Acetinado Neutro",
        "costXp": 0
      }
    ],
    "ownedItemIds": [
      "mesa_scandi",
      "cadeira_ergonomica",
      "ped_maca_baleia"
    ],
    "placedItems": [
      {
        "id": "d1e2f3a4-2222-4333-9444-000000000001",
        "catalogItemId": "mesa_scandi",
        "placementType": "FLOOR",
        "gridX": 0,
        "gridY": 0,
        "rotation": 0,
        "wallSide": null,
        "wallTileIndex": null,
        "elevationZ": null,
        "placed": true
      },
      {
        "id": "d1e2f3a4-2222-4333-9444-000000000002",
        "catalogItemId": "cadeira_ergonomica",
        "placementType": "FLOOR",
        "gridX": 0,
        "gridY": 1,
        "rotation": 0,
        "wallSide": null,
        "wallTileIndex": null,
        "elevationZ": null,
        "placed": true
      },
      {
        "id": "d1e2f3a4-2222-4333-9444-000000000003",
        "catalogItemId": "ped_maca_baleia",
        "placementType": "FLOOR",
        "gridX": 2,
        "gridY": 0,
        "rotation": 0,
        "wallSide": null,
        "wallTileIndex": null,
        "elevationZ": null,
        "placed": true
      }
    ],
    "inventory": [
      {
        "id": "d1e2f3a4-2222-4333-9444-000000000001",
        "catalogItemId": "mesa_scandi",
        "placementType": "FLOOR",
        "gridX": 0,
        "gridY": 0,
        "rotation": 0,
        "wallSide": null,
        "wallTileIndex": null,
        "elevationZ": null,
        "placed": true
      }
    ],
    "catalog": [
      {
        "id": "ped_regua_girafa",
        "name": "Régua Girafa de Parede",
        "category": "pediatria",
        "placementType": "WALL",
        "costXp": 900,
        "footprintX": 1,
        "footprintY": 1,
        "minExpansionLevel": 1,
        "interactable": true,
        "soundFxUrl": "safari_sparkle",
        "assetSvgKey": "ped_regua_girafa"
      },
      {
        "id": "negatoscopio_led",
        "name": "Negatoscópio Ultra-Slim",
        "category": "clinica",
        "placementType": "WALL",
        "costXp": 1400,
        "footprintX": 1,
        "footprintY": 1,
        "minExpansionLevel": 1,
        "interactable": true,
        "soundFxUrl": "light_toggle",
        "assetSvgKey": "negatoscopio_led"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-28T20:30:00Z",
    "catalogTotalItems": 27
  }
}
```

---

### 3.2. `PUT /api/v1/clinic/surfaces`
- **Objetivo:** Atualizar os revestimentos ativos de ambiente da clínica (papel de parede e/ou acabamento de piso). Valida se os identificadores fornecidos foram desbloqueados pelo estudante. A alteração é puramente estética e não altera o grid de circulação nem move qualquer mobília.
- **Regras Rastreáveis:** `P-087`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Payload de Requisição (Request Body):**
```json
{
  "wallTheme": "ped_papel_safari",
  "floorTheme": "floor_marmore_carrara"
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "clinicId": "c1a2b3d4-1111-4222-8333-000000000001",
    "wallTheme": "ped_papel_safari",
    "floorTheme": "floor_marmore_carrara",
    "updatedAt": "2026-10-28T20:31:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T20:31:00Z"
  }
}
```

---

### 3.3. `PUT /api/v1/clinic/layout`
- **Objetivo:** Salvar em lote a disposição dos itens na clínica, com suporte dual e desacoplado para itens de chão (`FLOOR`) e itens verticais de parede (`WALL`).
  - **Itens de Piso (`FLOOR`):** Validação estrita por matriz AABB 2D (`gridX + effW <= gridWidth`, `gridY + effH <= gridHeight` e ausência de colisão com outros móveis de piso).
  - **Itens de Parede (`WALL`):** Isentos de colisão no solo (`footprint` tratado como `0x0`). Validados pelas coordenadas de parede traseira: `wallSide` (`NW` ou `NE`), `wallTileIndex` (`0 <= wallTileIndex < dimensãoDaParede`) e `elevationZ` (`20` a `80` pixels). Impede dois itens de parede no mesmo segmento e elevação.
- **Regras Rastreáveis:** `P-084`, `P-087`, `P-088`, `C-06`, `C-07`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Payload de Requisição (Request Body):**
```json
{
  "items": [
    {
      "id": "d1e2f3a4-2222-4333-9444-000000000001",
      "catalogItemId": "mesa_scandi",
      "placementType": "FLOOR",
      "gridX": 0,
      "gridY": 0,
      "rotation": 0,
      "wallSide": null,
      "wallTileIndex": null,
      "elevationZ": null,
      "placed": true
    },
    {
      "id": "d1e2f3a4-2222-4333-9444-000000000004",
      "catalogItemId": "ped_regua_girafa",
      "placementType": "WALL",
      "gridX": null,
      "gridY": null,
      "rotation": 0,
      "wallSide": "NW",
      "wallTileIndex": 2,
      "elevationZ": 45,
      "placed": true
    },
    {
      "id": "d1e2f3a4-2222-4333-9444-000000000005",
      "catalogItemId": "negatoscopio_led",
      "placementType": "WALL",
      "gridX": null,
      "gridY": null,
      "rotation": 0,
      "wallSide": "NE",
      "wallTileIndex": 1,
      "elevationZ": 50,
      "placed": true
    }
  ]
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "clinicId": "c1a2b3d4-1111-4222-8333-000000000001",
    "placedCount": 3,
    "layoutHash": "sha256-a9b8c7d6e5...",
    "updatedAt": "2026-10-28T20:32:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T20:32:00Z"
  }
}
```

---

### 3.4. `GET /api/v1/clinic/avatar`
- **Objetivo:** Retornar os dados do avatar médico ativo associado à clínica do estudante, lista de skins adquiridas e catálogo cosmético disponível para compra e personalização.
- **Regras Rastreáveis:** `P-089`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "avatarId": "e1f2a3b4-5555-6666-7777-000000000001",
    "gender": "FEMALE",
    "skinCoat": "coat_intern_white",
    "skinStethoscope": "steth_classic_black",
    "skinAccessory": "acc_none",
    "avatarX": 1,
    "avatarY": 1,
    "unlockedSkins": [
      "coat_intern_white",
      "coat_scrubs_navy",
      "steth_none",
      "steth_classic_black",
      "acc_none"
    ],
    "catalogSkins": [
      {
        "id": "coat_scrubs_navy",
        "slot": "COAT",
        "name": "Scrub Azul Marinho Plantão",
        "costXp": 500,
        "assetSvgKey": "skin_coat_scrubs_navy",
        "owned": true
      },
      {
        "id": "coat_pediatric_dino",
        "slot": "COAT",
        "name": "Jaleco Estampado Pediatria",
        "costXp": 1200,
        "assetSvgKey": "skin_coat_pediatric_dino",
        "owned": false
      },
      {
        "id": "ped_steth_elefante",
        "slot": "STETHOSCOPE",
        "name": "Esteto Pediátrico Elefante",
        "costXp": 950,
        "assetSvgKey": "skin_steth_elefante",
        "owned": false
      },
      {
        "id": "acc_glasses_classic",
        "slot": "ACCESSORY",
        "name": "Óculos de Grau Redondo",
        "costXp": 400,
        "assetSvgKey": "skin_acc_glasses",
        "owned": false
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-28T20:33:00Z",
    "totalUnlocked": 5
  }
}
```

---

### 3.5. `PUT /api/v1/clinic/avatar`
- **Objetivo:** Atualizar a base de gênero do médico (100% gratuito) e equipar peças cosméticas nos 3 slots (`skinCoat`, `skinStethoscope`, `skinAccessory`). Valida se todas as peças equipadas foram previamente desbloqueadas pelo estudante.
- **Regras Rastreáveis:** `P-089`, `C-08`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Payload de Requisição (Request Body):**
```json
{
  "gender": "FEMALE",
  "skinCoat": "coat_scrubs_navy",
  "skinStethoscope": "steth_classic_black",
  "skinAccessory": "acc_none"
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "avatarId": "e1f2a3b4-5555-6666-7777-000000000001",
    "gender": "FEMALE",
    "skinCoat": "coat_scrubs_navy",
    "skinStethoscope": "steth_classic_black",
    "skinAccessory": "acc_none",
    "updatedAt": "2026-10-28T20:34:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T20:34:00Z"
  }
}
```

---

### 3.6. `POST /api/v1/clinic/avatar/skins/buy`
- **Objetivo:** Adquirir uma skin cosmética para o guarda-roupa do médico virtual, debitando atomicamente o custo de `currentXp` e registrando transação auditável do tipo `SKIN_PURCHASE` em `user_xp_transactions`. O `lifetimeXp` permanece inalterado.
- **Regras Rastreáveis:** `P-080`, `P-089`, `C-09`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Payload de Requisição (Request Body):**
```json
{
  "skinId": "coat_pediatric_dino"
}
```

**Resposta de Sucesso (`201 Created`):**
```json
{
  "data": {
    "skinId": "coat_pediatric_dino",
    "slot": "COAT",
    "name": "Jaleco Estampado Pediatria",
    "costXp": 1200,
    "remainingCurrentXp": 848,
    "transactionId": "t1a2b3c4-9999-8888-7777-000000000001",
    "purchasedAt": "2026-10-28T20:35:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T20:35:00Z"
  }
}
```

---

## 4. Endpoints de Lootboxes Médicas e Sistema de Raridades (`US-11`, `US-12`, `US-13`)

### 4.1. `GET /api/v1/clinic/lootboxes`
- **Objetivo:** Listar os 3 Tiers oficiais de caixas da sorte médicas disponíveis na clínica, informando metadados, custos em XP, garantias e probabilidades públicas transparentes de drop.
- **Regras Rastreáveis:** `P-093`, `P-094`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": [
    {
      "tier": "TIER_1_RESIDENT",
      "name": "Caixa do Residente",
      "description": "Ideal para iniciar a decoração com instrumentais básicos e móveis acolhedores de consultório.",
      "costXp": 500,
      "badgeColor": "#94A3B8",
      "assetSvgKey": "lootbox_tier1_resident",
      "minRarityGuaranteed": "COMMON",
      "probabilities": {
        "common": 60.0,
        "rare": 30.0,
        "epic": 9.0,
        "legendary": 1.0
      }
    },
    {
      "tier": "TIER_2_SPECIALIST",
      "name": "Caixa do Especialista",
      "description": "Equipamentos especializados e peças de média sofisticação. Zero chance de itens comuns!",
      "costXp": 1500,
      "badgeColor": "#0284C7",
      "assetSvgKey": "lootbox_tier2_specialist",
      "minRarityGuaranteed": "RARE",
      "probabilities": {
        "common": 0.0,
        "rare": 65.0,
        "epic": 28.0,
        "legendary": 7.0
      }
    },
    {
      "tier": "TIER_3_CHIEF_OF_STAFF",
      "name": "Caixa do Chefe de Ala",
      "description": "Acesso exclusivo aos equipamentos médicos mais nobres e relíquias lendárias da medicina.",
      "costXp": 4000,
      "badgeColor": "#F59E0B",
      "assetSvgKey": "lootbox_tier3_chief",
      "minRarityGuaranteed": "EPIC",
      "probabilities": {
        "common": 0.0,
        "rare": 0.0,
        "epic": 75.0,
        "legendary": 25.0
      }
    }
  ],
  "meta": {
    "timestamp": "2026-10-28T22:30:00Z",
    "totalTiers": 3
  }
}
```

---

### 4.2. `POST /api/v1/clinic/lootboxes/{tier}/open`
- **Objetivo:** Processar a abertura transacional ACID de uma Caixa da Sorte. Executa lock pessimista no saldo de XP, valida fundos, sorteia o item via `SecureRandom`, avalia duplicidade com concessão automática de cashback e persiste os ledgers de auditoria.
- **Regras Rastreáveis:** `P-080`, `P-093`, `P-094`, `P-095`, `C-17`, `C-18`, `C-19`, `C-20`, `C-21`, `C-22`, `C-23`
- **Autenticação:** Obrigatória (`Bearer <JWT_TOKEN>`)
- **Parâmetro de Caminho (Path Variable):**
  - `tier`: `TIER_1_RESIDENT` | `TIER_2_SPECIALIST` | `TIER_3_CHIEF_OF_STAFF`

**Resposta de Sucesso — Item Novo Desbloqueado (`200 OK`):**
```json
{
  "data": {
    "tier": "TIER_1_RESIDENT",
    "tierName": "Caixa do Residente",
    "costXp": 500,
    "droppedItem": {
      "id": "ped_maca_espacial_apollo",
      "name": "Maca Espacial Apollo Kids",
      "category": "pediatria",
      "rarity": "RARE",
      "footprintX": 2,
      "footprintY": 1,
      "placementType": "FLOOR",
      "isInteractable": true,
      "isLootboxExclusive": true,
      "soundFxUrl": "cosmic_beeps",
      "assetSvgKey": "ped_maca_espacial_apollo"
    },
    "isDuplicate": false,
    "cashbackXpAwarded": 0,
    "currentXpAfter": 1450,
    "lifetimeXp": 3800,
    "openedAt": "2026-10-28T22:31:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T22:31:00Z"
  }
}
```

**Resposta de Sucesso — Item Duplicado com Cashback de XP (`200 OK`):**
```json
{
  "data": {
    "tier": "TIER_2_SPECIALIST",
    "tierName": "Caixa do Especialista",
    "costXp": 1500,
    "droppedItem": {
      "id": "mesa_mogno_cafe",
      "name": "Mesa de Mogno com Xícara de Café Quente",
      "category": "mobiliario",
      "rarity": "RARE",
      "footprintX": 2,
      "footprintY": 1,
      "placementType": "FLOOR",
      "isInteractable": true,
      "isLootboxExclusive": false,
      "soundFxUrl": "coffee_steam",
      "assetSvgKey": "mesa_mogno_cafe"
    },
    "isDuplicate": true,
    "cashbackXpAwarded": 500,
    "currentXpAfter": 850,
    "lifetimeXp": 5200,
    "openedAt": "2026-10-28T22:32:00Z"
  },
  "meta": {
    "timestamp": "2026-10-28T22:32:00Z"
  }
}
```

---

## 5. Matriz de Erros HTTP Mapeados

| Código HTTP | Erro / Causa | Formato do Payload de Erro |
| :--- | :--- | :--- |
| `400 Bad Request` | Parâmetro inválido, gender inválido ou tier fora do enum | `{"error": "Validation Error", "message": "Tier de Lootbox inválido. Opções válidas: TIER_1_RESIDENT, TIER_2_SPECIALIST, TIER_3_CHIEF_OF_STAFF."}` |
| `401 Unauthorized` | Token JWT ausente, expirado ou com assinatura inválida | `{"error": "Unauthorized", "message": "Token de acesso expirado ou inválido."}` |
| `403 Forbidden` | Tentativa de comprar diretamente item com `is_lootbox_exclusive = true` ou skin não adquirida | `{"error": "Forbidden", "message": "Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."}` |
| `404 Not Found` | Item de catálogo, tema de superfície ou skin inexistente | `{"error": "Not Found", "message": "Recurso não encontrado."}` |
| `409 Conflict` | Compra duplicada de skin cosmética já pertencente ao inventário | `{"error": "Conflict", "message": "Item cosmético já desbloqueado."}` |
| `422 Unprocessable` | Saldo insuficiente de XP ou colisão espacial (AABB de piso ou conflito de parede) | `{"error": "Business Rule Violation", "message": "Saldo de XP insuficiente para realizar esta operação."}` |
| `500 Server Error` | Erro inesperado interno (stacktrace mascarado e sanitizado) | `{"error": "Internal Server Error", "message": "Ocorreu um erro interno. Tente novamente mais tarde."}` |
