# Phase 19: Gamificação & Notificações — Context

## Domain
Engajamento do usuário via conquistas (badges baseadas em uso contínuo e volume) e lembretes in-app (notificações visuais) visando reter o estudante.

## Canonical Refs
- `GAMI-01`, `NOTF-01` (from `.planning/ROADMAP.md`)

## Decisions Captured

### 1. Armazenamento das Badges
- As badges serão **persistidas no banco de dados** (por exemplo, na tabela `user_badges`).
- Devem registrar a data da conquista (`earned_at`).
- O trigger/validação das badges ocorrerá logo após eventos chave (como ao salvar uma sessão ou finalizar simulados).

### 2. Notificação de Conquista
- O sistema exibirá um **Toast/Popup festivo** (visual) na tela no momento em que o usuário desbloquear uma nova badge para incentivar engajamento imediato.

### 3. Persistência de Notificações
- O alerta de revisões atrasadas usará **status dinâmico**.
- **Não** será criada uma tabela de Inbox ou de Notificações no banco para registrar alertas. O backend enviará uma flag ou o frontend calculará on-the-fly.
- O ícone de sino na navbar exibirá uma bolinha vermelha enquanto houver pendências (flashcards/revisões atrasadas).

### 4. Comportamento do Ícone de Notificação
- Ao clicar no ícone de sino na navbar, o usuário verá um **Dropdown flutuante**.
- O menu exibirá um resumo das pendências (ex: "X revisões atrasadas", "Y aulas de reforço pendentes") com links para suas respectivas páginas, em vez de forçar um redirecionamento imediato.

### 5. Localização Visual das Badges
- Abordagem híbrida: O **Dashboard principal** terá um card de destaque com um resumo/últimas badges ganhas.
- A **galeria completa** de badges (conquistadas e bloqueadas) ficará na aba/página de **Perfil do Usuário**.

### 6. Bugfix: Criação de Aulas com Data
- Investigar e corrigir a falha no backend/frontend que impede a criação de uma aula quando o campo `dataAula` está preenchido (aula marcada como concluída). Atualmente só funciona se o campo estiver nulo.

### 7. Refatoração: Gestão de Temas
- **Mover a seleção de temas** do Dashboard (onde está atualmente) para a página de **Perfil do Usuário**. Isso limpa a interface do Dashboard e centraliza as configurações de preferência do usuário.

## Code Context & Guidelines
- Reutilizar ou adaptar componentes da Navbar e do Dashboard para implementar os widgets e dropdowns decididos.
- Aproveitar as consultas já estabelecidas no `DashboardService` ou `RevisionService` para calcular a flag de notificação de forma eficiente, para não sobrecarregar as requisições iniciais.
