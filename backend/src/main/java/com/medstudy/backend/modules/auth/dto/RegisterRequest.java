package com.medstudy.backend.modules.auth.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data transfer object for a user registration request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    
    /**
     * The full name of the user.
     */
    @Schema(description = "The full name of the user registering.", example = "John Doe")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        String name;
        
    /**
     * The email address of the user.
     */
    @Schema(description = "The email address for the new account.", example = "user@example.com")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @Email(message = ValidationMessages.INVALID_EMAIL)
        String email;
        
    /**
     * The password chosen by the user.
     */
    @Schema(description = "The password chosen by the user for authentication. Must be at least 8 characters.", example = "Secret123!")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @Size(min = 8, message = ValidationMessages.INVALID_FORMAT)
        String password;

}
