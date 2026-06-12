package com.medstudy.backend.modules.auth.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Data transfer object representing the response of an authentication request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    /**
     * The access token used for authentication.
     */
    @Schema(description = "The JWT access token used for API authentication.", example = "eyJhbGciOiJIUzI1NiIsInR...")
    private String accessToken;
    
    /**
     * The refresh token used to obtain a new access token.
     */
    @Schema(description = "The refresh token used to obtain a new access token when it expires.", example = "d2VibWFzdGVyQG1lZHN0dWR5...")
    private String refreshToken;

}
