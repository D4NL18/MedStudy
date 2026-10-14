package com.medstudy.backend.modules.gamificacao.repository;

import com.medstudy.backend.modules.gamificacao.entity.StreakRepair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StreakRepairRepository extends JpaRepository<StreakRepair, UUID> {

    List<StreakRepair> findAllByUserId(UUID userId);

    @Query("SELECT s.repairedDate FROM StreakRepair s WHERE s.user.id = :userId")
    List<LocalDate> findRepairedDatesByUserId(@Param("userId") UUID userId);

    Optional<StreakRepair> findTopByUserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByUserIdAndRepairedDate(UUID userId, LocalDate repairedDate);
}
