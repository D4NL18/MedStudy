package com.medstudy.backend.modules.subscription.service;

import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Background Scheduler service handling subscription expiration transitions.
 */
@Service
public class SubscriptionSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionSchedulerService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final CacheManager cacheManager;

    public SubscriptionSchedulerService(SubscriptionRepository subscriptionRepository, CacheManager cacheManager) {
        this.subscriptionRepository = subscriptionRepository;
        this.cacheManager = cacheManager;
    }

    /**
     * Runs daily at midnight UTC to find expired subscriptions and mark them EXPIRED.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "UTC")
    @Transactional
    public void processExpiredSubscriptions() {
        Instant now = Instant.now();
        log.info("Starting background scan for expired subscriptions at {}", now);

        List<Subscription> expiredList = subscriptionRepository.findExpiredSubscriptions(now);
        if (expiredList.isEmpty()) {
            log.info("No expired subscriptions found.");
            return;
        }

        log.info("Found {} subscriptions to mark as EXPIRED", expiredList.size());
        Cache cache = cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE);

        for (Subscription subscription : expiredList) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);

            if (cache != null && subscription.getUser() != null) {
                cache.evict(subscription.getUser().getId());
            }
        }

        log.info("Successfully transitioned {} subscriptions to EXPIRED status.", expiredList.size());
    }
}
