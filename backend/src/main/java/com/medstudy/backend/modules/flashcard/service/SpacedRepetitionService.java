package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SpacedRepetitionService {

    private static final double MIN_EASE_FACTOR = 1.3;
    private final com.medstudy.backend.modules.flashcard.repository.FlashcardRepository repository;

    public SpacedRepetitionService(com.medstudy.backend.modules.flashcard.repository.FlashcardRepository repository) {
        this.repository = repository;
    }

    public void calculateNextRevision(Flashcard flashcard, FlashcardDifficulty difficulty) {
        int interval = flashcard.getIntervaloAtual();
        double easeFactor = flashcard.getEaseFactor();

        if (difficulty == FlashcardDifficulty.HARD) {
            flashcard.setConsecutiveHardCount(flashcard.getConsecutiveHardCount() + 1);
        } else {
            flashcard.setConsecutiveHardCount(0);
        }

        switch (difficulty) {
            case HARD -> {
                // Lapse Logic: 3rd hard or mature fail
                if (flashcard.getConsecutiveHardCount() >= 3) {
                    flashcard.setEaseFactor(Math.max(MIN_EASE_FACTOR, easeFactor - 0.2));
                    flashcard.setIntervaloAtual(0); // Reset to learning
                    flashcard.setConsecutiveHardCount(0);
                } else {
                    flashcard.setIntervaloAtual(1);
                }
            }
            case MEDIUM -> {
                if (interval == 0) {
                    flashcard.setIntervaloAtual(1);
                } else {
                    flashcard.setIntervaloAtual((int) Math.round(interval * easeFactor));
                }
            }
            case EASY -> {
                if (interval == 0) {
                    flashcard.setIntervaloAtual(4);
                } else {
                    flashcard.setIntervaloAtual((int) Math.round(interval * easeFactor * 1.2));
                }
                flashcard.setEaseFactor(easeFactor + 0.1);
            }
        }

        flashcard.setDificuldadeUltima(difficulty);
        
        // Jitter with Load Balancing
        LocalDate idealDate = LocalDate.now().plusDays(flashcard.getIntervaloAtual());
        flashcard.setProximaRevisao(calculateJitteredDate(flashcard.getUser().getId(), idealDate, flashcard.getIntervaloAtual()));
    }

    private LocalDate calculateJitteredDate(java.util.UUID userId, LocalDate idealDate, int interval) {
        if (interval < 3) return idealDate; // No jitter for very short intervals

        int jitterRange = Math.max(1, (int) Math.round(interval * 0.1));
        LocalDate startDate = idealDate.minusDays(jitterRange);
        LocalDate endDate = idealDate.plusDays(jitterRange);

        LocalDate bestDate = idealDate;
        long minLoad = Long.MAX_VALUE;

        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            long load = repository.countByUserIdAndProximaRevisao(userId, d);
            if (load < minLoad) {
                minLoad = load;
                bestDate = d;
            } else if (load == minLoad && Math.abs(java.time.temporal.ChronoUnit.DAYS.between(d, idealDate)) < 
                                          Math.abs(java.time.temporal.ChronoUnit.DAYS.between(bestDate, idealDate))) {
                bestDate = d; // Ties broken by proximity to ideal
            }
        }
        return bestDate;
    }
}
