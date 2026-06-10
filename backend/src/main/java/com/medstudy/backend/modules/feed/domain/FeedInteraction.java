package com.medstudy.backend.modules.feed.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feed_interactions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"feedEventId", "friendUserId"})
})
@Data
@NoArgsConstructor
public class FeedInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long feedEventId;

    @Column(nullable = false)
    private Long friendUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType interactionType;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

}
