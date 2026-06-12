# Phase 33 Discussion Log

### 1. Estilo das Animações
- **Opções:** Rápidas e funcionais, Fluidas e elaboradas, Mistas
- **Seleção:** Mistas (Rápidas para navegação/ações, elaboradas para entrada/saída de modais e páginas)

### 2. Skeleton Loaders
- **Opções:** Skeletons Específicos, Skeletons Globais/Genéricos, Misto
- **Seleção:** Misto: Skeletons super detalhados apenas nas telas principais (Dashboard/Feed) e genéricos nas secundárias.

### 3. ChangeDetectionStrategy.OnPush
- **Opções:** Adoção Estrita Completa, Migração Oportunista, Híbrido por Camadas
- **Seleção:** Híbrido por Camadas: Componentes "Dumb/Presentational" 100% OnPush. Componentes "Smart/Containers" podem continuar como Default se a refatoração for muito arriscada.

### 4. Feedback de Interação
- **Opções:** Feedback explícito e marcante, Feedback sutil e focado, Foco exclusivo em estado de carregamento
- **Seleção:** Feedback explícito e marcante (Ondas (ripple), vibração (haptic se possível), botões que mudam visivelmente o tamanho/cor ao clicar)
