package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class SpacedRepetitionServiceTest {

    private FlashcardRepository repository;
    private SpacedRepetitionService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(FlashcardRepository.class);
        service = new SpacedRepetitionService(repository);
    }

    @Test
    void calculateNextRevision_ShouldHandleEasyCorrectly() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);
        f.setIntervaloAtual(0);
        f.setEaseFactor(2.5);
        f.setConsecutiveHardCount(0);

        service.calculateNextRevision(f, FlashcardDifficulty.EASY);

        assertEquals(4, f.getIntervaloAtual());
        assertEquals(2.6, f.getEaseFactor());
        // Interval 4 has jitter ±0 (4*0.1=0.4 round 0). So it remains 4.
        assertEquals(LocalDate.now().plusDays(4), f.getProximaRevisao());
    }

    @Test
    void calculateNextRevision_ShouldHandleHardCorrectly() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);
        f.setIntervaloAtual(10);
        f.setEaseFactor(2.5);
        f.setConsecutiveHardCount(0);

        service.calculateNextRevision(f, FlashcardDifficulty.HARD);

        assertEquals(1, f.getIntervaloAtual());
        assertEquals(2.5, f.getEaseFactor()); // No EF penalty on 1st hard
        assertEquals(1, f.getConsecutiveHardCount());
    }

    @Test
    void calculateNextRevision_ShouldPenalizeEaseFactorOnThirdHard() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);
        f.setIntervaloAtual(10);
        f.setEaseFactor(2.5);
        f.setConsecutiveHardCount(2);

        service.calculateNextRevision(f, FlashcardDifficulty.HARD);

        assertEquals(0, f.getIntervaloAtual()); // Reset to learning
        assertEquals(2.3, f.getEaseFactor()); // 2.5 - 0.2
        assertEquals(0, f.getConsecutiveHardCount()); // Reset count
    }

    @Test
    void calculateNextRevision_ShouldHandleMediumCorrectly() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);
        f.setIntervaloAtual(1);
        f.setEaseFactor(2.5);
        f.setConsecutiveHardCount(0);

        service.calculateNextRevision(f, FlashcardDifficulty.MEDIUM);

        assertEquals(3, f.getIntervaloAtual()); // 1 * 2.5 = 2.5 -> round 3
        assertEquals(2.5, f.getEaseFactor());
    }
}
