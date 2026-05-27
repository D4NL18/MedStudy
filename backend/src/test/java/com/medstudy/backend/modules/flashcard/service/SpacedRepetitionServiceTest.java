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

        service.calculateNextRevision(f, FlashcardDifficulty.EASY);

        assertEquals(7, f.getIntervaloAtual());
        assertEquals(LocalDate.now().plusDays(7), f.getProximaRevisao());
    }

    @Test
    void calculateNextRevision_ShouldHandleHardCorrectly() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);

        service.calculateNextRevision(f, FlashcardDifficulty.HARD);

        assertEquals(1, f.getIntervaloAtual());
        assertEquals(LocalDate.now().plusDays(1), f.getProximaRevisao());
    }

    @Test
    void calculateNextRevision_ShouldHandleMediumCorrectly() {
        Flashcard f = new Flashcard();
        User u = new User(); u.setId(UUID.randomUUID());
        f.setUser(u);

        service.calculateNextRevision(f, FlashcardDifficulty.MEDIUM);

        assertEquals(4, f.getIntervaloAtual());
        assertEquals(LocalDate.now().plusDays(4), f.getProximaRevisao());
    }
}
