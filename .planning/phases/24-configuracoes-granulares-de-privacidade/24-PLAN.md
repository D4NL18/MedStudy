# Plano de Execução - Phase 24: Configurações Granulares de Privacidade

Este plano detalha as tarefas, alterações de arquivos e entregáveis necessários para a implementação de privacidade do usuário no MedStudy (Milestone v1.2), cumprindo as decisões de arquitetura e design acordadas.

## Objetivos
1. **Banco de Dados (Flyway)**: Adicionar campos de controle de privacidade à tabela `profiles` via migração do Flyway (`is_public`, `share_streak`, `share_faculdade`, `share_total_questions`, `share_badges`).
2. **Backend Mappings**: Atualizar a entidade JPA `Profile` e o `ProfileDTO` com os novos campos de controle e campos dinâmicos adicionais (`streak`, `totalQuestions`, `badges`, `isPrivate`, `friendshipStatus`, `isRequester`).
3. **Lógica de Filtragem (Mecanismo de Privacidade)**:
   - Garantir que o próprio usuário sempre tenha visualização total (100% de seus dados acadêmicos, streaks, questões e medalhas).
   - Ocultar ou zerar estatísticas se a privacidade granular do usuário for desativada (ex: `share_streak = false`).
   - Se o perfil for totalmente privado (`is_public = false`) e o visualizador não for um amigo aceito, mascarar todos os dados acadêmicos e retornar `isPrivate = true`.
4. **Broadcast de Notificações Controlado**: Modificar a lógica do backend para enviar alertas de streak e conquistas a amigos somente se as respectivas flags granulares estiverem ativadas (`share_streak` e `share_badges`).
5. **Frontend Settings Panel**: Criar uma seção de configurações de privacidade no `/perfil` com toggles reativos e interativos (autosave no toggle change com feedback visual premium).
6. **Glassmorphic Privacy Overlay**: Na tela social, ao clicar para visualizar o perfil de outro estudante, renderizar um lindo modal detalhado do perfil. Se o perfil for privado e não forem amigos, exibir um overlay premium com efeito glassmorphic de desfoque, informando que a conta é privada e disponibilizando o botão de solicitação de amizade.

---

## 🛠️ Tarefas de Implementação

### 1. Database & Migrations
- [x] **Migration**: Criar `V17__add_privacy_settings_to_profiles.sql` na pasta `backend/src/main/resources/db/migration/`:
  - `ALTER TABLE profiles ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT TRUE;`
  - `ALTER TABLE profiles ADD COLUMN share_streak BOOLEAN NOT NULL DEFAULT TRUE;`
  - `ALTER TABLE profiles ADD COLUMN share_faculdade BOOLEAN NOT NULL DEFAULT TRUE;`
  - `ALTER TABLE profiles ADD COLUMN share_total_questions BOOLEAN NOT NULL DEFAULT TRUE;`
  - `ALTER TABLE profiles ADD COLUMN share_badges BOOLEAN NOT NULL DEFAULT TRUE;`

### 2. Backend: Modelos e Mapeamentos (Profiles)
- [x] **JPA Entity (`Profile.java`)**:
  - Adicionar atributos booleanos correspondentes às colunas criadas no banco de dados.
  - Implementar getters e setters explícitos (mantendo o padrão da classe sem Lombok).
  - Inicializar todos como `true` para novos perfis (padrão amigável e aberto).
- [x] **DTO (`ProfileDTO.java`)**:
  - Adicionar atributos de configuração de privacidade: `isPublic`, `shareStreak`, `shareFaculdade`, `shareTotalQuestions`, `shareBadges`.
  - Adicionar atributos estatísticos e contextuais: `streak` (Integer), `totalQuestions` (Long), `badges` (List<String>), `isPrivate` (Boolean), `friendshipStatus` (String), `isRequester` (Boolean).
  - Como `ProfileDTO` usa Lombok `@Data` e `@AllArgsConstructor`, o mapeamento destes novos campos será transparente.

### 3. Backend: Lógica de Serviço e Filtragem (Privacy Engine)
- [x] **Profile Service (`ProfileService.java`)**:
  - No método `createOrUpdateProfile`: Persistir as novas configurações de privacidade enviadas pelo frontend.
  - No método de carregamento público (`getProfileByHandle` ou similar):
    - Extrair o usuário logado do SecurityContext.
    - Se o usuário visualizador for o próprio dono: carregar dados estatísticos completos e definir `isPrivate = false`.
    - Se o usuário visualizador for terceiros:
      - Consultar o status da amizade com o proprietário.
      - Se a conta for privada (`isPublic == false`) e o status da amizade não for `ACCEPTED`: Mascarar todos os dados acadêmicos (faculdade, semestre, isFormado), zerar as estatísticas (streak, questões, badges) e definir `isPrivate = true`.
      - Se a conta for pública (ou amigos): Aplicar as filtros granulares (ex: se `shareStreak == false`, definir `streak = null`).
- [x] **Friendship Service (`FriendshipService.java`)**:
  - Ajustar o método `searchProfiles`: Ao retornar perfis buscados, verificar se o perfil é privado ou se as flags granulares estão inativas para o visualizador (não-amigo) e aplicar a máscara correspondente em `faculdade`, `semestre` e `streak`.

### 4. Backend: Geração de Notificações Sociais Controlada
- [x] **Study Session Service (`StudySessionService.java`)**:
  - No salvamento de sessões de estudo:
    - Se o streak do usuário logado avançar e `shareStreak == true`: Disparar notificação social `STREAK_RECORD` para todos os amigos ativos.
    - Se novas medalhas forem conquistadas e `shareBadges == true`: Para cada medalha conquistada, disparar notificação social `BADGE_EARNED` para os amigos ativos.

### 5. Frontend: Armazenamento e Ações NgRx (Store)
- [x] **Profile Store (`profile.model.ts`, `profile.reducer.ts`)**:
  - Adicionar campos de privacidade na interface `Profile`.
  - Garantir mapeamento nos reducers ao receber do endpoint `/me` ou atualizar configurações.

### 6. Frontend: Configurações de Privacidade Reativas (UI)
- [x] **Componente de Perfil (`perfil.component.ts` e `perfil.component.scss`)**:
  - Adicionar um lindo painel de privacidade ("🔒 Privacidade da Conta") ao lado da customização de temas.
  - Exibir toggles estilizados em HSL (verde-esmeralda ativo, vidro inativo) com animações fluidas para as 5 configurações de privacidade.
  - Implementar autosave: a alteração de qualquer toggle envia imediatamente uma chamada para salvar o perfil via NgRx, mostrando feedback suave e toasts informativos de sucesso/erro.

### 7. Frontend: Modal de Visualização Social de Perfil (Glassmorphic Overlay)
- [x] **Componente Social (`social.component.ts` e `social.component.html`)**:
  - Permitir a visualização de perfis ao clicar no card de um estudante (nas abas Buscar e Meus Amigos).
  - Ao clicar, carregar dados via `ProfileService.getPublicProfile(handle)`.
  - Exibir o perfil em um modal Glassmorphic detalhado.
  - Se `isPrivate === true`: renderizar o **Overlay de Privacidade Premium** (desfoque do fundo do modal com um grande ícone de cadeado brilhante, informando que a conta é privada e incentivando a solicitação de amizade através de botões interativos integrados).
  - Se `isPrivate === false`: renderizar as abas ou dados acadêmicos autorizados de forma limpa, ocultando dinamicamente os campos bloqueados pelo usuário (`streak`, `faculdade`, `semestre`, `totalQuestions`, `badges`) sem deixar lacunas ou espaços em branco.


---

## 🔍 Plano de Verificação (UAT)

### 1. Visualização do Próprio Perfil
- **UAT 24.1**: O usuário acessa seu próprio perfil no `/perfil` e deve ver todas as suas estatísticas de estudo (streak, total de questões e medalhas conquistadas) intactas, mesmo que decida desativar o compartilhamento público de todas as flags.

### 2. Painel de Toggles e Autosave
- **UAT 24.2**: O usuário altera o toggle "Compartilhar Streak" no `/perfil`. O sistema deve exibir instantaneamente um toast de carregamento/sucesso e persistir a alteração no banco de dados. Recarregar a página mantém o estado selecionado do toggle.

### 3. Máscara de Privacidade para Não-Amigos
- **UAT 24.3**: Estudante A tem perfil configurado como Totalmente Privado (`isPublic = false`). Estudante B (não-amigo) pesquisa pelo handle de A na aba de busca e clica para ver os detalhes.
  - O modal de perfil deve se abrir com um lindo desfoque e um cadeado luminoso informando "Este perfil é privado".
  - Nenhuma informação de faculdade, semestre, streak, questões ou badges deve ser transmitida no payload JSON ou renderizada na tela.
  - O botão de "Enviar solicitação de amizade" deve estar visível e funcional no overlay.

### 4. Controle Granular e Ocultação Fluida
- **UAT 24.4**: Estudante A é amigo aceito de Estudante B. Estudante A desativa a opção "Compartilhar Faculdade" e "Compartilhar Streak", mas mantém as outras ativas.
  - Ao visualizar o perfil de A através da conta de B:
    - O perfil deve abrir sem overlay de privacidade (já que são amigos).
    - Os campos de "Faculdade" e "Streak" devem sumir organicamente do layout, mantendo a galeria de medalhas e questões ativas.

### 5. Silenciamento de Notificações
- **UAT 24.5**: Estudante A desativa a flag "Compartilhar Galeria de Medalhas". Estudante A resolve um simulado e ganha a medalha "Estratega de Simulados".
  - O sistema do amigo B **não** deve receber nenhuma notificação in-app sobre a conquista da nova medalha de A.
