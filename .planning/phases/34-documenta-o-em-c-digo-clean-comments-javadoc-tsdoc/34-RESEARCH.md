# RESEARCH: Phase 34 - Documentação em Código

## 1. Domain & Scope
The goal of this phase is to perform a comprehensive cleanup and documentation pass over the entire codebase (frontend and backend).
- **DOC-01**: Remove all unnecessary comments and dead code (remnants of legacy prototyping).
- **DOC-02**: Write clear Javadoc/TSDoc for future maintainability.

## 2. Constraints & Decisions (from CONTEXT.md)
- **Exaustivo**: 100% of public classes and methods must be documented with at least a basic Javadoc/TSDoc.
- **Limpeza implacável**: Absolutely all commented-out code blocks and non-doc comments must be deleted (except critical lint directives).
- **Enriquecimento para geradores**:
  - **Frontend (Angular)**: Must include Compodoc-specific tags/annotations in addition to standard TSDoc.
  - **Backend (Spring Boot)**: Must aggressively expand Swagger annotations (`@Operation`, `@ApiResponses`, `@Parameter`, etc.) in addition to standard Javadoc.

## 3. Implementation Areas to Plan

### Backend (Java / Spring Boot)
- **Location**: `backend/src/main/java/com/medstudy/backend`
- **Actions Required**:
  1. Regex/manual scan to remove dead code (`//` and `/* ... */` that aren't Javadoc).
  2. Add standard Javadoc (`/** ... */`) to all public classes, interfaces, methods, and DTOs.
  3. Enrich Controllers and DTOs with Swagger annotations (`@Tag`, `@Operation`, `@ApiResponse`, `@Schema`).

### Frontend (TypeScript / Angular)
- **Location**: `frontend/src/app`
- **Actions Required**:
  1. Regex/manual scan to remove dead code and old inline comments.
  2. Add standard TSDoc to all public components, services, models, pipes, directives, and functions.
  3. Enrich with Compodoc tags where applicable.

## 4. Validation Architecture
- **Automated Check**:
  - Run linting rules or a custom script to ensure 100% Javadoc/TSDoc coverage on public entities.
  - Verify no commented-out code blocks remain using grep patterns (e.g., matching common commented code patterns).
- **Manual/Build Check**:
  - Run the Swagger UI locally to ensure API documentation is generated correctly and fully populated.
  - Run Compodoc generation in the frontend to ensure docs build successfully and all modules are covered.
