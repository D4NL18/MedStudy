---
phase: 08-frontend-core-ngrx-auth
status: active
updated: 2026-05-07T15:32:30Z
---

# Phase 08: Frontend Core: Angular Setup, NgRx, Auth Module

## Domain Boundary
Configuração da infraestrutura base do frontend Angular 18, incluindo sistema de temas dinâmicos (SCSS + CSS Variables), arquitetura de estado híbrida (NgRx + Signals), suporte a PWA e fluxo de autenticação seguro.

## Decisions
- **Style System:** Vanilla SCSS + CSS Custom Properties para os 8 temas. Sem TailwindCSS.
- **State Management:** NgRx para estados globais (Auth, Theme) e Signals para estados locais/componentes.
- **Theming:** 8 temas implementados via data-attributes no `body`. Transição de 300ms entre trocas.
- **Auth:** Login direto com suporte a Auto-Refresh Token via HTTP Interceptor.
- **PWA:** Ativação imediata para ícone na home e cache de assets.
- **UI/UX Design:** Estilo Premium "State of the Art":
    - Glassmorphism no card de login.
    - Mesh gradients animados no background.
    - Tipografia moderna (Google Fonts: Outfit/Inter).
    - Micro-animações em todos os botões e inputs.

## Canonical Refs
- [PROJECT.md](../../PROJECT.md)
- [REQUIREMENTS.md](../../REQUIREMENTS.md)
- [ROADMAP.md](../../ROADMAP.md)

## Code Context
- Backend API base: `http://localhost:8080/api`
- Frontend Dev Server: `http://localhost:4200`
- Estrutura de pastas: `frontend/src/app/{core,shared,features/auth}`
