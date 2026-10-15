# Product Backlog & Roadmap

## 🚀 Épico: Flashcards - Experiência de Estudo & Consulta
- [x] **Story 1 (Entregue):** Distribuição de Novos Flashcards para Dias Futuros + Fix Edição TipTap
- [x] **Story 2 (Entregue):** Visualização Individual de Flashcard sob Demanda (Modo Leitura / Preview)

---

## 🏆 Épico: Gamificação Global & Maestria Clínica (Nova Demanda)

### 🎯 Épico 1: Micro-Mecânicas de Foco e Estudo em Flashcards (Tópico 1)
- [ ] **Story 1.1 [PARALLEL][FRONTEND]:** Medidor de Combo & Foco em Chamas durante o Estudo de Flashcards
  - Multiplicador de acertos seguidos, animação sutil de chamas/partículas e feedback háptico/visual.
- [ ] **Story 1.2 [PARALLEL][FRONTEND]:** Tela/Modal de Celebração "Inbox Zero" (Fim de Deck Diário)
  - Resumo de métricas (tempo total, segundos/card, taxa de acerto) e disparador de confetes.
- [ ] **Story 1.3 [BACKEND][FRONTEND]:** Sistema de Bounty Cards ("Cards Sangrentos")
  - Algoritmo de identificação de cards críticos (alta taxa de erro) com borda especial e bônus de XP 3x.

### 🧬 Épico 2: Árvore de Maestria Clínica com Mapa do Corpo Humano (Tópico 2)
- [ ] **Story 2.1 [BACKEND]:** Motor de Cálculo de Maestria Clínica Ponderada por Especialidade
  - Agregação multivariada: Aulas assistidas (peso 20%), Questões resolvidas + % de acerto (peso 50%) e Flashcards revisados + % de retenção (peso 30%).
- [ ] **Story 2.2 [FRONTEND]:** Componente Interativo SVG do Corpo Humano no Dashboard Principal
  - Contornos coloridos por especialidade médica (Cirurgia, Clínica Médica, Pediatria, Ginecologia/Obstetrícia, Preventiva).
  - Preenchimento gradiente dinâmico baseado no percentual de nível da especialidade (0 a 100%), com tooltips e drill-down analítico.

### 🛡️ Épico 3: Proteção de Hábitos & Recuperação de Sequência (Streak Repair - Tópico 4)
- [ ] **Story 3.1 [BACKEND]:** Lógica de Detecção de Quebra Recente e Missão de Resgate de Ofensiva
  - Verificação de perda de 1 dia de ofensiva e regra de elegibilidade (resgate disponível por 24h).
- [ ] **Story 3.2 [FRONTEND]:** Card/Banner de Resgate de Sequência no Dashboard & Tela de Ofensiva
  - Acionamento da missão intensiva e animação de restauração de chama com feedback imediato.

### 🎖️ Épico 4: Pacote de 20+ Novas Conquistas de Flashcards (Tópico 5)
- [ ] **Story 4.1 [BACKEND]:** Expansão do Enum `BadgeType` e Motor de Avaliação de Conquistas de Flashcards
  - Implementação de 22 novas conquistas no backend com disparo de eventos e persistência.
- [ ] **Story 4.2 [FRONTEND]:** Exibição dos Novos Badges de Flashcards no Perfil e Notificações de Conquista
  - Atualização do catálogo visual de badges com ícones estilizados no Design System.
