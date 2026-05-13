package com.medstudy.backend.modules.gamificacao.service;

import com.medstudy.backend.modules.gamificacao.entity.BadgeType;
import com.medstudy.backend.modules.gamificacao.entity.UserBadge;
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

    public List<BadgeType> checkAndAwardBadges(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        List<BadgeType> newlyEarned = new ArrayList<>();

        // 1. Check Streak 7
        if (!userBadgeRepository.existsByUserIdAndBadgeType(userId, BadgeType.STREAK_7)) {
            if (calculateStreak(userId) >= 7) {
                userBadgeRepository.save(new UserBadge(user, BadgeType.STREAK_7));
                newlyEarned.add(BadgeType.STREAK_7);
            }
        }

        // 2. Check 1000 Questions
        if (!userBadgeRepository.existsByUserIdAndBadgeType(userId, BadgeType.QUESTIONS_1000)) {
            Long totalQuestions = studySessionRepository.sumTotalQuestionsByUserId(userId);
            if (totalQuestions != null && totalQuestions >= 1000) {
                userBadgeRepository.save(new UserBadge(user, BadgeType.QUESTIONS_1000));
                newlyEarned.add(BadgeType.QUESTIONS_1000);
            }
        }

        // 3. Check 10 Simulados
        if (!userBadgeRepository.existsByUserIdAndBadgeType(userId, BadgeType.SIMULADOS_10)) {
            long totalSimulados = simuladoRepository.countByUserId(userId);
            if (totalSimulados >= 10) {
                userBadgeRepository.save(new UserBadge(user, BadgeType.SIMULADOS_10));
                newlyEarned.add(BadgeType.SIMULADOS_10);
            }
        }

        return newlyEarned;
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
