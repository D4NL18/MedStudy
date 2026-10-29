# Parecer Técnico de Privacy by Design & Conformidade LGPD: Minha Clínica Médica (`P-080` a `P-086`)

> **Localização Canônica:** `.agents/docs/privacy/PARECER_LGPD_MINHA_CLINICA.md`  
> **Autoridade / Responsável:** Encarregado de Proteção de Dados / DPO (`privacy_officer` · `lgpd-privacy-expert`)  
> **Etapa da Esteira:** Etapa 2 — Revisão de Privacy by Design & Bases Legais  
> **Regras Auditadas:** `P-080`, `P-081`, `P-082`, `P-083`, `P-084`, `P-085`, `P-086` ([minha-clinica-medica.md](file:///c:/GitHub/MedStudy/.agents/docs/business_rules/minha-clinica-medica.md))  
> **Status do Parecer:** ✅ **APROVADO COM DIRETRIZES MANDATÓRIAS DE IMPLEMENTAÇÃO**

---

## 1. Classificação Jurídico-Técnica de Dados e Ausência de Dados Sensíveis (Art. 5º, I e II da LGPD)

### 1.1. Escopo Lúdico-Educacional e Inexistência de PHI / Prontuários Reais
A funcionalidade **"Minha Clínica Médica"** consiste exclusivamente em um motor de gamificação educacional e simulação visual isométrica 2.5D voltado a estudantes de medicina da plataforma MedStudy. 
- **Declaração de Ausência de Dados Pessoais Sensíveis (Art. 5º, II e Art. 11 da LGPD):** Confirma-se formalmente que o módulo **NÃO coleta, armazena, processa ou compartilha dados clínicos reais de pacientes** (*Protected Health Information* — PHI), prontuários médicos, exames, CIDs vinculados a pessoas naturais, dados genéticos ou biométricos. Elementos visuais do catálogo (`P-083`), como *"Estação de Trabalho com Monitor Ultrawide com prontuário médico"*, *"Monitor Cardíaco com Traçado Vivo"* ou *"Aparelho de Ultrassom 4D"*, são meras representações artísticas estáticas/animadas em SVG (`asset_svg_key`), desprovidas de qualquer input de dados de terceiros.
- **Dispensa de RIPD de Dados Sensíveis:** Por não haver tratamento de dados pessoais sensíveis (Art. 5º, II) nem decisões automatizadas com algoritmos de IA que afetem direitos fundamentais (Art. 20), o tratamento enquadra-se em baixo risco regulatório, servindo este Parecer Técnico como documentação comprobatória de *Privacy by Design* e *Legitimate Interest Assessment (LIA)*.

### 1.2. Matriz de Classificação de Dados por Tabela / Entidade

| Tabela / Entidade | Atributos Principais | Classificação LGPD (Art. 5º) | Natureza e Finalidade |
| :--- | :--- | :--- | :--- |
| `clinic_items_catalog` | `id`, `name`, `category`, `cost_xp`, `footprint_x`, `footprint_y`, `min_expansion_level`, `is_interactable`, `asset_svg_key` | **Dado Não Pessoal** (Público / Catálogo) | Metadados estáticos dos 27 itens virtuais da loja (`P-083`). Fora do escopo da LGPD. |
| `user_xp_accounts` | `user_id` (FK), `lifetime_xp`, `current_xp`, `current_streak_days`, `last_study_date`, `updated_at` | **Dado Pessoal Indireto** (Vinculado ao `user_id`) | Métricas de progresso acadêmico gamificado e ofensiva diária de estudo (`P-080`, `P-081`). |
| `user_clinics` | `id`, `user_id` (FK), `clinic_name`, `expansion_level`, `grid_width`, `grid_height`, `created_at`, `updated_at` | **Dado Pessoal Indireto** (Vinculado ao `user_id`) | Estado espacial da clínica virtual do estudante (`P-082`, `P-084`). **Diretriz:** `clinic_name` não deve exigir dados reais de terceiros. |
| `clinic_placed_items` | `id`, `clinic_id` (FK), `catalog_item_id` (FK), `grid_x`, `grid_y`, `rotation`, `is_placed`, `placed_at` | **Dado Pessoal Indireto** (Vinculado à clínica do titular) | Inventário e coordenadas cartesianas `(x, y)` de decoração no grid 2.5D (`P-084`). |
| `user_xp_transactions` | `id`, `user_id` (FK), `amount`, `balance_after`, `source`, `description`, `created_at` | **Dado Pessoal Indireto** (Trilha de Auditoria) | Ledger imutável de créditos e débitos de XP para integridade transacional e antifraude (`P-080`). |

---

## 2. Enquadramento nas 10 Bases Legais da LGPD (Art. 7º, V e IX)

Nenhum dado vinculado ao titular (`Student`) é tratado sem amparo em base legal específica:

| Fluxo de Tratamento | Regras | Base Legal Principal (Art. 7º LGPD) | Fundamentação Jurídica |
| :--- | :---: | :--- | :--- |
| **Gestão de Saldos de XP (`lifetime_xp`, `current_xp`) e Streak Diário** | `P-080`, `P-081` | **Art. 7º, V — Execução de Contrato** | O cômputo de recompensas por questões, flashcards, videoaulas e simulados é parte intrínseca da prestação do serviço educacional contratado pelo estudante nos Termos de Uso da plataforma MedStudy. |
| **Progressão da Clínica (`user_clinics`) e Inventário/Layout (`clinic_placed_items`)** | `P-082`, `P-083`, `P-084` | **Art. 7º, V — Execução de Contrato** | A manutenção do nível de expansão física (`1` a `6`), compra de itens virtuais com `current_xp` e persistência do layout isométrico materializam a funcionalidade contratada pelo usuário. |
| **Ledger Imutável de Transações de XP (`user_xp_transactions`)** | `P-080`, `P-081` | **Art. 7º, IX — Legítimo Interesse do Controlador** (c/c Prevenção à Fraude) | Garantia de auditabilidade contábil dos pontos, prevenção contra manipulação/automação indevida de requisições de estudo (*XP farming* / *replay attacks*) e reconciliação de saldo. |

---

## 3. Minimização de Dados, Anti-Overfetching e Prevenção a BOLA/IDOR nos Contratos REST

1. **Proibição de Vazamento de PII em DTOs (Anti-Overfetching):**
   - Os DTOs de resposta dos endpoints `/api/v1/clinic`, `/api/v1/clinic/expand`, `/api/v1/clinic/items/buy`, `/api/v1/clinic/layout` e `/api/v1/study/action-reward` **JAMAIS** devem serializar a entidade `User` completa do JPA.
   - Nenhum payload JSON de resposta deve expor `password`, `email`, `cpf`, `phone`, `roles` internas ou tokens de sessão.
2. **Isolamento Multi-Tenant de Titulares (Prevenção a BOLA / IDOR):**
   - O identificador do titular (`user_id`) **DEVE** ser extraído exclusivamente no Backend a partir do contexto autenticado do Spring Security (`SecurityContextHolder` / `@AuthenticationPrincipal`).

---

## 4. Privacy by Default na UI, Logs Seguros e Ciclo de Vida dos Dados (Direito à Eliminação)

- **Controle de Áudio Cozy (`P-086`):** Preferência local de silenciamento (`medstudy_clinic_audio_muted: true/false`), sem armazenar tokens ou PII no `localStorage`.
- **Hibernação Automática (`P-085`):** Uso da *Page Visibility API* (`document.hidden === true`) para suspender 100% do loop `requestAnimationFrame`.
- **Eliminação em Cascata (`ON DELETE CASCADE`):** Todas as chaves estrangeiras que referenciam `users(id)` e `user_clinics(id)` possuem `ON DELETE CASCADE`, garantindo o Direito à Eliminação (Art. 18, VI da LGPD).
