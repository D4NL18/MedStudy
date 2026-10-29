# Parecer de Privacidade, Governança de Dados & RIPD/DPIA: Minha Clínica Médica

> **Localização Mandatória:** `.agents/docs/privacy/minha-clinica-medica.md`  
> **Responsável:** Encarregado de Proteção de Dados / DPO (`privacy_officer.md` / `lgpd-privacy-expert`)  
> **Escopo da Análise:** Sistema de Lootboxes Médicas em 3 Tiers, Sistema de Raridades (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`), Catálogo de 50 Itens Exclusivos e Mecanismo de Cashback de Duplicatas (`US-11`, `US-12`, `US-13` | `P-093`, `P-094`, `P-095`).  
> **Legislação Aplicável:** Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), Marco Legal dos Games (Lei nº 14.852/2024), Código de Defesa do Consumidor (Lei nº 8.078/1990) e Marco Civil da Internet (Lei nº 12.965/2014).

---

## 1. Contexto e Descrição do Tratamento

O subsistema **Minha Clínica Médica** é um componente de gamificação acolhedora (*Cozy Medical Tycoon*) integrado à plataforma educacional MedStudy. Seu objetivo é engajar estudantes de medicina e médicos residentes na preparação contínua para provas de residência médica através da conversão do esforço diário de estudo em progresso tangível de um consultório virtual em perspectiva isométrica 2.5D.

### A nova iteração introduz:
1. **Níveis de Raridade (`P-093`):** Classificação de todos os itens em `COMMON`, `RARE`, `EPIC` e `LEGENDARY`.
2. **Catálogo Exclusivo de 50 Itens (`P-093`):** Itens de prestígio com aquisição restrita a sorteio em caixas virtuais (`is_lootbox_exclusive = true`).
3. **Lootboxes em 3 Tiers (`P-094`):** Caixas virtuais temáticas médicas adquiríveis com `current_xp` (Caixa do Residente, Caixa do Especialista, Caixa do Chefe de Ala), com probabilidades fixas e públicas de drop.
4. **Política de Cashback de Duplicatas e Auditoria (`P-095`):** Compensação imediata em XP no caso de drops repetidos e persistência de auditoria contábil na tabela `lootbox_opening_logs`.

---

## 2. Análise Ético-Regulatória: Descaracterização de Jogos de Azar (*Gambling*)

| Critério de Risco Regulatória | Análise no MedStudy | Conclusão e Mitigação de Risco |
| :--- | :--- | :--- |
| **Origem Financeira da Moeda** | O XP **NÃO é comprável** com dinheiro fiduciário (BRL/USD/Cartão/PIX). Ele é obtido 100% via estudo ativo (questões, flashcards, videoaulas). | **Risco Zero:** Sem transação financeira direta. |
| **Monetização / Pay-to-Win** | Não confere vantagem competitiva em simulados, provas ou rankings acadêmicos; possui natureza meramente cosmética. | **Risco Zero:** Preservação estrita da integridade acadêmica. |
| **Resgatabilidade Financeira** | Itens e XP não podem ser convertidos em dinheiro, criptoativos nem transferidos para terceiros (liquidez zero). | **Descaracterização Total de Jogo de Azar:** Inaplicabilidade do Art. 50 do Decreto-Lei 3.688/41 e Lei 14.790/23. |
| **Proteção ao Estudante** | A política de cashback mitiga sensação de perda e frustração, respeitando a saúde mental do estudante em rotina exaustiva de preparação. | **Conformidade Ética Total.** |

---

## 3. Matriz de Classificação de Dados & Enquadramento LGPD (Art. 7º e 11)

| Dado / Atributo | Classificação Jurídica | Base Legal (Art. 7º LGPD) | Princípio da Minimização & Finalidade |
| :--- | :--- | :--- | :--- |
| `lootbox_opening_logs.id` | Metadado Técnico | Execução de Contrato (Art. 7º, V) | Identificador UUID único da transação para integridade do ledger. |
| `lootbox_opening_logs.user_id` | Dado Pessoal Pseudonimizado | Execução de Contrato (Art. 7º, V) | Rastreabilidade da conta do titular para entrega de itens e suporte a contestações. |
| `box_tier` | Metadado de Gamificação | Execução de Contrato (Art. 7º, V) | Registro do tier da caixa aberta. |
| `cost_xp` | Metadado Contábil de XP | Execução de Contrato (Art. 7º, V) | Débito auditável em `user_xp_accounts.current_xp`. |
| `item_id_dropped` | Dado Virtual do Catálogo | Execução de Contrato (Art. 7º, V) | Vinculação do item ao inventário do usuário. |
| `item_rarity` | Metadado de Gamificação | Execução de Contrato (Art. 7º, V) | Auditoria de respeito estatístico às probabilidades do Tier. |
| `is_duplicate` / `cashback_xp_awarded` | Metadado Contábil de XP | Execução de Contrato (Art. 7º, V) | Registro da compensação econômica anti-frustração. |
| `opened_at` | Timestamp de Auditoria | Execução de Contrato (Art. 7º, V) | Registro cronológico UTC para auditoria e prevenção contra replay attack. |

> [!NOTE]
> **Ausência Total de Dados Sensíveis (Art. 11):** Nenhuma informação de saúde física, mental, prontuário médico, orientação sexual, crença ou dado biométrico é processada neste subsistema. O tema "médico" é puramente ficcional e lúdico.

---

## 4. Aplicação dos 7 Princípios de Privacy by Design (Cavoukian)

1. **Proativo, não Reativo (Preventivo):** O sorteio probabilístico é processado exclusivamente no backend via `SecureRandom` com bloqueio pessimista transacional (`@Transactional`), prevenindo explorações maliciosas de saldo e inconsistências patrimoniais virtuais.
2. **Privacidade como Padrão (Privacy by Default):** Não há exposição pública do histórico de aberturas de lootboxes do estudante para outros usuários. Cada diorama de clínica reflete apenas itens expostos e decididos pelo estudante.
3. **Privacidade Incorporada ao Design:** A tabela `lootbox_opening_logs` contém apenas os 9 campos estritamente necessários, sem retenção de headers HTTP arbitrários, cookies ou tokens.
4. **Funcionalidade Total (Soma-Positiva):** O rigor na conformidade de dados e auditoria garante ao estudante uma experiência sem travamentos ou perdas acidentais de XP/itens, unindo segurança e prazer lúdico.
5. **Segurança de Ponta a Ponta:** Toda comunicação com a API trafega sob TLS 1.3. O `userId` é resolvido de forma inviolável via `SecurityContextHolder` (JWT seguro), mitigando ataques de personificação (IDOR).
6. **Visibilidade e Transparência:** Cumprimento rigoroso do Art. 6º, VI da LGPD através da exibição explícita na UI de todas as probabilidades de drop por raridade antes de qualquer gasto de XP.
7. **Respeito pelo Usuário (User-Centric):** Política de cashback garante que nenhum XP investido seja destruído sem contrapartida justa em caso de itens repetidos.

---

## 5. Ciclo de Vida e Retenção dos Dados (Art. 15 e 16 da LGPD)

1. **Tempo de Retenção Ativa:** Os registros de `lootbox_opening_logs` permanecem vinculados à conta durante o período de atividade contratual do estudante para garantir histórico de compras e suporte técnico.
2. **Eliminação / Anonimização (Art. 16):**
   - Em caso de solicitação de exclusão definitiva de conta pelo estudante (Art. 18, VI da LGPD), os registros em `lootbox_opening_logs` devem ser **anonimizados irreversivelmente** mediante substituição do `user_id` por `00000000-0000-0000-0000-000000000000` ou desassociação definitiva, mantendo-se apenas os metadados estatísticos despersonalizados para fins de balanço contábil interno da plataforma.

---

## 6. Diretrizes Obrigatórias para os Desenvolvedores (Quality Gates)

- [x] **Anti-Overfetching nos Contratos:** Payload de retorno `LootboxOpenResponseDto` deve conter somente `itemId`, `name`, `rarity`, `isDuplicate`, `cashbackXpAwarded` e `newCurrentXp`. Proibido retornar e-mail, CPF ou dados cadastrais do estudante.
- [x] **Sanitização de Logs de Aplicação:** Os logs do Spring Boot (`ClinicLootboxController` e `LootboxService`) **NUNCA** devem imprimir o objeto de usuário completo. Utilizar apenas logs parametrizados estruturados (ex: `log.info("Lootbox opened successfully: tier={}, itemDropped={}, cashbackAwarded={}", tier, itemId, cashback)`).
- [x] **Isolamento de Tenant / Anti-IDOR:** Proibido receber `userId` no corpo da requisição ou parâmetro de rota. O `userId` deve ser extraído unicamente da autenticação segura JWT.
- [x] **Transparência na UI (Designer & Frontend Dev):** O modal de Caixas da Sorte na loja da clínica deve exibir claramente o percentual oficial de chances de drop de cada raridade por Tier.
