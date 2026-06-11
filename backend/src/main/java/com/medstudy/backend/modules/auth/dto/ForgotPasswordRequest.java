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
 * Data transfer object for the forgot password request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordRequest {
    
    /**
     * The email address associated with the user account.
     */
    @Schema(description = "The registered email address associated with the user account recovering the password.", example = "user@example.com")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @Email(message = ValidationMessages.INVALID_EMAIL)
        String email;

}
