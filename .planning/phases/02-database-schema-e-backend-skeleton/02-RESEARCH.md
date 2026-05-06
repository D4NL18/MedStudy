# Phase 2 Technical Research

## Objective
Research how to implement Phase 2: Database Schema & Backend Skeleton.
Goal: Provide the planner with the technical approach to create the Flyway migrations, JPA entities, repositories, and DTO/Mapper structure.

## Technical Approach & Dependencies

### 1. Flyway Migrations
- **Location:** `backend/src/main/resources/db/migration/`
- **Naming Convention:** `V1__create_initial_schema.sql`
- **Tables to Create:** 
  - `users` (id UUID, email VARCHAR, password VARCHAR, etc.)
  - `study_sessions` (id UUID, grande_area VARCHAR, tema VARCHAR, etc.)
  - `simulados` (id UUID, nome VARCHAR, etc.)
  - `lessons` (id UUID, grande_area VARCHAR, etc.)
  - `flashcards` (id UUID, grande_area VARCHAR, frente JSONB, verso JSONB, etc.)
  - `refresh_tokens` (id UUID, user_id UUID, token VARCHAR, etc.)
- All tables must include `created_at` and `updated_at` timestamps to map to the `BaseEntity`.

### 2. JPA Entities
- Create `@MappedSuperclass BaseEntity` with:
  ```java
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
  ```
- Map entities (`User`, `StudySession`, `Simulado`, `Lesson`, `Flashcard`, `RefreshToken`) extending `BaseEntity`.

### 3. Repositories
- Create Spring Data JPA repositories extending `JpaRepository<Entity, UUID>`.
- Use `@Repository` annotation.

### 4. DTOs and Validation
- Use Java Records for DTOs.
- Organize in feature packages (e.g., `com.medstudy.modules.sessao.dto`).
- Use `jakarta.validation.constraints` (`@NotNull`, `@NotBlank`, `@Size`, etc.).

### 5. MapStruct Mappers
- Add MapStruct dependency and annotation processor.
- Configure component model to Spring (`@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)`).
- Create mappers per feature.

### 6. Global Exception Handler
- Create `@ControllerAdvice GlobalExceptionHandler`.
- Handle `MethodArgumentNotValidException`, `EntityNotFoundException`, custom `BusinessException`.
- Return simple JSON:
  ```json
  {
    "timestamp": "2026-05-05T22:00:00Z",
    "status": 404,
    "error": "Not Found",
    "message": "Mensagem descritiva",
    "path": "/api/..."
  }
  ```

## Potential Landmines
- **UUID vs Hibernate:** Ensure `@GeneratedValue(strategy = GenerationType.UUID)` works correctly with the Hibernate 6+ version used in Spring Boot 3.
- **MapStruct Setup:** Must ensure the `mapstruct-processor` is correctly configured in `pom.xml` before `lombok` processor (if Lombok is used) to avoid empty mapper implementations.
- **Flyway Syntax:** Use PostgreSQL specific syntax (`UUID DEFAULT gen_random_uuid()`) for primary keys.

## Dependencies Added/Verified
- `flyway-core` and `flyway-database-postgresql`
- `spring-boot-starter-validation`
- `mapstruct` (version ~1.5.5.Final)
