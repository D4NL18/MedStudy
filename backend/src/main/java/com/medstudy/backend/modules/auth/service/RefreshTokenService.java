package com.medstudy.backend.modules.auth.service;

import com.medstudy.backend.modules.auth.entity.RefreshToken;
import com.medstudy.backend.modules.auth.repository.RefreshTokenRepository;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service responsible for managing refresh tokens.
 */
@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration:604800000}") // Default 7 days
    private long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves the configured duration of a refresh token in milliseconds.
     *
     * @return the duration in milliseconds
     */
    public long getRefreshTokenDurationMs() {
        return refreshTokenDurationMs;
    }

    /**
     * Finds a refresh token by its token string.
     *
     * @param token the token string
     * @return an {@link Optional} containing the refresh token if found
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Creates a new refresh token for the specified user.
     *
     * @param userId the ID of the user
     * @return the newly created {@link RefreshToken}
     */
    @Transactional
    public RefreshToken createRefreshToken(UUID userId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1000000));
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    /**
     * Verifies if a refresh token has expired.
     *
     * @param token the refresh token to verify
     * @return the token if it is still valid
     * @throws RuntimeException if the token is expired
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    /**
     * Deletes all refresh tokens associated with a given user ID.
     *
     * @param userId the ID of the user whose tokens should be deleted
     */
    @Transactional
    public void deleteByUserId(UUID userId) {
    }

    /**
     * Deletes a refresh token by its token string.
     *
     * @param token the token string to delete
     */
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
