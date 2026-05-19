# Phase 21 Context: PWA & Otimização Final

## Domain
Tornar o sistema instalável e offline-ready (PWA) e otimizar a performance final do bundle para uma experiência premium e rápida.

## Decisions

### 1. Estratégia Offline
- **Assets**: Cache total do App Shell (HTML/CSS/JS, fontes e ícones).
- **Data Caching**: Implementar cache de consulta (read-only) para as APIs mais recentes (ex: lista de flashcards, banco de questões) para permitir visualização básica sem rede.
- **UI**: Adicionar uma tela de "Offline" amigável para quando o usuário tentar acessar dados não cacheados.

### 2. Experiência de Instalação
- **Trigger**: Adicionar um botão "Instalar MedStudy" na barra lateral (Sidebar).
- **Behavior**: O botão deve aparecer apenas se o app for instalável e ainda não estiver instalado (usando o evento `beforeinstallprompt`).

### 3. Atualizações do Aplicativo
- **Strategy**: Atualização silenciosa. O Service Worker baixa a nova versão em background e a aplica automaticamente no próximo recarregamento ou reinicialização do app pelo usuário, sem interromper sessões de estudo ativas.

### 4. Otimização de Bundle
- **Metrics**: Alvo >90 no Google Lighthouse (Performance e PWA).
- **Lazy Loading**: Revisão completa de rotas e módulos para garantir que o código seja carregado sob demanda.

## Canonical Refs
- `frontend/src/manifest.webmanifest` (a ser criado)
- `frontend/ngsw-config.json` (a ser criado)
- `frontend/src/app/core/layout/shell.component.ts` (integração do botão de instalação)

## Deferred Ideas
- [Offline Sync]: Sincronização bidirecional de respostas em modo offline (enviar respostas acumuladas ao recuperar conexão) — Postergar para v1.2 se necessário.
