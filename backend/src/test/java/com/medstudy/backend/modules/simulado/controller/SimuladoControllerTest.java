package com.medstudy.backend.modules.simulado.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.simulado.dto.SimuladoRequest;
import com.medstudy.backend.modules.simulado.dto.SimuladoResponse;
import com.medstudy.backend.modules.simulado.service.SimuladoService;
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

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SimuladoController.class)
class SimuladoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @MockitoBean
    private SimuladoService service;

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
    void create_ShouldReturn201_WhenValid() throws Exception {
        SimuladoRequest request = new SimuladoRequest("Simulado 2024", LocalDate.now(), "USP", 2024, 20, 15, 5, 20, 12, 8, 20, 18, 2, 20, 14, 6, 20, 16, 4);
        SimuladoResponse response = new SimuladoResponse(UUID.randomUUID(), "Simulado 2024", LocalDate.now(), "USP", 2024, 20, 15, 5, 20, 12, 8, 20, 18, 2, 20, 14, 6, 20, 16, 4);

        when(service.create(any(SimuladoRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/simulados")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Simulado 2024"));
    }

    @Test
    @WithMockUser
    void getLatestByInstituicao_ShouldReturn200_WhenExists() throws Exception {
        String inst = "USP";
        SimuladoResponse response = new SimuladoResponse(UUID.randomUUID(), "Simulado USP", LocalDate.now(), inst, 2023, 100, 80, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

        when(service.findLatestByInstituicao(inst)).thenReturn(response);


        mockMvc.perform(get("/api/simulados/template")
                .param("instituicao", inst)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.instituicao").value(inst));
    }

    @Test
    @WithMockUser
    void delete_ShouldReturn204() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(service).delete(id);

        mockMvc.perform(delete("/api/simulados/{id}", id)
                .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void getById_ShouldReturn404_WhenNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(service.getById(id)).thenThrow(new jakarta.persistence.EntityNotFoundException("Simulado not found"));

        mockMvc.perform(get("/api/simulados/{id}", id)
                .with(csrf()))
                .andExpect(status().isNotFound());
    }
}
