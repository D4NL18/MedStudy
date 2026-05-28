# Phase 27: Redução de Custos, Paginação & Rate Limiting

## 1. Objetivo
Reduzir a carga de banco de dados, computação e transferência de rede ao mínimo possível (idealmente próximo a zero em uso basal) através da implantação sistemática de paginação severa (blocos de 10), Lazy Loading de relacionamentos e bloqueios antecipados de acessos abusivos (Rate Limit).

## 2. Escopo
- **Backend**: Desativar OSIV, migrar todas as respostas de listas irrestritas para `Page<T>` (via `Pageable`), alterar coleções de entidades Hibernate para `FetchType.LAZY`, aplicar compressão GZIP nas respostas HTTP e introduzir o interceptador de requisições `Bucket4j`.
- **Frontend**: Mudar chamadas HTTP GET para utilizar parâmetros de query string (`page` e `size`), implementar componentes `mat-paginator` da biblioteca Angular Material em tabelas/listas de dados grandes, e adicionar um interceptador global de erros `429 Too Many Requests`.

## 3. Tarefas de Implementação

### 3.1 Infraestrutura e Segurança (Backend)
- [ ] Adicionar a dependência do `Bucket4j` no `pom.xml`.
- [ ] Criar a classe `RateLimitInterceptor` implementando `HandlerInterceptor` para mapear os limites de 50 requests/min (para requisições autenticadas/JWT) e 7 requests/min (para requisições anônimas/login).
- [ ] Registrar o interceptador na classe `WebMvcConfig` ou similar.
- [ ] Modificar `application-prod.yml` para desativar o Open-in-View (`spring.jpa.open-in-view=false`) e ativar a compressão (`server.compression.enabled=true`).

### 3.2 Otimização de JPA e Repositórios (Backend)
- [ ] Varregar pacotes em `entity/` e converter as anotações `@OneToMany` e `@ManyToOne` ausentes para utilizar o atributo `fetch = FetchType.LAZY`.
- [ ] Converter métodos nas interfaces do Spring Data em `repository/` (como `findAll()`) que retornam List para retornar `Page<Entity>` recebendo a abstração `Pageable`.
- [ ] Caso hajam problemas de N+1 residuais ou necessidade de dados cruzados, definir DTO Projections para puxar estritamente as colunas necessárias na view atual.

### 3.3 Controllers Paginados (Backend)
- [ ] Refatorar todos os retornos de coleções nos métodos GET dos controllers de Dashboard, Flashcard, Sessoes e Simulados.
- [ ] Utilizar a anotação `@RequestParam(defaultValue = "0") int page` e `@RequestParam(defaultValue = "10") int size`.
- [ ] Adaptar o DTO Mapping (MapStruct) para iterar no `content` do `Page` e retornar a paginação final.

### 3.4 Modificações Front-end (Angular)
- [ ] Criar / atualizar um Interceptor (`error.interceptor.ts` ou similar) para capturar respotas com status HTTP 429 e acionar o serviço do `MatSnackBar` com mensagem informativa.
- [ ] Ajustar métodos dentro da camada de serviços (ex: `flashcard.service.ts`, `banco.service.ts`) para incluir os parâmetros da QueryString baseados nos atributos de navegação.
- [ ] Mapear as respostas HTTP que retornavam arrays, tipando para esperar o objeto do Spring: `{ content: T[], totalElements: number, totalPages: number }`.
- [ ] Atualizar os Componentes Visuais adicionando o HTML nativo para suportar o `<mat-paginator>` e referenciando os eventos `(page)` para realizar os Fetchs correspondentes da próxima aba.

## 4. Plano de Verificação e Validação
- **Unit & Integration Testing (Backend)**:
  - Garantir que um request que exceda o limite de `Bucket4j` retorne Status 429 nas rotas restritas e abertas.
  - Testar validações de JPA para constatar que queries desnecessárias ("N+1") deixaram de aparecer no log Hibernate.
- **Manual Testing (Frontend)**:
  - Testar o limite forçando excesso de chamadas manuais ou segurando "F5". Validar se o toast / snackbar visualiza corretamente o estado de erro.
  - Carregar uma tela com vários registros e confirmar (Network Panel) se a quantidade de payload diminuiu consideravelmente, recebendo exatos 10 elementos em cache compactado via gzip.
