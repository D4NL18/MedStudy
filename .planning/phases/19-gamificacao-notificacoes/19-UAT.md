---
status: testing
phase: 19-gamificacao-notificacoes
source: [19-SUMMARY.md]
started: 2026-05-12T15:45:00Z
updated: 2026-05-12T15:45:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
awaiting: user response

## Tests

### 0. Cold Start Smoke Test
expected: Kill any running server/service. Start the application from scratch. Server boots without errors.
result: pass

### 1. Preview de Badges no Dashboard
expected: Ao abrir o Dashboard, o widget "Conquistas" deve estar visível na terceira coluna da linha inferior, exibindo o contador de medalhas ganhas e uma lista de conquistas (coloridas se ganhas, cinzas com ícone de cadeado se bloqueadas).
result: pass

### 2. Navegação para Perfil
expected: Ao clicar no botão "Ver todas as medalhas" no widget do Dashboard, o sistema deve redirecionar para a página /perfil.
result: pass

### 3. Galeria de Badges no Perfil
expected: Na página de Perfil, deve haver uma seção "Minha Galeria de Medalhas" exibindo todas as conquistas disponíveis, com detalhes (nome e descrição) e distinção visual entre ganhas e bloqueadas.
result: pass

### 4. Dropdown de Notificações
expected: O ícone de sino na Navbar deve exibir um badge vermelho com o número total de pendências. Ao clicar, um dropdown deve abrir listando as revisões atrasadas e aulas de reforço.
result: pass

### 5. Atribuição de Badge (Maratonista)
expected: Ao finalizar uma sessão de estudo (ou simulado) que atinja o critério (ex: 1000 questões no total), um Toast festivo deve aparecer notificando a nova conquista, e ela deve passar a aparecer como colorida no Dashboard e Perfil.
result: pass

### 6. Bugfix: Data da Aula
expected: Ao criar uma nova aula no Plano de Aulas e selecionar uma data no modal, a aula deve ser salva com a data correta e não ser marcada como "assistida" prematuramente.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

- truth: "O background do modal de notificações deve ter opacity 1"
  status: pass
  reason: "Fixed in shell.component.scss (added background: var(--color-bg))"
  severity: cosmetic
  test: 4

- truth: "Conseguir criar aula e nova linha no banco de dados"
  status: pass
  reason: "Fixed in LessonModalComponent (empty date handling) and added Toast feedback"
  severity: blocker
  test: 6
