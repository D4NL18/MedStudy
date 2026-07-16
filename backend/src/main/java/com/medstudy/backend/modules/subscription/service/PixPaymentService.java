package com.medstudy.backend.modules.subscription.service;

import com.medstudy.backend.core.config.CacheConfig;
import com.medstudy.backend.modules.subscription.client.PixClient;
import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.PixTransactionRepository;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class PixPaymentService {

    public static final BigDecimal ANNUAL_PRICE = new BigDecimal("297.00");
    public static final int DEFAULT_EXPIRATION_SECONDS = 900; // 15 minutos

    private final PixTransactionRepository pixTransactionRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PixClient pixClient;
    private final CacheManager cacheManager;

    @org.springframework.beans.factory.annotation.Value("${app.premium-price:49.90}")
    private BigDecimal annualPrice;

    public PixPaymentService(
        PixTransactionRepository pixTransactionRepository,
        SubscriptionRepository subscriptionRepository,
        PixClient pixClient,
        CacheManager cacheManager
    ) {
        this.pixTransactionRepository = pixTransactionRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.pixClient = pixClient;
        this.cacheManager = cacheManager;
    }

    @Transactional
    public PixResponseDto generatePixCharge(User user) {
        PixResponseDto pixResponse = pixClient.createImmediateCharge(user, annualPrice, DEFAULT_EXPIRATION_SECONDS);

        PixTransaction transaction = new PixTransaction();
        transaction.setTxid(pixResponse.txid());
        transaction.setUser(user);
        transaction.setAmount(annualPrice);
        transaction.setPixCopiaECola(pixResponse.pixCopiaECola());
        transaction.setStatus(PixStatus.CREATED);
        transaction.setExpirationDate(pixResponse.expirationDate());
        pixTransactionRepository.save(transaction);

        return pixResponse;
    }

    @Transactional
    public boolean processPaymentSuccess(String txid, String endToEndId, Instant paidAt) {
        Optional<PixTransaction> txOpt = pixTransactionRepository.findByTxid(txid);
        if (txOpt.isEmpty()) {
            return false;
        }

        PixTransaction transaction = txOpt.get();
        if (transaction.getStatus() == PixStatus.PAID) {
            return true; // Idempotência
        }

        transaction.setStatus(PixStatus.PAID);
        transaction.setE2eId(endToEndId);
        transaction.setPaidAt(paidAt != null ? paidAt : Instant.now());
        pixTransactionRepository.save(transaction);

        User user = transaction.getUser();
        Subscription subscription = subscriptionRepository.findByUserId(user.getId())
            .orElseGet(() -> {
                Subscription sub = new Subscription();
                sub.setUser(user);
                return sub;
            });

        Instant now = Instant.now();
        Instant baseDate = now;

        if (subscription.getCurrentPeriodEnd() != null && subscription.getCurrentPeriodEnd().isAfter(now)) {
            baseDate = subscription.getCurrentPeriodEnd();
        } else if (subscription.getTrialEndDate() != null && subscription.getTrialEndDate().isAfter(now)) {
            baseDate = subscription.getTrialEndDate();
        }

        Instant newEnd = baseDate.plus(365, ChronoUnit.DAYS);
        subscription.setCurrentPeriodEnd(newEnd);
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(subscription);

        // Evict Caffeine Cache
        if (cacheManager != null) {
            org.springframework.cache.Cache cache = cacheManager.getCache(CacheConfig.SUBSCRIPTION_STATUS_CACHE);
            if (cache != null) {
                cache.evict(user.getId());
            }
        }

        return true;
    }

    @Transactional
    public PixStatusResponseDto checkAndRefreshPaymentStatus(String txid) {
        Optional<PixTransaction> txOpt = pixTransactionRepository.findByTxid(txid);
        if (txOpt.isEmpty()) {
            return new PixStatusResponseDto(txid, PixStatus.CANCELLED, null, "Transação não encontrada");
        }

        PixTransaction transaction = txOpt.get();
        Instant now = Instant.now();
        LocalDateTime nowLdt = LocalDateTime.now();

        if (transaction.getStatus() == PixStatus.PAID) {
            return new PixStatusResponseDto(txid, PixStatus.PAID, transaction.getPaidAt(), "Pagamento confirmado");
        }

        if (transaction.getStatus() == PixStatus.EXPIRED) {
            return new PixStatusResponseDto(txid, PixStatus.EXPIRED, null, "Cobrança expirada");
        }

        // Checar se já passou do tempo de validade
        if (transaction.getExpirationDate() != null && now.isAfter(transaction.getExpirationDate())) {
            transaction.setStatus(PixStatus.EXPIRED);
            pixTransactionRepository.save(transaction);
            return new PixStatusResponseDto(txid, PixStatus.EXPIRED, null, "Cobrança expirada");
        }

        // Rate limit de 5 segundos entre consultas manuais
        if (transaction.getUpdatedAt() != null && transaction.getUpdatedAt().plusSeconds(5).isAfter(nowLdt)) {
            return new PixStatusResponseDto(
                txid,
                transaction.getStatus(),
                transaction.getPaidAt(),
                "Aguarde 5 segundos entre consultas"
            );
        }

        // Consulta direta à API do gateway (fallback "Já Paguei")
        PixStatusResponseDto remoteStatus;
        try {
            remoteStatus = pixClient.getChargeStatus(txid);
        } catch (Exception e) {
            transaction.setUpdatedAt(nowLdt);
            pixTransactionRepository.save(transaction);
            return new PixStatusResponseDto(txid, transaction.getStatus(), null, "Aguardando confirmação de pagamento (rate limit)");
        }
        
        if (remoteStatus.status() == PixStatus.PAID) {
            processPaymentSuccess(txid, "FALLBACK_" + UUID.randomUUID().toString().substring(0, 8), now);
            return new PixStatusResponseDto(txid, PixStatus.PAID, now, "Pagamento confirmado via consulta direta");
        }

        transaction.setUpdatedAt(nowLdt);
        pixTransactionRepository.save(transaction);

        return new PixStatusResponseDto(txid, transaction.getStatus(), null, "Aguardando confirmação de pagamento");
    }
}

