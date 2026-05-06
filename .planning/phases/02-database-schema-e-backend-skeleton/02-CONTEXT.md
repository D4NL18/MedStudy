# Phase 2 Context: Database Schema & Backend Skeleton

## Domain
Criação das tabelas no PostgreSQL via Flyway, mapeamento das Entidades JPA, Repositórios, DTOs (Java Records) e tratamento global de erros (`@ControllerAdvice`).

## Decisions

### Padronização das Entidades Base
- Usar UUID para as chaves primárias.
- Criar uma classe `@MappedSuperclass BaseEntity` gerenciando `createdAt` e `updatedAt` para reaproveitamento.

### Estrutura das Respostas de Erro
- Formato JSON Customizado Simples (ex: `timestamp`, `status`, `error`, `message`, `path`) para facilitar o consumo pelo Angular.

### Organização de DTOs e Mappers
- Por Módulo (Feature-based): DTOs e Mappers organizados dentro do sub-pacote de cada feature (ex: `com.medstudy.modules.sessao.dto`).

### Mapeamentos e Nulls (MapStruct)
- Ignorar Nulos (Update Parcial Automático): Configurar MapStruct com `NullValuePropertyMappingStrategy.IGNORE` para facilitar operações de PATCH/PUT.

## Code Context
- Não há código significativo nesta fase (apenas scaffold da fase 1).

## Canonical Refs
- `.planning/ROADMAP.md` (Phase 2)
