package com.medstudy.backend.modules.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.auth.dto.AuthResponse;
import com.medstudy.backend.modules.auth.dto.LoginRequest;
import com.medstudy.backend.modules.auth.dto.TokenRefreshRequest;
import com.medstudy.backend.modules.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());


    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private com.medstudy.backend.core.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private com.medstudy.backend.core.util.CookieUtil cookieUtil;

    @MockitoBean
    private com.medstudy.backend.modules.auth.service.RefreshTokenService refreshTokenService;

    @org.junit.jupiter.api.BeforeEach
    void setUp() throws jakarta.servlet.ServletException, java.io.IOException {
        doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest request = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse response = invocation.getArgument(1);
            jakarta.servlet.FilterChain filterChain = invocation.getArgument(2);
            filterChain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        // CookieUtil mocks
        org.springframework.http.ResponseCookie dummyCookie = org.springframework.http.ResponseCookie.from("dummy", "value").build();
        when(cookieUtil.createAccessTokenCookie(anyString(), any())).thenReturn(dummyCookie);
        when(cookieUtil.createRefreshTokenCookie(anyString(), any())).thenReturn(dummyCookie);
        when(cookieUtil.deleteAccessTokenCookie()).thenReturn(dummyCookie);
        when(cookieUtil.deleteRefreshTokenCookie()).thenReturn(dummyCookie);

        // Service constants mocks
        when(jwtService.getExpirationTime()).thenReturn(3600000L);
        when(refreshTokenService.getRefreshTokenDurationMs()).thenReturn(86400000L);
    }


    @Test
    @WithMockUser
    void login_ShouldReturn200_WhenCredentialsAreValid() throws Exception {
        LoginRequest request = new LoginRequest("test@medstudy.com", "password123");
        AuthResponse response = new AuthResponse("jwt-token", "refresh-token");

        when(authService.authenticate(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"));
    }

    @Test
    @WithMockUser
    void login_ShouldReturn400_WhenEmailIsInvalid() throws Exception {
        LoginRequest request = new LoginRequest("invalid-email", "password123");

        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void refresh_ShouldReturn200_WhenTokenIsValid() throws Exception {
        TokenRefreshRequest request = new TokenRefreshRequest("valid-refresh-token");
        AuthResponse response = new AuthResponse("new-jwt-token", "new-refresh-token");

        when(authService.refreshToken(any(TokenRefreshRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/refresh")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-jwt-token"));
    }
}
