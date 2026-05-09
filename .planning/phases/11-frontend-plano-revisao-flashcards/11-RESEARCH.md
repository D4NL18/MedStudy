# Research: Phase 11 — Frontend: Plano de Aulas, Revisão & Flashcards

## Objective
Investigate technical approaches for Markdown integration, image pasting (Base64), 3D flip animations, and NgRx state management for Phase 11.

## 1. Markdown Integration (Angular 18)
- **Library Recommendation:** `ngx-markdown` (v18.x.x).
- **Setup:**
  - Install via `npm install ngx-markdown`.
  - Configure in `app.config.ts` using `provideMarkdown()`.
- **Key Features:**
  - Standard Markdown parsing with `marked`.
  - Prism.js integration for syntax highlighting (useful if medical notes include code or structured data).
  - High compatibility with Angular Standalone components.

## 2. Ctrl+V Image Support (Base64)
- **Concept:** Intercept the `paste` event on the Markdown editor's textarea and convert image data to Base64 strings.
- **Implementation Strategy:**
  1. Add a `(paste)="onPaste($event)"` listener to the `textarea`.
  2. Access `event.clipboardData.items`.
  3. Iterate through items to find `type.match(/^image\//)`.
  4. Use `FileReader.readAsDataURL(item.getAsFile())` to get the Base64 string.
  5. Insert the string into the text at the current cursor position using the Markdown syntax: `![image](data:image/png;base64,...)`.
- **Trade-off:** Storing Base64 in `JSONB` increases database size but fulfills the "essential for v1" requirement for immediate image support without backend storage infrastructure.

## 3. Flashcard Flip Animation (CSS 3D)
- **Architecture:** Use a wrapper container with two child components/divs (`front` and `back`).
- **CSS Properties:**
  - `perspective: 1000px` on the container.
  - `transform-style: preserve-3d` on the card inner element.
  - `backface-visibility: hidden` on both front and back faces.
  - `transform: rotateY(180deg)` on the back face (initially) and on the inner element when flipped.
- **Trigger:** An Angular signal or boolean variable toggling a `.is-flipped` class.

## 4. NgRx Feature State Structure
- **Organization:** Three separate features within the `store` directory to maintain modularity:
  - `planoAulas`: Handles lesson CRUD and "assisted" status.
  - `revisao`: Manages the 4 revision lists (Atrasadas, Hoje, Futuras, Realizadas).
  - `flashcards`: Handles study session state, card loading, and rating updates.
- **Interaction:** `flashcards` effects will dispatch a `revisao` update action after a card is rated to ensure the UI stays in sync without a full page reload.

## 5. UI Components & Patterns
- **Modals:** Reuse the `ModalLayoutComponent` from `shared/components` for consistency.
- **Tables:** Implement infinite scroll logic similar to `BancoDadosComponent` (Phase 10) for the lesson list and revision lists.
- **Icons:** Use the existing project icon library (standardized in Phase 8).

## 6. Validation Architecture
- **Manual Verification:** Test flip animations on multiple devices (Responsive Check).
- **UAT:** Validate that `Ctrl+V` works across different browsers (Chrome/Firefox/Edge) and correctly persists the Base64 image.
- **Performance:** Monitor UI responsiveness when large Base64 images are loaded into the flashcard study mode.
