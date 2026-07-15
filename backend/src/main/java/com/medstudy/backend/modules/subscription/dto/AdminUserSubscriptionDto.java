package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import java.time.Instant;
import java.util.UUID;

public record AdminUserSubscriptionDto(
    UUID userId,
    String userName,
    String userEmail,
    SubscriptionStatus status,
    Instant trialEndDate,
    Instant currentPeriodEnd,
    boolean isAdminOverride,
    String notes
) {}
