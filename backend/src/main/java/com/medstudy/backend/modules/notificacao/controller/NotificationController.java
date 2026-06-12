package com.medstudy.backend.modules.notificacao.controller;

import com.medstudy.backend.modules.notificacao.dto.NotificationSummaryResponse;
import com.medstudy.backend.modules.notificacao.dto.SocialNotificationResponseDTO;
import com.medstudy.backend.modules.notificacao.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for handling notification related requests.
 */
@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Endpoints for managing user notifications")
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Constructs a new NotificationController.
     *
     * @param notificationService the notification service
     */
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Retrieves a summary of all notifications for the authenticated user.
     *
     * @return the notification summary response
     */
    @GetMapping("/summary")
    @Operation(summary = "Get notification summary", description = "Retrieves a summary of notifications including pending revisions, reinforcement lessons, and social alerts for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Summary retrieved successfully")
    public NotificationSummaryResponse getSummary() {
        return notificationService.getSummary();
    }

    /**
     * Retrieves a list of social notifications for the authenticated user.
     *
     * @return a list of social notification response DTOs
     */
    @GetMapping("/social")
    @Operation(summary = "Get social notifications", description = "Retrieves a list of social notifications for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully")
    public List<SocialNotificationResponseDTO> getSocialNotifications() {
        return notificationService.getSocialNotifications();
    }

    /**
     * Marks a specific social notification as read.
     *
     * @param id the ID of the notification to mark as read
     */
    @PostMapping("/social/{id}/read")
    @Operation(summary = "Mark notification as read", description = "Marks a specific social notification as read.")
    @ApiResponse(responseCode = "200", description = "Notification marked as read")
    public void markAsRead(@PathVariable UUID id) {
        notificationService.markAsRead(id);
    }

    /**
     * Marks all social notifications as read for the authenticated user.
     */
    @PostMapping("/social/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Marks all social notifications as read for the authenticated user.")
    @ApiResponse(responseCode = "200", description = "All notifications marked as read")
    public void markAllAsRead() {
        notificationService.markAllAsRead();
    }
}
