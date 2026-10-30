package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.UserXpTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserXpTransactionRepository extends JpaRepository<UserXpTransaction, UUID> {
    List<UserXpTransaction> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
