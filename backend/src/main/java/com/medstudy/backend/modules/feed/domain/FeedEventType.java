package com.medstudy.backend.modules.feed.domain;

/**
 * Defines the possible types of events that can appear in a user's feed.
 */
public enum FeedEventType {
    /**
     * Event triggered when a user earns a badge.
     */
    BADGE_EARNED,

    /**
     * Event triggered when a user reaches a streak record.
     */
    STREAK_RECORD
}
