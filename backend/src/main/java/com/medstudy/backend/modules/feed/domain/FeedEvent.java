package com.medstudy.backend.modules.feed.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Represents an event in the user's feed.
 */
@Entity
@Table(name = "feed_events", indexes = {
    @Index(name = "idx_feed_event_created_at", columnList = "createdAt"),
    @Index(name = "idx_feed_event_user_id", columnList = "userId")
})
@Data
@NoArgsConstructor
public class FeedEvent {

    /**
     * Unique identifier for the feed event.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The ID of the user associated with this event.
     */
    @Column(nullable = false)
    private Long userId;

    /**
     * The type of the feed event.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedEventType type;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Additional metadata for the event, typically stored as a JSON string.
     */    @Column(columnDefinition = "TEXT")
    private String metadata;

}
