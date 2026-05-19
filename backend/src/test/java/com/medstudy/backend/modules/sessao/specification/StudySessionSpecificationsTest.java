package com.medstudy.backend.modules.sessao.specification;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import jakarta.persistence.criteria.Path;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class StudySessionSpecificationsTest {

    @Test
    void specifications_ShouldReturnNotNull() {
        assertNotNull(StudySessionSpecifications.hasUserId(UUID.randomUUID()));
        assertNotNull(StudySessionSpecifications.hasGrandeArea("Area"));
        assertNotNull(StudySessionSpecifications.hasTema("Tema"));
        assertNotNull(StudySessionSpecifications.hasInstituicao("Inst"));
        assertNotNull(StudySessionSpecifications.hasRevisaoConcluida(true));
        assertNotNull(StudySessionSpecifications.hasMinSuccessRate(50.0));
        assertNotNull(StudySessionSpecifications.hasMaxSuccessRate(90.0));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_WithNull_ShouldReturnNullPredicate() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);

        assertNull(StudySessionSpecifications.hasUserId(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasGrandeArea(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasGrandeArea("").toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasTema(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasTema("").toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasInstituicao(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasInstituicao("").toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasRevisaoConcluida(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasMinSuccessRate(null).toPredicate(root, query, cb));
        assertNull(StudySessionSpecifications.hasMaxSuccessRate(null).toPredicate(root, query, cb));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasUserId_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).equal(any(), any());

        StudySessionSpecifications.hasUserId(UUID.randomUUID()).toPredicate(root, query, cb);
        verify(cb).equal(any(), any(UUID.class));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasGrandeArea_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).lower(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).equal(any(), any());

        StudySessionSpecifications.hasGrandeArea("Area").toPredicate(root, query, cb);
        verify(cb).equal(any(), eq("area"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasTema_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).lower(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).like(any(jakarta.persistence.criteria.Expression.class), anyString());

        StudySessionSpecifications.hasTema("Tema").toPredicate(root, query, cb);
        verify(cb).like(any(), eq("%tema%"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasInstituicao_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).lower(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).like(any(jakarta.persistence.criteria.Expression.class), anyString());

        StudySessionSpecifications.hasInstituicao("Inst").toPredicate(root, query, cb);
        verify(cb).like(any(), eq("%inst%"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasRevisaoConcluida_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).equal(any(), any());

        StudySessionSpecifications.hasRevisaoConcluida(true).toPredicate(root, query, cb);
        verify(cb).equal(any(), eq(true));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasMinSuccessRate_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).prod(any(jakarta.persistence.criteria.Expression.class), any(Number.class));
        doReturn(exp).when(cb).quot(any(jakarta.persistence.criteria.Expression.class), any(jakarta.persistence.criteria.Expression.class));
        doReturn(exp).when(exp).as(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).greaterThanOrEqualTo(any(), any(Double.class));

        StudySessionSpecifications.hasMinSuccessRate(50.0).toPredicate(root, query, cb);
        verify(cb).greaterThanOrEqualTo(any(), eq(50.0));
    }

    @Test
    @SuppressWarnings("unchecked")
    void specifications_hasMaxSuccessRate_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).prod(any(jakarta.persistence.criteria.Expression.class), any(Number.class));
        doReturn(exp).when(cb).quot(any(jakarta.persistence.criteria.Expression.class), any(jakarta.persistence.criteria.Expression.class));
        doReturn(exp).when(exp).as(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).lessThanOrEqualTo(any(), any(Double.class));

        StudySessionSpecifications.hasMaxSuccessRate(90.0).toPredicate(root, query, cb);
        verify(cb).lessThanOrEqualTo(any(), eq(90.0));
    }
}
