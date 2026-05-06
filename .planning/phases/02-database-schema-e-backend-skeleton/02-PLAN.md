# Phase 2 Plan: Database Schema & Backend Skeleton

## 1. Configurar Dependências do MapStruct
- Adicionar as dependências do `mapstruct` e `mapstruct-processor` no `pom.xml` do backend.
- Garantir que o `mapstruct-processor` seja configurado no plugin do `maven-compiler-plugin`.

## 2. Criar Migrations do Flyway
- Criar o diretório `backend/src/main/resources/db/migration/`.
- Adicionar o arquivo `V1__create_initial_schema.sql` com as instruções DDL para criar as tabelas:
  - `users`
  - `study_sessions`
  - `simulados`
  - `lessons`
  - `flashcards`
  - `refresh_tokens`
- Utilizar colunas do tipo `UUID` como primary keys (`DEFAULT gen_random_uuid()`).
- Adicionar colunas de auditoria `created_at` e `updated_at` (TIMESTAMP) em todas as tabelas.

## 3. Criar BaseEntity
- Criar pacote `com.medstudy.backend.core.entity` (ou similar) e adicionar `BaseEntity.java`.
- Anotar com `@MappedSuperclass`.
- Adicionar atributos `id` (UUID), `createdAt` e `updatedAt`.
- Configurar `@CreationTimestamp` e `@UpdateTimestamp` e `@Column(updatable = false)` no `createdAt`.

## 4. Mapear Entidades JPA
- Criar os pacotes de módulos: `user`, `sessao`, `simulado`, `aula`, `flashcard`, `auth`.
- Criar as entidades estendendo `BaseEntity` com mapeamento adequado (`@Entity`, `@Table`).
- Exemplo: `StudySession`, `Simulado`, `Lesson`, `Flashcard`, `User`, `RefreshToken`.

## 5. Criar Repositórios Spring Data JPA
- Criar interfaces `*Repository` estendendo `JpaRepository<Entity, UUID>` para cada entidade criada no passo anterior.

## 6. Criar DTOs (Java Records)
- Criar as records de DTO nos pacotes de módulo adequados (ex: `com.medstudy.backend.modules.sessao.dto`).
- Usar anotações do `jakarta.validation.constraints` (`@NotBlank`, `@NotNull`) para Request DTOs.
- Criar DTOs básicos para requisição e resposta de todas as entidades.

## 7. Configurar MapStruct Mappers
- Criar interface base de mapper ou interfaces específicas (ex: `StudySessionMapper`).
- Anotar com `@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)`.
- Adicionar os métodos para converter `Entity` -> `ResponseDTO` e `RequestDTO` -> `Entity`.

## 8. Implementar Tratamento Global de Erros (@ControllerAdvice)
- Criar pacote `com.medstudy.backend.core.exception`.
- Criar record `ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path)`.
- Criar classe `GlobalExceptionHandler` anotada com `@RestControllerAdvice`.
- Implementar métodos `@ExceptionHandler` para `MethodArgumentNotValidException`, `EntityNotFoundException` e fallback `Exception.class`.
