package com.medstudy.backend.modules.friendship.entity;

/**
 * Enum representing the status of a friendship relationship.
 */
public enum FriendshipStatus {
    /**
     * The friendship request is pending.
     */
    PENDING,

    /**
     * The friendship request has been accepted.
     */
    ACCEPTED,

    /**
     * The user has been blocked.
     */
    BLOCKED
}
