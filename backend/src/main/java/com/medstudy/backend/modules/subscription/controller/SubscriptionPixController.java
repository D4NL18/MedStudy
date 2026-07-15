package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.dto.PixResponseDto;
import com.medstudy.backend.modules.subscription.dto.PixStatusResponseDto;
import com.medstudy.backend.modules.subscription.service.PixPaymentService;
import com.medstudy.backend.modules.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions/pix")
public class SubscriptionPixController {

    private final PixPaymentService pixPaymentService;

    public SubscriptionPixController(PixPaymentService pixPaymentService) {
        this.pixPaymentService = pixPaymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<PixResponseDto> createPixCharge(@AuthenticationPrincipal User user) {
        PixResponseDto response = pixPaymentService.generatePixCharge(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{txid}/status")
    public ResponseEntity<PixStatusResponseDto> getPixStatus(@PathVariable String txid) {
        PixStatusResponseDto statusResponse = pixPaymentService.checkAndRefreshPaymentStatus(txid);
        return ResponseEntity.ok(statusResponse);
    }
}
