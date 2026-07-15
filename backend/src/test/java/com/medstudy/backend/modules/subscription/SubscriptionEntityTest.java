package com.medstudy.backend.modules.subscription;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

class SubscriptionEntityTest {

    @Test
    @DisplayName("Should return true when status is LIFETIME regardless of date")
    void isCurrentlyActive_Lifetime_ReturnsTrue() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.LIFETIME);

        assertTrue(subscription.isCurrentlyActive(Instant.now()));
    }

    @Test
    @DisplayName("Should return false when status is EXPIRED")
    void isCurrentlyActive_Expired_ReturnsFalse() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.EXPIRED);
        subscription.setTrialEndDate(Instant.now().plus(10, ChronoUnit.DAYS));

        assertFalse(subscription.isCurrentlyActive(Instant.now()));
    }

    @Test
    @DisplayName("Should return true when status is TRIAL and trialEndDate is in the future")
    void isCurrentlyActive_ValidTrial_ReturnsTrue() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.TRIAL);
        subscription.setTrialStartDate(Instant.now());
        subscription.setTrialEndDate(Instant.now().plus(30, ChronoUnit.DAYS));

        assertTrue(subscription.isCurrentlyActive(Instant.now()));
    }

    @Test
    @DisplayName("Should return false when status is TRIAL and trialEndDate is in the past")
    void isCurrentlyActive_ExpiredTrial_ReturnsFalse() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.TRIAL);
        subscription.setTrialStartDate(Instant.now().minus(40, ChronoUnit.DAYS));
        subscription.setTrialEndDate(Instant.now().minus(10, ChronoUnit.DAYS));

        assertFalse(subscription.isCurrentlyActive(Instant.now()));
    }

    @Test
    @DisplayName("Should return true when status is ACTIVE and currentPeriodEnd is in the future")
    void isCurrentlyActive_ValidActive_ReturnsTrue() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setCurrentPeriodStart(Instant.now());
        subscription.setCurrentPeriodEnd(Instant.now().plus(365, ChronoUnit.DAYS));

        assertTrue(subscription.isCurrentlyActive(Instant.now()));
    }

    @Test
    @DisplayName("Should return false when status is ACTIVE and currentPeriodEnd is in the past")
    void isCurrentlyActive_ExpiredActive_ReturnsFalse() {
        Subscription subscription = new Subscription();
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setCurrentPeriodStart(Instant.now().minus(400, ChronoUnit.DAYS));
        subscription.setCurrentPeriodEnd(Instant.now().minus(35, ChronoUnit.DAYS));

        assertFalse(subscription.isCurrentlyActive(Instant.now()));
    }
}
