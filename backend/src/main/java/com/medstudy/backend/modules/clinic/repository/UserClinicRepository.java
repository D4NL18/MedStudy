package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.UserClinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserClinicRepository extends JpaRepository<UserClinic, UUID> {
    Optional<UserClinic> findByUserId(UUID userId);
}
