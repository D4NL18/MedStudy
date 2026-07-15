package com.medstudy.backend.modules.subscription.dto;

import java.math.BigDecimal;
import java.util.List;

public record BbWebhookPayloadDto(
    List<PixItem> pix
) {
    public record PixItem(
        String endToEndId,
        String txid,
        BigDecimal valor,
        String horario
    ) {}
}
