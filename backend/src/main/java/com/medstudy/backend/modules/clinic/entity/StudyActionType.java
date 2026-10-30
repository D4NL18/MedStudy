package com.medstudy.backend.modules.clinic.entity;

/**
 * Enumerates all study actions and clinic ledger transaction sources (P-080, P-081).
 */
public enum StudyActionType {
    QUESTION_SUBMITTED(15),
    QUESTION_CORRECT(40),
    QUESTION_CORRECT_BONUS(25),
    QUESTION_STREAK_3(15),
    QUESTION_STREAK_5(30),
    QUESTION_STREAK_10(75),
    FLASHCARD_EASY(8),
    FLASHCARD_MEDIUM(12),
    FLASHCARD_HARD(5),
    FLASHCARD_DECK_COMPLETED(100),
    DAILY_DECK_COMPLETED(100),
    VIDEO_10_MIN(50),
    VIDEO_COMPLETED(80),
    VIDEO_NOTE(30),
    SIMULADO_COMPLETED(300),
    ROOM_EXPANSION(0),
    ITEM_PURCHASE(0),
    LOOTBOX_OPEN(0),
    LOOTBOX_DUPLICATE_CASHBACK(0);

    private final int baseXp;

    StudyActionType(int baseXp) {
        this.baseXp = baseXp;
    }

    public int getBaseXp() {
        return baseXp;
    }

    public int calculateBaseXp(Double accuracyPercent) {
        if (this == SIMULADO_COMPLETED) {
            double clampedAccuracy = accuracyPercent == null
                    ? 0.0
                    : Math.max(0.0, Math.min(100.0, accuracyPercent));
            return baseXp + (int) Math.round(clampedAccuracy * 5.0);
        }
        return baseXp;
    }
}
