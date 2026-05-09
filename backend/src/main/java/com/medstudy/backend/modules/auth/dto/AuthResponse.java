package com.medstudy.backend.modules.auth.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {}
