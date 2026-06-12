package com.medstudy.backend.core.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Value("${rate.limit.auth:5}")
    private int authLimit;

    @Value("${rate.limit.user:100}")
    private int userLimit;

    @Value("${rate.limit.anonymous:7}")
    private int anonymousLimit;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = request.getRemoteAddr();
        String authorizationHeader = request.getHeader("Authorization");
        
        String key;
        Bucket bucket;
        
        if (request.getRequestURI().startsWith("/api/auth")) {
            key = "auth:" + clientIp;
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(authLimit, Duration.ofMinutes(1)));
        } else if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // Logado
            key = "user:" + authorizationHeader; 
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(userLimit, Duration.ofMinutes(1)));
        } else {
            // Anonimo
            key = "ip:" + clientIp;
            bucket = cache.computeIfAbsent(key, k -> createNewBucket(anonymousLimit, Duration.ofMinutes(1)));
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
