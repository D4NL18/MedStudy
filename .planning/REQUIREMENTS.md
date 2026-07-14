# Requirements: MedStudy v1.5

**Milestone:** v1.5
**Goal:** Implementar paywall com trial de 30 dias grátis, assinatura anual via PIX (API Banco do Brasil), painel admin para concessão manual de acessos e notificações de expiração.

---

## v1.5 Requirements

### Freemium Paywall & Assinatura (PAYWALL)
- [ ] **PAYWALL-01**: Concessão automática de 30 dias de trial gratuito ao cadastrar novo usuário.
- [ ] **PAYWALL-02**: Bloqueio total por Paywall (Angular Guard + Spring Security Interceptor) ao expirar o período de trial sem assinatura ativa.
- [ ] **PAYWALL-03**: Tela de Planos (/planos) apresentando benefícios da assinatura anual, valor e botão de checkout PIX.

### Integração PIX Banco do Brasil (PIX)
- [ ] **PIX-01**: Geração de cobrança PIX Dinâmica via API do Banco do Brasil com exibição de QR Code e chave "Copia e Cola" (com botão de 1-click copy).
- [ ] **PIX-02**: Endpoint público para recebimento de Webhook do Banco do Brasil, validando autenticidade e ativando automaticamente a assinatura por 1 ano.
- [ ] **PIX-03**: Mecanismo de fallback com botão "Já Paguei" que realiza polling/consulta direta à API do BB caso o webhook atrase.
- [ ] **PIX-04**: Suporte a ambiente de desenvolvimento (Spring profile `mock-pix`) permitindo simulação completa do pagamento PIX sem requerer credenciais reais do BB.

### Painel Administrativo (ADMIN)
- [ ] **ADMIN-01**: Restrição de rotas e funcionalidades administrativas exclusivamente para o usuário Administrador (Role `ADMIN`).
- [ ] **ADMIN-02**: Interface administrativa para busca de usuários e concessão/extensão manual de acesso gratuito ou status VIP/Lifetime.
- [ ] **ADMIN-03**: Visualização no painel admin da lista de assinaturas ativas, expiradas e histórico de transações PIX.

### Notificações & Histórico (NOTIF)
- [ ] **NOTIF-01**: Exibição de alertas e banners in-app informando os dias restantes da assinatura/trial (com aviso destacado quando restar ≤ 30 dias).
- [ ] **NOTIF-02**: Histórico de pagamentos/faturas PIX acessível na área da conta do usuário.

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAYWALL-01..03 | Pending | Pending |
| PIX-01..04    | Pending | Pending |
| ADMIN-01..03  | Pending | Pending |
| NOTIF-01..02  | Pending | Pending |
