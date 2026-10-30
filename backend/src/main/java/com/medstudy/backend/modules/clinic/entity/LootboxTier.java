package com.medstudy.backend.modules.clinic.entity;

/**
 * Tiers oficiais de Caixas da Sorte Médicas (P-094).
 */
public enum LootboxTier {
    TIER_1_RESIDENT(500, "Caixa do Residente"),
    TIER_2_SPECIALIST(1500, "Caixa do Especialista"),
    TIER_3_CHIEF_OF_STAFF(4000, "Caixa do Chefe de Ala");

    private final int costXp;
    private final String displayName;

    LootboxTier(int costXp, String displayName) {
        this.costXp = costXp;
        this.displayName = displayName;
    }

    public int getCostXp() {
        return costXp;
    }

    public String getDisplayName() {
        return displayName;
    }
}
