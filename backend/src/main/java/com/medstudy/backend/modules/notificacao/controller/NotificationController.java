package com.medstudy.backend.modules.notificacao.controller;

import com.medstudy.backend.modules.notificacao.dto.NotificationSummaryResponse;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/summary")
    public NotificationSummaryResponse getSummary() {
        return notificationService.getSummary();
    }
}
