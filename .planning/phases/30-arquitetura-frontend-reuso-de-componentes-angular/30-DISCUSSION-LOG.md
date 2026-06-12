# Phase 30: Arquitetura Frontend & Reuso de Componentes (Angular) Discussion Log

## Q: Padrão de Reuso de Componentes
- **Options presented:**
  - Criar uma pasta Shared centralizada contendo os componentes reutilizáveis (botões, cards, etc) como Standalone Components
  - Manter componentes em pastas de módulos mas garantir que sejam exportados corretamente para reuso
  - Não tenho preferência, recomende a melhor prática para projetos Angular 18
- **Selected:** Criar uma pasta Shared centralizada contendo os componentes reutilizáveis (botões, cards, etc) como Standalone Components

## Q: Estratégia de Limpeza de Código
- **Options presented:**
  - (Recomendado) Configurar/rodar regras estritas do ESLint para auto-fix e remoção de imports (ex: unused-imports), completando as sobras manualmente
  - Fazer uma varredura estritamente manual arquivo por arquivo para ter controle total, sem confiar em scripts automáticos
- **Selected:** (Recomendado) Configurar/rodar regras estritas do ESLint para auto-fix e remoção de imports (ex: unused-imports), completando as sobras manualmente

## Q: Estrutura de Imports
- **Options presented:**
  - (Recomendado) Configurar path aliases no tsconfig.json (ex: @shared/*, @core/*, @features/*) para evitar "import ../../../../shared/"
  - Manter caminhos relativos para não mexer na configuração padrão do compilador TS
- **Selected:** (Recomendado) Configurar path aliases no tsconfig.json (ex: @shared/*, @core/*, @features/*) para evitar "import ../../../../shared/"
