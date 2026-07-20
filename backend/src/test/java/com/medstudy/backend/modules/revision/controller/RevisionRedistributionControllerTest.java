package com.medstudy.backend.modules.revision.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.medstudy.backend.core.security.JwtAuthenticationFilter;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewRequest;
import com.medstudy.backend.modules.revision.dto.RedistributionPreviewResponse;
import com.medstudy.backend.modules.revision.service.RevisionRedistributionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = RevisionRedistributionController.class, excludeFilters = {
        @org.springframework.context.annotation.ComponentScan.Filter(
                type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
                classes = JwtAuthenticationFilter.class)
})
class RevisionRedistributionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @MockitoBean
    private RevisionRedistributionService service;



    @Test
    void preview_ShouldReturn200() throws Exception {
        RedistributionPreviewRequest request = new RedistributionPreviewRequest();
        request.setTargetEndDate(LocalDate.now().plusDays(10));

        UUID draftId = UUID.randomUUID();
        RedistributionPreviewResponse response = RedistributionPreviewResponse.builder()
                .draftId(draftId)
                .warningLimitExceeded(false)
                .totalRevisionsRedistributed(20)
                .daysSpread(10)
                .build();

        when(service.generatePreview(any())).thenReturn(response);

        mockMvc.perform(post("/api/redistribute/preview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.draftId").value(draftId.toString()))
                .andExpect(jsonPath("$.warningLimitExceeded").value(false));
    }

    @Test
    void apply_ShouldReturn200() throws Exception {
        UUID draftId = UUID.randomUUID();

        doNothing().when(service).applyDraft(draftId);

        mockMvc.perform(post("/api/redistribute/apply/" + draftId))
                .andExpect(status().isOk());
    }
}
