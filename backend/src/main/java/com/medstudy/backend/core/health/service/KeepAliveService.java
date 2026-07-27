package com.medstudy.backend.core.health.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveService {

    private static final Logger log = LoggerFactory.getLogger(KeepAliveService.class);
    
    // Configurar a URL pública da sua API na variável de ambiente KEEP_ALIVE_URL
    // Exemplo: KEEP_ALIVE_URL=https://sua-api.com/api/health/ping
    @Value("${KEEP_ALIVE_URL:${app.keep-alive.url:}}")
    private String keepAliveUrl;
    
    private final RestTemplate restTemplate;

    public KeepAliveService() {
        this.restTemplate = new RestTemplate();
    }

    // Executa a cada 14 minutos (840.000 milissegundos) para evitar que o servidor hiberne
    @Scheduled(fixedRate = 840000)
    public void ping() {
        if (keepAliveUrl != null && !keepAliveUrl.isEmpty()) {
            try {
                log.info("Executando ping de keep-alive para evitar cold start na URL: {}", keepAliveUrl);
                restTemplate.getForObject(keepAliveUrl, String.class);
                log.info("Ping executado com sucesso.");
            } catch (Exception e) {
                log.warn("Falha ao executar ping de keep-alive: {}", e.getMessage());
            }
        } else {
            log.info("Ping de keep-alive ignorado. A variável 'KEEP_ALIVE_URL' não está configurada.");
        }
    }
}
