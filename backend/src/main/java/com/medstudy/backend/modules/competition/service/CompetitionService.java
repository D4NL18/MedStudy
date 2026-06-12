package com.medstudy.backend.modules.competition.service;

import com.medstudy.backend.modules.competition.dto.CompetitionRequestDTO;
import com.medstudy.backend.modules.competition.dto.CompetitionResponseDTO;
import com.medstudy.backend.modules.competition.dto.LeaderboardEntryDTO;

import com.medstudy.backend.modules.competition.entity.Competition;
import com.medstudy.backend.modules.competition.entity.CompetitionParticipant;
import com.medstudy.backend.modules.competition.entity.ParticipantStatus;
import com.medstudy.backend.modules.competition.entity.MetricType;
import com.medstudy.backend.modules.competition.entity.CompetitionStatus;
import com.medstudy.backend.modules.competition.entity.CompetitionType;
import com.medstudy.backend.modules.competition.mapper.CompetitionMapper;
import com.medstudy.backend.modules.competition.repository.CompetitionParticipantRepository;
import com.medstudy.backend.modules.competition.repository.CompetitionRepository;
import com.medstudy.backend.modules.friendship.entity.Friendship;
import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import com.medstudy.backend.modules.friendship.repository.FriendshipRepository;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import com.medstudy.backend.modules.profile.entity.Profile;
import com.medstudy.backend.modules.profile.repository.ProfileRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for managing competitions.
 */
@Service
@Transactional
public class CompetitionService {

    private final CompetitionRepository competitionRepository;
    private final CompetitionParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final NotificationService notificationService;
    private final StudySessionRepository studySessionRepository;
    private final ProfileRepository profileRepository;
    private final CompetitionMapper competitionMapper;

    /**
     * Constructs a new CompetitionService.
     *
     * @param competitionRepository the competition repository
     * @param participantRepository the participant repository
     * @param userRepository the user repository
     * @param friendshipRepository the friendship repository
     * @param notificationService the notification service
     * @param studySessionRepository the study session repository
     * @param profileRepository the profile repository
     * @param competitionMapper the competition mapper
     */
    public CompetitionService(CompetitionRepository competitionRepository,
                              CompetitionParticipantRepository participantRepository,
                              UserRepository userRepository,
                              FriendshipRepository friendshipRepository,
                              NotificationService notificationService,
                              StudySessionRepository studySessionRepository,
                              ProfileRepository profileRepository,
                              CompetitionMapper competitionMapper) {
        this.competitionRepository = competitionRepository;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.notificationService = notificationService;
        this.studySessionRepository = studySessionRepository;
        this.profileRepository = profileRepository;
        this.competitionMapper = competitionMapper;
    }

    private User getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new RuntimeException("Sessão expirada ou usuário não autenticado");
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        throw new RuntimeException("Usuário não autenticado");
    }

    /**
     * Creates a new competition.
     *
     * @param request the competition request details
     * @return the created competition response
     */
    public CompetitionResponseDTO createCompetition(CompetitionRequestDTO request) {
        User creator = getCurrentUser();
        
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("O título da competição não pode ser vazio");
        }
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("As datas de início e fim devem ser especificadas");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("A data de início deve ser anterior ou igual à data de fim");
        }

        Competition competition = new Competition();
        competition.setTitle(request.getTitle());
        competition.setCreator(creator);
        competition.setCompetitionType(request.getCompetitionType());
        competition.setMetricType(request.getMetricType());
        competition.setTargetValue(request.getTargetValue());
        competition.setStartDate(request.getStartDate());
        competition.setEndDate(request.getEndDate());

        LocalDate today = LocalDate.now();
        if (request.getStartDate().isAfter(today)) {
            competition.setStatus(CompetitionStatus.PENDING);
        } else if (request.getEndDate().isBefore(today)) {
            competition.setStatus(CompetitionStatus.FINISHED);
        } else {
            competition.setStatus(CompetitionStatus.ACTIVE);
        }

        competition = competitionRepository.save(competition);

        CompetitionParticipant creatorParticipant = new CompetitionParticipant(competition, creator, ParticipantStatus.ACCEPTED);
        creatorParticipant.setJoinedAt(LocalDateTime.now());
        creatorParticipant = participantRepository.save(creatorParticipant);
        competition.getParticipants().add(creatorParticipant);

        List<Runnable> pendingNotifications = new ArrayList<>();

        if (request.getInvitedFriendIds() != null) {
            for (UUID friendId : request.getInvitedFriendIds()) {
                if (friendId.equals(creator.getId())) {
                    continue;
                }
                User friend = userRepository.findById(friendId)
                        .orElseThrow(() -> new IllegalArgumentException("Usuário convidado não encontrado"));

                Friendship friendship = friendshipRepository.findFriendshipBetween(creator.getId(), friendId)
                        .orElseThrow(() -> new IllegalArgumentException("O convidado não é seu amigo"));

                if (friendship.getStatus() != FriendshipStatus.ACCEPTED) {
                    throw new IllegalArgumentException("O convidado não é seu amigo ativo");
                }

                CompetitionParticipant participant = new CompetitionParticipant(competition, friend, ParticipantStatus.INVITED);
                participant = participantRepository.save(participant);
                competition.getParticipants().add(participant);

                final User finalFriend = friend;
                final String notifType = (competition.getCompetitionType() == CompetitionType.GROUP) ? "COMPETITION_INVITE" : "DUEL_INVITE";
                final String message = creator.getName() + " convidou você para o desafio: " + competition.getTitle();
                pendingNotifications.add(() -> notificationService.createNotification(finalFriend, creator, notifType, message));
            }
        }

        pendingNotifications.forEach(Runnable::run);

        return competitionMapper.toDTO(competition);
    }

    /**
     * Accepts a competition invite.
     *
     * @param competitionId the ID of the competition
     * @return the competition response
     */
    public CompetitionResponseDTO acceptInvite(UUID competitionId) {
        User user = getCurrentUser();
        CompetitionParticipant participant = participantRepository.findByCompetitionIdAndUserId(competitionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Convite não encontrado"));

        if (participant.getStatus() != ParticipantStatus.INVITED) {
            throw new IllegalStateException("O convite já foi respondido");
        }

        participant.setStatus(ParticipantStatus.ACCEPTED);
        participant.setJoinedAt(LocalDateTime.now());
        participantRepository.save(participant);

        return competitionMapper.toDTO(participant.getCompetition());
    }

    /**
     * Declines a competition invite.
     *
     * @param competitionId the ID of the competition
     * @return the competition response
     */
    public CompetitionResponseDTO declineInvite(UUID competitionId) {
        User user = getCurrentUser();
        CompetitionParticipant participant = participantRepository.findByCompetitionIdAndUserId(competitionId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Convite não encontrado"));

        if (participant.getStatus() != ParticipantStatus.INVITED) {
            throw new IllegalStateException("O convite já foi respondido");
        }

        participant.setStatus(ParticipantStatus.DECLINED);
        participantRepository.save(participant);

        return competitionMapper.toDTO(participant.getCompetition());
    }

    /**
     * Retrieves all competitions for the current user.
     *
     * @return a list of competition responses
     */
    public List<CompetitionResponseDTO> getUserCompetitions() {
        User user = getCurrentUser();
        checkAndUpdateStatuses();
        List<Competition> competitions = competitionRepository.findAllByParticipantUserId(user.getId());
        return competitionMapper.toDTOs(competitions);
    }

    /**
     * Retrieves the leaderboard for a specific competition.
     *
     * @param competitionId the ID of the competition
     * @return a list of leaderboard entries
     */
    public List<LeaderboardEntryDTO> getLeaderboard(UUID competitionId) {
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new IllegalArgumentException("Competição não encontrada"));

        List<CompetitionParticipant> acceptedParticipants = competition.getParticipants().stream()
                .filter(p -> p.getStatus() == ParticipantStatus.ACCEPTED)
                .collect(Collectors.toList());

        List<LeaderboardEntryDTO> entries = new ArrayList<>();

        for (CompetitionParticipant p : acceptedParticipants) {
            User user = p.getUser();
            Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);
            String handle = profile != null ? profile.getHandle() : "";
            String avatarPresetId = profile != null ? profile.getAvatarPresetId() : "default";

            Long score = 0L;
            if (competition.getMetricType() == MetricType.TOTAL_QUESTIONS) {
                score = studySessionRepository.sumTotalQuestionsByUserIdAndDateRange(user.getId(), competition.getStartDate(), competition.getEndDate());
            } else if (competition.getMetricType() == MetricType.CORRECT_QUESTIONS) {
                score = studySessionRepository.sumTotalCorrectQuestionsByUserIdAndDateRange(user.getId(), competition.getStartDate(), competition.getEndDate());
            }

            entries.add(new LeaderboardEntryDTO(user.getId(), user.getName(), handle, avatarPresetId, score, 0));
        }

        entries.sort(Comparator.comparing(LeaderboardEntryDTO::getScore).reversed());

        List<LeaderboardEntryDTO> positionedEntries = new ArrayList<>();
        for (int i = 0; i < entries.size(); i++) {
            LeaderboardEntryDTO entry = entries.get(i);
            positionedEntries.add(new LeaderboardEntryDTO(
                    entry.getUserId(),
                    entry.getName(),
                    entry.getHandle(),
                    entry.getAvatarPresetId(),
                    entry.getScore(),
                    i + 1
            ));
        }

        return positionedEntries;
    }

    /**
     * Checks and updates the status of active duels for a given user.
     *
     * @param userId the ID of the user
     */
    public void checkActiveDuels(UUID userId) {
        List<Competition> activeTargetDuels = competitionRepository.findActiveTargetDuelsByUserId(userId);

        for (Competition duel : activeTargetDuels) {
            List<LeaderboardEntryDTO> leaderboard = getLeaderboard(duel.getId());
            if (leaderboard.isEmpty()) continue;

            LeaderboardEntryDTO topEntry = leaderboard.get(0);
            Integer target = duel.getTargetValue();

            if (target != null && topEntry.getScore() >= target) {
                duel.setStatus(CompetitionStatus.FINISHED);
                competitionRepository.save(duel);

                User winner = userRepository.findById(topEntry.getUserId()).orElse(null);

                for (CompetitionParticipant p : duel.getParticipants()) {
                    if (p.getStatus() != ParticipantStatus.ACCEPTED) continue;

                    User participantUser = p.getUser();
                    if (participantUser.getId().equals(topEntry.getUserId())) {
                        notificationService.createNotification(
                                participantUser,
                                null,
                                "COMPETITION_FINISHED",
                                "Parabéns! Você venceu o duelo '" + duel.getTitle() + "'!"
                        );
                    } else {
                        notificationService.createNotification(
                                participantUser,
                                winner,
                                "COMPETITION_FINISHED",
                                "O duelo '" + duel.getTitle() + "' terminou. " + (winner != null ? winner.getName() : "Alguém") + " atingiu a meta primeiro!"
                        );
                    }
                }
            }
        }
    }

    /**
     * Checks and updates the statuses of all competitions based on dates.
     */
    public void checkAndUpdateStatuses() {
        LocalDate today = LocalDate.now();
        List<Competition> allCompetitions = competitionRepository.findAll();
        for (Competition c : allCompetitions) {
            CompetitionStatus originalStatus = c.getStatus();
            if (c.getStatus() == CompetitionStatus.PENDING && !c.getStartDate().isAfter(today)) {
                c.setStatus(CompetitionStatus.ACTIVE);
            }
            if (c.getStatus() == CompetitionStatus.ACTIVE && c.getEndDate().isBefore(today)) {
                c.setStatus(CompetitionStatus.FINISHED);
            }
            if (c.getStatus() != originalStatus) {
                competitionRepository.save(c);
            }
        }
    }
}
