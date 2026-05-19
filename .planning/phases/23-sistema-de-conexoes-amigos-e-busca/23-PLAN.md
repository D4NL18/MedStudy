# Plano de Execução - Phase 23: Sistema de Conexões (Amigos) & Busca

Este plano detalha as tarefas e entregáveis para a implementação do Sistema de Conexões e Busca de Usuários no MedStudy, com base nas decisões de design acordadas na fase de discussão.

## Objetivos
1. Criar a infraestrutura de banco de dados e entidades para conexões (`Friendship`) e notificações sociais (`SocialNotification`).
2. Desenvolver endpoints REST robustos no backend para gerenciar amizades (enviar, aceitar, recusar, remover e bloquear) e buscar estudantes.
3. Estender o `NotificationService` backend para processar e contar notificações sociais in-app.
4. Desenvolver a rota e interface do Painel Social (`/social`) no frontend Angular contendo abas dinâmicas: "Buscar Estudantes" (com busca reativa/debounce), "Meus Amigos", "Solicitações Pendentes" e "Bloqueados".
5. Integrar a navegação do painel social na Sidebar e Drawer Mobile do layout do sistema.
6. Garantir mais de 80% de cobertura de testes unitários em todas as novas classes do backend e componentes do frontend.

---

## 🛠️ Tarefas

### 1. Database & Migrations
- [ ] **Migration**: Criar `V16__create_friendships_and_notifications_tables.sql` contendo:
  - Tabela `friendships` com `id` (UUID PRIMARY KEY), `requester_id` (FK), `receiver_id` (FK), `status` (VARCHAR 20: PENDING, ACCEPTED, BLOCKED) e timestamps. Restrição UNIQUE no par `(requester_id, receiver_id)`.
  - Tabela `social_notifications` com `id` (UUID PRIMARY KEY), `user_id` (FK), `sender_id` (FK, nullable), `type` (VARCHAR 50), `message` (VARCHAR 255), `is_read` (BOOLEAN DEFAULT FALSE) e timestamps.
  - Índices adequados nas chaves estrangeiras para otimização de consultas de busca e agregações.

### 2. Backend: Módulo de Conexões (Friendships)
- [ ] **Entity**: Criar enum `FriendshipStatus` (`PENDING`, `ACCEPTED`, `BLOCKED`) e a entidade JPA `Friendship` estendendo `BaseEntity`.
- [ ] **Repository**: Criar `FriendshipRepository` com consultas otimizadas:
  - Buscar amizade ativa ou pendente entre dois IDs: `findFriendshipBetween(userId1, userId2)`.
  - Listar amigos aceitos de um usuário (união ou OR): `findAllAcceptedFriends(userId)`.
  - Listar solicitações pendentes recebidas: `findAllPendingRequestsReceived(userId)`.
  - Listar usuários bloqueados: `findAllBlockedUsers(userId)`.
- [ ] **DTOs**: 
  - Criar `FriendshipResponseDTO` contendo o status do relacionamento.
  - Criar `SocialProfileResponseDTO` contendo os dados do perfil do amigo/usuário buscado (nome, handle, faculdade, semestre, avatar, isFormado, streak atual) e o status do relacionamento em relação ao usuário logado.
- [ ] **Service**: Criar `FriendshipService` contendo a lógica de negócios para:
  - Buscar estudantes reativamente filtrando por nome completo, handle ou faculdade (excluindo usuários bloqueados e o próprio usuário).
  - Enviar solicitação de amizade (validações: não pode ser ele mesmo, não pode haver relação pendente/ativa, inverte se já houver convite do outro lado).
  - Aceitar/recusar convites de amizade recebidos.
- [x] **Wave 2: Mapeamentos e Lógica de Negócios (Backend)**
  - [x] Criar `FriendshipResponseDTO.java` e `SocialProfileResponseDTO.java` no backend.
  - [x] Criar `SocialNotificationResponseDTO.java` no backend.
  - [x] Criar mapper `FriendshipMapper.java` no backend.
  - [x] Estender o `NotificationSummaryResponse.java` para adicionar o campo `socialAlerts`.
  - [x] Estender o `NotificationService.java` para injetar `SocialNotificationRepository` e contar os alertas sociais.
  - [x] Criar o `FriendshipService.java` implementando busca, convites, aceitar, recusar, remover e bloquear amizades.
  - [x] Criar o `FriendshipController.java` mapeando endpoints em `/api/friendships/**`.
  - [x] Estender `NotificationController.java` para adicionar endpoints de listagem de alertas sociais e marcar como lidas.
  - [x] `POST /api/notifications/social/{id}/read` - Marca uma notificação social como lida.
  - [x] `POST /api/notifications/social/read-all` - Marca todas as notificações sociais como lidas.

### 3. Backend: Módulo de Notificações Sociais
- [x] **Entity**: Criar a entidade `SocialNotification` estendendo `BaseEntity`.
- [x] **Repository**: Criar `SocialNotificationRepository` com métodos para buscar contagem não lida e listar ordenadas por data de criação.

### 4. Frontend: SocialService & Integração de Rota
- [ ] **Config**: Atualizar `app.config.ts` para registrar ícones Lucide adicionais: `Users`, `UserPlus`, `UserMinus`, `UserCheck`, `UserX`, `Ban`.
- [ ] **Service**: Criar `SocialService` em `frontend/src/app/core/services/social.service.ts` contendo chamadas para a API de amizades e busca.
- [ ] **Routes**: Atualizar `app.routes.ts` para registrar a rota `/social` apontando para o lazy-loaded `SocialComponent`.
- [ ] **Layout Navigation**: Atualizar `shell.component.html` e `shell.component.ts` para adicionar o menu "Social" na Sidebar e no Drawer Mobile, e estender a lógica de exibição de notificações para contemplar os novos alertas sociais in-app.

### 5. Frontend: Painel Social (UI)
- [ ] **Component**: Desenvelover `SocialComponent` em `frontend/src/app/features/social/` com layout Glassmorphism premium:
  - Aba **"Buscar Estudantes"**: Input de busca com RxJS debounce (300ms) conectando à busca reativa. Lista com cards elegantes dos perfis encontrados, exibindo avatar, nome, handle, faculdade e botões de ação ("Adicionar", "Remover", "Bloquear").
  - Aba **"Meus Amigos"**: Lista rica dos amigos aceitos com exibição de avatar, semestre/formado, faculdade e indicador de streak (ícone de fogo estilizado).
  - Aba **"Solicitações"**: Grid das solicitações pendentes recebidas com botões flutuantes para "Aceitar" ou "Recusar" de forma interativa.
  - Aba **"Bloqueados"**: Listagem simples com ação de "Desbloquear".

### 6. Testes Unitários & Cobertura (MANDATÓRIO)
- [ ] **Backend Tests**:
  - Criar `FriendshipServiceTest` cobrindo cenários de sucesso e violação de regras de negócios.
  - Criar `FriendshipControllerTest` cobrindo o comportamento de controle e mapeamentos.
  - Criar `SocialNotificationRepositoryTest` e testes no `NotificationService`.
- [ ] **Frontend Tests**:
  - Criar testes unitários para `SocialComponent` e `SocialService`.

---

## 🔍 Plano de Verificação (UAT)

### 1. Busca e Envio de Solicitação
- **UAT 23.1**: Ao abrir a aba "Buscar Estudantes" e digitar uma faculdade ou nome de usuário, os resultados devem carregar progressivamente após 300ms de digitação.
- **UAT 23.2**: A busca de usuários não deve listar a própria conta conectada, nem usuários bloqueados mutuamente.
- **UAT 23.3**: Enviar uma solicitação de amizade altera instantaneamente o botão de ação do card para "Pendente" no frontend.

### 2. Fluxo de Solicitações e Conexões
- **UAT 23.4**: Ao receber um convite de outro usuário, ele deve aparecer na aba "Solicitações Pendentes". Clicar em "Aceitar" remove a linha da lista e adiciona o usuário à aba "Meus Amigos".
- **UAT 23.5**: Na aba "Meus Amigos", clicar no botão de "Remover Conexão" exibe um diálogo de confirmação. Ao confirmar, o usuário é desvinculado.

### 3. Bloqueio e Privacidade
- **UAT 23.6**: Ao clicar no botão de "Bloquear" no perfil de outro usuário, qualquer relacionamento ativo ou pendente é apagado e o usuário entra na aba "Bloqueados".
- **UAT 23.7**: O usuário bloqueado tenta buscar o bloqueador, mas nenhum resultado é retornado.

### 4. Notificações Sociais
- **UAT 23.8**: Ao receber uma notificação de streak ou badge de amigo, o sininho na Navbar exibe o contador incrementado em tempo real e lista o card social correspondente. Marcar como lida decrementa o alerta corretamente.
