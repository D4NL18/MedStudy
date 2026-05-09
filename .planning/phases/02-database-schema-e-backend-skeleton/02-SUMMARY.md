# Phase 2 Summary: Database Schema & Backend Skeleton

## Objectives Achieved
- [x] Initial database schema defined via Flyway.
- [x] JPA Entity mappings for all core modules.
- [x] CRUD Repositories established.
- [x] DTO and Mapper architecture implemented.
- [x] Global exception handling configured.

## Key Decisions
- **UUIDs**: All tables use UUIDs for IDs to avoid sequential ID leakage and simplify monorepo scaling.
- **Java Records**: Used for DTOs to ensure immutability and concise code.
- **MapStruct**: Chosen for high-performance, type-safe mapping.
- **JSONB**: Used for Flashcard `frente` and `verso` to allow flexibility in content types (text, images, markdown).

## Pending for Future Phases
- Implementation of Services and Controllers (starting with Auth in Phase 3).
- Integration testing with the real PostgreSQL container.
