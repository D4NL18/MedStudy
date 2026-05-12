# Research: Phase 18 — Alertas de Performance & Exportação

## 1. Exportação PDF (Flying Saucer + Thymeleaf)
- **Biblioteca:** `org.xhtmlrenderer:flying-saucer-pdf-openpdf:9.1.22`
- **Thymeleaf:** Usado para processar o template HTML com variáveis (incluindo as imagens Base64 dos gráficos).
- **Desafio:** CSS limitado ao 2.1. Flexbox não é suportado. Usar tabelas e floats para layout.

## 2. Exportação CSV
- **Abordagem:** Usar `StringJoiner` para construir as linhas ou `OpenCSV` (`com.opencsv:opencsv:5.9`).
- **Stream:** Para evitar carregar milhares de linhas em memória, podemos usar `PrintWriter` diretamente no `HttpServletResponse` output stream.

## 3. Captura de Gráficos no Frontend
- **Biblioteca:** `html2canvas` ou `dom-to-image`.
- **Fluxo:** 
  1. Localizar o seletor do gráfico.
  2. Gerar o canvas.
  3. `canvas.toDataURL('image/png')`.
  4. Enviar no JSON do POST `/api/export/pdf`.

## 4. Lógica de Alertas (Performance)
- **Reforço:** Query no `StudySessionRepository` calculando `sum(corretas)/sum(feitas)` agrupado por tema nos últimos X dias ou histórico total.
- **Teoria Ineficiente:** Cruzamento entre `Lesson` (watched=true) e `StudySession` (accuracy < 60%).

## 5. UI de Alertas (Angular)
- Usar `MatTooltip` para os avisos.
- Lucide Icons: `zap` (Reforço), `book-x` (Teoria Ineficiente).
