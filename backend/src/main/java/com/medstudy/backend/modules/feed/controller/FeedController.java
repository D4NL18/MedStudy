package com.medstudy.backend.modules.feed.controller;

import com.medstudy.backend.modules.feed.domain.FeedEvent;
import com.medstudy.backend.modules.feed.domain.FeedInteraction;
import com.medstudy.backend.modules.feed.domain.InteractionType;
import com.medstudy.backend.modules.feed.repository.FeedEventRepository;
import com.medstudy.backend.modules.feed.repository.FeedInteractionRepository;
import com.medstudy.backend.modules.feed.sse.SseConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedEventRepository feedEventRepository;
    private final FeedInteractionRepository feedInteractionRepository;
    private final SseConnectionService sseConnectionService;

    @GetMapping
    public ResponseEntity<Page<FeedEvent>> getFeed(
            @RequestParam Long currentUserId, // Normally from SecurityContext
            Pageable pageable) {
        // PoC: Just finding all for this example. In real code, pass friend IDs.
        Page<FeedEvent> feed = feedEventRepository.findByUserIdInOrderByCreatedAtDesc(List.of(currentUserId), pageable);
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/stream")
    public SseEmitter streamFeed(@RequestParam Long userId) { // Normally from SecurityContext
        return sseConnectionService.createConnection(userId);
    }

    @PostMapping("/{eventId}/interact")
    public ResponseEntity<?> interact(
            @PathVariable Long eventId,
            @RequestParam Long userId,
            @RequestParam InteractionType type) {
        
        FeedInteraction interaction = new FeedInteraction();
        interaction.setFeedEventId(eventId);
        interaction.setFriendUserId(userId);
        interaction.setInteractionType(type);

        try {
            feedInteractionRepository.save(interaction);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("User already interacted with this event.");
        }
    }

    @GetMapping("/test-trigger")
    public ResponseEntity<?> triggerTestEvent(@RequestParam Long userId) {
        FeedEvent event = new FeedEvent();
        event.setUserId(userId);
        event.setType(com.medstudy.backend.modules.feed.domain.FeedEventType.BADGE_EARNED);
        event.setMetadata("{\"badgeName\": \"Mestre dos Testes\", \"description\": \"Ativado via SSE para teste!\"}");
        
        FeedEvent saved = feedEventRepository.save(event);
        sseConnectionService.sendEventToUser(userId, saved); // Send to self for test
        return ResponseEntity.ok(saved);
    }
}
