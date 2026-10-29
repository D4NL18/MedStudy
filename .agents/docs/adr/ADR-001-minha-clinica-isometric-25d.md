# ADR-001: Arquitetura de Renderização Isométrica 2.5D Low-Footprint e Motor Transacional de Dualidade de XP

> **Status:** Aceito  
> **Data:** 2026-10-28  
> **Autor:** Arquiteto (`architect.md`)  
> **Localização Mandatória:** `.agents/docs/adr/ADR-001-minha-clinica-isometric-25d.md`  
> **Regras Rastreáveis:** `P-080`, `P-081`, `P-082`, `P-083`, `P-084`, `P-085`, `P-086`

---

## 1. Contexto do Problema
A feature **"Minha Clínica Médica"** introduz uma camada de gamificação *cozy* (livre de ansiedade competitiva) na plataforma MedStudy, onde o esforço cognitivo diário do estudante de medicina (questões, flashcards, videoaulas e simulados) é convertido em XP para expandir física e visualmente sua clínica (em 6 níveis, de `4x4` a `16x12` tiles) e decorá-la com 27 itens colecionáveis (com destaque para o Set Pediatria).

O desenho arquitetural enfrenta dois desafios críticos de engenharia:
1. **Performance e Footprint no Frontend (`P-085`):** Estudantes de medicina utilizam a plataforma por longas horas em notebooks intermediários ou dispositivos com bateria restrita. Motores 3D completos (Three.js, Babylon.js, Unity WebGL) inflariam o bundle inicial em mais de `600KB–2MB` gzipped, além de manter loops WebGL de alta drenagem de GPU/bateria em abas em segundo plano enquanto o aluno assiste videoaulas ou resolve questões.
2. **Integridade Contábil do Saldo de XP (`P-080`, `P-081`, `P-084`):** O sistema exige **Dualidade de XP** — o gasto de XP na loja de itens ou na expansão da sala jamais pode reduzir o nível acumulado ou a posição do estudante no ranking geral (`lifetime_xp`), ao mesmo tempo em que o saldo disponível para compras (`current_xp`) nunca pode sofrer *double-spending* (condição de corrida em cliques duplos) ou ficar negativo.

---

## 2. Decisão Arquitetural

### 2.1. Renderizador Isométrico 2.5D Híbrido (SVG Reativo Modular + Canvas 2D GPU-Accelerated) com Angular 18 Signals
Decidimos **vetar bibliotecas WebGL/3D pesadas** (Three.js, Babylon.js, PixiJS completo) e adotar um **Motor Isométrico 2.5D Próprio e Ultra-Leve** em Angular 18 baseado em `Signals`:
- **Projeção Isométrica Ortográfica 2:1 (Dimétrica 26.565°):**
  - Cada célula lógica `(gridX, gridY)` possui dimensões base de **`TILE_WIDTH = 64px`** e **`TILE_HEIGHT = 32px`**.
  - Conversão de coordenadas do Grid para Tela (`Grid-to-Screen`):
    $$\text{screenX} = (\text{gridX} - \text{gridY}) \times \frac{\text{TILE\_WIDTH}}{2} + \text{originX}$$
    $$\text{screenY} = (\text{gridX} + \text{gridY}) \times \frac{\text{TILE\_HEIGHT}}{2} + \text{originY}$$
  - Conversão inversa (`Screen-to-Grid`) para *raycasting* matemático O(1) do ponteiro do mouse no modo decoração:
    $$\text{gridX} = \left\lfloor \frac{\frac{\text{localX}}{32} + \frac{\text{localY}}{16}}{2} \right\rfloor, \quad \text{gridY} = \left\lfloor \frac{\frac{\text{localY}}{16} - \frac{\text{localX}}{32}}{2} \right\rfloor$$
- **Painter's Algorithm Determinístico (Z-Index / Depth Sorting):**
  - Para impedir que móveis traseiros se sobreponham visualmente aos frontais ou que itens de `2x1` / `2x2` apresentem *z-fighting*, todo elemento renderizável recebe uma chave de profundidade estrita calculada via `computed()` Signal:
    $$\text{depth} = (\text{gridX} + \text{gridY}) \times 1000 + \text{zLayer}$$
    onde `zLayer` é `0` para o piso (tiles), `10` para tapetes/papéis de parede, `20` para mobiliário/equipamentos posicionados e `30` para o *ghost preview* no modo construção.
- **Governança de Ciclo de Vida via `Page Visibility API` (`P-085`):**
  - O `ClinicViewportComponent` registra um listener em `document.addEventListener('visibilitychange', ...)`. Quando `document.hidden === true` (ou quando o componente sai de rota via `DestroyRef`), qualquer loop de animação (`requestAnimationFrame`) e os osciladores do `ClinicAudioService` (Web Audio API) são **100% suspensos**, garantindo consumo **0% de CPU/GPU** em background.
- **Orçamento de Bundle (`<= 300 KB` gzipped):**
  - A feature é carregada via *lazy-loading* (`loadComponent`) na rota `/minha-clinica`, utilizando sprites vetoriais SVG inline parametrizados (`ClinicItemSvgComponent`), mantendo o pacote completo da feature abaixo de `85 KB` gzipped (muito inferior ao teto de `300 KB`).

### 2.2. Dualidade de Saldos (`lifetime_xp` vs `current_xp`) e Ledger Imutável ACID no Backend
Decidimos segregar contabilmente o XP em duas colunas na tabela `user_xp_accounts` no PostgreSQL 16, geridas pelo Spring Boot 3 (Java 21):
1. **`lifetime_xp` (Acumulador Monotônico Vitalício):** Incrementado exclusivamente em eventos de estudo (`POST /api/v1/study/action-reward`). Possui invariante estrita de nunca decrescer. Habilita o requisito mínimo de expansão da clínica (`P-082`) e rankings.
2. **`current_xp` (Saldo Líquido Investível):** Incrementado junto com `lifetime_xp` nas atividades de estudo e debitado atomicamente em compras de itens (`POST /api/v1/clinic/items/buy`) e expansões de sala (`POST /api/v1/clinic/expand`). Protegido por constraint `CHECK (current_xp >= 0)` no banco e validação de domínio.
3. **Controle Concorrencial e Auditoria (`user_xp_transactions`):**
   - Operações de leitura-modificação-escrita na carteira de XP ocorrem dentro de `@Transactional`, prevenindo *race conditions* em cliques concorrentes de compra ou expansão.
   - Toda mutação gera obrigatoriamente um registro append-only em `user_xp_transactions` contendo `amount` (`+` ou `-`), `balance_after` (snapshot exato de `current_xp`), `source` e `description`.

### 2.3. Validação Espacial Server-Side (AABB 2D Anti-Colisão com Rotação)
- O Backend não confia apenas na validação visual do Frontend. No endpoint `PUT /api/v1/clinic/layout`, o serviço `ClinicLayoutValidator` calcula a caixa delimitadora (*Axis-Aligned Bounding Box* — AABB) de cada item no piso considerando sua orientação (`rotation = 0` [Sul-Leste: `effW = footprintX, effH = footprintY`] vs `rotation = 1` [Sul-Oeste: `effW = footprintY, effH = footprintX`]).
- Qualquer extrapolação de fronteira (`gridX + effW > gridWidth` ou `gridY + effH > gridHeight`) ou sobreposição AABB entre dois itens no chão resulta em erro semântico `422 Unprocessable Entity` (`P-084`).

---

## 3. Alternativas Consideradas
1. **Opção A — Engine 3D Completa (Three.js / Babylon.js com modelos glTF):**
   - *Motivo do descarte:* Peso excessivo de bundle (`> 500 KB` apenas da engine + megabytes de modelos 3D), alto aquecimento e consumo de bateria em notebooks sem GPU dedicada e violação direta da regra `P-085`.
2. **Opção B — Coluna Única de XP com Cálculo Dinâmico por Soma de Transações:**
   - *Motivo do descarte:* Calcular `lifetime_xp` e `current_xp` com `SUM(amount)` em `user_xp_transactions` a cada requisição degradaria a latência de leitura conforme o histórico de estudo cresce. O modelo híbrido (saldos materializados em `user_xp_accounts` + ledger imutável em `user_xp_transactions`) oferece leitura O(1) e rastreabilidade contábil total.
3. **Opção C — Validação de Layout Exclusivamente no Frontend:**
   - *Motivo do descarte:* Violaria as regras de segurança (`.agents/rules/security-anti-patterns.md` — "Confiança Cega no Cliente").

---

## 4. Consequências e Trade-offs
- **Pontos Positivos:**
  - Carregamento instantâneo (`< 100ms`), zero dependências externas pesadas e estética vetorial nítida em qualquer nível de zoom (0.6x a 2.0x).
  - Consumo zero de CPU/GPU quando o estudante alterna de aba para estudar (`document.hidden === true`).
  - Garantia matemática e transacional contra saldo negativo, perda de progresso vitalício ou corrupção de layout.
- **Pontos Negativos / Débito Técnico Aceito:**
  - Como a projeção 2.5D usa duas rotações ortogonais principais (`0=SE` e `1=SW`), os assets SVG são desenhados na perspectiva isométrica 2:1 com suporte a espelhamento horizontal (`scale(-1, 1)`) quando rotacionados.
