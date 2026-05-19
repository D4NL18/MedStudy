package com.medstudy.backend.modules.profile.repository;

import com.medstudy.backend.modules.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Optional<Profile> findByUserId(UUID userId);
    Optional<Profile> findByHandle(String handle);
    boolean existsByHandle(String handle);
    boolean existsByHandleAndUserIdNot(String handle, UUID userId);

    @Query("SELECT p FROM Profile p WHERE p.user.id <> :excludeUserId AND (" +
           "LOWER(p.nomeCompleto) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.handle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.faculdade) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Profile> searchProfiles(@Param("query") String query, @Param("excludeUserId") UUID excludeUserId);
}
