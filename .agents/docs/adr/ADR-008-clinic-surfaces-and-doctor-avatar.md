# ADR-008: Desacoplamento Espacial de Superfícies Verticais e Arquitetura Modular do Personagem Médico Virtual (Avatar 2.5D)

> **Status:** Aceito  
> **Data:** 2026-10-28  
> **Autor:** Arquiteto (`architect.md`)  
> **Localização Mandatória:** `.agents/docs/adr/ADR-008-clinic-surfaces-and-doctor-avatar.md`  
> **Regras Rastreáveis:** `P-080`, `P-084`, `P-087`, `P-088`, `P-089`, `US-06`, `US-07`

---

## 1. Contexto do Problema

A evolução do ecossistema lúdico e acolhedor de **Minha Clínica Médica** demanda a expansão de dois pilares fundamentais de imersão e representatividade para o estudante:
1. **Customização de Superfícies e Fixação Vertical (`US-06`, `P-087`, `P-088`):** 
   - Na implementação base da clínica, todo item colecionável possuía footprint de piso bidimensional `(footprintX, footprintY)` e era posicionado em coordenadas inteiras de solo `(gridX, gridY)`.
   - Elementos verticais (como a `ped_regua_girafa`, murais e o `negatoscopio_led`) e acabamentos contínuos de parede (`ped_papel_safari`) e piso (mármores e madeiras) provocavam uma colisão conceitual: se ocupassem tiles de solo, bloqueavam a circulação do estudante e impediam que mesas ou macas fossem encostadas rente à parede, quebrando a ergonomia visual do consultório médico.
2. **Identidade Médica Representativa & Avatar Dinâmico (`US-07`, `P-089`):**
   - O estudante de medicina necessita de um personagem virtual residente com o qual se identifique durante suas longas jornadas de estudo ativo.
   - O personagem deve permitir alternância gratuita de gênero (Médico / Médica) e personalização cosmética em 3 slots funcionais (`Jaleco/Scrub`, `Estetoscópio` e `Acessório`).
   - O desafio de engenharia reside em renderizar dezenas de combinações possíveis sem recorrer a motores 3D pesados nem inflar o pacote com centenas de spritesheets rasterizados pré-renderizados, garantindo conformidade com o teto de bundle de `300 KB` gzipped e consumo `0% de GPU/CPU` em background.

---

## 2. Decisão Arquitetural

### 2.1. Desacoplamento Espacial e Bounding Box Segregado (Piso vs. Parede)
Decidimos segregar a física do ambiente clínico em três camadas de responsabilidade geométrica:

1. **Camada de Superfícies Globais (`P-087`):**
   - Acabamentos contínuos de parede (`wallTheme`) e revestimentos de piso (`floorTheme`) deixam de ser itens discretos de inventário posicionado e passam a residir como atributos globais da clínica na tabela `user_clinics`.
   - Não geram registros em `clinic_placed_items`, não possuem colisão e são renderizados como texturas vetoriais contínuas aplicadas às faces dos tiles ou aos polígonos das paredes traseiras.
2. **Camada de Itens de Fixação Vertical (`Wall-Mounted` — `P-088`):**
   - O modelo `clinic_placed_items` ganha a coluna discriminadora `placement_type` com os valores `'FLOOR'` e `'WALL'`.
   - Itens de parede recebem tupla de coordenadas verticais:
     $$\text{Posição} = (\text{wallSide} \in \{\text{'NW'}, \text{'NE'}\}, \text{wallTileIndex} \in [0, \text{gridDimension}-1], \text{elevationZ} \in [20\text{px}, 80\text{px}])$$
   - **Footprint Nulo no Solo:** Para o validador de piso AABB 2D (`ClinicLayoutValidator`), itens `WALL` possuem `effW = 0` e `effH = 0`. Uma maca ou mesa de atendimento pode ser posicionada no chão no exato tile sob um negatoscópio ou régua de parede sem gerar falso-positivo de colisão.
   - **Validação de Parede Segregada:** O backend impede a sobreposição mútua de dois itens de parede no mesmo segmento:
     $$\text{Conflito} \iff \text{itemA.wallSide} = \text{itemB.wallSide} \land \text{itemA.wallTileIndex} = \text{itemB.wallTileIndex} \land |\text{itemA.elevationZ} - \text{itemB.elevationZ}| < \Delta z_{\text{min}}$$
3. **Ordenação de Profundidade Determinística (Painter's Algorithm Estendido):**
   - Itens de parede utilizam coordenada estática na camada visual de parede:
     $$\text{depth}_{\text{wall}} = (\text{wallSide} = \text{'NW'} \ ? \ \text{wallTileIndex} : (\text{gridDimension} + \text{wallTileIndex})) \times 1000 + 20$$
   - Isso assegura que fiquem sobrepostos à estampa da parede, mas fiquem atrás de móveis altos posicionados no piso à sua frente.

---

### 2.2. Arquitetura Modular do Avatar Médico em Camadas SVG (Dynamic SVG Stacking)
Decidimos implementar o avatar através de um componente puramente vetorial (`DoctorAvatarSvgComponent`) composto por 4 camadas ortogonais sobrepostas:

```
+-------------------------------------------------------+
| Camada 4: Acessório Face/Cabeça (Óculos, Gorro, Pranch)|
+-------------------------------------------------------+
                           ^
+-------------------------------------------------------+
| Camada 3: Estetoscópio no Pescoço (Clássico, Dino, Ouro)
+-------------------------------------------------------+
                           ^
+-------------------------------------------------------+
| Camada 2: Jaleco / Scrub (Interno, Navy, Verde, Dino) |
+-------------------------------------------------------+
                           ^
+-------------------------------------------------------+
| Camada 1: Base Anatômica e Cabelo (Dr. MALE ou Dra. FEMALE)
+-------------------------------------------------------+
```

- **Reutilização e Composição Vetorial:**
  - Cada elemento cosmético é desenhado como um fragmento vetorial compatível com as âncoras da base isométrica 2.5D (`32x64px`).
  - O Angular 18 renderiza as camadas utilizando diretivas SVG e referências `<g>` / `<use>`, garantindo que uma nova skin adicione menos de `1.5 KB` ao código, eliminando completamente megabytes de bitmaps.
- **Animação Idle Ultra-Leve:**
  - O avatar utiliza animação cíclica declarativa em CSS puro:
    ```css
    @keyframes avatarIdle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
    ```
  - Execução via GPU compositor, com custo zero para a CPU principal e suspensão total garantida via `Page Visibility API` (`document.hidden === true`).
- **Interatividade & Diálogo Acolhedor:**
  - O clique no personagem ativa um balão de diálogo contextual (*speech bubble*) selecionado com base no estado do estudante (streak de dias, especialidade do dia, incentivo à hidratação), com debounce para evitar acúmulo de listeners.

---

### 2.3. Transacionalidade e Economia de XP para Skins
- **Gratuidade Estrutural do Gênero:** A escolha e a alternância entre `MALE` e `FEMALE` é **100% gratuita** e ilimitada, respeitando a liberdade de expressão e autoafirmação do aluno.
- **Ledger Auditável para Compra de Skins:** Toda aquisição de skin cosmética consome `current_xp` e gera um registro atômico e imutável em `user_xp_transactions` com o tipo de operação `SKIN_PURCHASE`, preservando a integridade contábil e a impossibilidade de saldo negativo (`CHECK (current_xp >= 0)`).

---

## 3. Alternativas Consideradas

1. **Opção A — Matriz de Colisão Tridimensional Unificada 3D (Voxel/Octree):**
   - *Motivo do descarte:* Excesso de complexidade matemática desnecessária para uma mecânica de jogo que é essencialmente uma planta baixa ortográfica com paredes traseiras fixas. O desacoplamento 2D + 1D de parede atende 100% das regras sem sobrecarga.
2. **Opção B — Spritesheets Pré-Renderizados (PNG/WebP Rasterizados):**
   - *Motivo do descarte:* A multiplicação de combinações (2 gêneros × 5 jalecos × 5 estetos × 4 acessórios) geraria 200 spritesheets completos. Isso inflaria o download em dezenas de megabytes, violando a regra `P-085` (limite estrito de 300 KB).
3. **Opção C — Avatar tratado como móvel de chão no inventário comum:**
   - *Motivo do descarte:* Obrigar o avatar a disputar um tile fixo com móveis impediria que o médico se sentasse na cadeira ou se aproximasse da mesa, além de gerar acoplamento indevido no endpoint de layout.

---

## 4. Consequências e Trade-offs

- **Pontos Positivos:**
  - Desacoplamento perfeito entre circulação de piso e decoração de parede;
  - Zero duplicação de texturas ou assets visuais pesados;
  - Flexibilidade de adicionar novos drops de conteúdo (skins e papéis de parede) apenas cadastrando registros no catálogo e seus respectivos fragmentos SVG;
  - Proteção total de integridade contábil no backend via transação ACID no PostgreSQL.
- **Pontos Negativos / Débito Técnico Aceito:**
  - A fixação de itens de parede é restrita às duas faces traseiras visíveis (`NW` e `NE`), visto que as paredes frontais (`SW` e `SE`) são transparentes/cortadas por convenção isométrica para não obstruir a visualização do interior do consultório.
