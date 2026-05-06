# Phase 1: Monorepo Setup & Infraestrutura Base - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning
**Source:** User discussion

<domain>
## Phase Boundary

Criar a estrutura do monorepo, inicializar o projeto Angular e Spring Boot, e colocar o PostgreSQL no ar via Docker.

</domain>

<decisions>
## Implementation Decisions

### Ferramentas de Build
- Backend: Maven com wrapper (`./mvnw`)
- Frontend: npm
- Node.js fixado via `.nvmrc` (LTS 22) no diretório `frontend/`
- Java 21 forçado via Maven Enforcer plugin no backend

### Configuração de Ambiente
- `application.yml` + variáveis de ambiente do OS
- Arquivo `.env` local no `.gitignore` com um `.env.example` commitado
- Profiles do Spring Boot: `dev` (desenvolvimento local) e `test` (testes isolados)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in PROJECT.md and REQUIREMENTS.md.

</canonical_refs>

<specifics>
## Specific Ideas

- None

</specifics>

<deferred>
## Deferred Ideas

- None

</deferred>

---

*Phase: 01-monorepo-setup-e-infraestrutura-base*
*Context gathered: 2026-05-05*
