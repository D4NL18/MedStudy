# Phase 12: Backend Tests - Execution Plan

Este plano detalha as tarefas para atingir 80% de cobertura de testes no backend, incluindo configuração de infraestrutura e criação de testes para todos os módulos.

## 1. Infraestrutura e Utilities

- [ ] **1.1 Configurar JaCoCo no pom.xml**: Adicionar o plugin com a regra de `check` para falhar o build abaixo de 80% de cobertura.
- [ ] **1.2 Criar TestDataFactory**: Implementar a classe de utilitário em `src/test/java/com/medstudy/backend/util/TestDataFactory.java` para centralizar a criação de massa de dados.

## 2. Testes de Segurança e Autenticação (Base)

- [ ] **2.1 Testes Unitários de Security Services**: Implementar testes para `JwtService` e `LoginAttemptService`.
- [ ] **2.2 Testes Unitários de Auth Services**: Implementar testes para `AuthService`, `EmailService` e `RefreshTokenService`.
- [ ] **2.3 Testes Unitários de AuthController**: Implementar testes unitários (WebMvcTest) para todos os endpoints de autenticação.

## 3. Testes dos Módulos Core (Sessões e Simulados)

- [ ] **3.1 Testes de StudySessionController**: Implementar testes unitários para CRUD e métricas de sessões.
- [ ] **3.2 Testes de SimuladoController**: Implementar testes unitários para CRUD e cálculos de simulados.
- [ ] **3.3 Testes de LessonController**: Implementar testes unitários para o plano de aulas.

## 4. Testes de Flashcards e Revisão

- [ ] **4.1 Testes de FlashcardService**: Implementar testes unitários faltantes.
- [ ] **4.2 Testes de RevisionService**: Implementar testes unitários para a lógica de categorização de revisões.
- [ ] **4.3 Testes de Controllers**: Implementar testes unitários para `FlashcardController` e `RevisionController`.

## 5. Testes de Dashboard e Analytics

- [ ] **5.1 Testes de DashboardController**: Validar endpoints de KPIs e streak.
- [ ] **5.2 Testes de AnalyticsController**: Validar agregações por área e tema.

## 6. Verificação de Cobertura e Ajustes Final

- [ ] **6.1 Executar mvn verify**: Gerar relatório final do JaCoCo e validar o bloqueio de build.
- [ ] **6.2 Ajustes de Cobertura**: Identificar classes com baixa cobertura e adicionar testes faltantes até atingir a meta.

## Definição de Pronto (UAT)

1. `mvn verify` completa com sucesso.
2. O relatório `target/site/jacoco/index.html` mostra cobertura total de linhas ≥ 80%.
3. Todos os controllers possuem testes unitários validando casos de sucesso (200/201) e erro (400/404).
4. Endpoints protegidos possuem testes validando o erro 401 (Unauthorized).
