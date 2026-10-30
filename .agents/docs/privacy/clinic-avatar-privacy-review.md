# Parecer Técnico de Governança e Privacy by Design (LGPD) 🛡️📜

> **Localização Mandatória:** `.agents/docs/privacy/clinic-avatar-privacy-review.md`  
> **Responsável:** Encarregado de Proteção de Dados (DPO) / `lgpd-privacy-expert`  
> **Etapa:** Etapa 2 — Arquitetura, UI Design Plan, Modelagem Segura e Privacy by Design  
> **Feature:** Minha Clínica Médica: Customização de Paredes/Pisos, Fixação Vertical e Avatar Médico Virtual (`US-06`, `US-07`, `P-087`, `P-088`, `P-089`)  
> **Status:** **APROVADO COM DIRETRIZES TÉCNICAS (APPROVED WITH SAFEGUARDS)** ✅

---

## 1. Sumário Executivo & Veredito de Privacidade
Na qualidade de Encarregado de Proteção de Dados (DPO) da plataforma MedStudy, procedemos à auditoria prévia de conformidade regulatória e engenharia de privacidade (*Privacy by Design & by Default*) para as extensões da funcionalidade "Minha Clínica Médica", com enfoque preponderante na modelagem do **Personagem Médico Virtual (Doctor Avatar)** e nas preferências de customização de superfícies (`wall_theme`, `floor_theme`, `placement_type = 'WALL'`).

**Veredito:** O módulo atende integralmente aos preceitos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD) e aos 7 Princípios de Ann Cavoukian. A modelagem proposta preserva a privacidade do estudante, assegura a não-discriminação algorítmica e adota parâmetros padrão (*default*) neutros e seguros.

---

## 2. Inventário e Classificação Jurídico-Técnica de Dados (Art. 5º da LGPD)

| Campo / Atributo | Tipo Técnico | Classificação LGPD | Justificativa Jurídico-Técnica e Descaracterização de Sensibilidade |
| :--- | :--- | :--- | :--- |
| `gender` | `VARCHAR(10)` (`MALE`, `FEMALE`) | **Dado Pessoal Comum (Preferência de Interface / Cosmético)** | **NÃO constitui dado sensível de saúde, identidade civil ou sexualidade (Art. 5º, II da LGPD).** Trata-se estritamente de um seletor cosmético que determina qual conjunto de sprites vetoriais/SVG 2.5D será renderizado no canvas da clínica. O estudante pode alternar livremente entre ambas as bases sem vínculo com seu gênero biológico, registro civil ou documentos. |
| `skin_coat` | `VARCHAR(50)` (ID de catálogo) | **Dado de Gamificação / Inventário** | Registra o identificador do jaleco ou scrub equipado (`coat_intern_white`, `coat_scrubs_navy`, etc.). Dado meramente operacional de personalização de jogo. |
| `skin_stethoscope` | `VARCHAR(50)` (ID de catálogo) | **Dado de Gamificação / Inventário** | Identificador cosmético do modelo de estetoscópio equipado (`steth_classic_black`, etc.). Ausência de dados de saúde. |
| `skin_accessory` | `VARCHAR(50)` (ID de catálogo) | **Dado de Gamificação / Inventário** | Identificador cosmético do acessório equipado (`acc_glasses_classic`, `acc_none`, etc.). |
| `avatar_x`, `avatar_y` | `INTEGER` | **Metadado Funcional / In-Game** | Coordenadas cartesianas discretas na malha isométrica para posicionamento e ordenação de profundidade gráfica (*Painter's Algorithm*). |
| `wall_theme`, `floor_theme` | `VARCHAR(50)` (ID de catálogo) | **Dado Comportamental / Preferência** | Identificador estético de revestimento aplicado ao cenário virtual (`wall_clean_white`, `floor_porcelanato_cinza`). |
| `user_id` | `UUID` | **Dado Pessoal Pseudonimizado** | Chave primária referencial do titular. Sujeito à LGPD, mas pseudonimizado via identificador universal único, segregado de credenciais cadastrais. |

> [!IMPORTANT]
> **Descaracterização Explícita de Sensibilidade (Art. 5º, II):**  
> Fica formalmente atestado que o atributo `gender` do avatar médico virtual **NÃO** é utilizado para catalogar, inferir ou processar dados sobre a vida sexual, orientação sexual, gênero civil ou estado de saúde do usuário estudante. É exclusivamente uma chave de renderização gráfica de videogame/simulação educacional.

---

## 3. Enquadramento Legal (Art. 7º e 11 da LGPD)

1. **Base Legal Aplicável:** **Art. 7º, Inciso V da LGPD — Execução de Contrato e Procedimentos Preliminares**.
   - O tratamento dos dados de personalização da clínica e do avatar médico decorre diretamente dos Termos de Serviço e do Contrato de Licenciamento Educacional pactuado entre o estudante de medicina e a plataforma MedStudy.
   - A gamificação isométrica e a customização de avatares constituem funcionalidades contratuais da plataforma destinadas a engajar a rotina de estudos e fornecer ambientação lúdica sem estresse (*cozy learning*).
   - **Afastamento do Consentimento Específico (Art. 7º, I):** Como o recurso é parte integrante e acessória da prestação dos serviços da plataforma educacional contratada, a coleta de consentimento autônomo é juridicamente dispensável e contraindicada, evitando fadiga de termos e checkboxes supérfluos.
2. **Inaplicabilidade do Art. 11 (Dados Pessoais Sensíveis):**
   - Inexistem dados sensíveis coletados ou processados neste subsistema de avatares e decoração, afastando a exigência de consentimento destacado previsto no Art. 11, I da LGPD.

---

## 4. Auditoria de Princípios de Privacy by Design & LGPD (Art. 6º)

### 4.1. Princípio da Minimização de Dados (Art. 6º, III) — *Anti-Overfetching*
- **Adequação e Necessidade:** Apenas os identificadores mínimos indispensáveis à renderização gráfica são persistidos (`gender`, IDs de skins, coordenadas).
- **Veto a Dados Invasivos:** Fica expressamente vedada a inserção de campos como fotografias do estudante, captura de webcam/biometria facial, tom de pele real via câmera, ou integração com dados de prontuário real do estudante. O avatar opera 100% como sprite pré-fabricado pelo MedStudy.

### 4.2. Princípio da Não-Discriminação (Art. 6º, IX) — *Isolamento Algorítmico*
- **Agnosticismo Pedagógico:** Fica auditado e certificado que a escolha do gênero (`MALE` ou `FEMALE`) e das skins do avatar **NÃO exerce qualquer influência, peso ou viés**:
  1. No motor de agendamento de repetição espaçada (FSRS / Anki);
  2. Na distribuição de questões ou nível de dificuldade dos simulados;
  3. No cálculo de acurácia, estatísticas de proficiência médica ou percentil no ranking geral de estudantes;
  4. Na tarifação ou pontuação de XP base obtida na resolução de atividades.
- O componente de gamificação visual é estritamente desacoplado do motor pedagógico de IA e dos algoritmos de aprendizagem.

### 4.3. Princípio de Privacy by Default (Art. 6º, II) — *Configurações Neutras e Seguras*
- **Provisionamento Inicial Automatizado e Gratuito:**
  - O estudante recebe de fábrica um conjunto inicial neutro, completo e gratuito sem necessidade de consentimentos ou ações prévias:
    - Roupa: `coat_intern_white` (Jaleco Tradicional de Internato);
    - Estetoscópio: `steth_none` / `steth_classic_black`;
    - Acessório: `acc_none`;
    - Superfícies: `wall_clean_white` e `floor_porcelanato_cinza`.
- **Privacidade da Clínica por Padrão:**
  - O estado da clínica e do avatar é visível exclusivamente ao titular autenticado.
  - Não há compartilhamento compulsório em redes sociais, feeds públicos ou rankings externos sem ação deliberada e explícita (*opt-in*) do usuário.
- **Alternância Irrestrita:** O estudante pode alterar o gênero visual do avatar ou suas peças equipadas a qualquer momento, sem ônus, histórico discriminatório ou penalidade de XP.

---

## 5. Avaliação de Gatilho de RIPD / DPIA
- **Conclusão de Dispensa de RIPD Corporativo:** O tratamento dos dados do avatar e das superfícies da clínica:
  - Não envolve dados sensíveis de saúde do titular (Art. 5º, II);
  - Não realiza profiling invasivo ou vigilância sistemática;
  - Não adota decisões automatizadas por IA que produzam efeitos jurídicos ou afetem significativamente os direitos do titular (Art. 20).
- Por conseguinte, este **Parecer Técnico de Privacy by Design** supre formalmente os requisitos de governança e prestação de contas (*Accountability* / Art. 6º, X), dispensando a elaboração de um RIPD/DPIA completo de alto impacto para esta feature.

---

## 6. Diretrizes Técnicas Mandatórias para a Etapa 3 (Desenvolvimento Backend & Frontend)

Para que a implementação na Etapa 3 não incorra em veto no Quality Gate da Etapa 4, o Desenvolvedor e o Tester devem cumprir estritamente as seguintes salvaguardas:

1. **Anti-Overfetching nos Contratos REST (DTOs):**
   - Os endpoints `GET /api/v1/clinic/avatar` e `PUT /api/v1/clinic/avatar` devem trafegar exclusivamente o DTO `DoctorAvatarResponse`:
     - `{ "gender": "...", "skinCoat": "...", "skinStethoscope": "...", "skinAccessory": "...", "avatarX": 0, "avatarY": 0 }`.
   - É **VETO IMEDIATO** se o payload incluir dados do usuário civil (como `fullName`, `email`, `cpf`, `phone`, `passwordHash` ou dados acadêmicos).
2. **Higienização e Anonimização de Logs de Aplicação (Prevenção de Data Leak):**
   - Proibido registrar no log requisições completas com identificação do estudante (`logger.info("Avatar update: " + request)`).
   - Utilizar logs puramente operacionais e parametrizados: `logger.debug("Doctor avatar updated for user [{}]", maskUserId(userId))`.
3. **Isolamento de Inquilino e Mitigação de IDOR (Multi-Tenancy):**
   - O `user_id` da clínica e do avatar DEVE ser extraído obrigatoriamente do token JWT autenticado (via `SecurityContextHolder` no Spring Boot ou `Depends(get_current_user)` no FastAPI).
   - É expressamente proibido aceitar `userId` como parâmetro de rota (`/api/v1/clinic/{userId}/avatar`) ou corpo de requisição com capacidade de mutação, evitando qualquer risco de visualização ou adulteração indevida por terceiros.
4. **Sanitização de Exceções e Respostas de Erro:**
   - Erros de validação (como envio de gênero inválido ou item inexistente) devem ser tratados pelo RestExceptionHandler global, retornando mensagens amigáveis em conformidade com `.agents/rules/security-anti-patterns.md`, sem expor *stacktraces* ou fragmentos de consultas SQL em ambiente de produção.
