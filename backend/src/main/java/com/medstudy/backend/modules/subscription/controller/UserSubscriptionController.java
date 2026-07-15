package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.dto.UserSubscriptionDto;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;
import com.medstudy.backend.modules.subscription.repository.PixTransactionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscriptions/me")
public class UserSubscriptionController {

    private final SubscriptionRepository subscriptionRepository;
    private final PixTransactionRepository pixTransactionRepository;

    public UserSubscriptionController(SubscriptionRepository subscriptionRepository, PixTransactionRepository pixTransactionRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.pixTransactionRepository = pixTransactionRepository;
    }

    @GetMapping
    public ResponseEntity<UserSubscriptionDto> getMySubscription() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<Subscription> subOpt = subscriptionRepository.findByUserId(user.getId());
        if (subOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Subscription sub = subOpt.get();
        UserSubscriptionDto dto = new UserSubscriptionDto(
                sub.getStatus(),
                sub.getTrialEndDate(),
                sub.getCurrentPeriodEnd(),
                sub.getStatus() == com.medstudy.backend.modules.subscription.domain.SubscriptionStatus.LIFETIME
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<PixTransaction>> getMyTransactions() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PixTransaction> transactions = pixTransactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(transactions);
    }
}
