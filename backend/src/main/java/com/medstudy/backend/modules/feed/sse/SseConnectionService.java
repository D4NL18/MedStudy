package com.medstudy.backend.modules.feed.sse;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service that manages Server-Sent Events (SSE) connections for real-time feed updates.
 * <p>
 * Maintains a map of active {@link SseEmitter} instances keyed by user ID.
 * Connections are automatically cleaned up on completion, timeout, or error.
 * </p>
 */
@Service
public class SseConnectionService {

    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     * Creates a new SSE connection for the specified user with a 30-minute timeout.
     *
     * @param userId the ID of the user opening the connection
     * @return the configured {@link SseEmitter} for this connection
     */
    public SseEmitter createConnection(Long userId) {
        // Timeout set to 30 minutes
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError((e) -> emitters.remove(userId));

        return emitter;
    }

    /**
     * Sends a server-sent event to the specified user's active SSE connection.
     * <p>
     * If the user has no active connection or sending fails, the emitter is removed silently.
     * </p>
     *
     * @param userId    the ID of the target user
     * @param eventData the data payload to send in the {@code feed_event} SSE event
     */
    public void sendEventToUser(Long userId, Object eventData) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("feed_event").data(eventData));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }
}
