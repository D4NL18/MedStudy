# Regras de Neg?cio: Minha Cl?nica ? Revis?o de Skins, Revestimentos e Guarda-Roupa Completo

> **Localiza??o Mandat?ria:** `.agents/docs/business_rules/minha_clinica_skins_revised.md`  
> **Respons?vel:** Analista (`business-rules-expert` / `domain-expert`)  
> **Rastreabilidade:** US-14 (ROADMAP.md) / `[P-096]`  
> **Refer?ncias de Regras:** `.agents/rules/architecture-business-logic-isolation-rules.md`, `.agents/rules/security-anti-patterns.md`

---

## 1. Contexto e Objetivo
- **User Story Relacionada:** US-14 ? Revis?o Integral, Corre??o de Quebras e Reformula??o Est?tica de Skins de Consult?rio e Avatar.
- **Objetivo da Feature:** Eliminar as discrep?ncias entre frontend, backend e banco de dados que impediam a compra, persist?ncia e visualiza??o correta de revestimentos de parede e piso, unificar o guarda-roupa do avatar m?dico virtual com todas as 22 op??es oficiais homologadas (8 jalecos/roupas, 8 estetosc?pios e 6 acess?rios), implementar arte vetorial de alta fidelidade para as skins espec?ficas e erradicar o fallback de caixa gen?rica com cruz verde em `clinic-item-svg`.
- **Atores Envolvidos:** Estudante de Medicina Autenticado, Motor de XP/Ledger da Cl?nica, Renderizador Isom?trico 2.5D.

---

## 2. Cat?logo de Regras de Neg?cio (P-XXX)

### `P-096.1`: Sincroniza??o e Homologa??o de IDs de Revestimentos (Parede e Piso)
- **Declara??o Mandat?ria:** O sistema DEVE unificar e padronizar os identificadores oficiais de revestimentos em toda a stack (Frontend `wallpaperOptions`/`floorOptions`, Backend `ClinicService.OFFICIAL_SURFACES` e Banco de Dados `clinic_items_catalog`).
- **Cat?logo Oficial Can?nico de Superf?cies:**
  1. **Paredes (`WALL_SURFACE`):**
     - `clean_white`: "Branco Cl?nico Minimalista" (Custo: 0 XP ? padr?o inicial gratuito).
     - `ped_papel_safari`: "Safari Aquarela Savana" (Custo: 850 XP).
     - `wallpaper_geometric_teal`: "Geom?trico N?rdico Teal" (Custo: 950 XP).
     - `wallpaper_brick_white`: "Tijolinho Branco Moderno" (Custo: 750 XP).
  2. **Pisos (`FLOOR_SURFACE`):**
     - `wood_light`: "Carvalho Claro Escandinavo" (Custo: 0 XP ? padr?o inicial gratuito).
     - `wood_dark_herringbone`: "Madeira Nobre Espinha de Peixe" (Custo: 1.100 XP).
     - `marble_carrara`: "M?rmore Carrara Luxo" (Custo: 2.200 XP).
     - `tatame_eva`: "Tatame EVA Pastel Candy Color" (Custo: 800 XP).
- **Condi??es de Ativa??o:** Toda consulta de cat?logo, compra na loja ou montagem do estado inicial da cl?nica.
- **Resultado Esperado:** Todos os 8 revestimentos oficiais devem existir na tabela `clinic_items_catalog` com categoria apropriada, permitindo compra direta via API e consulta sem erros 404.
- **Exce??o / Mensagem de Erro:** Caso seja requisitado um ID obsoleto ou inexistente (ex: `wall_azul_clinico`, `floor_vinilico_cirurgico`), o sistema DEVE responder HTTP 404 Not Found com a mensagem: `"Superf?cie de revestimento n?o encontrada no cat?logo oficial."`.

### `P-096.2`: Fluxo Cont?bil de Compra e Desbloqueio At?mico de Superf?cies
- **Declara??o Mandat?ria:** A compra de superf?cies via `POST /api/v1/clinic/items/buy` DEVE debitar atomicamente o saldo de `current_xp` em `user_xp_accounts`, registrar lan?amento imut?vel no ledger `user_xp_transactions` (`source = 'ITEM_PURCHASE'`) e persistir a posse do item em `user_unlocked_skins`.
- **Condi??es de Ativa??o:** Requisi??o `POST /api/v1/clinic/items/buy` com `catalogItemId` correspondente a um revestimento homologado (`P-096.1`).
- **Resultado Esperado:** 
  1. D?bito de `cost_xp` em `user_xp_accounts.current_xp`.
  2. Inser??o em `user_xp_transactions` com valor negativo, novo saldo em `balance_after` e descri??o `"Compra de Revestimento: {nome}"`.
  3. Inser??o em `user_unlocked_skins` com `(user_id, skin_id = catalogItemId, unlocked_at = NOW())`.
  4. Retorno HTTP 200 OK com `BuyClinicItemResponse` contendo o saldo atualizado e a superf?cie desbloqueada.
- **Exce??es / Mensagens de Erro:**
  - Saldo de `current_xp < cost_xp`: Bloquear opera??o com HTTP 422 Unprocessable Entity e mensagem: `"Saldo de XP insuficiente para adquirir este revestimento."`.
  - Item j? adquirido previamente: Idempot?ncia garantida. O sistema N?O DEVE debitar XP novamente e deve retornar HTTP 200 OK informando que o item j? pertence ao usu?rio.

### `P-096.3`: Aplica??o e Persist?ncia do Layout de Superf?cies
- **Declara??o Mandat?ria:** O endpoint `PUT /api/v1/clinic/surfaces` DEVE verificar a posse leg?tima das superf?cies solicitadas (`wallTheme` e `floorTheme`) antes de persisti-las em `user_clinics`.
- **Condi??es de Ativa??o:** Envio de payload `{ "wallTheme": string, "floorTheme": string }` pelo estudante.
- **Resultado Esperado:**
  1. Se `wallTheme` for `clean_white` ou constar em `user_unlocked_skins` para o usu?rio, e `floorTheme` for `wood_light` ou constar em `user_unlocked_skins`, atualizar colunas `user_clinics.wall_theme` e `user_clinics.floor_theme`.
  2. Retornar HTTP 200 OK com o objeto completo `ClinicStateResponse`, contendo `wallTheme`, `floorTheme`, lista de `ownedSurfaces` e `ownedItemIds`.
  3. Ao recarregar a cl?nica (`GET /api/v1/clinic/state`), os revestimentos persistidos devem ser refletidos imediatamente.
- **Exce??o / Mensagem de Erro:** Se o estudante tentar aplicar uma superf?cie que n?o possui desbloqueada, o backend DEVE recusar com HTTP 403 Forbidden e mensagem: `"Voc? precisa desbloquear este revestimento antes de aplic?-lo ? sua cl?nica."`.

### `P-096.4`: Cat?logo Completo do Guarda-Roupa do Avatar M?dico
- **Declara??o Mandat?ria:** O componente de guarda-roupa (`doctor-wardrobe-modal`) e o estado da cl?nica DEVEM expor integralmente todas as 22 op??es cosm?ticas homologadas do avatar m?dico divididas em seus respectivos slots:
  1. **Slot Jaleco / Roupa Hospitalar (`coat`):**
     - `coat_default`: Jaleco Branco Cl?ssico (0 XP, gr?tis).
     - `coat_intern_white`: Jaleco Tradicional Internato (0 XP, gr?tis).
     - `coat_scrubs_navy`: Scrub Azul Marinho Plant?o (500 XP).
     - `coat_scrubs_green`: Scrub Verde Cir?rgico (800 XP).
     - `coat_pediatric`: Jaleco Pedi?trico Bichinhos (500 XP).
     - `coat_pediatric_dino`: Jaleco Estampado Dinossauro Pedi?trico (1.200 XP).
     - `coat_executive_doc`: Jaleco Executivo Alfaiataria Nobre (2.500 XP).
     - `coat_gold`: Jaleco Mestre Ouro & Caduceu (2.500 XP).
  2. **Slot Estetosc?pio (`stethoscope`):**
     - `steth_standard`: Estetosc?pio Preto Cl?ssico (0 XP, gr?tis).
     - `steth_classic_black`: Estetosc?pio Preto B?sico (0 XP, gr?tis).
     - `steth_none`: Sem Estetosc?pio (0 XP, gr?tis).
     - `steth_elephant`: Protetor Elefantinho Pedi?trico (350 XP).
     - `steth_cardio_burgundy`: Esteto Cardiol?gico Vinho (700 XP).
     - `ped_steth_elefante`: Esteto Pedi?trico Elefante (950 XP).
     - `steth_gold`: Estetosc?pio Master Ouro Maci?o (1.800 XP).
     - `steth_gold_master`: Esteto Master Ouro 24k (3.000 XP).
  3. **Slot Acess?rios (`accessory`):**
     - `acc_none`: Nenhum Acess?rio (0 XP, gr?tis).
     - `acc_red_bowtie`: Gravata Borboleta Vermelha (400 XP).
     - `acc_glasses_classic`: ?culos de Arma??o Redonda (400 XP).
     - `acc_scrub_cap`: Touca Cir?rgica Teal N?rdica (600 XP).
     - `acc_ped_gorro_colorido`: Gorro Cir?rgico Safari Pedi?trico (600 XP).
     - `acc_prontuario_clipboard`: Prancheta M?dica na M?o (850 XP).
- **Mecanismo de Prova e Valida??o:**
  - O estudante pode pr?-visualizar qualquer item livremente no modal (Signal State reativo).
  - O bot?o de salvar (`PUT /api/v1/clinic/avatar`) DEVE validar se todas as pe?as selecionadas est?o desbloqueadas.
- **Exce??o / Mensagem de Erro:** Caso o estudante tente salvar o avatar vestindo pe?a n?o adquirida, a interface deve exibir toast de aten??o amig?vel: `"Voc? est? provando '{nome_do_item}', que ainda n?o foi desbloqueado. Desbloqueie-o com seu XP antes de salvar."`.

### `P-096.5`: Fidelidade e Especificidade Art?stica Vetorial do Avatar
- **Declara??o Mandat?ria:** O componente `doctor-avatar-svg` N?O DEVE utilizar normaliza??es ou aliases gen?ricos que descaracterizem as pe?as personalizadas do avatar m?dico.
- **Condi??es de Ativa??o:** Renderiza??o do avatar com as skins `coat_pediatric_dino`, `coat_executive_doc` e `acc_ped_gorro_colorido`.
- **Comportamento Gr?fico Exigido:**
  1. `coat_pediatric_dino`: Vetoriza??o exclusiva contendo silhuetas n?tidas de dinossauros l?dicos (estilo T-Rex e Triceratops) e pequenas pegadas em tons pastel verde/menta e amarelo, sem redirecionar para o jaleco de bichinhos gen?rico.
  2. `coat_executive_doc`: Modelagem vetorial de jaleco executivo nobre de alfaiataria m?dica com corte italiano, lapela chanfrada estruturada, len?o de bolso elegante e caimento encorpado, sem redirecionar para o jaleco dourado.
  3. `acc_ped_gorro_colorido`: Gorro cir?rgico estampado tem?tico safari pedi?trico com mini-padronagem de animais e folhas sobre a cabe?a do avatar, respeitando a perspectiva 2.5D, sem redirecionar para a touca teal lisa.

### `P-096.6`: Renderiza??o Param?trica Sem Fallback de Revestimentos em `clinic-item-svg`
- **Declara??o Mandat?ria:** O componente `clinic-item-svg` DEVE implementar blocos `@case` dedicados para cada um dos 8 revestimentos de parede e piso catalogados, eliminando por completo o acionamento do `@default` (caixa de fallback com cruz verde).
- **Condi??es de Ativa??o:** Passagem de `itemKey` correspondente a qualquer um dos 8 revestimentos (`clean_white`, `ped_papel_safari`, `wallpaper_geometric_teal`, `wallpaper_brick_white`, `wood_light`, `wood_dark_herringbone`, `marble_carrara`, `tatame_eva`).
- **Resultado Gr?fico Esperado:**
  - Renderizar uma amostra isom?trica refinada (swatch texturizado em losango 2.5D para pisos ou painel vertical decorado para paredes) representando fielmente a textura e o acabamento do material.
  - O `@default` cl?nico fica estritamente restrito a itens de erro ou n?o identificados.

---

## 3. Enquadramento LGPD & Privacidade (Art. 7? e 11 da LGPD)

| Dado / Atributo | Classifica??o LGPD | Base Legal Aplicada | Finalidade Espec?fica e Proporcional |
| :--- | :--- | :--- | :--- |
| `user_clinics.wall_theme` e `floor_theme` | Dado Funcional / Prefer?ncia Est?tica | Execu??o de Contrato (Art. 7?, V) | Persistir a customiza??o cosm?tica da cl?nica do estudante. |
| `user_doctor_avatar.skin_*` | Dado Funcional de Identidade Virtual | Execu??o de Contrato (Art. 7?, V) | Representa??o visual do personagem m?dico no consult?rio. |
| `user_unlocked_skins` | Hist?rico Transacional Cosm?tico | Execu??o de Contrato (Art. 7?, V) | Auditoria e controle de posse de bens virtuais desbloqueados. |
| `user_xp_transactions` (d?bito de skin) | Registro Cont?bil de Estudo | Execu??o de Contrato (Art. 7?, V) | Rastreabilidade do motor econ?mico e garantia de integridade contra double spending. |

*Nota de Minimiza??o:* Nenhum dado biom?trico, de imagem real ou dado sens?vel de sa?de (Art. 11) ? coletado ou inferido atrav?s das skins ou do avatar m?dico virtual.

---

## 4. Matriz de Cen?rios e Edge Cases

| ID | Cen?rio / Entrada | Comportamento Esperado | C?digo HTTP |
| :--- | :--- | :--- | :--- |
| **C-01** | Compra de revestimento v?lido com saldo suficiente | Debita XP no ledger, insere em `user_unlocked_skins` e retorna sucesso | `200 OK` |
| **C-02** | Compra de revestimento com XP insuficiente | Opera??o bloqueada; ledger inalterado | `422 Unprocessable` |
| **C-03** | Compra repetida de revestimento j? pertencente ao usu?rio | Opera??o idempotente; n?o debita XP adicional e confirma posse | `200 OK` |
| **C-04** | Aplica??o de revestimento desbloqueado via `PUT /surfaces` | Atualiza `user_clinics` e devolve `ClinicStateResponse` atualizado | `200 OK` |
| **C-05** | Tentativa de aplicar revestimento n?o desbloqueado | Bloqueia altera??o exigindo aquisi??o pr?via | `403 Forbidden` |
| **C-06** | Navega??o em todas as abas do guarda-roupa | Lista 8 jalecos, 8 estetosc?pios e 6 acess?rios com estado de posse | N/A (UI) |
| **C-07** | Equipar e renderizar `coat_pediatric_dino` e `acc_ped_gorro_colorido` | Renderiza dinossauros e gorro safari sem redirecionamento para aliases | N/A (SVG) |
| **C-08** | Renderiza??o de amostra de piso/parede em `clinic-item-svg` | Entra no `@case` espec?fico do revestimento sem exibir caixa com cruz verde | N/A (SVG) |

---

## 5. Crit?rios de Aceita??o (DoD - Definition of Done)
- [ ] Todos os 8 revestimentos de parede e piso cadastrados no Flyway `clinic_items_catalog` com categoria, custo e metadados.
- [ ] Backend `ClinicService.OFFICIAL_SURFACES` 100% sincronizado com os IDs can?nicos do frontend.
- [ ] Endpoints `POST /api/v1/clinic/items/buy` e `PUT /api/v1/clinic/surfaces` testados com cobertura unit?ria e de integra??o >= 80%.
- [ ] Modal de guarda-roupa do avatar exibindo as 22 op??es homologadas com preview reativo.
- [ ] Componente `doctor-avatar-svg` exibindo dinossauros em `coat_pediatric_dino`, alfaiataria em `coat_executive_doc` e gorro safari em `acc_ped_gorro_colorido`.
- [ ] Componente `clinic-item-svg` renderizando amostras de todas as superf?cies sem cair no `@default`.
- [ ] Rota lazy `/minha-clinica` mantida abaixo de 300 KB gzipped.
