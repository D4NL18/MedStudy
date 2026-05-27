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
