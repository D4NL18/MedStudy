package com.medstudy.backend.modules.notificacao.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record SocialNotificationResponseDTO(
    UUID id,
    UUID userId,
    UUID senderId,
    String senderName,
    String senderAvatarPresetId,
    String type,
    String message,
    Boolean isRead,
    LocalDateTime createdAt
) {}
