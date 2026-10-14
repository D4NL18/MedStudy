package com.medstudy.backend.modules.dashboard.service;

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
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClinicalMasteryServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private StudySessionRepository studySessionRepository;

    @Mock
    private FlashcardRepository flashcardRepository;

    @InjectMocks
    private ClinicalMasteryService clinicalMasteryService;

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
    }

    @Test
    void calculateMastery_ShouldReturnAllFiveAreasWithZeroWhenNoData() {
        when(lessonRepository.findAllByUserId(userId)).thenReturn(Collections.emptyList());
        when(studySessionRepository.findAll(any(Specification.class))).thenReturn(Collections.emptyList());
        when(flashcardRepository.findAllByUserId(userId)).thenReturn(Collections.emptyList());

        ClinicalMasteryResponse response = clinicalMasteryService.calculateMastery(user);

        assertNotNull(response);
        assertEquals(0.0, response.getOverallMastery());
        assertEquals(MasteryTier.INICIANTE, response.getOverallTier());
        assertEquals(5, response.getAreas().size());

        for (AreaMasteryDTO area : response.getAreas()) {
            assertEquals(0.0, area.getMasteryPercentage());
            assertEquals(MasteryTier.INICIANTE, area.getTier());
            assertNotNull(area.getCorHex());
            assertNotNull(area.getRegionKey());
        }
    }

    @Test
    void calculateMastery_ShouldComputeWeightedFormulaCorrectly() {
        // Pediatria:
        // Aulas: 1 assistida de 2 totais -> 50% * 0.20 = 10%
        Lesson l1 = new Lesson();
        l1.setGrandeArea("Pediatria");
        l1.setAulaAssistida(true);

        Lesson l2 = new Lesson();
        l2.setGrandeArea("Pediatria");
        l2.setAulaAssistida(false);

        // Questões: 8 corretas de 10 feitas -> 80% * 0.50 = 40%
        StudySession session = new StudySession();
        session.setGrandeArea("Pediatria");
        session.setQtsFeitas(10);
        session.setQtsCorretas(8);

        // Flashcards: 2 EASY, 1 MEDIUM, 1 HARD -> 3 retidos de 4 revisados -> 75% * 0.30 = 22.5%
        Flashcard f1 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.EASY).build();
        Flashcard f2 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.MEDIUM).build();
        Flashcard f3 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.HARD).build();
        Flashcard f4 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.EASY).build();

        // Total esperado Pediatria: 40 + 22.5 + 10 = 72.5% -> Tier PLATINA
        when(lessonRepository.findAllByUserId(userId)).thenReturn(List.of(l1, l2));
        when(studySessionRepository.findAll(any(Specification.class))).thenReturn(List.of(session));
        when(flashcardRepository.findAllByUserId(userId)).thenReturn(List.of(f1, f2, f3, f4));

        ClinicalMasteryResponse response = clinicalMasteryService.calculateMastery(user);

        assertNotNull(response);
        AreaMasteryDTO pedArea = response.getAreas().stream()
                .filter(a -> a.getGrandeArea().equals("PEDIATRIA"))
                .findFirst()
                .orElse(null);

        assertNotNull(pedArea);
        assertEquals(72.5, pedArea.getMasteryPercentage());
        assertEquals(MasteryTier.PLATINA, pedArea.getTier());
        assertEquals(80.0, pedArea.getTaxaAcertoQuestoes());
        assertEquals(75.0, pedArea.getTaxaRetencaoCards());
        assertEquals(1, pedArea.getAulasAssistidas());
        assertEquals(2, pedArea.getTotalAulas());
    }

    @Test
    void matchesArea_ShouldMatchCanonicalVariations() {
        assertTrue(clinicalMasteryService.matchesArea("Clínica Médica", ClinicalMasteryService.AreaDefinition.CLINICA_MEDICA));
        assertTrue(clinicalMasteryService.matchesArea("Clinica", ClinicalMasteryService.AreaDefinition.CLINICA_MEDICA));
        assertTrue(clinicalMasteryService.matchesArea("Cirurgia Geral", ClinicalMasteryService.AreaDefinition.CIRURGIA_GERAL));
        assertTrue(clinicalMasteryService.matchesArea("Pediatria", ClinicalMasteryService.AreaDefinition.PEDIATRIA));
        assertTrue(clinicalMasteryService.matchesArea("Ginecologia e Obstetricia", ClinicalMasteryService.AreaDefinition.GINECOLOGIA_OBSTETRICIA));
        assertTrue(clinicalMasteryService.matchesArea("Medicina Preventiva", ClinicalMasteryService.AreaDefinition.MEDICINA_PREVENTIVA));
        assertFalse(clinicalMasteryService.matchesArea("Ortopedia", ClinicalMasteryService.AreaDefinition.CLINICA_MEDICA));
    }
}
