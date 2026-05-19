# Phase 24: Configurações Granulares de Privacidade - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-19
**Phase:** 24-configuracoes-granulares-de-privacidade
**Areas discussed:** Visibilidade do Perfil, UX de Ocultação, Sincronização Social (Feed/Alertas), Configuração Padrão (Defaults)

---

## 1. Escopo e Limites da Privacidade do Perfil ("Público para amigos" vs "Totalmente Privado")

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Máscara de DTO com tela de privacidade glassmorphic para não-amigos. Mantém busca pública básica ativa. | **✓** |
| Opção B | Ocultação total na busca e erro 403 estrito. | |

**Selected choice:** Opção A
**Notes:** O usuário preferiu manter a busca social básica funcional para permitir conexões orgânicas (localizar por nome/handle para enviar convites). No entanto, não-amigos que acessarem o perfil completo receberão um DTO com dados acadêmicos e estatísticas zeradas e flag `isPrivate = true` para renderização de um overlay glassmorphic de privacidade de alta qualidade.

---

## 2. UX ao Ocultar Dados Granulares (Streak, Faculdade, Questões, Badges)

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Ocultação simples adaptativa (campo some da tela sem deixar lacunas). | **✓** |
| Opção B | Indicador sutil de privacidade (cadeado cinza 🔒). | |

**Selected choice:** Opção A
**Notes:** Decidido pelo visual mais fluido e limpo possível. As informações desativadas pelo usuário não aparecerão para os amigos, ajustando os cartões e layouts de forma transparente.

---

## 3. Sincronização de Privacidade com Notificações Reativas e Feed

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Sincronização completa de backend (silenciamento de notificações reativas e eventos de feed). | **✓** |
| Opção B | Restrição apenas na visualização estática do cartão de perfil. | |

**Selected choice:** Opção A
**Notes:** Garante a conformidade e proteção total de dados (PRIV-02). Se o usuário desativar o compartilhamento do streak ou badges, nenhuma notificação social será gerada ou propagada em tempo real para os amigos no backend.

---

## 4. Valores Padrão (Defaults) de Privacidade para Novos Perfis

| Option | Description | Selected |
|--------|-------------|----------|
| **Opção A** | Perfil iniciado como "Público para amigos" e compartilhamentos ativos por padrão. | **✓** |
| Opção B | Perfil iniciado como "Totalmente Privado" por padrão (Opt-in estrito). | |

**Selected choice:** Opção A
**Notes:** Mantém a proposta de gamificação social fluida, permitindo integração direta pós-onboarding, mas oferecendo o painel de configurações a qualquer momento para personalização de privacidade.
