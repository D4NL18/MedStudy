package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class SpacedRepetitionServiceTest {

    private final SpacedRepetitionService service = new SpacedRepetitionService();

    @Test
    void calculateNextRevision_ShouldHandleEasyCorrectly() {
        Flashcard f = new Flashcard();
        f.setIntervaloAtual(0);
        f.setEaseFactor(2.5);

        service.calculateNextRevision(f, FlashcardDifficulty.EASY);

        assertEquals(4, f.getIntervaloAtual());
        assertEquals(2.6, f.getEaseFactor());
        assertEquals(LocalDate.now().plusDays(4), f.getProximaRevisao());
    }

    @Test
    void calculateNextRevision_ShouldHandleHardCorrectly() {
        Flashcard f = new Flashcard();
        f.setIntervaloAtual(10);
        f.setEaseFactor(2.5);

        service.calculateNextRevision(f, FlashcardDifficulty.HARD);

        assertEquals(1, f.getIntervaloAtual());
        assertEquals(2.3, f.getEaseFactor());
    }

    @Test
    void calculateNextRevision_ShouldHandleMediumCorrectly() {
        Flashcard f = new Flashcard();
        f.setIntervaloAtual(1);
        f.setEaseFactor(2.5);

        service.calculateNextRevision(f, FlashcardDifficulty.MEDIUM);

        assertEquals(3, f.getIntervaloAtual()); // 1 * 2.5 = 2.5 -> round 3
        assertEquals(2.5, f.getEaseFactor());
    }
}
