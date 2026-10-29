package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.UserUnlockedSkin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserUnlockedSkinRepository extends JpaRepository<UserUnlockedSkin, UUID> {
    List<UserUnlockedSkin> findByUserId(UUID userId);
    List<UserUnlockedSkin> findByUserIdAndSkinSlot(UUID userId, String skinSlot);
    boolean existsByUserIdAndSkinId(UUID userId, String skinId);
    Optional<UserUnlockedSkin> findByUserIdAndSkinId(UUID userId, String skinId);
}
