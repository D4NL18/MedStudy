package com.medstudy.backend.modules.profile.repository;

import com.medstudy.backend.modules.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByUserId(UUID userId);
    Optional<Profile> findByHandle(String handle);
    boolean existsByHandle(String handle);
    boolean existsByHandleAndUserIdNot(String handle, UUID userId);
}
