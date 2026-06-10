# Phase 29: Limpeza & Refatoração do Backend (Java/Spring Boot)

## Contexto da Fase
O objetivo desta fase é aplicar uma faxina técnica e otimizar a performance do backend da aplicação MedStudy, antes de prosseguir com refatorações do frontend. Focaremos em eliminar código morto, substituir lógicas manuais legadas, prevenir gargalos de N+1 no Hibernate e configurar validações de estilo/qualidade no Maven.

## Decisões Tomadas
1. **Ferramentas de Linting & Qualidade**: Sim, o Maven será configurado com plugins de análise estática (Checkstyle e/ou PMD/SpotBugs) para automatizar a descoberta de código morto, imports não utilizados e más práticas, garantindo a qualidade de longo prazo.
2. **Otimização de Queries**: Foco amplo na caça aos problemas de N+1 (mudando para `FetchType.LAZY` e utilizando DTOs/EntityGraphs onde necessário). Nenhum endpoint em específico (como Dashboard ou Simulados) foi sinalizado como lento, então o tuning será preventivo e sistêmico.
3. **Escopo da Limpeza**: Será feita uma faxina profunda ("Deep Clean"). Além do Dead Code Elimination clássico (arquivos soltos/nunca chamados), também devemos varrer serviços e classes utilitárias antigas que foram substituídas por bibliotecas (ex: mappers manuais vs MapStruct).
