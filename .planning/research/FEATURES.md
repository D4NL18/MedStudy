# Research: Features breakdown for v1.5 (Monetização PIX & Freemium Paywall)

## Feature Matrix

### Table Stakes (Must-Have for v1.5)
| Feature | Description | Complexity | Dependency |
|---------|-------------|------------|------------|
| **Trial 30 Dias Automático** | Ao cadastrar novo usuário, concede automaticamente 30 dias de acesso completo | Baixa | Auth Module (v1.0) |
| **Paywall Total Pós-Trial** | Bloqueio de funcionalidades principais após expiração do trial de 30 dias | Média | Spring Security & Angular Guards |
| **Geração de QR Code PIX (BB)** | Chamada à API do Banco do Brasil para gerar PIX Dinâmico com `txid` único e payload Copia e Cola | Alta | BB OAuth2 + mTLS |
| **Processamento do Webhook PIX** | Receiver assíncrono para notificações `POST` do Banco do Brasil ativando a assinatura anual | Alta | Public Webhook Controller |
| **Painel de Administração (Single Admin)** | Interface restrita para o admin (usuário mestre) conceder/estender acesso grátis ou marcar conta como VIP/Lifetime | Média | User Roles / Flags |
| **Notificação de Expiração** | Banner/alerta in-app informando dias restantes do trial/assinatura (especialmente nos últimos 30 dias) | Média | Subscription State |
| **Histórico de Pagamentos** | Exibição para o usuário das faturas/cobranças PIX geradas e seus status (Pendente, Pago, Expirado) | Média | Subscription Database |

### Differentiators (Value-Add Capabilities)
| Feature | Description | Complexity | Note |
|---------|-------------|------------|------|
| **Botão "Já Paguei" / Polling de Status** | Botão para checagem imediata via API BB caso o webhook atrase | Média | Melhora drasticamente a experiência do usuário |
| **Cópia Rápida 1-Click (PIX Copia e Cola)** | Feedback visual de cópia da chave PIX com tooltip/toast de confirmação | Baixa | UX Polish |
| **Badge de Membro Pro / Dias Restantes** | Exibição sutil no cabeçalho/sidebar com status da assinatura | Baixa | Engajamento |

### Deferred / Out of Scope (For Future Milestones)
- **Cobrança Recorrente Automática (Débito em Conta/Cartão)**: Exige contrato de assinatura recorrente; PIX anual manual é mais simples para o MVP.
- **Múltiplos Planos (Semestral, Trimestral)**: Foco estrito no Plano Anual.
- **Cupons de Desconto / Código Promocional**: Pode ser gerenciado manualmente pelo Admin por enquanto.
