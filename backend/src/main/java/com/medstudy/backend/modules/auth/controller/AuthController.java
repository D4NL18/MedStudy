package com.medstudy.backend.modules.auth.controller;

import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.core.util.CookieUtil;
import com.medstudy.backend.modules.auth.dto.AuthResponse;
import com.medstudy.backend.modules.auth.dto.ForgotPasswordRequest;
import com.medstudy.backend.modules.auth.dto.LoginRequest;
import com.medstudy.backend.modules.auth.dto.ResetPasswordRequest;
import com.medstudy.backend.modules.auth.dto.TokenRefreshRequest;
import com.medstudy.backend.modules.auth.service.AuthService;
import com.medstudy.backend.modules.auth.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user login, logout, and token management")
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthService authService, CookieUtil cookieUtil, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.cookieUtil = cookieUtil;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Operation(summary = "Authenticate user", description = "Verifies credentials and returns JWT tokens in secure cookies")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Refresh JWT token", description = "Uses a valid refresh token to issue a new access token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody TokenRefreshRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.refreshToken(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody TokenRefreshRequest request, HttpServletResponse response) {
        authService.logout(request.refreshToken());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieUtil.deleteAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieUtil.deleteRefreshTokenCookie().toString());
        return ResponseEntity.noContent().build();
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        ResponseCookie accessTokenCookie = cookieUtil.createAccessTokenCookie(
                authResponse.accessToken(),
                Duration.ofMillis(jwtService.getExpirationTime())
        );
        ResponseCookie refreshTokenCookie = cookieUtil.createRefreshTokenCookie(
                authResponse.refreshToken(),
                Duration.ofMillis(refreshTokenService.getRefreshTokenDurationMs())
        );
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok().build();
    }
}
