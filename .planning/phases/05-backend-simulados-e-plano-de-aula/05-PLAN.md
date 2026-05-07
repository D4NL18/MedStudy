# Plan: Phase 5 — Backend: Simulados & Plano de Aula

## Goal
Implementar o CRUD completo para Simulados (com lógica de cálculo por área) e Plano de Aula (com prioridades e filtros), garantindo isolamento por usuário e validação robusta.

## Proposed Changes

### 1. Module: Simulado
Implementar a lógica de desempenho por área e cálculo automático.

#### [MODIFY] [Simulado.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/simulado/entity/Simulado.java)
- Garantir que estenda `BaseEntity`.
- Verificar anotações JPA.

#### [NEW] [SimuladoSpecifications.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/simulado/specification/SimuladoSpecifications.java)
- Filtro por `userId`.
- Filtro por `nome` (ILIKE).

#### [MODIFY] [SimuladoService.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/simulado/service/SimuladoService.java)
- Lógica de cálculo "2 de 3" para cada uma das 5 áreas no `create` e `update`.
- Validação server-side: `acertos + erros <= total`.
- Enforce `userId` do contexto de segurança.

#### [NEW] [SimuladoController.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/simulado/controller/SimuladoController.java)
- Endpoints REST: `POST`, `GET` (paginado), `GET /{id}`, `PUT`, `DELETE`.

### 2. Module: Aula (Lesson)
Implementar gerenciamento de aulas e prioridades.

#### [NEW] [LessonPriority.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/aula/entity/LessonPriority.java)
- Enum: `DIAMANTE`, `ALTA`, `MEDIA`, `BAIXA`.

#### [MODIFY] [Lesson.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/aula/entity/Lesson.java)
- Mudar tipo de `prioridade` para `LessonPriority` (ou String com validação).

#### [NEW] [LessonSpecifications.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/aula/specification/LessonSpecifications.java)
- Filtro por `userId`.
- Filtro por `grandeArea`, `prioridade`, `aulaAssistida`.
- Busca por `tema` (ILIKE).

#### [MODIFY] [LessonService.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/aula/service/LessonService.java)
- CRUD com isolamento por usuário.
- Método `toggleAssistida(UUID id)`.

#### [NEW] [LessonController.java](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/src/main/java/com/medstudy/backend/modules/aula/controller/LessonController.java)
- Endpoints REST.

## Verification Plan

### Automated Tests
- `SimuladoServiceTest`: Validar lógica de cálculo 2-de-3 e erro de validação (acertos > total).
- `LessonServiceTest`: Validar filtros de área e status.

### Manual Verification
- **Swagger UI**:
  - Criar simulado enviando apenas `total` e `acertos` -> verificar se `erros` foi calculado.
  - Criar aula com prioridade `DIAMANTE`.
  - Listar simulados e aulas de outro usuário (deve retornar vazio ou erro).
