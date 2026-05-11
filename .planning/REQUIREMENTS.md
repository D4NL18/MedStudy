# Requirements: MedStudy v1.1 — Legacy Convergence & Advanced Features

**Milestone:** v1.1
**Goal:** Sincronizar as regras de negócio com o sistema legado e expandir funcionalidades com exportação, gamificação e notificações.

---

## v1.1 Requirements

### Analytics & Performance (Legacy Gaps)
- [ ] **ANLY-01**: Implementar cálculo de tendência de 30 dias (Acerto Recente vs Antigo).
- [ ] **ANLY-02**: Ajustar breakpoints de cores de desempenho para: <70% (Vermelho), 70-85% (Amarelo), >85% (Verde).
- [ ] **ANLY-03**: Adicionar suporte a Subáreas (drill-down) nas análises de Grande Área.
- [ ] **ANLY-04**: Ranking de Erros: Listar top 10 temas com maior taxa de erro (mínimo 3 questões).

### Business Logic & Sync
- [ ] **SYNC-01**: Implementar Normalização de Temas (remover acentos, preposições, trim) ao salvar sessões.
- [ ] **SYNC-02**: Atualizar Spaced Repetition (Banco) para seguir regras de acerto: 3, 5, 10 ou 20 dias.
- [ ] **SYNC-03**: Flashcards: Atualizar intervalo "Médio" para 4 dias (padrão legado).
- [ ] **SYNC-04**: Implementar funcionalidade de "Reset de Progresso" para decks de Flashcards.

### Plano de Aulas (Inteligência)
- [ ] **PLAN-07**: Exibir aviso de "Necessidade de Reforço" em temas com média de acerto < 75%.
- [ ] **PLAN-08**: Exibir alerta de "Teoria Ineficiente" em temas assistidos com > 40% de erro.
- [ ] **PLAN-09**: Preencher automaticamente a data de conclusão ao marcar aula como assistida.

### Advanced Features (New)
- [ ] **EXPO-01**: Exportar relatório de desempenho mensal em PDF com gráficos e resumo por área.
- [ ] **EXPO-02**: Exportar histórico de sessões de estudo para CSV.
- [ ] **GAMI-01**: Implementar sistema de Badges básicas (Streak 7 dias, 1000 questões, 10 simulados).
- [ ] **NOTF-01**: Implementar notificações in-app (Badge na navbar) para revisões atrasadas.
- [ ] **PWA-01**: Configurar Angular Service Worker para suporte a PWA (Installable + Offline Assets).

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ANLY-01..04 | Phase 16 | Pending |
| SYNC-01..04 | Phase 17 | Pending |
| PLAN-07..09 | Phase 18 | Pending |
| EXPO-01..02 | Phase 18 | Pending |
| GAMI-01     | Phase 19 | Pending |
| NOTF-01     | Phase 19 | Pending |
| PWA-01      | Phase 20 | Pending |
