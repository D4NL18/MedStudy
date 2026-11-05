# Entidade / Feature: Minha Clínica — Hotfix de UX, Picking e Responsividade

Este documento centraliza o diagnóstico, as decisões e a validação do hotfix aplicado após o PR #58 (branch `fix/minha-clinica-ux-responsividade`). Regras rastreáveis: `P-084`, `P-088`, `P-089`, `P-090`.

## 1. Dúvidas Resolvidas (Especificação)
- **Dúvida:** A rotação deve ter 4 orientações (0–3) como o toggle da UI fazia?
  - **Decisão:** Não. `P-084` e o `CHECK (rotation IN (0, 1))` da V25 definem rotação binária; o SVG só espelha em 2 estados. O toggle passa a alternar 0 ↔ 1.
- **Dúvida:** Um item de parede bloqueia o tile de piso à frente dele (e vice-versa)?
  - **Decisão:** Não. `P-088` desacopla as camadas e o `ClinicLayoutValidator` do backend já fazia isso; o frontend era mais restritivo e gerava "posição inválida" falsa.
- **Dúvida:** Como confirmar posição em telas de toque, que não têm hover?
  - **Decisão:** 1º toque posiciona o ghost; 2º toque no mesmo alvo (ou o botão ✓ Confirmar) confirma. Mouse continua confirmando no clique.
- **Dúvida:** Girar um móvel já posicionado altera o layout na hora?
  - **Decisão:** Não. Girar altera apenas o preview; o layout só muda ao confirmar a posição (validada com o footprint girado). Cancelar (✕ ou Esc) nunca deixa móvel girado e sobreposto.

---

## 2. Tarefas e Etapas de Desenvolvimento

### Tarefa 1: Guarda-roupa do Doutor(a) como modal real

**Descritivo Detalhado:**
Os estilos de modal ficaram no SCSS da página após a componentização e o encapsulamento emulado não os aplicava ao `DoctorWardrobeModalComponent`, que renderizava em fluxo abaixo da gaveta.

**Critérios de Aceite:**
- [x] O guarda-roupa abre como overlay fixo (`role="dialog"`, `aria-modal`), com foco preso no diálogo e devolvido ao fechar.
- [x] Fecha por ✕, Cancelar, Esc e clique fora do card.
- [x] No mobile (≤ 640px) vira *bottom sheet* com o preview do avatar fixo no topo da rolagem.

**Etapas de Execução (Checklist Técnico):**
- [x] **Etapa 1:** SCSS autossuficiente do modal (backdrop, card, header, body rolável, footer fixo).
- [x] **Etapa 2:** `cdkTrapFocus` com auto-captura e `onBackdropClick` por `target === currentTarget`.

**Audit (Testes e Validação):**
- [x] **Cenário 1:** `doctor-wardrobe-modal.component.spec.ts` — overlay `position: fixed`, foco dentro do diálogo, Esc/backdrop fecham e clique interno não.
- [x] **Cenário 2:** Navegador real (backend local) em 1024px e 375px.

---

### Tarefa 2: Picking e confirmação de posição no grid (P-084, P-088, P-090)

**Descritivo Detalhado:**
O `<svg>` de `ClinicItemSvgComponent` tinha `pointer-events: visiblePainted` próprio e as regras `.is-placing` do viewport não atravessavam o encapsulamento: o sprite ghost (sobre o tile do cursor) e os móveis engoliam clique e hover. Somavam-se a rotação 0–3 (ghost validava uma, clique outra, banco rejeitava 2/3), a colisão parede × piso e a ambiguidade NW-0 × NE-0 no tile (0, 0).

**Critérios de Aceite:**
- [x] Durante o posicionamento nenhum sprite (ghost, móveis, avatar) intercepta o ponteiro; fora dele, só os traços desenhados são clicáveis.
- [x] Ghost e clique usam a mesma regra (rotação binária, projeção de parede `resolveWallSlot`, slot explícito `isWallSlotFree`).
- [x] Pílula de edição com ✓ Confirmar / ✕ Cancelar / ↻ Girar; Esc cancela; o ghost nasce na posição atual do móvel selecionado.
- [x] Toque: 1º toque prevê, 2º toque no mesmo alvo (comparado pelo slot resolvido) confirma.
- [x] Realocação do(a) Doutor(a) considera apenas móveis de piso.

**Etapas de Execução (Checklist Técnico):**
- [x] **Etapa 1:** Input `interactive` em `ClinicItemSvgComponent` e `DoctorAvatarSvgComponent`.
- [x] **Etapa 2:** `ClinicService`: `isWallMountedItem`, `isPlacedWallItem`, `resolveWallSlot`, `isWallSlotFree`; colisão parede × piso removida.
- [x] **Etapa 3:** Viewport com Pointer Events, `hoveredWallSide`, `touchPreviewKey`, `confirmPlacement`, `onCancelPlacement`.
- [x] **Etapa 4:** Página: rotação binária só no preview, `cancelPlacement`, Esc, `equipItemNow` via `selectItemForPlacement`.

**Audit (Testes e Validação):**
- [x] **Cenário 1:** `clinic-viewport.component.spec.ts` — ghost não interativo, clique de mouse, toque em 2 etapas, slot NE explícito, ghost na posição atual.
- [x] **Cenário 2:** `clinic.service.spec.ts` — P-088 (móvel sob quadro e vice-versa, NE-0 × NW-0, projeção, detecção de item de parede).
- [x] **Cenário 3:** `minha-clinica.component.spec.ts` — item de parede no slot NE acima de móvel, Doutor(a) sob item de parede, "Posicionar Agora" + Esc.
- [x] **Cenário 4:** Navegador real: mover a maca com mouse e salvar (`PUT /api/v1/clinic/layout` → 200) com TV fixada na parede NE.

---

### Tarefa 3: Teatro de Caixas da Sorte

**Descritivo Detalhado:**
`z-index: 99999` deixava o modal de erro (10000) escondido atrás do teatro; cabeçalho e rodapé sem quebra de linha; `100vw` gerava overflow horizontal; não fechava por backdrop/Esc.

**Critérios de Aceite:**
- [x] Teatro em `z-index: 1100`, abaixo do modal de erro, que agora recebe o foco.
- [x] Cabeçalho em grid responsivo, tela cheia no mobile, tiers em coluna única.
- [x] Fecha por clique fora e Esc (exceto durante o unboxing).

**Audit (Testes e Validação):**
- [x] **Cenário 1:** `clinic-lootbox-modal.component.spec.ts` — camada abaixo do erro, fechamento e bloqueio por saldo.
- [x] **Cenário 2:** Navegador real: resgate da caixa diária, revelação e "Posicionar Agora".

---

### Tarefa 4: Responsividade da página

**Descritivo Detalhado:**
Palco com largura mínima de 580px sem ajuste, HUD com `min-width` rígido, padding acumulado no mobile e gaveta sem breakpoints.

**Critérios de Aceite:**
- [x] Diorama encaixa no container (`fitScale` 0,35–1,5 via `ResizeObserver` + medição síncrona).
- [x] HUD fluido (2 colunas no mobile), palco com altura relativa à viewport, gaveta com abas roláveis e cards em 2 colunas.
- [x] Sem rolagem horizontal em 375px.

**Audit (Testes e Validação):**
- [x] **Cenário 1:** `clinic-viewport.component.spec.ts` — `fitScale` < 1 em container de celular.
- [x] **Cenário 2:** Navegador real em 375 × 812, 1024 × 768 e 1366 × 768.

---

## 3. Fora do Escopo (Débito Registrado)
- `ClinicLayoutValidator.java` aceita `rotation` 0–3, mas o banco só aceita 0/1: retorna 500 em vez de 422. Alinhar o validador a `P-084`.
- Suíte completa do frontend falha já na `main` (216 testes) por incompatibilidade do `ng-mocks` com o `TestBed` atual.
- Token de sessão em `localStorage` (`auth_token`) viola a regra global de segurança (cookies `HttpOnly`).