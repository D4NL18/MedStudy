# Research: Phase 17 — Sincronização de Regras & Normalização

## 1. Normalização Robusta de Strings
Para remover acentos preservando o Case (Title Case), a melhor prática em Java é usar a classe `java.text.Normalizer`.

### Abordagem Técnica
1. Decompor os caracteres usando a forma **NFD** (Normalization Form Canonical Decomposition).
2. Remover as marcas de diacríticos usando a expressão regular `\p{InCombiningDiacriticalMarks}+`.
3. Aplicar o `trim()` e garantir o Title Case no início de cada palavra significativa.

```java
public String normalize(String input) {
    if (input == null) return null;
    String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    return pattern.matcher(normalized).replaceAll("").trim();
}
```

## 2. Algoritmo de Jitter com Load Balancing
O objetivo é evitar o acúmulo de revisões no mesmo dia, espalhando os cards em uma janela de ±10% do intervalo calculado.

### Implementação Sugerida
1. Calcular o `intervaloBase` (ex: 10 dias).
2. Definir a janela de variação (ex: ±1 dia).
3. Consultar o banco de dados (`StudySessionRepository`) para contar quantos cards estão agendados para cada dia dentro da janela `[hoje + 9, hoje + 11]`.
4. Escolher o dia com a **menor carga** de revisões agendadas.
5. Se houver empate, escolher o dia mais próximo do ideal ou aleatório.

## 3. Lógica de Lapse (Anki-style)
Seguindo o padrão de mercado (Anki), um "Lapse" deve penalizar o card para que ele seja visto com mais frequência.

### Regras de Negócio
- **Ease Factor (EF):** Quando o usuário marcar "HARD" pela 3ª vez consecutiva (ou errar um card maduro), o EF deve ser reduzido em **0.20** (20 pontos percentuais). O limite mínimo deve ser **1.30**.
- **Intervalo:** O intervalo deve ser resetado para o estado inicial (1 dia) ou uma fração pequena do intervalo anterior (ex: 20%).
- **Estado:** O card volta para o estado `LEARNING` ou `NEW`.

## 4. Reset de Progresso Granular
Para resetar o progresso de forma eficiente em larga escala sem sobrecarregar a memória do servidor.

### Abordagem Técnica
Usar queries `@Modifying` do Spring Data JPA.

```java
@Modifying(clearAutomatically = true)
@Query("UPDATE Flashcard f SET f.intervaloAtual = 0, f.easeFactor = 2.5, f.dataProximaRevisao = CURRENT_DATE WHERE f.user = :user AND f.grandeArea = :area")
int resetProgressByArea(@Param("user") User user, @Param("area") String area);
```

### Segurança
O frontend deve exigir que o usuário digite a palavra **"RESETAR"** antes de disparar a chamada para o backend.

## 5. Script de Migração SQL
Como os dados existentes podem estar "sujos", será necessário um script SQL de limpeza inicial.

```sql
UPDATE sessao_estudo SET tema = TRIM(tema), grande_area = TRIM(grande_area);
-- Nota: A remoção de acentos em SQL puro varia conforme o dialeto (PostgreSQL unaccent vs H2 regex).
```
