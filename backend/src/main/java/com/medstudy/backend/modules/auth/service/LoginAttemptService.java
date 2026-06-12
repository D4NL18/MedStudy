package com.medstudy.backend.modules.auth.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Service that tracks login attempts and applies progressive delays to prevent brute-force attacks.
 */
@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPT = 5;
    private final long BASE_DELAY_MS = 1000; // 1 second
    private final long MAX_DELAY_MS = 5000;  // 5 seconds

    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();

    /**
     * Clears the failed login attempts for a given key upon successful login.
     *
     * @param key the identifier (e.g., email) used for login
     */
    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    /**
     * Records a failed login attempt for a given key and applies a progressive delay.
     *
     * @param key the identifier (e.g., email) used for login
     */
    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attemptsCache.put(key, attempts + 1);
        applyProgressiveDelay(key);
    }

    /**
     * Applies a progressive delay based on the number of failed attempts.
     *
     * @param key the identifier for which to apply the delay
     */
    public void applyProgressiveDelay(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        if (attempts > 0) {
            long delay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * attempts);
            try {
                Thread.sleep(delay);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
