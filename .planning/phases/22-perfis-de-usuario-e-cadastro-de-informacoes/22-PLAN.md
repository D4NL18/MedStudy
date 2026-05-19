# Plano de Execução - Phase 22: Perfis de Usuário & Cadastro de Informações

## Objetivos
1. Criar a infraestrutura de perfis (`Profile`) persistida no banco, vinculada um-para-um ao `User`.
2. Implementar fluxo de Onboarding obrigatório impedindo o acesso ao app sem perfil completo (@handle, avatar, faculdade, semestre).
3. Desenvolver o input reativo de handle com validação de unicidade "on-the-fly".
4. Integrar galeria premium com mais de 50 presets de avatares médicos em SVG.
5. Criar componente de Autocomplete dinâmico para seleção filtrada das faculdades de medicina brasileiras.
6. **Ajuste de Rota Padrão e Segurança**: Redirecionar a rota padrão (`/`) para `/login` (se não autenticado) ou `/dashboard` (se autenticado), e proteger `/login` contra acessos de usuários já logados (redirecionando-os ao `/dashboard`).

## Requisitos Atendidos
- **PROF-01**: Cadastro de informações básicas (Nome completo, @handle único, semestre, faculdade, avatar).
- **PROF-02**: Perfil público visualizável por amigos.
- **Rout-01 (Adicional)**: Proteção de rotas padrão, impedimento de acesso à login por usuários autenticados, e travamento por onboarding incompleto.

---

## 🛠️ Tarefas

### 1. Backend: Infraestrutura de Perfis
- [ ] **DB**: Criar entidade `Profile` e tabela correspondente (`id`, `user_id` OneToOne, `handle` VARCHAR UNIQUE, `nome_completo`, `semestre`, `faculdade`, `avatar_preset_id`, `created_at`).
- [ ] **DB**: Adicionar índice de busca rápida e única para o campo `handle`.
- [ ] **DTO & Mapper**: Configurar `ProfileDTO` e o mapper `ProfileMapper` usando MapStruct para expor as informações com segurança.
- [ ] **Service**: Criar `ProfileService` para:
    - Buscar perfil do usuário logado.
    - Criar/atualizar perfil básico.
    - Verificar disponibilidade do handle (`existsByHandle`).
- [ ] **Controller**: Criar `ProfileController` com os seguintes endpoints:
    - `GET /api/profiles/me` - Retorna o perfil do usuário atual.
    - `POST /api/profiles` - Cria ou atualiza o perfil do usuário atual.
    - `GET /api/profiles/check-handle` - Endpoint rápido retornando `{ disponivel: boolean }` para validação em tempo real.

### 2. Frontend: Sistema de Rotas & Guards de Proteção (Ponto Crítico)
- [ ] **Guard**: Criar `guest.guard.ts` (ou ajustar o fluxo de autenticação) para interceptar o acesso à `/login`. Se o usuário já estiver logado, redirecioná-lo automaticamente para o `/dashboard`.
- [ ] **Routes**: Atualizar `app.routes.ts` para:
    - Adicionar o `guestGuard` na rota de `/login`.
    - Garantir que a rota raiz `path: ''` tenha um redirecionamento explícito `{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }` dentro do `ShellComponent` para evitar telas em branco quando logado.
- [ ] **Guard**: Criar `profile.guard.ts` para verificar se o usuário autenticado já possui um perfil completo. Se não possuir, impedir navegação no app e redirecioná-lo para a tela ou fluxo de onboarding.

### 3. Frontend: Componente de Onboarding (Primeiro Acesso)
- [ ] **Assets**: Organizar a biblioteca de no mínimo 50 imagens SVG estilizadas de especialidades médicas em `src/assets/images/avatars/`.
- [ ] **Assets**: Criar um arquivo JSON com as principais faculdades de medicina brasileiras em `src/assets/data/faculdades.json` para alimentar o autocomplete.
- [ ] **Component**: Criar `OnboardingComponent` (ou modal flutuante com background em blur) contendo um fluxo de 3 passos:
    - **Passo 1 (Handle)**: Input de texto com `@` prefixado. Lógica reativa com RxJS `debounceTime(300)` e `switchMap` chamando `check-handle` para feedback visual em tempo real.
    - **Passo 2 (Avatar)**: Grid visual de exibição e seleção das 50+ opções premium de especialidades médicas (Pediatria, Cardiologia, Cirurgia, etc.).
    - **Passo 3 (Educação)**: Campo de seleção filtrável (Autocomplete) para faculdade e selectbox simples de 1º a 12º semestre.

### 4. Frontend: Gerenciamento de Estado do Perfil (NgRx)
- [ ] **NgRx Actions & Reducer**: Criar `ProfileActions` e `ProfileReducer` para gerenciar o perfil do usuário logado no Store.
- [ ] **NgRx Effects**: Implementar `ProfileEffects` para realizar as chamadas HTTP dos endpoints `/api/profiles/me` e salvamento de dados, mantendo sincronização de cache ativa.

### 5. Frontend: Tela de Visualização e Configuração de Perfil
- [ ] **Component**: Atualizar o `PerfilComponent` existente em `/perfil` para:
    - Exibir o layout premium com Glassmorphism.
    - Mostrar a biblioteca de badges (do Milestone v1.1) ao lado do avatar de especialidade selecionada.
    - Disponibilizar aba ou botão "Editar Perfil" reabrindo as opções de troca de avatar, faculdade, semestre e nome.

---

## 🔍 Verificação (UAT)
- [ ] **UAT 22.1**: Acessar a raiz (`/`) deslogado redireciona para `/login`. Logar e acessar a raiz (`/`) redireciona imediatamente para o `/dashboard` (sem páginas em branco).
- [ ] **UAT 22.2**: Usuário logado tentando digitar `/login` na barra de URL é interceptado e mantido no `/dashboard`.
- [ ] **UAT 22.3**: Novo usuário ao logar vê o modal/tela de Onboarding e não consegue fechá-lo ou acessar o app sem completar os dados.
- [ ] **UAT 22.4**: No Onboarding, ao digitar um handle já cadastrado por outro usuário, o sistema bloqueia o progresso e mostra erro de handle indisponível.
- [ ] **UAT 22.5**: O usuário consegue selecionar seu avatar entre os 50+ presets disponíveis e salvar seu perfil, atualizando a Navbar e o Perfil instantaneamente.
- [ ] **UAT 22.6**: No offline, a lista de 50+ avatares em SVG renderiza e abre perfeitamente a partir do cache do service worker.
