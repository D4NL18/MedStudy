---
status: testing
phase: 18-alertas-performance-exportacao
source: [18-SUMMARY.md]
started: 2026-05-11T20:56:00Z
updated: 2026-05-12T00:17:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Relatório PDF no Dashboard
expected: |
  1. Vá para o Dashboard.
  2. Clique no botão "Relatório PDF" no cabeçalho.
  3. Um arquivo PDF deve ser gerado e baixado.
  4. Verifique se o PDF contém o título correto, a data e as imagens dos gráficos.
awaiting: user response

## Tests

### 1. Relatório PDF no Dashboard
expected: O sistema deve gerar e baixar um arquivo PDF contendo capturas dos gráficos de Evolução e Distribuição do Dashboard.
result: issue
reported: "500 Internal Server Error — TemplateProcessingException: metrics.streak não encontrado no record StudySessionMetricsResponse"
fix: "Corrigido campo para metrics.streakAtual no template performance-report.html"
severity: blocker

### 2. Exportação CSV no Dashboard
expected: Clicar no botão "CSV" no Dashboard deve baixar um arquivo `.csv` contendo o histórico global de sessões.
result: passed

### 3. Exportação CSV no Banco de Dados
expected: Aplicar filtros no Banco de Dados e clicar em "Exportar CSV". O arquivo deve conter apenas os dados respeitando os filtros ativos.
result: partial-pass
reported: "Filtro por Tema funcionou; filtro por Grande Área não funcionava (busca exata, case-sensitive)"
fix: "Atualizado para busca global case-insensitive (tema OU grandeArea) em StudySessionSpecifications.java"

### 4. Badges de Alerta no Plano de Aulas
expected: Aulas com necessidade de reforço ou revisão devem exibir badges visuais ("Reforço" amarelo, "Crítico" vermelho pulsante) na coluna Alertas.
result: passed

### 5. Data de Conclusão Automática (Listagem)
expected: Ao marcar uma aula como "Concluída" diretamente na tabela, a "Data Aula" deve ser preenchida automaticamente com a data de hoje.
result: passed

### 6. Lógica de Data no Modal de Aula
expected: No modal de aula, ao marcar "Aula Assistida", a data de hoje deve ser sugerida automaticamente, permitindo edição manual.
result: passed

## Summary

total: 6
passed: 5
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "Exportação de PDF deve funcionar para usuários autenticados"
  status: in-progress
  reason: "Template error: metrics.streak → corrigido para metrics.streakAtual. Re-teste pendente."
  severity: blocker
  test: 1
