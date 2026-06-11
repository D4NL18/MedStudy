package com.medstudy.backend.modules.auth.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Data transfer object for a reset password request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    
    /**
     * The token used to verify the reset password request.
     */
    @Schema(description = "The password reset token sent via email.", example = "abc123token")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        String token;
        
    /**
     * The new password chosen by the user.
     */
    @Schema(description = "The user's new password. Must contain at least one lowercase letter, one uppercase letter, one digit, and be at least 8 characters long.", example = "NewSecret123!")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = ValidationMessages.INVALID_FORMAT
        )
        String newPassword;

}
