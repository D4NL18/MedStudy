package com.medstudy.backend.modules.gamificacao.repository;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for UserBadge entity operations.
 */
@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    
    /**
     * Finds all badges associated with a specific user.
     *
     * @param userId the UUID of the user
     * @return a list of UserBadge
     */
    List<UserBadge> findAllByUserId(UUID userId);
    
    /**
     * Finds a specific badge for a user.
     *
     * @param userId the UUID of the user
     * @param badgeType the type of the badge
     * @return an Optional containing the UserBadge if found, or empty otherwise
     */
    Optional<UserBadge> findByUserIdAndBadgeType(UUID userId, BadgeType badgeType);
    
    /**
     * Checks if a user already has a specific badge.
     *
     * @param userId the UUID of the user
     * @param badgeType the type of the badge
     * @return true if the user has the badge, false otherwise
     */
    boolean existsByUserIdAndBadgeType(UUID userId, BadgeType badgeType);
}
