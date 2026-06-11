package com.medstudy.backend.modules.auth.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;

/**
 * Data transfer object for a token refresh request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRefreshRequest {
    
    /**
     * The refresh token used to request a new access token.
     */
    @Schema(description = "The refresh token used to request a new access token.", example = "d2VibWFzdGVyQG1lZHN0dWR5...")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        String refreshToken;

}
