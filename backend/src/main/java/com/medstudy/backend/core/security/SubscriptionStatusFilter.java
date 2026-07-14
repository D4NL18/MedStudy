package com.medstudy.backend.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Filter that enforces Freemium Paywall rules.
 * Intercepts authenticated requests and blocks access with HTTP 402 Payment Required
 * if the user's trial or subscription has expired.
 */
@Component
public class SubscriptionStatusFilter extends OncePerRequestFilter {

    private final SubscriptionRepository subscriptionRepository;
    private final CacheManager cacheManager;
    private final ObjectMapper objectMapper;

    public SubscriptionStatusFilter(
            ObjectProvider<SubscriptionRepository> subscriptionRepositoryProvider,
            ObjectProvider<CacheManager> cacheManagerProvider,
            ObjectProvider<ObjectMapper> objectMapperProvider
    ) {
        this.subscriptionRepository = subscriptionRepositoryProvider.getIfAvailable();
        this.cacheManager = cacheManagerProvider.getIfAvailable();
        this.objectMapper = objectMapperProvider.getIfAvailable(ObjectMapper::new);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/subscriptions/")
                || path.startsWith("/api/admin/")
                || path.startsWith("/api/webhooks/")
                || path.startsWith("/swagger-ui/")
                || path.startsWith("/v3/api-docs/")
                || path.equals("/swagger-ui.html");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (subscriptionRepository != null && authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof User user) {
            // Admins are exempt from paywall
            if ("ROLE_ADMIN".equals(user.getRole())) {
                filterChain.doFilter(request, response);
                return;
            }

            Instant now = Instant.now();
            boolean active = isSubscriptionActiveWithCache(user, now);

            if (!active) {
                response.setStatus(HttpServletResponse.SC_PAYMENT_REQUIRED); // HTTP 402
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");

                Map<String, Object> errorDetails = new HashMap<>();
                errorDetails.put("code", "PAYWALL_REQUIRED");
                errorDetails.put("message", "Assinatura ou período de teste expirado");
                errorDetails.put("expiredAt", now.toString());
                errorDetails.put("status", SubscriptionStatus.EXPIRED.name());

                response.getWriter().write(objectMapper.writeValueAsString(errorDetails));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isSubscriptionActiveWithCache(User user, Instant now) {
        Cache cache = cacheManager != null ? cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE) : null;
        if (cache != null) {
            Boolean cachedValue = cache.get(user.getId(), Boolean.class);
            if (cachedValue != null) {
                return cachedValue;
            }
        }

        Subscription subscription = subscriptionRepository != null ? subscriptionRepository.findByUserId(user.getId()).orElse(null) : null;
        boolean isActive = subscription != null && subscription.isCurrentlyActive(now);

        if (cache != null) {
            cache.put(user.getId(), isActive);
        }

        return isActive;
    }
}
