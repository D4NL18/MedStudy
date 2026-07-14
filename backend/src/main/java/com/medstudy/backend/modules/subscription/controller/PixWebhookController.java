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

    public PixWebhookController(PixPaymentService pixPaymentService) {
        this.pixPaymentService = pixPaymentService;
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
}
