package com.medstudy.backend.core.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = request.getRemoteAddr();
        String authorizationHeader = request.getHeader("Authorization");
        
        String key;
        Bucket bucket;
        
        if (request.getRequestURI().startsWith("/api/auth")) {
            key = "auth:" + clientIp;
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(5, Duration.ofMinutes(1)));
        } else if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Logado: Limite de 100 requests / minuto
            key = "user:" + authorizationHeader; 
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(100, Duration.ofMinutes(1)));
        } else {
            // Anonimo: Limite de 7 requests / minuto
            key = "ip:" + clientIp;
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(7, Duration.ofMinutes(1)));
        }

        if (bucket.tryConsume(1)) {
            return true;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.getWriter().write("Too many requests. Please wait.");
        return false;
    }

    private Bucket createNewBucket(int capacity, Duration refillDuration) {
        Refill refill = Refill.intervally(capacity, refillDuration);
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
