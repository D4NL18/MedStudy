# Phase 42 Discussion Log — Painel Administrativo de Assinaturas (Single Admin)

Date: 2026-07-14

## Area 1: Concessão e Sobreposição Manual de Acesso (Admin Override)
- **Options Presented**:
  1. Opções predefinidas (+30d, +90d, +365d, Conceder LIFETIME, Forçar Expiração) com campo obrigatório de observação (notes). (Selected)
  2. Seleção livre por calendário + opção LIFETIME com observação.
  3. Toggle rápido de 1 ano ou LIFETIME sem observação.
- **User Choice**: Opções predefinidas (+30 dias, +90 dias, +365 dias, Conceder LIFETIME, Forçar Expiração) com campo obrigatório de observação/motivo (`notes`).

## Area 2: Métricas Resumidas e Filtros do Painel Admin
- **Options Presented**:
  1. 4 Cards de métricas e finanças no topo (Ativos, Trial, Expirados, Receita PIX em R$) + Busca por e-mail/nome + Filtro de status. (Selected)
  2. Cards apenas financeiros + Busca por e-mail/nome.
  3. Tabela simples de usuários paginados sem cards de resumo.
- **User Choice**: Cards combinando métricas operacionais (Ativos, Trial, Expirados) e métrica financeira (Receita PIX Acumulada em R$) + Filtro por status e busca por e-mail/nome.

## Area 3: Visualização do Histórico de Transações PIX
- **Options Presented**:
  1. Aba separada "Transações PIX" no painel admin com tabela paginada (txid, e-mail, valor, data, e2eId, status) e filtro por status. (Selected)
  2. Modal secundário ao clicar em um usuário específico.
  3. Visualização inline na linha da tabela de usuários.
- **User Choice**: Aba separada "Transações PIX" com tabela paginada e filtros.

## Area 4: Navegação e Segurança (Single Admin)
- **Options Presented**:
  1. Endpoints backend com @PreAuthorize("hasRole('ADMIN')"), Rota Angular /admin/subscriptions com AdminGuard, e link "Painel Admin" no menu visível apenas para ADMIN. (Selected)
  2. Aba interna na tela de Configurações (/configuracoes/admin).
- **User Choice**: Rota dedicada /admin/subscriptions com AdminGuard e link visível apenas para usuários ADMIN.
