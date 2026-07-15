package com.medstudy.backend.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionStatusFilterTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private SubscriptionStatusFilter subscriptionStatusFilter;
    private ObjectMapper objectMapper;

    @Mock
    private ObjectProvider<SubscriptionRepository> subscriptionRepositoryProvider;

    @Mock
    private ObjectProvider<CacheManager> cacheManagerProvider;

    @Mock
    private ObjectProvider<ObjectMapper> objectMapperProvider;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        lenient().when(subscriptionRepositoryProvider.getIfAvailable()).thenReturn(subscriptionRepository);
        lenient().when(cacheManagerProvider.getIfAvailable()).thenReturn(cacheManager);
        lenient().when(objectMapperProvider.getIfAvailable(any())).thenReturn(objectMapper);
        subscriptionStatusFilter = new SubscriptionStatusFilter(subscriptionRepositoryProvider, cacheManagerProvider, objectMapperProvider);
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should skip filtering for auth, subscriptions, and swagger endpoints")
    void shouldNotFilter_ExemptPaths_ReturnsTrue() throws ServletException {
        when(request.getRequestURI()).thenReturn("/api/auth/login");
        assertTrue(subscriptionStatusFilter.shouldNotFilter(request));

        when(request.getRequestURI()).thenReturn("/api/subscriptions/plans");
        assertTrue(subscriptionStatusFilter.shouldNotFilter(request));

        when(request.getRequestURI()).thenReturn("/swagger-ui/index.html");
        assertTrue(subscriptionStatusFilter.shouldNotFilter(request));
    }

    @Test
    @DisplayName("Should pass through when request is not authenticated")
    void doFilterInternal_NotAuthenticated_CallsFilterChain() throws ServletException, IOException {
        subscriptionStatusFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    @DisplayName("Should pass through when user has active trial")
    void doFilterInternal_ActiveTrial_CallsFilterChain() throws ServletException, IOException {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setRole("ROLE_USER");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
        );

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.TRIAL);
        subscription.setTrialStartDate(Instant.now());
        subscription.setTrialEndDate(Instant.now().plus(30, ChronoUnit.DAYS));

        when(cacheManager.getCache(any())).thenReturn(cache);
        when(subscriptionRepository.findByUserId(user.getId())).thenReturn(Optional.of(subscription));

        subscriptionStatusFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    @DisplayName("Should return HTTP 402 with PAYWALL_REQUIRED JSON when subscription is expired")
    void doFilterInternal_ExpiredSubscription_Returns402PaymentRequired() throws ServletException, IOException {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setRole("ROLE_USER");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities())
        );

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscription.setTrialEndDate(Instant.now().minus(5, ChronoUnit.DAYS));

        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        when(cacheManager.getCache(any())).thenReturn(cache);
        when(subscriptionRepository.findByUserId(user.getId())).thenReturn(Optional.of(subscription));

        subscriptionStatusFilter.doFilterInternal(request, response, filterChain);

        verify(response).setStatus(HttpServletResponse.SC_PAYMENT_REQUIRED);
        verify(filterChain, never()).doFilter(request, response);

        String jsonResponse = stringWriter.toString();
        assertTrue(jsonResponse.contains("PAYWALL_REQUIRED"));
        assertTrue(jsonResponse.contains("EXPIRED"));
    }
}
