# Plan — Phase 07: Revisão & Flashcards

## Proposed Changes

### 1. Database & Infrastructure
- **[NEW]** `V4__create_flashcards_table.sql`: Migração Flyway para a nova tabela.
- **[MODIFY]** `pom.xml`: Adicionar dependência para suporte a JSONB no Hibernate (se necessário, embora Hibernate 6 já suporte bem via `@JdbcTypeCode`).

### 2. Módulo de Flashcards
- **[NEW]** `Flashcard.java`: Entidade com mapeamento JSONB.
- **[NEW]** `FlashcardRepository.java`.
- **[NEW]** `FlashcardRequest.java` / `FlashcardResponse.java`.
- **[NEW]** `FlashcardService.java`: CRUD e busca filtrada.
- **[NEW]** `FlashcardController.java`.

### 3. Módulo de Revisão & Algoritmo
- **[NEW]** `SpacedRepetitionService.java`: Implementação da lógica adaptativa SM-2.
- **[NEW]** `RevisionService.java`: Lógica para listar sessões e flashcards pendentes.
- **[NEW]** `RevisionController.java`: Endpoints para listar revisões (Atrasadas, Hoje, Futuras) e concluir revisões.
- **[MODIFY]** `StudySession.java`: Garantir que campos de revisão estão prontos para a lógica.

### 4. Testes
- **[NEW]** `SpacedRepetitionServiceTest.java`: Validar se o intervalo cresce corretamente com "EASY" e reseta com "HARD".

## Verification Plan

### Automated Tests
- `./mvnw test -Dtest=SpacedRepetitionServiceTest`

### Manual Verification (Swagger)
1. Criar um flashcard.
2. Simular estudo com "HARD" e ver se `proxima_revisao` = Amanhã.
3. Simular estudo com "EASY" e ver se o intervalo cresce conforme o `ease_factor`.
4. Listar revisões pendentes e verificar se a sessão de estudo cadastrada na Phase 4 aparece corretamente.
