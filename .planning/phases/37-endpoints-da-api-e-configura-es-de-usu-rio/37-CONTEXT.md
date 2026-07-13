# Phase 37 Context: Endpoints da API e Configurações de Usuário

## Domain
Criação das rotas REST para pré-visualizar a reorganização e efetivá-la, além de salvar preferências (ex: máximo de revisões por dia).

## Canonical Refs
- [ROADMAP.md](../../ROADMAP.md)

## Code Context
- Padrões de entidade legados/atuais para definir o *streak*, a data original e a prioridade das aulas.

## Decisions

### 1. Fluxo de Preview vs. Aplicar
- **Decisão:** Rascunho Temporário. O preview salva um rascunho temporário (no banco ou Redis) e retorna um ID. Ao efetivar, passamos esse ID.
- **Justificativa:** Garante 100% de consistência entre o que o usuário viu na tela e o que será efetivamente aplicado.

### 2. Armazenamento de Preferências
- **Decisão:** Nova Entidade `UserSettings` (ou `UserPreferences`).
- **Justificativa:** Criar uma tabela separada (ex: vinculada OneToOne ao User) para as preferências de estudo. Mantém a tabela `User` limpa para dados de autenticação/perfil.

### 3. Resolução de Conflitos (Limite Diário vs. Prazo Final)
- **Decisão:** A data limite tem prioridade absoluta.
- **Justificativa:** O limite diário de revisões será ultrapassado se for matematicamente impossível atingir a meta na data escolhida. O endpoint de preview deve retornar um aviso estruturado caso isso aconteça, para que a UI exiba uma confirmação ao usuário aceitando a proposta.
