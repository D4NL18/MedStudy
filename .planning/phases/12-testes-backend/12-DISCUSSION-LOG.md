# Phase 12: Backend Tests - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 12-Backend Tests
**Areas discussed:** Estratégia de Testes de Controller, Configuração do JaCoCo, Massa de Dados (Test Data Factory), Prioridade de Módulos

---

## Estratégia de Testes de Controller

| Option | Description | Selected |
|--------|-------------|----------|
| @WebMvcTest | Unitário/Slice: Rápido, isola a camada web, usa @MockBean para services. Perfeito para validação (400). | ✓ |
| @SpringBootTest | Integração: Carrega o contexto completo, usa H2, testa o fluxo real. Mais lento. | ✓ |

**User's choice:** Ambos conforme a necessidade.
**Notes:** Usar @WebMvcTest para velocidade e isolamento em controllers, e @SpringBootTest para fluxos críticos de integração (ex: Auth).

---

## Configuração do JaCoCo

| Option | Description | Selected |
|--------|-------------|----------|
| Apenas Relatório | Gera o HTML mas o build passa mesmo com cobertura baixa. | |
| Bloqueio (Check Goal) | O Maven falha o build se a cobertura for inferior a 80%. | ✓ |

**User's choice:** Bloqueio (Check Goal).
**Notes:** Decidido forçar os 80% de cobertura para garantir a qualidade pré-Go Live.

---

## Massa de Dados (Test Data Factory)

| Option | Description | Selected |
|--------|-------------|----------|
| TestDataFactory | Classe centralizada para criar entidades padrão para testes. | ✓ |
| Local Creation | Cada teste cria seus próprios objetos manuais. | |

**User's choice:** TestDataFactory.
**Notes:** Abordagem centralizada para facilitar a manutenção e manter os testes limpos (DRY).

---

## Prioridade de Módulos

| Option | Description | Selected |
|--------|-------------|----------|
| Segurança -> Core -> Regras | Auth/User -> Sessoes -> Simulados/Aulas -> Flashcards -> Dashboards. | ✓ |
| Algoritmos primeiro | Começar por Flashcards e Revisão. | |

**User's choice:** Preferência do agente (Segurança -> Core -> Regras).
**Notes:** Começar pela base de segurança e dados para estabilizar o sistema antes das agregações complexas.

---

## the agent's Discretion

- Seleção de edge cases para os serviços.
- Estrutura interna da TestDataFactory.
- Divisão de pacotes de testes para manter paridade com o src principal.

## Deferred Ideas

- Testes de Performance e Carga (v2).
- Automação de E2E com ferramentas de browser (Phase 15).
