# Phase 29: Limpeza & Refatoração do Backend (Java/Spring Boot)

A Fase 29 marca o início do Milestone v1.3. Seu foco é puramente técnico (Technical Debt Reduction), otimizando a qualidade do código backend e eliminando código inútil, antes que a complexidade se torne um problema.

## User Review Required

> [!IMPORTANT]
> Verifique o plano abaixo. Vamos executar a configuração do PMD no Maven primeiro para gerar um relatório local, que guiará a limpeza. Após a limpeza, o build deve compilar 100% livre de warnings. Concorda com essa abordagem?

## Proposed Changes

### 1. Configuração de Análise Estática (PMD & SpotBugs)
#### [MODIFY] [pom.xml](file:///c:/Users/PC/Documents/GitHub/MedStudy/backend/pom.xml)
- Adicionar os plugins `maven-pmd-plugin` e `spotbugs-maven-plugin` na seção de `<plugins>`.
- Rodar as análises para identificar "Dead Code", "Unused Imports" e "Security Hotspots".

### 2. Otimização de Queries e FetchType
#### [MODIFY] Entidades e Repositórios
- Revisar todas as entidades de Domínio (`FeedEvent`, `Friendship`, `StudySession`, `Badge`, etc).
- Garantir que não existe NENHUM `@ManyToOne` ou `@OneToOne` que não esteja forçando explicitamente `fetch = FetchType.LAZY`.
- Refatorar repositórios que precisem puxar os dados lazy utilizando `EntityGraphs` ou `JOIN FETCH` se o PMD alertar gargalos de banco de dados.

### 3. Dead Code Elimination e Conversão de Mappers
#### [MODIFY] Mappers e Services Manuais
- Analisar `CompetitionMapper.java` e `FlashcardMapper.java` (que atualmente são `abstract class`). Avaliar conversão para `interface` pura do MapStruct se os métodos concretos não forem mais necessários.
- Deletar arquivos soltos antigos na camada de API que não são chamados no projeto (a partir do report do PMD).

## Verification Plan

### Automated Tests
- Executaremos `mvn clean test` para garantir que nenhuma refatoração quebrou os testes existentes.
- Executaremos `mvn pmd:check` e `mvn spotbugs:check`. O pipeline de build deve passar sem falhas de qualidade.

### Manual Verification
- N/A para interfaces, mas validaremos através do terminal que o tempo de startup da aplicação e o peso do build (JAR) diminuíram após a limpeza do lixo.
