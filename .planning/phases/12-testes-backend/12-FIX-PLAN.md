# Phase 12: Gap Closure Plan - Backend Stabilization

Este plano detalha as ações necessárias para corrigir os gaps identificados durante a UAT da Fase 12.

## Gaps Identificados

1. **Falha no Cold Start**: Conexão recusada com o banco de dados (porta 5433).
2. **Cobertura JaCoCo insuficiente (77%)**: Abaixo da meta de 80%.
3. **Testes de Controller incompletos**: Faltam cenários de erro (400/404) e vários endpoints de CRUD.
4. **Falta de testes de Segurança**: Nenhum teste valida o retorno 401 Unauthorized em endpoints protegidos.

## Plano de Ação

### 1. Infraestrutura e Estabilidade (Gap 1)
- [ ] **1.1 Verificar Configuração do Banco**: Confirmar se o `application-dev.yml` ou as variáveis de ambiente estão apontando para a porta correta. 
- [ ] **1.2 Validar Ambiente de Teste**: Garantir que o banco de dados esteja rodando ou que os testes usem uma base volátil (H2/TestContainers) para evitar dependência de estado externo durante o Cold Start.

### 2. Aumento de Cobertura - Specifications (Gap 2)
- [ ] **2.1 Expandir StudySessionSpecificationsTest**: Adicionar testes que chamam `.toPredicate()` com valores válidos para exercitar a criação de predicados (`cb.equal`, `cb.like`, etc.).
- [ ] **2.2 Expandir LessonSpecificationsTest**: Mesma ação para as especificações de aulas.

### 3. Aumento de Cobertura - Controllers (Gap 2 & 3)
- [ ] **3.1 Completar SimuladoControllerTest**:
    - Adicionar testes para `update` e `delete`.
    - Adicionar teste para cenário de `404 Not Found`.
- [ ] **3.2 Completar FlashcardControllerTest**:
    - Adicionar testes para `findAll`, `findById` e `delete`.
    - Adicionar testes para validação de campos obrigatórios (400 Bad Request).
- [ ] **3.3 Adicionar testes para outros Controllers**: Garantir que `StudySessionController`, `LessonController` e `AnalyticsController` tenham cobertura mínima de sucesso e erro.

### 4. Testes de Segurança (Gap 4)
- [ ] **4.1 Implementar SecurityGateTests**: Criar uma classe de teste ou adicionar métodos nos testes existentes para disparar requisições **sem** `@WithMockUser` em endpoints protegidos, esperando `401 Unauthorized`.

## Critérios de Aceite (UAT Re-run)

1. `./mvnw spring-boot:run` inicia sem erros (assumindo que o banco esteja configurado corretamente).
2. `./mvnw test` passa com 100% de sucesso.
3. Relatório JaCoCo mostra cobertura total de linhas ≥ 80%.
4. Pelo menos um teste de 401 Unauthorized existe e passa para cada módulo principal.
