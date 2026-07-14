package com.medstudy.backend.modules.subscription;

import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.subscription.service.SubscriptionSchedulerService;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionSchedulerServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    @InjectMocks
    private SubscriptionSchedulerService subscriptionSchedulerService;

    @BeforeEach
    void setUp() {
        lenient().when(cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE)).thenReturn(cache);
    }

    @Test
    @DisplayName("Should update status to EXPIRED and evict cache for expired subscriptions")
    void processExpiredSubscriptions_ShouldTransitionAndEvictCache() {
        User user = new User();
        user.setId(UUID.randomUUID());

        Subscription sub1 = new Subscription();
        sub1.setUser(user);
        sub1.setStatus(SubscriptionStatus.TRIAL);

        when(subscriptionRepository.findExpiredSubscriptions(any(Instant.class)))
                .thenReturn(List.of(sub1));

        subscriptionSchedulerService.processExpiredSubscriptions();

        assertEquals(SubscriptionStatus.EXPIRED, sub1.getStatus());
        verify(subscriptionRepository).save(sub1);
        verify(cache).evict(user.getId());
    }

    @Test
    @DisplayName("Should do nothing when no subscriptions are expired")
    void processExpiredSubscriptions_NoExpired_DoesNothing() {
        when(subscriptionRepository.findExpiredSubscriptions(any(Instant.class)))
                .thenReturn(List.of());

        subscriptionSchedulerService.processExpiredSubscriptions();

        verify(subscriptionRepository, never()).save(any());
        verify(cache, never()).evict(any());
    }
}
