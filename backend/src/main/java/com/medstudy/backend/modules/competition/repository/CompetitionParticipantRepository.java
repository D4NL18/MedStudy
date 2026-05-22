package com.medstudy.backend.modules.competition.repository;

import com.medstudy.backend.modules.competition.entity.CompetitionParticipant;
import com.medstudy.backend.modules.competition.entity.CompetitionParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompetitionParticipantRepository extends JpaRepository<CompetitionParticipant, CompetitionParticipantId> {
    Optional<CompetitionParticipant> findByCompetitionIdAndUserId(UUID competitionId, UUID userId);
}
