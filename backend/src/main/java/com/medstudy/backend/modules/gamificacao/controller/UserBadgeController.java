package com.medstudy.backend.modules.gamificacao.controller;

import com.medstudy.backend.modules.gamificacao.dto.UserBadgeResponse;
import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.service.BadgeService;
import com.medstudy.backend.modules.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller for managing user badges.
 */
@RestController
@RequestMapping("/api/badges")
@Tag(name = "User Badges", description = "Endpoints for user badge management")
public class UserBadgeController {

    private final BadgeService badgeService;

    /**
     * Constructs a new UserBadgeController.
     *
     * @param badgeService the badge service
     */
    public UserBadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    /**
     * Retrieves a list of badges earned by the currently authenticated user.
     *
     * @return a list of UserBadgeResponse representing the user's earned badges
     */
    @GetMapping
    @Operation(summary = "Get user badges", description = "Retrieves all badges earned by the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user badges")
    public List<UserBadgeResponse> getUserBadges() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return badgeService.getUserBadges(user.getId()).stream()
                .map(ub -> new UserBadgeResponse(
                        ub.getBadgeType(),
                        ub.getBadgeType().getDisplayName(),
                        ub.getBadgeType().getDescription(),
                        ub.getEarnedAt()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all available badge types in the system.
     *
     * @return a list of all BadgeType enum values
     */
    @GetMapping("/all")
    @Operation(summary = "Get all badge types", description = "Retrieves a list of all possible badges in the system.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all badge types")
    public List<BadgeType> getAllBadges() {
        return Arrays.asList(BadgeType.values());
    }
}
