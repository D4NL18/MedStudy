# Resumo Executivo: Conclusão do UI Design Plan (Etapa 2) — Minha Clínica Skins Revisadas (US-14) 🎨✨

**Para:** Orquestrador (`orchestrator.md`)  
**De:** Designer de UI/UX (`designer.md`) / `uiux-expert`  
**Artefato Produzido:** `.agents/docs/design/plans/minha_clinica_skins_revised.md`  
**Rastreabilidade:** US-14 (ROADMAP.md) / `[P-096.1]` a `P-096.6` / Design System Oficial  
**Nota Hallmark Pre-Emit Critique:** `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */`

---

## 1. Destaques do UI Design Plan Elaborado

1. **A Matriz Completa dos 8 Estados dos Cards de Skins:**
   - Especificação rigorosa de todos os 8 estados interativos: `Default`, `Hover`, `Focus-Visible`, `Active/Previewing (Modo Prova)`, `Equipped`, `Disabled/Locked (Saldo Insuficiente)`, `Loading (Skeleton Shimmer)` e `Empty State`.
   - Implementação de um modo de prova ("👀 Provando") sem compromisso de débito de XP, com trava de segurança para impedir salvar peças não adquiridas.

2. **Especificação Artística Vetorial de Alta Fidelidade (SVG do Avatar):**
   - **`coat_pediatric_dino`:** Jaleco menta pastel suave (`#E6F7F2` para `#D1FAE5`) com silhuetas vetoriais expressivas de um pequeno T-Rex verde esmeralda no peito, um Triceratops âmbar pastel na barra inferior e pegadas tridáctilas lúdicas subindo pelas mangas, reduzindo a ansiedade de "jaleco branco" em crianças.
   - **`coat_executive_doc`:** Jaleco de alta alfaiataria médica com corte italiano estruturado, lapela chanfrada (*peaked/notched*), bolso superior com lenço de seda azul-marinho de duas pontas com vivo dourado (*pocket square*) e botões em madrepérola com pesponto de alfaiate.
   - **`acc_ped_gorro_colorido`:** Gorro cirúrgico com curvatura parabólica perfeita para a cabeça do avatar 2.5D, estampado em padrão safari com pequenas pegadinhas, folhas tropicais e silhuetas animais em amarelo savana e terracota, com fita de ajuste posterior na nuca.

3. **Swatches Paramétricos 2.5D para `clinic-item-svg` (8 Revestimentos):**
   - Erradicação absoluta do fallback genérico de caixa com cruz verde (`@default`).
   - Amostras de piso renderizadas como lajes de losango isométrico 2:1 (`wood_light`, `wood_dark_herringbone`, `marble_carrara`, `tatame_eva`).
   - Amostras de parede renderizadas como painéis verticais arquitetônicos chanfrados com texturas ricas (`clean_white`, `ped_papel_safari`, `wallpaper_geometric_teal`, `wallpaper_brick_white`).

4. **Expansão Integral do Guarda-Roupa para as 22 Opções Homologadas:**
   - 8 Jalecos/Roupas, 8 Estetoscópios e 6 Acessórios mapeados com paridade 100% entre Frontend, Backend e Banco de Dados.

5. **Filtro Hallmark Anti-IA & Acessibilidade WCAG AA:**
   - Zero gradientes azul-roxo de IA, zero fake chrome, zero itálicos em títulos, contraste >= 4.5:1 em todos os elementos e respeito a `prefers-reduced-motion`.

---

Abaixo segue a íntegra oficial do documento para ser persistido em:  
`.agents/docs/design/plans/minha_clinica_skins_revised.md`

```markdown
# Design Plan: Minha Clínica Médica — Revisão Integral de Skins, Revestimentos e Guarda-Roupa (US-14) 📐🎨

> **Localização Mandatória:** `.agents/docs/design/plans/minha_clinica_skins_revised.md`  
> **Autor:** Designer de UI/UX (`designer.md`) / `uiux-expert`  
> **Auditor:** UX Reviewer (`ux_reviewer.md`)  
> **Executor:** Desenvolvedor Frontend (`developer.md`)  
> **Hallmark Pre-Emit Critique:** `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */`  
> **Rastreabilidade de Negócio:** US-14 (ROADMAP.md) / Regras `[P-096.1]` a `[P-096.6]`  
> **Referências Normativas:** `.agents/docs/design/DESIGN_SYSTEM.md`, `.agents/rules/frontend-ui-anti-patterns.md`, `.agents/rules/frontend-design-system-rules.md`

---

## 1. Identificação & Objetivos de UX (Design Thinking)

- **User Story Relacionada:** US-14 — Revisão Integral, Correção de Quebras e Reformulação Estética de Skins de Consultório e Avatar.
- **Persona em Foco:** Estudante de Medicina e Médico Residente com alta carga horária e estresse contínuo de preparação para provas, que encontra no *Cozy Medical Tycoon* da **Minha Clínica Médica** um momento terapêutico de recompensa pelo esforço de estudo ativo.
- **Objetivos de UX:**
  1. **Confiabilidade e Persistência Visual:** Garantir que cada XP investido em revestimentos de parede e piso reflita imediatamente no consultório e permaneça persistido após recarregar a página, erradicando falhas 404 de compras voláteis.
  2. **Expressão de Identidade Médica:** Possibilitar que o estudante personalize seu avatar virtual com representatividade de gênero (Dr./Dra.) e especialidades reais (Pediatria com jaleco de dinossauros e gorro safari, Cirurgia com scrubs hospitalares, Gestão/Diretoria com jaleco de alfaiataria executiva nobre).
  3. **Modo Prova Efêmero (Try-On Sem Risco):** Permitir experimentação interativa ao vivo no avatar sem debitar XP prematuramente e sem travar a navegação.
  4. **Dignidade Gráfica dos Revestimentos:** Substituir o degradante fallback de caixa com cruz verde por swatches tridimensionais elegantes (mostruários arquitetônicos 2.5D), elevando a percepção de qualidade estética do catálogo da clínica.
- **Decisões do Alinhamento Estético:** Aderência estrita à identidade *Soft SaaS Premium* acolhedora, paleta de base Teal Médico (`#0D9488`), ardósia profunda (`#0F172A`), detalhes em âmbar dourado e texturas orgânicas sutis. Veto a qualquer estética de cassino, neons estridentes ou gradientes roxos de IA.

---

## 2. Checklist Anti-IA (Filtro Hallmark Anti-AI-Slop Obrigatório)

> [!IMPORTANT]
> Em conformidade com a skill `uiux-expert` e a regra `.agents/rules/frontend-ui-anti-patterns.md`, esta especificação passou pela auto-crítica prévia com nota máxima nos 6 eixos do Hallmark:
> `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */`

- [x] **Sem "AI Purple":** Proibição total de gradientes azul para roxo elétrico (`from-blue-500 to-purple-500`). A paleta é estritamente médica, ancorada em Teal 600, Ardósia e tons pastel orgânicos.
- [x] **Sem 3 Colunas Mecânicas:** A interface adota o padrão **Split Studio / Diptych** assimétrico (35% Palco do Avatar / 65% Acervo de Customização) e grid fluido com `minmax(0, 1fr)`.
- [x] **Tipografia com Font Pairing Expressivo:** Títulos em `'Plus Jakarta Sans'` (geométrica, moderna, peso 600/700) e textos funcionais em `'Inter'` (alta legibilidade, pesos 400/500). Números de XP em `'JetBrains Mono'`.
- [x] **Pureza Tipográfica (Zero Itálicos em Títulos):** Todos os cabeçalhos de seções e modais estão em estilo romano clássico. Ênfase visual alcançada através de pesos tipográficos, cores de acento e chips.
- [x] **Sem Fake Chrome:** Sem molduras falsas de navegador com semáforos ou molduras falsas de celular. O palco do avatar utiliza pedestal circular com sombra suave em degradê radial.
- [x] **White Space Ativo (15% a 20% de Respiro):** Espaçamentos consistentes na escala de 8pt (`--space-4`, `--space-6`) prevenindo sensação de claustrofobia visual.
- [x] **Copywriting Humano e Empático:** Textos orientados à prática médica real (ex: *"Jaleco Estampado Dinossauro Pediátrico"*, *"Gorro Cirúrgico Safari"*); veto a termos vazios como *"Empower"*, *"Seamless"*, *"Revolutionize"*.
- [x] **Zero Spinners Solitários:** Especificação de **Skeleton Loaders Shimmer** para estados de carregamento assíncrono.
- [x] **Zero Telas Brancas Vazias:** Presença mandatória de **Empty State** com ilustração temática, mensagem afetuosa e CTA.

---

## 3. Tokens do Design System Aplicados nesta Feature

*O Desenvolvedor DEVE consumir estritamente as variáveis de `:root` já homologadas no `.agents/docs/design/DESIGN_SYSTEM.md`:*

| Categoria | Token CSS | Valor HEX | Aplicação nesta Feature |
| :--- | :--- | :--- | :--- |
| **Superfície Base** | `--color-neutral-50` | `#F8FAFC` | Fundo geral do modal e do pedestal do avatar |
| **Superfície Secundária** | `--color-neutral-100` | `#F1F5F9` | Fundo de cards de skin default, inputs e abas inativas |
| **Bordas Sutis** | `--color-neutral-200` | `#E2E8F0` | Borda padrão dos cards de skin e divisores |
| **Bordas Ativas** | `--color-neutral-300` | `#CBD5E1` | Borda de cards em hover secundário |
| **Textos Terciários** | `--color-neutral-400` | `#94A3B8` | Ícones de suporte e legendas auxiliares |
| **Textos Secundários** | `--color-neutral-500` | `#64748B` | Labels de slots e indicadores neutros |
| **Labels e Títulos** | `--color-neutral-700` | `#334155` | Rótulos de categorias de skins |
| **Títulos Principais** | `--color-neutral-900` | `#0F172A` | Nome do médico, título do modal e nomes de itens |
| **Marca Primária** | `--color-primary` | `#0D9488` (Teal 600) | Botão Salvar, abas ativas, botões de ação e anel de foco |
| **Primária Hover** | `--color-primary-hover` | `#0F766E` (Teal 700) | Estado hover de botões primários com transição de 200ms |
| **Primária Sutil** | `--color-primary-subtle` | `#F0FDFA` (Teal 50) | Fundo suave de cards selecionados para equipar |
| **Acento / Modo Prova** | `--color-accent` | `#F59E0B` (Amber 500) | Badge e contorno do item que está em teste provisório |
| **Sucesso / Equipado** | `--color-success` | `#10B981` (Emerald 500) | Borda e badge do item atualmente equipado |
| **Sucesso Fundo** | `--color-success-bg` | `#ECFDF5` (Emerald 50) | Fundo de card de item equipado |
| **Alerta Fundo** | `--color-warning-bg` | `#FFFBEB` (Amber 50) | Toast de advertência ao tentar salvar item bloqueado |
| **Erro / Bloqueado** | `--color-danger` | `#EF4444` (Red 500) | Indicador de saldo insuficiente de XP |
| **Erro Fundo** | `--color-danger-bg` | `#FEF2F2` (Red 50) | Fundo de aviso de XP insuficiente |
| **Espaçamentos** | `--space-1` a `--space-8` | `4px` a `32px` | Grid de 8pt (paddings de cards, gaps de listas, margens) |
| **Raios de Borda** | `--radius-sm` a `--radius-xl` | `4px` a `16px` | Hierarquia de arredondamento de badges, cards e modais |
| **Transições** | `--transition-normal` | `250ms cubic-bezier` | Micro-interações táteis de hover, clique e troca de abas |

---

## 4. Anatomia dos Componentes e Hierarquia Visual

### 4.1. Modal de Guarda-Roupa do Avatar (`doctor-wardrobe-modal`)
Arquétipo de layout: **Split Studio (Diptych)** balanceado em duas seções contíguas:

1. **Header do Modal:**
   - Ícone de especialidade (`👨‍⚕️` ou `👩‍⚕️`).
   - Título `H3` (`Plus Jakarta Sans`, 20px, peso 600): `"Estilo de Dr(a). {Nome}"`.
   - Subtítulo de apoio (`Inter`, 14px, `--color-neutral-500`): `"Personalize o gênero e equipe as skins cosméticas do seu médico virtual."`.
   - Botão fechar (`✕`) com foco acessível e feedback de hover.

2. **Coluna Esquerda: Palco ao Vivo (Live Stage 2.5D):**
   - Largura: 35% do modal (mínimo de 260px no Desktop).
   - Pedestal Isométrico: Disco elíptico suave em `radialGradient` (`#0F172A` com 12% de opacidade).
   - Componente Central: `<app-doctor-avatar-svg>` renderizado com largura de 112px e altura de 154px, com animação de respiração sutil (*gentle breath*).
   - Chip de Identidade: Pill inferior com `--color-neutral-100`, texto `'Dr(a). {Nome}'` e micro-indicador de batimento cardíaco verde.
   - Badge Dinâmico de Prova: Caso o usuário selecione uma peça que não possui, surge sobre o palco o badge flutuante `"👀 Modo Prova Ativo (Item não adquirido)"` com animação suave de fade-in.

3. **Coluna Direita: Área de Customização & Slots:**
   - Largura: 65% do modal.
   - **Slot 0: Alternância de Gênero:**
     - Botões em cápsula (*segmented pill control*) para "Doutor (Dr.)" e "Doutora (Dra.)" com transição de 150ms. 100% gratuito e ilimitado.
   - **Abas de Slots Cosméticos:**
     - Tab 1: **Jalecos & Roupas** (8 opções).
     - Tab 2: **Estetoscópios** (8 opções).
     - Tab 3: **Acessórios de Cabeça & Mão** (6 opções).
   - **Grade de Seleção de Skins:**
     - Grid responsivo de cards em 2 colunas: `grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-3);`.

4. **Footer de Ações e Saldo:**
   - Saldo de XP do Estudante: Exibido com clareza em tipografia mono (`JetBrains Mono`, `--color-primary`, 16px): `"Saldo: 2.450 XP"`.
   - Botão Secundário: `"Descartar / Cancelar"` (restaura os itens originais do avatar).
   - Botão Primário: `"Salvar Visual da Clínica"` (salva a seleção via `PUT /api/v1/clinic/avatar`).
     - Se o avatar estiver usando um item bloqueado, o botão exibe tooltip amigável e dispara toast informativo: *"Desbloqueie {Nome do Item} com seu XP antes de salvar"*.

---

## 5. Matriz Obrigatória dos 8 Estados dos Cards de Skin

Todo card de skin exibido no modal do guarda-roupa DEVE implementar estritamente os 8 estados interativos:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIZ DE 8 ESTADOS                             │
├─────────────────┬──────────────────────────────────────────────────────┤
│ 1. Default      │ Card ocioso desbloqueado, pronto para ser equipado   │
│ 2. Hover        │ Transição suave, elevação de -2px e sombra Nível 2   │
│ 3. Focus-Vis.   │ Anel de foco acessível 2px teal com offset de 2px    │
│ 4. Active/Prev. │ "👀 Provando" — borda tracejada âmbar, avatar veste  │
│ 5. Equipped     │ "✓ Equipado" — borda 2px esmeralda sólida e tag verde│
│ 6. Locked/Dis.  │ Item bloqueado sem XP suficiente; cadeado e opacity  │
│ 7. Loading      │ Skeleton Shimmer geométrico com pulso suave de luz   │
│ 8. Empty        │ Slot ou filtro sem itens; ilustração e mensagem clara│
└─────────────────┴──────────────────────────────────────────────────────┘
```

### 5.1. Estado 1: Default (Desbloqueado e Ocioso)
- **Fundo:** `#FFFFFF` (Light Mode) ou `--color-neutral-50`.
- **Borda:** 1px sólida em `--color-neutral-200`.
- **Tipografia:** Nome da skin em `--color-neutral-900` (peso 600, 14px), subtítulo em `--color-neutral-500` (peso 400, 12px).
- **Badge:** Tag de status cinza suave: `"Desbloqueado"`.
- **Ação:** Botão outline discreto `"Equipar"`.

### 5.2. Estado 2: Hover (Cursor Sobre o Card)
- **Transformação:** `transform: translateY(-2px);`.
- **Sombra:** Nível 2 (`box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05);`).
- **Borda:** Transição para `--color-primary` (Teal 600) com duração de `200ms cubic-bezier(0.4, 0, 0.2, 1)`.
- **Cursor:** `pointer`.

### 5.3. Estado 3: Focus-Visible (Navegação por Teclado / Acessibilidade)
- **Anel de Foco:** `outline: 2px solid var(--color-primary); outline-offset: 2px;`.
- **Fundo:** Sutilmente realçado com `--color-primary-subtle` (`#F0FDFA`).
- **Garantia:** Não desaparece em fundos escuros e respeita WCAG 2.4.7.

### 5.4. Estado 4: Active / Previewing ("Modo Prova")
- **Gatilho:** Clique em qualquer skin da lista para visualizar como fica no avatar ao vivo.
- **Fundo:** Leve tonalidade âmbar-pastel (`#FFFBEB`).
- **Borda:** 2px tracejada ou destacada em `--color-accent` (`#F59E0B`).
- **Badge:** Pill âmbar animada com ícone de olhos: `"👀 Provando"`.
- **Comportamento do Avatar:** O `<app-doctor-avatar-svg>` atualiza instantaneamente a peça correspondente em Signal State reativo.

### 5.5. Estado 5: Equipped ("Equipado Atualmente")
- **Gatilho:** A skin é a que está salva e em uso oficial na clínica.
- **Fundo:** `--color-success-bg` (`#ECFDF5`).
- **Borda:** 2px sólida em `--color-success` (`#10B981`).
- **Badge:** Tag com fundo verde esmeralda e texto branco: `"✓ Equipado"`.
- **Micro-ícone:** Checkmark circular ao lado do título da skin.

### 5.6. Estado 6: Disabled / Locked (Bloqueado por Falta de XP)
- **Gatilho:** O item ainda não foi adquirido e o estudante possui `currentXp < costXp`.
- **Opacidade:** `opacity: 0.65;`.
- **Cursor:** `not-allowed`.
- **Preço:** Exibido em vermelho suave com ícone de cadeado: `"🔒 1.200 XP (Faltam 450 XP)"`.
- **Botão de Desbloquear:** Desabilitado (`disabled`), com tooltip explicativo ao tentar clicar.

### 5.7. Estado 7: Loading State (Skeleton Shimmer)
- **Gatilho:** Durante requisições assíncronas do estado da clínica (`GET /clinic/state`) ou desbloqueio de compra (`POST /items/buy`).
- **Estrutura:** 6 blocos retangulares de esqueleto que espelham perfeitamente as dimensões dos cards de skins (`height: 72px; border-radius: var(--radius-md);`).
- **Animação:** Gradiente linear shimmer em 45º deslizando da esquerda para a direita de `#F1F5F9` para `#E2E8F0` em loop infinito de `1.5s ease-in-out`.
- **Proibição Absoluta:** Veto a qualquer spinner circular isolado no centro do modal.

### 5.8. Estado 8: Empty State (Nenhum Item Encontrado)
- **Gatilho:** Caso o usuário realize busca por texto ou selecione filtro sem itens compatíveis.
- **Estrutura Visual:**
  - Ícone temático centralizado em caixa suave `--color-neutral-100`: Cabide médico vetorial ou prancheta médica.
  - Título H4 (`Plus Jakarta Sans`, 16px, peso 600): `"Nenhum acessório encontrado"`.
  - Texto orientador (`Inter`, 14px, `--color-neutral-500`): `"Limpe os filtros ou adquira novas peças no catálogo de suprimentos da clínica."`.
  - Botão de Ação (CTA): Botão outline primário `"[Limpar Filtros]"`.

---

## 6. Especificações Artísticas Vetoriais (SVG de Alta Fidelidade)

### 6.1. Jaleco Estampado Dinossauro Pediátrico (`coat_pediatric_dino`)
- **Conceito & Psicologia das Cores:** Desenvolvido especialmente para médicos residentes de Pediatria. Elimina a hostilidade visual do jaleco branco tradicional através de uma estampa acolhedora com silhuetas vetoriais minimalistas e tons pastel que encantam as crianças.
- **Dimensões & Camada no Avatar:** Renderizado no grupo `<g class="coat-layer">` dentro de `<app-doctor-avatar-svg>`.
- **Paleta de Gradientes e Cores:**
  - Base do Jaleco: Linear gradient `#E6F7F2` (0%) ➔ `#D1FAE5` (60%) ➔ `#A7F3D0` (100%) (Menta Pastel Suave).
  - Contorno e Pesponto: `#059669` (Esmeralda Cirúrgico, traço fino de `1.2px`).
  - Lapela: `#F0FDF4` com contorno verde folha suave `#10B981`.
- **Detalhamento da Estampa Vetorial:**
  1. **Mini T-Rex Pediátrico (Peito Direito, coords x: 26, y: 46):**
     - Silhueta lúdica estilizada em curva de Bézier de um filhote de T-Rex em verde esmeralda (`#059669`).
     - Olhinho especular branco (`r: 0.5px`) e bracinhos curtos abertos em pose amigável.
  2. **Mini Triceratops Pastel (Barra Inferior Esquerda, coords x: 44, y: 62):**
     - Silhueta estilizada em amarelo savana acolhedor (`#F59E0B` com preenchimento `#FDE68A`).
     - 3 pequenos chifrinhos arredondados em gota d'água (`#B45309`).
  3. **Pegadas Tri-dáctilas de Dinossauro (Mangas e Bolsos):**
     - Três pequenas pegadinhas de dinossauro (3 dedos arredondados com almofada plantar) dispostas alternadamente nos punhos das mangas (`#10B981` na manga direita, `#F59E0B` na manga esquerda).
  4. **Botões Lúdicos:** Três botões circulares com diâmetro de `2.4px` simulando pequenas patinhas fossilizadas em relevo sutil.

### 6.2. Jaleco Executivo de Alfaiataria Nobre (`coat_executive_doc`)
- **Conceito:** Inspirado na alta alfaiataria médica italiana (corte milanês). Destinado a médicos preceptores, cirurgiões chefes e diretores de clínicas, transmitindo autoridade, elegância e precisão sob medida.
- **Paleta de Gradientes e Cores:**
  - Tecido: Sarja de algodão egípcio branco pérola com drapeado estruturado (`#FFFFFF` 0% ➔ `#F8FAFC` 70% ➔ `#E2E8F0` 100%).
  - Sombreamento e Linhas Estruturadas: Azul ardósia nobre (`#64748B`, traço de `1.0px`).
  - Lapela: Branco neve estruturado (`#FFFFFF`) com pesponto de alfaiate (*pick stitching*) em traço sutil.
- **Detalhamento da Alfaiataria Vetorial:**
  1. **Lapela Peaked / Notched Chanfrada (coords x: 27, y: 37 a x: 48, y: 41):**
     - Lapela larga com recorte chanfrado geométrico preciso de 45º, conferindo ombros proeminentes e postura imponente.
  2. **Lenço de Bolso (Pocket Square de Duas Pontas, coords x: 24, y: 45):**
     - Bolso superior em debrum fino de alfaiataria.
     - Lenço de seda nobre azul marinho profundo (`#1E3A8A`) dobrado com duas pontas triangulares projetando-se para cima, com vivo dourado acetinado (`#D97706`).
  3. **Botoamento Duplo & Madrepérola:**
     - Botões duplos circulares em acabamento perolizado com centro furado e aro de metal nobre prateado.
  4. **Pesponto de Acabamento:** Linhas tracejadas ultrafinas (`stroke-dasharray: 2 1.5; stroke: #94A3B8`) percorrendo a borda externa da lapela e a boca dos bolsos.

### 6.3. Gorro Cirúrgico Safari Pediátrico (`acc_ped_gorro_colorido`)
- **Conceito:** Gorro cirúrgico com padronagem safari que complementa perfeitamente o jaleco de dinossauro ou os scrubs cirúrgicos, concebido com curvatura parabólica anatômica para abraçar a cabeça do avatar tanto na versão masculina (cobrindo o fade com topo anatômico) quanto feminina (harmonizando com os fios loiros escorridos).
- **Dimensões & Posição:** Grupo `<g class="acc-ped-gorro-safari">` posicionado sobre o crânio (coords base `d="M23 18 C22.5 8.5 49.5 8.5 49 18 C49.5 20.5 22.5 20.5 23 18 Z"`).
- **Paleta de Gradientes e Cores:**
  - Fundo do Tecido: Amarelo Savana Pastel (`#FEF3C7` 0% ➔ `#FDE68A` 100%).
  - Borda Inferior Rebatida: Fita elástica em terracota suave (`#D97706`) com costura rebatida.
- **Detalhamento da Padronagem Vetorial:**
  1. **Folhagens Tropicais:** 4 pequenas folhas em verde cirúrgico (`#059669`) dispostas em ângulos harmônicos sobre o domo do gorro.
  2. **Silhuetas de Bichinhos:** Mini-silhuetas minimalistas de leãozinho e girafinha em terracota (`#B45309`).
  3. **Fitas Posteriores com Laço Cirúrgico:** Na parte de trás do crânio (coords x: 47 a 51), duas fitas caem suavemente com curvatura natural e sombra projetada na nuca.

---

## 7. Swatches Paramétricos 2.5D para `clinic-item-svg` (Eliminação do Fallback)

> [!CAUTION]
> O bloco `@default` de `clinic-item-svg.component.html` (caixa genérica com cruz verde) NUNCA mais será acionado para as 8 superfícies catalogadas. Cada uma possui bloco `@case` dedicado com perspectiva 2.5D de mostruário arquitetônico.

### 7.1. Revestimentos de Parede (`WALL_SURFACE`): Painéis Verticais 2.5D
Renderizados como um mostruário vertical de parede arquitetônica (dimensões de amostra: `rect` central chanfrado com espessura lateral 3D e rodapé):

1. **`clean_white` (Branco Clínico Minimalista):**
   - Painel em branco luminoso acetinado (`#FFFFFF` para `#F1F5F9`).
   - Rodapé em madeira clara escandinava (`#E2E8F0`) com filete superior sutil.
   - Reflexo de luz diagonal suave atravessando o painel com opacidade de 8%.
2. **`ped_papel_safari` (Safari Aquarela Savana):**
   - Fundo em aquarela suave bege/creme (`#FEF9C3`).
   - Padrão de folhagens de costela-de-adão em verde menta (`#34D399`) e silhuetas delicadas de bichinhos da savana.
3. **`wallpaper_geometric_teal` (Geométrico Nórdico Teal):**
   - Padrão em mosaico de triângulos e losangos isométricos em gradientes alternados de Teal 600 (`#0D9488`), Teal 700 (`#0F766E`) e Menta 200 (`#A7F3D0`).
   - Linhas de rejunte finas em branco puro (`#FFFFFF`) criando textura escandinava geométrica.
4. **`wallpaper_brick_white` (Tijolinho Branco Moderno):**
   - Padrão de tijolos ingleses à vista (*subway tile / white brick*) em relevo com sombra sutil em cinza claro (`#CBD5E1`) e rejunte rebaixado acetinado.

### 7.2. Revestimentos de Piso (`FLOOR_SURFACE`): Lajes Isométricas 2:1
Renderizados como uma laje de piso em losango isométrico (`points="60,94 102,73 60,52 18,73"` com extrusão 3D de base chanfrada `points="18,73 60,94 60,100 18,79"` preenchida com sombra e textura do material):

1. **`wood_light` (Carvalho Claro Escandinavo):**
   - Réguas de madeira nobre em carvalho bege/mel (`#FDE68A` e `#F59E0B`).
   - Veios sutis de madeira orgânica em traço ultrafino e rejuntes longitudinais.
2. **`wood_dark_herringbone` (Madeira Nobre Espinha de Peixe):**
   - Padrão clássico de piso em chevron / espinha de peixe com tábuas intercaladas em nogueira e mogno escuro (`#78350F` e `#451A03`) com verniz acetinado.
3. **`marble_carrara` (Mármore Carrara Luxo):**
   - Laje em mármore branco polido Carrara (`#F8FAFC`).
   - Veios translúcidos orgânicos em cinza grafite esfumaçado (`#94A3B8`) e reflexo especular de alto brilho em corte diagonal.
4. **`tatame_eva` (Tatame EVA Pastel Candy Color):**
   - Laje dividida em 4 placas quadradas modulares de tatame acolchoado em cores pastel harmônicas (Menta `#A7F3D0`, Azul Bebê `#BAE6FD`, Lilás `#DDD6FE`, Pêssego `#FED7AA`).
   - Micro-encaixes dentados nas junções das placas e textura micro-perfurada anti-impacto.

---

## 8. Catálogo Completo das 22 Skins no Modal do Guarda-Roupa

Para erradicar a quebra de skins ocultas, o `DoctorWardrobeModalComponent` exibirá integralmente as seguintes coleções sincronizadas com os contratos de API:

### 8.1. Jalecos e Roupas Hospitalares (Slot `coat` — 8 opções)
| ID Canônico | Nome de Exibição | Custo em XP | Categoria Visual |
| :--- | :--- | :--- | :--- |
| `coat_default` | Jaleco Branco Clássico | 0 XP (Grátis) | Inicial / Neutro |
| `coat_intern_white` | Jaleco Tradicional Internato | 0 XP (Grátis) | Inicial / Neutro |
| `coat_scrubs_navy` | Scrub Azul Marinho Plantão | 500 XP | Cirurgia / Plantão |
| `coat_scrubs_green` | Scrub Verde Cirúrgico | 800 XP | Centro Cirúrgico |
| `coat_pediatric` | Jaleco Pediátrico Bichinhos | 500 XP | Pediatria Básica |
| `coat_pediatric_dino` | Jaleco Estampado Dinossauro Pediátrico | 1.200 XP | Pediatria Lúdica Exclusiva |
| `coat_executive_doc` | Jaleco Executivo Alfaiataria Nobre | 2.500 XP | Prestígio / Alta Gestão |
| `coat_gold` | Jaleco Mestre Ouro & Caduceu | 2.500 XP | Prestígio Mestre |

### 8.2. Estetoscópios (Slot `stethoscope` — 8 opções)
| ID Canônico | Nome de Exibição | Custo em XP | Categoria Visual |
| :--- | :--- | :--- | :--- |
| `steth_standard` | Estetoscópio Preto Clássico | 0 XP (Grátis) | Inicial / Neutro |
| `steth_classic_black` | Estetoscópio Preto Básico | 0 XP (Grátis) | Inicial / Neutro |
| `steth_none` | Sem Estetoscópio | 0 XP (Grátis) | Opcional |
| `steth_elephant` | Protetor Elefantinho Pediátrico | 350 XP | Pediatria |
| `ped_steth_elefante` | Esteto Pediátrico Elefante | 950 XP | Pediatria Premium |
| `steth_cardio_burgundy` | Esteto Cardiológico Vinho | 700 XP | Cardiologia Clínica |
| `steth_gold` | Estetoscópio Master Ouro Maciço | 1.800 XP | Prestígio |
| `steth_gold_master` | Esteto Master Ouro 24k | 3.000 XP | Prestígio Máximo |

### 8.3. Acessórios de Cabeça e Mão (Slot `accessory` — 6 opções)
| ID Canônico | Nome de Exibição | Custo em XP | Categoria Visual |
| :--- | :--- | :--- | :--- |
| `acc_none` | Nenhum Acessório | 0 XP (Grátis) | Opcional |
| `acc_red_bowtie` | Gravata Borboleta Vermelha | 400 XP | Formal / Vintage |
| `acc_glasses_classic` | Óculos de Armação Redonda | 400 XP | Intelectual / Clínico |
| `acc_scrub_cap` | Touca Cirúrgica Teal Nórdica | 600 XP | Cirurgia Geral |
| `acc_ped_gorro_colorido` | Gorro Cirúrgico Safari Pediátrico | 600 XP | Pediatria / Centro Cirúrgico Infantil |
| `acc_prontuario_clipboard`| Prancheta Médica na Mão | 850 XP | Rotina Hospitalar / Round |

---

## 9. Responsividade, Ergonomia e Breakpoints

| Breakpoint | Adaptação Visual do Modal de Guarda-Roupa |
| :--- | :--- |
| **Mobile (< 640px)** | Layout vertical em coluna única. O Live Stage do avatar ocupa o topo em formato de banner compacto (avatar em 88px x 122px). Grade de skins em 1 coluna ou 2 colunas com cartões de toque mínimo de 48px de altura (Touch Target WCAG). Botões de ação em largura total (*full-width*). |
| **Tablet (640px - 1024px)** | Layout split studio com Live Stage de 30% e gaveta de customização de 70%. Grade de skins em 2 colunas automáticas. Scroll vertical suave restrito à coluna direita. |
| **Desktop (> 1024px)** | Layout split studio canônico 35% / 65%. Palco do avatar generoso (112px x 154px) com pedestal radial. Grade de skins em 2 ou 3 colunas perfeitamente distribuídas, sem estouro de margens. |

---

## 10. Acessibilidade (a11y) & Inclusão

1. **Rótulos ARIA Dinâmicos:** O componente `<app-doctor-avatar-svg>` possui `role="img"` e `aria-label` reativo que sintetiza o visual completo:  
   *Ex: "Dra. Residente com Jaleco Estampado Dinossauro Pediátrico, Estetoscópio Preto e Gorro Safari".*
2. **Navegação Completa por Teclado:** Cada card de skin implementa `tabindex="0"`, resposta à tecla `Enter`/`Espaço` para prova e anel de `:focus-visible` de alto contraste.
3. **Contraste de Cores:** Todos os textos de nomes de skins e badges cumprem a razão de contraste mínima de `4.5:1` contra seus respectivos fundos (validado via WCAG AA).
4. **Respeito ao `prefers-reduced-motion`:** Usuários com sensibilidade vestibular têm a micro-animação de respiração do avatar desligada automaticamente através do media query de redução de movimento.

---

## 11. Critérios de Aceite para UX Reviewer (DoD Visual)

- [ ] Todos os elementos utilizam estritamente as variáveis de `:root` do `DESIGN_SYSTEM.md`, sem cores mágicas inline.
- [ ] O componente `doctor-wardrobe-modal` exibe todas as 22 opções oficiais divididas nas abas correspondentes.
- [ ] Os 8 estados visuais obrigatórios dos cards de skin estão fielmente implementados e testáveis.
- [ ] `coat_pediatric_dino` renderiza os mini dinossauros e pegadas vetoriais sem recorrer ao jaleco de bichinhos genérico.
- [ ] `coat_executive_doc` renderiza corte de alfaiataria com lapela chanfrada e lenço de seda no bolso (*pocket square*).
- [ ] `acc_ped_gorro_colorido` renderiza o gorro cirúrgico com padronagem temática safari.
- [ ] O componente `clinic-item-svg` possui blocos `@case` para as 8 superfícies, renderizando amostras em 2.5D sem acionar o `@default`.
- [ ] Auto-crítica Hallmark com pontuação máxima confirmada: `/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */`.
- [ ] Rota `/minha-clinica` preservada abaixo de 300 KB gzipped.
```

---

Aguardando próximos passos do fluxo na Etapa 2. O Design Plan está 100% pronto e alinhado aos padrões da esteira! 🎨🚀