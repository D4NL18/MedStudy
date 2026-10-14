# Regras de Negócio: Gamificação de Flashcards, Maestria Clínica e Streak Repair

Documentação gerada pela skill `business-rules-expert` para o pacote de gamificação avançada do MedStudy.

---

### [P-040] Medidor de Combo e Foco em Chamas
- **Definição:** Durante uma sessão ativa de estudo de flashcards, acertos consecutivos elevam um multiplicador de sequência denominado "Combo".
- **Critério de Incremento:** Avaliações de "Fácil" ou "Médio" incrementam o combo em +1.
- **Níveis de Alavancagem:**
  - 3x a 4x: Feedback de texto animado ("Combo 3x!").
  - 5x a 9x: Efeito visual "Foco Quente 🔥" com partículas sutis e multiplicador de XP de 1.5x.
  - 10x+: Efeito visual "Em Chamas ⚡🔥" com multiplicador de XP de 2.0x e trilha de brilho no card.
- **Critério de Reset:** Se o usuário marcar o card como "Difícil" ou sair da sessão, o contador de combo retorna para 0 imediatamente.

---

### [P-041] Celebração de Fim de Sessão (Inbox Zero)
- **Definição:** Ao responder o último card pendente da fila de revisão diária ("Estudar Hoje"), o sistema DEVE interceptar a transição padrão e renderizar um Modal de Celebração de Conclusão.
- **Dados Exibidos:**
  1. Total de cartões revisados na sessão.
  2. Duração total da sessão (min:seg) e média de segundos por cartão.
  3. Taxa de precisão da sessão (% de cartões avaliados como Fácil/Médio).
  4. Total de XP ganho (com discriminação de bônus por Combo).
  5. Badges recém-desbloqueados na sessão, se houver.
- **Ações Disponíveis:** Botão de "Voltar ao Início" e botão secundário "Revisar Cards Difíceis do Dia" (caso algum tenha sido pontuado como difícil).

---

### [P-042] Identificação e Recompensa de Bounty Cards ("Cards Sangrentos")
- **Critério de Classificação:** Um flashcard é classificado como *Bounty Card* quando apresentar uma das condições:
  1. Histórico de facilidade (`easeFactor`) inferior a 1.6;
  2. Taxa de erro histórica acumulada igual ou superior a 60%;
  3. Últimas 2 revisões seguidas classificadas como "Difícil".
- **Apresentação Visual:** No modo de estudo, o cartão recebe um contorno sutil carmesim com gradiente e um indicador discreto no cabeçalho: `Bounty Card - 3x XP`.
- **Recompensa:** Se o aluno classificar o cartão como "Fácil" ou "Médio", recebe triplo de XP e alimenta a contagem dos badges `FLASH_BOUNTY_*`.

---

### [P-050] Árvore de Maestria Clínica (Mapa Corporal Interativo)
- **Definição:** Componente central no Dashboard que ilustra o progresso do estudante através de uma silhueta anatômica do corpo humano dividida pelas 5 Grandes Áreas Médicas:
  - **Cirurgia Geral:** Abdome, Trato Gastrointestinal, Parede Abdominal. Contorno Laranja (`#F97316`).
  - **Clínica Médica:** Tórax, Coração, Pulmões, Sistema Nervoso Central. Contorno Azul (`#3B82F6`).
  - **Pediatria:** Cabeça Infantil e Eixo de Crescimento. Contorno Verde (`#10B981`).
  - **Ginecologia e Obstetrícia:** Pelve e Sistema Reprodutivo. Contorno Magenta (`#EC4899`).
  - **Medicina Preventiva & Social:** Silhueta Externa Sistêmica e Circulatória. Contorno Dourado (`#EAB308`).

- **Hierarquia de Níveis de Maestria (Tiers de Preenchimento):**
  Cada região anatômica é colorida no seu interior de acordo com o Nível alcançado pelo aluno naquela especialidade médica:
  1. **Sem Nível / Iniciante (0% a 14%):** Silhueta cinza escura translúcida (sem preenchimento metálico).
  2. **Bronze (15% a 29%):** Preenchimento em gradiente metálico Bronze avermelhado (`#CD7F32` / `#8C531B`) com brilho opaco.
  3. **Prata (30% a 44%):** Preenchimento em gradiente Prata acetinado (`#E0E0E0` / `#A6B1B9`) com reflexo sutil.
  4. **Ouro (45% a 59%):** Preenchimento em gradiente Ouro radiante (`#FFD700` / `#D4AF37`) com glow suave.
  5. **Platina (60% a 74%):** Preenchimento em gradiente Platina luminescente (`#E5E4E2` / `#738290`) com aura fria.
  6. **Rubi (75% a 84%):** Preenchimento em gradiente Rubi escarlate vibrante (`#E0115F` / `#9B111E`) com pulsar luminoso.
  7. **Esmeralda (85% a 94%):** Preenchimento em gradiente Esmeralda cintilante (`#50C878` / `#097969`) com partículas energéticas.
  8. **Diamante (95% a 100%):** Preenchimento em gradiente Diamante prismático translúcido (`#B9F2FF` / `#E0F7FA`) com shimmer cromático e borda estelar.

- **Cálculo da Maestria:** Integração ponderada de:
  - 50% de peso: Taxa de acerto em Questões da área ponderada pelo volume;
  - 30% de peso: Taxa de acerto e retenção em Flashcards da área;
  - 20% de peso: Percentual de Aulas concluídas da respectiva área.
- **Interatividade & Identidade Visual:**
  - O contorno preserva a cor da especialidade médica (ex: Azul para Clínica, Laranja para Cirurgia), enquanto o preenchimento e os efeitos de partículas refletem o Nível atual (ex: Tórax com contorno Azul e preenchimento de Ouro ou Rubi).
  - Passar o cursor ou clicar na área anatômica abre um popover exibindo o brasão do Nível (ex: *"Clínica Médica - Nível Rubi (78%)"*), o raio-x detalhado de Questões feitas, Flashcards maduros e Aulas assistidas com atalho direto para treinar a área.


---

### [P-060] Mecânica de Resgate de Sequência (Streak Repair)
- **Janela de Tolerância:** Se o estudante possuía uma ofensiva ativa ($Streak \ge 2$) e não realizou nenhuma atividade no dia anterior ($D-1$), ao acessar a plataforma no dia atual ($D$), o sistema ativa o modo `Streak em Risco`.
- **Janela de Resgate:** O estudante tem exatamente 24 horas a partir do primeiro login do dia $D$ para cumprir a "Missão de Resgate".
- **Missão de Resgate:** Realizar uma sessão intensiva dobrada (ex: responder 20 flashcards ou 15 questões).
- **Efeito:** Ao concluir a missão, o streak quebrado é restabelecido retroativamente e incrementado para o dia $D$.
- **Trava Anti-Abuso:** O benefício do Streak Repair só pode ser acionado 1 vez a cada 14 dias por usuário.

---

### [P-070] Catálogo de Conquistas de Flashcards
- O sistema DEVE reconhecer e premiar 22 novos badges no enum `BadgeType`:
  - 9 badges de volume total (10, 50, 100, 250, 500, 1000, 2500, 5000);
  - 3 badges de combo (5, 10, 20 acertos seguidos);
  - 3 badges de Inbox Zero (1 dia, 7 dias seguidos, 30 dias seguidos);
  - 3 badges de Bounty Hunter (1, 10, 50 Bounty Cards superados);
  - 4 badges especiais de hábito (Madrugador, Plantão Noturno, Reflexo Rápido <5s, Criador de 10 cards).
