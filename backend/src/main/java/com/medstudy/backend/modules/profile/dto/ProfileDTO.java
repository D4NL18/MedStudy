package com.medstudy.backend.modules.profile.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {
    private UUID id;

    private UUID userId;

    @NotBlank(message = "O handle é obrigatório")
    @Pattern(regexp = "^[a-zA-Z0-9_.]+$", message = "O handle deve conter apenas letras, números, underline ou pontos")
    private String handle;

    @NotBlank(message = "O nome completo é obrigatório")
    private String nomeCompleto;

    private Boolean isFormado;

    @Min(value = 1, message = "O semestre mínimo é 1")
    @Max(value = 12, message = "O semestre máximo é 12")
    private Integer semestre;

    @NotBlank(message = "A faculdade é obrigatória")
    private String faculdade;

    @NotBlank(message = "O avatar é obrigatório")
    private String avatarPresetId;

    // Privacy Settings
    private Boolean isPublic;
    private Boolean shareStreak;
    private Boolean shareFaculdade;
    private Boolean shareTotalQuestions;
    private Boolean shareBadges;

    // View context and statistics metadata
    private Integer streak;
    private Long totalQuestions;
    private List<String> badges;
    private Boolean isPrivate;
    private String friendshipStatus;
    private Boolean isRequester;
}
