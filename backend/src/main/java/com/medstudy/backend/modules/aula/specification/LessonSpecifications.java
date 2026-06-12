package com.medstudy.backend.modules.aula.specification;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

/**
 * Specifications for querying Lesson entities.
 */
public class LessonSpecifications {

    /**
     * Specification to filter by user ID.
     *
     * @param userId the user ID to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasUserId(UUID userId) {
        return (root, query, cb) -> {
            if (userId == null) return null;
            return cb.equal(root.get("user").get("id"), userId);
        };
    }

    /**
     * Specification to filter by major area.
     *
     * @param grandeArea the major area to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasGrandeArea(String grandeArea) {
        return (root, query, cb) -> {
            if (grandeArea == null || grandeArea.isBlank()) {
                return null;
            }
            return cb.equal(root.get("grandeArea"), grandeArea);
        };
    }

    /**
     * Specification to filter by lesson priority.
     *
     * @param prioridade the priority to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasPrioridade(LessonPriority prioridade) {
        return (root, query, cb) -> {
            if (prioridade == null) {
                return null;
            }
            return cb.equal(root.get("prioridade"), prioridade);
        };
    }

    /**
     * Specification to filter by watched status.
     *
     * @param aulaAssistida the watched status to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasAulaAssistida(Boolean aulaAssistida) {
        return (root, query, cb) -> {
            if (aulaAssistida == null) {
                return null;
            }
            return cb.equal(root.get("aulaAssistida"), aulaAssistida);
        };
    }

    /**
     * Specification to filter by theme using a partial match.
     *
     * @param tema the theme to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasTema(String tema) {
        return (root, query, cb) -> {
            if (tema == null || tema.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("tema")), "%" + tema.toLowerCase() + "%");
        };
    }

    /**
     * Specification to filter by reinforcement status.
     *
     * @param reforco the reinforcement status to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasReforco(Boolean reforco) {
        return (root, query, cb) -> {
            if (reforco == null) {
                return null;
            }
            return cb.equal(root.get("reforco"), reforco);
        };
    }

    /**
     * Specification to filter by review status.
     *
     * @param revisao the review status to filter by
     * @return the specification
     */
    public static Specification<Lesson> hasRevisao(Boolean revisao) {
        return (root, query, cb) -> {
            if (revisao == null) {
                return null;
            }
            return cb.equal(root.get("revisao"), revisao);
        };
    }
}
