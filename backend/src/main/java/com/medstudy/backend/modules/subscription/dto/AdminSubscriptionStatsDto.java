package com.medstudy.backend.modules.subscription.dto;

import java.math.BigDecimal;

public record AdminSubscriptionStatsDto(
    long activeCount,
    long trialCount,
    long expiredCount,
    long lifetimeCount,
    BigDecimal totalPixRevenue
) {}
