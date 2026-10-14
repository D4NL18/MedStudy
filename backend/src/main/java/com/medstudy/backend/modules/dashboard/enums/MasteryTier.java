package com.medstudy.backend.modules.dashboard.enums;

public enum MasteryTier {
    INICIANTE(0.0, 14.99),
    BRONZE(15.0, 29.99),
    PRATA(30.0, 44.99),
    OURO(45.0, 59.99),
    PLATINA(60.0, 74.99),
    RUBI(75.0, 84.99),
    ESMERALDA(85.0, 94.99),
    DIAMANTE(95.0, 100.0);

    private final double minPercentage;
    private final double maxPercentage;

    MasteryTier(double minPercentage, double maxPercentage) {
        this.minPercentage = minPercentage;
        this.maxPercentage = maxPercentage;
    }

    public double getMinPercentage() {
        return minPercentage;
    }

    public double getMaxPercentage() {
        return maxPercentage;
    }

    public static MasteryTier fromPercentage(double percentage) {
        if (percentage >= 95.0) return DIAMANTE;
        if (percentage >= 85.0) return ESMERALDA;
        if (percentage >= 75.0) return RUBI;
        if (percentage >= 60.0) return PLATINA;
        if (percentage >= 45.0) return OURO;
        if (percentage >= 30.0) return PRATA;
        if (percentage >= 15.0) return BRONZE;
        return INICIANTE;
    }
}
