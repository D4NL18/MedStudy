package com.medstudy.backend.modules.subscription.controller;

import com.medstudy.backend.modules.subscription.domain.PixStatus;
import com.medstudy.backend.modules.subscription.domain.SubscriptionStatus;
import com.medstudy.backend.modules.subscription.dto.AdminOverrideRequestDto;
import com.medstudy.backend.modules.subscription.dto.AdminPixTransactionDto;
import com.medstudy.backend.modules.subscription.dto.AdminSubscriptionStatsDto;
import com.medstudy.backend.modules.subscription.dto.AdminUserSubscriptionDto;
import com.medstudy.backend.modules.subscription.service.AdminSubscriptionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/subscriptions")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubscriptionController {

    private final AdminSubscriptionService adminSubscriptionService;

    public AdminSubscriptionController(AdminSubscriptionService adminSubscriptionService) {
        this.adminSubscriptionService = adminSubscriptionService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminSubscriptionStatsDto> getStats() {
        return ResponseEntity.ok(adminSubscriptionService.getStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserSubscriptionDto>> listUserSubscriptions(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) SubscriptionStatus status,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(adminSubscriptionService.listUserSubscriptions(search, status, pageable));
    }

    @PostMapping("/users/{userId}/override")
    public ResponseEntity<AdminUserSubscriptionDto> overrideUserSubscription(
        @PathVariable UUID userId,
        @RequestBody AdminOverrideRequestDto request
    ) {
        return ResponseEntity.ok(adminSubscriptionService.overrideUserSubscription(userId, request));
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<AdminPixTransactionDto>> listPixTransactions(
        @RequestParam(required = false) PixStatus status,
        @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(adminSubscriptionService.listPixTransactions(status, pageable));
    }
}
