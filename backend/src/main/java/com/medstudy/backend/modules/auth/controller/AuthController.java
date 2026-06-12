package com.medstudy.backend.modules.auth.controller;

import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.core.util.CookieUtil;
import com.medstudy.backend.modules.auth.dto.AuthResponse;
import com.medstudy.backend.modules.auth.dto.ForgotPasswordRequest;
import com.medstudy.backend.modules.auth.dto.LoginRequest;
import com.medstudy.backend.modules.auth.dto.RegisterRequest;
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

/**
 * REST controller for authentication operations.
 * <p>
 * Handles user registration, login, token refresh, logout, and password reset flows.
 * JWT access and refresh tokens are delivered as secure, HTTP-only cookies.
 * </p>
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user login, logout, and token management")
public class AuthController {

    private final AuthService authService;
    private final CookieUtil cookieUtil;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    /**
     * Constructs the AuthController with required dependencies.
     *
     * @param authService         service handling authentication logic
     * @param cookieUtil          utility for creating and deleting JWT cookies
     * @param jwtService          service for JWT generation and validation
     * @param refreshTokenService service managing refresh token lifecycle
     */
    public AuthController(AuthService authService, CookieUtil cookieUtil, JwtService jwtService, RefreshTokenService refreshTokenService) {
        this.authService = authService;
        this.cookieUtil = cookieUtil;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    /**
     * Authenticates a user and sets JWT tokens as secure cookies.
     *
     * @param request  the login credentials
     * @param response the HTTP response used to attach auth cookies
     * @return the authentication response containing token metadata
     */
    @Operation(summary = "Authenticate user", description = "Verifies credentials and returns JWT tokens in secure cookies")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Registers a new user and sets JWT tokens as secure cookies.
     *
     * @param request  the registration details
     * @param response the HTTP response used to attach auth cookies
     * @return the authentication response with HTTP 201 status
     */
    @Operation(summary = "Register user", description = "Creates a new user account and returns JWT tokens")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.status(201).body(authResponse);
    }

    /**
     * Refreshes the JWT access token using a valid refresh token.
     *
     * @param request  the refresh token request
     * @param response the HTTP response used to attach updated auth cookies
     * @return the new authentication response
     */
    @Operation(summary = "Refresh JWT token", description = "Uses a valid refresh token to issue a new access token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody TokenRefreshRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.refreshToken(request);
        setAuthCookies(response, authResponse);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * Logs out the user by invalidating the refresh token and clearing cookies.
     *
     * @param request  the request containing the refresh token to invalidate
     * @param response the HTTP response used to clear auth cookies
     * @return HTTP 204 No Content
     */
    @Operation(summary = "Logout user", description = "Invalidates the refresh token and clears authentication cookies")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody TokenRefreshRequest request, HttpServletResponse response) {
        authService.logout(request.getRefreshToken());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieUtil.deleteAccessTokenCookie().toString());
        response.addHeader(HttpHeaders.SET_COOKIE, cookieUtil.deleteRefreshTokenCookie().toString());
        return ResponseEntity.noContent().build();
    }

    /**
     * Sets the JWT access token and refresh token as secure HTTP-only cookies in the response.
     *
     * @param response     the HTTP servlet response to attach cookies to
     * @param authResponse the authentication response containing the token strings
     */
    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        ResponseCookie accessTokenCookie = cookieUtil.createAccessTokenCookie(
                authResponse.getAccessToken(),
                Duration.ofMillis(jwtService.getExpirationTime())
        );
        ResponseCookie refreshTokenCookie = cookieUtil.createRefreshTokenCookie(
                authResponse.getRefreshToken(),
                Duration.ofMillis(refreshTokenService.getRefreshTokenDurationMs())
        );
        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    /**
     * Initiates the password reset flow by sending a reset email.
     *
     * @param request the request containing the user's email address
     * @return HTTP 200 OK
     */
    @Operation(summary = "Forgot password", description = "Sends a password reset email to the specified address")
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok().build();
    }

    /**
     * Resets the user's password using a valid reset token.
     *
     * @param request the request containing the reset token and the new password
     * @return HTTP 200 OK
     */
    @Operation(summary = "Reset password", description = "Resets the user password using a valid reset token")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }
}
