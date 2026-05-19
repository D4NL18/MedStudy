# MedStudy — Plataforma de Estudos Médicos

## What This Is

MedStudy é uma plataforma web full-stack para médicos e estudantes de medicina prestando residência no Brasil. Permite registrar sessões de estudo, resolver e acompanhar questões, gerar simulados, fazer revisão espaçada e usar flashcards — tudo com análises detalhadas de desempenho por área e por tema.

Reescrita a partir do protótipo `estudos-lari` (React + Supabase sem autenticação) para um Monorepo profissional com **Angular 18** (frontend), **Java Spring Boot 3** (backend) e **PostgreSQL** (banco local), priorizando segurança da informação, qualidade de código e testes exaustivos.

## Core Value

O estudante deve conseguir registrar seu desempenho em questões, acompanhar revisões pendentes e ver sua evolução — com dados seguros, rápidos e confiáveis.

## Requirements

## Current Milestone: v1.2 Socialização Aprofundada

**Goal:** Introduzir recursos de socialização avançados como perfis configuráveis, conexões de amizade, competições de volume de questões em grupo (Gymrats style), duelos 1v1, feed de conquistas automatizado e controle absoluto de privacidade.

**Target features:**
- Perfis de usuário com dados básicos (faculdade, semestre, avatar).
- Sistema de amigos (solicitar, aceitar, bloquear, listar).
- Grupos de competição automáticos e painéis de liderança baseados no banco de dados.
- Feed reativo de conquistas com reações silenciosas (aplausos e aplausos motivacionais).
- Controle robusto e granular de privacidade.

### Active (v1.1 Planning)
 
- ✓ Autenticação segura (login + recuperação de senha + JWT com refresh tokens) — v1.0
- ✓ Monorepo Angular + Spring Boot + PostgreSQL local — v1.0
- ✓ Backend em camadas: Controller → Service → Repository com DTOs e MapStruct — v1.0
- ✓ Spring Security com proteção OWASP Top 10 — v1.0 (Phase 14)
- ✓ NgRx para gerenciamento de estado global no frontend — v1.0
- ✓ Sistema de temas dinâmico (8 temas) com persistência em localStorage — v1.0
- ✓ Testes unitários exaustivos (≥ 80% coverage) em backend e frontend — v1.0
- ✓ Documentação automática com Swagger/OpenAPI — v1.0
- ✓ Dashboard com KPIs de acertos e evolução mensal — v1.0
- ✓ Banco de sessões de estudo (CRUD + filtros + ordenação) — v1.0
- ✓ Simulados por área médica com templates por instituição — v1.0
- ✓ Plano de Aulas com prioridades e gestão de aulas assistidas — v1.0
- ✓ Revisão Intervalada e Flashcards com algoritmo de dificuldade — v1.0
- ✓ Análise detalhada por Grande Área e por Tema — v1.0
- ✓ Segurança: HttpOnly Cookies, CSRF Double Submit, Mascara de Logs — v1.0 (Phase 14)
- ✓ Documentação Final: README Visual, Walkthrough, Security Policy — v1.0 (Phase 15)

### Validated (v1.1)
- ✓ Exportação de relatórios de desempenho em PDF/CSV
- ✓ Sistema de notificações in-app para revisões críticas
- ✓ Gamificação básica (badges por streak e volume de questões)
- ✓ Integração de PWA (Progressive Web App) para uso mobile e offline
- ✓ Melhoria na performance de carregamento inicial (Lazy Loading de features)
- ✓ Sincronização de regras de Spaced Repetition (% de acerto)
- ✓ Alertas de "Reforço" e "Teoria Ineficiente" no Plano de Aulas
- ✓ Cálculo de Tendência de 30 dias e Drill-down por Subárea

### Active (v2.0 Planning)
- [ ] Implementação de Testes E2E com Cypress (Frontend)
- [ ] Autenticação Social (Google, Apple)
- [ ] Módulo comunitário/social (simples)
- [ ] Dashboards para uso em tablets e iPad

### Out of Scope

- Aplicativo mobile — web-first; mobile é v2+
- Compartilhamento social ou comunidade — não é core value
- Upload de PDFs ou mídias de questões — risco de segurança, complexidade v2
- Multi-tenancy (múltiplos usuários simultâneos com isolamento) — usuário único por instância na v1
- Integração com APIs de provas externas (CFM, REVALIDA) — v2+
- Deploy em produção/cloud — foco em execução local robusta na v1

## Context

**Shipped v1.1:**
- O projeto foi estendido com exportação de dados via bibliotecas híbridas HTML-to-PDF (FlyingSaucer + Thymeleaf).
- O Frontend Angular foi configurado como um PWA, suportando instalação e exibindo banners de erro offline graças ao `ApiUrlInterceptor`.
- Implementados sistemas engajadores como Gamificação e Notificações (badges e dropdowns reativos baseados em Signals/NgRx).
- Cobertura de testes mantida em backend e frontend ao longo da expansão, e scores de Performance/Acessibilidade elevados a 100 no Lighthouse.

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
| Monorepo (frontend/ + backend/) | Facilita desenvolvimento local e CI unificado | ✓ Good |
| Java 21 + Spring Boot 3 | LTS atual, virtual threads disponíveis, ecossistema maduro | ✓ Good |
| Angular 18 Standalone + Signals | Moderno, evita NgModules legados, reactivity simplificada | ✓ Good |
| NgRx para estado global | State centralizado, testável, padrão Redux | ✓ Good |
| JWT com refresh token rotation | Segurança sem sacrificar UX (sessão persistente) | ✓ Good |
| HttpOnly Cookies para Auth | Previne roubo de tokens via XSS (mitigação LocalStorage) | ✓ Good (Ph 14) |
| MapStruct para Entity→DTO | Compile-time, zero reflection, performático | ✓ Good (Ph 2) |
| PostgreSQL local via Docker | Reprodutível, sem dependência de BaaS externo | ✓ Good (Ph 1) |
| Sistema multi-tema via CSS | Zero hardcode de cores; troca instantânea + persistência | ✓ Good (Ph 8) |
| JPA Specifications para Filtros Dinâmicos | Permite buscas complexas sem SQL nativo ou JPQL estático | ✓ Shipped (Ph 4) |

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
---
*Last updated: 2026-05-18 after v1.1 milestone completion.*
