package com.medstudy.backend.modules.user.repository;

import com.medstudy.backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Finds a User by their email address.
     *
     * @param email the email address to search for
     * @return an Optional containing the user if found, or empty otherwise
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Checks if a User exists with the given email address.
     *
     * @param email the email address to check
     * @return true if the user exists, false otherwise
     */
    boolean existsByEmail(String email);
}
