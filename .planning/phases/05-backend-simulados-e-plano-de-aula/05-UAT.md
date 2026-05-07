status: complete
phase: 05-backend-simulados-e-plano-de-aula
source: [05-WALKTHROUGH.md]
started: 2026-05-07T14:11:00Z
updated: 2026-05-07T14:20:40Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 6
name: Isolamento por Usuário
expected: |
  Listar simulados/aulas e garantir que apenas os registros do usuário autenticado sejam retornados.
awaiting: user response

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Reiniciar o backend e verificar se sobe sem erros e com os novos endpoints disponíveis.
result: pass

### 2. Simulado: Auto-Cálculo (2 de 3)
expected: Criar um simulado via POST /api/simulados enviando apenas total e acertos (ex: cmTotal=10, cmAcertos=8). O retorno deve conter cmErros=2 calculado automaticamente.
result: pass

### 3. Simulado: Validação de Consistência
expected: Tentar criar um simulado com valores inconsistentes (ex: acertos + erros > total). O sistema deve retornar erro 400 ou IllegalArgumentException tratada.
result: pass

### 4. Plano de Aula: Enum de Prioridade
expected: Criar uma aula com prioridade 'DIAMANTE'. O sistema deve persistir e retornar o valor correto do Enum.
result: pass

### 5. Plano de Aula: Toggle Assistida
expected: Chamar o endpoint PATCH /api/lessons/{id}/toggle-assistida e verificar se o campo aulaAssistida alterna de valor.
result: pass

### 6. Isolamento por Usuário
expected: Listar simulados/aulas e garantir que apenas os registros do usuário autenticado sejam retornados.
result: pass

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
