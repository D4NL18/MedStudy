package com.medstudy.backend.modules.flashcard.repository;

import com.medstudy.backend.modules.flashcard.entity.RedistributionDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for RedistributionDraft entity.
 */
@Repository
public interface RedistributionDraftRepository extends JpaRepository<RedistributionDraft, UUID> {
    Optional<RedistributionDraft> findByUserId(UUID userId);
}
