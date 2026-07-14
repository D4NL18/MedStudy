package com.medstudy.backend.modules.subscription.repository;

import com.medstudy.backend.modules.subscription.entity.PixTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
