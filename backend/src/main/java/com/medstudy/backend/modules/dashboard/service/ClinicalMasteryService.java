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
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class ClinicalMasteryService {

    private final LessonRepository lessonRepository;
    private final StudySessionRepository studySessionRepository;
    private final FlashcardRepository flashcardRepository;

    public ClinicalMasteryService(LessonRepository lessonRepository,
                                  StudySessionRepository studySessionRepository,
                                  FlashcardRepository flashcardRepository) {
        this.lessonRepository = lessonRepository;
        this.studySessionRepository = studySessionRepository;
        this.flashcardRepository = flashcardRepository;
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

        List<AreaMasteryDTO> areaDTOs = new ArrayList<>();
        double totalMasterySum = 0.0;

        for (AreaDefinition def : AreaDefinition.values()) {
            AreaMasteryDTO areaDTO = computeAreaMastery(def, userLessons, userSessions, userFlashcards);
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
                                              List<Flashcard> flashcards) {
        // 1. Filtrar Aulas da área
        List<Lesson> areaLessons = lessons.stream()
                .filter(l -> matchesArea(l.getGrandeArea(), def))
                .toList();
        long totalAulas = areaLessons.size();
        long aulasAssistidas = areaLessons.stream()
                .filter(l -> Boolean.TRUE.equals(l.getAulaAssistida()))
                .count();
        double pAulas = totalAulas > 0 ? ((double) aulasAssistidas / totalAulas) * 100.0 : 0.0;

        // 2. Filtrar Questões / Sessões da área
        List<StudySession> areaSessions = sessions.stream()
                .filter(s -> matchesArea(s.getGrandeArea(), def))
                .toList();
        long questoesFeitas = areaSessions.stream()
                .mapToLong(s -> s.getQtsFeitas() != null ? s.getQtsFeitas() : 0)
                .sum();
        long questoesCorretas = areaSessions.stream()
                .mapToLong(s -> s.getQtsCorretas() != null ? s.getQtsCorretas() : 0)
                .sum();
        double taxaAcertoQuestoes = questoesFeitas > 0
                ? ((double) questoesCorretas / questoesFeitas) * 100.0
                : 0.0;

        // 3. Filtrar Flashcards da área
        List<Flashcard> areaFlashcards = flashcards.stream()
                .filter(f -> matchesArea(f.getGrandeArea(), def))
                .toList();
        long cardsRevisados = areaFlashcards.stream()
                .filter(f -> f.getDificuldadeUltima() != null)
                .count();
        long cardsRetidos = areaFlashcards.stream()
                .filter(f -> f.getDificuldadeUltima() == FlashcardDifficulty.EASY
                        || f.getDificuldadeUltima() == FlashcardDifficulty.MEDIUM)
                .count();
        double taxaRetencaoCards = cardsRevisados > 0
                ? ((double) cardsRetidos / cardsRevisados) * 100.0
                : 0.0;

        // 4. Fórmula ponderada: 50% questões, 30% flashcards, 20% aulas
        double rawMastery = (0.50 * taxaAcertoQuestoes) + (0.30 * taxaRetencaoCards) + (0.20 * pAulas);
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
                .cardsRevisados(cardsRevisados)
                .taxaRetencaoCards(round(taxaRetencaoCards))
                .aulasAssistidas(aulasAssistidas)
                .totalAulas(totalAulas)
                .build();
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
