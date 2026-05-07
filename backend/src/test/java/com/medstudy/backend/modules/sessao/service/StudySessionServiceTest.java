package com.medstudy.backend.modules.sessao.service;

import com.medstudy.backend.modules.sessao.dto.StudySessionMetricsResponse;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.entity.StudySession;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudySessionServiceTest {

    @Mock
    private StudySessionRepository repository;

    @Mock
    private StudySessionMapper mapper;

    @InjectMocks
    private StudySessionService service;

    private User currentUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        currentUser = new User();
        currentUser.setId(userId);
    }

    private void mockUser() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void createSession_ShouldCalculateCorrectRevisionDate_WhenSuccessRateIsHigh() {
        mockUser();
        StudySessionRequest request = new StudySessionRequest(
                "Cirurgia", "Apendicite", LocalDate.now(), 10, 9, "USP", null, false
        );
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);

        // 90% -> +20 days
        assertEquals(LocalDate.now().plusDays(20), entity.getDataProximaRevisao());
        assertEquals(currentUser, entity.getUser());
        verify(repository).save(entity);
    }

    @Test
    void createSession_ShouldThrowException_WhenCorretasGreaterThanFeitas() {
        StudySessionRequest request = new StudySessionRequest(
                "Cirurgia", "Apendicite", LocalDate.now(), 10, 11, "USP", null, false
        );

        assertThrows(IllegalArgumentException.class, () -> service.createSession(request));
    }

    @Test
    void getById_ShouldReturnResponse_WhenUserOwnsSession() {
        mockUser();
        UUID sessionId = UUID.randomUUID();
        StudySession entity = new StudySession();
        entity.setUser(currentUser);
        when(repository.findById(sessionId)).thenReturn(Optional.of(entity));
        when(mapper.toResponse(entity)).thenReturn(new StudySessionResponse(sessionId, "Area", "Tema", LocalDate.now(), 10, 8, "Inst", null, false));

        StudySessionResponse response = service.getById(sessionId);

        assertNotNull(response);
        verify(repository).findById(sessionId);
    }

    @Test
    void getById_ShouldThrowException_WhenUserDoesNotOwnSession() {
        mockUser();
        UUID sessionId = UUID.randomUUID();
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());
        
        StudySession entity = new StudySession();
        entity.setUser(otherUser);
        when(repository.findById(sessionId)).thenReturn(Optional.of(entity));

        assertThrows(RuntimeException.class, () -> service.getById(sessionId));
    }

    @Test
    void getMetrics_ShouldCalculateCorrectly() {
        mockUser();
        StudySession s1 = new StudySession();
        s1.setQtsFeitas(10);
        s1.setQtsCorretas(8);
        s1.setDataSessao(LocalDate.now());
        s1.setRevisaoConcluida(false);
        s1.setDataProximaRevisao(LocalDate.now().minusDays(1)); // Critical

        StudySession s2 = new StudySession();
        s2.setQtsFeitas(10);
        s2.setQtsCorretas(2);
        s2.setDataSessao(LocalDate.now().minusDays(1));
        s2.setRevisaoConcluida(true);

        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(s1, s2));

        StudySessionMetricsResponse metrics = service.getMetrics();

        assertEquals(2, metrics.totalSessoes());
        assertEquals(20, metrics.totalQuestoes());
        assertEquals(50.0, metrics.mediaAcertos());
        assertEquals(1, metrics.revisoesCriticas());
        assertEquals(2, metrics.streakAtual());
    }
}
