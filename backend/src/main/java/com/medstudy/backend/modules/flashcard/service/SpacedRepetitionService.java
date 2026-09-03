package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.user.service.UserSettingsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Service for calculating spaced repetition intervals and revision distribution.
 */
@Service
public class SpacedRepetitionService {

    private static final double MIN_EASE_FACTOR = 1.3;
    private final FlashcardRepository repository;
    private final UserSettingsService userSettingsService;

    /**
     * Constructs a SpacedRepetitionService with repository only (for tests/fallback).
     *
     * @param repository the flashcard repository
     */
    public SpacedRepetitionService(FlashcardRepository repository) {
        this(repository, null);
    }

    /**
     * Constructs a new SpacedRepetitionService with dependencies.
     *
     * @param repository the flashcard repository
     * @param userSettingsService the user settings service
     */
    public SpacedRepetitionService(FlashcardRepository repository, UserSettingsService userSettingsService) {
        this.repository = repository;
        this.userSettingsService = userSettingsService;
    }

    /**
     * Calculates the initial revision date for a newly created flashcard.
     * Flashcards created today are never scheduled for today; they are distributed
     * across future days (starting tomorrow) using a valley-filling strategy (lowest load)
     * respecting the user's max reviews per day limit.
     *
     * @param userId the user ID
     * @return the distributed future revision date
     */
    public LocalDate calculateInitialRevisionDate(UUID userId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.plusDays(1);
        LocalDate endDate = today.plusDays(7);

        int maxPerDay = userSettingsService != null ? userSettingsService.getCurrentUserMaxReviewsPerDay() : 100;

        List<Object[]> results = repository.countByUserIdAndProximaRevisaoBetweenGroupByDate(userId, startDate, endDate);
        Map<LocalDate, Long> countsByDate = new HashMap<>();
        if (results != null) {
            for (Object[] row : results) {
                if (row.length >= 2 && row[0] instanceof LocalDate date && row[1] instanceof Number count) {
                    countsByDate.put(date, count.longValue());
                }
            }
        }

        LocalDate bestDate = null;
        long minCount = Long.MAX_VALUE;

        // Try to find the day with minimum load under maxPerDay within the next 7 days (valley-filling)
        for (int i = 1; i <= 7; i++) {
            LocalDate date = today.plusDays(i);
            long count = countsByDate.getOrDefault(date, 0L);
            if (count < maxPerDay && count < minCount) {
                minCount = count;
                bestDate = date;
            }
        }

        if (bestDate != null) {
            return bestDate;
        }

        // If all 7 days are at or above limit, look further ahead (up to 30 days)
        for (int i = 8; i <= 30; i++) {
            LocalDate date = today.plusDays(i);
            long count = repository.countByUserIdAndProximaRevisao(userId, date);
            if (count < maxPerDay) {
                return date;
            }
            if (count < minCount) {
                minCount = count;
                bestDate = date;
            }
        }

        return bestDate != null ? bestDate : startDate;
    }

    /**
     * Calculates and sets the next revision date and interval for a flashcard based on the difficulty.
     *
     * @param flashcard the flashcard to update
     * @param difficulty the difficulty level selected by the user
     */
    public void calculateNextRevision(Flashcard flashcard, FlashcardDifficulty difficulty) {
        int interval = 0;

        switch (difficulty) {
            case HARD -> interval = 1;
            case MEDIUM -> interval = 4;
            case EASY -> interval = 7;
        }

        flashcard.setIntervaloAtual(interval);
        flashcard.setDificuldadeUltima(difficulty);
        
        LocalDate idealDate = LocalDate.now().plusDays(interval);
        flashcard.setProximaRevisao(idealDate);
    }
}
