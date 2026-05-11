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
    void specifications_WithValidValues_ShouldCallCriteriaBuilder() {
        Root<StudySession> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder cb = mock(CriteriaBuilder.class);
        Path path = mock(Path.class);
        jakarta.persistence.criteria.Expression exp = mock(jakarta.persistence.criteria.Expression.class);

        when(root.get(anyString())).thenReturn(path);
        when(path.get(anyString())).thenReturn(path);
        doReturn(exp).when(cb).lower(any());
        doReturn(exp).when(cb).prod(any(jakarta.persistence.criteria.Expression.class), any(Number.class));
        doReturn(exp).when(cb).quot(any(jakarta.persistence.criteria.Expression.class), any(jakarta.persistence.criteria.Expression.class));
        doReturn(exp).when(exp).as(any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).equal(any(), any());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).like(any(jakarta.persistence.criteria.Expression.class), anyString());
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).greaterThanOrEqualTo(any(), any(Double.class));
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).lessThanOrEqualTo(any(), any(Double.class));
        doReturn(mock(jakarta.persistence.criteria.Predicate.class)).when(cb).and(any(), any());

        // Test hasUserId
        StudySessionSpecifications.hasUserId(UUID.randomUUID()).toPredicate(root, query, cb);
        verify(cb).equal(any(), any(UUID.class));

        // Test hasGrandeArea
        StudySessionSpecifications.hasGrandeArea("Area").toPredicate(root, query, cb);
        verify(cb).equal(any(), eq("Area"));

        // Test hasTema
        StudySessionSpecifications.hasTema("Tema").toPredicate(root, query, cb);
        verify(cb).like(any(), anyString());

        // Test hasInstituicao
        StudySessionSpecifications.hasInstituicao("Inst").toPredicate(root, query, cb);
        verify(cb, times(2)).like(any(), anyString());

        // Test hasRevisaoConcluida
        StudySessionSpecifications.hasRevisaoConcluida(true).toPredicate(root, query, cb);
        verify(cb).equal(any(), eq(true));

        // Test hasMinSuccessRate
        StudySessionSpecifications.hasMinSuccessRate(50.0).toPredicate(root, query, cb);
        verify(cb).greaterThanOrEqualTo(any(), eq(50.0));

        // Test hasMaxSuccessRate
        StudySessionSpecifications.hasMaxSuccessRate(90.0).toPredicate(root, query, cb);
        verify(cb).lessThanOrEqualTo(any(), eq(90.0));
    }
}
