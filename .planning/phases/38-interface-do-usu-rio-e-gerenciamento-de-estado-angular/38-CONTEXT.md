# Phase 38 Context: Interface do Usuário e Gerenciamento de Estado (Angular)

## Domain
Criação do botão "Reorganizar Atrasos", modal de confirmação e integração com NgRx (Actions/Effects/Reducers).

## Canonical Refs
- [ROADMAP.md](../../ROADMAP.md)
- [37-CONTEXT.md](../37-endpoints-da-api-e-configura-es-de-usu-rio/37-CONTEXT.md)

## Code Context
- Angular 18 Standalone Components e estrutura NgRx já configurados.
- Interface de Revisões já existente.

## Decisions

### 1. Posicionamento e Escopo do Botão
- **Decision:** O botão ficará **dentro da aba de "Revisão intervalada"**.
- **Decision:** A reorganização vai atuar **apenas nas revisões**, e não nos flashcards.

### 2. Estrutura do Modal de Preview
- **Decision:** Será um **Modal detalhado**.
- **Decision:** Exibirá a data estimada, o aviso de limite diário (se houver), e um breve resumo em texto de como a carga ficou distribuída, preparando terreno para os gráficos visuais da Fase 39.

### 3. Gerenciamento do Draft ID
- **Decision:** Armazenar no **Estado Global (NgRx)**.
- **Decision:** O draftId retornado pelo preview será salvo na Store global, permitindo recuperação caso o usuário feche e reabra o modal enquanto o draft ainda for válido.
