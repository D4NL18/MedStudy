# Knowledge Graph & Project Memory

## Core Features & Completed Domains

### FLASHCARDS
- **Repetição Espaçada & Distribuição Futura (Story 1):** Novos cards são distribuídos em vales dos próximos dias usando algoritmo de carga de revisão para balancear o estudo diário. Edição suporta parsing bidirecional de TipTap e HTML.
- **Visualização sob Demanda / Modo Leitura (Story 2 - [P-030], [P-031]):**
  - **Ação na Tabela:** Botão `icon-btn` com ícone `eye` e `aria-label="Visualizar flashcard"` na coluna Ações de cada linha em `FlashcardsListComponent`.
  - **Ação NgRx:** Despacha `FlashcardsActions.openPreviewMode({ flashcard })`.
  - **Estado:** `FlashcardsState.isReadOnly: true`, `studyModeActive: true`, `queue: [flashcard]`.
  - **Comportamento Visual (`FlashcardsStudyComponent`):** Exibe o flashcard interativo com virada frente/verso, Markdown, TipTap e zoom em imagens. Oculta barra de progresso da sessão e suprime estritamente os botões de resultado ("Acertei" / "Errei") e botões de dificuldade ("Fácil", "Médio", "Difícil"). Nenhuma chamada de API de rating ou agendamento é disparada. Fechamento via `closeStudyMode` reseta `isReadOnly: false`.

### GAMIFICAÇÃO, FLASHCARDS & MAESTRIA CLÍNICA ([P-040], [P-041], [P-042], [P-050], [P-060], [P-070])
- **Micro-Mecânicas de Flashcards (Tópico 1):**
  - **Combo & Foco em Chamas ([P-040]):** HUD dinâmico na sessão de estudo. Aumenta em +1 com "Fácil" e "Médio". Dispara "Foco Quente 🔥" aos 5x (1.5x XP) e "Em Chamas ⚡🔥" aos 10x (2.0x XP). Reseta para 0 ao marcar "Difícil" ou errar.
  - **Bounty Cards ("Cards Sangrentos" - [P-042]):** Mapeados via `consecutiveHardCount >= 2` ou `easeFactor < 1.7`. Exibem moldura carmesim pulsante (`bounty-glow`) e badge "BOUNTY CARD • 3x XP".
  - **Inbox Zero / Celebração ([P-041]):** Ao zerar a fila do dia, exibe modal de vitória com animação de confetti, troféu dourado e métricas da sessão (total de cards, tempo de sessão, média de seg/card, precisão % e maior combo).
- **Árvore de Maestria Clínica Anatômica ([P-050]):**
  - Componente SVG interativo `CorpoHumanoMaestriaComponent` no Dashboard principal com as 5 grandes áreas médicas (Clínica Médica `#3B82F6`, Cirurgia Geral `#F97316`, Pediatria `#10B981`, GO `#EC4899`, Preventiva `#EAB308`).
  - Gradientes dinâmicos de preenchimento (`fill`) pelos 7 Níveis: Iniciante (0-14%), Bronze (15-29%), Prata (30-44%), Ouro (45-59%), Platina (60-74%), Rubi (75-84%), Esmeralda (85-94%), Diamante (95-100%).
  - Cálculo ponderado no backend: 50% questões/acerto, 30% flashcards/retenção, 20% aulas concluídas via `ClinicalMasteryService` em `GET /api/dashboard/maestria-clinica`.
- **Streak Repair (Tópico 4 - [P-060]):**
  - Se a ofensiva quebrou ontem, o usuário tem 24h para resgatar mediante meta de estudo intensivo (20 cards). Cooldown de 14 dias para evitar abuso. Bridge persistida na tabela `streak_repairs` da migration `V24` e integrada no cálculo de streak.
  - Exibido via `StreakRepairBannerComponent` no Dashboard.
- **22 Conquistas de Flashcards ([P-070]):**
  - Enum `BadgeType` estendido com 22 badges `FLASH_*` e novo contexto `BadgeContext.FLASHCARD_SESSION`. Suporte visual no perfil e celebrações.

### MINHA CLÍNICA MÉDICA — GAMIFICAÇÃO ISOMÉTRICA 2.5D & MOTOR DE XP ([P-080] a [P-086])
- **Dualidade de Saldos & Ledger ACID ([P-080]):**
  - `user_xp_accounts` mantém `lifetime_xp` (vitalício, monotônico, nunca decresce, define nível e desbloqueios) e `current_xp` (investível, debitado em compras de itens e ampliações de sala).
  - Toda mutação gera lançamento imutável em `user_xp_transactions` (`amount`, `balance_after`, `source`, `description`).
- **Motor Matemático de XP & Multiplicador de Streak ([P-081]):**
  - `StudyXpEngineService` (`POST /api/v1/study/action-reward`): Questões (`+15` submissão, `+25` acerto = `40 XP`, streaks 3/5/10: `+15`/`+30`/`+75`), Flashcards (`+8` fácil, `+12` médio, `+5` difícil, `+100` deck do dia), Videoaulas (`+50` cada 10min, `+80` conclusão, `+30` nota), Simulados (`+300 + round(acurácia% * 5)`).
  - Multiplicador de Streak Diário: `XP_Final = round(XP_Ação * (1 + Multiplicador_Streak))` (`0-2d: 0%`, `3-6d: +10%`, `7-13d: +20%`, `14-29d: +35%`, `30+d: +50%`).
- **Expansão Física em 6 Níveis ([P-082]):**
  - `ClinicExpansionLevel`: Nv.1 Box do Internato (`4x4`, grátis), Nv.2 Consultório Júnior (`6x6`, 1.200 XP / req 1.500), Nv.3 Consultório Master c/ Hall (`8x8`, 3.800 XP / req 4.500), Nv.4 Clínica 2 Ambientes (`12x6`, 8.500 XP / req 10.000), Nv.5 Clínica Integrada c/ Ala Pediátrica (`12x12`, 16.000 XP / req 20.000), Nv.6 Instituto Médico Completo (`16x12`, 32.000 XP / req 40.000).
- **Catálogo de 27 Itens & Validação Espacial Anti-Colisão ([P-083], [P-084]):**
  - Migration `V25__create_minha_clinica_tables.sql` popula os 27 itens em `clinic_items_catalog` (`10 pediatria`, `6 mobiliario`, `6 clinica`, `5 recepcao`).
  - Onboarding Nível 1 provisiona gratuitamente `mesa_scandi (0,0)`, `cadeira_ergonomica (0,1)` e `ped_maca_baleia (2,0)`.
  - `ClinicLayoutValidator` valida fronteiras do grid e colisão AABB 2D com inversão de `footprintX`/`footprintY` quando `rotation == 1`.
- **Renderizador Isométrico 2.5D Low-Footprint, Page Visibility & Áudio Cozy ([P-085], [P-086]):**
  - Rota lazy-loaded `/minha-clinica` (`17.61 kB` gzipped <= `300 KB`) com `ClinicViewportComponent` (projeção 2:1 `64x32px`, `depth = (x + y) * 1000 + z`, Ghost Preview verde/vermelho, pausa total de `requestAnimationFrame` quando `document.hidden === true`), `ClinicItemSvgComponent` (27 SVGs modulares interativos), `ClinicAudioService` (Web Audio API com mute persistido) e `XpRewardToastComponent` (`+{xp} XP (Salvo na Clínica)`).

### MINHA CLÍNICA MÉDICA: SUPERFÍCIES DESACOPLADAS & AVATAR MÉDICO ([P-087], [P-088], [P-089], ADR-008)
- **Desacoplamento de Revestimentos (Piso e Parede) ([P-087]):**
  - Texturas de parede (`wall_theme`) e piso (`floor_theme`) residem em `user_clinics`, desvinculadas da malha de colisão do chão.
  - O papel de parede (`ped_papel_safari`, `wallpaper_geometric_teal`, `wallpaper_brick_white`, etc.) é renderizado via `<clipPath>` sobre os polígonos das paredes traseiras NW e NE, eliminando o erro de obstruir o chão como obstáculo físico.
  - Pisos (`wood_light`, `marble_carrara`, `tatame_eva`, etc.) preenchem a laje isométrica como base visual contínua.
  - Endpoint `PUT /api/v1/clinic/surfaces` gerencia temas adquiridos com verificação de posse em `user_unlocked_skins`.
- **Fixação Vertical de Itens em Paredes Traseiras ([P-088]):**
  - Itens com `placement_type = 'WALL'` (`ped_regua_girafa`, `negatoscopio_led`) possuem pegada zero no solo (`footprint = 0x0`).
  - São ancorados nas paredes visíveis NW ou NE via `wall_side`, `wall_tile_index` e `elevation_z = 42px`.
  - O `ClinicLayoutValidator` valida sobreposição linear na parede sem interferir no piso, permitindo que móveis de solo (mesas, macas) fiquem posicionados diretamente abaixo deles.
- **Personagem Médico Virtual Residente 2.5D & Guarda-Roupa ([P-089]):**
  - Avatar SVG modular em 4 camadas sobrepostas (`Base Anatômica MALE/FEMALE`, `Jaleco/Scrub`, `Estetoscópio`, `Acessório`).
  - Alternância de gênero (`MALE` / `FEMALE`) é **100% gratuita**, sem custo de XP e sem barreiras.
  - Guarda-roupa em 3 slots cosméticos (`coat`, `stethoscope`, `accessory`) gerenciado por `user_doctor_avatar` e `user_unlocked_skins`.
  - Micro-animação idle suave em CSS (`@keyframes doctorBreathing`) com suspensão imediata via `Page Visibility API` (`animation-play-state: paused` quando `document.hidden === true`).
  - Balão de fala acolhedor (`DoctorSpeechBubbleComponent`) com frases motivacionais de estudo e semiologia ao clicar no personagem.
  - Endpoints `GET /api/v1/clinic/avatar`, `PUT /api/v1/clinic/avatar` e `POST /api/v1/clinic/avatar/skins/buy` com débito atômico em `current_xp` e conformidade integral com LGPD (Art. 7º, V).

### MINHA CLÍNICA MÉDICA: REFINAMENTO DE HIT-TESTING ISOMÉTRICO & MEGACATÁLOGO ([P-090], [P-091], [P-092], ADR-009)
- **Hit-Testing Pixel-Perfect & Isolamento de Ponteiro ([P-090]):**
  - Resolução do bug de deslocamento diagonal inferior direito (0,0 indo para 1,1) provocado pela sobreposição de bounding boxes retangulares transparentes dos móveis no grid 2.5D.
  - Implementado `.clinic-viewport-shell.is-placing` com `pointer-events: none !important` em todos os móveis e avatar durante o posicionamento ativo (`isPlacingItem`).
  - No modo normal, containers possuem `pointer-events: none` e o SVG aplica `pointer-events: visiblePainted`, garantindo hit-testing estrito nos traçados gráficos.
- **Maximização da Imersão & Remoção de Controles Simuladores ([P-091]):**
  - Remoção definitiva da barra de atalhos de estudo `.study-reward-bar` no topo da tela `/minha-clinica`.
  - O HUD superior preserva telemetria contábil (XP Vitalício, Saldo Investível, Nível, Streak com chama) e integra toasts reativos via `XpRewardToastComponent`.
- **Megacatálogo com 104 Itens Oficiais ([P-092]):**
  - Expansão do catálogo para 104 itens (26 por categoria: `pediatria`, `mobiliario`, `clinica`, `recepcao`), cadastrados via Flyway `V27__expand_clinic_catalog_to_104_items.sql` com `ON CONFLICT (id) DO UPDATE`.
  - Sincronização em toda a stack: `ClinicService.OFFICIAL_CATALOG_ITEMS`, `CLINIC_CATALOG_FALLBACK` em `clinic.model.ts`, abas e filtros com Signals reativos (`categoryTabs` com 26 por aba e `totalCatalogCount` com 104) em `minha-clinica.component.ts`, e arquétipos visuais modulares em `ClinicItemSvgComponent` (mantendo bundle lazy em `30.95 kB` transfer size).

### MINHA CLÍNICA MÉDICA: SISTEMA DE LOOTBOXES EM 3 TIERS, NÍVEIS DE RARIDADE & CATÁLOGO DE 50 ITENS ESPECIAIS EXCLUSIVOS ([P-093], [P-094], [P-095], ADR-010)
- **Sistema de Raridades em 4 Níveis & Calibração de Catálogo ([P-093]):**
  - Quatro tiers de raridade oficial: `COMMON` (#94A3B8, cinza ardósia), `RARE` (#0284C7, azul safira), `EPIC` (#A855F7, púrpura ametista), `LEGENDARY` (#F59E0B, ouro relíquia 24k).
  - Migration Flyway `V28__add_item_rarities_and_lootbox_system.sql` adiciona colunas `rarity` e `is_lootbox_exclusive` na tabela `clinic_items_catalog`.
  - 104 itens existentes calibrados com raridades e mantidos compráveis na loja com `current_xp` (`is_lootbox_exclusive = false`).
  - 50 novos itens especiais exclusivos cadastrados com `is_lootbox_exclusive = true` (18 raros, 22 épicos, 10 lendários), bloqueados para compra direta via HTTP 403 Forbidden em `ClinicService`.
- **Lootboxes em 3 Tiers & Probabilidades Transparentes Anti-Cassino ([P-094]):**
  - Zero mecânicas predatórias de cassino: sem spinning reels/roletas giratórias, sem efeito near-miss artificial, sem contadores regressivos anti-FOMO.
  - Três tiers temáticos com odds transparentes:
    - **Tier 1 - Caixa do Residente** (500 XP): 60% Comum, 30% Raro, 9% Épico, 1% Lendário.
    - **Tier 2 - Caixa do Especialista** (1.500 XP): 0% Comum (Zero Comuns!), 65% Raro, 28% Épico, 7% Lendário.
    - **Tier 3 - Caixa do Chefe de Ala** (4.000 XP): 0% Comum, 0% Raro (Zero Comuns e Raros!), 75% Épico, 25% Lendário (1 em 4!).
  - Endpoints `GET /api/v1/clinic/lootboxes` e `POST /api/v1/clinic/lootboxes/{tier}/open`.
  - Sorteio 100% server-side via `SecureRandom` criptográfico com lock pessimista (`findByUserIdForUpdate`) para prevenção estrita de double-spending e race conditions.
  - Tabela imutável de auditoria `lootbox_opening_logs` com registro de cada sorteio, custo, raridade e duplicatas.
- **Micro-Animação de Unboxing 2.5D, Revelação Triunfante & Política de Cashback ([P-095]):**
  - Timeline de unboxing de 1.35s (`0.00s-0.55s` destravamento com `.chest-shake` e clique mecânico; `0.55s-1.35s` feixe de luz volumétrico `.unboxing-ray-burst` na cor da raridade e fanfarra sintetizada Web Audio API; `1.35s` reveal).
  - Áudio procedural em `ClinicAudioService`: 440 Hz para Comum, Dó5-Sol5 para Raro, Dó5-Mi5-Sol5 para Épico, fanfarra Dó5-Mi5-Sol5-Dó6 com brilho de tesouro para Lendário.
  - Tela de recompensa com palco de podium luminoso (`getRarityGlow`), selo `✦ Relíquia Exclusiva`, botões de ação (`[📐 Posicionar Agora]`, `[🎒 Guardar]`, `[🎁 Abrir Outra]`).
  - Tratamento acolhedor de duplicatas com cashback justo creditado instantaneamente na conta do estudante: Comum (+150 XP), Raro (+500 XP), Épico (+1.500 XP), Lendário (+3.000 XP).
  - Acessibilidade: suporte integral a `prefers-reduced-motion: reduce` (supressão de shakes e oscilações).
  - Performance: rota lazy-loaded `/minha-clinica` gerou bundle de apenas **35.73 kB gzipped**, bem abaixo do limite de 300 kB.
