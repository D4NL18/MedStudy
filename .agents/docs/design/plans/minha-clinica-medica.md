/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */

# Design Plan: Minha Clínica Médica (Gamificação Isométrica 2.5D & Motor de XP) 📐🎨

> **Localização Mandatória:** `.agents/docs/design/plans/minha-clinica-medica.md`  
> **Autor:** Designer (`designer.md`) / `uiux-expert` + `animejs-animation`  
> **Auditor:** UX Reviewer (`ux_reviewer.md`)  
> **Executor:** Desenvolvedor (`developer.md`)  
> **Referências:** `.agents/docs/design/DESIGN_SYSTEM.md`, `.agents/rules/frontend-ui-anti-patterns.md`, `.agents/rules/frontend-design-system-rules.md` e `.agents/docs/business_rules/minha-clinica-medica.md` (`P-080` a `P-086`)

---

## 1. Identificação & Objetivo da Tarefa
- **User Stories Relacionadas:**
  - `US-01` — Motor de XP e Dualidade de Saldos (`P-080`, `P-081`)
  - `US-02` — Progressão e Expansão Física da Clínica em 6 Níveis (`P-082`)
  - `US-03` — Catálogo de 27 Itens, Compra Atômica e Validação Espacial (`P-083`, `P-084`)
  - `US-04` — Viewport Isométrico 2.5D Ultra-Leve e Page Visibility (`P-085`)
  - `US-05` — Modo Edição, Loja por Abas, Ghost Preview, Toast de XP e Áudio Cozy (`P-086`)
- **Objetivo de UX:** Transformar o esforço diário de estudo médico (questões, flashcards, videoaulas e simulados) em uma experiência tangível, acolhedora (*Cozy Medical Tycoon*) e livre de ansiedade. O estudante constrói, expande e decora seu próprio consultório/instituto médico em projeção isométrica 2.5D estilo diorama (*cross-section*), com feedback imediato de XP, micro-interações táteis nos 27 itens colecionáveis e zero impacto de performance no navegador.
- **Decisões do Brainstorming & Macroestrutura Hallmark:**
  - **Macroestrutura Selecionada:** `05-workbench.md` (Interface estilo *Interactive Isometric Studio Workbench* com HUD flutuante tátil e dock deslizante inferior).
  - **Mood Estético:** *Soft SaaS Premium & Cozy Medical Tycoon* (inspirado na precisão acolhedora de dioramas médicos escandinavos, iluminação âmbar suave e detalhes lúdicos na Ala Pediátrica).

---

## 2. Checklist Anti-IA (Filtro Anti-Slop Obrigatório)

- [x] **Sem "AI Purple":** Nenhum gradiente genérico azul-roxo utilizado. Identidade ancorada em Teal Médico (`--color-primary: #0D9488`), Âmbar Quente para XP (`--color-accent: #F59E0B`) e escala neutra Slate (`--color-neutral-50` a `--color-neutral-950`).
- [x] **Sem 3 Colunas Mecânicas:** Layout foge de grades estáticas de 3 colunas; adota um Canvas/SVG Isométrico 2.5D vivo em tela cheia/container dedicado com HUD flutuante assimétrico e gaveta inferior deslizante (*Bottom Sheet Dock*).
- [x] **Tipografia com Font Pairing & Pureza Tipográfica:** Títulos em `'Plus Jakarta Sans'` (romano, zero cabeçalhos em itálico), textos e descrições em `'Inter'` e contadores numéricos auditáveis (`lifetime_xp`, `current_xp`, coordenadas `(x,y)`, multiplicador de streak `1.50x`) estritamente em `'JetBrains Mono'` com `font-variant-numeric: tabular-nums`.
- [x] **White Space Ativo:** Pelo menos 25% da área do `ClinicViewportComponent` permanece como respiro negativo ao redor do diorama isométrico, evitando poluição visual e sobreposição de HUDs.
- [x] **Copywriting Humano:** Textos orientados ao universo médico estudantil brasileiro (*"Box do Internato"*, *"Ala Pediátrica"*, *"+40 XP (Salvo na Clínica)"*).
- [x] **Zero Spinners Solitários:** Carregamento inicial da clínica utiliza um **Skeleton Loader Isométrico Shimmer** (losango 2:1 pulsando em `--color-neutral-100` / `--color-neutral-200` + placeholders geométricos do HUD superior e da barra inferior).
- [x] **Zero Telas Brancas Vazias:** Categorias sem itens adquiridos no filtro "Meus Itens" exibem **Empty State** contextualizado com ilustração SVG isométrica de caixa médica aberta, texto acolhedor e CTA direto para a aba da loja.
- [x] **Zero Fake Chrome:** Proibido desenhar falsas janelas de navegador ou molduras de celular ao redor do viewport.

---

## 3. Tokens do Design System Aplicados nesta Feature

| Categoria | Tokens Utilizados (`:root`) | Valores Associados | Aplicação na "Minha Clínica Médica" |
| :--- | :--- | :--- | :--- |
| **Superfícies & Diorama** | `--color-neutral-50`, `--color-neutral-100`, `--color-neutral-200` | `#F8FAFC`, `#F1F5F9`, `#E2E8F0` | Fundo do canvas isométrico, superfícies do HUD flutuante, pisos base e divisórias do dock |
| **Superfícies Dark / Contraste** | `--color-neutral-800`, `--color-neutral-900`, `--color-neutral-950` | `#1E293B`, `#0F172A`, `#020617` | Tooltips de itens, textos principais, modo noturno opcional do diorama |
| **Textos Secundários** | `--color-neutral-500`, `--color-neutral-600`, `--color-neutral-700` | `#64748B`, `#475569`, `#334155` | Legendas de pré-requisito de nível, descrições de itens e rótulos de controles |
| **Marca Primária (Médica)** | `--color-primary`, `--color-primary-hover`, `--color-primary-subtle` | `#0D9488`, `#0F766E`, `#F0FDFA` | Botão "Modo Edição", aba ativa da loja, botão "Expandir Clínica", anel de foco WCAG |
| **Economia de XP & Streak** | `--color-accent`, `--color-warning`, `--color-warning-bg` | `#F59E0B`, `#F59E0B`, `#FFFBEB` | Badges de `current_xp`, barra de progresso de `lifetime_xp`, partículas douradas e Toast de XP |
| **Ghost Válido & Sucesso** | `--color-success`, `--color-success-bg` | `#10B981`, `#ECFDF5` | *Ghost Preview* isométrico válido (`rgba(16, 185, 129, 0.35)` + stroke `var(--color-success)`) e confirmação de compra |
| **Ghost Colisão & Erro** | `--color-danger`, `--color-danger-bg` | `#EF4444`, `#FEF2F2` | *Ghost Preview* em colisão/fora do grid (`rgba(239, 68, 68, 0.35)` + stroke `var(--color-danger)`) e erro de XP insuficiente |
| **Tipografia** | `--font-family-display`, `--font-family-body`, `--font-family-mono` | `'Plus Jakarta Sans'`, `'Inter'`, `'JetBrains Mono'` | Títulos de nível da clínica, nomes de itens no catálogo e contadores numéricos de XP/coordenadas |
| **Espaçamento (Grid 8pt)** | `--space-1` a `--space-12` | `4px` a `48px` | Paddings internos dos cards da loja (`--space-4`), gaps da barra (`--space-3`), margens do HUD (`--space-6`) |
| **Raios de Borda** | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` | `4px`, `8px`, `12px`, `16px`, `9999px` | Pills de XP (`--radius-full`), botões de zoom (`--radius-md`), cards de itens (`--radius-lg`), dock (`--radius-xl`) |
| **Transições** | `--transition-fast`, `--transition-normal` | `150ms`, `250ms cubic-bezier(0.4, 0, 0.2, 1)` | Hover nos controles flutuantes, abertura da gaveta de edição e troca de abas |

---

## 4. Arquitetura Visual e Anatomia dos Componentes

### 4.1. Geometria Isométrica 2:1 e Depth Sorting (`ClinicViewportComponent`)
- **Tile 2:1:** `TILE_W = 64px`, `TILE_H = 32px`.
- **Projeção Grid-to-Screen:**
  $$\text{screen\_x} = \text{origin\_x} + (\text{grid\_x} - \text{grid\_y}) \times 32$$
  $$\text{screen\_y} = \text{origin\_y} + (\text{grid\_x} + \text{grid\_y}) \times 16$$
- **Ordenação de Profundidade (Painter's Algorithm):**
  $$\text{depth} = (\text{grid\_x} + \text{grid\_y}) \times 1000 + z$$
- **Divisão de Ambientes por Nível (`P-082`):**
  - Nível 1 (`4x4`): Box do Internato.
  - Nível 2 (`6x6`): Consultório Júnior.
  - Nível 3 (`8x8`): Consultório Master com Hall.
  - Nível 4 (`12x6`): Clínica 2 Ambientes (Recepção + Consultório).
  - Nível 5 (`12x12`): Clínica Integrada com Ala Pediátrica.
  - Nível 6 (`16x12`): Instituto Médico Completo (Ala Pediátrica, Sala de Procedimentos/ECG, Consultório Master com varanda envidraçada e Lounge com café).

### 4.2. Barra Inferior Deslizante de Edição / Decoração (`P-083`, `P-084`, `P-086`)
- **4 Abas:** `Pediatria` (10 itens), `Móveis` (6 itens), `Equipamentos` (6 itens), `Conforto` (5 itens).
- **Ghost Preview:** Verde (`rgba(16, 185, 129, 0.35)` + `#10B981`) para posição válida; Vermelho (`rgba(239, 68, 68, 0.35)` + `#EF4444`) para colisão ou extrapolação de limites.
- **Rotação:** `0` (SE) e `1` (SW) via botão ou tecla `R`.

---

## 5. Matriz Obrigatória dos 8 Estados Interativos

| # | Estado | Especificação Visual e Comportamental (Tokens `:root`) |
| :---: | :--- | :--- |
| **1** | **Default (Ocioso)** | Clínica renderizada em 2.5D com iluminação quente; loops suaves ativos; HUD exibindo `lifetime_xp`, `current_xp` e nível atual com contraste WCAG AA (`>= 4.5:1`). |
| **2** | **Hover** | Elevação suave `transform: translateY(-2px)` nos cards/botões; realce sutil nos itens interativos do diorama (`cursor: pointer`). |
| **3** | **Focus (`:focus-visible`)** | Navegação completa via teclado com anel de foco `outline: 2px solid var(--color-primary); outline-offset: 2px;`. |
| **4** | **Active / Pressed** | Feedback imediato ao clicar: `transform: translateY(0) scale(0.97)` e disparo de animação temática no item clicado. |
| **5** | **Loading (Skeleton Shimmer)** | Placa isométrica 2:1 shimmer no centro do viewport + blocos shimmer no HUD e nos cards do dock (zero spinners solitários). |
| **6** | **Empty State** | Container ilustrado com maleta médica aberta quando o filtro de inventário não possui itens guardados na aba atual, com CTA para ver catálogo. |
| **7** | **Error State** | Ghost Preview vermelho em colisão/fora do grid, alerta de XP insuficiente e banner de erro de rede com botão de tentar novamente. |
| **8** | **Disabled / Locked** | Itens com `min_expansion_level > clinic.expansion_level` exibem cadeado `"🔒 Requer Nível X"` e botão desabilitado. |

---

## 6. Aditivo de UI/UX: Superfícies, Fixação Vertical e Avatar Médico 2.5D (`US-06`, `US-07`, `P-087`, `P-088`, `P-089`)

### 6.1. Especificação Visual do Avatar Médico 2.5D (`P-089`, `US-07`)
- **Dimensões do Sprite:** `32px` de largura por `64px` de altura (`viewBox="0 0 32 64"`).
- **Escala de Malha:** Ocupa meio tile no chão de raio (`(avatar_x, avatar_y)`), harmonizando com a mesa escandinava (`128x64px`) e cadeira (`64x32px`).
- **Ponto de Âncora (Feet Anchor):** A coordenada `(avatar_x, avatar_y)` projeta a base dos pés com `transform: translate(-16px, -60px)`.
- **Depth Sorting no Painter's Algorithm:**
  $$\text{depth} = (\text{avatar\_x} + \text{avatar\_y}) \times 1000 + 10$$
- **Base Dr. (`MALE`) e Dra. (`FEMALE`) — 100% Gratuita e Acolhedora:**
  - Traços minimalistas amigáveis, olhos expressivos de 2px e rubor pêssego (`rgba(248, 113, 113, 0.3)`).
  - Dr. com corte curto moderno; Dra. com coque hospitalar alto ou rabo de cavalo.
  - Alternância gratuita instantânea via botão no cabeçalho do guarda-roupa.
- **Z-Stack Modular SVG (4 Camadas Independentes):**
  - **Camada 1 (`layer-body`):** Sapatos ortopédicos brancos, calça neutra, braços e cabeça.
  - **Camada 2 (`layer-coat`):** `coat_intern_white` (grátis), `coat_scrubs_navy` (500 XP), `coat_scrubs_green` (800 XP), `coat_pediatric_dino` (1.200 XP), `coat_executive_doc` (2.500 XP).
  - **Camada 3 (`layer-steth`):** `steth_none` (grátis), `steth_classic_black` (grátis), `steth_cardio_burgundy` (700 XP), `ped_steth_elefante` (950 XP), `steth_gold_master` (3.000 XP com reflexo 24k).
  - **Camada 4 (`layer-accessory`):** `acc_none` (grátis), `acc_glasses_classic` (400 XP), `acc_ped_gorro_colorido` (600 XP), `acc_prontuario_clipboard` (850 XP).
- **Animação Idle Leve (CSS `@keyframes` de Respiração):**
  - Oscilação vertical de 1.5px com período de 3.2s via CSS transforms (GPU-accelerated, zero CPU loop), com suporte a `prefers-reduced-motion`.
- **Micro-Interação: Aceno e Balão de Diálogo (*Speech Bubble*):**
  - Ao clicar no avatar: animação de aceno de 600ms e balão de fala flutuante com fundo `--color-neutral-900: #0F172A`, texto `--color-neutral-50: #F8FAFC`, borda 12px e frases clínicas acolhedoras com rotação randômica.

### 6.2. Especificação Visual de Superfícies de Parede e Piso (`P-087`, `US-06`)
- **Desacoplamento de Malha de Colisão:**
  - Revestimentos são atributos globais da clínica (`user_clinics.wall_theme` e `user_clinics.floor_theme`), deixando o chão desimpedido para disposição de móveis.
- **Texturas SVG de Piso:**
  - `floor_porcelanato_cinza` (Grátis): Ladrilhos cinza acetinado (`#F1F5F9`) com rejunte milimétrico `--color-neutral-200: #E2E8F0`.
  - `floor_madeira_scandi`: Tábuas corridas em carvalho claro (`#E8D8C4`), veios sutis de madeira.
  - `floor_vinilico_cirurgico`: Manta contínua sem rejunte verde-água hospitalar (`#CCFBF1`).
  - `floor_marmore_carrara`: Placas de mármore branco nobre com veios sinuosos e frisos dourados (`#F59E0B`).
- **Texturas SVG de Parede:**
  - `wall_clean_white` (Grátis): Gesso acetinado liso com rodapé embutido de 6px.
  - `ped_papel_safari`: Estampa de filhotes da savana (girafas, leõezinhos, folhagens tropicais) em tons pastéis aquarelados, conectada perfeitamente na quina Norte sem cortes abruptos.
  - `wall_tijolinho_branco`: Tijolos retangulares brancos neve (`#F8FAFC`) com argamassa sombreada.
  - `wall_menta_hospitalar`: Verde menta calmante (`#E6F4EA`) com friso protetor de meia-altura em carvalho.

### 6.3. Especificação de Itens de Parede (Wall-Mounted Items) (`P-088`, `US-06`)
- **Desacoplamento de Piso:** `placement_type = 'WALL'` e `footprint = 0 x 0`. Zero colisão com móveis posicionados no piso abaixo deles.
- **Ancoragem Vertical:**
  - `wall_side`: `'NW'` (parede esquerda) ou `'NE'` (parede direita).
  - `wall_tile_index`: Segmento do piso correspondente.
  - `elevation_z`: Elevação vertical em pixels (padrão `45px`, faixa admitida `20px` a `80px`).
- **Camada no Painter's Algorithm:** `wallMountedItemsLayer` (`zLayer = 20`), desenhado imediatamente após a parede e antes dos móveis do chão.
- **Itens de Parede:**
  - `ped_regua_girafa`: Régua infantil em formato de girafa amarela com escala métrica; ao clicar, o passarinho no topo desliza emitindo partículas douradas.
  - `negatoscopio_led`: Painel slim de LED com radiografia de tórax PA em alta definição; ao clicar comuta luz on/off com brilho difuso.

### 6.4. Critérios de Aceite para UX Reviewer (DoD Visual da Extensão)
- [ ] Avatar médico 2.5D com proporção harmônica de 32x64px pousado na laje do piso sem flutuar.
- [ ] 4 camadas SVG (Base, Roupa, Esteto, Acessório) empilhadas com alinhamento perfeito.
- [ ] Animação idle por CSS `@keyframes` sem consumo contínuo de CPU/JS.
- [ ] Papéis de parede e pisos aplicados como revestimento global sem ocupar células de circulação no chão.
- [ ] Papel de parede Safari conectado continuamente na quina central sem quebra de padrão.
- [ ] Régua girafa e negatoscópio fixados verticalmente nas paredes sem bloquear móveis de chão abaixo deles.
- [ ] Todos os 8 estados interativos implementados com tokens oficiais do `DESIGN_SYSTEM.md`.

---

## 7. Aditivo de UI/UX: Picking Isométrico, Limpeza de Topo e Megacatálogo 104 Itens (`US-08`, `US-09`, `US-10`, `P-090`, `P-091`, `P-092`)

### 7.1. Resolução Geométrica de Picking Isométrico (`P-090`, `US-08`)
- **Problema de Bounding Box Transparente:**
  - Containers HTML retangulares (`.placed-item-anchor`, `.doctor-avatar-anchor`, `.ghost-item-anchor`) extrapolam a silhueta losangular dos tiles 2:1. Em posições como `(1, 1)`, o topo transparente do container cobria o tile `(0, 0)`, capturando o clique do usuário de forma errônea.
- **Diretriz de Pointer Events:**
  - **No Modo Edição / Posicionamento:**
    - `.ghost-item-anchor { pointer-events: none !important; }`
    - `.doctor-avatar-anchor { pointer-events: none !important; }`
    - `.placed-item-anchor { pointer-events: none !important; }`
    - O evento do mouse incide diretamente no `<polygon class="iso-tile">` da coordenada `(x, y)`, garantindo que clicar em `(0, 0)` registre com fidelidade matemática `(0, 0)`.
  - **No Modo Navegação:**
    - As âncoras usam `pointer-events: none;`, enquanto os elementos visíveis do SVG interno recebem `pointer-events: visiblePainted;`.

### 7.2. Maximização da Imersão e Supressão da Barra de Estudo no Topo (`P-091`, `US-09`)
- **Remoção Visual:** A barra `.study-actions-strip` é suprimida do template, limpando o topo da tela e dando destaque ao diorama do consultório e aos indicadores reais de Nível, XP e Streak.
- **Feedback Reativo:** O componente `XpRewardToastComponent` permanece ativo em overlay superior direito (`z-index: 10000`) para celebrar ações de estudo autênticas.

### 7.3. Arquitetura Modular do Megacatálogo de 104 Itens (`P-092`, `US-10`)
- **Distribuição Simétrica por Abas:**
  - 4 abas no dock inferior com exatamente 26 itens cada (`Pediatria`, `Móveis`, `Equipamentos`, `Conforto`).
- **Arquétipos Vetoriais no `ClinicItemSvgComponent`:**
  - Para garantir o teto de **300 KB gzipped**, os 104 itens são gerados combinando arquétipos visuais modulares parametrizáveis (mesas, macas, estantes, armários, monitores, assentos, equipamentos de diagnóstico, mascotes e artes de parede) com paleta oficial do Design System.
- **Indicadores nos Cards da Loja:**
  - Badge de footprint (`1x1`, `2x1`, `2x2`, `3x1`, `Parede`).
  - Preço em XP com ícone de moeda/raio âmbar.
  - Bloqueio visual com cadeado para níveis de expansão superiores ao atual.

---

## 8. Aditivo de UI/UX: Lootboxes Médicas ("Caixas de Suprimentos Médicos"), Sistema de Raridades e Catálogo de 50 Itens Especiais (`US-11`, `US-12`, `US-13`, `P-093`, `P-094`, `P-095`)

### 8.1. Filosofia Visual & Combate a Padrões Predatórios (Hallmark Anti-AI-Slop & Cozy Tycoon)
- **Zero Mecânicas Predatórias de Cassino:**
  - ❌ Proibido o uso de roletas giratórias caça-níqueis ("slot machine spinning reels").
  - ❌ Proibido o efeito "near-miss" manipulativo (desacelerar propositalmente ao lado de um item lendário para induzir frustração/vício).
  - ❌ Proibido contadores de urgência regressivos ("Oferta relâmpago expira em 10 minutos!").
  - ❌ Proibido sons estridentes de cassino ou sirenes de caça-níqueis.
- **Estética Acolhedora (Cozy Medical Tycoon):**
  - As caixas são caixas de suprimentos médicos e maletas de atendimento clínico recém-entregues ao consultório. O estudante conquistou esses suprimentos através de esforço cognitivo legítimo (resolução de questões, revisão de flashcards e simulados).
  - A experiência de abertura transmite o prazer tátil e a serenidade de abrir uma maleta médica nova com instrumentos reluzentes e cuidadosamente organizados.
- **Transparência Algorítmica Radical (CDC / LGPD):**
  - Todas as probabilidades de drop por raridade (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`) são exibidas publicamente e sem pegadinhas diretamente no card do Tier antes da abertura, acompanhadas de um botão informativo *"Ver Probabilidades"*.

---

### 8.2. Apresentação Visual dos 3 Tiers de Caixas (Maletas Médicas Isométricas 2.5D)

| Tier | Nome da Caixa | Custo em XP | Conceito Visual e Materiais da Maleta | Odds Transparentes de Drop | Selos de Destaque no Card |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **Tier 1** | **Caixa do Residente**<br>`TIER_1_RESIDENT` | `500 XP` | **Kit de Emergência do Internato:** Maleta de primeiros socorros em lona náutica reforçada cor creme hospitalar (`#F1F5F9`) com costuras cinza-ardósia (`#CBD5E1`), cruz médica verde sutil (`#10B981`) no centro, cantos emborrachados pretos e alça ergonômica flexível. | • **Comum:** `60,00%`<br>• **Raro:** `30,00%`<br>• **Épico:** `9,00%`<br>• **Lendário:** `1,00%` | Badge cinza: *"Kit do Interno"* |
| **Tier 2** | **Caixa do Especialista**<br>`TIER_2_SPECIALIST` | `1.500 XP` | **Maleta Gladstone Clássica:** Maleta médica tradicional em couro azul marinho cirúrgico acetinado (`#0369A1` / `#0F172A`), frisos de reforço em latão fosco (`#D97706`), fechadura de alavanca dupla articulada e alça tubular costurada à mão. | • **Comum:** `0,00%` (Zero!)<br>• **Raro:** `65,00%`<br>• **Épico:** `28,00%`<br>• **Lendário:** `7,00%` | Badge azul com brilho: *"✦ Garantia Zero Comuns"* |
| **Tier 3** | **Caixa do Chefe de Ala**<br>`TIER_3_CHIEF_OF_STAFF` | `4.000 XP` | **Case Executivo de Alta Tecnologia:** Maleta hermética de transporte biomédico em alumínio anodizado prata-grafite (`#334155` / `#1E293B`) com cantoneiras de titânio, detalhes em ouro escovado 24k (`#F59E0B`), display OLED milimétrico na trava e fenda com feixe de fibra óptica ciano. | • **Comum:** `0,00%`<br>• **Raro:** `0,00%` (Zero!)<br>• **Épico:** `75,00%`<br>• **Lendário:** `25,00%` (1 em 4!) | Badge dourado luminoso: *"👑 Elite: 1 em 4 Lendário"* |

- **Anatomia do Card do Tier na Loja:**
  - Largura: `280px` (desktop) / `100%` (mobile).
  - Preview Isométrico da Maleta: SVG 2.5D com `viewBox="0 0 120 96"` flutuando suavemente em repouso (`transform: translateY(-2px)` em período de 4s via CSS).
  - Preço em XP com chip destacado em `--color-accent: #F59E0B` e tipografia `JetBrains Mono` com `font-variant-numeric: tabular-nums`.
  - Tabela resumida de probabilidades com barras de distribuição horizontal em micro-gráficos coloridos por raridade.
  - Botão Primário de Ação: `[Abrir Caixa]` com feedback de hover e trava de saldo insuficiente.

---

### 8.3. Paleta de Cores, Tokens de Iluminação e Raridade (:root)

```css
:root {
  /* Tokens de Raridade Oficial */
  --rarity-common: #94A3B8;                 /* Slate 400 - Cirúrgico Básico */
  --rarity-common-bg: rgba(148, 163, 184, 0.12);
  --rarity-common-glow: 0 0 16px rgba(148, 163, 184, 0.35);

  --rarity-rare: #0284C7;                   /* Sky 600 - Azul Hospitalar */
  --rarity-rare-highlight: #38BDF8;         /* Sky 400 - Realce Safira */
  --rarity-rare-bg: rgba(2, 132, 199, 0.12);
  --rarity-rare-glow: 0 0 20px rgba(56, 189, 248, 0.45);

  --rarity-epic: #A855F7;                   /* Purple 500 - Ametista Diagnóstica */
  --rarity-epic-highlight: #C084FC;         /* Purple 400 - Feixe Violeta */
  --rarity-epic-bg: rgba(168, 85, 247, 0.12);
  --rarity-epic-glow: 0 0 24px rgba(168, 85, 247, 0.50);

  --rarity-legendary: #F59E0B;              /* Amber 500 - Ouro Relíquia 24k */
  --rarity-legendary-highlight: #FCD34D;    /* Amber 300 - Raio Solar */
  --rarity-legendary-bg: rgba(245, 158, 11, 0.15);
  --rarity-legendary-glow: 0 0 32px rgba(245, 158, 11, 0.65);
}
```

---

### 8.4. Micro-Animação de Abertura da Maleta
- **Tempo Total:** `1.35 segundos` (calibrado exatamente para antecipação prazerosa sem frustrar ou atrasar o estudante).
- **Controle de Interação:** Durante toda a timeline, o modal aplica `pointer-events: none` geral na tela de unboxing, impedindo duplicidade de requisições ou interrupções de renderização.

#### Coreografia da Timeline:
1. **Fase 1: Destravamento Mecânico das Fivelas (0.00s a 0.35s)**
   - Elementos: Fivelas metálicas esquerda e direita.
   - Movimento: Rotação angular para fora e recuo tátil da maleta (`translateY: [0, 3px]`).
   - Áudio Sintético: Clique mecânico de precisão via Web Audio API.
2. **Fase 2: Fresta de Luz e Antecipação de Raridade (0.35s a 0.75s)**
   - Elementos: Tampa da maleta e Feixe de Luz Volumétrico.
   - Movimento: A tampa levanta em perspectiva 3D (`rotateX: [0, -45deg]`). Feixe de luz na cor exata da raridade sorteada (`var(--rarity-{rarity})`).
3. **Fase 3: Abertura Plena e Ascensão do Item (0.75s a 1.20s)**
   - Elementos: Tampa aberta, Item 2.5D e Partículas Estelares.
   - Movimento: O item sorteado ascende suavemente do interior com micro-partículas irradiando em leque.
   - Áudio Musical de Raridade:
     - `COMMON`: Tom suave senoidal de 440 Hz.
     - `RARE`: Arpeggio de 2 notas (Dó5 - Sol5).
     - `EPIC`: Acorde em 3 tons (Dó5 - Mi5 - Sol5).
     - `LEGENDARY`: Fanfarra acolhedora em 4 tons (Dó5 - Mi5 - Sol5 - Dó6) com brilho estelar.
4. **Fase 4: Revelação Triunfante do Card de Recompensa (1.20s a 1.35s)**
   - Painel informativo, badges de raridade e botões de ação liberados imediatamente (`pointer-events: auto`).

---

### 8.5. Acessibilidade e Redução de Movimento (`prefers-reduced-motion: reduce`)
- Quando `prefers-reduced-motion: reduce` estiver ativo:
  - O suspense e rotação 3D são suprimidos.
  - Transição estática de fade-in suave de `200ms` exibindo a maleta aberta e o item já posicionado.
  - Leitores de tela recebem foco com `aria-live="polite"`.

---

### 8.6. Tela de Recompensa (Modal de Revelação do Item & Ações)
- **Estrutura Visual:**
  1. **Badge Superior de Raridade:** `★ ITEM COMUM` | `★★ ITEM RARO` | `★★★ ITEM ÉPICO` | `★★★★ ITEM LENDÁRIO`
  2. **Palco Central de Preview do Item (180x180px):** Renderizado pelo `ClinicItemSvgComponent`.
  3. **Identificação do Item:** Nome, categoria e footprint.
  4. **Selo de Exclusividade:** Se `is_lootbox_exclusive`, exibe `✦ Relíquia Exclusiva de Lootbox`.
  5. **Tratamento de Item Novo vs Duplicado com Cashback:**
     - Item Novo: `"✓ Novo item adicionado ao seu inventário!"`
     - Item Duplicado: `"♻ Você já possui este item na sua clínica! Duplicata reciclada com compensação justa: +{cashbackXp} XP creditados de volta."`
  6. **Ações:** `[Equipar / Posicionar Agora]`, `[Guardar no Inventário]` e `[Abrir Outra Caixa]`.

---

### 8.7. Matriz Completa dos 8 Estados Interativos dos Componentes de Lootbox

| # | Estado | Especificação Visual e Comportamental (Tokens `:root`) |
| :---: | :--- | :--- |
| **1** | **Default (Ocioso)** | Card do Tier renderizado com iluminação suave; maleta estática em 2.5D; badge de preço em `current_xp`; odds explícitas; botão `[Abrir Caixa]` habilitado. |
| **2** | **Hover** | O card se eleva `translateY(-3px)` com sombra Nível 2; aura de luz correspondente ao tier. |
| **3** | **Active / Pressed** | Depressão tátil imediata: `transform: scale(0.97)`. |
| **4** | **Focus-Visible** | `outline: 2px solid var(--color-primary); outline-offset: 2px;` navegável via Tab. |
| **5** | **Loading / Unboxing** | Modal de unboxing ativo; `pointer-events: none`; fivelas destravando; feixe de luz correspondente à raridade. |
| **6** | **Success / Reveal** | Apresentação triunfante do item em escala ampliada; halo luminoso na cor da raridade; dados de cashback se duplicado; botões liberados. |
| **7** | **Disabled / Saldo Insuficiente** | Se `current_xp < tier_cost_xp`: Card com opacidade `0.65`; botão desabilitado com tooltip informando XP faltante. |
| **8** | **Error / Concorrência** | Banner de erro acolhedor: *"Não foi possível abrir a caixa agora. Nenhum XP foi debitado da sua conta. Tente novamente."*. |

