# Phase 36: Algoritmo de Redistribuição no Backend (Java/Spring Boot) — Discussion Log

## Q1: Quais áreas discutir?
**Presented:**
- Estratégia de Distribuição — Preencher dias seguintes até o limite ou espalhar uniformemente ao longo de vários dias?
- Critério de Priorização — Quais revisões têm preferência para as vagas de hoje (Mais antigas, Mais difíceis, Aleatórias)?
- Comportamento de Fila Longa — O que fazer quando a redistribuição empurrar os cartões meses para o futuro (impor limite máximo de dias, considerar esquecido)?

**Selected:**
- todos

**Notes:**
- O usuário optou por debater todas as três áreas relativas à lógica da reorganização de revisões no backend.

## Q2: Estratégia de Distribuição
**Presented:**
- Compactar: Preencher cada dia seguinte até o limite (máxima densidade, resolve rápido).
- Espalhar: Distribuir uniformemente ao longo de uma janela de dias (suaviza a carga no curto prazo).
- Preencher Vales: Procurar dias futuros que estão mais vazios e alocar as revisões lá, respeitando o limite.

**Selected:**
- 3, mas definindo prioridades baseadas nas aulas, data original e % de acertos das questões daquele tema

**Notes:**
- O usuário pediu para focar nos vales/distribuição equilibrada, e adiantou as regras de prioridade que englobam a aula, tempo de atraso e o desempenho em questões do tema.

## Q3: Comportamento de Fila Longa
**Presented:**
- Limitar o horizonte (ex: máx. de dias). O que não couber é marcado como 'esquecido' ou volta para a estaca zero.
- Distribuir indefinidamente no futuro, não importando o quão longe fique. A fila andará.
- Ignorar o limite diário após um certo número de dias para forçar o encaixe das revisões sem empurrar muito.

**Selected:**
- distribua igualmente, mas o usuário deve poder inputar o dia final que ele quer terminar e este prazo será definido como limite. Todos os dias terão quantidades muito próximas de revisões até a data prevista

**Notes:**
- Decisão fundamental: a distribuição será balizada por um *input* do usuário (data final para bater a meta de colocar o estudo em dia). O algoritmo equalizará as pendências ao longo dessa janela de tempo especificada.
