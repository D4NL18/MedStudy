package com.medstudy.backend.modules.feed.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Represents a user's interaction with a feed event (e.g., liking a badge earned by a friend).
 */
@Entity
@Table(name = "feed_interactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"feedEventId", "friendUserId"})
})
@Data
@NoArgsConstructor
public class FeedInteraction {

    /**
     * Unique identifier for the feed interaction.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The ID of the feed event being interacted with.
     */
    @Column(nullable = false)
    private Long feedEventId;

    /**
     * The ID of the friend or user performing the interaction.
     */
    @Column(nullable = false)
    private Long friendUserId;

    /**
     * The type of interaction performed.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType interactionType;

    /**
     * The timestamp when the interaction was created.
     */
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
