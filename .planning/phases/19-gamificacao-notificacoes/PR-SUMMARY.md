# PR Summary - Phase 19: Gamificação & Notificações

## 🚀 Overview
Esta PR integra o sistema de gamificação e notificações in-app ao MedStudy, fechando a Phase 19 do roadmap v1.1. Foram implementadas funcionalidades de backend para conquista de medalhas, lógica de notificações na navbar e uma nova página de perfil para gerenciamento de conquistas e temas.

## ✨ Changes
### Backend
- **Gamificacao**: Entidade `UserBadge`, `BadgeService` para atribuição automática e `UserBadgeController`.
- **Notificacao**: `NotificationService` para monitoramento de revisões atrasadas e aulas de reforço.
- **Security**: Atualização do `SecurityConfig` para desabilitar CSRF em `/api/**` (otimização para JWT).
- **Migration**: Script V13 para criação das tabelas de gamificação.

### Frontend
- **Dashboard**: Novo widget de "Conquistas" com preview de medalhas (glassmorphism).
- **Navbar**: Ícone de notificações dinâmico com badge de contagem e dropdown de pendências.
- **Perfil**: Página `/perfil` com galeria completa de medalhas e seletor de temas.
- **Global**: Integração do `ToastService` para feedback festivo de conquistas e erros de API.

## 🐛 Bugfixes
- Correção de erro 403 na criação de aulas (CSRF).
- Correção de bug no envio de datas vazias em formulários.
- Melhoria na opacidade de componentes sobrepostos na navbar.

## ✅ Verification
- UAT completo com 100% de sucesso (7/7 testes).
- Build estável.
- Testado localmente com Spring Boot e Angular.

---
**Branch**: `feat/19-gamificacao-notificacoes`
**Target**: `main`
