package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.List;
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

    @Test
    void calculateInitialRevisionDate_ShouldNeverReturnToday() {
        UUID userId = UUID.randomUUID();
        when(repository.countByUserIdAndProximaRevisaoBetweenGroupByDate(eq(userId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(java.util.Collections.emptyList());

        LocalDate initialDate = service.calculateInitialRevisionDate(userId);

        assertNotNull(initialDate);
        assertTrue(initialDate.isAfter(LocalDate.now()), "Initial revision date must be in the future, never today");
        assertEquals(LocalDate.now().plusDays(1), initialDate);
    }

    @Test
    void calculateInitialRevisionDate_ShouldFillValleyWhenTomorrowHasCards() {
        UUID userId = UUID.randomUUID();
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        // Tomorrow has 5 cards, day after has 0
        List<Object[]> mockCounts = java.util.Collections.singletonList(new Object[]{ tomorrow, 5L });
        when(repository.countByUserIdAndProximaRevisaoBetweenGroupByDate(eq(userId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(mockCounts);

        LocalDate initialDate = service.calculateInitialRevisionDate(userId);

        assertEquals(dayAfter, initialDate, "Should choose the day with fewer cards (valley-filling)");
    }

    @Test
    void calculateInitialRevisionDate_ShouldAdvanceWhenDaysReachLimit() {
        UUID userId = UUID.randomUUID();
        com.medstudy.backend.modules.user.service.UserSettingsService userSettingsService = Mockito.mock(com.medstudy.backend.modules.user.service.UserSettingsService.class);
        when(userSettingsService.getCurrentUserMaxReviewsPerDay()).thenReturn(3);

        SpacedRepetitionService serviceWithLimit = new SpacedRepetitionService(repository, userSettingsService);

        // Days 1 to 7 all have 3 cards (full)
        java.util.List<Object[]> mockCounts = new java.util.ArrayList<>();
        for (int i = 1; i <= 7; i++) {
            mockCounts.add(new Object[]{ LocalDate.now().plusDays(i), 3L });
        }
        when(repository.countByUserIdAndProximaRevisaoBetweenGroupByDate(eq(userId), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(mockCounts);

        // Day 8 has 0 cards (< 3)
        when(repository.countByUserIdAndProximaRevisao(userId, LocalDate.now().plusDays(8))).thenReturn(0L);

        LocalDate initialDate = serviceWithLimit.calculateInitialRevisionDate(userId);

        assertEquals(LocalDate.now().plusDays(8), initialDate, "Should advance to next day with available capacity");
    }
}
