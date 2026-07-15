package com.medstudy.backend.modules.subscription.repository;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SubscriptionSpecification {

    public static Specification<Subscription> withFilters(
            String search,
            List<SubscriptionStatus> statuses,
            List<Boolean> isOrigins) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.join("user").get("email")), searchPattern);
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.join("user").get("name")), searchPattern);
                predicates.add(criteriaBuilder.or(emailPredicate, namePredicate));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (isOrigins != null && !isOrigins.isEmpty()) {
                predicates.add(root.get("isAdminOverride").in(isOrigins));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
