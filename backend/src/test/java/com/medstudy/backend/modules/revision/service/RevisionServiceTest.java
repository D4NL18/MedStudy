package com.medstudy.backend.modules.revision.service;

import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.sessao.mapper.StudySessionMapper;
import com.medstudy.backend.modules.sessao.repository.StudySessionRepository;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RevisionServiceTest {

    @Mock
    private StudySessionRepository sessionRepository;

    @Mock
    private FlashcardRepository flashcardRepository;

    @Mock
    private StudySessionMapper mapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private RevisionService revisionService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getSummary_ShouldReturnCorrectTotals() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);

        UUID userId = user.getId();
        LocalDate today = LocalDate.now();

        // Mocks for sessions
        when(sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoLessThan(eq(userId), any()))
                .thenReturn(1L);
        when(sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisao(eq(userId), any()))
                .thenReturn(2L);
        when(sessionRepository.countByUserIdAndRevisaoConcluidaFalseAndDataProximaRevisaoGreaterThan(eq(userId), any()))
                .thenReturn(3L);
        when(sessionRepository.countByUserIdAndRevisaoConcluidaTrue(userId))
                .thenReturn(4L);

        // Mocks for flashcards
        when(flashcardRepository.countByUserIdAndProximaRevisaoBefore(eq(userId), any()))
                .thenReturn(5L);
        when(flashcardRepository.countByUserIdAndProximaRevisao(eq(userId), any()))
                .thenReturn(6L);
        when(flashcardRepository.countByUserIdAndProximaRevisaoAfter(eq(userId), any()))
                .thenReturn(7L);
        when(flashcardRepository.countByUserIdAndLastStudiedAt(eq(userId), any()))
                .thenReturn(8L);

        RevisionSummaryResponse summary = revisionService.getSummary();

        assertEquals(6L, summary.getAtrasadas()); // 1 + 5
        assertEquals(8L, summary.getHoje());      // 2 + 6
        assertEquals(10L, summary.getFuturas());  // 3 + 7
        assertEquals(12L, summary.getConcluidas()); // 4 + 8
    }
}
