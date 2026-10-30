# Estado de Execução Paralela — Backend (`STATE_Backend.md`)

> **Subagente:** `Backend Tester & Developer` (Etapa 3 — TDD & Execução `[PARALLEL]`)  
> **Feature:** Minha Clínica Médica (`P-080` a `P-086`)  
> **Escopo Isolado:** `backend/src/main/java/com/medstudy/backend/modules/clinic/**` e `backend/src/test/java/com/medstudy/backend/modules/clinic/**`

---

## 1. Artefatos de Produção Implementados (`com.medstudy.backend.modules.clinic`)

### 1.1. Entidades e Enums (`entity/`)
- `StudyActionType.java`: Enum determinístico de ações de estudo e transações da clínica (`QUESTION_SUBMITTED=15`, `QUESTION_CORRECT=40`, `QUESTION_CORRECT_BONUS=25`, `QUESTION_STREAK_3=15`, `QUESTION_STREAK_5=30`, `QUESTION_STREAK_10=75`, `FLASHCARD_EASY=8`, `FLASHCARD_MEDIUM=12`, `FLASHCARD_HARD=5`, `FLASHCARD_DECK_COMPLETED=100`, `DAILY_DECK_COMPLETED=100`, `VIDEO_10_MIN=50`, `VIDEO_COMPLETED=80`, `VIDEO_NOTE=30`, `SIMULADO_COMPLETED=300 + round(accuracyPercent * 5)`, `ROOM_EXPANSION`, `ITEM_PURCHASE`).
- `ClinicExpansionLevel.java`: Enum dos 6 níveis sequenciais de evolução espacial (`Box do Internato 4x4`, `Consultório Júnior 6x6`, `Consultório Master com Hall 8x8`, `Clínica 2 Ambientes 12x6`, `Clínica Integrada com Ala Pediátrica 12x12`, `Instituto Médico Completo 16x12`).
- `UserXpAccount.java`: Entidade JPA (`user_xp_accounts`) com invariantes de domínio `creditXp(long)` (incrementa simultaneamente `lifetimeXp` e `currentXp`) e `debitCurrentXp(long)` (debita exclusivamente de `currentXp` mantendo `lifetimeXp` intacto).
- `UserClinic.java`: Entidade JPA (`user_clinics`).
- `ClinicCatalogItem.java`: Entidade JPA (`clinic_items_catalog`) com serialização compatível para `interactable` / `isInteractable`.
- `ClinicPlacedItem.java`: Entidade JPA (`clinic_placed_items`).
- `UserXpTransaction.java`: Entidade JPA imutável de auditoria (`user_xp_transactions`).

### 1.2. Repositórios (`repository/`)
- `UserXpAccountRepository.java`
- `UserClinicRepository.java`
- `ClinicCatalogItemRepository.java`
- `ClinicPlacedItemRepository.java`
- `UserXpTransactionRepository.java`

### 1.3. DTOs (`dto/`)
- `ClinicStateResponse.java`: Suporta leitura direta na raiz e envelope `{ "data": ..., "meta": ... }`.
- `BuyClinicItemRequest.java` & `BuyClinicItemResponse.java`
- `PlacedItemDto.java` & `UpdateClinicLayoutRequest.java`
- `StudyActionRewardRequest.java` & `StudyActionRewardResponse.java`

### 1.4. Serviços (`service/`)
- `StudyXpEngineService.java`: Motor matemático de recompensas (`P-080`, `P-081`) com faixas de multiplicador de ofensiva diária (`0%`, `10%`, `20%`, `35%`, `50%`), integração opcional com `StreakRepairService`, crédito duplo (`lifetime_xp` e `current_xp`) e gravação em `user_xp_transactions`.
- `ClinicLayoutValidator.java`: Validador espacial de limites da malha e detecção de colisão AABB 2D no piso com inversão de `footprintX`/`footprintY` quando `rotation == 1` (`P-084`).
- `ClinicService.java`: Onboarding Nível 1 com os 3 itens gratuitos (`mesa_scandi` em `0,0`, `cadeira_ergonomica` em `0,1`, `ped_maca_baleia` em `2,0`), progressão sequencial Nível 1 a 6 (`P-082`), catálogo oficial de 27 itens (`P-083`), compra atômica e atualização de layout (`P-084`).

### 1.5. Controllers (`controller/`)
- `ClinicController.java` (`/api/v1/clinic` e `/api/clinic`): `GET ""`, `POST "/expand"`, `POST "/items/buy"`, `PUT "/layout"`.
- `StudyRewardController.java` (`/api/v1/study` e `/api/study`): `POST "/action-reward"`.

---

## 2. Suíte TDD First (`src/test/java/com/medstudy/backend/modules/clinic/`)
- `StudyXpEngineServiceTest.java`: 29 cenários parametrizados e unitários cobrindo `P-080` e `P-081` — **100% PASS (29/29)**.
- `ClinicLayoutValidatorTest.java`: 5 cenários de validação espacial AABB 2D, inversão de footprint por rotação (`rotation == 1`) e limites de malha (`P-084`) — **100% PASS (5/5)**.
- `ClinicServiceTest.java`: 5 cenários cobrindo onboarding Nível 1 com 3 itens gratuitos, expansão Nível 1->6 debitando apenas `current_xp`, bloqueios por `lifetime_xp`/`current_xp`, compra no catálogo de 27 itens e proteção anti-IDOR (`403 Forbidden`) — **100% PASS (5/5)**.
- `ClinicControllerTest.java`: 5 testes de contrato REST MockMvc cobrindo todos os endpoints — **100% PASS (5/5)**.

## 3. Resultado da Execução Maven (`.\mvnw.cmd test -Dtest=*Clinic*,*StudyXp*`)
- **Status:** `BUILD SUCCESS`
- **Total de Testes Executados:** `48` (`44` da feature Minha Clínica Médica + `4` de ClinicalMasteryServiceTest)
- **Falhas / Erros:** `0` / `0`
