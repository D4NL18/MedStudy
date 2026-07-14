package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.subscription.service.PixPaymentService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions/dev")
@Profile("mock-pix")
public class DevPixController {

    private final PixPaymentService pixPaymentService;

    public DevPixController(PixPaymentService pixPaymentService) {
        this.pixPaymentService = pixPaymentService;
    }

    @PostMapping("/simulate-pix-paid/{txid}")
    public ResponseEntity<PixStatusResponseDto> simulatePixPaid(@PathVariable String txid) {
        String mockE2eId = "E00000000" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4);
        Instant paidAt = Instant.now();

        boolean success = pixPaymentService.processPaymentSuccess(txid, mockE2eId, paidAt);

        if (!success) {
            return ResponseEntity.badRequest().body(
                new PixStatusResponseDto(txid, PixStatus.CANCELLED, null, "Transação PIX simulada não foi encontrada")
            );
        }

        return ResponseEntity.ok(
            new PixStatusResponseDto(txid, PixStatus.PAID, paidAt, "Pagamento PIX simulado com sucesso via dev endpoint")
        );
    }
}
