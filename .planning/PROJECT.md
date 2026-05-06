# MedStudy — Plataforma de Estudos Médicos

## What This Is

MedStudy é uma plataforma web full-stack para médicos e estudantes de medicina prestando residência no Brasil. Permite registrar sessões de estudo, resolver e acompanhar questões, gerar simulados, fazer revisão espaçada e usar flashcards — tudo com análises detalhadas de desempenho por área e por tema.

Reescrita a partir do protótipo `estudos-lari` (React + Supabase sem autenticação) para um Monorepo profissional com **Angular 18** (frontend), **Java Spring Boot 3** (backend) e **PostgreSQL** (banco local), priorizando segurança da informação, qualidade de código e testes exaustivos.

## Core Value

O estudante deve conseguir registrar seu desempenho em questões, acompanhar revisões pendentes e ver sua evolução — com dados seguros, rápidos e confiáveis.

## Requirements

### Validated

<!-- Nenhuma ainda — sistema novo. Legado tem funcionalidades confirmadas como úteis. -->

- ✓ Dashboard com KPIs de acertos e evolução mensal — validado no legado
- ✓ Banco de sessões de estudo (CRUD + filtros + ordenação) — validado no legado
- ✓ Simulados por área médica (CM, Cir, Ped, GO, Prev) — validado no legado
- ✓ Plano de Aulas com prioridades — validado no legado
- ✓ Revisão Intervalada baseada em % de acertos — validado no legado
- ✓ Flashcards com agendamento por dificuldade — validado no legado
- ✓ Análise por Grande Área e por Tema — validado no legado

### Active

<!-- Escopo do novo sistema — greenfield rewrite com stack profissional. -->

- [ ] Autenticação segura (login + recuperação de senha + JWT com refresh tokens)
- [ ] Monorepo Angular + Spring Boot + PostgreSQL local
- [ ] Backend em camadas: Controller → Service → Repository com DTOs e MapStruct
- [ ] Spring Security com proteção OWASP Top 10
- [ ] NgRx para gerenciamento de estado global no frontend
- [ ] Guards e Interceptors no Angular (autenticação + tokens)
- [ ] Sistema de temas de cores (8 temas: Rosa, Claro, Escuro, Verde, Azul, Vermelho, Roxo, Laranja) via CSS Custom Properties com persistência em localStorage
- [ ] Testes unitários exaustivos: JUnit/Mockito (backend) + Jasmine/Karma (frontend)
- [ ] Documentação automática com Swagger/OpenAPI
- [ ] Exceções customizadas com @ControllerAdvice

### Out of Scope

- Aplicativo mobile — web-first; mobile é v2+
- Compartilhamento social ou comunidade — não é core value
- Upload de PDFs ou mídias de questões — risco de segurança, complexidade v2
- Multi-tenancy (múltiplos usuários simultâneos com isolamento) — usuário único por instância na v1
- Integração com APIs de provas externas (CFM, REVALIDA) — v2+
- Deploy em produção/cloud — foco em execução local robusta na v1

## Context

**Legado analisado (`estudos-lari`):**
- React 19 + Create React App + Supabase (BaaS)
- Sem autenticação — RLS aberto (`USING (true)`)
- Sem backend próprio — lógica de negócio toda no frontend
- Sem testes
- Paleta de cores: tons de rosa/vinho (`#430428`, `#6F0642`, `#F553B0`, `#FBBCE0`)

**Regras de negócio extraídas:**
- 5 grandes áreas: Clínica Médica, Cirurgia, Pediatria, Ginecologia/Obstetrícia, Preventiva
- Streak (ofensiva): conta dias consecutivos com sessão de estudo (hoje ou ontem como âncora)
- Revisão intervalada: baseada em `data_proxima_revisao` (calculada pelo front no legado)
- Flashcard: frente e verso são `JSONB`, agendamento por dificuldade (`Fácil/Médio/Difícil`)
- Prioridade de aulas: Diamante → Alta → Média → Baixa
- Desempenho por cor: < 70% = vermelho, 70–80% = amarelo, > 80% = verde

**Stack alvo:**
- Frontend: Angular 18 (Standalone Components, Signals, NgRx, RxJS)
- Backend: Java 21, Spring Boot 3.x, Spring Security, JPA/Hibernate, MapStruct
- Banco: PostgreSQL 16 (local, Docker ou instalação direta)
- Docs: Swagger/OpenAPI 3
- Testes: JUnit 5, Mockito, Jasmine, Karma

## Constraints

- **Tech Stack**: Angular + Spring Boot + PostgreSQL — sem desvios; stack definido em spec
- **Segurança**: OWASP Top 10 obrigatório; nenhum dado sensível em respostas de erro
- **Qualidade**: SonarQube-ready; SOLID, Clean Code, sem God Classes
- **Compatibilidade**: Preservar exatamente as regras de negócio e UI/UX do legado
- **Banco**: PostgreSQL local — sem Supabase ou BaaS na nova versão
- **Idioma**: Interface em pt-BR; código em inglês (entidades, métodos, variáveis)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo (frontend/ + backend/) | Facilita desenvolvimento local e CI unificado | — Pending |
| Java 21 + Spring Boot 3 | LTS atual, virtual threads disponíveis, ecossistema maduro | — Pending |
| Angular 18 Standalone + Signals | Moderno, evita NgModules legados, reactivity simplificada | — Pending |
| NgRx para estado global | State centralizado, testável, padrão Redux | — Pending |
| JWT com refresh token rotation | Segurança sem sacrificar UX (sessão persistente) | — Pending |
| MapStruct para Entity→DTO | Compile-time, zero reflection, performático | — Pending |
| PostgreSQL local via Docker | Reprodutível, sem dependência de BaaS externo | — Pending |
| Paleta de cores preservada (Rosa como padrão) | Manter identidade visual do legado (#430428, #F553B0) | — Pending |
| Sistema multi-tema via CSS Custom Properties | Zero hardcode de cores; troca instantânea + persistência | — Pending |

## Evolution

Este documento evolui a cada transição de fase e milestone.

**Após cada fase (via `/gsd-transition`):**
1. Requirements invalidados? → Mover para Out of Scope com motivo
2. Requirements validados? → Mover para Validated com referência de fase
3. Novos requirements? → Adicionar em Active
4. Decisões a registrar? → Adicionar em Key Decisions
5. "What This Is" ainda preciso? → Atualizar se houver drift

**Após cada milestone (via `/gsd-complete-milestone`):**
1. Revisão completa de todas as seções
2. Core Value check — ainda é a prioridade correta?
3. Auditar Out of Scope — razões ainda válidas?
4. Atualizar Context com estado atual

---
*Last updated: 2026-05-05 — added multi-theme color system requirement (THEM-01..13)*
