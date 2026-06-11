# Phase 32: Expansão de Cobertura de Testes — Discussion Log
*Generated on 2026-06-11*

**Area:** Backend Mocking Strategy
**Options:**
1. Testes unitários rápidos (@WebMvcTest com mocks)
2. Testes de integração reais (@SpringBootTest com banco em memória/Testcontainers)
**User selected:** ambos

**Area:** Rate Limit (429) Testing
**Options:**
1. Simular tráfego real (fazer chamadas em loop no teste até esgotar o limite)
2. Mockar o Bucket4j (forçar retorno de limite excedido sem precisar de loop)
**User selected:** 1. diminua o rate limit para 20 requisições por minuto

**Area:** Frontend UI Testing
**Options:**
1. Testes isolados (Shallow, mockando componentes filhos - mais fáceis de manter)
2. Testes de integração profundos (Renderizando o DOM completo do componente e seus filhos)
3. Ambos (Isolados para lógica, Profundos para componentes principais de página)
**User selected:** Ambos (Isolados para lógica, Profundos para componentes principais de página)
