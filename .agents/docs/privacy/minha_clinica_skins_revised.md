# Parecer de Governan?a e Privacy by Design: Minha Cl?nica M?dica (US-14)

> **Localiza??o Mandat?ria:** `.agents/docs/privacy/minha_clinica_skins_revised.md`  
> **Autoridade:** Encarregado de Prote??o de Dados / DPO (`privacy_officer.md` / `lgpd-privacy-expert`)  
> **Rastreabilidade:** US-14 (ROADMAP.md) / Regras `[P-096.1]` a `[P-096.6]`  
> **Legisla??o Aplic?vel:** Lei n? 13.709/2018 (Lei Geral de Prote??o de Dados - LGPD)

---

## 1. Escopo e Contexto do Tratamento

A funcionalidade **US-14 (`[P-096]`)** abrange a sincroniza??o de cat?logo de revestimentos de parede e piso (8 op??es can?nicas), corre??o do fluxo cont?bil de compra de superf?cies com XP, expans?o do guarda-roupa do avatar m?dico virtual (22 op??es cosm?ticas homologadas) e renderiza??o param?trica de artes vetoriais sem fallback gen?rico.

Os pontos de contato com o titular s?o:
1. `POST /api/v1/clinic/items/buy`: D?bito de XP e desbloqueio de skins no invent?rio virtual.
2. `PUT /api/v1/clinic/surfaces`: Persist?ncia das superf?cies ativas da cl?nica (`wallTheme`, `floorTheme`).
3. `PUT /api/v1/clinic/avatar`: Persist?ncia das partes cosm?ticas do personagem (`gender`, `coat`, `stethoscope`, `accessory`).
4. `GET /api/v1/clinic/state`: Recupera??o das prefer?ncias e itens desbloqueados do estudante.

---

## 2. Matriz de Classifica??o de Dados e Bases Legais (Art. 7? e 11 da LGPD)

| Dado / Atributo | Natureza T?cnica | Classifica??o LGPD | Base Legal Aplicada | Finalidade Espec?fica e Proporcional |
| :--- | :--- | :--- | :--- | :--- |
| `user_clinics.wall_theme` e `floor_theme` | String alfanum?rica (`wallpaper_geometric_teal`, etc.) | Dado Funcional / Prefer?ncia Est?tica de Interface | **Execu??o de Contrato (Art. 7?, V)** | Garantir a persist?ncia da personaliza??o do ambiente de estudos conforme contratado pelo estudante. |
| `user_doctor_avatar.gender` | Enum (`MALE`, `FEMALE`) | Dado Funcional de Identidade Virtual | **Execu??o de Contrato (Art. 7?, V)** | Renderiza??o da silhueta gr?fica do personagem 2.5D na interface. |
| `user_doctor_avatar.skin_coat`, `skin_stethoscope`, `skin_accessory` | String alfanum?rica de cat?logo (`coat_pediatric_dino`, etc.) | Dado Funcional de Identidade Virtual | **Execu??o de Contrato (Art. 7?, V)** | Representa??o visual do avatar equipado pelo usu?rio. |
| `user_unlocked_skins` (`user_id`, `skin_id`, `unlocked_at`) | Chaves estrangeiras e timestamp de desbloqueio | Hist?rico Transacional Cosm?tico | **Execu??o de Contrato (Art. 7?, V)** e **Leg?timo Interesse (Art. 7?, IX)** | Garantir auditoria de bens virtuais adquiridos, assegurar a titularidade do item e suporte ao usu?rio. |
| `user_xp_transactions` (`amount`, `source`, `balance_after`, `created_at`) | Registro de d?bito/cr?dito cont?bil de gamifica??o | Registro Cont?bil Imut?vel de Estudo | **Execu??o de Contrato (Art. 7?, V)** e **Exerc?cio Regular de Direitos (Art. 7?, VI)** | Rastreabilidade do motor econ?mico de XP, auditoria contra inconsist?ncias e preven??o a fraudes de saldo. |

---

## 3. Avalia??o de Dados Sens?veis e Riscos de Profiling (Art. 11 da LGPD)

1. **Inexist?ncia de Dados Biom?tricos:**
   - O MedStudy n?o utiliza captura de webcam, reconhecimento facial, biometria digital ou escaneamento f?sico para construir o avatar. O personagem ? 100% sintetizado por ilustra??es SVG vetoriais baseadas em op??es pr?-definidas.
2. **Inexist?ncia de Dados Reais de Sa?de:**
   - Embora o contexto seja m?dico e apresente itens como estetosc?pios, jalecos pedi?tricos (`coat_pediatric_dino`) ou pranchetas (`acc_prontuario_clipboard`), trata-se de ambienta??o cenogr?fica de um jogo de estudos (*Cozy Medical Tycoon*). Nenhuma informa??o cl?nica de sa?de, diagn?stico m?dico real ou prontu?rio de pacientes transita no sistema.
3. **Aus?ncia de Decis?es Automatizadas Prejudiciais ou Profiling:**
   - A escolha do avatar e das skins n?o interfere em algoritmos de repeti??o espa?ada, cobran?a de mensalidade, nota de simulados ou concess?o de acessos a conte?dos acad?micos.

---

## 4. Aplica??o dos 7 Princ?pios de Privacy by Design (Ann Cavoukian)

1. **Proativo, n?o Reativo:**
   - Valida??o preventiva de integridade: caso o usu?rio selecione uma skin bloqueada no modal, a UI bloqueia a tentativa e o backend rejeita com HTTP 403, prevenindo transa??es corrompidas.
2. **Privacidade como Padr?o (Privacy by Default):**
   - As skins e a cl?nica do usu?rio s?o privadas por padr?o. Nenhuma prefer?ncia de personaliza??o ? compartilhada publicamente ou exposta a redes sociais sem manifesta??o expl?cita de opt-in.
3. **Privacidade Incorporada ao Design da Arquitetura:**
   - Contratos desacoplados: as requisi??es n?o transportam dados cadastrais do titular (como CPF, nome completo ou e-mail), restringindo-se aos identificadores dos itens de cat?logo (`catalogItemId`).
4. **Funcionalidade Total (Soma-Positiva):**
   - A governan?a de dados n?o prejudica a rica experi?ncia visual; os itens possuem detalhes vetoriais refinados sem demandar coleta de dados adicionais do usu?rio.
5. **Seguran?a de Ponta a Ponta:**
   - Todas as requisi??es trafegam sob TLS 1.3 (HTTPS). O banco de dados opera com controle de integridade referencial e auditoria de transa??es.
6. **Visibilidade e Transpar?ncia:**
   - O saldo de XP e o custo de cada item s?o expostos de forma clara e vis?vel ao estudante antes de qualquer confirma??o de compra, respeitando a transpar?ncia e as diretrizes de prote??o ao consumidor.
7. **Respeito pela Privacidade do Titular (User-Centric):**
   - O titular tem plena autonomia para resetar ou alterar a apar?ncia do seu consult?rio e avatar a qualquer momento entre as op??es que possui.

---

## 5. Diretrizes Obrigat?rias para a Fase de Implementa??o e Code Review (Etapas 3 e 4)

1. **Isolamento de Inquilino e Seguran?a de Sess?o (Anti-IDOR):**
   - Os endpoints `POST /api/v1/clinic/items/buy`, `PUT /api/v1/clinic/surfaces` e `PUT /api/v1/clinic/avatar` NUNCA devem aceitar o `userId` vindo no corpo da requisi??o ou em path parameters livres. O ID do usu?rio DEVE ser injetado exclusivamente pelo framework de seguran?a atrav?s do token JWT validado (`@AuthenticationPrincipal UserPrincipal principal`).
2. **Higiene de Logs (Preven??o a Vazamento de PII):**
   - ? estritamente vedado registrar o objeto da requisi??o completo nos logs da aplica??o (`logger.info("Payload recebido: {}", request)`). Os logs de auditoria cont?bil devem conter apenas dados n?o identific?veis diretamente (ex.: `logger.info("Compra de skin realizada: skinId={}, costXp={}", skinId, costXp)`).
3. **Tratamento de Exce??es Sanitizado:**
   - Em caso de falha de valida??o ou saldo insuficiente, as respostas HTTP 403, 404 e 422 n?o devem vazar stacktraces internos de banco de dados ou schemas de tabelas.

---

## 6. Conclus?o e Parecer do DPO

A feature **US-14** est? em **plena conformidade** com a LGPD e as melhores pr?ticas de Engenharia de Privacidade. O tratamento de dados fundamenta-se validamente no **Art. 7?, V (Execu??o de Contrato)** e n?o envolve dados pessoais sens?veis (Art. 11).

**Parecer do DPO:** **APROVADO**. A esteira est? liberada para prosseguir para a modelagem segura do DBA e a elabora??o dos contratos de API pelo Arquiteto.
