# Registro de Discussão - Phase 25: Grupos de Competição Automatizados

Este documento registra o alinhamento de requisitos e decisões de design tomadas para a Phase 25.

## Resumo das Decisões de Design

### 1. Métrica de Pontuação do Ranking
- **Métrica**: Configurável pelo criador no momento do setup da competição.
- **Opções**:
  - `TOTAL_QUESTIONS` (`qtsFeitas`): Soma total das questões feitas.
  - `CORRECT_QUESTIONS` (`qtsCorretas`): Apenas a soma de questões corretas.
- **Implementação**: Query nativa calculando o somatório agregado dinamicamente na tabela `study_sessions` dentro da janela do desafio.

### 2. Duelos 1v1 Rápidos
- **Tipos de Duelo**:
  - `DUEL_TARGET` (Corrida): O duelo termina imediatamente quando o primeiro participante alcança o limite de questões (ex: 50 ou 100).
  - `DUEL_TIME` (Janela de Tempo): Tempo fixo (24h, 48h, 72h). O ranking mais alto no deadline vence.
- **Encerramento Automático**: Implementado no listener do backend (`StudySessionService` ao salvar/atualizar sessões), avançando o status da competição para `FINISHED`.

### 3. Modelo de Participação (Convites)
- **Modelo**: Convite formal obrigatório.
- **Fluxo**:
  - Criador seleciona amigos da lista.
  - Participantes convidados entram com status `INVITED`.
  - Disparado alerta in-app (`COMPETITION_INVITE` ou `DUEL_INVITE`).
  - O convidado clica em "Aceitar" para se tornar ativo e começar a pontuar, ou "Recusar" para descartar.

### 4. Layout & Experiência da UI
- **Rota**: Rota dedicada `/competicoes` no menu/drawer.
- **Design**: Visual premium de cartões translúcidos (Glassmorphism), temas em HSL, e efeito 3D flutuante para o Top 3 (Ouro, Prata e Bronze) com avatares e medalhas.
- **Visualização Gráfica**: Gráficos de barras e progresso acumulativo integrando `@swimlane/ngx-charts`.

---
*Homologado e pronto para planejamento técnico.*
