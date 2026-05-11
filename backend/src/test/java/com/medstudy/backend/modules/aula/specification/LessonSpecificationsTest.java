package com.medstudy.backend.modules.aula.specification;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;
import jakarta.persistence.criteria.Path;
import org.mockito.Mockito;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class LessonSpecificationsTest {

    @Test
    void specifications_ShouldReturnNotNull() {
        assertNotNull(LessonSpecifications.hasUserId(UUID.randomUUID()));
        assertNotNull(LessonSpecifications.hasGrandeArea("Area"));
        assertNotNull(LessonSpecifications.hasPrioridade(LessonPriority.ALTA));
        assertNotNull(LessonSpecifications.hasAulaAssistida(true));
        assertNotNull(LessonSpecifications.hasTema("Tema"));
        assertNotNull(LessonSpecifications.hasReforco(true));
        assertNotNull(LessonSpecifications.hasRevisao(true));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_WithNull_ShouldReturnNullPredicate() {
        Root<Lesson> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        assertNull(LessonSpecifications.hasUserId(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasGrandeArea(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasGrandeArea("").toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasPrioridade(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasAulaAssistida(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasTema(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasTema("").toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasReforco(null).toPredicate(root, query, cb));
        assertNull(LessonSpecifications.hasRevisao(null).toPredicate(root, query, cb));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_WithValidValues_ShouldCallCriteriaBuilder() {
        Root<Lesson> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        when(path.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).lower(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).equal(any(), any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).like(any(jakarta.persistence.criteria.Expression.class), anyString());

        // Test hasUserId
        LessonSpecifications.hasUserId(UUID.randomUUID()).toPredicate(root, query, cb);
        verify(cb, times(1)).equal(any(), any(UUID.class));

        // Test hasGrandeArea
        LessonSpecifications.hasGrandeArea("Area").toPredicate(root, query, cb);
        verify(cb, times(1)).equal(any(), eq("Area"));

        // Test hasPrioridade
        LessonSpecifications.hasPrioridade(LessonPriority.ALTA).toPredicate(root, query, cb);
        verify(cb, times(1)).equal(any(), eq(LessonPriority.ALTA));

        // Test hasAulaAssistida
        LessonSpecifications.hasAulaAssistida(true).toPredicate(root, query, cb);
        verify(cb, times(1)).equal(any(), eq(true));

        // Test hasTema
        LessonSpecifications.hasTema("Tema").toPredicate(root, query, cb);
        verify(cb, times(1)).like(any(), anyString());

        // Test hasReforco
        LessonSpecifications.hasReforco(true).toPredicate(root, query, cb);
        verify(cb, times(2)).equal(any(), eq(true));

        // Test hasRevisao
        LessonSpecifications.hasRevisao(true).toPredicate(root, query, cb);
        verify(cb, times(3)).equal(any(), eq(true));
    }
}
