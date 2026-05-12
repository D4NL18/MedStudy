package com.medstudy.backend.core.config;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@Order(2)
public class TestDataSeeder implements CommandLineRunner {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository;

    public TestDataSeeder(StudySessionRepository sessionRepository, UserRepository userRepository, com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail("user@test.com").ifPresent(user -> {
            if (sessionRepository.count() == 0) {
                seedSessions(user);
            }
        });
    }

    private void seedSessions(User user) {
        createSession(user, "Clínica Médica", "Cardiologia", 10, 8);
        createSession(user, "Clínica Médica", "Nefrologia", 10, 7);
        createSession(user, "Pediatria", "Puericultura", 15, 12);
        createSession(user, "GO", "Obstetrícia", 20, 15);
        createSession(user, "Cirurgia", "Trauma", 10, 6);
        System.out.println(">>> TestDataSeeder: 5 sessões de estudo criadas para user@test.com");
        
        seedLessons(user);
    }

    private void seedLessons(User user) {
        createLesson(user, "Clínica Médica", "Insuficiência Cardíaca", "ALTA", true, false);
        createLesson(user, "Pediatria", "Imunizações", "MÉDIA", false, true);
        createLesson(user, "GO", "Pré-natal", "BAIXA", false, false);
        System.out.println(">>> TestDataSeeder: 3 aulas criadas para user@test.com");
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

    private void createSession(User user, String area, String tema, int total, int acertos) {
        StudySession session = new StudySession();
        session.setUser(user);
        session.setGrandeArea(area);
        session.setTema(tema);
        session.setDataSessao(LocalDate.now());
        session.setQtsFeitas(total);
        session.setQtsCorretas(acertos);
        sessionRepository.save(session);
    }
}
