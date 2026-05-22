package com.medstudy.backend.modules.competition.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class CompetitionParticipantId implements Serializable {

    @Column(name = "competition_id")
    private UUID competitionId;

    @Column(name = "user_id")
    private UUID userId;

    public CompetitionParticipantId() {}

    public CompetitionParticipantId(UUID competitionId, UUID userId) {
        this.competitionId = competitionId;
        this.userId = userId;
    }

    public UUID getCompetitionId() {
        return competitionId;
    }

    public void setCompetitionId(UUID competitionId) {
        this.competitionId = competitionId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompetitionParticipantId that = (CompetitionParticipantId) o;
        return Objects.equals(competitionId, that.competitionId) &&
               Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(competitionId, userId);
    }
}
