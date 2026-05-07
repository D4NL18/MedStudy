package com.medstudy.backend.modules.aula.service;

import com.medstudy.backend.modules.aula.dto.LessonRequest;
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

    @InjectMocks
    private LessonService service;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

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
    void shouldToggleLessonAssistida() {
        UUID lessonId = UUID.randomUUID();
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setUser(user);
        lesson.setAulaAssistida(false);

        when(repository.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(repository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        service.toggleAssistida(lessonId);

        assertTrue(lesson.getAulaAssistida());

        service.toggleAssistida(lessonId);
        assertFalse(lesson.getAulaAssistida());
    }

    @Test
    void shouldThrowExceptionWhenDeletingOtherUserLesson() {
        UUID lessonId = UUID.randomUUID();
        User otherUser = new User();
        otherUser.setId(UUID.randomUUID());
        
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setUser(otherUser);

        when(repository.findById(lessonId)).thenReturn(Optional.of(lesson));

        assertThrows(RuntimeException.class, () -> service.delete(lessonId));
    }
}
