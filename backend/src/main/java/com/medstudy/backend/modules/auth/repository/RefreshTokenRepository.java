package com.medstudy.backend.modules.auth.repository;

import com.medstudy.backend.modules.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing {@link RefreshToken} entities.
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    
    /**
     * Finds a refresh token by its token string.
     *
     * @param token the token string
     * @return an {@link Optional} containing the refresh token if found, or empty otherwise
     */
    Optional<RefreshToken> findByToken(String token);
}
