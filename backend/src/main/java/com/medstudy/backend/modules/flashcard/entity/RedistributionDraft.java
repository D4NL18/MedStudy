package com.medstudy.backend.modules.flashcard.entity;

import com.medstudy.backend.core.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

/**
 * Entity representing a temporary draft of a flashcard redistribution plan.
 */
@Entity
@Table(name = "redistribution_drafts")
public class RedistributionDraft extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "draft_data", nullable = false, columnDefinition = "TEXT")
    private String draftData;

    /**
     * Gets the associated user ID.
     *
     * @return the user ID
     */
    public UUID getUserId() {
        return userId;
    }

    /**
     * Sets the associated user ID.
     *
     * @param userId the user ID to set
     */
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    /**
     * Gets the JSON draft data.
     *
     * @return the draft data
     */
    public String getDraftData() {
        return draftData;
    }

    /**
     * Sets the JSON draft data.
     *
     * @param draftData the draft data to set
     */
    public void setDraftData(String draftData) {
        this.draftData = draftData;
    }
}
