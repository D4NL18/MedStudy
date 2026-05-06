# Phase 2 Discussion Log

**Area:** Padronização das Entidades Base
**Options:** UUID vs Long, MappedSuperclass
**Selected:** UUID + BaseEntity com createdAt/updatedAt
**Notes:** Escolhido por segurança na exposição de IDs externos.

**Area:** Estrutura das Respostas de Erro
**Options:** Customizado Simples vs Problem Details (RFC 7807)
**Selected:** Customizado Simples
**Notes:** Formato mais clássico e simples de consumir no frontend Angular.

**Area:** Organização de DTOs e Mappers
**Options:** Por Módulo (Feature-based) vs Centralizado
**Selected:** Por Módulo (Feature-based)
**Notes:** Mantém o projeto limpo e coeso por feature.

**Area:** Mapeamentos e Nulls (MapStruct)
**Options:** Ignorar nulos vs Atualizar com nulo
**Selected:** Ignorar Nulos (NullValuePropertyMappingStrategy.IGNORE)
**Notes:** Traz mais flexibilidade para rotas PATCH/PUT parciais.
