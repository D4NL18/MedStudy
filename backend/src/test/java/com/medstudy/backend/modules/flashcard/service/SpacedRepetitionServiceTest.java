package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class SpacedRepetitionServiceTest {

    private SpacedRepetitionService service;
    private Flashcard flashcard;

    @BeforeEach
    void setUp() {
        service = new SpacedRepetitionService();
        flashcard = new Flashcard();
        flashcard.setIntervaloAtual(0);
        flashcard.setEaseFactor(2.5);
        flashcard.setProximaRevisao(LocalDate.now());
    }

    @Test
    void shouldSetIntervalToOne_WhenHard() {
        service.calculateNextRevision(flashcard, FlashcardDifficulty.HARD);
        
        assertEquals(1, flashcard.getIntervaloAtual());
        assertEquals(2.3, flashcard.getEaseFactor()); // 2.5 - 0.2
        assertEquals(LocalDate.now().plusDays(1), flashcard.getProximaRevisao());
    }

    @Test
    void shouldSetIntervalToOne_WhenMediumAndFirstTime() {
        service.calculateNextRevision(flashcard, FlashcardDifficulty.MEDIUM);
        
        assertEquals(1, flashcard.getIntervaloAtual());
        assertEquals(2.5, flashcard.getEaseFactor());
        assertEquals(LocalDate.now().plusDays(1), flashcard.getProximaRevisao());
    }

    @Test
    void shouldSetIntervalToFour_WhenEasyAndFirstTime() {
        service.calculateNextRevision(flashcard, FlashcardDifficulty.EASY);
        
        assertEquals(4, flashcard.getIntervaloAtual());
        assertEquals(2.6, flashcard.getEaseFactor()); // 2.5 + 0.1
        assertEquals(LocalDate.now().plusDays(4), flashcard.getProximaRevisao());
    }

    @Test
    void shouldGrowInterval_WhenEasyAndAlreadyStudied() {
        flashcard.setIntervaloAtual(4);
        flashcard.setEaseFactor(2.6);
        
        service.calculateNextRevision(flashcard, FlashcardDifficulty.EASY);
        
        // interval = 4 * 2.6 * 1.2 = 12.48 -> 12
        assertEquals(12, flashcard.getIntervaloAtual());
        assertEquals(2.7, flashcard.getEaseFactor());
    }
}
