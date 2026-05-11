package com.medstudy.backend.modules.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.ConcurrentHashMap;

import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptServiceTest {

    private LoginAttemptService loginAttemptService;

    @BeforeEach
    void setUp() {
        loginAttemptService = new LoginAttemptService();
    }

    @Test
    void loginFailed_ShouldIncrementAttempts() {
        String key = "user@test.com";
        loginAttemptService.loginFailed(key);
        
        ConcurrentHashMap<String, Integer> cache = (ConcurrentHashMap<String, Integer>) ReflectionTestUtils.getField(loginAttemptService, "attemptsCache");
        assertEquals(1, cache.get(key));
    }

    @Test
    void loginSucceeded_ShouldClearAttempts() {
        String key = "user@test.com";
        loginAttemptService.loginFailed(key);
        loginAttemptService.loginSucceeded(key);
        
        ConcurrentHashMap<String, Integer> cache = (ConcurrentHashMap<String, Integer>) ReflectionTestUtils.getField(loginAttemptService, "attemptsCache");
        assertNull(cache.get(key));
    }

    @Test
    void applyProgressiveDelay_ShouldNotSleep_WhenNoAttempts() {
        long start = System.currentTimeMillis();
        loginAttemptService.applyProgressiveDelay("new-user");
        long end = System.currentTimeMillis();
        
        assertTrue(end - start < 100); // Should be very fast
    }
}
