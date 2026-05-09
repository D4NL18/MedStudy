# Phase 12: Backend Tests - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Este projeto foca na implementação de uma suíte robusta de testes unitários e de integração para o backend (Spring Boot), visando garantir que as regras de negócio e a segurança estejam protegidas. O objetivo final é atingir uma cobertura mínima de 80% medida pelo JaCoCo, com bloqueio de build em caso de falha.

</domain>

<decisions>
## Implementation Decisions

### 1. Estratégia de Testes de Controller
- **D-01:** Utilizar `@WebMvcTest` (slice testing) para a maioria dos testes de Controller. O foco será na validação de payloads (400 Bad Request), tratamento de erros e mapeamento de DTOs.
- **D-02:** Utilizar `@SpringBootTest` (testes de integração) para fluxos críticos de ponta a ponta, como o processo de autenticação e fluxos complexos de escrita que envolvem múltiplas camadas.

### 2. Configuração do JaCoCo & Cobertura
- **D-03:** Configurar o `jacoco-maven-plugin` no `pom.xml`.
- **D-04:** Definir uma regra de verificação (`check` goal) que falha o build do Maven se a cobertura total de linhas for inferior a **80%**.

### 3. Gestão de Massa de Dados
- **D-05:** Criar uma `TestDataFactory` centralizada em `src/test/java/com/medstudy/backend/util/TestDataFactory.java`.
- **D-06:** A factory deve fornecer métodos estáticos para criar instâncias padrão de `User`, `StudySession`, `Simulado`, `Lesson` e `Flashcard`, permitindo customização via parâmetros quando necessário.

### 4. Priorização de Execução
- **D-07:** Seguir a ordem de criticidade:
    1. **Auth & User** (Segurança base)
    2. **Sessão/Sessoes de Estudo** (Core de dados)
    3. **Simulados & Plano de Aulas** (Regras de cálculo)
    4. **Flashcards & Revisão** (Algoritmos de agendamento)
    5. **Dashboard & Analytics** (Agregações)

### the agent's Discretion
- Escolha das bibliotecas auxiliares de teste (além das já presentes no Starter Test).
- Definição exata dos cenários de "edge cases" em cada service.
- Organização das pastas de teste seguindo o padrão de módulos do projeto.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend Source
- `backend/src/main/java/com/medstudy/backend/modules/` — Estrutura de módulos a serem testados.
- `backend/src/main/java/com/medstudy/backend/modules/auth/` — Referência para segurança.
- `backend/src/main/java/com/medstudy/backend/modules/sessao/` — Referência para core de dados.

### Existing Tests
- `backend/src/test/java/com/medstudy/backend/modules/auth/AuthControllerIT.java` — Exemplo de Integration Test.
- `backend/src/test/java/com/medstudy/backend/modules/sessao/service/StudySessionServiceTest.java` — Exemplo de Unit Test de Service.

### Configuration
- `backend/pom.xml` — Onde o JaCoCo será configurado.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **H2 Database**: Já configurado no `pom.xml` para ser usado em testes, permitindo testes de repositório e integração sem depender de um DB externo.
- **Spring Security Test**: Dependência já presente para simular usuários autenticados via `SecurityMockMvcConfigurers`.

### Established Patterns
- **Mockito Extension**: Uso de `@ExtendWith(MockitoExtension.class)` e `@InjectMocks` já estabelecido em testes existentes.
- **Record DTOs**: O uso de Java Records para DTOs facilita os testes de validação com `jakarta.validation`.

### Integration Points
- **SecurityContextHolder**: Testes precisam simular o `Principal` para endpoints que dependem do `currentUser`.

</code_context>

<specifics>
## Specific Ideas

- Testar o algoritmo de streak no `DashboardService` com casos de borda (datas distantes, streak quebrado).
- Validar se o cálculo de erros nos Simulados (`total - acertos`) é mantido corretamente após updates.
- Garantir que o agendamento de Flashcards respeita exatamente os intervalos (+1d, +3d, +7d).

</specifics>

<deferred>
## Deferred Ideas

- Testes de Performance/Carga (Out of scope para v1).
- Testes de E2E com Selenium/Playwright (Reservado para Phase 15).

</deferred>

---

*Phase: 12-Backend Tests*
*Context gathered: 2026-05-09*
