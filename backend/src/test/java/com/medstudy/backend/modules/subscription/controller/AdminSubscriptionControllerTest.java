package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.dto.AdminSubscriptionStatsDto;
import com.medstudy.backend.modules.subscription.service.AdminSubscriptionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminSubscriptionControllerTest {

    @Mock
    private AdminSubscriptionService adminSubscriptionService;

    @InjectMocks
    private AdminSubscriptionController adminSubscriptionController;

    @Test
    @DisplayName("Deve retornar estatísticas agregadas do painel admin com sucesso")
    void getStats_ShouldReturn200AndStatsDto() {
        AdminSubscriptionStatsDto mockStats = new AdminSubscriptionStatsDto(10L, 5L, 2L, 1L, new BigDecimal("2970.00"));
        when(adminSubscriptionService.getStats()).thenReturn(mockStats);

        ResponseEntity<AdminSubscriptionStatsDto> response = adminSubscriptionController.getStats();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(10L, response.getBody().activeCount());
    }
}
