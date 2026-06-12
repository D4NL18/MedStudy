package com.medstudy.backend.modules.auth.service;

import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.auth.dto.AuthResponse;
import com.medstudy.backend.modules.auth.dto.LoginRequest;
import com.medstudy.backend.modules.auth.entity.RefreshToken;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import com.medstudy.backend.util.TestDataFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private RefreshTokenService refreshTokenService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LoginAttemptService loginAttemptService;
    @Mock
    private EmailService emailService;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = TestDataFactory.createUser();
    }

    @Test
    void authenticate_ShouldReturnAuthResponse_WhenValidCredentials() {
        LoginRequest request = new LoginRequest(user.getEmail(), "password123");
        Authentication authentication = mock(Authentication.class);
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-token");

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");
        when(refreshTokenService.createRefreshToken(user.getId())).thenReturn(refreshToken);

        AuthResponse response = authService.authenticate(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        verify(loginAttemptService).loginSucceeded(user.getEmail());
    }

    @Test
    void authenticate_ShouldCallLoginFailed_WhenAuthenticationFails() {
        LoginRequest request = new LoginRequest(user.getEmail(), "wrong-password");
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException("Bad credentials"));

        assertThrows(RuntimeException.class, () -> authService.authenticate(request));
        verify(loginAttemptService).loginFailed(user.getEmail());
    }

    @Test
    void forgotPassword_ShouldSendEmail_WhenUserExists() {
        String email = user.getEmail();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(anyMap(), eq(user))).thenReturn("reset-token");

        authService.forgotPassword(email);

        verify(emailService).sendEmail(eq(email), anyString(), contains("reset-token"));
    }

    @Test
    void resetPassword_ShouldUpdatePassword_WhenTokenIsValid() {
        String token = "valid-token";
        String newPassword = "new-password";
        when(jwtService.extractUsername(token)).thenReturn(user.getEmail());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid(token, user)).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("encoded-password");

        authService.resetPassword(token, newPassword);

        assertEquals("encoded-password", user.getPassword());
        verify(userRepository).save(user);
    }
}
