package com.medstudy.backend.modules.subscription.dto;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import java.time.Instant;

public record PixStatusResponseDto(
    String txid,
    PixStatus status,
    Instant paidAt,
    String message
) {}
