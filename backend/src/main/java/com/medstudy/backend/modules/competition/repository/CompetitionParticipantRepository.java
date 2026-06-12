package com.medstudy.backend.modules.competition.repository;

import com.medstudy.backend.modules.competition.entity.CompetitionParticipant;
import com.medstudy.backend.modules.competition.entity.CompetitionParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing CompetitionParticipant entities.
 */
@Repository
public interface CompetitionParticipantRepository extends JpaRepository<CompetitionParticipant, CompetitionParticipantId> {

    /**
     * Finds a participant by competition ID and user ID.
     *
     * @param competitionId the ID of the competition
     * @param userId the ID of the user
     * @return an Optional containing the participant if found
     */
    Optional<CompetitionParticipant> findByCompetitionIdAndUserId(UUID competitionId, UUID userId);
}
