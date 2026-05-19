# Phase 23: Sistema de Conexões (Amigos) & Busca - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 23-sistema-de-conexoes-amigos-e-busca
**Areas discussed:** Modelagem de Amizades, Notificações Sociais, Mecanismo de Busca, Rota e Layout UI

---

## Modelagem de Relacionamento de Amizades (Banco de Dados)

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Tabela de registro único (requester_id, receiver_id, status: PENDING, ACCEPTED, BLOCKED) com consultas otimizadas usando OR/Union | ✓ (Recomendada) |
| **Opção B** | Tabela de registro bidirecional (insere duas linhas A->B e B->A ao aceitar), facilitando queries simples | |

**User's choice:** Opção A
**Notes:** O usuário concordou com a abordagem de registro único por ser mais eficiente em termos de armazenamento e consistência lógica, utilizando consultas com UNION ou OR no Spring Data JPA.

---

## Sistema de Notificações Sociais In-App

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Criar tabela de notificações persistente no banco de dados, estendendo o NotificationService existente para integrar eventos de amigos | ✓ (Recomendada) |
| **Opção B** | Simulação em tempo de execução com polling dinâmico no frontend (sem salvar histórico de notificações no banco) | |

**User's choice:** Opção A
**Notes:** A persistência no banco de dados foi selecionada para garantir robustez técnica, permitindo aos usuários acompanhar o histórico de notificações de conquistas e streaks de amigos e marcar como lidas a qualquer momento.

---

## Mecanismo de Busca de Outros Estudantes

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Busca reativa com autocomplete (debounce de 300ms), filtrando por nome completo, @handle ou faculdade, ocultando usuários bloqueados e o próprio usuário | ✓ (Recomendada) |
| **Opção B** | Busca tradicional baseada em clique (sem autocomplete), filtrando apenas por termo de texto exato | |

**User's choice:** Opção A
**Notes:** O usuário optou pela busca reativa e com autocomplete visando proporcionar uma experiência moderna, interativa e segura, prevenindo interações com usuários bloqueados.

---

## Interface e Layout do Painel Social na UI

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Nova tela/rota dedicada (/social) adicionada ao menu de navegação, com abas para amigos, solicitações e buscas | ✓ (Recomendada) |
| **Opção B** | Drawer/Painel lateral retrátil acessível de qualquer lugar do sistema para gerenciamento rápido de amizades | |

**User's choice:** Opção A
**Notes:** Uma tela dedicada permite maior área de exibição para interações complexas (como cards de perfil detalhados contendo streaks e badges conquistadas), mantendo o layout organizado e limpo em todas as resoluções.
