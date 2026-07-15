package com.medstudy.backend.modules.auth.service;

import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.auth.dto.AuthResponse;
import com.medstudy.backend.modules.auth.dto.LoginRequest;
import com.medstudy.backend.modules.auth.dto.RegisterRequest;
import com.medstudy.backend.modules.auth.dto.TokenRefreshRequest;
import com.medstudy.backend.modules.auth.entity.RefreshToken;
import com.medstudy.backend.modules.user.entity.User;
import com.medstudy.backend.modules.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.entity.Subscription;
import com.medstudy.backend.modules.subscription.repository.SubscriptionRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

/**
 * Service handling authentication operations such as login, registration, and token management.
 */
@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;
    private final EmailService emailService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final SubscriptionRepository subscriptionRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UserRepository userRepository,
            LoginAttemptService loginAttemptService,
            EmailService emailService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder,
            SubscriptionRepository subscriptionRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Authenticates a user and generates JWT tokens.
     *
     * @param request the login request containing credentials
     * @return an {@link AuthResponse} containing the access and refresh tokens
     */
    @Transactional
    public AuthResponse authenticate(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);

            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

            loginAttemptService.loginSucceeded(request.getEmail());

            return new AuthResponse(jwtToken, refreshToken.getToken());
        } catch (Exception e) {
            loginAttemptService.loginFailed(request.getEmail());
            throw e;
        }
    }

    /**
     * Registers a new user and generates initial JWT tokens.
     *
     * @param request the registration request containing user details
     * @return an {@link AuthResponse} containing the access and refresh tokens
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está em uso. Tente fazer login ou recupere sua senha.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStatus(SubscriptionStatus.TRIAL);
        Instant now = Instant.now();
        subscription.setTrialStartDate(now);
        subscription.setTrialEndDate(now.plus(30, ChronoUnit.DAYS));
        subscriptionRepository.save(subscription);

        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(jwtToken, refreshToken.getToken());
    }

    /**
     * Refreshes an access token using a valid refresh token.
     *
     * @param request the token refresh request
     * @return a new {@link AuthResponse} containing the rotated tokens
     */
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    refreshTokenService.deleteByToken(request.getRefreshToken());
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    return new AuthResponse(token, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    /**
     * Logs out a user by deleting their refresh token.
     *
     * @param refreshToken the refresh token string to delete
     */
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.deleteByToken(refreshToken);
    }

    /**
     * Initiates the password recovery process by sending an email with a reset link.
     *
     * @param email the user's email address
     */
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "reset");
        String resetToken = jwtService.generateToken(claims, user);

        String resetUrl = "http://localhost:4200/reset-password?token=" + resetToken;
        emailService.sendEmail(
                user.getEmail(),
                "Recuperação de Senha - MedStudy",
                "Olá " + user.getName() + ",\n\nPara resetar sua senha, clique no link abaixo:\n" + resetUrl
        );
    }

    /**
     * Resets the user's password using a valid reset token.
     *
     * @param token the password reset token
     * @param newPassword the new password
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        String email = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        if (!jwtService.isTokenValid(token, user)) {
            throw new RuntimeException("Token inválido ou expirado");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
