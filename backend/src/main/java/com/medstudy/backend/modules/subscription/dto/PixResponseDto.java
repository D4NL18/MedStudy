package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record PixResponseDto(
    String txid,
    String pixCopiaECola,
    String qrCodeLocation,
    String qrCodeBase64,
    BigDecimal amount,
    Instant expirationDate,
    PixStatus status
) {}
