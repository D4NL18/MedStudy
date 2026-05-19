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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private SocialNotificationRepository socialNotificationRepository;

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User currentUser;
    private User senderUser;
    private Profile senderProfile;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        currentUser.setEmail("current@medstudy.com");

        senderUser = new User();
        senderUser.setId(UUID.randomUUID());
        senderUser.setName("Sender Name");

        senderProfile = new Profile();
        senderProfile.setUser(senderUser);
        senderProfile.setNomeCompleto("Dr. Sender");
        senderProfile.setAvatarPresetId("pediatrics");

        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getPrincipal()).thenReturn(currentUser);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getSummary_ShouldCalculateSummaryCorrectly() {
        when(studySessionRepository.countPendingRevisions(eq(currentUser.getId()), any(LocalDate.class)))
                .thenReturn(5L);
        when(lessonRepository.countByUserIdAndReforcoTrue(currentUser.getId()))
                .thenReturn(3L);
        when(socialNotificationRepository.countByUserIdAndIsReadFalse(currentUser.getId()))
                .thenReturn(2L);

        NotificationSummaryResponse summary = notificationService.getSummary();

        assertNotNull(summary);
        assertEquals(5L, summary.pendingRevisions());
        assertEquals(3L, summary.reinforcementLessons());
        assertEquals(2L, summary.socialAlerts());
        assertEquals(10L, summary.totalAlerts());
    }

    @Test
    void getSocialNotifications_ShouldReturnListWithSenderMeta() {
        SocialNotification n = new SocialNotification();
        n.setId(UUID.randomUUID());
        n.setUser(currentUser);
        n.setSender(senderUser);
        n.setType("FRIEND_REQUEST");
        n.setMessage("Request Message");
        n.setIsRead(false);

        when(socialNotificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()))
                .thenReturn(List.of(n));
        when(profileRepository.findByUserId(senderUser.getId()))
                .thenReturn(Optional.of(senderProfile));

        List<SocialNotificationResponseDTO> result = notificationService.getSocialNotifications();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Dr. Sender", result.get(0).senderName());
        assertEquals("pediatrics", result.get(0).senderAvatarPresetId());
        assertEquals("FRIEND_REQUEST", result.get(0).type());
    }

    @Test
    void createNotification_ShouldSaveSocialNotification() {
        notificationService.createNotification(currentUser, senderUser, "STREAK_RECORD", "New Record!");

        verify(socialNotificationRepository, times(1)).save(any(SocialNotification.class));
    }

    @Test
    void markAsRead_ShouldSetIsReadToTrue() {
        SocialNotification n = new SocialNotification();
        n.setId(UUID.randomUUID());
        n.setUser(currentUser);
        n.setIsRead(false);

        when(socialNotificationRepository.findById(n.getId())).thenReturn(Optional.of(n));

        notificationService.markAsRead(n.getId());

        assertTrue(n.getIsRead());
        verify(socialNotificationRepository, times(1)).save(n);
    }

    @Test
    void markAsRead_ShouldThrowException_WhenAccessDenied() {
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());

        SocialNotification n = new SocialNotification();
        n.setId(UUID.randomUUID());
        n.setUser(otherUser);
        n.setIsRead(false);

        when(socialNotificationRepository.findById(n.getId())).thenReturn(Optional.of(n));

        assertThrows(RuntimeException.class, () -> 
                notificationService.markAsRead(n.getId())
        );
    }

    @Test
    void markAllAsRead_ShouldSetAllToRead() {
        SocialNotification n1 = new SocialNotification();
        n1.setUser(currentUser);
        n1.setIsRead(false);

        SocialNotification n2 = new SocialNotification();
        n2.setUser(currentUser);
        n2.setIsRead(false);

        when(socialNotificationRepository.findAllByUserIdAndIsReadFalse(currentUser.getId()))
                .thenReturn(List.of(n1, n2));

        notificationService.markAllAsRead();

        assertTrue(n1.getIsRead());
        assertTrue(n2.getIsRead());
        verify(socialNotificationRepository, times(1)).saveAll(anyList());
    }
}
