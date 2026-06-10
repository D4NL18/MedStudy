# Requirements: MedStudy v1.3

**Milestone:** v1.3
**Goal:** Polimento de Código, Performance e UX. Eliminar dívidas técnicas, otimizar resposta do sistema, cobrir edge cases com testes, refatorar frontend para máxima fluidez e documentar toda a lógica complexa.

---

## v1.3 Requirements

### Backend Code Quality & Optimization (BKND)
- [ ] **BKND-01**: Eliminação completa de Dead Code (variáveis, imports, métodos e classes nunca instanciados).
- [ ] **BKND-02**: Otimização de consultas ao banco, evitando N+1 (garantir `FetchType.LAZY`) e tuning no mapeamento (MapStruct).

### Frontend Architecture & UX (UIUX)
- [ ] **UIUX-01**: Refatoração do frontend isolando componentes reutilizáveis e deletando componentes órfãos.
- [ ] **UIUX-02**: Adoção estrita de `ChangeDetectionStrategy.OnPush` e Skeleton Loaders em telas de carregamento para aumentar a fluidez e FPS percebido.

### Security & Hardening (SEC)
- [ ] **SEC-01**: Varredura avançada e correção de vulnerabilidades (XSS, CSRF fine-tuning, rate limiting) utilizando ferramentas de análise estática.

### Test Coverage (TEST)
- [ ] **TEST-01**: Testes unitários para Edge Cases no Backend (status 400, 403, 404, 429).
- [ ] **TEST-02**: Testes de UI e Services complexos (ex: repetição espaçada) no Frontend.

### Documentation & Maintainability (DOC)
- [ ] **DOC-01**: Remover comentários de código desnecessários, gerados por prototipação legada.
- [ ] **DOC-02**: Escrever documentação clara (Javadoc / TSDoc) e comentários explicativos para futuras manutenções, destrinchando regras de negócio complexas.

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BKND-01..02 | Phase 29 | Pending |
| UIUX-01     | Phase 30 | Pending |
| SEC-01      | Phase 31 | Pending |
| TEST-01..02 | Phase 32 | Pending |
| UIUX-02     | Phase 33 | Pending |
| DOC-01..02  | Phase 34 | Pending |
