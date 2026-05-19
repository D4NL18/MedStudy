# Phase 22: Perfis de Usuário & Cadastro de Informações - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Entrega a infraestrutura de dados de perfis de usuário associados um-para-um ao usuário da conta, cadastro de informações de perfil (nome completo, semestre, faculdade, avatar e `@handle` único) com validação dinâmica de unicidade, uma galeria rica com mais de 50 opções de presets de avatares médicos premium no frontend, uma página pública de visualização de perfil e um fluxo de onboarding obrigatório para novos acessos.

</domain>

<decisions>
## Implementation Decisions

### Cadastro & Validação de Handle
- **D-01:** Utilizar validação reativa do handle (`@username`) em tempo real ("On-the-fly") no frontend com RxJS debounce (300ms) e verificação de disponibilidade via chamada à API no backend (`GET /api/profiles/check-handle?handle=...`).
- **D-02:** O handle deve ser salvo como uma string única, indexada no banco de dados e obrigatória após o fluxo de onboarding.

### Avatares e Identidade Visual
- **D-03:** Em vez de uploads tradicionais que causam lentidão e trazem brechas de segurança, o app disponibilizará uma coleção de no mínimo 50 avatares SVGs premium estilizados com especialidades médicas (Pediatria, Cardiologia, Cirurgia, etc.).
- **D-04:** Esses avatares serão cacheados pelo Service Worker no frontend, garantindo suporte offline total e mantendo a estética visual harmoniosa do app.

### Faculdade e Semestre
- **D-05:** Preenchimento da instituição através de um input do tipo Autocomplete/Seleção filtrável alimentado por uma lista pré-definida das faculdades de medicina brasileiras reais. Isso garante consistência de dados para futuros rankings inter-universitários.

### Fluxo de Primeiro Acesso (Onboarding)
- **D-06:** Implementar um modal/fluxo passo-a-passo obrigatório de onboarding de primeiro acesso. Novos usuários não podem interagir com o Dashboard até completarem o preenchimento de seu `@handle`, avatar e faculdade/semestre.

### the agent's Discretion
- A escolha exata das 50+ ilustrações médicas em SVG e a lista padrão de instituições de ensino médico do Brasil ficam sob a discrição do assistente técnico para manter o padrão premium e facilidade de manutenção.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone Specs & Requirements
- `.planning/REQUIREMENTS.md` — Requisitos do Milestone v1.2 (PROF-01, PROF-02)
- `.planning/ROADMAP.md` — Entregas e escopo de fases da socialização

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **FormControls & Autocomplete**: Pode-se reusar seletores existentes ou componentes de input comuns do Angular Material 18 para a busca reativa e debounce de handles.
- **Service Worker / PWA caching**: O arquivo `ngsw-config.json` deve incluir o diretório de assets de avatares para cacheamento offline.

### Established Patterns
- **Spring Security & DTOs**: A entidade `Profile` deve ser persistida localmente no PostgreSQL vinculada ao `User` principal, respeitando o padrão existente de segurança e mapeamento de DTOs via MapStruct.

### Integration Points
- **Auth Flow**: O guard de rotas no Angular deve verificar se o usuário autenticado possui o perfil configurado. Caso contrário, redireciona/bloqueia até a conclusão do modal de onboarding.

</code_context>

<specifics>
## Specific Ideas
- Lista de especialidades para inspirar os 50 avatares: Pediatria, Cardiologia, Cirurgia Geral, Ginecologia e Obstetrícia, Preventiva, Infectologia, Neurocirurgia, Psiquiatria, Dermatologia, Ortopedia, Oftalmologia, Radiologia, etc.

</specifics>

<deferred>
## Deferred Ideas
- Mural de fotos realistas ou uploads em nuvem (Out of scope de v1.2 - mantido em Galeria SVG 100% offline).

</deferred>

---

*Phase: 22-Perfis de Usuário & Cadastro de Informações*
*Context gathered: 2026-05-18*
