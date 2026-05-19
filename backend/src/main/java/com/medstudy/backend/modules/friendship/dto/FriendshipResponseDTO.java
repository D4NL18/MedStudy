package com.medstudy.backend.modules.friendship.dto;

import com.medstudy.backend.modules.friendship.entity.FriendshipStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record FriendshipResponseDTO(
    UUID id,
    UUID requesterId,
    UUID receiverId,
    FriendshipStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
