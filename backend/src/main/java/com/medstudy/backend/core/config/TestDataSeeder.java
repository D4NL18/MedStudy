package com.medstudy.backend.core.config;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.simulado.repository.SimuladoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;


@Component
@Order(2)
public class TestDataSeeder implements CommandLineRunner {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository;
    private final FlashcardRepository flashcardRepository;
    private final SimuladoRepository simuladoRepository;
    private final ObjectMapper objectMapper;

    public TestDataSeeder(StudySessionRepository sessionRepository, 
                          UserRepository userRepository, 
                          com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository,
                          FlashcardRepository flashcardRepository,
                          SimuladoRepository simuladoRepository,
                          ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.flashcardRepository = flashcardRepository;
        this.simuladoRepository = simuladoRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail("user@test.com").ifPresent(this::seedForUser);
        userRepository.findByEmail("admin@test.com").ifPresent(this::seedForUser);
        userRepository.findByEmail("admin@medstudy.com").ifPresent(this::seedForUser);
    }

    private void seedForUser(User user) {
        if (sessionRepository.countByUserId(user.getId()) < 100) {
            seedSessions(user);
        }
        if (lessonRepository.countByUserId(user.getId()) < 25) {
            seedLessons(user);
        }
        if (flashcardRepository.countByUserId(user.getId()) < 25) {
            seedFlashcards(user);
        }
        if (simuladoRepository.countByUserId(user.getId()) < 25) {
            seedSimulados(user);
        }
    }

    private void seedSessions(User user) {
        for (int i = 1; i <= 100; i++) {
            // Distribute them: 40 atrasadas, 20 hoje, 40 futuras
            int daysOffset;
            if (i <= 40) {
                daysOffset = -(i % 10 + 1); // 1 to 10 days ago
            } else if (i <= 60) {
                daysOffset = 0; // Today
            } else {
                daysOffset = i % 10 + 1; // 1 to 10 days in the future
            }
            createSession(user, "Clínica Médica", "Tema Teste " + i, 10, 8, daysOffset);
        }
        System.out.println(">>> TestDataSeeder: 100 sessões de estudo criadas para " + user.getEmail());
    }

    private void seedLessons(User user) {
        for (int i = 1; i <= 25; i++) {
            createLesson(user, "Clínica Médica", "Insuficiência Cardíaca " + i, "ALTA", true, false);
        }
        System.out.println(">>> TestDataSeeder: 25 aulas criadas para " + user.getEmail());
    }

    private void seedFlashcards(User user) {
        for (int i = 1; i <= 25; i++) {
            ObjectNode frente = objectMapper.createObjectNode();
            frente.put("text", "Pergunta " + i);
            
            ObjectNode verso = objectMapper.createObjectNode();
            verso.put("text", "Resposta " + i);
            
            Flashcard flashcard = new Flashcard();
            flashcard.setUser(user);
            flashcard.setGrandeArea("Clínica Médica");
            flashcard.setFrente(frente);
            flashcard.setVerso(verso);
            flashcard.setProximaRevisao(LocalDate.now());
            flashcardRepository.save(flashcard);
        }
        System.out.println(">>> TestDataSeeder: 25 flashcards criados para " + user.getEmail());
    }

    private void createLesson(User user, String area, String tema, String prioridade, boolean reforco, boolean revisao) {
        com.medstudy.backend.modules.aula.entity.Lesson lesson = new com.medstudy.backend.modules.aula.entity.Lesson();
        lesson.setUser(user);
        lesson.setGrandeArea(area);
        lesson.setTema(tema);
        lesson.setPrioridade(com.medstudy.backend.modules.aula.entity.LessonPriority.valueOf(prioridade));
        lesson.setReforco(reforco);
        lesson.setRevisao(revisao);
        lesson.setAulaAssistida(false);
        lessonRepository.save(lesson);
    }

    private void createSession(User user, String area, String tema, int total, int acertos, int daysOffset) {
        StudySession session = new StudySession();
        session.setUser(user);
        session.setGrandeArea(area);
        session.setTema(tema);
        session.setDataSessao(LocalDate.now().minusDays(30)); // Done 30 days ago
        session.setQtsFeitas(total);
        session.setQtsCorretas(acertos);
        session.setDataProximaRevisao(LocalDate.now().plusDays(daysOffset));
        session.setRevisaoConcluida(false);
        sessionRepository.save(session);
    }

    private void seedSimulados(User user) {
        for (int i = 1; i <= 25; i++) {
            Simulado simulado = new Simulado();
            simulado.setUser(user);
            simulado.setNome("Simulado Geral " + i);
            simulado.setDataRealizacao(LocalDate.now());
            simulado.setInstituicao("MedStudy Nacional");
            simulado.setAno(2026);
            
            simulado.setCmTotal(20);
            simulado.setCmAcertos(12 + (i % 8));
            simulado.setCmErros(20 - simulado.getCmAcertos());
            
            simulado.setCirTotal(20);
            simulado.setCirAcertos(12 + (i % 8));
            simulado.setCirErros(20 - simulado.getCirAcertos());
            
            simulado.setPedTotal(20);
            simulado.setPedAcertos(12 + (i % 8));
            simulado.setPedErros(20 - simulado.getPedAcertos());
            
            simulado.setGoTotal(20);
            simulado.setGoAcertos(12 + (i % 8));
            simulado.setGoErros(20 - simulado.getGoAcertos());
            
            simulado.setPrevTotal(20);
            simulado.setPrevAcertos(12 + (i % 8));
            simulado.setPrevErros(20 - simulado.getPrevAcertos());
            
            simuladoRepository.save(simulado);
        }
        System.out.println(">>> TestDataSeeder: 25 simulados criados para " + user.getEmail());
    }
}
