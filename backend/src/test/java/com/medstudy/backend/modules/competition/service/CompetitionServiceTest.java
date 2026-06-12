package com.medstudy.backend.modules.competition.service;

import com.medstudy.backend.modules.competition.dto.CompetitionRequestDTO;
import com.medstudy.backend.modules.competition.dto.CompetitionResponseDTO;
import com.medstudy.backend.modules.competition.entity.*;
import com.medstudy.backend.modules.competition.mapper.CompetitionMapper;
import com.medstudy.backend.modules.competition.repository.CompetitionParticipantRepository;
import com.medstudy.backend.modules.competition.repository.CompetitionRepository;
import com.medstudy.backend.modules.friendship.entity.Friendship;
import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import com.medstudy.backend.modules.friendship.repository.FriendshipRepository;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
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

class CompetitionServiceTest {

    private CompetitionRepository competitionRepository;
    private CompetitionParticipantRepository participantRepository;
    private UserRepository userRepository;
    private FriendshipRepository friendshipRepository;
    private NotificationService notificationService;
    private StudySessionRepository studySessionRepository;
    private ProfileRepository profileRepository;
    private CompetitionMapper competitionMapper;
    private CompetitionService service;

    private User currentUser;

    @BeforeEach
    void setUp() {
        competitionRepository = mock(CompetitionRepository.class);
        participantRepository = mock(CompetitionParticipantRepository.class);
        userRepository = mock(UserRepository.class);
        friendshipRepository = mock(FriendshipRepository.class);
        notificationService = mock(NotificationService.class);
        studySessionRepository = mock(StudySessionRepository.class);
        profileRepository = mock(ProfileRepository.class);
        competitionMapper = mock(CompetitionMapper.class);

        service = new CompetitionService(
                competitionRepository,
                participantRepository,
                userRepository,
                friendshipRepository,
                notificationService,
                studySessionRepository,
                profileRepository,
                competitionMapper
        );

        currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        currentUser.setName("Dr. House");
        currentUser.setEmail("house@medstudy.com");

        // Mock security context
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void shouldCreateCompetitionSuccessfully() {
        UUID friendId = UUID.randomUUID();
        User friend = new User();
        friend.setId(friendId);
        friend.setName("Wilson");

        CompetitionRequestDTO request = new CompetitionRequestDTO(
                "Desafio de Questões",
                CompetitionType.GROUP,
                MetricType.TOTAL_QUESTIONS,
                null,
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                List.of(friendId)
        );

        Competition competition = new Competition();
        competition.setId(UUID.randomUUID());
        competition.setTitle(request.getTitle());

        Friendship friendship = new Friendship();
        friendship.setRequester(currentUser);
        friendship.setReceiver(friend);
        friendship.setStatus(FriendshipStatus.ACCEPTED);

        when(userRepository.findById(friendId)).thenReturn(Optional.of(friend));
        when(friendshipRepository.findFriendshipBetween(currentUser.getId(), friendId)).thenReturn(Optional.of(friendship));
        when(competitionRepository.save(any(Competition.class))).thenReturn(competition);

        CompetitionResponseDTO responseDTO = new CompetitionResponseDTO(
                competition.getId(),
                competition.getTitle(),
                currentUser.getId(),
                currentUser.getName(),
                request.getCompetitionType(),
                request.getMetricType(),
                null,
                request.getStartDate(),
                request.getEndDate(),
                CompetitionStatus.ACTIVE,
                List.of(),
                null,
                null
        );

        when(competitionMapper.toDTO(any(Competition.class))).thenReturn(responseDTO);

        CompetitionResponseDTO result = service.createCompetition(request);

        assertNotNull(result);
        assertEquals("Desafio de Questões", result.getTitle());
        verify(competitionRepository).save(any(Competition.class));
        verify(participantRepository, times(2)).save(any(CompetitionParticipant.class));
    }

    @Test
    void shouldAcceptInviteSuccessfully() {
        UUID competitionId = UUID.randomUUID();
        Competition competition = new Competition();
        competition.setId(competitionId);

        CompetitionParticipant participant = new CompetitionParticipant(competition, currentUser, ParticipantStatus.INVITED);

        when(participantRepository.findByCompetitionIdAndUserId(competitionId, currentUser.getId()))
                .thenReturn(Optional.of(participant));

        CompetitionResponseDTO responseDTO = new CompetitionResponseDTO(
                competitionId,
                "Desafio",
                UUID.randomUUID(),
                "Criador",
                CompetitionType.GROUP,
                MetricType.TOTAL_QUESTIONS,
                null,
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                CompetitionStatus.ACTIVE,
                List.of(),
                null,
                null
        );
        when(competitionMapper.toDTO(any(Competition.class))).thenReturn(responseDTO);

        CompetitionResponseDTO result = service.acceptInvite(competitionId);

        assertNotNull(result);
        assertEquals(ParticipantStatus.ACCEPTED, participant.getStatus());
        assertNotNull(participant.getJoinedAt());
        verify(participantRepository).save(participant);
    }
}
