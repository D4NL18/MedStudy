# PLAN: Phase 08 — Frontend Core: Angular Setup, NgRx, Auth Module

## 🎯 Goal
Configurar o alicerce do frontend Angular 18, implementando o sistema de 8 temas dinâmicos, o gerenciamento de estado global com NgRx (híbrido com Signals), suporte a PWA e o fluxo de autenticação (Login + JWT Interceptor).

## 🛠️ Tech Stack Notes
- **Angular 18** (Standalone Components, Signals).
- **NgRx Store/Effects** para Auth e Themes.
- **SCSS + CSS Custom Properties** para os 8 temas.
- **Vanilla CSS** para o design premium (Glassmorphism).

---

## 🌊 Wave 1: Infraestrutura & Dependências
- **Task 1.1:** Instalar dependências NgRx e PWA.
  - `ng add @ngrx/store@latest`
  - `ng add @ngrx/effects@latest`
  - `ng add @ngrx/store-devtools@latest`
  - `ng add @angular/pwa@latest`
- **Task 1.2:** Configurar `proxy.conf.json` para rotear `/api` para `localhost:8080`.
- **Task 1.3:** Setup inicial do `AppConfig` com provedores de Store e Effects.

## 🌊 Wave 2: Design System (8 Temas)
- **Task 2.1:** Criar `src/styles/themes.scss`.
  - Definir mapa de cores para: Rosa (padrão), Claro, Escuro, Verde, Azul, Vermelho, Roxo, Laranja.
  - Mapear para CSS Variables: `--color-primary`, `--color-bg`, `--color-surface`, `--color-text`, etc.
- **Task 2.2:** Criar `ThemeService` (Signal-based) para gerenciar o atributo `data-theme` no `document.documentElement`.
- **Task 2.3:** Integrar `ThemeService` com o NgRx para persistência no `localStorage`.

## 🌊 Wave 3: State Management (Auth)
- **Task 3.1:** Implementar Auth State (Actions, Reducer, Selectors).
- **Task 3.2:** Criar `AuthService` para chamadas HTTP ao backend (`/api/auth/login`, `/api/auth/refresh`).
- **Task 3.3:** Implementar `AuthEffects` para lidar com login, persistência de token e logout.
- **Task 3.4:** Criar `JwtInterceptor` (funcional) para injetar o token Bearer e lidar com erros 401.

## 🌊 Wave 4: Auth UI & UX
- **Task 4.1:** Criar `LoginComponent` (Standalone).
  - Implementar **Glassmorphism** e **Mesh Gradients**.
  - Usar formulário reativo com validações visuais.
- **Task 4.2:** Configurar rotas e `AuthGuard`.
- **Task 4.3:** Setup básico do `AppShell` (Navbar simplificada para teste de troca de tema).

---

## 🏁 Verification Plan
- **V1:** Verificar se o `data-theme` muda no HTML ao alternar temas.
- **V2:** Realizar Login e confirmar se o token é armazenado e enviado nas requisições.
- **V3:** Validar se o PWA gera o `manifest.webmanifest`.
- **V4:** Testar refresh token automático (opcional, dependendo do tempo de expiração).
