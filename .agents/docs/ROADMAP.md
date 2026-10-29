# Roadmap do Projeto — MedStudy 🗺️🏥

> **Localização Mandatória:** `.agents/docs/ROADMAP.md`  
> **Responsável:** Product Owner (`product_owner.md`) / `agile-coach` & `pm-skills`  
> **Abordagem de Gestão:** Híbrida Ágil-Preditiva (PMBOK 7 + Scrum/Kanban + Fatiamento Vertical INVEST)

---

## 1. Visão do Produto (Product Vision & North Star)

- **Declaração de Proposta de Valor:** Para estudantes de medicina e médicos residentes que enfrentam alta carga cognitiva e exaustão na preparação para provas de residência e revalidação, o **MedStudy** é uma plataforma inteligente de estudo médico ativo que combina repetição espaçada (FSRS/SM-2), banco de questões, simulados, videoaulas e gamificação acolhedora (*Cozy Medical Tycoon*). Diferente de plataformas tradicionais puramente textuais e estressantes, o MedStudy converte o esforço diário de estudo em progresso visual tangível através da construção e evolução da **Minha Clínica Médica** em perspectiva isométrica 2.5D com personalização de ambientes e identidade médica representativa.
- **North Star Metric (NSM):** Sessões de Estudo Ativo Concluídas com Retenção Semanal (Estudantes com Streak >= 5 dias investindo XP na evolução e personalização da clínica).

---

## 2. Épicos e User Stories (Backlog)

### 🏥 Épico 3: Minha Clínica Médica (Gamificação Isométrica 2.5D, Economia de XP & Personalização)

#### Entregas Concluídas (Fundação da Clínica):
- [x] **US-01 [PARALLEL]: Motor de Ganho, Cálculo de XP e Multiplicador de Streak (Backend Core & DB)** (`P-080`, `P-081`)
- [x] **US-02 [PARALLEL]: Sistema de Expansão Física da Clínica em 6 Níveis (Backend & DB)** (`P-082`)
- [x] **US-03 [PARALLEL]: Catálogo de 27 Itens, Compra Atômica e Persistência Batch de Layout (Backend & DB)** (`P-083`, `P-084`)
- [x] **US-04 [PARALLEL]: Viewport Isométrico 2.5D Ultra-Leve e Animações Cozy (Frontend)** (`P-085`)
- [x] **US-05 [PARALLEL]: Modo Edição/Decoração, Loja por Abas, Ghost de Colisão, Toast de XP e Áudio Cozy (Frontend)** (`P-086`)

---

#### Entregas Concluídas (Superfícies & Avatar):
- [x] **US-06 [PARALLEL]: Sistema de Customização de Revestimentos (Piso & Parede) e Itens de Parede (Wall-Mounted)** (`[P-087]`, `[P-088]`)
- [x] **US-07 [PARALLEL]: Personagem Médico Virtual Residente 2.5D com Guarda-Roupa Modular e Balão de Dicas** (`[P-089]`)

---

#### Entregas Concluídas (Refinamento Isométrico & Megacatálogo de 104 Itens):
- [x] **US-08 [PARALLEL]: Correção do Picking e Click no Grid Isométrico 2.5D (Anti-Overlap)** (`[P-090]`)
- [x] **US-09 [PARALLEL]: Remoção da Faixa Informativa de Simulação de XP do Topo** (`[P-091]`)
- [x] **US-10 [PARALLEL]: Catálogo Expandido de 104 Itens Médicos da Clínica** (`[P-092]`)

---

#### 🎁 Nova Iteração: Sistema de Lootboxes Médicas, Níveis de Raridade & 50 Itens Exclusivos:

- [ ] **US-11 [PARALLEL]: Motor de Lootboxes Médicas, Tiers de Caixas, Raridades e Abertura Transacional (Backend & DB)** (`[P-093]`)
- [ ] **US-12 [PARALLEL]: Catálogo de 50 Itens Médicos Exclusivos de Lootbox, Classificação de Raridade e Preservação da Loja Direta (Fullstack)** (`[P-094]`)
- [ ] **US-13 [PARALLEL]: Experiência Frontend de Lootboxes Médicas, Revelação Cozy com Micro-Animações e Feedback de Raridade (Frontend)** (`[P-095]`)

---

### 📦 US-11 [PARALLEL]: Motor de Lootboxes Médicas, Tiers de Caixas, Raridades e Abertura Transacional
- **Classificação:** Categoria A (Engenharia Fullstack: DB Schema + Backend Core + Ledger de XP)
- **Rastreabilidade de Negócio:** `[P-093]`
- **Framework de Priorização:**
  - **RICE Score:** **950** (Reach: 1.000 estudantes ativos × Impact: 3.0 [Alto impacto no engajamento e sink de XP] × Confidence: 95% / Effort: 3.0)
  - **MoSCoW:** MUST HAVE (Fundação de backend para compra, sorteio ponderado por RNG seguro e abertura atômica de caixas sem risco de exploit).
- **Validação INVEST:**
  - **I (Independente):** Consegue ser testada e homologada via endpoints REST antes ou em paralelo à UI final.
  - **N (Negociável):** Custos em XP de cada caixa e tabela de probabilidades são configuráveis.
  - **V (Valiosa):** Garante integridade financeira no débito de `current_xp` e transparência total nas chances de drop.
  - **E (Estimável):** 5 Story Points.
  - **S (Pequena):** Focada nas regras de sorteio, tiers e transação no banco.
  - **T (Testável):** BDD com validação estatística de RNG, auditoria no ledger e testes com saldo insuficiente.

#### Especificação dos Tiers e Probabilidades:
1. **Caixa do Residente (Iniciante - Tier 1):** Custo de `500 XP`.
   - Pool de Itens: COMMON (75%), RARE (20%), EPIC (5%), LEGENDARY (0%).
2. **Caixa do Especialista (Intermediária - Tier 2):** Custo de `1.500 XP`.
   - Pool de Itens: COMMON (30%), RARE (50%), EPIC (17%), LEGENDARY (3%).
3. **Caixa do Chefe de Ala (Elite/Prestígio - Tier 3):** Custo de `4.000 XP`.
   - Pool de Itens: COMMON (0%), RARE (25%), EPIC (55%), LEGENDARY (20%).

#### Regra Anti-Frustração de Duplicatas (Cashback em XP):
Caso o item sorteado já conste nos itens do estudante, o sistema converte a duplicata em cashback automático de XP no ledger:
- Item Duplicado COMMON: `+150 XP`
- Item Duplicado RARE: `+500 XP`
- Item Duplicado EPIC: `+1.500 XP`
- Item Duplicado LEGENDARY: `+3.000 XP`

#### Critérios de Aceite BDD (US-11):
```gherkin
Cenário 1: Consulta de Tiers de Caixas e Tabela Pública de Probabilidades
  Dado que o estudante autenticado consulta as lootboxes disponíveis via `GET /api/v1/clinic/lootboxes`
  Quando a resposta com status HTTP 200 for retornada
  Então o sistema deve listar os 3 tiers oficiais: "Caixa do Residente" (500 XP), "Caixa do Especialista" (1.500 XP) e "Caixa do Chefe de Ala" (4.000 XP)
  E cada tier deve explicitar suas probabilidades exatas de drop para as raridades COMMON, RARE, EPIC e LEGENDARY
  E a Caixa do Chefe de Ala deve ter probabilidade de drop de itens COMMON igual a 0%.

Cenário 2: Abertura Bem-Sucedida de Caixa com Débito ACID em `current_xp`
  Dado que o estudante possui `current_xp = 2.000` e `lifetime_xp = 12.000`
  Quando ele solicita a abertura da "Caixa do Especialista" (1.500 XP) via `POST /api/v1/clinic/lootboxes/caixa_especialista/open`
  Então o sistema deve processar a transação de forma atômica
  E o saldo de `current_xp` deve ser atualizado para 500
  E o `lifetime_xp` deve permanecer inalterado em 12.000
  E um registro imutável deve ser gerado em `user_xp_transactions` com `amount = -1500`, `source = 'LOOTBOX_OPEN'` e `balance_after = 500`
  E a resposta da API deve retornar o item com identificador, nome, categoria, raridade e `is_lootbox_exclusive`.

Cenário 3: Tentativa de Abertura com Saldo Insuficiente de `current_xp`
  Dado que o estudante possui `current_xp = 350`
  Quando ele tenta abrir a "Caixa do Residente" (500 XP) via `POST /api/v1/clinic/lootboxes/caixa_residente/open`
  Então o sistema deve rejeitar a transação com HTTP 422 Unprocessable Entity
  E retornar a mensagem de erro: "Saldo de XP insuficiente para abrir esta caixa."
  E nenhum débito de XP deve ser persistido em `user_xp_accounts`
  E nenhum registro de transação deve ser criado em `user_xp_transactions`.

Cenário 4: Tratamento de Item Duplicado com Reembolso de Compensação
  Dado que o estudante sorteia um item de raridade `EPIC` que ele já possui em sua clínica
  Quando a abertura da caixa for finalizada
  Então o sistema deve registrar a duplicata sem corromper o inventário
  E creditar automaticamente `+1.500 XP` em `current_xp` sob a fonte `'LOOTBOX_DUPLICATE_CASHBACK'`
  E a resposta da API deve retornar o payload contendo `isDuplicate = true`, `cashbackXp = 1500` e o item correspondente.
```

---

### 🎨 US-12 [PARALLEL]: Catálogo de 50 Itens Médicos Exclusivos de Lootbox, Raridades e Preservação da Loja Direta
- **Classificação:** Categoria A (Engenharia Fullstack: DB Migration Flyway + Modelos de Catálogo + Renderers SVG Modulares)
- **Rastreabilidade de Negócio:** `[P-094]`
- **Framework de Priorização:**
  - **RICE Score:** **643** (Reach: 1.000 × Impact: 2.5 [Variedade de itens e colecionismo médico] × Confidence: 90% / Effort: 3.5)
  - **MoSCoW:** MUST HAVE (Expansão do catálogo com 50 itens que só existem nas lootboxes, sem alterar o funcionamento dos 104 itens atuais).
- **Validação INVEST:**
  - **I (Independente):** A migration de dados e o catálogo podem ser criados independentemente do motor de animação do front.
  - **N (Negociável):** Nomes, categorias e temas cosméticos dos 50 itens.
  - **V (Valiosa):** Dá prestígio aos itens de caixa, garantindo que certos itens só possam ser ostentados por quem os conquistou nas caixas.
  - **E (Estimável):** 8 Story Points.
  - **S (Pequena):** Lotes estruturados de itens médicos especializados com SVG modular.
  - **T (Testável):** BDD com verificação de contagem no banco (`count = 50`), bloqueio de compra direta na loja e integridade dos 104 itens existentes.

#### Especificação do Catálogo:
- **Atributos estendidos em `clinic_items_catalog`:**
  - `rarity`: `COMMON`, `RARE`, `EPIC`, `LEGENDARY` (default: `COMMON` para itens de entrada, calibrado nos existentes conforme custo).
  - `is_lootbox_exclusive`: `BOOLEAN NOT NULL DEFAULT FALSE`.
- **50 Novos Itens Especiais:**
  - Todos marcados com `is_lootbox_exclusive = true`.
  - Exemplos icônicos de alta raridade:
    - *Lendários (LEGENDARY):* Robô Cirúrgico Da Vinci Isométrico, Tomógrafo 128 Canais, Maca Cápsula Espacial Pediátrica, Esqueleto Anatômico em Ouro 24k, Mesa de Carvalho Centenário da Reitoria.
    - *Épicos (EPIC):* Aparelho de Ressonância Magnética Compacto, Mesa de Cirurgia Cardíaca c/ Foco Duplo, Simulador de Laparoscopia Realista, Aquário Marinho de Parede Iluminado, Cadeira de Massagem Shiatsu para Residentes.
    - *Raros (RARE):* Microscópio Eletrônico de Bancada, Carro de Parada Dourado, Mesa de Desenho Infantil Interativa com Painel Tátil, Poltrona de Amamentação Ortopédica, Vitrine de Troféus Médicos.
    - *Comuns Especiais (COMMON):* Coleção de Compêndios Médicos Raros, Quadro Histórico de Hipócrates, Luminária Articulada Cirúrgica Vintage, Plantas Medicinais Raras em Vaso Cerâmico.
- **Proteção dos 104 Itens Tradicionais:**
  - Permanecem com `is_lootbox_exclusive = false` e continuam sendo comprados normalmente pelo endpoint `POST /api/v1/clinic/items/{itemId}/buy` com `current_xp`.
  - Se um usuário tentar comprar via loja direta um item com `is_lootbox_exclusive = true`, o backend deve lançar HTTP `403 Forbidden` com a mensagem `"Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."`.

#### Critérios de Aceite BDD (US-12):
```gherkin
Cenário 1: Carga dos 50 Novos Itens Médicos com Exclusividade de Lootbox
  Dado que a migration Flyway `V28` é executada no banco de dados
  Quando o catálogo é consultado em `clinic_items_catalog`
  Então devem existir exatamente 50 novos registros com `is_lootbox_exclusive = true`
  E cada novo item deve possuir uma raridade definida entre 'COMMON', 'RARE', 'EPIC' e 'LEGENDARY'
  E os itens devem estar balanceados entre as 4 categorias ('pediatria', 'mobiliario', 'clinica', 'recepcao').

Cenário 2: Preservação da Compra Direta dos 104 Itens Existentes
  Dado que existem 104 itens no catálogo regular com `is_lootbox_exclusive = false`
  Quando o estudante seleciona qualquer um desses itens com saldo de XP suficiente
  E solicita a compra via `POST /api/v1/clinic/items/{itemId}/buy`
  Então a compra deve ser autorizada com HTTP 200 OK
  E o item deve ser transferido para a clínica/inventário do estudante normalmente.

Cenário 3: Bloqueio Rigoroso de Compra Direta de Itens Exclusivos de Caixa
  Dado que o item "robo_cirurgico_davinci" possui `is_lootbox_exclusive = true`
  Quando o estudante tenta forçar a compra direta via `POST /api/v1/clinic/items/robo_cirurgico_davinci/buy`
  Então o backend deve rejeitar a transação com HTTP 403 Forbidden
  E retornar a mensagem de erro: "Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."
  E nenhum débito de `current_xp` deve ser executado.

Cenário 4: Renderização Modular SVG Sem Romper Orçamento de Bundle
  Dado que os 50 novos itens cosméticos são adicionados à biblioteca gráfica do frontend
  Quando o componente `ClinicItemSvgComponent` compila os templates
  Então os novos itens devem herdar arquétipos SVG modulares
  E o tamanho final transferido da rota `/minha-clinica` deve permanecer estritamente inferior a 300 KB gzipped.
```

---

### ✨ US-13 [PARALLEL]: Experiência Frontend de Lootboxes Médicas, Revelação Cozy e Feedback de Raridade
- **Classificação:** Categoria A (Engenharia Frontend: UI/UX Cozy + Micro-Animações SVG/CSS + Web Audio API)
- **Rastreabilidade de Negócio:** `[P-095]`
- **Framework de Priorização:**
  - **RICE Score:** **771** (Reach: 1.000 × Impact: 3.0 [Deleite e recompensa emocional de estudo] × Confidence: 90% / Effort: 3.5)
  - **MoSCoW:** MUST HAVE (Interface aconchegante, respeitando estética *Cozy Tycoon*, sem gatilhos predatórios ou efeitos agressivos).
- **Validação INVEST:**
  - **I (Independente):** O componente modal e o player de unboxing podem ser construídos e testados isoladamente via Signal State e mocks.
  - **N (Negociável):** Duração dos tempos de animação e paleta exata dos feixes de luz.
  - **V (Valiosa):** Transforma o momento de abertura em uma experiência gratificante e serena, recompensando as horas de estudo árduo.
  - **E (Estimável):** 8 Story Points.
  - **S (Pequena):** Fatiada em componente de listagem de caixas, modal de animação e card de celebração de raridade.
  - **T (Testável):** BDD com verificação de estados de animação, classes de raridade, acessibilidade e áudio cozy.

#### Filosofia Visual e Comportamental (Anti-Casino / Cozy Tycoon):
- **Sem elementos de cassino:** Sem roleta girando freneticamente, sem bips de máquina caça-níqueis, sem contadores de pressa.
- **Estética Acolhedora:** Uma maleta médica clássica ou maleta de primeiros socorros em visual isométrico suave. O balanço dura entre 1.2s e 1.8s.
- **Paleta de Feixes de Luz & Feedback de Raridade:**
  - **COMMON (Comum):** Halo branco quente / cinza cirúrgico suave (`#94A3B8`). Chime suave de 1 tom.
  - **RARE (Raro):** Aura azul ciano médico / safira hospitalar (`#38BDF8`). Chime duplo suave em arpeggio.
  - **EPIC (Épico):** Brilho ametista / púrpura real acolhedor (`#A855F7`). Acorde harmonioso em 3 tons.
  - **LEGENDARY (Lendário):** Explosão suave de partículas douradas quentes (`#F59E0B`), feixes solares e acorde maior triunfante, com badge animado "Item Lendário Exclusivo".

#### Critérios de Aceite BDD (US-13):
```gherkin
Cenário 1: Apresentação da Loja de Caixas Médicas no HUD da Clínica
  Dado que o estudante está no painel da Minha Clínica e clica no botão "Caixas de Suprimentos"
  Quando o modal de caixas for aberto
  Então devem ser renderizados os 3 cards: "Caixa do Residente" (500 XP), "Caixa do Especialista" (1.500 XP) e "Caixa do Chefe de Ala" (4.000 XP)
  E cada card deve conter ilustração isométrica da maleta médica, badge de preço em XP e botão informativo "Ver Probabilidades"
  E se o saldo de `current_xp` for menor que o custo da caixa, o botão "Abrir" deve ficar visualmente desabilitado com tooltip indicando XP faltante.

Cenário 2: Fluxo de Abertura Cozy com Animação de Suspense e Travamento de Duplo Clique
  Dado que o estudante possui `current_xp >= 1.500` e clica em "Abrir Caixa" na Caixa do Especialista
  Quando o processo de abertura é iniciado
  Então o modal deve entrar no estado `OPENING_SUSPENSE` por aproximadamente 1.5 segundos
  E a maleta médica deve executar uma animação suave de balanço e destravamento
  E todos os controles de clique devem ficar bloqueados para prevenir chamadas duplicadas
  E o áudio de clique/destravamento suave deve ser sintetizado via Web Audio API.

Cenário 3: Apresentação do Item Sorteado e Aplicação do Tema Visual de Raridade
  Dado que o sorteio é concluído e o backend retorna um item com `rarity = 'LEGENDARY'`
  Quando a maleta se abre
  Então o componente deve projetar o feixe dourado radiante (`#F59E0B`) com partículas suaves
  E renderizar o item sorteado em escala ampliada com o selo "EXCLUSIVO DE CAIXA"
  E exibir os botões "Colocar na Clínica Agora" e "Guardar no Inventário"
  E atualizar de forma reativa o saldo de `current_xp` do estudante no HUD superior da clínica.

Cenário 4: Respeito à Acessibilidade e Redução de Movimento (prefers-reduced-motion)
  Dado que o estudante possui a diretiva `prefers-reduced-motion: reduce` habilitada no navegador
  Quando ele aciona a abertura de qualquer caixa
  Então a animação de balanço da maleta e as partículas dinâmicas devem ser suprimidas
  E a interface deve exibir diretamente a tela de revelação com uma transição estática suave de fade-in.
```

---



---

### ?? US-14 [PARALLEL]: Revis?o Integral, Corre??o de Quebras e Reformula??o Est?tica de Skins de Consult?rio e Avatar
- **Classifica??o:** Categoria A (Engenharia Fullstack: DB Flyway + Backend API Surfaces + Frontend Wardrobe & SVG Renderers)
- **Rastreabilidade de Neg?cio:** `[P-096]`
- **Framework de Prioriza??o:**
  - **RICE Score:** **840** (Reach: 1.000 estudantes ativos ? Impact: 3.5 [Elimina bugs de persist?ncia e desbloqueia todo o acervo cosm?tico] ? Confidence: 95% / Effort: 4.0)
  - **MoSCoW:** MUST HAVE (Sem a corre??o, superf?cies n?o debitam XP nem persistem no banco, e mais de 10 op??es homologadas do avatar permanecem inacess?veis).
- **Valida??o INVEST:**
  - **I (Independente):** Sub-tarefas de Backend/DB (sincroniza??o de superf?cies e compras) e Frontend (modal do avatar e artes vetoriais SVG) podem ser desenvolvidas de forma paralela via mocks de contrato.
  - **N (Negoci?vel):** Custos em XP de cada superf?cie, detalhes de ornamenta??o visual das estampas e paletas exatas dos revestimentos.
  - **V (Valiosa):** Garante persist?ncia ?ntegra de layout da cl?nica e do guarda-roupa m?dico, al?m de uma experi?ncia est?tica premium digna de um *Cozy Medical Tycoon*.
  - **E (Estim?vel):** 8 Story Points (3 Backend/DB + 5 Frontend).
  - **S (Pequena):** Focada na sincroniza??o do cat?logo de skins/revestimentos e enriquecimento das artes SVG do consult?rio e do avatar.
  - **T (Test?vel):** Crit?rios BDD detalhados para persist?ncia no banco, d?bito de XP, exibi??o de todas as skins no modal e renderiza??o dos SVGs sem cruz gen?rica.

#### Sub-Tarefas Fatiadas com Paralelismo (`[PARALLEL]`):
1. **Sub-task 1 [PARALLEL] (DB & Backend): Sincroniza??o do Cat?logo de Superf?cies de Parede e Piso:**
   - Atualiza??o do cat?logo de superf?cies e constantes `OFFICIAL_SURFACES` no backend com os IDs oficiais vigentes no frontend (`wallpaper_geometric_teal`, `wallpaper_brick_white`, `wood_dark_herringbone`, `tatame_eva`, `marble_carrara`, `wood_light`, etc.).
   - Migration Flyway garantindo inser??o dos novos registros na tabela `clinic_items_catalog` com categoria `WALL_SURFACE` e `FLOOR_SURFACE` e custos balanceados em XP.
   - Valida??o dos endpoints `POST /api/v1/clinic/items/buy` e `PUT /api/v1/clinic/surfaces` para debitar XP no ledger e persistir o layout de piso e parede.

2. **Sub-task 2 [PARALLEL] (Frontend - Guarda-Roupa): Integra??o Integral de Skins no Modal do Avatar M?dico:**
   - Expandir `doctor-wardrobe-modal.component` e `minha-clinica.component` para exibir todas as op??es homologadas:
     - Jalecos/Roupas: `coat_default`, `coat_intern_white`, `coat_scrubs_navy`, `coat_scrubs_green`, `coat_pediatric`, `coat_pediatric_dino`, `coat_executive_doc`, `coat_gold`.
     - Estetosc?pios: `steth_standard`, `steth_classic_black`, `steth_elephant`, `steth_cardio_burgundy`, `steth_gold`, `steth_gold_master`, `steth_none`.
     - Acess?rios: `acc_none`, `acc_red_bowtie`, `acc_scrub_cap`, `acc_glasses_classic`, `acc_prontuario_clipboard`, `acc_ped_gorro_colorido`.
   - Mecanismo de pr?-visualiza??o reativa instant?nea (Signal State) antes do salvamento (`PUT /api/v1/clinic/avatar`).

3. **Sub-task 3 [PARALLEL] (Frontend - Arte Vetorial SVG): Reformula??o Est?tica de Skins Espec?ficas do Avatar:**
   - `coat_pediatric_dino`: Estampa m?dica infantil exclusiva e l?dica com silhuetas de dinossauros fofinhos (estilo T-Rex e Triceratops) e pequenas pegadas em tons pastel.
   - `coat_executive_doc`: Jaleco executivo de alta alfaiataria m?dica com corte italiano refinado, lapela chanfrada, len?o de bolso e caimento nobre.
   - `acc_ped_gorro_colorido`: Gorro cir?rgico estampado tem?tico safari/pedi?trico cobrindo a cabe?a do avatar de forma harmoniosa com o ?ngulo 2.5D.

4. **Sub-task 4 [PARALLEL] (Frontend - Arte Vetorial de Itens & Revestimentos): Renderiza??o Especializada no `clinic-item-svg`:**
   - Implementar blocos `@case` em `clinic-item-svg.component.html` para todos os temas de revestimento (piso e parede), apresentando mini-amostras texturizadas ricas de cada acabamento no cat?logo e em caixas, eliminando o fallback de caixa com cruz gen?rica.
   - Refinar detalhes de textura de piso e parede, mantendo a harmonia isom?trica.

#### Crit?rios de Aceite BDD (US-14):
```gherkin
Cen?rio 1: Sincroniza??o do Cat?logo de Superf?cies e Compra Bem-Sucedida com D?bito de XP
  Dado que o estudante autenticado deseja adquirir a superf?cie de parede "wallpaper_geometric_teal" de custo 950 XP
  E seu saldo atual de XP em `user_xp_accounts` ? de 3.000 XP
  Quando ele envia uma requisi??o `POST /api/v1/clinic/items/buy` com `catalogItemId = 'wallpaper_geometric_teal'`
  Ent?o o backend deve responder com status HTTP 200 OK
  E o saldo de `current_xp` deve ser debitado de forma at?mica para 2.050 XP
  E um registro imut?vel deve ser gerado em `user_xp_transactions` com `source = 'ITEM_PURCHASE'`
  E a superf?cie deve ser desbloqueada em `user_unlocked_skins`.

Cen?rio 2: Persist?ncia do Layout da Cl?nica com Novas Superf?cies
  Dado que o estudante possui as superf?cies "wallpaper_brick_white" e "wood_dark_herringbone"
  Quando ele personaliza a cl?nica e envia `PUT /api/v1/clinic/surfaces` com `wallTheme = 'wallpaper_brick_white'` e `floorTheme = 'wood_dark_herringbone'`
  Ent?o a resposta deve retornar HTTP 200 OK com o layout atualizado
  E ao recarregar a cl?nica via `GET /api/v1/clinic/state`, as novas superf?cies devem permanecer persistidas no banco e no estado do frontend.

Cen?rio 3: Exibi??o Completa de Todas as Op??es no Modal de Guarda-Roupa do Avatar
  Dado que o estudante abre o modal `doctor-wardrobe-modal`
  Quando as abas "Jaleco M?dico", "Estetosc?pio" e "Acess?rios" forem navegadas
  Ent?o devem ser listadas todas as op??es homologadas no backend
  E cada item deve apresentar seu estado visual correto (equipado, em teste, bloqueado ou desbloqueado).

Cen?rio 4: Arte e Renderiza??o Exclusiva de `coat_pediatric_dino`, `coat_executive_doc` e `acc_ped_gorro_colorido`
  Dado que o avatar m?dico est? equipado com `coat_pediatric_dino` e `acc_ped_gorro_colorido`
  Quando o componente `doctor-avatar-svg` ? renderizado na cl?nica isom?trica
  Ent?o o jaleco deve exibir silhuetas n?tidas de dinossauros infantis e pequenas pegadas em vetor
  E a cabe?a do m?dico deve exibir o gorro cir?rgico com padronagem tem?tica safari
  E se o jaleco for alterado para `coat_executive_doc`, a arte deve exibir corte alfaiataria executiva com lapela nobre e len?o.

Cen?rio 5: Elimina??o de Fallback Gen?rico em `clinic-item-svg` para Revestimentos de Parede e Piso
  Dado que qualquer superf?cie de parede ou piso catalogada ? renderizada pelo componente `clinic-item-svg`
  Quando o template avalia o `itemKey`
  Ent?o o componente deve entrar no `@case` espec?fico do revestimento correspondente
  E renderizar a amostra isom?trica texturizada fiel do piso ou parede
  E em nenhuma circunst?ncia exibir o fallback gen?rico de caixa com cruz verde.
```

## 3. Matriz de Riscos & Plano de Mitigação (PMBOK 7 / Pre-Mortem)

| Risco Identificado | Severidade / Probabilidade | Estratégia | Ação Proativa do Time |
| :--- | :--- | :--- | :--- |
| **R1: Z-Index / Depth Sorting incorreto entre itens de parede e móveis altos** | Alto / Média | Mitigar | Definir coordenada fixa de parede (`wall_z = 50`) no cálculo de depth para garantir que estantes ou negatoscópios respeitem a oclusão correta. |
| **R2: Aumento excessivo do bundle do SVG com múltiplos itens e skins** | Médio / Baixa | Evitar | Utilizar componentes SVG modulares com símbolos `<use xlink:href>` e carregamento lazy de paths de vetores, mantendo o bundle lazy dentro do teto de 300 KB. |
| **R3: Conflito de dados caso o usuário troque de gênero ou skins sem salvar** | Médio / Média | Mitigar | Implementar visualização prévia reativa (preview efêmero em Signal/State) com commit atômico no backend via `PUT /api/v1/clinic/avatar`. |
| **R4: Inflação ou exaustão de XP por desbalanceamento dos preços de caixas** | Médio / Média | Mitigar | Calibrar custos conforme ganho médio diário de estudo e manter telemetria com feature flag de ajuste de odds sem requerer novo deploy. |
| **R5: Risco Ético/Regulatório de Mecânicas de Jogo (Lootboxes / LGPD / CDC)** | Alto / Baixa | Evitar | Moeda 100% de estudo sem NENHUMA compra com dinheiro real; publicação transparente de todas as probabilidades de drop em tela antes da compra (transparência algorítmica e conformidade com CDC e Art. 7º, V da LGPD); ausência de técnicas predatórias de cassino. |
| **R6: Sobrecarga de Renderização SVG de 50 novos itens na rota lazy da clínica** | Médio / Média | Mitigar | Reutilização de arquétipos paramétricos de SVG (`ClinicItemSvgComponent`) e sprites em símbolos SVG reutilizáveis, garantindo que o bundle se mantenha < 300 KB gzipped. |

---

## 4. Histórico de Entregas Concluídas

### ✅ Épico 1: Motor de Repetição Espaçada & Visualização de Flashcards (`[P-030]`, `[P-031]`)
- **Status:** Concluído

### ✅ Épico 2: Gamificação de Flashcards, Maestria Clínica Anatômica & Streak Repair (`[P-040]` a `[P-070]`)
- **Status:** Concluído

### ✅ Épico 3: Minha Clínica Médica — Gamificação Isométrica 2.5D & Motor de XP (`[P-080]` a `[P-086]`)
- **Status:** Concluído (Etapas 1 a 5 homologadas com 48 testes Backend + 263 testes Frontend aprovados e bundle lazy de `17.61 kB` gzipped).

### ✅ Épico 3 (Refinamento): Picking Isométrico, Remoção da Barra de Estudo & Catálogo de 104 Itens (`[P-090]` a `[P-092]`)
- **Status:** Concluído (Etapas 1 a 5 homologadas com 30 testes Backend aprovados, hit-testing pixel-perfect e bundle de `30.87 kB`).
