package com.medstudy.backend.modules.profile.controller;

import com.medstudy.backend.modules.profile.dto.ProfileCheckResponseDTO;
import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.service.ProfileService;
import com.medstudy.backend.modules.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDTO> getMyProfile() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profileService.getProfileByUserId(user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProfileDTO> saveProfile(@Valid @RequestBody ProfileDTO dto) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileDTO saved = profileService.createOrUpdateProfile(dto, user);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/check-handle")
    public ResponseEntity<ProfileCheckResponseDTO> checkHandle(@RequestParam String handle) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean disponivel = profileService.isHandleAvailable(handle, user.getId());
        return ResponseEntity.ok(new ProfileCheckResponseDTO(handle, disponivel));
    }

    @GetMapping("/public/{handle}")
    public ResponseEntity<ProfileDTO> getPublicProfile(@PathVariable String handle) {
        return profileService.getProfileByHandle(handle)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
