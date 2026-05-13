# Discussion Log: Phase 19

This log records the human decisions made during the `gsd-discuss-phase` workflow.
It is NOT consumed by downstream AI agents.

## Discussion 1
**Area:** Armazenamento das Badges
**Options Presented:**
- Dinâmico (on-the-fly)
- Entidade no Banco de Dados (UserBadge)
**Selected:** Gravado no Banco de Dados
**Notes:** Decisão favorável a ter a data da conquista (`earned_at`) e facilitar badges futuras.

## Discussion 2
**Area:** Notificação de Conquista
**Options Presented:**
- Toast/Modal festivo na hora do ganho
- Silencioso (só no perfil)
**Selected:** Toast/Modal Festivo
**Notes:** Escolha pelo engajamento dinâmico no uso do aplicativo.

## Discussion 3
**Area:** Persistência de Notificações
**Options Presented:**
- Status Dinâmico (bolinha via check instantâneo)
- Entidade Inbox Notificações
**Selected:** Status Dinâmico
**Notes:** Menos poluente pro DB, atende bem à necessidade sem "caixa de entrada" com read/unread.

## Discussion 4
**Area:** Comportamento do Ícone de Notificação
**Options Presented:**
- Redirecionamento Direto para Revisões
- Dropdown Menu de Alertas
**Selected:** Dropdown de Alertas
**Notes:** Dá mais clareza visual e pode agregar outros tipos de avisos além das revisões (como aulas).

## Discussion 5
**Area:** Localização Visual das Badges
**Options Presented:**
- Destaque no Dashboard
- Foco apenas no Perfil
**Selected:** Ambas as opções
**Notes:** Fazer um híbrido: resumo rápido no dashboard e galeria completa no menu do Perfil.

## Extra Tasks Added
- **Bugfix**: Corrigir erro na criação de aulas quando uma data é fornecida (aula concluída).
- **UI Refactor**: Mover o seletor de temas do Dashboard para a página de Perfil.
