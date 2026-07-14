package com.medstudy.backend.modules.subscription.repository;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Subscriptions.
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    Optional<Subscription> findByUserId(UUID userId);

    @Query("SELECT s FROM Subscription s WHERE (s.status = 'TRIAL' AND s.trialEndDate < :now) OR (s.status = 'ACTIVE' AND s.currentPeriodEnd < :now)")
    List<Subscription> findExpiredSubscriptions(@Param("now") Instant now);

    long countByStatus(SubscriptionStatus status);

    @Query("SELECT s FROM Subscription s JOIN s.user u WHERE " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Subscription> findWithFilters(
        @Param("search") String search,
        @Param("status") SubscriptionStatus status,
        Pageable pageable
    );
}

