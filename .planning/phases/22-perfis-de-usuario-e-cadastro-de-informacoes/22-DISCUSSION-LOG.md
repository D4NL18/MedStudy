# Phase 22: Perfis de Usuário & Cadastro de Informações - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 22-perfis-de-usuario-e-cadastro-de-informacoes
**Areas discussed:** Validação do Handle, Escolha de Avatares, Preenchimento da Faculdade, Fluxo de Onboarding

---

## Validação e Estrutura do Handle (@username)

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Validação "On-the-fly" com debounce em tempo real | ✓ |
| Opção B | Validação no submit final ao clicar em salvar | |

**User's choice:** Opção A
**Notes:** O usuário optou pela validação em tempo real para proporcionar uma UX fluida e evitar frustrações com erros tardios no envio do formulário.

---

## Armazenamento e Escolha de Avatares/Fotos

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Galeria com 50+ presets médicos em SVG premium (offline-friendly) | ✓ |
| Opção B | Upload de imagem real (jpg/png) persistido no backend | |

**User's choice:** Opção A, mas com requisito de variedade estendida (mínimo de 50 presets cobrindo especialidades médicas reais).
**Notes:** O usuário adorou os benefícios de segurança e suporte offline dos presets, mas exigiu uma biblioteca bem variada e lúdica de especialidades médicas (Pediatria, Cirurgia, Cardio, etc.) para que todos se identifiquem.

---

## Preenchimento da Faculdade/Instituição de Ensino

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Autocomplete filtrável a partir de uma lista padronizada real | ✓ |
| Opção B | Campo tradicional de texto livre aberto | |

**User's choice:** Opção A
**Notes:** A opção padronizada foi preferida para garantir consistência e limpeza dos dados de instituições na base de dados, permitindo rankings consolidados confiáveis no futuro.

---

## Fluxo de Onboarding (Primeiro Acesso)

| Option | Description | Selected |
|--------|-------------|----------|
| Opção A | Modal de onboarding obrigatório que barra acessos anônimos | ✓ |
| Opção B | Banner de aviso sutil no topo do Dashboard | |

**User's choice:** Opção A
**Notes:** Garante que todos os usuários ativos do sistema fiquem com perfil preenchido e `@handle` configurado no banco de dados, enriquecendo o valor da interação social posterior.
