package com.medstudy.backend.modules.sessao.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.sessao.dto.StudySessionRequest;
import com.medstudy.backend.modules.sessao.dto.StudySessionResponse;
import com.medstudy.backend.modules.sessao.service.StudySessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudySessionController.class)
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc(addFilters = true)
class StudySessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @MockitoBean
    private StudySessionService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private com.medstudy.backend.core.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @org.junit.jupiter.api.BeforeEach
    void setUp() throws jakarta.servlet.ServletException, java.io.IOException {
        doAnswer(invocation -> {
            jakarta.servlet.http.HttpServletRequest request = invocation.getArgument(0);
            jakarta.servlet.http.HttpServletResponse response = invocation.getArgument(1);
            jakarta.servlet.FilterChain filterChain = invocation.getArgument(2);
            filterChain.doFilter(request, response);
            return null;
        }).when(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }


    @Test
    @WithMockUser
    void create_ShouldReturn201_WhenRequestIsValid() throws Exception {
        StudySessionRequest request = new StudySessionRequest("CLINICA_MEDICA", "Pneumo", LocalDate.now(), 10, 8, "SUS", "Obs", null, false);
        StudySessionResponse response = new StudySessionResponse(UUID.randomUUID(), "CLINICA_MEDICA", "Pneumo", LocalDate.now(), 10, 8, "SUS", "Obs", null, false);

        when(service.createSession(any(StudySessionRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/study-sessions")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.grandeArea").value("CLINICA_MEDICA"))
                .andExpect(jsonPath("$.tema").value("Pneumo"));
    }

    @Test
    @WithMockUser
    void getById_ShouldReturn200_WhenExists() throws Exception {
        UUID id = UUID.randomUUID();
        StudySessionResponse response = new StudySessionResponse(id, "CIRURGIA", "Trauma", LocalDate.now(), 5, 4, "HOSPITAL", "", null, false);

        when(service.getById(id)).thenReturn(response);


        mockMvc.perform(get("/api/study-sessions/{id}", id)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    @WithMockUser
    void delete_ShouldReturn204() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/study-sessions/{id}", id)
                .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
