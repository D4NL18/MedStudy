package com.medstudy.backend.modules.profile.repository;

import com.medstudy.backend.modules.profile.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Profile entities.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    /**
     * Finds a profile by its associated user ID.
     *
     * @param userId the user ID
     * @return an Optional containing the profile, or empty if not found
     */
    Optional<Profile> findByUserId(UUID userId);

    /**
     * Finds a profile by its handle.
     *
     * @param handle the profile handle
     * @return an Optional containing the profile, or empty if not found
     */
    Optional<Profile> findByHandle(String handle);

    /**
     * Checks if a profile with the given handle exists.
     *
     * @param handle the profile handle
     * @return true if the handle exists, false otherwise
     */
    boolean existsByHandle(String handle);

    /**
     * Checks if a handle is used by any profile other than the specified user ID.
     *
     * @param handle the handle to check
     * @param userId the user ID to exclude
     * @return true if another user is using the handle, false otherwise
     */
    boolean existsByHandleAndUserIdNot(String handle, UUID userId);

    /**
     * Searches for profiles matching a query string in name, handle, or college.
     * Excludes the specified user ID from the results.
     *
     * @param query the search query
     * @param excludeUserId the user ID to exclude from results
     * @return a list of matching profiles
     */
    @Query("SELECT p FROM Profile p WHERE p.user.id <> :excludeUserId AND (" +
           "LOWER(p.nomeCompleto) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.handle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.faculdade) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Profile> searchProfiles(@Param("query") String query, @Param("excludeUserId") UUID excludeUserId);
}
