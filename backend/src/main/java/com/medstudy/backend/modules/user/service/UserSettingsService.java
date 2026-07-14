package com.medstudy.backend.modules.user.service;

import com.medstudy.backend.modules.user.dto.UserSettingsRequest;
import com.medstudy.backend.modules.user.dto.UserSettingsResponse;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.entity.UserSettings;
import com.medstudy.backend.modules.user.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing user settings.
 */
@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository repository;

    /**
     * Retrieves the current user's settings. Creates default settings if none exist.
     *
     * @return the user settings response
     */
    @Transactional
    public UserSettingsResponse getSettings() {
        UserSettings settings = getOrCreateSettings();
        return toResponse(settings);
    }

    /**
     * Updates the current user's settings.
     *
     * @param request the request containing updated settings
     * @return the updated user settings response
     */
    @Transactional
    public UserSettingsResponse updateSettings(UserSettingsRequest request) {
        UserSettings settings = getOrCreateSettings();
        
        if (request.getMaxReviewsPerDay() != null) {
            settings.setMaxReviewsPerDay(request.getMaxReviewsPerDay());
        }
        if (request.getThemeColor() != null) {
            settings.setThemeColor(request.getThemeColor());
        }
        
        return toResponse(repository.save(settings));
    }
    
    /**
     * Internal method to get the current user's max reviews limit.
     * Returns a default of 100 if none is set.
     *
     * @return the max reviews per day
     */
    @Transactional(readOnly = true)
    public int getCurrentUserMaxReviewsPerDay() {
        UserSettings settings = getOrCreateSettings();
        return settings.getMaxReviewsPerDay() != null ? settings.getMaxReviewsPerDay() : 100;
    }

    private UserSettings getOrCreateSettings() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repository.findByUserId(user.getId()).orElseGet(() -> {
            UserSettings defaultSettings = new UserSettings();
            defaultSettings.setUser(user);
            defaultSettings.setMaxReviewsPerDay(100); // default limit
            return repository.save(defaultSettings);
        });
    }

    private UserSettingsResponse toResponse(UserSettings settings) {
        return UserSettingsResponse.builder()
                .maxReviewsPerDay(settings.getMaxReviewsPerDay())
                .themeColor(settings.getThemeColor())
                .build();
    }
}
