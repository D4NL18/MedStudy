# Phase 21 Research: PWA & Otimização Final

## 1. Angular Service Worker (v21) Configuration

### API Caching with `dataGroups`
Para atender ao requisito de "Cache de Consulta (Read-only)", utilizaremos a seção `dataGroups` no `ngsw-config.json`.
- **Estratégia**: `freshness`. Esta é uma estratégia network-first. Tenta a rede primeiro e, se falhar ou atingir o timeout, recorre ao cache.
- **Exemplo de Configuração**:
  ```json
  "dataGroups": [
    {
      "name": "api-performance",
      "urls": ["/api/**"],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1d",
        "timeout": "5s",
        "strategy": "freshness"
      }
    }
  ]
  ```
- **Página Offline Amigável**: 
  - O Angular SW não redireciona automaticamente em caso de falha de rede por padrão.
  - **Padrão**: Implementar um `OfflineComponent` e um `HttpInterceptor` global ou um serviço que escute o `navigator.onLine`. Se uma requisição falhar e o usuário estiver offline, navegar para `/offline`.
  - Garantir que a rota `/offline` esteja pré-cacheada no `assetGroups`.

## 2. PWA Manifest (`manifest.webmanifest`)

### Requisitos de Instalabilidade
- **Display**: `standalone` ou `minimal-ui`.
- **Ícones**: Pelo menos 192x192 e 512x512 em formato PNG.
- **Start URL**: `/` ou `/index.html`.
- **Theme Color**: Deve corresponder à cor primária do app para uma experiência coesa.
- **Background Color**: Usada para a splash screen.

## 3. Botão de Instalação Personalizado

### Manipulação de `beforeinstallprompt`
O navegador dispara este evento quando o PWA é elegível para instalação.
- **Implementação**:
  1. Criar um `PwaService` que escute `window.addEventListener('beforeinstallprompt', ...)`.
  2. Prevenir o comportamento padrão para ocultar a mini-barra do navegador.
  3. Armazenar o objeto do evento no serviço.
  4. Expor um observable `isInstallable$` para o componente Sidebar.
  5. Na Sidebar, mostrar o botão "Instalar MedStudy" apenas quando `isInstallable$` for true.
  6. Ao clicar, chamar `deferredPrompt.prompt()` e tratar o resultado.

## 4. Otimização de Bundle

### Técnicas para Angular v21
- **Audit de Lazy Loading**: Garantir que os módulos de funcionalidades (Banco, Aulas, Analytics) sejam carregados via `loadChildren`.
- **Build de Produção**: `ng build --configuration production`.
- **Flags de Otimização**: Garantir `optimization`, `buildOptimizer` e `vendorChunk: false` (padrão no v21).
- **Otimização de Assets**: Comprimir imagens, usar WebP onde possível.
- **Critérios Lighthouse (>90)**:
  - HTTPS obrigatório.
  - Manifest + Service Worker válidos.
  - Performance: LCP < 2.5s, FID < 100ms, CLS < 0.1.
  - Redirecionamento HTTP para HTTPS.
  - Meta tags mobile (theme-color, viewport).

## 5. Atualizações do App (Silenciosas)

- **Comportamento**: O Angular SW baixa atualizações em segundo plano. A nova versão é ativada no próximo recarregamento total.
- **Ação**: NÃO chamar `SwUpdate.activateUpdate()` seguido de `window.location.reload()` automaticamente para evitar interrupções. Deixar que ocorra naturalmente na próxima abertura.

## Landmines & Trade-offs

- **Landmine**: O Service Worker cacheia apenas requisições `GET`. Chamadas de API usando `POST` (mesmo que sejam apenas para leitura) não serão cacheadas.
- **Landmine**: O Chrome exige um gesto do usuário (clique) para disparar o prompt de instalação.
- **Trade-off**: A estratégia `freshness` adiciona um pequeno atraso (timeout) quando offline antes de mostrar os dados cacheados.
