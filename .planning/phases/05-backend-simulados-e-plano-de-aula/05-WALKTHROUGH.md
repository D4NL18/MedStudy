# Walkthrough — Phase 5: Backend Simulados & Plano de Aula

## O que foi implementado

### 1. Módulo de Simulados
- **Lógica de Cálculo Automático**: O `SimuladoService` agora completa automaticamente o terceiro campo de cada área médica se dois forem fornecidos (ex: se o usuário informar o total de questões e os acertos, o sistema calcula os erros).
- **Validação**: Impedimos a criação de registros onde a soma de acertos e erros seja inconsistente com o total.
- **Segurança**: Todos os registros são filtrados automaticamente pelo usuário autenticado via `SecurityContextHolder`.

### 2. Módulo de Plano de Aula
- **Enum de Prioridades**: Implementamos `LessonPriority` para padronizar os níveis de importância das aulas.
- **Filtros Dinâmicos**: O endpoint de listagem agora suporta filtros por `grandeArea`, `prioridade`, `aulaAssistida` e busca textual por `tema`.
- **Toggle Assistida**: Novo endpoint `PATCH /api/lessons/{id}/toggle-assistida` para alternar o status da aula de forma rápida.

## Verificação Realizada

### Testes Automatizados
Executamos os testes unitários dos serviços:
- `SimuladoServiceTest`: Validou o cálculo automático de 2-de-3 e as validações de erro.
- `LessonServiceTest`: Validou o isolamento de usuários e a lógica de toggle.

```bash
[INFO] Results:
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Verificação Manual (Swagger)
- Validado o cálculo de áreas médicas no `POST /api/simulados`.
- Validado o filtro de `DIAMANTE` no `GET /api/lessons`.
