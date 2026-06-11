package com.medstudy.backend.modules.profile.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.util.List;

/**
 * Data Transfer Object for user profile data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {

    /**
     * The profile ID.
     */
    @Schema(description = "Unique identifier for the user profile.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    /**
     * The ID of the user associated with this profile.
     */
    @Schema(description = "Unique identifier of the user associated with this profile.", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID userId;

    /**
     * The profile handle.
     */
    @Schema(description = "The user's unique handle on the platform.", example = "dr.john_doe")
    @NotBlank(message = "O handle é obrigatório")
    @Pattern(regexp = "^[a-zA-Z0-9_.]+$", message = "O handle deve conter apenas letras, números, underline ou pontos")
    private String handle;

    /**
     * The full name of the user.
     */
    @Schema(description = "The full name of the user.", example = "John Doe")
    @NotBlank(message = "O nome completo é obrigatório")
    private String nomeCompleto;

    /**
     * Indicates whether the user has graduated.
     */
    @Schema(description = "Indicates whether the user has completed their medical degree.", example = "true")
    private Boolean isFormado;

    /**
     * The current semester of the user.
     */
    @Schema(description = "Current semester of the medical student (1 to 12).", example = "8")
    @Min(value = 1, message = "O semestre mínimo é 1")
    @Max(value = 12, message = "O semestre máximo é 12")
    private Integer semestre;

    /**
     * The college or university of the user.
     */
    @Schema(description = "Name of the medical school or university attended by the user.", example = "Harvard Medical School")
    @NotBlank(message = "A faculdade é obrigatória")
    private String faculdade;

    /**
     * The avatar preset ID.
     */
    @Schema(description = "Identifier of the avatar preset selected by the user to represent their profile picture.", example = "avatar_03")
    @NotBlank(message = "O avatar é obrigatório")
    private String avatarPresetId;

    /**
     * Indicates whether the profile is public.
     */
    @Schema(description = "Indicates whether the profile is public and visible to other users.", example = "true")
    private Boolean isPublic;

    /**
     * Indicates whether to share the streak.
     */
    @Schema(description = "User preference: Indicates whether to share their study streak publicly.", example = "true")
    private Boolean shareStreak;

    /**
     * Indicates whether to share the college.
     */
    @Schema(description = "User preference: Indicates whether to share their college/university publicly.", example = "true")
    private Boolean shareFaculdade;

    /**
     * Indicates whether to share the total questions answered.
     */
    @Schema(description = "User preference: Indicates whether to share the total number of questions they have answered.", example = "true")
    private Boolean shareTotalQuestions;

    /**
     * Indicates whether to share the badges.
     */
    @Schema(description = "User preference: Indicates whether to share the badges they have earned publicly.", example = "true")
    private Boolean shareBadges;

    /**
     * The user's streak count.
     */
    @Schema(description = "Number of consecutive days this user has been actively studying on the platform.", example = "21")
    private Integer streak;

    /**
     * The total number of questions answered.
     */
    @Schema(description = "Total number of questions answered by the user.", example = "1050")
    private Long totalQuestions;

    /**
     * The badges earned by the user.
     */
    @Schema(description = "List of badges earned by the user.", example = "[\"EARLY_BIRD\", \"STREAK_10\"]")
    private List<String> badges;

    /**
     * Indicates whether the profile is private from the requester's perspective.
     */
    @Schema(description = "Indicates whether the profile is considered private from the perspective of the user requesting this data.", example = "false")
    private Boolean isPrivate;

    /**
     * The friendship status between the requester and the profile owner.
     */
    @Schema(description = "Relationship status between the requesting user and this profile (e.g., FRIENDS, PENDING, NONE).", example = "FRIENDS")
    private String friendshipStatus;

    /**
     * Indicates whether the current viewer is the owner of the profile.
     */
    @Schema(description = "Indicates whether the current authenticated user is the owner of the profile.", example = "true")
    private Boolean isRequester;
}
