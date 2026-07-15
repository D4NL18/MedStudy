package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import java.time.Instant;

public record UserSubscriptionDto(
    SubscriptionStatus status,
    Instant trialEndDate,
    Instant currentPeriodEnd,
    boolean isLifetime
) {}
