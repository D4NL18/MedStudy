package com.medstudy.backend.modules.dashboard.service;

import com.medstudy.backend.core.util.StringNormalizer;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.dashboard.dto.AreaMasteryDTO;
import com.medstudy.backend.modules.dashboard.dto.ClinicalMasteryResponse;
import com.medstudy.backend.modules.dashboard.enums.MasteryTier;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.sessao.specification.StudySessionSpecifications;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ClinicalMasteryService {

    private final LessonRepository lessonRepository;
    private final StudySessionRepository studySessionRepository;
    private final FlashcardRepository flashcardRepository;
    private final SimuladoRepository simuladoRepository;

    public ClinicalMasteryService(LessonRepository lessonRepository,
                                  StudySessionRepository studySessionRepository,
                                  FlashcardRepository flashcardRepository,
                                  SimuladoRepository simuladoRepository) {
        this.lessonRepository = lessonRepository;
        this.studySessionRepository = studySessionRepository;
        this.flashcardRepository = flashcardRepository;
        this.simuladoRepository = simuladoRepository;
    }

    public enum AreaDefinition {
        CLINICA_MEDICA("CLINICA_MEDICA", "Clínica Médica", "torax_snc", "#3B82F6"),
        CIRURGIA_GERAL("CIRURGIA_GERAL", "Cirurgia Geral", "abdome_tgi", "#F97316"),
        PEDIATRIA("PEDIATRIA", "Pediatria", "cabeca_membros", "#10B981"),
        GINECOLOGIA_OBSTETRICIA("GINECOLOGIA_OBSTETRICIA", "Ginecologia e Obstetrícia", "pelve_urogenital", "#EC4899"),
        MEDICINA_PREVENTIVA("MEDICINA_PREVENTIVA", "Medicina Preventiva", "silhueta_sistemica", "#EAB308");

        private final String key;
        private final String displayName;
        private final String regionKey;
        private final String corHex;

        AreaDefinition(String key, String displayName, String regionKey, String corHex) {
            this.key = key;
            this.displayName = displayName;
            this.regionKey = regionKey;
            this.corHex = corHex;
        }

        public String getKey() { return key; }
        public String getDisplayName() { return displayName; }
        public String getRegionKey() { return regionKey; }
        public String getCorHex() { return corHex; }
    }

    public ClinicalMasteryResponse calculateMastery(User user) {
        UUID userId = user.getId();

        List<Lesson> userLessons = lessonRepository.findAllByUserId(userId);
        List<StudySession> userSessions = studySessionRepository.findAll(StudySessionSpecifications.hasUserId(userId));
        List<Flashcard> userFlashcards = flashcardRepository.findAllByUserId(userId);
        List<Simulado> userSimulados = simuladoRepository.findAllByUserId(userId);

        List<AreaMasteryDTO> areaDTOs = new ArrayList<>();
        double totalMasterySum = 0.0;
        LocalDate today = LocalDate.now();

        for (AreaDefinition def : AreaDefinition.values()) {
            AreaMasteryDTO areaDTO = computeAreaMastery(def, userLessons, userSessions, userFlashcards, userSimulados, today);
            areaDTOs.add(areaDTO);
            totalMasterySum += areaDTO.getMasteryPercentage();
        }

        double overallMastery = round(totalMasterySum / AreaDefinition.values().length);
        MasteryTier overallTier = MasteryTier.fromPercentage(overallMastery);

        return ClinicalMasteryResponse.builder()
                .overallMastery(overallMastery)
                .overallTier(overallTier)
                .areas(areaDTOs)
                .build();
    }

    private AreaMasteryDTO computeAreaMastery(AreaDefinition def,
                                              List<Lesson> lessons,
                                              List<StudySession> sessions,
                                              List<Flashcard> flashcards,
                                              List<Simulado> simulados,
                                              LocalDate today) {
        // 1. Encontrar a data de referência individual da área:
        // A questão mais recente desta área sempre terá 100% de relevância (peso 1.0).
        // Se a área não tiver questões, busca a atividade mais recente da área (simulado, flashcard ou aula) ou 'today'.
        List<StudySession> areaSessions = sessions.stream()
                .filter(s -> matchesArea(s.getGrandeArea(), def))
                .toList();

        LocalDate mostRecentDateInArea = null;
        for (StudySession s : areaSessions) {
            if (s.getDataSessao() != null) {
                if (mostRecentDateInArea == null || s.getDataSessao().isAfter(mostRecentDateInArea)) {
                    mostRecentDateInArea = s.getDataSessao();
                }
            }
        }

        // Se não tiver sessões de questões, verifica a data mais recente em simulados com questões da área
        if (mostRecentDateInArea == null) {
            for (Simulado sim : simulados) {
                if (getSimuladoTotalForArea(sim, def) > 0 && sim.getDataRealizacao() != null) {
                    if (mostRecentDateInArea == null || sim.getDataRealizacao().isAfter(mostRecentDateInArea)) {
                        mostRecentDateInArea = sim.getDataRealizacao();
                    }
                }
            }
        }

        // Se ainda nulo, busca flashcard ou aula
        if (mostRecentDateInArea == null) {
            for (Flashcard f : flashcards) {
                if (matchesArea(f.getGrandeArea(), def)) {
                    LocalDate rDate = f.getUltimaRevisao() != null ? f.getUltimaRevisao()
                            : (f.getLastStudiedAt() != null ? f.getLastStudiedAt()
                            : (f.getUpdatedAt() != null ? f.getUpdatedAt().toLocalDate() : null));
                    if (rDate != null && (mostRecentDateInArea == null || rDate.isAfter(mostRecentDateInArea))) {
                        mostRecentDateInArea = rDate;
                    }
                }
            }
        }

        final LocalDate anchorDate = mostRecentDateInArea != null ? mostRecentDateInArea : today;

        // 2. Filtrar e ponderar Aulas da área com base na prioridade crítica (DIAMANTE, ALTA, MEDIA, BAIXA)
        // Não ter visto aula DIAMANTE é muito mais crítico do que uma aula MÉDIA/BAIXA.
        List<Lesson> areaLessons = lessons.stream()
                .filter(l -> matchesArea(l.getGrandeArea(), def))
                .toList();
        long totalAulas = areaLessons.size();
        long aulasAssistidas = 0;
        double weightedAulasAssistidas = 0.0;
        double totalLessonWeight = 0.0;

        for (Lesson l : areaLessons) {
            double priorityMultiplier = getLessonPriorityWeight(l.getPrioridade());
            totalLessonWeight += priorityMultiplier;

            if (Boolean.TRUE.equals(l.getAulaAssistida())) {
                aulasAssistidas++;
                LocalDate lessonDate = l.getDataAula() != null ? l.getDataAula()
                        : (l.getUpdatedAt() != null ? l.getUpdatedAt().toLocalDate() : null);
                double temporalW = calculateTemporalWeight(lessonDate, 60.0, 0.25, anchorDate);
                weightedAulasAssistidas += (priorityMultiplier * temporalW);
            }
        }
        double pAulas = totalLessonWeight > 0 ? (weightedAulasAssistidas / totalLessonWeight) * 100.0 : 0.0;

        // 3. Filtrar e ponderar Questões / Sessões da área
        long questoesFeitas = 0;
        long questoesCorretas = 0;
        double weightedQuestoesFeitas = 0.0;
        double weightedQuestoesCorretas = 0.0;

        for (StudySession s : areaSessions) {
            long feitas = s.getQtsFeitas() != null ? s.getQtsFeitas() : 0;
            long corretas = s.getQtsCorretas() != null ? s.getQtsCorretas() : 0;
            questoesFeitas += feitas;
            questoesCorretas += corretas;

            double w = calculateTemporalWeight(s.getDataSessao(), 45.0, 0.15, anchorDate);
            weightedQuestoesFeitas += feitas * w;
            weightedQuestoesCorretas += corretas * w;
        }

        double taxaAcertoQuestoes = weightedQuestoesFeitas > 0
                ? (weightedQuestoesCorretas / weightedQuestoesFeitas) * 100.0
                : 0.0;

        // 4. Filtrar e ponderar Simulados da área
        long questoesSimulados = 0;
        double weightedSimuladosFeitas = 0.0;
        double weightedSimuladosCorretas = 0.0;

        for (Simulado sim : simulados) {
            int total = getSimuladoTotalForArea(sim, def);
            int acertos = getSimuladoAcertosForArea(sim, def);
            questoesSimulados += total;

            double w = calculateTemporalWeight(sim.getDataRealizacao(), 45.0, 0.15, anchorDate);
            weightedSimuladosFeitas += total * w;
            weightedSimuladosCorretas += acertos * w;
        }

        double taxaAcertoSimulados = weightedSimuladosFeitas > 0
                ? (weightedSimuladosCorretas / weightedSimuladosFeitas) * 100.0
                : 0.0;

        // 5. Filtrar e ponderar Flashcards da área
        List<Flashcard> areaFlashcards = flashcards.stream()
                .filter(f -> matchesArea(f.getGrandeArea(), def))
                .toList();
        long cardsRevisados = 0;
        double weightedCardsRevisados = 0.0;
        double weightedCardsRetidos = 0.0;

        for (Flashcard f : areaFlashcards) {
            if (f.getDificuldadeUltima() != null) {
                cardsRevisados++;
                LocalDate reviewDate = f.getUltimaRevisao() != null ? f.getUltimaRevisao()
                        : (f.getLastStudiedAt() != null ? f.getLastStudiedAt()
                        : (f.getUpdatedAt() != null ? f.getUpdatedAt().toLocalDate() : null));

                double w = calculateTemporalWeight(reviewDate, 35.0, 0.15, anchorDate);
                weightedCardsRevisados += w;
                if (f.getDificuldadeUltima() == FlashcardDifficulty.EASY
                        || f.getDificuldadeUltima() == FlashcardDifficulty.MEDIUM) {
                    weightedCardsRetidos += w;
                }
            }
        }

        double taxaRetencaoCards = weightedCardsRevisados > 0
                ? (weightedCardsRetidos / weightedCardsRevisados) * 100.0
                : 0.0;

        // 5. Fórmula ponderada com rebalanceamento dinâmico
        // Pesos base: Questões Banco (35%), Simulados (35%), Flashcards (15%), Aulas (15%)
        double wQuestoes = 0.35;
        double wSimulados = 0.35;
        double wFlashcards = 0.15;
        double wAulas = 0.15;

        // Se não houver simulados realizados para a área, o peso migra para Questões do Banco
        if (questoesSimulados == 0 && questoesFeitas > 0) {
            wQuestoes += wSimulados;
            wSimulados = 0.0;
        } else if (questoesFeitas == 0 && questoesSimulados > 0) {
            wSimulados += wQuestoes;
            wQuestoes = 0.0;
        } else if (questoesFeitas == 0 && questoesSimulados == 0) {
            wQuestoes = 0.0;
            wSimulados = 0.0;
        }

        if (cardsRevisados == 0) {
            wFlashcards = 0.0;
        }
        if (totalAulas == 0) {
            wAulas = 0.0;
        }

        double totalWeights = wQuestoes + wSimulados + wFlashcards + wAulas;
        double rawMastery = 0.0;
        if (totalWeights > 0) {
            rawMastery = ((wQuestoes * taxaAcertoQuestoes)
                    + (wSimulados * taxaAcertoSimulados)
                    + (wFlashcards * taxaRetencaoCards)
                    + (wAulas * pAulas)) / totalWeights;

            // Bônus de volume e dedicação (facilita atingir ranks maiores pelo esforço e prática consistente):
            // 1. Bônus por volume de prática (questões + simulados): até +8% extras para quem treina pesado
            long totalQuestoesPraticadas = questoesFeitas + questoesSimulados;
            double volumeBonus = Math.min(8.0, (totalQuestoesPraticadas / 100.0) * 1.5);

            // 2. Bônus de dedicação em Flashcards: até +4% extras para retenção ativa (>30 cards revisados)
            double flashcardBonus = Math.min(4.0, (cardsRevisados / 25.0) * 1.0);

            rawMastery += (volumeBonus + flashcardBonus);
        }

        double masteryPercentage = round(Math.min(100.0, Math.max(0.0, rawMastery)));
        MasteryTier tier = MasteryTier.fromPercentage(masteryPercentage);

        return AreaMasteryDTO.builder()
                .grandeArea(def.getKey())
                .displayName(def.getDisplayName())
                .regionKey(def.getRegionKey())
                .masteryPercentage(masteryPercentage)
                .tier(tier)
                .corHex(def.getCorHex())
                .questoesFeitas(questoesFeitas)
                .taxaAcertoQuestoes(round(taxaAcertoQuestoes))
                .questoesSimulados(questoesSimulados)
                .taxaAcertoSimulados(round(taxaAcertoSimulados))
                .cardsRevisados(cardsRevisados)
                .taxaRetencaoCards(round(taxaRetencaoCards))
                .aulasAssistidas(aulasAssistidas)
                .totalAulas(totalAulas)
                .build();
    }

    /**
     * Calcula o peso temporal com decaimento exponencial de 2º grau (quadrático) e piso residual.
     * Atividades de hoje possuem peso máximo 1.0 (100%).
     * Conforme envelhece, o peso decai numa curva parabólica acentuada de 2º grau:
     * decay = (1.0 / (1.0 + (days / halfLifeDays)^2)), garantindo que atividades
     * recentes tenham muito mais dominância e influência imediata na maestria.
     *
     * @param activityDate data de realização da atividade
     * @param halfLifeDays meia-vida em dias (momento em que a influência cai para 50% acima do piso)
     * @param floor peso residual mínimo acumulado (ex: 0.10 = 10%)
     * @param today data de referência
     * @return multiplicador entre floor e 1.0
     */
    public static double calculateTemporalWeight(LocalDate activityDate, double halfLifeDays, double floor, LocalDate today) {
        if (activityDate == null) {
            return floor + (1.0 - floor) * 0.3;
        }
        long daysAgo = ChronoUnit.DAYS.between(activityDate, today);
        if (daysAgo <= 0) {
            return 1.0;
        }
        double ratio = (double) daysAgo / halfLifeDays;
        // Função quadrática (2º grau) Lorentziana: 1 / (1 + x²)
        double decayFactor = 1.0 / (1.0 + (ratio * ratio));
        return floor + (1.0 - floor) * decayFactor;
    }

    private int getSimuladoTotalForArea(Simulado sim, AreaDefinition def) {
        if (sim == null) return 0;
        return switch (def) {
            case CLINICA_MEDICA -> sim.getCmTotal() != null ? sim.getCmTotal() : 0;
            case CIRURGIA_GERAL -> sim.getCirTotal() != null ? sim.getCirTotal() : 0;
            case PEDIATRIA -> sim.getPedTotal() != null ? sim.getPedTotal() : 0;
            case GINECOLOGIA_OBSTETRICIA -> sim.getGoTotal() != null ? sim.getGoTotal() : 0;
            case MEDICINA_PREVENTIVA -> sim.getPrevTotal() != null ? sim.getPrevTotal() : 0;
        };
    }

    private int getSimuladoAcertosForArea(Simulado sim, AreaDefinition def) {
        if (sim == null) return 0;
        return switch (def) {
            case CLINICA_MEDICA -> sim.getCmAcertos() != null ? sim.getCmAcertos() : 0;
            case CIRURGIA_GERAL -> sim.getCirAcertos() != null ? sim.getCirAcertos() : 0;
            case PEDIATRIA -> sim.getPedAcertos() != null ? sim.getPedAcertos() : 0;
            case GINECOLOGIA_OBSTETRICIA -> sim.getGoAcertos() != null ? sim.getGoAcertos() : 0;
            case MEDICINA_PREVENTIVA -> sim.getPrevAcertos() != null ? sim.getPrevAcertos() : 0;
        };
    }

    /**
     * Retorna o peso da aula pela sua criticidade/prioridade:
     * - DIAMANTE: 10.0 (Crítica / indispensável para aprovação)
     * - ALTA: 5.0 (Muito importante)
     * - MEDIA: 1.0 (Secundária / complementar)
     * - BAIXA: 0.2 (Baixo impacto / opcional)
     */
    public static double getLessonPriorityWeight(com.medstudy.backend.modules.aula.entity.LessonPriority priority) {
        if (priority == null) return 1.0;
        return switch (priority) {
            case DIAMANTE -> 10.0;
            case ALTA -> 5.0;
            case MEDIA -> 1.0;
            case BAIXA -> 0.2;
        };
    }

    public boolean matchesArea(String areaInput, AreaDefinition def) {
        if (areaInput == null || areaInput.isBlank()) {
            return false;
        }
        String canonical = StringNormalizer.canonical(areaInput);
        if (canonical == null) return false;

        return switch (def) {
            case CLINICA_MEDICA -> canonical.contains("clinica") || canonical.contains("clnica");
            case CIRURGIA_GERAL -> canonical.contains("cirurg");
            case PEDIATRIA -> canonical.contains("pediat");
            case GINECOLOGIA_OBSTETRICIA -> canonical.contains("ginec") || canonical.contains("obstet") || canonical.contains(" go");
            case MEDICINA_PREVENTIVA -> canonical.contains("prevent") || canonical.contains("epidemi") || canonical.contains("saude coletiva");
        };
    }

    private double round(double value) {
        return BigDecimal.valueOf(value)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }
}
