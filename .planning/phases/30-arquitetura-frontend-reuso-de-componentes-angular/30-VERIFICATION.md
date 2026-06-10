## Verification Gaps for Phase 30

The following gaps were found by the verification agent and must be resolved before the phase can be completed:

**1. Relative imports were not completely refactored:**
The plan required replacing all relative imports using path aliases (`@core`, `@shared`, etc.) and ensuring `grep -r "from '\.\./\.\." frontend/src` returns 0 results. However, deep relative imports like `../../` still exist in files such as:
- `frontend/src/app/features/flashcards/pages/flashcards-study/flashcards-study.component.ts`
- `frontend/src/app/features/social/social.component.ts`

**2. Orphan `<button class="...">` components remain:**
The plan required migrating legacy `button` elements to use the `<app-button>` standalone component across feature templates, with the criteria `grep -E "<button class=" frontend/src/app/features` returning 0 matches. However, raw button elements are still present in:
- `frontend/src/app/features/auth/onboarding/onboarding.component.ts`
- `frontend/src/app/features/dashboard/components/subarea-modal/subarea-modal.component.ts`
- `frontend/src/app/features/flashcards/components/reset-modal/flashcard-reset-modal.component.ts`
- `frontend/src/app/features/perfil/perfil.component.ts`

**3. Custom feature modals were not fully standardized:**
The plan required standardizing custom feature modals to use `<app-modal-layout>`. Several components still use raw HTML modal overlays (`<div class="modal-container">`, `<div class="modal-overlay">`, etc.):
- `frontend/src/app/features/dashboard/components/subarea-modal/subarea-modal.component.ts`
- `frontend/src/app/features/flashcards/components/reset-modal/flashcard-reset-modal.component.ts`
- `frontend/src/app/features/perfil/perfil.component.ts`
- `frontend/src/app/features/social/social.component.html`
