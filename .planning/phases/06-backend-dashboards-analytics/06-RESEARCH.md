# Research — Phase 06: Backend - Dashboards & Analytics

## Objective
Definir a estratégia de agregação de dados para os dashboards e otimização das queries de performance (Streak, Médias por Área/Tema).

## Analysis

### 1. Agregação de Dados
Para o dashboard e analytics, carregar todas as entidades em memória e processar via Java Stream (como feito no `StudySessionService.getMetrics`) é ineficiente para grandes volumes de dados.
- **Abordagem**: Utilizar `Interface-based Projections` ou `Constructor-based DTOs` com queries JPQL `@Query` para deixar o peso do cálculo (COUNT, SUM, AVG) no banco de dados.
- **Filtros Temporais**: Utilizar `LocalDate.now().minusDays(X)` diretamente na query para os filtros de `LAST_7_DAYS`, `LAST_30_DAYS`, etc.

### 2. Algoritmo de Streak
O algoritmo atual no `StudySessionService` funciona bem para volumes pequenos. Para o `DashboardService`, podemos:
- Buscar apenas as datas distintas de atividade (`DISTINCT data_sessao`) do usuário, ordenadas descrescentemente.
- Iterar verificando a consecutividade.
- **Otimização**: Limitar a busca das datas ao máximo histórico razoável ou buscar apenas as últimas N datas para validar o streak atual.

### 3. Analytics por Área e Tema
- **Área**: Agrupar por `grandeArea`. No caso dos Simulados, os dados já estão em colunas fixas por área, o que exige um `UNION ALL` ou processamento via service para consolidar com as sessões.
- **Tema**: Agrupar por `tema`.
- **Evolução (Trend)**: Comparar a média de acertos das sessões dos últimos 7 dias com a média total.

## Technical Proposal

### Dashboard KPIs
```java
public record DashboardResponse(
    StudyMetrics sessions,
    SimuladoMetrics simulados,
    int currentStreak
) {}
```

### Projections/Queries
```sql
-- Exemplo de query para taxa por área
SELECT s.grandeArea, SUM(s.qtsCorretas), SUM(s.qtsFeitas) 
FROM StudySession s 
WHERE s.user.id = :userId 
GROUP BY s.grandeArea
```

## Risks
- **Desempenho**: Muitas agregações simultâneas no Dashboard podem pesar. 
- **Mitigação**: Adicionar índices em `(user_id, data_sessao)` e `(user_id, grande_area)`.
