# Documentação de Banco de Dados: Minha Clínica Médica

> **Localização Mandatória:** `.agents/docs/db/minha-clinica-medica.md`  
> **Responsável:** DBA (`dba-expert`)  
> **Referências de Regras:** `.agents/rules/backend-db-performance-rules.md`, `.agents/rules/security-anti-patterns.md`, `.agents/rules/workflow-documentation-governance-rules.md`

---

## 1. Visão Geral do Módulo
- **Domínio de Negócio:** Gamificação Isométrica 2.5D, Economia de Estudo e Identidade Médica ("Minha Clínica Médica").
- **Propósito:** Persistir a progressão espacial da clínica virtual do estudante de medicina, a custódia auditável de saldos de XP (vitalício vs. investível), o catálogo de itens e revestimentos, o posicionamento físico em malha isométrica 2:1 e a identidade visual customizável do Personagem Médico Virtual (Avatar com skins e superfícies desacopladas).
- **Mecanismo de Persistência:** PostgreSQL 16 (H2 em modo PostgreSQL nos testes de integração).

---

## 2. Estrutura de Tabelas

### 2.1. Tabela: `user_xp_accounts`
- **Descrição de Negócio:** Conta contábil do estudante contendo a dualidade de saldos de XP (`lifetime_xp` acumulador monotônico vs. `current_xp` saldo líquido transacional) e controle de ofensiva diária (`current_streak_days`).

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Chave primária referenciando `users(id)` | Dado Pessoal (Identificador Pseudonimizado) |
| `lifetime_xp` | `BIGINT` | `NOT NULL` | `0` | XP acumulado total (nunca decresce, base de rankings/níveis) | Dado Comportamental de Estudo |
| `current_xp` | `BIGINT` | `NOT NULL` | `0` | Saldo investível na clínica/skins (sempre `>= 0`) | Dado de Gamificação / Saldo Virtual |
| `current_streak_days` | `INT` | `NOT NULL` | `0` | Dias consecutivos de estudo ativo (ofensiva diária) | Métrica de Engajamento |
| `last_study_date` | `DATE` | `NULL` | `NULL` | Data da última atividade de estudo pontuada | Log Temporal |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp da última movimentação de saldo | Dado Técnico |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_user_xp_accounts_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE`.

#### Constraints & Validações de Domínio
- `chk_user_xp_accounts_lifetime_non_negative`: `CHECK (lifetime_xp >= 0)`.
- `chk_user_xp_accounts_current_non_negative`: `CHECK (current_xp >= 0)`.
- `chk_user_xp_accounts_streak_non_negative`: `CHECK (current_streak_days >= 0)`.

#### Índices e Otimização de Performance
- `idx_user_xp_accounts_lifetime_xp_desc`: B-Tree em `(lifetime_xp DESC)` para consultas de Ranking Médico sem Table Scan.

---

### 2.2. Tabela: `user_clinics`
- **Descrição de Negócio:** Registro principal do consultório do estudante, armazenando nível de expansão física (1 a 6), dimensões da malha isométrica e revestimentos globais de parede e piso.

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `NOT NULL` | `gen_random_uuid()` | Chave primária única da clínica | Identificador Sintético |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Usuário proprietário da clínica (1:1 com `users`) | Dado Pessoal Pseudonimizado |
| `clinic_name` | `VARCHAR(100)` | `NOT NULL` | `'Minha Clínica'` | Nome customizado do consultório médico | Preferência de Interface |
| `expansion_level` | `INT` | `NOT NULL` | `1` | Nível físico da sala (1 = Box 4x4 até 6 = Instituto 16x12) | Gamificação |
| `grid_width` | `INT` | `NOT NULL` | `4` | Largura da malha isométrica em tiles | Configuração Espacial |
| `grid_height` | `INT` | `NOT NULL` | `4` | Altura da malha isométrica em tiles | Configuração Espacial |
| `theme` | `VARCHAR(50)` | `NOT NULL` | `'clean_modern'` | Tema geral da clínica | Preferência Estética |
| `wall_theme` | `VARCHAR(50)` | `NOT NULL` | `'wall_clean_white'` | Revestimento global das paredes traseiras (NW e NE) | Preferência Estética |
| `floor_theme` | `VARCHAR(50)` | `NOT NULL` | `'floor_porcelanato_cinza'` | Revestimento global dos tiles de piso | Preferência Estética |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp de fundação da clínica | Auditoria |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp da última expansão ou reforma | Auditoria |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_user_clinics_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE` e restrição `UNIQUE`.

#### Constraints & Validações de Domínio
- `chk_user_clinics_expansion_level`: `CHECK (expansion_level BETWEEN 1 AND 6)`.
- `chk_user_clinics_grid_dimensions`: `CHECK (grid_width BETWEEN 4 AND 16 AND grid_height BETWEEN 4 AND 12)`.

---

### 2.3. Tabela: `clinic_items_catalog`
- **Descrição de Negócio:** Catálogo imutável dos bens virtuais, instrumentais médicos, móveis e acabamentos de superfície disponíveis para compra com `current_xp`.

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Identificador canônico do item (slug) | Dado Público de Catálogo |
| `name` | `VARCHAR(100)` | `NOT NULL` | `N/A` | Nome amigável de exibição do item | Dado Público de Catálogo |
| `category` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Categoria: `pediatria`, `mobiliario`, `clinica`, `recepcao` | Dado Público de Catálogo |
| `cost_xp` | `INT` | `NOT NULL` | `N/A` | Preço de aquisição em XP | Regra de Negócio |
| `min_expansion_level` | `INT` | `NOT NULL` | `1` | Nível mínimo da clínica exigido para compra | Regra de Negócio |
| `footprint_x` | `INT` | `NOT NULL` | `1` | Largura em tiles no chão (0 para itens de parede/superfície) | Física Espacial |
| `footprint_y` | `INT` | `NOT NULL` | `1` | Altura em tiles no chão (0 para itens de parede/superfície) | Física Espacial |
| `placement_type` | `VARCHAR(20)` | `NOT NULL` | `'FLOOR'` | Modalidade: `FLOOR`, `WALL`, `SURFACE_WALL`, `SURFACE_FLOOR` | Física Espacial |
| `is_interactable` | `BOOLEAN` | `NOT NULL` | `FALSE` | Dispara animação e som cozy ao ser clicado | UI / Interatividade |
| `sound_fx_url` | `VARCHAR(255)` | `NULL` | `NULL` | Caminho do áudio cozy associado | Asset Estático |
| `asset_svg_key` | `VARCHAR(100)` | `NOT NULL` | `N/A` | Chave de renderização do asset SVG | Asset Estático |

#### Constraints & Validações de Domínio
- `chk_clinic_items_catalog_category`: `CHECK (category IN ('pediatria', 'mobiliario', 'clinica', 'recepcao'))`.
- `chk_clinic_items_catalog_cost_xp`: `CHECK (cost_xp >= 0)`.
- `chk_clinic_items_catalog_min_level`: `CHECK (min_expansion_level BETWEEN 1 AND 6)`.
- `chk_clinic_items_catalog_placement_type`: `CHECK (placement_type IN ('FLOOR', 'WALL', 'SURFACE_WALL', 'SURFACE_FLOOR'))`.
- `chk_clinic_items_catalog_footprint`: `CHECK ((placement_type = 'FLOOR' AND footprint_x >= 1 AND footprint_y >= 1) OR (placement_type IN ('WALL', 'SURFACE_WALL', 'SURFACE_FLOOR') AND footprint_x >= 0 AND footprint_y >= 0))`.

#### Índices e Otimização de Performance
- `idx_clinic_items_catalog_category_level`: B-Tree em `(category, min_expansion_level, cost_xp)`.
- `idx_clinic_items_catalog_placement`: B-Tree em `(placement_type, category)`.

---

### 2.4. Tabela: `clinic_placed_items`
- **Descrição de Negócio:** Instâncias de itens adquiridos pelos estudantes. Podem estar guardados no inventário (`is_placed = FALSE`), posicionados na malha de piso (`is_placed = TRUE`, `grid_x`, `grid_y`, `rotation`) ou fixados nas paredes traseiras (`wall_side`, `wall_tile_index`, `elevation_z`).

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `NOT NULL` | `gen_random_uuid()` | Identificador único da instância do item | Identificador Sintético |
| `clinic_id` | `UUID` | `NOT NULL` | `N/A` | Referência à clínica do estudante | Chave Estrangeira |
| `catalog_item_id` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Referência ao item do catálogo | Chave Estrangeira |
| `grid_x` | `INT` | `NOT NULL` | `0` | Coordenada X na malha de piso | Posicionamento Espacial |
| `grid_y` | `INT` | `NOT NULL` | `0` | Coordenada Y na malha de piso | Posicionamento Espacial |
| `rotation` | `INT` | `NOT NULL` | `0` | Orientação: `0` (Sudeste / SE) ou `1` (Sudoeste / SW) | Posicionamento Espacial |
| `is_placed` | `BOOLEAN` | `NOT NULL` | `TRUE` | `TRUE` se posicionado na sala, `FALSE` no inventário | Estado de Layout |
| `wall_side` | `VARCHAR(2)` | `NULL` | `NULL` | Fixação de parede: `'NW'` (Noroeste) ou `'NE'` (Nordeste) | Ancoragem Vertical |
| `wall_tile_index` | `INT` | `NULL` | `NULL` | Segmento linear do tile na parede | Ancoragem Vertical |
| `elevation_z` | `INT` | `NULL` | `NULL` | Elevação vertical em pixels a partir do rodapé | Ancoragem Vertical |
| `placed_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp de posicionamento ou alteração | Auditoria |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_clinic_placed_items_clinic`: `clinic_id` referencia `user_clinics(id)` com `ON DELETE CASCADE`.
- `fk_clinic_placed_items_catalog`: `catalog_item_id` referencia `clinic_items_catalog(id)`.

#### Constraints & Validações de Domínio
- `chk_clinic_placed_items_rotation`: `CHECK (rotation IN (0, 1))`.
- `chk_clinic_placed_items_coords`: `CHECK (NOT is_placed OR (grid_x >= 0 AND grid_y >= 0))`.
- `chk_clinic_placed_items_wall_side`: `CHECK (wall_side IS NULL OR wall_side IN ('NW', 'NE'))`.
- `chk_clinic_placed_items_wall_tile_index`: `CHECK (wall_tile_index IS NULL OR wall_tile_index >= 0)`.
- `chk_clinic_placed_items_elevation_z`: `CHECK (elevation_z IS NULL OR (elevation_z >= 0 AND elevation_z <= 200))`.

#### Índices e Otimização de Performance
- `idx_clinic_placed_items_clinic_id`: B-Tree em `(clinic_id)`.
- `idx_clinic_placed_items_clinic_placed`: B-Tree composto em `(clinic_id, is_placed)` para carregar a cena ativa em < 5ms.
- `idx_clinic_placed_items_catalog_id`: B-Tree em `(catalog_item_id)`.
- `idx_clinic_placed_items_wall_lookup`: B-Tree parcial em `(clinic_id, wall_side, wall_tile_index) WHERE wall_side IS NOT NULL`.

---

### 2.5. Tabela: `user_doctor_avatar`
- **Descrição de Negócio:** Representação do Personagem Médico Virtual residente na clínica. Permite alternância gratuita de gênero base (`FEMALE` / `MALE`) e equipar cosméticos nos 3 slots de indumentária (`coat`, `stethoscope`, `accessory`).

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Chave primária referenciando `users(id)` | Dado Pessoal Pseudonimizado |
| `gender` | `VARCHAR(10)` | `NOT NULL` | `'FEMALE'` | Base do avatar: `MALE` ou `FEMALE` (gratuito) | Preferência de Interface (Não Sensível) |
| `skin_coat` | `VARCHAR(50)` | `NOT NULL` | `'coat_intern_white'` | Identificador da roupa/jaleco equipada | Preferência Estética |
| `skin_stethoscope` | `VARCHAR(50)` | `NOT NULL` | `'steth_classic_black'` | Identificador do estetoscópio equipado | Preferência Estética |
| `skin_accessory` | `VARCHAR(50)` | `NOT NULL` | `'acc_none'` | Identificador do acessório equipado | Preferência Estética |
| `avatar_x` | `INT` | `NOT NULL` | `1` | Coordenada X padrão de permanência na sala | Posição no Consultório |
| `avatar_y` | `INT` | `NOT NULL` | `1` | Coordenada Y padrão de permanência na sala | Posição no Consultório |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp da última customização ou reposicionamento | Auditoria |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_user_doctor_avatar_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE`.

#### Constraints & Validações de Domínio
- `chk_user_doctor_avatar_gender`: `CHECK (gender IN ('MALE', 'FEMALE'))`.
- `chk_user_doctor_avatar_coords`: `CHECK (avatar_x >= 0 AND avatar_y >= 0)`.

---

### 2.6. Tabela: `user_unlocked_skins`
- **Descrição de Negócio:** Tabela de custódia e inventário de vestimentas, acessórios e temas de superfície (papel de parede e piso) que o estudante já desbloqueou gratuitamente ou adquiriu via `current_xp`.

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `NOT NULL` | `gen_random_uuid()` | Chave primária da posse do cosmético | Identificador Sintético |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Estudante proprietário da skin | Dado Pessoal Pseudonimizado |
| `skin_slot` | `VARCHAR(20)` | `NOT NULL` | `N/A` | Categoria: `coat`, `stethoscope`, `accessory`, `surface_wall`, `surface_floor` | Domínio Cosmético |
| `skin_id` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Identificador canônico da skin adquirida | Identificador de Item |
| `unlocked_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp da aquisição/desbloqueio | Auditoria |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_user_unlocked_skins_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE`.

#### Constraints & Validações de Domínio
- `uk_user_unlocked_skins_user_skin`: `UNIQUE(user_id, skin_id)`.
- `chk_user_unlocked_skins_slot`: `CHECK (skin_slot IN ('coat', 'stethoscope', 'accessory', 'surface_wall', 'surface_floor'))`.

#### Índices e Otimização de Performance
- `idx_user_unlocked_skins_user_id`: B-Tree na FK `user_id`.
- `idx_user_unlocked_skins_user_slot`: B-Tree composto em `(user_id, skin_slot)` para popular o guarda-roupa/loja do usuário de forma indexada.

---

### 2.7. Tabela: `user_xp_transactions`
- **Descrição de Negócio:** Ledger contábil imutável (append-only) de todas as mutações financeiras de XP (créditos de estudos e débitos de compras de itens, expansões ou skins).

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `NOT NULL` | `gen_random_uuid()` | Chave primária única da transação | Identificador Sintético |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Usuário que gerou o movimento financeiro | Dado Pessoal Pseudonimizado |
| `amount` | `INT` | `NOT NULL` | `N/A` | Valor movimentado (positivo = crédito, negativo = débito) | Movimentação Financeira |
| `balance_after` | `BIGINT` | `NOT NULL` | `N/A` | Saldo resultante de `current_xp` | Conciliação Contábil |
| `source` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Origem: `QUESTION_CORRECT`, `FLASHCARD`, `ITEM_PURCHASE`, `SKIN_PURCHASE`, etc. | Classificação Transacional |
| `description` | `VARCHAR(255)` | `NULL` | `NULL` | Detalhe textual amigável da operação | Log Amigável |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp de registro no ledger | Auditoria Imutável |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_user_xp_transactions_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE`.

#### Constraints & Validações de Domínio
- `chk_user_xp_transactions_balance_non_negative`: `CHECK (balance_after >= 0)`.
- `chk_user_xp_transactions_amount_non_zero`: `CHECK (amount <> 0)`.

#### Índices e Otimização de Performance
- `idx_user_xp_transactions_user_created`: B-Tree composto em `(user_id, created_at DESC)` para extrato paginado do usuário.
- `idx_user_xp_transactions_source`: B-Tree em `(source)` para agregações analíticas de estudo.

---

### 2.7. Tabela: `lootbox_opening_logs`
- **Descrição de Negócio:** Ledger de auditoria imutável de todas as aberturas de Caixas da Sorte médicas (`TIER_1_RESIDENT`, `TIER_2_SPECIALIST`, `TIER_3_CHIEF_OF_STAFF`), registrando o item contemplado, verificação de duplicidade, cálculo de cashback e timestamp UTC.

| Coluna | Tipo Primitivo | Nulo? | Padrão (Default) | Descrição / Regra | Classificação LGPD |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `NOT NULL` | `gen_random_uuid()` | Chave primária da auditoria de abertura | Identificador Sintético |
| `user_id` | `UUID` | `NOT NULL` | `N/A` | Estudante que realizou a abertura | Dado Pessoal Pseudonimizado |
| `box_tier` | `VARCHAR(30)` | `NOT NULL` | `N/A` | Tier: `TIER_1_RESIDENT`, `TIER_2_SPECIALIST`, `TIER_3_CHIEF_OF_STAFF` | Metadados de Jogo |
| `cost_xp` | `INT` | `NOT NULL` | `N/A` | Custo debitado de `current_xp` (500, 1.500 ou 4.000) | Auditoria Financeira de XP |
| `item_id_dropped` | `VARCHAR(50)` | `NOT NULL` | `N/A` | Chave estrangeira referenciando o item no catálogo | Catálogo Público |
| `item_rarity` | `VARCHAR(20)` | `NOT NULL` | `N/A` | Raridade do item sorteado: `COMMON`, `RARE`, `EPIC`, `LEGENDARY` | Metadados de Jogo |
| `is_duplicate` | `BOOLEAN` | `NOT NULL` | `FALSE` | `TRUE` se usuário já possuía o item (ativou cashback) | Regra de Negócio |
| `cashback_xp_awarded` | `INT` | `NOT NULL` | `0` | Valor de XP devolvido em duplicatas (150, 500, 1.500 ou 3.000) | Auditoria Financeira de XP |
| `opened_at` | `TIMESTAMPTZ` | `NOT NULL` | `NOW()` | Timestamp UTC exato da abertura | Registro Temporal Imutável |

#### Relacionamentos e Chaves Estrangeiras (Foreign Keys)
- `fk_lootbox_opening_logs_user`: `user_id` referencia `users(id)` com `ON DELETE CASCADE`.
- `fk_lootbox_opening_logs_item`: `item_id_dropped` referencia `clinic_items_catalog(id)`.

#### Constraints & Validações de Domínio
- `chk_lootbox_opening_logs_tier`: `CHECK (box_tier IN ('TIER_1_RESIDENT', 'TIER_2_SPECIALIST', 'TIER_3_CHIEF_OF_STAFF'))`.
- `chk_lootbox_opening_logs_cost`: `CHECK (cost_xp >= 0)`.
- `chk_lootbox_opening_logs_rarity`: `CHECK (item_rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY'))`.
- `chk_lootbox_opening_logs_cashback`: `CHECK (cashback_xp_awarded >= 0)`.

#### Índices e Otimização de Performance
- `idx_lootbox_opening_logs_user_id`: B-Tree na FK `user_id` para prevenir table scan em consultas de histórico do estudante.
- `idx_lootbox_opening_logs_opened_at`: B-Tree em `(opened_at DESC)` para feeds cronológicos e métricas analíticas.
- `idx_lootbox_opening_logs_user_opened`: B-Tree composto em `(user_id, opened_at DESC)` para paginação do extrato de caixas abertas em < 3ms.
- `idx_lootbox_opening_logs_item`: B-Tree na FK `item_id_dropped` para auditorias de volumetria de drop por item.

---

## 3. Estratégia de Migrations

- **Migration de Fundação:** `backend/src/main/resources/db/migration/V25__create_minha_clinica_tables.sql`
- **Migration de Expansão (Superfícies & Avatar):** `backend/src/main/resources/db/migration/V26__add_clinic_surfaces_and_avatar.sql`
- **Migration de Megacatálogo (104 Itens):** `backend/src/main/resources/db/migration/V27__expand_clinic_catalog_to_104_items.sql`
- **Migration de Raridades & Lootboxes (50 Itens Exclusivos):** `backend/src/main/resources/db/migration/V28__add_item_rarities_and_lootbox_system.sql`
- **Arquivo Migration DOWN (Rollback de Desastre):**

```sql
-- Script de Reversão de Emergência: U28__rollback_item_rarities_and_lootbox_system.sql
DROP TABLE IF EXISTS lootbox_opening_logs CASCADE;

DELETE FROM clinic_items_catalog WHERE is_lootbox_exclusive = TRUE;

DROP INDEX IF EXISTS idx_clinic_items_catalog_rarity_exclusive;
DROP INDEX IF EXISTS idx_clinic_items_catalog_exclusive;

ALTER TABLE clinic_items_catalog DROP CONSTRAINT IF EXISTS chk_clinic_items_catalog_rarity;
ALTER TABLE clinic_items_catalog DROP COLUMN IF EXISTS is_lootbox_exclusive;
ALTER TABLE clinic_items_catalog DROP COLUMN IF EXISTS rarity;
```

---

## 4. Dados de Teste Realistas (Mock Data Seeds)
> O script completo de inserção de seeds sintéticos está localizado em `.agents/docs/db/seeds/minha-clinica-medica_seeds.sql`.
