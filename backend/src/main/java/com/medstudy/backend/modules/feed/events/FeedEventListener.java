package com.medstudy.backend.modules.feed.events;

import com.medstudy.backend.modules.feed.domain.FeedEvent;
import com.medstudy.backend.modules.feed.domain.FeedEventType;
import com.medstudy.backend.modules.feed.repository.FeedEventRepository;
import com.medstudy.backend.modules.feed.sse.SseConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FeedEventListener {

    private final FeedEventRepository feedEventRepository;
    private final SseConnectionService sseConnectionService;

    public static class BadgeEarnedEvent {
        public Long userId;
        public String badgeEnumId;
        public String badgeDisplayName;
        public String badgeDescription;

        public BadgeEarnedEvent(Long userId, String badgeEnumId, String badgeDisplayName, String badgeDescription) {
            this.userId = userId;
            this.badgeEnumId = badgeEnumId;
            this.badgeDisplayName = badgeDisplayName;
            this.badgeDescription = badgeDescription;
        }
    }

    @Async
    @EventListener
    public void handleBadgeEarnedEvent(BadgeEarnedEvent event) {
        FeedEvent feedEvent = new FeedEvent();
        feedEvent.setUserId(event.userId);
        feedEvent.setType(FeedEventType.BADGE_EARNED);
        // Save metadata as a clean JSON
        String metadata = String.format("{\"badgeId\":\"%s\", \"badgeName\":\"%s\", \"description\":\"%s\"}", 
            event.badgeEnumId, event.badgeDisplayName, event.badgeDescription);
        feedEvent.setMetadata(metadata);
        
        feedEventRepository.save(feedEvent);

        // Notify friends via SSE
        sseConnectionService.sendEventToUser(event.userId, feedEvent);
    }
}
