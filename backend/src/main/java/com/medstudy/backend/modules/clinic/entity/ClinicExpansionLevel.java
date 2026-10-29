package com.medstudy.backend.modules.clinic.entity;

import java.util.Optional;

/**
 * Defines the 6 sequential physical expansion levels of the student's clinic (P-082).
 */
public enum ClinicExpansionLevel {
    LEVEL_1(1, "Box do Internato", 4, 4, 0, 0L),
    LEVEL_2(2, "Consultório Júnior", 6, 6, 1200, 1500L),
    LEVEL_3(3, "Consultório Master com Hall", 8, 8, 3800, 4500L),
    LEVEL_4(4, "Clínica 2 Ambientes", 12, 6, 8500, 10000L),
    LEVEL_5(5, "Clínica Integrada com Ala Pediátrica", 12, 12, 16000, 20000L),
    LEVEL_6(6, "Instituto Médico Completo", 16, 12, 32000, 40000L);

    private final int level;
    private final String name;
    private final int gridWidth;
    private final int gridHeight;
    private final int costXp;
    private final long requiredLifetimeXp;

    ClinicExpansionLevel(int level, String name, int gridWidth, int gridHeight, int costXp, long requiredLifetimeXp) {
        this.level = level;
        this.name = name;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.costXp = costXp;
        this.requiredLifetimeXp = requiredLifetimeXp;
    }

    public int getLevel() {
        return level;
    }

    public String getName() {
        return name;
    }

    public int getGridWidth() {
        return gridWidth;
    }

    public int getGridHeight() {
        return gridHeight;
    }

    public int getCostXp() {
        return costXp;
    }

    public long getRequiredLifetimeXp() {
        return requiredLifetimeXp;
    }

    public static ClinicExpansionLevel fromLevel(int level) {
        for (ClinicExpansionLevel value : values()) {
            if (value.level == level) {
                return value;
            }
        }
        throw new IllegalArgumentException("Nível de expansão inválido: " + level);
    }

    public static Optional<ClinicExpansionLevel> nextLevel(int currentLevel) {
        int target = currentLevel + 1;
        for (ClinicExpansionLevel value : values()) {
            if (value.level == target) {
                return Optional.of(value);
            }
        }
        return Optional.empty();
    }
}
