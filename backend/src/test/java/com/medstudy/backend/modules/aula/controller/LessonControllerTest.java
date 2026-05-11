package com.medstudy.backend.modules.aula.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.aula.dto.LessonRequest;
import com.medstudy.backend.modules.aula.dto.LessonResponse;
import com.medstudy.backend.modules.aula.entity.LessonPriority;
import com.medstudy.backend.modules.aula.service.LessonService;
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
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LessonController.class)
class LessonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @MockitoBean
    private LessonService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;


    @Test
    @WithMockUser
    void create_ShouldReturn201_WhenValid() throws Exception {
        LessonRequest request = new LessonRequest("CIRURGIA", "Geral", "Trauma", LessonPriority.ALTA, false, LocalDate.now(), 0, false, false);
        LessonResponse response = new LessonResponse(UUID.randomUUID(), "CIRURGIA", "Geral", "Trauma", LessonPriority.ALTA, false, LocalDate.now(), 0, false, false);

        when(service.create(any(LessonRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/lessons")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tema").value("Trauma"));
    }

    @Test
    @WithMockUser
    void toggleAssistida_ShouldReturn200() throws Exception {
        UUID id = UUID.randomUUID();
        LessonResponse response = new LessonResponse(id, "CIRURGIA", "Geral", "Trauma", LessonPriority.ALTA, true, LocalDate.now(), 0, false, false);

        when(service.toggleAssistida(id)).thenReturn(response);

        mockMvc.perform(patch("/api/lessons/{id}/toggle-assistida", id)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.aulaAssistida").value(true));
    }

}
