# Phase 5 Context — Backend: Simulados & Plano de Aula

## Domain Boundary
Esta fase foca na implementação dos serviços e controladores para Simulados e Plano de Aulas. O objetivo é permitir que o estudante registre o desempenho em provas completas (por área) e organize seu cronograma de estudos com prioridades, garantindo que os dados sejam isolados por usuário e validados server-side.

## Decisions

### 1. Simulados (Módulo simulado)
- **Estrutura**: Mantém as 5 grandes áreas fixas (Clínica Médica, Cirurgia, Pediatria, Ginecologia/Obstetrícia, Preventiva).
- **Lógica de Cálculo**: O backend deve ser flexível no input. Se o usuário fornecer 2 de 3 campos (`total`, `acertos`, `erros`), o sistema calcula o terceiro automaticamente.
- **Persistência**: Todos os 3 campos (`total`, `acertos`, `erros`) de cada área serão salvos no banco de dados para evitar recalculos em queries complexas.
- **Validação**: Impedir `acertos + erros > total`.

### 2. Plano de Aulas (Módulo aula)
- **Prioridades**: Implementado via Enum: `DIAMANTE`, `ALTA`, `MEDIA`, `BAIXA`.
- **Filtros**: Implementar filtros via JPA Specifications apenas para `grandeArea` e `aulaAssistida`.
- **Busca**: Busca textual por `tema` (ILIKE).

### 3. Segurança e Identidade
- **User Scoping**: O `userId` **nunca** é enviado pelo frontend. O backend identifica o usuário através do `SecurityContext` (JWT) em todas as operações (Create, Read, Update, Delete).
- **Obfuscation**: Utilizar UUIDs (já configurados nas entidades) para referenciar recursos, evitando IDs incrementais previsíveis.

## Code Context

### Reusable Patterns
- **JPA Specifications**: Repetir o padrão de filtros dinâmicos usado na Fase 4.
- **MapStruct**: Garantir que as lógicas de cálculo do Simulado sejam executadas no Service antes do mapping ou durante o mapping se necessário.
- **BaseEntity**: Todas as novas entidades devem estender a auditoria base.

### Integration Points
- **SecurityContextHolder**: Uso intensivo para recuperar o usuário logado.
- **StudySessionMetrics**: O progresso teórico (aulas assistidas) alimentará o Dashboard no futuro.

## Canonical Refs
- `backend/src/main/java/com/medstudy/backend/modules/simulado/entity/Simulado.java`
- `backend/src/main/java/com/medstudy/backend/modules/aula/entity/Lesson.java`
- `backend/src/main/java/com/medstudy/backend/modules/sessao/specification/StudySessionSpecifications.java` (Referência para filtros)

## Deferred Ideas
- **Importação de Simulados (Scraping)**: Deixado para V2.
- **Anexos de Provas (PDF)**: Fora de escopo.
