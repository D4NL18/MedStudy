package com.medstudy.backend.modules.profile.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.profile.dto.ProfileCheckResponseDTO;
import com.medstudy.backend.modules.profile.dto.ProfileDTO;
import com.medstudy.backend.modules.profile.service.ProfileService;
import com.medstudy.backend.modules.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfileController.class)
class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private ProfileService profileService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private com.medstudy.backend.core.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    private User user;
    private ProfileDTO profileDTO;

    @BeforeEach
    void setUp() throws jakarta.servlet.ServletException, java.io.IOException {
        doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest request = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse response = invocation.getArgument(1);
            jakarta.servlet.FilterChain filterChain = invocation.getArgument(2);
            filterChain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());

        user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("medico@medstudy.com");

        profileDTO = new ProfileDTO();
        profileDTO.setId(UUID.randomUUID());
        profileDTO.setUserId(user.getId());
        profileDTO.setHandle("pediatra_feliz");
        profileDTO.setNomeCompleto("Dr. Pedro");
        profileDTO.setIsFormado(false);
        profileDTO.setSemestre(5);
        profileDTO.setFaculdade("USP");
        profileDTO.setAvatarPresetId("pediatria");

        // Setup mock authentication principal
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);
        
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser
    void getMyProfile_ShouldReturn200_WhenExists() throws Exception {
        when(profileService.getProfileByUserId(user.getId())).thenReturn(Optional.of(profileDTO));

        mockMvc.perform(get("/api/profiles/me")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.handle").value("pediatra_feliz"))
                .andExpect(jsonPath("$.nomeCompleto").value("Dr. Pedro"));
    }

    @Test
    @WithMockUser
    void getMyProfile_ShouldReturn404_WhenNotExists() throws Exception {
        when(profileService.getProfileByUserId(user.getId())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/profiles/me")
                .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void saveProfile_ShouldReturn200_WhenValid() throws Exception {
        when(profileService.createOrUpdateProfile(any(ProfileDTO.class), any(User.class))).thenReturn(profileDTO);

        mockMvc.perform(post("/api/profiles")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.handle").value("pediatra_feliz"));
    }

    @Test
    @WithMockUser
    void checkHandle_ShouldReturnAvailability() throws Exception {
        when(profileService.isHandleAvailable(eq("pediatra_feliz"), any(UUID.class))).thenReturn(true);

        mockMvc.perform(get("/api/profiles/check-handle")
                .param("handle", "pediatra_feliz")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.handle").value("pediatra_feliz"))
                .andExpect(jsonPath("$.disponivel").value(true));
    }
}
