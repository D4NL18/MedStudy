package com.medstudy.backend.modules.clinic.dto;

import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import jakarta.validation.constraints.NotNull;

/**
 * Request payload for crediting study XP rewards (P-080, P-081, P-086).
 */
public class StudyActionRewardRequest {

    @NotNull(message = "O tipo de ação de estudo (actionType) é obrigatório.")
    private StudyActionType actionType;

    private Double accuracyPercent;
    private String referenceId;
    private Integer streakDaysOverride;

    public StudyActionRewardRequest() {
    }

    public StudyActionRewardRequest(StudyActionType actionType, Double accuracyPercent, String referenceId, Integer streakDaysOverride) {
        this.actionType = actionType;
        this.accuracyPercent = accuracyPercent;
        this.referenceId = referenceId;
        this.streakDaysOverride = streakDaysOverride;
    }

    public StudyActionType getActionType() {
        return actionType;
    }

    public void setActionType(StudyActionType actionType) {
        this.actionType = actionType;
    }

    public Double getAccuracyPercent() {
        return accuracyPercent;
    }

    public void setAccuracyPercent(Double accuracyPercent) {
        this.accuracyPercent = accuracyPercent;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public Integer getStreakDaysOverride() {
        return streakDaysOverride;
    }

    public void setStreakDaysOverride(Integer streakDaysOverride) {
        this.streakDaysOverride = streakDaysOverride;
    }
}
