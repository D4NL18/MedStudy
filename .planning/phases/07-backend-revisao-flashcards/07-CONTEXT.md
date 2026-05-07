# Context — Phase 07: Revisão & Flashcards

## Goal
Implementar o sistema de repetição espaçada (Spaced Repetition) e a gestão de Flashcards com suporte a conteúdo rico (JSONB).

## Technical Decisions

### 1. Database Schema (PostgreSQL)
- **Tabela `flashcards`**:
    - `id`: UUID (Primary Key)
    - `user_id`: UUID (Foreign Key)
    - `grande_area`: String/Enum
    - `frente`: JSONB (Estrutura de blocos: text/image)
    - `verso`: JSONB (Estrutura de blocos: text/image)
    - `proxima_revisao`: LocalDate
    - `dificuldade_ultima`: Enum (EASY, MEDIUM, HARD)
    - `ease_factor`: Double (Padrão 2.5)
    - `intervalo_atual`: Integer (Dias)

### 2. Algoritmo Adaptativo (SM-2 Simplificado)
- **Lógica de Intervalo**:
    - Se `HARD`: Novo intervalo = 1 dia, Ease Factor diminui em 0.2.
    - Se `MEDIUM`: Novo intervalo = Intervalo Atual * Ease Factor, Ease Factor mantém.
    - Se `EASY`: Novo intervalo = Intervalo Atual * Ease Factor * 1.3, Ease Factor aumenta em 0.1.
- **Ease Factor Mínimo**: 1.3 (para evitar que o card trave em revisões infinitas).

### 3. Conteúdo Rico (JSONB)
Estrutura sugerida para `frente` e `verso`:
```json
[
  { "type": "text", "value": "Qual a tríade de Charcot?" },
  { "type": "image", "url": "https://..." },
  { "type": "text", "value": "Resposta esperada..." }
]
```

## Requirements Covered
- **REVI-01..07**: Gestão de revisões de sessões.
- **FLSH-01..08**: CRUD e Estudo de Flashcards.
