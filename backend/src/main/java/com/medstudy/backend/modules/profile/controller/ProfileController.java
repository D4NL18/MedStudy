package com.medstudy.backend.modules.profile.controller;

import com.medstudy.backend.modules.profile.dto.ProfileCheckResponseDTO;
import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.service.ProfileService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing user profiles.
 */
@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Profile", description = "Endpoints for managing user profiles")
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Constructs a new ProfileController.
     *
     * @param profileService the profile service
     */
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Gets the profile of the currently authenticated user.
     *
     * @return the profile data
     */
    @Operation(summary = "Get current user profile", description = "Retrieves the profile of the currently authenticated user.")
    @ApiResponse(responseCode = "200", description = "Profile found")
    @ApiResponse(responseCode = "404", description = "Profile not found")
    @GetMapping("/me")
    public ResponseEntity<ProfileDTO> getMyProfile() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profileService.getProfileByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates or updates the profile for the currently authenticated user.
     *
     * @param dto the profile data to save
     * @return the saved profile data
     */
    @Operation(summary = "Save user profile", description = "Creates or updates the profile for the currently authenticated user.")
    @ApiResponse(responseCode = "200", description = "Profile saved successfully")
    @PostMapping
    public ResponseEntity<ProfileDTO> saveProfile(@Valid @RequestBody ProfileDTO dto) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileDTO saved = profileService.createOrUpdateProfile(dto, user);
        return ResponseEntity.ok(saved);
    }

    /**
     * Checks if a profile handle is available.
     *
     * @param handle the handle to check
     * @return a response indicating if the handle is available
     */
    @Operation(summary = "Check handle availability", description = "Checks if a given profile handle is available.")
    @ApiResponse(responseCode = "200", description = "Availability checked successfully")
    @GetMapping("/check-handle")
    public ResponseEntity<ProfileCheckResponseDTO> checkHandle(@RequestParam String handle) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean disponivel = profileService.isHandleAvailable(handle, user.getId());
        return ResponseEntity.ok(new ProfileCheckResponseDTO(handle, disponivel));
    }

    /**
     * Gets a public profile by its handle.
     *
     * @param handle the profile handle
     * @return the profile data
     */
    @Operation(summary = "Get public profile", description = "Retrieves a public profile by its handle.")
    @ApiResponse(responseCode = "200", description = "Profile found")
    @ApiResponse(responseCode = "404", description = "Profile not found")
    @GetMapping("/public/{handle}")
    public ResponseEntity<ProfileDTO> getPublicProfile(@PathVariable String handle) {
        return profileService.getProfileByHandle(handle)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
