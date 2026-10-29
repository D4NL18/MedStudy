package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.StudyActionRewardRequest;
import com.medstudy.backend.modules.clinic.dto.StudyActionRewardResponse;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudyXpEngineServiceTest {

    @Mock
    private UserXpAccountRepository userXpAccountRepository;

    @Mock
    private UserXpTransactionRepository userXpTransactionRepository;

    private StudyXpEngineService studyXpEngineService;
    private UUID userId;

    @BeforeEach
    void setUp() {
        studyXpEngineService = new StudyXpEngineService(userXpAccountRepository, userXpTransactionRepository);
        userId = UUID.randomUUID();
    }

    @ParameterizedTest(name = "P-081: Action {0} should grant base XP {1}")
    @CsvSource({
            "QUESTION_SUBMITTED, 15",
            "QUESTION_CORRECT, 40",
            "QUESTION_CORRECT_BONUS, 25",
            "QUESTION_STREAK_3, 15",
            "QUESTION_STREAK_5, 30",
            "QUESTION_STREAK_10, 75",
            "FLASHCARD_EASY, 8",
            "FLASHCARD_MEDIUM, 12",
            "FLASHCARD_HARD, 5",
            "FLASHCARD_DECK_COMPLETED, 100",
            "DAILY_DECK_COMPLETED, 100",
            "VIDEO_10_MIN, 50",
            "VIDEO_COMPLETED, 80",
            "VIDEO_NOTE, 30"
    })
    @DisplayName("P-081: Should calculate deterministic base XP for all study actions")
    void shouldCalculateBaseXpForStandardActions(StudyActionType actionType, int expectedBaseXp) {
        int baseXp = studyXpEngineService.calculateBaseXp(actionType, null);
        assertEquals(expectedBaseXp, baseXp);
    }

    @Test
    @DisplayName("P-081: Simulado completed should grant 300 fixed XP + round(accuracyPercent * 5)")
    void shouldCalculateSimuladoBaseXpWithAccuracyBonus() {
        assertEquals(700, studyXpEngineService.calculateBaseXp(StudyActionType.SIMULADO_COMPLETED, 80.0));
        assertEquals(678, studyXpEngineService.calculateBaseXp(StudyActionType.SIMULADO_COMPLETED, 75.5));
        assertEquals(300, studyXpEngineService.calculateBaseXp(StudyActionType.SIMULADO_COMPLETED, 0.0));
        assertEquals(800, studyXpEngineService.calculateBaseXp(StudyActionType.SIMULADO_COMPLETED, 100.0));
    }

    @ParameterizedTest(name = "P-081: Streak {0} days should have multiplier {1}")
    @CsvSource({
            "0, 0.00",
            "1, 0.00",
            "2, 0.00",
            "3, 0.10",
            "6, 0.10",
            "7, 0.20",
            "13, 0.20",
            "14, 0.35",
            "29, 0.35",
            "30, 0.50",
            "90, 0.50"
    })
    @DisplayName("P-081: Should apply exact daily streak multiplier tiers (0%, 10%, 20%, 35%, 50%)")
    void shouldCalculateStreakMultiplierTiers(int streakDays, double expectedMultiplier) {
        assertEquals(expectedMultiplier, studyXpEngineService.calculateStreakMultiplier(streakDays), 0.0001);
    }

    @Test
    @DisplayName("P-080 & P-081: Should credit lifetime_xp and current_xp simultaneously, apply streak multiplier and persist audit transaction")
    void shouldCreditBothBalancesAndPersistTransaction() {
        UserXpAccount existingAccount = new UserXpAccount(userId, 1000L, 400L, 7, LocalDate.now());
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(existingAccount));
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userXpTransactionRepository.save(any(UserXpTransaction.class))).thenAnswer(inv -> inv.getArgument(0));

        StudyActionRewardRequest request = new StudyActionRewardRequest();
        request.setActionType(StudyActionType.QUESTION_CORRECT); // 40 base XP
        request.setReferenceId("q-101");

        // 7 days streak = +20% (1.20x) -> round(40 * 1.20) = 48 XP
        StudyActionRewardResponse response = studyXpEngineService.rewardStudyAction(userId, request);

        assertEquals(40, response.getBaseXp());
        assertEquals(0.20, response.getStreakMultiplier(), 0.001);
        assertEquals(48, response.getXpGranted());
        assertEquals(1048L, response.getLifetimeXp());
        assertEquals(448L, response.getCurrentXp());
        assertEquals(7, response.getCurrentStreakDays());
        assertEquals("+48 XP (Salvo na Clínica)", response.getMessage());

        ArgumentCaptor<UserXpTransaction> txCaptor = ArgumentCaptor.forClass(UserXpTransaction.class);
        verify(userXpTransactionRepository).save(txCaptor.capture());
        UserXpTransaction savedTx = txCaptor.getValue();
        assertEquals(userId, savedTx.getUserId());
        assertEquals(48, savedTx.getAmount());
        assertEquals(448L, savedTx.getBalanceAfter());
        assertEquals("QUESTION_CORRECT", savedTx.getSource());
    }

    @Test
    @DisplayName("P-081: Should round fractional XP properly with 35% streak multiplier")
    void shouldRoundFractionalXpWithStreakMultiplier() {
        UserXpAccount account = new UserXpAccount(userId, 500L, 500L, 15, LocalDate.now());
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));

        StudyActionRewardRequest request = new StudyActionRewardRequest();
        request.setActionType(StudyActionType.FLASHCARD_HARD); // 5 base XP * 1.35 = 6.75 -> 7 XP

        StudyActionRewardResponse response = studyXpEngineService.rewardStudyAction(userId, request);

        assertEquals(7, response.getXpGranted());
        assertEquals(507L, response.getLifetimeXp());
        assertEquals(507L, response.getCurrentXp());
    }

    @Test
    @DisplayName("P-081: Should increment streak when lastStudyDate was yesterday")
    void shouldIncrementStreakWhenStudiedYesterday() {
        UserXpAccount account = new UserXpAccount(userId, 200L, 200L, 2, LocalDate.now().minusDays(1));
        when(userXpAccountRepository.findById(userId)).thenReturn(Optional.of(account));
        when(userXpAccountRepository.save(any(UserXpAccount.class))).thenAnswer(inv -> inv.getArgument(0));

        StudyActionRewardRequest request = new StudyActionRewardRequest();
        request.setActionType(StudyActionType.VIDEO_10_MIN); // 50 base XP, streak becomes 3 -> +10% -> 55 XP

        StudyActionRewardResponse response = studyXpEngineService.rewardStudyAction(userId, request);

        assertEquals(3, response.getCurrentStreakDays());
        assertEquals(0.10, response.getStreakMultiplier(), 0.001);
        assertEquals(55, response.getXpGranted());
        assertEquals(LocalDate.now(), account.getLastStudyDate());
    }
}
