package com.medstudy.backend.modules.user.controller;

import com.medstudy.backend.modules.user.dto.UserSettingsRequest;
import com.medstudy.backend.modules.user.dto.UserSettingsResponse;
import com.medstudy.backend.modules.user.service.UserSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing user settings and preferences.
 */
@RestController
@RequestMapping("/api/user-settings")
@RequiredArgsConstructor
@Tag(name = "User Settings", description = "Endpoints for managing user preferences")
public class UserSettingsController {

    private final UserSettingsService service;

    /**
     * Retrieves the current user's settings.
     *
     * @return the user settings
     */
    @Operation(summary = "Get user settings", description = "Retrieves the current user's preferences.")
    @ApiResponse(responseCode = "200", description = "Settings retrieved successfully")
    @GetMapping
    public ResponseEntity<UserSettingsResponse> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    /**
     * Updates the current user's settings.
     *
     * @param request the settings to update
     * @return the updated settings
     */
    @Operation(summary = "Update user settings", description = "Updates the current user's preferences (e.g., max reviews per day, theme color).")
    @ApiResponse(responseCode = "200", description = "Settings updated successfully")
    @PutMapping
    public ResponseEntity<UserSettingsResponse> updateSettings(@RequestBody @Valid UserSettingsRequest request) {
        return ResponseEntity.ok(service.updateSettings(request));
    }
}
