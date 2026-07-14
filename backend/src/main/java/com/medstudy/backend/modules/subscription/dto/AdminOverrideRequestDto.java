package com.medstudy.backend.modules.subscription.dto;

public record AdminOverrideRequestDto(
    OverrideOption option,
    String notes
) {
    public enum OverrideOption {
        ADD_30_DAYS,
        ADD_90_DAYS,
        ADD_365_DAYS,
        GRANT_LIFETIME,
        FORCE_EXPIRE
    }
}
