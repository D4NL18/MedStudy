package com.medstudy.backend.modules.sessao.service;

import com.medstudy.backend.modules.sessao.dto.StudySessionMetricsResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.sessao.specification.StudySessionSpecifications;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import com.medstudy.backend.modules.profile.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class StudySessionService {

    private final StudySessionRepository repository;
    private final UserRepository userRepository;
    private final StudySessionMapper mapper;
    private final com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository;
    private final com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService;
    private final com.medstudy.backend.modules.profile.repository.ProfileRepository profileRepository;
    private final com.medstudy.backend.modules.friendship.repository.FriendshipRepository friendshipRepository;
    private final com.medstudy.backend.modules.notificacao.service.NotificationService notificationService;
    private final com.medstudy.backend.modules.competition.service.CompetitionService competitionService;

    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public StudySessionService(StudySessionRepository repository, 
                               UserRepository userRepository, 
                               StudySessionMapper mapper,
                               com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository,
                               com.medstudy.backend.modules.gamificacao.service.BadgeService badgeService,
                               com.medstudy.backend.modules.profile.repository.ProfileRepository profileRepository,
                               com.medstudy.backend.modules.friendship.repository.FriendshipRepository friendshipRepository,
                               com.medstudy.backend.modules.notificacao.service.NotificationService notificationService,
                               com.medstudy.backend.modules.competition.service.CompetitionService competitionService,
                               org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.mapper = mapper;
        this.lessonRepository = lessonRepository;
        this.badgeService = badgeService;
        this.profileRepository = profileRepository;
        this.friendshipRepository = friendshipRepository;
        this.notificationService = notificationService;
        this.competitionService = competitionService;
        this.eventPublisher = eventPublisher;
    }

    private User getCurrentUser() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            throw new RuntimeException("Sessão expirada ou usuário não autenticado");
        }
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new RuntimeException("Tipo de principal inválido: " + principal.getClass().getName());
        }
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco de dados"));
    }

    private void broadcastSocialEvents(User currentUser, int streakBefore, List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newBadges) {
        Profile profile = profileRepository.findByUserId(currentUser.getId()).orElse(null);
        if (profile == null) return;

        List<com.medstudy.backend.modules.friendship.entity.Friendship> friendships = friendshipRepository.findAllAcceptedFriendships(currentUser.getId());
        if (friendships.isEmpty()) return;

        // 1. Check Streak Increase
        List<StudySession> sessionsAfter = repository.findAll(StudySessionSpecifications.hasUserId(currentUser.getId()));
        int streakAfter = calculateStreak(sessionsAfter);
        if (streakAfter > streakBefore && Boolean.TRUE.equals(profile.getShareStreak())) {
            String senderName = profile.getNomeCompleto();
            for (com.medstudy.backend.modules.friendship.entity.Friendship f : friendships) {
                User friend = f.getRequester().getId().equals(currentUser.getId()) ? f.getReceiver() : f.getRequester();
                notificationService.createNotification(
                    friend,
                    currentUser,
                    "STREAK_RECORD",
                    senderName + " atingiu um streak de " + streakAfter + " dias de estudo seguidos!"
                );
            }
        }

        // 2. Check Badges Earned
        if (newBadges != null && !newBadges.isEmpty() && Boolean.TRUE.equals(profile.getShareBadges())) {
            String senderName = profile.getNomeCompleto();
            for (com.medstudy.backend.modules.gamificacao.entity.BadgeType badge : newBadges) {
                for (com.medstudy.backend.modules.friendship.entity.Friendship f : friendships) {
                    User friend = f.getRequester().getId().equals(currentUser.getId()) ? f.getReceiver() : f.getRequester();
                    notificationService.createNotification(
                        friend,
                        currentUser,
                        "BADGE_EARNED",
                        senderName + " conquistou a medalha '" + badge.getDisplayName() + "'!"
                    );
                }
                
                // Publish Feed Event
                eventPublisher.publishEvent(new com.medstudy.backend.modules.feed.events.FeedEventListener.BadgeEarnedEvent(
                    currentUser.getId().getMostSignificantBits() & Long.MAX_VALUE, // mock Long for POC
                    badge.name(),
                    badge.getDisplayName(),
                    badge.getDescription()
                ));
            }
        }
    }

    public StudySessionResponse createSession(StudySessionRequest request) {
        validateSession(request);

        User currentUser = getCurrentUser();
        List<StudySession> sessionsBefore = repository.findAll(StudySessionSpecifications.hasUserId(currentUser.getId()));
        int streakBefore = calculateStreak(sessionsBefore);

        StudySession entity = mapper.toEntity(request);
        entity.setUser(currentUser);
        
        double percentual = request.qtsFeitas() > 0 ? (double) request.qtsCorretas() / request.qtsFeitas() * 100 : 0;
        entity.setUrgente(percentual < 40);
        if (request.dataProximaRevisao() != null) {
            entity.setDataProximaRevisao(request.dataProximaRevisao());
        } else {
            entity.setDataProximaRevisao(calculateNextRevision(percentual, request.dataSessao(), sessionsBefore.stream().filter(s -> s.getTema() != null && s.getTema().equals(request.tema())).toList()));
        }

        StudySession saved = repository.save(entity);
        
        // Mark previous revisions for the same tema as concluded
        List<StudySession> pendingRevisions = repository.findAll(
            Specification.where(StudySessionSpecifications.hasUserId(currentUser.getId()))
                .and(StudySessionSpecifications.hasTema(request.tema()))
                .and(StudySessionSpecifications.hasRevisaoConcluida(false))
        );
        for (StudySession pending : pendingRevisions) {
            if (!pending.getId().equals(saved.getId())) {
                pending.setRevisaoConcluida(true);
                repository.save(pending);
            }
        }
        
        // Gamificação: Check for badges
        List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newBadges = badgeService.checkAndAwardBadges(currentUser.getId(), com.medstudy.backend.modules.gamificacao.enums.BadgeContext.QUESTION_SESSION);
        
        // Legacy rule: Update lesson performance
        updateLessonPerformance(saved.getTema(), currentUser);

        // Broadcast social events if sharing is active
        broadcastSocialEvents(currentUser, streakBefore, newBadges);
        
        competitionService.checkActiveDuels(currentUser.getId());
        
        return mapper.toResponse(saved, newBadges);
    }

    public Page<StudySessionResponse> findAll(String grandeArea, String tema, String instituicao, Boolean revisaoConcluida, Double minRate, Double maxRate, Pageable pageable) {
        User currentUser = getCurrentUser();
        
        Specification<StudySession> spec = Specification.where(StudySessionSpecifications.hasUserId(currentUser.getId()))
                .and(StudySessionSpecifications.hasGrandeArea(grandeArea))
                .and(StudySessionSpecifications.search(tema))
                .and(StudySessionSpecifications.hasInstituicao(instituicao))
                .and(StudySessionSpecifications.hasRevisaoConcluida(revisaoConcluida))
                .and(StudySessionSpecifications.hasMinSuccessRate(minRate))
                .and(StudySessionSpecifications.hasMaxSuccessRate(maxRate));

        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public StudySessionResponse getById(UUID id) {
        StudySession entity = getSessionAndVerifyOwnership(id);
        return mapper.toResponse(entity);
    }

    public StudySessionResponse updateSession(UUID id, StudySessionRequest request) {
        validateSession(request);
        StudySession entity = getSessionAndVerifyOwnership(id);

        User currentUser = getCurrentUser();
        List<StudySession> sessionsBefore = repository.findAll(StudySessionSpecifications.hasUserId(currentUser.getId()));
        int streakBefore = calculateStreak(sessionsBefore);

        entity.setGrandeArea(request.grandeArea());
        entity.setTema(request.tema());
        entity.setDataSessao(request.dataSessao());
        entity.setQtsFeitas(request.qtsFeitas());
        entity.setQtsCorretas(request.qtsCorretas());
        entity.setInstituicao(request.instituicao());
        entity.setObservacoes(request.observacoes());
        entity.setRevisaoConcluida(request.revisaoConcluida());
        
        // Recalculate revision date on update
        double percentual = request.qtsFeitas() > 0 ? (double) request.qtsCorretas() / request.qtsFeitas() * 100 : 0;
        entity.setUrgente(percentual < 40);
        if (request.dataProximaRevisao() != null) {
            entity.setDataProximaRevisao(request.dataProximaRevisao());
        } else {
            entity.setDataProximaRevisao(calculateNextRevision(percentual, request.dataSessao(), sessionsBefore.stream().filter(s -> s.getTema() != null && s.getTema().equals(request.tema())).toList()));
        }

        StudySession saved = repository.save(entity);
        
        // Gamificação: Check for badges
        List<com.medstudy.backend.modules.gamificacao.entity.BadgeType> newBadges = badgeService.checkAndAwardBadges(currentUser.getId(), com.medstudy.backend.modules.gamificacao.enums.BadgeContext.QUESTION_SESSION);
        
        // Legacy rule: Update lesson performance
        updateLessonPerformance(saved.getTema(), currentUser);

        // Broadcast social events if sharing is active
        broadcastSocialEvents(currentUser, streakBefore, newBadges);
        
        competitionService.checkActiveDuels(currentUser.getId());
        
        return mapper.toResponse(saved, newBadges);
    }

    public void deleteSession(UUID id) {
        StudySession entity = getSessionAndVerifyOwnership(id);
        repository.delete(entity);
    }

    public void concluirRevisao(UUID id) {
        StudySession entity = getSessionAndVerifyOwnership(id);
        entity.setRevisaoConcluida(true);
        repository.save(entity);
    }

    public StudySessionMetricsResponse getMetrics() {
        User currentUser = getCurrentUser();
        List<StudySession> sessions = repository.findAll(StudySessionSpecifications.hasUserId(currentUser.getId()));

        long totalSessoes = sessions.size();
        long totalQuestoes = sessions.stream().mapToLong(StudySession::getQtsFeitas).sum();
        long totalCorretas = sessions.stream().mapToLong(StudySession::getQtsCorretas).sum();
        double mediaAcertos = totalQuestoes > 0 ? (double) totalCorretas / totalQuestoes * 100 : 0;

        LocalDate today = LocalDate.now();
        long revisoesCriticas = sessions.stream()
                .filter(s -> !s.getRevisaoConcluida() && s.getDataProximaRevisao() != null && s.getDataProximaRevisao().isBefore(today))
                .count();

        int streak = calculateStreak(sessions);

        return new StudySessionMetricsResponse(totalSessoes, totalQuestoes, mediaAcertos, revisoesCriticas, streak);
    }

    private void validateSession(StudySessionRequest request) {
        if (request.qtsCorretas() > request.qtsFeitas()) {
            throw new IllegalArgumentException("Quantidade de corretas não pode ser maior que o total de feitas");
        }
    }

    private StudySession getSessionAndVerifyOwnership(UUID id) {
        User currentUser = getCurrentUser();
        StudySession entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        if (!entity.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Acesso negado");
        }
        return entity;
    }

    private LocalDate calculateNextRevision(double percentual, LocalDate dataSessao, List<StudySession> pastSessionsForTema) {
        int diasParaRevisao;

        long reviewsBoas = pastSessionsForTema == null ? 0 : pastSessionsForTema.stream()
            .filter(s -> s.getQtsFeitas() != null && s.getQtsFeitas() > 0 && 
                        ((double) (s.getQtsCorretas() != null ? s.getQtsCorretas() : 0) / s.getQtsFeitas() * 100) >= 75)
            .count();

        if (percentual < 50) diasParaRevisao = 1;
        else if (percentual < 75) diasParaRevisao = 2 + (int) reviewsBoas;
        else if (percentual < 90) diasParaRevisao = 5 + (int) (reviewsBoas * 3);
        else diasParaRevisao = 10 + (int) (reviewsBoas * 5);

        return dataSessao.plusDays(diasParaRevisao);
    }

    private int calculateStreak(List<StudySession> sessions) {
        if (sessions.isEmpty()) return 0;

        List<LocalDate> dates = sessions.stream()
                .map(StudySession::getDataSessao)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!dates.get(0).equals(today) && !dates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < dates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(dates.get(i+1), dates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private void updateLessonPerformance(String tema, User user) {
        lessonRepository.findByUserAndTema(user, tema).ifPresent(lesson -> {
            List<StudySession> sessions = repository.findAll(
                Specification.where(StudySessionSpecifications.hasUserId(user.getId()))
                .and(StudySessionSpecifications.hasTema(tema))
            );

            if (!sessions.isEmpty()) {
                long totalFeitas = sessions.stream().mapToLong(StudySession::getQtsFeitas).sum();
                long totalCorretas = sessions.stream().mapToLong(StudySession::getQtsCorretas).sum();
                double percentual = totalFeitas > 0 ? (double) totalCorretas / totalFeitas * 100 : 0;

                lesson.setPercentAcerto((int) percentual);
                lesson.setDataAula(sessions.stream()
                        .map(StudySession::getDataSessao)
                        .max(Comparator.naturalOrder())
                        .orElse(null));
                
                // Legacy rule: < 75% needs reinforcement
                lesson.setReforco(percentual < 75);
                lesson.setRevisao(percentual < 85); // Optional: also flag for revision if < 85%
                
                lessonRepository.save(lesson);
            }
        });
    }
}
