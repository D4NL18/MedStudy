# Phase 37 Discussion Log

*This is a historical record of the discussion that produced CONTEXT.md.*

## Area: Fluxo de Preview vs. Aplicar
- **Question:** Como devemos lidar com a confirmação da redistribuição?
- **Options presented:**
  1. (Recomendado) Stateless: Apenas recalculamos na hora de aplicar. É mais simples e a diferença de milissegundos não afeta as datas futuras.
  2. Rascunho Temporário: O preview salva um rascunho temporário (no banco ou Redis) e retorna um ID. Ao efetivar, passamos esse ID. Garante 100% de consistência.
  3. Outra abordagem.
- **User selected:** Rascunho Temporário: O preview salva um rascunho temporário (no banco ou Redis) e retorna um ID. Ao efetivar, passamos esse ID. Garante 100% de consistência.

## Area: Armazenamento de Preferências
- **Question:** Onde devemos salvar o "máximo de revisões por dia" (e futuras preferências de estudo)?
- **Options presented:**
  1. (Recomendado) Nova Entidade `UserSettings`/`UserPreferences`: Criar uma tabela separada (ex: vinculada OneToOne ao User) para as preferências de estudo. Mantém a tabela User limpa para dados de autenticação/perfil.
  2. Adicionar colunas diretamente na tabela `User`: É mais simples e rápido, requerendo apenas uma nova coluna na tabela existente.
  3. Outra abordagem.
- **User selected:** (Recomendado) Nova Entidade `UserSettings`/`UserPreferences`: Criar uma tabela separada (ex: vinculada OneToOne ao User) para as preferências de estudo. Mantém a tabela User limpa para dados de autenticação/perfil.

## Area: Resolução de Conflitos
- **Question:** Se o "máximo de revisões por dia" for pequeno demais para colocar todas as revisões até a "data final" desejada, quem ganha?
- **Options presented:**
  1. (Recomendado) Data Limite ganha: Ultrapassamos o limite diário de revisões se for matematicamente impossível atingir a meta na data escolhida, priorizando o cumprimento do prazo.
  2. Retornar Erro/Aviso: O preview retorna um alerta explicando que é impossível com as configurações atuais e pede para o usuário ajustar o limite diário ou estender o prazo.
  3. Limite Diário ganha: Mantemos o teto diário estrito e, se necessário, o algoritmo joga as revisões além da data limite para não sobrecarregar o usuário.
- **User selected:** Data limite ganha, mas exiba um aviso para o usuário confirmar que aceita o que foi proposto

## Deferred Ideas
*None.*
