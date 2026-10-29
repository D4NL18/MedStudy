# ADR-010: Motor Probabilístico Server-Side Seguro de Lootboxes, Tiers de Raridade e Integridade ACID com Lock Pessimista

> **Status:** Aceito  
> **Data:** 2026-10-28  
> **Autor:** Arquiteto (`architect.md`)  
> **Localização Mandatória:** `.agents/docs/adr/ADR-010-lootbox-system-and-rarity-tiers.md`  
> **Regras Rastreáveis:** `P-080`, `P-093`, `P-094`, `P-095`, `US-11`, `US-12`, `US-13`  
> **Referências de Segurança:** `.agents/rules/security-anti-patterns.md`, `.agents/rules/backend-api-contract-rules.md`

---

## 1. Contexto do Problema

A expansão de **Minha Clínica Médica** para além dos 104 itens catalogados introduz elementos avançados de engajamento lúdico através de **Caixas da Sorte Médicas (Lootboxes)** e **Níveis de Raridade** (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`), além de um acervo especial de **50 Itens Exclusivos** não compráveis diretamente com XP.

O desenho desta solução impõe quatro desafios críticos de arquitetura e integridade de dados:
1. **Prevenção de Fraudes e Manipulação de Sorteios:** Em sistemas de jogos educativos ou gamificação, a determinação de resultados no cliente (frontend) ou através de PRNGs previsíveis (`java.util.Random`) expõe a aplicação a engenharia reversa, manipulação de payloads e exploração de sementes (seed prediction).
2. **Prevenção contra Condição de Corrida (Double-Spending):** Estudantes com saldo suficiente para apenas 1 caixa poderiam tentar disparar múltiplos cliques ou requisições paralelas simultâneas (`POST /api/v1/clinic/lootboxes/{tier}/open`). Sem bloqueio atômico serializado, o saldo `current_xp` poderia ser debitado de forma inconsistente ou atingir valor negativo, violando a regra `P-080`.
3. **Economia de XP e Mitigação de Frustração (Duplicatas):** Ao sortear itens em um catálogo com dezenas de opções, a obtenção de itens repetidos geraria frustração e desengajamento se o item fosse acumulado sem utilidade no inventário. O sistema necessita de uma política automática e matematicamente calibrada de **Cashback de XP**.
4. **Governança de Exclusividade e Isolamento de Compra:** Os 50 novos itens de alta patente possuem a propriedade `is_lootbox_exclusive = true`. O fluxo legado de aquisição de itens (`POST /api/v1/clinic/items/{itemId}/buy`) precisa barrar imediatamente a compra direta dessas peças com status `403 Forbidden`.

---

## 2. Decisão Arquitetural

### 2.1. Motor Probabilístico Server-Side com `java.security.SecureRandom`
Decidimos que **100% da lógica probabilística e seleção do item sorteado ocorre de forma fechada no Backend (Spring Boot)**, sem qualquer interferência ou pré-cálculo no Frontend:
- O sorteio emprega uma instância compartilhada e thread-safe de `java.security.SecureRandom`, garantindo entropia criptográfica nativa do sistema operacional (CSPRNG).
- O algoritmo processa a seleção em 3 etapas determinísticas e auditáveis:
  1. **Amostragem de Raridade (CDF — Cumulative Distribution Function):** É sorteado um valor float $R \in [0.00, 100.00)$. As faixas de probabilidade são definidas por Tier:
     - **Caixa do Residente (`TIER_1_RESIDENT` — 500 XP):** `COMMON` [0%, 60%), `RARE` [60%, 90%), `EPIC` [90%, 99%), `LEGENDARY` [99%, 100%].
     - **Caixa do Especialista (`TIER_2_SPECIALIST` — 1.500 XP):** `COMMON` 0%, `RARE` [0%, 65%), `EPIC` [65%, 93%), `LEGENDARY` [93%, 100%].
     - **Caixa do Chefe de Ala (`TIER_3_CHIEF_OF_STAFF` — 4.000 XP):** `COMMON` 0%, `RARE` 0%, `EPIC` [0%, 75%), `LEGENDARY` [75%, 100%].
  2. **Filtragem de Pool Ativo:** O serviço consulta no repositório os itens elegíveis para o Tier com a raridade sorteada (`clinic_items_catalog.rarity = :rarity`).
  3. **Seleção Uniforme de Item:** Sorteia uniformemente com probabilidade $1/N$ um item dentro do pool filtrado.

### 2.2. Transação ACID com Lock Pessimista (`PESSIMISTIC_WRITE`)
Para eliminar qualquer possibilidade de corrida em requisições paralelas:
- A operação de abertura executa sob anotação `@Transactional(isolation = Isolation.READ_COMMITTED)`.
- O saldo de XP do usuário é recuperado via repositório JPA utilizando `@Lock(LockModeType.PESSIMISTIC_WRITE)`:
  ```java
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT a FROM UserXpAccount a WHERE a.userId = :userId")
  Optional<UserXpAccount> findByUserIdForUpdate(@Param("userId") UUID userId);
  ```
- O banco PostgreSQL emite um `SELECT ... FOR UPDATE` sobre a linha do usuário na tabela `user_xp_accounts`.
- Se uma segunda requisição concorrente tentar abrir uma caixa para o mesmo usuário simultaneamente, o banco segura o lock até a primeira transação comitar. Ao ser liberada, a segunda requisição relê o saldo atualizado já debitado; se o saldo for menor que o custo do tier, rejeita imediatamente com HTTP `422 Unprocessable Entity` ("Saldo de XP insuficiente").

### 2.3. Mecanismo de Prevenção de Duplicatas e Política de Cashback
- Após a escolha do item, o sistema realiza uma verificação de posse consultando `clinic_placed_items` e itens já desbloqueados pelo usuário para o `userId`:
  - Se `is_duplicate == false`: o item é atribuído ao inventário do usuário e `cashback_xp_awarded = 0`.
  - Se `is_duplicate == true`: o item NÃO é adicionado novamente de forma redundante. É acionado o cálculo de ressarcimento em XP (`cashback_xp`) conforme a raridade do item repetido:
    - `COMMON`: **150 XP**
    - `RARE`: **500 XP**
    - `EPIC`: **1.500 XP**
    - `LEGENDARY`: **3.000 XP**
  - O valor de cashback é creditado de volta no `current_xp` do usuário no mesmo ciclo transacional.

### 2.4. Trilha Dupla de Auditoria Imutável (Ledger Contábil)
Cada abertura de Lootbox gera obrigatoriamente:
1. Registros contábeis no ledger imutável `user_xp_transactions`:
   - Débito inicial da caixa: `source = 'LOOTBOX_OPEN'`, `amount = -tierCostXp`.
   - Se houver duplicata, crédito imediato: `source = 'LOOTBOX_DUPLICATE_CASHBACK'`, `amount = +cashbackXp`.
2. Registro detalhado na tabela de auditoria de drops `lootbox_opening_logs`:
   - `(id, user_id, box_tier, cost_xp, item_id_dropped, item_rarity, is_duplicate, cashback_xp_awarded, opened_at)`.

### 2.5. Bloqueio de Aquisição Direta de Itens Exclusivos
- No serviço de catálogo de itens (`ClinicItemService`), o método de compra direta (`buyItem`) valida a flag:
  ```java
  if (catalogItem.isLootboxExclusive()) {
      throw new BusinessRuleViolationException(
          "P-093",
          "Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."
      );
  }
  ```
- Esta violação é capturada pelo `RestExceptionHandler` e devolvida como HTTP `403 Forbidden`.

---

## 3. Alternativas Consideradas

1. **Opção A — Sorteio no Frontend e Envio do Item Sorteado ao Backend:**
   - *Descarte:* Altamente vulnerável. Usuários maliciosos poderiam interceptar o tráfego HTTP e enviar requisições forjando sempre itens Lendários.
2. **Opção B — Controle de Concorrência Otimista com `@Version`:**
   - *Descarte:* Se um estudante clicasse duas vezes no botão de abertura, a segunda transação falharia com `OptimisticLockException` retornando um erro 500 genérico ou forçando lógica complexa de retry, degradando a experiência acolhedora (*cozy*) do usuário. O Lock Pessimista enfileira de forma elegante e transparente.
3. **Opção C — Acúmulo de Duplicatas no Inventário sem Cashback:**
   - *Descarte:* Cria inflação de itens inúteis no banco de dados e no inventário do estudante, desestimulando a continuidade dos estudos para abertura de caixas.

---

## 4. Consequências e Trade-offs

- **Pontos Positivos:**
  - **Segurança Criptográfica:** Impossibilidade de predição de sementes e total inviolabilidade dos percentuais de drop.
  - **Integridade Contábil Absoluta:** Zero risco de saldo negativo (`current_xp >= 0`) ou double-spending sob alta concorrência.
  - **Satisfação do Usuário:** Mecanismo de cashback de duplicatas preserva o valor do esforço cognitivo do estudante.
  - **Auditabilidade e Compliance:** Registro completo em ledgers independentes para rastreabilidade de suporte e transparência perante o Art. 7º, V da LGPD.
- **Trade-offs / Mitigações:**
  - O lock pessimista (`SELECT FOR UPDATE`) retém a linha do usuário em `user_xp_accounts` durante a transação (em média 8 a 15ms). Como o lock é restrito à tupla do estudante específico (`user_id`), o throughput global do sistema não é impactado.
