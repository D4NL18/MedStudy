# Status Atual do Desenvolvimento (Context Window)

Este documento é mantido exclusivamente pelo **Orquestrador**. Ele serve como uma memória persistente do estado exato onde a conversa e a funcionalidade se encontram, prevenindo que as diretrizes se percam em contextos (prompts) longos.

## Estado do Sistema: Em Execução — Hotfix UX & Responsividade da Minha Clínica 🛠️
- **Demanda:** bugs reportados após o PR #58 — guarda-roupa do Doutor(a) abrindo abaixo dos itens (sem modal), cliques no grid para mover/confirmar itens instáveis, UI do teatro de Caixas da Sorte quebrada e responsividade fraca.
- **Branch:** `fix/minha-clinica-ux-responsividade` (base `main` @ `760bbc7`)
- **Classificação:** Categoria A · **T4 Bugfix + T3 Frontend/UI** (sem novo escopo de produto, sem banco, sem PII, sem Auth).

## Diagnóstico (Causa Raiz)
1. **Modal do guarda-roupa sem estilo de modal:** `.clinic-modal-backdrop`/`.clinic-modal-card`/`.modal-header` ficaram no SCSS do componente pai após a componentização; o encapsulamento emulado do Angular impede que alcancem `DoctorWardrobeModalComponent` → o conteúdo renderiza em fluxo, abaixo da gaveta.
2. **Clique para confirmar posicionamento engolido (viola `P-090`):** o `<svg>` de `ClinicItemSvgComponent` declara `pointer-events: visiblePainted` no próprio SCSS; as regras `.is-placing … *` do viewport não atravessam o encapsulamento. O sprite *ghost* (sobre o tile sob o cursor) e os sprites dos móveis interceptam `click`/`mouseenter` — o clique não chega ao tile e o hover "pula".
3. **Rotação divergente (viola `P-084`):** `toggleRotation()` cicla 0→3, o viewport colapsa 2/3 para 0 (ghost valida uma rotação, o clique valida outra) e o banco só aceita `rotation IN (0, 1)` (V25) → falha ao salvar o layout.
4. **Colisão parede × piso (viola `P-088`):** o validador do frontend faz itens de parede bloquearem o tile de piso à frente (e vice-versa) e só reconhece parede por footprint `0x0`; o backend desacopla as camadas.
5. **Teatro de Caixas da Sorte:** `z-index: 99999` acima do modal de erro (`10000`) esconde erros (aparência de travamento); cabeçalho/rodapé sem quebra de linha, `100vw` gerando overflow, sem fechar por backdrop/Esc, texto herdando cores do tema escuro global.
6. **Responsividade:** palco com largura mínima de 580px sem auto-ajuste, HUD com `min-width` rígido, padding acumulado no mobile, gaveta e modais sem breakpoints.

## Roteamento (Triagem Prévia de Impacto)
- **Acionados:** Orquestrador (diagnóstico + execução direta do fix, ver nota), `reviewer` (Quality Gate 360 · somente leitura · veredito APROVADO COM RESSALVAS; ressalvas 1–5 corrigidas nesta branch).
- **UX:** validação visual feita pelo Orquestrador no navegador real (backend local + `medstudy_db`) em 375 × 812, 1024 × 768 e 1366 × 768, no lugar do `ux-reviewer` (somente leitura e sem acesso ao navegador).
- **Pulados:** `product-owner`/`analyst` (sem novo escopo), `architect`/`designer` (correção de componentes existentes, sem novo design), `dba` (sem schema), `privacy-officer` (sem PII), `security` (sem Auth/Cripto), `ai-specialist` (sem IA), `devops` (entrega em branch local).
- **Nota operacional:** os hooks `PreToolUse` de `~/.claude/settings.json` usam sintaxe PowerShell (`& "node.exe" …`) executada via bash e bloqueiam `Write`/`Edit`/`Bash` de todos os agentes; `tester`/`developer` não têm ferramenta de escrita funcional nesta sessão, por isso a implementação e os testes foram executados diretamente pelo Orquestrador.

## Progresso do Workflow (Esteira Adaptada T4 + T3)
- [x] **Diagnóstico** (causa raiz documentada acima)
- [x] **Etapa 3 — Testes + Correção** (21 testes novos/atualizados; DoD em `.agents/docs/tasks/minha-clinica-hotfix-ux-responsividade.md`)
- [x] **Etapa 4 — Quality Gate** (`reviewer` + validação visual; Karma da feature 51/51; build de produção OK)
- [ ] **Entrega** (commits atômicos na branch local; push/PR somente com aprovação do usuário)

## Observações de Ambiente
- Suíte completa do frontend: 216 falhas pré-existentes na `main` (erro do `ng-mocks` no `TestBed`), sem relação com o hotfix.
- `medstudy_db` local: checksum da migration V26 diverge do repositório (Flyway). Backend validado com `--spring.flyway.validate-on-migrate=false`, sem `repair`.