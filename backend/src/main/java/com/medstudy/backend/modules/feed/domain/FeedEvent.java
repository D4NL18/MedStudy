package com.medstudy.backend.modules.feed.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_events", indexes = {
    @Index(name = "idx_feed_event_created_at", columnList = "createdAt"),
    @Index(name = "idx_feed_event_user_id", columnList = "userId")
})
@Data
@NoArgsConstructor
public class FeedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedEventType type;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON for additional info like badge name

}
