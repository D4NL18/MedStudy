package com.medstudy.backend.modules.subscription.repository;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for PIX Transactions.
 */
@Repository
public interface PixTransactionRepository extends JpaRepository<PixTransaction, UUID> {

    Optional<PixTransaction> findByTxid(String txid);

    Optional<PixTransaction> findByE2eId(String e2eId);

    List<PixTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM PixTransaction p WHERE p.status = com.medstudy.backend.modules.subscription.domain.PixStatus.PAID")
    BigDecimal sumTotalPaidRevenue();

    @Query("SELECT p FROM PixTransaction p WHERE (:status IS NULL OR p.status = :status) ORDER BY p.createdAt DESC")
    Page<PixTransaction> findWithFilters(@Param("status") PixStatus status, Pageable pageable);
}

