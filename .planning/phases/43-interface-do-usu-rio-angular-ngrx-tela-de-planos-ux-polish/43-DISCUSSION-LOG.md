# Phase 43 Discussion Log

This file is for historical reference and human context only. 
**Agents:** Do not read this file. Downstream instructions are locked in CONTEXT.md.

## Area: Experiência de Bloqueio (Paywall)
**Options Presented:**
1. Redirecionar o usuário imediatamente para a página /planos quando receber um 402.
2. Exibir um modal obstrutivo in-place com botão "Ver Planos" (fundo borrado), mantendo-o na rota.
3. Renderizar uma tela de erro ("Acesso Expirado") ocupando a página inteira, substituindo a rota.

**User Selected:**
> Exibir um modal obstrutivo in-place com botão "Ver Planos" (fundo borrado), mantendo-o na rota.

---

## Area: Fluxo de Checkout PIX
**Options Presented:**
1. Abrir um modal / overlay sobre a página de planos contendo o QR Code, "Copia e Cola" e o botão "Já Paguei".
2. Substituir o próprio card do plano (inline) pelas informações do PIX, aproveitando o espaço.
3. Navegar o usuário para uma rota dedicada de checkout (ex: /checkout/pix) focada exclusivamente no pagamento.

**User Selected:**
> Abrir um modal / overlay sobre a página de planos contendo o QR Code, "Copia e Cola" e o botão "Já Paguei".

---

## Area: Posicionamento do Banner de Aviso
**Options Presented:**
1. Banner de alerta no topo do Dashboard e de outras telas (permanente/sticky até ser fechado).
2. Embutido no menu lateral inferior (ex: barra vermelha de aviso próximo às configurações/perfil).
3. Exclusivamente dentro da tela de Conta/Perfil, sem poluir a navegação diária do usuário.

**User Selected:**
> Banner de alerta no topo do Dashboard e de outras telas (permanente/sticky até ser fechado).

---

## Area: Histórico de Pagamentos
**Options Presented:**
1. Como uma aba/seção dedicada dentro das configurações de "Minha Conta" (ex: /conta/assinatura).
2. Na própria página /planos, abaixo dos pacotes oferecidos.
3. Criar um link separado no menu principal apenas para "Faturas/Pagamentos".

**User Selected:**
> no perfil deve ter uma section para pagamentos

---
