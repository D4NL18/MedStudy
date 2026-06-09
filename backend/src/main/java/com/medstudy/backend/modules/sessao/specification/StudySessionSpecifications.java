package com.medstudy.backend.modules.sessao.specification;

import com.medstudy.backend.modules.sessao.entity.StudySession;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class StudySessionSpecifications {

    public static Specification<StudySession> hasUserId(UUID userId) {
        return (root, query, cb) -> {
            if (userId == null) return null;
            return cb.equal(root.get("user").get("id"), userId);
        };
    }

    public static Specification<StudySession> hasGrandeArea(String grandeArea) {
        return (root, query, cb) -> {
            if (grandeArea == null || grandeArea.isBlank()) return null;
            return cb.equal(cb.lower(root.get("grandeArea")), grandeArea.toLowerCase());
        };
    }

    public static Specification<StudySession> hasTema(String tema) {
        return (root, query, cb) -> {
            if (tema == null || tema.isBlank()) return null;
            return cb.like(cb.lower(root.get("tema")), "%" + tema.toLowerCase() + "%");
        };
    }

    public static Specification<StudySession> hasInstituicao(String instituicao) {
        return (root, query, cb) -> {
            if (instituicao == null || instituicao.isBlank()) return null;
            return cb.like(cb.lower(root.get("instituicao")), "%" + instituicao.toLowerCase() + "%");
        };
    }

    public static Specification<StudySession> hasRevisaoConcluida(Boolean concluida) {
        return (root, query, cb) -> {
            if (concluida == null) return null;
            return cb.equal(root.get("revisaoConcluida"), concluida);
        };
    }

    public static Specification<StudySession> hasMinSuccessRate(Double min) {
        return (root, query, cb) -> {
            if (min == null) return null;
            // (qtsCorretas * 100.0) / qtsFeitas >= min
            return cb.and(
                    cb.greaterThan(root.get("qtsFeitas"), 0),
                    cb.greaterThanOrEqualTo(
                            cb.quot(cb.prod(root.get("qtsCorretas"), 100.0), root.get("qtsFeitas")).as(Double.class),
                            min
                    )
            );
        };
    }

    public static Specification<StudySession> hasMaxSuccessRate(Double max) {
        return (root, query, cb) -> {
            if (max == null) return null;
            // (qtsCorretas * 100.0) / qtsFeitas <= max
            return cb.and(
                    cb.greaterThan(root.get("qtsFeitas"), 0),
                    cb.lessThanOrEqualTo(
                            cb.quot(cb.prod(root.get("qtsCorretas"), 100.0), root.get("qtsFeitas")).as(Double.class),
                            max
                    )
            );
        };
    }

    public static Specification<StudySession> search(String term) {
        return (root, query, cb) -> {
            if (term == null || term.isBlank()) return null;
            String pattern = "%" + term.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("tema")), pattern),
                    cb.like(cb.lower(root.get("grandeArea")), pattern)
            );
        };
    }

    public static Specification<StudySession> hasTipoRevision(String tipo, java.time.LocalDate today) {
        return (root, query, cb) -> {
            if (tipo == null) return null;
            
            switch (tipo.toUpperCase()) {
                case "ATRASADAS":
                    return cb.and(cb.isFalse(root.get("revisaoConcluida")), cb.lessThan(root.get("dataProximaRevisao"), today));
                case "HOJE":
                    return cb.and(cb.isFalse(root.get("revisaoConcluida")), cb.equal(root.get("dataProximaRevisao"), today));
                case "FUTURAS":
                    return cb.and(cb.isFalse(root.get("revisaoConcluida")), cb.greaterThan(root.get("dataProximaRevisao"), today));
                case "CONCLUIDAS":
                    return cb.isTrue(root.get("revisaoConcluida"));
                default:
                    return cb.and(cb.isFalse(root.get("revisaoConcluida")), cb.equal(root.get("dataProximaRevisao"), today));
            }
        };
    }
}
