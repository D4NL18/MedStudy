# UAT: Phase 10 - Frontend: Banco de Dados & Simulados

## Test Scenarios

### 1. Banco de Questões (Study Sessions)
- **UAT 10.1**: Criar uma nova sessão via modal.
  - *Pass criteria*: Modal abre -> Preenche dados -> Salva -> Modal fecha -> Lista atualiza (sem reload).
- **UAT 10.2**: Editar uma sessão existente.
  - *Pass criteria*: Clicar em editar -> Modal carrega dados originais -> Salva -> Linha na tabela atualiza.
- **UAT 10.3**: Scroll Infinito.
  - *Pass criteria*: Rolar até o final da lista -> Spinner aparece -> Novos itens carregam e aparecem.
- **UAT 10.4**: Filtros.
  - *Pass criteria*: Selecionar uma área -> Lista reseta e carrega apenas itens daquela área.

### 2. Simulados (Mock Exams)
- **UAT 10.5**: Criar novo simulado (5 áreas).
  - *Pass criteria*: Modal exibe todas as áreas -> Preenche -> Erros calculados automaticamente -> Salva com sucesso.
- **UAT 10.6**: Validação de Simulado.
  - *Pass criteria*: Tentar salvar com `acertos > totais` -> Erro de validação visível no campo.
- **UAT 10.7**: Histórico de Simulados.
  - *Pass criteria*: Tabela de simulados exibe métricas agregadas (Total e % Geral).

### 3. UI & Themes
- **UAT 10.8**: Design Glassmorphism.
  - *Pass criteria*: Modais têm fundo semitransparente e desfoque (`glass`).
- **UAT 10.9**: Responsividade.
  - *Pass criteria*: Tabela e filtros se adaptam corretamente em telas mobile (resolução < 768px).
- **UAT 10.10**: Troca de Temas.
  - *Pass criteria*: Ao trocar o tema (ex: Verde para Rosa), as cores das tabelas e modais mudam instantaneamente.
