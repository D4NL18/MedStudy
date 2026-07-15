package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.dto.BbWebhookPayloadDto;
import com.medstudy.backend.modules.subscription.service.PixPaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/webhooks/pix")
public class PixWebhookController {

    private final PixPaymentService pixPaymentService;
    private final com.medstudy.backend.modules.subscription.client.PixClient pixClient;

    public PixWebhookController(
        PixPaymentService pixPaymentService, 
        com.medstudy.backend.modules.subscription.client.PixClient pixClient
    ) {
        this.pixPaymentService = pixPaymentService;
        this.pixClient = pixClient;
    }

    @PostMapping("/bb")
    public ResponseEntity<Void> receiveBbWebhook(@RequestBody BbWebhookPayloadDto payload) {
        if (payload != null && payload.pix() != null) {
            for (BbWebhookPayloadDto.PixItem item : payload.pix()) {
                if (item.txid() != null && !item.txid().isBlank()) {
                    pixPaymentService.processPaymentSuccess(
                        item.txid(),
                        item.endToEndId(),
                        Instant.now()
                    );
                }
            }
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mercadopago")
    public ResponseEntity<Void> receiveMpWebhook(@RequestBody com.medstudy.backend.modules.subscription.dto.MpWebhookPayloadDto payload) {
        if (payload != null && payload.data() != null && payload.data().id() != null) {
            String txid = payload.data().id();
            try {
                com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto statusResponse = pixClient.getChargeStatus(txid);
                if (statusResponse.status() == com.medstudy.backend.modules.subscription.domain.PixStatus.PAID) {
                    pixPaymentService.processPaymentSuccess(
                        txid,
                        null,
                        statusResponse.paidAt() != null ? statusResponse.paidAt() : Instant.now()
                    );
                }
            } catch (Exception e) {
                // Log and ignore to prevent MP from retrying indefinitely if the issue is on our side or the ID is invalid
                System.err.println("Error processing MP Webhook: " + e.getMessage());
            }
        }
        return ResponseEntity.ok().build();
    }
}
