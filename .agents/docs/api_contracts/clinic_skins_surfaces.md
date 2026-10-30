# Contrato de API: Superfícies, Revestimentos e Guarda-Roupa do Avatar Clínico

> **Localização Mandatória:** `.agents/docs/api_contracts/clinic_skins_surfaces.md`  
> **Responsável:** Arquiteto (`api-contract-expert`)  
> **Rastreabilidade de Negócio:** US-14 (ROADMAP.md) / `[P-096.1]` a `[P-096.6]` / ADR-011  
> **Referências de Regras:** `.agents/rules/backend-api-contract-rules.md`, `.agents/rules/security-anti-patterns.md`

---

## 1. Visão Geral
- **Prefixo Base da Rota:** `/api/v1/clinic` (alias retrocompatível: `/api/clinic`)
- **Protocolo:** HTTP/1.1 e HTTP/2 (REST Stateless com Bearer JWT ou Cookie HttpOnly)
- **Convenção de Nomenclatura:** `camelCase` (padrão canônico Spring Boot / Angular do MedStudy)
- **Formato dos Dados:** `application/json` (UTF-8)

---

## 2. Padrão de Envelope de Resposta

Conforme `.agents/rules/backend-api-contract-rules.md`, todas as respostas HTTP de sucesso (2xx) devem ser encapsuladas pelo envelope `{"data": ..., "meta": ...}`:

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-10-29T21:30:00Z"
  }
}
```

---

## 3. Catálogo Oficial Canônico de Identificadores (P-096.1 & P-096.4)

### 3.1. Revestimentos de Parede (`WALL_SURFACE`)
- `clean_white`: "Branco Clínico Minimalista" (Custo: 0 XP — padrão inicial gratuito)
- `ped_papel_safari`: "Safari Aquarela Savana" (Custo: 850 XP)
- `wallpaper_geometric_teal`: "Geométrico Nórdico Teal" (Custo: 950 XP)
- `wallpaper_brick_white`: "Tijolinho Branco Moderno" (Custo: 750 XP)

### 3.2. Revestimentos de Piso (`FLOOR_SURFACE`)
- `wood_light`: "Carvalho Claro Escandinavo" (Custo: 0 XP — padrão inicial gratuito)
- `wood_dark_herringbone`: "Madeira Nobre Espinha de Peixe" (Custo: 1.100 XP)
- `marble_carrara`: "Mármore Carrara Luxo" (Custo: 2.200 XP)
- `tatame_eva`: "Tatame EVA Pastel Candy Color" (Custo: 800 XP)

### 3.3. Guarda-Roupa do Avatar Médico Virtual (22 Opções)
- **Jalecos/Roupas (`coat`):** `coat_default` (0 XP), `coat_intern_white` (0 XP), `coat_scrubs_navy` (500 XP), `coat_scrubs_green` (800 XP), `coat_pediatric` (500 XP), `coat_pediatric_dino` (1.200 XP), `coat_executive_doc` (2.500 XP), `coat_gold` (2.500 XP).
- **Estetoscópios (`stethoscope`):** `steth_standard` (0 XP), `steth_classic_black` (0 XP), `steth_none` (0 XP), `steth_elephant` (350 XP), `steth_cardio_burgundy` (700 XP), `ped_steth_elefante` (950 XP), `steth_gold` (1.800 XP), `steth_gold_master` (3.000 XP).
- **Acessórios (`accessory`):** `acc_none` (0 XP), `acc_red_bowtie` (400 XP), `acc_glasses_classic` (400 XP), `acc_scrub_cap` (600 XP), `acc_ped_gorro_colorido` (600 XP), `acc_prontuario_clipboard` (850 XP).

---

## 4. Endpoints

### 4.1. `POST /api/v1/clinic/items/buy`
- **Objetivo:** Adquirir um item ou revestimento de superfície (`SURFACE_WALL` ou `SURFACE_FLOOR`), debitando `current_xp` de forma atômica no ledger e persistindo a posse em `user_unlocked_skins`.
- **Autenticação:** `Bearer <JWT_TOKEN>` (ou Cookie HttpOnly)
- **Idempotência:** Se o estudante já possui a superfície, não debita novamente e retorna HTTP 200 OK confirmando a posse.

**Payload de Requisição (Request Body):**
```json
{
  "catalogItemId": "wallpaper_geometric_teal",
  "gridX": null,
  "gridY": null,
  "rotation": 0
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "purchasedItem": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "catalogItemId": "wallpaper_geometric_teal",
      "gridX": null,
      "gridY": null,
      "rotation": 0,
      "placed": false,
      "placementType": "SURFACE_WALL"
    },
    "clinicState": {
      "clinicId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "clinicName": "Minha Clínica",
      "expansionLevel": 1,
      "gridWidth": 4,
      "gridHeight": 4,
      "wallTheme": "wallpaper_geometric_teal",
      "floorTheme": "wood_light",
      "lifetimeXp": 5000,
      "currentXp": 4050,
      "ownedItemIds": ["mesa_scandi", "cadeira_ergonomica", "ped_maca_baleia", "wallpaper_geometric_teal"]
    },
    "message": "Revestimento 'Geométrico Nórdico Teal' aplicado com sucesso à clínica!"
  },
  "meta": {
    "timestamp": "2026-10-29T21:30:00Z"
  }
}
```

---

### 4.2. `PUT /api/v1/clinic/surfaces`
- **Objetivo:** Atualizar os revestimentos ativos de parede e piso da clínica, validando que ambos estejam previamente desbloqueados em `user_unlocked_skins`.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Payload de Requisição (Request Body):**
```json
{
  "wallTheme": "wallpaper_brick_white",
  "floorTheme": "wood_dark_herringbone"
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "clinicId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "clinicName": "Minha Clínica",
    "expansionLevel": 1,
    "gridWidth": 4,
    "gridHeight": 4,
    "wallTheme": "wallpaper_brick_white",
    "floorTheme": "wood_dark_herringbone",
    "lifetimeXp": 5000,
    "currentXp": 4050,
    "ownedItemIds": ["wallpaper_brick_white", "wood_dark_herringbone"]
  },
  "meta": {
    "timestamp": "2026-10-29T21:30:00Z"
  }
}
```

---

### 4.3. `GET /api/v1/clinic/avatar`
- **Objetivo:** Consultar a configuração estética do médico virtual residente, itens equipados e a lista completa das 22 skins oficiais com status de posse.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "avatarId": "c3d4e5f6-0000-0000-0000-000000000001",
    "gender": "FEMALE",
    "skinCoat": "coat_pediatric_dino",
    "skinStethoscope": "steth_cardio_burgundy",
    "skinAccessory": "acc_ped_gorro_colorido",
    "avatarX": 1,
    "avatarY": 1,
    "unlockedSkins": [
      "coat_default",
      "coat_intern_white",
      "coat_pediatric_dino",
      "steth_standard",
      "steth_classic_black",
      "steth_none",
      "steth_cardio_burgundy",
      "acc_none",
      "acc_ped_gorro_colorido"
    ],
    "catalogSkins": [
      {
        "id": "coat_default",
        "slot": "COAT",
        "name": "Jaleco Branco Clássico",
        "costXp": 0,
        "assetSvgKey": "skin_coat_default",
        "owned": true
      },
      {
        "id": "coat_pediatric_dino",
        "slot": "COAT",
        "name": "Jaleco Estampado Dinossauro Pediátrico",
        "costXp": 1200,
        "assetSvgKey": "skin_coat_pediatric_dino",
        "owned": true
      },
      {
        "id": "coat_executive_doc",
        "slot": "COAT",
        "name": "Jaleco Executivo Alfaiataria Nobre",
        "costXp": 2500,
        "assetSvgKey": "skin_coat_executive_doc",
        "owned": false
      }
    ]
  },
  "meta": {
    "timestamp": "2026-10-29T21:30:00Z"
  }
}
```

---

### 4.4. `PUT /api/v1/clinic/avatar`
- **Objetivo:** Atualizar a indumentária equipada, alternar gênero gratuitamente ou reposicionar o médico no consultório.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Payload de Requisição (Request Body):**
```json
{
  "gender": "FEMALE",
  "skinCoat": "coat_pediatric_dino",
  "skinStethoscope": "steth_cardio_burgundy",
  "skinAccessory": "acc_ped_gorro_colorido",
  "avatarX": 2,
  "avatarY": 1
}
```

**Resposta de Sucesso (`200 OK`):**
Retorna o payload idêntico ao `GET /api/v1/clinic/avatar` envolvido em `data`/`meta`.

---

### 4.5. `POST /api/v1/clinic/avatar/skins/buy`
- **Objetivo:** Adquirir uma peça cosmética do guarda-roupa do avatar médico, debitando `current_xp` no ledger contábil e desbloqueando em `user_unlocked_skins`.
- **Autenticação:** `Bearer <JWT_TOKEN>`

**Payload de Requisição (Request Body):**
```json
{
  "skinId": "coat_executive_doc"
}
```

**Resposta de Sucesso (`200 OK`):**
```json
{
  "data": {
    "skinId": "coat_executive_doc",
    "remainingCurrentXp": 1550,
    "unlockedSkins": [
      "coat_default",
      "coat_intern_white",
      "coat_executive_doc"
    ]
  },
  "meta": {
    "timestamp": "2026-10-29T21:30:00Z"
  }
}
```

---

## 5. Matriz de Erros HTTP Mapeados

| Status Code | Causa | Formato do Payload |
| :--- | :--- | :--- |
| `400 Bad Request` | Parâmetros ausentes, nulos ou formato de gênero inválido | `{"error": "Bad Request", "message": "Gênero inválido. Opções permitidas: MALE ou FEMALE."}` |
| `401 Unauthorized` | Token ausente, inválido ou expirado | `{"error": "Unauthorized", "message": "Estudante não autenticado."}` |
| `403 Forbidden` | Tentativa de aplicar superfície ou equipar skin não desbloqueada | `{"error": "Forbidden", "message": "Você precisa desbloquear este revestimento antes de aplicá-lo à sua clínica."}` |
| `404 Not Found` | Identificador de item ou superfície inexistente no catálogo | `{"error": "Not Found", "message": "Superfície de revestimento não encontrada no catálogo oficial."}` |
| `409 Conflict` | Tentativa de recompra de skin cosmética já adquirida | `{"error": "Conflict", "message": "Item cosmético já desbloqueado."}` |
| `422 Unprocessable` | Saldo de XP insuficiente para aquisição de item ou skin | `{"error": "Unprocessable Entity", "message": "Saldo de XP insuficiente para realizar esta operação."}` |
| `500 Server Error` | Falha interna no servidor (sem vazamento de stacktrace) | `{"error": "Internal Server Error", "message": "Não foi possível processar a operação no momento. Tente novamente."}` |

---

## 6. Diretrizes de Integração no Frontend Angular (Signals & Services)
- **Serviço Central:** `ClinicService` (`src/app/core/services/clinic.service.ts`)
- **Gestão de Estado Reativo:**
  - `clinicState`: Signal contendo o estado consolidado (`wallTheme`, `floorTheme`, `avatar`, `currentXp`).
  - `doctorAvatarResponse`: Signal contendo `unlockedSkins` e `catalogSkins`.
  - Preview efêmero no `DoctorWardrobeModalComponent` usando Signals locais (`tempAvatarCoat`, `tempAvatarSteth`, `tempAvatarAccessory`) antes do commit via `PUT /api/v1/clinic/avatar`.
