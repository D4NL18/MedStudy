package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Service for calculating spaced repetition intervals.
 */
@Service
public class SpacedRepetitionService {

    private static final double MIN_EASE_FACTOR = 1.3;
    private final com.medstudy.backend.modules.flashcard.repository.FlashcardRepository repository;

    /**
     * Constructs a new SpacedRepetitionService.
     *
     * @param repository the flashcard repository
     */
    public SpacedRepetitionService(com.medstudy.backend.modules.flashcard.repository.FlashcardRepository repository) {
        this.repository = repository;
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
