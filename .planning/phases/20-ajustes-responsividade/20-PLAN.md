# Plano de Execução - Phase 20: Ajustes de Responsividade

## Objetivos
1. Adaptar o Dashboard para resoluções menores (Mobile/Tablet).
2. Refatorar a Navbar para uso em telas pequenas.
3. Ajustar a Galeria de Badges e Página de Perfil.
4. Otimizar tabelas de dados para visualização mobile.

## 🛠️ Tarefas

### 1. Dashboard Responsivo
- [ ] **CSS**: Adicionar breakpoint em 1200px para layout de 2 colunas.
- [ ] **CSS**: Adicionar breakpoint em 768px para layout de 1 coluna (empilhamento vertical).
- [ ] **UI**: Ajustar tamanhos de fonte e padding dos widgets.

### 2. Navbar e Notificações
- [ ] **Component**: Implementar menu hambúrguer para esconder links em telas < 992px.
- [ ] **CSS**: Ajustar posicionamento do dropdown de notificações (centralizado no mobile).
- [ ] **UI**: Aumentar áreas de toque (touch targets) nos ícones.

### 3. Perfil e Galeria
- [ ] **Grid**: Ajustar `grid-template-columns` da galeria de badges para ser auto-fit.
- [ ] **Layout**: Empilhar avatar e informações do usuário no mobile.

### 4. Tabelas e Listas
- [ ] **CSS**: Implementar `overflow-x: auto` com custom scrollbar para tabelas grandes.
- [ ] **UI**: Em telas muito pequenas, considerar mudar tabelas para visualização em "Cards".

---

## 🔍 Verificação
1. Abrir Chrome DevTools e testar em: iPhone 14, iPad Air e 1080p.
2. Verificar se o Dropdown de notificações é utilizável no mobile.
3. Garantir que o botão "Nova Aula" não sobreponha outros elementos.
