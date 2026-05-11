package com.medstudy.backend.modules.revision.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medstudy.backend.core.security.JwtService;
import com.medstudy.backend.modules.revision.dto.RevisionSummaryResponse;
import com.medstudy.backend.modules.revision.service.RevisionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RevisionController.class)
@org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc(addFilters = true)
class RevisionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RevisionService service;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    @WithMockUser
    void getSummary_ShouldReturn200() throws Exception {
        RevisionSummaryResponse response = new RevisionSummaryResponse(1, 2, 3, 4);

        when(service.getSummary()).thenReturn(response);

        mockMvc.perform(get("/api/revisoes/resumo")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.atrasadas").value(1))

                .andExpect(jsonPath("$.hoje").value(2));
    }
}
