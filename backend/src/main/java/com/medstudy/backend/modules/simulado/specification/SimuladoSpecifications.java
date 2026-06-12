package com.medstudy.backend.modules.simulado.specification;

import com.medstudy.backend.modules.simulado.entity.Simulado;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

/** JPA Specifications for filtering {@link Simulado} entities by various criteria. */
public class SimuladoSpecifications {

    public static Specification<Simulado> hasUserId(UUID userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Simulado> hasNome(String nome) {
        return (root, query, cb) -> {
            if (nome == null || nome.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
        };
    }

    public static Specification<Simulado> hasInstituicao(String instituicao) {
        return (root, query, cb) -> {
            if (instituicao == null || instituicao.isBlank()) {
                return null;
            }
            return cb.equal(cb.lower(root.get("instituicao")), instituicao.toLowerCase());
        };
    }
}
