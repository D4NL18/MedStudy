package com.medstudy.backend.modules.subscription.service;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.AdminOverrideRequestDto;
import com.medstudy.backend.modules.subscription.dto.AdminSubscriptionStatsDto;
import com.medstudy.backend.modules.subscription.dto.AdminUserSubscriptionDto;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.PixTransactionRepository;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.CacheManager;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminSubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private PixTransactionRepository pixTransactionRepository;

    @Mock
    private CacheManager cacheManager;

    @InjectMocks
    private AdminSubscriptionService adminSubscriptionService;

    @Test
    @DisplayName("Deve calcular estatísticas e receita total PIX com sucesso")
    void getStats_ShouldReturnAggregatedData() {
        when(subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE)).thenReturn(10L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.TRIAL)).thenReturn(5L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED)).thenReturn(2L);
        when(subscriptionRepository.countByStatus(SubscriptionStatus.LIFETIME)).thenReturn(3L);
        when(pixTransactionRepository.sumTotalPaidRevenue()).thenReturn(new BigDecimal("2970.00"));

        AdminSubscriptionStatsDto stats = adminSubscriptionService.getStats();

        assertEquals(10L, stats.activeCount());
        assertEquals(5L, stats.trialCount());
        assertEquals(2L, stats.expiredCount());
        assertEquals(3L, stats.lifetimeCount());
        assertEquals(new BigDecimal("2970.00"), stats.totalPixRevenue());
    }

    @Test
    @DisplayName("Deve realizar override manual concedendo LIFETIME e registrando observações")
    void overrideUserSubscription_GrantLifetime_ShouldUpdateAndEvictCache() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail("john@test.com");

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.TRIAL);

        when(subscriptionRepository.findByUserId(userId)).thenReturn(Optional.of(subscription));

        AdminOverrideRequestDto request = new AdminOverrideRequestDto(
            AdminOverrideRequestDto.OverrideOption.GRANT_LIFETIME,
            "VIP concedido pelo Administrador"
        );

        AdminUserSubscriptionDto result = adminSubscriptionService.overrideUserSubscription(userId, request);

        assertEquals(SubscriptionStatus.LIFETIME, result.status());
        assertTrue(result.isAdminOverride());
        assertEquals("VIP concedido pelo Administrador", result.notes());
        assertNull(result.currentPeriodEnd());

        verify(subscriptionRepository).save(subscription);
    }

    @Test
    @DisplayName("Deve lançar exceção se observações (notes) forem omitidas no override")
    void overrideUserSubscription_MissingNotes_ShouldThrowException() {
        UUID userId = UUID.randomUUID();
        AdminOverrideRequestDto request = new AdminOverrideRequestDto(
            AdminOverrideRequestDto.OverrideOption.ADD_365_DAYS,
            "   "
        );

        assertThrows(IllegalArgumentException.class, () ->
            adminSubscriptionService.overrideUserSubscription(userId, request)
        );
    }
}
