package com.medstudy.backend.modules.subscription.service;

import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.AdminOverrideRequestDto;
import com.medstudy.backend.modules.subscription.dto.AdminPixTransactionDto;
import com.medstudy.backend.modules.subscription.dto.AdminSubscriptionStatsDto;
import com.medstudy.backend.modules.subscription.dto.AdminUserSubscriptionDto;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.PixTransactionRepository;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AdminSubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PixTransactionRepository pixTransactionRepository;
    private final CacheManager cacheManager;

    public AdminSubscriptionService(
        SubscriptionRepository subscriptionRepository,
        PixTransactionRepository pixTransactionRepository,
        CacheManager cacheManager
    ) {
        this.subscriptionRepository = subscriptionRepository;
        this.pixTransactionRepository = pixTransactionRepository;
        this.cacheManager = cacheManager;
    }

    @Transactional(readOnly = true)
    public AdminSubscriptionStatsDto getStats() {
        long activeCount = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);
        long trialCount = subscriptionRepository.countByStatus(SubscriptionStatus.TRIAL);
        long expiredCount = subscriptionRepository.countByStatus(SubscriptionStatus.EXPIRED);
        long lifetimeCount = subscriptionRepository.countByStatus(SubscriptionStatus.LIFETIME);
        BigDecimal totalPixRevenue = pixTransactionRepository.sumTotalPaidRevenue();

        return new AdminSubscriptionStatsDto(
            activeCount,
            trialCount,
            expiredCount,
            lifetimeCount,
            totalPixRevenue != null ? totalPixRevenue : BigDecimal.ZERO
        );
    }

    @Transactional(readOnly = true)
    public Page<AdminUserSubscriptionDto> listUserSubscriptions(String search, SubscriptionStatus status, Pageable pageable) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        Page<Subscription> subscriptions = subscriptionRepository.findWithFilters(cleanSearch, status, pageable);

        return subscriptions.map(s -> new AdminUserSubscriptionDto(
            s.getUser().getId(),
            s.getUser().getName(),
            s.getUser().getEmail(),
            s.getStatus(),
            s.getTrialEndDate(),
            s.getCurrentPeriodEnd(),
            s.isAdminOverride(),
            s.getNotes()
        ));
    }

    @Transactional
    public AdminUserSubscriptionDto overrideUserSubscription(UUID userId, AdminOverrideRequestDto request) {
        if (request == null || request.notes() == null || request.notes().isBlank()) {
            throw new IllegalArgumentException("Justificativa (notes) é obrigatória para alteração manual pelo Admin.");
        }

        Subscription subscription = subscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Assinatura não encontrada para o usuário especificado."));

        Instant now = Instant.now();
        Instant baseDate = (subscription.getCurrentPeriodEnd() != null && subscription.getCurrentPeriodEnd().isAfter(now))
            ? subscription.getCurrentPeriodEnd()
            : now;

        switch (request.option()) {
            case ADD_30_DAYS -> {
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setCurrentPeriodEnd(baseDate.plus(30, ChronoUnit.DAYS));
            }
            case ADD_90_DAYS -> {
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setCurrentPeriodEnd(baseDate.plus(90, ChronoUnit.DAYS));
            }
            case ADD_365_DAYS -> {
                subscription.setStatus(SubscriptionStatus.ACTIVE);
                subscription.setCurrentPeriodEnd(baseDate.plus(365, ChronoUnit.DAYS));
            }
            case GRANT_LIFETIME -> {
                subscription.setStatus(SubscriptionStatus.LIFETIME);
                subscription.setCurrentPeriodEnd(null);
            }
            case FORCE_EXPIRE -> {
                subscription.setStatus(SubscriptionStatus.EXPIRED);
                subscription.setCurrentPeriodEnd(now);
            }
        }

        subscription.setAdminOverride(true);
        subscription.setNotes(request.notes());
        subscriptionRepository.save(subscription);

        // Evict Caffeine Cache
        if (cacheManager != null) {
            org.springframework.cache.Cache cache = cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE);
            if (cache != null) {
                cache.evict(userId);
            }
        }

        return new AdminUserSubscriptionDto(
            subscription.getUser().getId(),
            subscription.getUser().getName(),
            subscription.getUser().getEmail(),
            subscription.getStatus(),
            subscription.getTrialEndDate(),
            subscription.getCurrentPeriodEnd(),
            subscription.isAdminOverride(),
            subscription.getNotes()
        );
    }

    @Transactional(readOnly = true)
    public Page<AdminPixTransactionDto> listPixTransactions(PixStatus status, Pageable pageable) {
        Page<PixTransaction> transactions = pixTransactionRepository.findWithFilters(status, pageable);

        return transactions.map(p -> new AdminPixTransactionDto(
            p.getId(),
            p.getTxid(),
            p.getUser().getEmail(),
            p.getAmount(),
            p.getStatus(),
            p.getCreatedAt(),
            p.getPaidAt(),
            p.getE2eId()
        ));
    }
}
