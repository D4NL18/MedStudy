package com.medstudy.backend.modules.gamificacao.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum BadgeType {
    // === STREAK BADGES ===
    STREAK_3("Foco Inicial", "3 dias seguidos de estudo"),
    STREAK_7("Mestre da Ofensiva", "7 dias seguidos de estudo"),
    STREAK_14("Ritmo Quente", "14 dias seguidos de estudo"),
    STREAK_21("Hábito Formado", "21 dias seguidos de estudo"),
    STREAK_30("Um Mês Implacável", "30 dias seguidos de estudo"),
    STREAK_50("Estudante Ouro", "50 dias seguidos de estudo"),
    STREAK_100("Estudante Diamante", "100 dias seguidos de estudo"),
    STREAK_150("Lenda do Foco", "150 dias seguidos de estudo"),
    STREAK_200("Resiliência Pura", "200 dias seguidos de estudo"),
    STREAK_365("Um Ano Sem Parar", "365 dias seguidos de estudo"),

    // === QUESTIONS VOLUME BADGES ===
    QUESTIONS_10("Primeiros Passos", "Resolveu 10 questões"),
    QUESTIONS_50("Aquecimento", "Resolveu 50 questões"),
    QUESTIONS_100("Centenário", "Resolveu 100 questões"),
    QUESTIONS_250("Máquina de Aprender", "Resolveu 250 questões"),
    QUESTIONS_500("Fome de Saber", "Resolveu 500 questões"),
    QUESTIONS_1000("Maratonista de Questões", "Resolveu 1000 questões"),
    QUESTIONS_2000("Especialista em Questões", "Resolveu 2000 questões"),
    QUESTIONS_3000("Gigante das Questões", "Resolveu 3000 questões"),
    QUESTIONS_5000("Lenda das Questões", "Resolveu 5000 questões"),
    QUESTIONS_10000("Deus das Questões", "Resolveu 10000 questões"),

    // === SIMULADO BADGES ===
    SIMULADOS_1("Primeiro Teste", "Realizou o primeiro simulado"),
    SIMULADOS_3("Avaliador", "Realizou 3 simulados completos"),
    SIMULADOS_5("Estratega Inicial", "Realizou 5 simulados completos"),
    SIMULADOS_10("Estratega de Simulados", "Realizou 10 simulados completos"),
    SIMULADOS_15("Simulador Profissional", "Realizou 15 simulados completos"),
    SIMULADOS_20("Veterano de Simulados", "Realizou 20 simulados completos"),
    SIMULADOS_30("Mestre das Provas", "Realizou 30 simulados completos"),
    SIMULADOS_40("Rei das Provas", "Realizou 40 simulados completos"),
    SIMULADOS_50("Lenda dos Simulados", "Realizou 50 simulados completos"),
    SIMULADOS_100("O Incansável", "Realizou 100 simulados completos"),

    // === PERFORMANCE & PRECISION BADGES ===
    PRECISION_80("Mira Certeira", "Sessão com mais de 80% de acerto"),
    PRECISION_90("Atirador de Elite", "Sessão com mais de 90% de acerto"),
    PRECISION_100("Perfeição", "Sessão com 100% de acerto (mínimo 10 questões)"),
    FLAWLESS_SIMULADO("Simulado Perfeito", "Gabaritou um simulado completo"),
    FAST_THINKER("Pensador Rápido", "Terminou um simulado na metade do tempo"),
    COMEBACK_KID("A Virada", "Melhorou o acerto de um tema em 50%"),
    CONSISTENT_80("Consistência 80", "5 Sessões seguidas com >80% acerto"),
    CONSISTENT_90("Consistência 90", "5 Sessões seguidas com >90% acerto"),
    ERROR_FREE_WEEK("Semana Limpa", "Estudou 7 dias com média >85%"),
    PRECISION_GOD("Deus da Precisão", "Sessão com 100% acerto (mínimo 50 questões)"),

    // === SUBJECT / EXPERT BADGES ===
    EXPERT_PEDIATRIA("Pediatra", "Resolveu mais de 200 questões de Pediatria"),
    EXPERT_CIRURGIA("Cirurgião", "Resolveu mais de 200 questões de Cirurgia"),
    EXPERT_PREVENTIVA("Estrategista de Saúde", "Resolveu mais de 200 questões de Preventiva"),
    EXPERT_CLINICA("Clínico Geral", "Resolveu mais de 200 questões de Clínica Médica"),
    EXPERT_GO("Ginecologista/Obstetra", "Resolveu mais de 200 questões de Ginecologia e Obstetrícia"),
    MASTER_PEDIATRIA("Mestre da Pediatria", "Resolveu mais de 1000 questões de Pediatria"),
    MASTER_CIRURGIA("Mestre da Cirurgia", "Resolveu mais de 1000 questões de Cirurgia"),
    MASTER_PREVENTIVA("Mestre da Preventiva", "Resolveu mais de 1000 questões de Preventiva"),
    MASTER_CLINICA("Mestre da Clínica Médica", "Resolveu mais de 1000 questões de Clínica Médica"),
    MASTER_GO("Mestre de GO", "Resolveu mais de 1000 questões de GO"),
    MEDICINE_AVATAR("O Avatar da Medicina", "Mestre em todas as grandes áreas");

    private final String name;
    private final String displayName;
    private final String description;

    BadgeType(String displayName, String description) {
        this.name = this.name();
        this.displayName = displayName;
        this.description = description;
    }

    public String getName() { return name; }
    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
}
