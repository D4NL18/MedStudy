package com.medstudy.backend.modules.dashboard.enums;

public enum MasteryTier {
    INICIANTE(0.0, 9.99),
    BRONZE(10.0, 24.99),
    PRATA(25.0, 39.99),
    OURO(40.0, 54.99),
    PLATINA(55.0, 67.99),
    RUBI(68.0, 75.99),
    ESMERALDA(76.0, 84.99),
    DIAMANTE(85.0, 100.0);

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
        if (percentage >= 85.0) return DIAMANTE;
        if (percentage >= 76.0) return ESMERALDA;
        if (percentage >= 68.0) return RUBI;
        if (percentage >= 55.0) return PLATINA;
        if (percentage >= 40.0) return OURO;
        if (percentage >= 25.0) return PRATA;
        if (percentage >= 10.0) return BRONZE;
        return INICIANTE;
    }
}
