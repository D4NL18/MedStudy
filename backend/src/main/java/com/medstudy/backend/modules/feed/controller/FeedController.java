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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller responsible for managing user feeds, including retrieving the feed,
 * interacting with feed events, and establishing Server-Sent Events (SSE) connections.
 */
@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
@Tag(name = "Feed", description = "Feed management endpoints")
public class FeedController {

    private final FeedEventRepository feedEventRepository;
    private final FeedInteractionRepository feedInteractionRepository;
    private final SseConnectionService sseConnectionService;

    /**
     * Retrieves a paginated feed of events for the current user.
     *
     * @param currentUserId the ID of the user requesting the feed
     * @param pageable      pagination information
     * @return a paginated list of feed events
     */
    @GetMapping
    @Operation(summary = "Get feed", description = "Retrieves a paginated feed of events for the current user.")
    @ApiResponse(responseCode = "200", description = "Feed retrieved successfully")
    public ResponseEntity<Page<FeedEvent>> getFeed(
            @RequestParam Long currentUserId,
            Pageable pageable) {
        Page<FeedEvent> feed = feedEventRepository.findByUserIdInOrderByCreatedAtDesc(List.of(currentUserId), pageable);
        return ResponseEntity.ok(feed);
    }

    /**
     * Creates a Server-Sent Events (SSE) connection to stream feed events in real-time.
     *
     * @param userId the ID of the user subscribing to the feed stream
     * @return an SseEmitter for real-time events
     */
    @GetMapping("/stream")
    @Operation(summary = "Stream feed", description = "Creates a Server-Sent Events (SSE) connection to stream feed events in real-time.")
    @ApiResponse(responseCode = "200", description = "Connection established successfully")
    public SseEmitter streamFeed(@RequestParam Long userId) {
        return sseConnectionService.createConnection(userId);
    }

    /**
     * Records a user interaction on a specific feed event.
     *
     * @param eventId the ID of the feed event
     * @param userId  the ID of the user interacting
     * @param type    the type of interaction
     * @return a response indicating success or a bad request if already interacted
     */
    @PostMapping("/{eventId}/interact")
    @Operation(summary = "Interact with a feed event", description = "Records a user interaction (e.g., like, comment) on a specific feed event.")
    @ApiResponse(responseCode = "200", description = "Interaction recorded successfully")
    @ApiResponse(responseCode = "400", description = "User already interacted with this event")
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

    /**
     * Triggers a test event and sends it via SSE to the user for testing purposes.
     *
     * @param userId the ID of the user to send the test event to
     * @return the saved test event
     */
    @GetMapping("/test-trigger")
    @Operation(summary = "Trigger test event", description = "Triggers a test event and sends it via SSE to the user for testing purposes.")
    @ApiResponse(responseCode = "200", description = "Test event triggered successfully")
    public ResponseEntity<?> triggerTestEvent(@RequestParam Long userId) {
        FeedEvent event = new FeedEvent();
        event.setUserId(userId);
        event.setType(com.medstudy.backend.modules.feed.domain.FeedEventType.BADGE_EARNED);
        event.setMetadata("{\"badgeName\": \"Mestre dos Testes\", \"description\": \"Ativado via SSE para teste!\"}");
        
        FeedEvent saved = feedEventRepository.save(event);
        sseConnectionService.sendEventToUser(userId, saved);
        return ResponseEntity.ok(saved);
    }
}
