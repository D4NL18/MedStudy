# ADR-009: Resolução de Picking Isométrico, Remoção da Faixa de Simulação de XP e Catálogo Expandido de 104 Itens 🏥📐

**Status:** Aprovado  
**Data:** 2026-10-28  
**Contexto:** Módulo Gamificado "Minha Clínica Médica" (MedStudy)  
**Decisores:** Arquiteto de Software, Especialista UI/UX, DBA, Analista de Requisitos, SecOps & Privacy Officer  

---

## 1. Contexto e Problema

Durante a navegação e edição no consultório da Minha Clínica Médica, foram reportados os seguintes pontos de atrito:
1. **Bug no Picking Isométrico:** Ao clicar em itens ou ladrilhos no topo do grid (ex: `gridX: 0, gridY: 0`), o clique era registrado na diagonal inferior direita (`gridX: 1, gridY: 1`). O diagnóstico revelou que as âncoras HTML retangulares (`.placed-item-anchor`, `.doctor-avatar-anchor` e `.ghost-item-anchor`) com `pointer-events: auto` possuem áreas transparentes que extrapolam o losango isométrico e cobrem os ladrilhos subjacentes e adjacentes.
2. **Poluição Visual no Topo:** A barra de simulação manual de estudo (`.study-actions-strip`) com chips de acerto de questão, flashcards e aulas estava visível no topo da clínica, comprometendo a imersão e o foco do consultório.
3. **Escassez de Variedade no Catálogo:** O catálogo inicial continha 27 itens, insuficiente para engajar o estudante de medicina ao longo de meses de preparação para residência.

---

## 2. Decisão de Arquitetura

### 2.1. Isolamento de Pointer Events e Hit-Testing Isométrico (Frontend)
- **Modo Posicionamento/Edição:**
  - O elemento `.ghost-item-anchor` recebe obrigatoriamente `pointer-events: none;`. O cursor do mouse atravessa a prévia fantasma sem retenção.
  - O elemento `.doctor-avatar-anchor` e as âncoras de itens posicionados `.placed-item-anchor` recebem temporariamente `pointer-events: none;` durante o arraste/posicionamento ativo de itens.
  - Os cliques e eventos de mouse incidem diretamente nos polígonos SVG dos ladrilhos do solo (`polygon.iso-tile`), garantindo que o clique em `(0, 0)` registre com exatidão a coordenada `(0, 0)`.
- **Modo Inspeção/Normal:**
  - As âncoras HTML retangulares adotam `pointer-events: none;`, enquanto os nós gráficos do SVG interno (`path`, `rect`, `circle`, `polygon`) recebem `pointer-events: visiblePainted;`.
  - Áreas transparentes das caixas delimitadoras não interceptam cliques, transferindo-os para o piso sob elas.

### 2.2. Supressão da Barra de Ações Simuladas de XP
- A faixa `.study-actions-strip` é removida da interface do usuário de `/minha-clinica`.
- Os endpoints de backend (`POST /api/v1/study/action-reward`), o serviço de cálculo (`StudyXpEngineService`) e os toasts de notificação (`XpRewardToastComponent`) permanecem ativos para receber créditos das telas autênticas de estudo.

### 2.3. Expansão para 104 Itens Padronizados no Catálogo
- O catálogo é expandido de 27 para 104 itens (26 por categoria: `pediatria`, `mobiliario`, `clinica`, `recepcao`), através da migration Flyway `V27__expand_clinic_catalog_to_104_items.sql`.
- Para preservar o limite de bundle de **300 KB gzipped**, o componente `ClinicItemSvgComponent` utiliza **arquétipos vetoriais modulares** parametrizáveis (mesas, macas, estantes, monitores, assentos, equipamentos, mascotes e decorações de parede).

---

## 3. Consequências

- **Positivas:**
  - Precisão geométrica absoluta no clique e arrasto no viewport isométrico.
  - Experiência visual limpa e imersiva sem barras espúrias de simulação.
  - Catálogo amplo e equilibrado para suportar toda a jornada do internato ao consultório sênior.
  - Bundle size controlado muito abaixo do teto de 300 KB gzipped.
- **Riscos e Mitigações:**
  - Volume de dados do catálogo na API: 104 registros representam menos de 25 KB de payload JSON comprimido, trafegado com caching HTTP eficiente.
