# Summary: Phase 17 — Sincronização de Regras & Normalização

## 🚀 Trabalho Realizado
A Phase 17 foi concluída com sucesso, focando na integridade dos dados e no refinamento da inteligência de estudo do MedStudy.

### 1. Normalização de Dados (Infraestrutura)
- Implementação da utilidade `StringNormalizer` que utiliza normalização Unicode NFD e regex para remover acentos e garantir Title Case consistente.
- Integração de ganchos `@PrePersist` e `@PreUpdate` nas entidades `StudySession` e `Flashcard`, garantindo que temas e áreas sejam salvos de forma limpa automaticamente.
- Criação de scripts de migração SQL (`V10`, `V11`, `V12`) para normalizar dados existentes e adicionar campos necessários (`urgente`, `consecutive_hard_count`).

### 2. Refinamento do Algoritmo de Estudo
- **Sessões de Estudo:** Atualização dos intervalos de revisão baseados em desempenho:
  - < 50% acerto: 1 dia
  - 50-75% acerto: 3 dias
  - 75-90% acerto: 7 dias
  - > 90% acerto: 15 dias
- **Flashcards (Jitter):** Implementação de Jitter com balanceamento de carga (Load Balancing). O sistema agora escolhe o dia com menor carga de revisões em uma janela de ±10% do intervalo ideal.
- **Flashcards (Lapse):** Implementação de penalidade de `EaseFactor` (-0.20) após o 3º "HARD" consecutivo, forçando o card de volta para o estado de aprendizado.

### 3. Reset de Progresso Granular
- Implementação de API de reset por `grandeArea` usando queries `@Modifying` performáticas.
- Criação de interface de segurança (modal) que exige que o usuário digite **"RESETAR"** para confirmar a ação, prevenindo perdas acidentais de progresso.

## 🧪 Verificação (UAT)
- **Testes Unitários:** `StringNormalizerTest` e `SpacedRepetitionServiceTest` validados com 100% de sucesso.
- **Teste de UI:** Modal de reset validado com proteção de digitação string-match.
- **Migração:** Base de dados atualizada e pronta para novos registros normalizados.

## 📦 Entrega
- Todos os arquivos foram commitados na branch `feat/17-sincronizacao-regras-normalizacao`.
- O sistema está agora mais robusto contra inconsistências de texto e mais inteligente no agendamento de revisões.
