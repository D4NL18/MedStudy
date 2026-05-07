package com.medstudy.backend.modules.aula.specification;

import com.medstudy.backend.modules.aula.entity.Lesson;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class LessonSpecifications {

    public static Specification<Lesson> hasUserId(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Lesson> hasGrandeArea(String grandeArea) {
        return (root, query, cb) -> {
            if (grandeArea == null || grandeArea.isBlank()) {
                return null;
            }
            return cb.equal(root.get("grandeArea"), grandeArea);
        };
    }

    public static Specification<Lesson> hasPrioridade(LessonPriority prioridade) {
        return (root, query, cb) -> {
            if (prioridade == null) {
                return null;
            }
            return cb.equal(root.get("prioridade"), prioridade);
        };
    }

    public static Specification<Lesson> hasAulaAssistida(Boolean aulaAssistida) {
        return (root, query, cb) -> {
            if (aulaAssistida == null) {
                return null;
            }
            return cb.equal(root.get("aulaAssistida"), aulaAssistida);
        };
    }

    public static Specification<Lesson> hasTema(String tema) {
        return (root, query, cb) -> {
            if (tema == null || tema.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("tema")), "%" + tema.toLowerCase() + "%");
        };
    }
}
