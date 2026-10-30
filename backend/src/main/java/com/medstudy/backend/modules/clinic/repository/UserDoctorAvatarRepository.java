package com.medstudy.backend.modules.clinic.repository;

import com.medstudy.backend.modules.clinic.entity.UserDoctorAvatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserDoctorAvatarRepository extends JpaRepository<UserDoctorAvatar, UUID> {
    Optional<UserDoctorAvatar> findByUserId(UUID userId);
}
