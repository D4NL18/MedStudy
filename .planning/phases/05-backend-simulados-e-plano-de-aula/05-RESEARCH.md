# Phase 5 Research — Backend: Simulados & Plano de Aula

## Domain Investigation

### 1. Simulado Business Logic (Legacy: `ModalNovoSimulado.jsx`)
O sistema legado utiliza 5 grandes áreas fixas:
- `cm` (Clínica Médica)
- `cir` (Cirurgia)
- `ped` (Pediatria)
- `go` (Ginecologia/Obstetrícia)
- `prev` (Preventiva)

Para cada área, existem 3 campos: `total`, `acertos` e `erros`.
A lógica de auto-cálculo ("2 de 3") no frontend legado funciona assim:
- Se `total` e `acertos` preenchidos -> `erros = total - acertos`
- Se `total` e `erros` preenchidos -> `acertos = total - erros`
- Se `acertos` e `erros` preenchidos -> `total = acertos + erros`

**Recomendação para o Backend:**
O `SimuladoService` deve aplicar essa mesma lógica no `create` e `update` para garantir integridade, mesmo que o frontend mande apenas 2 campos. O banco salvará os 3 campos por área.

### 2. Plano de Aula Business Logic (Legacy: `ModalNovaAula.jsx`)
O plano de aula no legado possui:
- `grande_area` (As mesmas 5 áreas)
- `tema` (String)
- `subarea` (String - Opcional no legado, não mencionada explicitamente nos requisitos v1 mas útil)
- `prioridade` (Enum: `Diamante`, `Alta`, `Média`, `Baixa`)
- `aula_assistida` (Boolean)

**Recomendação para o Backend:**
- Criar `LessonPriority` Enum com os valores acima.
- Garantir que a `grandeArea` use o mesmo Enum/Padrão das outras entidades.

### 3. API Patterns (Backend Consistency)
Seguiremos o padrão estabelecido na Fase 4 (`StudySession`):
- **User Ownership**: Recuperar o usuário do `SecurityContextHolder` e filtrar por `userId`.
- **JPA Specifications**: Usar para filtros dinâmicos de área e status no Plano de Aula.
- **Validation**: Adicionar validação server-side para garantir que `acertos + erros <= total` em cada área do simulado.
- **DTOs**: Usar Records para Request/Response.

## Reusable Assets
- **StudySessionSpecifications**: Usar como template para `LessonSpecifications`.
- **GlobalExceptionHandler**: Lida com `IllegalArgumentException` (validações).
- **MapStruct Config**: Configuração padrão para UUID e mapping de entidades.

## Dependencies & Integrations
- **Spring Security**: Já configurado para proteger endpoints e prover o usuário logado.
- **PostgreSQL**: Tabelas `simulados` e `lessons` já migradas via Flyway na Fase 2 (verificar se os nomes dos campos coincidem com o legado).

## Validation Strategy
- Testes unitários focados na lógica de cálculo do simulado (edge cases: zeros, nulos).
- Testes de integração para filtros do plano de aula.
