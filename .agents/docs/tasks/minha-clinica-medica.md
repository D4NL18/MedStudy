# Entidade / Feature: Minha Clínica Médica (Gamificação Isométrica 2.5D & Motor de XP)

> **Localização Mandatória:** `.agents/docs/tasks/minha-clinica-medica.md`  
> **Status:** 🚀 **EM ANDAMENTO (Tarefas 1 a 3 Concluídas; Tarefas 4 e 5 em Execução)**  
> **Regras Rastreáveis:** `P-080`, `P-081`, `P-082`, `P-083`, `P-084`, `P-085`, `P-086`, `P-087`, `P-088`, `P-089`  
> **Contrato de API:** `.agents/docs/api_contracts/minha-clinica-medica.md`  
> **ADRs de Referência:** `ADR-001-minha-clinica-isometric-25d.md`, `ADR-008-clinic-surfaces-and-doctor-avatar.md`

---

## 1. Dúvidas Resolvidas e Decisões Consolidadas
- **Dualidade de XP (`P-080`):** `lifetime_xp` vitalício nunca decresce; `current_xp` é investido em compras/expansões.
- **Desacoplamento de Superfícies (`P-087`, `ADR-008`):** Papéis de parede e pisos são propriedades globais em `user_clinics.wall_theme` e `user_clinics.floor_theme`, sem ocupar tiles no piso.
- **Itens de Parede (`P-088`, `ADR-008`):** Classificação `placement_type = 'WALL'` com ancoragem em `wall_side`, `wall_tile_index` e `elevation_z`. Isentos de colisão no solo (`0x0` footprint).
- **Avatar Médico Virtual (`P-089`, `ADR-008`):** Gênero gratuito flexível (`MALE`/`FEMALE`), 3 slots de equipamentos cosméticos (`coat`, `stethoscope`, `accessory`) renderizados em 4 camadas SVG modulares ultra-leves com animação idle em CSS e balão motivacional.

---

## 2. Decomposição Técnica e Tarefas de Desenvolvimento

### Tarefa 1: Motor de XP de Estudo, Dualidade de Saldos e Auditoria (`P-080`, `P-081`) — `[PARALLEL]` (Backend)
- [x] **`[P-080]` Entidades e Enums de Conta de XP e Ledger**
- [x] **`[P-081]` Motor Matemático de Recompensas e Multiplicador de Streak**

---

### Tarefa 2: Catálogo de 27 Itens, Progressão de 6 Níveis e Validação Espacial Anti-Colisão (`P-082`, `P-083`, `P-084`) — `[PARALLEL]` (Backend + DB)
- [x] **`[P-082][P-083]` Migration Flyway `V25` e Entidades da Clínica**
- [x] **`[P-084]` Validador Espacial AABB 2D e Serviços de Compra/Expansão/Layout**

---

### Tarefa 3: Renderizador Isométrico 2.5D, Modo Decoração e Feedback Cozy (`P-085`, `P-086`) — `[PARALLEL]` (Frontend Angular 18)
- [x] **`[P-085]` Serviço de Estado Reativo e Viewport Isométrico 2.5D Low-Footprint**
- [x] **`[P-086]` Página Minha Clínica, Barra Deslizante de 4 Abas, Áudio Cozy e Toast de XP**

---

### 🧱 Tarefa 4: Customização de Superfícies (Piso/Parede) e Itens de Parede (Wall-Mounted) (`P-087`, `P-088`, `US-06`) — `[PARALLEL]` (Fullstack)

**Descritivo Detalhado:**
Implementar o sistema de revestimento desacoplado de paredes e pisos da clínica médica, suportando estampas contínuas (como o Papel Safari Aquarela) e acabamentos de piso sem afetar o grid de circulação, acompanhado da fixação de itens verticais (Negatoscópio e Régua Girafa) nas paredes NW e NE com footprint zero no solo.

**Critérios de Aceite:**
- [x] Aplicação de papel de parede e piso persiste em `user_clinics` e atualiza a estética visual sem alterar móveis do chão (`C-05`).
- [x] Posicionar um item de parede (`negatoscopio_led` ou `ped_regua_girafa`) não gera colisão com macas ou mesas no chão logo abaixo dele (`C-06`).
- [x] Tentativa de sobrepor dois itens de parede no mesmo segmento e elevação resulta em erro `422 Unprocessable Entity` (`C-07`).
- [x] Validação server-side impede `wallSide` fora de `NW` e `NE` (`400 Bad Request`).

**Etapas de Execução (Checklist Técnico Atômico):**
- [x] **Etapa 4.1 (DB/Flyway):** Criar script de migração `V26__add_clinic_surfaces_and_doctor_avatar.sql` adicionando `wall_theme` e `floor_theme` em `user_clinics`, e as colunas `placement_type`, `wall_side`, `wall_tile_index` e `elevation_z` em `clinic_placed_items`.
- [x] **Etapa 4.2 (Backend DTOs):** Criar `ClinicSurfacesUpdateRequest.java` com Bean Validation (`@NotBlank`) e atualizar `ClinicPlacedItemRequestDto.java` com campos opcionais de parede e anotação `@Pattern(regexp = "^(FLOOR|WALL)$")`.
- [x] **Etapa 4.3 (Backend Validator):** Refatorar `ClinicLayoutValidator.java` para filtrar itens `WALL`, ignorando-os no algoritmo AABB de chão e aplicando verificação linear 1D de sobreposição de parede por `(wallSide, wallTileIndex)`.
- [x] **Etapa 4.4 (Backend Controller/Service):** Implementar endpoint `PUT /api/v1/clinic/surfaces` em `ClinicController.java` e `ClinicService.java`, atualizando os temas com verificação de desbloqueio prévio.
- [x] **Etapa 4.5 (Frontend State/Model):** Atualizar `clinic.model.ts` e `clinic.service.ts` com tipagem para `WallSide`, `PlacementType` e método `updateSurfaces(req)`.
- [x] **Etapa 4.6 (Frontend Viewport/Rendering):** Implementar renderização de texturas contínuas nos polígonos das paredes e faces dos tiles no `ClinicViewportComponent`, e camada gráfica `wallLayer` com cálculo determinístico de profundidade (`depth = wallTileIndex * 1000 + 20`).
- [x] **Etapa 4.7 (Frontend UI Decorator):** Expandir a barra inferior do modo edição com abas "Paredes" e "Pisos", ghost preview de parede e suporte a arrastar/soltar itens de parede.

---

### 👨‍⚕️ Tarefa 5: Personagem Médico Virtual (Avatar 2.5D com Guarda-Roupa de Skins) (`P-089`, `US-07`) — `[PARALLEL]` (Fullstack)

**Descritivo Detalhado:**
Criar o médico residente virtual do estudante, suportando escolha gratuita e irrestrita de gênero (`MALE` / `FEMALE`), guarda-roupa em 3 slots (`Jaleco`, `Estetoscópio`, `Acessório`), débito atômico de XP em compras cosméticas, renderizador modular SVG de 4 camadas, micro-animação idle e balão de fala acolhedor ao interagir.

**Critérios de Aceite:**
- [x] Onboarding inicial provisiona gratuitamente o avatar com traje básico de internato (`coat_intern_white`, `steth_classic_black`, `acc_none`).
- [x] Alternância de gênero entre `MALE` e `FEMALE` é permitida a qualquer instante sem custo de XP (`C-08`).
- [x] Compra de skin cosmética consome `current_xp` atomicamente com registro em `user_xp_transactions` (`SKIN_PURCHASE`) e mantém `lifetime_xp` intacto.
- [x] Tentativa de comprar skin com saldo insuficiente retorna `422 Unprocessable Entity` sem débitos residuais (`C-09`).
- [x] Clique no personagem médico aciona animação e exibe balão de fala acolhedor com mensagem de apoio ao estudo (`C-10`).

**Etapas de Execução (Checklist Técnico Atômico):**
- [x] **Etapa 5.1 (DB/Flyway):** Criar tabelas `user_doctor_avatars`, `doctor_skins_catalog` e `user_unlocked_skins` no script `V26__add_clinic_surfaces_and_doctor_avatar.sql` com constraints e foreign keys.
- [x] **Etapa 5.2 (Backend Entities/Repos):** Mapear entidades JPA `UserDoctorAvatar.java`, `DoctorSkinCatalog.java`, `UserUnlockedSkin.java` e seus respectivos repositórios Spring Data JPA.
- [x] **Etapa 5.3 (Backend DTOs/Mappers):** Criar `DoctorAvatarResponseDto.java`, `DoctorAvatarUpdateDto.java`, `SkinBuyRequestDto.java` e MapStruct mappers com mascaramento de PII.
- [x] **Etapa 5.4 (Backend Domain Service):** Desenvolver `DoctorAvatarService.java` com transação `@Transactional` para compras atômicas com XP, validação de posse e alteração de vestimenta.
- [x] **Etapa 5.5 (Backend Controller):** Expor endpoints `GET /api/v1/clinic/avatar`, `PUT /api/v1/clinic/avatar` e `POST /api/v1/clinic/avatar/skins/buy` em `DoctorAvatarController.java`.
- [x] **Etapa 5.6 (Frontend SVG Component):** Desenvolver `DoctorAvatarSvgComponent` em Angular 18 com composição modular em 4 camadas (`corpo`, `jaleco`, `estetoscópio`, `acessório`) e animação CSS keyframes idle ultra-leve.
- [x] **Etapa 5.7 (Frontend Speech Bubble):** Desenvolver componente `DoctorSpeechBubbleComponent` com pool de mensagens acolhedoras clínicas/motivacionais e debounce reativo de cliques.
- [x] **Etapa 5.8 (Frontend Modal de Personalização):** Criar modal `DoctorWardrobeModalComponent` com abas para Gênero (gratuito), Jalecos, Estetoscópios e Acessórios, visualização prévia em Signal reativo e botão de compra com saldo em tempo real.

---

### 🎯 Tarefa 6: Correção de Hit-Testing e Picking Isométrico Pixel-Perfect (`P-090`, `US-08`) — `[PARALLEL]` (Frontend)

**Descritivo Detalhado:**
Isolar eventos de ponteiro para eliminar o bug onde o clique no ladrilho `(0, 0)` era interceptado pela caixa delimitadora transparente de móveis em `(1, 1)` ou pelo avatar/ghost preview.

**Critérios de Aceite:**
- [ ] No modo de edição com item selecionado, `.ghost-item-anchor`, `.doctor-avatar-anchor` e `.placed-item-anchor` aplicam `pointer-events: none` (`C-11`, `C-12`).
- [ ] O clique em `(0, 0)` atinge diretamente o `polygon.iso-tile` de `(0, 0)` emitindo a coordenada exata.
- [ ] No modo normal, âncoras usam `pointer-events: none` e o SVG interno usa `pointer-events: visiblePainted`.

**Etapas de Execução:**
- [ ] **Etapa 6.1 (CSS / Template):** Atualizar `clinic-viewport.component.ts` com regras estritas de `pointer-events` conforme o modo (`editMode` ativo vs inativo).
- [ ] **Etapa 6.2 (Validação de Click):** Garantir que o clique e o `mouseenter` nos tiles emitam coordenadas precisas em todo o grid.

---

### 🎯 Tarefa 7: Remoção da Faixa de Simulação de XP do Topo (`P-091`, `US-09`) — `[PARALLEL]` (Frontend)

**Descritivo Detalhado:**
Remover os chips de simulação manual de estudo (`.study-actions-strip`) do template de `minha-clinica.component.ts`, mantendo os endpoints de backend e os toasts reativos.

**Critérios de Aceite:**
- [ ] O elemento `.study-actions-strip` é 100% removido do template HTML (`C-13`).
- [ ] O toast de recompensa de XP continua funcionando reativamente quando acionado.

**Etapas de Execução:**
- [ ] **Etapa 7.1 (Template Clean):** Deletar o bloco de botões de simulação e estilos associados em `minha-clinica.component.ts`.

---

### 🎯 Tarefa 8: Megacatálogo de 104 Itens Médicos da Clínica (`P-092`, `US-10`) — `[PARALLEL]` (Fullstack)

**Descritivo Detalhado:**
Expandir o catálogo da clínica para 104 itens oficiais (26 itens em cada uma das 4 categorias: Pediatria, Mobiliário, Clínica e Recepção), com migração Flyway, atualização de fallback no frontend e arquétipos vetoriais modulares no `ClinicItemSvgComponent`.

**Critérios de Aceite:**
- [ ] Migration Flyway `V27` cadastra os novos itens totalizando 104 itens únicos no banco (`C-14`).
- [ ] `CLINIC_CATALOG_FALLBACK` no frontend contém os 104 itens padronizados.
- [ ] `ClinicItemSvgComponent` renderiza cada item via arquétipos visuais ricos respeitando o teto de 300 KB gzipped.
- [ ] Testes de backend e frontend validam a integridade e quantidade `>= 100`.

**Etapas de Execução:**
- [ ] **Etapa 8.1 (DB/Migration):** Executar migration `V27__expand_clinic_catalog_to_104_items.sql`.
- [ ] **Etapa 8.2 (Frontend Models):** Atualizar `clinic.model.ts` com os 104 itens.
- [ ] **Etapa 8.3 (Frontend SVG Renderers):** Implementar arquétipos vetoriais modulares no `ClinicItemSvgComponent`.
- [ ] **Etapa 8.4 (Backend Unit & Integration Tests):** Adicionar/atualizar testes do catálogo para validar 104 itens.

---

### 🎁 Tarefa 9: Sistema de Raridades, 50 Itens Exclusivos e Sorteio de Lootboxes em 3 Tiers com Cashback (`P-093`, `P-094`, `P-095`) — `[PARALLEL]` (Fullstack)

**Descritivo Detalhado:**
Implementar o sistema de raridade de quatro níveis (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`) para todos os itens da clínica, integrando 50 novos itens exclusivos de sorteio (totalizando 154 itens no catálogo), a funcionalidade de Caixas da Sorte médicas em 3 Tiers escalonados (`TIER_1_RESIDENT`, `TIER_2_SPECIALIST`, `TIER_3_CHIEF_OF_STAFF`), a transação ACID de abertura com débito em `current_xp`, log de auditoria `lootbox_opening_logs`, e a política de cashback de XP para itens duplicados.

**Critérios de Aceite:**
- [ ] Todo item do catálogo possui um dos quatro níveis de raridade válidos (`P-093`).
- [ ] Os 104 itens existentes permanecem compráveis na loja comum com XP direto; os 50 novos itens possuem `is_lootbox_exclusive = true` e são rejeitados com `403 Forbidden` se comprados na loja normal (`P-093`).
- [ ] O endpoint de abertura de lootbox executa sorteio determinístico via `SecureRandom` com respeito estrito às probabilidades dos 3 tiers (`P-094`).
- [ ] A abertura debita atomicamente o custo em `current_xp` mantendo `lifetime_xp` intacto, registrando a operação no ledger `user_xp_transactions` (`P-095`).
- [ ] Se o item sorteado for duplicado, o sistema concede cashback fixo em `current_xp` (150 XP comum, 500 XP raro, 1.500 XP épico, 3.000 XP lendário) e grava a transação de auditoria (`P-095`).
- [ ] Todas as aberturas gravam log imutável em `lootbox_opening_logs` (`P-095`).

**Etapas de Execução (Checklist Técnico Atômico):**
- [ ] **Etapa 9.1 (DB/Flyway):** Criar script `V28__add_item_rarities_and_lootbox_system.sql` adicionando coluna `rarity` e `is_lootbox_exclusive` em `clinic_items_catalog`, cadastrando os 50 novos itens exclusivos, criando a tabela `lootbox_opening_logs` e atualizando o enum de fontes de XP com `LOOTBOX_OPEN` e `LOOTBOX_DUPLICATE_CASHBACK`.
- [ ] **Etapa 9.2 (Backend Entities/Enums):** Criar enums `ItemRarity` e `LootboxTier`, entidade `LootboxOpeningLog` e atualizar `ClinicItemCatalog` com os novos campos.
- [ ] **Etapa 9.3 (Backend DTOs):** Criar `LootboxOpenRequestDto` com validação de tier, e `LootboxOpenResponseDto` contendo item sorteado, flag `isDuplicate`, `cashbackXpAwarded` e saldo atualizado.
- [ ] **Etapa 9.4 (Backend Service - ACID & RNG):** Implementar `LootboxService.java` com `@Transactional`, sorteio via `SecureRandom`, verificação de saldo, verificação de duplicidade, cálculo de cashback e inserção nos ledgers.
- [ ] **Etapa 9.5 (Backend Controller):** Expor `POST /api/v1/clinic/lootboxes/{tier}/open` e `GET /api/v1/clinic/lootboxes` em `ClinicLootboxController.java`.
- [ ] **Etapa 9.6 (Frontend State & Service):** Atualizar `clinic.model.ts` e `clinic.service.ts` com tipagens de raridade e métodos para abertura de caixa.
- [ ] **Etapa 9.7 (Frontend UI Store & Animation):** Criar aba/modal de Caixas da Sorte na loja da clínica com apresentação dos 3 Tiers, probabilidades visuais transparentes, animação lúdica de abertura e feedback de cashback.
- [ ] **Etapa 9.8 (Testes Automatizados):** Implementar testes unitários para o `LootboxService` validando débitos atômicos, probabilidades, duplicatas com cashback e proteção contra concorrência.
