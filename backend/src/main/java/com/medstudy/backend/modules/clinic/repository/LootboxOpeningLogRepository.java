package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.LootboxOpeningLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LootboxOpeningLogRepository extends JpaRepository<LootboxOpeningLog, UUID> {
    List<LootboxOpeningLog> findByUserIdOrderByOpenedAtDesc(UUID userId);
}
