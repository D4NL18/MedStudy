package com.medstudy.backend.util;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.simulado.entity.Simulado;
import com.medstudy.backend.modules.user.entity.User;

import java.time.LocalDate;
import java.util.UUID;

public class TestDataFactory {

    public static User createUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Test User");
        user.setEmail("test" + UUID.randomUUID().toString().substring(0, 8) + "@medstudy.com");
        user.setPassword("password123");
        user.setRole("ROLE_USER");
        return user;
    }

    public static StudySession createStudySession(User user) {
        StudySession session = new StudySession();
        session.setId(UUID.randomUUID());
        session.setUser(user);
        session.setGrandeArea("CLINICA_MEDICA");
        session.setTema("Hipertensão");
        session.setDataSessao(LocalDate.now());
        session.setQtsFeitas(10);
        session.setQtsCorretas(8);
        session.setInstituicao("SUS");
        session.setRevisaoConcluida(false);
        return session;
    }

    public static Simulado createSimulado(User user) {
        Simulado simulado = new Simulado();
        simulado.setId(UUID.randomUUID());
        simulado.setUser(user);
        simulado.setNome("Simulado Teste");
        simulado.setDataRealizacao(LocalDate.now());
        simulado.setInstituicao("EINSTEIN");
        simulado.setAno(2024);
        simulado.setCmTotal(20);
        simulado.setCmAcertos(15);
        simulado.setCmErros(5);
        simulado.setCirTotal(20);
        simulado.setCirAcertos(12);
        simulado.setCirErros(8);
        simulado.setPedTotal(20);
        simulado.setPedAcertos(18);
        simulado.setPedErros(2);
        simulado.setGoTotal(20);
        simulado.setGoAcertos(14);
        simulado.setGoErros(6);
        simulado.setPrevTotal(20);
        simulado.setPrevAcertos(16);
        simulado.setPrevErros(4);
        return simulado;
    }

    public static Lesson createLesson(User user) {
        Lesson lesson = new Lesson();
        lesson.setId(UUID.randomUUID());
        lesson.setUser(user);
        lesson.setGrandeArea("PEDIATRIA");
        lesson.setTema("Neonatologia");
        lesson.setPriority(LessonPriority.ALTA);
        lesson.setWatched(false);
        return lesson;
    }

    public static Flashcard createFlashcard(User user) {
        Flashcard flashcard = new Flashcard();
        flashcard.setId(UUID.randomUUID());
        flashcard.setUser(user);
        flashcard.setGrandeArea("GINECOLOGIA");
        flashcard.setTema("Obstetrícia");
        flashcard.setFront("Pergunta de teste?");
        flashcard.setBack("Resposta de teste.");
        flashcard.setProximaRevisao(LocalDate.now());
        return flashcard;
    }
}
