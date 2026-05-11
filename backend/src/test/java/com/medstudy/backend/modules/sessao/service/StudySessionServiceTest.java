package com.medstudy.backend.modules.sessao.service;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudySessionServiceTest {

    private StudySessionRepository repository;
    private UserRepository userRepository;
    private StudySessionMapper mapper;
    private LessonRepository lessonRepository;
    private StudySessionService service;

    @BeforeEach
    void setUp() {
        repository = mock(StudySessionRepository.class);
        userRepository = mock(UserRepository.class);
        mapper = mock(StudySessionMapper.class);
        lessonRepository = mock(LessonRepository.class);
        service = new StudySessionService(repository, userRepository, mapper, lessonRepository);

        // Mock Security Context
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@medstudy.com");
        
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(user);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createSession_ShouldSetCorrectIntervalAndUrgentFlag() {
        StudySessionRequest request = new StudySessionRequest(
            "Pediatria", "Asma", LocalDate.now(), 10, 3, "Hospital X", "Obs", null, false
        );
        // 3/10 = 30% (< 40% -> urgente, < 50% -> 1 dia)

        StudySession entity = new StudySession();
        when(mapper.toEntity(any())).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);

        assertTrue(entity.getUrgente());
        assertEquals(LocalDate.now().plusDays(1), entity.getDataProximaRevisao());
    }

    @Test
    void calculateNextRevision_ShouldApplyCorrectIntervals() {
        // Mock access to private method via a public call or reflection? 
        // Better to test via createSession with different inputs.

        // 60% (50-75% -> 3 dias)
        StudySessionRequest r2 = new StudySessionRequest("A", "T", LocalDate.now(), 10, 6, "I", "O", null, false);
        StudySession e2 = new StudySession();
        when(mapper.toEntity(any())).thenReturn(e2);
        when(repository.save(any())).thenReturn(e2);
        service.createSession(r2);
        assertFalse(e2.getUrgente());
        assertEquals(LocalDate.now().plusDays(3), e2.getDataProximaRevisao());

        // 80% (75-90% -> 7 dias)
        StudySessionRequest r3 = new StudySessionRequest("A", "T", LocalDate.now(), 10, 8, "I", "O", null, false);
        StudySession e3 = new StudySession();
        when(mapper.toEntity(any())).thenReturn(e3);
        when(repository.save(any())).thenReturn(e3);
        service.createSession(r3);
        assertEquals(LocalDate.now().plusDays(7), e3.getDataProximaRevisao());

        // 100% (>90% -> 15 dias)
        StudySessionRequest r4 = new StudySessionRequest("A", "T", LocalDate.now(), 10, 10, "I", "O", null, false);
        StudySession e4 = new StudySession();
        when(mapper.toEntity(any())).thenReturn(e4);
        when(repository.save(any())).thenReturn(e4);
        service.createSession(r4);
        assertEquals(LocalDate.now().plusDays(15), e4.getDataProximaRevisao());
    }
}
