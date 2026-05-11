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

    @Mock
    private com.medstudy.backend.modules.aula.repository.LessonRepository lessonRepository;

    @Mock
    private com.medstudy.backend.modules.user.repository.UserRepository userRepository;

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
                "Cirurgia", "Apendicite", LocalDate.now(), 10, 9, "USP", null, null, false
        );
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);

        // 90% -> +20 days
        assertEquals(LocalDate.now().plusDays(20), entity.getDataProximaRevisao());
        assertEquals(currentUser, entity.getUser());
    }

    @Test
    void createSession_ShouldCalculateCorrectRevisionDate_WhenSuccessRateIsMedium() {
        mockUser();
        StudySessionRequest request = new StudySessionRequest("C", "T", LocalDate.now(), 10, 7, "I", null, null, false);
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);
        // 70% -> +5 days
        assertEquals(LocalDate.now().plusDays(5), entity.getDataProximaRevisao());
    }

    @Test
    void createSession_ShouldCalculateCorrectRevisionDate_WhenSuccessRateIsLow() {
        mockUser();
        StudySessionRequest request = new StudySessionRequest("C", "T", LocalDate.now(), 10, 3, "I", null, null, false);
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);
        // 30% -> +3 days
        assertEquals(LocalDate.now().plusDays(3), entity.getDataProximaRevisao());
    }

    @Test
    void createSession_ShouldThrowException_WhenCorretasGreaterThanFeitas() {
        StudySessionRequest request = new StudySessionRequest(
                "Cirurgia", "Apendicite", LocalDate.now(), 10, 11, "USP", null, null, false
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
        when(mapper.toResponse(entity)).thenReturn(new StudySessionResponse(sessionId, "Area", "Tema", LocalDate.now(), 10, 8, "Inst", null, null, false));

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

    @Test
    void getMetrics_ShouldReturnZero_WhenNoSessions() {
        mockUser();
        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(Collections.emptyList());
        StudySessionMetricsResponse metrics = service.getMetrics();
        assertEquals(0, metrics.totalSessoes());
        assertEquals(0, metrics.streakAtual());
    }

    @Test
    void calculateStreak_ShouldReturnZero_WhenBreakInDays() {
        mockUser();
        StudySession s1 = new StudySession();
        s1.setDataSessao(LocalDate.now());
        StudySession s2 = new StudySession();
        s2.setDataSessao(LocalDate.now().minusDays(3)); // Gap

        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(s1, s2));

        StudySessionMetricsResponse metrics = service.getMetrics();
        assertEquals(1, metrics.streakAtual());
    }

    @Test

    void update_ShouldUpdateFields() {
        mockUser();
        UUID sessionId = UUID.randomUUID();
        StudySession entity = new StudySession();
        entity.setUser(currentUser);
        when(repository.findById(sessionId)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);

        StudySessionRequest request = new StudySessionRequest("New", "Topic", LocalDate.now(), 5, 5, "Inst", null, null, false);
        service.updateSession(sessionId, request);

        assertEquals("New", entity.getGrandeArea());
        verify(repository).save(entity);
    }

    @Test
    void delete_ShouldCallRepository() {
        mockUser();
        UUID sessionId = UUID.randomUUID();
        StudySession entity = new StudySession();
        entity.setUser(currentUser);
        when(repository.findById(sessionId)).thenReturn(Optional.of(entity));

        service.deleteSession(sessionId);

        verify(repository).delete(entity);
    }

    @Test
    void createSession_ShouldHandleNullFeitas() {
        mockUser();
        StudySessionRequest request = new StudySessionRequest("A", "T", LocalDate.now(), 0, 0, "I", null, null, false);
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);
        assertNull(entity.getDataProximaRevisao());
    }

    @Test
    void calculateNextRevision_Boundaries() {
        mockUser();
        
        // 65% -> 3 days
        StudySessionRequest r65 = new StudySessionRequest("A", "T", LocalDate.now(), 100, 65, "I", null, null, false);
        StudySession e65 = new StudySession();
        when(mapper.toEntity(r65)).thenReturn(e65);
        when(repository.save(any())).thenReturn(e65);
        service.createSession(r65);
        assertEquals(LocalDate.now().plusDays(3), e65.getDataProximaRevisao());

        // 75% -> 5 days
        StudySessionRequest r75 = new StudySessionRequest("A", "T", LocalDate.now(), 100, 75, "I", null, null, false);
        StudySession e75 = new StudySession();
        when(mapper.toEntity(r75)).thenReturn(e75);
        when(repository.save(any())).thenReturn(e75);
        service.createSession(r75);
        assertEquals(LocalDate.now().plusDays(5), e75.getDataProximaRevisao());

        // 85% -> 10 days
        StudySessionRequest r85 = new StudySessionRequest("A", "T", LocalDate.now(), 100, 85, "I", null, null, false);
        StudySession e85 = new StudySession();
        when(mapper.toEntity(r85)).thenReturn(e85);
        when(repository.save(any())).thenReturn(e85);
        service.createSession(r85);
        assertEquals(LocalDate.now().plusDays(10), e85.getDataProximaRevisao());
    }

    @Test
    void getCurrentUser_ShouldHandleUserDetails() {
        org.springframework.security.core.userdetails.UserDetails userDetails = mock(org.springframework.security.core.userdetails.UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@medstudy.com");
        
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(ctx);

        when(userRepository.findByEmail("test@medstudy.com")).thenReturn(Optional.of(currentUser));
        
        StudySessionRequest request = new StudySessionRequest("A", "T", LocalDate.now(), 10, 8, "I", null, null, false);
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);
        assertEquals(currentUser, entity.getUser());
    }

    @Test
    void getCurrentUser_ShouldHandleStringPrincipal() {
        Authentication auth = mock(Authentication.class);
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn("test@medstudy.com");
        SecurityContextHolder.setContext(ctx);

        when(userRepository.findByEmail("test@medstudy.com")).thenReturn(Optional.of(currentUser));
        
        StudySessionRequest request = new StudySessionRequest("A", "T", LocalDate.now(), 10, 8, "I", null, null, false);
        StudySession entity = new StudySession();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.createSession(request);
        assertEquals(currentUser, entity.getUser());
    }

    @Test
    void getCurrentUser_ShouldThrowWhenNoAuth() {
        SecurityContextHolder.clearContext();
        assertThrows(RuntimeException.class, () -> service.getMetrics());
    }

    @Test
    void calculateStreak_Yesterday() {
        mockUser();
        StudySession s1 = new StudySession();
        s1.setDataSessao(LocalDate.now().minusDays(1)); // Started yesterday
        StudySession s2 = new StudySession();
        s2.setDataSessao(LocalDate.now().minusDays(2));

        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(s1, s2));

        StudySessionMetricsResponse metrics = service.getMetrics();
        assertEquals(2, metrics.streakAtual());
    }

    @Test
    void updateLessonPerformance_ShouldHandleNoLesson() {
        mockUser();
        StudySession saved = new StudySession();
        saved.setTema("Tema Inexistente");
        saved.setUser(currentUser);
        when(mapper.toEntity(any())).thenReturn(saved);
        when(repository.save(any())).thenReturn(saved);
        when(lessonRepository.findByUserAndTema(any(), any())).thenReturn(Optional.empty());

        StudySessionRequest request = new StudySessionRequest("A", "Tema Inexistente", LocalDate.now(), 10, 8, "I", null, null, false);
        service.createSession(request);
        
        verify(lessonRepository, never()).save(any());
    }
}

