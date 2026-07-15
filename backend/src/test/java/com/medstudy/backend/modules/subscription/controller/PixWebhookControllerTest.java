package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.dto.BbWebhookPayloadDto;
import com.medstudy.backend.modules.subscription.service.PixPaymentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

@ExtendWith(MockitoExtension.class)
class PixWebhookControllerTest {

    @Mock
    private PixPaymentService pixPaymentService;

    @InjectMocks
    private PixWebhookController pixWebhookController;

    @Test
    @DisplayName("Deve receber payload de webhook e invocar processamento de pagamento")
    void receiveBbWebhook_ShouldCallPaymentService() {
        BbWebhookPayloadDto.PixItem item = new BbWebhookPayloadDto.PixItem(
            "E123456",
            "MEDSTUDY123",
            new BigDecimal("297.00"),
            "2026-07-14T19:54:00.000Z"
        );
        BbWebhookPayloadDto payload = new BbWebhookPayloadDto(List.of(item));

        ResponseEntity<Void> response = pixWebhookController.receiveBbWebhook(payload);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Mockito.verify(pixPaymentService).processPaymentSuccess(eq("MEDSTUDY123"), eq("E123456"), any());
    }
}
