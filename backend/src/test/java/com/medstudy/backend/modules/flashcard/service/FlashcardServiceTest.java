package com.medstudy.backend.modules.flashcard.service;

import com.medstudy.backend.modules.flashcard.dto.FlashcardRequest;
import com.medstudy.backend.modules.flashcard.dto.FlashcardResponse;
import com.medstudy.backend.modules.flashcard.dto.FlashcardStudyRequest;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.flashcard.entity.FlashcardDifficulty;
import com.medstudy.backend.modules.flashcard.mapper.FlashcardMapper;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.util.TestDataFactory;
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
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlashcardServiceTest {

    @Mock
    private FlashcardRepository repository;
    @Mock
    private FlashcardMapper mapper;
    @Mock
    private SpacedRepetitionService srService;

    @InjectMocks
    private FlashcardService flashcardService;

    private User user;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
        mockSecurityContext(user);
    }

    private void mockSecurityContext(User user) {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void create_ShouldSaveAndReturnFlashcard() {
        FlashcardRequest request = new FlashcardRequest("GINECOLOGIA", "Frente", "Verso");
        Flashcard flashcard = new Flashcard();

        FlashcardResponse response = new FlashcardResponse(UUID.randomUUID(), "GINECOLOGIA", "Frente", "Verso", null, null, 0);

        when(mapper.toEntity(request)).thenReturn(flashcard);
        when(repository.save(any(Flashcard.class))).thenReturn(flashcard);
        when(mapper.toResponse(flashcard)).thenReturn(response);

        FlashcardResponse result = flashcardService.create(request);

        assertNotNull(result);
        verify(repository).save(flashcard);
        assertEquals(user, flashcard.getUser());
    }

    @Test
    void study_ShouldUpdateNextRevision() {
        UUID id = UUID.randomUUID();
        Flashcard flashcard = TestDataFactory.createFlashcard(user);
        flashcard.setId(id);
        FlashcardStudyRequest request = new FlashcardStudyRequest(id, FlashcardDifficulty.EASY);

        when(repository.findById(id)).thenReturn(Optional.of(flashcard));
        when(repository.save(any(Flashcard.class))).thenReturn(flashcard);

        flashcardService.study(request);

        verify(srService).calculateNextRevision(flashcard, FlashcardDifficulty.EASY);
        assertEquals(LocalDate.now(), flashcard.getLastStudiedAt());
    }


    @Test
    void getSummary_ShouldReturnCorrectStats() {
        when(repository.findAllByUserId(user.getId())).thenReturn(java.util.List.of(
            TestDataFactory.createFlashcard(user),
            TestDataFactory.createFlashcard(user)
        ));

        Map<String, Object> summary = flashcardService.getSummary();

        assertEquals(2L, summary.get("total"));
        assertEquals(20, summary.get("metaDiaria"));
    }

    @Test

    void update_ShouldUpdateAndSave() {
        UUID id = UUID.randomUUID();
        Flashcard flashcard = TestDataFactory.createFlashcard(user);
        flashcard.setId(id);
        FlashcardRequest request = new FlashcardRequest("New", "F", "V");
        
        when(repository.findById(id)).thenReturn(Optional.of(flashcard));
        when(repository.save(any())).thenReturn(flashcard);
        
        flashcardService.update(id, request);
        
        verify(mapper).updateEntity(request, flashcard);
        verify(repository).save(flashcard);
    }

    @Test
    void delete_ShouldCallRepository() {
        UUID id = UUID.randomUUID();
        Flashcard flashcard = TestDataFactory.createFlashcard(user);
        flashcard.setId(id);
        
        when(repository.findById(id)).thenReturn(Optional.of(flashcard));
        
        flashcardService.delete(id);
        
        verify(repository).delete(flashcard);
    }

    @Test
    void getTodayQueue_ShouldFilterCards() {
        Flashcard f1 = TestDataFactory.createFlashcard(user);
        f1.setProximaRevisao(LocalDate.now().minusDays(1));
        Flashcard f2 = TestDataFactory.createFlashcard(user);
        f2.setProximaRevisao(LocalDate.now().plusDays(1));

        when(repository.findAllByUserId(user.getId())).thenReturn(java.util.List.of(f1, f2));

        var result = flashcardService.getTodayQueue();

        assertEquals(1, result.size());
    }
}

