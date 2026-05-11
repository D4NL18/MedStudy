package com.medstudy.backend.modules.aula.service;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.mapper.LessonMapper;
import com.medstudy.backend.modules.aula.repository.LessonRepository;
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

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonServiceTest {

    @Mock
    private LessonRepository repository;

    @Mock
    private LessonMapper mapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private LessonService service;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
    }

    @Test
    void create_ShouldSetUserAndSave() {
        LessonRequest request = new LessonRequest("Area", "Sub", "Tema", LessonPriority.ALTA, false, null, 0, false, false);
        Lesson entity = new Lesson();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.create(request);

        assertEquals(user, entity.getUser());
        verify(repository).save(entity);
    }

    @Test
    void toggleAssistida_ShouldInvertValue() {
        UUID id = UUID.randomUUID();
        Lesson entity = new Lesson();
        entity.setUser(user);
        entity.setAulaAssistida(false);
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);

        service.toggleAssistida(id);

        assertTrue(entity.getAulaAssistida());
        verify(repository).save(entity);
    }

    @Test
    void toggleAssistida_ShouldSetDateWhenMarkedAsAssisted() {
        UUID id = UUID.randomUUID();
        Lesson entity = new Lesson();
        entity.setUser(user);
        entity.setAulaAssistida(false);
        entity.setDataAula(null);
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);

        service.toggleAssistida(id);

        assertTrue(entity.getAulaAssistida());
        assertNotNull(entity.getDataAula());
        assertEquals(java.time.LocalDate.now(), entity.getDataAula());
    }

    @Test
    void delete_ShouldThrowException_WhenNotOwner() {
        UUID id = UUID.randomUUID();
        Lesson entity = new Lesson();
        User other = new User();
        other.setId(UUID.randomUUID());
        entity.setUser(other);
        when(repository.findById(id)).thenReturn(Optional.of(entity));

        assertThrows(RuntimeException.class, () -> service.delete(id));
    }

    @Test
    void create_ShouldSetDefaults() {
        LessonRequest request = new LessonRequest("A", "S", "T", LessonPriority.ALTA, null, null, null, null, null);
        Lesson entity = new Lesson();
        when(mapper.toEntity(request)).thenReturn(entity);
        when(repository.save(any())).thenReturn(entity);

        service.create(request);

        assertFalse(entity.getAulaAssistida());
        assertFalse(entity.getReforco());
        assertFalse(entity.getRevisao());
    }

    @Test
    void update_ShouldNotOverwriteWithNulls() {
        UUID id = UUID.randomUUID();
        Lesson entity = new Lesson();
        entity.setUser(user);
        entity.setAulaAssistida(true);
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(repository.save(any())).thenReturn(entity);

        LessonRequest request = new LessonRequest("A", "S", "T", LessonPriority.BAIXA, null, null, null, null, null);
        service.update(id, request);

        assertTrue(entity.getAulaAssistida()); // Should remain true
    }

    @Test
    void getById_ShouldReturnResponse() {
        UUID id = UUID.randomUUID();
        Lesson entity = new Lesson();
        entity.setUser(user);
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        when(mapper.toResponse(entity)).thenReturn(new LessonResponse(id, "A", "S", "T", LessonPriority.ALTA, false, null, 0, false, false));

        LessonResponse response = service.getById(id);
        assertNotNull(response);
    }

    @Test
    @SuppressWarnings("unchecked")
    void findAll_ShouldCallRepository() {
        org.springframework.data.domain.Page<Lesson> page = mock(org.springframework.data.domain.Page.class);
        when(repository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        service.findAll("A", LessonPriority.ALTA, true, "T", mock(org.springframework.data.domain.Pageable.class));

        verify(repository).findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class));
    }
}
