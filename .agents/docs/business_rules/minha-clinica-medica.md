# Regras de Negócio: Minha Clínica Médica (Gamificação Isométrica 2.5D & Motor de XP)

> **Localização Mandatória:** `.agents/docs/business_rules/minha-clinica-medica.md`  
> **Responsável:** Analista (`business-rules-expert`)  
> **Referências de Regras:** `.agents/rules/security-anti-patterns.md`, `.agents/rules/workflow-documentation-governance-rules.md`

---

## 1. Contexto e Objetivo
- **User Stories Relacionadas:** `US-01` (Motor de XP e Dualidade de Saldos), `US-02` (Progressão e Expansão Física da Clínica), `US-03` (Catálogo de 27 Itens, Compra Atômica e Layout), `US-04` (Viewport Isométrico 2.5D Ultra-Leve), `US-05` (Modo Edição, Loja por Abas, Ghost Preview, Toast de XP e Áudio Cozy).
- **Objetivo da Feature:** Transformar o esforço cognitivo diário do estudante de medicina (resolução de questões, revisão de flashcards, conclusão de videoaulas e simulados) em progresso tangível, acolhedor (*cozy*) e livre de ansiedade, permitindo construir, expandir e decorar sua própria Clínica Médica em visualização isométrica 2.5D de baixíssimo consumo de recursos.
- **Atores Envolvidos:** Estudante Autenticado (`Student`), Motor de Recompensas de Estudo (`Study XP Engine`), Serviço de Clínica Médica (`ClinicService`).

---

## 2. Catálogo de Regras de Negócio (`P-080` a `P-086`)

> [!IMPORTANT]
> Toda regra individual recebe um identificador sequencial `P-XXX`. Esse identificador deve ser referenciado nos testes de unidade e contrato (TDD), nas mensagens de commit do Desenvolvedor e no Pull Request.

### `P-080`: Dualidade de Saldos de XP (`lifetime_xp` vs `current_xp`) e Transações Auditáveis
- **Declaração Mandatória:** O sistema DEVE manter dois saldos distintos e consistentes na conta de XP do estudante (`user_xp_accounts`):
  1. `lifetime_xp` (**XP Vitalício**): Acumulador monotônico que **NUNCA decresce** sob nenhuma hipótese (nem em compras de itens, nem em expansões de sala). É utilizado exclusivamente para cálculo do Nível do Médico, Rankings e verificação de pré-requisito de desbloqueio de expansão.
  2. `current_xp` (**Saldo de XP Investível**): Saldo líquido transacional que é **creditado** a cada atividade de estudo concluída (no mesmo montante adicionado ao `lifetime_xp`) e **debitado** a cada compra de item do catálogo ou pagamento de expansão física da clínica. O `current_xp` **NUNCA** pode assumir valor negativo (`current_xp >= 0`).
  3. Toda mutação em `lifetime_xp` ou `current_xp` DEVE ocorrer dentro de uma transação ACID e gerar obrigatoriamente um registro imutável na tabela de auditoria `user_xp_transactions` contendo `user_id`, `amount` (positivo para crédito, negativo para débito), `balance_after` (valor exato de `current_xp` após a operação), `source` (`QUESTION_SUBMITTED`, `QUESTION_CORRECT`, `FLASHCARD`, `VIDEO_LESSON`, `SIMULADO`, `ROOM_EXPANSION`, `ITEM_PURCHASE`, etc.) e `description`.
- **Condições de Ativação:** Ao registrar conclusão de atividade de estudo, comprar um item do catálogo ou expandir o nível físico da clínica.
- **Resultado Esperado:** Atualização atômica dos saldos em `user_xp_accounts` e inserção do respectivo registro no ledger `user_xp_transactions`.
- **Exceção / Mensagem de Erro:** Caso uma operação de débito tente reduzir `current_xp` para menos de zero, lançar erro HTTP `400 Bad Request` / `422 Unprocessable Entity` com mensagem: `"Saldo de XP insuficiente para realizar esta operação."`.

---

### `P-081`: Motor Matemático de Recompensas de Estudo e Multiplicador de Streak Diário
- **Declaração Mandatória:** O sistema DEVE calcular o ganho de XP de cada atividade de estudo aplicando a tabela de XP base e multiplicando pelo fator de ofensiva diária (`Streak Multiplier`) segundo a fórmula determinística:
  $$\text{XP\_Final} = \text{round}\left(\text{XP\_Ação} \times (1 + \text{Multiplicador\_Streak})\right)$$
  - **1. Fontes de Ganho de XP Base (`XP_Ação`):**
    - **Questões:**
      - Submissão de questão: **`+15 XP`** base.
      - Acerto da questão: **`+25 XP`** adicionais (total de **`40 XP`** por acerto).
      - Streak de Acertos na Sessão:
        - 3 acertos seguidos: **`+15 XP`** bônus.
        - 5 acertos seguidos: **`+30 XP`** bônus.
        - 10 acertos seguidos: **`+75 XP`** bônus ("Em Chamas! 🔥").
    - **Flashcards (Repetição Espaçada):**
      - Card Fácil (`EASY`): **`+8 XP`**
      - Card Médio (`MEDIUM`): **`+12 XP`** (recompensa por esforço cognitivo)
      - Card Difícil / Erro (`HARD`): **`+5 XP`** (incentivo à resiliência)
      - Zerar deck do dia (`DAILY_DECK_COMPLETED`): **`+100 XP`** bônus de conclusão.
    - **Videoaulas:**
      - A cada 10 minutos assistidos sem avançar vídeo (`VIDEO_10_MIN`): **`+50 XP`**.
      - Aula concluída 100% (`VIDEO_COMPLETED`): **`+80 XP`** bônus.
      - Registro de anotação / flashcard durante a aula (`VIDEO_NOTE`): **`+30 XP`**.
    - **Simulados:**
      - Conclusão de simulado (`SIMULADO_COMPLETED`): **`+300 XP`** fixos + **`round(Acurácia % * 5) XP`**.
  - **2. Tabela do Multiplicador de Streak Diário (`Multiplicador_Streak`):**
    - `0 a 2 dias`: **`+0%`** (`1.00x`)
    - `3 a 6 dias`: **`+10%`** (`1.10x`)
    - `7 a 13 dias`: **`+20%`** (`1.20x`)
    - `14 a 29 dias`: **`+35%`** (`1.35x`)
    - `30+ dias`: **`+50%`** (`1.50x` sobre todo o XP recebido no dia)
- **Condições de Ativação:** Disparo do endpoint `POST /api/v1/study/action-reward` ou conclusão de atividade nos serviços internos de estudo (`StudySessionService`, `FlashcardService`, `LessonService`, `SimuladoService`).
- **Resultado Esperado:** Cálculo exato do `XP_Final` arredondado (`Math.round`), incremento simultâneo de `lifetime_xp` e `current_xp`, atualização de `current_streak_days` e `last_study_date`, gravação em `user_xp_transactions` e retorno do payload com o XP concedido.

---

### `P-082`: Progressão e Expansão Física da Clínica (6 Níveis)
- **Declaração Mandatória:** O sistema DEVE gerenciar a evolução espacial da clínica em **6 níveis estritos e sequenciais** (`expansion_level` de `1` a `6`). O estudante inicia automaticamente no Nível 1 ao criar/acessar sua clínica e SÓ PODE expandir para o nível imediatamente seguinte (`novo_nivel = expansion_level + 1`) se atender simultaneamente a dois critérios:
  1. Possuir `lifetime_xp >= Requisito_Lifetime_XP` do nível alvo;
  2. Possuir `current_xp >= Custo_XP` do nível alvo (valor debitado de `current_xp`).

  | Nível (`expansion_level`) | Nome do Espaço | Dimensões na Malha (`grid_width` x `grid_height`) | Custo (`current_xp` debitado) | Pré-requisito (`lifetime_xp` mínimo) |
  | :---: | :--- | :---: | :---: | :---: |
  | **1** | **Box do Internato** | `4 x 4` tiles | `0 XP` (Grátis) | `0 XP` |
  | **2** | **Consultório Júnior** | `6 x 6` tiles | `1.200 XP` | `1.500 XP` |
  | **3** | **Consultório Master com Hall** | `8 x 8` tiles | `3.800 XP` | `4.500 XP` |
  | **4** | **Clínica 2 Ambientes** (Duas salas 6x6) | `12 x 6` tiles | `8.500 XP` | `10.000 XP` |
  | **5** | **Clínica Integrada com Ala Pediátrica** (Três salas) | `12 x 12` tiles | `16.000 XP` | `20.000 XP` |
  | **6** | **Instituto Médico Completo** (Quatro salas) | `16 x 12` tiles | `32.000 XP` | `40.000 XP` |

- **Condições de Ativação:** Solicitação de expansão da clínica pelo estudante (`POST /api/v1/clinic/expand`).
- **Resultado Esperado:** Incremento de `expansion_level` em `+1`, atualização de `grid_width` e `grid_height`, preservação de todos os móveis já posicionados (`clinic_placed_items`), débito do custo em `current_xp` e registro em `user_xp_transactions` (`ROOM_EXPANSION`).

---

### `P-083`: Catálogo Oficial de 27 Itens, Skins e Preços (Destaque Pediatria)
- **Declaração Mandatória:** O sistema DEVE disponibilizar na tabela `clinic_items_catalog` exatamente os **27 itens oficiais** estruturados em 4 categorias (`pediatria`, `mobiliario`, `clinica`, `recepcao`), com seus respectivos IDs, preços em XP (`cost_xp`), dimensões (`footprint_x`, `footprint_y`), nível mínimo (`min_expansion_level`), interatividade (`is_interactable`) e chave de asset SVG (`asset_svg_key`):

  #### 4.1. Set Especial: Pediatria (`pediatria` — 10 Itens)
  | ID (`id`) | Nome (`name`) | Custo (`cost_xp`) | Footprint (`x, y`) | Nível Mín. | Interativo | Detalhe Visual / Som |
  | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
  | `ped_maca_dino` | Maca Dinossauro Safari | `3.500 XP` | `2 x 1` | `2` | `true` | Braquiossauro verde pastel com animação de piscar olhos ao clicar. |
  | `ped_maca_baleia` | Maca Baleia Azul | `1.800 XP` | `2 x 1` | `1` | `true` | Estofado macio com cauda de apoio. |
  | `ped_maca_f1` | Maca Carro de Corrida | `2.400 XP` | `2 x 1` | `2` | `true` | Modelo vintage de corrida; volante interativo. |
  | `ped_regua_girafa` | Régua Girafa de Parede | `900 XP` | `1 x 1` | `1` | `true` | Escala métrica desenhada no pescoço da girafa. |
  | `ped_balanca_urso` | Balança Bebê Ursinho | `1.100 XP` | `1 x 1` | `1` | `false` | Balança concha com visor digital na barriga do urso. |
  | `ped_piscina_bolinhas` | Piscina de Bolinhas Candy Color | `2.800 XP` | `2 x 2` | `3` | `true` | Bolinhas em tons pastéis para a sala de espera. |
  | `ped_tenda_leitura` | Tenda Tipi Indígena | `3.200 XP` | `2 x 2` | `4` | `true` | Cabaninha infantil com almofadas de nuvem. |
  | `ped_bau_coragem` | Baú do Tesouro / Pote de Adesivos | `1.500 XP` | `1 x 1` | `2` | `true` | Emite partículas douradas e som ao clicar. |
  | `ped_papel_safari` | Papel de Parede Safari Aquarela | `850 XP` | `1 x 1` | `1` | `false` | Estampa suave de savana para o ambiente infantil. |
  | `ped_esteto_elefante` | Protetor de Esteto Elefantinho | `650 XP` | `1 x 1` | `1` | `false` | Protetor emborrachado para a campânula. |

  #### 4.2. Mobiliário Médico Principal (`mobiliario` — 6 Itens)
  | ID (`id`) | Nome (`name`) | Custo (`cost_xp`) | Footprint (`x, y`) | Nível Mín. | Interativo | Detalhe Visual / Som |
  | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
  | `mesa_scandi` | Mesa Escandinava de Carvalho com Suculenta | `950 XP` | `2 x 1` | `1` | `false` | Madeira clara escandinava com vaso de suculenta. |
  | `mesa_mogno_cafe` | Mesa de Mogno com Xícara de Café Quente | `2.200 XP` | `2 x 1` | `2` | `true` | Fumaça animada contínua saindo da xícara. |
  | `mesa_carrara` | Mesa Mármore Carrara & Dourado | `4.800 XP` | `2 x 1` | `4` | `true` | Tampo de mármore nobre com estrutura dourada fosca. |
  | `cadeira_ergonomica` | Cadeira Operacional Mesh | `800 XP` | `1 x 1` | `1` | `false` | Cadeira ergonômica telada para plantão. |
  | `cadeira_presidente_couro` | Cadeira Presidente Couro Caramelo Capitonê | `2.600 XP` | `1 x 1` | `3` | `false` | Poltrona executiva em couro caramelo. |
  | `pc_ultrawide` | Estação de Trabalho com Monitor Ultrawide | `1.600 XP` | `1 x 1` | `2` | `true` | Monitor curvo ultrawide com prontuário médico. |

  #### 4.3. Instrumentais & Outras Especialidades (`clinica` — 6 Itens)
  | ID (`id`) | Nome (`name`) | Custo (`cost_xp`) | Footprint (`x, y`) | Nível Mín. | Interativo | Detalhe Visual / Som |
  | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
  | `didatico_dr_bones` | Esqueleto Didático "Dr. Bones" | `1.900 XP` | `1 x 1` | `1` | `true` | Usa gravata borboleta vermelha e acena ao clicar. |
  | `esteto_ouro_master` | Estetoscópio Master Ouro em Suporte | `3.000 XP` | `1 x 1` | `3` | `true` | Acabamento dourado em pedestal acrílico. |
  | `monitor_ecg` | Monitor Cardíaco com Traçado Vivo em Loop | `2.100 XP` | `1 x 1` | `2` | `true` | Traçado ECG sinusal vivo em loop e bip sutil ao clicar. |
  | `usg_fetal_4d` | Aparelho de Ultrassom 4D com Display Colorido | `3.900 XP` | `1 x 1` | `4` | `true` | Console de ultrassom com imagem fetal 4D. |
  | `negatoscopio_led` | Negatoscópio Ultra-Slim com Radiografia Iluminada | `1.400 XP` | `1 x 1` | `1` | `true` | Painel de LED com radiografia de tórax iluminada. |
  | `estante_harrison` | Estante Gigante com Tratados Clássicos de Medicina | `1.700 XP` | `2 x 1` | `2` | `false` | Estante repleta de volumes médicos clássicos. |

  #### 4.4. Recepção & Mascotes Relaxantes (`recepcao` — 5 Itens)
  | ID (`id`) | Nome (`name`) | Custo (`cost_xp`) | Footprint (`x, y`) | Nível Mín. | Interativo | Detalhe Visual / Som |
  | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
  | `cafe_espresso_vermelho` | Máquina de Espresso Gourmet | `1.300 XP` | `1 x 1` | `1` | `true` | Áudio de expresso e vapor animado ao clicar. |
  | `mascote_gato_bisturi` | Gato "Bisturi" | `2.900 XP` | `1 x 1` | `2` | `true` | Dorme na poltrona e ronrona ao clicar. |
  | `mascote_cao_caramelo` | Golden Retriever "Dr. Caramelo" | `4.500 XP` | `1 x 1` | `3` | `true` | Abana o rabo ao ser clicado. |
  | `balcao_recepcao_madeira` | Balcão de Recepção em Madeira Clara | `1.500 XP` | `2 x 1` | `3` | `false` | Balcão acolhedor para recepção de pacientes. |
  | `bebedouro_galao` | Bebedouro Retrô de Galão Azul | `400 XP` | `1 x 1` | `1` | `true` | Solta bolhas de água ao clicar. |

---

### `P-084`: Compra Atômica, Kit Inicial do Internato e Validação Espacial de Layout (Anti-Colisão)
- **Declaração Mandatória:**
  1. **Onboarding Nível 1:** Ao inicializar a clínica de um usuário (`GET /api/v1/clinic`), caso ainda não exista registro em `user_clinics`, o sistema provisiona a clínica Nível 1 (`4x4`) com 3 itens básicos gratuitos já registrados/posicionados (`mesa_scandi` em `(0,0)`, `cadeira_ergonomica` em `(0,1)` e `ped_maca_baleia` em `(2,0)`).
  2. **Compra Atômica (`POST /api/v1/clinic/items/buy`):** Debita `cost_xp` de `current_xp`, registra o item adquirido no inventário/clínica do usuário e grava transação `ITEM_PURCHASE` em `user_xp_transactions`.
  3. **Validação Espacial (`PUT /api/v1/clinic/layout`):**
     - Cada item posicionado possui `rotation` em `{0, 1}` (`0` = SE, `1` = SW).
     - Se `rotation == 0`: `eff_w = footprint_x`, `eff_h = footprint_y`. Se `rotation == 1`: `eff_w = footprint_y`, `eff_h = footprint_x`.
     - Todo item posicionado no chão (`grid_x >= 0`, `grid_y >= 0`) deve respeitar `grid_x + eff_w <= grid_width` e `grid_y + eff_h <= grid_height` e não pode ter interseção AABB 2D com nenhum outro item posicionado no chão.

---

### `P-085`: Renderização Isométrica 2.5D Low-Footprint & Page Visibility API
- **Declaração Mandatória:**
  - Projeção Isométrica Ortográfica 2:1 (Tile `64x32px`).
  - Ordenação de profundidade determinística: `depth = (x + y) * 1000 + z`.
  - Suspensão 100% do loop `requestAnimationFrame` quando `document.hidden === true`.
  - Bundle size do módulo <= 300 KB gzipped, sem bibliotecas 3D pesadas (Three.js/Babylon.js).

---

### `P-086`: Feedback Visual de Estudo e Áudio Cozy Controlável
- **Declaração Mandatória:**
  - Exibir toast/indicador animado `+{xp} XP (Salvo na Clínica)` ao ganhar XP em atividades de estudo.
  - Barra inferior deslizante no modo edição dividida em 4 abas (`Pediatria`, `Móveis`, `Equipamentos`, `Conforto`) com *ghost* isométrico verde (válido) ou vermelho (colisão).
  - Micro-interações sonoras via Web Audio API com controle de mudo persistido.

---

### `P-087`: Customização de Superfícies de Ambiente (Pisos e Papéis de Parede)
- **Declaração Mandatória:**
  1. O sistema DEVE desacoplar integralmente a aplicação de acabamentos de superfície (papel de parede e revestimento de piso) do sistema de colisão e posicionamento discreto de móveis em tiles.
  2. Papéis de parede e pisos são propriedades globais da clínica vinculadas diretamente à entidade `user_clinics` através dos atributos `wall_theme` e `floor_theme`. Eles **NÃO** ocupam coordenadas na malha (`grid_x, grid_y`), não possuem colisão AABB e não afetam o inventário de itens posicionados (`clinic_placed_items`).
  3. O item do catálogo `ped_papel_safari` (Papel de Parede Safari Aquarela) e demais opções de revestimento passam a ter a classificação `placement_type = 'SURFACE_WALL'` ou `placement_type = 'SURFACE_FLOOR'`:
     - Ao ser adquirido e selecionado, `ped_papel_safari` aplica a textura contínua de savana aquarela às paredes traseiras (NW e NE), sem ocupar o piso.
  4. O sistema DEVE disponibilizar no onboarding inicial os temas básicos gratuitos: `wall_clean_white` (Paredes Brancas Internato) e `floor_porcelanato_cinza` (Porcelanato Acetinado Neutro).
  5. A troca de revestimento ativo (`PUT /api/v1/clinic/surfaces`) é instantânea e reflete no SVG/Canvas sem exigir recarregamento da página, persistindo a preferência do usuário.
- **Condições de Ativação:**
  - Onboarding de criação da clínica (`GET /api/v1/clinic`).
  - Compra de novo tema de superfície na loja (`POST /api/v1/clinic/surfaces/buy`).
  - Aplicação de tema de piso ou parede (`PUT /api/v1/clinic/surfaces`).
- **Resultado Esperado:**
  - Persistência dos identificadores de estilo em `user_clinics.wall_theme` e `user_clinics.floor_theme`.
  - Renderização das faces das paredes e dos ladrilhos do piso com o padrão gráfico selecionado, sem gerar instâncias na tabela `clinic_placed_items`.
- **Exceção / Mensagem de Erro:**
  - Tentativa de aplicar tema que o estudante não comprou: HTTP `403 Forbidden` com mensagem: `"Você ainda não desbloqueou este revestimento."`.
  - Código de tema não cadastrado no catálogo: HTTP `404 Not Found` com mensagem: `"Tema de superfície não encontrado."`.

---

### `P-088`: Projeção e Fixação de Itens de Parede (Wall-Mounted Items)
- **Declaração Mandatória:**
  1. O sistema DEVE classificar os itens colecionáveis quanto à sua ancoragem através da propriedade `placement_type` com valores discretos:
     - `'FLOOR'`: Móvel tradicional de chão sujeito à matriz de colisão 2D AABB e footprints `(footprint_x, footprint_y)`.
     - `'WALL'`: Item de fixação vertical (ex: `ped_regua_girafa`, `negatoscopio_led`, quadros e diplomas).
  2. **Desacoplamento de Colisão de Piso:**
     - Itens com `placement_type = 'WALL'` possuem footprint de piso nulo (`0 x 0`). Eles **NÃO** geram colisão contra móveis de piso. Uma maca, mesa ou armário PODE ser posicionado no piso exatamente rente ou abaixo de um item de parede sem indicar conflito de sobreposição.
  3. **Ancoragem e Coordenadas de Parede:**
     - Itens de parede são fixados exclusivamente nas paredes traseiras visíveis da sala isométrica:
       - `wall_side`: `'NW'` (Parede Noroeste / Traseira Esquerda) ou `'NE'` (Parede Nordeste / Traseira Direita).
       - `wall_tile_index`: Segmento linear correspondente ao tile ao longo da parede (`0 <= wall_tile_index < grid_dimension`).
       - `elevation_z`: Elevação vertical em pixels a partir da base do rodapé (padrão de renderização `45px`, faixa admitida de `20px` a `80px`).
  4. **Camada de Renderização e Depth Sorting:**
     - Itens de parede são alocados na camada gráfica `wallLayer` (`zLayer = 20`), desenhados visualmente após a textura da parede e antes de qualquer móvel ou avatar em primeiro plano, garantindo ordenação perfeita de profundidade.
  5. **Interatividade Preservada:**
     - O suporte a cliques e toques é mantido: o clique no `negatoscopio_led` comuta o estado da luz do painel e inspeciona o raio-X; o clique na `ped_regua_girafa` aciona animação métrica com partículas lúdicas.
- **Condições de Ativação:**
  - Posicionamento, reposicionamento ou remoção de itens com `placement_type = 'WALL'` via endpoint `PUT /api/v1/clinic/layout` ou `POST /api/v1/clinic/wall-items`.
- **Resultado Esperado:**
  - Persistência das coordenadas de parede em `clinic_placed_items` (`placement_type = 'WALL'`, `wall_side`, `wall_tile_index`, `elevation_z`), renderização correta na parede indicada e validação de layout no chão sem falsos positivos de colisão.
- **Exceção / Mensagem de Erro:**
  - Tentativa de fixar item de parede em parede inválida: HTTP `400 Bad Request` com mensagem: `"Itens de parede só podem ser fixados nas paredes traseiras (NW e NE)."`.
  - Conflito de fixação (dois itens de parede no mesmo `wall_side` e `wall_tile_index` com sobreposição física): HTTP `422 Unprocessable Entity` com mensagem: `"Já existe um item de parede fixado neste segmento."`.

---

### `P-089`: Personagem Médico Virtual (Doctor Avatar) e Guarda-Roupa de Skins de Saúde
- **Declaração Mandatória:**
  1. O sistema DEVE provisionar automaticamente para cada clínica um **Avatar Médico Virtual** residente (`user_doctor_avatar`).
  2. **Gênero Base Gratuito e Flexível:**
     - O estudante escolhe livremente entre a base Médica (`FEMALE`) ou Médico (`MALE`).
     - A escolha do gênero base é **100% gratuita** e pode ser alterada a qualquer momento nas opções da clínica sem consumo de XP.
  3. **Guarda-Roupa em 3 Slots Estritos:**
     - A personalização cosmética do avatar é dividida em 3 slots independentes:
       - **Slot 1 - Jaleco / Roupa (`coat`):**
         - *Inicial Gratuito:* `coat_intern_white` (Jaleco Tradicional de Internato).
         - *Cosméticos por XP:* `coat_scrubs_navy` (Scrub Azul Marinho Plantão - `500 XP`), `coat_scrubs_green` (Scrub Verde Cirúrgico - `800 XP`), `coat_pediatric_dino` (Jaleco Estampado Pediatria - `1.200 XP`), `coat_executive_doc` (Jaleco Sob Medida Premium - `2.500 XP`).
       - **Slot 2 - Estetoscópio (`stethoscope`):**
         - *Iniciais Gratuitos:* `steth_none` (Sem Estetoscópio) e `steth_classic_black` (Estetoscópio Preto Básico).
         - *Cosméticos por XP:* `steth_cardio_burgundy` (Esteto Cardiológico Vinho - `700 XP`), `ped_steth_elefante` (Esteto Pediátrico Elefante - `950 XP`), `steth_gold_master` (Esteto Master Ouro 24k - `3.000 XP`).
       - **Slot 3 - Acessório (`accessory`):**
         - *Inicial Gratuito:* `acc_none` (Nenhum).
         - *Cosméticos por XP:* `acc_glasses_classic` (Óculos de Armação Redonda - `400 XP`), `acc_ped_gorro_colorido` (Gorro Cirúrgico Safari - `600 XP`), `acc_prontuario_clipboard` (Prancheta Médica na Mão - `850 XP`).
  4. **Renderização Isométrica 2.5D e Animação Idle:**
     - O avatar é posicionado por padrão no chão do consultório próximo à mesa de atendimento (`avatar_x`, `avatar_y`).
     - Renderizado com proporções harmônicas de pixel art/vetor 2.5D (`32x64px`).
     - Possui animação *idle* ultra-leve (oscilação vertical suave de 1 a 2px com período de 3s via CSS `@keyframes`, sem loop WebGL de alto consumo).
     - Ordenação de profundidade no Painter's Algorithm: `depth = (avatar_x + avatar_y) * 1000 + 10`.
  5. **Micro-Interação e Falas Acolhedoras:**
     - Ao clicar ou tocar sobre o avatar, ele acena/pisca e emite um balão de diálogo acolhedor (*speech bubble*) com frases clínicas e motivacionais de apoio ao estudante (ex: *"Pronto para o plantão de hoje?", "Lembre-se de beber água entre os casos clínicos!", "Excelente diagnóstico na última questão!"*).
  6. **Persistência e Débito de XP:**
     - O estado atual do avatar é persistido na tabela `user_doctor_avatar` (`user_id`, `gender`, `skin_coat`, `skin_stethoscope`, `skin_accessory`, `updated_at`).
     - Aquisição de skins pagas debita atomicamente o `cost_xp` de `current_xp` via transação `SKIN_PURCHASE` em `user_xp_transactions`.
- **Condições de Ativação:**
  - Consulta dos dados do avatar (`GET /api/v1/clinic/avatar`).
  - Atualização de gênero ou troca de skins equipadas (`PUT /api/v1/clinic/avatar`).
  - Compra de nova skin cosmética (`POST /api/v1/clinic/avatar/skins/buy`).
- **Resultado Esperado:**
  - Visualização imediata do personagem com a combinação correta de roupas/instrumentos no consultório e débito auditável de XP caso envolva aquisição.
- **Exceção / Mensagem de Erro:**
  - Tentativa de equipar skin que o estudante não possui: HTTP `403 Forbidden` com mensagem: `"Você ainda não adquiriu este item cosmético."`.
  - Parâmetro de gênero inválido: HTTP `400 Bad Request` com mensagem: `"Gênero inválido. Opções permitidas: MALE ou FEMALE."`.

---

### `P-090`: Resolução de Picking e Prevenção de Overlap de Clicks no Grid Isométrico 2.5D
- **Declaração Mandatória:**
  1. O viewport isométrico 2.5D DEVE garantir que o clique ou toque do usuário atinja com precisão pixel-perfect a coordenada de matriz `(gridX, gridY)` desejada, sem desvio para células adjacentes ou diagonais (como `(gridX + 1, gridY + 1)`).
  2. **Isolamento de Ponteiro no Modo Edição/Posicionamento:**
     - Sempre que um item do catálogo estiver selecionado para compra ou reposicionamento (`selectedCatalogItem !== null` ou `movingItem !== null`):
       - O container flutuante do *Ghost Preview* (`.ghost-item-anchor`) DEVE ter `pointer-events: none` inegociável. Ele atua exclusivamente como guia visual e jamais pode interceptar cliques ou eventos de mouse.
       - Todos os containers HTML dos itens já posicionados (`.placed-item-anchor`) e do avatar médico (`.doctor-avatar-anchor`) DEVEM receber temporariamente `pointer-events: none`, permitindo que os polígonos SVG dos ladrilhos do piso (`.iso-tile`) e paredes recebam diretamente 100% dos eventos `mouseenter`, `mousemove` e `click`.
  3. **Mitigação de Overlap de Bounding Box em Modo Navegação:**
     - No modo normal de inspeção/interação, a div retangular container de cada item posicionado DEVE possuir `pointer-events: none`, enquanto os nós visíveis do SVG dentro de cada item (`path`, `rect`, `circle`, `polygon`) recebem `pointer-events: visiblePainted`. Isso impede que a porção superior transparente de um móvel posicionado em `(1, 1)` cubra o tile ou item posicionado em `(0, 0)`.
- **Condições de Ativação:**
  - Posicionamento de item, seleção de móvel no consultório, clique sobre ladrilhos do grid isométrico.
- **Resultado Esperado:**
  - Clique na posição visual de `(0, 0)` emite `{ gridX: 0, gridY: 0 }` imediatamente e posiciona o item na coordenada exata, sem saltos para `(1, 1)`.
- **Exceção / Mensagem de Erro:**
  - Nenhuma; garantia puramente geométrica e de hit-testing no DOM/SVG.

---

### `P-091`: Maximização da Imersão da Clínica e Remoção de Faixa Simuladora de XP
- **Declaração Mandatória:**
  1. A faixa de ações simuladas de estudo (`.study-actions-strip` com botões *"Acertar Questão"*, *"Revisar Flashcard"*, etc.) DEVE ser removida da interface de usuário da página `/minha-clinica`.
  2. **Imersão Estrita do Módulo:**
     - O módulo da clínica médica foca exclusivamente na experiência visual, gerencial, de construção e customização do consultório.
     - O ganho real de XP e progressão de streaks ocorre de forma orgânica nas telas oficiais de estudo do MedStudy (Banco de Questões, Decks de Flashcards, Player de Videoaulas e Módulo de Simulados).
  3. **Manutenção do Header Gamificado:**
     - O cabeçalho da clínica preserva os indicadores essenciais de progresso: Nível da Clínica, Saldo de `current_xp`, `lifetime_xp` acumulado e contador de Streak com ícone de chama.
- **Condições de Ativação:**
  - Acesso à rota `/minha-clinica`.
- **Resultado Esperado:**
  - Topo da página limpo, sem botões de ganho forçado de XP, com o viewport isométrico em destaque de visualização.
- **Exceção / Mensagem de Erro:**
  - Nenhuma.

---

### `P-092`: Expansão do Catálogo da Clínica Médica para >= 100 Itens Únicos
- **Declaração Mandatória:**
  1. O catálogo mestre da clínica (`clinic_items_catalog`) DEVE disponibilizar no mínimo **100 itens colecionáveis e compráveis**, distribuídos equilibradamente em 4 categorias oficiais com exatamente **25 itens cada**:
     - **Ala Pediátrica (`pediatria` - 25 itens):** Macas temáticas (dino, baleia, f1, nave, carruagem), brinquedos terapêuticos (piscina de bolinhas, tenda tipi, casinha, gira-gira), régua girafa de parede, balança urso, baú do tesouro, mesinhas de desenho, estetoscópios lúdicos, móbiles e almofadas.
     - **Mobiliário Médico (`mobiliario` - 25 itens):** Mesas de consultório (escandinava, mogno, mármore carrara, vidro temperado, industrial, minimalista), cadeiras ergonômicas e poltronas executivas (mesh, couro caramelo, veludo, capitonê), estantes de livros (Harrison, Guyton, Sobotta), armários de medicamentos, vitrines de vidro, biombos hospitalares e mesas auxiliares.
     - **Instrumentais & Procedimentos (`clinica` - 25 itens):** Monitores multiparamétricos de ECG, aparelho de ultrassom 4D, negatoscópios LED de parede, desfibrilador DEA móvel, foco cirúrgico de teto, esqueleto didático "Dr. Bones", modelo anatômico de coração, microscópio biológico, negatoscópio panorâmico, esteto ouro 24k, balança antropométrica mecânica e mesa cirúrgica ambulatorial.
     - **Recepção & Conforto (`recepcao` - 25 itens):** Balcões de atendimento (madeira clara, mármore negro, curvo moderno), máquinas de café gourmet (espresso vermelho, barista premium, cápsulas), sofás de espera modulares, poltronas confortáveis, bebedouros retrô e modernos, purificadores de ar, aquários com peixes coloridos, plantas ornamentais (costela de adão, palmeira areca, suculentas gigantes) e mascotes relaxantes interativos (Gato "Bisturi", Golden "Dr. Caramelo", Papagaio "Dr. Clorofila").
  2. **Precificação e Progressão por Níveis de Expansão (1 a 6):**
     - Os preços variam de `200 XP` (itens iniciais de acolhimento) até `25.000 XP` (itens lendários para Instituto Médico Completo).
     - Itens avançados exigem `min_expansion_level` condizente com a evolução física do espaço do estudante.
  3. **Footprints Físicos Suportados:**
     - De chão (`FLOOR`): `1x1`, `2x1`, `1x2`, `2x2`.
     - De parede (`WALL`): `footprint_x = 0, footprint_y = 0`, fixação nas paredes NW/NE com índice e elevação vertical.
  4. **Performance do Catálogo & Modularidade de SVGs:**
     - Os SVGs dos itens devem ser gerados através de arquétipos modulares parametrizáveis no `ClinicItemSvgComponent` (tampo, pernas, detalhes temáticos, texturas, brilhos), evitando duplicação excessiva de código e assegurando que o chunk da clínica permaneça estritamente abaixo de **300 KB gzipped**.
- **Condições de Ativação:**
  - Consulta do catálogo via `GET /api/v1/clinic/catalog`, renderização das abas da loja e posicionamento dos itens.
- **Resultado Esperado:**
  - Catálogo robusto, com paginação/listagem fluida de mais de 100 itens categorizados, permitindo personalização profunda da clínica ao longo de meses de estudo.
- **Exceção / Mensagem de Erro:**
  - Tentativa de compra de item inexistente: HTTP `404 Not Found`.
  - Saldo de `current_xp` insuficiente: HTTP `422 Unprocessable Entity`.
  - Nível de expansão da clínica inferior ao `min_expansion_level`: HTTP `403 Forbidden`.

---

### `P-093`: Sistema de Níveis de Raridade e Catálogo com 50 Itens Exclusivos de Sorteio
- **Declaração Mandatória:**
  1. O sistema DEVE atribuir a todo item de catálogo da clínica médica (`clinic_items_catalog`) um atributo de raridade (`rarity`) tipado obrigatoriamente pelo enum:
     - `COMMON` (Comum): Itens e mobiliários elementares do dia a dia da clínica, visual limpo básico e borda/badge cinza neutro (`#94A3B8`).
     - `RARE` (Raro): Instrumentais especializados e mobiliário de média sofisticação, borda/badge azul hospitalar (`#0284C7`).
     - `EPIC` (Épico): Equipamentos diagnósticos avançados, mobílias requintadas e itens temáticos premium, borda/badge roxo ametista (`#A855F7`).
     - `LEGENDARY` (Lendário): Equipamentos médicos futuristas/históricos de altíssima complexidade, mascotes animados raros e itens dourados, borda/badge dourado radiante (`#F59E0B`).
  2. **Classificação Retrocompatível dos 104 Itens Existentes:**
     - Todos os 104 itens previamente existentes no catálogo mantêm seu custo original em XP e a flag `is_purchasable = true`, recebendo classificação retroativa de raridade baseada em seu custo e complexidade:
       - Faixa até 1.500 XP: `COMMON` (42 itens)
       - Faixa de 1.600 a 4.000 XP: `RARE` (38 itens)
       - Faixa de 4.100 a 10.000 XP: `EPIC` (18 itens)
       - Faixa acima de 10.000 XP: `LEGENDARY` (6 itens)
     - Nenhuma compra prévia, layout salvo ou inventário existente do estudante sofre alteração ou perda de compatibilidade.
  3. **Adição de 50 Itens Especiais Exclusivos de Lootbox (`is_lootbox_exclusive = true`):**
     - O acervo total da clínica passa de 104 para exatamente **154 itens catalogados**.
     - Os 50 novos itens possuem obrigatoriamente a propriedade booleana `is_lootbox_exclusive = true` e `is_purchasable = false`.
     - É estritamente **PROIBIDA** a compra direta de itens exclusivos através da loja comum de XP (`POST /api/v1/clinic/items/buy`). Se acionado para um item com `is_lootbox_exclusive = true`, o backend DEVE rejeitar a operação com erro HTTP `403 Forbidden`.
     - Nenhum dos 50 itens exclusivos possui raridade `COMMON`. A distribuição oficial é:
       - `RARE`: 18 itens (36%)
       - `EPIC`: 22 itens (44%)
       - `LEGENDARY`: 10 itens (20%)
     - Equilíbrio por categorias:
       - Ala Pediátrica: 13 itens exclusivos (ex: Maca Espacial Apollo Kids, Robô Cuidador Dr. Pixel, Carrossel Musical Iluminado).
       - Mobiliário Médico: 12 itens exclusivos (ex: Mesa Executiva Holográfica de Nogueira, Poltrona Anti-Gravidade com Massagem).
       - Clínica & Procedimentos: 13 itens exclusivos (ex: Ressonância Magnética 3T Compacta com LED RGB, Miniatura de Robô Cirúrgico).
       - Recepção & Conforto: 12 itens exclusivos (ex: Aquário Gigante com Corais Vivos, Cafeteira de Pistão Ouro, Mascote Husky Siberiano Dr. Neve).
- **Condições de Ativação:** Consulta do catálogo (`GET /api/v1/clinic/catalog`), filtragem por raridade e tentativa de aquisição direta.
- **Resultado Esperado:** Exibição clara do badge de raridade em cada item, bloqueio inviolável de compra direta dos 50 itens exclusivos e disponibilização exclusiva nos pools de drop das Lootboxes.
- **Exceção / Mensagem de Erro:**
  - Tentativa de compra direta de item exclusivo: HTTP `403 Forbidden` com mensagem: `"Este item é uma relíquia exclusiva de Lootbox e não pode ser adquirido por compra direta com XP."`.

---

### `P-094`: Sistema de Lootboxes em 3 Tiers e Motor Probabilístico de Drops
- **Declaração Mandatória:**
  1. O sistema DEVE disponibilizar 3 categorias escalonadas de caixas da sorte médicas (**Lootbox Tiers**), parametrizadas com custo em `current_xp` e pools probabilísticos distintos:
     - **Tier 1: Caixa do Residente (`TIER_1_RESIDENT`)**
       - Preço: **`1.500 XP`**
       - Probabilidades de Drop:
         - `COMMON`: **60%** (intervalo `[0.00, 60.00)`)
         - `RARE`: **30%** (intervalo `[60.00, 90.00)`)
         - `EPIC`: **9%** (intervalo `[90.00, 99.00)`)
         - `LEGENDARY`: **1%** (intervalo `[99.00, 100.00)`)
       - Pool Elegível: Itens comuns, raros, épicos e lendários do catálogo geral e do acervo de lootboxes.
     - **Tier 2: Caixa do Especialista (`TIER_2_SPECIALIST`)**
       - Preço: **`4.500 XP`**
       - Probabilidades de Drop:
         - `COMMON`: **0%** (Garantia absoluta de ZERO itens comuns!)
         - `RARE`: **65%** (intervalo `[0.00, 65.00)`)
         - `EPIC`: **28%** (intervalo `[65.00, 93.00)`)
         - `LEGENDARY`: **7%** (intervalo `[93.00, 100.00)`)
       - Pool Elegível: Somente itens de raridade RARE, EPIC e LEGENDARY.
     - **Tier 3: Caixa do Chefe de Ala (`TIER_3_CHIEF_OF_STAFF`)**
       - Preço: **`12.000 XP`**
       - Probabilidades de Drop:
         - `COMMON`: **0%**
         - `RARE`: **0%** (Garantia de ZERO itens comuns e raros!)
         - `EPIC`: **75%** (intervalo `[0.00, 75.00)`)
         - `LEGENDARY`: **25%** (intervalo `[75.00, 100.00)`) — *1 em cada 4 caixas concede um item Lendário!*
       - Pool Elegível: Exclusivamente itens de alta patente (EPIC e LEGENDARY).
  2. **Motor Probabilístico Seguro Server-Side:**
     - O sorteio do item DEVE ocorrer exclusivamente no backend utilizando gerador pseudoaleatório criptograficamente seguro (`java.security.SecureRandom`).
     - O frontend JAMAIS determina nem influencia o resultado do sorteio, atuando apenas como renderizador cosmético da animação de abertura.
     - **Algoritmo de Sorteio em 3 Etapas:**
       - *Etapa A (Raridade):* Sorteia número em ponto flutuante no intervalo $[0.00, 100.00)$ e mapeia a raridade correspondente conforme as probabilidades do Tier.
       - *Etapa B (Filtragem do Pool):* Busca no repositório os itens ativos elegíveis para o Tier que possuem a raridade determinada.
       - *Etapa C (Seleção Uniforme):* Sorteia uniformemente com probabilidade $1/N$ um item dentro da lista filtrada.
- **Condições de Ativação:** Requisição de abertura de caixa (`POST /api/v1/clinic/lootboxes/open`).
- **Resultado Esperado:** Sorteio justo, matematicamente verificado contra as probabilidades oficiais, e entrega do payload com o item selecionado e metadados visuais.
- **Exceção / Mensagem de Erro:**
  - Código de Tier inexistente ou inválido: HTTP `400 Bad Request` com mensagem: `"Tier de Lootbox inválido. Opções válidas: TIER_1_RESIDENT, TIER_2_SPECIALIST, TIER_3_CHIEF_OF_STAFF."`.

---

### `P-095`: Transação ACID de Abertura, Auditoria e Política de Cashback de Duplicatas
- **Declaração Mandatória:**
  1. A abertura de qualquer Lootbox DEVE ser processada em uma transação ACID atômica (`@Transactional`) com bloqueio pessimista sobre o registro do estudante em `user_xp_accounts`, eliminando integralmente vulnerabilidades de condição de corrida (race conditions ou duplo clique rápido).
  2. **Validação de Saldo e Débito de XP:**
     - O sistema verifica se `current_xp >= tier_cost_xp`.
     - Debita atomicamente o custo do tier de `current_xp` (mantendo `lifetime_xp` estritamente inalterado).
     - Registra a transação de débito no ledger imutável `user_xp_transactions`:
       - `source = 'LOOTBOX_OPEN'`
       - `amount = -tier_cost_xp`
       - `balance_after = current_xp`
       - `description = 'Abertura de Caixa da Sorte: [Nome do Tier]'`
  3. **Verificação de Posse e Mecanismo de Cashback de Duplicatas:**
     - O sistema consulta se o usuário já possui o item sorteado em sua posse (`user_clinic_inventory` ou `clinic_placed_items`).
     - **Cenário 1 — Item Novo (`is_duplicate = false`):**
       - O item sorteado é atribuído ao inventário do usuário (`quantity = 1`).
       - `cashback_xp = 0`.
     - **Cenário 2 — Item Duplicado (`is_duplicate = true`):**
       - Para mitigar frustração com drops repetidos e manter a saúde da economia de XP, o item repetido NÃO é acumulado sem utilidade. Ele é instantaneamente convertido em **Cashback de XP** de volta para o `current_xp` do estudante conforme a tabela fixa por raridade:
         - `COMMON`: **`250 XP`**
         - `RARE`: **`1.000 XP`**
         - `EPIC`: **`3.000 XP`**
         - `LEGENDARY`: **`8.000 XP`**
       - O valor de `cashback_xp` é creditado imediatamente em `current_xp` do usuário.
       - Uma segunda transação é gravada no ledger `user_xp_transactions`:
         - `source = 'LOOTBOX_DUPLICATE_CASHBACK'`
         - `amount = +cashback_xp`
         - `balance_after = current_xp`
         - `description = 'Cashback por Item Duplicado: [Nome do Item] ([Raridade])'`
  4. **Ledger de Auditoria de Sorteios (`lootbox_opening_logs`):**
     - Toda abertura de caixa DEVE persistir um registro imutável na tabela `lootbox_opening_logs`:
       - `id`: Identificador único (UUID)
       - `user_id`: Identificador do estudante
       - `box_tier`: Enum do tier aberto
       - `cost_xp`: Valor debitado
       - `item_id_dropped`: Código do item contemplado
       - `item_rarity`: Raridade sorteada
       - `is_duplicate`: Flag booleana indicando duplicidade
       - `cashback_xp_awarded`: Valor de XP devolvido (0 se novo)
       - `opened_at`: Timestamp UTC da operação
- **Condições de Ativação:** Disparo do endpoint `POST /api/v1/clinic/lootboxes/open` com payload contendo `{ "tier": "TIER_X" }`.
- **Resultado Esperado:** Transação atômica concluída com sucesso, débito correto, concessão de item novo ou crédito imediato de cashback com duplo registro contábil, auditoria gravada e payload HTTP 200 retornado ao cliente.
- **Exceção / Mensagem de Erro:**
  - Saldo de XP insuficiente: HTTP `422 Unprocessable Entity` com mensagem: `"Saldo de XP insuficiente para abrir esta Caixa da Sorte."`.
  - Conflito de concorrência / lock timeout: HTTP `409 Conflict` com mensagem: `"Operação em processamento. Por favor, aguarde alguns instantes."`.

---

## 3. Enquadramento LGPD & Privacidade (Art. 7º e 11 da LGPD)

| Dado / Atributo | Classificação LGPD | Base Legal Aplicada | Finalidade Específica e Proporcional |
| :--- | :--- | :--- | :--- |
| `gender` (Gênero do Avatar) | Dado Pessoal (Preferência de Interface) | Execução de Contrato (Art. 7º, V) | Customização cosmética visual do personagem do jogo/avatar. Não constitui dado sensível de saúde nem biometria do estudante. |
| `wall_theme` / `floor_theme` | Dado Comportamental / Preferência | Execução de Contrato (Art. 7º, V) | Armazenamento de preferências estéticas e customização do espaço virtual. |
| `skin_coat`, `skin_stethoscope`, `skin_accessory` | Histórico de Gamificação | Execução de Contrato (Art. 7º, V) | Registro de itens adquiridos e equipados na conta gamificada do estudante. |
| `clinic_items_catalog` | Dado Público do Sistema | N/A (Não Pessoal) | Catálogo de itens do jogo gamificado. |
| `lootbox_opening_logs.user_id` | Identificador de Conta | Execução de Contrato (Art. 7º, V) | Rastreabilidade e auditoria de transações do jogo para suporte ao estudante e proteção contra fraudes. |
| `box_tier`, `cost_xp`, `item_id_dropped`, `cashback_xp_awarded` | Metadados de Gamificação | Execução de Contrato (Art. 7º, V) | Registro contábil da economia interna do aplicativo. Não envolve dados de saúde nem PII sensível. |

---

## 4. Matriz de Cenários e Edge Cases

| ID | Cenário / Entrada | Comportamento Esperado | Código HTTP |
| :--- | :--- | :--- | :--- |
| **C-05** | Aplicação de papel de parede adquirido (`ped_papel_safari`) | Atualiza `user_clinics.wall_theme` e pinta as paredes traseiras sem ocupar tiles no piso. | `200 OK` |
| **C-06** | Posicionamento de item de parede (`ped_regua_girafa`) com móvel de chão sob ele | Aceita fixação na parede e permite que a maca no chão ocupe o tile correspondente sem indicar colisão. | `200 OK` |
| **C-07** | Tentativa de sobrepor dois itens de parede no mesmo tile e altura | Detecta sobreposição no eixo z/parede e bloqueia a ação informando conflito. | `422 Unprocessable Entity` |
| **C-08** | Alternância gratuita de gênero do avatar (`FEMALE` para `MALE`) | Atualiza `gender` sem debitar `current_xp` e atualiza a base do sprite. | `200 OK` |
| **C-09** | Tentativa de equipar skin avançada sem saldo de XP suficiente na compra | Bloqueia a transação sem alterar o saldo nem equipar a peça. | `422 Unprocessable Entity` |
| **C-10** | Clique consecutivo no avatar para exibir balão de fala | Reinicia animação do balão de diálogo e seleciona nova fala sem acúmulo de listeners. | `200 OK` |
| **C-11** | Clique no tile (0, 0) com item em mãos para posicionamento | O clique registra exatamente em (0, 0) sem sofrer interceptação pelo item posicionado em (1, 1). | `200 OK` |
| **C-12** | Movimentação rápida do mouse no grid isométrico em modo edição | O ghost preview acompanha suavemente cada tile sem reter o foco nem impedir mouseenter dos vizinhos. | `200 OK` |
| **C-13** | Acesso ao catálogo completo com mais de 100 itens cadastrados | Retorna lista ordenada de 100+ itens com metadados íntegros, divididos nas 4 abas sem degradação de FPS. | `200 OK` |
| **C-14** | Compra de item de nível avançado (ex: Nível 5) em clínica de Nível 1 | Bloqueia a compra informando que o nível de expansão exigido não foi atingido. | `403 Forbidden` |
| **C-15** | Renderização da página `/minha-clinica` após remoção da barra de estudo | Exibe o viewport isométrica com imersão ampliada e zero referências ao seletor de simulação de XP no DOM. | `200 OK` |
| **C-16** | Estudante tenta comprar item com `is_lootbox_exclusive = true` via loja comum | Bloqueia compra e informa exclusividade de lootbox | `403 Forbidden` |
| **C-17** | Abertura de Caixa do Residente com saldo suficiente | Debita 1.500 XP, sorteia item segundo tabela e credita no inventário | `200 OK` |
| **C-18** | Abertura de Caixa sem saldo suficiente de `current_xp` | Bloqueia a abertura sem debitar XP nem gerar log | `422 Unprocessable Entity` |
| **C-19** | Abertura com drop de item já possuído pelo usuário (duplicata) | Não duplica item; credita cashback correspondente à raridade e registra ledger | `200 OK` |
| **C-20** | Abertura da Caixa do Especialista | Garante drop com raridade mínima RARE (0% COMMON) | `200 OK` |
| **C-21** | Abertura da Caixa do Chefe de Ala | Garante drop exclusivo EPIC ou LEGENDARY (0% COMMON e 0% RARE) | `200 OK` |
| **C-22** | Requisição de abertura passando Tier inexistente no payload | Rejeita requisição com lista de tiers permitidos | `400 Bad Request` |
| **C-23** | Disparo de 2 requisições simultâneas de abertura com saldo para apenas 1 | Lock pessimista processa a 1ª e rejeita a 2ª por saldo insuficiente | `422 Unprocessable Entity` / `409 Conflict` |
| **C-24** | Consulta do catálogo com filtro por raridade | Retorna itens com seus respectivos badges sem alterar os 104 itens existentes | `200 OK` |
