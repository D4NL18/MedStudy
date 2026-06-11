# Phase 34: Documentação em Código (Clean Comments & Javadoc/TSDoc)

## Domain
Code Documentation & Cleanup (removendo comentários desatualizados, código morto e adicionando Javadoc/TSDoc para legibilidade humana e geração de documentação estática).

## Decisions

### Profundidade da Documentação
- **Decisão:** Exaustivo: Garantir que 100% das classes e métodos públicos tenham no mínimo um Javadoc/TSDoc básico para padronização.

### Limpeza de Comentários Antigos
- **Decisão:** Limpeza implacável: Apagar absolutamente todos os blocos de código comentados e comentários não-Javadoc/TSDoc (exceto aqueles cruciais de lint), assumindo que o Git já retém o histórico.

### Padrões e Ferramentas
- **Decisão:** Enriquecimento para geradores: Além do padrão, incluir anotações específicas do Compodoc no Angular e estender agressivamente as anotações do Swagger no Spring Boot para futuras documentações estáticas.

## Canonical Refs
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
