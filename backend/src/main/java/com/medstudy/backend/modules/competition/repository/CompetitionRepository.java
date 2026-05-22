package com.medstudy.backend.modules.competition.repository;

import com.medstudy.backend.modules.competition.entity.Competition;
import com.medstudy.backend.modules.competition.entity.CompetitionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, UUID> {

    @Query("SELECT c FROM Competition c JOIN c.participants p WHERE p.user.id = :userId ORDER BY c.createdAt DESC")
    List<Competition> findAllByParticipantUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM Competition c JOIN c.participants p WHERE p.user.id = :userId AND c.status = :status ORDER BY c.createdAt DESC")
    List<Competition> findAllByParticipantUserIdAndStatus(@Param("userId") UUID userId, @Param("status") CompetitionStatus status);

    @Query("SELECT c FROM Competition c JOIN c.participants p WHERE p.user.id = :userId AND c.competitionType = 'DUEL_TARGET' AND c.status = 'ACTIVE'")
    List<Competition> findActiveTargetDuelsByUserId(@Param("userId") UUID userId);
}
