---
status: testing
phase: 20-ajustes-responsividade
source: [20-SUMMARY.md]
started: 2026-05-13T12:05:00Z
updated: 2026-05-13T12:05:00Z
---

## Current Test

number: 1
name: Menu Hambúrguer (Mobile)
expected: |
  Ao reduzir a largura da tela para menos de 768px, o menu de navegação horizontal deve desaparecer e um botão de "hambúrguer" (três linhas) deve aparecer no canto superior esquerdo. Ao clicar nele, o menu lateral deve deslizar para fora.
awaiting: user response

## Tests

### 1. Dashboard (Mobile/Tablet Stats)
expected: No dashboard, os cartões de estatística devem se redimensionar para 1fr 1fr em tablets e manter legibilidade. Em dispositivos menores (mobile), o card de progresso teórico deve ocupar 100% da largura.
result: [passed]

### 2. Notificações (Mobile Logic)
expected: O ícone de notificações deve abrir um Bottom Sheet em dispositivos móveis em vez do dropdown padrão. O ícone 'refresh-cw' deve carregar corretamente sem erros de provedor.
result: [passed]

### 3. Flashcards (Change Detection)
expected: Ao abrir um flashcard ou girar o dispositivo, o conteúdo (Markdown) deve ser exibido imediatamente, sem estados "vazios" intermitentes.
result: [passed]

### 4. Flashcards (Interactivity)
expected: Deve ser possível clicar em imagens nos flashcards para abrir um overlay de zoom. O botão de "unflip" (toggle) deve permitir desvirar o card para ver a pergunta novamente.
result: [passed]

### 5. Aulas (Card Layout)
expected: Na página de Plano de Aulas, em dispositivos móveis, a tabela deve ser substituída por cartões individuais para cada aula. Cada cartão deve mostrar claramente o Tema, Área, Prioridade e Status, utilizando o padrão de labels internos. No tablet (768px+), a tabela deve ser mantida com otimização de colunas e scroll horizontal se necessário.
result: [passed]

### 6. Revisões (Card Layout)
expected: Na página de Revisão Intervalada, em dispositivos móveis, as sessões de revisão devem ser exibidas como cartões estilizados (Glassmorphism). No tablet, a tabela deve ser mantida com min-width e scroll horizontal.
result: [passed]

### 7. Banco de Dados (Card Layout)
expected: No Banco de Questões, as sessões históricas devem ser exibidas como cartões em telas pequenas (mobile), mantendo a legibilidade da data, área e métricas de desempenho. No tablet, a tabela deve ser mantida com otimização de colunas.
result: [passed]

### 8. Analytics (Responsive Grid)
expected: Nas páginas de Análise (Área e Tema), os gráficos devem se redimensionar para caber na largura da tela e os cartões de estatísticas devem se empilhar corretamente. A tabela de temas deve virar cards no mobile e manter o formato tabela no tablet.
result: [passed]

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
