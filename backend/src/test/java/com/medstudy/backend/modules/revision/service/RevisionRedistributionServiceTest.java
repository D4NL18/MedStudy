package com.medstudy.backend.modules.revision.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewRequest;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewResponse;
import com.medstudy.backend.modules.flashcard.entity.Flashcard;
import com.medstudy.backend.modules.revision.entity.RedistributionDraft;
import com.medstudy.backend.modules.flashcard.repository.FlashcardRepository;
import com.medstudy.backend.modules.revision.repository.RedistributionDraftRepository;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.service.UserSettingsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RevisionRedistributionServiceTest {

    @Mock
    private FlashcardRepository flashcardRepository;

    @Mock
    private RedistributionDraftRepository draftRepository;

    @Mock
    private UserSettingsService userSettingsService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private RevisionRedistributionService service;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setup() {
        userId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(userId);
        
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testUser, null, new ArrayList<>())
        );
    }

    @Test
    void testGeneratePreview_NoFlashcards() {
        LocalDate targetEndDate = LocalDate.now().plusDays(5);

        when(flashcardRepository.findByUserIdAndProximaRevisaoBefore(eq(userId), any(LocalDate.class))).thenReturn(new ArrayList<>());

        RedistributionPreviewResponse response = service.generatePreview(targetEndDate);

        assertNotNull(response);
        assertEquals(0, response.getTotalRevisionsRedistributed());
    }

    @Test
    void testApplyDraft_Success() throws Exception {
        UUID draftId = UUID.randomUUID();
        RedistributionDraft draft = new RedistributionDraft();
        draft.setId(draftId);
        draft.setUserId(userId);
        draft.setDraftData("{\"11111111-1111-1111-1111-111111111111\":\"2030-01-01\"}");

        when(draftRepository.findById(draftId)).thenReturn(Optional.of(draft));

        java.util.Map<UUID, String> mockMap = new java.util.HashMap<>();
        mockMap.put(UUID.fromString("11111111-1111-1111-1111-111111111111"), "2030-01-01");
        
        when(objectMapper.readValue(eq(draft.getDraftData()), any(com.fasterxml.jackson.core.type.TypeReference.class))).thenReturn(mockMap);
        
        Flashcard card = new Flashcard();
        card.setId(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        
        User u = new User();
        u.setId(userId);
        card.setUser(u);
        when(flashcardRepository.findAllById(any())).thenReturn(List.of(card));

        service.applyDraft(draftId);

        verify(flashcardRepository, times(1)).saveAll(any());
        verify(draftRepository, times(1)).delete(draft);
    }
}
