package com.medstudy.backend.modules.auth.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Data transfer object for a user login request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    /**
     * The email address of the user.
     */
    @Schema(description = "The registered email address of the user.", example = "user@example.com")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @Email(message = ValidationMessages.INVALID_EMAIL)
        String email;
        
    /**
     * The password of the user.
     */
    @Schema(description = "The user's password. Should be sent securely.", example = "Secret123!")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        String password;

}
