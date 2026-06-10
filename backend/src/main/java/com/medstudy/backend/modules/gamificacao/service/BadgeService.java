package com.medstudy.backend.modules.gamificacao.service;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.entity.UserBadge;
import com.medstudy.backend.modules.gamificacao.enums.BadgeContext;
import com.medstudy.backend.modules.gamificacao.repository.UserBadgeRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BadgeService {

    private final UserBadgeRepository userBadgeRepository;
    private final StudySessionRepository studySessionRepository;
    private final SimuladoRepository simuladoRepository;
    private final UserRepository userRepository;

    public BadgeService(UserBadgeRepository userBadgeRepository,
                        StudySessionRepository studySessionRepository,
                        SimuladoRepository simuladoRepository,
                        UserRepository userRepository) {
        this.userBadgeRepository = userBadgeRepository;
        this.studySessionRepository = studySessionRepository;
        this.simuladoRepository = simuladoRepository;
        this.userRepository = userRepository;
    }

    public List<BadgeType> checkAndAwardBadges(UUID userId, BadgeContext context) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        List<BadgeType> newlyEarned = new ArrayList<>();

        if (context == BadgeContext.QUESTION_SESSION || context == BadgeContext.GENERAL) {
            newlyEarned.addAll(checkQuestionBadges(user));
            newlyEarned.addAll(checkStreakBadges(user));
            newlyEarned.addAll(checkPrecisionBadges(user));
        }

        if (context == BadgeContext.SIMULADO_SESSION || context == BadgeContext.GENERAL) {
            newlyEarned.addAll(checkSimuladoBadges(user));
            newlyEarned.addAll(checkSimuladoFlawless(user));
        }

        return newlyEarned;
    }

    private List<BadgeType> checkStreakBadges(User user) {
        List<BadgeType> earned = new ArrayList<>();
        int streak = calculateStreak(user.getId());

        BadgeType[] streakBadges = {
            BadgeType.STREAK_3, BadgeType.STREAK_7, BadgeType.STREAK_14, 
            BadgeType.STREAK_21, BadgeType.STREAK_30, BadgeType.STREAK_50, 
            BadgeType.STREAK_100, BadgeType.STREAK_150, BadgeType.STREAK_200, BadgeType.STREAK_365
        };
        int[] streakValues = {3, 7, 14, 21, 30, 50, 100, 150, 200, 365};

        for (int i = 0; i < streakBadges.length; i++) {
            if (streak >= streakValues[i] && !hasBadge(user.getId(), streakBadges[i])) {
                awardBadge(user, streakBadges[i]);
                earned.add(streakBadges[i]);
            }
        }
        return earned;
    }

    private List<BadgeType> checkQuestionBadges(User user) {
        List<BadgeType> earned = new ArrayList<>();
        Long totalQuestionsObj = studySessionRepository.sumTotalQuestionsByUserId(user.getId());
        long totalQuestions = totalQuestionsObj != null ? totalQuestionsObj : 0;

        BadgeType[] qBadges = {
            BadgeType.QUESTIONS_10, BadgeType.QUESTIONS_50, BadgeType.QUESTIONS_100, 
            BadgeType.QUESTIONS_250, BadgeType.QUESTIONS_500, BadgeType.QUESTIONS_1000, 
            BadgeType.QUESTIONS_2000, BadgeType.QUESTIONS_3000, BadgeType.QUESTIONS_5000, BadgeType.QUESTIONS_10000
        };
        long[] qValues = {10, 50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000};

        for (int i = 0; i < qBadges.length; i++) {
            if (totalQuestions >= qValues[i] && !hasBadge(user.getId(), qBadges[i])) {
                awardBadge(user, qBadges[i]);
                earned.add(qBadges[i]);
            }
        }
        return earned;
    }

    private List<BadgeType> checkSimuladoBadges(User user) {
        List<BadgeType> earned = new ArrayList<>();
        long totalSimulados = simuladoRepository.countByUserId(user.getId());

        BadgeType[] simBadges = {
            BadgeType.SIMULADOS_1, BadgeType.SIMULADOS_3, BadgeType.SIMULADOS_5, 
            BadgeType.SIMULADOS_10, BadgeType.SIMULADOS_15, BadgeType.SIMULADOS_20, 
            BadgeType.SIMULADOS_30, BadgeType.SIMULADOS_40, BadgeType.SIMULADOS_50, BadgeType.SIMULADOS_100
        };
        long[] simValues = {1, 3, 5, 10, 15, 20, 30, 40, 50, 100};

        for (int i = 0; i < simBadges.length; i++) {
            if (totalSimulados >= simValues[i] && !hasBadge(user.getId(), simBadges[i])) {
                awardBadge(user, simBadges[i]);
                earned.add(simBadges[i]);
            }
        }
        return earned;
    }

    private List<BadgeType> checkPrecisionBadges(User user) {
        List<BadgeType> earned = new ArrayList<>();
        
        if (!hasBadge(user.getId(), BadgeType.PRECISION_80) && studySessionRepository.existsByPrecisionGreaterThanEqual(user.getId(), 10, 80.0)) {
            awardBadge(user, BadgeType.PRECISION_80);
            earned.add(BadgeType.PRECISION_80);
        }
        if (!hasBadge(user.getId(), BadgeType.PRECISION_90) && studySessionRepository.existsByPrecisionGreaterThanEqual(user.getId(), 10, 90.0)) {
            awardBadge(user, BadgeType.PRECISION_90);
            earned.add(BadgeType.PRECISION_90);
        }
        if (!hasBadge(user.getId(), BadgeType.PRECISION_100) && studySessionRepository.existsByPrecisionGreaterThanEqual(user.getId(), 10, 100.0)) {
            awardBadge(user, BadgeType.PRECISION_100);
            earned.add(BadgeType.PRECISION_100);
        }
        if (!hasBadge(user.getId(), BadgeType.PRECISION_GOD) && studySessionRepository.existsByPrecisionGreaterThanEqual(user.getId(), 50, 100.0)) {
            awardBadge(user, BadgeType.PRECISION_GOD);
            earned.add(BadgeType.PRECISION_GOD);
        }
        
        return earned;
    }

    private List<BadgeType> checkSimuladoFlawless(User user) {
        List<BadgeType> earned = new ArrayList<>();
        if (!hasBadge(user.getId(), BadgeType.FLAWLESS_SIMULADO) && simuladoRepository.existsFlawlessSimulado(user.getId())) {
            awardBadge(user, BadgeType.FLAWLESS_SIMULADO);
            earned.add(BadgeType.FLAWLESS_SIMULADO);
        }
        return earned;
    }

    private boolean hasBadge(UUID userId, BadgeType type) {
        return userBadgeRepository.existsByUserIdAndBadgeType(userId, type);
    }

    private void awardBadge(User user, BadgeType type) {
        userBadgeRepository.save(new UserBadge(user, type));
    }

    public List<UserBadge> getUserBadges(UUID userId) {
        return userBadgeRepository.findAllByUserId(userId);
    }

    private int calculateStreak(UUID userId) {
        List<LocalDate> dates = studySessionRepository.findDistinctSessionDatesByUserId(userId);
        if (dates.isEmpty()) return 0;

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
}
