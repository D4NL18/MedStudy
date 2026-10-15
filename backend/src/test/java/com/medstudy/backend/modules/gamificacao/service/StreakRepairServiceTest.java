package com.medstudy.backend.modules.gamificacao.service;

import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.gamificacao.dto.StreakRepairExecutionResponse;
import com.medstudy.backend.modules.gamificacao.dto.StreakStatusResponse;
import com.medstudy.backend.modules.gamificacao.entity.StreakRepair;
import com.medstudy.backend.modules.gamificacao.repository.StreakRepairRepository;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StreakRepairServiceTest {

    @Mock
    private StreakRepairRepository streakRepairRepository;

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private FlashcardRepository flashcardRepository;

    @InjectMocks
    private StreakRepairService streakRepairService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("aluno@medstudy.com");
    }

    @Test
    void calculateEffectiveStreak_ShouldReturnZero_WhenNoSessionsAndNoRepairs() {
        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(Collections.emptyList());
        when(streakRepairRepository.findRepairedDatesByUserId(userId)).thenReturn(Collections.emptyList());

        int streak = streakRepairService.calculateEffectiveStreak(userId);

        assertEquals(0, streak);
    }

    @Test
    void calculateEffectiveStreak_ShouldIncludeRepairedDateAsBridge() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate twoDaysAgo = today.minusDays(2);
        LocalDate threeDaysAgo = today.minusDays(3);

        // Usuário estudou hoje e há 2 e 3 dias atrás, mas faltou ontem (que foi reparado)
        when(studySessionRepository.findDistinctSessionDatesByUserId(userId))
                .thenReturn(List.of(today, twoDaysAgo, threeDaysAgo));
        when(streakRepairRepository.findRepairedDatesByUserId(userId))
                .thenReturn(List.of(yesterday));

        int streak = streakRepairService.calculateEffectiveStreak(userId);

        assertEquals(4, streak);
    }

    @Test
    void getStreakStatus_ShouldFlagStreakAtRisk_WhenNoActivityYesterday() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(List.of(today));
        when(streakRepairRepository.findRepairedDatesByUserId(userId)).thenReturn(Collections.emptyList());
        when(streakRepairRepository.existsByUserIdAndRepairedDate(userId, yesterday)).thenReturn(false);
        when(streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.empty());
        when(flashcardRepository.countByUserIdAndLastStudiedAt(userId, today)).thenReturn(15L);

        StreakStatusResponse status = streakRepairService.getStreakStatus(user);

        assertNotNull(status);
        assertTrue(status.isStreakAtRisk());
        assertTrue(status.isCanRepair());
        assertEquals(20, status.getRequiredCardsCount());
        assertEquals(15, status.getCurrentRepairedCount());
    }

    @Test
    void executeRepair_ShouldThrowException_WhenStreakNotBrokenYesterday() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(List.of(today, yesterday));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                streakRepairService.executeRepair(user));

        assertTrue(ex.getReason().contains("A ofensiva não foi quebrada ontem"));
        verify(streakRepairRepository, never()).save(any());
    }

    @Test
    void executeRepair_ShouldThrowException_WhenCooldownNotExpired() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(List.of(today));
        when(streakRepairRepository.existsByUserIdAndRepairedDate(userId, yesterday)).thenReturn(false);

        StreakRepair lastRepair = StreakRepair.builder()
                .user(user)
                .repairedDate(today.minusDays(7))
                .build();
        lastRepair.setCreatedAt(LocalDateTime.now().minusDays(5));

        when(streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.of(lastRepair));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                streakRepairService.executeRepair(user));

        assertTrue(ex.getReason().contains("só pode ser utilizado 1 vez a cada 14 dias"));
        verify(streakRepairRepository, never()).save(any());
    }

    @Test
    void executeRepair_ShouldThrowException_WhenCardsGoalNotReached() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(List.of(today));
        when(streakRepairRepository.existsByUserIdAndRepairedDate(userId, yesterday)).thenReturn(false);
        when(streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.empty());
        when(flashcardRepository.countByUserIdAndLastStudiedAt(userId, today)).thenReturn(12L);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                streakRepairService.executeRepair(user));

        assertTrue(ex.getReason().contains("É necessário revisar ao menos 20 flashcards hoje"));
        verify(streakRepairRepository, never()).save(any());
    }

    @Test
    void executeRepair_ShouldSaveRepairAndReturnNewStreak_WhenRequirementsMet() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate twoDaysAgo = today.minusDays(2);

        when(studySessionRepository.findDistinctSessionDatesByUserId(userId)).thenReturn(List.of(today, twoDaysAgo));
        when(streakRepairRepository.existsByUserIdAndRepairedDate(userId, yesterday)).thenReturn(false);
        when(streakRepairRepository.findTopByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.empty());
        when(flashcardRepository.countByUserIdAndLastStudiedAt(userId, today)).thenReturn(22L);
        when(streakRepairRepository.findRepairedDatesByUserId(userId)).thenReturn(List.of(yesterday));

        StreakRepairExecutionResponse response = streakRepairService.executeRepair(user);

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals(3, response.getNewStreak());
        verify(streakRepairRepository).save(any(StreakRepair.class));
    }
}
