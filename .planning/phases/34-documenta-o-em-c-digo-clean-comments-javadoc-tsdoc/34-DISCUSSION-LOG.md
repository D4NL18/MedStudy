# Discussion Log: Phase 34

## Area 1: Profundidade da Documentação
- **Options Presented:**
  1. Pragmático: Documentar apenas regras de negócio complexas, serviços principais, algoritmos (ex: repetição espaçada) e pontos obscuros. Métodos óbvios podem ficar sem comentários.
  2. Exaustivo: Garantir que 100% das classes e métodos públicos tenham no mínimo um Javadoc/TSDoc básico para padronização.
- **User Selection:** Exaustivo: Garantir que 100% das classes e métodos públicos tenham no mínimo um Javadoc/TSDoc básico para padronização.

## Area 2: Limpeza de Comentários Antigos
- **Options Presented:**
  1. Revisão com curadoria: Apagar código morto, mas ler e preservar TODOs, marcações de débito técnico e alertas úteis do histórico legado.
  2. Limpeza implacável: Apagar absolutamente todos os blocos de código comentados e comentários não-Javadoc/TSDoc (exceto aqueles cruciais de lint), assumindo que o Git já retém o histórico.
- **User Selection:** Limpeza implacável: Apagar absolutamente todos os blocos de código comentados e comentários não-Javadoc/TSDoc (exceto aqueles cruciais de lint), assumindo que o Git já retém o histórico.

## Area 3: Padrões e Ferramentas
- **Options Presented:**
  1. Foco no padrão puro: Usar apenas Javadoc e TSDoc para legibilidade humana no código fonte. O Swagger já dá conta do recado na API e não precisamos de um gerador (ex: Compodoc) para o front.
  2. Enriquecimento para geradores: Além do padrão, incluir anotações específicas do Compodoc no Angular e estender agressivamente as anotações do Swagger no Spring Boot para futuras documentações estáticas.
- **User Selection:** Enriquecimento para geradores: Além do padrão, incluir anotações específicas do Compodoc no Angular e estender agressivamente as anotações do Swagger no Spring Boot para futuras documentações estáticas.
