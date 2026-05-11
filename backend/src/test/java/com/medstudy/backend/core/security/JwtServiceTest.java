package com.medstudy.backend.core.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"; // 256-bit secret

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secret);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3600000L); // 1 hour
    }

    @Test
    void generateToken_ShouldReturnValidToken() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertEquals("testuser", jwtService.extractUsername(token));
    }

    @Test
    void isTokenValid_ShouldReturnTrue_WhenTokenIsValid() {
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        String token = jwtService.generateToken(userDetails);

        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_ShouldReturnFalse_WhenUsernameDiffers() {
        UserDetails user1 = new User("user1", "pass", Collections.emptyList());
        UserDetails user2 = new User("user2", "pass", Collections.emptyList());
        String token = jwtService.generateToken(user1);

        assertFalse(jwtService.isTokenValid(token, user2));
    }
}
