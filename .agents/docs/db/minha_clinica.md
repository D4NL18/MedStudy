# Documentação de Banco de Dados: Minha Clínica Médica (Gamificação Isométrica 2.5D & Motor de XP)

> **Localização Mandatória:** `.agents/docs/db/minha_clinica.md`  
> **Responsável:** DBA (`dba-expert`)  
> **Referências de Regras:** `.agents/rules/security-anti-patterns.md`, `.agents/rules/workflow-documentation-governance-rules.md`, `.agents/docs/business_rules/minha-clinica-medica.md` (`P-080` a `P-086`)

---

## 1. Visão Geral do Módulo
- **Domínio de Negócio:** Gamificação Educacional Médica, Economia de XP (`Study XP Engine`) e Customização Espacial Isométrica 2.5D (`Minha Clínica Médica`).
- **Propósito:** Persistir com integridade transacional ACID a dualidade de saldos de experiência do estudante (`lifetime_xp` monotônico vitalício vs `current_xp` líquido investível), o livro-razão imutável de auditoria contábil (`user_xp_transactions`), o catálogo oficial de 27 itens médicos/pediátricos (`clinic_items_catalog`), o estado de evolução espacial da clínica em 6 níveis (`user_clinics`) e o inventário/layout de itens posicionados no piso isométrico ou guardados na reserva (`clinic_placed_items`).
- **Mecanismo de Persistência:** PostgreSQL 16 (Gerenciado via Flyway Migrations — `V25__create_minha_clinica_tables.sql`).

---

## 2. Governança LGPD, Privacy by Design e Travas Anti-Perda de Dados (DLP)

| Tabela | Classificação LGPD | Estratégia de Privacidade (*Privacy by Design*) |
| :--- | :--- | :--- |
| `user_xp_accounts` | **Dado Pessoal Pseudonimizado** | Referencia exclusivamente `user_id` (`UUID`) da tabela `users(id)`. Não armazena nome, CPF, CRM ou e-mail. |
| `user_clinics` | **Dado Pessoal Pseudonimizado** | Vinculada via `user_id` (`UUID`). O campo `clinic_name` possui valor padrão `'Minha Clínica'` e não exige dados pessoais reais. |
| `clinic_items_catalog` | **Dado Público / Não-Pessoal** | Catálogo estático global de bens virtuais do sistema. Zero vínculo com titulares. |
| `clinic_placed_items` | **Dado Pessoal Indireto (Pseudonimizado)** | Vinculada à clínica via `clinic_id` (`UUID`). Representa apenas coordenadas discretas `(grid_x, grid_y)` e estado de inventário. |
| `user_xp_transactions` | **Dado Pessoal Pseudonimizado (Ledger)** | Histórico analítico e contábil de créditos/débitos de XP vinculado apenas ao `user_id` (`UUID`), sem PII nos campos `source` ou `description`. |

---

## 3. Estrutura de Tabelas

1. **`user_xp_accounts`**: `user_id` (PK/FK `users(id) ON DELETE CASCADE`), `lifetime_xp` (`BIGINT >= 0`), `current_xp` (`BIGINT >= 0`), `current_streak_days` (`INT >= 0`), `last_study_date` (`DATE`), `updated_at`.
2. **`user_clinics`**: `id` (PK UUID), `user_id` (UNIQUE FK `users(id) ON DELETE CASCADE`), `clinic_name`, `expansion_level` (`1..6`), `grid_width`, `grid_height`, `theme`, `created_at`, `updated_at`.
3. **`clinic_items_catalog`**: `id` (PK VARCHAR(50)), `name`, `category` (`pediatria`, `mobiliario`, `clinica`, `recepcao`), `cost_xp`, `min_expansion_level`, `footprint_x`, `footprint_y`, `is_interactable`, `sound_fx_url`, `asset_svg_key`.
4. **`clinic_placed_items`**: `id` (PK UUID), `clinic_id` (FK `user_clinics(id) ON DELETE CASCADE`), `catalog_item_id` (FK `clinic_items_catalog(id)`), `grid_x`, `grid_y`, `rotation` (`0` ou `1`), `is_placed` (`BOOLEAN`), `placed_at`.
5. **`user_xp_transactions`**: `id` (PK UUID), `user_id` (FK `users(id) ON DELETE CASCADE`), `amount` (`INT <> 0`), `balance_after` (`BIGINT >= 0`), `source`, `description`, `created_at`.
