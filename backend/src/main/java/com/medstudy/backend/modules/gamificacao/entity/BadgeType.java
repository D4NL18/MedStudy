package com.medstudy.backend.modules.gamificacao.entity;

public enum BadgeType {
    STREAK_7("Mestre da Ofensiva", "7 dias seguidos de estudo"),
    QUESTIONS_1000("Maratonista de Questões", "Resolveu 1000 questões"),
    SIMULADOS_10("Estratega de Simulados", "Realizou 10 simulados completos");

    private final String displayName;
    private final String description;

    BadgeType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
}
