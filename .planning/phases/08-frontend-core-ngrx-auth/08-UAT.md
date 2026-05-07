---
status: testing
phase: 08-frontend-core-ngrx-auth
source: [08-SUMMARY.md]
started: 2026-05-07T12:53:00Z
updated: 2026-05-07T12:53:00Z
---

## Current Test

number: 5
name: Troca Dinâmica de Temas
expected: |
  No Dashboard, ao clicar nos botões de tema, a cor da interface (primária, fundo, etc.) deve mudar instantaneamente em toda a aplicação.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: O servidor backend deve estar rodando (localhost:8080) e o frontend deve compilar e carregar a página de login sem erros no console.
result: pass

### 2. Interface Premium (Login)
expected: A tela de login deve exibir o efeito de Glassmorphism (card translúcido) e o fundo com gradientes "mesh" animados. As fontes devem ser modernas (Outfit).
result: pass

### 3. Fluxo de Autenticação: Sucesso
expected: Inserir e-mail e senha válidos deve redirecionar o usuário para o `/dashboard`. O token deve estar visível no LocalStorage.
result: pass

### 4. Fluxo de Autenticação: Falha
expected: Inserir credenciais inválidas deve exibir uma mensagem de erro visual (badge vermelha) vinda do backend, sem travar a aplicação.
result: pass

### 5. Troca Dinâmica de Temas
expected: No Dashboard, ao clicar nos botões de tema, a cor da interface (primária, fundo, etc.) deve mudar instantaneamente em toda a aplicação.
result: pass

### 6. Proteção de Rotas (AuthGuard)
expected: Tentar acessar o `/dashboard` diretamente sem estar logado deve resultar em um redirecionamento automático para a página de `/login`.
result: pass

### 7. Injeção de JWT (Interceptor)
expected: Todas as requisições para a API (ex: no dashboard) devem incluir o cabeçalho "Authorization: Bearer <token>".
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
