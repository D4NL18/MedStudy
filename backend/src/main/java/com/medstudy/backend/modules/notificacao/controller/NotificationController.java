package com.medstudy.backend.modules.notificacao.controller;

import com.medstudy.backend.modules.notificacao.dto.NotificationSummaryResponse;
import com.medstudy.backend.modules.notificacao.dto.SocialNotificationResponseDTO;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    @GetMapping("/social")
    public List<SocialNotificationResponseDTO> getSocialNotifications() {
        return notificationService.getSocialNotifications();
    }

    @PostMapping("/social/{id}/read")
    public void markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/social/read-all")
    public void markAllAsRead() {
        notificationService.markAllAsRead();
    }
}
