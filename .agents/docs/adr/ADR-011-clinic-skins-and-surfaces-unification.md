# ADR-011: Unificação, Sincronização e Governança de Superfícies e Skins Cosméticas na Minha Clínica Médica

> **Status:** Aceito  
> **Data:** 2026-10-29  
> **Autor:** Arquiteto de Software (`architect.md`)  
> **Localização Mandatória:** `.agents/docs/adr/ADR-011-clinic-skins-and-surfaces-unification.md`  
> **Rastreabilidade:** US-14 (ROADMAP.md) / `[P-096.1]` a `[P-096.6]` / ADR-008, ADR-009, ADR-010

---

## 1. Contexto do Problema

Durante a evolução da feature **Minha Clínica Médica** (gamificação isométrica 2.5D), foram diagnosticados quatro descompassos arquiteturais críticos que impactavam a persistência, integridade contábil e experiência estética do estudante:

1. **Dessincronização Estrutural de Superfícies (Parede e Piso):**
   - O frontend utilizava identificadores modernos (`wallpaper_geometric_teal`, `wallpaper_brick_white`, `wood_dark_herringbone`, `tatame_eva`, `marble_carrara`, `wood_light`, `clean_white`, `ped_papel_safari`).
   - O backend mantinha em `ClinicService.OFFICIAL_SURFACES` IDs obsoletos (`wall_azul_clinico`, `floor_vinilico_cirurgico`, `floor_porcelanato_cinza`).
   - O banco de dados (`clinic_items_catalog`) continha unicamente o item `ped_papel_safari`. Os outros 7 revestimentos não existiam no catálogo.
   - **Impacto:** Chamadas de compra via `POST /api/v1/clinic/items/buy` falhavam com HTTP 404 Not Found. O frontend caía em tratamento otimista efêmero sem débito real de XP no ledger e sem persistência em `user_unlocked_skins`. Ao tentar aplicar via `PUT /api/v1/clinic/surfaces`, o backend recusava com HTTP 403 Forbidden ("Você ainda não desbloqueou este revestimento").

2. **Guarda-Roupa de Skins Oculto no Avatar Médico:**
   - O componente modal `doctor-wardrobe-modal` e `minha-clinica.component.ts` apresentavam apenas 3 jalecos, 3 estetoscópios e 3 acessórios (totalizando 9 itens), enquanto o backend e as tabelas de banco continham 22 opções oficiais homologadas (8 jalecos, 8 estetoscópios e 6 acessórios).
   - Treze itens oficiais cosméticos estavam totalmente inacessíveis para o jogador.

3. **Aliases e Redirecionamentos Genéricos de Arte SVG:**
   - O componente `doctor-avatar-svg` tratava `coat_pediatric_dino` e `coat_executive_doc` como meros aliases redirecionados para outras peças genéricas, sem apresentar a estampa infantil de dinossauros nem a modelagem de alfaiataria executiva. O mesmo ocorria com `acc_ped_gorro_colorido`.

4. **Fallback Universal de Revestimentos em `clinic-item-svg`:**
   - Os temas de parede e piso não possuíam blocos `@case` dedicados em `clinic-item-svg.component.html`, acionando o bloco `@default` (uma caixa cinza genérica com cruz verde) quando visualizados no catálogo ou gaveta de itens.

---

## 2. Decisão Arquitetural

### 2.1. Catálogo Canônico Unificado de 8 Superfícies
Fica estabelecida a unificação definitiva dos 8 revestimentos oficiais em toda a stack (Frontend, Backend Java e PostgreSQL):

| ID Canônico | Categoria / Placement | Nome Oficial | Custo XP | Nível Mín. | Tipo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `clean_white` | `WALL_SURFACE` | Branco Clínico Minimalista | 0 XP | Nível 1 | Grátis Inicial |
| `ped_papel_safari` | `WALL_SURFACE` | Safari Aquarela Savana | 850 XP | Nível 1 | Comprável |
| `wallpaper_geometric_teal` | `WALL_SURFACE` | Geométrico Nórdico Teal | 950 XP | Nível 1 | Comprável |
| `wallpaper_brick_white` | `WALL_SURFACE` | Tijolinho Branco Moderno | 750 XP | Nível 1 | Comprável |
| `wood_light` | `FLOOR_SURFACE` | Carvalho Claro Escandinavo | 0 XP | Nível 1 | Grátis Inicial |
| `wood_dark_herringbone` | `FLOOR_SURFACE` | Madeira Nobre Espinha de Peixe | 1.100 XP | Nível 1 | Comprável |
| `marble_carrara` | `FLOOR_SURFACE` | Mármore Carrara Luxo | 2.200 XP | Nível 1 | Comprável |
| `tatame_eva` | `FLOOR_SURFACE` | Tatame EVA Pastel Candy Color | 800 XP | Nível 1 | Comprável |

- **Migration Flyway `V31__sync_official_clinic_surfaces_catalog.sql`:** Popula os 8 registros em `clinic_items_catalog` com `placement_type IN ('SURFACE_WALL', 'SURFACE_FLOOR')`, `footprint_x = 0, footprint_y = 0`, idempotência via `ON CONFLICT (id) DO UPDATE` e provisiona os itens gratuitos para usuários existentes em `user_unlocked_skins`.
- **Sincronização em `ClinicService.OFFICIAL_SURFACES`:** Substituição integral da lista legada pelos 8 registros canônicos.

### 2.2. Fluxo Contábil ACID e Idempotente de Compra
- O endpoint `POST /api/v1/clinic/items/buy` passa a atender de forma nativa e unificada tanto móveis de solo/parede quanto superfícies (`SURFACE_WALL` e `SURFACE_FLOOR`):
  1. Valida saldo: `current_xp >= cost_xp`. Se insuficiente, retorna HTTP 422 Unprocessable Entity.
  2. Garante idempotência: se a superfície já estiver presente em `user_unlocked_skins`, não debita XP adicional e retorna HTTP 200 OK confirmando a posse.
  3. Debita atomicamente `cost_xp` em `user_xp_accounts.current_xp` (preservando monotonicamente `lifetime_xp`).
  4. Registra lançamento contábil em `user_xp_transactions` com `source = 'ITEM_PURCHASE'`.
  5. Insere a titularidade na tabela `user_unlocked_skins` (`skin_slot = 'surface_wall'` ou `'surface_floor'`).

### 2.3. Aplicação e Persistência de Superfícies via `PUT /api/v1/clinic/surfaces`
- O endpoint valida a posse das superfícies solicitadas (`wallTheme` e `floorTheme`):
  - `clean_white` e `wood_light` são liberados gratuitamente para todos os estudantes.
  - Para as demais, o backend valida a presença do ID em `user_unlocked_skins`. Caso contrário, recusa com HTTP 403 Forbidden.
- Persistência direta em `user_clinics.wall_theme` e `user_clinics.floor_theme`.
- Ao carregar a clínica (`GET /api/v1/clinic`), o estado persistido é entregue e renderizado imediatamente.

### 2.4. Guarda-Roupa Completo do Avatar (22 Peças Homologadas)
- O modal `doctor-wardrobe-modal` e as coleções de suporte expõem integralmente as 22 opções cosméticas:
  - **8 Jalecos/Roupas:** `coat_default`, `coat_intern_white`, `coat_scrubs_navy`, `coat_scrubs_green`, `coat_pediatric`, `coat_pediatric_dino`, `coat_executive_doc`, `coat_gold`.
  - **8 Estetoscópios:** `steth_standard`, `steth_classic_black`, `steth_none`, `steth_elephant`, `steth_cardio_burgundy`, `ped_steth_elefante`, `steth_gold`, `steth_gold_master`.
  - **6 Acessórios:** `acc_none`, `acc_red_bowtie`, `acc_glasses_classic`, `acc_scrub_cap`, `acc_ped_gorro_colorido`, `acc_prontuario_clipboard`.
- **Preview Reativo sem Commit:** O estudante pode provar qualquer combinação em tempo real via Signal State efêmero.
- **Trava de Integridade:** O salvamento (`PUT /api/v1/clinic/avatar`) bloqueia itens provados que não estejam desbloqueados, orientando a aquisição prévia via `POST /api/v1/clinic/avatar/skins/buy`.

### 2.5. Fidelidade Vetorial SVG e Amostras Paramétricas
- **Avatar Médico (`doctor-avatar-svg`):** Remoção de aliases forçados, fornecendo arte vetorial dedicada para `coat_pediatric_dino` (silhuetas de dinossauros em tons pastel), `coat_executive_doc` (alfaiataria italiana nobre com lenço) e `acc_ped_gorro_colorido` (gorro cirúrgico safari).
- **Amostras de Revestimento (`clinic-item-svg`):** Inclusão de 8 blocos `@case` para renderizar swatches 2.5D elegantes (losango isométrico para piso e painel decorativo para parede), banindo o `@default` (caixa com cruz verde).

---

## 3. Alternativas Consideradas

1. **Bifurcar a Compra criando `POST /api/v1/clinic/surfaces/buy`:**
   - *Motivo do Descarte:* Quebraria a coesão do catálogo geral. Superfícies possuem custo em XP, categoria e metadados, comportando-se como itens colecionáveis. Manter a compra em `POST /items/buy` preserva a unicidade do ledger contábil.
2. **Manter IDs Legados com Mapeador/Adapter no Backend:**
   - *Motivo do Descarte:* Perpetuaria uma dívida técnica oculta, propensa a falhas de compatibilidade futura sempre que novas superfícies fossem cadastradas.
3. **Renderizar Superfícies com Canvas/WebGL em 3D Real:**
   - *Motivo do Descarte:* Comprometeria a meta estrita de performance (bundle da rota `/minha-clinica` < 300 KB gzipped) e o princípio de leveza do MedStudy em dispositivos móveis. Projeções 2.5D em SVG nativo entregam 60 FPS com menos de 36 KB gzipped.

---

## 4. Consequências e Trade-offs

- **Pontos Positivos:**
  - Sincronização 100% livre de falhas 404/403 entre frontend, backend e banco.
  - Eliminação de itens "fantasmas" que o usuário comprava localmente mas perdia ao recarregar a tela.
  - Acesso público a todo o acervo cosmético de 22 skins do avatar.
  - Enriquecimento estético do ambiente com texturas refinadas sem fallback genérico.
  - Conformidade integral com LGPD (Art. 7º, V) e isolamento multi-tenant por usuário autenticado.
- **Débito Técnico Mitigado:**
  - Exigência de migration Flyway idempotente (`V31`) para alinhar bases de dados em desenvolvimento e homologação.
