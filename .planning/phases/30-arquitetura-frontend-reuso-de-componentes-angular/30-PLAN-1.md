# Phase 30: Arquitetura Frontend & Reuso de Componentes (Angular) - Plan 1

## Wave 1: Tooling Setup & Aliases

### Task 1: Configure ESLint and run Auto-Fix
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-RESEARCH.md
- frontend/package.json
</read_first>
<action>
1. Navigate to `frontend/` and run `npm install -D eslint eslint-plugin-unused-imports @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/template-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser`.
2. Create or configure `frontend/eslint.config.js` (or `.eslintrc.json`) mapping `@angular-eslint` defaults and specifically setting `"unused-imports/no-unused-imports": "error"`.
3. Add a lint script to `frontend/package.json`: `"lint": "eslint \"src/**/*.ts\" --fix"`.
4. Run `npm run lint` inside `frontend/` to clean up unused imports and dead variables automatically.
</action>
<acceptance_criteria>
- `grep '"@angular-eslint/builder"' frontend/package.json` returns a match.
- `grep '"lint":' frontend/package.json` returns a match.
- Running `npm run lint` exits with 0 and removes unused imports.
</acceptance_criteria>

### Task 2: Configure TS Path Aliases
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-RESEARCH.md
- frontend/tsconfig.json
- frontend/tsconfig.app.json
- frontend/tsconfig.spec.json
</read_first>
<action>
1. Edit `frontend/tsconfig.json` to include the `paths` object within `compilerOptions`:
   ```json
   "paths": {
     "@core/*": ["src/app/core/*"],
     "@shared/*": ["src/app/shared/*"],
     "@features/*": ["src/app/features/*"],
     "@store/*": ["src/app/store/*"],
     "@env/*": ["src/environments/*"]
   }
   ```
2. Verify if `frontend/tsconfig.app.json` or `tsconfig.spec.json` needs inheritance adjustments.
</action>
<acceptance_criteria>
- `grep '"@shared/\*"' frontend/tsconfig.json` returns a match.
- `npm run build` successfully resolves modules.
</acceptance_criteria>

## Wave 2: Shared UI Components Generation

### Task 1: Create Button Component
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-UI-SPEC.md
- frontend/src/styles.scss
</read_first>
<action>
1. Create a standalone component at `frontend/src/app/shared/components/button` (`button.component.ts`, `button.component.html`, `button.component.scss`).
2. Add `@Input` properties: `variant` (e.g., primary, secondary, cta, icon), `disabled`, `type`, and an optional `icon`.
3. Centralize scattered button CSS styles or map them properly to the component.
4. Ensure `standalone: true`.
</action>
<acceptance_criteria>
- `ls frontend/src/app/shared/components/button/button.component.ts` succeeds.
- `grep 'standalone: true' frontend/src/app/shared/components/button/button.component.ts` returns a match.
</acceptance_criteria>

### Task 2: Create Card Component
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-UI-SPEC.md
</read_first>
<action>
1. Create a standalone component at `frontend/src/app/shared/components/card` (`card.component.ts`, `card.component.html`, `card.component.scss`).
2. Implement `<ng-content>` projection to support flexible card layouts.
</action>
<acceptance_criteria>
- `ls frontend/src/app/shared/components/card/card.component.ts` succeeds.
- `grep 'standalone: true' frontend/src/app/shared/components/card/card.component.ts` returns a match.
</acceptance_criteria>

## Wave 3: Refactoring and Application

### Task 1: Apply Path Aliases to Existing Code
<read_first>
- frontend/tsconfig.json
- Find files with relative imports: `grep -rl "from '\.\./\.\." frontend/src`
</read_first>
<action>
1. Identify all files using `../../../shared/` with: `grep -rl "from '\.\./\.\./\.\./shared" frontend/src`
2. Run a sed command or manual replacement to convert relative imports `../../../shared/` to `@shared/`.
3. Do the same for `@features/`, `@core/`, etc., wherever `../../` patterns are found.
4. Ensure the application compiles without errors by running `npm run build`.
</action>
<acceptance_criteria>
- Running `grep -r "from '\.\./\.\." frontend/src` returns 0 results.
- `npm run build` inside `frontend/` succeeds.
</acceptance_criteria>

### Task 2: Refactor Buttons and Modals in Features
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-RESEARCH.md
- Find target files: `grep -rl "<button class=" frontend/src/app/features`
- Find modal targets: `grep -rl "modal" frontend/src/app/features`
</read_first>
<action>
1. Replace scattered raw `<button class="btn-*">` elements with the new `<app-button variant="*">` component across the feature templates in `src/app/features`.
2. Standardize custom feature modals to use the existing `<app-modal-layout>` component from `@shared/components/modal-layout`.
</action>
<acceptance_criteria>
- `grep -r "<app-button" frontend/src/app/features` yields matches, and `grep -E "<button class=" frontend/src/app/features` returns 0 matches.
- `grep -r "<app-modal-layout" frontend/src/app/features` yields matches where modals are used.
</acceptance_criteria>

### Task 3: Cleanup Orphan Components
<read_first>
- .planning/phases/30-arquitetura-frontend-reuso-de-componentes-angular/30-CONTEXT.md
</read_first>
<action>
1. Install and run `ts-prune` (or use ESLint) to identify unreferenced components.
2. Delete orphaned component files and directories.
3. Validate that the application remains stable and tests pass.
</action>
<acceptance_criteria>
- Running `npx ts-prune` returns 0 unused exports for the components.
- `npm run test` and `npm run build` pass successfully.
</acceptance_criteria>
