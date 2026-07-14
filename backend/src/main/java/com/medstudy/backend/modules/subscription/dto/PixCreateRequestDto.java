package com.medstudy.backend.modules.subscription.dto;

import java.math.BigDecimal;

public record PixCreateRequestDto(
    BigDecimal amount,
    Integer expirationSeconds
) {
    public PixCreateRequestDto {
        if (expirationSeconds == null) {
            expirationSeconds = 900; // Default: 15 minutos (900 segundos)
        }
    }
}
