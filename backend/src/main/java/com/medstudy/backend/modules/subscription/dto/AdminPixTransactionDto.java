package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

public record AdminPixTransactionDto(
    UUID id,
    String txid,
    String userEmail,
    BigDecimal amount,
    PixStatus status,
    LocalDateTime createdAt,
    Instant paidAt,
    String e2eId
) {}
