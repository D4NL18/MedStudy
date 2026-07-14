# Phase 39 Validation Strategy

## Dimensions

### 1. Functional Correctness
- **Backend**: O cálculo das quantidades diárias de `Before` e `After` no DTO `RedistributionPreviewResponse` deve somar corretamente as datas. O "Antes" de hoje deve incluir os flashcards atrasados.
- **Frontend**: O modal deve ler corretamente esses dados e passá-los para o `ngx-charts`.

### 2. UI/UX & Aesthetics
- O gráfico deve usar cores distintas para "Antes" e "Depois" (ex: vermelho suave para o pico de Antes, verde/azul suave para a nova curva).
- Os skeletons loaders devem aparecer enquanto o draft é calculado.
- O estado de sucesso deve mostrar uma animação e auto-fechar em 2s.

### 8. Nyquist Validation (Mandatory for GSD Planner)
N/A
