package com.medstudy.backend.modules.gamificacao.repository;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    List<UserBadge> findAllByUserId(UUID userId);
    Optional<UserBadge> findByUserIdAndBadgeType(UUID userId, BadgeType badgeType);
    boolean existsByUserIdAndBadgeType(UUID userId, BadgeType badgeType);
}
