# Plano de Execução - Phase 19: Gamificação & Notificações

## Objetivos
1. Implementar sistema de Badges (conquistas) persistidas no banco.
2. Criar página de Perfil e migrar a seleção de temas para lá.
3. Implementar notificações dinâmicas na Navbar (Dropdown).
4. Corrigir bug de criação de aulas com data de conclusão.

## Requisitos Atendidos
- **GAMI-01**: Sistema de Badges (Streak, Questões, Simulados).
- **NOTF-01**: Notificações in-app (Navbar badge/dropdown).

---

## 🛠️ Tarefas

### 1. Backend: Infraestrutura de Gamificação
- [ ] **DB**: Criar entidade `UserBadge` e tabela correspondente (`user_id`, `badge_type`, `earned_at`).
- [ ] **Domain**: Criar enum `BadgeType` (STREAK_7, QUESTIONS_1000, SIMULADOS_10).
- [ ] **Service**: Criar `BadgeService` para avaliar conquistas.
- [ ] **Integration**: Chamar `BadgeService.checkBadges(userId)` após:
    - Salvar sessão de estudo (`StudySessionService`).
    - Finalizar simulado (`SimuladoService`).
- [ ] **Controller**: Criar `UserBadgeController` para listar as conquistas do usuário.

### 2. Frontend: Módulo de Perfil e Temas
- [ ] **Component**: Gerar `PerfilComponent` e adicionar rota `/perfil`.
- [ ] **Refactor**: Mover lógica e UI do `.theme-box` de `DashboardComponent` para `PerfilComponent`.
- [ ] **Service**: Garantir que o `ThemeService` funcione corretamente na nova página.

### 3. Frontend: Galeria de Badges
- [ ] **Component**: Criar galeria visual no `PerfilComponent` (badges coloridas/cinzas).
- [ ] **Dashboard**: Criar card de "Últimas Conquistas" no Dashboard.
- [ ] **Toast**: Implementar componente de notificação festiva ao ganhar uma badge (usando HotToast ou similar).

### 4. Frontend: Notificações na Navbar
- [ ] **Service**: Criar `NotificationService` para buscar status dinâmico (revisões atrasadas).
- [ ] **Navbar**: Implementar ícone de sino com bolinha vermelha.
- [ ] **Navbar**: Implementar dropdown menu listando sumário de pendências e links diretos.

### 5. 🐛 Bugfix: Criação de Aula com Data
- [ ] **Fix**: Atualizar `AulasListComponent` para não sobrescrever `aulaAssistida: false` no `openModal`.
- [ ] **Validation**: Verificar se o backend `LessonService` processa corretamente `dataAula` na criação.

---

## 🔍 Verificação
1. **Badges**: Criar 1000 questões via seeder e verificar se badge é atribuída e salva.
2. **Notificações**: Atrasar um flashcard via banco e ver bolinha aparecer na Navbar.
3. **Temas**: Mudar tema no Perfil e verificar se persiste em todo o app.
4. **Bugfix**: Criar nova aula marcando data no modal e verificar se salva no banco.
