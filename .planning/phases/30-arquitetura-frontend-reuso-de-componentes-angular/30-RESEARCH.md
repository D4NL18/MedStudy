# Phase 30 Research: Arquitetura Frontend & Reuso de Componentes (Angular)

## Current State Analysis
1. **ESLint & Code Cleaning**: ESLint is currently **NOT configured** in `package.json` or the Angular CLI workspace. We need to install standard `@angular-eslint` tooling and the `eslint-plugin-unused-imports`.
2. **Standalone Components**: The frontend is **ALREADY fully standalone**. A scan revealed 0 `*.module.ts` files, and existing components use `standalone: true`. This simplifies the architecture—all new shared components should just be standard standalone components.
3. **Relative Imports**: Deeply nested relative imports exist across the codebase (e.g. `../../../../shared/components/...` and `../../../../store/...`). No path aliases are configured yet in `tsconfig.json`.
4. **UI Duplication**:
   - There are dozens of raw `<button>` tags in HTML files with custom styling (`btn-primary`, `btn-login`, `btn-export`, `btn-close`, etc.).
   - Various features have their own domain-specific modal implementations (`lesson-modal`, `session-modal`, `subarea-modal`, `simulado-modal`) without reusing standard modal structures properly.

## Steps Required for Execution

### 1. ESLint & Unused Imports Auto-Fix
- **Action**: Install ESLint and the unused-imports plugin in the `frontend` folder:
  `npm install -D eslint eslint-plugin-unused-imports @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/template-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser` (or via `ng add @angular-eslint/schematics`).
- **Action**: Configure `eslint.config.js` or `.eslintrc.json` with the `unused-imports/no-unused-imports` rule.
- **Action**: Run `eslint "src/**/*.ts" --fix` to automatically clean up all unused imports and dead code variables.

### 2. Configure Path Aliases
- **Action**: Add the following `paths` block to `frontend/tsconfig.json` (inside `compilerOptions`):
  ```json
  "paths": {
    "@core/*": ["src/app/core/*"],
    "@shared/*": ["src/app/shared/*"],
    "@features/*": ["src/app/features/*"],
    "@store/*": ["src/app/store/*"],
    "@env/*": ["src/environments/*"]
  }
  ```
- **Action**: Refactor existing components to replace `../../` imports with the new aliases for readability and maintainability.

### 3. Extract & Implement Reusable UI Components
- **Action**: Create standard reusable UI components in `frontend/src/app/shared/components/`:
  - `<app-button>`: To encapsulate the many `btn-*` utility classes.
  - `<app-card>`: To standardize card and container displays.
- **Action**: Replace raw HTML button tags across the feature templates with `<app-button>`.
- **Action**: Standardize modals: Ensure all feature modals utilize the existing `modal-layout` component in `@shared/components/modal-layout`.

### 4. Delete Orphan Components
- **Action**: Identify and delete components that are orphaned or completely unused. This can be aided by the ESLint analysis or tools like `ts-prune` to confirm that components are never imported.
