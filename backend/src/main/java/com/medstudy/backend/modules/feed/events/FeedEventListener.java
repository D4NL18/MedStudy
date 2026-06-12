package com.medstudy.backend.modules.feed.events;

import com.medstudy.backend.modules.feed.domain.FeedEvent;
import com.medstudy.backend.modules.feed.domain.FeedEventType;
import com.medstudy.backend.modules.feed.repository.FeedEventRepository;
import com.medstudy.backend.modules.feed.sse.SseConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Listener responsible for handling domain events and creating corresponding feed events.
 */
@Component
@RequiredArgsConstructor
public class FeedEventListener {

    private final FeedEventRepository feedEventRepository;
    private final SseConnectionService sseConnectionService;

    /**
     * Event triggered when a user earns a badge.
     */
    public static class BadgeEarnedEvent {
        public Long userId;
        public String badgeEnumId;
        public String badgeDisplayName;
        public String badgeDescription;

        /**
         * Constructs a new BadgeEarnedEvent.
         *
         * @param userId           the ID of the user who earned the badge
         * @param badgeEnumId      the unique identifier of the badge
         * @param badgeDisplayName the display name of the badge
         * @param badgeDescription the description of the badge
         */
        public BadgeEarnedEvent(Long userId, String badgeEnumId, String badgeDisplayName, String badgeDescription) {
            this.userId = userId;
            this.badgeEnumId = badgeEnumId;
            this.badgeDisplayName = badgeDisplayName;
            this.badgeDescription = badgeDescription;
        }
    }

    /**
     * Handles the event of a user earning a badge, persisting it to the feed repository,
     * and pushing it via SSE.
     *
     * @param event the event detailing the badge earned
     */
    @Async
    @EventListener
    public void handleBadgeEarnedEvent(BadgeEarnedEvent event) {
        FeedEvent feedEvent = new FeedEvent();
        feedEvent.setUserId(event.userId);
        feedEvent.setType(FeedEventType.BADGE_EARNED);
        String metadata = String.format("{\"badgeId\":\"%s\", \"badgeName\":\"%s\", \"description\":\"%s\"}", 
            event.badgeEnumId, event.badgeDisplayName, event.badgeDescription);
        feedEvent.setMetadata(metadata);
        
        feedEventRepository.save(feedEvent);

        sseConnectionService.sendEventToUser(event.userId, feedEvent);
    }
}
