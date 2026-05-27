# Context: Phase 26 - Tela de Registro de Usuário

## Objective
Estabelecer as decisões de implementação para a criação de conta no MedStudy, integrando com o backend JWT existente e garantindo um fluxo de onboarding sem fricção.

## Decisions Made

1. **Fluxo de Registro vs. Onboarding:**
   - **Decisão:** Opção A (Fricção Baixa).
   - **Detalhes:** A tela principal de registro coletará apenas o essencial: **Nome, Email e Senha**. Os demais campos do perfil (como @handle, Faculdade, Semestre) serão solicitados em uma etapa posterior de "Onboarding" (após o primeiro login), otimizando a conversão.

2. **Confirmação de Email:**
   - **Decisão:** Opção A (Acesso Imediato).
   - **Detalhes:** Após submeter o formulário de registro com sucesso, o usuário já será autenticado (auto-login com JWT) e redirecionado para a plataforma (seja para o Onboarding ou Dashboard), sem a exigência de confirmação via link por e-mail na V1.

3. **Validação de Senha e Termos de Uso:**
   - **Decisão:** Segurança Intermediária e Sem Checkbox de Termos.
   - **Detalhes:** A senha deve ter no mínimo **8 caracteres** e conter, obrigatoriamente, letras **maiúsculas, minúsculas e números** (símbolos não são obrigatórios). A aceitação dos Termos de Uso e Política de Privacidade será feita de forma implícita, com um texto informativo abaixo do botão de registro (ex: "Ao se cadastrar, você concorda com nossos Termos de Uso").

4. **Tratamento de Duplicação (Email já em uso):**
   - **Decisão:** Opção A (Mensagem de Erro Simples).
   - **Detalhes:** Se o usuário tentar se registrar com um e-mail que já existe no banco de dados, uma mensagem de erro inline será exibida na UI sob o campo de e-mail (ex: "Este e-mail já está em uso. Tente fazer login ou recupere sua senha.").

## Technical Constraints & Considerations
- A senha deve ser recebida pelo backend e tratada pelo `PasswordEncoder` (BCrypt) já implementado no Spring Security.
- Como o sistema de Auth já provê tokens JWT, o endpoint de registro deve retornar o par de tokens (`access_token`, `refresh_token`) ou o frontend deve disparar um login em sequência após a criação 201 Created.
- Os erros de validação (como senha fraca ou e-mail duplicado) devem usar o padrão `ProblemDetail` ou padrão de resposta de erro já implementado no backend para capturar erros com consistência.
