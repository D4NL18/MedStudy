package com.medstudy.backend.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenRefreshRequest(
        @NotBlank(message = "Refresh token é obrigatório")
        String refreshToken
) {}
