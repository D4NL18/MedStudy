package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record PixResponseDto(
    String txid,
    String pixCopiaECola,
    String qrCodeLocation,
    BigDecimal amount,
    Instant expirationDate,
    PixStatus status
) {}
