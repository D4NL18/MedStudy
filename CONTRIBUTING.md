# Contributing to MedStudy

Thank you for your interest in contributing!

## Development Workflow

1. **Monorepo Structure**: Keep backend and frontend concerns separated in their respective directories.
2. **Commit Messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `test:`).
3. **Branching**: Create a feature branch for any new work: `feat/your-feature-name`.

## Coding Standards

- **Backend (Java)**: Follow standard Spring Boot patterns. Use Records for DTOs and MapStruct for mapping.
- **Frontend (Angular)**: Use Standalone Components and Signals. Avoid legacy `NgModule` where possible.
- **State Management**: Use NgRx for global state and Signals for local component state.

## Testing

Ensure all tests pass before submitting a PR:
- Backend: `./mvnw test`
- Frontend: `npm test`

Maintain at least 80% code coverage for core business logic.
