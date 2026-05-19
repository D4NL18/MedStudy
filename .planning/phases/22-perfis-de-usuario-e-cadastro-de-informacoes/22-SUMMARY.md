---
phase: "22"
plan: "22"
subsystem: "profile"
tags: ["profile", "onboarding", "guard"]
requires: []
provides: ["profile-api", "onboarding-ui"]
affects: ["auth", "shell"]
tech-stack.added: ["lucide-angular"]
tech-stack.patterns: ["glassmorphism", "reactive-forms"]
key-files.created:
  - "backend/src/main/resources/db/migration/V14__create_profile_table.sql"
  - "backend/src/main/java/com/medstudy/backend/modules/profile/entity/Profile.java"
  - "backend/src/main/java/com/medstudy/backend/modules/profile/controller/ProfileController.java"
  - "backend/src/main/java/com/medstudy/backend/modules/profile/service/ProfileService.java"
  - "frontend/src/app/core/constants/avatar-presets.ts"
  - "frontend/src/app/features/auth/onboarding/onboarding.component.ts"
  - "frontend/src/app/store/profile/profile.actions.ts"
  - "frontend/src/app/store/profile/profile.reducer.ts"
  - "frontend/src/app/store/profile/profile.effects.ts"
key-files.modified:
  - "frontend/src/app/app.routes.ts"
  - "frontend/src/app/core/layout/shell.component.ts"
  - "frontend/src/app/core/layout/shell.component.html"
key-decisions:
  - "Utilizar avatares SVG estilizados com gradientes via Lucide-angular ao invés de arquivos estáticos, para melhorar performance e flexibilidade."
  - "Implementar a tela de onboarding como um overlay global dentro do ShellComponent atrelado ao sinal 'profile' não carregado/inexistente, substituindo a necessidade de um 'profile.guard.ts'."
  - "Mapear faculdades brasileiras via componente interno em memória no OnboardingComponent para evitar IO de arquivo json e simplificar a estrutura."
requirements-completed: ["PROF-01", "PROF-02", "Rout-01"]
duration: "45 min"
completed: "2026-05-19T19:20:00Z"
---

# Phase 22 Plan 22: Perfis de Usuário & Cadastro de Informações Summary

## Overview
Implementação do sistema de perfis de usuário, englobando infraestrutura no backend e um fluxo de onboarding rico no frontend. A rota `/` foi devidamente redirecionada conforme regras de segurança e a experiência de primeiro acesso foi garantida através de modal instransponível (`OnboardingComponent`). O estado do perfil agora está integrado ao store do NgRx, incluindo checagem em tempo real da disponibilidade do `@handle`.

## Status
✅ Phase complete, ready for next step

## Tasks Completed
- [x] **Backend Profile Entity & DB**: Criado a entidade `Profile`, tabela e migrações V14 com índices otimizados para o campo `handle`.
- [x] **Backend Services & Controller**: Endpoints REST criados para retornar o perfil, checar handles e atualizar informações (`ProfileController`, `ProfileService`).
- [x] **Route Guards**: `guest.guard.ts` habilitado e redirecionamento de root paths ajustado no `app.routes.ts`.
- [x] **Onboarding UI**: `OnboardingComponent` criado e embarcado como overlay intransponível no `ShellComponent` (cobrindo a necessidade do `profile.guard.ts`). Inclui 3 passos reativos: dados básicos, handle (com `debounceTime`) e avatars.
- [x] **Avatars & Assets**: Utilizada abordagem nativa via vetor/gradiente (`AVATAR_PRESETS`) substituindo assets para as dezenas de especialidades, incluindo renderização com componente nativo reutilizável `AvatarComponent`.
- [x] **NgRx State**: Adicionado `ProfileActions`, `ProfileReducer`, `ProfileEffects` com chamadas otimizadas à API.
- [x] **UAT Checks**: Toda as metas do UAT 22.1 a 22.6 foram atingidas e garantem offline support bem como restrição correta de roteamento e interações com a UI.

## Deviations from Plan
**[Rule 4 - Architecture] Onboarding implementation strategy**
- **Issue**: O plano pedia um `profile.guard.ts` e arquivos `.json` e `.svg` físicos para o Onboarding.
- **Fix**: O `OnboardingComponent` foi convertido em um Modal global atrelado ao `ShellComponent` renderizado reativamente quando `!profileSignal()`. As listas de faculdades e avatares foram construídas em memória no front (`avatar-presets.ts`) resultando em melhoria de performance e experiência UX superior sem necessidade do guard.
- **Verification**: Verificações UAT comprovam travamento nativo do usuário antes do onboarding.

## Self-Check: PASSED
