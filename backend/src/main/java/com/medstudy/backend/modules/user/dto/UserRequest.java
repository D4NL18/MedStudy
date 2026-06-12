package com.medstudy.backend.modules.user.dto;
import com.medstudy.backend.core.constants.ValidationMessages;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object for creating or updating a User.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    /**
     * The name of the user.
     */
    @Schema(description = "The full name of the user to be created or updated.", example = "John Doe")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String name;

    /**
     * The email address of the user.
     */
    @Schema(description = "The email address of the user, used for authentication and notifications.", example = "user@example.com")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) @Email(message = ValidationMessages.INVALID_EMAIL) String email;

    /**
     * The password for the user.
     */
    @Schema(description = "The password for the user. Must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.", example = "StrongP@ss123")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED)
        @org.hibernate.validator.constraints.Length(min = 8, message = ValidationMessages.INVALID_FORMAT)
        @jakarta.validation.constraints.Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = ValidationMessages.INVALID_FORMAT
        )
        String password;

    /**
     * The role assigned to the user.
     */
    @Schema(description = "The authorization role assigned to the user (e.g., ADMIN, USER).", example = "USER")
    private @NotBlank(message = ValidationMessages.FIELD_REQUIRED) String role;


}
