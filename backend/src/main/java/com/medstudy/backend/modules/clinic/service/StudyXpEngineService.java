package com.medstudy.backend.modules.clinic.service;

import com.medstudy.backend.modules.clinic.dto.StudyActionRewardRequest;
import com.medstudy.backend.modules.clinic.dto.StudyActionRewardResponse;
import com.medstudy.backend.modules.clinic.entity.StudyActionType;
import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import com.medstudy.backend.modules.clinic.repository.UserXpAccountRepository;
import com.medstudy.backend.modules.clinic.repository.UserXpTransactionRepository;
import com.medstudy.backend.modules.gamificacao.service.StreakRepairService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Mathematical engine for study XP rewards, daily streak multipliers, and dual balance accounting (P-080, P-081).
 */
@Service
public class StudyXpEngineService {

    private final UserXpAccountRepository userXpAccountRepository;
    private final UserXpTransactionRepository userXpTransactionRepository;
    private final StreakRepairService streakRepairService;

    public StudyXpEngineService(
            UserXpAccountRepository userXpAccountRepository,
            UserXpTransactionRepository userXpTransactionRepository
    ) {
        this(userXpAccountRepository, userXpTransactionRepository, null);
    }

    @Autowired
    public StudyXpEngineService(
            UserXpAccountRepository userXpAccountRepository,
            UserXpTransactionRepository userXpTransactionRepository,
            @Autowired(required = false) StreakRepairService streakRepairService
    ) {
        this.userXpAccountRepository = userXpAccountRepository;
        this.userXpTransactionRepository = userXpTransactionRepository;
        this.streakRepairService = streakRepairService;
    }

    /**
     * P-081: Calculates the daily streak multiplier:
     * 0-2 days -> 0.00 (+0%)
     * 3-6 days -> 0.10 (+10%)
     * 7-13 days -> 0.20 (+20%)
     * 14-29 days -> 0.35 (+35%)
     * 30+ days -> 0.50 (+50%)
     */
    public double calculateStreakMultiplier(int streakDays) {
        if (streakDays >= 30) {
            return 0.50;
        }
        if (streakDays >= 14) {
            return 0.35;
        }
        if (streakDays >= 7) {
            return 0.20;
        }
        if (streakDays >= 3) {
            return 0.10;
        }
        return 0.00;
    }

    public int calculateStreakMultiplierPercent(int streakDays) {
        return (int) Math.round(calculateStreakMultiplier(streakDays) * 100.0);
    }

    /**
     * P-081: Calculates base XP for a study action before applying the daily streak multiplier.
     */
    public int calculateBaseXp(StudyActionType actionType, Double accuracyPercent) {
        if (actionType == null || actionType == StudyActionType.ROOM_EXPANSION || actionType == StudyActionType.ITEM_PURCHASE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de ação de estudo inválido para recompensa de XP.");
        }
        return actionType.calculateBaseXp(accuracyPercent);
    }

    /**
     * P-080, P-081 & P-086: Atomically calculates and credits XP to both lifetime_xp and current_xp,
     * updates the student's daily streak, and logs an immutable audit entry in user_xp_transactions.
     */
    @Transactional
    public StudyActionRewardResponse rewardStudyAction(UUID userId, StudyActionRewardRequest request) {
        if (request == null || request.getActionType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O tipo de ação de estudo é obrigatório.");
        }

        int baseXp = calculateBaseXp(request.getActionType(), request.getAccuracyPercent());

        UserXpAccount account = userXpAccountRepository.findById(userId)
                .orElseGet(() -> new UserXpAccount(userId, 0L, 0L, 0, null));

        updateDailyStreak(userId, account, request.getStreakDaysOverride());

        double multiplier = calculateStreakMultiplier(account.getCurrentStreakDays());
        int multiplierPercent = calculateStreakMultiplierPercent(account.getCurrentStreakDays());
        int xpGranted = (int) Math.round(baseXp * (1.0 + multiplier));

        account.creditXp(xpGranted);
        UserXpAccount savedAccount = userXpAccountRepository.save(account);

        String description = "Recompensa de estudo: " + request.getActionType().name()
                + (request.getReferenceId() != null && !request.getReferenceId().isBlank()
                ? " (" + request.getReferenceId() + ")"
                : "");

        UserXpTransaction transaction = new UserXpTransaction(
                userId,
                xpGranted,
                savedAccount.getCurrentXp(),
                request.getActionType().name(),
                description
        );
        userXpTransactionRepository.save(transaction);

        String toastMessage = "+" + xpGranted + " XP (Salvo na Clínica)";

        return new StudyActionRewardResponse(
                xpGranted,
                baseXp,
                multiplier,
                multiplierPercent,
                savedAccount.getCurrentStreakDays(),
                savedAccount.getLifetimeXp(),
                savedAccount.getCurrentXp(),
                request.getActionType().name(),
                toastMessage
        );
    }

    private void updateDailyStreak(UUID userId, UserXpAccount account, Integer streakDaysOverride) {
        LocalDate today = LocalDate.now();

        if (streakDaysOverride != null && streakDaysOverride >= 0) {
            account.setCurrentStreakDays(streakDaysOverride);
            account.setLastStudyDate(today);
            return;
        }

        LocalDate lastDate = account.getLastStudyDate();
        if (lastDate == null) {
            account.setCurrentStreakDays(Math.max(1, account.getCurrentStreakDays()));
        } else if (lastDate.equals(today)) {
            if (account.getCurrentStreakDays() <= 0) {
                account.setCurrentStreakDays(1);
            }
        } else if (lastDate.equals(today.minusDays(1))) {
            account.setCurrentStreakDays(account.getCurrentStreakDays() + 1);
        } else {
            account.setCurrentStreakDays(1);
        }

        if (streakRepairService != null) {
            try {
                int repairedStreak = streakRepairService.calculateEffectiveStreak(userId);
                if (repairedStreak > account.getCurrentStreakDays()) {
                    account.setCurrentStreakDays(repairedStreak);
                }
            } catch (Exception ignored) {
                // Keep account's calculated streak if StreakRepairService is unavailable in unit tests
            }
        }

        account.setLastStudyDate(today);
    }
}
