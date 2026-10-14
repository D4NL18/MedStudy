package com.medstudy.backend.modules.gamificacao.service;

import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.gamificacao.dto.StreakRepairExecutionResponse;
import com.medstudy.backend.modules.gamificacao.dto.StreakStatusResponse;
import com.medstudy.backend.modules.gamificacao.entity.StreakRepair;
import com.medstudy.backend.modules.gamificacao.repository.StreakRepairRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class StreakRepairService {

    public static final int REQUIRED_CARDS_COUNT = 20;
    public static final int COOLDOWN_DAYS = 14;

    private final StreakRepairRepository streakRepairRepository;
    private final StudySessionRepository studySessionRepository;
    private final FlashcardRepository flashcardRepository;

    public StreakRepairService(StreakRepairRepository streakRepairRepository,
                               StudySessionRepository studySessionRepository,
                               FlashcardRepository flashcardRepository) {
        this.streakRepairRepository = streakRepairRepository;
        this.studySessionRepository = studySessionRepository;
        this.flashcardRepository = flashcardRepository;
    }

    /**
     * Calculates the active streak for a user considering both study session dates and repaired dates.
     */
    @Transactional(readOnly = true)
    public int calculateEffectiveStreak(UUID userId) {
        List<LocalDate> sessionDates = studySessionRepository.findDistinctSessionDatesByUserId(userId);
        List<LocalDate> repairedDates = streakRepairRepository.findRepairedDatesByUserId(userId);

        Set<LocalDate> allDatesSet = new HashSet<>(sessionDates);
        allDatesSet.addAll(repairedDates);

        if (allDatesSet.isEmpty()) {
            return 0;
        }

        List<LocalDate> sortedDates = allDatesSet.stream()
                .sorted(Comparator.reverseOrder())
                .toList();

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!sortedDates.get(0).equals(today) && !sortedDates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < sortedDates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(sortedDates.get(i + 1), sortedDates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Calculates streak from a list of sessions and a user ID (for StudySessionService).
     */
    @Transactional(readOnly = true)
    public int calculateEffectiveStreak(List<LocalDate> sessionDates, UUID userId) {
        List<LocalDate> repairedDates = (userId != null)
                ? streakRepairRepository.findRepairedDatesByUserId(userId)
                : Collections.emptyList();

        Set<LocalDate> allDatesSet = new HashSet<>(sessionDates);
        allDatesSet.addAll(repairedDates);

        if (allDatesSet.isEmpty()) {
            return 0;
        }

        List<LocalDate> sortedDates = allDatesSet.stream()
                .sorted(Comparator.reverseOrder())
                .toList();

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (!sortedDates.get(0).equals(today) && !sortedDates.get(0).equals(yesterday)) {
            return 0;
        }

        int streak = 1;
        for (int i = 0; i < sortedDates.size() - 1; i++) {
            if (ChronoUnit.DAYS.between(sortedDates.get(i + 1), sortedDates.get(i)) == 1) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    /**
     * Checks if user has study or repair activity on a specific date.
     */
    private boolean hasActivityOnDate(UUID userId, LocalDate date) {
        List<LocalDate> sessionDates = studySessionRepository.findDistinctSessionDatesByUserId(userId);
        if (sessionDates.contains(date)) {
            return true;
        }
        return streakRepairRepository.existsByUserIdAndRepairedDate(userId, date);
    }

    /**
     * Gets the current streak status, danger flag, repair availability, and criteria for the user.
     */
    @Transactional(readOnly = true)
    public StreakStatusResponse getStreakStatus(User user) {
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        int currentStreak = calculateEffectiveStreak(userId);

        boolean hadActivityYesterday = hasActivityOnDate(userId, yesterday);
        boolean streakAtRisk = !hadActivityYesterday;

        Optional<StreakRepair> lastRepairOpt = streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        LocalDateTime lastRepairedAt = lastRepairOpt.map(StreakRepair::getCreatedAt).orElse(null);

        boolean cooldownExpired = true;
        if (lastRepairedAt != null) {
            long daysSinceLastRepair = ChronoUnit.DAYS.between(lastRepairedAt.toLocalDate(), today);
            if (daysSinceLastRepair < COOLDOWN_DAYS) {
                cooldownExpired = false;
            }
        }

        long cardsStudiedToday = flashcardRepository.countByUserIdAndLastStudiedAt(userId, today);
        boolean canRepair = streakAtRisk && cooldownExpired;
        LocalDateTime repairDeadline = LocalDateTime.of(today, LocalTime.MAX);

        return StreakStatusResponse.builder()
                .currentStreak(currentStreak)
                .streakAtRisk(streakAtRisk)
                .canRepair(canRepair)
                .repairDeadline(repairDeadline)
                .requiredCardsCount(REQUIRED_CARDS_COUNT)
                .currentRepairedCount((int) cardsStudiedToday)
                .lastRepairedAt(lastRepairedAt)
                .build();
    }

    /**
     * Executes the streak repair if eligible and requirements are met.
     */
    @Transactional
    public StreakRepairExecutionResponse executeRepair(User user) {
        UUID userId = user.getId();
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        if (hasActivityOnDate(userId, yesterday)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A ofensiva não foi quebrada ontem.");
        }

        Optional<StreakRepair> lastRepairOpt = streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        if (lastRepairOpt.isPresent()) {
            LocalDateTime lastRepairedAt = lastRepairOpt.get().getCreatedAt();
            long daysSince = ChronoUnit.DAYS.between(lastRepairedAt.toLocalDate(), today);
            if (daysSince < COOLDOWN_DAYS) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "O resgate de ofensiva só pode ser utilizado 1 vez a cada " + COOLDOWN_DAYS + " dias.");
            }
        }

        long cardsStudiedToday = flashcardRepository.countByUserIdAndLastStudiedAt(userId, today);
        if (cardsStudiedToday < REQUIRED_CARDS_COUNT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "É necessário revisar ao menos " + REQUIRED_CARDS_COUNT + " flashcards hoje para resgatar a ofensiva. Atuais: " + cardsStudiedToday);
        }

        StreakRepair repair = StreakRepair.builder()
                .user(user)
                .repairedDate(yesterday)
                .build();
        streakRepairRepository.save(repair);

        int newStreak = calculateEffectiveStreak(userId);

        return StreakRepairExecutionResponse.builder()
                .success(true)
                .newStreak(newStreak)
                .message("Ofensiva restaurada com sucesso!")
                .build();
    }
}
