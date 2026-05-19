package com.medstudy.backend.modules.notificacao.service;

import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.notificacao.dto.NotificationSummaryResponse;
import com.medstudy.backend.modules.notificacao.dto.SocialNotificationResponseDTO;
import com.medstudy.backend.modules.notificacao.entity.SocialNotification;
import com.medstudy.backend.modules.notificacao.repository.SocialNotificationRepository;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final StudySessionRepository studySessionRepository;
    private final LessonRepository lessonRepository;
    private final SocialNotificationRepository socialNotificationRepository;
    private final ProfileRepository profileRepository;

    public NotificationService(StudySessionRepository studySessionRepository, 
                               LessonRepository lessonRepository, 
                               SocialNotificationRepository socialNotificationRepository,
                               ProfileRepository profileRepository) {
        this.studySessionRepository = studySessionRepository;
        this.lessonRepository = lessonRepository;
        this.socialNotificationRepository = socialNotificationRepository;
        this.profileRepository = profileRepository;
    }

    public NotificationSummaryResponse getSummary() {
        if (SecurityContextHolder.getContext().getAuthentication() == null || 
            !(SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof User)) {
            return new NotificationSummaryResponse(0, 0, 0, 0);
        }
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        long pendingRevisions = studySessionRepository.countPendingRevisions(userId, today);
        long reinforcementLessons = lessonRepository.countByUserIdAndReforcoTrue(userId);
        long socialAlerts = socialNotificationRepository.countByUserIdAndIsReadFalse(userId);

        return new NotificationSummaryResponse(
            pendingRevisions,
            reinforcementLessons,
            socialAlerts,
            pendingRevisions + reinforcementLessons + socialAlerts
        );
    }

    public List<SocialNotificationResponseDTO> getSocialNotifications() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return socialNotificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(n -> {
                    String senderName = null;
                    String senderAvatarPresetId = null;
                    if (n.getSender() != null) {
                        Profile senderProfile = profileRepository.findByUserId(n.getSender().getId()).orElse(null);
                        if (senderProfile != null) {
                            senderName = senderProfile.getNomeCompleto();
                            senderAvatarPresetId = senderProfile.getAvatarPresetId();
                        } else {
                            senderName = n.getSender().getName();
                        }
                    }
                    return new SocialNotificationResponseDTO(
                        n.getId(),
                        n.getUser().getId(),
                        n.getSender() != null ? n.getSender().getId() : null,
                        senderName,
                        senderAvatarPresetId,
                        n.getType(),
                        n.getMessage(),
                        n.getIsRead(),
                        n.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void createNotification(User user, User sender, String type, String message) {
        SocialNotification notification = new SocialNotification();
        notification.setUser(user);
        notification.setSender(sender);
        notification.setType(type);
        notification.setMessage(message);
        notification.setIsRead(false);
        socialNotificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(UUID notificationId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        SocialNotification n = socialNotificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        n.setIsRead(true);
        socialNotificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<SocialNotification> notifications = socialNotificationRepository.findAllByUserIdAndIsReadFalse(user.getId());
        for (SocialNotification n : notifications) {
            n.setIsRead(true);
        }
        socialNotificationRepository.saveAll(notifications);
    }
}
