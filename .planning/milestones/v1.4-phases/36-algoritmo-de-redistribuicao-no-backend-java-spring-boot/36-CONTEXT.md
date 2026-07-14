# Phase 36: Algoritmo de Redistribuição no Backend (Java/Spring Boot)

## Domain
Lógica de negócio e testes unitários para o cálculo de redistribuição de flashcards/revisões atrasadas para dias futuros. A redistribuição deve equalizar a carga diária até uma data limite escolhida pelo usuário, levando em conta critérios específicos de priorização.

## Canonical Refs
- [ROADMAP.md](../../ROADMAP.md)
- [PROJECT.md](../../PROJECT.md)

## Decisions

### Estratégia de Distribuição & Fila Longa
- **Distribuição Uniforme até Data Limite**: Em vez de compactar nos primeiros dias, o algoritmo deve espalhar as revisões de maneira que todos os dias entre o "hoje" e uma **data final definida pelo usuário** fiquem com a quantidade de revisões mais próxima (igual) possível.
- **Input do Usuário**: A data prazo para terminar o acúmulo será o limitador do horizonte.

### Critérios de Priorização
Ao distribuir os flashcards/revisões nessa janela de tempo (da data atual até o prazo estabelecido), o sistema definirá as prioridades de alocação de acordo com os seguintes critérios:
1. **Aulas associadas**: Prioridade das aulas (Diamante → Alta → Média → Baixa).
2. **Data original**: O tempo de atraso (dias que passaram da data ideal).
3. **Desempenho no Tema**: O % de acertos do usuário nas questões referentes àquele tema.

## Prior Decisions Applied
* A stack (Java 21, Spring Boot 3) e o uso de DTOs e testes rigorosos mantêm as decisões das fases 1-15 e 29-35.

## Code Context
- Padrões de entidade legados/atuais para definir o *streak*, a data original e a prioridade das aulas.
