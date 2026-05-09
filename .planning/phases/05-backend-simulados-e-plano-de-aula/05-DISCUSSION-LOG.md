# Discussion Log — Phase 5

## Areas Discussed

### 1. Estrutura e Lógica de Simulados
- **Opções**: Áreas dinâmicas vs Áreas fixas.
- **Decisão**: Manter as 5 áreas fixas do legado. Implementar lógica de cálculo "2 de 3": o usuário preenche dois valores e o sistema calcula o terceiro, salvando todos no banco.

### 2. Prioridades de Aulas
- **Opções**: String simples vs Enum.
- **Decisão**: Usar Enum para `DIAMANTE`, `ALTA`, `MEDIA`, `BAIXA`. Limitar filtros a Área e Status de assistência.

### 3. Segurança e IDs
- **Opções**: Enviar userID no body vs Usar contexto de segurança.
- **Decisão**: Usar estritamente o contexto de segurança (JWT). Evitar expor IDs sequenciais ou IDs de usuário no frontend, utilizando UUIDs para as entidades.

## Deferred Ideas
- Nenhuma ideia nova surgiu nesta discussão que não estivesse no roadmap original.
