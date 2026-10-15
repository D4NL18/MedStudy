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
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
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

    @Mock
    private SimuladoRepository simuladoRepository;

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
        when(simuladoRepository.findAllByUserId(userId)).thenReturn(Collections.emptyList());

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
    void calculateMastery_ShouldComputeWeightedFormulaWithSimuladosAndDecay() {
        LocalDate today = LocalDate.now();

        // Pediatria:
        // Aulas: 1 assistida de 2 totais hoje -> 50%
        Lesson l1 = new Lesson();
        l1.setGrandeArea("Pediatria");
        l1.setAulaAssistida(true);
        l1.setDataAula(today);

        Lesson l2 = new Lesson();
        l2.setGrandeArea("Pediatria");
        l2.setAulaAssistida(false);

        // Questões do Banco: 8 corretas de 10 feitas hoje -> 80%
        StudySession session = new StudySession();
        session.setGrandeArea("Pediatria");
        session.setDataSessao(today);
        session.setQtsFeitas(10);
        session.setQtsCorretas(8);

        // Flashcards: 2 EASY, 1 MEDIUM, 1 HARD hoje -> 3 retidos de 4 revisados -> 75%
        Flashcard f1 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.EASY).ultimaRevisao(today).build();
        Flashcard f2 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.MEDIUM).ultimaRevisao(today).build();
        Flashcard f3 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.HARD).ultimaRevisao(today).build();
        Flashcard f4 = Flashcard.builder().grandeArea("Pediatria").dificuldadeUltima(FlashcardDifficulty.EASY).ultimaRevisao(today).build();

        // Simulado realizado hoje: 9 acertos de 10 em Pediatria -> 90%
        Simulado sim = new Simulado();
        sim.setDataRealizacao(today);
        sim.setPedTotal(10);
        sim.setPedAcertos(9);
        sim.setPedErros(1);

        // Pesos:
        // Questões (35%): 80% * 0.35 = 28.0
        // Simulados (35%): 90% * 0.35 = 31.5
        // Flashcards (15%): 75% * 0.15 = 11.25
        // Aulas (15%): 50% * 0.15 = 7.5
        // Total esperado Pediatria = 28.0 + 31.5 + 11.25 + 7.5 = 78.25% + bônus volume (0.3) + flashcards (0.16) = 78.7% -> Tier ESMERALDA (77-84%)
        when(lessonRepository.findAllByUserId(userId)).thenReturn(List.of(l1, l2));
        when(studySessionRepository.findAll(any(Specification.class))).thenReturn(List.of(session));
        when(flashcardRepository.findAllByUserId(userId)).thenReturn(List.of(f1, f2, f3, f4));
        when(simuladoRepository.findAllByUserId(userId)).thenReturn(List.of(sim));

        ClinicalMasteryResponse response = clinicalMasteryService.calculateMastery(user);

        assertNotNull(response);
        AreaMasteryDTO pedArea = response.getAreas().stream()
                .filter(a -> a.getGrandeArea().equals("PEDIATRIA"))
                .findFirst()
                .orElse(null);

        assertNotNull(pedArea);
        assertEquals(78.7, pedArea.getMasteryPercentage());
        assertEquals(MasteryTier.ESMERALDA, pedArea.getTier());
        assertEquals(80.0, pedArea.getTaxaAcertoQuestoes());
        assertEquals(90.0, pedArea.getTaxaAcertoSimulados());
        assertEquals(75.0, pedArea.getTaxaRetencaoCards());
        assertEquals(1, pedArea.getAulasAssistidas());
        assertEquals(2, pedArea.getTotalAulas());
    }

    @Test
    void calculateTemporalWeight_ShouldDecayWithTime() {
        LocalDate today = LocalDate.now();

        // Hoje: peso 1.0 (100%)
        double wToday = ClinicalMasteryService.calculateTemporalWeight(today, 45.0, 0.15, today);
        assertEquals(1.0, wToday, 0.001);

        // 45 dias atrás (meia vida): 0.15 + 0.85 * 0.5 = 0.575
        double w45Days = ClinicalMasteryService.calculateTemporalWeight(today.minusDays(45), 45.0, 0.15, today);
        assertEquals(0.575, w45Days, 0.001);

        // 365 dias atrás (antigo): próximo do piso de 0.15 (0.163 na curva quadrática)
        double wOld = ClinicalMasteryService.calculateTemporalWeight(today.minusDays(365), 45.0, 0.15, today);
        assertTrue(wOld >= 0.15 && wOld < 0.17);
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
