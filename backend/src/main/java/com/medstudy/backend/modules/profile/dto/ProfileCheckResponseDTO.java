package com.medstudy.backend.modules.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for profile handle availability check response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileCheckResponseDTO {

    /**
     * The checked handle.
     */
    @Schema(description = "The handle that was checked for availability.", example = "dr.john_doe")
    private String handle;

    /**
     * Indicates whether the handle is available.
     */
    @Schema(description = "Indicates whether the requested handle is available for use (true if available, false if already taken).", example = "true")
    private boolean disponivel;
}
