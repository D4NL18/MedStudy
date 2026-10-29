# Entidade / Feature: Minha Cl?nica M?dica ? Revis?o Integral de Skins, Revestimentos e Guarda-Roupa (US-14)

Este documento centraliza todo o planejamento, as especifica??es e as etapas de execu??o para a resolu??o integral dos descompassos de superf?cies e expans?o do acervo est?tico do consult?rio e avatar.

## 1. D?vidas Resolvidas (Especifica??o)
- **D?vida 1:** Devemos manter os IDs legados (`wall_azul_clinico`, `floor_vinilico_cirurgico`) ou migrar integralmente para os IDs descritivos modernos do frontend (`wallpaper_geometric_teal`, `tatame_eva`, etc.)?
  - **Decis?o:** Migra??o integral e unificada para os IDs descritivos modernos em toda a stack, criando migration Flyway para inseri-los em `clinic_items_catalog` e atualizando `OFFICIAL_SURFACES` no Java.
- **D?vida 2:** Como deve ser tratada a compra de revestimentos na loja?
  - **Decis?o:** Superf?cies utilizam o endpoint can?nico `POST /api/v1/clinic/items/buy` com categoria `WALL_SURFACE` e `FLOOR_SURFACE`, desbloqueando em `user_unlocked_skins` e debitando XP do ledger.
- **D?vida 3:** O que fazer quando o usu?rio tentar salvar o avatar com uma pe?a que ele apenas provou sem desbloquear?
  - **Decis?o:** A a??o ? interceptada no frontend com toast amig?vel e validada no backend com HTTP 403 se o payload tentar equipar item n?o presente em `user_unlocked_skins`.
- **D?vida 4:** Como renderizar revestimentos no componente `clinic-item-svg` sem que pare?am m?veis de ch?o?
  - **Decis?o:** Cada `@case` renderiza um swatch isom?trico elegante (losango 2.5D com a textura de piso ou painel vertical para papel de parede), perfeito para invent?rios, caixas e gaveta de cat?logo.

---

## 2. Tarefas e Etapas de Desenvolvimento

### Tarefa 1 [PARALLEL] (DB & Backend): Sincroniza??o do Cat?logo de Superf?cies e Migrations Seguras
**Descritivo Detalhado:**
Criar migration Flyway idempotente adicionando os 8 revestimentos oficiais em `clinic_items_catalog` e sincronizar as constantes `OFFICIAL_SURFACES` em `ClinicService.java` com os nomes, custos em XP e categorias corretas (`WALL_SURFACE` e `FLOOR_SURFACE`).

**Crit?rios de Aceite:**
- [ ] Migration Flyway executada com `INSERT INTO clinic_items_catalog ... ON CONFLICT (id) DO UPDATE`.
- [ ] Constante `ClinicService.OFFICIAL_SURFACES` contendo os 8 IDs oficiais (`clean_white`, `ped_papel_safari`, `wallpaper_geometric_teal`, `wallpaper_brick_white`, `wood_light`, `wood_dark_herringbone`, `marble_carrara`, `tatame_eva`).
- [ ] Endpoint `GET /api/v1/clinic/state` retornando `ownedSurfaces` coerente com a posse real do usu?rio.

**Etapas de Execu??o (Checklist T?cnico):**
- [ ] **Etapa 1.1:** Criar migration `V31__sync_official_clinic_surfaces_catalog.sql` populando as 8 superf?cies com custos calibrados.
- [ ] **Etapa 1.2:** Atualizar lista est?tica `OFFICIAL_SURFACES` em `ClinicService.java`.
- [ ] **Etapa 1.3:** Testes unit?rios no `ClinicServiceTest` validando cat?logo de superf?cies e estado inicial.

**Audit (Testes e Valida??o):**
- [ ] **Cen?rio 1:** Consultar cat?logo da cl?nica; certificar que as superf?cies aparecem dispon?veis com metadados corretos.
- [ ] **Cen?rio 2:** Usu?rio rec?m-criado deve possuir `clean_white` e `wood_light` dispon?veis sem custo.

---

### Tarefa 2 [PARALLEL] (Backend): Persist?ncia e D?bito de Compra de Superf?cies
**Descritivo Detalhado:**
Ajustar `ClinicService.buyItem` para reconhecer itens com placement `SURFACE_WALL`, `SURFACE_FLOOR`, `WALL_SURFACE` ou `FLOOR_SURFACE`, registrando em `user_unlocked_skins` e garantindo que `PUT /api/v1/clinic/surfaces` persista `wall_theme` e `floor_theme` de forma definitiva em `user_clinics`.

**Crit?rios de Aceite:**
- [ ] `POST /api/v1/clinic/items/buy` debita `current_xp` no ledger e insere o ID da superf?cie em `user_unlocked_skins`.
- [ ] `PUT /api/v1/clinic/surfaces` valida posse em `user_unlocked_skins` e atualiza `user_clinics`.
- [ ] Tentativa de compra sem saldo retorna HTTP 422; compra repetida n?o debita XP adicional.

**Etapas de Execu??o (Checklist T?cnico):**
- [ ] **Etapa 2.1:** Adaptar fluxo de `buyItem` para persist?ncia em `user_unlocked_skins` quando a categoria for de revestimento.
- [ ] **Etapa 2.2:** Validar regras `P-096.2` e `P-096.3` em `updateSurfaces`.
- [ ] **Etapa 2.3:** Testes de integra??o cobrindo compra e troca de superf?cies com rollback em erro.

**Audit (Testes e Valida??o):**
- [ ] **Cen?rio 1:** Comprar `wallpaper_geometric_teal` (950 XP); verificar saldo deduzido e registro em `user_unlocked_skins`.
- [ ] **Cen?rio 2:** Chamar `PUT /api/v1/clinic/surfaces` aplicando o papel comprado e recarregar a p?gina com `GET /state`.

---

### Tarefa 3 [PARALLEL] (Frontend - Guarda-Roupa): Integra??o das 22 Skins no Modal do Avatar
**Descritivo Detalhado:**
Expandir as cole??es `coatOptions`, `stethOptions` e `accessoryOptions` em `DoctorWardrobeModalComponent` e `MinhaClinicaComponent` para contemplar todas as 22 op??es oficiais, com visualiza??o pr?via reativa e trava contra itens bloqueados.

**Crit?rios de Aceite:**
- [ ] Modal de guarda-roupa exibe 8 jalecos, 8 estetosc?pios e 6 acess?rios com badges de pre?o em XP e status (equipado/desbloqueado/bloqueado).
- [ ] Altern?ncia de g?nero (`MALE` / `FEMALE`) mantida 100% gratuita.
- [ ] Prova de roupa altera instantaneamente a silhueta no preview sem commitar no backend at? clique em "Salvar".

**Etapas de Execu??o (Checklist T?cnico):**
- [ ] **Etapa 3.1:** Atualizar arrays em `doctor-wardrobe-modal.component.ts` e `minha-clinica.component.ts`.
- [ ] **Etapa 3.2:** Ajustar l?gica de `isSkinUnlocked` para reconhecer todos os IDs can?nicos.
- [ ] **Etapa 3.3:** Testes de componente verificando renderiza??o das 22 op??es e bloqueio de itens n?o possu?dos.

**Audit (Testes e Valida??o):**
- [ ] **Cen?rio 1:** Abrir modal de guarda-roupa; verificar presen?a de `coat_scrubs_navy`, `coat_pediatric_dino`, `coat_executive_doc`, `steth_cardio_burgundy`, `acc_ped_gorro_colorido`, etc.
- [ ] **Cen?rio 2:** Clicar em item bloqueado; verificar mensagem instruindo a desbloquear com XP.

---

### Tarefa 4 [PARALLEL] (Frontend - Arte SVG Avatar): Detalhamento Art?stico Exclusivo
**Descritivo Detalhado:**
Remover redirecionamentos for?ados em `DoctorAvatarSvgComponent.normalizedCoat` e `normalizedAccessory`, implementando arte vetorial espec?fica para `coat_pediatric_dino`, `coat_executive_doc` e `acc_ped_gorro_colorido`.

**Crit?rios de Aceite:**
- [ ] `coat_pediatric_dino` renderiza estampa infantil com pequenos dinossauros fofos e patinhas em vetor.
- [ ] `coat_executive_doc` renderiza corte de alfaiataria italiana com lapela estruturada e len?o no bolso.
- [ ] `acc_ped_gorro_colorido` renderiza gorro cir?rgico com padronagem tem?tica safari.

**Etapas de Execu??o (Checklist T?cnico):**
- [ ] **Etapa 4.1:** Adicionar m?todos/getters e templates vetoriais dedicados em `doctor-avatar-svg.component.html` e `.ts`.
- [ ] **Etapa 4.2:** Testes visuais e unit?rios confirmando que os IDs n?o caem em fallback gen?rico.

**Audit (Testes e Valida??o):**
- [ ] **Cen?rio 1:** Equipar `coat_pediatric_dino` e verificar na inspe??o SVG a presen?a dos paths dos dinossauros.
- [ ] **Cen?rio 2:** Equipar `coat_executive_doc` e verificar a lapela executiva e len?o.

---

### Tarefa 5 [PARALLEL] (Frontend - Renderizador): Swatches Param?tricos em `clinic-item-svg`
**Descritivo Detalhado:**
Adicionar blocos `@case` para os 8 revestimentos em `clinic-item-svg.component.html`, desenhando amostras visuais ricas e fi?is em proje??o 2.5D, prevenindo que caiam no `@default` com cruz verde.

**Crit?rios de Aceite:**
- [ ] Amostras de piso desenhadas como lajes isom?tricas texturizadas (madeira, m?rmore, tatame).
- [ ] Amostras de parede desenhadas como pain?is verticais com seus respectivos padr?es (safari, geom?trico teal, tijolinho branco).
- [ ] O bloco `@default` n?o ? invocado para nenhuma superf?cie oficial.

**Etapas de Execu??o (Checklist T?cnico):**
- [ ] **Etapa 5.1:** Inserir os 8 `@case` em `clinic-item-svg.component.html`.
- [ ] **Etapa 5.2:** Testes unit?rios em `clinic-item-svg.component.spec.ts` validando aus?ncia de fallback.

**Audit (Testes e Valida??o):**
- [ ] **Cen?rio 1:** Exibir `wallpaper_geometric_teal` na gaveta do cat?logo; verificar swatch geom?trico n?rdico renderizado sem cruz verde.
