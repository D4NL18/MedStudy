# STATE.md — MedStudy Project Memory

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-07)

**Core value:** O estudante registra desempenho em questões, acompanha revisões e vê sua evolução — com dados seguros, rápidos e confiáveis.
**Current focus:** Phase 14 — Security Hardening & OWASP Audit

- **Current Phase:** Phase 15: Final Testing & Deployment
- **Status:** Phase 14 Shipped (Branch feat/14-security-hardening-owasp-audit)
- **Next Steps:** Start Phase 15.



---

## Current Status

**Phase:** 14 of 15 — Shipped (Branch feat/14-security-hardening-owasp-audit)
**Milestone:** v1.0 — Reescrita Angular + Spring Boot + PostgreSQL
**Mode:** Interactive (confirm at each step)
**Granularity:** Fine (15 phases)

---

## What's Been Done

- [x] Git initialized in `MedStudy/`
- [x] `.planning/config.json` created
- [x] `.planning/PROJECT.md` created (synthesized from legacy codebase analysis)
- [x] `.planning/REQUIREMENTS.md` created (72 v1 requirements, fully mapped)
- [x] `.planning/ROADMAP.md` created (15 phases, security checklist, architecture overview)
- [x] `.planning/STATE.md` created
- [x] Phase 1 completed, verified, and pushed to GitHub.
- [x] Phase 2: Database Schema & Backend Skeleton implemented (Flyway, JPA, DTOs, Mappers).
- [x] Phase 3: Auth Backend (Spring Security + JWT) implemented and pushed to GitHub.
- [x] Phase 4: Backend Study Sessions (CRUD, Filters, Metrics, Tests) implemented and verified.
- [x] Phase 5: Backend Simulados & Plano de Aula Complete [v] Verified
- [x] Phase 6: Dashboards & Analytics Implemented [v] Verified
- [x] Phase 7: Revisão & Flashcards Implemented and Shipped.
- [x] Phase 8: Frontend Core: Angular Setup, NgRx, Auth Module [v] Verified
- [x] Phase 9: Frontend: Dashboard & Análises [v] Verified & Shipped
- [x] Phase 10: Frontend: Banco de Dados & Simulados [v] Verified & Shipped
- [x] Phase 11: Frontend: Plano de Aulas, Revisão & Flashcards [v] Verified & Shipped
- [x] Phase 14: Security Hardening & OWASP Audit [v] Verified & Shipped

---

## Legacy Codebase Summary

**Repository:** `C:\Users\PC\Documents\GitHub\estudos-lari`
**Stack:** React 19 + Create React App + Supabase (no auth, open RLS)
**Modules:** Dashboard, BancoDados, Simulados, PlanoAulas, AnaliseArea, AnaliseTema, Revisão, Flashcards
**Key schemas extracted:**
  - `sessoes_estudo`: grande_area, tema, data_sessao, qts_feitas, qts_corretas, instituicao, data_proxima_revisao, revisao_concluida
  - `plano_aulas`: grande_area, tema, prioridade (Diamante/Alta/Média/Baixa), aula_assistida
  - `simulados`: nome, data_realizacao + per-area (cm/cir/ped/go/prev)_total/acertos/erros
  - `flashcards`: grande_area, frente (JSONB), verso (JSONB), proxima_revisao, dificuldade_ultima
**Business rules:**
  - 5 áreas: Clínica Médica, Cirurgia, Pediatria, Ginecologia/Obstetrícia, Preventiva
  - Streak: dias consecutivos com sessão (hoje ou ontem como âncora)
  - Desempenho: <70% vermelho, 70–80% amarelo, >80% verde
  - Flashcard scheduling: Fácil +7d, Médio +3d, Difícil +1d
  - Revisão intervalada: categoriza por data_proxima_revisao vs hoje
  - Paleta: #430428, #6F0642, #F553B0, #FBBCE0, #18010E

---

Run `/gsd-plan-phase 15` to prepare for the final delivery.

| Phase 11: Frontend Core       | [x] | Plano de Aulas, Revisão, Flashcards |
| Phase 12: Backend Tests       | [/] | Plano pronto, pronto para execução |



---

## Open Questions / Decisions Pending

- [x] Qual porta usar para o backend Spring Boot? (8080)
- [x] Qual porta usar para o Angular dev server? (4200)
- [x] Biblioteca de gráficos para o Angular: `ngx-charts` selecionado na Fase 9.
- [ ] E-mail para recuperação de senha: usar JavaMailSender com SMTP local (Mailhog) ou mockar para v1?
- [x] Nome do package Java: `com.medstudy` — confirmado

---
*STATE.md updated: 2026-05-07 after Phase 9 Shipped*
