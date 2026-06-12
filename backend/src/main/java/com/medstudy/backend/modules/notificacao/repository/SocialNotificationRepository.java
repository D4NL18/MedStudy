package com.medstudy.backend.modules.notificacao.repository;

import com.medstudy.backend.modules.notificacao.entity.SocialNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for managing SocialNotification entities.
 */
@Repository
public interface SocialNotificationRepository extends JpaRepository<SocialNotification, UUID> {
    /**
     * Counts the number of unread notifications for a specific user.
     *
     * @param userId the ID of the user
     * @return the count of unread notifications
     */
    long countByUserIdAndIsReadFalse(UUID userId);

    /**
     * Retrieves all notifications for a specific user, ordered by creation date in descending order.
     *
     * @param userId the ID of the user
     * @return a list of social notifications
     */
    List<SocialNotification> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Retrieves all unread notifications for a specific user.
     *
     * @param userId the ID of the user
     * @return a list of unread social notifications
     */
    List<SocialNotification> findAllByUserIdAndIsReadFalse(UUID userId);
}
