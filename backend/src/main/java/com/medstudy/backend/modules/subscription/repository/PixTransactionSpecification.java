package com.medstudy.backend.modules.subscription.repository;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class PixTransactionSpecification {

    public static Specification<PixTransaction> withFilters(
            String search,
            List<PixStatus> statuses) {
        
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("user").get("name")), searchPattern),
                        cb.like(cb.lower(root.get("user").get("email")), searchPattern),
                        cb.like(cb.lower(root.get("txid")), searchPattern)
                ));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
