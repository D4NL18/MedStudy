package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SpacedRepetitionService {

    private static final double MIN_EASE_FACTOR = 1.3;

    /**
     * Atualiza os campos de agendamento do flashcard com base na dificuldade relatada.
     */
    public void calculateNextRevision(Flashcard flashcard, FlashcardDifficulty difficulty) {
        int interval = flashcard.getIntervaloAtual();
        double easeFactor = flashcard.getEaseFactor();

        switch (difficulty) {
            case HARD -> {
                flashcard.setIntervaloAtual(1);
                flashcard.setEaseFactor(Math.max(MIN_EASE_FACTOR, easeFactor - 0.2));
            }
            case MEDIUM -> {
                if (interval == 0) {
                    flashcard.setIntervaloAtual(1);
                } else {
                    flashcard.setIntervaloAtual((int) Math.round(interval * easeFactor));
                }
                // Ease factor mantém
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
        flashcard.setProximaRevisao(LocalDate.now().plusDays(flashcard.getIntervaloAtual()));
    }
}
