# Dicionário de Domínio (Ubiquitous Language) — MedStudy

Este documento mapeia todas as entidades, conceitos e terminologias de negócio do ecossistema **MedStudy**.
Todos os agentes (Analista, Arquiteto, Designer, DBA, Desenvolvedor, Reviewer, Tester) devem utilizar estritamente a nomenclatura descrita aqui em códigos, rotas de API, tabelas de banco de dados e comunicação.

---

## 1. Contexto: Estudo, Prática e Maestria Clínica
- **Estudante (`Student` / `User`):** Médico generalista, interno ou estudante de medicina que utiliza a plataforma MedStudy para preparação de residência médica, revalidação e atualização clínica.
- **Questão Clínica (`Question`):** Item avaliativo baseado em casos clínicos reais ou provas de residência, cuja resolução concede XP base e bônus de acerto/sequência.
- **Flashcard (`Flashcard`):** Cartão de repetição espaçada (SRS) classificado pelo estudante durante a revisão em *Fácil* (`EASY`), *Médio* (`MEDIUM`) ou *Difícil/Erro* (`HARD`), gerando recompensas proporcionais de XP.
- **Deck do Dia (`Daily Deck`):** Lote diário de flashcards agendados pelo algoritmo de repetição espaçada; sua conclusão integral concede bônus diário de XP.
- **Videoaula (`Video Lesson`):** Conteúdo audiovisual didático monitorado por tempo efetivo de reprodução contínua (sem avanço rápido/skip) e conclusão integral.
- **Simulado (`Mock Exam` / `Simulado`):** Avaliação cronometrada composta por múltiplas questões, bonificada com XP fixo de conclusão somado a um bônus variável ponderado pela taxa de acurácia (`Accuracy %`).
- **Ofensiva Diária (`Daily Streak`):** Quantidade de dias consecutivos em que o estudante cumpriu sua meta mínima de estudo na plataforma.

---

## 2. Contexto: Economia de XP e Gamificação ("Minha Clínica Médica")
- **XP Vitalício (`Lifetime XP` / `lifetime_xp`):** Acumulador monotônico crescente de toda a experiência obtida pelo estudante desde o cadastro (`user_xp_accounts.lifetime_xp`). **Nunca decresce** quando o estudante compra itens ou expansões. É a métrica oficial para Rankings, Nível do Médico e desbloqueio de pré-requisitos de expansão física.
- **Saldo de XP (`Current XP` / `current_xp`):** Saldo líquido transacional disponível na carteira do estudante (`user_xp_accounts.current_xp`) para compra de itens do catálogo e pagamento de expansões da clínica. Sofre débito a cada aquisição.
- **Multiplicador de Ofensiva (`Streak Multiplier`):** Fator percentual de bonificação (`0%`, `+10%`, `+20%`, `+35%` ou `+50%`) aplicado sobre o XP base de qualquer atividade de estudo conforme a faixa de dias consecutivos de ofensiva do estudante (`XP_Final = round(XP_Ação * (1 + Multiplicador_Streak))`).
- **Transação de XP (`XP Transaction` / `user_xp_transactions`):** Registro contábil imutável (ledger) de qualquer crédito (estudo) ou débito (compra/expansão) de XP, contendo tipo da fonte (`source`), descrição (`description`), valor (`amount`) e saldo resultante (`balance_after`).

---

## 3. Contexto: Espaço Isométrico 2.5D e Customização ("Minha Clínica Médica")
- **Clínica do Estudante (`User Clinic` / `user_clinics`):** Espaço virtual isométrico 2.5D pertencente ao estudante (relação `1:1`), que evolui visualmente de um simples Box do Internato até um Instituto Médico Completo.
- **Nível de Expansão (`Expansion Level` / `expansion_level`):** Estágio físico atual da clínica (escala de `1` a `6`), que determina as dimensões da malha isométrica (`grid_width` x `grid_height`) e desbloqueia itens avançados do catálogo.
- **Malha Isométrica 2:1 (`Isometric Grid 2:1`):** Grade espacial em projeção isométrica ortográfica na proporção 2:1 (cada tile possui `64px` de largura por `32px` de altura), parametrizada pelas coordenadas discretas `(grid_x, grid_y)`.
- **Ordenação de Profundidade (`Depth Sorting` / `Painter's Algorithm`):** Algoritmo determinístico de empilhamento visual no qual os elementos da cena são renderizados na ordem crescente de `depth = (x + y) * 1000 + z`, garantindo oclusão perfeita sem WebGL pesado.
- **Item de Catálogo (`Catalog Item` / `clinic_items_catalog`):** Bem virtual colecionável (pediatria, mobiliário médico, clínica/instrumental ou recepção/mascote) parametrizado com preço em XP (`cost_xp`), dimensões (`footprint_x`, `footprint_y`), nível mínimo de expansão (`min_expansion_level`), chave de arte (`asset_svg_key`), tipo de posicionamento (`placement_type`: `'FLOOR'` ou `'WALL'`) e flag de interatividade (`is_interactable`).
- **Item Posicionado (`Placed Item` / `clinic_placed_items`):** Instância adquirida pelo estudante a partir do catálogo e posicionada na malha isométrica em coordenadas `(grid_x, grid_y)` com orientação (`rotation`: `0` = Sudeste/SE ou `1` = Sudoeste/SW) ou ancorada na parede (`wall_side`, `wall_tile_index`).
- **Pré-visualização Fantasma (`Ghost Preview`):** Representação translúcida do móvel exibida durante o modo de edição/posicionamento sobre a malha isométrica, assumindo cor **verde** quando a posição respeita os limites e não colide com outros itens, ou **vermelha** quando há colisão ou extrapolação de borda.
- **Áudio Cozy (`Cozy Audio`):** Conjunto de micro-efeitos sonoros relaxantes e discretos (ex: clique de madeira ao posicionar móvel, som de cafeteira espresso, ronronar do gato, bip sutil do ECG) reproduzidos sob controle estrito de mudo (`Mute Toggle`) persistido pelo usuário.
- **Revestimento de Parede (`Wall Surface` / `wall_theme`):** Acabamento estético ou papel de parede decorativo aplicado uniformemente às faces traseiras verticais da sala (paredes Noroeste/NW e Nordeste/NE), parametrizado no registro da clínica (`user_clinics.wall_theme`). Não ocupa tiles da malha horizontal de piso nem bloqueia movimentação ou colisão de móveis.
- **Revestimento de Piso (`Floor Surface` / `floor_theme`):** Padrão de acabamento e textura de piso (ex: porcelanato cinza, madeira escandinava, piso vinílico cirúrgico, tatame emborrachado) renderizado nos tiles da malha isométrica (`user_clinics.floor_theme`), servindo de substrato visual para toda a disposição física da sala.
- **Item de Parede / Fixação Vertical (`Wall-Mounted Item` / `placement_type = 'WALL'`):** Bem colecionável ou instrumento de saúde com metadado de fixação vertical (como régua antropométrica girafa, negatoscópio LED e diplomas). É renderizado na camada visual de parede (`zLayer = 20` ou `wallLayer`) ancorado nas coordenadas de parede (`wall_side`, `wall_tile_index`), sem consumir espaço útil da malha de piso nem colidir na caixa AABB com móveis de chão.

---

## 4. Contexto: Avatar Médico Virtual e Customização de Identidade
- **Avatar Médico Virtual (`Doctor Avatar` / `user_doctor_avatar`):** Representação gráfica 2.5D do estudante no ambiente da clínica, com escolha inicial livre e gratuita entre os gêneros base (`MALE` / `FEMALE`), animação idle sutil de respiração (*breathing bobbing*) e micro-interação por clique com balão de fala acolhedor de boas práticas clínicas.
- **Slot de Indumentária Médica (`Medical Skin Slot` / `Skin Slot`):** Ponto de customização estética desacoplado do avatar, dividido em 3 categorias estritas:
  1. `coat` (Jaleco / Roupa Hospitalar);
  2. `stethoscope` (Estetoscópio de Pescoço);
  3. `accessory` (Acessório de Rosto / Cabeça / Mãos).  
  Cada slot possui itens básicos gratuitos garantidos no cadastro e opções avançadas desbloqueáveis através de `current_xp` ou conquistas de estudo.
- **Hit-Testing Pixel-Perfect Isométrico (`Isometric Pixel-Perfect Hit-Testing`):** Mecanismo de resolução geométrica e desambiguação de eventos de ponteiro (mouse/toque) que garante que a seleção de uma célula na malha 2:1 corresponda estritamente à geometria matemática do losango isométrico (`polygon.iso-tile`) ou ao raycasting `screenToGrid`, eliminando falsos positivos provocados por bounding boxes retangulares transparentes.
- **Isolação de Pointer Events (`Pointer Events Isolation`):** Técnica de controle declarativo de interface (`pointer-events: none` vs `pointer-events: visiblePainted`) aplicada ao Ghost Preview, ao Avatar e aos contêineres de itens durante o modo de posicionamento/edição, assegurando que o elemento translúcido em trânsito não bloqueie o clique do usuário no solo.
- **Bypass de Bounding Box (`Bounding Box Bypass`):** Diretriz de renderização na qual as áreas vazias ou transparentes da caixa delimitadora de um componente gráfico são tornadas permeáveis aos eventos de ponteiro, transferindo a captura para a superfície ou ladrilho situado imediatamente abaixo.
- **Catálogo Expandido de Itens Médicos (`Expanded Medical Items Catalog`):** Acervo oficial de mais de 100 itens colecionáveis (104 itens padronizados) distribuídos com equilíbrio estrito em 4 categorias funcionais (Pediatria, Mobiliário, Clínica/Equipamentos e Recepção/Conforto), balanceados por níveis de expansão física da clínica (1 a 6) e faixas de custo em XP investível.

---

## 5. Contexto: Sistema de Raridades, Colecionismo e Lootboxes ("Minha Clínica Médica")
- **Nível de Raridade (`Item Rarity` / `item_rarity`):** Classificação padronizada em quatro graus (`COMMON`, `RARE`, `EPIC`, `LEGENDARY`) que expressa o grau de sofisticação visual, exclusividade e relevância de cada bem colecionável do consultório.
- **Item Exclusivo de Lootbox (`Lootbox-Exclusive Item` / `is_lootbox_exclusive`):** Relíquia ou equipamento médico de prestígio que não pode ser adquirido por compra direta na loja com XP (`is_purchasable = false`), sendo concedido unicamente através de sorteio em Caixas da Sorte.
- **Tier de Lootbox (`Lootbox Tier` / `lootbox_tier`):** Nível de caixa da sorte médica (`TIER_1_RESIDENT`, `TIER_2_SPECIALIST`, `TIER_3_CHIEF_OF_STAFF`), precificado em `current_xp` com custos escalonados e probabilidades progressivas de entrega de itens raros, épicos e lendários.
- **Pool de Sorteio (`Drop Pool`):** Conjunto filtrado de itens do catálogo elegíveis para premiação dentro de determinado Tier de caixa da sorte e raridade sorteada.
- **Cashback de Duplicata (`Duplicate Item Cashback`):** Mecanismo de compensação econômica que devolve automaticamente uma quantia pré-fixada de `current_xp` ao estudante caso ele sorteie um item que já possui em seu consultório ou inventário.
- **Log de Abertura de Caixa (`Lootbox Opening Log` / `lootbox_opening_logs`):** Registro contábil e auditoria imutável contendo usuário, caixa aberta, custo, item contemplado, raridade, indicador de duplicata e eventual cashback concedido.
