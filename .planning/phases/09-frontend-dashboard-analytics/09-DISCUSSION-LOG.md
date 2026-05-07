# Phase 09 Discussion Log

## Q1: Biblioteca de Gráficos — ng2-charts vs ngx-charts?
- **Options Presented:** ng2-charts (Chart.js/canvas) vs ngx-charts (D3/SVG).
- **User Selection:** ngx-charts
- **Notes:** Selecionado por causa do mapeamento mais fácil com variáveis CSS dinâmicas exigidas pelo sistema de multi-temas (8 cores) da plataforma.

## Q2: Estratégia de Carregamento de Dados (NgRx) — Eager vs Lazy?
- **Options Presented:** Eager (carregar todas as métricas ao acessar dashboard) vs Lazy (carregar aba ativa sob demanda).
- **User Selection:** Lazy
- **Notes:** Otimiza o First Contentful Paint. O dashboard primário será exibido de forma imediata e abas como "Área" e "Tema" só farão fetch de dados ao serem visitadas.

## Q3: Comportamento de Empty States (Usuários Novos) — Placeholder vs Ocultar?
- **Options Presented:** Placeholder/Skeletons (mostrar estrutura vazia com ilustração) vs Ocultar (esconder seção com banner).
- **User Selection:** Placeholder/Skeletons
- **Notes:** Escolha pela Opção A para ajudar a educar o usuário novo sobre onde ele verá seus dados e incentivar a conversão/uso pela primeira vez.

## Q4: Interatividade dos Gráficos — Drill-down ou Visual Apenas?
- **Options Presented:** Visual Apenas vs Interativo (Drill-down guiando ao Banco de Questões).
- **User Selection:** Interativo
- **Notes:** Ao clicar nas partes dos gráficos (ex: uma barra de disciplina), o usuário será guiado à visualização detalhada pré-filtrada na tela de Sessões de Estudo.
