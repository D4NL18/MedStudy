package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.UserXpAccount;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserXpAccountRepository extends JpaRepository<UserXpAccount, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM UserXpAccount a WHERE a.userId = :userId")
    Optional<UserXpAccount> findByIdForUpdate(@Param("userId") UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM UserXpAccount a WHERE a.userId = :userId")
    Optional<UserXpAccount> findByUserIdForUpdate(@Param("userId") UUID userId);
}
