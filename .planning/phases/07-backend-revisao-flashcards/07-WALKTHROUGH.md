# Walkthrough — Phase 07: Revisão & Flashcards

## Alterações Realizadas

### Backend
- **Tabela Flashcards**: Criada via Flyway (`V4`) com suporte a `JSONB`.
- **Spaced Repetition**: Implementado serviço `SpacedRepetitionService` com lógica de intervalo exponencial.
- **CRUD Flashcards**: Endpoints em `/api/flashcards` para criação, edição e o novo fluxo `POST /api/flashcards/{id}/estudar`.
- **Resumo de Revisões**: Endpoint `/api/revisoes/resumo` para dar o panorama das sessões pendentes.
- **Infraestrutura**: Adicionado Lombok ao `pom.xml` para reduzir boilerplate.

## Verificação Realizada

### Testes Unitários
- **SpacedRepetitionServiceTest**: Validado que:
    - `HARD` reseta o intervalo para 1 dia e diminui o `easeFactor`.
    - `EASY` expande o intervalo (ex: de 4 dias para 12 dias) e aumenta o `easeFactor`.

### Manual (Swagger)
- Criado Flashcard com JSON de blocos.
- Estudado Flashcard e verificado que `proximaRevisao` foi calculada para o futuro.
- Verificado resumo de revisões retornando as contagens de sessões.

## Próximos Passos
- **Phase 08**: Frontend - Setup & Shared Module (Início da reconstrução visual em Angular 18).
