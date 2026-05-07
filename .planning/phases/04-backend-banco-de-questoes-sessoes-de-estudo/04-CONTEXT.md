# Phase 4 Context — Backend: Banco de Questões (Sessões de Estudo)

## Domain Boundary
Esta fase foca na implementação da lógica de negócio e persistência para as sessões de estudo (Banco de Questões). O objetivo é fornecer uma API robusta para o frontend listar, filtrar e gerenciar o desempenho do estudante, além de fornecer os dados agregados para o Dashboard.

## Decisions

### 1. Dynamic Filtering
- **Implementation**: Utilizar **JPA Specifications** para permitir filtros dinâmicos e combinados.
- **Fields**: 
  - `grandeArea` (Enum/String match)
  - `tema` (ILIKE match)
  - `instituicao` (ILIKE match)
  - `revisaoConcluida` (Boolean)
  - `performanceRange` (Filtro customizado para buscar sessões por percentual de acerto).
- **Pagination**: Padrão de 50 itens por página.

### 2. Business Rules (StudySessionService)
- **Validation**: Bloquear salvamento se `qtsCorretas > qtsFeitas`.
- **Automated Logic**: O backend deve calcular a `dataProximaRevisao` automaticamente no momento do `save` (create/update), baseando-se no percentual de acertos da sessão.
- **Rule (Legacy Mapping)**:
  - % <= 65: +3 dias
  - 65 < % <= 75: +5 dias
  - 75 < % <= 85: +10 dias
  - % > 85: +20 dias

### 3. Metrics & Dashboard Data
- **KPIs consolidated**:
  - `taxaGlobal`: (Total Corretas / Total Feitas) * 100.
  - `feitasMes`: Soma de `qtsFeitas` no mês atual.
  - `feitasAno`: Soma de `qtsFeitas` no ano atual.
  - `areaForte/Fraca`: Áreas com maior e menor percentual de acerto (mínimo 1 sessão).
  - `streakDias`: Dias consecutivos com sessões registradas (contagem para se a última for anterior a ontem).
  - `revisoesCriticas`: Contagem de sessões onde `dataProximaRevisao < NOW` e `revisaoConcluida = false`.

## Code Context

### Reusable Patterns
- **BaseEntity**: Estender `BaseEntity` para auditoria automática (`createdAt`, `updatedAt`).
- **GlobalExceptionHandler**: Já configurado na Fase 2 para lidar com erros de validação e não encontrado.

### Integration Points
- **UserRepository**: Necessário para associar sessões ao usuário autenticado (via `SecurityContext`).
- **LessonRepository**: Necessário para o cálculo de `progressoCurso` (Aulas assistidas / Total).

## Canonical Refs
- `backend/src/main/java/com/medstudy/backend/modules/sessao/entity/StudySession.java` (Entidade base)
- `C:\Users\PC\Documents\GitHub\estudos-lari\src\utils\logicaEstudos.js` (Fonte da lógica de revisão)
- `C:\Users\PC\Documents\GitHub\estudos-lari\src\components\Dashboard.jsx` (Fonte das métricas de performance)

## Deferred Ideas
- **Exportação CSV/PDF**: Deixado para fase de melhorias pós-v1.
- **Gráficos Complexos (Radar/Heatmap)**: Deixado para fase de Analytics Avançado (Fase 16+).
