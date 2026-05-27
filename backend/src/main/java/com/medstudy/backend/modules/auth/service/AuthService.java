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

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;
    private final EmailService emailService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            UserRepository userRepository,
            LoginAttemptService loginAttemptService,
            EmailService emailService,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.userRepository = userRepository;
        this.loginAttemptService = loginAttemptService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse authenticate(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            User user = (User) authentication.getPrincipal();
            String jwtToken = jwtService.generateToken(user);

            // Rotate Refresh Token: Create new one
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

            loginAttemptService.loginSucceeded(request.email());

            return new AuthResponse(jwtToken, refreshToken.getToken());
        } catch (Exception e) {
            loginAttemptService.loginFailed(request.email());
            throw e;
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está em uso. Tente fazer login ou recupere sua senha.");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        // Auto-login after registration
        String jwtToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new AuthResponse(jwtToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        return refreshTokenService.findByToken(request.refreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    // Rotate: Delete old, create new
                    refreshTokenService.deleteByToken(request.refreshToken());
                    RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId());
                    return new AuthResponse(token, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenService.deleteByToken(refreshToken);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        // Generate a 15-min token for reset
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
