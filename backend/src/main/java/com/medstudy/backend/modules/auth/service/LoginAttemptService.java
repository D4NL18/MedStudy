package com.medstudy.backend.modules.auth.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPT = 5;
    private final long BASE_DELAY_MS = 1000; // 1 second
    private final long MAX_DELAY_MS = 5000;  // 5 seconds

    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attemptsCache.put(key, attempts + 1);
        applyProgressiveDelay(key);
    }

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
