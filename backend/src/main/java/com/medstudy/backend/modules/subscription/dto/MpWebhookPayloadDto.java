package com.medstudy.backend.modules.subscription.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MpWebhookPayloadDto(
    String action,
    String type,
    Data data
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Data(
        @JsonProperty("id")
        String id
    ) {}
}
