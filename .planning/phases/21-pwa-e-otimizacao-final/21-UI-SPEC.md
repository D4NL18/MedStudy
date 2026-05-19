# Phase 21: PWA & Otimização Final - UI Design Contract

## 1. Sidebar Installation Button

### Visão Geral
Um botão persistente mas discreto na barra lateral que incentiva o usuário a instalar o app.

### Design (Glassmorphism)
- **Componente**: `PwaInstallButton`
- **Localização**: Fundo da Sidebar (logo acima do perfil do usuário ou do botão de logout).
- **Ícone**: Lucide `Download` (20px).
- **Texto**: "Instalar MedStudy".
- **Estilo**:
  - `background: rgba(255, 255, 255, 0.05)`
  - `backdrop-filter: blur(10px)`
  - `border: 1px solid rgba(255, 255, 255, 0.1)`
  - `border-radius: 12px`
  - `padding: 12px 16px`
  - `margin: 8px 16px`
  - `display: flex`, `align-items: center`, `gap: 12px`
- **Interações**:
  - **Hover**: `background: rgba(255, 255, 255, 0.12)`, `border-color: rgba(255, 255, 255, 0.25)`.
  - **Active**: Escala `0.98`.
- **Lógica de Exibição**: O botão só deve ser renderizado se o `PwaService.canInstall$` for `true`.

## 2. Interface Offline

### A. Banner de Conexão Perdida
Para rotas que estão exibindo dados cacheados (Freshness timeout).
- **Posição**: Sticky no topo da área de conteúdo principal.
- **Cores**:
  - Fundo: `#FEF9C3` (Amber-100)
  - Texto: `#854D0E` (Amber-900)
- **Texto**: "Conexão perdida. Você está visualizando uma versão offline dos seus estudos."
- **Ícone**: Lucide `WifiOff` (16px).

### B. Tela de Erro Offline (Rotas Não Cacheadas)
Exibida quando o usuário tenta navegar para uma área que não tem dados em cache e não há internet.
- **Layout**: Conteúdo centralizado.
- **Estilo**: Minimalista, seguindo a estética do app.
- **Texto**:
  - Título: "Sem Conexão"
  - Subtítulo: "Esta seção ainda não foi baixada para uso offline."
- **Ação Principal**: Botão "Voltar ao Início" (Dashboard está sempre em cache).

## 3. Feedback de Instalação (SnackBar)

### Sucesso
- **Mensagem**: "MedStudy instalado com sucesso! 🎉"
- **Duração**: 5000ms.
- **Estilo**: Padrão Success do Material (Verde suave).

### Falha/Cancelamento
- **Mensagem**: "A instalação foi cancelada ou falhou. Tente novamente."
- **Duração**: 4000ms.

## 4. Copywriting
- **Botão**: "Instalar MedStudy"
- **Offline Banner**: "Você está visualizando dados offline."
- **Offline View**: "Conteúdo indisponível sem internet."
