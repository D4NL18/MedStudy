# Phase 32: Expansão de Cobertura de Testes Context

## Domain
Expansão de cobertura de testes para edge cases no backend (erros 400, 403, 404, 429) e testes de UI e serviços complexos no frontend (ex: repetição espaçada).

## Decisions

### Backend Mocking Strategy (Edge Cases)
- **Decision:** Utilizar ambas as estratégias: testes rápidos de unidade no Controller (`@WebMvcTest` com mocks) e testes de integração reais (`@SpringBootTest` com banco em memória/Testcontainers).

### Rate Limit (429) Testing
- **Decision:** Simular o tráfego real fazendo requisições em loop no teste até esgotar o limite do Bucket4j.
- **Specifics:** O rate limit da aplicação deve ser diminuído para 20 requisições por minuto (via configuração/properties no profile de teste) para facilitar a simulação sem tornar os testes demasiadamente lentos.

### Frontend UI Testing
- **Decision:** Adotar uma abordagem híbrida: Testes isolados (shallow, mockando componentes filhos) para validar a lógica local, e Testes de integração profundos (renderizando o DOM completo) para os componentes principais/container de página.

## Canonical Refs
- Referência principal: [REQUIREMENTS.md](../../REQUIREMENTS.md) (Requisitos TEST-01 e TEST-02). Nenhuma documentação externa (ADR/Spec) foi fornecida.
