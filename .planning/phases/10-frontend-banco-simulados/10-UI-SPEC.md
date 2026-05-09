# UI-SPEC: Phase 10 - Frontend: Banco de Dados & Simulados

## Visual Specs

### Spacing
- **Container Padding**: 24px (`p-6`) for main feature sections.
- **Filter Bar Gap**: 16px (`gap-4`) between filter elements.
- **Table Row Height**: 64px (`h-16`) fixed height to optimize Virtual Scroll performance.
- **Modal Padding**: 32px (`p-8`) for general modals; 24px (`p-6`) for dense forms.
- **Form Element Spacing**: 16px (`space-y-4`) between form rows; 8px (`gap-2`) between label and input.

### Typography
- **Font Family**: 'Outfit', sans-serif (Global).
- **Headings**: 
  - Section Titles: 24px (`text-2xl`), Semi-bold, color: `var(--color-text)`.
  - Subsection/Form Group Titles: 18px (`text-lg`), Semi-bold, color: `var(--color-accent)`.
- **Table Content**: 14px (`text-sm`), Regular, color: `var(--color-text-muted)`.
- **Form Labels**: 12px (`text-xs`), Uppercase, Bold, color: `var(--color-text-muted)`, tracking-wider.

### Colors
- **Background**: `var(--color-bg)`
- **Surface**: `var(--color-surface)`
- **Accent/Action**: `var(--color-accent)`
- **Glass Effect**: `.glass` class (already defined in `styles.css`).
- **Status Badges**:
  - Success: `bg-success-container` / `text-success` (Greenish).
  - Warning: `bg-warning-container` / `text-warning` (Orangish).
  - Neutral: `bg-surface-variant` / `text-on-surface-variant`.

## Components

### Filter Bar
- **Layout**: Sticky top container, flex-wrap for responsiveness.
- **Elements**: 
  - Dropdowns for "Grande Área" and "Tema".
  - Toggle group or Select for "Desempenho" (<70%, 70-80%, >80%).
  - Search input with leading magnifying glass icon.
- **Interaction**: Real-time filtering with 300ms debounce for text input.

### Infinite Scroll Table
- **Implementation**: `cdk-virtual-scroll-viewport` with `itemSize="64"`.
- **Visuals**: 
  - Transparent header with subtle border-bottom.
  - Rows with hover state (`bg-white/5` or `var(--color-surface)`).
  - Loading spinner at the bottom when fetching next page.
- **Empty State**: Centered illustration or icon with "Nenhuma sessão encontrada" and a primary "Nova Sessão" button.

### CRUD Modals
- **Style**: Glassmorphism (`.glass`) with `backdrop-blur`.
- **Structure**:
  - **Header**: Title (e.g., "Novo Simulado") and Close (X) button.
  - **Body**: Scrollable area (`mat-dialog-content`) for long forms.
  - **Footer**: Actions (Cancel, Save) right-aligned, with primary button for "Save".
- **Simulados Form Layout**:
  - 5 Vertical Sections: Cirurgia, Clínica Médica, Pediatria, Ginecologia e Obstetrícia, Medicina Preventiva.
  - Each section contains a 2-column grid: `[Acertos]` and `[Total Questões]`.
  - Use subtle horizontal dividers between medical areas.

## Copywriting
- **Empty States**: "Você ainda não registrou sessões de estudo. Vamos começar?"
- **Delete Confirmation**: "Deseja mesmo remover este registro? Esta ação é irreversível."
- **Success Messages**: "Sessão salva com sucesso!", "Simulado registrado com sucesso!"
- **Validation Errors**: "O número de acertos não pode ser maior que o total de questões.", "Por favor, preencha todos os campos obrigatórios."

## Design System Integration
- Fully theme-aware using CSS Variables.
- Transitions: 0.3s ease-in-out for all interactions.

## 6 Dimensions Check (Nyquist) - MANDATORY

1. **Layout**: Flex/Grid based, sticky filters, responsive density.
2. **Interaction**: Instant hover feedback, debounced search, smooth modal entry.
3. **Colors**: High contrast, accessible status colors, theme-aware variables.
4. **Spacing**: Consistent 8px grid system.
5. **Typography**: Clear hierarchy using the Outfit font family.
6. **Performance**: Virtual scrolling ensures 60fps even with 1000+ records in the database.
