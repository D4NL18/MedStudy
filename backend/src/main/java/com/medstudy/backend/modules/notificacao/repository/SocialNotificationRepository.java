package com.medstudy.backend.modules.notificacao.repository;

import com.medstudy.backend.modules.notificacao.entity.SocialNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocialNotificationRepository extends JpaRepository<SocialNotification, UUID> {
    long countByUserIdAndIsReadFalse(UUID userId);
    List<SocialNotification> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<SocialNotification> findAllByUserIdAndIsReadFalse(UUID userId);
}
